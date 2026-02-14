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
  generateFn: (attempt: number, previousErrors?: string[]) => Promise<{ result: T; cost: number }>;
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
export async function withValidationRetry<T>(
  config: RetryConfig<T>
): Promise<RetryResult<T>> {
  const { maxAttempts, agentName, validationFn, generateFn } = config;
  
  let totalCost = 0;
  const retryHistory: Array<{ attempt: number; errors: string[]; warnings: string[] }> = [];
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const previousErrors = retryHistory.length > 0 
      ? retryHistory[retryHistory.length - 1].errors 
      : undefined;
    
    // Generate result
    const { result, cost } = await generateFn(attempt, previousErrors);
    totalCost += cost;
    
    // Validate result
    const validation = validationFn(result);
    
    // Record attempt
    retryHistory.push({
      attempt,
      errors: validation.errors,
      warnings: validation.warnings || [],
    });
    
    // Success case
    if (validation.valid) {
      console.log(
        `[${agentName}] Validation passed on attempt ${attempt}/${maxAttempts}` +
        (validation.warnings && validation.warnings.length > 0 
          ? ` (with ${validation.warnings.length} warnings)` 
          : "")
      );
      
      return {
        result,
        totalCost,
        attempts: attempt,
        validationResult: validation,
        retryHistory,
      };
    }
    
    // Failure case - log and retry if attempts remain
    console.warn(
      `[${agentName}] Validation failed on attempt ${attempt}/${maxAttempts}: ` +
      `${validation.errors.length} error(s)`
    );
    
    if (attempt < maxAttempts) {
      console.log(`[${agentName}] Retrying with validation feedback...`);
      console.log(`[${agentName}] Previous errors:`, validation.errors.slice(0, 5));
    }
  }
  
  // All attempts exhausted
  const finalAttempt = retryHistory[retryHistory.length - 1];
  console.error(
    `[${agentName}] Validation failed after ${maxAttempts} attempts. ` +
    `Returning last result with ${finalAttempt.errors.length} error(s).`
  );
  
  // Return the last attempt's result even though it's invalid
  // The caller can decide whether to use it or abort
  const { result, cost } = await generateFn(maxAttempts, finalAttempt.errors);
  
  return {
    result,
    totalCost: totalCost + cost,
    attempts: maxAttempts,
    validationResult: {
      valid: false,
      errors: finalAttempt.errors,
      warnings: finalAttempt.warnings,
    },
    retryHistory,
  };
}

/**
 * Helper to build validation feedback prompt
 * 
 * @param previousErrors - Errors from previous validation attempt
 * @returns Formatted error feedback for LLM prompt
 */
export function buildValidationFeedback(previousErrors?: string[]): string {
  if (!previousErrors || previousErrors.length === 0) {
    return "";
  }
  
  return `\n\nIMPORTANT: Your previous response had validation errors. Please fix these issues:\n${previousErrors.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\nEnsure all fields match the required schema exactly.`;
}
