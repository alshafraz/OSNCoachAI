// src/application/ai-governance/services/ModelRouter.ts
import { ModelProvider } from '../domain/models/ModelProvider';
import { ModelProviderRepository } from '../infrastructure/persistence/repositories/Repositories';
import { governanceConfig, AIOpsTaskType } from '../config/governanceConfig';
import { Logger } from '@/infra/logger';

/**
 * ModelRouter selects target models by cost, latency, quality, task, and availability.
 */
export class ModelRouter {
  private readonly logger = new Logger('ModelRouter');
  private readonly repo = new ModelProviderRepository();

  constructor() {
    this.seedDefaultProviders();
  }

  /**
   * Route to the best available provider for a given model capability and task.
   */
  async route(modelName: string, taskType: AIOpsTaskType): Promise<ModelProvider> {
    const list = await this.repo.findAll();

    // Look up fallback names defined in config
    const targetOrder = governanceConfig.fallbacks[modelName as keyof typeof governanceConfig.fallbacks] 
      ?? [modelName];

    for (const modelId of targetOrder) {
      const provider = list.find((m) => m.id === modelId);
      if (provider && provider.isAvailable && provider.consecutiveFailures < governanceConfig.maxRetryAttempts) {
        this.logger.info('Model routed successfully', { requested: modelName, routed: provider.id, task: taskType });
        return provider as unknown as ModelProvider;
      }
    }

    // Default emergency fallback
    const fallbackId = 'mock/mock-gpt-4';
    const emergencyProvider = list.find((m) => m.id === fallbackId);
    if (emergencyProvider) {
      this.logger.warn('Router fell back to emergency mock provider', { requested: modelName, routed: fallbackId });
      return emergencyProvider as unknown as ModelProvider;
    }

    throw new Error(`Routing failed. No available provider for model: "${modelName}".`);
  }

  /** Track failures for circuit breaker behavior. */
  async recordFailure(providerId: string): Promise<void> {
    const provider = await this.repo.findById(providerId);
    if (!provider) return;

    provider.consecutiveFailures++;
    if (provider.consecutiveFailures >= governanceConfig.maxRetryAttempts) {
      provider.isAvailable = false;
      this.logger.error('Circuit breaker tripped for provider', { providerId });
    }
    await this.repo.save(provider);
  }

  /** Reset provider state. */
  async recordSuccess(providerId: string): Promise<void> {
    const provider = await this.repo.findById(providerId);
    if (!provider) return;

    provider.consecutiveFailures = 0;
    provider.isAvailable = true;
    await this.repo.save(provider);
  }

  private async seedDefaultProviders(): Promise<void> {
    const existing = await this.repo.findById('openai/gpt-4o');
    if (existing) return;

    const providersData: Partial<ModelProvider>[] = [
      { id: 'openai/gpt-4o', providerType: 'openai', modelName: 'gpt-4o', avgLatencyMs: 800, qualityScore: 95, costPerMillionPrompt: 5.0, costPerMillionCompletion: 15.0 },
      { id: 'openai/gpt-4o-mini', providerType: 'openai', modelName: 'gpt-4o-mini', avgLatencyMs: 300, qualityScore: 82, costPerMillionPrompt: 0.15, costPerMillionCompletion: 0.60 },
      { id: 'anthropic/claude-3-5-sonnet', providerType: 'anthropic', modelName: 'claude-3-5-sonnet', avgLatencyMs: 1200, qualityScore: 97, costPerMillionPrompt: 3.0, costPerMillionCompletion: 15.0 },
      { id: 'google/gemini-1.5-pro', providerType: 'google', modelName: 'gemini-1.5-pro', avgLatencyMs: 1100, qualityScore: 92, costPerMillionPrompt: 1.25, costPerMillionCompletion: 3.75 },
      { id: 'azure/gpt-4o', providerType: 'azure', modelName: 'gpt-4o', avgLatencyMs: 900, qualityScore: 95, costPerMillionPrompt: 5.0, costPerMillionCompletion: 15.0 },
      { id: 'local/llama-3', providerType: 'local', modelName: 'llama-3', avgLatencyMs: 400, qualityScore: 78, costPerMillionPrompt: 0.0, costPerMillionCompletion: 0.0 },
      { id: 'mock/mock-gpt-4', providerType: 'mock', modelName: 'mock-gpt-4', avgLatencyMs: 80, qualityScore: 70, costPerMillionPrompt: 0.1, costPerMillionCompletion: 0.1 },
    ];

    for (const p of providersData) {
      await this.repo.save({
        id: p.id!,
        providerType: p.providerType!,
        modelName: p.modelName!,
        avgLatencyMs: p.avgLatencyMs!,
        qualityScore: p.qualityScore!,
        isAvailable: true,
        costPerMillionPrompt: p.costPerMillionPrompt!,
        costPerMillionCompletion: p.costPerMillionCompletion!,
        consecutiveFailures: 0,
        lastTestedAt: new Date(),
      });
    }
  }
}
export const defaultModelRouter = new ModelRouter();
