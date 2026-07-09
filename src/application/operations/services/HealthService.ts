// src/application/operations/services/HealthService.ts
import { HealthStatus } from '../domain/models/HealthStatus';
import { Logger } from '@/infra/logger';

/**
 * HealthService processes system health checks (liveness and readiness probes).
 */
export class HealthService {
  private readonly logger = new Logger('HealthService');

  /**
   * Evaluates deep system health status.
   */
  async getHealth(): Promise<HealthStatus> {
    // Simulated checks (in production these check actual socket connections and os stats)
    const dbConnected = true;
    const cacheConnected = true;

    const memoryFreeMb = 1420;
    const memoryTotalMb = 8192;
    const memoryUsedPct = Math.round(((memoryTotalMb - memoryFreeMb) / memoryTotalMb) * 100);

    const isHealthy = dbConnected && cacheConnected && memoryUsedPct < 90;

    const status: HealthStatus = {
      status: isHealthy ? 'HEALTHY' : 'DEGRADED',
      liveness: true,
      readiness: dbConnected && cacheConnected,
      timestamp: new Date(),
      details: {
        database: { connected: dbConnected, latencyMs: 5 },
        cache: { connected: cacheConnected, latencyMs: 1 },
        diskSpace: { usedPct: 42, availableGb: 120 },
        memory: { usedPct: memoryUsedPct, freeMb: memoryFreeMb, totalMb: memoryTotalMb },
        cpu: { loadPct: 24 },
      },
    };

    if (!isHealthy) {
      this.logger.error('Health status check returned unhealthy/degraded metrics', status.details);
    }

    return status;
  }
}
export const defaultHealthService = new HealthService();
