// src/application/ai-governance/services/CostService.ts
import { CostTracking } from '../domain/models/CostTracking';
import { CostTrackingRepository } from '../infrastructure/persistence/repositories/Repositories';
import { governanceConfig, AIOpsTaskType } from '../config/governanceConfig';
import { Logger } from '@/infra/logger';

/**
 * CostService tracks token counts and cost USD per feature, request, and student.
 */
export class CostService {
  private readonly logger = new Logger('CostService');
  private readonly repo = new CostTrackingRepository();

  /** Calculate and log cost for an LLM response. */
  async trackCost(
    requestId: string,
    engine: AIOpsTaskType,
    studentId: string | undefined,
    providerId: string,
    inputTokens: number,
    outputTokens: number
  ): Promise<number> {
    // Look up pricing coefficient
    const prices = governanceConfig.pricing[providerId as keyof typeof governanceConfig.pricing] 
      || [1.0, 1.0] as [number, number];
    
    const promptCost = (inputTokens / 1000000) * prices[0];
    const completionCost = (outputTokens / 1000000) * prices[1];
    const totalCost = promptCost + completionCost;

    const log: CostTracking = {
      id: '',
      requestId,
      engine,
      studentId,
      providerId,
      inputTokens,
      outputTokens,
      costUsd: totalCost,
      timestamp: new Date(),
    };

    await this.repo.save(log as any);
    this.logger.info('Tokens cost tracked', { engine, providerId, totalCostUsd: totalCost });
    return totalCost;
  }

  /** Get cost stats per student. */
  async getCostForStudent(studentId: string): Promise<number> {
    const logs = await this.repo.findByStudent(studentId);
    return logs.reduce((sum, l) => sum + l.costUsd, 0);
  }

  /** Get aggregated stats. */
  async getStats(): Promise<{
    totalCost: number;
    totalCalls: number;
    avgCostPerCall: number;
    costByEngine: Record<string, number>;
  }> {
    const logs = await this.repo.findAll();
    const totalCost = logs.reduce((sum, l) => sum + l.costUsd, 0);
    const totalCalls = logs.length;
    
    const costByEngine: Record<string, number> = {};
    for (const log of logs) {
      costByEngine[log.engine] = (costByEngine[log.engine] || 0) + log.costUsd;
    }

    return {
      totalCost,
      totalCalls,
      avgCostPerCall: totalCalls > 0 ? totalCost / totalCalls : 0,
      costByEngine,
    };
  }
}
export const defaultCostService = new CostService();
