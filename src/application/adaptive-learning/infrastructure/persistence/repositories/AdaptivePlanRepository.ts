// src/application/adaptive-learning/infrastructure/persistence/repositories/AdaptivePlanRepository.ts
import { AdaptivePlanEntity } from '../entities/AdaptivePlanEntity';

export class AdaptivePlanRepository {
  private static store: AdaptivePlanEntity[] = [];

  async findByStudent(studentId: string): Promise<AdaptivePlanEntity | null> {
    return AdaptivePlanRepository.store.find(p => p.studentId === studentId) ?? null;
  }

  async save(entity: AdaptivePlanEntity): Promise<AdaptivePlanEntity> {
    if (!entity.id) entity.id = `ap-${Math.random().toString(36).substring(7)}`;
    const idx = AdaptivePlanRepository.store.findIndex(p => p.id === entity.id);
    if (idx >= 0) AdaptivePlanRepository.store[idx] = entity;
    else AdaptivePlanRepository.store.push(entity);
    return entity;
  }

  create(data: Partial<AdaptivePlanEntity>): AdaptivePlanEntity {
    const entity = new AdaptivePlanEntity();
    Object.assign(entity, data);
    return entity;
  }
}
