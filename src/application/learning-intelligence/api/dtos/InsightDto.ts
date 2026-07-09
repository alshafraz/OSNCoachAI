// src/application/learning-intelligence/api/dtos/InsightDto.ts
export interface InsightDto {
  id: string;
  studentId: string;
  type: string;
  payload: {
    message: string;
    severity: 'low' | 'medium' | 'high';
    conceptId?: string;
    metricValue?: number;
    [key: string]: any;
  };
  createdAt: string;
}
