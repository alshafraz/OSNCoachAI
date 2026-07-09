export class Attempt {
  constructor(
    public readonly id: string,
    public readonly studentProfileId: string,
    public readonly questionId: string,
    public readonly studentAnswer: string,
    public readonly isCorrect: boolean,
    public readonly coachConversation?: any,
    public readonly createdAt?: Date
  ) {}
}
