// src/application/learning-intelligence/infrastructure/persistence/repositories/InsightRepository.ts
import { InsightEntity } from '../entities/InsightEntity';

export class InsightRepository {
  private static store: InsightEntity[] = [];

  async find(options?: any): Promise<InsightEntity[]> {
    let list = [...InsightRepository.store];
    if (options && options.where) {
      const where = options.where;
      list = list.filter((item) => {
        for (const [key, val] of Object.entries(where)) {
          if ((item as any)[key] !== val) return false;
        }
        return true;
      });
    }
    if (options && options.order) {
      // Stub: assumes ordering by createdAt DESC for simple cases
      list = list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return list;
  }

  async save(entity: InsightEntity | InsightEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `in-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = InsightRepository.store.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) {
        InsightRepository.store[existingIdx] = item;
      } else {
        InsightRepository.store.push(item);
      }
    }
    return entity;
  }

  create(data: Partial<InsightEntity>): InsightEntity {
    const entity = new InsightEntity();
    Object.assign(entity, data);
    return entity;
  }
}
