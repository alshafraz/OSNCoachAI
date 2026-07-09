// src/application/adaptive-learning/infrastructure/persistence/entities/ReviewScheduleEntity.ts
export class ReviewScheduleEntity {
  id!: string;
  studentId!: string;
  topicId!: string;
  leitnerBox!: number;
  scheduledFor!: Date;
  urgency!: number;
  retentionAtScheduling!: number;
  completed!: boolean;
  completedAt?: Date;
  answeredCorrectly?: boolean;
  createdAt!: Date;
}
