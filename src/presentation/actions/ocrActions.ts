'use server';

import { parsePdfWorksheetUseCase } from '../../infrastructure/config/container';
import { successResponse, errorResponse, ApiResponse } from '../../application/dtos/ApiResponse';
import { auth } from '@/auth';

export async function parsePdfWorksheetAction(formData: FormData): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'PARENT') {
      return errorResponse('UNAUTHORIZED', 'You must be logged in as parent admin to import files.');
    }

    const file = formData.get('file') as File;
    if (!file) {
      return errorResponse('BAD_REQUEST', 'No file was uploaded.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const candidates = await parsePdfWorksheetUseCase.execute({
      fileBuffer: buffer,
      fileName: file.name,
    });

    return successResponse(candidates);
  } catch (error: any) {
    console.error('OCR worksheet parsing action error:', error);
    return errorResponse('OCR_PARSE_FAILED', error.message || 'An error occurred during worksheet processing.');
  }
}
