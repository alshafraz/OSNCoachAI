// src/application/adaptive-learning/domain/models/LearningPathNode.ts
import { PaleDifficulty, LearningPathNodeStatus } from '../../config/paleConfig';

/**
 * A single node in a student's personalized learning path.
 * Represents one topic (concept) and its current state.
 */
export interface LearningPathNode {
  /** Unique node ID within the path */
  nodeId: string;
  /** Concept/topic identifier from the Knowledge Graph */
  topicId: string;
  /** Display name */
  topicName: string;
  /** Prerequisite topicIds that must be MASTERED before this node is unlocked */
  prerequisites: string[];
  /** Current completion status */
  status: LearningPathNodeStatus;
  /** Target difficulty level for this topic */
  targetDifficulty: PaleDifficulty;
  /** Current mastery score (0-1) */
  mastery: number;
  /** Olympiad priority weight (0-1); higher = more important for competition */
  olympiadPriority: number;
  /** Estimated sessions needed to reach mastery */
  estimatedSessionsToMastery: number;
  /** Actual sessions completed so far */
  completedSessions: number;
  /** When this node was activated */
  activatedAt?: Date;
  /** When this node reached MASTERED status */
  masteredAt?: Date;
  /** Position in the path (0-indexed) */
  position: number;
}
