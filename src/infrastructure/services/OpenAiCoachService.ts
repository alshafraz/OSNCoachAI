import { AiCoachService } from '../../domain/services/AiCoachService';
import { Question } from '../../domain/entities/Question';
import { Attempt } from '../../domain/entities/Attempt';

export class OpenAiCoachService implements AiCoachService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateHint(question: Question, previousAttempts: Attempt[], studentAnswer: string): Promise<string> {
    if (!this.apiKey) {
      return `Hmm, nice try! Let's think about this. You answered "${studentAnswer}", but the topic of the question is "${question.topic}". What would happen if we break it down into smaller parts or look for a pattern? Try again, you can do it!`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a friendly, encouraging Math Olympiad coach for elementary school students. 
Your goal is to guide the student using the Socratic method. Do NOT give the direct answer under any circumstances.
Instead, analyze the question and their incorrect answer, and give a supportive, child-friendly hint that sparks curiosity. Keep it short (2-3 sentences).`,
            },
            {
              role: 'user',
              content: `Question Title: ${question.title}\nQuestion: ${question.body}\nCorrect Answer: ${question.correctAnswer}\nStudent Answer: ${studentAnswer}`,
            },
          ],
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Keep trying! You are doing great. Think about the problem step-by-step.';
    } catch (error) {
      console.error('Error generating AI hint:', error);
      return 'Keep trying! You are doing great. Think about the problem step-by-step.';
    }
  }

  async explainSolution(question: Question, studentAnswer: string): Promise<string> {
    return `Excellent! The correct answer is indeed "${question.correctAnswer}". Let's check the explanation:\n\n${question.explanation}`;
  }
}
