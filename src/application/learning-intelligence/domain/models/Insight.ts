// src/application/learning-intelligence/domain/models/Insight.ts
export interface Insight {
  id: string;
  studentId: string;
  type: string; // e.g., 'trend', 'retention', 'prediction'
  payload: Record<string, any>;
  timestamp: Date;
}
