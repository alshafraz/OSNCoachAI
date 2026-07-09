// src/application/adaptive-learning/infrastructure/persistence/entities/SimulationResultEntity.ts
export class SimulationResultEntity {
  id!: string;
  studentId!: string;
  simulatedAt!: Date;
  projections!: any[]; // serialized ReadinessProjection[]
  estimatedReadinessDate?: Date;
  atRiskTopics!: string[];
  onTrackTopics!: string[];
  estimatedCompetitionPercentile!: number;
}
