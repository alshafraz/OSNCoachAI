// src/application/learning-intelligence/domain/models/TopicAnalytics.ts
export interface TopicAnalytics {
  id: string;
  topicId: string;
  studentId: string;
  accuracy: number;
  solveTime: number; // average solve time in seconds
  confidence: number;
  difficultyTrend: number; // slope of difficulty over time
  retention: number;
  mastery: number;
  learningVelocity: number;
  questionVolume: number;
  improvementTrend: number;
  weaknessScore: number;
  // explainable fields
  definition: Record<string, string>; // metric name → definition
  formula: Record<string, string>; // metric name → formula
  lastUpdated: Date;
}
