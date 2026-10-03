/**
 * CR-19 (ORC-03 / A1X-09) — Agent 6.5 reports the sum of its own calls' `response.cost` instead of reading
 * `byAgent["Agent65-WorldBuilder"]` back from the tracker. The two must be the same number, bit for bit,
 * whenever the function is the label's only charger on a fresh tracker (once per run). Pinned here over a
 * run whose first two attempts fail (unparseable, then truncated) so the sum spans three charged calls.
 *
 * The client double charges a REAL CostTracker and returns its figure as `cost` — the contract the llm-client
 * test `chat-response-cost.test.ts` pins on all three real clients.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CostTracker } from "@cml/llm-client";
import { generateWorldDocument } from "../agent65-world-builder.ts";

const LABEL = "Agent65-WorldBuilder";
const bundle = JSON.parse(
  readFileSync(fileURLToPath(new URL("../../../../eval/golden/bundle-56049d93.json", import.meta.url)), "utf8"),
);

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("Agent 6.5 cost — summed from its own responses", () => {
  it("equals the tracker's byAgent total for the label, bit for bit, across three attempts", async () => {
    const a = bundle.artifacts;
    const { cost: _drop, durationMs: _d, ...doc } = a.world_document;
    const replies = [
      { content: "not json at all", usage: [12_345, 678] },
      { content: '{"status": "final", "storyTheme": "cut', usage: [23_456, 11_999] },
      { content: JSON.stringify(doc), usage: [34_567, 9_876] },
    ];
    const tracker = new CostTracker();
    let i = 0;
    const client = {
      chat: vi.fn(async (req: any) => {
        const r = replies[Math.min(i++, replies.length - 1)];
        const usage = { promptTokens: r.usage[0], completionTokens: r.usage[1], totalTokens: r.usage[0] + r.usage[1] };
        const model = "gpt-4.1";
        const cost = tracker.trackCost(model, usage, req.logContext?.agent);
        return { content: r.content, finishReason: "stop", model, usage, latencyMs: 1, cost };
      }),
      getCostTracker: () => tracker,
    };

    const result = await generateWorldDocument(
      {
        caseData: a.cml,
        characterProfiles: a.character_profiles,
        locationProfiles: a.location_profiles,
        temporalContext: a.temporal_context,
        backgroundContext: a.background_context,
        hardLogicDevices: a.hard_logic_devices,
        clueDistribution: a.clues,
        runId: "r",
        projectId: "p",
      } as any,
      client as any,
    );

    expect(client.chat).toHaveBeenCalledTimes(3);
    expect(result.cost).toBeGreaterThan(0);
    expect(result.cost).toBe(tracker.getSummary().byAgent[LABEL]);
  });
});
