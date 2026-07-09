import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { Question } from '../../domain/entities/Question';

export type CreateQuestionInput = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>;

export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(input: CreateQuestionInput): Promise<Question> {
    if (!input.title || !input.title.trim()) {
      throw new Error('Question title is required.');
    }
    if (!input.body || !input.body.trim()) {
      throw new Error('Question body is required.');
    }
    if (!input.correctAnswer || !input.correctAnswer.trim()) {
      throw new Error('Correct answer is required.');
    }

    return this.questionRepository.create(input);
  }
}
