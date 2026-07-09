// src/application/ai-governance/index.ts
/**
 * Barrel export for the AI Governance & Operations Platform (AIOps).
 *
 * Import from this file to access any AIOps registry, service, DTO, or API.
 */

// Orchestrator
export { GovernanceOrchestrator } from './engine/GovernanceOrchestrator';
export type { GovernanceInput } from './engine/GovernanceOrchestrator';

// Services
export { PromptRegistry } from './services/PromptRegistry';
export { PromptVersionService } from './services/PromptVersionService';
export { ModelRouter } from './services/ModelRouter';
export { ProviderGateway } from './services/ProviderGateway';
export { ValidationService } from './services/ValidationService';
export { SafetyGuardrailService } from './services/SafetyGuardrailService';
export { EvaluationService } from './services/EvaluationService';
export { BenchmarkService } from './services/BenchmarkService';
export { CostService } from './services/CostService';
export { AuditService } from './services/AuditService';
export { FeatureFlagService } from './services/FeatureFlagService';

// Domain models
export type { Prompt, PromptVersion } from './domain/models/Prompt';
export type { PromptEvaluation } from './domain/models/PromptEvaluation';
export type { ModelProvider } from './domain/models/ModelProvider';
export type { AIRequest } from './domain/models/AIRequest';
export type { AIResponse } from './domain/models/AIResponse';
export type { CostTracking } from './domain/models/CostTracking';
export type { AuditLog } from './domain/models/AuditLog';
export type { FeatureFlag } from './domain/models/FeatureFlag';
export type { Benchmark } from './domain/models/Benchmark';

// Config
export { governanceConfig } from './config/governanceConfig';
export type { AIOpsTaskType, AIOpsModelProvider, AIOpsReleaseStatus, AIOpsRolloutStatus } from './config/governanceConfig';

// API router
export { default as aiGovernanceRouter } from './api/controllers/GovernanceController';
