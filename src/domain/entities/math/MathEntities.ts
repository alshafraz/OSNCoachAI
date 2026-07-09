/**
 * Mathematical Intelligence Layer — Core Domain Entities
 * Single source of truth for mathematical concepts, skills, strategies,
 * misconceptions, and formulas across the MathOSN Coach platform.
 */

// ─── DIFFICULTY ─────────────────────────────────────────────────────────────

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'OLYMPIAD' | 'EXPERT';

export type CognitiveLevel =
  | 'REMEMBER'
  | 'UNDERSTAND'
  | 'APPLY'
  | 'ANALYZE'
  | 'OLYMPIAD_SOLVE'
  | 'CREATIVE_REASON'
  | 'GENERALIZE';

// ─── CONCEPT ─────────────────────────────────────────────────────────────────

export interface Concept {
  id: string;
  name: string;
  description: string;
  parentConceptId: string | null;
  childConceptIds: string[];
  prerequisiteConceptIds: string[];
  relatedConceptIds: string[];
  difficulty: DifficultyLevel;
  estimatedLearningMinutes: number;
  gradeRecommendation: number;
  olympiadTopics: string[];
  learningObjectives: string[];
  exampleProblems: string[];
  commonMistakes: string[];
  visualAids: string[];
  typicalSolutionMethods: string[];
  formulaIds: string[];
  misconceptionIds: string[];
  skillIds: string[];
}

// ─── SKILL ───────────────────────────────────────────────────────────────────

export type SkillCategory =
  | 'PATTERN_RECOGNITION'
  | 'LOGICAL_DEDUCTION'
  | 'VISUALIZATION'
  | 'ARITHMETIC_ACCURACY'
  | 'ALGEBRAIC_MANIPULATION'
  | 'GEOMETRIC_REASONING'
  | 'COUNTING_STRATEGIES'
  | 'OPTIMIZATION'
  | 'PROOF_THINKING'
  | 'MULTI_STEP_REASONING';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  relatedConceptIds: string[];
  assessmentIndicators: string[];
}

// ─── STRATEGY ────────────────────────────────────────────────────────────────

export interface Strategy {
  id: string;
  name: string;
  description: string;
  applicableConceptIds: string[];
  steps: string[];
  whenToUse: string;
  examples: string[];
}

// ─── MISCONCEPTION ───────────────────────────────────────────────────────────

export type ErrorCategory =
  | 'CONCEPT_ERROR'
  | 'CALCULATION_ERROR'
  | 'READING_ERROR'
  | 'LOGIC_ERROR'
  | 'STRATEGY_ERROR'
  | 'TIME_PRESSURE'
  | 'CARELESSNESS'
  | 'KNOWLEDGE_GAP';

export interface Misconception {
  id: string;
  name: string;
  description: string;
  errorCategory: ErrorCategory;
  conceptIds: string[];
  typicalStudentBehavior: string;
  detectionRules: string[];
  correctionStrategy: string;
  recommendedExercises: string[];
}

// ─── FORMULA ─────────────────────────────────────────────────────────────────

export interface Formula {
  id: string;
  name: string;
  description: string;
  expression: string;
  variables: { symbol: string; meaning: string }[];
  applicableConceptIds: string[];
  example: string;
  commonMistakes: string[];
  visualAidReference?: string;
}

// ─── HINT TEMPLATE ───────────────────────────────────────────────────────────

export type HintLevel = 1 | 2 | 3 | 4 | 5;

export interface HintTemplate {
  id: string;
  conceptId: string;
  level: HintLevel;
  levelName: string;
  template: string;
  revealAmount: 'DIRECTION' | 'CONCEPT' | 'FORMULA' | 'PARTIAL' | 'NEAR_COMPLETE';
}

// ─── REASONING TEMPLATE ──────────────────────────────────────────────────────

export interface ReasoningStep {
  stepIndex: number;
  phase:
    | 'UNDERSTAND'
    | 'EXTRACT_INFO'
    | 'KNOWN_FACTS'
    | 'UNKNOWN_VARIABLES'
    | 'STRATEGY_SELECT'
    | 'EXECUTE'
    | 'VERIFY'
    | 'REFLECT';
  promptTemplate: string;
  childFriendlyGuidance: string;
}

export interface ReasoningTemplate {
  id: string;
  name: string;
  applicableConceptIds: string[];
  steps: ReasoningStep[];
}

// ─── LEARNING PATH ───────────────────────────────────────────────────────────

export interface LearningPathNode {
  conceptId: string;
  orderIndex: number;
  estimatedMinutes: number;
  requiredMasteryPct: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetGrade: number;
  nodes: LearningPathNode[];
}

// ─── QUESTION CONCEPT MAP ────────────────────────────────────────────────────

export interface QuestionConceptMap {
  questionId: string;
  primaryConceptId: string;
  secondaryConceptIds: string[];
  skillIds: string[];
  strategyIds: string[];
  prerequisiteConceptIds: string[];
  misconceptionIds: string[];
  cognitiveLevel: CognitiveLevel;
  estimatedSolveMinutes: number;
  thinkingPattern: string;
}

// ─── DIFFICULTY SCORE BREAKDOWN ──────────────────────────────────────────────

export interface DifficultyBreakdown {
  conceptComplexity: number;
  calculationComplexity: number;
  reasoningDepth: number;
  numberOfSteps: number;
  readingDifficulty: number;
  multiConceptFactor: number;
  olympiadTrickFactor: number;
  totalScore: number;
  level: DifficultyLevel;
}
