// src/application/adaptive-learning/infrastructure/persistence/entities/DifficultyStateEntity.ts
export class DifficultyStateEntity {
  id!: string;
  studentId!: string;
  topicId!: string;
  currentDifficulty!: string;
  consecutiveIncreases!: number;
  consecutiveDecreases!: number;
  totalAdjustments!: number;
  recentAccuracy!: number;
  recentHintUsageRate!: number;
  recentSolveTimeRatio!: number;
  lastUpdated!: Date;
}
