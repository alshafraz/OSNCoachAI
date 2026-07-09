// src/application/adaptive-learning/services/ReviewScheduler.ts
import { paleConfig } from '../config/paleConfig';
import { ReviewSchedule } from '../domain/models/ReviewSchedule';
import { ReviewScheduleRepository } from '../infrastructure/persistence/repositories/ReviewScheduleRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * ReviewScheduler implements spaced-repetition scheduling using a Leitner box system.
 *
 * Box intervals (from paleConfig): [1, 3, 7, 14, 30] days
 * - Correct review → advance box (longer interval)
 * - Incorrect review → reset to box 1 (daily review)
 */
export class ReviewScheduler {
  private readonly logger = new Logger('ReviewScheduler');
  private readonly repo = new ReviewScheduleRepository();

  /**
   * Schedule a review for a topic.
   * @param retentionScore - Current retention score (0-1) from RetentionEngine
   */
  async scheduleReview(
    studentId: string,
    topicId: string,
    retentionScore: number,
    currentBox = 1
  ): Promise<ReviewSchedule> {
    const cfg = paleConfig.review;
    const intervals = cfg.leitnerIntervals;
    const boxIndex = Math.min(currentBox - 1, intervals.length - 1);
    const daysUntilReview = intervals[boxIndex];

    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + daysUntilReview);

    // Urgency: higher when retention is low or box is early
    const urgency = Math.max(0, 1 - retentionScore) * (1 + (1 / currentBox));
    const normalizedUrgency = Math.min(1, urgency);

    const schedule: ReviewSchedule = {
      id: uuidv4(),
      studentId,
      topicId,
      leitnerBox: currentBox,
      scheduledFor,
      urgency: normalizedUrgency,
      retentionAtScheduling: retentionScore,
      completed: false,
      createdAt: new Date(),
    };

    await this.repo.save(schedule as any);
    this.logger.info('Review scheduled', { studentId, topicId, box: currentBox, daysUntilReview, urgency: normalizedUrgency });
    return schedule;
  }

  /**
   * Returns all upcoming (not yet completed) reviews for a student, sorted by urgency.
   */
  async getUpcomingReviews(studentId: string, limit = 10): Promise<ReviewSchedule[]> {
    const entities = await this.repo.findUpcomingByStudent(studentId, limit);
    return entities as any[];
  }

  /**
   * Returns reviews that are due today or overdue.
   */
  async getDueReviews(studentId: string): Promise<ReviewSchedule[]> {
    const entities = await this.repo.findDueByStudent(studentId);
    return entities as any[];
  }

  /**
   * Mark a review as completed and reschedule based on correctness.
   */
  async completeReview(reviewId: string, answeredCorrectly: boolean): Promise<void> {
    const all = await this.repo.findUpcomingByStudent('', 10000);
    const review = (all as any[]).find((r: any) => r.id === reviewId);
    if (!review) return;

    review.completed = true;
    review.completedAt = new Date();
    review.answeredCorrectly = answeredCorrectly;
    await this.repo.save(review);

    // Re-schedule into next box (correct) or back to box 1 (incorrect)
    const nextBox = answeredCorrectly ? Math.min(review.leitnerBox + 1, 5) : 1;
    await this.scheduleReview(review.studentId, review.topicId, review.retentionAtScheduling, nextBox);
  }
}
