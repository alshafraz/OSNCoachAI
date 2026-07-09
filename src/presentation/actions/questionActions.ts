'use server';

import {
  submitAnswerUseCase,
  questionRepository,
  userRepository,
  createQuestionUseCase,
  updateQuestionUseCase,
  deleteQuestionUseCase,
  getQuestionsListUseCase,
  storageService
} from '../../infrastructure/config/container';
import { successResponse, errorResponse, ApiResponse } from '../../application/dtos/ApiResponse';
import { auth } from '@/auth';
import { QuestionDifficulty, QuestionType } from '../../domain/entities/Question';

export async function submitAnswerAction(
  questionId: string,
  answer: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse('UNAUTHORIZED', 'You must be signed in to submit answers.');
    }

    let profileId = "default-student-profile-id";
    try {
      const studentProfile = await userRepository.findStudentProfileByUserId(session.user.id!);
      if (studentProfile) {
        profileId = studentProfile.id;
      }
    } catch (e) {
      // Database not seeded or setup yet
    }

    if (questionId === 'mock-question-divisibility') {
      const isCorrect = answer.trim() === '6';
      let hint: string | undefined;
      if (!isCorrect) {
        hint = `Let's work together! If 2A3 + 326 = 5B9, look at the tens place: A + 2 = B. If 5B9 is divisible by 9, what does that tell us about the sum of its digits (5 + B + 9)? Can you find B first?`;
      }
      return successResponse({
        isCorrect,
        pointsEarned: isCorrect ? 10 : 0,
        newStreak: isCorrect ? 4 : 0,
        newLevel: 1,
        hint,
      });
    }

    const result = await submitAnswerUseCase.execute({
      studentProfileId: profileId,
      questionId,
      studentAnswer: answer,
    });

    return successResponse(result);
  } catch (error: any) {
    console.error('Error submitting answer action:', error);
    return errorResponse('INTERNAL_ERROR', error.message || 'An error occurred.');
  }
}

export async function getNextQuestionAction(): Promise<ApiResponse> {
  try {
    try {
      const questions = await questionRepository.findAll();
      if (questions.length > 0) {
        // Return a random question from list to practice
        const randomIndex = Math.floor(Math.random() * questions.length);
        return successResponse(questions[randomIndex]);
      }
    } catch (e) {
      // Database connection error or missing table
    }

    return successResponse({
      id: "mock-question-divisibility",
      title: "Divisibility Secrets",
      body: "A three-digit number 2A3 is added to 326, giving a three-digit number 5B9. If 5B9 is divisible by 9, what is the value of A + B?",
      difficulty: "MEDIUM",
      topic: "Number Theory",
      correctAnswer: "6",
      explanation: "Since 2A3 + 326 = 5B9, looking at the units: 3+6=9 (no carry). Looking at the hundreds: 2+3=5. Thus, A+2=B.\n\nAlso, 5B9 is divisible by 9, meaning the sum of its digits (5 + B + 9) must be a multiple of 9. So 14 + B is a multiple of 9. Since B is a single digit, B must be 4.\n\nSince A+2=B, A+2=4, which means A=2.\n\nTherefore, A + B = 2 + 4 = 6.",
      type: "SHORT_ANSWER",
      options: [],
      tags: ["divisibility", "digits"]
    });
  } catch (error: any) {
    console.error('Error fetching next question action:', error);
    return errorResponse('INTERNAL_ERROR', error.message || 'An error occurred.');
  }
}

export async function createQuestionAction(formData: {
  title: string;
  body: string;
  type: QuestionType;
  options: string[];
  imageUrl?: string;
  difficulty: QuestionDifficulty;
  topic: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  source?: string;
  tags: string[];
}): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'PARENT') {
      return errorResponse('UNAUTHORIZED', 'You must be logged in as parent admin to create questions.');
    }

    const question = await createQuestionUseCase.execute(formData);
    return successResponse(question);
  } catch (error: any) {
    console.error('Create question action error:', error);
    return errorResponse('CREATE_FAILED', error.message || 'Failed to create question.');
  }
}

export async function updateQuestionAction(
  id: string,
  formData: Partial<{
    title: string;
    body: string;
    type: QuestionType;
    options: string[];
    imageUrl?: string;
    difficulty: QuestionDifficulty;
    topic: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
    source?: string;
    tags: string[];
  }>
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'PARENT') {
      return errorResponse('UNAUTHORIZED', 'You must be logged in as parent admin to update questions.');
    }

    const question = await updateQuestionUseCase.execute({ id, data: formData });
    return successResponse(question);
  } catch (error: any) {
    console.error('Update question action error:', error);
    return errorResponse('UPDATE_FAILED', error.message || 'Failed to update question.');
  }
}

export async function deleteQuestionAction(id: string): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'PARENT') {
      return errorResponse('UNAUTHORIZED', 'You must be logged in as parent admin to delete questions.');
    }

    await deleteQuestionUseCase.execute(id);
    return successResponse({ deleted: true });
  } catch (error: any) {
    console.error('Delete question action error:', error);
    return errorResponse('DELETE_FAILED', error.message || 'Failed to delete question.');
  }
}

export async function getQuestionsListAction(filters: {
  page: number;
  limit: number;
  search?: string;
  topic?: string;
  difficulty?: string;
  source?: string;
}): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse('UNAUTHORIZED', 'You must be signed in.');
    }

    const result = await getQuestionsListUseCase.execute(filters);
    return successResponse(result);
  } catch (error: any) {
    console.error('Get questions list action error:', error);
    return errorResponse('GET_LIST_FAILED', error.message || 'Failed to fetch question bank.');
  }
}

export async function uploadImageAction(formData: FormData): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'PARENT') {
      return errorResponse('UNAUTHORIZED', 'You must be signed in as a parent admin to upload files.');
    }

    const file = formData.get('image') as File;
    if (!file) {
      return errorResponse('BAD_REQUEST', 'No file was uploaded.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop() || 'png';
    const filePath = `questions/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

    const imageUrl = await storageService.uploadFile('images', filePath, buffer, file.type);
    return successResponse({ imageUrl });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    return errorResponse('UPLOAD_FAILED', error.message || 'Image upload failed.');
  }
}
