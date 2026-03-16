/**
 * Validation Retry Wrapper
 *
 * Generic utility for agents to retry generation when validation fails.
 * Prevents malformed artifacts from entering the pipeline.
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
}
export interface RetryConfig<T> {
    maxAttempts: number;
    agentName: string;
    validationFn: (data: T) => ValidationResult;
    generateFn: (attempt: number, previousErrors?: string[]) => Promise<{
        result: T;
        cost: number;
    }>;
}
export interface RetryResult<T> {
    result: T;
    totalCost: number;
    attempts: number;
    validationResult: ValidationResult;
    retryHistory: Array<{
        attempt: number;
        errors: string[];
        warnings: string[];
    }>;
}
/**
 * Wraps an agent generation function with validation and retry logic.
 *
 * @param config - Configuration with validation function, generation function, and retry limits
 * @returns Result with validated data, cost tracking, and retry history
 *
 * @example
 * ```typescript
 * const result = await withValidationRetry({
 *   maxAttempts: 2,
 *   agentName: "Agent 2b",
 *   validationFn: (data) => validateArtifact("character_profiles", data),
 *   generateFn: async (attempt, previousErrors) => {
 *     const result = await llmClient.chat(...);
 *     return { result: parsed, cost: result.cost };
 *   }
 * });
 * ```
 */
export declare function withValidationRetry<T>(config: RetryConfig<T>): Promise<RetryResult<T>>;
/**
 * Helper to build validation feedback prompt
 *
 * @param previousErrors - Errors from previous validation attempt
 * @returns Formatted error feedback for LLM prompt
 */
export declare function buildValidationFeedback(previousErrors?: string[]): string;
