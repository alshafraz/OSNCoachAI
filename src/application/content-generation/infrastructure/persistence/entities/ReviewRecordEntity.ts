// src/application/content-generation/infrastructure/persistence/entities/ReviewRecordEntity.ts
export class ReviewRecordEntity {
  id!: string;
  contentId!: string;
  reviewerId!: string;
  decision!: string;
  comments?: string;
  reviewedAt!: Date;
}
