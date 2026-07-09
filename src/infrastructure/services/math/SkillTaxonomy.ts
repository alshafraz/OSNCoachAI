/**
 * Mathematical Intelligence Layer — Skill Taxonomy
 * Complete definition of mathematical skills separate from topics.
 */

import type { Skill } from '@/domain/entities/math/MathEntities';
import type { SkillService } from '@/domain/services/math/MathServices';

export const SKILLS: Skill[] = [
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    description: 'Identifying repeating structures, regularities, and rules in sequences or arrangements.',
    category: 'PATTERN_RECOGNITION',
    relatedConceptIds: ['primes', 'sequences', 'combinatorics'],
    assessmentIndicators: [
      'Student identifies the rule in a sequence within 60 seconds',
      'Student extends a pattern correctly by at least 3 terms',
    ],
  },
  {
    id: 'logical-deduction',
    name: 'Logical Deduction',
    description: 'Drawing valid conclusions from given premises using step-by-step reasoning.',
    category: 'LOGICAL_DEDUCTION',
    relatedConceptIds: ['logic', 'combinatorics', 'algebra'],
    assessmentIndicators: [
      'Student eliminates impossible cases systematically',
      'Student identifies which information is sufficient to reach a conclusion',
    ],
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Creating mental or drawn representations to understand spatial relationships.',
    category: 'VISUALIZATION',
    relatedConceptIds: ['geometry', 'area', 'combinatorics'],
    assessmentIndicators: [
      'Student draws a diagram before solving a geometry problem',
      'Student uses a tree diagram for counting',
    ],
  },
  {
    id: 'arithmetic-accuracy',
    name: 'Arithmetic Accuracy',
    description: 'Performing calculations correctly with attention to detail.',
    category: 'ARITHMETIC_ACCURACY',
    relatedConceptIds: ['numbers', 'fractions', 'divisibility', 'factorization', 'gcd', 'lcm'],
    assessmentIndicators: [
      'Student verifies arithmetic by reverse operation',
      'Student catches sign errors before submission',
    ],
  },
  {
    id: 'algebraic-manipulation',
    name: 'Algebraic Manipulation',
    description: 'Rearranging and transforming equations and expressions to reveal solutions.',
    category: 'ALGEBRAIC_MANIPULATION',
    relatedConceptIds: ['algebra', 'fractions', 'ratio', 'proportion'],
    assessmentIndicators: [
      'Student correctly isolates a variable',
      'Student simplifies complex fractions in one step',
    ],
  },
  {
    id: 'geometric-reasoning',
    name: 'Geometric Reasoning',
    description: 'Applying properties of shapes, angles, and spatial relationships to solve problems.',
    category: 'GEOMETRIC_REASONING',
    relatedConceptIds: ['geometry', 'area', 'similarity'],
    assessmentIndicators: [
      'Student identifies congruent or similar triangles',
      'Student decomposes composite shapes correctly',
    ],
  },
  {
    id: 'counting-strategies',
    name: 'Counting Strategies',
    description: 'Applying systematic methods to count arrangements without omission or repetition.',
    category: 'COUNTING_STRATEGIES',
    relatedConceptIds: ['combinatorics', 'logic'],
    assessmentIndicators: [
      'Student applies multiplication principle correctly',
      'Student avoids double-counting in combination problems',
    ],
  },
  {
    id: 'optimization',
    name: 'Optimization',
    description: 'Finding maximum or minimum values under given constraints.',
    category: 'OPTIMIZATION',
    relatedConceptIds: ['algebra', 'geometry', 'combinatorics'],
    assessmentIndicators: [
      'Student identifies the constraint and objective',
      'Student tests boundary cases',
    ],
  },
  {
    id: 'proof-thinking',
    name: 'Proof-like Thinking',
    description: 'Constructing mathematical arguments to demonstrate truth or impossibility.',
    category: 'PROOF_THINKING',
    relatedConceptIds: ['logic', 'combinatorics', 'primes'],
    assessmentIndicators: [
      'Student identifies what needs to be shown',
      'Student constructs a valid case analysis',
    ],
  },
  {
    id: 'multi-step-reasoning',
    name: 'Multi-step Reasoning',
    description: 'Connecting multiple concepts and operations across a sequence of logical steps.',
    category: 'MULTI_STEP_REASONING',
    relatedConceptIds: ['logic', 'combinatorics', 'algebra', 'geometry'],
    assessmentIndicators: [
      'Student breaks a complex problem into sub-problems',
      'Student tracks intermediate results without confusion',
    ],
  },
];

const skillById = new Map<string, Skill>(SKILLS.map((s) => [s.id, s]));

export class SkillTaxonomyService implements SkillService {
  getById(id: string): Skill | null {
    return skillById.get(id) ?? null;
  }

  getAll(): Skill[] {
    return SKILLS;
  }

  getForConcept(conceptId: string): Skill[] {
    return SKILLS.filter((s) => s.relatedConceptIds.includes(conceptId));
  }
}
