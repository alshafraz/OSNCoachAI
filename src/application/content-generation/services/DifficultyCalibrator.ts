// src/application/content-generation/services/DifficultyCalibrator.ts
import { Injectable } from '@nestjs/common';
import { MIL } from '../../../infrastructure/services/math/MathIntelligenceLayer';
import { GeneratedContent } from '../domain/models/GeneratedContent';
import type { AcgpDifficulty } from '../config/acgpConfig';

export interface CalibrationResult {
  estimatedDifficulty: AcgpDifficulty;
  difficultyConfidence: number;
  estimatedSolveTimeSeconds: number;
  conceptComplexityScore: number;
  reasoningComplexityScore: number;
  prerequisites: string[];
}

@Injectable()
export class DifficultyCalibrator {
  /**
   * Calibrate difficulty metrics of generated content using Math Intelligence Layer.
   */
  calibrate(content: GeneratedContent): CalibrationResult {
    const body = content.body;
    const conceptIds = body.conceptId ? [body.conceptId] : ['numbers'];
    
    // Determine metrics from body complexity clues
    const stepCount = body.solvingSteps?.length ?? body.explanation?.split('.').length ?? 2;
    const requiresOlympiadTrick = content.contentType === 'OLYMPIAD' || content.contentType === 'CHALLENGE';
    
    // Assess depth parameters based on text complexity
    const textLength = body.questionBody?.length ?? 0;
    const readingComplexity = textLength > 200 ? 4 : textLength > 100 ? 3 : 2;
    const calculationDepth = requiresOlympiadTrick ? 4 : 2;

    const breakdown = MIL.difficulty.score({
      conceptIds,
      stepCount,
      requiresOlympiadTrick,
      readingComplexity,
      calculationDepth,
    });

    // Map difficulty level
    let estimatedDifficulty: AcgpDifficulty = 'MEDIUM';
    if (breakdown.level === 'EASY') estimatedDifficulty = 'EASY';
    else if (breakdown.level === 'MEDIUM') estimatedDifficulty = 'MEDIUM';
    else if (breakdown.level === 'HARD') estimatedDifficulty = 'HARD';
    else if (breakdown.level === 'OLYMPIAD' || breakdown.level === 'EXPERT') estimatedDifficulty = 'OLYMPIAD';

    // Solve time estimate: e.g. 60 seconds base per step, plus reading penalty
    const estimatedSolveTimeSeconds = Math.max(30, stepCount * 60 + readingComplexity * 10);
    
    // Map missing prerequisites using knowledge graph
    const chain = MIL.knowledgeGraph.getDependencyChain(conceptIds[0]);
    const prerequisites = chain.map(c => c.id).filter(id => id !== conceptIds[0]);

    return {
      estimatedDifficulty,
      difficultyConfidence: 0.85, // confidence score index
      estimatedSolveTimeSeconds,
      conceptComplexityScore: breakdown.conceptComplexity,
      reasoningComplexityScore: breakdown.reasoningDepth,
      prerequisites,
    };
  }
}
