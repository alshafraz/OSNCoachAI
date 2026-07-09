// src/application/content-generation/config/acgpConfig.ts

/**
 * Central configuration for the AI Content Generation Platform (ACGP).
 * All generation behaviour is driven from here — no magic numbers in services.
 */
export const acgpConfig = {
  /** Default LLM provider to use. Options: 'openai' | 'mock' */
  defaultProvider: (process.env.ACGP_LLM_PROVIDER ?? 'openai') as 'openai' | 'mock',

  /** Maximum number of LLM regeneration attempts before failing */
  maxRegenerationAttempts: 3,

  /** Whether human review is required before publication */
  requireHumanReview: process.env.ACGP_REQUIRE_REVIEW !== 'false',

  /** Maximum questions in a single practice set */
  maxPracticeSetSize: 30,

  /** Maximum questions in a mock exam */
  maxMockExamSize: 50,

  /** Default temperature for question generation prompts */
  generationTemperature: 0.7,

  /** Default temperature for explanation prompts (more deterministic) */
  explanationTemperature: 0.3,

  /** Default temperature for hint prompts */
  hintTemperature: 0.5,

  /** Minimum quality score (0-100) required to pass validation */
  minQualityScore: 60,

  /** Minimum difficulty confidence (0-1) required to pass calibration */
  minDifficultyConfidence: 0.6,

  /** Similarity threshold above which content is considered a near-duplicate */
  duplicateSimilarityThreshold: 0.85,

  /** Prompt versions used for each content type */
  promptVersions: {
    question: 'v1',
    explanation: 'v1',
    hint: 'v1',
    concept: 'v1',
    practiceSet: 'v1',
    mockExam: 'v1',
    variation: 'v1',
  },

  /** Grade range supported */
  supportedGrades: [4, 5, 6] as const,

  /** Difficulty levels supported */
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'OLYMPIAD'] as const,

  /** Content types the platform can generate */
  supportedContentTypes: [
    'MULTIPLE_CHOICE',
    'SHORT_ANSWER',
    'FILL_IN_BLANK',
    'CHALLENGE',
    'OLYMPIAD',
    'VARIATION',
    'WORKED_SOLUTION',
    'EXPLANATION',
    'HINT_SET',
    'ALTERNATIVE_SOLUTION',
    'CONCEPT_SUMMARY',
    'FORMULA_EXPLANATION',
    'MISCONCEPTION',
    'MINI_LESSON',
    'PRACTICE_SET',
    'MOCK_EXAM',
    'REVISION_PACK',
  ] as const,
};

export type AcgpContentType = typeof acgpConfig.supportedContentTypes[number];
export type AcgpDifficulty = typeof acgpConfig.supportedDifficulties[number];
export type AcgpGrade = typeof acgpConfig.supportedGrades[number];
