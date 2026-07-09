// src/application/ai-governance/infrastructure/persistence/repositories/Repositories.ts
import {
  PromptEntity,
  PromptVersionEntity,
  PromptEvaluationEntity,
  ModelProviderEntity,
  AIRequestEntity,
  AIResponseEntity,
  CostTrackingEntity,
  AuditLogEntity,
  FeatureFlagEntity,
  BenchmarkEntity,
} from '../entities/Entities';

export class PromptRepository {
  private static prompts: PromptEntity[] = [];
  private static versions: PromptVersionEntity[] = [];
  private static evaluations: PromptEvaluationEntity[] = [];

  async findById(id: string): Promise<PromptEntity | null> {
    return PromptRepository.prompts.find((p) => p.id === id) ?? null;
  }

  async findVersion(promptId: string, semver: string): Promise<PromptVersionEntity | null> {
    return PromptRepository.versions.find((v) => v.promptId === promptId && v.semver === semver) ?? null;
  }

  async savePrompt(entity: PromptEntity): Promise<PromptEntity> {
    const idx = PromptRepository.prompts.findIndex((p) => p.id === entity.id);
    if (idx >= 0) PromptRepository.prompts[idx] = entity;
    else PromptRepository.prompts.push(entity);
    return entity;
  }

  async saveVersion(entity: PromptVersionEntity): Promise<PromptVersionEntity> {
    const idx = PromptRepository.versions.findIndex((v) => v.versionId === entity.versionId);
    if (idx >= 0) PromptRepository.versions[idx] = entity;
    else PromptRepository.versions.push(entity);
    return entity;
  }

  async saveEvaluation(entity: PromptEvaluationEntity): Promise<PromptEvaluationEntity> {
    if (!entity.id) entity.id = `pe-${Math.random().toString(36).substring(7)}`;
    PromptRepository.evaluations.push(entity);
    return entity;
  }

  async findEvaluationsByPrompt(promptId: string, semver: string): Promise<PromptEvaluationEntity[]> {
    return PromptRepository.evaluations.filter((e) => e.promptId === promptId && e.promptVersion === semver);
  }
}

export class ModelProviderRepository {
  private static store: ModelProviderEntity[] = [];

  async findById(id: string): Promise<ModelProviderEntity | null> {
    return ModelProviderRepository.store.find((m) => m.id === id) ?? null;
  }

  async findAll(): Promise<ModelProviderEntity[]> {
    return ModelProviderRepository.store;
  }

  async save(entity: ModelProviderEntity): Promise<ModelProviderEntity> {
    const idx = ModelProviderRepository.store.findIndex((m) => m.id === entity.id);
    if (idx >= 0) ModelProviderRepository.store[idx] = entity;
    else ModelProviderRepository.store.push(entity);
    return entity;
  }
}

export class AIRequestRepository {
  private static requests: AIRequestEntity[] = [];
  private static responses: AIResponseEntity[] = [];

  async saveRequest(entity: AIRequestEntity): Promise<AIRequestEntity> {
    AIRequestRepository.requests.push(entity);
    return entity;
  }

  async saveResponse(entity: AIResponseEntity): Promise<AIResponseEntity> {
    AIRequestRepository.responses.push(entity);
    return entity;
  }
}

export class CostTrackingRepository {
  private static store: CostTrackingEntity[] = [];

  async save(entity: CostTrackingEntity): Promise<CostTrackingEntity> {
    if (!entity.id) entity.id = `ct-${Math.random().toString(36).substring(7)}`;
    CostTrackingRepository.store.push(entity);
    return entity;
  }

  async findByStudent(studentId: string): Promise<CostTrackingEntity[]> {
    return CostTrackingRepository.store.filter((c) => c.studentId === studentId);
  }

  async findAll(): Promise<CostTrackingEntity[]> {
    return CostTrackingRepository.store;
  }
}

export class AuditLogRepository {
  private static store: AuditLogEntity[] = [];

  async save(entity: AuditLogEntity): Promise<AuditLogEntity> {
    if (!entity.id) entity.id = `al-${Math.random().toString(36).substring(7)}`;
    AuditLogRepository.store.push(entity);
    return entity;
  }

  async findRecent(limit = 100): Promise<AuditLogEntity[]> {
    return AuditLogRepository.store.slice().reverse().slice(0, limit);
  }
}

export class FeatureFlagRepository {
  private static store: FeatureFlagEntity[] = [];

  async findByKey(flagKey: string): Promise<FeatureFlagEntity | null> {
    return FeatureFlagRepository.store.find((f) => f.flagKey === flagKey) ?? null;
  }

  async save(entity: FeatureFlagEntity): Promise<FeatureFlagEntity> {
    const idx = FeatureFlagRepository.store.findIndex((f) => f.flagKey === entity.flagKey);
    if (idx >= 0) FeatureFlagRepository.store[idx] = entity;
    else FeatureFlagRepository.store.push(entity);
    return entity;
  }
}

export class BenchmarkRepository {
  private static store: BenchmarkEntity[] = [];

  async findByCategory(category: string): Promise<BenchmarkEntity[]> {
    return BenchmarkRepository.store.filter((b) => b.category === category);
  }

  async save(entity: BenchmarkEntity): Promise<BenchmarkEntity> {
    if (!entity.id) entity.id = `bm-${Math.random().toString(36).substring(7)}`;
    const idx = BenchmarkRepository.store.findIndex((b) => b.id === entity.id);
    if (idx >= 0) BenchmarkRepository.store[idx] = entity;
    else BenchmarkRepository.store.push(entity);
    return entity;
  }
}
