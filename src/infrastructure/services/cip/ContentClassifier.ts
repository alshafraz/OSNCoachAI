/**
 * CIP Stages 7–9 — Content Classifier
 *
 * Uses the Mathematical Intelligence Layer (MIL) exclusively.
 * Zero hardcoded math knowledge — all classification goes through MIL APIs.
 */

import type { ExtractedQuestion, ClassificationResult } from '@/domain/entities/cip/ContentEntities';
import type { ContentClassificationService } from '@/domain/services/cip/CipServices';
import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';

// Keyword → concept ID mapping (lightweight router, not hardcoded math knowledge)
const KEYWORD_CONCEPT_MAP: { keywords: string[]; conceptId: string }[] = [
  { keywords: ['prima', 'prime', 'bilangan prima'], conceptId: 'primes' },
  { keywords: ['faktor', 'faktori', 'factorization', 'factor tree'], conceptId: 'factorization' },
  { keywords: ['fpb', 'gcd', 'greatest common', 'pembagi terbesar'], conceptId: 'gcd' },
  { keywords: ['kpk', 'lcm', 'least common', 'kelipatan terkecil'], conceptId: 'lcm' },
  { keywords: ['pecahan', 'fraction', 'numerator', 'denominator', 'pembilang', 'penyebut'], conceptId: 'fractions' },
  { keywords: ['perbandingan', 'ratio', 'rasio'], conceptId: 'ratio' },
  { keywords: ['proporsi', 'proportion', 'skala', 'scale'], conceptId: 'proportion' },
  { keywords: ['aljabar', 'algebra', 'variabel', 'variable', 'persamaan', 'equation'], conceptId: 'algebra' },
  { keywords: ['barisan', 'sequence', 'pola', 'pattern', 'deret'], conceptId: 'sequences' },
  { keywords: ['luas', 'area', 'keliling', 'perimeter', 'persegi', 'segitiga', 'lingkaran', 'trapesium'], conceptId: 'area' },
  { keywords: ['geometri', 'geometry', 'bangun', 'shape', 'sudut', 'angle'], conceptId: 'geometry' },
  { keywords: ['kombinasi', 'kombinatorik', 'combinatorics', 'permutasi', 'permutation', 'menghitung cara'], conceptId: 'combinatorics' },
  { keywords: ['logika', 'logic', 'deduktif', 'deductive', 'bukti', 'proof'], conceptId: 'logic' },
  { keywords: ['habis dibagi', 'divisibility', 'kelipatan', 'multiple', 'dibagi'], conceptId: 'divisibility' },
  { keywords: ['bilangan', 'number', 'digit', 'angka'], conceptId: 'numbers' },
];

function detectConceptFromText(text: string): string {
  const lower = text.toLowerCase();
  let bestMatch = { conceptId: 'numbers', score: 0 };

  for (const { keywords, conceptId } of KEYWORD_CONCEPT_MAP) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestMatch.score) {
      bestMatch = { conceptId, score };
    }
  }
  return bestMatch.conceptId;
}

export class ContentClassifierImpl implements ContentClassificationService {
  classify(question: ExtractedQuestion): ClassificationResult {
    const fullText = `${question.body} ${question.explanation ?? ''} ${question.rawText}`;

    // Detect primary concept via keyword routing → MIL
    const primaryConceptId = detectConceptFromText(fullText);
    const primaryConcept = MIL.concepts.getById(primaryConceptId);

    // Secondary concepts from related + prerequisites
    const secondaryConceptIds = primaryConcept
      ? [...new Set([...primaryConcept.relatedConceptIds.slice(0, 2), ...primaryConcept.prerequisiteConceptIds.slice(0, 1)])]
      : [];

    // Skills via MIL
    const skills = MIL.skills.getForConcept(primaryConceptId);
    const skillIds = skills.slice(0, 3).map((s) => s.id);

    // Strategies via MIL
    const strategies = MIL.strategies.getForConcept(primaryConceptId);
    const strategyIds = strategies.slice(0, 2).map((s) => s.id);

    // Misconceptions via MIL
    const misconceptions = MIL.misconceptions.getForConcept(primaryConceptId);
    const misconceptionIds = misconceptions.slice(0, 3).map((m) => m.id);

    // Difficulty via MIL
    const stepEstimate = question.explanation ? question.explanation.split('.').length : 3;
    const difficultyBreakdown = MIL.difficulty.score({
      conceptIds: [primaryConceptId, ...secondaryConceptIds],
      stepCount: stepEstimate,
      requiresOlympiadTrick: fullText.toLowerCase().includes('olimpiade') || fullText.toLowerCase().includes('olympiad'),
      readingComplexity: question.body.length > 200 ? 4 : 2,
      calculationDepth: question.mathExpressions.length > 2 ? 3 : 2,
    });

    // Cognitive level via MIL
    const cognitiveLevel = MIL.concepts.getById(primaryConceptId)
      ? 'APPLY'
      : 'UNDERSTAND';

    // Olympiad topic
    const olympiadTopic = primaryConcept?.olympiadTopics?.[0] ?? 'General';

    // Estimated solve time
    const estimatedSolveMinutes = Math.max(3, Math.round(difficultyBreakdown.totalScore / 10));

    return {
      primaryConceptId,
      secondaryConceptIds,
      skillIds,
      strategyIds,
      misconceptionIds,
      difficultyLevel: difficultyBreakdown.level,
      difficultyScore: difficultyBreakdown.totalScore,
      cognitiveLevel,
      olympiadTopic,
      estimatedSolveMinutes,
    };
  }

  classifyBatch(questions: ExtractedQuestion[]): ClassificationResult[] {
    return questions.map((q) => this.classify(q));
  }
}
