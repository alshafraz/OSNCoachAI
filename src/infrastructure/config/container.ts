import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaQuestionRepository } from '../repositories/PrismaQuestionRepository';
import { OpenAiCoachService } from '../services/OpenAiCoachService';
import { SupabaseStorageService } from '../services/SupabaseStorageService';
import { OpenAiOcrService } from '../services/OpenAiOcrService';

import { SubmitAnswerUseCase } from '../../application/use-cases/SubmitAnswerUseCase';
import { GetStudentDashboardUseCase } from '../../application/use-cases/GetStudentDashboardUseCase';
import { GetParentDashboardUseCase } from '../../application/use-cases/GetParentDashboardUseCase';
import { UpdateProfileUseCase } from '../../application/use-cases/UpdateProfileUseCase';
import { CreateQuestionUseCase } from '../../application/use-cases/CreateQuestionUseCase';
import { UpdateQuestionUseCase } from '../../application/use-cases/UpdateQuestionUseCase';
import { DeleteQuestionUseCase } from '../../application/use-cases/DeleteQuestionUseCase';
import { GetQuestionsListUseCase } from '../../application/use-cases/GetQuestionsListUseCase';
import { ParsePdfWorksheetUseCase } from '../../application/use-cases/ParsePdfWorksheetUseCase';

// Instantiate Repositories
export const userRepository = new PrismaUserRepository();
export const questionRepository = new PrismaQuestionRepository();

// Instantiate Services
export const aiCoachService = new OpenAiCoachService();
export const storageService = new SupabaseStorageService();
export const ocrService = new OpenAiOcrService();

// Instantiate Use Cases with dependencies injected
export const submitAnswerUseCase = new SubmitAnswerUseCase(
  questionRepository,
  userRepository,
  aiCoachService
);

export const getStudentDashboardUseCase = new GetStudentDashboardUseCase(
  userRepository,
  questionRepository
);

export const getParentDashboardUseCase = new GetParentDashboardUseCase(
  userRepository
);

export const updateProfileUseCase = new UpdateProfileUseCase(
  userRepository
);

export const createQuestionUseCase = new CreateQuestionUseCase(
  questionRepository
);

export const updateQuestionUseCase = new UpdateQuestionUseCase(
  questionRepository
);

export const deleteQuestionUseCase = new DeleteQuestionUseCase(
  questionRepository
);

export const getQuestionsListUseCase = new GetQuestionsListUseCase(
  questionRepository
);

export const parsePdfWorksheetUseCase = new ParsePdfWorksheetUseCase(
  ocrService
);
