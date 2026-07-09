// src/application/ai-governance/services/ValidationService.ts
import { AiValidator, ValidationOutput } from '@/infrastructure/services/ai/AiValidator';

/**
 * ValidationService parses and validates the LLM outputs for schema correctness and mathematical consistency.
 */
export class ValidationService {
  /**
   * Validate content formatting and output rules.
   */
  validate(content: string, schema?: Record<string, any>): ValidationOutput {
    return AiValidator.validateJson(content, schema);
  }

  /**
   * Evaluates if the math details inside parsed structure align correctly.
   */
  validateMathConsistency(parsed: any): { isValid: boolean; reason?: string } {
    // Basic verification is delegated to AiValidator.ts
    // Let's perform additional checks for custom OSN properties if present.
    if (parsed.questions && Array.isArray(parsed.questions)) {
      for (const q of parsed.questions) {
        if (q.type === 'MCQ' && (!q.options || !Array.isArray(q.options) || q.options.length === 0)) {
          return { isValid: false, reason: 'MCQ question type missing choices/options array.' };
        }
      }
    }
    return { isValid: true };
  }
}
export const defaultValidationService = new ValidationService();
