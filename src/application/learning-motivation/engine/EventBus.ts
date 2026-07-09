// src/application/learning-motivation/engine/EventBus.ts
import { EventEmitter } from 'events';

export type MotivationEvent =
  | 'PracticeCompleted'
  | 'AssessmentCompleted'
  | 'QuestionSolved'
  | 'PerfectScore'
  | 'HintUsed'
  | 'DailyGoalCompleted'
  | 'WeakTopicImproved'
  | 'ConsecutiveStudyDay'
  | 'AITutorSessionCompleted'
  | 'ReviewSessionCompleted'
  | 'XPGenerated'
  | 'LevelUp'
  | 'StreakUpdated'
  | 'GoalReached'
  | 'AchievementUnlocked'
  | 'BadgeAwarded';

export interface MotivationEventPayloads {
  PracticeCompleted: { studentId: string; practiceId: string; xp: number };
  AssessmentCompleted: { studentId: string; assessmentId: string; score: number; xp: number };
  QuestionSolved: { studentId: string; questionId: string; correct: boolean; timeMs: number; xp: number };
  PerfectScore: { studentId: string; context: string; xp: number };
  HintUsed: { studentId: string; questionId: string; xpPenalty: number };
  DailyGoalCompleted: { studentId: string; goalId: string; xp: number };
  WeakTopicImproved: { studentId: string; topicId: string; xp: number };
  ConsecutiveStudyDay: { studentId: string; streakDays: number; xp: number };
  AITutorSessionCompleted: { studentId: string; sessionId: string; xp: number };
  ReviewSessionCompleted: { studentId: string; sessionId: string; xp: number };
  XPGenerated: { studentId: string; amount: number; reason: string };
  LevelUp: { studentId: string; newLevel: number; xp: number };
  StreakUpdated: { studentId: string; streakType: 'daily' | 'weekly' | 'monthly'; current: number; xp: number };
  GoalReached: { studentId: string; goalId: string; xp: number };
  AchievementUnlocked: { studentId: string; achievementId: string; xp: number };
  BadgeAwarded: { studentId: string; badgeId: string; xp: number };
}

/**
 * Central event bus used by all modules to publish and consume motivation events.
 * It extends Node.js EventEmitter with strongly‑typed payloads.
 */
export class MotivationEventBus extends EventEmitter {
  emit<E extends MotivationEvent>(event: E, payload: MotivationEventPayloads[E]): boolean {
    return super.emit(event, payload);
  }

  on<E extends MotivationEvent>(event: E, listener: (payload: MotivationEventPayloads[E]) => void): this {
    return super.on(event, listener);
  }
}

// Export a singleton instance for the whole application
export const motivationEventBus = new MotivationEventBus();
