// src/application/content-generation/infrastructure/persistence/repositories/GeneratedContentRepository.ts
import { GeneratedContentEntity } from '../entities/GeneratedContentEntity';

export class GeneratedContentRepository {
  private static store: GeneratedContentEntity[] = [];

  async save(entity: GeneratedContentEntity | GeneratedContentEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `gc-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = GeneratedContentRepository.store.findIndex((g) => g.id === item.id);
      if (existingIdx >= 0) {
        GeneratedContentRepository.store[existingIdx] = item;
      } else {
        GeneratedContentRepository.store.push(item);
      }
    }
    return entity;
  }

  async findPendingReview(): Promise<GeneratedContentEntity[]> {
    return GeneratedContentRepository.store.filter((g) => g.reviewState === 'PENDING');
  }

  async findPublished(): Promise<GeneratedContentEntity[]> {
    return GeneratedContentRepository.store.filter((g) => g.publicationState === 'PUBLISHED');
  }

  async findOne(id: string): Promise<GeneratedContentEntity | undefined> {
    return GeneratedContentRepository.store.find((g) => g.id === id);
  }

  async update(id: string, partial: Partial<GeneratedContentEntity>): Promise<any> {
    const item = GeneratedContentRepository.store.find((g) => g.id === id);
    if (item) {
      Object.assign(item, partial);
    }
    return item;
  }

  create(data: Partial<GeneratedContentEntity>): GeneratedContentEntity {
    const entity = new GeneratedContentEntity();
    Object.assign(entity, data);
    return entity;
  }
}
