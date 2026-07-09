// src/application/learning-intelligence/infrastructure/persistence/repositories/LearningEventRepository.ts
import { LearningEventEntity } from '../entities/LearningEventEntity';

export class LearningEventRepository {
  private static store: LearningEventEntity[] = [];

  async save(entity: LearningEventEntity | LearningEventEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `le-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = LearningEventRepository.store.findIndex((e) => e.id === item.id);
      if (existingIdx >= 0) {
        LearningEventRepository.store[existingIdx] = item;
      } else {
        LearningEventRepository.store.push(item);
      }
    }
    return entity;
  }

  async findByStudent(studentId: string): Promise<LearningEventEntity[]> {
    return LearningEventRepository.store.filter((e) => e.studentId === studentId);
  }

  // Helper for orchestration
  static getStore(): LearningEventEntity[] {
    return this.store;
  }
}
