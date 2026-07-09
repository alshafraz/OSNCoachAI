/**
 * CIP Stage 10 — Content Validator
 * Checks question completeness, choice consistency, and answer quality.
 *
 * CIP Stage 12 — Quality Scorer
 * Scores content quality across 8 dimensions (0–100).
 *
 * CIP Stage 14 — Content Enricher
 * Enriches content using MIL: objectives, prerequisites, hints, strategies.
 */

import type { ExtractedQuestion, ClassificationResult, QualityScore, ContentEnrichment } from '@/domain/entities/cip/ContentEntities';
import type { ContentValidationService, QualityService, ContentEnrichmentService } from '@/domain/services/cip/CipServices';
import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';

// ─── CONTENT VALIDATOR (Stage 10) ─────────────────────────────────────────────

export class ContentValidatorImpl implements ContentValidationService {
  validate(question: ExtractedQuestion, classification: ClassificationResult) {
    const issues: { field: string; severity: 'ERROR' | 'WARNING'; message: string }[] = [];
    const suggestions: string[] = [];

    // Body
    if (!question.body || question.body.trim().length < 10) {
      issues.push({ field: 'body', severity: 'ERROR', message: 'Question body is missing or too short.' });
    }

    // Choices for MCQ
    if (question.format === 'MULTIPLE_CHOICE') {
      if (question.choices.length < 2) {
        issues.push({ field: 'choices', severity: 'ERROR', message: 'Multiple choice question must have at least 2 options.' });
      }
      if (question.choices.length > 5) {
        issues.push({ field: 'choices', severity: 'WARNING', message: 'More than 5 choices detected — verify this is intentional.' });
      }
    }

    // Answer
    if (!question.correctAnswer || question.correctAnswer.trim().length === 0) {
      issues.push({ field: 'correctAnswer', severity: 'ERROR', message: 'Correct answer is missing.' });
      suggestions.push('Add the correct answer before publishing.');
    }

    // Explanation
    if (!question.explanation || question.explanation.trim().length < 15) {
      issues.push({ field: 'explanation', severity: 'WARNING', message: 'Explanation is missing or too brief.' });
      suggestions.push('Add a step-by-step explanation to improve learning value.');
    }

    // Concept mapping
    if (!classification.primaryConceptId) {
      issues.push({ field: 'conceptMapping', severity: 'ERROR', message: 'Primary concept could not be detected.' });
    }

    // Difficulty sanity check
    const concept = MIL.concepts.getById(classification.primaryConceptId);
    if (concept && classification.difficultyLevel) {
      const appropriate = MIL.difficulty.isAppropriateForGrade(
        classification.difficultyLevel as any,
        concept.gradeRecommendation
      );
      if (!appropriate) {
        issues.push({
          field: 'difficulty',
          severity: 'WARNING',
          message: `Difficulty "${classification.difficultyLevel}" may not be appropriate for Grade ${concept.gradeRecommendation}.`,
        });
      }
    }

    // Math expressions consistency
    if (question.mathExpressions.some((e) => e.confidence < 0.7)) {
      issues.push({
        field: 'mathExpressions',
        severity: 'WARNING',
        message: 'Some mathematical expressions have low extraction confidence. Verify manually.',
      });
    }

    return { isValid: issues.filter((i) => i.severity === 'ERROR').length === 0, issues, suggestions };
  }
}

// ─── QUALITY SCORER (Stage 12) ────────────────────────────────────────────────

export class QualityScorerImpl implements QualityService {
  score(params: {
    ocrConfidence: number;
    question: ExtractedQuestion;
    classification: ClassificationResult;
    validationIssues: { severity: string }[];
  }): QualityScore {
    const { ocrConfidence, question, classification, validationIssues } = params;
    const issues: string[] = [];

    // Factor 1: OCR accuracy (0–25)
    const ocrAccuracy = Math.round(ocrConfidence * 25);

    // Factor 2: Missing fields penalty (0–20, start at 20 and deduct)
    let missingFieldsPenalty = 20;
    if (!question.correctAnswer) { missingFieldsPenalty -= 8; issues.push('Missing answer'); }
    if (!question.explanation) { missingFieldsPenalty -= 5; issues.push('Missing explanation'); }
    if (!question.body || question.body.length < 10) { missingFieldsPenalty -= 7; issues.push('Missing body'); }

    // Factor 3: Formatting (0–10)
    const hasGoodFormatting = question.sections.length >= 2 && question.body.length > 20;
    const formattingScore = hasGoodFormatting ? 10 : 5;

    // Factor 4: Answer availability (0–15)
    const answerAvailability = question.correctAnswer ? 15 : 0;

    // Factor 5: Explanation availability (0–10)
    const explanationAvailability = question.explanation && question.explanation.length > 20 ? 10 : (question.explanation ? 5 : 0);

    // Factor 6: Confidence (0–10)
    const confidenceScore = Math.round(classification.difficultyScore / 10);

    // Factor 7: Difficulty calibration (0–5)
    const difficultyCalibration = classification.difficultyLevel ? 5 : 2;

    // Factor 8: Image quality (0–5)
    const imageQuality = question.diagrams.length > 0
      ? Math.round(question.diagrams.reduce((a, d) => a + d.extractionConfidence, 0) / question.diagrams.length * 5)
      : 5;

    const total = Math.min(100, Math.max(0,
      ocrAccuracy + missingFieldsPenalty + formattingScore + answerAvailability +
      explanationAvailability + confidenceScore + difficultyCalibration + imageQuality
    ));

    // Add validation warnings to issues list
    for (const issue of validationIssues) {
      if (issue.severity === 'ERROR') issues.push('Validation error detected');
    }

    const grade: QualityScore['grade'] =
      total >= 90 ? 'A' : total >= 75 ? 'B' : total >= 60 ? 'C' : total >= 45 ? 'D' : 'F';

    return {
      ocrAccuracy,
      missingFieldsPenalty,
      formattingScore,
      answerAvailability,
      explanationAvailability,
      confidenceScore,
      difficultyCalibration,
      imageQuality,
      total,
      grade,
      issues,
    };
  }
}

// ─── CONTENT ENRICHER (Stage 14) ─────────────────────────────────────────────

export class ContentEnricherImpl implements ContentEnrichmentService {
  enrich(question: ExtractedQuestion, classification: ClassificationResult): ContentEnrichment {
    const concept = MIL.concepts.getById(classification.primaryConceptId);
    const prerequisites = concept ? MIL.knowledgeGraph.getDependencyChain(classification.primaryConceptId) : [];
    const strategies = MIL.strategies.recommendStrategies([classification.primaryConceptId]);
    const hints = MIL.hints.getProgressiveHints(classification.primaryConceptId);

    const learningObjectives = concept?.learningObjectives ?? [
      'Understand the core concept',
      'Apply the concept to solve problems',
    ];

    const requiredPrerequisites = prerequisites
      .filter((p) => p.id !== classification.primaryConceptId)
      .map((p) => p.name);

    const recommendedHintLevels = hints.length > 0 ? [1, 2, 3] : [1, 2];

    const alternativeStrategies = strategies.slice(0, 3).map((s) => s.name);

    const visualLearningSuggestions = concept?.visualAids ?? ['Draw a diagram', 'Use a table'];

    const keyConceptSummary = concept
      ? `This question tests "${concept.name}": ${concept.description}`
      : `This question tests ${classification.primaryConceptId}.`;

    const difficultyExplanation = `Difficulty: ${classification.difficultyLevel} (score: ${classification.difficultyScore}/100). ` +
      `Estimated solve time: ${classification.estimatedSolveMinutes} minutes.`;

    return {
      learningObjectives,
      requiredPrerequisites,
      recommendedHintLevels,
      alternativeStrategies,
      visualLearningSuggestions,
      keyConceptSummary,
      difficultyExplanation,
    };
  }
}
