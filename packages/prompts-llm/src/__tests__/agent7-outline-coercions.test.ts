import { describe, expect, it } from "vitest";
import { formatNarrative, readOutlineCoercions } from "../agent7-narrative.js";

/**
 * A7-11 — formatNarrative reports what it coerced, per site, on a side channel the worker reads. The
 * counts must never reach a prompt or an artifact: they ride on a non-enumerable symbol.
 */
const scene = (n: number, stage?: number) => ({
  sceneNumber: n, act: 1, title: `S${n}`, setting: { location: "Hall", timeOfDay: "night", atmosphere: "tense" },
  characters: [], purpose: "p", cluesRevealed: [], dramaticElements: {}, summary: "s", estimatedWordCount: 100,
  ...(stage === undefined ? {} : { mechanism_stage: stage }),
});
const run = async (content: string) => {
  const client = {
    chat: async () => ({ content, model: "m", latencyMs: 1, finishReason: "stop" }),
    getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    getLogger: () => ({ logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} }),
  };
  const inputs = {
    caseData: { CASE: { meta: { title: "T" }, cast: [], culpability: { culprits: [] } } },
    clues: { clues: [], redHerrings: [], clueTimeline: { early: [], mid: [], late: [] } },
    targetLength: "short", runId: "r", projectId: "p",
  };
  return formatNarrative(client as any, inputs as any);
};

describe("formatNarrative coercion counts (A7-11)", () => {
  it("counts each coercion it made, and nothing on a clean reply", async () => {
    const clean = await run(JSON.stringify({ acts: [{ actNumber: 1, title: "I", purpose: "p", scenes: [scene(1), scene(2)], estimatedWordCount: 200 }], totalScenes: 2, estimatedTotalWords: 200, pacingNotes: [] }));
    expect(readOutlineCoercions(clean)).toBeUndefined();

    const messy = await run("Here it is: " + JSON.stringify({ acts: [{ actNumber: 1, title: "I", purpose: "p", scenes: [scene(1, 3), scene(2, 1)], estimatedWordCount: 200 }], totalScenes: 5, pacingNotes: [] }) + " thanks");
    expect(readOutlineCoercions(messy)).toEqual({
      parseRepaired: 0, parseExtracted: 1, totalsSynthesized: 1, totalScenesCorrected: 1, mechanismStagesCleared: 2,
    });
  });

  it("the counts never reach a serialisation, a spread or a clone", async () => {
    const messy = await run(JSON.stringify({ acts: [{ actNumber: 1, title: "I", purpose: "p", scenes: [scene(1)], estimatedWordCount: 100 }], totalScenes: 9, estimatedTotalWords: 100, pacingNotes: [] }));
    expect(readOutlineCoercions(messy)?.totalScenesCorrected).toBe(1);
    expect(JSON.stringify(messy)).not.toMatch(/Coercion|totalScenesCorrected/);
    expect(readOutlineCoercions({ ...messy })).toBeUndefined();
    expect(readOutlineCoercions(structuredClone(messy))).toBeUndefined();
  });
});
