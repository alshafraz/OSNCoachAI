// src/application/content-generation/domain/models/Publication.ts

export interface Publication {
  id: string;
  contentId: string;
  publishedBy: string;
  publishedAt: Date;
  targetChannels: string[];
  externalReferenceId?: string;
}
