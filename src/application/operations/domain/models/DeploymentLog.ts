// src/application/operations/domain/models/DeploymentLog.ts

export interface DeploymentLog {
  id: string;
  version: string; // e.g. '1.4.0'
  commitHash: string;
  environment: 'production' | 'staging' | 'testing' | 'development';
  deployedBy: string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'ROLLED_BACK';
  deployedAt: Date;
  completedAt?: Date;
  releaseNotes?: string;
}
