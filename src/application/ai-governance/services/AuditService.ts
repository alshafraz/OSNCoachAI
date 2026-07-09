// src/application/ai-governance/services/AuditService.ts
import { AuditLog } from '../domain/models/AuditLog';
import { AuditLogRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';

/**
 * AuditService records audit logs for operations transparency and governance reviews.
 */
export class AuditService {
  private readonly logger = new Logger('AuditService');
  private readonly repo = new AuditLogRepository();

  /** Save audit log. */
  async log(entry: Partial<AuditLog>): Promise<AuditLog> {
    const log: AuditLog = {
      id: entry.id || '',
      requestId: entry.requestId || '',
      timestamp: entry.timestamp || new Date(),
      studentId: entry.studentId,
      engine: entry.engine || 'OCR',
      promptId: entry.promptId || '',
      promptVersion: entry.promptVersion || '',
      providerId: entry.providerId || '',
      modelName: entry.modelName || '',
      inputTokens: entry.inputTokens || 0,
      outputTokens: entry.outputTokens || 0,
      costUsd: entry.costUsd || 0,
      latencyMs: entry.latencyMs || 0,
      retryCount: entry.retryCount || 0,
      success: entry.success ?? false,
      isValid: entry.isValid ?? false,
      isSafe: entry.isSafe ?? false,
      qualityScore: entry.qualityScore || 0,
      errorDetails: entry.errorDetails,
    };

    await this.repo.save(log as any);
    this.logger.info('Audit log saved', { requestId: log.requestId, engine: log.engine, success: log.success });
    return log;
  }

  /** Retrieve recent logs. */
  async getRecentLogs(limit = 50): Promise<AuditLog[]> {
    const list = await this.repo.findRecent(limit);
    return list as unknown as AuditLog[];
  }
}
export const defaultAuditService = new AuditService();
