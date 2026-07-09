/**
 * CIP — Content Repository (In-Memory, Prisma-Ready)
 *
 * Single store for all CIP data. Every read/write goes through this.
 * Never access storage directly from pipeline stages.
 * When Prisma is ready, replace method bodies with Prisma calls.
 */

import type {
  ContentItem,
  PipelineJob,
  PipelineStageResult,
  ReviewRecord,
  ContentVersion,
  AuditLogEntry,
} from '@/domain/entities/cip/ContentEntities';
import type { ContentStorageService } from '@/domain/services/cip/CipServices';

function cuid(): string {
  return `cip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class InMemoryContentRepository implements ContentStorageService {
  private contentItems = new Map<string, ContentItem>();
  private pipelineJobs = new Map<string, PipelineJob>();
  private stageResults = new Map<string, PipelineStageResult>();
  private reviewRecords = new Map<string, ReviewRecord>(); // keyed by jobId
  private versions = new Map<string, ContentVersion[]>();
  private auditLogs = new Map<string, AuditLogEntry[]>();

  // ─── CONTENT ITEMS ─────────────────────────────────────────────────────────

  saveContentItem(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const now = new Date();
    const full: ContentItem = { ...item, id: cuid(), createdAt: now, updatedAt: now };
    this.contentItems.set(full.id, full);
    return full;
  }

  getContentItem(id: string): ContentItem | null {
    return this.contentItems.get(id) ?? null;
  }

  listContentItems(filter?: { status?: string }): ContentItem[] {
    const all = [...this.contentItems.values()];
    if (!filter?.status) return all;
    return all.filter((c) => c.status === filter.status);
  }

  updateContentItem(id: string, updates: Partial<ContentItem>): ContentItem {
    const existing = this.contentItems.get(id);
    if (!existing) throw new Error(`ContentItem not found: ${id}`);
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.contentItems.set(id, updated);
    return updated;
  }

  // ─── PIPELINE JOBS ─────────────────────────────────────────────────────────

  savePipelineJob(job: Omit<PipelineJob, 'id'>): PipelineJob {
    const full: PipelineJob = { ...job, id: cuid() };
    this.pipelineJobs.set(full.id, full);
    return full;
  }

  getPipelineJob(id: string): PipelineJob | null {
    return this.pipelineJobs.get(id) ?? null;
  }

  listPipelineJobs(filter?: { status?: string; limit?: number }): PipelineJob[] {
    let all = [...this.pipelineJobs.values()];
    if (filter?.status) all = all.filter((j) => j.status === filter.status);
    if (filter?.limit) all = all.slice(0, filter.limit);
    return all.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  updatePipelineJob(id: string, updates: Partial<PipelineJob>): PipelineJob {
    const existing = this.pipelineJobs.get(id);
    if (!existing) throw new Error(`PipelineJob not found: ${id}`);
    const updated = { ...existing, ...updates };
    this.pipelineJobs.set(id, updated);
    return updated;
  }

  // ─── STAGE RESULTS ─────────────────────────────────────────────────────────

  saveStageResult(result: Omit<PipelineStageResult, 'id'>): PipelineStageResult {
    const full: PipelineStageResult = { ...result, id: cuid() };
    this.stageResults.set(full.id, full);

    // Attach to job
    const job = this.pipelineJobs.get(result.jobId);
    if (job) {
      job.stages = [...job.stages.filter((s) => s.stageName !== result.stageName), full];
      this.pipelineJobs.set(job.id, job);
    }
    return full;
  }

  // ─── REVIEW RECORDS ────────────────────────────────────────────────────────

  saveReviewRecord(record: Omit<ReviewRecord, 'id'>): ReviewRecord {
    const full: ReviewRecord = { ...record, id: cuid() };
    this.reviewRecords.set(record.jobId, full);
    return full;
  }

  getReviewRecord(jobId: string): ReviewRecord | null {
    return this.reviewRecords.get(jobId) ?? null;
  }

  // ─── VERSIONS ──────────────────────────────────────────────────────────────

  saveVersion(version: Omit<ContentVersion, 'id'>): ContentVersion {
    const full: ContentVersion = { ...version, id: cuid() };
    const existing = this.versions.get(version.contentItemId) ?? [];
    existing.push(full);
    this.versions.set(version.contentItemId, existing);
    return full;
  }

  // ─── AUDIT LOG ─────────────────────────────────────────────────────────────

  appendAuditLog(entry: Omit<AuditLogEntry, 'id'>): AuditLogEntry {
    const full: AuditLogEntry = { ...entry, id: cuid() };
    const existing = this.auditLogs.get(entry.contentItemId) ?? [];
    existing.push(full);
    this.auditLogs.set(entry.contentItemId, existing);
    return full;
  }

  getAuditLog(contentItemId: string): AuditLogEntry[] {
    return this.auditLogs.get(contentItemId) ?? [];
  }
}

// ─── SINGLETON INSTANCE ───────────────────────────────────────────────────────
// Shared across the server process. Replace with Prisma-backed implementation when ready.
export const contentRepository = new InMemoryContentRepository();
