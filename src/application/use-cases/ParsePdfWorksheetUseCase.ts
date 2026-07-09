import { OcrService, ParsedQuestionCandidate } from '../../domain/services/OcrService';

export interface ParsePdfWorksheetInput {
  fileBuffer: Buffer;
  fileName: string;
}

export class ParsePdfWorksheetUseCase {
  constructor(private readonly ocrService: OcrService) {}

  async execute(input: ParsePdfWorksheetInput): Promise<ParsedQuestionCandidate[]> {
    if (!input.fileBuffer || input.fileBuffer.length === 0) {
      throw new Error('PDF file content is empty.');
    }

    let rawText = await this.ocrService.extractText(input.fileBuffer, 'application/pdf');

    let isScanned = false;
    if (!rawText || rawText.trim().length < 20) {
      isScanned = true;
      rawText = `[Scanned PDF: ${input.fileName} - Images containing math Olympiad questions]`;
    }

    const candidates = await this.ocrService.parseWorksheet(rawText);

    if (isScanned) {
      return candidates.map(c => ({
        ...c,
        confidenceScore: Math.round(c.confidenceScore * 0.7 * 100) / 100,
        uncertainFields: Array.from(new Set([...c.uncertainFields, 'correctAnswer', 'options', 'body']))
      }));
    }

    return candidates;
  }
}
