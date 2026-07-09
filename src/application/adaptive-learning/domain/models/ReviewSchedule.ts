// src/application/adaptive-learning/domain/models/ReviewSchedule.ts

/**
 * A scheduled spaced-review slot for a topic.
 * Created by ReviewScheduler; consumed by LearningSessionPlanner.
 */
export interface ReviewSchedule {
  id: string;
  studentId: string;
  topicId: string;
  /** Leitner box level (1-5) — higher = longer interval */
  leitnerBox: number;
  /** When the next review is due */
  scheduledFor: Date;
  /** Urgency score (0-1) — 1 is due immediately */
  urgency: number;
  /** Retention score at time of scheduling */
  retentionAtScheduling: number;
  completed: boolean;
  completedAt?: Date;
  /** Whether the review was answered correctly (determines box promotion/demotion) */
  answeredCorrectly?: boolean;
  createdAt: Date;
}
