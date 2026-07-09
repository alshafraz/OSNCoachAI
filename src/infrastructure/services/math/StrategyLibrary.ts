/**
 * Mathematical Intelligence Layer — Strategy Library
 * Reusable problem-solving strategy definitions referenced by concepts and questions.
 */

import type { Strategy } from '@/domain/entities/math/MathEntities';
import type { StrategyService } from '@/domain/services/math/MathServices';

export const STRATEGIES: Strategy[] = [
  {
    id: 'draw-diagram',
    name: 'Draw a Diagram',
    description: 'Create a visual representation of the problem to clarify relationships.',
    applicableConceptIds: ['geometry', 'area', 'logic', 'combinatorics'],
    steps: ['Read the problem.', 'Identify shapes or objects mentioned.', 'Draw and label the diagram.', 'Extract information from the diagram.'],
    whenToUse: 'Whenever the problem involves spatial relationships, geometry, or movement.',
    examples: ['Drawing a trapezoid to find shaded area', 'Drawing Venn diagrams for set problems'],
  },
  {
    id: 'make-table',
    name: 'Make a Table',
    description: 'Organize data in rows and columns to reveal patterns.',
    applicableConceptIds: ['sequences', 'combinatorics', 'logic'],
    steps: ['Identify the variables.', 'Create columns for each variable.', 'Fill in known values.', 'Look for the pattern.'],
    whenToUse: 'When dealing with relationships between two or more varying quantities.',
    examples: ['Finding patterns in sequences', 'Listing outcomes in probability'],
  },
  {
    id: 'guess-and-check',
    name: 'Guess and Check (Systematic Trial)',
    description: 'Make an informed guess, check against conditions, and refine.',
    applicableConceptIds: ['algebra', 'numbers', 'logic'],
    steps: ['Make a reasonable initial guess.', 'Check whether it satisfies all conditions.', 'Adjust guess based on result.', 'Repeat until correct.'],
    whenToUse: 'When the search space is small or constraints can be tested quickly.',
    examples: ['Finding two numbers with known sum and product'],
  },
  {
    id: 'working-backwards',
    name: 'Working Backwards',
    description: 'Start from the desired end result and reverse-engineer the steps.',
    applicableConceptIds: ['algebra', 'sequences', 'logic'],
    steps: ['Identify the final result.', 'Undo the last operation.', 'Continue undoing operations.', 'Verify the original conditions.'],
    whenToUse: 'When the final answer is known but the starting point is not.',
    examples: ['Finding original price after discount', 'Reverse-tracing a sequence'],
  },
  {
    id: 'pattern-recognition-strategy',
    name: 'Find a Pattern',
    description: 'Identify a repeating rule and use it to predict or generalize.',
    applicableConceptIds: ['sequences', 'primes', 'combinatorics', 'numbers'],
    steps: ['List several cases.', 'Look for what changes and what stays the same.', 'State the rule.', 'Apply the rule to the required case.'],
    whenToUse: 'When the problem asks for a large-case result that can be reached from a simple rule.',
    examples: ['Finding the last digit of 3^100', 'Sum of first n odd numbers'],
  },
  {
    id: 'factorization-strategy',
    name: 'Factorization',
    description: 'Express a number or expression as a product of simpler factors.',
    applicableConceptIds: ['primes', 'factorization', 'gcd', 'lcm', 'algebra'],
    steps: ['Identify the expression or number.', 'Find prime or algebraic factors.', 'Write in factored form.', 'Use factors to simplify or solve.'],
    whenToUse: 'For number theory problems, simplifying fractions, or solving quadratic-type equations.',
    examples: ['Factoring 360 to find number of divisors', 'Simplifying 48/72'],
  },
  {
    id: 'case-analysis',
    name: 'Case Analysis',
    description: 'Divide the problem into exhaustive, mutually exclusive cases and solve each.',
    applicableConceptIds: ['logic', 'combinatorics', 'algebra'],
    steps: ['Identify the cases that cover all possibilities.', 'Ensure cases are mutually exclusive.', 'Solve each case separately.', 'Combine results.'],
    whenToUse: 'When the problem has different behaviors depending on conditions.',
    examples: ['Even vs odd cases in number theory', 'Interior vs boundary cases in geometry'],
  },
  {
    id: 'complementary-counting',
    name: 'Complementary Counting',
    description: 'Count what you do NOT want and subtract from total.',
    applicableConceptIds: ['combinatorics', 'logic'],
    steps: ['Find the total without restrictions.', 'Count the cases to exclude.', 'Subtract: desired = total − excluded.'],
    whenToUse: 'When counting "at least one" or "does NOT include X" is complex to count directly.',
    examples: ['Passwords with at least one digit: total − no-digit passwords'],
  },
  {
    id: 'symmetry',
    name: 'Using Symmetry',
    description: 'Exploit symmetric properties to simplify or pair up cases.',
    applicableConceptIds: ['geometry', 'combinatorics', 'logic'],
    steps: ['Identify lines or axes of symmetry.', 'Pair corresponding elements.', 'Use equal parts to simplify calculation.'],
    whenToUse: 'When a figure or problem is symmetric, allowing you to calculate half and double.',
    examples: ['Shaded symmetric area', 'Counting palindromes'],
  },
  {
    id: 'logical-elimination',
    name: 'Logical Elimination',
    description: 'Systematically rule out impossible options until only one remains.',
    applicableConceptIds: ['logic', 'combinatorics'],
    steps: ['List all possible options.', 'Apply constraints to eliminate options.', 'Confirm the remaining option satisfies all conditions.'],
    whenToUse: 'Logic puzzles, deduction grids, and constraint-satisfaction problems.',
    examples: ['Sudoku-style logic grids', 'Who-is-who deduction problems'],
  },
  {
    id: 'systematic-counting',
    name: 'Systematic Listing',
    description: 'List all possibilities in a structured order to ensure completeness.',
    applicableConceptIds: ['combinatorics', 'logic'],
    steps: ['Fix the first element.', 'List all possibilities for remaining elements.', 'Move to the next first element.', 'Count the total.'],
    whenToUse: 'When the number of cases is small enough to list completely.',
    examples: ['Listing all 2-digit numbers with digits summing to 7'],
  },
];

const strategyById = new Map<string, Strategy>(STRATEGIES.map((s) => [s.id, s]));

export class StrategyLibraryService implements StrategyService {
  getById(id: string): Strategy | null {
    return strategyById.get(id) ?? null;
  }

  getAll(): Strategy[] {
    return STRATEGIES;
  }

  getForConcept(conceptId: string): Strategy[] {
    return STRATEGIES.filter((s) => s.applicableConceptIds.includes(conceptId));
  }

  recommendStrategies(conceptIds: string[]): Strategy[] {
    const seen = new Set<string>();
    const result: Strategy[] = [];
    for (const cId of conceptIds) {
      for (const s of this.getForConcept(cId)) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          result.push(s);
        }
      }
    }
    return result;
  }
}
