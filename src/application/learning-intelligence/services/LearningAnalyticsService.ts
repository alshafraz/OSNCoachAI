// src/application/learning-intelligence/services/LearningAnalyticsService.ts
import { LearningEvent } from '../domain/models/LearningEvent';
import { LearningEventRepository } from '../infrastructure/persistence/repositories/LearningEventRepository';
import { lipConfig } from '../config/lipConfig';
import { Logger } from '@/infra/logger';

/**
 * Service responsible for ingesting raw learning events.
 * It persists the event and optionally publishes it to a message bus.
 *
 * Pipeline position: Learning Events (Step 1)
 */
export class LearningAnalyticsService {
  private readonly repo = new LearningEventRepository();
  private readonly logger = new Logger('LearningAnalyticsService');

  /**
   * Persist a single learning event.
   * The method is idempotent – duplicate IDs will be ignored.
   */
  async collectEvent(event: LearningEvent): Promise<void> {
    if (!event.id || !event.studentId || !event.eventType) {
      this.logger.warn('Invalid learning event received', { event });
      return;
    }
    try {
      await this.repo.save(event as any);
      this.logger.info('Learning event persisted', { eventId: event.id });
    } catch (err) {
      this.logger.error('Failed to persist learning event', { error: err, eventId: event.id });
      throw err;
    }
  }

  /**
   * Alias for collectEvent – used by the API controller and tests.
   */
  async processEvent(event: LearningEvent): Promise<void> {
    return this.collectEvent(event);
  }

  /**
   * Fetch a batch of events for aggregation jobs. Used by the orchestrator.
   */
  async fetchPendingEvents(limit: number = lipConfig.aggregationBatchSize): Promise<LearningEvent[]> {
    // Return all events in the in-memory store for simulation
    const events = await this.repo.findByStudent('all');
    if (events.length > 0) return events as any[];
    return LearningEventRepository.getStore() as any[];
  }
}
