/**
 * Mathematical Intelligence Layer — Reasoning Engine
 *
 * Universal 8-phase problem-solving framework.
 * Every AI explanation must follow this trace structure.
 * Never hardcode reasoning steps inside AI prompts.
 */

import type { ReasoningTemplate } from '@/domain/entities/math/MathEntities';
import type { ReasoningService } from '@/domain/services/math/MathServices';
import { CONCEPTS } from './ConceptGraph';
import { STRATEGIES } from './StrategyLibrary';
import { MISCONCEPTIONS } from './MisconceptionLibrary';

// ─── UNIVERSAL REASONING TEMPLATE ─────────────────────────────────────────────

export const UNIVERSAL_REASONING_TEMPLATE: ReasoningTemplate = {
  id: 'universal',
  name: 'Universal Mathematical Reasoning Framework',
  applicableConceptIds: ['*'],
  steps: [
    {
      stepIndex: 0,
      phase: 'UNDERSTAND',
      promptTemplate: 'What exactly is this problem asking you to find?',
      childFriendlyGuidance: 'Read the question carefully. In your own words, what do you need to find out?',
    },
    {
      stepIndex: 1,
      phase: 'EXTRACT_INFO',
      promptTemplate: 'What information is given in the problem?',
      childFriendlyGuidance: 'Circle or write down all the numbers and facts given to you. Don\'t skip any!',
    },
    {
      stepIndex: 2,
      phase: 'KNOWN_FACTS',
      promptTemplate: 'What mathematical facts or formulas do you know that relate to this problem?',
      childFriendlyGuidance: 'What have you learned about this type of problem before? Any formulas or rules come to mind?',
    },
    {
      stepIndex: 3,
      phase: 'UNKNOWN_VARIABLES',
      promptTemplate: 'What are you trying to find? Label it with a letter if helpful.',
      childFriendlyGuidance: 'What is the "mystery value"? Give it a name — like "let x = the number we want".',
    },
    {
      stepIndex: 4,
      phase: 'STRATEGY_SELECT',
      promptTemplate: 'Which strategy will you use? (Draw diagram / Make table / Work backwards / ...)',
      childFriendlyGuidance: 'Pick your plan of attack! Would drawing a picture help? Should you try small cases first?',
    },
    {
      stepIndex: 5,
      phase: 'EXECUTE',
      promptTemplate: 'Carry out your plan step by step. Show every calculation.',
      childFriendlyGuidance: 'Show all your working — no skipping steps! Even small steps count.',
    },
    {
      stepIndex: 6,
      phase: 'VERIFY',
      promptTemplate: 'Does your answer make sense? Check it against the original problem.',
      childFriendlyGuidance: 'Plug your answer back in. Does everything add up? Is the answer reasonable?',
    },
    {
      stepIndex: 7,
      phase: 'REFLECT',
      promptTemplate: 'What did you learn? Could you solve a similar problem differently?',
      childFriendlyGuidance: 'Great job! What was the key idea that made this work? Could you explain it to a friend?',
    },
  ],
};

// ─── CONCEPT-SPECIFIC TEMPLATES ───────────────────────────────────────────────

const REASONING_TEMPLATES: ReasoningTemplate[] = [
  {
    id: 'number-theory-reasoning',
    name: 'Number Theory Reasoning Framework',
    applicableConceptIds: ['primes', 'gcd', 'lcm', 'factorization', 'divisibility'],
    steps: [
      { stepIndex: 0, phase: 'UNDERSTAND', promptTemplate: 'Is this about divisors, multiples, or prime factors?', childFriendlyGuidance: 'Does the question ask about "what divides what" or "what\'s common"?' },
      { stepIndex: 1, phase: 'EXTRACT_INFO', promptTemplate: 'List the given numbers. Are any constraints mentioned?', childFriendlyGuidance: 'Write the numbers down. Does the problem say "exactly", "at least", or "no more than"?' },
      { stepIndex: 2, phase: 'KNOWN_FACTS', promptTemplate: 'Recall divisibility rules or prime factorization for these numbers.', childFriendlyGuidance: 'Can you factor each number into primes? Start with the smallest prime: 2, 3, 5, 7...' },
      { stepIndex: 3, phase: 'UNKNOWN_VARIABLES', promptTemplate: 'What is the unknown — a missing number, GCD, or LCM?', childFriendlyGuidance: 'Label your unknown clearly: "Let n = the mystery number".' },
      { stepIndex: 4, phase: 'STRATEGY_SELECT', promptTemplate: 'Choose: factor tree, Euclidean algorithm, listing multiples, or Venn diagram?', childFriendlyGuidance: 'Pick the method that feels most natural for the numbers involved.' },
      { stepIndex: 5, phase: 'EXECUTE', promptTemplate: 'Apply chosen method and show all factorization steps.', childFriendlyGuidance: 'Show every step! Which factors are common? Which powers are highest?' },
      { stepIndex: 6, phase: 'VERIFY', promptTemplate: 'Check: does your GCD divide both numbers? Does your LCM divide by both?', childFriendlyGuidance: 'Test your answer. If GCD(a,b) = g, then g should divide both a and b.' },
      { stepIndex: 7, phase: 'REFLECT', promptTemplate: 'Could you apply GCD × LCM = a × b as a cross-check?', childFriendlyGuidance: 'Quick check: GCD × LCM should equal the product of the two numbers!' },
    ],
  },
  {
    id: 'geometry-reasoning',
    name: 'Geometry Reasoning Framework',
    applicableConceptIds: ['geometry', 'area', 'similarity', 'proportion'],
    steps: [
      { stepIndex: 0, phase: 'UNDERSTAND', promptTemplate: 'What shape or geometric relationship is involved?', childFriendlyGuidance: 'Draw the shape! What type of figure is this?' },
      { stepIndex: 1, phase: 'EXTRACT_INFO', promptTemplate: 'Mark all known lengths, angles, and areas on your diagram.', childFriendlyGuidance: 'Write all measurements directly on your drawing. Don\'t leave anything unlabeled.' },
      { stepIndex: 2, phase: 'KNOWN_FACTS', promptTemplate: 'Which area or perimeter formula applies?', childFriendlyGuidance: 'Do you need: rectangle (l×w), triangle (½bh), circle (πr²), or another formula?' },
      { stepIndex: 3, phase: 'UNKNOWN_VARIABLES', promptTemplate: 'Which measurement is missing? Can you express it in terms of known values?', childFriendlyGuidance: 'What exact measurement are you solving for? Label it on your diagram.' },
      { stepIndex: 4, phase: 'STRATEGY_SELECT', promptTemplate: 'Will you decompose, subtract areas, use Pythagorean theorem, or similarity?', childFriendlyGuidance: 'Can you split this complex shape into simpler shapes you know?' },
      { stepIndex: 5, phase: 'EXECUTE', promptTemplate: 'Apply formulas and calculate each part.', childFriendlyGuidance: 'Calculate step by step. Be careful with units — keep them consistent!' },
      { stepIndex: 6, phase: 'VERIFY', promptTemplate: 'Is the answer in correct units? Does the magnitude seem reasonable?', childFriendlyGuidance: 'Is your area answer in cm² (not cm)? Does the number make sense for the size of the shape?' },
      { stepIndex: 7, phase: 'REFLECT', promptTemplate: 'Was there a more elegant approach using symmetry or subtraction?', childFriendlyGuidance: 'Great! Next time, look for symmetry — it can make the calculation much faster.' },
    ],
  },
  {
    id: 'combinatorics-reasoning',
    name: 'Combinatorics Reasoning Framework',
    applicableConceptIds: ['combinatorics', 'logic'],
    steps: [
      { stepIndex: 0, phase: 'UNDERSTAND', promptTemplate: 'Are you counting arrangements (order matters) or selections (order doesn\'t matter)?', childFriendlyGuidance: 'Key question: does it matter WHICH position or slot each item goes in?' },
      { stepIndex: 1, phase: 'EXTRACT_INFO', promptTemplate: 'How many items are available? How many are being chosen? Any restrictions?', childFriendlyGuidance: 'Write: "I have ___ items, choosing ___, with restriction: ___."' },
      { stepIndex: 2, phase: 'KNOWN_FACTS', promptTemplate: 'Recall: Multiplication Principle, nPr for ordered, nCr for unordered.', childFriendlyGuidance: 'If order matters → permutation. If order doesn\'t matter → combination.' },
      { stepIndex: 3, phase: 'UNKNOWN_VARIABLES', promptTemplate: 'What is the total count you need to find?', childFriendlyGuidance: 'Make sure you know exactly what you\'re counting.' },
      { stepIndex: 4, phase: 'STRATEGY_SELECT', promptTemplate: 'Choose: direct counting, complementary counting, case analysis, or tree diagram?', childFriendlyGuidance: 'Is it easier to count what you WANT, or count everything and subtract what you DON\'T want?' },
      { stepIndex: 5, phase: 'EXECUTE', promptTemplate: 'Count each step carefully. Check for double-counting.', childFriendlyGuidance: 'For small problems, list some cases to verify your method gives the right number.' },
      { stepIndex: 6, phase: 'VERIFY', promptTemplate: 'List a few cases by hand and compare with your formula answer.', childFriendlyGuidance: 'Try listing 5–10 outcomes. Does your formula match what you counted by hand?' },
      { stepIndex: 7, phase: 'REFLECT', promptTemplate: 'Could you have used complementary counting as a check?', childFriendlyGuidance: 'Well done! Could you have counted the "not wanted" cases and subtracted? Same answer!' },
    ],
  },
];

const templateByConceptId = new Map<string, ReasoningTemplate>();
for (const t of REASONING_TEMPLATES) {
  for (const cid of t.applicableConceptIds) {
    templateByConceptId.set(cid, t);
  }
}

export class ReasoningEngineService implements ReasoningService {
  getTemplate(conceptId: string): ReasoningTemplate | null {
    return templateByConceptId.get(conceptId) ?? null;
  }

  getUniversalTemplate(): ReasoningTemplate {
    return UNIVERSAL_REASONING_TEMPLATE;
  }

  buildReasoningTrace(
    questionBody: string,
    primaryConceptId: string,
    strategyIds: string[]
  ): {
    steps: { phase: string; guidance: string }[];
    appliedConcepts: string[];
    appliedStrategies: string[];
    suggestedMisconceptionsToCheck: string[];
  } {
    const template = this.getTemplate(primaryConceptId) ?? UNIVERSAL_REASONING_TEMPLATE;

    const concept = CONCEPTS.find((c) => c.id === primaryConceptId);
    const appliedConcepts = concept
      ? [concept.name, ...concept.relatedConceptIds]
      : [primaryConceptId];

    const appliedStrategies = strategyIds
      .map((sid) => STRATEGIES.find((s) => s.id === sid)?.name)
      .filter(Boolean) as string[];

    const suggestedMisconceptionsToCheck = concept?.misconceptionIds ?? [];

    const steps = template.steps.map((s) => ({
      phase: s.phase,
      guidance: s.childFriendlyGuidance,
    }));

    return { steps, appliedConcepts, appliedStrategies, suggestedMisconceptionsToCheck };
  }
}
