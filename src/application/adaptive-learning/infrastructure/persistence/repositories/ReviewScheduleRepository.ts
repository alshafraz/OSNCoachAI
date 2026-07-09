// src/application/adaptive-learning/infrastructure/persistence/repositories/ReviewScheduleRepository.ts
import { ReviewScheduleEntity } from '../entities/ReviewScheduleEntity';

export class ReviewScheduleRepository {
  private static store: ReviewScheduleEntity[] = [];

  async findDueByStudent(studentId: string, beforeDate: Date = new Date()): Promise<ReviewScheduleEntity[]> {
    return ReviewScheduleRepository.store
      .filter(r => r.studentId === studentId && !r.completed && r.scheduledFor <= beforeDate)
      .sort((a, b) => b.urgency - a.urgency);
  }

  async findUpcomingByStudent(studentId: string, limit = 10): Promise<ReviewScheduleEntity[]> {
    return ReviewScheduleRepository.store
      .filter(r => r.studentId === studentId && !r.completed)
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())
      .slice(0, limit);
  }

  async save(entity: ReviewScheduleEntity | ReviewScheduleEntity[]): Promise<any> {
    const list = Array.isArray(entity) ? entity : [entity];
    for (const item of list) {
      if (!item.id) item.id = `rs-${Math.random().toString(36).substring(7)}`;
      const idx = ReviewScheduleRepository.store.findIndex(r => r.id === item.id);
      if (idx >= 0) ReviewScheduleRepository.store[idx] = item;
      else ReviewScheduleRepository.store.push(item);
    }
    return entity;
  }

  create(data: Partial<ReviewScheduleEntity>): ReviewScheduleEntity {
    const entity = new ReviewScheduleEntity();
    Object.assign(entity, data);
    return entity;
  }
}
