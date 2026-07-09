// src/application/ai-tutor/config/tutorConfig.ts
/**
 * Configuration for the AI Tutor Engine.
 * All values are configurable without code changes.
 */
export const tutorConfig = {
  // LLM model identifier (used by AI Platform)
  model: 'gpt-4o',
  // Maximum tokens for the LLM response
  maxTokens: 1024,
  // Temperature for creativity (0.0 - 1.0)
  temperature: 0.7,
  // Hint levels (1‑5) definitions
  hintLevels: [
    { level: 1, description: 'Observation – point out what is given.' },
    { level: 2, description: 'Relevant concept – introduce a concept that applies.' },
    { level: 3, description: 'Applicable formula – provide the formula needed.' },
    { level: 4, description: 'Partial reasoning – outline the next reasoning step.' },
    { level: 5, description: 'Near‑complete solution – almost finish the problem.' },
  ],
  // Validation settings for response guardrails
  validation: {
    enable: true,
    maxTokens: 1500,
    temperature: 0.2,
    topP: 0.9,
  },
  // Pedagogical rules
  pedagogical: {
    requireConceptReference: true,
    maxHintsPerSession: 10,
  },
};
