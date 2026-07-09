// src/application/adaptive-learning/infrastructure/persistence/repositories/LearningPathRepository.ts
import { LearningPathEntity } from '../entities/LearningPathEntity';

export class LearningPathRepository {
  private static store: LearningPathEntity[] = [];

  async findByStudent(studentId: string): Promise<LearningPathEntity | null> {
    return LearningPathRepository.store.find(p => p.studentId === studentId) ?? null;
  }

  async save(entity: LearningPathEntity): Promise<LearningPathEntity> {
    if (!entity.id) entity.id = `lp-${Math.random().toString(36).substring(7)}`;
    const idx = LearningPathRepository.store.findIndex(p => p.id === entity.id);
    if (idx >= 0) LearningPathRepository.store[idx] = entity;
    else LearningPathRepository.store.push(entity);
    return entity;
  }

  create(data: Partial<LearningPathEntity>): LearningPathEntity {
    const entity = new LearningPathEntity();
    Object.assign(entity, data);
    return entity;
  }
}
