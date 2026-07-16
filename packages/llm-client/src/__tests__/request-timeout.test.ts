import { afterEach, describe, expect, it } from "vitest";
import { resolveRequestTimeoutMs } from "../client.js";
import { isRetryableError, defaultRetryConfig, withRetry } from "../retry.js";

// A_62 RC-6 — the LLM client had no request deadline, so a stalled socket blocked a run forever
// (run mystery-1784231640128 hung >15 min at CPU 0 with the Azure socket still ESTABLISHED; run
// mystery-1784150843898 hung 4h28m across a standby and then completed on wake). These tests pin
// BOTH directions: the deadline exists, and — the part that actually matters — a fired deadline is
// RETRYABLE rather than fatal.

describe("resolveRequestTimeoutMs — the deadline", () => {
  afterEach(() => {
    delete process.env.LLM_REQUEST_TIMEOUT_MS;
  });

  it("defaults to 240s — ~8x the slowest healthy Agent-9 call (~30s)", () => {
    expect(resolveRequestTimeoutMs(undefined)).toBe(240_000);
    expect(resolveRequestTimeoutMs("")).toBe(240_000);
  });

  it("honours an explicit override", () => {
    expect(resolveRequestTimeoutMs("5000")).toBe(5000);
  });

  it("allows opting out (restores the pre-A_62 hang) with off/false/no", () => {
    expect(resolveRequestTimeoutMs("off")).toBe(0);
    expect(resolveRequestTimeoutMs("false")).toBe(0);
    expect(resolveRequestTimeoutMs("0")).toBe(0);
  });

  it("falls back to the default on garbage rather than disabling the deadline", () => {
    // A typo must never silently reinstate the infinite hang.
    expect(resolveRequestTimeoutMs("banana")).toBe(240_000);
    expect(resolveRequestTimeoutMs("-1")).toBe(240_000);
  });
});

describe("a fired deadline must be RETRYABLE, not fatal", () => {
  // The trap this guards: isRetryableError substring-matches error.message, and NEITHER abort path
  // says "timeout" — AbortSignal.timeout throws DOMException{name:"TimeoutError"} and the Azure
  // pipeline surfaces AbortError{message:"The operation was aborted."}. Left raw, adding a deadline
  // would turn a count-SAFE hang into a count-RESTARTING abort — strictly worse than the bug.

  it("PROVES the trap is real: the raw abort messages are NOT retryable", () => {
    const rawAbort = new Error("The operation was aborted.");
    expect(isRetryableError(rawAbort, defaultRetryConfig.retryableErrors)).toBe(false);
  });

  it("the normalized deadline error IS retryable", () => {
    const normalized = new Error(
      "timeout: LLM request exceeded the 240000ms deadline after 240001ms (TimeoutError) — retryable",
    );
    expect(isRetryableError(normalized, defaultRetryConfig.retryableErrors)).toBe(true);
  });

  it("withRetry actually retries a normalized deadline and can then succeed", async () => {
    let calls = 0;
    const flaky = async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error("timeout: LLM request exceeded the 240000ms deadline after 240001ms (TimeoutError) — retryable");
      }
      return "recovered";
    };
    const result = await withRetry(flaky, { ...defaultRetryConfig, initialDelayMs: 1, maxDelayMs: 2 });
    expect(result).toBe("recovered");
    expect(calls).toBe(3); // hung twice, then a real answer — the run continues instead of dying
  });

  it("a raw abort would NOT be retried — the regression this fix must never reintroduce", async () => {
    let calls = 0;
    const raw = async () => {
      calls += 1;
      throw new Error("The operation was aborted.");
    };
    await expect(
      withRetry(raw, { ...defaultRetryConfig, initialDelayMs: 1, maxDelayMs: 2 }),
    ).rejects.toThrow("aborted");
    expect(calls).toBe(1); // gives up immediately — exactly what normalization prevents
  });
});
