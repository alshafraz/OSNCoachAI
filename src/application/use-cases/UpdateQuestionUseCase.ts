import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { Question } from '../../domain/entities/Question';

export type UpdateQuestionInput = {
  id: string;
  data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>;
};

export class UpdateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(input: UpdateQuestionInput): Promise<Question> {
    const question = await this.questionRepository.findById(input.id);
    if (!question) {
      throw new Error('Question not found.');
    }

    if (input.data.title !== undefined && (!input.data.title || !input.data.title.trim())) {
      throw new Error('Question title cannot be empty.');
    }
    if (input.data.body !== undefined && (!input.data.body || !input.data.body.trim())) {
      throw new Error('Question body cannot be empty.');
    }
    if (input.data.correctAnswer !== undefined && (!input.data.correctAnswer || !input.data.correctAnswer.trim())) {
      throw new Error('Correct answer cannot be empty.');
    }

    return this.questionRepository.update(input.id, input.data);
  }
}
