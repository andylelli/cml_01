/**
 * CR-19 (ORC-03 / A1X-09) — `ChatResponse.cost` is the cost tracker's own figure for that call.
 *
 * Before this, a response carried no cost, so every generator read its label's CUMULATIVE running total
 * back out of `getCostTracker().getSummary().byAgent[label]` — a third definition of "the cost of a
 * call". These pin the new field against the tracker, on all three clients that return a ChatResponse:
 *
 *   1. per call: `response.cost === after.byAgent[label] - before.byAgent[label]` — on a label the
 *      tracker has not seen, so `before` is 0 and the subtraction is exact (on a non-zero `before`,
 *      `(a + c) - a` can round away from `c` by one ulp; that is float arithmetic, not a disagreement);
 *   2. per label: summing `response.cost` from 0 in call order reproduces `byAgent[label]` BIT FOR BIT —
 *      the property a generator relies on when it stops reading the tracker;
 *   3. the same for `totalCost` and `byModel[model]`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AzureOpenAIClient } from "../client.js";
import { AnthropicClient } from "../anthropic-client.js";
import { CostTracker } from "../cost-tracker.js";
import { ReplayClient, promptHashOf, type CassetteEntry } from "../replay.js";
import type { ChatResponse, Message } from "../types.js";

const ENV_KEYS = ["LLM_HTTP_TRANSPORT", "ANTHROPIC_THINKING", "ANTHROPIC_MODEL", "LLM_REQUEST_TIMEOUT_MS"] as const;
const saved: Record<string, string | undefined> = {};
beforeEach(() => {
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});
afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key]!;
  }
});

const stubLogger = {
  logFullPrompt: async () => {},
  logRequest: async () => {},
  logResponse: async () => {},
  logError: async () => {},
} as any;

// Awkward token counts on purpose: they make the per-1k products inexact in binary.
const USAGES: Array<[number, number]> = [
  [1234, 567],
  [31_337, 4_099],
  [7, 3],
  [98_765, 12_345],
  [0, 0],
  [1, 1],
];

const AZURE_MODELS = ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini", "gpt-35-turbo", "some-unknown-deployment"];
const CLAUDE_MODELS = ["claude-sonnet-5", "claude-opus-5", "claude-haiku-4-5"];

const byAgent = (t: CostTracker, label: string): number => t.getSummary().byAgent[label] ?? 0;
const byModel = (t: CostTracker, model: string): number => t.getSummary().byModel[model] ?? 0;

/** Drive `calls` through one client and check every per-call and running-total identity. */
async function pin(
  tracker: CostTracker,
  calls: Array<{ label: string; model: string; run: () => Promise<ChatResponse> }>,
) {
  const running = new Map<string, number>();
  const runningByModel = new Map<string, number>();
  let runningTotal = 0;
  for (const call of calls) {
    const fresh = !(call.label in tracker.getSummary().byAgent);
    const before = byAgent(tracker, call.label);
    const res = await call.run();
    const after = byAgent(tracker, call.label);

    expect(typeof res.cost).toBe("number");
    expect(res.cost).toBe(tracker.calculateCost(res.model, res.usage));
    if (fresh) expect(res.cost).toBe(after - before);
    else expect(res.cost!).toBeCloseTo(after - before, 15);

    running.set(call.label, (running.get(call.label) ?? 0) + res.cost!);
    runningByModel.set(res.model, (runningByModel.get(res.model) ?? 0) + res.cost!);
    runningTotal += res.cost!;
    // Bit-for-bit, not approximately: same operands, same order, same additions.
    expect(running.get(call.label)).toBe(after);
    expect(runningByModel.get(res.model)).toBe(byModel(tracker, res.model));
    expect(runningTotal).toBe(tracker.getTotalCost());
  }
}

describe("ChatResponse.cost — AzureOpenAIClient", () => {
  it("equals the tracker's delta for every call, over models x usages, labels shared and fresh", async () => {
    const tracker = new CostTracker();
    const client = new AzureOpenAIClient({
      apiKey: "k",
      endpoint: "https://unit-test.invalid",
      defaultModel: "gpt-4.1",
      logger: stubLogger,
      costTracker: tracker,
    });
    const sdk = vi.fn();
    (client as any).client = { getChatCompletions: sdk };

    const calls = AZURE_MODELS.flatMap((model, m) =>
      USAGES.map(([promptTokens, completionTokens], u) => ({
        // Two shared labels (the running-total case) and one fresh label per call (the exact-delta case).
        label: u % 3 === 2 ? `CostPin-fresh-${m}-${u}` : `CostPin-shared-${u % 3}`,
        model,
        run: () => {
          sdk.mockResolvedValueOnce({
            choices: [{ message: { content: "{}" }, finishReason: "stop" }],
            usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens },
          });
          return client.chat({
            model,
            messages: [{ role: "user", content: "x" }],
            logContext: { runId: "r", projectId: "p", agent: u % 3 === 2 ? `CostPin-fresh-${m}-${u}` : `CostPin-shared-${u % 3}` },
          });
        },
      })),
    );
    await pin(tracker, calls);
  });

  it("is also set on a call with no agent label (charged to the total, not to byAgent)", async () => {
    const tracker = new CostTracker();
    const client = new AzureOpenAIClient({ apiKey: "k", endpoint: "https://unit-test.invalid", defaultModel: "gpt-4.1", logger: stubLogger, costTracker: tracker });
    (client as any).client = {
      getChatCompletions: vi.fn().mockResolvedValue({
        choices: [{ message: { content: "ok" }, finishReason: "stop" }],
        usage: { promptTokens: 500, completionTokens: 250, totalTokens: 750 },
      }),
    };
    const res = await client.chat({ messages: [{ role: "user", content: "x" }] });
    expect(res.cost).toBe(tracker.getTotalCost());
    expect(res.cost).toBeGreaterThan(0);
    expect(tracker.getSummary().byAgent).toEqual({});
  });
});

describe("ChatResponse.cost — AnthropicClient", () => {
  it("equals the tracker's delta for every call, over models x usages", async () => {
    const tracker = new CostTracker();
    const client = new AnthropicClient({ apiKey: "k", logger: stubLogger, costTracker: tracker });
    const create = vi.fn();
    (client as any).client = { messages: { create } };

    const calls = CLAUDE_MODELS.flatMap((model, m) =>
      USAGES.map(([input_tokens, output_tokens], u) => {
        const label = u % 2 === 0 ? `CostPin-fresh-${m}-${u}` : "CostPin-shared";
        return {
          label,
          model,
          run: () => {
            create.mockResolvedValueOnce({
              content: [{ type: "text", text: "ok" }],
              usage: { input_tokens, output_tokens },
              stop_reason: "end_turn",
            });
            return client.chat({ model, messages: [{ role: "user", content: "x" }], logContext: { runId: "r", projectId: "p", agent: label } });
          },
        };
      }),
    );
    await pin(tracker, calls);
  });
});

describe("ChatResponse.cost — ReplayClient", () => {
  it("equals the tracker's delta for every served response", async () => {
    const msgs = (text: string): Message[] => [{ role: "user", content: text }];
    const models = ["gpt-4.1", "gpt-4.1-mini", "claude-sonnet-5"];
    const entries: CassetteEntry[] = [];
    const plan: Array<{ label: string; prompt: string; model: string }> = [];
    let seq = 0;
    models.forEach((model, m) =>
      USAGES.forEach(([promptTokens, completionTokens], u) => {
        const label = u % 2 === 0 ? `CostPin-fresh-${m}-${u}` : "CostPin-shared";
        const prompt = `p-${m}-${u}`;
        plan.push({ label, prompt, model });
        entries.push({
          seq: seq++,
          agent: label,
          promptHash: promptHashOf(msgs(prompt)),
          messages: msgs(prompt),
          outcome: { kind: "response", content: "ok", usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens }, finishReason: "stop", model },
        });
      }),
    );
    const client = new ReplayClient({ source: { test: true }, entries });
    await pin(
      client.getCostTracker(),
      plan.map((p) => ({
        label: p.label,
        model: p.model,
        run: () => client.chat({ messages: msgs(p.prompt), logContext: { runId: "r", projectId: "p", agent: p.label } }),
      })),
    );
  });
});
