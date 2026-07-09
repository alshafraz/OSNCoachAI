// src/application/learning-intelligence/services/RetentionEngine.ts
import { LearningEvent } from '../domain/models/LearningEvent';
import { lipConfig } from '../config/lipConfig';
import { Logger } from '@/infra/logger';

/**
 * RetentionEngine estimates long‑term retention for a student (or per topic).
 * It uses a simple exponential decay based on time since last practice.
 */
export class RetentionEngine {
  private readonly logger = new Logger('RetentionEngine');

  /**
   * Estimate retention score (0‑1) for a given student based on recent practice events.
   * For a real system this would incorporate many more signals.
   */
  estimateRetention(events: LearningEvent[]): number {
    // Filter practice completion events
    const practiceEvents = events.filter(e => e.eventType === 'practiceCompleted');
    if (practiceEvents.length === 0) return 0;

    // Take the most recent practice event
    const latest = practiceEvents.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    const daysSince = (new Date().getTime() - latest.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    // Apply exponential decay
    const retention = Math.pow(lipConfig.retentionDecayFactor, daysSince);
    this.logger.info('Retention estimated', { studentId: latest.studentId, daysSince, retention });
    return retention;
  }
}
