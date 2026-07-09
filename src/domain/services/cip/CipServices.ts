/**
 * Content Intelligence Platform — Service Interface Contracts
 *
 * Every CIP implementation must satisfy these interfaces.
 * Application and AI agent code must ONLY use these interfaces, never implementations.
 */

import type {
  ContentItem,
  ContentSource,
  PipelineJob,
  PipelineStageResult,
  ExtractedQuestion,
  FileValidationResult,
  OcrResult,
  ClassificationResult,
  ConfidenceScore,
  QualityScore,
  DuplicateMatch,
  ReviewRecord,
  ReviewDecision,
  ContentEnrichment,
  ContentVersion,
  AuditLogEntry,
} from '../../entities/cip/ContentEntities';

// ─── CONTENT PIPELINE SERVICE ─────────────────────────────────────────────────

export interface ContentPipelineService {
  /** Submit a new content item and start the full pipeline. Returns the created job. */
  submit(source: ContentSource): Promise<PipelineJob>;

  /** Resume a failed or paused pipeline from its last successful stage. */
  resume(jobId: string): Promise<PipelineJob>;

  /** Get full pipeline job status including all stage results. */
  getJob(jobId: string): Promise<PipelineJob | null>;

  /** List all jobs with optional status filter. */
  listJobs(filter?: { status?: string; limit?: number; offset?: number }): Promise<PipelineJob[]>;

  /** Get pipeline observability metrics. */
  getMetrics(): PipelineMetrics;
}

export interface PipelineMetrics {
  totalJobs: number;
  successRate: number;
  avgLatencyMs: number;
  avgAiCost: number;
  failuresByStage: Record<string, number>;
  throughputPerHour: number;
}

// ─── FILE VALIDATION SERVICE ──────────────────────────────────────────────────

export interface FileValidationService {
  validate(input: {
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
    buffer?: Buffer;
  }): FileValidationResult;

  readonly supportedFormats: string[];
  readonly maxFileSizeBytes: number;
}

// ─── OCR EXTRACTION SERVICE ───────────────────────────────────────────────────

export interface OcrExtractionService {
  extract(input: {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
  }): Promise<OcrResult>;

  readonly providerName: string;
}

// ─── QUESTION PARSER SERVICE ──────────────────────────────────────────────────

export interface QuestionParserService {
  parse(rawText: string): ExtractedQuestion[];
  segment(rawText: string): import('../../entities/cip/ContentEntities').SegmentedSection[];
}

// ─── MATH NORMALIZER SERVICE ──────────────────────────────────────────────────

export interface MathNormalizerService {
  normalize(text: string): string;
  extractExpressions(text: string): import('../../entities/cip/ContentEntities').MathExpression[];
}

// ─── CONTENT CLASSIFICATION SERVICE ──────────────────────────────────────────

export interface ContentClassificationService {
  classify(question: ExtractedQuestion): ClassificationResult;
  classifyBatch(questions: ExtractedQuestion[]): ClassificationResult[];
}

// ─── CONTENT VALIDATION SERVICE ───────────────────────────────────────────────

export interface ContentValidationService {
  validate(question: ExtractedQuestion, classification: ClassificationResult): {
    isValid: boolean;
    issues: { field: string; severity: 'ERROR' | 'WARNING'; message: string }[];
    suggestions: string[];
  };
}

// ─── QUALITY SERVICE ──────────────────────────────────────────────────────────

export interface QualityService {
  score(params: {
    ocrConfidence: number;
    question: ExtractedQuestion;
    classification: ClassificationResult;
    validationIssues: { severity: string }[];
  }): QualityScore;
}

// ─── DUPLICATE DETECTION SERVICE ──────────────────────────────────────────────

export interface DuplicateDetectionService {
  detect(question: ExtractedQuestion): DuplicateMatch[];
  register(contentId: string, question: ExtractedQuestion): void;
  computeSimilarity(a: ExtractedQuestion, b: ExtractedQuestion): number;
}

// ─── CONTENT STORAGE SERVICE ──────────────────────────────────────────────────

export interface ContentStorageService {
  saveContentItem(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem;
  getContentItem(id: string): ContentItem | null;
  listContentItems(filter?: { status?: string }): ContentItem[];
  updateContentItem(id: string, updates: Partial<ContentItem>): ContentItem;

  savePipelineJob(job: Omit<PipelineJob, 'id'>): PipelineJob;
  getPipelineJob(id: string): PipelineJob | null;
  listPipelineJobs(filter?: { status?: string; limit?: number }): PipelineJob[];
  updatePipelineJob(id: string, updates: Partial<PipelineJob>): PipelineJob;

  saveStageResult(result: Omit<PipelineStageResult, 'id'>): PipelineStageResult;

  saveReviewRecord(record: Omit<ReviewRecord, 'id'>): ReviewRecord;
  getReviewRecord(jobId: string): ReviewRecord | null;

  saveVersion(version: Omit<ContentVersion, 'id'>): ContentVersion;
  appendAuditLog(entry: Omit<AuditLogEntry, 'id'>): AuditLogEntry;
  getAuditLog(contentItemId: string): AuditLogEntry[];
}

// ─── REVIEW SERVICE ───────────────────────────────────────────────────────────

export interface ReviewService {
  approve(jobId: string, reviewerId: string, comments?: string): ReviewRecord;
  reject(jobId: string, reviewerId: string, reason: string): ReviewRecord;
  requestEdit(jobId: string, reviewerId: string, edits: Partial<ExtractedQuestion>[], comments: string): ReviewRecord;
  getReviewRecord(jobId: string): ReviewRecord | null;
  listPendingReviews(): PipelineJob[];
}

// ─── PUBLISHING SERVICE ───────────────────────────────────────────────────────

export interface PublishingService {
  /** Only allowed after a ReviewRecord with APPROVED decision exists. */
  publish(jobId: string, publisherId: string): Promise<{ publishedQuestionIds: string[] }>;
  unpublish(questionId: string, reason: string): Promise<void>;
}

// ─── CONTENT ENRICHMENT SERVICE ───────────────────────────────────────────────

export interface ContentEnrichmentService {
  enrich(question: ExtractedQuestion, classification: ClassificationResult): ContentEnrichment;
}
