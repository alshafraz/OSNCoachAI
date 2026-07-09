// src/application/learning-motivation/config/xpRules.ts
/**
 * Configurable XP values for each motivation event.
 * Values can be overridden per‑environment or loaded from a DB.
 */
export const xpRules = {
  QuestionSolved: 10,
  PerfectScore: 50,
  PracticeCompleted: 20,
  AssessmentCompleted: 30,
  HintUsedPenalty: -5,
  DailyGoalCompleted: 15,
  WeakTopicImproved: 25,
  ConsecutiveStudyDay: (streakDays: number) => 5 * streakDays, // bonus per day
  AITutorSessionCompleted: 20,
  ReviewSessionCompleted: 10,
};
