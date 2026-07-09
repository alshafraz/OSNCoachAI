/**
 * LPE — Session Recovery Service Implementation
 *
 * Implements session recovery and checkpoint state persistence.
 */

import type { PracticeSession } from '@/domain/entities/practice/PracticeEntities';
import type { SessionRecoveryService } from '@/domain/services/practice/PracticeServices';
import { lpeRepository } from './LpeRepository';

export class SessionRecoveryServiceImpl implements SessionRecoveryService {
  async checkpoint(session: PracticeSession): Promise<void> {
    lpeRepository.save(session);
  }

  async recover(sessionId: string): Promise<PracticeSession | null> {
    const session = lpeRepository.get(sessionId);
    if (!session) return null;
    
    // If it's running, verify if time expired
    if (session.status === 'RUNNING' && session.config.timeLimitSeconds) {
      const elapsed = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);
      if (elapsed >= session.config.timeLimitSeconds) {
        session.status = 'TIMED_OUT';
        session.completedAt = new Date(session.startedAt.getTime() + session.config.timeLimitSeconds * 1000);
        lpeRepository.save(session);
      }
    }
    return session;
  }

  async getActiveSessions(studentId: string): Promise<PracticeSession[]> {
    return lpeRepository.listByStudent(studentId).filter((s) => s.status === 'RUNNING');
  }
}
