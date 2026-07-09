// src/application/learning-intelligence/infrastructure/persistence/entities/LearningEventEntity.ts
export class LearningEventEntity {
  id!: string;
  studentId!: string;
  eventType!: string; // e.g., 'questionStarted', 'hintUsed', etc.
  payload!: Record<string, any>;
  timestamp!: Date;
  metadata?: Record<string, any>;
}
