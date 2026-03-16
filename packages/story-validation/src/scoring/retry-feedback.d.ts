import type { PhaseScore, TestResult } from './types.js';
/**
 * Builds detailed retry feedback for LLM based on scoring failure
 */
export declare function buildRetryFeedback(score: PhaseScore, attemptNumber: number): string;
/**
 * Get top N failed tests for concise feedback
 */
export declare function getTopFailures(tests: TestResult[], maxCount?: number): TestResult[];
/**
 * Build concise feedback for retry (shorter version)
 */
export declare function buildConciseRetryFeedback(score: PhaseScore, attemptNumber: number): string;
