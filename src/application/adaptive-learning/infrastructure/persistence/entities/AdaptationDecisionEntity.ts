// src/application/adaptive-learning/infrastructure/persistence/entities/AdaptationDecisionEntity.ts
export class AdaptationDecisionEntity {
  id!: string;
  studentId!: string;
  topicId!: string;
  action!: string;
  decisionSummary!: string;
  evidenceUsed!: any[];
  reasoning!: string;
  expectedBenefit!: string;
  estimatedImprovement!: number;
  confidence!: number;
  modelVersion!: string;
  createdAt!: Date;
  appliedAt?: Date;
  outcome?: string;
}
