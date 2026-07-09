/**
 * Mathematical Intelligence Layer — Concept Graph
 *
 * Complete knowledge graph of OSN Elementary Mathematics concepts.
 * This is the single source of truth. Never duplicate concept data elsewhere.
 */

import type { Concept } from '@/domain/entities/math/MathEntities';
import type { ConceptService } from '@/domain/services/math/MathServices';

export const CONCEPTS: Concept[] = [
  // ── NUMBER SYSTEM ──────────────────────────────────────────────────────────
  {
    id: 'numbers',
    name: 'Number System',
    description: 'Understanding natural numbers, integers, and their properties.',
    parentConceptId: null,
    childConceptIds: ['primes', 'divisibility', 'place-value'],
    prerequisiteConceptIds: [],
    relatedConceptIds: ['arithmetic'],
    difficulty: 'EASY',
    estimatedLearningMinutes: 60,
    gradeRecommendation: 4,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Identify and classify natural numbers',
      'Understand place value up to millions',
      'Compare and order numbers',
    ],
    exampleProblems: ['What is the largest 4-digit even number?'],
    commonMistakes: ['Confusing place value positions', 'Errors when comparing large numbers'],
    visualAids: ['number-line', 'place-value-chart'],
    typicalSolutionMethods: ['Direct calculation', 'Place value analysis'],
    formulaIds: [],
    misconceptionIds: ['place-value-confusion'],
    skillIds: ['arithmetic-accuracy'],
  },
  {
    id: 'primes',
    name: 'Prime Numbers',
    description: 'Numbers greater than 1 divisible only by 1 and themselves.',
    parentConceptId: 'numbers',
    childConceptIds: ['factorization', 'sieve-of-eratosthenes'],
    prerequisiteConceptIds: ['numbers', 'divisibility'],
    relatedConceptIds: ['divisibility', 'gcd', 'lcm'],
    difficulty: 'EASY',
    estimatedLearningMinutes: 45,
    gradeRecommendation: 4,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Identify prime numbers up to 100',
      'Distinguish primes from composite numbers',
      'Understand why 1 is neither prime nor composite',
    ],
    exampleProblems: ['List all prime numbers between 1 and 50.', 'Is 91 prime?'],
    commonMistakes: ['Including 1 as prime', 'Missing primes like 2 (even prime)', 'Misidentifying 49=7×7'],
    visualAids: ['sieve-diagram'],
    typicalSolutionMethods: ['Trial division', 'Sieve of Eratosthenes'],
    formulaIds: [],
    misconceptionIds: ['one-is-prime', 'even-numbers-not-prime'],
    skillIds: ['pattern-recognition', 'arithmetic-accuracy'],
  },
  {
    id: 'divisibility',
    name: 'Divisibility Rules',
    description: 'Rules for determining if one integer divides another without remainder.',
    parentConceptId: 'numbers',
    childConceptIds: ['gcd', 'lcm'],
    prerequisiteConceptIds: ['numbers'],
    relatedConceptIds: ['primes', 'factorization'],
    difficulty: 'EASY',
    estimatedLearningMinutes: 40,
    gradeRecommendation: 4,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Apply divisibility rules for 2, 3, 4, 5, 6, 8, 9, 10',
      'Determine remainders without long division',
    ],
    exampleProblems: ['Is 324 divisible by 4?', 'Find all single-digit divisors of 360.'],
    commonMistakes: ['Confusing rule for 4 with rule for 2', 'Applying rule for 9 to 6'],
    visualAids: ['divisibility-table'],
    typicalSolutionMethods: ['Apply divisibility rule', 'Direct division'],
    formulaIds: [],
    misconceptionIds: ['divisibility-rule-mix'],
    skillIds: ['arithmetic-accuracy', 'pattern-recognition'],
  },
  {
    id: 'factorization',
    name: 'Prime Factorization',
    description: 'Expressing a composite number as a product of prime factors.',
    parentConceptId: 'primes',
    childConceptIds: ['gcd', 'lcm'],
    prerequisiteConceptIds: ['primes', 'divisibility'],
    relatedConceptIds: ['gcd', 'lcm', 'exponents'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 60,
    gradeRecommendation: 5,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Find prime factorization using factor trees',
      'Write factorization in exponential form',
      'Count number of divisors using exponents',
    ],
    exampleProblems: ['Find the prime factorization of 360.', 'How many factors does 2³ × 3² × 5 have?'],
    commonMistakes: ['Stopping factorization at composite factors', 'Miscounting exponents'],
    visualAids: ['factor-tree-diagram'],
    typicalSolutionMethods: ['Factor tree', 'Division ladder'],
    formulaIds: ['divisor-count-formula'],
    misconceptionIds: ['incomplete-factorization'],
    skillIds: ['pattern-recognition', 'arithmetic-accuracy'],
  },
  {
    id: 'gcd',
    name: 'Greatest Common Divisor (GCD)',
    description: 'The largest integer that divides two or more numbers without remainder.',
    parentConceptId: 'factorization',
    childConceptIds: ['lcm', 'fractions'],
    prerequisiteConceptIds: ['primes', 'divisibility', 'factorization'],
    relatedConceptIds: ['lcm', 'fractions'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 50,
    gradeRecommendation: 5,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Calculate GCD using prime factorization',
      'Apply Euclidean algorithm',
      'Use GCD to simplify fractions',
    ],
    exampleProblems: ['Find GCD(48, 72).', 'If GCD(a, b) = 6 and LCM(a, b) = 360, what is a × b?'],
    commonMistakes: ['Confusing GCD with LCM', 'Using addition instead of multiplication in factorization'],
    visualAids: ['venn-diagram-factors'],
    typicalSolutionMethods: ['Prime factorization intersection', 'Euclidean algorithm'],
    formulaIds: ['gcd-lcm-relationship'],
    misconceptionIds: ['gcd-lcm-confusion'],
    skillIds: ['logical-deduction', 'arithmetic-accuracy'],
  },
  {
    id: 'lcm',
    name: 'Least Common Multiple (LCM)',
    description: 'The smallest positive integer divisible by two or more numbers.',
    parentConceptId: 'gcd',
    childConceptIds: ['fractions'],
    prerequisiteConceptIds: ['primes', 'divisibility', 'factorization', 'gcd'],
    relatedConceptIds: ['gcd', 'fractions', 'ratio'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 50,
    gradeRecommendation: 5,
    olympiadTopics: ['Number Theory'],
    learningObjectives: [
      'Calculate LCM using prime factorization',
      'Solve word problems involving periodic events',
      'Apply GCD × LCM = a × b relationship',
    ],
    exampleProblems: ['Lights A and B flash every 4 and 6 minutes. When do they flash together again?'],
    commonMistakes: ['Confusing LCM with GCD', 'Taking minimum exponents instead of maximum'],
    visualAids: ['venn-diagram-factors', 'number-line'],
    typicalSolutionMethods: ['Prime factorization union', 'Listing multiples'],
    formulaIds: ['gcd-lcm-relationship'],
    misconceptionIds: ['gcd-lcm-confusion'],
    skillIds: ['logical-deduction', 'arithmetic-accuracy'],
  },
  // ── FRACTIONS ──────────────────────────────────────────────────────────────
  {
    id: 'fractions',
    name: 'Fractions',
    description: 'Parts of a whole expressed as numerator over denominator.',
    parentConceptId: 'lcm',
    childConceptIds: ['ratio', 'decimals', 'percentages'],
    prerequisiteConceptIds: ['numbers', 'divisibility', 'gcd', 'lcm'],
    relatedConceptIds: ['ratio', 'proportion', 'decimals'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 90,
    gradeRecommendation: 4,
    olympiadTopics: ['Number Theory', 'Arithmetic'],
    learningObjectives: [
      'Simplify fractions using GCD',
      'Add, subtract, multiply, divide fractions',
      'Convert between fractions, decimals, percentages',
    ],
    exampleProblems: ['Simplify 48/72.', 'What is 2/3 + 3/4?'],
    commonMistakes: ['Adding numerators and denominators separately', 'Forgetting to simplify'],
    visualAids: ['fraction-bar', 'pie-chart'],
    typicalSolutionMethods: ['Find common denominator', 'Cross-multiplication'],
    formulaIds: ['fraction-operations'],
    misconceptionIds: ['fraction-addition-error'],
    skillIds: ['arithmetic-accuracy', 'algebraic-manipulation'],
  },
  {
    id: 'ratio',
    name: 'Ratio',
    description: 'A comparison between two quantities of the same kind.',
    parentConceptId: 'fractions',
    childConceptIds: ['proportion', 'rates'],
    prerequisiteConceptIds: ['fractions', 'gcd'],
    relatedConceptIds: ['proportion', 'fractions', 'percentages'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 60,
    gradeRecommendation: 5,
    olympiadTopics: ['Arithmetic'],
    learningObjectives: [
      'Express relationships as ratios in simplest form',
      'Divide quantities in given ratios',
      'Solve ratio word problems',
    ],
    exampleProblems: ['A bag has red and blue marbles in ratio 3:5. If there are 24 marbles total, how many are red?'],
    commonMistakes: ['Reversing ratio order', 'Not simplifying final ratio'],
    visualAids: ['bar-model', 'tape-diagram'],
    typicalSolutionMethods: ['Part-whole model', 'Unitary method'],
    formulaIds: [],
    misconceptionIds: ['ratio-order-confusion'],
    skillIds: ['algebraic-manipulation', 'logical-deduction'],
  },
  {
    id: 'proportion',
    name: 'Proportion',
    description: 'An equation stating that two ratios are equal.',
    parentConceptId: 'ratio',
    childConceptIds: ['similarity', 'percentage'],
    prerequisiteConceptIds: ['ratio', 'fractions'],
    relatedConceptIds: ['similarity', 'ratio', 'percentage'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 60,
    gradeRecommendation: 5,
    olympiadTopics: ['Arithmetic', 'Geometry'],
    learningObjectives: [
      'Identify direct and inverse proportion',
      'Solve proportion equations using cross-multiplication',
      'Apply proportion to scale drawings and maps',
    ],
    exampleProblems: ['If 5 books cost Rp 75,000, how much do 8 books cost?'],
    commonMistakes: ['Confusing direct with inverse proportion', 'Cross-multiplication errors'],
    visualAids: ['double-number-line'],
    typicalSolutionMethods: ['Cross-multiplication', 'Unitary method'],
    formulaIds: ['proportion-formula'],
    misconceptionIds: ['direct-inverse-confusion'],
    skillIds: ['algebraic-manipulation', 'logical-deduction'],
  },
  // ── ALGEBRA ────────────────────────────────────────────────────────────────
  {
    id: 'algebra',
    name: 'Algebra Fundamentals',
    description: 'Using variables and equations to represent and solve mathematical relationships.',
    parentConceptId: null,
    childConceptIds: ['linear-equations', 'expressions', 'sequences'],
    prerequisiteConceptIds: ['numbers', 'fractions'],
    relatedConceptIds: ['numbers', 'proportion'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 90,
    gradeRecommendation: 5,
    olympiadTopics: ['Algebra'],
    learningObjectives: [
      'Understand variables as unknowns',
      'Write and evaluate algebraic expressions',
      'Solve simple one-variable equations',
    ],
    exampleProblems: ['If 3x + 7 = 22, find x.'],
    commonMistakes: ['Wrong sign when moving terms', 'Treating variable as a label not a number'],
    visualAids: ['balance-scale-diagram'],
    typicalSolutionMethods: ['Inverse operations', 'Balance method'],
    formulaIds: [],
    misconceptionIds: ['variable-confusion', 'sign-error'],
    skillIds: ['algebraic-manipulation', 'logical-deduction'],
  },
  {
    id: 'sequences',
    name: 'Number Sequences & Patterns',
    description: 'Ordered lists of numbers following a rule or pattern.',
    parentConceptId: 'algebra',
    childConceptIds: ['arithmetic-sequences', 'geometric-sequences'],
    prerequisiteConceptIds: ['numbers', 'algebra'],
    relatedConceptIds: ['algebra', 'primes'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 60,
    gradeRecommendation: 5,
    olympiadTopics: ['Algebra', 'Number Theory'],
    learningObjectives: [
      'Identify arithmetic and geometric sequences',
      'Find the nth term of a sequence',
      'Predict missing terms',
    ],
    exampleProblems: ['Find the 20th term: 3, 7, 11, 15, ...'],
    commonMistakes: ['Off-by-one errors in nth term', 'Confusing common difference with common ratio'],
    visualAids: ['sequence-diagram'],
    typicalSolutionMethods: ['Pattern recognition', 'Formula application'],
    formulaIds: ['arithmetic-sequence-formula'],
    misconceptionIds: ['sequence-type-confusion'],
    skillIds: ['pattern-recognition', 'algebraic-manipulation'],
  },
  // ── GEOMETRY ───────────────────────────────────────────────────────────────
  {
    id: 'geometry',
    name: 'Geometry',
    description: 'Study of shapes, sizes, positions, and properties of figures.',
    parentConceptId: null,
    childConceptIds: ['perimeter', 'area', 'volume', 'angles', 'similarity'],
    prerequisiteConceptIds: ['numbers', 'fractions'],
    relatedConceptIds: ['proportion', 'algebra'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 120,
    gradeRecommendation: 4,
    olympiadTopics: ['Geometry'],
    learningObjectives: [
      'Identify properties of 2D and 3D shapes',
      'Calculate perimeter, area, and volume',
      'Understand angle relationships',
    ],
    exampleProblems: ['A rectangle has perimeter 36 cm. If length is 10 cm, find its area.'],
    commonMistakes: ['Confusing perimeter with area', 'Using wrong formula for shape'],
    visualAids: ['geometric-figures', 'coordinate-plane'],
    typicalSolutionMethods: ['Formula application', 'Decomposition', 'Drawing diagram'],
    formulaIds: ['area-rectangle', 'area-triangle', 'area-circle', 'pythagorean-theorem'],
    misconceptionIds: ['area-perimeter-confusion', 'wrong-area-formula'],
    skillIds: ['visualization', 'geometric-reasoning', 'arithmetic-accuracy'],
  },
  {
    id: 'area',
    name: 'Area of Plane Figures',
    description: 'Measurement of the surface enclosed by a 2D figure.',
    parentConceptId: 'geometry',
    childConceptIds: ['volume'],
    prerequisiteConceptIds: ['geometry', 'fractions', 'algebra'],
    relatedConceptIds: ['perimeter', 'volume'],
    difficulty: 'MEDIUM',
    estimatedLearningMinutes: 75,
    gradeRecommendation: 4,
    olympiadTopics: ['Geometry'],
    learningObjectives: [
      'Apply area formulas for rectangles, triangles, circles, trapezoids',
      'Find area of composite figures by decomposition',
      'Solve optimization problems involving area',
    ],
    exampleProblems: [
      'A triangle has base 8 cm and height 5 cm. Find its area.',
      'A square is inscribed in a circle with radius 5 cm. Find the shaded area.',
    ],
    commonMistakes: ['Using diameter instead of radius for circles', 'Forgetting to divide by 2 for triangles'],
    visualAids: ['area-decomposition-diagram'],
    typicalSolutionMethods: ['Formula application', 'Decompose into simpler shapes', 'Subtract areas'],
    formulaIds: ['area-rectangle', 'area-triangle', 'area-circle', 'area-trapezoid'],
    misconceptionIds: ['area-perimeter-confusion', 'wrong-area-formula'],
    skillIds: ['visualization', 'geometric-reasoning', 'arithmetic-accuracy'],
  },
  // ── COMBINATORICS ──────────────────────────────────────────────────────────
  {
    id: 'combinatorics',
    name: 'Combinatorics & Counting',
    description: 'Methods for counting arrangements and selections.',
    parentConceptId: null,
    childConceptIds: ['permutations', 'combinations', 'pigeonhole'],
    prerequisiteConceptIds: ['numbers', 'algebra'],
    relatedConceptIds: ['probability', 'logic'],
    difficulty: 'HARD',
    estimatedLearningMinutes: 120,
    gradeRecommendation: 5,
    olympiadTopics: ['Combinatorics'],
    learningObjectives: [
      'Apply multiplication and addition principles',
      'Count permutations and combinations',
      'Solve systematic listing problems',
    ],
    exampleProblems: ['How many 3-digit numbers can be formed from {1,2,3,4} with no repetition?'],
    commonMistakes: ['Counting duplicates', 'Confusing permutation with combination'],
    visualAids: ['tree-diagram', 'table-diagram'],
    typicalSolutionMethods: ['Systematic listing', 'Multiplication principle', 'Complementary counting'],
    formulaIds: ['permutation-formula', 'combination-formula'],
    misconceptionIds: ['double-counting', 'perm-comb-confusion'],
    skillIds: ['counting-strategies', 'logical-deduction', 'multi-step-reasoning'],
  },
  // ── LOGIC ──────────────────────────────────────────────────────────────────
  {
    id: 'logic',
    name: 'Mathematical Logic & Reasoning',
    description: 'Using deductive and inductive reasoning to solve problems.',
    parentConceptId: null,
    childConceptIds: ['pigeonhole', 'proof-by-contradiction'],
    prerequisiteConceptIds: ['numbers'],
    relatedConceptIds: ['combinatorics', 'algebra'],
    difficulty: 'HARD',
    estimatedLearningMinutes: 90,
    gradeRecommendation: 5,
    olympiadTopics: ['Logic'],
    learningObjectives: [
      'Apply deductive reasoning to eliminate possibilities',
      'Construct logical chains of reasoning',
      'Recognize fallacies and invalid arguments',
    ],
    exampleProblems: ['In a class of 13 students, prove at least 2 share the same birth month.'],
    commonMistakes: ['Assuming conclusion without proof', 'Missing edge cases'],
    visualAids: ['truth-table', 'logic-grid'],
    typicalSolutionMethods: ['Case analysis', 'Logical elimination', 'Proof by contradiction'],
    formulaIds: [],
    misconceptionIds: ['assumption-error', 'case-missing'],
    skillIds: ['logical-deduction', 'proof-thinking', 'multi-step-reasoning'],
  },
];

// Build lookup maps
const conceptById = new Map<string, Concept>(CONCEPTS.map((c) => [c.id, c]));
const conceptByName = new Map<string, Concept>(CONCEPTS.map((c) => [c.name.toLowerCase(), c]));

export class ConceptGraphService implements ConceptService {
  getById(id: string): Concept | null {
    return conceptById.get(id) ?? null;
  }

  getAll(): Concept[] {
    return CONCEPTS;
  }

  getChildren(conceptId: string): Concept[] {
    const concept = conceptById.get(conceptId);
    if (!concept) return [];
    return concept.childConceptIds.map((id) => conceptById.get(id)).filter(Boolean) as Concept[];
  }

  getPrerequisites(conceptId: string): Concept[] {
    const concept = conceptById.get(conceptId);
    if (!concept) return [];
    return concept.prerequisiteConceptIds.map((id) => conceptById.get(id)).filter(Boolean) as Concept[];
  }

  getRelated(conceptId: string): Concept[] {
    const concept = conceptById.get(conceptId);
    if (!concept) return [];
    return concept.relatedConceptIds.map((id) => conceptById.get(id)).filter(Boolean) as Concept[];
  }

  findByName(name: string): Concept | null {
    return conceptByName.get(name.toLowerCase()) ?? null;
  }

  getByTopic(olympiadTopic: string): Concept[] {
    return CONCEPTS.filter((c) => c.olympiadTopics.includes(olympiadTopic));
  }
}
