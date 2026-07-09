// src/application/adaptive-learning/index.ts
/**
 * Barrel export for the Personalized Adaptive Learning Engine (PALE).
 *
 * Import from this file to access any PALE service, domain model, or API
 * from outside the module boundary.
 */

// Top-level facade
export { AdaptiveLearningService } from './services/AdaptiveLearningService';

// Orchestrator
export { AdaptationOrchestrator } from './engine/AdaptationOrchestrator';
export type { AdaptationInput } from './engine/AdaptationOrchestrator';

// Services
export { DifficultyEngine } from './services/DifficultyEngine';
export { ReviewScheduler } from './services/ReviewScheduler';
export { QuestionSelectionService } from './services/QuestionSelectionService';
export { LearningPathService } from './services/LearningPathService';
export { LearningSessionPlanner } from './services/LearningSessionPlanner';
export { RecoveryEngine } from './services/RecoveryEngine';
export { ChallengeEngine } from './services/ChallengeEngine';
export { SimulationEngine } from './services/SimulationEngine';
export { PaceEngine } from './services/PaceEngine';
export { GoalAdapter } from './services/GoalAdapter';
export { ExplainabilityFormatter } from './services/ExplainabilityFormatter';

// Domain models
export type { AdaptivePlan } from './domain/models/AdaptivePlan';
export type { AdaptationDecision } from './domain/models/AdaptationDecision';
export type { LearningPath } from './domain/models/LearningPath';
export type { LearningPathNode } from './domain/models/LearningPathNode';
export type { ReviewSchedule } from './domain/models/ReviewSchedule';
export type { DifficultyState } from './domain/models/DifficultyState';
export type { SimulationResult } from './domain/models/SimulationResult';
export type { RecoveryPlan } from './domain/models/RecoveryPlan';
export type { ChallengePlan } from './domain/models/ChallengePlan';
export type { LearningSession } from './domain/models/LearningSession';

// Config types
export { paleConfig } from './config/paleConfig';
export type { PaleDifficulty, PaceRecommendation, AdaptationAction } from './config/paleConfig';

// Observability
export { paleMetrics } from './monitoring/paleMetrics';

// DTOs
export type { AdaptivePlanDto, AdaptationDecisionDto } from './api/dtos/AdaptivePlanDto';
export type { LearningSessionDto } from './api/dtos/LearningSessionDto';

// API router
export { default as adaptiveLearningRouter } from './api/controllers/AdaptiveLearningController';
