// src/application/adaptive-learning/infrastructure/persistence/repositories/DifficultyStateRepository.ts
import { DifficultyStateEntity } from '../entities/DifficultyStateEntity';

export class DifficultyStateRepository {
  private static store: DifficultyStateEntity[] = [];

  async findByStudentAndTopic(studentId: string, topicId: string): Promise<DifficultyStateEntity | null> {
    return DifficultyStateRepository.store.find(d => d.studentId === studentId && d.topicId === topicId) ?? null;
  }

  async findAllByStudent(studentId: string): Promise<DifficultyStateEntity[]> {
    return DifficultyStateRepository.store.filter(d => d.studentId === studentId);
  }

  async save(entity: DifficultyStateEntity): Promise<DifficultyStateEntity> {
    if (!entity.id) entity.id = `ds-${Math.random().toString(36).substring(7)}`;
    const idx = DifficultyStateRepository.store.findIndex(d => d.id === entity.id);
    if (idx >= 0) DifficultyStateRepository.store[idx] = entity;
    else DifficultyStateRepository.store.push(entity);
    return entity;
  }

  create(data: Partial<DifficultyStateEntity>): DifficultyStateEntity {
    const entity = new DifficultyStateEntity();
    Object.assign(entity, data);
    return entity;
  }
}
