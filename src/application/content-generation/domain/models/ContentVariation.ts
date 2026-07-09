// src/application/content-generation/domain/models/ContentVariation.ts

export interface ContentVariation {
  id: string;
  sourceContentId: string;
  variationContentId: string;
  variationType: string; // 'numbers' | 'context' | 'story' | 'diagram' | 'difficulty' | 'reasoningPath'
  similarityScore: number;
  createdAt: Date;
}
