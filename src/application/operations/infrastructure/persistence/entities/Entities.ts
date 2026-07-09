// src/application/operations/infrastructure/persistence/entities/Entities.ts

export class DeploymentLogEntity {
  id!: string;
  version!: string;
  commitHash!: string;
  environment!: string;
  deployedBy!: string;
  status!: string;
  deployedAt!: Date;
  completedAt?: Date;
  releaseNotes?: string;
}

export class BackupRecordEntity {
  id!: string;
  backupName!: string;
  sizeBytes!: number;
  checksum!: string;
  storagePath!: string;
  status!: string;
  errorMessage?: string;
  createdAt!: Date;
  completedAt?: Date;
  isVerified!: boolean;
}

export class SystemEventEntity {
  id!: string;
  eventType!: string;
  severity!: string;
  actor!: string;
  description!: string;
  metadata?: any;
  ipAddress?: string;
  timestamp!: Date;
}
