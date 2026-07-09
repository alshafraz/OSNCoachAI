// src/application/content-generation/services/generators/PracticeSetGenerator.ts
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { GeneratedContent } from '../../domain/models/GeneratedContent';
import { GeneratedContentEntity } from '../../infrastructure/persistence/entities/GeneratedContentEntity';
import { GenerationRequest } from '../../domain/models/GenerationRequest';
import { QuestionGenerator } from './QuestionGenerator';
import { acgpConfig } from '../../config/acgpConfig';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PracticeSetGenerator {
  private readonly questionGenerator = new QuestionGenerator();

  async generate(request: GenerationRequest): Promise<GeneratedContent> {
    const start = Date.now();
    const count = Math.min(request.count ?? 5, acgpConfig.maxPracticeSetSize);
    
    const generatedItems: GeneratedContent[] = [];
    
    // Generate questions one by one to ensure each undergoes rigorous validation
    for (let i = 0; i < count; i++) {
      // Modify request details if topic progression is desired
      const itemRequest: GenerationRequest = {
        ...request,
        id: uuidv4(),
        contentType: 'SHORT_ANSWER',
        count: 1,
      };

      if (request.topicMix === 'difficultyProgression') {
        const difficulties = acgpConfig.supportedDifficulties;
        const index = Math.min(i, difficulties.length - 1);
        itemRequest.difficulty = difficulties[index];
      }

      try {
        const item = await this.questionGenerator.generate(itemRequest);
        if (item.validationState === 'PASSED') {
          generatedItems.push(item);
        }
      } catch (err) {
        console.error(`[PracticeSetGenerator] Failed to generate item ${i + 1}`, err);
      }
    }

    const content: GeneratedContent = {
      id: uuidv4(),
      requestId: request.id,
      contentType: 'PRACTICE_SET',
      body: {
        setTitle: request.learningObjective ?? `Practice Set: ${request.topic ?? 'Mixed Topics'}`,
        setDescription: `A custom-generated set of ${generatedItems.length} questions.`,
        contentItems: generatedItems,
      },
      generationState: generatedItems.length > 0 ? 'GENERATED' : 'FAILED',
      validationState: generatedItems.length > 0 ? 'PASSED' : 'FAILED',
      reviewState: acgpConfig.requireHumanReview ? 'PENDING' : 'APPROVED',
      publicationState: 'UNPUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
      promptVersion: acgpConfig.promptVersions.practiceSet,
      modelUsed: 'pipeline-aggregator',
      tokensUsed: generatedItems.reduce((acc, item) => acc + (item.tokensUsed ?? 0), 0),
      estimatedCostUsd: generatedItems.reduce((acc, item) => acc + (item.estimatedCostUsd ?? 0), 0),
      generationTimeMs: Date.now() - start,
      regenerationCount: 0,
    };

    const contentRepo = getRepository(GeneratedContentEntity);
    await contentRepo.save(contentRepo.create(content));

    return content;
  }
}
