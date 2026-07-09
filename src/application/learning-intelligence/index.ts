// src/application/learning-intelligence/index.ts
/**
 * Barrel export for the Learning Intelligence Platform (LIP).
 *
 * Import from this file to access any LIP service, entity, or repository
 * from outside the module boundary.
 */

// Services
export { LearningAnalyticsService } from './services/LearningAnalyticsService';
export { MetricEngine } from './services/MetricEngine';
export { TrendEngine } from './services/TrendEngine';
export { RetentionEngine } from './services/RetentionEngine';
export { PredictionEngine } from './services/PredictionEngine';
export { InsightEngine } from './services/InsightEngine';
export { TopicAnalyticsService } from './services/TopicAnalyticsService';
export { ConceptAnalyticsService } from './services/ConceptAnalyticsService';
export { SkillAnalyticsService } from './services/SkillAnalyticsService';
export { RetentionAnalyticsService } from './services/RetentionAnalyticsService';

// Orchestrator
export { AnalyticsOrchestrator } from './engine/AnalyticsOrchestrator';

// Domain models
export type { LearningEvent } from './domain/models/LearningEvent';
export type { MetricSnapshot } from './domain/models/MetricSnapshot';
export type { TopicAnalytics } from './domain/models/TopicAnalytics';
export type { Insight } from './domain/models/Insight';

// DTOs
export type { EventDto } from './api/dtos/EventDto';
export type { MetricSnapshotDto } from './api/dtos/MetricSnapshotDto';
export type { InsightDto } from './api/dtos/InsightDto';

// API router
export { default as analyticsRouter } from './api/controllers/AnalyticsController';
