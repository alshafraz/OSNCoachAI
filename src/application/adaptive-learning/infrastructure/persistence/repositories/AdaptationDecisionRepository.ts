// src/application/adaptive-learning/infrastructure/persistence/repositories/AdaptationDecisionRepository.ts
import { AdaptationDecisionEntity } from '../entities/AdaptationDecisionEntity';

export class AdaptationDecisionRepository {
  private static store: AdaptationDecisionEntity[] = [];

  async findByStudent(studentId: string, limit = 50): Promise<AdaptationDecisionEntity[]> {
    return AdaptationDecisionRepository.store
      .filter(d => d.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async save(entity: AdaptationDecisionEntity | AdaptationDecisionEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) item.id = `ad-${Math.random().toString(36).substring(7)}`;
      const idx = AdaptationDecisionRepository.store.findIndex(d => d.id === item.id);
      if (idx >= 0) AdaptationDecisionRepository.store[idx] = item;
      else AdaptationDecisionRepository.store.push(item);
    }
    return entity;
  }

  create(data: Partial<AdaptationDecisionEntity>): AdaptationDecisionEntity {
    const entity = new AdaptationDecisionEntity();
    Object.assign(entity, data);
    return entity;
  }
}
