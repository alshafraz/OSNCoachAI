// src/application/operations/infrastructure/persistence/repositories/Repositories.ts
import {
  DeploymentLogEntity,
  BackupRecordEntity,
  SystemEventEntity,
} from '../entities/Entities';

export class DeploymentRepository {
  private static store: DeploymentLogEntity[] = [];

  async save(entity: DeploymentLogEntity): Promise<DeploymentLogEntity> {
    const idx = DeploymentRepository.store.findIndex((d) => d.id === entity.id);
    if (idx >= 0) DeploymentRepository.store[idx] = entity;
    else DeploymentRepository.store.push(entity);
    return entity;
  }

  async findById(id: string): Promise<DeploymentLogEntity | null> {
    return DeploymentRepository.store.find((d) => d.id === id) ?? null;
  }

  async findRecent(limit = 50): Promise<DeploymentLogEntity[]> {
    return DeploymentRepository.store.slice().reverse().slice(0, limit);
  }
}

export class BackupRepository {
  private static store: BackupRecordEntity[] = [];

  async save(entity: BackupRecordEntity): Promise<BackupRecordEntity> {
    const idx = BackupRepository.store.findIndex((b) => b.id === entity.id);
    if (idx >= 0) BackupRepository.store[idx] = entity;
    else BackupRepository.store.push(entity);
    return entity;
  }

  async findById(id: string): Promise<BackupRecordEntity | null> {
    return BackupRepository.store.find((b) => b.id === id) ?? null;
  }

  async findRecent(limit = 50): Promise<BackupRecordEntity[]> {
    return BackupRepository.store.slice().reverse().slice(0, limit);
  }
}

export class SystemEventRepository {
  private static store: SystemEventEntity[] = [];

  async save(entity: SystemEventEntity): Promise<SystemEventEntity> {
    if (!entity.id) entity.id = `se-${Math.random().toString(36).substring(7)}`;
    SystemEventRepository.store.push(entity);
    return entity;
  }

  async findRecent(limit = 100): Promise<SystemEventEntity[]> {
    return SystemEventRepository.store.slice().reverse().slice(0, limit);
  }
}
