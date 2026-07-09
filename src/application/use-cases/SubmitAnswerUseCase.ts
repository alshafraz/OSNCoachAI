import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AiCoachService } from '../../domain/services/AiCoachService';
import { Attempt } from '../../domain/entities/Attempt';

export interface SubmitAnswerInput {
  studentProfileId: string;
  questionId: string;
  studentAnswer: string;
}

export interface SubmitAnswerResult {
  isCorrect: boolean;
  pointsEarned: number;
  newStreak: number;
  newLevel: number;
  hint?: string;
}

export class SubmitAnswerUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
    private readonly aiCoachService: AiCoachService
  ) {}

  async execute(input: SubmitAnswerInput): Promise<SubmitAnswerResult> {
    const question = await this.questionRepository.findById(input.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const studentProfile = await this.userRepository.findStudentProfileById(input.studentProfileId);
    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const isCorrect = question.correctAnswer.trim().toLowerCase() === input.studentAnswer.trim().toLowerCase();
    
    let pointsEarned = 0;
    let newStreak = studentProfile.currentStreak;
    let newLevel = studentProfile.level;

    if (isCorrect) {
      pointsEarned = 10;
      newStreak += 1;
      const totalPoints = studentProfile.points + pointsEarned;
      newLevel = Math.floor(totalPoints / 100) + 1;

      await this.userRepository.updateStudentPointsAndStreak(
        studentProfile.id,
        totalPoints,
        newStreak
      );
    } else {
      newStreak = 0;
      await this.userRepository.updateStudentPointsAndStreak(
        studentProfile.id,
        studentProfile.points,
        newStreak
      );
    }

    let hint: string | undefined;
    if (!isCorrect) {
      const attempts = await this.questionRepository.findAttemptsByStudentId(studentProfile.id);
      const currentAttempt = new Attempt('', studentProfile.id, input.questionId, input.studentAnswer, false);
      hint = await this.aiCoachService.generateHint(question, [...attempts, currentAttempt], input.studentAnswer);
    }

    await this.questionRepository.saveAttempt(
      new Attempt(
        '',
        studentProfile.id,
        input.questionId,
        input.studentAnswer,
        isCorrect,
        hint ? { hint } : undefined
      )
    );

    return {
      isCorrect,
      pointsEarned,
      newStreak,
      newLevel,
      hint,
    };
  }
}
