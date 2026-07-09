// src/application/content-generation/infrastructure/persistence/repositories/PromptVersionRepository.ts
import { PromptVersionEntity } from '../entities/PromptVersionEntity';

export class PromptVersionRepository {
  private static store: PromptVersionEntity[] = [];

  async save(entity: PromptVersionEntity | PromptVersionEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `pv-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = PromptVersionRepository.store.findIndex((p) => p.id === item.id);
      if (existingIdx >= 0) {
        PromptVersionRepository.store[existingIdx] = item;
      } else {
        PromptVersionRepository.store.push(item);
      }
    }
    return entity;
  }

  async findActiveByTemplate(templateId: string): Promise<PromptVersionEntity | null> {
    return PromptVersionRepository.store.find((p) => p.templateId === templateId && p.isActive === true) ?? null;
  }

  create(data: Partial<PromptVersionEntity>): PromptVersionEntity {
    const entity = new PromptVersionEntity();
    Object.assign(entity, data);
    return entity;
  }
}
