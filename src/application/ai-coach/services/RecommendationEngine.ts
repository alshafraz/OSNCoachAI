// src/application/ai-coach/services/RecommendationEngine.ts
import { defaultCoachConfig } from '../config/coachConfig';

/**
 * Simple recommendation engine.
 * Uses rule results and config weights to score a few possible actions.
 * Returns the highest‑scoring recommendation.
 */
export interface RecommendationResult {
  id: string;
  action: string;
  priorityScore: number;
  evidenceIds: string[];
}

export class RecommendationEngine {
  constructor(private readonly ruleResults: Record<string, any>, private readonly config: typeof defaultCoachConfig) {}

  generate(): RecommendationResult {
    // Define candidate actions
    const candidates = [
      { action: 'reviewWeakTopics', baseScore: this.ruleResults.scores.accuracyWeight },
      { action: 'practiceHints', baseScore: this.ruleResults.scores.hintWeight },
      { action: 'takeMockExam', baseScore: this.ruleResults.scores.retentionWeight },
    ];

    // Adjust scores based on flags
    if (this.ruleResults.weakness) {
      candidates.find(c => c.action === 'reviewWeakTopics')!.baseScore += 0.2;
    }
    if (this.ruleResults.risk) {
      candidates.find(c => c.action === 'practiceHints')!.baseScore -= 0.1;
    }
    if (this.ruleResults.misconception) {
      candidates.find(c => c.action === 'reviewWeakTopics')!.baseScore += 0.1;
    }

    // Pick top candidate
    const top = candidates.reduce((prev, cur) => (cur.baseScore > prev.baseScore ? cur : prev));
    return {
      id: 'rec-' + Math.random().toString(36).substr(2, 9),
      action: top.action,
      priorityScore: Number(top.baseScore.toFixed(3)),
      evidenceIds: [], // will be filled later by orchestrator if needed
    };
  }
}
