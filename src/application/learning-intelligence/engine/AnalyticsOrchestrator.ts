// src/application/learning-intelligence/engine/AnalyticsOrchestrator.ts
import { LearningAnalyticsService } from '../services/LearningAnalyticsService';
import { MetricEngine } from '../services/MetricEngine';
import { TrendEngine } from '../services/TrendEngine';
import { RetentionEngine } from '../services/RetentionEngine';
import { PredictionEngine } from '../services/PredictionEngine';
import { InsightEngine } from '../services/InsightEngine';
import { Logger } from '@/infra/logger';
import { LearningEvent } from '../domain/models/LearningEvent';
import { MetricSnapshot } from '../domain/models/MetricSnapshot';
import { MetricSnapshotRepository } from '../infrastructure/persistence/repositories/MetricSnapshotRepository';
import { AnalyticsJobLogRepository } from '../infrastructure/persistence/repositories/AnalyticsJobLogRepository';

/**
 * Orchestrates the LIP pipeline.
 * Runs clean in-process execution with no direct TypeORM database dependency.
 */
export class AnalyticsOrchestrator {
  private readonly logger = new Logger('AnalyticsOrchestrator');
  private readonly analyticsService = new LearningAnalyticsService();
  private readonly metricEngine = new MetricEngine();
  private readonly trendEngine = new TrendEngine();
  private readonly retentionEngine = new RetentionEngine();
  private readonly predictionEngine = new PredictionEngine();
  private readonly insightEngine = new InsightEngine();
  private readonly snapshotRepo = new MetricSnapshotRepository();
  private readonly jobLogRepo = new AnalyticsJobLogRepository();

  /**
   * Executes a single aggregation run.
   */
  async runOnce(): Promise<void> {
    const start = Date.now();
    try {
      // 1. Fetch pending events
      const events: LearningEvent[] = await this.analyticsService.fetchPendingEvents();
      if (events.length === 0) {
        this.logger.info('No pending learning events – skipping run');
        return;
      }

      // 2. Compute metric snapshots
      const snapshots: MetricSnapshot[] = await this.metricEngine.computeMetrics(events);
      // Persist snapshots
      await this.snapshotRepo.save(snapshots as any);

      // 3. Detect trends
      const trends = this.trendEngine.detectTrends(events);
      await this.insightEngine.storeInsights(trends, events);

      // 4. Estimate retention
      const retentionScore = this.retentionEngine.estimateRetention(events);
      await this.insightEngine.storeRetention(retentionScore, events);

      // 5. Generate predictions
      const predictions = this.predictionEngine.generatePredictions(events);
      await this.insightEngine.storePredictions(predictions, events);

      // 6. Log job success
      await this.jobLogRepo.save({
        startTime: new Date(start),
        endTime: new Date(),
        processedEvents: events.length,
        status: 'SUCCESS',
      } as any);

      this.logger.info('Analytics pipeline completed', {
        processedEvents: events.length,
        durationMs: Date.now() - start,
      });
    } catch (err) {
      this.logger.error('Analytics pipeline failed', { error: err });
      await this.jobLogRepo.save({
        startTime: new Date(start),
        endTime: new Date(),
        processedEvents: 0,
        status: 'FAILURE',
        errorMessage: (err as Error).message,
      } as any);
      throw err;
    }
  }
}
