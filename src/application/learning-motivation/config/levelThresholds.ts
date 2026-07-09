// src/application/learning-motivation/config/levelThresholds.ts
/**
 * Mapping of level number to cumulative XP required.
 * Can be extended or loaded from DB.
 */
export const levelThresholds: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  // ... add more levels as needed
};
