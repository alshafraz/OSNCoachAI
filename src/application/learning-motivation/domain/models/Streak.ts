// src/application/learning-motivation/domain/models/Streak.ts
/**
 * Represents a streak of consecutive study activities.
 */
export interface Streak {
  studentId: string;
  type: 'daily' | 'weekly' | 'monthly';
  currentCount: number; // how many consecutive periods
  longestCount: number;
  lastActivity: Date;
  // grace period in hours is applied via config
}
