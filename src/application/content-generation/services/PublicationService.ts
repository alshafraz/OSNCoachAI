// src/application/content-generation/services/PublicationService.ts
import { Injectable } from '@nestjs/common';
import { GeneratedContentEntity } from '../infrastructure/persistence/entities/GeneratedContentEntity';
import { PublicationEntity } from '../infrastructure/persistence/entities/PublicationEntity';
import { PrismaQuestionRepository } from '../../../infrastructure/repositories/PrismaQuestionRepository';
import { GeneratedContentRepository } from '../infrastructure/persistence/repositories/GeneratedContentRepository';
import { PublicationRepository } from '../infrastructure/persistence/repositories/PublicationRepository';
import { acgpConfig } from '../config/acgpConfig';
import { v4 as uuidv4 } from 'uuid';
import { QuestionDifficulty } from '../../../domain/entities/Question';

@Injectable()
export class PublicationService {
  private readonly questionRepo = new PrismaQuestionRepository();
  private readonly contentRepo = new GeneratedContentRepository();
  private readonly pubRepo = new PublicationRepository();

  /**
   * Publishes generated content to active channels (e.g. Prisma questions table)
   * if it has passed validation and human review (if configured).
   */
  async publishContent(contentId: string, publishedBy: string): Promise<PublicationEntity> {
    const content = await this.contentRepo.findOne(contentId);
    
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found.`);
    }

    if (content.validationState !== 'PASSED') {
      throw new Error('Cannot publish content that has not passed CIP validation.');
    }

    if (acgpConfig.requireHumanReview && content.reviewState !== 'APPROVED') {
      throw new Error('Cannot publish content without Human Review Approval.');
    }

    // 1. If it's a question format, publish it to the Prisma student question database
    let externalReferenceId: string | undefined;
    if (content.contentType.includes('QUESTION') || content.contentType === 'OLYMPIAD' || content.contentType === 'CHALLENGE' || content.contentType === 'VARIATION') {
      const qBody = content.body;
      
      let mappedDifficulty: QuestionDifficulty = 'MEDIUM';
      const estDiff = content.estimatedDifficulty;
      if (estDiff === 'EASY' || estDiff === 'MEDIUM' || estDiff === 'HARD') {
        mappedDifficulty = estDiff;
      } else if (estDiff === 'OLYMPIAD') {
        mappedDifficulty = 'HARD';
      }

      const questionData = {
        title: qBody.title ?? `Olympiad ${qBody.questionType ?? 'Question'}`,
        body: qBody.questionBody ?? '',
        type: (qBody.questionType ?? 'SHORT_ANSWER') as any,
        options: (qBody.choices ?? []).map((c: any) => typeof c === 'string' ? c : c.text),
        imageUrl: qBody.imageUrl,
        difficulty: mappedDifficulty,
        topic: qBody.conceptId ?? qBody.topic ?? 'General',
        correctAnswer: qBody.correctAnswer ?? '',
        explanation: qBody.explanation ?? '',
        hint: qBody.hints?.[0]?.text ?? '',
        source: 'AI Content Generation Platform',
        tags: [content.contentType.toLowerCase()],
      };
      
      const savedQuestion = await this.questionRepo.create(questionData);
      externalReferenceId = savedQuestion.id;
    }

    // 2. Update generated content publication state
    await this.contentRepo.update(contentId, {
      publicationState: 'PUBLISHED',
      publishedAt: new Date(),
    });

    // 3. Create publication log record
    const publication = this.pubRepo.create({
      id: uuidv4(),
      contentId,
      publishedBy,
      publishedAt: new Date(),
      targetChannels: ['prisma_questions_table'],
      externalReferenceId,
    });

    return this.pubRepo.save(publication);
  }
}
