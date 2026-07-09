// src/application/adaptive-learning/domain/models/LearningPath.ts
import { LearningPathNode } from './LearningPathNode';

/**
 * The complete personalized learning path for one student.
 * Maintained by LearningPathService and evolved after each session.
 */
export interface LearningPath {
  id: string;
  studentId: string;
  /** Ordered list of topic nodes */
  nodes: LearningPathNode[];
  /** The index in nodes[] currently active */
  currentNodeIndex: number;
  /** IDs of topics considered mastered (from nodes) */
  masteredTopicIds: string[];
  /** IDs of topics in recovery mode */
  recoveryTopicIds: string[];
  /** Competition date driving urgency weighting */
  competitionDate?: Date;
  /** Version counter – incremented each time the path is reordered */
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
