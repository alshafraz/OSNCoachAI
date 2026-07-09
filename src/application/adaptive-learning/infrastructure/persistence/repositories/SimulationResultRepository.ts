// src/application/adaptive-learning/infrastructure/persistence/repositories/SimulationResultRepository.ts
import { SimulationResultEntity } from '../entities/SimulationResultEntity';

export class SimulationResultRepository {
  private static store: SimulationResultEntity[] = [];

  async findLatestByStudent(studentId: string): Promise<SimulationResultEntity | null> {
    const results = SimulationResultRepository.store
      .filter(r => r.studentId === studentId)
      .sort((a, b) => b.simulatedAt.getTime() - a.simulatedAt.getTime());
    return results[0] ?? null;
  }

  async save(entity: SimulationResultEntity): Promise<SimulationResultEntity> {
    if (!entity.id) entity.id = `sr-${Math.random().toString(36).substring(7)}`;
    const idx = SimulationResultRepository.store.findIndex(r => r.id === entity.id);
    if (idx >= 0) SimulationResultRepository.store[idx] = entity;
    else SimulationResultRepository.store.push(entity);
    return entity;
  }

  create(data: Partial<SimulationResultEntity>): SimulationResultEntity {
    const entity = new SimulationResultEntity();
    Object.assign(entity, data);
    return entity;
  }
}
