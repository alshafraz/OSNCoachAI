import { StudentStats } from '../entities/StudentStats';

export interface StudentStatsRepository {
  getStatsByStudentProfileId(profileId: string): Promise<StudentStats>;
}
