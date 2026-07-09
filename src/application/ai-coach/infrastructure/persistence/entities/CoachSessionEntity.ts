// src/application/ai-coach/infrastructure/persistence/entities/CoachSessionEntity.ts
export class CoachSessionEntity {
  id!: string;
  studentId!: string;
  startedAt!: Date;
  lastActivityAt!: Date;
  status!: string;
}
