// src/application/adaptive-learning/domain/models/SimulationResult.ts

/**
 * Forward projection of a student's learning readiness over time.
 * Produced by SimulationEngine.
 */
export interface SimulationResult {
  id: string;
  studentId: string;
  simulatedAt: Date;
  /** Projected readiness per forecast horizon */
  projections: ReadinessProjection[];
  /** Estimated date when competition readiness goal (e.g. 80%) will be reached */
  estimatedReadinessDate?: Date;
  /** Topics most at risk of being under-prepared */
  atRiskTopics: string[];
  /** Topics on track or ahead of schedule */
  onTrackTopics: string[];
  /** Estimated competition performance percentile (0-100) */
  estimatedCompetitionPercentile: number;
}

export interface ReadinessProjection {
  daysFromNow: number;
  overallReadiness: number;  // 0-1
  retentionScore: number;    // 0-1
  masteryScore: number;      // 0-1
  goalCompletionRate: number; // 0-1
}
