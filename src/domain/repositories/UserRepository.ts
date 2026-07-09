import { User } from '../entities/User.ts';
import { StudentProfile } from '../entities/StudentProfile.ts';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  createStudentProfile(profile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile>;
  findStudentProfileByUserId(userId: string): Promise<StudentProfile | null>;
  findStudentProfileById(id: string): Promise<StudentProfile | null>;
  updateStudentPointsAndStreak(profileId: string, points: number, currentStreak: number): Promise<StudentProfile>;
  findStudentsByParentId(parentId: string): Promise<StudentProfile[]>;
  updateUser(id: string, data: { name?: string; email?: string; passwordHash?: string }): Promise<User>;
}
