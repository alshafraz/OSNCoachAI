// src/application/ai-governance/services/PromptVersionService.ts
import { PromptVersion } from '../domain/models/Prompt';
import { PromptRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * PromptVersionService governs prompt releases, versions, rollbacks, and evaluations.
 */
export class PromptVersionService {
  private readonly logger = new Logger('PromptVersionService');
  private readonly repo = new PromptRepository();

  /** Push a new prompt version to a prompt. */
  async createVersion(promptId: string, versionData: Partial<PromptVersion>): Promise<PromptVersion> {
    const prompt = await this.repo.findById(promptId);
    if (!prompt) throw new Error(`Prompt with ID "${promptId}" not found.`);

    const semver = versionData.semver || '1.0.0';

    const ver: PromptVersion = {
      versionId: uuidv4(),
      promptId,
      semver,
      author: versionData.author || 'System',
      description: versionData.description || 'New version',
      status: versionData.status || 'DRAFT',
      releaseNotes: versionData.releaseNotes || 'No notes',
      systemTemplate: versionData.systemTemplate || '',
      userTemplate: versionData.userTemplate || '',
      temperature: versionData.temperature ?? 0.3,
      maxTokens: versionData.maxTokens ?? 2048,
      expectedOutputSchema: versionData.expectedOutputSchema,
      evaluationScore: versionData.evaluationScore,
      createdAt: new Date(),
    };

    await this.repo.saveVersion(ver as any);
    this.logger.info('Prompt version created', { promptId, semver });
    return ver;
  }

  /** Promote a prompt version to active (Rollout). */
  async promoteVersion(promptId: string, semver: string): Promise<void> {
    const prompt = await this.repo.findById(promptId);
    if (!prompt) throw new Error(`Prompt with ID "${promptId}" not found.`);

    const version = await this.repo.findVersion(promptId, semver);
    if (!version) throw new Error(`Prompt version "${semver}" not found for prompt "${promptId}".`);

    prompt.activeVersion = semver;
    prompt.updatedAt = new Date();
    await this.repo.savePrompt(prompt);
    this.logger.info('Prompt version promoted to active', { promptId, semver });
  }

  /** Rollback active version to a previous version. */
  async rollbackVersion(promptId: string, targetSemver: string): Promise<void> {
    const prompt = await this.repo.findById(promptId);
    if (!prompt) throw new Error(`Prompt with ID "${promptId}" not found.`);

    const targetVersion = await this.repo.findVersion(promptId, targetSemver);
    if (!targetVersion) {
      throw new Error(`Rollback failed. Target version "${targetSemver}" does not exist.`);
    }

    const previousSemver = prompt.activeVersion;
    prompt.activeVersion = targetSemver;
    prompt.updatedAt = new Date();
    await this.repo.savePrompt(prompt);
    this.logger.warn('Prompt rolled back', { promptId, from: previousSemver, to: targetSemver });
  }

  /** Update target evaluation score. */
  async updateEvaluationScore(promptId: string, semver: string, score: number): Promise<void> {
    const version = await this.repo.findVersion(promptId, semver);
    if (!version) return;
    version.evaluationScore = score;
    await this.repo.saveVersion(version);
  }
}
