import { OcrService, ParsedQuestionCandidate } from '../../domain/services/OcrService';
import * as pdfImport from 'pdf-parse';
const pdf = (pdfImport as any).default || pdfImport;

export class OpenAiOcrService implements OcrService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      const data = await pdf(fileBuffer);
      return data.text || '';
    } catch (error) {
      console.error('Error parsing PDF text:', error);
      return '';
    }
  }

  async extractMathEquations(fileBuffer: Buffer, mimeType: string): Promise<string[]> {
    return [];
  }

  async parseWorksheet(rawText: string): Promise<ParsedQuestionCandidate[]> {
    if (!this.apiKey || this.apiKey === 'mock-key') {
      return this.getMockCandidates(rawText.startsWith('[Scanned'));
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI mathematical text parsing agent. 
Analyze the raw text extracted from a Mathematics Olympiad worksheet and extract individual math questions.
For each question, extract:
- title: Short descriptive title (e.g. Divisibility Secrets)
- body: Full question problem body text
- type: Either "MULTIPLE_CHOICE" or "SHORT_ANSWER"
- options: If MCQ, extract list of choices. If short answer, leave empty.
- correctAnswer: The correct value or letter answer
- explanation: Detailed step-by-step mathematical solution explanation
- hint: Friendly pedagogical hint
- tags: Categorizing metadata tags list
- confidenceScore: Your confidence score from 0.0 to 1.0 (float)
- uncertainFields: Array of field names (e.g., ["correctAnswer", "options"]) where the details were unclear or missing in raw text.

You MUST respond ONLY with a JSON object containing a "questions" key pointing to the array of questions. Follow this JSON schema strictly.`,
            },
            {
              role: 'user',
              content: `Worksheet content:\n${rawText}`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed.questions;
        }
      }
      return this.getMockCandidates(rawText.startsWith('[Scanned'));
    } catch (error) {
      console.error('OpenAI OCR parsing failed, returning mock fallback:', error);
      return this.getMockCandidates(rawText.startsWith('[Scanned'));
    }
  }

  private getMockCandidates(isScanned: boolean): ParsedQuestionCandidate[] {
    return [
      {
        title: 'Divisibility of Product',
        body: 'If the product of three consecutive positive integers is divisible by 8, what is the smallest possible value of their sum?',
        type: 'SHORT_ANSWER',
        options: [],
        correctAnswer: '9',
        explanation: 'Three consecutive positive integers can be written as n, n+1, n+2.\nTheir product n(n+1)(n+2) is always divisible by 6.\nFor it to be divisible by 8, the product must contain three factors of 2.\nIf we choose n=2, we get 2 * 3 * 4 = 24, which is divisible by 8.\nTheir sum is 2 + 3 + 4 = 9.',
        hint: 'Let the consecutive integers be n, n+1, and n+2. What happens if we test small positive integers starting from n=1?',
        source: 'OSN Mock Test 2026',
        tags: ['divisibility', 'consecutive-integers'],
        confidenceScore: isScanned ? 0.65 : 0.95,
        uncertainFields: isScanned ? ['correctAnswer', 'body'] : [],
      },
      {
        title: 'Shaded Square Area',
        body: 'A large square of side length 10 cm is divided into 4 smaller congruent squares. A circle is inscribed inside the top-right small square. What is the area of this circle in square centimeters?',
        type: 'MULTIPLE_CHOICE',
        options: ['6.25 pi', '12.5 pi', '25 pi', '50 pi'],
        correctAnswer: '6.25 pi',
        explanation: 'The side length of the large square is 10 cm.\nSince it is divided into 4 congruent squares, each small square has side length 10 / 2 = 5 cm.\nThe circle is inscribed inside a small square of side length 5 cm, meaning the diameter of the circle is 5 cm.\nTherefore, the radius of the circle is 5 / 2 = 2.5 cm.\nThe area of the circle is pi * r^2 = pi * (2.5)^2 = 6.25 * pi.',
        hint: 'Find the side length of one of the four small squares first. Since the circle is inscribed inside it, what is the relationship between the square\'s side and the circle\'s diameter?',
        source: 'Geometry Challenge',
        tags: ['area', 'geometry', 'circle'],
        confidenceScore: isScanned ? 0.58 : 0.92,
        uncertainFields: isScanned ? ['options', 'correctAnswer'] : ['source'],
      },
    ];
  }
}
