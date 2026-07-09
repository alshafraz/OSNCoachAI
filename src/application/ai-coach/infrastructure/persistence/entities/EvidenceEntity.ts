// src/application/ai-coach/infrastructure/persistence/entities/EvidenceEntity.ts
import { CoachSessionEntity } from './CoachSessionEntity';

export class EvidenceEntity {
  id!: string;
  session!: CoachSessionEntity;
  type!: string;
  value!: number;
  source!: string;
  timestamp!: Date;
}
