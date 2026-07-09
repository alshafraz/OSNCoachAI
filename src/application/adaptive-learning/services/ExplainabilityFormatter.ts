// src/application/adaptive-learning/services/ExplainabilityFormatter.ts
import { AdaptationDecision } from '../domain/models/AdaptationDecision';

export interface FormattedDecision {
  summary: string;
  action: string;
  evidence: FormattedEvidence[];
  reasoning: string;
  expectedBenefit: string;
  estimatedImprovement: string;
  confidence: string;
  timestamp: string;
}

export interface FormattedEvidence {
  metric: string;
  observed: string;
  threshold: string;
  status: 'TRIGGERED' | 'NORMAL';
}

/**
 * ExplainabilityFormatter converts raw AdaptationDecision objects into
 * human-readable formats suitable for parent dashboards, coach reports,
 * and audit logs.
 */
export class ExplainabilityFormatter {
  /**
   * Format a single AdaptationDecision into a human-readable object.
   */
  format(decision: AdaptationDecision): FormattedDecision {
    const evidence: FormattedEvidence[] = decision.evidenceUsed.map(signal => ({
      metric: this.formatMetricName(signal.metric),
      observed: typeof signal.value === 'number'
        ? (signal.value < 1.5 ? `${(signal.value * 100).toFixed(1)}%` : signal.value.toFixed(2))
        : String(signal.value),
      threshold: signal.threshold !== undefined
        ? (signal.threshold < 1.5 ? `${(signal.threshold * 100).toFixed(1)}%` : signal.threshold.toFixed(2))
        : '–',
      status: this.isTriggered(signal) ? 'TRIGGERED' : 'NORMAL',
    }));

    return {
      summary: decision.decisionSummary,
      action: this.formatActionName(decision.action),
      evidence,
      reasoning: decision.reasoning,
      expectedBenefit: decision.expectedBenefit,
      estimatedImprovement: `+${decision.estimatedImprovement}%`,
      confidence: `${(decision.confidence * 100).toFixed(0)}%`,
      timestamp: decision.createdAt.toISOString(),
    };
  }

  /** Format a list of decisions into a report string. */
  formatReport(decisions: AdaptationDecision[]): string {
    if (decisions.length === 0) return 'No adaptation decisions have been made yet.';
    const lines = decisions.map((d, idx) => {
      const f = this.format(d);
      return [
        `[${idx + 1}] ${f.summary}`,
        `    Action: ${f.action}`,
        `    Reasoning: ${f.reasoning}`,
        `    Benefit: ${f.expectedBenefit}`,
        `    Estimated Improvement: ${f.estimatedImprovement}`,
        `    Confidence: ${f.confidence}`,
        `    Date: ${f.timestamp}`,
      ].join('\n');
    });
    return lines.join('\n\n');
  }

  private formatMetricName(metric: string): string {
    const names: Record<string, string> = {
      accuracy: 'Accuracy Rate',
      hintUsageRate: 'Hint Usage Rate',
      solveTimeRatio: 'Solve Time Ratio',
      consecutivePoorSessions: 'Consecutive Poor Sessions',
      consecutiveStrongSessions: 'Consecutive Strong Sessions',
      confidence: 'Confidence Score',
      goalProgress: 'Goal Completion',
      recentAccuracy: 'Recent Accuracy',
    };
    return names[metric] ?? metric;
  }

  private formatActionName(action: string): string {
    const names: Record<string, string> = {
      INCREASE_DIFFICULTY: 'Increase Difficulty',
      DECREASE_DIFFICULTY: 'Decrease Difficulty',
      SCHEDULE_REVIEW: 'Schedule Spaced Review',
      ACTIVATE_RECOVERY: 'Activate Recovery Plan',
      ACTIVATE_CHALLENGE: 'Activate Challenge Mode',
      ADVANCE_TOPIC: 'Advance to Next Topic',
      REORDER_TOPICS: 'Reorder Learning Path',
      REQUEST_CONTENT: 'Request AI-Generated Content',
      RECOMMEND_REST: 'Recommend Rest',
      RECOMMEND_AI_TUTOR: 'Recommend AI Tutor Session',
      REBALANCE_GOAL: 'Rebalance Learning Goal',
    };
    return names[action] ?? action;
  }

  private isTriggered(signal: any): boolean {
    if (signal.threshold === undefined) return false;
    const val = typeof signal.value === 'number' ? signal.value : 0;
    if (signal.direction === 'ABOVE') return val > signal.threshold;
    if (signal.direction === 'BELOW') return val < signal.threshold;
    return false;
  }
}
