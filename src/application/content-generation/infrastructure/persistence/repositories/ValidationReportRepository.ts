// src/application/content-generation/infrastructure/persistence/repositories/ValidationReportRepository.ts
import { ValidationReportEntity } from '../entities/ValidationReportEntity';

export class ValidationReportRepository {
  private static store: ValidationReportEntity[] = [];

  async save(entity: ValidationReportEntity | ValidationReportEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `vr-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = ValidationReportRepository.store.findIndex((v) => v.id === item.id);
      if (existingIdx >= 0) {
        ValidationReportRepository.store[existingIdx] = item;
      } else {
        ValidationReportRepository.store.push(item);
      }
    }
    return entity;
  }

  async findLatestByContent(contentId: string): Promise<ValidationReportEntity | null> {
    const list = ValidationReportRepository.store.filter((v) => v.contentId === contentId);
    if (list.length === 0) return null;
    return list.sort((a, b) => b.validatedAt.getTime() - a.validatedAt.getTime())[0];
  }

  create(data: Partial<ValidationReportEntity>): ValidationReportEntity {
    const entity = new ValidationReportEntity();
    Object.assign(entity, data);
    return entity;
  }
}
