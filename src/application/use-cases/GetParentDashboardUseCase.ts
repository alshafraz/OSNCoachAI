import { UserRepository } from '../../domain/repositories/UserRepository';
import { StudentProfile } from '../../domain/entities/StudentProfile';

export interface ParentDashboardResult {
  students: StudentProfile[];
}

export class GetParentDashboardUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(parentId: string): Promise<ParentDashboardResult> {
    const students = await this.userRepository.findStudentsByParentId(parentId);
    return {
      students,
    };
  }
}
