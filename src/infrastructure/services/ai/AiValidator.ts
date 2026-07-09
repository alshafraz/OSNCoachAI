export interface ValidationOutput<T = any> {
  isValid: boolean;
  data?: T;
  confidenceScore: number;
  reason?: string;
  isInjectionDetected: boolean;
}

export class AiValidator {
  static validateJson<T = any>(
    rawResponse: string,
    schema?: Record<string, any>
  ): ValidationOutput<T> {
    const lower = rawResponse.toLowerCase();
    const injectionPatterns = [
      'ignore previous instructions',
      'system prompt bypass',
      'you are now an administrator',
      'instruction injection',
    ];
    const isInjectionDetected = injectionPatterns.some((pat) => lower.includes(pat));

    if (isInjectionDetected) {
      return {
        isValid: false,
        confidenceScore: 0,
        reason: 'Security breach attempt or prompt injection signature detected.',
        isInjectionDetected: true,
      };
    }

    let parsed: any;
    try {
      let jsonStr = rawResponse.trim();
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        jsonStr = match[0];
      }
      parsed = JSON.parse(jsonStr);
    } catch (e: any) {
      return {
        isValid: false,
        confidenceScore: 0.1,
        reason: `Failed to parse output content as structured JSON.`,
        isInjectionDetected: false,
      };
    }

    let confidenceScore = 0.95;
    let reason = 'Structured output verified successfully.';

    if (schema && schema.properties) {
      const missingKeys: string[] = [];
      const required = schema.required || [];

      for (const reqKey of required) {
        if (!(reqKey in parsed)) {
          missingKeys.push(reqKey);
        }
      }

      if (missingKeys.length > 0) {
        return {
          isValid: false,
          confidenceScore: 0.3,
          reason: `Missing required schema fields: ${missingKeys.join(', ')}`,
          isInjectionDetected: false,
        };
      }

      for (const [key, val] of Object.entries(parsed)) {
        const propSchema = schema.properties[key];
        if (propSchema) {
          const expectedType = propSchema.type;
          const actualType = typeof val;
          if (expectedType === 'array' && !Array.isArray(val)) {
            return {
              isValid: false,
              confidenceScore: 0.4,
              reason: `Field type mismatch: "${key}" should be array.`,
              isInjectionDetected: false,
            };
          } else if (expectedType === 'number' && actualType !== 'number') {
            return {
              isValid: false,
              confidenceScore: 0.4,
              reason: `Field type mismatch: "${key}" should be number.`,
              isInjectionDetected: false,
            };
          }
        }
      }
    }

    const mathVerify = this.validateMathematicalConsistency(parsed);
    if (!mathVerify.isValid) {
      confidenceScore = Math.max(0.5, confidenceScore - 0.3);
      reason = `Math warning: ${mathVerify.reason}`;
    }

    return {
      isValid: confidenceScore >= 0.7,
      data: parsed,
      confidenceScore,
      reason,
      isInjectionDetected: false,
    };
  }

  private static validateMathematicalConsistency(parsed: any): { isValid: boolean; reason?: string } {
    if (parsed.questions && Array.isArray(parsed.questions)) {
      for (const q of parsed.questions) {
        const body = (q.body || '').toLowerCase();
        const ans = (q.correctAnswer || '').trim();

        const matchAdd = body.match(/(\d+)\s*\+\s*(\d+)/);
        if (matchAdd) {
          const left = parseInt(matchAdd[1], 10);
          const right = parseInt(matchAdd[2], 10);
          const sum = left + right;
          if (ans !== '' && !isNaN(parseInt(ans, 10)) && parseInt(ans, 10) !== sum && body.includes('what is')) {
            return {
              isValid: false,
              reason: `Arithmetic inconsistency detected. Formula "${left} + ${right}" evaluated to "${sum}", but LLM set correctAnswer to "${ans}".`,
            };
          }
        }
      }
    }
    return { isValid: true };
  }
}
