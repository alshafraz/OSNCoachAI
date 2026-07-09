// src/application/ai-governance/infrastructure/persistence/entities/Entities.ts

export class PromptEntity {
  id!: string;
  name!: string;
  description!: string;
  category!: string;
  owner!: string;
  variables!: string[];
  activeVersion!: string;
  versions!: Record<string, any>;
  createdAt!: Date;
  updatedAt!: Date;
}

export class PromptVersionEntity {
  versionId!: string;
  promptId!: string;
  semver!: string;
  author!: string;
  description!: string;
  status!: string;
  releaseNotes!: string;
  systemTemplate!: string;
  userTemplate!: string;
  temperature!: number;
  maxTokens!: number;
  expectedOutputSchema?: any;
  evaluationScore?: number;
  createdAt!: Date;
}

export class PromptEvaluationEntity {
  id!: string;
  promptId!: string;
  promptVersion!: string;
  evaluatedAt!: Date;
  overallScore!: number;
  correctness!: number;
  consistency!: number;
  completeness!: number;
  pedagogicalQuality!: number;
  mathematicalAccuracy!: number;
  explanationQuality!: number;
  hintQuality!: number;
  sampleCount!: number;
  notes?: string;
}

export class ModelProviderEntity {
  id!: string;
  providerType!: string;
  modelName!: string;
  avgLatencyMs!: number;
  qualityScore!: number;
  isAvailable!: boolean;
  costPerMillionPrompt!: number;
  costPerMillionCompletion!: number;
  fallbackModelId?: string;
  consecutiveFailures!: number;
  lastTestedAt!: Date;
}

export class AIRequestEntity {
  requestId!: string;
  engine!: string;
  studentId?: string;
  promptId!: string;
  promptVersion!: string;
  variables!: any;
  systemPrompt!: string;
  userPrompt!: string;
  temperature!: number;
  maxTokens!: number;
  timestamp!: Date;
}

export class AIResponseEntity {
  responseId!: string;
  requestId!: string;
  providerId!: string;
  rawContent!: string;
  parsedData?: any;
  isValid!: boolean;
  validationReason?: string;
  isSafe!: boolean;
  safetyReason?: string;
  qualityScore!: number;
  latencyMs!: number;
  retryCount!: number;
  inputTokens!: number;
  outputTokens!: number;
  costUsd!: number;
  timestamp!: Date;
}

export class CostTrackingEntity {
  id!: string;
  requestId!: string;
  engine!: string;
  studentId?: string;
  providerId!: string;
  inputTokens!: number;
  outputTokens!: number;
  costUsd!: number;
  timestamp!: Date;
}

export class AuditLogEntity {
  id!: string;
  requestId!: string;
  timestamp!: Date;
  studentId?: string;
  engine!: string;
  promptId!: string;
  promptVersion!: string;
  providerId!: string;
  modelName!: string;
  inputTokens!: number;
  outputTokens!: number;
  costUsd!: number;
  latencyMs!: number;
  retryCount!: number;
  success!: boolean;
  isValid!: boolean;
  isSafe!: boolean;
  qualityScore!: number;
  errorDetails?: any;
}

export class FeatureFlagEntity {
  flagKey!: string;
  description!: string;
  isActive!: boolean;
  canaryWeight!: number;
  targetValue!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class BenchmarkEntity {
  id!: string;
  category!: string;
  inputVariables!: any;
  expectedOutputPattern!: string;
  description!: string;
}
