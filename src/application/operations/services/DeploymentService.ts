// src/application/operations/services/DeploymentService.ts
import { DeploymentLog } from '../domain/models/DeploymentLog';
import { DeploymentRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * DeploymentService governs release logging, rolling updates, and rollback capabilities.
 */
export class DeploymentService {
  private readonly logger = new Logger('DeploymentService');
  private readonly repo = new DeploymentRepository();

  /** Trigger deployment rollout sequence. */
  async deploy(version: string, commitHash: string, author: string, notes?: string): Promise<DeploymentLog> {
    const deployment: DeploymentLog = {
      id: uuidv4(),
      version,
      commitHash,
      environment: 'production',
      deployedBy: author,
      status: 'IN_PROGRESS',
      deployedAt: new Date(),
      releaseNotes: notes,
    };

    await this.repo.save(deployment as any);
    this.logger.info('Deployment sequence initiated', { version, commitHash });

    // Simulate blue-green rollout verification
    try {
      deployment.status = 'SUCCESS';
      deployment.completedAt = new Date();
      await this.repo.save(deployment as any);
      this.logger.info('Deployment completed successfully', { version });
    } catch (err: any) {
      deployment.status = 'FAILED';
      await this.repo.save(deployment as any);
      this.logger.error('Deployment failed', { version, error: err.message });
    }

    return deployment;
  }

  /** Rollback to previous deployment. */
  async rollback(deploymentId: string): Promise<void> {
    const deployment = await this.repo.findById(deploymentId);
    if (!deployment) throw new Error(`Deployment "${deploymentId}" not found.`);

    deployment.status = 'ROLLED_BACK';
    await this.repo.save(deployment);
    this.logger.warn('Deployment rolled back', { deploymentId, version: deployment.version });
  }

  /** Get list of deployments. */
  async getRecentDeployments(limit = 10): Promise<DeploymentLog[]> {
    const list = await this.repo.findRecent(limit);
    return list as unknown as DeploymentLog[];
  }
}
export const defaultDeploymentService = new DeploymentService();
