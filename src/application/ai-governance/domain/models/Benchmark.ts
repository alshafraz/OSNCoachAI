// src/application/ai-governance/domain/models/Benchmark.ts
import { AIOpsTaskType } from '../../config/governanceConfig';

/**
 * Standard test dataset benchmark case to run regression tests against prompts.
 */
export interface Benchmark {
  id: string;
  category: AIOpsTaskType;
  inputVariables: Record<string, string>;
  expectedOutputPattern: string; // keyword or regex pattern to search for
  description: string;
}
