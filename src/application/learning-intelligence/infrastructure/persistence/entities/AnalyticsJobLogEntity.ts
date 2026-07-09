// src/application/learning-intelligence/infrastructure/persistence/entities/AnalyticsJobLogEntity.ts
export class AnalyticsJobLogEntity {
  id!: string;
  startTime!: Date;
  endTime!: Date;
  processedEvents!: number;
  status!: string;
  errorMessage?: string;
}
