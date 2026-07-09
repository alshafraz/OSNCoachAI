/**
 * Mathematical Intelligence Layer — Difficulty Engine
 *
 * Standardized difficulty scoring for questions based on multiple factors.
 * Never hardcode difficulty in prompts — always compute it through this engine.
 */

import type { DifficultyLevel, DifficultyBreakdown } from '@/domain/entities/math/MathEntities';
import type { DifficultyService } from '@/domain/services/math/MathServices';
import { CONCEPTS } from './ConceptGraph';

const CONCEPT_COMPLEXITY: Record<string, number> = {
  numbers: 1, primes: 2, divisibility: 2, factorization: 3,
  gcd: 3, lcm: 3, fractions: 3, ratio: 4, proportion: 4,
  algebra: 4, sequences: 4, geometry: 3, area: 3,
  combinatorics: 5, logic: 5,
};

const DIFFICULTY_THRESHOLDS: { min: number; max: number; level: DifficultyLevel }[] = [
  { min: 0, max: 20, level: 'EASY' },
  { min: 21, max: 40, level: 'MEDIUM' },
  { min: 41, max: 60, level: 'HARD' },
  { min: 61, max: 80, level: 'OLYMPIAD' },
  { min: 81, max: 100, level: 'EXPERT' },
];

const DIFFICULTY_ORDER: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD', 'OLYMPIAD', 'EXPERT'];

const GRADE_DIFFICULTY_MAP: Record<number, DifficultyLevel[]> = {
  4: ['EASY', 'MEDIUM'],
  5: ['EASY', 'MEDIUM', 'HARD'],
  6: ['MEDIUM', 'HARD', 'OLYMPIAD'],
};

export class DifficultyEngineService implements DifficultyService {
  score(params: {
    conceptIds: string[];
    stepCount: number;
    requiresOlympiadTrick: boolean;
    readingComplexity: number;    // 1–5
    calculationDepth: number;     // 1–5
  }): DifficultyBreakdown {
    // Concept complexity: average of mapped values, scaled 0–30
    const complexities = params.conceptIds.map(
      (id) => CONCEPT_COMPLEXITY[id] ?? 3
    );
    const avgComplexity = complexities.reduce((a, b) => a + b, 0) / Math.max(complexities.length, 1);
    const conceptComplexity = Math.round((avgComplexity / 5) * 30);

    // Calculation complexity: 0–20
    const calculationComplexity = Math.round((params.calculationDepth / 5) * 20);

    // Reasoning depth: based on step count 0–20
    const reasoningDepth = Math.min(Math.round(params.stepCount * 2.5), 20);

    // Number of concepts: multi-concept factor 0–10
    const multiConceptFactor = Math.min((params.conceptIds.length - 1) * 3, 10);

    // Reading difficulty 0–10
    const readingDifficulty = Math.round((params.readingComplexity / 5) * 10);

    // Number of steps factor 0–5
    const numberOfSteps = Math.min(params.stepCount, 5);

    // Olympiad trick factor: 0 or 15
    const olympiadTrickFactor = params.requiresOlympiadTrick ? 15 : 0;

    const totalScore = Math.min(
      conceptComplexity +
      calculationComplexity +
      reasoningDepth +
      multiConceptFactor +
      readingDifficulty +
      numberOfSteps +
      olympiadTrickFactor,
      100
    );

    const level = DIFFICULTY_THRESHOLDS.find(
      (t) => totalScore >= t.min && totalScore <= t.max
    )?.level ?? 'EXPERT';

    return {
      conceptComplexity,
      calculationComplexity,
      reasoningDepth,
      numberOfSteps,
      readingDifficulty,
      multiConceptFactor,
      olympiadTrickFactor,
      totalScore,
      level,
    };
  }

  compare(levelA: DifficultyLevel, levelB: DifficultyLevel): -1 | 0 | 1 {
    const a = DIFFICULTY_ORDER.indexOf(levelA);
    const b = DIFFICULTY_ORDER.indexOf(levelB);
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  isAppropriateForGrade(difficulty: DifficultyLevel, grade: number): boolean {
    const allowed = GRADE_DIFFICULTY_MAP[grade] ?? ['EASY', 'MEDIUM'];
    return allowed.includes(difficulty);
  }
}
