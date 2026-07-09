import { QuestionRepository } from '../../domain/repositories/QuestionRepository';

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(id: string): Promise<boolean> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new Error('Question not found.');
    }
    return this.questionRepository.delete(id);
  }
}
