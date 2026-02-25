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
 * Check if array has minimum length
 */
export function hasMinLength<T>(arr: T[] | undefined, min: number): boolean {
  return Array.isArray(arr) && arr.length >= min;
}

/**
 * Check if array has maximum length
 */
export function hasMaxLength<T>(arr: T[] | undefined, max: number): boolean {
  return Array.isArray(arr) && arr.length <= max;
}

/**
 * Check if value is within range
 */
export function inRange(value: number | undefined, min: number, max: number): boolean {
  return value !== undefined && value >= min && value <= max;
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
 * Check if all required fields exist in object
 */
export function hasRequiredFields<T extends object>(
  obj: T | undefined,
  fields: (keyof T)[]
): boolean {
  if (!obj) return false;
  return fields.every(field => exists(obj[field]));
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
 * Get all failed tests
 */
export function getFailedTests(tests: TestResult[]): TestResult[] {
  return tests.filter(t => !t.passed);
}

/**
 * Get critical failures
 */
export function getCriticalFailures(tests: TestResult[]): TestResult[] {
  return tests.filter(t => !t.passed && t.severity === 'critical');
}

/**
 * Check if any critical tests failed
 */
export function hasCriticalFailures(tests: TestResult[]): boolean {
  return getCriticalFailures(tests).length > 0;
}

/**
 * Calculate pass rate (percentage of passing tests)
 */
export function calculatePassRate(tests: TestResult[]): number {
  if (tests.length === 0) return 100;
  const passed = tests.filter(t => t.passed).length;
  return (passed / tests.length) * 100;
}

/**
 * Validate required schema fields
 */
export function validateSchema<T extends object>(
  obj: T | undefined,
  requiredFields: (keyof T)[],
  category: TestCategory = 'validation',
  weight: number = 1.0
): TestResult[] {
  const tests: TestResult[] = [];
  
  if (!obj) {
    tests.push(
      fail(
        'Object exists',
        category,
        weight,
        'Required object is null or undefined',
        'critical'
      )
    );
    return tests;
  }
  
  for (const field of requiredFields) {
    const value = obj[field];
    if (!exists(value)) {
      tests.push(
        fail(
          `Field: ${String(field)}`,
          category,
          weight / requiredFields.length,
          `Required field "${String(field)}" is missing or empty`,
          'major'
        )
      );
    } else {
      tests.push(
        pass(
          `Field: ${String(field)}`,
          category,
          weight / requiredFields.length,
          `Field "${String(field)}" is present`
        )
      );
    }
  }
  
  return tests;
}

/**
 * Score text quality based on length and content
 */
export function scoreTextQuality(
  text: string | undefined,
  minWords: number,
  idealWords: number,
  name: string,
  category: TestCategory = 'quality'
): TestResult {
  if (!text || text.trim().length === 0) {
    return fail(name, category, 1.0, 'Text is empty', 'major');
  }
  
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  if (wordCount < minWords) {
    const score = Math.max(0, (wordCount / minWords) * 60);
    return partial(
      name,
      category,
      score,
      1.0,
      `Text is too short (${wordCount}/${minWords} words)`,
      'minor'
    );
  }
  
  if (wordCount >= idealWords) {
    return pass(name, category, 1.0, `Text quality good (${wordCount} words)`);
  }
  
  // Between min and ideal: scale from 60 to 100
  const score = 60 + ((wordCount - minWords) / (idealWords - minWords)) * 40;
  return partial(
    name,
    category,
    Math.round(score),
    1.0,
    `Text quality acceptable (${wordCount} words)`
  );
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

/**
 * Score consistency between related values
 */
export function scoreConsistency(
  value1: any,
  value2: any,
  name: string,
  message: string
): TestResult {
  const matches = JSON.stringify(value1) === JSON.stringify(value2);
  
  if (matches) {
    return pass(name, 'consistency', 1.0, message);
  }
  
  return fail(
    name,
    'consistency',
    1.0,
    `${message} - values are inconsistent`,
    'minor'
  );
}
