export interface CoachSession {
  id: string;
  studentId: string;
  startedAt: Date;
  lastActivityAt: Date;
  status: 'active' | 'completed' | 'cancelled';
}
