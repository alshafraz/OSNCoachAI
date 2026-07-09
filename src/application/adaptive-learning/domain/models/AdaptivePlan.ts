// src/application/adaptive-learning/domain/models/AdaptivePlan.ts
import { PaleDifficulty } from '../../config/paleConfig';

/**
 * The complete, active adaptive learning plan for one student.
 * This is the master state document that PALE manages.
 */
export interface AdaptivePlan {
  id: string;
  studentId: string;
  /** ID of the current learning path */
  learningPathId: string;
  /** Current active topic */
  currentTopicId: string;
  /** IDs of topics currently in difficulty adjustment phase */
  activeTopicDifficulties: Record<string, PaleDifficulty>;
  /** IDs of active recovery plans */
  activeRecoveryPlanIds: string[];
  /** IDs of active challenge plans */
  activeChallengePlanIds: string[];
  /** Topics due for review (from ReviewScheduler) */
  upcomingReviewTopicIds: string[];
  /** Overall readiness score (0-1) — aggregated from LIP */
  overallReadiness: number;
  /** Whether competition prep mode is active */
  competitionPrepActive: boolean;
  /** Days until competition (null if no competition set) */
  daysToCompetition?: number;
  /** Pace recommendation from PaceEngine */
  currentPaceRecommendation: string;
  /** Total sessions completed under this plan */
  totalSessionsCompleted: number;
  /** When this plan was last run through the adaptation engine */
  lastAdaptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
