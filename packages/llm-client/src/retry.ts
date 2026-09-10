/**
 * Retry logic with exponential backoff
 */

import type { RetryConfig } from "./types.js";

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 4,
  initialDelayMs: 1500,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  // A_86 item 3 — 8 attempts and a 120s ceiling for 429 ONLY. MEASURED on run 24901: the generic
  // budget gave chapter 10 four attempts inside 14 seconds, and the fallback then shipped a draft
  // the validator had already rejected twice. Waiting costs wall-clock and nothing else.
  rateLimitMaxAttempts: 8,
  rateLimitMaxDelayMs: 120000,
  retryableErrors: [
    "rate_limit_exceeded",
    "timeout",
    "service_unavailable",
    "connection_error",
    /**
     * A_86 item 1 — the SDK writes "Connection error." with a SPACE; the underscored entry above
     * can never match it. MEASURED on run 24901: the Anthropic polish call for chapter 3 failed
     * with `Connection error.` and was thrown as non-retryable, so that chapter shipped unpolished
     * while the run was billed for the attempt. (`maxRetries: 0` on the Anthropic SDK client is
     * deliberate and correct — both clients wrap `chatOnce` in `withRetry`, so the SDK must not
     * retry underneath us. The defect was purely this vocabulary gap.)
     */
    "connection error",
    /**
     * undici's message for a transport failure. MEASURED across the last four runs: 2 of 12 prose
     * retries were triggered by `fetch failed` reaching the chapter validator as a CONTENT failure
     * — a 30k-token regeneration bought by a network hiccup (A_86 item 4 is the second half of
     * that fix). ECONNRESET / ETIMEDOUT / EAI_AGAIN / ENOTFOUND were already listed below.
     */
    "fetch failed",
    "socket hang up",
    "server had an error", // OpenAI 500 — transient server-side failure
    "the server had an error", // OpenAI 500 variant
    "429", // Too Many Requests
    "500", // Internal Server Error
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

/**
 * A_86 items 2-3 — a rate-limit error, by the transport's `code` or by message.
 *
 * `AzureHttpError` stamps `code = "429"` and puts the raw body in the message, so both routes are
 * checked. Deliberately narrow: only a 429 earns the larger attempt budget and the longer ceiling.
 */
export function isRateLimitError(error: Error): boolean {
  const code = (error as unknown as { code?: string }).code;
  if (code === "429") return true;
  const message = error.message.toLowerCase();
  return (
    message.includes("429") ||
    message.includes("rate_limit_exceeded") ||
    message.includes("too many requests")
  );
}

/**
 * A_86 item 2 — a server-supplied `Retry-After`, in ms, or null.
 *
 * Azure answers a 429 with how long to wait. Ignoring it and backing off on our own schedule is how
 * run 24901 spent four attempts in 14 seconds against a limit that wanted longer, exhausted the
 * budget, and fell back to a chapter-10 draft the validator had already rejected twice. (A_85 F2
 * repairs such a draft; this stops it being reached.)
 */
export function readRetryAfterMs(error: Error): number | null {
  const raw = (error as unknown as { retryAfterMs?: unknown }).retryAfterMs;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return raw;
  return null;
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

function getRetryDelayMs(
  error: Error,
  baseDelayMs: number,
  maxDelayMs: number,
  rateLimitMaxDelayMs?: number,
): number {
  // A_86 items 2-3 — a rate-limit error gets its own ceiling, and the server's own number wins
  // inside it. Padded slightly: retrying on the exact boundary is how a second 429 is earned.
  if (isRateLimitError(error)) {
    const cap = Math.max(maxDelayMs, rateLimitMaxDelayMs ?? maxDelayMs);
    const retryAfterMs = readRetryAfterMs(error);
    if (retryAfterMs !== null) return Math.min(retryAfterMs + 250, cap);
    return addJitter(Math.min(Math.max(baseDelayMs, 1000), cap), 0.2);
  }
  const boundedBaseDelay = Math.min(baseDelayMs, maxDelayMs);

  // DNS outages often clear after several seconds, so avoid immediate tight retries.
  if (isDnsResolutionError(error)) {
    const dnsFloorDelay = Math.min(maxDelayMs, Math.max(3000, boundedBaseDelay * 2));
    return addJitter(dnsFloorDelay, 0.2);
  }

  return addJitter(boundedBaseDelay, 0.2);
}

/**
 * A_86 item 4 — is this message a TRANSPORT failure rather than a CONTENT failure?
 *
 * Built on the same `retryableErrors` vocabulary as `isRetryableError`, deliberately: two lists that
 * answer "is this the network's fault" would be the divergence shape WF-002 names, and this one feeds
 * a WRITE (whether a 30k-token content retry is spent). It matches a wrapped message too —
 * `Max retry attempts (4) exceeded: fetch failed` still contains the marker.
 *
 * A false positive costs ONE extra identical request before normal handling resumes, which is why
 * the caller also bounds its re-issues.
 */
export function isTransportFailureMessage(
  message: string,
  retryableErrors: string[] = defaultRetryConfig.retryableErrors,
): boolean {
  return isRetryableError(new Error(String(message ?? "")), retryableErrors);
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

  // A_86 item 3 — the loop admits the LARGEST budget any error class may earn; the per-error
  // check inside decides when to actually stop. Raising only the inner bound would be a no-op.
  const attemptCeiling = Math.max(config.maxAttempts, config.rateLimitMaxAttempts ?? 0);
  for (let attempt = 1; attempt <= attemptCeiling; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (!isRetryableError(lastError, config.retryableErrors)) {
        throw lastError;
      }

      // A_86 item 3 — a 429 is the one retryable class where waiting is guaranteed to help, so it
      // gets its own budget. Every other class keeps the original 4.
      const effectiveMaxAttempts = isRateLimitError(lastError)
        ? Math.max(config.maxAttempts, config.rateLimitMaxAttempts ?? config.maxAttempts)
        : config.maxAttempts;

      // Last attempt - throw
      if (attempt >= effectiveMaxAttempts) {
        throw new Error(
          `Max retry attempts (${effectiveMaxAttempts}) exceeded: ${lastError.message}`
        );
      }

      // Wait before retry with exponential backoff and jitter.
      const delayMs = getRetryDelayMs(lastError, delay, config.maxDelayMs, config.rateLimitMaxDelayMs);
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
