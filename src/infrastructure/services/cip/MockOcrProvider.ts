/**
 * CIP Stage 2 — OCR Provider (Mock Implementation)
 *
 * Provider-agnostic OCR abstraction.
 * Drop in Google Vision or AWS Textract by implementing OcrExtractionService.
 * Never tightly couple the pipeline to a specific OCR vendor.
 */

import type { OcrResult, OcrPageResult } from '@/domain/entities/cip/ContentEntities';
import type { OcrExtractionService } from '@/domain/services/cip/CipServices';

export class MockOcrProvider implements OcrExtractionService {
  readonly providerName = 'MockOCR-v1';

  async extract(input: {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
  }): Promise<OcrResult> {
    const start = Date.now();

    // Simulate latency
    await new Promise((r) => setTimeout(r, 50));

    const isScanned = input.fileName.toLowerCase().includes('scan')
      || input.fileName.toLowerCase().includes('photo');

    const baseConfidence = isScanned ? 0.72 : 0.95;

    // For testing, use the buffer content as text if it's readable
    const rawText = input.buffer.toString('utf-8', 0, Math.min(input.buffer.length, 4096));
    const hasReadableText = /[a-zA-Z0-9]{3,}/.test(rawText);

    const sampleText = hasReadableText && rawText.trim().length > 20
      ? rawText
      : this._generateSampleMathContent();

    const pages: OcrPageResult[] = [
      {
        pageNumber: 1,
        rawText: sampleText,
        confidence: baseConfidence,
        detectedEquations: this._detectEquations(sampleText),
        detectedTables: [],
        imageCount: isScanned ? 1 : 0,
      },
    ];

    return {
      pages,
      fullText: pages.map((p) => p.rawText).join('\n\n'),
      overallConfidence: baseConfidence,
      provider: this.providerName,
      latencyMs: Date.now() - start,
    };
  }

  private _detectEquations(text: string): string[] {
    const equationPatterns = [
      /\d+\s*[+\-×÷\/]\s*\d+/g,
      /[a-z]\s*=\s*[\d+\-]/g,
      /\d+\/\d+/g,
      /\d+\^\d+/g,
    ];
    const found = new Set<string>();
    for (const pattern of equationPatterns) {
      const matches = text.match(pattern) ?? [];
      for (const m of matches) found.add(m.trim());
    }
    return [...found];
  }

  private _generateSampleMathContent(): string {
    return `
1. Berapa banyak faktor dari 360?
   A. 24
   B. 18
   C. 16
   D. 12
   Jawaban: A
   Penjelasan: 360 = 2^3 × 3^2 × 5, sehingga jumlah faktor = (3+1)(2+1)(1+1) = 24.

2. Tentukan KPK dari 12 dan 18.
   A. 6
   B. 36
   C. 72
   D. 216
   Jawaban: B
   Penjelasan: 12 = 2^2 × 3 dan 18 = 2 × 3^2. KPK = 2^2 × 3^2 = 36.

3. Jika a/b = 3/4 dan b = 20, berapakah nilai a?
   Jawaban: 15
   Penjelasan: a = (3/4) × 20 = 15.
`;
  }
}
