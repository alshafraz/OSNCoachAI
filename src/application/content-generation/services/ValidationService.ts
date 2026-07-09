// src/application/content-generation/services/ValidationService.ts
import { Injectable } from '@nestjs/common';
import { getRepository, getCustomRepository } from 'typeorm';
import { GeneratedContent } from '../domain/models/GeneratedContent';
import { ValidationReport } from '../domain/models/ValidationReport';
import { ValidationReportEntity } from '../infrastructure/persistence/entities/ValidationReportEntity';
import { GeneratedContentEntity } from '../infrastructure/persistence/entities/GeneratedContentEntity';
import { ContentValidatorImpl } from '../../../infrastructure/services/cip/ContentValidatorService';
import { QualityScorerImpl } from '../../../infrastructure/services/cip/ContentValidatorService';
import { ExtractedQuestion, ClassificationResult } from '@/domain/entities/cip/ContentEntities';
import { DuplicateDetectorImpl } from '../../../infrastructure/services/cip/DuplicateDetector';
import { acgpConfig } from '../config/acgpConfig';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ValidationService {
  private readonly validator = new ContentValidatorImpl();
  private readonly scorer = new QualityScorerImpl();
  private readonly duplicateDetector = new DuplicateDetectorImpl();

  async validateContent(content: GeneratedContent): Promise<ValidationReport> {
    const body = content.body;
    
    // 1. Prepare inputs for CIP services
    const extractedQ: ExtractedQuestion = {
      body: body.questionBody ?? body.title ?? '',
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

    const classificationResult: ClassificationResult = {
      primaryConceptId: body.conceptId ?? 'numbers',
      secondaryConceptIds: [],
      skillIds: [],
      strategyIds: [],
      misconceptionIds: [],
      difficultyLevel: content.estimatedDifficulty ?? 'MEDIUM',
      difficultyScore: 50,
      cognitiveLevel: 'KNOWLEDGE',
      olympiadTopic: 'Algebra',
      estimatedSolveMinutes: 3,
    };

    // 2. Invoke ContentValidatorImpl (CIP Stage 10)
    const valResult = this.validator.validate(extractedQ, classificationResult);

    // 3. Invoke QualityScorerImpl (CIP Stage 12)
    const scoreResult = this.scorer.score({
      ocrConfidence: 1.0, // 100% confidence for AI generated
      question: extractedQ,
      classification: classificationResult,
      validationIssues: valResult.issues,
    });

    // 4. Duplicate Detection (CIP Stage 13)
    const duplicateMatches = this.duplicateDetector.detect(extractedQ);
    const hasNearDuplicate = duplicateMatches.some(m => m.matchType === 'EXACT' || m.matchType === 'NEAR');
    
    const passed = valResult.isValid && 
                   scoreResult.total >= acgpConfig.minQualityScore && 
                   !hasNearDuplicate;

    const report: ValidationReport = {
      id: uuidv4(),
      contentId: content.id,
      passed,
      qualityScore: scoreResult.total,
      qualityGrade: scoreResult.grade,
      issues: valResult.issues.map(i => ({
        field: i.field,
        severity: i.severity,
        message: i.message
      })),
      suggestions: valResult.suggestions,
      difficultyLevel: classificationResult.difficultyLevel,
      primaryConceptId: classificationResult.primaryConceptId,
      skillIds: classificationResult.skillIds,
      validatedAt: new Date(),
    };

    if (hasNearDuplicate) {
      report.issues.push({
        field: 'duplicate',
        severity: 'ERROR',
        message: 'A near or exact duplicate of this content already exists in the system.'
      });
    }

    // 5. Persist Report Entity
    const reportRepo = getRepository(ValidationReportEntity);
    await reportRepo.save(report);

    // 6. Update GeneratedContentEntity State
    const contentRepo = getRepository(GeneratedContentEntity);
    await contentRepo.update(content.id, {
      validationState: passed ? 'PASSED' : 'FAILED',
      qualityScore: scoreResult.total,
      qualityGrade: scoreResult.grade,
    });

    // Register with detector to avoid future self-duplicates
    if (passed) {
      this.duplicateDetector.register(content.id, extractedQ);
    }

    return report;
  }
}
export { ContentValidatorImpl, QualityScorerImpl, DuplicateDetectorImpl };
