/**
 * Mathematical Intelligence Layer — Service Interfaces (Domain Contracts)
 *
 * Every AI Agent, Use Case, and Prompt must call these interfaces.
 * Never call infrastructure implementations directly from application logic.
 */

import type {
  Concept,
  Skill,
  Strategy,
  Misconception,
  Formula,
  HintTemplate,
  HintLevel,
  ReasoningTemplate,
  LearningPath,
  QuestionConceptMap,
  DifficultyBreakdown,
  DifficultyLevel,
  CognitiveLevel,
} from '../../entities/math/MathEntities';

// ─── CONCEPT SERVICE ─────────────────────────────────────────────────────────

export interface ConceptService {
  getById(id: string): Concept | null;
  getAll(): Concept[];
  getChildren(conceptId: string): Concept[];
  getPrerequisites(conceptId: string): Concept[];
  getRelated(conceptId: string): Concept[];
  findByName(name: string): Concept | null;
  getByTopic(olympiadTopic: string): Concept[];
}

// ─── SKILL SERVICE ───────────────────────────────────────────────────────────

export interface SkillService {
  getById(id: string): Skill | null;
  getAll(): Skill[];
  getForConcept(conceptId: string): Skill[];
}

// ─── KNOWLEDGE GRAPH SERVICE ─────────────────────────────────────────────────

export interface KnowledgeGraphService {
  getDependencyChain(conceptId: string): Concept[];
  getLearningPath(fromConceptId: string, toConceptId: string): Concept[];
  getMissingPrerequisites(conceptId: string, masteredConceptIds: string[]): Concept[];
  getSimilarConcepts(conceptId: string): Concept[];
  getConceptCoverage(masteredConceptIds: string[]): {
    total: number;
    mastered: number;
    coveragePct: number;
    uncoveredCritical: Concept[];
  };
}

// ─── HINT SERVICE ─────────────────────────────────────────────────────────────

export interface HintService {
  getHint(conceptId: string, level: HintLevel): HintTemplate | null;
  getProgressiveHints(conceptId: string): HintTemplate[];
  buildHintText(template: HintTemplate, variables: Record<string, string>): string;
}

// ─── DIFFICULTY SERVICE ──────────────────────────────────────────────────────

export interface DifficultyService {
  score(params: {
    conceptIds: string[];
    stepCount: number;
    requiresOlympiadTrick: boolean;
    readingComplexity: number;
    calculationDepth: number;
  }): DifficultyBreakdown;
  compare(levelA: DifficultyLevel, levelB: DifficultyLevel): -1 | 0 | 1;
  isAppropriateForGrade(difficulty: DifficultyLevel, grade: number): boolean;
}

// ─── REASONING SERVICE ────────────────────────────────────────────────────────

export interface ReasoningService {
  getTemplate(conceptId: string): ReasoningTemplate | null;
  getUniversalTemplate(): ReasoningTemplate;
  buildReasoningTrace(
    questionBody: string,
    primaryConceptId: string,
    strategyIds: string[]
  ): {
    steps: { phase: string; guidance: string }[];
    appliedConcepts: string[];
    appliedStrategies: string[];
    suggestedMisconceptionsToCheck: string[];
  };
}

// ─── MISCONCEPTION SERVICE ───────────────────────────────────────────────────

export interface MisconceptionService {
  getById(id: string): Misconception | null;
  getForConcept(conceptId: string): Misconception[];
  detectFromAnswer(params: {
    questionBody: string;
    correctAnswer: string;
    studentAnswer: string;
    conceptId: string;
  }): Misconception[];
  getCorrectionStrategy(misconceptionId: string): string;
}

// ─── STRATEGY SERVICE ─────────────────────────────────────────────────────────

export interface StrategyService {
  getById(id: string): Strategy | null;
  getAll(): Strategy[];
  getForConcept(conceptId: string): Strategy[];
  recommendStrategies(conceptIds: string[]): Strategy[];
}

// ─── FORMULA SERVICE ─────────────────────────────────────────────────────────

export interface FormulaService {
  getById(id: string): Formula | null;
  getForConcept(conceptId: string): Formula[];
  searchByName(query: string): Formula[];
}

// ─── LEARNING PATH SERVICE ────────────────────────────────────────────────────

export interface LearningPathService {
  getPathForGrade(grade: number): LearningPath | null;
  buildAdaptivePath(masteredConceptIds: string[], targetConceptId: string): LearningPath;
  getNextConcept(masteredConceptIds: string[]): Concept | null;
}

// ─── QUESTION CONCEPT MAP SERVICE ────────────────────────────────────────────

export interface QuestionConceptMapService {
  mapQuestion(questionId: string, conceptMap: Omit<QuestionConceptMap, 'questionId'>): QuestionConceptMap;
  getMap(questionId: string): QuestionConceptMap | null;
  findSimilarQuestions(questionId: string): string[];
  getSuggestedCognitiveLevel(conceptId: string, difficulty: DifficultyLevel): CognitiveLevel;
}
