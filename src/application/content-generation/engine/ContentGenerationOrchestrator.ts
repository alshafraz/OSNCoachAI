// src/application/content-generation/engine/ContentGenerationOrchestrator.ts
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { GenerationRequest } from '../domain/models/GenerationRequest';
import { GeneratedContent } from '../domain/models/GeneratedContent';
import { GeneratedContentEntity } from '../infrastructure/persistence/entities/GeneratedContentEntity';
import { ContentGenerationService } from '../services/ContentGenerationService';
import { acgpConfig } from '../config/acgpConfig';
import { Logger } from '../../../infra/logger';

@Injectable()
export class ContentGenerationOrchestrator {
  private readonly logger = new Logger('ContentGenerationOrchestrator');
  private readonly genService = new ContentGenerationService();

  /**
   * Run the full sequential generation, calibration, validation, and optionally publish.
   * Employs auto-retry regeneration on CIP validation failures up to maxRegenerationAttempts.
   */
  async executePipeline(request: GenerationRequest, autoPublish = false): Promise<GeneratedContent> {
    this.logger.info(`Starting ACGP content pipeline for request ${request.id}`, { contentType: request.contentType });
    
    let attempts = 0;
    let content: GeneratedContent | null = null;

    while (attempts < acgpConfig.maxRegenerationAttempts) {
      attempts++;
      try {
        content = await this.genService.processGenerationRequest(request);
        content.regenerationCount = attempts - 1;

        const contentRepo = getRepository(GeneratedContentEntity);
        await contentRepo.update(content.id, {
          regenerationCount: content.regenerationCount
        });

        if (content.validationState === 'PASSED') {
          this.logger.info(`Pipeline success on attempt ${attempts} for content ${content.id}`);
          break;
        } else {
          this.logger.warn(`Validation failed on attempt ${attempts} for request ${request.id}. Retrying...`);
        }
      } catch (err) {
        this.logger.error(`Error on pipeline attempt ${attempts}`, { error: err });
        if (attempts >= acgpConfig.maxRegenerationAttempts) {
          throw err;
        }
      }
    }

    if (!content) {
      throw new Error(`Content generation failed for request ${request.id} after ${attempts} attempts.`);
    }

    // Auto publish if specified and permitted (requires review bypass configuration)
    if (autoPublish && content.validationState === 'PASSED' && !acgpConfig.requireHumanReview) {
      try {
        await this.genService.publishContent(content.id, 'system-orchestrator');
        this.logger.info(`Auto-published content ${content.id}`);
      } catch (err) {
        this.logger.error(`Auto-publication failed for content ${content.id}`, { error: err });
      }
    }

    return content;
  }
}
