export interface Evidence {
  id: string;
  sessionId: string;
  type: string; // e.g., 'topicAccuracy', 'hintDependency', 'retentionScore'
  value: number;
  source: string; // which engine produced it
  timestamp: Date;
}
