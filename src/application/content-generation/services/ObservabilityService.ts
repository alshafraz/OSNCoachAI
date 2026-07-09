// src/application/content-generation/services/ObservabilityService.ts
import { Injectable } from '@nestjs/common';
import { trackTokensCost, getTokensUsageStatistics } from '../../../infrastructure/services/ai/LlmProviderRegistry';

export interface GenerationMetrics {
  totalRequests: number;
  totalSuccess: number;
  totalFailed: number;
  totalCostUsd: number;
  averageLatencyMs: number;
  acceptanceRatePct: number;
}

@Injectable()
export class ObservabilityService {
  private totalRequests = 0;
  private totalSuccess = 0;
  private totalFailed = 0;
  private totalLatencyMs = 0;

  trackRequest(contentType: string): void {
    this.totalRequests++;
  }

  trackSuccess(tokensUsed: { prompt: number; completion: number }, latencyMs: number): void {
    this.totalSuccess++;
    this.totalLatencyMs += latencyMs;
    // Track cost in the central LLM provider log
    trackTokensCost('openai', 'gpt-4o-mini', tokensUsed.prompt, tokensUsed.completion);
  }

  trackFailure(): void {
    this.totalFailed++;
  }

  getMetrics(): GenerationMetrics {
    const usage = getTokensUsageStatistics();
    const avgLatency = this.totalSuccess > 0 ? this.totalLatencyMs / this.totalSuccess : 0;
    const acceptanceRate = this.totalRequests > 0 ? (this.totalSuccess / this.totalRequests) * 100 : 0;

    return {
      totalRequests: this.totalRequests,
      totalSuccess: this.totalSuccess,
      totalFailed: this.totalFailed,
      totalCostUsd: usage.totalCost,
      averageLatencyMs: Math.round(avgLatency),
      acceptanceRatePct: Math.round(acceptanceRate),
    };
  }
}
export { trackTokensCost, getTokensUsageStatistics };
