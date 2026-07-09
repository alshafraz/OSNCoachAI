// src/application/learning-intelligence/api/dtos/MetricSnapshotDto.ts
export interface MetricSnapshotDto {
  id: string;
  studentId: string;
  metricName: string;
  value: number;
  definition: string;
  formula: string;
  dataSources: string[];
  version: string;
  confidence: number;
  computedAt: string; // ISO timestamp
}
