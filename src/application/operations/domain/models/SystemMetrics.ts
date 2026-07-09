// src/application/operations/domain/models/SystemMetrics.ts

export interface SystemMetrics {
  timestamp: Date;
  activeRequests: number;
  avgResponseTimeMs: number;
  errorRatePct: number;
  dbPoolActiveConnections: number;
  cacheHitRatePct: number;
  aiResponseTimeMs: number;
}
