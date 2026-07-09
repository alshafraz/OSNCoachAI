// src/application/content-generation/services/VariationEngine.ts
import { Injectable } from '@nestjs/common';
import { DuplicateDetectorImpl } from '../../../infrastructure/services/cip/DuplicateDetector';
import { GeneratedContent } from '../domain/models/GeneratedContent';
import { GenerationRequest } from '../domain/models/GenerationRequest';
import { OpenAiLlmProvider } from '../../../infrastructure/services/ai/LlmProviderRegistry';
import { PromptRegistry } from '../../../infrastructure/services/ai/PromptRegistry';
import { renderPrompt } from '../../../domain/services/ai/Prompt';
import { acgpConfig } from '../config/acgpConfig';
import { ExtractedQuestion } from '@/domain/entities/cip/ContentEntities';

@Injectable()
export class VariationEngine {
  private readonly detector = new DuplicateDetectorImpl();
  private readonly provider = new OpenAiLlmProvider();

  /**
   * Generates a question variation while preserving learning objectives.
   */
  async generateVariation(
    sourceContent: GeneratedContent,
    aspects: string[],
    request: GenerationRequest
  ): Promise<GeneratedContent> {

    
    // Construct user prompt for variations
    const promptTemplate = PromptRegistry.getPrompt('variation-generate');
    const userPrompt = renderPrompt(promptTemplate.userTemplate, {
      sourceBody: JSON.stringify(sourceContent.body),
      aspects: aspects.join(', '),
      topic: request.topic ?? (sourceContent.body as any).topic ?? '',
      difficulty: request.difficulty ?? sourceContent.estimatedDifficulty ?? 'MEDIUM',
    });

    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: promptTemplate.systemTemplate,
      temperature: acgpConfig.generationTemperature,
      maxTokens: promptTemplate.maxTokens,
      responseFormat: 'json',
    });

    const body = JSON.parse(response.content);

    // Create variation object
    const variation: GeneratedContent = {
      id: `gen-${Math.random().toString(36).substring(7)}`,
      requestId: request.id,
      contentType: 'VARIATION',
      body,
      generationState: 'GENERATED',
      validationState: 'PENDING',
      reviewState: 'PENDING',
      publicationState: 'UNPUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
      regenerationCount: 0,
    };

    // Duplicate detection comparison check
    const sourceExtracted: ExtractedQuestion = {
      body: sourceContent.body.questionBody ?? '',
      format: (sourceContent.body.questionType as any) ?? 'SHORT_ANSWER',
      choices: (sourceContent.body.choices ?? []).map((c: any) => typeof c === 'string' ? c : c.text),
      correctAnswer: sourceContent.body.correctAnswer ?? '',
      explanation: sourceContent.body.explanation ?? '',
      sections: [],
      diagrams: [],
      mathExpressions: [],
      formulaIds: [],
      rawText: sourceContent.body.questionBody ?? '',
    };

    const varExtracted: ExtractedQuestion = {
      body: body.questionBody ?? '',
      format: (body.questionType as any) ?? 'SHORT_ANSWER',
      choices: (body.choices ?? []).map((c: any) => typeof c === 'string' ? c : c.text),
      correctAnswer: body.correctAnswer ?? '',
      explanation: body.explanation ?? '',
      sections: [],
      diagrams: [],
      mathExpressions: [],
      formulaIds: [],
      rawText: body.questionBody ?? '',
    };

    const similarity = this.detector.computeSimilarity(sourceExtracted, varExtracted);
    
    // Near duplicate threshold warning
    if (similarity > acgpConfig.duplicateSimilarityThreshold) {
      console.warn(`[VariationEngine] Warning: Variation has high similarity (${(similarity*100).toFixed(0)}%) with source question.`);
    }

    return variation;
  }
}
export { DuplicateDetectorImpl };
