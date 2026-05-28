/**
 * Retry logic with exponential backoff
 */

import type { RetryConfig } from "./types.js";

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 4,
  initialDelayMs: 1500,
  maxDelayMs: 30000,
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
    "EAI_AGAIN", // DNS temporary failure
    "ENOTFOUND", // DNS lookup failure — transient when Azure endpoint is briefly unreachable
  ],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addJitter(delayMs: number, jitterRatio = 0.25): number {
  const minMultiplier = Math.max(0.1, 1 - jitterRatio);
  const maxMultiplier = 1 + jitterRatio;
  const multiplier = minMultiplier + Math.random() * (maxMultiplier - minMultiplier);
  return Math.max(1, Math.floor(delayMs * multiplier));
}

function isDnsResolutionError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("enotfound") ||
    message.includes("eai_again") ||
    message.includes("getaddrinfo") ||
    message.includes("dns")
  );
}

function getRetryDelayMs(error: Error, baseDelayMs: number, maxDelayMs: number): number {
  const boundedBaseDelay = Math.min(baseDelayMs, maxDelayMs);

  // DNS outages often clear after several seconds, so avoid immediate tight retries.
  if (isDnsResolutionError(error)) {
    const dnsFloorDelay = Math.min(maxDelayMs, Math.max(3000, boundedBaseDelay * 2));
    return addJitter(dnsFloorDelay, 0.2);
  }

  return addJitter(boundedBaseDelay, 0.2);
}

export function isRetryableError(error: Error, retryableErrors: string[]): boolean {
  const errorString = error.message.toLowerCase();
  return retryableErrors.some((retryableError) =>
    errorString.includes(retryableError.toLowerCase())
  );
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  let lastError: Error;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (!isRetryableError(lastError, config.retryableErrors)) {
        throw lastError;
      }

      // Last attempt - throw
      if (attempt >= config.maxAttempts) {
        throw new Error(
          `Max retry attempts (${config.maxAttempts}) exceeded: ${lastError.message}`
        );
      }

      // Wait before retry with exponential backoff and jitter.
      const delayMs = getRetryDelayMs(lastError, delay, config.maxDelayMs);
      await sleep(delayMs);
      delay *= config.backoffMultiplier;
    }
  }

  throw lastError!;
}

/**
 * Circuit breaker to prevent cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private failureThreshold = 5,
    private resetTimeoutMs = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit breaker is OPEN - service temporarily unavailable");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = "closed";
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): "closed" | "open" | "half-open" {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.state = "closed";
    this.lastFailureTime = 0;
  }
}
