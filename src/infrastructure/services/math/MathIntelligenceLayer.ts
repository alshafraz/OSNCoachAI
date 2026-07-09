/**
 * Mathematical Intelligence Layer — Main Entry Point
 *
 * Import this module to access the complete MIL.
 * Never import infrastructure classes directly from application or AI agent code.
 * Always use these service instances.
 *
 * Usage:
 *   import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';
 *   const concept = MIL.concepts.getById('primes');
 *   const hints = MIL.hints.getProgressiveHints('fractions');
 *   const score = MIL.difficulty.score({ conceptIds: ['gcd'], stepCount: 4, ... });
 */

import { ConceptGraphService } from './ConceptGraph';
import { SkillTaxonomyService } from './SkillTaxonomy';
import { MisconceptionLibraryService } from './MisconceptionLibrary';
import { FormulaLibraryService } from './FormulaLibrary';
import { StrategyLibraryService } from './StrategyLibrary';
import { HintEngineService } from './HintEngine';
import { DifficultyEngineService } from './DifficultyEngine';
import { ReasoningEngineService } from './ReasoningEngine';
import { KnowledgeGraphEngineService } from './KnowledgeGraph';
import { LearningPathEngineService } from './LearningPathEngine';

import type {
  ConceptService,
  SkillService,
  MisconceptionService,
  FormulaService,
  StrategyService,
  HintService,
  DifficultyService,
  ReasoningService,
  KnowledgeGraphService,
  LearningPathService,
} from '@/domain/services/math/MathServices';

export interface MathIntelligenceLayer {
  concepts: ConceptService;
  skills: SkillService;
  misconceptions: MisconceptionService;
  formulas: FormulaService;
  strategies: StrategyService;
  hints: HintService;
  difficulty: DifficultyService;
  reasoning: ReasoningService;
  knowledgeGraph: KnowledgeGraphService;
  learningPaths: LearningPathService;
}

export const MIL: MathIntelligenceLayer = {
  concepts: new ConceptGraphService(),
  skills: new SkillTaxonomyService(),
  misconceptions: new MisconceptionLibraryService(),
  formulas: new FormulaLibraryService(),
  strategies: new StrategyLibraryService(),
  hints: new HintEngineService(),
  difficulty: new DifficultyEngineService(),
  reasoning: new ReasoningEngineService(),
  knowledgeGraph: new KnowledgeGraphEngineService(),
  learningPaths: new LearningPathEngineService(),
};

// ─── RE-EXPORTS ───────────────────────────────────────────────────────────────
// Export entities and types for use across the application
export type {
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
  SkillCategory,
  ErrorCategory,
} from '@/domain/entities/math/MathEntities';
