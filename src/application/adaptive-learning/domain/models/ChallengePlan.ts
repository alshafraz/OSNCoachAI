// src/application/adaptive-learning/domain/models/ChallengePlan.ts

/**
 * A challenge plan activated when a student consistently excels.
 * Pushes the student further with harder questions and new concepts.
 */
export interface ChallengePlan {
  id: string;
  studentId: string;
  topicId: string;
  activatedAt: Date;
  resolvedAt?: Date;
  isActive: boolean;
  /** Evidence that triggered the challenge mode */
  triggerEvidence: {
    recentAccuracy: number;
    consecutiveStrongSessions: number;
    avgSolveTimeRatio: number;
    confidence: number;
  };
  accelerations: ChallengeAcceleration[];
  /** Explainable rationale */
  reasoning: string;
}

export interface ChallengeAcceleration {
  type:
    | 'INCREASE_DIFFICULTY'
    | 'INTRODUCE_NEW_CONCEPT'
    | 'GENERATE_OLYMPIAD_QUESTIONS'
    | 'RECOMMEND_FASTER_METHODS'
    | 'REDUCE_HINT_AVAILABILITY'
    | 'ADVANCE_LEARNING_PATH';
  description: string;
  priority: number;
}
