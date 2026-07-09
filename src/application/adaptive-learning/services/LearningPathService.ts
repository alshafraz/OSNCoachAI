// src/application/adaptive-learning/services/LearningPathService.ts
import { LearningPath } from '../domain/models/LearningPath';
import { LearningPathNode } from '../domain/models/LearningPathNode';
import { LearningPathRepository } from '../infrastructure/persistence/repositories/LearningPathRepository';
import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * LearningPathService builds, retrieves, and evolves each student's
 * personalized ordered topic progression.
 *
 * The path is built from:
 *   - Knowledge Graph dependency chains (MIL)
 *   - Olympiad importance weights
 *   - Student mastery state
 *   - Competition timeline urgency
 */
export class LearningPathService {
  private readonly logger = new Logger('LearningPathService');
  private readonly repo = new LearningPathRepository();

  /** Build or retrieve the learning path for a student. */
  async getOrBuildPath(
    studentId: string,
    options: {
      targetGrade?: number;
      competitionDate?: Date;
      masteredTopicIds?: string[];
    } = {}
  ): Promise<LearningPath> {
    // Try to retrieve an existing path
    const existing = await this.repo.findByStudent(studentId);
    if (existing) return existing as unknown as LearningPath;

    // Build a new path from the Knowledge Graph
    return this.buildPath(studentId, options);
  }

  /** Force-rebuild the learning path (e.g. after major performance shift). */
  async buildPath(
    studentId: string,
    options: {
      targetGrade?: number;
      competitionDate?: Date;
      masteredTopicIds?: string[];
    } = {}
  ): Promise<LearningPath> {
    const { masteredTopicIds = [], competitionDate } = options;

    // Use MIL to get all concepts in recommended learning order
    const grade = options.targetGrade ?? 5;
    const milPath = MIL.learningPaths.getPathForGrade(grade);
    const conceptIds: string[] = milPath?.nodes.map((n: any) => n.conceptId) ?? [
      'numbers', 'primes', 'factorization', 'gcd', 'lcm',
      'fractions', 'decimals', 'geometry', 'area', 'perimeter',
      'combinatorics', 'sequences', 'logic',
    ];

    const nodes: LearningPathNode[] = conceptIds.map((topicId, idx) => {
      const concept = MIL.concepts.getById(topicId);
      const prereqs: string[] = concept?.prerequisiteConceptIds ?? [];
      const isMastered = masteredTopicIds.includes(topicId);

      // Calculate olympiad priority: earlier in chain = lower priority unless competition-specific
      const olympiadPriority = this.getOlympiadPriority(topicId, competitionDate);

      return {
        nodeId: uuidv4(),
        topicId,
        topicName: concept?.name ?? topicId,
        prerequisites: prereqs,
        status: isMastered ? 'MASTERED' : idx === 0 ? 'ACTIVE' : 'PENDING',
        targetDifficulty: 'MEDIUM',
        mastery: isMastered ? 1.0 : 0,
        olympiadPriority,
        estimatedSessionsToMastery: 5,
        completedSessions: 0,
        position: idx,
        masteredAt: isMastered ? new Date() : undefined,
      };
    });

    const path: LearningPath = {
      id: uuidv4(),
      studentId,
      nodes,
      currentNodeIndex: nodes.findIndex(n => n.status === 'ACTIVE') ?? 0,
      masteredTopicIds,
      recoveryTopicIds: [],
      competitionDate,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repo.save(path as any);
    this.logger.info('Learning path built', { studentId, nodeCount: nodes.length });
    return path;
  }

  /** Mark a topic as mastered and advance the active node. */
  async advancePath(studentId: string, topicId: string): Promise<LearningPath | null> {
    const entity = await this.repo.findByStudent(studentId);
    if (!entity) return null;
    const path = entity as unknown as LearningPath;

    const node = path.nodes.find(n => n.topicId === topicId);
    if (node) {
      node.status = 'MASTERED';
      node.mastery = 1.0;
      node.masteredAt = new Date();
      if (!path.masteredTopicIds.includes(topicId)) {
        path.masteredTopicIds.push(topicId);
      }
    }

    // Find next unlocked node
    const nextNode = path.nodes.find(n =>
      n.status === 'PENDING' &&
      n.prerequisites.every(p => path.masteredTopicIds.includes(p))
    );
    if (nextNode) {
      nextNode.status = 'ACTIVE';
      path.currentNodeIndex = nextNode.position;
    }

    path.version++;
    path.updatedAt = new Date();
    await this.repo.save(path as any);
    this.logger.info('Path advanced', { studentId, masteredTopic: topicId, nextTopic: nextNode?.topicId });
    return path;
  }

  private getOlympiadPriority(topicId: string, competitionDate?: Date): number {
    // High-value olympiad topics
    const highPriority: Record<string, number> = {
      primes: 0.9, factorization: 0.85, combinatorics: 0.95,
      sequences: 0.8, logic: 0.9, gcd: 0.8, lcm: 0.75,
    };
    const base = highPriority[topicId] ?? 0.5;
    if (!competitionDate) return base;
    const daysToComp = (competitionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    // Boost priority as competition approaches
    const urgencyBoost = daysToComp < 30 ? 0.1 : 0;
    return Math.min(1, base + urgencyBoost);
  }
}
