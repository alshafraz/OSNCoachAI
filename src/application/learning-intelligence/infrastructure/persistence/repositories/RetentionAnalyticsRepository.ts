// src/application/learning-intelligence/infrastructure/persistence/repositories/RetentionAnalyticsRepository.ts
import { RetentionAnalyticsEntity } from '../entities/RetentionAnalyticsEntity';

export class RetentionAnalyticsRepository {
  private static store: RetentionAnalyticsEntity[] = [];

  async findByStudent(studentId: string): Promise<RetentionAnalyticsEntity[]> {
    return RetentionAnalyticsRepository.store.filter((r) => r.studentId === studentId);
  }

  async save(entity: RetentionAnalyticsEntity | RetentionAnalyticsEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `ra-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = RetentionAnalyticsRepository.store.findIndex((r) => r.id === item.id);
      if (existingIdx >= 0) {
        RetentionAnalyticsRepository.store[existingIdx] = item;
      } else {
        RetentionAnalyticsRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<RetentionAnalyticsEntity>): RetentionAnalyticsEntity {
    const entity = new RetentionAnalyticsEntity();
    Object.assign(entity, data);
    return entity;
  }
}
