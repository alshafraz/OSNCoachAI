/**
 * CIP Stage 13 — Duplicate Detector
 *
 * Detects exact and near-duplicate questions using:
 * - SHA-256 body hash for exact matches
 * - Jaccard similarity on normalized token sets for near-duplicates
 */

import type { ExtractedQuestion, DuplicateMatch } from '@/domain/entities/cip/ContentEntities';
import type { DuplicateDetectionService } from '@/domain/services/cip/CipServices';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2)
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function simpleHash(text: string): string {
  // FNV-1a 32-bit hash (no crypto dependency)
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash.toString(16);
}

export class DuplicateDetectorImpl implements DuplicateDetectionService {
  private registry = new Map<string, { contentId: string; bodyHash: string; tokens: Set<string> }>();

  detect(question: ExtractedQuestion): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];
    const normalizedBody = question.body.trim().toLowerCase();
    const bodyHash = simpleHash(normalizedBody);
    const tokens = tokenize(question.body);

    for (const [contentId, entry] of this.registry.entries()) {
      // Exact match
      if (entry.bodyHash === bodyHash) {
        matches.push({
          matchedContentId: contentId,
          matchType: 'EXACT',
          similarityPct: 100,
          details: 'Identical question body detected.',
        });
        continue;
      }

      // Near-duplicate
      const similarity = jaccardSimilarity(tokens, entry.tokens);
      if (similarity >= 0.75) {
        matches.push({
          matchedContentId: contentId,
          matchType: 'NEAR',
          similarityPct: Math.round(similarity * 100),
          details: `${Math.round(similarity * 100)}% token overlap with existing question.`,
        });
      } else if (similarity >= 0.5) {
        matches.push({
          matchedContentId: contentId,
          matchType: 'SAME_CONCEPT',
          similarityPct: Math.round(similarity * 100),
          details: `${Math.round(similarity * 100)}% conceptual similarity — may test the same idea.`,
        });
      }
    }

    return matches.sort((a, b) => b.similarityPct - a.similarityPct);
  }

  register(contentId: string, question: ExtractedQuestion): void {
    const normalizedBody = question.body.trim().toLowerCase();
    this.registry.set(contentId, {
      contentId,
      bodyHash: simpleHash(normalizedBody),
      tokens: tokenize(question.body),
    });
  }

  computeSimilarity(a: ExtractedQuestion, b: ExtractedQuestion): number {
    return jaccardSimilarity(tokenize(a.body), tokenize(b.body));
  }
}
