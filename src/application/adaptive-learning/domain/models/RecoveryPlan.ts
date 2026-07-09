// src/application/adaptive-learning/domain/models/RecoveryPlan.ts

/**
 * A recovery plan activated when a student shows persistent poor performance.
 * Contains a set of structured interventions.
 */
export interface RecoveryPlan {
  id: string;
  studentId: string;
  topicId: string;
  activatedAt: Date;
  resolvedAt?: Date;
  isActive: boolean;
  /** Evidence that triggered the recovery */
  triggerEvidence: {
    recentAccuracy: number;
    consecutivePoorSessions: number;
    hintUsageRate: number;
  };
  interventions: RecoveryIntervention[];
  /** Explainable rationale */
  reasoning: string;
}

export interface RecoveryIntervention {
  type:
    | 'REDUCE_DIFFICULTY'
    | 'INCREASE_REVIEW_FREQUENCY'
    | 'RECOMMEND_AI_TUTOR'
    | 'PROVIDE_EASIER_EXAMPLES'
    | 'DELAY_ASSESSMENT'
    | 'REBUILD_PREREQUISITE';
  description: string;
  priority: number; // 1 = highest
}
