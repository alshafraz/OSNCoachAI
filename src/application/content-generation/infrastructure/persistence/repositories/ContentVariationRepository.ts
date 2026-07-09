// src/application/content-generation/infrastructure/persistence/repositories/ContentVariationRepository.ts
import { ContentVariationEntity } from '../entities/ContentVariationEntity';

export class ContentVariationRepository {
  private static store: ContentVariationEntity[] = [];

  async save(entity: ContentVariationEntity | ContentVariationEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `cv-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = ContentVariationRepository.store.findIndex((c) => c.id === item.id);
      if (existingIdx >= 0) {
        ContentVariationRepository.store[existingIdx] = item;
      } else {
        ContentVariationRepository.store.push(item);
      }
    }
    return entity;
  }

  async findVariations(sourceContentId: string): Promise<ContentVariationEntity[]> {
    return ContentVariationRepository.store.filter((c) => c.sourceContentId === sourceContentId);
  }

  create(data: Partial<ContentVariationEntity>): ContentVariationEntity {
    const entity = new ContentVariationEntity();
    Object.assign(entity, data);
    return entity;
  }
}
