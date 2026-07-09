// src/application/learning-intelligence/services/RetentionAnalyticsService.ts
import { Injectable } from '@nestjs/common';
import { RetentionAnalyticsRepository } from '../infrastructure/persistence/repositories/RetentionAnalyticsRepository';
import { RetentionAnalyticsEntity } from '../infrastructure/persistence/entities/RetentionAnalyticsEntity';

@Injectable()
export class RetentionAnalyticsService {
  constructor(private readonly repo: RetentionAnalyticsRepository) {}

  async calculateRetention(studentId: string, lastActivityDate: Date): Promise<RetentionAnalyticsEntity> {
    const now = new Date();
    const daysSinceLastPractice = Math.max(0, Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Standard half-life decay model: R = e^(-lambda * t)
    const decayFactor = 0.1; // decay parameter lambda
    const retentionScore = Math.exp(-decayFactor * daysSinceLastPractice);

    const entity = this.repo.create({
      studentId,
      retentionScore,
      decayFactor,
      daysSinceLastPractice,
      computedAt: now,
    });

    return this.repo.save(entity);
  }

  async getLatestForStudent(studentId: string): Promise<RetentionAnalyticsEntity | null> {
    const list = await this.repo.findByStudent(studentId);
    if (list.length === 0) return null;
    return list.sort((a, b) => b.computedAt.getTime() - a.computedAt.getTime())[0];
  }
}
