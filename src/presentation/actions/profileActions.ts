'use server';

import { updateProfileUseCase } from '../../infrastructure/config/container';
import { successResponse, errorResponse, ApiResponse } from '../../application/dtos/ApiResponse';
import { auth } from '@/auth';

export async function updateProfileAction(formData: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse('UNAUTHORIZED', 'You must be signed in to modify profile settings.');
    }

    const updatedUser = await updateProfileUseCase.execute({
      userId: session.user.id!,
      name: formData.name,
      email: formData.email,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    return successResponse({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error: any) {
    console.error('Error updating user profile action:', error);
    return errorResponse('PROFILE_UPDATE_FAILED', error.message || 'An error occurred.');
  }
}
