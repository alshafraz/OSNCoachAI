// src/application/ai-governance/services/BenchmarkService.ts
import { Benchmark } from '../domain/models/Benchmark';
import { BenchmarkRepository } from '../infrastructure/persistence/repositories/Repositories';
import { PromptRegistry } from './PromptRegistry';
import { EvaluationService } from './EvaluationService';
import { ProviderGateway } from './ProviderGateway';
import { ModelRouter } from './ModelRouter';
import { AIOpsTaskType } from '../config/governanceConfig';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * BenchmarkService runs prompt configurations against target validation datasets to protect against regressions.
 */
export class BenchmarkService {
  private readonly logger = new Logger('BenchmarkService');
  private readonly repo = new BenchmarkRepository();
  private readonly promptRegistry = new PromptRegistry();
  private readonly evaluationService = new EvaluationService();
  private readonly gateway = new ProviderGateway();
  private readonly router = new ModelRouter();

  constructor() {
    this.seedDefaults();
  }

  /** Retrieve benchmarks by category. */
  async getBenchmarks(category: AIOpsTaskType): Promise<Benchmark[]> {
    const list = await this.repo.findByCategory(category);
    return list as unknown as Benchmark[];
  }

  /** Register benchmark dataset case. */
  async registerBenchmark(data: Partial<Benchmark>): Promise<Benchmark> {
    const benchmark: Benchmark = {
      id: data.id || uuidv4(),
      category: data.category || 'OCR',
      inputVariables: data.inputVariables || {},
      expectedOutputPattern: data.expectedOutputPattern || '',
      description: data.description || 'Test case',
    };
    await this.repo.save(benchmark as any);
    return benchmark;
  }

  /** Run prompt version through benchmarks dataset to get a regression evaluation score. */
  async runSuite(promptId: string, semver: string, category: AIOpsTaskType): Promise<number> {
    this.logger.info('Starting benchmark regression test suite', { promptId, semver, category });

    const benchmarks = await this.getBenchmarks(category);
    if (benchmarks.length === 0) {
      this.logger.warn('No benchmark test cases found for category', { category });
      return 100;
    }

    const version = await this.promptRegistry.getPromptVersion(promptId, semver);
    if (!version) throw new Error(`Prompt version "${semver}" not found.`);

    const provider = await this.router.route('gpt-4o-mini', category);

    let totalScore = 0;

    for (const testCase of benchmarks) {
      const renderedUser = this.promptRegistry.render(version.userTemplate, testCase.inputVariables);
      const res = await this.gateway.execute(provider, {
        prompt: renderedUser,
        systemPrompt: version.systemTemplate,
        temperature: version.temperature,
        maxTokens: version.maxTokens,
      });

      const evalResult = this.evaluationService.evaluate(promptId, semver, res.content, testCase.expectedOutputPattern);
      totalScore += evalResult.overallScore;
    }

    const finalScore = Math.round(totalScore / benchmarks.length);
    this.logger.info('Benchmark regression test suite complete', { promptId, semver, finalScore });
    return finalScore;
  }

  private async seedDefaults(): Promise<void> {
    const existing = await this.getBenchmarks('OCR');
    if (existing.length > 0) return;

    await this.registerBenchmark({
      id: 'bm-ocr-1',
      category: 'OCR',
      inputVariables: { rawText: 'Solve 2x + 5 = 15 for value of x.' },
      expectedOutputPattern: '"correctAnswer": "5"',
      description: 'OCR math solving output format checks',
    });

    await this.registerBenchmark({
      id: 'bm-diff-1',
      category: 'CLASSIFICATION',
      inputVariables: { questionBody: 'Solve addition 5 + 3.' },
      expectedOutputPattern: 'EASY',
      description: 'Difficulty rating easy baseline check',
    });
  }
}
export const defaultBenchmarkService = new BenchmarkService();
