// src/application/content-generation/services/ContentGenerationService.ts
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { GenerationRequest } from '../domain/models/GenerationRequest';
import { GeneratedContent } from '../domain/models/GeneratedContent';
import { GenerationRequestEntity } from '../infrastructure/persistence/entities/GenerationRequestEntity';
import { QuestionGenerator } from './generators/QuestionGenerator';
import { ExplanationGenerator } from './generators/ExplanationGenerator';
import { HintGenerator } from './generators/HintGenerator';
import { ConceptGenerator } from './generators/ConceptGenerator';
import { PracticeSetGenerator } from './generators/PracticeSetGenerator';
import { MockExamGenerator } from './generators/MockExamGenerator';
import { VariationEngine } from './VariationEngine';
import { ValidationService } from './ValidationService';
import { PublicationService } from './PublicationService';
import { ObservabilityService } from './ObservabilityService';

@Injectable()
export class ContentGenerationService {
  private readonly questionGen = new QuestionGenerator();
  private readonly explanationGen = new ExplanationGenerator();
  private readonly hintGen = new HintGenerator();
  private readonly conceptGen = new ConceptGenerator();
  private readonly practiceSetGen = new PracticeSetGenerator();
  private readonly mockExamGen = new MockExamGenerator();
  private readonly variationEngine = new VariationEngine();
  private readonly validationService = new ValidationService();
  private readonly publicationService = new PublicationService();
  private readonly obsService = new ObservabilityService();

  /**
   * Receives a request, persists it, and routes it to the specific generator.
   */
  async processGenerationRequest(request: GenerationRequest): Promise<GeneratedContent> {
    // 1. Save Request to DB
    const requestRepo = getRepository(GenerationRequestEntity);
    const savedRequest = requestRepo.create(request as any);
    await requestRepo.save(savedRequest);

    let content: GeneratedContent;

    // 2. Route to correct generator
    const type = request.contentType;
    if (type === 'PRACTICE_SET') {
      content = await this.practiceSetGen.generate(request);
    } else if (type === 'MOCK_EXAM') {
      content = await this.mockExamGen.generate(request);
    } else if (type.includes('EXPLANATION') || type.includes('WORKED_SOLUTION')) {
      content = await this.explanationGen.generate(request);
    } else if (type.includes('HINT')) {
      content = await this.hintGen.generate(request);
    } else if (type.includes('CONCEPT') || type.includes('FORMULA')) {
      content = await this.conceptGen.generate(request);
    } else {
      // Questions, Olympiad, Challenge
      content = await this.questionGen.generate(request);
    }

    return content;
  }

  /** Expose verification services directly */
  async validateContent(content: GeneratedContent) {
    return this.validationService.validateContent(content);
  }

  async publishContent(contentId: string, publishedBy: string) {
    return this.publicationService.publishContent(contentId, publishedBy);
  }

  getMetrics() {
    return this.obsService.getMetrics();
  }
}
