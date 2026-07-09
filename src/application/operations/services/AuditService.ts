// src/application/operations/services/AuditService.ts
import { SystemEvent } from '../domain/models/SystemEvent';
import { SystemEventRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * AuditService monitors authentication logs, configuration adjustments, and database schema overrides.
 */
export class AuditService {
  private readonly logger = new Logger('AuditService');
  private readonly repo = new SystemEventRepository();

  /** Log operational system events. */
  async logEvent(entry: Partial<SystemEvent>): Promise<SystemEvent> {
    const event: SystemEvent = {
      id: uuidv4(),
      eventType: entry.eventType || 'MAINTENANCE',
      severity: entry.severity || 'INFO',
      actor: entry.actor || 'System',
      description: entry.description || '',
      metadata: entry.metadata,
      ipAddress: entry.ipAddress,
      timestamp: new Date(),
    };

    await this.repo.save(event as any);
    this.logger.info('Operations System event logged', { type: event.eventType, severity: event.severity });
    return event;
  }

  /** Retrieve recent events list. */
  async getRecentEvents(limit = 50): Promise<SystemEvent[]> {
    const list = await this.repo.findRecent(limit);
    return list as unknown as SystemEvent[];
  }
}
export const defaultAuditService = new AuditService();
