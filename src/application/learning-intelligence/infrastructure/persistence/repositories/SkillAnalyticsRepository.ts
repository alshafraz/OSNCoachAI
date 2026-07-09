// src/application/learning-intelligence/infrastructure/persistence/repositories/SkillAnalyticsRepository.ts
import { SkillAnalyticsEntity } from '../entities/SkillAnalyticsEntity';

export class SkillAnalyticsRepository {
  private static store: SkillAnalyticsEntity[] = [];

  async findLatestBySkill(skillName: string, limit: number = 100): Promise<SkillAnalyticsEntity[]> {
    return SkillAnalyticsRepository.store
      .filter((s) => s.skillName === skillName)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, limit);
  }

  async save(entity: SkillAnalyticsEntity | SkillAnalyticsEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `sa-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = SkillAnalyticsRepository.store.findIndex((s) => s.id === item.id);
      if (existingIdx >= 0) {
        SkillAnalyticsRepository.store[existingIdx] = item;
      } else {
        SkillAnalyticsRepository.store.push(item);
      }
    }
    return entity;
  }
}
