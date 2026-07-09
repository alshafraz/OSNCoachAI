// src/application/learning-intelligence/services/InsightEngine.ts
import { Injectable } from '@nestjs/common';
import { InsightRepository } from '../infrastructure/persistence/repositories/InsightRepository';
import { InsightEntity } from '../infrastructure/persistence/entities/InsightEntity';
import { ConceptAnalyticsEntity } from '../infrastructure/persistence/entities/ConceptAnalyticsEntity';
import { RetentionAnalyticsEntity } from '../infrastructure/persistence/entities/RetentionAnalyticsEntity';

@Injectable()
export class InsightEngine {
  private readonly insightRepo: InsightRepository;

  constructor(insightRepo?: InsightRepository) {
    this.insightRepo = insightRepo ?? new InsightRepository();
  }

  async storeInsights(trends: string[], events: any[]): Promise<void> {
    const studentId = events[0]?.studentId ?? 'unknown';
    const insights = trends.map((trend) => {
      return this.insightRepo.create({
        studentId,
        type: 'trend',
        payload: { trend, message: `Detected learning trend: ${trend}` },
        createdAt: new Date(),
      });
    });
    if (insights.length > 0) {
      await this.insightRepo.save(insights);
    }
  }

  async storeRetention(retentionScore: number, events: any[]): Promise<void> {
    const studentId = events[0]?.studentId ?? 'unknown';
    const insight = this.insightRepo.create({
      studentId,
      type: 'retention',
      payload: { retentionScore, message: `Estimated short-term retention: ${(retentionScore * 100).toFixed(0)}%` },
      createdAt: new Date(),
    });
    await this.insightRepo.save(insight);
  }

  async storePredictions(predictions: any[], events: any[]): Promise<void> {
    const studentId = events[0]?.studentId ?? 'unknown';
    const insights = predictions.map((pred) => {
      return this.insightRepo.create({
        studentId,
        type: 'prediction',
        payload: { prediction: pred, message: `Predicted metric: ${pred.metric}` },
        createdAt: new Date(),
      });
    });
    if (insights.length > 0) {
      await this.insightRepo.save(insights);
    }
  }

  async generateInsights(
    studentId: string,
    concepts: ConceptAnalyticsEntity[],
    retention: RetentionAnalyticsEntity | null
  ): Promise<InsightEntity[]> {
    const insights: InsightEntity[] = [];

    for (const concept of concepts) {
      if (concept.misconceptionFrequency > 0.3) {
        insights.push(
          this.insightRepo.create({
            studentId,
            type: 'ConceptMisconceptionAlert',
            payload: {
              conceptId: concept.conceptId,
              message: `Student has high misconception rates (${(concept.misconceptionFrequency * 100).toFixed(0)}%) in concept ${concept.conceptId}. Recommended targeted review.`,
              severity: 'high',
              metricValue: concept.misconceptionFrequency,
            },
            createdAt: new Date(),
          })
        );
      }
    }

    if (retention && retention.retentionScore < 0.6) {
      insights.push(
        this.insightRepo.create({
          studentId,
          type: 'RetentionRiskAlert',
          payload: {
            message: `Retention score decayed to ${(retention.retentionScore * 100).toFixed(0)}% after ${retention.daysSinceLastPractice} days of inactivity.`,
            daysSinceLastPractice: retention.daysSinceLastPractice,
            severity: 'medium',
            metricValue: retention.retentionScore,
          },
          createdAt: new Date(),
        })
      );
    }

    if (insights.length > 0) {
      await this.insightRepo.save(insights);
      return insights;
    }
    return [];
  }
}
