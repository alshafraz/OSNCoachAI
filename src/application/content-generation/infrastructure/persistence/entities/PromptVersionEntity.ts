// src/application/content-generation/infrastructure/persistence/entities/PromptVersionEntity.ts
export class PromptVersionEntity {
  id!: string;
  templateId!: string;
  version!: string;
  systemTemplate!: string;
  userTemplate!: string;
  variables!: string[];
  temperature!: number;
  maxTokens!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedBy!: string;
}
