/**
 * Mathematical Intelligence Layer — Formula Library
 * Canonical reusable formula definitions. Never hardcode formulas in AI prompts.
 */

import type { Formula } from '@/domain/entities/math/MathEntities';
import type { FormulaService } from '@/domain/services/math/MathServices';

export const FORMULAS: Formula[] = [
  {
    id: 'divisor-count-formula',
    name: 'Number of Divisors',
    description: 'Count the total number of positive divisors of a number.',
    expression: 'If n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ, then τ(n) = (a₁+1)(a₂+1)...(aₖ+1)',
    variables: [
      { symbol: 'n', meaning: 'The positive integer' },
      { symbol: 'p₁...pₖ', meaning: 'Distinct prime factors of n' },
      { symbol: 'a₁...aₖ', meaning: 'Exponents of respective prime factors' },
      { symbol: 'τ(n)', meaning: 'Total count of positive divisors' },
    ],
    applicableConceptIds: ['factorization', 'primes'],
    example: 'n = 12 = 2² × 3¹ → τ(12) = (2+1)(1+1) = 6 divisors: {1,2,3,4,6,12}',
    commonMistakes: ['Adding exponents instead of multiplying (exponent+1) terms', 'Forgetting to add 1 to each exponent'],
    visualAidReference: 'factor-tree-diagram',
  },
  {
    id: 'gcd-lcm-relationship',
    name: 'GCD × LCM = Product of Two Numbers',
    description: 'For any two positive integers a and b: GCD(a,b) × LCM(a,b) = a × b.',
    expression: 'GCD(a, b) × LCM(a, b) = a × b',
    variables: [
      { symbol: 'a', meaning: 'First positive integer' },
      { symbol: 'b', meaning: 'Second positive integer' },
      { symbol: 'GCD(a,b)', meaning: 'Greatest common divisor' },
      { symbol: 'LCM(a,b)', meaning: 'Least common multiple' },
    ],
    applicableConceptIds: ['gcd', 'lcm'],
    example: 'GCD(12, 18) = 6, LCM(12, 18) = 36. Check: 6 × 36 = 216 = 12 × 18 ✓',
    commonMistakes: ['Applying formula to three or more numbers (it only holds for exactly two)'],
  },
  {
    id: 'fraction-operations',
    name: 'Fraction Operations',
    description: 'Rules for adding, subtracting, multiplying, and dividing fractions.',
    expression: 'a/b + c/d = (ad+bc)/(bd); a/b × c/d = ac/(bd); a/b ÷ c/d = ad/(bc)',
    variables: [
      { symbol: 'a/b', meaning: 'First fraction (a = numerator, b = denominator)' },
      { symbol: 'c/d', meaning: 'Second fraction' },
    ],
    applicableConceptIds: ['fractions', 'gcd', 'lcm'],
    example: '2/3 + 1/4 = (8+3)/12 = 11/12',
    commonMistakes: ['Adding numerators and denominators separately', 'Forgetting to simplify'],
  },
  {
    id: 'proportion-formula',
    name: 'Proportion',
    description: 'If a/b = c/d, then ad = bc (cross-multiplication).',
    expression: 'a/b = c/d ↔ a × d = b × c',
    variables: [
      { symbol: 'a, b', meaning: 'First ratio terms' },
      { symbol: 'c, d', meaning: 'Second ratio terms' },
    ],
    applicableConceptIds: ['proportion', 'ratio', 'fractions'],
    example: 'x/3 = 8/12 → 12x = 24 → x = 2',
    commonMistakes: ['Cross-multiplying in wrong direction'],
  },
  {
    id: 'arithmetic-sequence-formula',
    name: 'Arithmetic Sequence: nth Term',
    description: 'Formula for the nth term of an arithmetic sequence with first term a₁ and common difference d.',
    expression: 'aₙ = a₁ + (n-1)d',
    variables: [
      { symbol: 'aₙ', meaning: 'The nth term' },
      { symbol: 'a₁', meaning: 'The first term' },
      { symbol: 'n', meaning: 'The position of the term' },
      { symbol: 'd', meaning: 'Common difference' },
    ],
    applicableConceptIds: ['sequences'],
    example: 'For 3, 7, 11, ...: a₁=3, d=4. So a₂₀ = 3 + 19×4 = 79',
    commonMistakes: ['Using n instead of (n-1)', 'Computing d incorrectly from non-consecutive terms'],
  },
  {
    id: 'area-rectangle',
    name: 'Area of Rectangle',
    description: 'Area of a rectangle with length l and width w.',
    expression: 'A = l × w',
    variables: [
      { symbol: 'A', meaning: 'Area' },
      { symbol: 'l', meaning: 'Length' },
      { symbol: 'w', meaning: 'Width' },
    ],
    applicableConceptIds: ['area', 'geometry'],
    example: 'Rectangle 8 cm × 5 cm → A = 40 cm²',
    commonMistakes: ['Using perimeter formula (2l + 2w) instead'],
    visualAidReference: 'rectangle-area-grid',
  },
  {
    id: 'area-triangle',
    name: 'Area of Triangle',
    description: 'Area of a triangle with base b and perpendicular height h.',
    expression: 'A = (1/2) × b × h',
    variables: [
      { symbol: 'A', meaning: 'Area' },
      { symbol: 'b', meaning: 'Base length' },
      { symbol: 'h', meaning: 'Perpendicular height (not slant side)' },
    ],
    applicableConceptIds: ['area', 'geometry'],
    example: 'Triangle: base = 10 cm, height = 6 cm → A = 30 cm²',
    commonMistakes: ['Using slant side as height', 'Forgetting to divide by 2'],
    visualAidReference: 'triangle-height-diagram',
  },
  {
    id: 'area-circle',
    name: 'Area of Circle',
    description: 'Area of a circle with radius r.',
    expression: 'A = π × r²',
    variables: [
      { symbol: 'A', meaning: 'Area' },
      { symbol: 'r', meaning: 'Radius (half the diameter)' },
      { symbol: 'π', meaning: '≈ 3.14159...' },
    ],
    applicableConceptIds: ['area', 'geometry'],
    example: 'Circle with r = 7 cm → A = 49π ≈ 153.94 cm²',
    commonMistakes: ['Using diameter instead of radius', 'Forgetting to square the radius'],
    visualAidReference: 'circle-radius-diagram',
  },
  {
    id: 'area-trapezoid',
    name: 'Area of Trapezoid',
    description: 'Area of a trapezoid with parallel sides a and b and height h.',
    expression: 'A = (1/2) × (a + b) × h',
    variables: [
      { symbol: 'a, b', meaning: 'The two parallel sides' },
      { symbol: 'h', meaning: 'Perpendicular height between the parallel sides' },
    ],
    applicableConceptIds: ['area', 'geometry'],
    example: 'Trapezoid: parallel sides 6 cm and 10 cm, height 4 cm → A = 32 cm²',
    commonMistakes: ['Using non-parallel sides as a or b', 'Using slant height'],
  },
  {
    id: 'pythagorean-theorem',
    name: 'Pythagorean Theorem',
    description: 'Relationship between sides of a right triangle.',
    expression: 'a² + b² = c²',
    variables: [
      { symbol: 'a, b', meaning: 'Legs (shorter sides) of the right triangle' },
      { symbol: 'c', meaning: 'Hypotenuse (longest side, opposite the right angle)' },
    ],
    applicableConceptIds: ['geometry', 'area'],
    example: 'a = 3, b = 4 → c² = 9 + 16 = 25 → c = 5',
    commonMistakes: ['Applying to non-right triangles', 'Using a leg as hypotenuse'],
    visualAidReference: 'right-triangle-pythagorean',
  },
  {
    id: 'permutation-formula',
    name: 'Permutations: nPr',
    description: 'Number of ordered arrangements of r items chosen from n distinct items.',
    expression: 'P(n, r) = n! / (n-r)!',
    variables: [
      { symbol: 'n', meaning: 'Total number of distinct items' },
      { symbol: 'r', meaning: 'Number of items chosen' },
    ],
    applicableConceptIds: ['combinatorics'],
    example: 'P(5, 3) = 5!/2! = 60 ordered arrangements',
    commonMistakes: ['Using when order does not matter', 'Computing n! instead of n!/(n-r)!'],
  },
  {
    id: 'combination-formula',
    name: 'Combinations: nCr',
    description: 'Number of unordered selections of r items from n distinct items.',
    expression: 'C(n, r) = n! / (r! × (n-r)!)',
    variables: [
      { symbol: 'n', meaning: 'Total number of distinct items' },
      { symbol: 'r', meaning: 'Number of items chosen' },
    ],
    applicableConceptIds: ['combinatorics'],
    example: 'C(5, 3) = 120/(6×2) = 10 groups',
    commonMistakes: ['Using when order matters', 'Forgetting to divide by r!'],
  },
];

const formulaById = new Map<string, Formula>(FORMULAS.map((f) => [f.id, f]));

export class FormulaLibraryService implements FormulaService {
  getById(id: string): Formula | null {
    return formulaById.get(id) ?? null;
  }

  getForConcept(conceptId: string): Formula[] {
    return FORMULAS.filter((f) => f.applicableConceptIds.includes(conceptId));
  }

  searchByName(query: string): Formula[] {
    const q = query.toLowerCase();
    return FORMULAS.filter(
      (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    );
  }
}
