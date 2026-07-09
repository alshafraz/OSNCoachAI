/**
 * CIP Stages 3 & 4 — Question Parser & Math Normalizer
 *
 * Segments raw OCR text into structured question objects.
 * Normalizes mathematical notation to standard representations.
 */

import type {
  ExtractedQuestion,
  SegmentedSection,
  MathExpression,
  QuestionFormat,
  DiagramAsset,
} from '@/domain/entities/cip/ContentEntities';
import type { QuestionParserService, MathNormalizerService } from '@/domain/services/cip/CipServices';

// Internal type for building a question during parsing
interface QuestionDraft {
  bodyLines: string[];
  choiceLines: string[];
  sections: SegmentedSection[];
  mathExpressions: MathExpression[];
  diagrams: DiagramAsset[];
  formulaIds: string[];
  rawText: string;
  sequenceNumber?: number;
  correctAnswer?: string;
  explanation?: string;
  hint?: string;
}

// ─── MATH NORMALIZER ─────────────────────────────────────────────────────────

const MATH_NORMALIZATIONS: { pattern: RegExp; type: MathExpression['type']; normalize: (m: string) => string }[] = [
  { pattern: /(\d+)\s*\/\s*(\d+)/g, type: 'FRACTION', normalize: (m) => m.replace(/\s/g, '') },
  { pattern: /(\d+)\s*\^\s*(\d+)/g, type: 'POWER', normalize: (m) => m.replace(/\s/g, '') },
  { pattern: /√(\d+)/g, type: 'ROOT', normalize: (m) => m },
  { pattern: /(\d+)\s*:\s*(\d+)/g, type: 'RATIO', normalize: (m) => m.replace(/\s/g, '') },
  { pattern: /(\d+(?:\.\d+)?)\s*%/g, type: 'PERCENT', normalize: (m) => m.replace(/\s/g, '') },
  { pattern: /[αβγδεπθλμ]/g, type: 'GREEK', normalize: (m) => m },
  { pattern: /∠[A-Z]{1,3}/g, type: 'GEOMETRY', normalize: (m) => m },
  { pattern: /(\d+)\s*(cm|m|km|kg|g|L|ml|s|°)/g, type: 'UNIT', normalize: (m) => m.replace(/\s+(?=[a-z°])/gi, ' ') },
];

export class MathNormalizerImpl implements MathNormalizerService {
  normalize(text: string): string {
    let normalized = text;
    // Normalize common substitutions
    normalized = normalized.replace(/×/g, '×').replace(/÷/g, '÷');
    normalized = normalized.replace(/\s*\^\s*/g, '^');
    normalized = normalized.replace(/\s*\/\s*/g, '/');
    normalized = normalized.replace(/(\d)\s*:\s*(\d)/g, '$1:$2');
    // Remove excessive whitespace
    normalized = normalized.replace(/\s{2,}/g, ' ').trim();
    return normalized;
  }

  extractExpressions(text: string): MathExpression[] {
    const found: MathExpression[] = [];
    const seen = new Set<string>();

    for (const rule of MATH_NORMALIZATIONS) {
      const matches = [...text.matchAll(rule.pattern)];
      for (const match of matches) {
        const raw = match[0];
        if (seen.has(raw)) continue;
        seen.add(raw);
        found.push({
          raw,
          normalized: rule.normalize(raw),
          type: rule.type,
          confidence: 0.9,
        });
      }
    }
    return found;
  }
}

// ─── QUESTION PARSER ─────────────────────────────────────────────────────────

export class QuestionParserImpl implements QuestionParserService {
  private normalizer = new MathNormalizerImpl();

  parse(rawText: string): ExtractedQuestion[] {
    const segments = this.segment(rawText);
    const questions: ExtractedQuestion[] = [];

    let current: QuestionDraft = this._newQuestion();

    for (const seg of segments) {
      switch (seg.type) {
        case 'QUESTION_NUMBER':
          if (current.bodyLines!.length > 0 || current.choiceLines!.length > 0) {
            questions.push(this._buildQuestion(current));
            current = this._newQuestion();
          }
          current.sequenceNumber = parseInt(seg.content, 10);
          current.sections!.push(seg);
          break;

        case 'BODY':
          current.bodyLines!.push(seg.content);
          current.sections!.push(seg);
          break;

        case 'CHOICE':
          current.choiceLines!.push(seg.content);
          current.sections!.push(seg);
          break;

        case 'ANSWER':
          current.correctAnswer = seg.content.replace(/^(jawaban|answer)\s*:\s*/i, '').trim();
          current.sections!.push(seg);
          break;

        case 'EXPLANATION':
          current.explanation = seg.content.replace(/^(penjelasan|explanation)\s*:\s*/i, '').trim();
          current.sections!.push(seg);
          break;

        case 'HINT':
          current.hint = seg.content;
          current.sections!.push(seg);
          break;
      }
    }

    if (current.bodyLines!.length > 0) {
      questions.push(this._buildQuestion(current));
    }

    return questions;
  }

  segment(rawText: string): SegmentedSection[] {
    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const sections: SegmentedSection[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Question number: starts with "1." or "1)" or "Soal 1"
      if (/^(\d+)[.)]\s+.{5,}/.test(line) || /^Soal\s+\d+/i.test(line)) {
        const numMatch = line.match(/^(\d+)[.)]\s+/);
        if (numMatch) {
          sections.push({ type: 'QUESTION_NUMBER', content: numMatch[1], confidence: 0.95, lineStart: i });
          sections.push({ type: 'BODY', content: line.slice(numMatch[0].length), confidence: 0.9, lineStart: i });
        } else {
          sections.push({ type: 'QUESTION_NUMBER', content: line.match(/\d+/)?.[0] ?? '0', confidence: 0.85, lineStart: i });
        }
        continue;
      }

      // Multiple choice options: A. B. C. D. or a) b) c) d)
      if (/^[A-Da-d][.)]\s+.{2,}/.test(line)) {
        sections.push({ type: 'CHOICE', content: line, confidence: 0.9, lineStart: i });
        continue;
      }

      // Answer line
      if (/^(jawaban|answer|kunci)\s*:/i.test(line)) {
        sections.push({ type: 'ANSWER', content: line, confidence: 0.95, lineStart: i });
        continue;
      }

      // Explanation line
      if (/^(penjelasan|pembahasan|explanation|solution)\s*:/i.test(line)) {
        sections.push({ type: 'EXPLANATION', content: line, confidence: 0.9, lineStart: i });
        continue;
      }

      // Hint line
      if (/^(petunjuk|hint|clue)\s*:/i.test(line)) {
        sections.push({ type: 'HINT', content: line, confidence: 0.85, lineStart: i });
        continue;
      }

      // Continuation of body
      if (sections.length > 0) {
        const last = sections[sections.length - 1];
        if (last.type === 'BODY' || last.type === 'EXPLANATION') {
          sections.push({ type: last.type, content: line, confidence: 0.8, lineStart: i });
        } else {
          sections.push({ type: 'BODY', content: line, confidence: 0.75, lineStart: i });
        }
      }
    }

    return sections;
  }

  private _newQuestion(): QuestionDraft {
    return {
      bodyLines: [],
      choiceLines: [],
      sections: [],
      mathExpressions: [],
      diagrams: [],
      formulaIds: [],
      rawText: '',
    };
  }

  private _buildQuestion(current: QuestionDraft): ExtractedQuestion {
    const body = current.bodyLines.join(' ').trim();
    const rawText = current.sections.map((s) => s.content).join('\n');
    const normalizedBody = this.normalizer.normalize(body);
    const mathExpressions = this.normalizer.extractExpressions(rawText);

    // Detect format
    const hasChoices = current.choiceLines.length >= 2;
    const format: QuestionFormat = hasChoices ? 'MULTIPLE_CHOICE' : 'SHORT_ANSWER';

    return {
      sequenceNumber: current.sequenceNumber,
      body: normalizedBody,
      choices: current.choiceLines,
      correctAnswer: current.correctAnswer,
      explanation: current.explanation,
      hint: current.hint,
      format,
      mathExpressions,
      diagrams: [],
      formulaIds: [],
      sections: current.sections,
      rawText,
    };
  }
}
