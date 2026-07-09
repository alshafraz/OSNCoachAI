// src/application/adaptive-learning/infrastructure/persistence/entities/AdaptivePlanEntity.ts
export class AdaptivePlanEntity {
  id!: string;
  studentId!: string;
  learningPathId!: string;
  currentTopicId!: string;
  activeTopicDifficulties!: Record<string, string>;
  activeRecoveryPlanIds!: string[];
  activeChallengePlanIds!: string[];
  upcomingReviewTopicIds!: string[];
  overallReadiness!: number;
  competitionPrepActive!: boolean;
  daysToCompetition?: number;
  currentPaceRecommendation!: string;
  totalSessionsCompleted!: number;
  lastAdaptedAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
