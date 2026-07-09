// src/application/adaptive-learning/infrastructure/persistence/entities/LearningPathEntity.ts
export class LearningPathEntity {
  id!: string;
  studentId!: string;
  nodes!: any[]; // serialized LearningPathNode[]
  currentNodeIndex!: number;
  masteredTopicIds!: string[];
  recoveryTopicIds!: string[];
  competitionDate?: Date;
  version!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
