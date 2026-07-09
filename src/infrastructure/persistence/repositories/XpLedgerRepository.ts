// src/infrastructure/persistence/repositories/XpLedgerRepository.ts
import { Logger } from '@/infra/logger';

export class XpLedgerRepository {
  private readonly logger = new Logger('XpLedgerRepository');
  private xpRecords: Map<string, Array<{ xp: number; reason: string; timestamp: Date }>> = new Map();

  async addXp(studentId: string, xp: number, reason: string): Promise<void> {
    this.logger.info(`Adding ${xp} XP to student ${studentId} for ${reason}`);
    
    if (!this.xpRecords.has(studentId)) {
      this.xpRecords.set(studentId, []);
    }
    
    this.xpRecords.get(studentId)!.push({
      xp,
      reason,
      timestamp: new Date(),
    });
  }

  async getXp(studentId: string): Promise<number> {
    const records = this.xpRecords.get(studentId) ?? [];
    return records.reduce((sum, record) => sum + record.xp, 0);
  }
}
