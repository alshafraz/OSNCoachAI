import { CoachEventBus } from '../engine/CoachEventBus';
import { CoachSession } from './domain/models/CoachSession';
import { EvidenceCollector } from './services/EvidenceCollector';
import { MetricsComputer } from './services/MetricsComputer';
import { RulesEngine } from './services/RulesEngine';
import { RecommendationEngine } from './services/RecommendationEngine';
import { ValidationEngine } from './services/ValidationEngine';
import { PersonalizationService } from './services/PersonalizationService';
import { XAIFormatter } from './services/XAIFormatter';
import { defaultCoachConfig } from './config/coachConfig';
import { LearningAnalyticsService } from '../learning-intelligence/services/LearningAnalyticsService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Orchestrates the AI Coach pipeline for a single session.
 * Steps follow the strict order defined in the implementation plan.
 *
 * After the recommendation is delivered the orchestrator publishes a
 * `sessionCompleted` learning event to the LIP so that analytics data
 * is kept in sync without the LIP ever making decisions.
 */
export class CoachOrchestrator {
  private readonly eventBus: CoachEventBus;
  private readonly session: CoachSession;
  private readonly analyticsService: LearningAnalyticsService;

  constructor(session: CoachSession) {
    this.session = session;
    this.eventBus = new CoachEventBus();
    this.analyticsService = new LearningAnalyticsService();
  }

  /** Run the full pipeline and return the final formatted recommendation block */
  async runPipeline(): Promise<string> {
    // 1. Collect evidence
    const evidenceCollector = new EvidenceCollector(this.session.id);
    const evidences = await evidenceCollector.collect();
    this.eventBus.emit('evidenceCollected', { sessionId: this.session.id, count: evidences.length });

    // 2. Compute metrics
    const metricsComputer = new MetricsComputer(evidences);
    const metrics = metricsComputer.compute();
    this.eventBus.emit('metricsComputed', { sessionId: this.session.id, metricsCount: Object.keys(metrics).length });

    // 3. Apply Rules
    const rulesEngine = new RulesEngine(metrics, defaultCoachConfig);
    const ruleResults = rulesEngine.evaluate();

    // 4. Generate Recommendations
    const recommendationEngine = new RecommendationEngine(ruleResults, defaultCoachConfig);
    const recommendation = recommendationEngine.generate();
    this.eventBus.emit('recommendationGenerated', { sessionId: this.session.id, recommendationId: recommendation.id });

    // 5. Validate Recommendation
    const validationEngine = new ValidationEngine(recommendation);
    const valid = validationEngine.validate();
    if (!valid) {
      throw new Error('Recommendation validation failed');
    }

    // 6. Personalize with LLM
    const personalization = await new PersonalizationService().personalize(recommendation);

    // 7. Build XAI explanation block
    const xai = new XAIFormatter().format(recommendation, evidences, personalization);
    this.eventBus.emit('recommendationDelivered', { sessionId: this.session.id, recommendationId: recommendation.id });

    // 8. Publish learning event to LIP (fire-and-forget – never blocks coaching flow)
    this.analyticsService.processEvent({
      id: uuidv4(),
      studentId: this.session.studentId,
      eventType: 'sessionCompleted',
      payload: {
        sessionId: this.session.id,
        recommendationId: recommendation.id,
        metricsCount: Object.keys(metrics).length,
        evidenceCount: evidences.length,
      },
      timestamp: new Date(),
      metadata: {},
    }).catch((err) => {
      // Swallow error – LIP failure must never break the coach session
      console.error('[CoachOrchestrator] Failed to push sessionCompleted event to LIP', err);
    });

    return xai;
  }

  /** expose the event bus for external subscription */
  getEventBus(): CoachEventBus {
    return this.eventBus;
  }
}

