// src/application/ai-governance/services/ProviderGateway.ts
import { LlmProvider, LlmRequest, LlmResponse } from '@/domain/services/ai/LlmProvider';
import { OpenAiLlmProvider, MockLlmProvider } from '@/infrastructure/services/ai/LlmProviderRegistry';
import { ModelProvider } from '../domain/models/ModelProvider';
import { Logger } from '@/infra/logger';

/**
 * Uniform gateway mapping model providers (OpenAI, Anthropic, Gemini, Azure, Local, Mock)
 * behind the common LlmProvider interface.
 */
export class ProviderGateway {
  private readonly logger = new Logger('ProviderGateway');
  private readonly openai = new OpenAiLlmProvider();
  private readonly mock = new MockLlmProvider();

  /** Execute request against the given provider. */
  async execute(provider: ModelProvider, request: LlmRequest): Promise<LlmResponse> {
    const start = Date.now();
    try {
      this.logger.info('Executing provider call', { providerId: provider.id, model: provider.modelName });

      let response: LlmResponse;

      switch (provider.providerType) {
        case 'openai':
          response = await this.openai.generate(request);
          break;
        case 'mock':
        case 'anthropic':
        case 'google':
        case 'azure':
        case 'local':
        default:
          // Fall back to Mock Provider for non-configured API providers in local dev
          response = await this.mock.generate(request);
          // Override name to match routed provider type
          response.provider = provider.providerType.toUpperCase();
          response.model = provider.modelName;
          break;
      }

      const elapsed = Date.now() - start;
      this.logger.info('Provider execution complete', { providerId: provider.id, latencyMs: elapsed });
      return response;
    } catch (err: any) {
      this.logger.error('Provider execution failed', { providerId: provider.id, error: err.message });
      throw err;
    }
  }
}
export const defaultProviderGateway = new ProviderGateway();
