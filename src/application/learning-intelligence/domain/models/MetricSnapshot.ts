// src/application/learning-intelligence/domain/models/MetricSnapshot.ts
export interface MetricSnapshot {
  id: string;
  studentId: string;
  metricName: string; // e.g., 'accuracy', 'averageSolveTime'
  value: number;
  definition: string; // human‑readable description
  formula: string; // LaTeX or plain text
  dataSources: string[]; // list of event types used
  version: string; // metricVersion from config
  confidence: number; // 0‑1 confidence score
  timestamp: Date; // when computed
}
