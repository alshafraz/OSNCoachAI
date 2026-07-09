// src/application/learning-intelligence/infrastructure/persistence/entities/TopicAnalyticsEntity.ts
export class TopicAnalyticsEntity {
  id!: string;
  topicId!: string;
  studentId!: string;
  accuracy!: number;
  solveTime!: number;
  confidence!: number;
  difficultyTrend!: number;
  retention!: number;
  mastery!: number;
  learningVelocity!: number;
  questionVolume!: number;
  improvementTrend!: number;
  weaknessScore!: number;
  lastUpdated!: Date;
}
