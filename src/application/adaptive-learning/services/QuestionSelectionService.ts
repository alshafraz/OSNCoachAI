// src/application/adaptive-learning/services/QuestionSelectionService.ts
import { paleConfig, PaleDifficulty } from '../config/paleConfig';
import { Logger } from '@/infra/logger';

export interface QuestionCandidate {
  questionId: string;
  topicId: string;
  difficulty: PaleDifficulty;
  expectedSolveMinutes: number;
  lastAttemptedAt?: Date;
  previouslyCorrect?: boolean;
}

export interface ScoredQuestion extends QuestionCandidate {
  selectionScore: number;
  scoreBreakdown: Record<string, number>;
}

/**
 * QuestionSelectionService selects the best questions for a session slot
 * using a multi-signal weighted scoring formula.
 *
 * Formula:
 *   score = (topicPriority × 0.30) + (difficultyMatch × 0.25) + (diversityBonus × 0.15)
 *         + (retentionGap × 0.15) + (solveTimeBonus × 0.10) + (recencyPenalty × 0.05)
 */
export class QuestionSelectionService {
  private readonly logger = new Logger('QuestionSelectionService');
  private readonly cfg = paleConfig.questionSelection;

  /**
   * Score and rank a pool of candidates for a specific student context.
   */
  selectQuestions(
    candidates: QuestionCandidate[],
    context: {
      targetTopicId: string;
      topicPriorities: Record<string, number>;    // topicId → 0-1
      targetDifficulty: PaleDifficulty;
      retentionScores: Record<string, number>;    // topicId → 0-1
      recentlyAttemptedIds: Set<string>;          // questionIds attempted in last N days
    },
    maxCount: number = this.cfg.maxQuestionsPerSlot
  ): ScoredQuestion[] {
    const difficultyOrder: PaleDifficulty[] = ['EASY', 'MEDIUM', 'HARD', 'OLYMPIAD'];
    const targetDiffIdx = difficultyOrder.indexOf(context.targetDifficulty);

    const scored: ScoredQuestion[] = candidates.map(q => {
      const topicPriority = context.topicPriorities[q.topicId] ?? 0.5;

      // Difficulty match: 1.0 = exact, decreases as distance grows
      const diffIdx = difficultyOrder.indexOf(q.difficulty);
      const diffDistance = Math.abs(diffIdx - targetDiffIdx);
      const difficultyMatch = Math.max(0, 1 - diffDistance * 0.33);

      // Diversity: penalise if question was recently attempted
      const diversityBonus = context.recentlyAttemptedIds.has(q.questionId) ? 0 : 1;

      // Retention gap: prefer topics with lower retention (needs more practice)
      const retention = context.retentionScores[q.topicId] ?? 0.5;
      const retentionGap = 1 - retention;

      // Solve time: prefer questions close to session budget (not too long)
      const solveTimeBonus = q.expectedSolveMinutes <= 5 ? 1.0 : Math.max(0, 1 - (q.expectedSolveMinutes - 5) / 10);

      // Recency penalty: questions not attempted recently get a slight bonus
      const daysSinceAttempt = q.lastAttemptedAt
        ? (Date.now() - q.lastAttemptedAt.getTime()) / (1000 * 60 * 60 * 24)
        : 30;
      const recencyBonus = Math.min(1, daysSinceAttempt / this.cfg.recentExposureWindowDays);

      const selectionScore =
        topicPriority     * this.cfg.topicPriorityWeight +
        difficultyMatch   * this.cfg.difficultyMatchWeight +
        diversityBonus    * this.cfg.diversityBonusWeight +
        retentionGap      * this.cfg.retentionGapWeight +
        solveTimeBonus    * this.cfg.solveTimeBonusWeight +
        recencyBonus      * this.cfg.recencyPenaltyWeight;

      return {
        ...q,
        selectionScore,
        scoreBreakdown: {
          topicPriority: topicPriority * this.cfg.topicPriorityWeight,
          difficultyMatch: difficultyMatch * this.cfg.difficultyMatchWeight,
          diversityBonus: diversityBonus * this.cfg.diversityBonusWeight,
          retentionGap: retentionGap * this.cfg.retentionGapWeight,
          solveTimeBonus: solveTimeBonus * this.cfg.solveTimeBonusWeight,
          recencyBonus: recencyBonus * this.cfg.recencyPenaltyWeight,
        },
      };
    });

    const filtered = scored
      .filter(q => q.selectionScore >= this.cfg.minSelectionScore)
      .sort((a, b) => b.selectionScore - a.selectionScore)
      .slice(0, maxCount);

    this.logger.info('Questions selected', {
      total: candidates.length,
      selected: filtered.length,
      topScore: filtered[0]?.selectionScore?.toFixed(3),
    });

    return filtered;
  }
}
