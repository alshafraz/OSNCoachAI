// src/application/learning-motivation/config/streakConfig.ts
/**
 * Configuration for streak handling.
 * gracePeriodHours – hours after the end of a period where a missing activity is forgiven.
 * freezeTokenEnabled – placeholder for future token usage.
 */
export const streakConfig = {
  daily: {
    gracePeriodHours: 12,
    freezeTokenEnabled: false,
  },
  weekly: {
    gracePeriodHours: 48,
    freezeTokenEnabled: false,
  },
  monthly: {
    gracePeriodHours: 72,
    freezeTokenEnabled: false,
  },
};
