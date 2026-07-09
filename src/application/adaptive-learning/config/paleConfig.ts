// src/application/adaptive-learning/config/paleConfig.ts

/**
 * Central configuration for the Personalized Adaptive Learning Engine (PALE).
 * All adaptation thresholds, weights, and toggles live here.
 * Nothing is hardcoded in services.
 */
export const paleConfig = {
  // ─── Difficulty Adjustment Rules ─────────────────────────────────────────────
  difficulty: {
    /** Accuracy rate above which difficulty should increase */
    increaseThreshold: 0.85,
    /** Accuracy rate below which difficulty should decrease */
    decreaseThreshold: 0.55,
    /** Fast solve time ratio (actual / expected) below which difficulty may increase */
    fastSolveRatio: 0.7,
    /** Slow solve time ratio above which difficulty may decrease */
    slowSolveRatio: 1.6,
    /** Max hint usage rate before triggering difficulty decrease */
    maxHintUsageRate: 0.4,
    /** Minimum questions required before any adjustment */
    minQuestionsBeforeAdjust: 5,
    /** Max consecutive increases before pause */
    maxConsecutiveIncreases: 3,
    /** Confidence window: N recent sessions to evaluate */
    confidenceWindow: 10,
  },

  // ─── Question Selection Weights ───────────────────────────────────────────────
  questionSelection: {
    topicPriorityWeight: 0.30,
    difficultyMatchWeight: 0.25,
    diversityBonusWeight: 0.15,
    retentionGapWeight: 0.15,
    solveTimeBonusWeight: 0.10,
    recencyPenaltyWeight: 0.05,
    /** Days within which a question is penalised for re-exposure */
    recentExposureWindowDays: 7,
    /** Minimum score for a question to be selected */
    minSelectionScore: 0.1,
    /** Max questions to return per session slot */
    maxQuestionsPerSlot: 10,
  },

  // ─── Review Scheduling (Spaced Repetition) ───────────────────────────────────
  review: {
    /** Leitner box intervals in days [box1, box2, box3, box4, box5] */
    leitnerIntervals: [1, 3, 7, 14, 30],
    /** Retention score below which review is urgent */
    urgentRetentionThreshold: 0.5,
    /** Max reviews per session */
    maxReviewsPerSession: 3,
  },

  // ─── Session Planner Structure ────────────────────────────────────────────────
  session: {
    warmUpCount: 2,
    coreQuestionCount: 8,
    challengeCount: 2,
    reviewCount: 3,
    /** Default session duration in minutes */
    defaultDurationMinutes: 45,
  },

  // ─── Recovery Triggers ────────────────────────────────────────────────────────
  recovery: {
    /** Accuracy below this for N consecutive sessions triggers recovery */
    accuracyThreshold: 0.45,
    /** Number of consecutive poor sessions before recovery activates */
    consecutivePoorSessions: 3,
    /** Hint usage rate above which recovery is considered */
    hintSpikethreshold: 0.7,
  },

  // ─── Challenge Triggers ───────────────────────────────────────────────────────
  challenge: {
    /** Accuracy above this for N sessions triggers challenge mode */
    accuracyThreshold: 0.90,
    consecutiveStrongSessions: 3,
    /** Confidence level (0-1) required */
    minConfidence: 0.8,
    /** Fast solve ratio threshold */
    fastSolveRatio: 0.6,
  },

  // ─── Pace Engine ─────────────────────────────────────────────────────────────
  pace: {
    /** Session length in minutes above which fatigue is flagged */
    fatigueLengthMinutes: 60,
    /** Accuracy drop % within a session indicating fatigue */
    accuracyDropFatigueThreshold: 0.20,
    /** Minimum break in hours between long sessions */
    minBreakHours: 2,
  },

  // ─── Simulation ───────────────────────────────────────────────────────────────
  simulation: {
    projectionDays: [7, 14, 30],
    /** Questions per day assumed in simulation */
    assumedQuestionsPerDay: 15,
  },

  // ─── Goal Adaptation ─────────────────────────────────────────────────────────
  goals: {
    /** % of goal behind schedule that triggers rebalancing */
    behindScheduleThreshold: 0.20,
    /** % ahead of schedule that allows enrichment */
    aheadScheduleThreshold: 0.15,
  },

  // ─── Content Request Thresholds ───────────────────────────────────────────────
  contentRequest: {
    /** If available questions < this, request ACGP generation */
    minAvailableQuestionsPerTopic: 5,
  },

  // ─── Observability ────────────────────────────────────────────────────────────
  observability: {
    enablePrometheus: true,
    metricPrefix: 'pale_',
  },
} as const;

export type PaleDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'OLYMPIAD';
export type PaceRecommendation = 'CONTINUE' | 'SLOW_DOWN' | 'REVIEW' | 'REST';
export type LearningPathNodeStatus = 'PENDING' | 'ACTIVE' | 'MASTERED' | 'SKIPPED' | 'IN_RECOVERY';
export type AdaptationAction =
  | 'INCREASE_DIFFICULTY'
  | 'DECREASE_DIFFICULTY'
  | 'SCHEDULE_REVIEW'
  | 'ACTIVATE_RECOVERY'
  | 'ACTIVATE_CHALLENGE'
  | 'ADVANCE_TOPIC'
  | 'REORDER_TOPICS'
  | 'REQUEST_CONTENT'
  | 'RECOMMEND_REST'
  | 'RECOMMEND_AI_TUTOR'
  | 'REBALANCE_GOAL';
