// src/application/learning-intelligence/services/TopicAnalyticsService.ts
import { TopicAnalyticsRepository } from '../infrastructure/persistence/repositories/TopicAnalyticsRepository';
import { Logger } from '@/infra/logger';

/**
 * Service to retrieve topic‑level analytics.
 * For now it simply returns the latest stored analytics for a topic.
 */
export class TopicAnalyticsService {
  private readonly logger = new Logger('TopicAnalyticsService');
  private readonly repo = new TopicAnalyticsRepository();

  async getTopicAnalytics(topicId: string): Promise<any> {
    try {
      this.logger.info('Fetching topic analytics', { topicId });
      // In-memory lookup: fetch for student 'all' or default values
      const analytics = await this.repo.findByStudentAndTopic('all', topicId);
      if (analytics) return analytics;
      
      // Default fallback mock return value
      return {
        topicId,
        studentId: 'all',
        accuracy: 0.75,
        solveTime: 120,
        confidence: 0.8,
        difficultyTrend: 0.05,
        retention: 0.85,
        mastery: 0.7,
        learningVelocity: 0.1,
        questionVolume: 15,
        improvementTrend: 0.02,
        weaknessScore: 0.1,
        lastUpdated: new Date(),
      };
    } catch (err) {
      this.logger.error('Failed to fetch topic analytics', { error: err, topicId });
      throw err;
    }
  }
}
