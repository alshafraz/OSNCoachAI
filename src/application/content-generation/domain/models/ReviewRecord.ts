// src/application/content-generation/domain/models/ReviewRecord.ts
import type { ReviewState } from './GeneratedContent';

export interface ReviewRecord {
  id: string;
  contentId: string;
  reviewerId: string;
  decision: ReviewState;
  comments?: string;
  reviewedAt: Date;
}
