// src/application/adaptive-learning/services/SimulationEngine.ts
import { paleConfig } from '../config/paleConfig';
import { SimulationResult, ReadinessProjection } from '../domain/models/SimulationResult';
import { SimulationResultRepository } from '../infrastructure/persistence/repositories/SimulationResultRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * SimulationEngine projects a student's learning readiness forward in time.
 *
 * Model:
 *   - Readiness grows as question volume × mastery rate per day
 *   - Retention decays exponentially from last practice date
 *   - Combined readiness = mastery × retention
 */
export class SimulationEngine {
  private readonly logger = new Logger('SimulationEngine');
  private readonly repo = new SimulationResultRepository();
  private readonly cfg = paleConfig.simulation;

  /**
   * Run a forward projection simulation for a student.
   */
  async simulate(
    studentId: string,
    currentState: {
      overallMastery: number;          // 0-1
      overallRetention: number;        // 0-1
      topicsMastered: number;
      totalTopics: number;
      dailyLearningRate: number;       // mastery gain per day (0-0.1)
      lastPracticeDate: Date;
      competitionDate?: Date;
      atRiskTopics: string[];
      onTrackTopics: string[];
    }
  ): Promise<SimulationResult> {
    const projections: ReadinessProjection[] = this.cfg.projectionDays.map(days => {
      // Project mastery growth
      const masteryGrowth = Math.min(1, currentState.overallMastery + (currentState.dailyLearningRate * days));

      // Project retention decay
      const daysSinceLastPractice = 0; // student is actively practicing
      const decayFactor = 0.95; // from LIP config
      const retentionDecay = Math.pow(decayFactor, daysSinceLastPractice + (days * 0.1));
      const projectedRetention = Math.min(1, currentState.overallRetention * retentionDecay);

      const overallReadiness = masteryGrowth * projectedRetention;
      const goalCompletionRate = currentState.totalTopics > 0
        ? Math.min(1, (currentState.topicsMastered + (days * currentState.dailyLearningRate * 3)) / currentState.totalTopics)
        : 0;

      return {
        daysFromNow: days,
        overallReadiness,
        retentionScore: projectedRetention,
        masteryScore: masteryGrowth,
        goalCompletionRate,
      };
    });

    // Estimate date when readiness hits 80%
    let estimatedReadinessDate: Date | undefined;
    const targetReadiness = 0.80;
    if (currentState.overallMastery < targetReadiness) {
      const daysNeeded = (targetReadiness - currentState.overallMastery) / Math.max(0.001, currentState.dailyLearningRate);
      estimatedReadinessDate = new Date();
      estimatedReadinessDate.setDate(estimatedReadinessDate.getDate() + Math.ceil(daysNeeded));
    }

    // Estimate competition percentile
    const maxProjection = projections[projections.length - 1];
    const estimatedCompetitionPercentile = Math.round(maxProjection.overallReadiness * 85); // scale 0-85th percentile

    const result: SimulationResult = {
      id: uuidv4(),
      studentId,
      simulatedAt: new Date(),
      projections,
      estimatedReadinessDate,
      atRiskTopics: currentState.atRiskTopics,
      onTrackTopics: currentState.onTrackTopics,
      estimatedCompetitionPercentile,
    };

    await this.repo.save(result as any);
    this.logger.info('Simulation complete', {
      studentId,
      day7Readiness: projections[0]?.overallReadiness?.toFixed(2),
      estimatedCompetitionPercentile,
    });

    return result;
  }

  /** Retrieve the latest simulation result for a student. */
  async getLatestSimulation(studentId: string): Promise<SimulationResult | null> {
    const entity = await this.repo.findLatestByStudent(studentId);
    return entity as unknown as SimulationResult ?? null;
  }
}
