import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { Question } from '../../domain/entities/Question';
import { Attempt } from '../../domain/entities/Attempt';
import { prisma } from '../db/prisma';
import { Question as DbQuestion, Attempt as DbAttempt } from '@prisma/client';

export class PrismaQuestionRepository implements QuestionRepository {
  async findById(id: string): Promise<Question | null> {
    const dbQuestion = await prisma.question.findUnique({ where: { id } });
    if (!dbQuestion) return null;
    return new Question(
      dbQuestion.id,
      dbQuestion.title,
      dbQuestion.body,
      dbQuestion.difficulty as any,
      dbQuestion.topic,
      dbQuestion.correctAnswer,
      dbQuestion.explanation,
      dbQuestion.type as any,
      dbQuestion.options ? JSON.parse(dbQuestion.options) : [],
      dbQuestion.imageUrl || undefined,
      dbQuestion.hint || undefined,
      dbQuestion.source || undefined,
      dbQuestion.tags ? JSON.parse(dbQuestion.tags) : [],
      dbQuestion.createdAt,
      dbQuestion.updatedAt
    );
  }

  async findAll(): Promise<Question[]> {
    const dbQuestions = await prisma.question.findMany();
    return dbQuestions.map(
      (dbQuestion: DbQuestion) =>
        new Question(
          dbQuestion.id,
          dbQuestion.title,
          dbQuestion.body,
          dbQuestion.difficulty as any,
          dbQuestion.topic,
          dbQuestion.correctAnswer,
          dbQuestion.explanation,
          dbQuestion.type as any,
          dbQuestion.options ? JSON.parse(dbQuestion.options) : [],
          dbQuestion.imageUrl || undefined,
          dbQuestion.hint || undefined,
          dbQuestion.source || undefined,
          dbQuestion.tags ? JSON.parse(dbQuestion.tags) : [],
          dbQuestion.createdAt,
          dbQuestion.updatedAt
        )
    );
  }

  async findPaged(options: {
    page: number;
    limit: number;
    search?: string;
    topic?: string;
    difficulty?: string;
    source?: string;
  }): Promise<{ questions: Question[]; total: number }> {
    const skip = (options.page - 1) * options.limit;

    const where: any = {};
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { body: { contains: options.search } },
      ];
    }
    if (options.topic) {
      where.topic = options.topic;
    }
    if (options.difficulty) {
      where.difficulty = options.difficulty;
    }
    if (options.source) {
      where.source = { contains: options.source };
    }

    const [dbQuestions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: options.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.question.count({ where }),
    ]);

    const questions = dbQuestions.map(
      (dbQuestion: DbQuestion) =>
        new Question(
          dbQuestion.id,
          dbQuestion.title,
          dbQuestion.body,
          dbQuestion.difficulty as any,
          dbQuestion.topic,
          dbQuestion.correctAnswer,
          dbQuestion.explanation,
          dbQuestion.type as any,
          dbQuestion.options ? JSON.parse(dbQuestion.options) : [],
          dbQuestion.imageUrl || undefined,
          dbQuestion.hint || undefined,
          dbQuestion.source || undefined,
          dbQuestion.tags ? JSON.parse(dbQuestion.tags) : [],
          dbQuestion.createdAt,
          dbQuestion.updatedAt
        )
    );

    return { questions, total };
  }

  async create(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    const dbQuestion = await prisma.question.create({
      data: {
        title: question.title,
        body: question.body,
        type: question.type,
        options: JSON.stringify(question.options || []),
        imageUrl: question.imageUrl || undefined,
        difficulty: question.difficulty,
        topic: question.topic,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        hint: question.hint || undefined,
        source: question.source || undefined,
        tags: JSON.stringify(question.tags || []),
      },
    });
    return new Question(
      dbQuestion.id,
      dbQuestion.title,
      dbQuestion.body,
      dbQuestion.difficulty as any,
      dbQuestion.topic,
      dbQuestion.correctAnswer,
      dbQuestion.explanation,
      dbQuestion.type as any,
      dbQuestion.options ? JSON.parse(dbQuestion.options) : [],
      dbQuestion.imageUrl || undefined,
      dbQuestion.hint || undefined,
      dbQuestion.source || undefined,
      dbQuestion.tags ? JSON.parse(dbQuestion.tags) : [],
      dbQuestion.createdAt,
      dbQuestion.updatedAt
    );
  }

  async update(id: string, question: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Question> {
    const dbQuestion = await prisma.question.update({
      where: { id },
      data: {
        title: question.title,
        body: question.body,
        type: question.type,
        options: question.options ? JSON.stringify(question.options) : undefined,
        imageUrl: question.imageUrl,
        difficulty: question.difficulty,
        topic: question.topic,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        hint: question.hint,
        source: question.source,
        tags: question.tags ? JSON.stringify(question.tags) : undefined,
      },
    });
    return new Question(
      dbQuestion.id,
      dbQuestion.title,
      dbQuestion.body,
      dbQuestion.difficulty as any,
      dbQuestion.topic,
      dbQuestion.correctAnswer,
      dbQuestion.explanation,
      dbQuestion.type as any,
      dbQuestion.options ? JSON.parse(dbQuestion.options) : [],
      dbQuestion.imageUrl || undefined,
      dbQuestion.hint || undefined,
      dbQuestion.source || undefined,
      dbQuestion.tags ? JSON.parse(dbQuestion.tags) : [],
      dbQuestion.createdAt,
      dbQuestion.updatedAt
    );
  }

  async delete(id: string): Promise<boolean> {
    await prisma.question.delete({ where: { id } });
    return true;
  }

  async saveAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>): Promise<Attempt> {
    const dbAttempt = await prisma.attempt.create({
      data: {
        studentProfileId: attempt.studentProfileId,
        questionId: attempt.questionId,
        studentAnswer: attempt.studentAnswer,
        isCorrect: attempt.isCorrect,
        coachConversation: attempt.coachConversation || undefined,
      },
    });
    return new Attempt(
      dbAttempt.id,
      dbAttempt.studentProfileId,
      dbAttempt.questionId,
      dbAttempt.studentAnswer,
      dbAttempt.isCorrect,
      dbAttempt.coachConversation || undefined,
      dbAttempt.createdAt
    );
  }

  async findAttemptsByStudentId(studentId: string): Promise<Attempt[]> {
    const dbAttempts = await prisma.attempt.findMany({
      where: { studentProfileId: studentId },
      orderBy: { createdAt: 'asc' },
    });
    return dbAttempts.map(
      (dbAttempt: DbAttempt) =>
        new Attempt(
          dbAttempt.id,
          dbAttempt.studentProfileId,
          dbAttempt.questionId,
          dbAttempt.studentAnswer,
          dbAttempt.isCorrect,
          dbAttempt.coachConversation || undefined,
          dbAttempt.createdAt
        )
    );
  }
}
