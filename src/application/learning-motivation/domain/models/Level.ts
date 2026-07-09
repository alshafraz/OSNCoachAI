// src/application/learning-motivation/domain/models/Level.ts
/**
 * Represents a student's level and accumulated XP.
 */
export interface Level {
  studentId: string;
  currentLevel: number;
  totalXp: number;
  nextLevelXp: number; // XP needed to reach next level
}
