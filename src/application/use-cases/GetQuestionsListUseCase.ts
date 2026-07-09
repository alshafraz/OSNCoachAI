import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { Question } from '../../domain/entities/Question';

export interface GetQuestionsListInput {
  page: number;
  limit: number;
  search?: string;
  topic?: string;
  difficulty?: string;
  source?: string;
}

export class GetQuestionsListUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(input: GetQuestionsListInput): Promise<{ questions: Question[]; total: number }> {
    const page = Math.max(1, input.page);
    const limit = Math.max(1, Math.min(100, input.limit));

    return this.questionRepository.findPaged({
      page,
      limit,
      search: input.search || undefined,
      topic: input.topic || undefined,
      difficulty: input.difficulty || undefined,
      source: input.source || undefined,
    });
  }
}
