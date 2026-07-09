// src/application/adaptive-learning/engine/AdaptationOrchestrator.ts
import { AdaptivePlan } from '../domain/models/AdaptivePlan';
import { LearningSession } from '../domain/models/LearningSession';
import { AdaptivePlanRepository } from '../infrastructure/persistence/repositories/AdaptivePlanRepository';
import { DifficultyEngine } from '../services/DifficultyEngine';
import { ReviewScheduler } from '../services/ReviewScheduler';
import { RecoveryEngine } from '../services/RecoveryEngine';
import { ChallengeEngine } from '../services/ChallengeEngine';
import { LearningPathService } from '../services/LearningPathService';
import { LearningSessionPlanner } from '../services/LearningSessionPlanner';
import { SimulationEngine } from '../services/SimulationEngine';
import { PaceEngine } from '../services/PaceEngine';
import { QuestionCandidate } from '../services/QuestionSelectionService';
import { paleMetrics } from '../monitoring/paleMetrics';
import { PaleDifficulty } from '../config/paleConfig';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * AdaptationInput — all the evidence a caller must provide to run a
 * full adaptation pipeline cycle.
 */
export interface AdaptationInput {
  studentId: string;
  topicId: string;
  targetGrade?: number;
  competitionDate?: Date;
  masteredTopicIds?: string[];
  evidence: {
    recentAccuracy: number;
    hintUsageRate: number;
    solveTimeRatio: number;
    questionsAttempted: number;
    consecutivePoorSessions: number;
    consecutiveStrongSessions: number;
    confidence: number;
    avgSolveTimeRatio: number;
    overallMastery?: number;
    overallRetention?: number;
    topicsMastered?: number;
    totalTopics?: number;
    dailyLearningRate?: number;
    atRiskTopics?: string[];
    onTrackTopics?: string[];
  };
  questionPool?: QuestionCandidate[];
  recentlyAttemptedIds?: string[];
  topicPriorities?: Record<string, number>;
  retentionScores?: Record<string, number>;
  aiTutorTopicId?: string;
}

/**
 * AdaptationOrchestrator runs the complete evidence → decision → plan pipeline.
 *
 * Steps:
 *  1. Evaluate difficulty adjustment (DifficultyEngine)
 *  2. Schedule due reviews (ReviewScheduler)
 *  3. Check for recovery conditions (RecoveryEngine)
 *  4. Check for challenge conditions (ChallengeEngine)
 *  5. Evolve learning path (LearningPathService)
 *  6. Build today's session (LearningSessionPlanner)
 *  7. Persist updated AdaptivePlan
 *
 * PALE Engineering Rule: This orchestrator never calls an LLM.
 * All decisions come from specialised engines with evidence-based rules.
 */
export class AdaptationOrchestrator {
  private readonly logger = new Logger('AdaptationOrchestrator');

  private readonly planRepo = new AdaptivePlanRepository();
  private readonly difficultyEngine = new DifficultyEngine();
  private readonly reviewScheduler = new ReviewScheduler();
  private readonly recoveryEngine = new RecoveryEngine();
  private readonly challengeEngine = new ChallengeEngine();
  private readonly pathService = new LearningPathService();
  private readonly sessionPlanner = new LearningSessionPlanner();
  private readonly paceEngine = new PaceEngine();

  /**
   * Run the full adaptation pipeline and return the updated plan.
   */
  async run(input: AdaptationInput): Promise<AdaptivePlan> {
    const start = Date.now();
    paleMetrics.adaptationRuns.increment();
    this.logger.info('Adaptation pipeline started', { studentId: input.studentId, topicId: input.topicId });

    const appliedDecisionIds: string[] = [];

    // ── STEP 1: Difficulty Adjustment ────────────────────────────────────────────
    const diffDecision = await this.difficultyEngine.adjustDifficulty(
      input.studentId,
      input.topicId,
      {
        recentAccuracy: input.evidence.recentAccuracy,
        hintUsageRate: input.evidence.hintUsageRate,
        solveTimeRatio: input.evidence.solveTimeRatio,
        questionsAttempted: input.evidence.questionsAttempted,
      }
    );
    if (diffDecision) {
      appliedDecisionIds.push(diffDecision.id);
      paleMetrics.difficultyAdjustments.increment();
      this.logger.info('Difficulty decision made', { action: diffDecision.action, topicId: input.topicId });
    }

    // ── STEP 2: Schedule Reviews ─────────────────────────────────────────────────
    const retentionScore = input.retentionScores?.[input.topicId] ?? 0.7;
    if (retentionScore < 0.65) {
      await this.reviewScheduler.scheduleReview(input.studentId, input.topicId, retentionScore);
      paleMetrics.reviewsScheduled.increment();
    }

    // ── STEP 3: Recovery Check ───────────────────────────────────────────────────
    const recoveryPlan = await this.recoveryEngine.generateRecoveryPlan(
      input.studentId,
      input.topicId,
      {
        recentAccuracy: input.evidence.recentAccuracy,
        consecutivePoorSessions: input.evidence.consecutivePoorSessions,
        hintUsageRate: input.evidence.hintUsageRate,
      }
    );
    if (recoveryPlan) {
      paleMetrics.recoveryPlansActivated.increment();
    }

    // ── STEP 4: Challenge Check ──────────────────────────────────────────────────
    const challengePlan = await this.challengeEngine.generateChallengePlan(
      input.studentId,
      input.topicId,
      {
        recentAccuracy: input.evidence.recentAccuracy,
        consecutiveStrongSessions: input.evidence.consecutiveStrongSessions,
        avgSolveTimeRatio: input.evidence.avgSolveTimeRatio,
        confidence: input.evidence.confidence,
      }
    );
    if (challengePlan) {
      paleMetrics.challengePlansActivated.increment();
    }

    // ── STEP 5: Evolve Learning Path ─────────────────────────────────────────────
    const path = await this.pathService.getOrBuildPath(input.studentId, {
      targetGrade: input.targetGrade,
      competitionDate: input.competitionDate,
      masteredTopicIds: input.masteredTopicIds ?? [],
    });

    // ── STEP 6: Compute Current Difficulty for Plan ──────────────────────────────
    const currentDifficulty = await this.difficultyEngine.getCurrentDifficulty(input.studentId, input.topicId);

    // ── STEP 7: Compute Pace ─────────────────────────────────────────────────────
    const paceResult = this.paceEngine.evaluate({
      sessionDurationMinutes: 30,
      sessionAccuracyStart: input.evidence.recentAccuracy + 0.05,
      sessionAccuracyEnd: input.evidence.recentAccuracy,
      hoursSinceLastBreak: 2,
      consecutiveErrors: Math.round((1 - input.evidence.recentAccuracy) * 5),
    });

    // ── STEP 8: Compute Days to Competition ──────────────────────────────────────
    const daysToCompetition = input.competitionDate
      ? Math.max(0, Math.ceil((input.competitionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : undefined;

    // ── STEP 9: Build/Update the AdaptivePlan ────────────────────────────────────
    let planEntity = await this.planRepo.findByStudent(input.studentId);

    const planData: Partial<AdaptivePlan> = {
      studentId: input.studentId,
      learningPathId: path.id,
      currentTopicId: input.topicId,
      activeTopicDifficulties: {
        ...(planEntity?.activeTopicDifficulties as Record<string, PaleDifficulty> ?? {}),
        [input.topicId]: currentDifficulty,
      },
      activeRecoveryPlanIds: recoveryPlan
        ? [...(planEntity?.activeRecoveryPlanIds ?? []), recoveryPlan.id]
        : (planEntity?.activeRecoveryPlanIds ?? []),
      activeChallengePlanIds: challengePlan
        ? [...(planEntity?.activeChallengePlanIds ?? []), challengePlan.id]
        : (planEntity?.activeChallengePlanIds ?? []),
      upcomingReviewTopicIds: path.nodes
        .filter(n => n.status === 'ACTIVE' && n.mastery < 0.7)
        .map(n => n.topicId)
        .slice(0, 5),
      overallReadiness: input.evidence.overallMastery ?? input.evidence.recentAccuracy,
      competitionPrepActive: !!input.competitionDate && (daysToCompetition ?? 999) < 60,
      daysToCompetition,
      currentPaceRecommendation: paceResult.recommendation,
      totalSessionsCompleted: (planEntity?.totalSessionsCompleted ?? 0) + 1,
      lastAdaptedAt: new Date(),
      updatedAt: new Date(),
    };

    if (planEntity) {
      Object.assign(planEntity, planData);
      await this.planRepo.save(planEntity);
    } else {
      const newEntity = this.planRepo.create({
        ...planData,
        id: uuidv4(),
        createdAt: new Date(),
      });
      await this.planRepo.save(newEntity);
      planEntity = newEntity;
    }

    const elapsed = Date.now() - start;
    this.logger.info('Adaptation pipeline complete', { studentId: input.studentId, elapsedMs: elapsed });

    return planEntity as unknown as AdaptivePlan;
  }

  /**
   * Build today's session without running the full adaptation pipeline.
   */
  async buildSession(input: AdaptationInput): Promise<LearningSession> {
    const targetDifficulty = await this.difficultyEngine.getCurrentDifficulty(input.studentId, input.topicId);
    const dueReviews = await this.reviewScheduler.getDueReviews(input.studentId);

    const defaultPool: QuestionCandidate[] = input.questionPool ?? [
      { questionId: 'q-warm-1', topicId: input.topicId, difficulty: 'EASY', expectedSolveMinutes: 2 },
      { questionId: 'q-warm-2', topicId: input.topicId, difficulty: 'EASY', expectedSolveMinutes: 2 },
      { questionId: 'q-core-1', topicId: input.topicId, difficulty: targetDifficulty, expectedSolveMinutes: 4 },
      { questionId: 'q-core-2', topicId: input.topicId, difficulty: targetDifficulty, expectedSolveMinutes: 4 },
      { questionId: 'q-core-3', topicId: input.topicId, difficulty: targetDifficulty, expectedSolveMinutes: 5 },
      { questionId: 'q-challenge-1', topicId: input.topicId, difficulty: 'HARD', expectedSolveMinutes: 8 },
    ];

    return this.sessionPlanner.buildSession(input.studentId, {
      activeTopicId: input.topicId,
      targetDifficulty,
      topicPriorities: input.topicPriorities ?? { [input.topicId]: 0.8 },
      retentionScores: input.retentionScores ?? { [input.topicId]: 0.7 },
      dueReviews: dueReviews as any[],
      questionPool: defaultPool,
      recentlyAttemptedIds: input.recentlyAttemptedIds ?? [],
      appliedDecisionIds: [],
      aiTutorTopicId: input.aiTutorTopicId,
    });
  }
}
