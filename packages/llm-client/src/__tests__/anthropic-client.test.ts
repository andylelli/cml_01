import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnthropicClient, DEFAULT_ANTHROPIC_MODEL, extractJsonPayload } from "../anthropic-client.js";
import { CostTracker } from "../cost-tracker.js";
import { LLMLogger } from "../logger.js";

const ENV_KEYS = ["ANTHROPIC_THINKING", "ANTHROPIC_MODEL", "LLM_REQUEST_TIMEOUT_MS"] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  for (const key of ENV_KEYS) delete process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key]!;
  }
});

/** Build a client whose transport is a spy, so we can assert the exact request shape sent upstream. */
const buildClient = (reply: Partial<Record<string, unknown>> = {}) => {
  const client = new AnthropicClient({
    apiKey: "test-key",
    logger: new LLMLogger({ logToConsole: false }),
    costTracker: new CostTracker(),
  });
  const create = vi.fn().mockResolvedValue({
    content: [{ type: "text", text: '{"status":"draft","chapters":[]}' }],
    usage: { input_tokens: 100, output_tokens: 50 },
    stop_reason: "end_turn",
    ...reply,
  });
  (client as any).client = { messages: { create } };
  return { client, create };
};

describe("AnthropicClient request shape", () => {
  it("never sends temperature, top_p, or top_k — current Claude models 400 on them", async () => {
    const { client, create } = buildClient();

    await client.chat({
      messages: [{ role: "user", content: "polish this" }],
      // Every Agent 9 call site sets one; forwarding it would fail the call.
      temperature: 0.2,
    });

    const [params] = create.mock.calls[0];
    expect(params).not.toHaveProperty("temperature");
    expect(params).not.toHaveProperty("top_p");
    expect(params).not.toHaveProperty("top_k");
  });

  it("disables thinking by default so it cannot eat the max_tokens budget", async () => {
    const { client, create } = buildClient();
    await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(create.mock.calls[0][0].thinking).toEqual({ type: "disabled" });
  });

  it("honours ANTHROPIC_THINKING=adaptive as an explicit opt-in", async () => {
    process.env.ANTHROPIC_THINKING = "adaptive";
    const { client, create } = buildClient();
    await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(create.mock.calls[0][0].thinking).toEqual({ type: "adaptive" });
  });

  it("hoists system messages into the top-level system field", async () => {
    const { client, create } = buildClient();
    await client.chat({
      messages: [
        { role: "system", content: "You are an editor." },
        { role: "user", content: "polish this" },
      ],
    });

    const [params] = create.mock.calls[0];
    expect(params.system).toContain("You are an editor.");
    expect(params.messages).toEqual([{ role: "user", content: "polish this" }]);
  });

  it("appends a JSON-only instruction when jsonMode is requested (there is no schema-free JSON mode)", async () => {
    const { client, create } = buildClient();
    await client.chat({ messages: [{ role: "user", content: "polish" }], jsonMode: true });
    expect(create.mock.calls[0][0].system).toMatch(/single valid JSON object/i);
  });

  it("floors max_tokens so a chapter rewrite cannot truncate under a caller tuned for Azure", async () => {
    const { client, create } = buildClient();
    await client.chat({ messages: [{ role: "user", content: "polish" }], maxTokens: 5000 });
    expect(create.mock.calls[0][0].max_tokens).toBe(8192);
  });

  it("uses the configured default model when the caller supplies none", async () => {
    const { client, create } = buildClient();
    await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(create.mock.calls[0][0].model).toBe(DEFAULT_ANTHROPIC_MODEL);
  });

  it("rejects a call with no user or assistant turn rather than sending an empty messages array", async () => {
    const { client } = buildClient();
    await expect(
      client.chat({ messages: [{ role: "system", content: "only a system prompt" }] }),
    ).rejects.toThrow(/at least one user or assistant message/i);
  });
});

describe("AnthropicClient response handling", () => {
  it("maps usage onto the shared ChatResponse shape", async () => {
    const { client } = buildClient();
    const response = await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(response.usage).toEqual({ promptTokens: 100, completionTokens: 50, totalTokens: 150 });
  });

  it("surfaces a truncated reply through finishReason instead of returning a silent fragment", async () => {
    const { client } = buildClient({ stop_reason: "max_tokens" });
    const response = await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(response.finishReason).toBe("max_tokens");
  });

  it("surfaces a refusal through finishReason (a normal 200 on current models)", async () => {
    const { client } = buildClient({ stop_reason: "refusal", content: [] });
    const response = await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(response.finishReason).toBe("refusal");
    expect(response.content).toBe("");
  });

  it("concatenates multiple text blocks and ignores non-text blocks", async () => {
    const { client } = buildClient({
      content: [
        { type: "thinking", thinking: "" },
        { type: "text", text: "part one " },
        { type: "text", text: "part two" },
      ],
    });
    const response = await client.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(response.content).toBe("part one part two");
  });
});

describe("extractJsonPayload", () => {
  it("returns already-valid JSON unchanged", () => {
    expect(extractJsonPayload('{"a":1}')).toBe('{"a":1}');
  });

  it("unwraps a fenced json block", () => {
    expect(extractJsonPayload('```json\n{"a":1}\n```')).toBe('{"a":1}');
  });

  it("unwraps an unlabelled fence", () => {
    expect(extractJsonPayload('```\n{"a":1}\n```')).toBe('{"a":1}');
  });

  it("strips conversational preamble and trailing commentary", () => {
    expect(extractJsonPayload('Here is the polished chapter:\n{"a":1}\nLet me know if you want changes.')).toBe(
      '{"a":1}',
    );
  });

  it("keeps nested braces intact by taking the outermost object", () => {
    expect(extractJsonPayload('noise {"a":{"b":2}} noise')).toBe('{"a":{"b":2}}');
  });

  it("returns the input when there is no object to find — jsonrepair downstream is the next line of defence", () => {
    expect(extractJsonPayload("no json here")).toBe("no json here");
  });

  it("handles empty input without throwing", () => {
    expect(extractJsonPayload("")).toBe("");
  });
});

describe("CostTracker — Claude rates", () => {
  const tracker = new CostTracker();
  const usage = { promptTokens: 1_000_000, completionTokens: 1_000_000, totalTokens: 2_000_000 };

  it("prices Sonnet at the $3/$15 list rate (GBP-converted, matching the file's convention)", () => {
    // 1M in + 1M out = (3 + 15) USD * 0.79
    expect(tracker.calculateCost("claude-sonnet-5", usage)).toBeCloseTo(14.22, 2);
  });

  it("prices Opus above Sonnet", () => {
    expect(tracker.calculateCost("claude-opus-5", usage)).toBeGreaterThan(
      tracker.calculateCost("claude-sonnet-5", usage),
    );
  });

  it("prices Haiku below Sonnet", () => {
    expect(tracker.calculateCost("claude-haiku-4-5", usage)).toBeLessThan(
      tracker.calculateCost("claude-sonnet-5", usage),
    );
  });

  it("does not let an unrecognised claude id fall through to the GPT-3.5 fallback rate", () => {
    // The bug this guards against already exists once in this file for `gpt-4.1`.
    const gpt35Fallback = tracker.calculateCost("some-unknown-model", usage);
    expect(tracker.calculateCost("claude-something-new", usage)).not.toBeCloseTo(gpt35Fallback, 4);
  });
});
