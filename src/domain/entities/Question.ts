export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';

export class Question {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly body: string,
    public readonly difficulty: QuestionDifficulty,
    public readonly topic: string,
    public readonly correctAnswer: string,
    public readonly explanation: string,
    public readonly type: QuestionType = 'SHORT_ANSWER',
    public readonly options: string[] = [],
    public readonly imageUrl?: string,
    public readonly hint?: string,
    public readonly source?: string,
    public readonly tags: string[] = [],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
