// src/application/learning-intelligence/services/SkillAnalyticsService.ts
import { Injectable } from '@nestjs/common';
import { LearningEvent } from '../domain/models/LearningEvent';
import { SkillAnalyticsRepository } from '../infrastructure/persistence/repositories/SkillAnalyticsRepository';
import { SkillAnalyticsEntity } from '../infrastructure/persistence/entities/SkillAnalyticsEntity';

/**
 * Service responsible for aggregating skill‑level analytics from learning events.
 */
@Injectable()
export class SkillAnalyticsService {
  constructor(private readonly repo: SkillAnalyticsRepository) {}

  /**
   * Process a batch of learning events and produce skill analytics entities.
   */
  async compute(events: LearningEvent[]): Promise<SkillAnalyticsEntity[]> {
    const studentId = events[0]?.studentId ?? 'unknown';
    const skillMap: Record<string, { count: number; totalScore: number }> = {};
    for (const ev of events) {
      const skill = ev.metadata?.skill ?? 'unknown';
      if (!skillMap[skill]) {
        skillMap[skill] = { count: 0, totalScore: 0 };
      }
      skillMap[skill].count += 1;
      const score = Number(ev.metadata?.score ?? 0);
      skillMap[skill].totalScore += score;
    }
    const now = new Date();
    
    const entities: SkillAnalyticsEntity[] = [];
    for (const [skill, data] of Object.entries(skillMap)) {
      const entity = new SkillAnalyticsEntity();
      entity.skillName = skill;
      entity.studentId = studentId;
      entity.mastery = data.count ? data.totalScore / data.count : 0;
      entity.lastUpdated = now;
      entities.push(entity);
    }
    
    return entities;
  }

  /** Persist computed skill analytics */
  async persist(entities: SkillAnalyticsEntity[]): Promise<void> {
    await this.repo.save(entities);
  }
}
