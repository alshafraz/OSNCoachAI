// src/application/adaptive-learning/services/PaceEngine.ts
import { paleConfig, PaceRecommendation } from '../config/paleConfig';
import { Logger } from '@/infra/logger';

/**
 * PaceEngine estimates student fatigue and recommends study pace adjustments.
 *
 * Recommendations:
 *   CONTINUE    - Normal pace, student is engaged
 *   SLOW_DOWN   - Signs of fatigue, reduce difficulty or intensity
 *   REVIEW      - Good time for a light review session instead of new content
 *   REST        - Session too long or accuracy drop too steep — stop for now
 */
export class PaceEngine {
  private readonly logger = new Logger('PaceEngine');
  private readonly cfg = paleConfig.pace;

  /**
   * Evaluate the current pace and return a recommendation.
   */
  evaluate(evidence: {
    sessionDurationMinutes: number;
    sessionAccuracyStart: number;   // accuracy in the first 10 questions
    sessionAccuracyEnd: number;     // accuracy in the last 10 questions
    hoursSinceLastBreak: number;
    consecutiveErrors: number;
  }): { recommendation: PaceRecommendation; reasoning: string } {
    const {
      sessionDurationMinutes,
      sessionAccuracyStart,
      sessionAccuracyEnd,
      hoursSinceLastBreak,
      consecutiveErrors,
    } = evidence;

    const accuracyDrop = sessionAccuracyStart - sessionAccuracyEnd;

    // ─── REST ───────────────────────────────────────────────────────────────────
    if (
      sessionDurationMinutes >= this.cfg.fatigueLengthMinutes ||
      (hoursSinceLastBreak < this.cfg.minBreakHours && sessionDurationMinutes > 30) ||
      consecutiveErrors >= 5
    ) {
      return {
        recommendation: 'REST',
        reasoning: `Session has exceeded ${this.cfg.fatigueLengthMinutes} minutes or ${consecutiveErrors} consecutive errors detected. Rest is recommended before continuing.`,
      };
    }

    // ─── SLOW_DOWN ──────────────────────────────────────────────────────────────
    if (accuracyDrop >= this.cfg.accuracyDropFatigueThreshold || consecutiveErrors >= 3) {
      return {
        recommendation: 'SLOW_DOWN',
        reasoning: `Accuracy dropped by ${(accuracyDrop * 100).toFixed(0)}% during this session, indicating fatigue or cognitive overload. Reduce difficulty or pace.`,
      };
    }

    // ─── REVIEW ─────────────────────────────────────────────────────────────────
    if (sessionDurationMinutes > 35 && accuracyDrop > 0.10) {
      return {
        recommendation: 'REVIEW',
        reasoning: `Session approaching fatigue zone with a slight accuracy drop. Switching to review mode is recommended.`,
      };
    }

    // ─── CONTINUE ───────────────────────────────────────────────────────────────
    return {
      recommendation: 'CONTINUE',
      reasoning: `Performance is stable and session length is within limits. Continue current pace.`,
    };
  }
}
