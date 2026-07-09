// src/application/adaptive-learning/services/RecoveryEngine.ts
import { paleConfig } from '../config/paleConfig';
import { RecoveryPlan, RecoveryIntervention } from '../domain/models/RecoveryPlan';
import { AdaptationDecision } from '../domain/models/AdaptationDecision';
import { AdaptationDecisionRepository } from '../infrastructure/persistence/repositories/AdaptationDecisionRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * RecoveryEngine activates when a student shows persistent poor performance.
 * It generates a structured set of interventions to get them back on track.
 *
 * Activation conditions (from paleConfig):
 *   - Accuracy < recoveryThreshold for N consecutive sessions
 *   - Hint usage > hintSpikeThreshold
 */
export class RecoveryEngine {
  private readonly logger = new Logger('RecoveryEngine');
  private readonly decisionRepo = new AdaptationDecisionRepository();
  private readonly cfg = paleConfig.recovery;

  /**
   * Check whether recovery should be activated and generate a plan if so.
   */
  async generateRecoveryPlan(
    studentId: string,
    topicId: string,
    evidence: {
      recentAccuracy: number;
      consecutivePoorSessions: number;
      hintUsageRate: number;
    }
  ): Promise<RecoveryPlan | null> {
    const shouldActivate =
      evidence.recentAccuracy <= this.cfg.accuracyThreshold &&
      evidence.consecutivePoorSessions >= this.cfg.consecutivePoorSessions;

    const hintSpike = evidence.hintUsageRate >= this.cfg.hintSpikethreshold;

    if (!shouldActivate && !hintSpike) return null;

    const interventions: RecoveryIntervention[] = [
      {
        type: 'REDUCE_DIFFICULTY',
        description: 'Step difficulty down one level to restore confidence.',
        priority: 1,
      },
      {
        type: 'INCREASE_REVIEW_FREQUENCY',
        description: 'Schedule daily micro-reviews for this topic.',
        priority: 2,
      },
    ];

    if (evidence.hintUsageRate >= this.cfg.hintSpikethreshold) {
      interventions.push({
        type: 'RECOMMEND_AI_TUTOR',
        description: 'High hint usage detected — recommend an AI Tutor session to clarify concepts.',
        priority: 3,
      });
    }

    if (evidence.recentAccuracy < 0.35) {
      interventions.push({
        type: 'REBUILD_PREREQUISITE',
        description: 'Very low accuracy — check whether prerequisite topics need revision.',
        priority: 4,
      });
    }

    interventions.push({
      type: 'DELAY_ASSESSMENT',
      description: 'Do not schedule a formal assessment until accuracy recovers above 60%.',
      priority: 5,
    });

    const plan: RecoveryPlan = {
      id: uuidv4(),
      studentId,
      topicId,
      activatedAt: new Date(),
      isActive: true,
      triggerEvidence: {
        recentAccuracy: evidence.recentAccuracy,
        consecutivePoorSessions: evidence.consecutivePoorSessions,
        hintUsageRate: evidence.hintUsageRate,
      },
      interventions,
      reasoning: `Student accuracy (${(evidence.recentAccuracy * 100).toFixed(0)}%) fell below threshold (${(this.cfg.accuracyThreshold * 100).toFixed(0)}%) for ${evidence.consecutivePoorSessions} consecutive sessions. Recovery plan activated to rebuild foundational understanding before advancing.`,
    };

    // Log as an adaptation decision
    const decision: AdaptationDecision = {
      id: uuidv4(),
      studentId,
      topicId,
      action: 'ACTIVATE_RECOVERY',
      decisionSummary: `Recovery plan activated for topic "${topicId}".`,
      evidenceUsed: [
        { metric: 'recentAccuracy', value: evidence.recentAccuracy, threshold: this.cfg.accuracyThreshold, direction: 'BELOW' },
        { metric: 'consecutivePoorSessions', value: evidence.consecutivePoorSessions, threshold: this.cfg.consecutivePoorSessions, direction: 'ABOVE' },
      ],
      reasoning: plan.reasoning,
      expectedBenefit: 'Restore student confidence and accuracy before progression.',
      estimatedImprovement: 20,
      confidence: 0.85,
      modelVersion: '1.0.0',
      createdAt: new Date(),
    };

    await this.decisionRepo.save(decision as any);
    this.logger.warn('Recovery plan activated', { studentId, topicId });
    return plan;
  }
}
