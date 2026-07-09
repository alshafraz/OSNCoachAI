import { Achievement } from '../entities/Achievement';

export interface AchievementRepository {
  findByStudentProfileId(profileId: string): Promise<Achievement[]>;
  unlockAchievement(profileId: string, achievementId: string): Promise<Achievement>;
}
