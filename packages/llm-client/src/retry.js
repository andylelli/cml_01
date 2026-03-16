/**
 * Retry logic with exponential backoff
 */
export const defaultRetryConfig = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    retryableErrors: [
        "rate_limit_exceeded",
        "timeout",
        "service_unavailable",
        "connection_error",
        "429", // Too Many Requests
        "503", // Service Unavailable
        "ECONNRESET",
        "ETIMEDOUT",
    ],
};
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isRetryableError(error, retryableErrors) {
    const errorString = error.message.toLowerCase();
    return retryableErrors.some((retryableError) => errorString.includes(retryableError.toLowerCase()));
}
export async function withRetry(fn, config = defaultRetryConfig) {
    let lastError;
    let delay = config.initialDelayMs;
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            // Check if error is retryable
            if (!isRetryableError(lastError, config.retryableErrors)) {
                throw lastError;
            }
            // Last attempt - throw
            if (attempt >= config.maxAttempts) {
                throw new Error(`Max retry attempts (${config.maxAttempts}) exceeded: ${lastError.message}`);
            }
            // Wait before retry with exponential backoff
            await sleep(Math.min(delay, config.maxDelayMs));
            delay *= config.backoffMultiplier;
        }
    }
    throw lastError;
}
/**
 * Circuit breaker to prevent cascading failures
 */
export class CircuitBreaker {
    failureThreshold;
    resetTimeoutMs;
    failureCount = 0;
    lastFailureTime = 0;
    state = "closed";
    constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }
    async execute(fn) {
        if (this.state === "open") {
            if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.state = "half-open";
            }
            else {
                throw new Error("Circuit breaker is OPEN - service temporarily unavailable");
            }
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        this.state = "closed";
    }
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = "open";
        }
    }
    getState() {
        return this.state;
    }
    reset() {
        this.failureCount = 0;
        this.state = "closed";
        this.lastFailureTime = 0;
    }
}
//# sourceMappingURL=retry.js.map