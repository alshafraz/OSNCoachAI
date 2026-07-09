/**
 * Mathematical Intelligence Layer — Learning Path Engine
 * Generates structured and adaptive learning paths for students.
 */

import type { LearningPath, LearningPathNode, Concept } from '@/domain/entities/math/MathEntities';
import type { LearningPathService } from '@/domain/services/math/MathServices';
import { ConceptGraphService } from './ConceptGraph';
import { KnowledgeGraphEngineService } from './KnowledgeGraph';

const conceptService = new ConceptGraphService();
const knowledgeGraph = new KnowledgeGraphEngineService();

// ─── STRUCTURED GRADE-LEVEL PATHS ────────────────────────────────────────────

const GRADE_PATHS: LearningPath[] = [
  {
    id: 'grade-4-path',
    name: 'Grade 4 OSN Preparation Path',
    description: 'Foundation path covering numbers, primes, divisibility, fractions, and basic geometry.',
    targetGrade: 4,
    nodes: [
      { conceptId: 'numbers', orderIndex: 0, estimatedMinutes: 60, requiredMasteryPct: 80 },
      { conceptId: 'divisibility', orderIndex: 1, estimatedMinutes: 40, requiredMasteryPct: 80 },
      { conceptId: 'primes', orderIndex: 2, estimatedMinutes: 45, requiredMasteryPct: 85 },
      { conceptId: 'fractions', orderIndex: 3, estimatedMinutes: 90, requiredMasteryPct: 75 },
      { conceptId: 'geometry', orderIndex: 4, estimatedMinutes: 90, requiredMasteryPct: 75 },
      { conceptId: 'area', orderIndex: 5, estimatedMinutes: 75, requiredMasteryPct: 75 },
    ],
  },
  {
    id: 'grade-5-path',
    name: 'Grade 5 OSN Preparation Path',
    description: 'Intermediate path covering factorization, GCD, LCM, ratio, proportion, algebra, and sequences.',
    targetGrade: 5,
    nodes: [
      { conceptId: 'numbers', orderIndex: 0, estimatedMinutes: 30, requiredMasteryPct: 90 },
      { conceptId: 'primes', orderIndex: 1, estimatedMinutes: 30, requiredMasteryPct: 90 },
      { conceptId: 'factorization', orderIndex: 2, estimatedMinutes: 60, requiredMasteryPct: 85 },
      { conceptId: 'gcd', orderIndex: 3, estimatedMinutes: 50, requiredMasteryPct: 85 },
      { conceptId: 'lcm', orderIndex: 4, estimatedMinutes: 50, requiredMasteryPct: 85 },
      { conceptId: 'fractions', orderIndex: 5, estimatedMinutes: 60, requiredMasteryPct: 80 },
      { conceptId: 'ratio', orderIndex: 6, estimatedMinutes: 60, requiredMasteryPct: 80 },
      { conceptId: 'proportion', orderIndex: 7, estimatedMinutes: 60, requiredMasteryPct: 80 },
      { conceptId: 'algebra', orderIndex: 8, estimatedMinutes: 90, requiredMasteryPct: 75 },
      { conceptId: 'sequences', orderIndex: 9, estimatedMinutes: 60, requiredMasteryPct: 75 },
      { conceptId: 'combinatorics', orderIndex: 10, estimatedMinutes: 120, requiredMasteryPct: 70 },
      { conceptId: 'logic', orderIndex: 11, estimatedMinutes: 90, requiredMasteryPct: 70 },
    ],
  },
  {
    id: 'grade-6-path',
    name: 'Grade 6 OSN Advanced Path',
    description: 'Advanced path with full topic coverage including combinatorics and logic for OSN competition.',
    targetGrade: 6,
    nodes: [
      { conceptId: 'factorization', orderIndex: 0, estimatedMinutes: 45, requiredMasteryPct: 90 },
      { conceptId: 'gcd', orderIndex: 1, estimatedMinutes: 45, requiredMasteryPct: 90 },
      { conceptId: 'lcm', orderIndex: 2, estimatedMinutes: 45, requiredMasteryPct: 90 },
      { conceptId: 'proportion', orderIndex: 3, estimatedMinutes: 60, requiredMasteryPct: 85 },
      { conceptId: 'algebra', orderIndex: 4, estimatedMinutes: 90, requiredMasteryPct: 85 },
      { conceptId: 'sequences', orderIndex: 5, estimatedMinutes: 60, requiredMasteryPct: 85 },
      { conceptId: 'area', orderIndex: 6, estimatedMinutes: 75, requiredMasteryPct: 85 },
      { conceptId: 'combinatorics', orderIndex: 7, estimatedMinutes: 120, requiredMasteryPct: 80 },
      { conceptId: 'logic', orderIndex: 8, estimatedMinutes: 90, requiredMasteryPct: 80 },
    ],
  },
];

const gradePathMap = new Map<number, LearningPath>(GRADE_PATHS.map((p) => [p.targetGrade, p]));

export class LearningPathEngineService implements LearningPathService {
  getPathForGrade(grade: number): LearningPath | null {
    return gradePathMap.get(grade) ?? null;
  }

  buildAdaptivePath(masteredConceptIds: string[], targetConceptId: string): LearningPath {
    const dependencyChain = knowledgeGraph.getDependencyChain(targetConceptId);
    const masteredSet = new Set(masteredConceptIds);

    // Filter to concepts not yet mastered and order them
    const neededConcepts = dependencyChain.filter((c) => !masteredSet.has(c.id));

    const nodes: LearningPathNode[] = neededConcepts.map((c, idx) => ({
      conceptId: c.id,
      orderIndex: idx,
      estimatedMinutes: c.estimatedLearningMinutes,
      requiredMasteryPct: 80,
    }));

    return {
      id: `adaptive-${targetConceptId}`,
      name: `Adaptive Path to: ${neededConcepts[neededConcepts.length - 1]?.name ?? targetConceptId}`,
      description: `Personalized path based on your current knowledge, leading to mastery of ${targetConceptId}.`,
      targetGrade: 0,
      nodes,
    };
  }

  getNextConcept(masteredConceptIds: string[]): Concept | null {
    const masteredSet = new Set(masteredConceptIds);

    // Find the first concept in grade 5 path whose prerequisites are all mastered
    const gradePath = gradePathMap.get(5) ?? GRADE_PATHS[1];
    for (const node of gradePath.nodes) {
      if (masteredSet.has(node.conceptId)) continue;
      const concept = conceptService.getById(node.conceptId);
      if (!concept) continue;
      const prereqsMastered = concept.prerequisiteConceptIds.every((pId) => masteredSet.has(pId));
      if (prereqsMastered) return concept;
    }
    return null;
  }
}
