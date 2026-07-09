/**
 * CIP — Review Workflow & Publishing Service
 *
 * ReviewWorkflowService: admin approve/reject/request-edit.
 * PublishingService: the ONLY code path allowed to write to the Question database.
 */

import type { ReviewRecord, PipelineJob } from '@/domain/entities/cip/ContentEntities';
import type { ReviewService, PublishingService } from '@/domain/services/cip/CipServices';
import { contentRepository } from './ContentRepository';

// ─── REVIEW WORKFLOW ──────────────────────────────────────────────────────────

export class ReviewWorkflowService implements ReviewService {
  approve(jobId: string, reviewerId: string, comments = ''): ReviewRecord {
    const record = contentRepository.saveReviewRecord({
      jobId,
      reviewerId,
      decision: 'APPROVED',
      comments,
      reviewedAt: new Date(),
    });

    // Update job's content item status
    const job = contentRepository.getPipelineJob(jobId);
    if (job) {
      contentRepository.updateContentItem(job.contentItemId, { status: 'APPROVED' });
      contentRepository.appendAuditLog({
        contentItemId: job.contentItemId,
        action: 'REVIEW_APPROVED',
        actor: reviewerId,
        metadata: { jobId, comments },
        timestamp: new Date(),
      });
    }
    return record;
  }

  reject(jobId: string, reviewerId: string, reason: string): ReviewRecord {
    const record = contentRepository.saveReviewRecord({
      jobId,
      reviewerId,
      decision: 'REJECTED',
      comments: reason,
      reviewedAt: new Date(),
    });

    const job = contentRepository.getPipelineJob(jobId);
    if (job) {
      contentRepository.updateContentItem(job.contentItemId, { status: 'REJECTED' });
      contentRepository.appendAuditLog({
        contentItemId: job.contentItemId,
        action: 'REVIEW_REJECTED',
        actor: reviewerId,
        metadata: { jobId, reason },
        timestamp: new Date(),
      });
    }
    return record;
  }

  requestEdit(
    jobId: string,
    reviewerId: string,
    edits: Partial<import('@/domain/entities/cip/ContentEntities').ExtractedQuestion>[],
    comments: string
  ): ReviewRecord {
    const record = contentRepository.saveReviewRecord({
      jobId,
      reviewerId,
      decision: 'EDIT_REQUESTED',
      comments,
      editedQuestions: edits,
      reviewedAt: new Date(),
    });

    const job = contentRepository.getPipelineJob(jobId);
    if (job) {
      contentRepository.appendAuditLog({
        contentItemId: job.contentItemId,
        action: 'EDIT_REQUESTED',
        actor: reviewerId,
        metadata: { jobId, editCount: edits.length },
        timestamp: new Date(),
      });
    }
    return record;
  }

  getReviewRecord(jobId: string): ReviewRecord | null {
    return contentRepository.getReviewRecord(jobId);
  }

  listPendingReviews(): PipelineJob[] {
    return contentRepository.listPipelineJobs({ status: 'COMPLETED' }).filter((j) => {
      const review = contentRepository.getReviewRecord(j.id);
      return !review;
    });
  }
}

// ─── PUBLISHING SERVICE ───────────────────────────────────────────────────────

export class PublishingServiceImpl implements PublishingService {
  async publish(jobId: string, publisherId: string): Promise<{ publishedQuestionIds: string[] }> {
    // Safety gate: require APPROVED review record
    const review = contentRepository.getReviewRecord(jobId);
    if (!review || review.decision !== 'APPROVED') {
      throw new Error(`Cannot publish job ${jobId}: no APPROVED review record found.`);
    }

    const job = contentRepository.getPipelineJob(jobId);
    if (!job) throw new Error(`Pipeline job not found: ${jobId}`);
    if (job.status !== 'COMPLETED' && job.status !== 'PARTIAL') {
      throw new Error(`Pipeline job ${jobId} has not completed successfully. Status: ${job.status}`);
    }

    // Map extracted questions to published question IDs (placeholder — real implementation calls QuestionRepository)
    const publishedIds: string[] = job.extractedQuestions.map((_, i) =>
      `pub_${jobId}_q${i + 1}`
    );

    contentRepository.updateContentItem(job.contentItemId, {
      status: 'PUBLISHED',
      publishedQuestionIds: publishedIds,
    });

    contentRepository.saveVersion({
      contentItemId: job.contentItemId,
      version: 1,
      changedBy: publisherId,
      changeDescription: 'Initial publication via CIP pipeline.',
      snapshot: { jobId, publishedIds },
      createdAt: new Date(),
    });

    contentRepository.appendAuditLog({
      contentItemId: job.contentItemId,
      action: 'PUBLISHED',
      actor: publisherId,
      metadata: { jobId, publishedIds },
      timestamp: new Date(),
    });

    return { publishedQuestionIds: publishedIds };
  }

  async unpublish(questionId: string, reason: string): Promise<void> {
    // Find the content item by published question ID
    const items = contentRepository.listContentItems({ status: 'PUBLISHED' });
    const item = items.find((i) => i.publishedQuestionIds.includes(questionId));
    if (!item) throw new Error(`Published question not found: ${questionId}`);

    contentRepository.updateContentItem(item.id, { status: 'ARCHIVED' });
    contentRepository.appendAuditLog({
      contentItemId: item.id,
      action: 'UNPUBLISHED',
      actor: 'SYSTEM',
      metadata: { questionId, reason },
      timestamp: new Date(),
    });
  }
}
