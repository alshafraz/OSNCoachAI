// src/application/learning-intelligence/services/TrendEngine.ts
import { LearningEvent } from '../domain/models/LearningEvent';
import { Logger } from '@/infra/logger';

/**
 * TrendEngine detects simple upward/downward trends for a given metric.
 * For demonstration it only analyses accuracy trend over the batch.
 */
export class TrendEngine {
  private readonly logger = new Logger('TrendEngine');

  /**
   * Returns an array of detected trends as human‑readable strings.
   */
  detectTrends(events: LearningEvent[]): string[] {
    // Gather accuracy per timestamp (assuming events contain 'questionAnswered')
    const answerEvents = events.filter(e => e.eventType === 'questionAnswered');
    if (answerEvents.length < 2) return [];
    const sorted = answerEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const accuracies: number[] = sorted.map(e => (e.payload?.correct ? 1 : 0));
    const avg = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    // Simple trend: compare first half vs second half
    const mid = Math.floor(accuracies.length / 2);
    const firstHalf = accuracies.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalf = accuracies.slice(mid).reduce((a, b) => a + b, 0) / (accuracies.length - mid);
    const trends: string[] = [];
    if (secondHalf > firstHalf) trends.push('accuracyIncreasing');
    else if (secondHalf < firstHalf) trends.push('accuracyDecreasing');
    // Add more rule‑based trends as needed.
    this.logger.info('Trends detected', { trends });
    return trends;
  }
}
