// src/application/ai-tutor/domain/models/TutorSession.ts
export interface TutorSession {
  id: string;
  studentId: string;
  mode: string; // e.g., 'conceptTeaching', 'stepByStep'
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed' | 'cancelled';
  // Aggregated stats
  totalHintsUsed: number;
  totalInteractions: number;
}
