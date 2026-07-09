// src/application/learning-intelligence/api/dtos/EventDto.ts
export interface EventDto {
  id: string;
  studentId: string;
  eventType: string;
  payload: Record<string, any>;
  timestamp: string; // ISO string
}
