// src/application/ai-governance/domain/models/Prompt.ts
import { AIOpsReleaseStatus } from '../../config/governanceConfig';

/**
 * Prompt version model.
 */
export interface PromptVersion {
  versionId: string;
  promptId: string;
  semver: string; // e.g. '1.0.0'
  author: string;
  description: string;
  status: AIOpsReleaseStatus;
  releaseNotes: string;
  systemTemplate: string;
  userTemplate: string;
  temperature: number;
  maxTokens: number;
  expectedOutputSchema?: Record<string, any>;
  evaluationScore?: number; // score from running benchmark tests
  createdAt: Date;
}

/**
 * Base Prompt Template container.
 */
export interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  variables: string[];
  activeVersion: string; // Semver of the active release
  versions: Record<string, PromptVersion>; // semver -> Version details
  createdAt: Date;
  updatedAt: Date;
}
