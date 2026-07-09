// src/application/learning-intelligence/domain/models/LearningEvent.ts
export interface LearningEvent {
  id: string;
  studentId: string;
  eventType: string; // e.g., 'questionStarted', 'hintUsed', etc.
  payload: Record<string, any>;
  timestamp: Date;
  metadata?: Record<string, any>;
}
