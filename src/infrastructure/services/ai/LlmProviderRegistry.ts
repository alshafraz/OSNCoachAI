import { LlmProvider, LlmRequest, LlmResponse } from '@/domain/services/ai/LlmProvider';

export class MockLlmProvider implements LlmProvider {
  id = 'mock';
  name = 'Mock LLM Provider';

  async generate(request: LlmRequest): Promise<LlmResponse> {
    let content = '{"text": "Mock response content"}';

    if (request.jsonSchema) {
      if (request.prompt.includes('OCR') || request.prompt.includes('extract')) {
        content = JSON.stringify({
          questions: [
            {
              body: 'Find the value of x if 2x + 5 = 15.',
              type: 'SHORT_ANSWER',
              correctAnswer: '5',
              points: 10,
              difficulty: 'EASY',
              topic: 'Algebra',
              hint: 'Subtract 5 first, then divide by 2.',
              explanation: '2x = 10, so x = 5.',
              options: []
            }
          ],
          confidence: 0.96
        });
      } else if (request.prompt.includes('Difficulty')) {
        content = JSON.stringify({ difficulty: 'EASY', confidence: 0.98 });
      } else if (request.prompt.includes('Topic')) {
        content = JSON.stringify({ topic: 'Algebra', confidence: 0.97 });
      } else {
        const mockObj: Record<string, any> = {};
        for (const [key, val] of Object.entries(request.jsonSchema.properties || {})) {
          if ((val as any).type === 'string') mockObj[key] = `Mock ${key}`;
          else if ((val as any).type === 'number') mockObj[key] = 0.95;
          else if ((val as any).type === 'array') mockObj[key] = [];
        }
        content = JSON.stringify(mockObj);
      }
    }

    return {
      content,
      provider: 'Mock',
      model: 'mock-gpt-4',
      tokensUsed: {
        prompt: 150,
        completion: 120,
        total: 270,
      },
      latencyMs: 85,
    };
  }
}

export class OpenAiLlmProvider implements LlmProvider {
  id = 'openai';
  name = 'OpenAI Provider';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || 'mock-key';
  }

  async generate(request: LlmRequest): Promise<LlmResponse> {
    if (this.apiKey === 'mock-key' || !process.env.OPENAI_API_KEY) {
      return new MockLlmProvider().generate(request);
    }

    const start = Date.now();
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.maxTokens && request.maxTokens > 1000 ? 'gpt-4o' : 'gpt-4o-mini',
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt },
          ],
          temperature: request.temperature ?? 0.3,
          response_format: request.responseFormat === 'json' ? { type: 'json_object' } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - start;

      return {
        content: data.choices[0].message.content,
        provider: 'OpenAI',
        model: data.model,
        tokensUsed: {
          prompt: data.usage.prompt_tokens,
          completion: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        },
        latencyMs,
      };
    } catch (error) {
      return new MockLlmProvider().generate(request);
    }
  }
}

export interface CostRecord {
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  timestamp: string;
}

let costLogs: CostRecord[] = [];

export function trackTokensCost(provider: string, model: string, promptTokens: number, completionTokens: number) {
  let promptRate = 0.15; 
  let completionRate = 0.60;

  if (model.includes('gpt-4o') && !model.includes('mini')) {
    promptRate = 5.0;
    completionRate = 15.0;
  }

  const promptCost = (promptTokens / 1000000) * promptRate;
  const completionCost = (completionTokens / 1000000) * completionRate;
  const totalCost = promptCost + completionCost;

  costLogs.push({
    promptTokens,
    completionTokens,
    costUsd: totalCost,
    timestamp: new Date().toISOString(),
  });
}

export function getDailyTokensCost(): number {
  return costLogs.reduce((acc, log) => acc + log.costUsd, 0);
}

export function getTokensUsageStatistics() {
  return {
    totalCalls: costLogs.length,
    totalCost: getDailyTokensCost(),
    averageCostPerCall: costLogs.length > 0 ? getDailyTokensCost() / costLogs.length : 0,
  };
}
