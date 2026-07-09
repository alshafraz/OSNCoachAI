// src/application/content-generation/domain/models/PromptVersion.ts

export interface PromptVersion {
  id: string;
  templateId: string;
  version: string;
  systemTemplate: string;
  userTemplate: string;
  variables: string[];
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  createdAt: Date;
  updatedBy: string;
}
