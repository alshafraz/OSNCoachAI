/**
 * Content Intelligence Platform — Domain Entities
 *
 * Single source of truth for all CIP types.
 * Every pipeline stage, service, and API uses these types.
 */

// ─── ENUMS ───────────────────────────────────────────────────────────────────

export type ContentStatus = 'DRAFT' | 'PROCESSING' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';

export type PipelineStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL' | 'PAUSED';

export type StageStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export type ReviewDecision = 'APPROVED' | 'REJECTED' | 'EDIT_REQUESTED';

export type ContentSourceType = 'PDF_UPLOAD' | 'SCANNED_PDF' | 'IMAGE' | 'MANUAL_INPUT' | 'BULK_CSV' | 'BULK_JSON' | 'AI_GENERATED' | 'API';

export type QuestionFormat = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'FILL_IN_BLANK' | 'IMAGE_BASED' | 'DIAGRAM_BASED' | 'EXPRESSION_BASED';

export type PipelineStageName =
  | 'FILE_VALIDATION'
  | 'OCR_EXTRACTION'
  | 'QUESTION_SEGMENTATION'
  | 'MATH_NORMALIZATION'
  | 'DIAGRAM_DETECTION'
  | 'FORMULA_DETECTION'
  | 'CONCEPT_MAPPING'
  | 'SKILL_MAPPING'
  | 'DIFFICULTY_ANALYSIS'
  | 'MISCONCEPTION_TAGGING'
  | 'AI_VALIDATION'
  | 'CONFIDENCE_SCORING'
  | 'QUALITY_SCORING'
  | 'DUPLICATE_DETECTION'
  | 'CONTENT_ENRICHMENT';

// ─── CONTENT SOURCE ───────────────────────────────────────────────────────────

export interface ContentSource {
  id: string;
  type: ContentSourceType;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  pageCount?: number;
  uploadedAt: Date;
  uploadedBy: string;
  rawContent?: string;
  fileHash?: string;
}

// ─── MATH EXPRESSION ─────────────────────────────────────────────────────────

export interface MathExpression {
  raw: string;
  normalized: string;
  type: 'FRACTION' | 'POWER' | 'ROOT' | 'SUM' | 'GREEK' | 'GEOMETRY' | 'RATIO' | 'UNIT' | 'PERCENT' | 'OTHER';
  confidence: number;
}

// ─── DIAGRAM ASSET ───────────────────────────────────────────────────────────

export interface DiagramAsset {
  id: string;
  type: 'GEOMETRY' | 'CHART' | 'TABLE' | 'GRAPH' | 'ILLUSTRATION';
  boundingBox?: { x: number; y: number; width: number; height: number; page: number };
  imageDataUrl?: string;
  extractionConfidence: number;
  description?: string;
}

// ─── SEGMENTED SECTION ───────────────────────────────────────────────────────

export interface SegmentedSection {
  type: 'QUESTION_NUMBER' | 'BODY' | 'CHOICE' | 'ANSWER' | 'EXPLANATION' | 'HINT' | 'FIGURE_REF' | 'SUB_QUESTION';
  content: string;
  confidence: number;
  lineStart?: number;
  lineEnd?: number;
}

// ─── EXTRACTED QUESTION ───────────────────────────────────────────────────────

export interface ExtractedQuestion {
  sequenceNumber?: number;
  body: string;
  choices: string[];
  correctAnswer?: string;
  explanation?: string;
  hint?: string;
  format: QuestionFormat;
  mathExpressions: MathExpression[];
  diagrams: DiagramAsset[];
  formulaIds: string[];
  sections: SegmentedSection[];
  rawText: string;
}

// ─── CONFIDENCE SCORES ────────────────────────────────────────────────────────

export interface ConfidenceScore {
  ocr: number;
  questionParsing: number;
  answerDetection: number;
  explanationDetection: number;
  topicClassification: number;
  difficultyClassification: number;
  conceptMapping: number;
  skillMapping: number;
  overallContentQuality: number;
  overall: number;
}

// ─── QUALITY SCORE ────────────────────────────────────────────────────────────

export interface QualityScore {
  ocrAccuracy: number;
  missingFieldsPenalty: number;
  formattingScore: number;
  answerAvailability: number;
  explanationAvailability: number;
  confidenceScore: number;
  difficultyCalibration: number;
  imageQuality: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
}

// ─── DUPLICATE MATCH ─────────────────────────────────────────────────────────

export interface DuplicateMatch {
  matchedContentId: string;
  matchType: 'EXACT' | 'NEAR' | 'SAME_CONCEPT' | 'SAME_DIAGRAM';
  similarityPct: number;
  details: string;
}

// ─── CLASSIFICATION RESULT ────────────────────────────────────────────────────

export interface ClassificationResult {
  primaryConceptId: string;
  secondaryConceptIds: string[];
  skillIds: string[];
  strategyIds: string[];
  misconceptionIds: string[];
  difficultyLevel: string;
  difficultyScore: number;
  cognitiveLevel: string;
  olympiadTopic: string;
  estimatedSolveMinutes: number;
}

// ─── CONTENT ENRICHMENT ───────────────────────────────────────────────────────

export interface ContentEnrichment {
  learningObjectives: string[];
  requiredPrerequisites: string[];
  recommendedHintLevels: number[];
  alternativeStrategies: string[];
  visualLearningSuggestions: string[];
  keyConceptSummary: string;
  difficultyExplanation: string;
}

// ─── PIPELINE STAGE RESULT ────────────────────────────────────────────────────

export interface PipelineStageResult {
  id: string;
  jobId: string;
  stageName: PipelineStageName;
  status: StageStatus;
  startedAt: Date;
  completedAt?: Date;
  latencyMs?: number;
  retryCount: number;
  output?: Record<string, unknown>;
  errors: string[];
  warnings: string[];
}

// ─── PIPELINE JOB ─────────────────────────────────────────────────────────────

export interface PipelineJob {
  id: string;
  contentItemId: string;
  status: PipelineStatus;
  currentStage?: PipelineStageName;
  stages: PipelineStageResult[];
  startedAt: Date;
  completedAt?: Date;
  totalLatencyMs?: number;
  aiCostEstimate?: number;
  extractedQuestions: ExtractedQuestion[];
  confidenceScores?: ConfidenceScore;
  qualityScore?: QualityScore;
  classificationResults?: ClassificationResult[];
  duplicateMatches?: DuplicateMatch[];
  enrichment?: ContentEnrichment;
  errorCount: number;
}

// ─── REVIEW RECORD ────────────────────────────────────────────────────────────

export interface ReviewRecord {
  id: string;
  jobId: string;
  reviewerId: string;
  decision: ReviewDecision;
  comments: string;
  editedQuestions?: Partial<ExtractedQuestion>[];
  reviewedAt: Date;
}

// ─── CONTENT VERSION ─────────────────────────────────────────────────────────

export interface ContentVersion {
  id: string;
  contentItemId: string;
  version: number;
  changedBy: string;
  changeDescription: string;
  snapshot: Record<string, unknown>;
  createdAt: Date;
}

// ─── AUDIT LOG ENTRY ─────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  contentItemId: string;
  action: string;
  actor: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// ─── CONTENT ITEM ─────────────────────────────────────────────────────────────

export interface ContentItem {
  id: string;
  source: ContentSource;
  status: ContentStatus;
  pipelineJob?: PipelineJob;
  reviewRecord?: ReviewRecord;
  versions: ContentVersion[];
  auditLog: AuditLogEntry[];
  publishedQuestionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── FILE VALIDATION RESULT ───────────────────────────────────────────────────

export interface FileValidationResult {
  isValid: boolean;
  format: string;
  fileSizeBytes: number;
  pageCount?: number;
  isEncrypted: boolean;
  isPasswordProtected: boolean;
  isCorrupted: boolean;
  detectedLanguage?: string;
  resolution?: number;
  errors: string[];
  warnings: string[];
}

// ─── OCR RESULT ───────────────────────────────────────────────────────────────

export interface OcrPageResult {
  pageNumber: number;
  rawText: string;
  confidence: number;
  detectedEquations: string[];
  detectedTables: string[][];
  imageCount: number;
}

export interface OcrResult {
  pages: OcrPageResult[];
  fullText: string;
  overallConfidence: number;
  provider: string;
  latencyMs: number;
}
