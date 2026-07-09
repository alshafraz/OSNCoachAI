// src/application/adaptive-learning/api/dtos/AdaptivePlanDto.ts

export interface AdaptivePlanDto {
  studentId: string;
  learningPathId: string;
  currentTopicId: string;
  activeTopicDifficulties: Record<string, string>;
  overallReadiness: number;
  competitionPrepActive: boolean;
  daysToCompetition?: number;
  currentPaceRecommendation: string;
  totalSessionsCompleted: number;
  upcomingReviewTopicIds: string[];
  activeRecoveryPlanIds: string[];
  activeChallengePlanIds: string[];
  lastAdaptedAt: string; // ISO string
}

export interface AdaptationDecisionDto {
  id: string;
  topicId: string;
  action: string;
  decisionSummary: string;
  reasoning: string;
  expectedBenefit: string;
  estimatedImprovement: number;
  confidence: number;
  createdAt: string;
}
