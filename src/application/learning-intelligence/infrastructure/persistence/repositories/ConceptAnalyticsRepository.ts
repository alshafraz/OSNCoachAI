// src/application/learning-intelligence/infrastructure/persistence/repositories/ConceptAnalyticsRepository.ts
import { ConceptAnalyticsEntity } from '../entities/ConceptAnalyticsEntity';

export class ConceptAnalyticsRepository {
  private static store: ConceptAnalyticsEntity[] = [];

  async findLatestByConcept(conceptId: string, limit: number = 100): Promise<ConceptAnalyticsEntity[]> {
    return ConceptAnalyticsRepository.store
      .filter((c) => c.conceptId === conceptId)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, limit);
  }

  async save(entity: ConceptAnalyticsEntity | ConceptAnalyticsEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `ca-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = ConceptAnalyticsRepository.store.findIndex((c) => c.id === item.id);
      if (existingIdx >= 0) {
        ConceptAnalyticsRepository.store[existingIdx] = item;
      } else {
        ConceptAnalyticsRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<ConceptAnalyticsEntity>): ConceptAnalyticsEntity {
    const entity = new ConceptAnalyticsEntity();
    Object.assign(entity, data);
    return entity;
  }
}
