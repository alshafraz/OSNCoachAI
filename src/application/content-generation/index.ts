// src/application/content-generation/index.ts
/**
 * Barrel exports for the AI Content Generation Platform (ACGP).
 */

// Domain models & types
export type { GenerationRequest } from './domain/models/GenerationRequest';
export type { GeneratedContent, ProgressiveHint, AlternativeSolution, MisconceptionNote, SolvingStep } from './domain/models/GeneratedContent';
export type { ValidationReport, ValidationIssue } from './domain/models/ValidationReport';
export type { ReviewRecord } from './domain/models/ReviewRecord';
export type { Publication } from './domain/models/Publication';
export type { ContentVariation } from './domain/models/ContentVariation';

// Orchestrator
export { ContentGenerationOrchestrator } from './engine/ContentGenerationOrchestrator';

// Services
export { ContentGenerationService } from './services/ContentGenerationService';
export { ContextBuilder } from './services/ContextBuilder';
export { PromptBuilder } from './services/PromptBuilder';
export { DifficultyCalibrator } from './services/DifficultyCalibrator';
export { VariationEngine } from './services/VariationEngine';
export { ValidationService } from './services/ValidationService';
export { PublicationService } from './services/PublicationService';
export { ObservabilityService } from './services/ObservabilityService';

// Generators
export { QuestionGenerator } from './services/generators/QuestionGenerator';
export { ExplanationGenerator } from './services/generators/ExplanationGenerator';
export { HintGenerator } from './services/generators/HintGenerator';
export { ConceptGenerator } from './services/generators/ConceptGenerator';
export { PracticeSetGenerator } from './services/generators/PracticeSetGenerator';
export { MockExamGenerator } from './services/generators/MockExamGenerator';

// Express API Router
export { default as contentRouter } from './api/controllers/ContentGenerationController';
