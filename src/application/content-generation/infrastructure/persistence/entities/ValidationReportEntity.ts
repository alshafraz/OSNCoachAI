// src/application/content-generation/infrastructure/persistence/entities/ValidationReportEntity.ts
export class ValidationReportEntity {
  id!: string;
  contentId!: string;
  passed!: boolean;
  qualityScore!: number;
  qualityGrade!: string;
  issues!: any[];
  suggestions!: string[];
  difficultyLevel?: string;
  primaryConceptId?: string;
  skillIds?: string[];
  validatedAt!: Date;
}
