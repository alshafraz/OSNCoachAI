// src/application/learning-intelligence/infrastructure/persistence/entities/RetentionAnalyticsEntity.ts
export class RetentionAnalyticsEntity {
  id!: string;
  studentId!: string;
  retentionScore!: number; // 0-1 score
  decayFactor!: number;
  daysSinceLastPractice!: number;
  computedAt!: Date;
}
