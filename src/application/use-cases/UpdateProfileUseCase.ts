import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import * as bcrypt from 'bcryptjs';

export interface UpdateProfileInput {
  userId: string;
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateProfileInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (input.currentPassword) {
      // In seed.js, we seeded plaintext passwords, but going forward we use bcrypt.
      // To support standard mock sandbox fallback and proper bcrypt, we handle both:
      let passwordMatches = false;
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
        passwordMatches = await bcrypt.compare(input.currentPassword, user.passwordHash);
      } else {
        // Plaintext comparison for legacy seed data (before re-seeding with bcrypt)
        passwordMatches = user.passwordHash === input.currentPassword;
      }

      if (!passwordMatches) {
        throw new Error('Incorrect current password');
      }
    } else {
      throw new Error('Current password is required to save changes');
    }

    const updateData: { name?: string; email?: string; passwordHash?: string } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.email !== undefined && input.email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new Error('Email address is already in use');
      }
      updateData.email = input.email;
    }

    if (input.newPassword) {
      if (input.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }
      updateData.passwordHash = await bcrypt.hash(input.newPassword, 10);
    }

    return this.userRepository.updateUser(user.id, updateData);
  }
}
