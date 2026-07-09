// src/application/learning-intelligence/infrastructure/persistence/repositories/AnalyticsJobLogRepository.ts
import { AnalyticsJobLogEntity } from '../entities/AnalyticsJobLogEntity';

export class AnalyticsJobLogRepository {
  private static store: AnalyticsJobLogEntity[] = [];

  async save(entity: AnalyticsJobLogEntity | AnalyticsJobLogEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `aj-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = AnalyticsJobLogRepository.store.findIndex((a) => a.id === item.id);
      if (existingIdx >= 0) {
        AnalyticsJobLogRepository.store[existingIdx] = item;
      } else {
        AnalyticsJobLogRepository.store.push(item);
      }
    }
    return entity;
  }
}
