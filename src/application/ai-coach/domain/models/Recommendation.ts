export interface Recommendation {
  id: string;
  action: string; // e.g., 'reviewTopic', 'practiceProblem', 'takeMockExam'
  priorityScore: number;
  evidenceIds: string[];
}
