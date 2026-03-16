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
export declare function createTest(name: string, category: TestCategory, passed: boolean, score: number, weight?: number, message?: string, severity?: Severity): TestResult;
/**
 * Create a passing test with full score
 */
export declare function pass(name: string, category: TestCategory, weight?: number, message?: string): TestResult;
/**
 * Create a failing test with zero score
 */
export declare function fail(name: string, category: TestCategory, weight: number | undefined, message: string, severity?: Severity): TestResult;
/**
 * Create a partial score test
 */
export declare function partial(name: string, category: TestCategory, score: number, weight?: number, message?: string, severity?: Severity): TestResult;
/**
 * Check if value exists and is not empty
 */
export declare function exists(value: any): boolean;
/**
 * Check if array has minimum length
 */
export declare function hasMinLength<T>(arr: T[] | undefined, min: number): boolean;
/**
 * Check if array has maximum length
 */
export declare function hasMaxLength<T>(arr: T[] | undefined, max: number): boolean;
/**
 * Check if value is within range
 */
export declare function inRange(value: number | undefined, min: number, max: number): boolean;
/**
 * Check if string meets minimum word count
 */
export declare function hasMinWords(text: string | undefined, min: number): boolean;
/**
 * Check if all required fields exist in object
 */
export declare function hasRequiredFields<T extends object>(obj: T | undefined, fields: (keyof T)[]): boolean;
/**
 * Calculate weighted average score from tests
 */
export declare function calculateWeightedScore(tests: TestResult[]): number;
/**
 * Calculate score for a specific category
 */
export declare function calculateCategoryScore(tests: TestResult[], category: TestCategory): number;
/**
 * Get all failed tests
 */
export declare function getFailedTests(tests: TestResult[]): TestResult[];
/**
 * Get critical failures
 */
export declare function getCriticalFailures(tests: TestResult[]): TestResult[];
/**
 * Check if any critical tests failed
 */
export declare function hasCriticalFailures(tests: TestResult[]): boolean;
/**
 * Calculate pass rate (percentage of passing tests)
 */
export declare function calculatePassRate(tests: TestResult[]): number;
/**
 * Validate required schema fields
 */
export declare function validateSchema<T extends object>(obj: T | undefined, requiredFields: (keyof T)[], category?: TestCategory, weight?: number): TestResult[];
/**
 * Score text quality based on length and content
 */
export declare function scoreTextQuality(text: string | undefined, minWords: number, idealWords: number, name: string, category?: TestCategory): TestResult;
/**
 * Score array completeness
 */
export declare function scoreArrayCompleteness<T>(arr: T[] | undefined, min: number, ideal: number, name: string, category?: TestCategory): TestResult;
/**
 * Check for duplicates in array
 */
export declare function checkDuplicates<T>(arr: T[], getName: (item: T) => string, testName: string, category?: TestCategory): TestResult;
/**
 * Score consistency between related values
 */
export declare function scoreConsistency(value1: any, value2: any, name: string, message: string): TestResult;
