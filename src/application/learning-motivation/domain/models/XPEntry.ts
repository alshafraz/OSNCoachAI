// src/application/learning-motivation/domain/models/XPEntry.ts
/**
 * Represents a single XP transaction.
 */
export interface XPEntry {
  studentId: string;
  amount: number;
  reason: string; // event name that generated the XP
  timestamp: Date;
}
