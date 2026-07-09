// src/application/adaptive-learning/services/AdaptiveLearningService.ts
import { AdaptivePlan } from '../domain/models/AdaptivePlan';
import { LearningPath } from '../domain/models/LearningPath';
import { LearningSession } from '../domain/models/LearningSession';
import { SimulationResult } from '../domain/models/SimulationResult';
import { ReviewSchedule } from '../domain/models/ReviewSchedule';
import { AdaptationDecision } from '../domain/models/AdaptationDecision';
import { AdaptivePlanRepository } from '../infrastructure/persistence/repositories/AdaptivePlanRepository';
import { AdaptationDecisionRepository } from '../infrastructure/persistence/repositories/AdaptationDecisionRepository';
import { LearningPathService } from './LearningPathService';
import { ReviewScheduler } from './ReviewScheduler';
import { SimulationEngine } from './SimulationEngine';
import { ExplainabilityFormatter, FormattedDecision } from './ExplainabilityFormatter';
import { AdaptationOrchestrator, AdaptationInput } from '../engine/AdaptationOrchestrator';
import { Logger } from '@/infra/logger';

/**
 * AdaptiveLearningService is the top-level facade for the PALE module.
 *
 * External callers (API controllers, AI Coach, etc.) interact only with this
 * class — they never touch individual engines directly.
 *
 * PALE Engineering Rule: This service delegates all decision-making to
 * specialised engines. It never calls an LLM and never makes adaptation
 * decisions itself.
 */
export class AdaptiveLearningService {
  private readonly logger = new Logger('AdaptiveLearningService');

  private readonly planRepo = new AdaptivePlanRepository();
  private readonly decisionRepo = new AdaptationDecisionRepository();
  private readonly pathService = new LearningPathService();
  private readonly reviewer = new ReviewScheduler();
  private readonly simulator = new SimulationEngine();
  private readonly formatter = new ExplainabilityFormatter();
  private readonly orchestrator = new AdaptationOrchestrator();

  /**
   * Run a full adaptation pipeline for a student and return the updated plan.
   */
  async runAdaptation(input: AdaptationInput): Promise<AdaptivePlan> {
    const plan = await this.orchestrator.run(input);
    this.logger.info('Adaptation run complete', { studentId: input.studentId });
    return plan;
  }

  /**
   * Get the current adaptive plan for a student (or create one if missing).
   */
  async getPlan(studentId: string): Promise<AdaptivePlan | null> {
    const entity = await this.planRepo.findByStudent(studentId);
    return entity as unknown as AdaptivePlan ?? null;
  }

  /**
   * Build today's session for a student.
   * Delegates to AdaptationOrchestrator for session building.
   */
  async getSession(input: AdaptationInput): Promise<LearningSession> {
    return this.orchestrator.buildSession(input);
  }

  /**
   * Get the current learning path for a student.
   */
  async getLearningPath(
    studentId: string,
    options: { targetGrade?: number; competitionDate?: Date; masteredTopicIds?: string[] } = {}
  ): Promise<LearningPath> {
    return this.pathService.getOrBuildPath(studentId, options);
  }

  /**
   * Get recent adaptation decisions for a student.
   */
  async getDecisions(studentId: string, limit = 20): Promise<AdaptationDecision[]> {
    const entities = await this.decisionRepo.findByStudent(studentId, limit);
    return entities as unknown as AdaptationDecision[];
  }

  /**
   * Get formatted (human-readable) adaptation decisions.
   */
  async getFormattedDecisions(studentId: string, limit = 10): Promise<FormattedDecision[]> {
    const decisions = await this.getDecisions(studentId, limit);
    return decisions.map(d => this.formatter.format(d));
  }

  /**
   * Run the simulation engine for a student.
   */
  async simulate(
    studentId: string,
    currentState: Parameters<SimulationEngine['simulate']>[1]
  ): Promise<SimulationResult> {
    return this.simulator.simulate(studentId, currentState);
  }

  /**
   * Get upcoming review schedule for a student.
   */
  async getReviews(studentId: string, limit = 10): Promise<ReviewSchedule[]> {
    return this.reviewer.getUpcomingReviews(studentId, limit);
  }
}
