// src/application/learning-intelligence/infrastructure/persistence/entities/SkillAnalyticsEntity.ts
export class SkillAnalyticsEntity {
  id!: string;
  skillName!: string;
  studentId!: string;
  mastery!: number;
  lastUpdated!: Date;
}
