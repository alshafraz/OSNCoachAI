// src/application/learning-intelligence/services/ConceptAnalyticsService.ts
import { Injectable } from '@nestjs/common';
import { ConceptAnalyticsRepository } from '../infrastructure/persistence/repositories/ConceptAnalyticsRepository';
import { ConceptAnalyticsEntity } from '../infrastructure/persistence/entities/ConceptAnalyticsEntity';

/**
 * Service responsible for computing and retrieving concept‑level analytics.
 * It receives raw learning events, aggregates them per concept and stores
 * the resulting analytics in the `concept_analytics` table.
 */
@Injectable()
export class ConceptAnalyticsService {
  constructor(private readonly repo: ConceptAnalyticsRepository) {}

  /**
   * Process a batch of learning events related to a specific concept.
   * This is a placeholder implementation – real logic would apply IRT,
   * dependency graphs, etc.
   */
  async processEvents(conceptId: string, studentId: string, events: any[]): Promise<ConceptAnalyticsEntity> {
    // Simple aggregation example: compute average mastery score from payloads
    const masteryValues = events.map(e => Number(e.payload.mastery) || 0);
    const mastery = masteryValues.reduce((a, b) => a + b, 0) / (masteryValues.length || 1);
    const dependencyCoverage = 0.8; // placeholder
    const misconceptionFrequency = 0.1; // placeholder
    const retention = 0.9; // placeholder
    const questionExposure = events.length;
    const historicalProgress = mastery; // placeholder

    const entity = this.repo.create({
      conceptId,
      studentId,
      mastery,
      dependencyCoverage,
      misconceptionFrequency,
      retention,
      questionExposure,
      historicalProgress,
      lastUpdated: new Date(),
    });
    return this.repo.save(entity);
  }

  /** Retrieve recent analytics for a concept */
  async getLatest(conceptId: string, limit = 10): Promise<ConceptAnalyticsEntity[]> {
    return this.repo.findLatestByConcept(conceptId, limit);
  }
}
