// src/application/content-generation/domain/models/ValidationReport.ts

export interface ValidationReport {
  id: string;
  contentId: string;
  
  passed: boolean;
  qualityScore: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  
  issues: ValidationIssue[];
  suggestions: string[];
  
  /** Metadata from CIP evaluation */
  difficultyLevel?: string;
  primaryConceptId?: string;
  skillIds?: string[];
  
  validatedAt: Date;
}

export interface ValidationIssue {
  field: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
}
