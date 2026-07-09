/**
 * Mathematical Intelligence Layer — Knowledge Graph Service
 * Manages concept dependency chains, prerequisite gaps, learning paths, and coverage.
 */

import type { Concept } from '@/domain/entities/math/MathEntities';
import type { KnowledgeGraphService } from '@/domain/services/math/MathServices';
import { CONCEPTS, ConceptGraphService } from './ConceptGraph';

const conceptService = new ConceptGraphService();

export class KnowledgeGraphEngineService implements KnowledgeGraphService {
  /**
   * Returns the full dependency chain from root to the given concept (topological order).
   */
  getDependencyChain(conceptId: string): Concept[] {
    const visited = new Set<string>();
    const result: Concept[] = [];

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const concept = conceptService.getById(id);
      if (!concept) return;
      for (const prereqId of concept.prerequisiteConceptIds) {
        traverse(prereqId);
      }
      result.push(concept);
    };

    traverse(conceptId);
    return result;
  }

  /**
   * Returns a minimal learning path from one concept to another.
   */
  getLearningPath(fromConceptId: string, toConceptId: string): Concept[] {
    // BFS through childConceptIds and relatedConceptIds
    const queue: string[] = [fromConceptId];
    const visited = new Set<string>([fromConceptId]);
    const parent = new Map<string, string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === toConceptId) break;

      const concept = conceptService.getById(current);
      if (!concept) continue;

      const neighbors = [...concept.childConceptIds, ...concept.relatedConceptIds];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let node: string | undefined = toConceptId;
    while (node) {
      path.unshift(node);
      node = parent.get(node);
    }

    if (path[0] !== fromConceptId) return [];
    return path.map((id) => conceptService.getById(id)).filter(Boolean) as Concept[];
  }

  /**
   * Returns concepts the student must master before they can learn conceptId.
   */
  getMissingPrerequisites(conceptId: string, masteredConceptIds: string[]): Concept[] {
    const masteredSet = new Set(masteredConceptIds);
    const chain = this.getDependencyChain(conceptId);
    return chain.filter((c) => c.id !== conceptId && !masteredSet.has(c.id));
  }

  /**
   * Returns concepts related to the given concept (siblings, overlapping topics).
   */
  getSimilarConcepts(conceptId: string): Concept[] {
    const concept = conceptService.getById(conceptId);
    if (!concept) return [];

    const similar = new Set<string>([
      ...concept.relatedConceptIds,
      ...concept.childConceptIds,
    ]);
    if (concept.parentConceptId) similar.add(concept.parentConceptId);

    return [...similar]
      .map((id) => conceptService.getById(id))
      .filter(Boolean) as Concept[];
  }

  /**
   * Returns concept coverage statistics for a student's mastered set.
   */
  getConceptCoverage(masteredConceptIds: string[]): {
    total: number;
    mastered: number;
    coveragePct: number;
    uncoveredCritical: Concept[];
  } {
    const masteredSet = new Set(masteredConceptIds);
    const total = CONCEPTS.length;
    const mastered = masteredConceptIds.filter((id) =>
      CONCEPTS.some((c) => c.id === id)
    ).length;

    // Critical = concepts that are prerequisites for many others
    const prereqCount = new Map<string, number>();
    for (const c of CONCEPTS) {
      for (const pId of c.prerequisiteConceptIds) {
        prereqCount.set(pId, (prereqCount.get(pId) ?? 0) + 1);
      }
    }

    const uncoveredCritical = CONCEPTS.filter(
      (c) => !masteredSet.has(c.id) && (prereqCount.get(c.id) ?? 0) >= 2
    );

    return {
      total,
      mastered,
      coveragePct: total > 0 ? Math.round((mastered / total) * 100) : 0,
      uncoveredCritical,
    };
  }
}
