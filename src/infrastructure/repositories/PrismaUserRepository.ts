import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { StudentProfile } from '../../domain/entities/StudentProfile';
import { prisma } from '../db/prisma';
import { StudentProfile as DbStudentProfile } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const dbUser = await prisma.user.findUnique({ where: { id } });
    if (!dbUser) return null;
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.passwordHash,
      dbUser.role,
      dbUser.name || undefined,
      dbUser.createdAt,
      dbUser.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) return null;
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.passwordHash,
      dbUser.role,
      dbUser.name || undefined,
      dbUser.createdAt,
      dbUser.updatedAt
    );
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const dbUser = await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        name: user.name,
      },
    });
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.passwordHash,
      dbUser.role,
      dbUser.name || undefined,
      dbUser.createdAt,
      dbUser.updatedAt
    );
  }

  async createStudentProfile(profile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    const dbProfile = await prisma.studentProfile.create({
      data: {
        userId: profile.userId,
        parentId: profile.parentId,
        points: profile.points,
        level: profile.level,
        currentStreak: profile.currentStreak,
      },
    });
    return new StudentProfile(
      dbProfile.id,
      dbProfile.userId,
      dbProfile.points,
      dbProfile.level,
      dbProfile.currentStreak,
      dbProfile.parentId || undefined,
      dbProfile.createdAt,
      dbProfile.updatedAt
    );
  }

  async findStudentProfileByUserId(userId: string): Promise<StudentProfile | null> {
    const dbProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!dbProfile) return null;
    return new StudentProfile(
      dbProfile.id,
      dbProfile.userId,
      dbProfile.points,
      dbProfile.level,
      dbProfile.currentStreak,
      dbProfile.parentId || undefined,
      dbProfile.createdAt,
      dbProfile.updatedAt
    );
  }

  async findStudentProfileById(id: string): Promise<StudentProfile | null> {
    const dbProfile = await prisma.studentProfile.findUnique({ where: { id } });
    if (!dbProfile) return null;
    return new StudentProfile(
      dbProfile.id,
      dbProfile.userId,
      dbProfile.points,
      dbProfile.level,
      dbProfile.currentStreak,
      dbProfile.parentId || undefined,
      dbProfile.createdAt,
      dbProfile.updatedAt
    );
  }

  async updateStudentPointsAndStreak(profileId: string, points: number, currentStreak: number): Promise<StudentProfile> {
    const level = Math.floor(points / 100) + 1;
    const dbProfile = await prisma.studentProfile.update({
      where: { id: profileId },
      data: { points, currentStreak, level },
    });
    return new StudentProfile(
      dbProfile.id,
      dbProfile.userId,
      dbProfile.points,
      dbProfile.level,
      dbProfile.currentStreak,
      dbProfile.parentId || undefined,
      dbProfile.createdAt,
      dbProfile.updatedAt
    );
  }

  async findStudentsByParentId(parentId: string): Promise<StudentProfile[]> {
    const dbProfiles = await prisma.studentProfile.findMany({
      where: { parentId },
    });
    return dbProfiles.map(
      (dbProfile: DbStudentProfile) =>
        new StudentProfile(
          dbProfile.id,
          dbProfile.userId,
          dbProfile.points,
          dbProfile.level,
          dbProfile.currentStreak,
          dbProfile.parentId || undefined,
          dbProfile.createdAt,
          dbProfile.updatedAt
        )
    );
  }

  async updateUser(id: string, data: { name?: string; email?: string; passwordHash?: string }): Promise<User> {
    const dbUser = await prisma.user.update({
      where: { id },
      data,
    });
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.passwordHash,
      dbUser.role,
      dbUser.name || undefined,
      dbUser.createdAt,
      dbUser.updatedAt
    );
  }
}
