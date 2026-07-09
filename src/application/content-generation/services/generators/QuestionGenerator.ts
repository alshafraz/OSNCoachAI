// src/application/content-generation/services/generators/QuestionGenerator.ts
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { GeneratedContent } from '../../domain/models/GeneratedContent';
import { GeneratedContentEntity } from '../../infrastructure/persistence/entities/GeneratedContentEntity';
import { GenerationRequest } from '../../domain/models/GenerationRequest';
import { ContextBuilder } from '../ContextBuilder';
import { PromptBuilder } from '../PromptBuilder';
import { OpenAiLlmProvider } from '../../../../infrastructure/services/ai/LlmProviderRegistry';
import { ValidationService } from '../ValidationService';
import { DifficultyCalibrator } from '../DifficultyCalibrator';
import { ObservabilityService } from '../ObservabilityService';
import { acgpConfig } from '../../config/acgpConfig';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QuestionGenerator {
  private readonly contextBuilder = new ContextBuilder();
  private readonly promptBuilder = new PromptBuilder();
  private readonly llmProvider = new OpenAiLlmProvider();
  private readonly validationService = new ValidationService();
  private readonly calibrator = new DifficultyCalibrator();
  private readonly obsService = new ObservabilityService();

  async generate(request: GenerationRequest): Promise<GeneratedContent> {
    this.obsService.trackRequest(request.contentType);
    const start = Date.now();

    // 1. Context and prompt builder steps
    const context = await this.contextBuilder.buildContext(request);
    const rendered = this.promptBuilder.buildPrompt(request, context);

    // 2. LLM Call
    const response = await this.llmProvider.generate({
      prompt: rendered.userPrompt,
      systemPrompt: rendered.systemPrompt,
      temperature: rendered.temperature ?? acgpConfig.generationTemperature,
      maxTokens: rendered.maxTokens ?? 2048,
      responseFormat: 'json',
    });

    const latency = Date.now() - start;
    this.obsService.trackSuccess(response.tokensUsed, latency);

    // 3. Create content record
    const body = JSON.parse(response.content);
    const content: GeneratedContent = {
      id: uuidv4(),
      requestId: request.id,
      contentType: request.contentType,
      body,
      generationState: 'GENERATED',
      validationState: 'PENDING',
      reviewState: acgpConfig.requireHumanReview ? 'PENDING' : 'APPROVED',
      publicationState: 'UNPUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
      promptVersion: acgpConfig.promptVersions.question,
      modelUsed: response.model,
      tokensUsed: response.tokensUsed.total,
      estimatedCostUsd: (response.tokensUsed.prompt * 0.15 + response.tokensUsed.completion * 0.60) / 1000000,
      generationTimeMs: latency,
      regenerationCount: 0,
    };

    // Save initial generated state
    const contentRepo = getRepository(GeneratedContentEntity);
    const savedEntity = contentRepo.create(content);
    await contentRepo.save(savedEntity);

    // 4. Calibration & Validation
    const calibration = this.calibrator.calibrate(content);
    content.estimatedDifficulty = calibration.estimatedDifficulty;
    content.difficultyConfidence = calibration.difficultyConfidence;
    content.body.hints = body.hints ?? [];
    content.body.solvingSteps = body.solvingSteps ?? [];

    await contentRepo.update(content.id, {
      estimatedDifficulty: content.estimatedDifficulty,
      difficultyConfidence: content.difficultyConfidence,
    });

    await this.validationService.validateContent(content);

    return content;
  }
}
