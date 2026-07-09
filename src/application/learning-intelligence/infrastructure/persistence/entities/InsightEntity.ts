// src/application/learning-intelligence/infrastructure/persistence/entities/InsightEntity.ts
export class InsightEntity {
  id!: string;
  studentId!: string;
  type!: string; // 'trend' | 'retention' | 'prediction'
  payload!: Record<string, any>;
  createdAt!: Date;
}
