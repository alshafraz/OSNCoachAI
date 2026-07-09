// src/application/ai-governance/services/EvaluationService.ts
import { PromptEvaluation } from '../domain/models/PromptEvaluation';
import { PromptRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * EvaluationService scores LLM outputs on correctness, explanation quality, consistency, and pedagogical value.
 */
export class EvaluationService {
  private readonly logger = new Logger('EvaluationService');
  private readonly repo = new PromptRepository();

  /**
   * Score an LLM response output against target benchmark criteria.
   */
  evaluate(
    promptId: string,
    version: string,
    rawOutput: string,
    expectedPattern?: string
  ): PromptEvaluation {
    const isJson = rawOutput.trim().startsWith('{') || rawOutput.trim().startsWith('[');
    
    // Evaluate correctness
    let correctness = 80;
    if (expectedPattern) {
      correctness = rawOutput.includes(expectedPattern) ? 100 : 30;
    }

    // Evaluate consistency
    const consistency = isJson ? 95 : 60;

    // Evaluate mathematical accuracy
    let mathAccuracy = 90;
    if (rawOutput.includes('2x + 5 = 15') && !rawOutput.includes('correctAnswer: "5"') && !rawOutput.includes('"correctAnswer": "5"')) {
      mathAccuracy = 30;
    }

    // Evaluate explanation/hint indicators
    const hasExplanation = rawOutput.toLowerCase().includes('explanation') || rawOutput.toLowerCase().includes('solve');
    const hasHint = rawOutput.toLowerCase().includes('hint') || rawOutput.toLowerCase().includes('socratic');
    
    const explanationQuality = hasExplanation ? 90 : 50;
    const hintQuality = hasHint ? 95 : 50;
    
    const pedagogicalQuality = (explanationQuality + hintQuality) / 2;
    const completeness = (isJson && hasExplanation) ? 95 : 70;

    // Calculate aggregated overall score
    const overallScore = Math.round(
      correctness * 0.25 +
      consistency * 0.15 +
      completeness * 0.15 +
      pedagogicalQuality * 0.15 +
      mathAccuracy * 0.30
    );

    const evaluation: PromptEvaluation = {
      id: uuidv4(),
      promptId,
      promptVersion: version,
      evaluatedAt: new Date(),
      overallScore,
      correctness,
      consistency,
      completeness,
      pedagogicalQuality,
      mathematicalAccuracy: mathAccuracy,
      explanationQuality,
      hintQuality,
      sampleCount: 1,
    };

    this.logger.info('Prompt evaluated', { promptId, version, overallScore });
    return evaluation;
  }
}
export const defaultEvaluationService = new EvaluationService();
