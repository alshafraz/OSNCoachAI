// src/application/operations/domain/models/BackupRecord.ts

export interface BackupRecord {
  id: string;
  backupName: string;
  sizeBytes: number;
  checksum: string; // MD5/SHA256 signature
  storagePath: string; // Object Storage URI
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
  isVerified: boolean;
}
