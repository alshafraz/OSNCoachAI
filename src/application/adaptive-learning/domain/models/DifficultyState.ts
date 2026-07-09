// src/application/adaptive-learning/domain/models/DifficultyState.ts
import { PaleDifficulty } from '../../config/paleConfig';

/**
 * Tracks the current difficulty state for a specific student × topic pair.
 * Updated after every session by the DifficultyEngine.
 */
export interface DifficultyState {
  id: string;
  studentId: string;
  topicId: string;
  /** Current difficulty level */
  currentDifficulty: PaleDifficulty;
  /** Number of consecutive upward adjustments */
  consecutiveIncreases: number;
  /** Number of consecutive downward adjustments */
  consecutiveDecreases: number;
  /** Total adjustments made */
  totalAdjustments: number;
  /** Accuracy over the recent confidence window */
  recentAccuracy: number;
  /** Average hint usage rate over the confidence window */
  recentHintUsageRate: number;
  /** Average solve time ratio (actual / expected) */
  recentSolveTimeRatio: number;
  /** When this state was last updated */
  lastUpdated: Date;
}
