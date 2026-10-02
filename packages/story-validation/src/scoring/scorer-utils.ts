import { TestResult } from './types.js';

/**
 * Utility functions for building scorers
 * Provides helpers for creating tests, calculating scores, and common validation patterns
 */

/**
 * Test severity levels
 */
export type Severity = 'critical' | 'major' | 'minor';

/**
 * Test category types
 */
export type TestCategory = 'validation' | 'quality' | 'completeness' | 'consistency';

/**
 * Create a test result
 */
export function createTest(
  name: string,
  category: TestCategory,
  passed: boolean,
  score: number,
  weight: number = 1.0,
  message?: string,
  severity?: Severity
): TestResult {
  return {
    name,
    category,
    passed,
    score,
    weight,
    message,
    severity,
  };
}

/**
 * Create a passing test with full score
 */
export function pass(
  name: string,
  category: TestCategory,
  weight: number = 1.0,
  message?: string
): TestResult {
  return createTest(name, category, true, 100, weight, message);
}

/**
 * Create a failing test with zero score
 */
export function fail(
  name: string,
  category: TestCategory,
  weight: number = 1.0,
  message: string,
  severity: Severity = 'major'
): TestResult {
  return createTest(name, category, false, 0, weight, message, severity);
}

/**
 * Create a partial score test
 */
export function partial(
  name: string,
  category: TestCategory,
  score: number,
  weight: number = 1.0,
  message?: string,
  severity?: Severity
): TestResult {
  return createTest(
    name,
    category,
    score >= 60, // Pass if >= 60
    score,
    weight,
    message,
    severity
  );
}

/**
 * Check if value exists and is not empty
 */
export function exists(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

/**
 * Check if string meets minimum word count
 */
export function hasMinWords(text: string | undefined, min: number): boolean {
  if (!text) return false;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length >= min;
}

/**
 * Calculate weighted average score from tests
 */
export function calculateWeightedScore(tests: TestResult[]): number {
  if (tests.length === 0) return 0;
  
  const totalWeight = tests.reduce((sum, test) => sum + test.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = tests.reduce(
    (sum, test) => sum + test.score * test.weight,
    0
  );
  
  return weightedSum / totalWeight;
}

/**
 * Calculate score for a specific category
 */
export function calculateCategoryScore(
  tests: TestResult[],
  category: TestCategory
): number {
  const categoryTests = tests.filter(t => t.category === category);
  return calculateWeightedScore(categoryTests);
}

/**
 * Get critical failures
 */
export function getCriticalFailures(tests: TestResult[]): TestResult[] {
  return tests.filter(t => !t.passed && t.severity === 'critical');
}

/**
 * Score array completeness
 */
export function scoreArrayCompleteness<T>(
  arr: T[] | undefined,
  min: number,
  ideal: number,
  name: string,
  category: TestCategory = 'completeness'
): TestResult {
  if (!arr || arr.length === 0) {
    return fail(name, category, 1.0, 'Array is empty', 'major');
  }
  
  const count = arr.length;
  
  if (count < min) {
    const score = Math.max(0, (count / min) * 60);
    return partial(
      name,
      category,
      score,
      1.0,
      `Insufficient items (${count}/${min})`,
      'minor'
    );
  }
  
  if (count >= ideal) {
    return pass(name, category, 1.0, `Complete (${count} items)`);
  }
  
  // Between min and ideal: scale from 60 to 100
  const score = 60 + ((count - min) / (ideal - min)) * 40;
  return partial(
    name,
    category,
    Math.round(score),
    1.0,
    `Acceptable (${count} items)`
  );
}

/**
 * Check for duplicates in array
 */
export function checkDuplicates<T>(
  arr: T[],
  getName: (item: T) => string,
  testName: string,
  category: TestCategory = 'validation'
): TestResult {
  const names = arr.map(getName);
  const duplicates = names.filter(
    (name, index) => names.indexOf(name) !== index
  );
  
  if (duplicates.length > 0) {
    return fail(
      testName,
      category,
      1.0,
      `Duplicate entries found: ${[...new Set(duplicates)].join(', ')}`,
      'major'
    );
  }
  
  return pass(testName, category, 1.0, 'No duplicates found');
}

