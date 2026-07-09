// src/application/ai-coach/services/MetricsComputer.ts
import { Evidence } from '../domain/models/Evidence';

/**
 * Computes aggregated metrics from raw evidence.
 * For now it calculates simple averages for a few known evidence types.
 */
export class MetricsComputer {
  constructor(private readonly evidences: Evidence[]) {}

  compute(): Record<string, number> {
    const metrics: Record<string, number> = {};
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    for (const ev of this.evidences) {
      const key = ev.type;
      sums[key] = (sums[key] ?? 0) + ev.value;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    for (const key of Object.keys(sums)) {
      metrics[key] = sums[key] / counts[key];
    }
    // Ensure metrics exist even if no evidence – defaults to 0
    if (!metrics['topicAccuracy']) metrics['topicAccuracy'] = 0;
    if (!metrics['hintDependency']) metrics['hintDependency'] = 0;
    if (!metrics['retentionScore']) metrics['retentionScore'] = 0;
    return metrics;
  }
}
