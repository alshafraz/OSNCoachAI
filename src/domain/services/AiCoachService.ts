import { Question } from '../entities/Question';
import { Attempt } from '../entities/Attempt';

export interface AiCoachService {
  generateHint(question: Question, previousAttempts: Attempt[], studentAnswer: string): Promise<string>;
  explainSolution(question: Question, studentAnswer: string): Promise<string>;
}
