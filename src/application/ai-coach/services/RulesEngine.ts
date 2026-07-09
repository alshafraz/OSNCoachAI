// src/application/ai-coach/services/RulesEngine.ts
import { defaultCoachConfig } from '../config/coachConfig';

/**
 * Simple deterministic rules engine.
 * Takes computed metrics and config, returns a plain object with rule flags
 * and weighted scores that will be used by the RecommendationEngine.
 */
export class RulesEngine {
  constructor(private readonly metrics: Record<string, number>, private readonly config: typeof defaultCoachConfig) {}

  evaluate(): Record<string, any> {
    const { masteryAccuracy, retentionThreshold, enableRiskDetection, enableMisconceptionAnalysis } = this.config;
    const topicAccuracy = this.metrics['topicAccuracy'] ?? 0;
    const retentionScore = this.metrics['retentionScore'] ?? 0;
    const hintDep = this.metrics['hintDependency'] ?? 0;

    const weakness = topicAccuracy < masteryAccuracy || retentionScore < retentionThreshold;
    const risk = enableRiskDetection && (hintDep > 0.6);
    const misconception = enableMisconceptionAnalysis && (hintDep > 0.4 && topicAccuracy < 0.5);

    return {
      weakness,
      risk,
      misconception,
      scores: {
        accuracyWeight: this.config.weightAccuracy * topicAccuracy,
        retentionWeight: this.config.weightRetention * retentionScore,
        hintWeight: this.config.weightHintDependency * hintDep,
      },
    };
  }
}
