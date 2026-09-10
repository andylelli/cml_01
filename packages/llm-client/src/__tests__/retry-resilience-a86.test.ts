/**
 * A_86 items 1-3 — the transport must not turn a network hiccup into a content retry, and a 429
 * must be waited out rather than exhausted.
 *
 * MEASURED on run 24901 and the three runs before it:
 *   • 2 of 12 prose retries were triggered by `fetch failed` reaching the chapter validator as a
 *     content failure — a 30k-token regeneration bought by a network error.
 *   • the Anthropic polish call for chapter 3 failed with `Connection error.` and was thrown as
 *     NON-retryable, because the vocabulary listed `connection_error` with an underscore.
 *   • chapter 10 met an Azure 429, spent four attempts inside 14 seconds, exhausted the budget and
 *     fell back to a draft the validator had already rejected twice.
 *
 * These tests run against the real `withRetry`, the real vocabulary and the real transport parser.
 */

import { describe, expect, it, vi } from "vitest";
import {
  defaultRetryConfig,
  isRateLimitError,
  isRetryableError,
  readRetryAfterMs,
  withRetry,
} from "../retry.js";
import { AzureHttpError, parseRetryAfterMs } from "../azure-http-transport.js";

const err = (message: string, extra: Record<string, unknown> = {}) => Object.assign(new Error(message), extra);

describe("A_86 item 1 — the retryable vocabulary covers the messages that actually arrived", () => {
  it("`fetch failed` is retryable (it reached the chapter validator as a content failure)", () => {
    expect(isRetryableError(err("fetch failed"), defaultRetryConfig.retryableErrors)).toBe(true);
  });

  it("`Connection error.` — the SDK's spaced form — is retryable (the underscored entry never matched it)", () => {
    expect(isRetryableError(err("Connection error."), defaultRetryConfig.retryableErrors)).toBe(true);
  });

  it("`socket hang up` is retryable", () => {
    expect(isRetryableError(err("socket hang up"), defaultRetryConfig.retryableErrors)).toBe(true);
  });

  it("the codes that were ALREADY listed still match (no regression)", () => {
    for (const m of ["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND", "429", "503"]) {
      expect(isRetryableError(err(m), defaultRetryConfig.retryableErrors)).toBe(true);
    }
  });

  it("a CONTENT failure is still not retryable — the widening must not swallow real errors", () => {
    for (const m of [
      "Chapter 9 may be missing the discriminating test scene",
      "VICTIM ALIVE: Adela Ashgrove insisted on cross-checking",
      "invalid_request_error: unknown parameter",
    ]) {
      expect(isRetryableError(err(m), defaultRetryConfig.retryableErrors)).toBe(false);
    }
  });
});

describe("A_86 item 2 — Retry-After is parsed and honoured", () => {
  it("delta-seconds", () => {
    expect(parseRetryAfterMs("30")).toBe(30_000);
    expect(parseRetryAfterMs("0")).toBe(0);
  });

  it("HTTP-date", () => {
    const now = Date.parse("2026-09-10T12:00:00Z");
    expect(parseRetryAfterMs("Thu, 10 Sep 2026 12:00:45 GMT", now)).toBe(45_000);
  });

  it("absent, empty or malformed yields null — a bad header must never stall a run", () => {
    for (const v of [null, undefined, "", "   ", "soon", "-5"]) {
      expect(parseRetryAfterMs(v as string | null | undefined)).toBeNull();
    }
  });

  it("a past HTTP-date clamps to 0 rather than going negative", () => {
    const now = Date.parse("2026-09-10T12:00:00Z");
    expect(parseRetryAfterMs("Thu, 10 Sep 2026 11:59:00 GMT", now)).toBe(0);
  });

  it("AzureHttpError carries it, and readRetryAfterMs finds it", () => {
    const e = new AzureHttpError(429, "rate limited", "https://x/y", 12_000);
    expect(e.retryAfterMs).toBe(12_000);
    expect(readRetryAfterMs(e)).toBe(12_000);
    expect(readRetryAfterMs(new AzureHttpError(429, "rate limited", "https://x/y"))).toBeNull();
  });

  it("withRetry waits the server's number, not its own backoff", async () => {
    vi.useFakeTimers();
    try {
      const slept: number[] = [];
      const originalSetTimeout = globalThis.setTimeout;
      vi.spyOn(globalThis, "setTimeout").mockImplementation(((fn: () => void, ms?: number) => {
        slept.push(ms ?? 0);
        return originalSetTimeout(fn, 0);
      }) as typeof setTimeout);

      let calls = 0;
      const p = withRetry(async () => {
        calls += 1;
        if (calls < 2) throw new AzureHttpError(429, "rate limited", "https://x/y", 20_000);
        return "ok";
      }, defaultRetryConfig);
      await vi.runAllTimersAsync();
      expect(await p).toBe("ok");
      // 20s from the server, plus the small pad, NOT the 1.5s generic backoff
      expect(slept[0]).toBe(20_250);
    } finally {
      vi.restoreAllMocks();
      vi.useRealTimers();
    }
  });
});

describe("A_86 item 3 — a 429 gets its own attempt budget", () => {
  it("isRateLimitError recognises the transport code and the message forms", () => {
    expect(isRateLimitError(new AzureHttpError(429, "b", "u"))).toBe(true);
    expect(isRateLimitError(err("Azure chat completion failed: HTTP 429 at ..."))).toBe(true);
    expect(isRateLimitError(err("rate_limit_exceeded"))).toBe(true);
    expect(isRateLimitError(err("Too Many Requests"))).toBe(true);
    expect(isRateLimitError(err("fetch failed"))).toBe(false);
    expect(isRateLimitError(err("ECONNRESET"))).toBe(false);
  });

  it("a 429 survives 7 failures and succeeds on the 8th (the old budget stopped at 4)", async () => {
    vi.useFakeTimers();
    try {
      const originalSetTimeout = globalThis.setTimeout;
      vi.spyOn(globalThis, "setTimeout").mockImplementation(((fn: () => void) =>
        originalSetTimeout(fn, 0)) as typeof setTimeout);
      let calls = 0;
      const p = withRetry(async () => {
        calls += 1;
        if (calls < 8) throw new AzureHttpError(429, "rate limited", "https://x/y", 1000);
        return "ok";
      }, defaultRetryConfig);
      await vi.runAllTimersAsync();
      expect(await p).toBe("ok");
      expect(calls).toBe(8);
    } finally {
      vi.restoreAllMocks();
      vi.useRealTimers();
    }
  });

  it("a NON-rate-limit error still stops at 4 — the wider budget is 429-only", async () => {
    vi.useFakeTimers();
    try {
      const originalSetTimeout = globalThis.setTimeout;
      vi.spyOn(globalThis, "setTimeout").mockImplementation(((fn: () => void) =>
        originalSetTimeout(fn, 0)) as typeof setTimeout);
      let calls = 0;
      const p = withRetry(async () => {
        calls += 1;
        throw err("fetch failed");
      }, defaultRetryConfig).catch((e: Error) => e.message);
      await vi.runAllTimersAsync();
      expect(await p).toContain("Max retry attempts (4) exceeded");
      expect(calls).toBe(4);
    } finally {
      vi.restoreAllMocks();
      vi.useRealTimers();
    }
  });

  it("a non-retryable error is still thrown on the first attempt", async () => {
    let calls = 0;
    await expect(
      withRetry(async () => {
        calls += 1;
        throw err("VICTIM ALIVE: she poured the tea");
      }, defaultRetryConfig),
    ).rejects.toThrow("VICTIM ALIVE");
    expect(calls).toBe(1);
  });

  it("the defaults are the ones the docblock claims", () => {
    expect(defaultRetryConfig.maxAttempts).toBe(4);
    expect(defaultRetryConfig.rateLimitMaxAttempts).toBe(8);
    expect(defaultRetryConfig.rateLimitMaxDelayMs).toBe(120_000);
  });

  it("a config WITHOUT the new fields behaves exactly as before (back-compat)", async () => {
    vi.useFakeTimers();
    try {
      const originalSetTimeout = globalThis.setTimeout;
      vi.spyOn(globalThis, "setTimeout").mockImplementation(((fn: () => void) =>
        originalSetTimeout(fn, 0)) as typeof setTimeout);
      const legacy = {
        maxAttempts: 4,
        initialDelayMs: 10,
        maxDelayMs: 100,
        backoffMultiplier: 2,
        retryableErrors: ["429"],
      };
      let calls = 0;
      const p = withRetry(async () => {
        calls += 1;
        throw new AzureHttpError(429, "rate limited", "https://x/y");
      }, legacy).catch((e: Error) => e.message);
      await vi.runAllTimersAsync();
      expect(await p).toContain("Max retry attempts (4) exceeded");
      expect(calls).toBe(4);
    } finally {
      vi.restoreAllMocks();
      vi.useRealTimers();
    }
  });
});
