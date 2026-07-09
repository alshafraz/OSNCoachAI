// src/application/adaptive-learning/services/LearningSessionPlanner.ts
import { paleConfig, PaleDifficulty } from '../config/paleConfig';
import { LearningSession, SessionPhase, SessionItem } from '../domain/models/LearningSession';
import { ReviewSchedule } from '../domain/models/ReviewSchedule';
import { QuestionSelectionService, QuestionCandidate } from './QuestionSelectionService';
import { PaceEngine } from './PaceEngine';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * LearningSessionPlanner assembles a structured learning session from:
 *  - Current active topic and difficulty
 *  - Due review items from ReviewScheduler
 *  - Question selection from QuestionSelectionService
 *  - Pace recommendation from PaceEngine
 *  - Applied adaptation decisions
 */
export class LearningSessionPlanner {
  private readonly logger = new Logger('LearningSessionPlanner');
  private readonly questionSelector = new QuestionSelectionService();
  private readonly paceEngine = new PaceEngine();
  private readonly cfg = paleConfig.session;

  /**
   * Build a structured learning session for a student.
   */
  async buildSession(
    studentId: string,
    context: {
      activeTopicId: string;
      targetDifficulty: PaleDifficulty;
      topicPriorities: Record<string, number>;
      retentionScores: Record<string, number>;
      dueReviews: ReviewSchedule[];
      questionPool: QuestionCandidate[];
      recentlyAttemptedIds: string[];
      appliedDecisionIds: string[];
      paceEvidence?: {
        sessionDurationMinutes: number;
        sessionAccuracyStart: number;
        sessionAccuracyEnd: number;
        hoursSinceLastBreak: number;
        consecutiveErrors: number;
      };
      aiTutorTopicId?: string;
    }
  ): Promise<LearningSession> {
    // Evaluate pace
    const paceResult = context.paceEvidence
      ? this.paceEngine.evaluate(context.paceEvidence)
      : { recommendation: 'CONTINUE' as const, reasoning: 'No pace evidence provided.' };

    const recentSet = new Set(context.recentlyAttemptedIds);
    const phases: SessionPhase[] = [];

    // ─── WARM-UP ────────────────────────────────────────────────────────────────
    const warmUpCandidates = context.questionPool.filter(q => q.difficulty === 'EASY');
    const warmUpSelected = this.questionSelector.selectQuestions(
      warmUpCandidates,
      { targetTopicId: context.activeTopicId, topicPriorities: context.topicPriorities, targetDifficulty: 'EASY', retentionScores: context.retentionScores, recentlyAttemptedIds: recentSet },
      this.cfg.warmUpCount
    );
    phases.push({
      type: 'WARM_UP',
      label: 'Warm-Up',
      durationMinutes: 5,
      items: warmUpSelected.map(q => this.toItem(q, false)),
    });

    // ─── CORE PRACTICE ──────────────────────────────────────────────────────────
    const coreCandidates = context.questionPool.filter(q => q.topicId === context.activeTopicId);
    const coreSelected = this.questionSelector.selectQuestions(
      coreCandidates,
      { targetTopicId: context.activeTopicId, topicPriorities: context.topicPriorities, targetDifficulty: context.targetDifficulty, retentionScores: context.retentionScores, recentlyAttemptedIds: recentSet },
      this.cfg.coreQuestionCount
    );
    phases.push({
      type: 'CORE_PRACTICE',
      label: 'Core Practice',
      durationMinutes: 20,
      items: coreSelected.map(q => this.toItem(q, false)),
    });

    // ─── CHALLENGE ──────────────────────────────────────────────────────────────
    const challengeCandidates = context.questionPool.filter(q =>
      ['HARD', 'OLYMPIAD'].includes(q.difficulty)
    );
    const challengeSelected = this.questionSelector.selectQuestions(
      challengeCandidates,
      { targetTopicId: context.activeTopicId, topicPriorities: context.topicPriorities, targetDifficulty: 'HARD', retentionScores: context.retentionScores, recentlyAttemptedIds: recentSet },
      this.cfg.challengeCount
    );
    if (challengeSelected.length > 0) {
      phases.push({
        type: 'CHALLENGE',
        label: 'Challenge Questions',
        durationMinutes: 10,
        items: challengeSelected.map(q => this.toItem(q, false)),
      });
    }

    // ─── REVIEW ─────────────────────────────────────────────────────────────────
    const reviewItems = context.dueReviews
      .slice(0, this.cfg.reviewCount)
      .map(r => ({
        type: 'REVIEW_QUESTION' as const,
        topicId: r.topicId,
        difficulty: context.targetDifficulty,
        isReview: true,
      }));

    if (reviewItems.length > 0) {
      phases.push({
        type: 'REVIEW',
        label: 'Spaced Review',
        durationMinutes: 8,
        items: reviewItems,
      });
    }

    // ─── AI TUTOR ────────────────────────────────────────────────────────────────
    if (context.aiTutorTopicId) {
      phases.push({
        type: 'AI_TUTOR',
        label: 'AI Tutor Session',
        durationMinutes: 10,
        items: [{
          type: 'AI_TUTOR_TOPIC',
          topicId: context.aiTutorTopicId,
          prompt: `Review the key concepts and common misconceptions in "${context.aiTutorTopicId}" with your AI Tutor.`,
        }],
      });
    }

    // ─── REFLECTION ─────────────────────────────────────────────────────────────
    phases.push({
      type: 'REFLECTION',
      label: 'Reflection',
      durationMinutes: 2,
      items: [{
        type: 'REFLECTION_PROMPT',
        topicId: context.activeTopicId,
        prompt: 'What was the hardest concept today? What strategy will you try next time?',
      }],
    });

    const totalMinutes = phases.reduce((sum, p) => sum + p.durationMinutes, 0);

    const session: LearningSession = {
      id: uuidv4(),
      studentId,
      scheduledDate: new Date(),
      estimatedDurationMinutes: totalMinutes,
      paceRecommendation: paceResult.recommendation,
      phases,
      appliedDecisionIds: context.appliedDecisionIds,
      createdAt: new Date(),
    };

    this.logger.info('Session built', {
      studentId,
      phases: phases.map(p => p.type),
      totalMinutes,
      pace: paceResult.recommendation,
    });

    return session;
  }

  private toItem(q: QuestionCandidate, isReview: boolean): SessionItem {
    return {
      type: isReview ? 'REVIEW_QUESTION' : 'QUESTION',
      topicId: q.topicId,
      difficulty: q.difficulty,
      questionId: q.questionId,
      isReview,
    };
  }
}
