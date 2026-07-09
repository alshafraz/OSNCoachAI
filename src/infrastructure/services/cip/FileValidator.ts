/**
 * CIP Stage 1 — File Validator
 * Validates uploaded files for format, size, encryption, and corruption.
 */

import type { FileValidationResult } from '@/domain/entities/cip/ContentEntities';
import type { FileValidationService } from '@/domain/services/cip/CipServices';

const SUPPORTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/csv', 'application/json', 'text/plain'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_PAGES = 200;

export class FileValidatorImpl implements FileValidationService {
  readonly supportedFormats = SUPPORTED_FORMATS;
  readonly maxFileSizeBytes = MAX_FILE_SIZE;

  validate(input: {
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
    buffer?: Buffer;
  }): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Format check
    const formatSupported = SUPPORTED_FORMATS.includes(input.mimeType);
    if (!formatSupported) {
      errors.push(`Unsupported file format: ${input.mimeType}. Supported: ${SUPPORTED_FORMATS.join(', ')}`);
    }

    // Size check
    if (input.fileSizeBytes > MAX_FILE_SIZE) {
      errors.push(`File size ${(input.fileSizeBytes / 1024 / 1024).toFixed(1)} MB exceeds limit of 50 MB.`);
    }
    if (input.fileSizeBytes === 0) {
      errors.push('File is empty.');
    }
    if (input.fileSizeBytes < 1024) {
      warnings.push('File is very small — may contain insufficient content.');
    }

    // PDF-specific checks using buffer signature
    let isEncrypted = false;
    let isPasswordProtected = false;
    let isCorrupted = false;
    let pageCount: number | undefined;
    let resolution: number | undefined;

    if (input.mimeType === 'application/pdf' && input.buffer) {
      // Check PDF magic bytes
      const header = input.buffer.slice(0, 8).toString('ascii');
      if (!header.startsWith('%PDF')) {
        isCorrupted = true;
        errors.push('PDF file appears to be corrupted — missing PDF header signature.');
      }

      // Heuristic: check for /Encrypt tag in PDF content
      const content = input.buffer.toString('ascii', 0, Math.min(input.buffer.length, 4096));
      if (content.includes('/Encrypt')) {
        isEncrypted = true;
        isPasswordProtected = true;
        errors.push('PDF is encrypted or password protected. Please remove password protection before uploading.');
      }

      // Estimate page count via /Page references
      const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
      pageCount = pageMatches ? pageMatches.length : undefined;

      if (pageCount !== undefined && pageCount > MAX_PAGES) {
        errors.push(`PDF has ${pageCount} pages, exceeding limit of ${MAX_PAGES}.`);
      }
      if (pageCount !== undefined && pageCount === 0) {
        errors.push('PDF has no readable pages.');
      }
    }

    // Image resolution heuristic
    if ((input.mimeType === 'image/jpeg' || input.mimeType === 'image/png') && input.buffer) {
      resolution = 150; // Placeholder — real implementation reads EXIF/PNG headers
      if (resolution < 72) {
        warnings.push('Image resolution is very low — OCR accuracy may be reduced.');
      }
    }

    // Language detection placeholder
    const detectedLanguage = 'id'; // Indonesian (OSN context default)

    const isValid = errors.length === 0;

    return {
      isValid,
      format: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      pageCount,
      isEncrypted,
      isPasswordProtected,
      isCorrupted,
      detectedLanguage,
      resolution,
      errors,
      warnings,
    };
  }
}
