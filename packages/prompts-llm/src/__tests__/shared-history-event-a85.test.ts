/**
 * A_85 F6 — `AGENT2_SHARED_HISTORY_EVENT`: every relationship's sharedHistory must name ONE specific
 * past event, not a standing attitude.
 *
 * MEASURED 2026-09-09 over 60 stored casts (705 pairs): 9% name an event, 21% are attitude only. The
 * histories reach every prose prompt, so the content is the lever. These tests verify the rule
 * reaches the Agent 2 prompt (captured from a stub client, both flag states — the CLAUDE.md rule:
 * verify a lever by the prompt, not by reading the module) and that the detector classifies the
 * corpus's own examples the way a reader would.
 */

import { afterEach, describe, expect, it } from "vitest";
import {
  SHARED_HISTORY_EVENT_RULE,
  designCast,
  isSharedHistoryEventEnabled,
  sharedHistoryNamesEvent,
} from "../agent2-cast.js";

const withEnv = (value: string | undefined, fn: () => Promise<void> | void) => {
  const prior = process.env.AGENT2_SHARED_HISTORY_EVENT;
  if (value === undefined) delete process.env.AGENT2_SHARED_HISTORY_EVENT;
  else process.env.AGENT2_SHARED_HISTORY_EVENT = value;
  const restore = () => {
    if (prior === undefined) delete process.env.AGENT2_SHARED_HISTORY_EVENT;
    else process.env.AGENT2_SHARED_HISTORY_EVENT = prior;
  };
  try {
    const r = fn();
    if (r instanceof Promise) return r.finally(restore);
    restore();
    return r;
  } catch (e) { restore(); throw e; }
};
afterEach(() => { delete process.env.AGENT2_SHARED_HISTORY_EVENT; });

/** Stub client: captures the first chat request and aborts. */
const capture = () => {
  const seen: any[] = [];
  const noop = new Proxy({}, { get: () => () => undefined });
  const client = new Proxy({}, {
    get: (_t, prop) => {
      if (prop === "chat" || prop === "chatWithRetry") return async (req: any) => { seen.push(req); throw new Error("captured"); };
      if (prop === "getLogger" || prop === "getCostTracker") return () => noop;
      return () => undefined;
    },
  }) as any;
  return { client, seen };
};
const promptText = (seen: any[]) => JSON.stringify(seen.map((r) => r.messages ?? r));
const inputs = () => ({
  runId: "t", projectId: "t",
  characterNames: ["Adela Thorne", "Bertram Vance", "Clarissa Orme", "Desmond Quayle", "Edith Gaunt"],
  setting: "1930s - a seaside hotel", crimeType: "Murder", tone: "Cozy", detectiveType: "amateur" as const,
});

describe("AGENT2_SHARED_HISTORY_EVENT reaches the Agent 2 prompt", () => {
  it("flag OFF: the rule is absent from the prompt", async () => {
    await withEnv(undefined, async () => {
      expect(isSharedHistoryEventEnabled()).toBe(false);
      const { client, seen } = capture();
      try { await designCast(client, inputs()); } catch { /* captured */ }
      expect(seen.length).toBeGreaterThan(0);
      expect(promptText(seen)).not.toContain("ONE specific past EVENT");
    });
  });

  it("flag ON: the rule, with its FAILS/PASSES pair, is in the prompt", async () => {
    await withEnv("true", async () => {
      expect(isSharedHistoryEventEnabled()).toBe(true);
      const { client, seen } = capture();
      try { await designCast(client, inputs()); } catch { /* captured */ }
      const text = promptText(seen);
      expect(text).toContain("ONE specific past EVENT");
      expect(text).toContain("FAILS:");
      expect(text).toContain("PASSES:");
      expect(SHARED_HISTORY_EVENT_RULE).toContain("past tense");
    });
  });
});

describe("sharedHistoryNamesEvent — the detector, on the corpus's own sentences", () => {
  it("a standing attitude is not an event", () => {
    expect(sharedHistoryNamesEvent("Lavinia Yardley and Adela Ashgrove had tense exchanges over the hotel's reputation.")).toBe(false);
    expect(sharedHistoryNamesEvent("Dorothy Carrick and Katherine Jardine often disagreed on laboratory and hotel management approaches.")).toBe(false);
  });
  it("a dated or framed past event is", () => {
    expect(sharedHistoryNamesEvent("Adela caught Katherine mislabelling a solvent order in the spring of 1924 and never reported it.")).toBe(true);
    expect(sharedHistoryNamesEvent("Adela once saved Dorothy's career by correcting a lab error.")).toBe(true);
    expect(sharedHistoryNamesEvent("Ferdinand covered for Lavinia the night the cellar flooded, three years ago.")).toBe(true);
  });
});
