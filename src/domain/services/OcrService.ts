export interface ParsedQuestionCandidate {
  title: string;
  body: string;
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  source?: string;
  tags: string[];
  confidenceScore: number;
  uncertainFields: string[];
}

export interface OcrService {
  extractText(fileBuffer: Buffer, mimeType: string): Promise<string>;
  extractMathEquations(fileBuffer: Buffer, mimeType: string): Promise<string[]>;
  parseWorksheet(rawText: string): Promise<ParsedQuestionCandidate[]>;
}
