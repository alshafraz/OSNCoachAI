/**
 * Mathematical Intelligence Layer — Misconception Library
 * Catalogue of common student misconceptions with detection and correction strategies.
 */

import type { Misconception } from '@/domain/entities/math/MathEntities';
import type { MisconceptionService } from '@/domain/services/math/MathServices';

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'place-value-confusion',
    name: 'Place Value Confusion',
    description: 'Student misidentifies the value of a digit based on its position.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['numbers'],
    typicalStudentBehavior: 'Writes 403 when asked for "four hundred and three", or treats "tenths" as "tens".',
    detectionRules: ['Answer off by factor of 10', 'Digit placed in wrong column'],
    correctionStrategy: 'Use a place-value chart; have student name each position before writing.',
    recommendedExercises: ['Place value charts up to millions', 'Expanded form writing'],
  },
  {
    id: 'one-is-prime',
    name: '1 is Considered Prime',
    description: 'Student incorrectly includes 1 in the list of prime numbers.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['primes'],
    typicalStudentBehavior: 'Lists primes as 1, 2, 3, 5, 7...',
    detectionRules: ['Student answer includes 1 in list of primes'],
    correctionStrategy: 'Explain that primes must have exactly two distinct factors: 1 and themselves. Since 1 has only one factor, it is neither prime nor composite.',
    recommendedExercises: ['Factor listing for 1, 2, 3, 4'],
  },
  {
    id: 'even-numbers-not-prime',
    name: 'All Even Numbers Are Composite',
    description: 'Student believes no even number can be prime, missing 2.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['primes'],
    typicalStudentBehavior: 'Excludes 2 from prime list; says "2 is even so it cannot be prime".',
    detectionRules: ['Answer omits 2 from prime list'],
    correctionStrategy: 'Show that 2 has exactly two factors: 1 and 2. It is the only even prime.',
    recommendedExercises: ['Factor listing for 2', 'Why 4, 6, 8 are composite'],
  },
  {
    id: 'incomplete-factorization',
    name: 'Incomplete Prime Factorization',
    description: 'Student stops factoring when a composite factor remains.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['factorization'],
    typicalStudentBehavior: 'Writes 360 = 4 × 90 and stops, not factoring further.',
    detectionRules: ['Factorization result contains a non-prime factor'],
    correctionStrategy: 'Remind student: continue until all factors are prime. Check each factor against prime list.',
    recommendedExercises: ['Factor tree completion exercises'],
  },
  {
    id: 'gcd-lcm-confusion',
    name: 'GCD and LCM Confusion',
    description: 'Student swaps GCD and LCM methods or answers.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['gcd', 'lcm'],
    typicalStudentBehavior: 'Uses maximum exponents when finding GCD; uses minimum exponents for LCM.',
    detectionRules: ['GCD answer larger than both inputs', 'LCM answer smaller than both inputs'],
    correctionStrategy: 'Mnemonic: GCD = Greatest = grab the smallest power; LCM = Least = grab the largest power.',
    recommendedExercises: ['GCD vs LCM side-by-side comparison with Venn diagrams'],
  },
  {
    id: 'divisibility-rule-mix',
    name: 'Divisibility Rule Mix-up',
    description: 'Student applies the wrong divisibility rule.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['divisibility'],
    typicalStudentBehavior: 'Checks last digit for divisibility by 3 (should check digit sum).',
    detectionRules: ['Correct check but wrong rule applied'],
    correctionStrategy: 'Create a divisibility rules reference card. Drill each rule separately.',
    recommendedExercises: ['Divisibility sorting games'],
  },
  {
    id: 'fraction-addition-error',
    name: 'Incorrect Fraction Addition',
    description: 'Student adds numerators and denominators separately.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['fractions'],
    typicalStudentBehavior: 'Computes 1/2 + 1/3 = 2/5.',
    detectionRules: ['Denominator of answer equals sum of input denominators'],
    correctionStrategy: 'Use fraction bars to show that equal-sized pieces are needed. Find LCD first.',
    recommendedExercises: ['Fraction bar manipulatives', 'LCD finding practice'],
  },
  {
    id: 'ratio-order-confusion',
    name: 'Ratio Order Reversal',
    description: 'Student writes ratio in wrong order relative to problem statement.',
    errorCategory: 'READING_ERROR',
    conceptIds: ['ratio'],
    typicalStudentBehavior: 'Writes boys:girls = 3:5 when problem says girls:boys.',
    detectionRules: ['Ratio is reciprocal of expected answer'],
    correctionStrategy: 'Highlight the order of quantities in the problem. Underline "A to B" before writing A:B.',
    recommendedExercises: ['Ratio order identification exercises'],
  },
  {
    id: 'direct-inverse-confusion',
    name: 'Direct vs Inverse Proportion Confusion',
    description: 'Student applies direct proportion method to an inverse proportion problem.',
    errorCategory: 'STRATEGY_ERROR',
    conceptIds: ['proportion'],
    typicalStudentBehavior: 'More workers → more time (instead of less time) for same job.',
    detectionRules: ['Answer increases when it should decrease (or vice versa)'],
    correctionStrategy: 'Ask: "If X increases, does Y increase or decrease?" Draw arrows showing relationships.',
    recommendedExercises: ['Direct vs inverse identification sorting'],
  },
  {
    id: 'variable-confusion',
    name: 'Variable as Label',
    description: 'Student treats a variable as a label or abbreviation rather than an unknown number.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['algebra'],
    typicalStudentBehavior: 'In "5a + 3b = ?", treats "a" as "apples" and writes a shopping list.',
    detectionRules: ['Student assigns object meaning to variable', 'Cannot perform operations on variable'],
    correctionStrategy: 'Emphasize variables represent unknown numbers; substitute numbers to check.',
    recommendedExercises: ['Variable substitution warm-ups'],
  },
  {
    id: 'sign-error',
    name: 'Sign Error in Algebra',
    description: 'Student makes errors with positive/negative signs when rearranging equations.',
    errorCategory: 'CALCULATION_ERROR',
    conceptIds: ['algebra'],
    typicalStudentBehavior: 'Writes x - 5 = 10 → x = 10 - 5 (instead of x = 10 + 5).',
    detectionRules: ['Answer has opposite sign from correct', 'Transposed term has same sign'],
    correctionStrategy: 'Reinforce "whatever you do to one side, do to the other." Use balance model.',
    recommendedExercises: ['Sign rule drills', 'Balance scale exercises'],
  },
  {
    id: 'area-perimeter-confusion',
    name: 'Area vs Perimeter Confusion',
    description: 'Student computes perimeter when area is asked or vice versa.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['geometry', 'area'],
    typicalStudentBehavior: 'Adds all sides when asked for area of a rectangle.',
    detectionRules: ['Answer is sum of side lengths when area expected', 'Answer is product when perimeter expected'],
    correctionStrategy: 'Mnemonic: Area = "amount of carpet needed" (inside); Perimeter = "fence around the yard" (outside).',
    recommendedExercises: ['Shading interior vs tracing boundary exercises'],
  },
  {
    id: 'wrong-area-formula',
    name: 'Wrong Area Formula Applied',
    description: 'Student applies the area formula for one shape to a different shape.',
    errorCategory: 'CONCEPT_ERROR',
    conceptIds: ['area'],
    typicalStudentBehavior: 'Uses base × height (rectangle formula) for a triangle without dividing by 2.',
    detectionRules: ['Answer double the correct value for triangles', 'Wrong formula referenced'],
    correctionStrategy: 'Create a formula reference card organized by shape. Derive each formula from first principles.',
    recommendedExercises: ['Formula derivation activities', 'Shape identification first'],
  },
  {
    id: 'double-counting',
    name: 'Double Counting in Combinatorics',
    description: 'Student counts the same arrangement multiple times.',
    errorCategory: 'LOGIC_ERROR',
    conceptIds: ['combinatorics'],
    typicalStudentBehavior: 'Counts AB and BA as different when order doesn\'t matter.',
    detectionRules: ['Answer is n! × correct_answer', 'Answer larger than expected by factor of r!'],
    correctionStrategy: 'Ask: "Does AB mean the same as BA in this context?" If yes, divide by arrangements.',
    recommendedExercises: ['Listing then grouping duplicate arrangements'],
  },
  {
    id: 'perm-comb-confusion',
    name: 'Permutation vs Combination Confusion',
    description: 'Student uses permutation when combination applies or vice versa.',
    errorCategory: 'STRATEGY_ERROR',
    conceptIds: ['combinatorics'],
    typicalStudentBehavior: 'Uses nPr formula for "how many groups of 3" problems.',
    detectionRules: ['Answer larger than expected by r! factor', 'Problem says "groups" but nPr used'],
    correctionStrategy: 'Key question: "Does order matter?" If yes → permutation; if no → combination.',
    recommendedExercises: ['Order-matters classification exercises'],
  },
  {
    id: 'assumption-error',
    name: 'Unjustified Assumption',
    description: 'Student introduces an assumption not stated in the problem.',
    errorCategory: 'LOGIC_ERROR',
    conceptIds: ['logic'],
    typicalStudentBehavior: 'Assumes all items are distinct when duplicates are allowed.',
    detectionRules: ['Reasoning chain contains premise not from problem statement'],
    correctionStrategy: 'Ask student to quote each fact used and point to its source in the problem.',
    recommendedExercises: ['Fact-finding reading comprehension before solving'],
  },
  {
    id: 'sequence-type-confusion',
    name: 'Arithmetic vs Geometric Sequence Confusion',
    description: 'Student applies the wrong formula type to a sequence.',
    errorCategory: 'STRATEGY_ERROR',
    conceptIds: ['sequences'],
    typicalStudentBehavior: 'Subtracts terms of a geometric sequence looking for a constant difference.',
    detectionRules: ['Student finds ratio but calls it "common difference"'],
    correctionStrategy: 'Check both: is difference constant (arithmetic)? Is ratio constant (geometric)?',
    recommendedExercises: ['Sequence type identification sorting'],
  },
];

const misconceptionById = new Map<string, Misconception>(MISCONCEPTIONS.map((m) => [m.id, m]));

export class MisconceptionLibraryService implements MisconceptionService {
  getById(id: string): Misconception | null {
    return misconceptionById.get(id) ?? null;
  }

  getForConcept(conceptId: string): Misconception[] {
    return MISCONCEPTIONS.filter((m) => m.conceptIds.includes(conceptId));
  }

  detectFromAnswer({ questionBody, correctAnswer, studentAnswer, conceptId }: {
    questionBody: string;
    correctAnswer: string;
    studentAnswer: string;
    conceptId: string;
  }): Misconception[] {
    const detected: Misconception[] = [];
    const conceptMisconceptions = this.getForConcept(conceptId);

    for (const m of conceptMisconceptions) {
      for (const rule of m.detectionRules) {
        const lower = rule.toLowerCase();
        // Simple heuristic detection
        if (lower.includes('reciprocal') && studentAnswer !== '' && correctAnswer !== '') {
          // Check if answer is reciprocal
          const [numS, denS] = studentAnswer.split('/').map(Number);
          const [numC, denC] = correctAnswer.split('/').map(Number);
          if (numS === denC && denS === numC) detected.push(m);
        }
        if (lower.includes('double') && Number(studentAnswer) === Number(correctAnswer) * 2) {
          detected.push(m);
        }
      }
    }
    return [...new Map(detected.map((m) => [m.id, m])).values()];
  }

  getCorrectionStrategy(misconceptionId: string): string {
    return misconceptionById.get(misconceptionId)?.correctionStrategy ?? 'Review the concept fundamentals with your teacher.';
  }
}
