import { UserRepository } from '../../domain/repositories/UserRepository';
import { QuestionRepository } from '../../domain/repositories/QuestionRepository';
import { StudentProfile } from '../../domain/entities/StudentProfile';
import { Attempt } from '../../domain/entities/Attempt';

export interface StudentDashboardResult {
  profile: StudentProfile;
  recentAttempts: Attempt[];
}

export class GetStudentDashboardUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute(userId: string): Promise<StudentDashboardResult> {
    const profile = await this.userRepository.findStudentProfileByUserId(userId);
    if (!profile) {
      throw new Error('Student profile not found');
    }

    const recentAttempts = await this.questionRepository.findAttemptsByStudentId(profile.id);

    return {
      profile,
      recentAttempts: recentAttempts.slice(-5),
    };
  }
}
