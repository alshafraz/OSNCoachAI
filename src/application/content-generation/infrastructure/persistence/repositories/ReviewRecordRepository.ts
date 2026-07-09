// src/application/content-generation/infrastructure/persistence/repositories/ReviewRecordRepository.ts
import { ReviewRecordEntity } from '../entities/ReviewRecordEntity';

export class ReviewRecordRepository {
  private static store: ReviewRecordEntity[] = [];

  async save(entity: ReviewRecordEntity | ReviewRecordEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `rr-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = ReviewRecordRepository.store.findIndex((r) => r.id === item.id);
      if (existingIdx >= 0) {
        ReviewRecordRepository.store[existingIdx] = item;
      } else {
        ReviewRecordRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<ReviewRecordEntity>): ReviewRecordEntity {
    const entity = new ReviewRecordEntity();
    Object.assign(entity, data);
    return entity;
  }
}
