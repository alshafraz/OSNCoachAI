// src/application/content-generation/infrastructure/persistence/entities/GenerationRequestEntity.ts
export class GenerationRequestEntity {
  id!: string;
  requestedBy!: string;
  requestedAt!: Date;
  contentType!: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  targetGrade?: number;
  count?: number;
  learningObjective?: string;
  olympiadCategory?: string;
  requiredSkills?: string[];
  reasoningStrategy?: string;
  studentId?: string;
  weakTopics?: string[];
  recentMistakeConceptIds?: string[];
  sourceContentId?: string;
  variationAspects?: string[];
  topicMix?: string;
  metadata?: Record<string, any>;
}
