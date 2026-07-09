// src/application/adaptive-learning/api/dtos/LearningSessionDto.ts
export interface LearningSessionDto {
  id: string;
  studentId: string;
  scheduledDate: string;
  estimatedDurationMinutes: number;
  paceRecommendation: string;
  phases: SessionPhaseDto[];
}

export interface SessionPhaseDto {
  type: string;
  label: string;
  durationMinutes: number;
  itemCount: number;
}
