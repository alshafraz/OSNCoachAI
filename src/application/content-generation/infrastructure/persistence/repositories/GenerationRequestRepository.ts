// src/application/content-generation/infrastructure/persistence/repositories/GenerationRequestRepository.ts
import { GenerationRequestEntity } from '../entities/GenerationRequestEntity';

export class GenerationRequestRepository {
  private static store: GenerationRequestEntity[] = [];

  async save(entity: GenerationRequestEntity | GenerationRequestEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `gr-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = GenerationRequestRepository.store.findIndex((g) => g.id === item.id);
      if (existingIdx >= 0) {
        GenerationRequestRepository.store[existingIdx] = item;
      } else {
        GenerationRequestRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<GenerationRequestEntity>): GenerationRequestEntity {
    const entity = new GenerationRequestEntity();
    Object.assign(entity, data);
    return entity;
  }
}
