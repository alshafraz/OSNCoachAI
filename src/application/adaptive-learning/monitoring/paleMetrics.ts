// src/application/adaptive-learning/monitoring/paleMetrics.ts

/**
 * Prometheus-style observability counters for the PALE module.
 * In production, these would emit to a real metrics backend.
 */
class SimpleCounter {
  private _value = 0;
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  increment(by = 1): void {
    this._value += by;
  }

  get value(): number {
    return this._value;
  }

  reset(): void {
    this._value = 0;
  }

  serialize(): { name: string; value: number } {
    return { name: this.name, value: this._value };
  }
}

export const paleMetrics = {
  /** Total adaptation pipeline runs */
  adaptationRuns: new SimpleCounter('pale_adaptation_runs_total'),

  /** Total difficulty adjustments made */
  difficultyAdjustments: new SimpleCounter('pale_difficulty_adjustments_total'),

  /** Total reviews scheduled */
  reviewsScheduled: new SimpleCounter('pale_reviews_scheduled_total'),

  /** Total recovery plans activated */
  recoveryPlansActivated: new SimpleCounter('pale_recovery_plans_activated_total'),

  /** Total challenge plans activated */
  challengePlansActivated: new SimpleCounter('pale_challenge_plans_activated_total'),

  /** Total sessions planned */
  sessionsPlanned: new SimpleCounter('pale_sessions_planned_total'),

  /** Total question selections performed */
  questionSelections: new SimpleCounter('pale_question_selections_total'),

  /** Total simulation runs */
  simulationRuns: new SimpleCounter('pale_simulation_runs_total'),

  /** Total goal rebalancing actions */
  goalRebalances: new SimpleCounter('pale_goal_rebalances_total'),

  /** Snapshot all metrics as plain objects */
  snapshot(): Record<string, number> {
    return Object.fromEntries(
      Object.entries(paleMetrics)
        .filter(([, v]) => v instanceof SimpleCounter)
        .map(([key, v]) => [key, (v as SimpleCounter).value])
    );
  },
};
