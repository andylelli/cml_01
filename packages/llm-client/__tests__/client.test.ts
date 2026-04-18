import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { CircuitBreaker, isRetryableError } from "../src/retry";
import { RateLimiter } from "../src/ratelimit";
import { CostTracker } from "../src/cost-tracker";
import { LLMLogger } from "../src/logger";

describe("CircuitBreaker", () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker(3, 1000);
  });

  it("starts in closed state", () => {
    expect(breaker.getState()).toBe("closed");
  });

  it("opens after threshold failures", async () => {
    const failingFn = async () => {
      throw new Error("Test error");
    };

    for (let i = 0; i < 3; i++) {
      try {
        await breaker.execute(failingFn);
      } catch {}
    }

    expect(breaker.getState()).toBe("open");
  });

  it("resets on success", async () => {
    const successFn = async () => "success";

    await breaker.execute(successFn);
    expect(breaker.getState()).toBe("closed");
  });
});

describe("isRetryableError", () => {
  it("identifies retryable errors", () => {
    const error = new Error("rate_limit_exceeded");
    expect(isRetryableError(error, ["rate_limit_exceeded"])).toBe(true);
  });

  it("identifies non-retryable errors", () => {
    const error = new Error("invalid_request");
    expect(isRetryableError(error, ["rate_limit_exceeded"])).toBe(false);
  });
});

describe("RateLimiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({ requestsPerMinute: 60 });
  });

  it("tracks requests", async () => {
    await limiter.waitForCapacity();
    const stats = limiter.getStats();
    expect(stats.requestsInLastMinute).toBe(1);
  });

  it("resets correctly", () => {
    limiter.reset();
    const stats = limiter.getStats();
    expect(stats.requestsInLastMinute).toBe(0);
  });
});

describe("CostTracker", () => {
  let tracker: CostTracker;

  beforeEach(() => {
    tracker = new CostTracker();
  });

  it("calculates GPT-4o-mini costs correctly", () => {
    const usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
    const cost = tracker.calculateCost("gpt-4o-mini", usage);
    expect(cost).toBeCloseTo(0.00065175, 6); // 1k * £0.00013035 + 1k * £0.0005214
  });

  it("calculates GPT-3.5 costs correctly", () => {
    const usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
    const cost = tracker.calculateCost("gpt-3.5-turbo", usage);
    expect(cost).toBeCloseTo(0.00158, 5); // 1k * £0.000395 + 1k * £0.001185
  });

  it("tracks costs by model", () => {
    const usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
    tracker.trackCost("gpt-4o-mini", usage);
    tracker.trackCost("gpt-4o-mini", usage);

    const summary = tracker.getSummary();
    expect(summary.byModel["gpt-4o-mini"]).toBeCloseTo(0.0013035, 6);
  });

  it("tracks costs by agent", () => {
    const usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
    tracker.trackCost("gpt-4o-mini", usage, "Agent3-CMLGenerator");

    const summary = tracker.getSummary();
    expect(summary.byAgent["Agent3-CMLGenerator"]).toBeCloseTo(0.00065175, 6);
  });
});

describe("LLMLogger", () => {
  let logger: LLMLogger;

  beforeEach(() => {
    logger = new LLMLogger({ logToConsole: false, logToFile: false });
  });

  it("hashes content consistently", () => {
    const content = "test content";
    const hash1 = LLMLogger.hashContent(content);
    const hash2 = LLMLogger.hashContent(content);
    expect(hash1).toBe(hash2);
  });

  it("produces different hashes for different content", () => {
    const hash1 = LLMLogger.hashContent("content 1");
    const hash2 = LLMLogger.hashContent("content 2");
    expect(hash1).not.toBe(hash2);
  });

  it("normalizes first attempt retryAttempt to 1 in actual prompt state", async () => {
    const docsDir = mkdtempSync(join(tmpdir(), "cml-logger-"));
    try {
      const testLogger = new LLMLogger({
        logToConsole: false,
        logToFile: false,
        logActualPromptDocsToFile: true,
        actualPromptDocsDir: docsDir,
      });

      await testLogger.logFullPrompt({
        runId: "run_test_retry_normalization",
        projectId: "proj_test",
        agent: "Agent5-ClueExtraction",
        operation: "chat_request_full_prompt",
        model: "gpt-4o-mini",
        temperature: 0.4,
        maxTokens: 100,
        promptHash: "hash_req_1",
        retryAttempt: 0,
        messages: [{ role: "user", content: "hello" }],
      });

      await testLogger.logResponse({
        runId: "run_test_retry_normalization",
        projectId: "proj_test",
        agent: "Agent5-ClueExtraction",
        operation: "chat_response",
        model: "gpt-4o-mini",
        promptHash: "hash_req_1",
        responseHash: "hash_resp_1",
        response: "ok",
        success: true,
        retryAttempt: 0,
        timestamp: new Date().toISOString(),
        metadata: {},
      });

      const runFolder = readdirSync(docsDir, { withFileTypes: true }).find((e) => e.isDirectory())?.name;
      expect(runFolder).toBeTruthy();
      const statePath = join(docsDir, String(runFolder), ".actual-run-state.json");
      const state = JSON.parse(readFileSync(statePath, "utf8"));
      expect(state.records).toHaveLength(1);
      expect(state.records[0].retryAttempt).toBe(1);
    } finally {
      rmSync(docsDir, { recursive: true, force: true });
    }
  });

  it("rejects response-only completion and increments missing_request_count", async () => {
    const docsDir = mkdtempSync(join(tmpdir(), "cml-logger-"));
    try {
      const testLogger = new LLMLogger({
        logToConsole: false,
        logToFile: false,
        logActualPromptDocsToFile: true,
        actualPromptDocsDir: docsDir,
      });

      await testLogger.logResponse({
        runId: "run_test_missing_request",
        projectId: "proj_test",
        agent: "Agent5-ClueExtraction",
        operation: "chat_response",
        model: "gpt-4o-mini",
        promptHash: "hash_resp_only",
        responseHash: "hash_resp_only_body",
        response: "body",
        success: true,
        retryAttempt: 1,
        timestamp: new Date().toISOString(),
        metadata: {},
      });

      const runFolder = readdirSync(docsDir, { withFileTypes: true }).find((e) => e.isDirectory())?.name;
      expect(runFolder).toBeTruthy();
      const statePath = join(docsDir, String(runFolder), ".actual-run-state.json");
      const state = JSON.parse(readFileSync(statePath, "utf8"));
      expect(state.records).toHaveLength(0);
      expect(state.integrity.missing_request_count).toBeGreaterThanOrEqual(1);
    } finally {
      rmSync(docsDir, { recursive: true, force: true });
    }
  });

  it("rejects empty response body and increments empty_response_body_count", async () => {
    const docsDir = mkdtempSync(join(tmpdir(), "cml-logger-"));
    try {
      const testLogger = new LLMLogger({
        logToConsole: false,
        logToFile: false,
        logActualPromptDocsToFile: true,
        actualPromptDocsDir: docsDir,
      });

      await testLogger.logFullPrompt({
        runId: "run_test_empty_response",
        projectId: "proj_test",
        agent: "Agent5-ClueExtraction",
        operation: "chat_request_full_prompt",
        model: "gpt-4o-mini",
        temperature: 0.4,
        maxTokens: 100,
        promptHash: "hash_req_empty",
        retryAttempt: 1,
        messages: [{ role: "user", content: "hello" }],
      });

      await testLogger.logResponse({
        runId: "run_test_empty_response",
        projectId: "proj_test",
        agent: "Agent5-ClueExtraction",
        operation: "chat_response",
        model: "gpt-4o-mini",
        promptHash: "hash_req_empty",
        responseHash: "hash_empty",
        response: "   ",
        success: true,
        retryAttempt: 1,
        timestamp: new Date().toISOString(),
        metadata: {},
      });

      const runFolder = readdirSync(docsDir, { withFileTypes: true }).find((e) => e.isDirectory())?.name;
      expect(runFolder).toBeTruthy();
      const statePath = join(docsDir, String(runFolder), ".actual-run-state.json");
      const state = JSON.parse(readFileSync(statePath, "utf8"));
      expect(state.records).toHaveLength(1);
      expect(Boolean(state.records[0].responseFile)).toBe(false);
      expect(state.integrity.empty_response_body_count).toBeGreaterThanOrEqual(1);
      expect(state.integrity.missing_response_count).toBeGreaterThanOrEqual(1);
    } finally {
      rmSync(docsDir, { recursive: true, force: true });
    }
  });
});
