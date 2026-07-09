// src/application/content-generation/infrastructure/persistence/entities/PublicationEntity.ts
export class PublicationEntity {
  id!: string;
  contentId!: string;
  publishedBy!: string;
  publishedAt!: Date;
  targetChannels!: string[];
  externalReferenceId?: string;
}
