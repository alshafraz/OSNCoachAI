// src/application/adaptive-learning/services/ChallengeEngine.ts
import { paleConfig } from '../config/paleConfig';
import { ChallengePlan, ChallengeAcceleration } from '../domain/models/ChallengePlan';
import { AdaptationDecision } from '../domain/models/AdaptationDecision';
import { AdaptationDecisionRepository } from '../infrastructure/persistence/repositories/AdaptationDecisionRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * ChallengeEngine activates when a student consistently excels.
 * It generates a structured set of accelerations to push the student further.
 *
 * Activation conditions (from paleConfig):
 *   - Accuracy > challengeThreshold for N consecutive sessions
 *   - High confidence AND fast solve time
 */
export class ChallengeEngine {
  private readonly logger = new Logger('ChallengeEngine');
  private readonly decisionRepo = new AdaptationDecisionRepository();
  private readonly cfg = paleConfig.challenge;

  /**
   * Check whether challenge mode should activate and generate a plan if so.
   */
  async generateChallengePlan(
    studentId: string,
    topicId: string,
    evidence: {
      recentAccuracy: number;
      consecutiveStrongSessions: number;
      avgSolveTimeRatio: number;
      confidence: number;
    }
  ): Promise<ChallengePlan | null> {
    const shouldActivate =
      evidence.recentAccuracy >= this.cfg.accuracyThreshold &&
      evidence.consecutiveStrongSessions >= this.cfg.consecutiveStrongSessions &&
      evidence.confidence >= this.cfg.minConfidence;

    if (!shouldActivate) return null;

    const accelerations: ChallengeAcceleration[] = [
      {
        type: 'INCREASE_DIFFICULTY',
        description: 'Step difficulty up one level to maintain engagement and growth.',
        priority: 1,
      },
      {
        type: 'GENERATE_OLYMPIAD_QUESTIONS',
        description: 'Request ACGP to generate olympiad-level questions for this topic.',
        priority: 2,
      },
    ];

    if (evidence.avgSolveTimeRatio <= this.cfg.fastSolveRatio) {
      accelerations.push({
        type: 'RECOMMEND_FASTER_METHODS',
        description: 'Student is solving quickly — introduce more efficient mathematical methods.',
        priority: 3,
      });
    }

    accelerations.push(
      {
        type: 'INTRODUCE_NEW_CONCEPT',
        description: 'Introduce the next concept in the learning path earlier than scheduled.',
        priority: 4,
      },
      {
        type: 'REDUCE_HINT_AVAILABILITY',
        description: 'Reduce hint availability to increase challenge and build independence.',
        priority: 5,
      }
    );

    const plan: ChallengePlan = {
      id: uuidv4(),
      studentId,
      topicId,
      activatedAt: new Date(),
      isActive: true,
      triggerEvidence: evidence,
      accelerations,
      reasoning: `Student achieved ${(evidence.recentAccuracy * 100).toFixed(0)}% accuracy over ${evidence.consecutiveStrongSessions} consecutive sessions with high confidence (${(evidence.confidence * 100).toFixed(0)}%). Challenge mode activated to maintain engagement and accelerate olympiad readiness.`,
    };

    // Log as an adaptation decision
    const decision: AdaptationDecision = {
      id: uuidv4(),
      studentId,
      topicId,
      action: 'ACTIVATE_CHALLENGE',
      decisionSummary: `Challenge plan activated for topic "${topicId}".`,
      evidenceUsed: [
        { metric: 'recentAccuracy', value: evidence.recentAccuracy, threshold: this.cfg.accuracyThreshold, direction: 'ABOVE' },
        { metric: 'consecutiveStrongSessions', value: evidence.consecutiveStrongSessions, threshold: this.cfg.consecutiveStrongSessions, direction: 'ABOVE' },
        { metric: 'confidence', value: evidence.confidence, threshold: this.cfg.minConfidence, direction: 'ABOVE' },
      ],
      reasoning: plan.reasoning,
      expectedBenefit: 'Accelerate mastery and olympiad readiness for excelling students.',
      estimatedImprovement: 18,
      confidence: 0.90,
      modelVersion: '1.0.0',
      createdAt: new Date(),
    };

    await this.decisionRepo.save(decision as any);
    this.logger.info('Challenge plan activated', { studentId, topicId });
    return plan;
  }
}
