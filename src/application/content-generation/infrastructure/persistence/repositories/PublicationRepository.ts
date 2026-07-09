// src/application/content-generation/infrastructure/persistence/repositories/PublicationRepository.ts
import { PublicationEntity } from '../entities/PublicationEntity';

export class PublicationRepository {
  private static store: PublicationEntity[] = [];

  async save(entity: PublicationEntity | PublicationEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `pb-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = PublicationRepository.store.findIndex((p) => p.id === item.id);
      if (existingIdx >= 0) {
        PublicationRepository.store[existingIdx] = item;
      } else {
        PublicationRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<PublicationEntity>): PublicationEntity {
    const entity = new PublicationEntity();
    Object.assign(entity, data);
    return entity;
  }
}
