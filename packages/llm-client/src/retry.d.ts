/**
 * Retry logic with exponential backoff
 */
import type { RetryConfig } from "./types.js";
export declare const defaultRetryConfig: RetryConfig;
export declare function isRetryableError(error: Error, retryableErrors: string[]): boolean;
export declare function withRetry<T>(fn: () => Promise<T>, config?: RetryConfig): Promise<T>;
/**
 * Circuit breaker to prevent cascading failures
 */
export declare class CircuitBreaker {
    private failureThreshold;
    private resetTimeoutMs;
    private failureCount;
    private lastFailureTime;
    private state;
    constructor(failureThreshold?: number, resetTimeoutMs?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    getState(): "closed" | "open" | "half-open";
    reset(): void;
}
