export interface CoachConfig {
  /** Minimum accuracy threshold to consider a topic mastered */
  readonly masteryAccuracy: number;
  /** Minimum retention score to consider knowledge retained */
  readonly retentionThreshold: number;
  /** Weight for accuracy in recommendation scoring */
  readonly weightAccuracy: number;
  /** Weight for retention in recommendation scoring */
  readonly weightRetention: number;
  /** Weight for hint dependency */
  readonly weightHintDependency: number;
  /** Maximum number of daily recommendations */
  readonly maxDailyRecommendations: number;
  /** Feature toggles */
  readonly enableRiskDetection: boolean;
  readonly enableMisconceptionAnalysis: boolean;
  /** LLM model identifier for personalization */
  readonly llmModelId: string;
}

export const defaultCoachConfig: CoachConfig = {
  masteryAccuracy: 0.85,
  retentionThreshold: 0.75,
  weightAccuracy: 0.4,
  weightRetention: 0.3,
  weightHintDependency: 0.2,
  maxDailyRecommendations: 5,
  enableRiskDetection: true,
  enableMisconceptionAnalysis: true,
  llmModelId: "gpt-4o-mini",
};
