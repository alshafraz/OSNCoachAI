// src/application/operations/services/MaintenanceService.ts
import { AuditService } from './AuditService';
import { Logger } from '@/infra/logger';

/**
 * MaintenanceService locks write operations or broadcasts system banners.
 */
export class MaintenanceService {
  private readonly logger = new Logger('MaintenanceService');
  private readonly auditService = new AuditService();
  private static isSystemLocked = false;

  /** Check if database write operations are blocked. */
  isLocked(): boolean {
    return MaintenanceService.isSystemLocked;
  }

  /** Set maintenance read-only lock status. */
  async setMaintenanceLock(locked: boolean, actor: string, reason?: string): Promise<void> {
    MaintenanceService.isSystemLocked = locked;
    this.logger.warn('Maintenance write lock status adjusted', { locked, actor });

    await this.auditService.logEvent({
      eventType: 'MAINTENANCE',
      severity: locked ? 'WARNING' : 'INFO',
      actor,
      description: locked 
        ? `Read-only database maintenance lock ENABLED. Reason: ${reason || 'System update'}`
        : 'Read-only database maintenance lock DISABLED.',
    });
  }
}
export const defaultMaintenanceService = new MaintenanceService();
