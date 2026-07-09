import { Question } from '../entities/Question.ts';
import { Attempt } from '../entities/Attempt.ts';

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>;
  findAll(): Promise<Question[]>;
  findPaged(options: {
    page: number;
    limit: number;
    search?: string;
    topic?: string;
    difficulty?: string;
    source?: string;
  }): Promise<{ questions: Question[]; total: number }>;
  create(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question>;
  update(id: string, question: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Question>;
  delete(id: string): Promise<boolean>;
  saveAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>): Promise<Attempt>;
  findAttemptsByStudentId(studentId: string): Promise<Attempt[]>;
}
