// src/application/content-generation/infrastructure/persistence/entities/GeneratedContentEntity.ts
export class GeneratedContentEntity {
  id!: string;
  requestId!: string;
  contentType!: string;
  body!: Record<string, any>;
  generationState!: string;
  validationState!: string;
  reviewState!: string;
  publicationState!: string;
  qualityScore?: number;
  qualityGrade?: string;
  estimatedDifficulty?: string;
  difficultyConfidence?: number;
  promptVersion?: string;
  modelUsed?: string;
  tokensUsed?: number;
  estimatedCostUsd?: number;
  generationTimeMs?: number;
  regenerationCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
  publishedAt?: Date;
}
