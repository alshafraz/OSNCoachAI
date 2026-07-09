/**
 * Mathematical Intelligence Layer — Hint Engine
 *
 * Progressive 5-level Socratic hint system.
 * Never reveals the answer too early.
 * Every hint template is concept-linked and never hardcoded in AI prompts.
 */

import type { HintTemplate, HintLevel } from '@/domain/entities/math/MathEntities';
import type { HintService } from '@/domain/services/math/MathServices';

export const HINT_TEMPLATES: HintTemplate[] = [
  // ── PRIMES ──────────────────────────────────────────────────────────────────
  {
    id: 'primes-hint-1', conceptId: 'primes', level: 1,
    levelName: 'General Direction',
    template: 'Think about what makes a number "special" — can it only be divided by 1 and itself?',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'primes-hint-2', conceptId: 'primes', level: 2,
    levelName: 'Concept Reminder',
    template: 'Remember: a prime number has exactly two factors — 1 and the number itself. What are the factors of {{number}}?',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'primes-hint-3', conceptId: 'primes', level: 3,
    levelName: 'Relevant Technique',
    template: 'Try dividing {{number}} by 2, 3, 5, 7... If none divide it evenly, it\'s prime! (You only need to check up to √{{number}})',
    revealAmount: 'FORMULA',
  },
  {
    id: 'primes-hint-4', conceptId: 'primes', level: 4,
    levelName: 'Partial Solution',
    template: 'I\'ve started for you: {{number}} ÷ 2 = {{div2}}... does that divide evenly? Try the next prime if not.',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'primes-hint-5', conceptId: 'primes', level: 5,
    levelName: 'Near Complete',
    template: 'You\'ve checked all primes up to √{{number}}. Since none divide evenly, {{number}} IS prime! Now can you explain why?',
    revealAmount: 'NEAR_COMPLETE',
  },
  // ── GCD ────────────────────────────────────────────────────────────────────
  {
    id: 'gcd-hint-1', conceptId: 'gcd', level: 1,
    levelName: 'General Direction',
    template: 'The "Greatest Common Divisor" means: what\'s the biggest number that fits into BOTH numbers perfectly?',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'gcd-hint-2', conceptId: 'gcd', level: 2,
    levelName: 'Concept Reminder',
    template: 'One way to find GCD is to list all factors of each number, then find the biggest one they share.',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'gcd-hint-3', conceptId: 'gcd', level: 3,
    levelName: 'Strategy Hint',
    template: 'A faster way: find the prime factorization of both numbers, then multiply together only the prime factors they BOTH have (using the smaller exponent).',
    revealAmount: 'FORMULA',
  },
  {
    id: 'gcd-hint-4', conceptId: 'gcd', level: 4,
    levelName: 'Partial Solution',
    template: '{{number1}} = {{fact1}} and {{number2}} = {{fact2}}. Look at which prime factors appear in BOTH lists.',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'gcd-hint-5', conceptId: 'gcd', level: 5,
    levelName: 'Near Complete',
    template: 'The common factors are {{commonFactors}}. Multiply them: that\'s your GCD! Try to verify by checking both numbers are divisible by your answer.',
    revealAmount: 'NEAR_COMPLETE',
  },
  // ── LCM ────────────────────────────────────────────────────────────────────
  {
    id: 'lcm-hint-1', conceptId: 'lcm', level: 1,
    levelName: 'General Direction',
    template: 'The "Least Common Multiple" means: what\'s the smallest number that BOTH numbers can divide into?',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'lcm-hint-2', conceptId: 'lcm', level: 2,
    levelName: 'Concept Reminder',
    template: 'Think of it like synchronized events — if two things happen every A and B steps, when do they happen together?',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'lcm-hint-3', conceptId: 'lcm', level: 3,
    levelName: 'Formula Reminder',
    template: 'Using prime factorization: find all prime factors of BOTH numbers. For each prime, take the LARGEST power it appears in either number.',
    revealAmount: 'FORMULA',
  },
  {
    id: 'lcm-hint-4', conceptId: 'lcm', level: 4,
    levelName: 'Partial Solution',
    template: '{{number1}} = {{fact1}} and {{number2}} = {{fact2}}. Now take the highest power of each prime: {{highPowers}}...',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'lcm-hint-5', conceptId: 'lcm', level: 5,
    levelName: 'Near Complete',
    template: 'Multiply the highest powers: {{highPowers}} = ? That\'s your LCM! Check: does your answer divide by BOTH original numbers?',
    revealAmount: 'NEAR_COMPLETE',
  },
  // ── FRACTIONS ──────────────────────────────────────────────────────────────
  {
    id: 'fractions-hint-1', conceptId: 'fractions', level: 1,
    levelName: 'General Direction',
    template: 'Remember fractions represent "parts of a whole". Before adding them, make sure the pieces are the same size!',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'fractions-hint-2', conceptId: 'fractions', level: 2,
    levelName: 'Concept Reminder',
    template: 'To add fractions, you need a common denominator — find the LCM of the denominators.',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'fractions-hint-3', conceptId: 'fractions', level: 3,
    levelName: 'Formula',
    template: 'a/b + c/d = (a×d + c×b) / (b×d). You can then simplify using the GCD of the result.',
    revealAmount: 'FORMULA',
  },
  {
    id: 'fractions-hint-4', conceptId: 'fractions', level: 4,
    levelName: 'Partial Solution',
    template: 'Your denominators are {{den1}} and {{den2}}. LCM = {{lcm}}. Convert each fraction: {{frac1}} = {{converted1}}...',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'fractions-hint-5', conceptId: 'fractions', level: 5,
    levelName: 'Near Complete',
    template: 'After converting, you get {{converted1}} + {{converted2}} = {{sum}}. Can you simplify that fraction?',
    revealAmount: 'NEAR_COMPLETE',
  },
  // ── GEOMETRY / AREA ────────────────────────────────────────────────────────
  {
    id: 'area-hint-1', conceptId: 'area', level: 1,
    levelName: 'General Direction',
    template: 'Think about the shape you\'re working with. Can you identify what type it is?',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'area-hint-2', conceptId: 'area', level: 2,
    levelName: 'Concept Reminder',
    template: 'Different shapes have different area formulas. Triangle: ½ × base × height. Rectangle: length × width.',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'area-hint-3', conceptId: 'area', level: 3,
    levelName: 'Strategy',
    template: 'For complex shapes, try breaking them into simpler shapes you know formulas for. Can you decompose this figure?',
    revealAmount: 'FORMULA',
  },
  {
    id: 'area-hint-4', conceptId: 'area', level: 4,
    levelName: 'Partial Solution',
    template: 'I can see this shape can be split into a {{shape1}} and a {{shape2}}. Calculate each area separately.',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'area-hint-5', conceptId: 'area', level: 5,
    levelName: 'Near Complete',
    template: 'Area of {{shape1}} = {{area1}}, Area of {{shape2}} = {{area2}}. What do you do with these two values?',
    revealAmount: 'NEAR_COMPLETE',
  },
  // ── COMBINATORICS ──────────────────────────────────────────────────────────
  {
    id: 'combinatorics-hint-1', conceptId: 'combinatorics', level: 1,
    levelName: 'General Direction',
    template: 'Counting problems need a system! Does the order in which you choose things matter here?',
    revealAmount: 'DIRECTION',
  },
  {
    id: 'combinatorics-hint-2', conceptId: 'combinatorics', level: 2,
    levelName: 'Concept Reminder',
    template: 'If order MATTERS, use permutations. If order DOESN\'T matter, use combinations. Which applies here?',
    revealAmount: 'CONCEPT',
  },
  {
    id: 'combinatorics-hint-3', conceptId: 'combinatorics', level: 3,
    levelName: 'Formula',
    template: 'Multiplication Principle: if step 1 has A choices and step 2 has B choices, there are A × B total outcomes.',
    revealAmount: 'FORMULA',
  },
  {
    id: 'combinatorics-hint-4', conceptId: 'combinatorics', level: 4,
    levelName: 'Partial Solution',
    template: 'For the first position you have {{choices1}} choices. For the second, you have {{choices2}} choices...',
    revealAmount: 'PARTIAL',
  },
  {
    id: 'combinatorics-hint-5', conceptId: 'combinatorics', level: 5,
    levelName: 'Near Complete',
    template: 'Multiply your choices: {{choices1}} × {{choices2}} × ... = ? Does this match the number of possibilities you would list by hand?',
    revealAmount: 'NEAR_COMPLETE',
  },
];

const hintsByConceptAndLevel = new Map<string, HintTemplate>();
const hintsByConcept = new Map<string, HintTemplate[]>();

for (const h of HINT_TEMPLATES) {
  hintsByConceptAndLevel.set(`${h.conceptId}-${h.level}`, h);
  const list = hintsByConcept.get(h.conceptId) ?? [];
  list.push(h);
  hintsByConcept.set(h.conceptId, list);
}

export class HintEngineService implements HintService {
  getHint(conceptId: string, level: HintLevel): HintTemplate | null {
    return hintsByConceptAndLevel.get(`${conceptId}-${level}`) ?? null;
  }

  getProgressiveHints(conceptId: string): HintTemplate[] {
    return (hintsByConcept.get(conceptId) ?? []).sort((a, b) => a.level - b.level);
  }

  buildHintText(template: HintTemplate, variables: Record<string, string>): string {
    let text = template.template;
    for (const [key, value] of Object.entries(variables)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    return text;
  }
}
