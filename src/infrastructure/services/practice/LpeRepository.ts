/**
 * LPE — Repository (In-Memory, Prisma-Ready)
 * Keyed storage for PracticeSessions and recovery checkpoints.
 */

import type { PracticeSession } from '@/domain/entities/practice/PracticeEntities';

export class LpeRepository {
  private sessions = new Map<string, PracticeSession>();

  save(session: PracticeSession): PracticeSession {
    this.sessions.set(session.id, { ...session });
    return session;
  }

  get(id: string): PracticeSession | null {
    const raw = this.sessions.get(id);
    if (!raw) return null;
    // Return a deep copy to prevent side-channel mutations
    return JSON.parse(JSON.stringify(raw)) as PracticeSession;
  }

  listByStudent(studentId: string): PracticeSession[] {
    return [...this.sessions.values()]
      .filter((s) => s.studentId === studentId)
      .map((s) => JSON.parse(JSON.stringify(s)) as PracticeSession);
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  clear(): void {
    this.sessions.clear();
  }
}

// Export singleton storage reference
export const lpeRepository = new LpeRepository();
