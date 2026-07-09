// src/application/learning-intelligence/infrastructure/persistence/repositories/MetricSnapshotRepository.ts
import { MetricSnapshotEntity } from '../entities/MetricSnapshotEntity';

export class MetricSnapshotRepository {
  private static store: MetricSnapshotEntity[] = [];

  async findLatest(studentId: string, limit: number = 100): Promise<MetricSnapshotEntity[]> {
    return MetricSnapshotRepository.store
      .filter((m) => m.studentId === studentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async save(entity: MetricSnapshotEntity | MetricSnapshotEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) {
        item.id = `ms-${Math.random().toString(36).substring(7)}`;
      }
      const existingIdx = MetricSnapshotRepository.store.findIndex((m) => m.id === item.id);
      if (existingIdx >= 0) {
        MetricSnapshotRepository.store[existingIdx] = item;
      } else {
        MetricSnapshotRepository.store.push(item);
      }
    }
    return entity;
  }
}
