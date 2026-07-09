// src/application/learning-intelligence/infrastructure/persistence/repositories/TopicAnalyticsRepository.ts
import { TopicAnalyticsEntity } from '../entities/TopicAnalyticsEntity';

export class TopicAnalyticsRepository {
  private static store: TopicAnalyticsEntity[] = [];

  async findByStudentAndTopic(studentId: string, topicId: string): Promise<TopicAnalyticsEntity | null> {
    return TopicAnalyticsRepository.store.find((t) => t.studentId === studentId && t.topicId === topicId) ?? null;
  }

  async findAllByStudent(studentId: string): Promise<TopicAnalyticsEntity[]> {
    return TopicAnalyticsRepository.store
      .filter((t) => t.studentId === studentId)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  async findTopicsByWeaknessScore(studentId: string, minScore: number = 0.5): Promise<TopicAnalyticsEntity[]> {
    return TopicAnalyticsRepository.store
      .filter((t) => t.studentId === studentId && t.weaknessScore >= minScore)
      .sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  async save(entity: TopicAnalyticsEntity | TopicAnalyticsEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `ta-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = TopicAnalyticsRepository.store.findIndex((t) => t.id === item.id);
      if (existingIdx >= 0) {
        TopicAnalyticsRepository.store[existingIdx] = item;
      } else {
        TopicAnalyticsRepository.store.push(item);
      }
    }
    return entity;
  }
}
