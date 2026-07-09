// src/application/content-generation/services/generators/MockExamGenerator.ts
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { GeneratedContent } from '../../domain/models/GeneratedContent';
import { GeneratedContentEntity } from '../../infrastructure/persistence/entities/GeneratedContentEntity';
import { GenerationRequest } from '../../domain/models/GenerationRequest';
import { QuestionGenerator } from './QuestionGenerator';
import { acgpConfig } from '../../config/acgpConfig';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MockExamGenerator {
  private readonly questionGenerator = new QuestionGenerator();

  async generate(request: GenerationRequest): Promise<GeneratedContent> {
    const start = Date.now();
    const count = Math.min(request.count ?? 10, acgpConfig.maxMockExamSize);
    const generatedItems: GeneratedContent[] = [];

    // Determine balanced difficulty distribution: e.g. 30% Easy, 40% Medium, 30% Hard
    const easyCount = Math.round(count * 0.3);
    const hardCount = Math.round(count * 0.3);
    
    for (let i = 0; i < count; i++) {
      let currentDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'OLYMPIAD' = 'MEDIUM';
      if (i < easyCount) {
        currentDifficulty = 'EASY';
      } else if (i >= count - hardCount) {
        currentDifficulty = request.contentType === 'OLYMPIAD' ? 'OLYMPIAD' : 'HARD';
      }

      const itemRequest: GenerationRequest = {
        ...request,
        id: uuidv4(),
        contentType: 'SHORT_ANSWER',
        difficulty: currentDifficulty,
        count: 1,
      };

      try {
        const item = await this.questionGenerator.generate(itemRequest);
        if (item.validationState === 'PASSED') {
          generatedItems.push(item);
        }
      } catch (err) {
        console.error(`[MockExamGenerator] Failed to generate item ${i + 1}`, err);
      }
    }

    const content: GeneratedContent = {
      id: uuidv4(),
      requestId: request.id,
      contentType: 'MOCK_EXAM',
      body: {
        setTitle: request.learningObjective ?? `Mock Exam: ${request.topic ?? 'Mixed Topics'}`,
        setDescription: `An Olympiad simulation assessment with ${generatedItems.length} questions.`,
        contentItems: generatedItems,
        difficultyDistribution: {
          EASY: generatedItems.filter(item => item.estimatedDifficulty === 'EASY').length,
          MEDIUM: generatedItems.filter(item => item.estimatedDifficulty === 'MEDIUM').length,
          HARD: generatedItems.filter(item => item.estimatedDifficulty === 'HARD').length,
          OLYMPIAD: generatedItems.filter(item => item.estimatedDifficulty === 'OLYMPIAD').length,
        }
      },
      generationState: generatedItems.length > 0 ? 'GENERATED' : 'FAILED',
      validationState: generatedItems.length > 0 ? 'PASSED' : 'FAILED',
      reviewState: acgpConfig.requireHumanReview ? 'PENDING' : 'APPROVED',
      publicationState: 'UNPUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
      promptVersion: acgpConfig.promptVersions.mockExam,
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
