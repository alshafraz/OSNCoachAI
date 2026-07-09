// src/application/operations/index.ts
/**
 * Barrel export for the Production Platform Operations module.
 */

// Config
export { operationsConfig } from './config/operationsConfig';

// Domain models
export type { DeploymentLog } from './domain/models/DeploymentLog';
export type { BackupRecord } from './domain/models/BackupRecord';
export type { HealthStatus } from './domain/models/HealthStatus';
export type { SystemEvent } from './domain/models/SystemEvent';
export type { SystemMetrics } from './domain/models/SystemMetrics';

// Services
export { DeploymentService } from './services/DeploymentService';
export { BackupService } from './services/BackupService';
export { RestoreService } from './services/RestoreService';
export { HealthService } from './services/HealthService';
export { MonitoringService } from './services/MonitoringService';
export { AlertService } from './services/AlertService';
export { AuditService } from './services/AuditService';
export { MaintenanceService } from './services/MaintenanceService';

// Controller API router
export { default as operationsRouter } from './api/controllers/OperationsController';
