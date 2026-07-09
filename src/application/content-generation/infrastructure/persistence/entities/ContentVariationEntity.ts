// src/application/content-generation/infrastructure/persistence/entities/ContentVariationEntity.ts
export class ContentVariationEntity {
  id!: string;
  sourceContentId!: string;
  variationContentId!: string;
  variationType!: string;
  similarityScore!: number;
  createdAt!: Date;
}
