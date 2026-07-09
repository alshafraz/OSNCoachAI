// src/application/learning-intelligence/infrastructure/persistence/entities/ConceptAnalyticsEntity.ts
export class ConceptAnalyticsEntity {
  id!: string;
  conceptId!: string;
  studentId!: string;
  mastery!: number;
  dependencyCoverage!: number;
  misconceptionFrequency!: number;
  retention!: number;
  questionExposure!: number;
  historicalProgress!: number;
  lastUpdated!: Date;
}
