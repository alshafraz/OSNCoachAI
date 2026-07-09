// src/application/operations/domain/models/HealthStatus.ts

export interface HealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  liveness: boolean;
  readiness: boolean;
  timestamp: Date;
  details: {
    database: { connected: boolean; latencyMs: number };
    cache: { connected: boolean; latencyMs: number };
    diskSpace: { usedPct: number; availableGb: number };
    memory: { usedPct: number; freeMb: number; totalMb: number };
    cpu: { loadPct: number };
  };
}
