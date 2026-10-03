/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A7-07 and A7-D04: the reported Agent 7 score describes the
 * outline that shipped. Only the reported score moves; the outline is the same either way.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const llm = vi.hoisted(() => ({ next: null as any, calls: 0 }));
vi.mock("@cml/prompts-llm", async (importOriginal) => {
  const real: any = await importOriginal();
  return {
    ...real,
    formatNarrative: async () => {
      llm.calls += 1;
      return { ...structuredClone(llm.next), cost: 0.01 };
    },
  };
});

import { getSceneTarget } from "@cml/story-validation";
import { rescoreNarrative } from "../jobs/agents/agent7/generate.js";
import { enforceCluePacing } from "../jobs/agents/agent7/clue-pacing.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; llm.calls = 0; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

/** An outline of `n` scenes split over three acts; the first `clued` scenes carry a clue. */
const outline = (n: number, clued: number): any => {
  const per = [Math.ceil(n / 3), Math.ceil(n / 3), n - 2 * Math.ceil(n / 3)];
  let k = 0;
  return {
    acts: per.map((count, i) => ({
      actNumber: i + 1,
      title: `Act ${i + 1}`,
      purpose: "p",
      scenes: Array.from({ length: count }, () => {
        k += 1;
        return {
          sceneNumber: k, act: i + 1, title: `Scene ${k}`, setting: { location: "Library" },
          characters: ["A"], purpose: "x", cluesRevealed: k <= clued ? [`clue_${k}`] : [], dramaticElements: {},
          summary: "s", estimatedWordCount: 1000,
        };
      }),
    })),
    totalScenes: n,
  };
};

const ctxWith = (upserts: any[]): any => ({
  enableScoring: true,
  scoreAggregator: { upsertPhaseScore: (...args: any[]) => upserts.push(args) },
  inputs: { targetLength: "medium" },
  agentDurations: {},
  agentCosts: {},
  warnings: [],
  errors: [],
  cml: { CASE: {} },
  cast: { cast: [] },
  clues: { clues: [] },
  reportProgress: () => undefined,
  runId: "r",
  projectId: "p",
});

describe("A7-07 — rescoreNarrative applies the stage's scene-count gate", () => {
  it("flag OFF: an out-of-tolerance outline is re-scored WITHOUT the scene-count F (today)", async () => {
    setFlag(false);
    const upserts: any[] = [];
    await rescoreNarrative(ctxWith(upserts), outline(3, 3));
    expect(upserts).toHaveLength(1);
    expect(String(upserts[0][2].failure_reason ?? "")).not.toMatch(/Scene count/);
  });

  it("flag ON: the same outline gets the stage's F with the scene-count reason", async () => {
    setFlag(true);
    const upserts: any[] = [];
    await rescoreNarrative(ctxWith(upserts), outline(3, 3));
    expect(upserts).toHaveLength(1);
    const score = upserts[0][2];
    expect(score.total).toBe(0);
    expect(score.grade).toBe("F");
    expect(score.failure_reason).toMatch(/^Scene count: generated 3 scenes/);
  });

  it("flag ON: an in-tolerance outline scores the same as OFF", async () => {
    const a: any[] = []; const b: any[] = [];
    const n = getSceneTarget("medium");
    setFlag(false); await rescoreNarrative(ctxWith(a), outline(n, n));
    setFlag(true); await rescoreNarrative(ctxWith(b), outline(n, n));
    // On target the gate does not fire, so both paths record the identical honest score.
    expect(String(b[0][2].failure_reason ?? "")).not.toMatch(/Scene count/);
    expect(b[0][2]).toEqual(a[0][2]);
  });
});

describe("A7-D04 — clue pacing re-scores the outline it adopts", () => {
  const run: any = { minClueSceneRatio: 0.5, pacingGuardrails: [], lockedFactsSpread: {}, completenessSpread: {} };

  it("flag OFF: the pacing retry is adopted with no re-score (today)", async () => {
    setFlag(false);
    llm.next = outline(12, 12);
    const upserts: any[] = [];
    const adopted = await enforceCluePacing(ctxWith(upserts), run, outline(12, 1));
    expect(llm.calls).toBe(1);
    expect(adopted.acts[0].scenes[1].cluesRevealed).toEqual(["clue_2"]); // the retry was adopted
    expect(upserts).toHaveLength(0);
  });

  it("flag ON: the adopted retry is re-scored, and its scenes are the retry's (A7-02 normalises the act fields)", async () => {
    setFlag(true);
    llm.next = outline(12, 12);
    const upserts: any[] = [];
    const adopted = await enforceCluePacing(ctxWith(upserts), run, outline(12, 1));
    // A7-02 (same flag) runs attempt 1's normalisation on every adopted candidate, which fills act-level fields such
    // as estimatedWordCount; the scenes the retry wrote are what must survive unchanged.
    expect(adopted.acts.map((a: any) => a.scenes)).toEqual(outline(12, 12).acts.map((a: any) => a.scenes));
    expect(upserts).toHaveLength(1);
    expect(upserts[0][0]).toBe("agent7_narrative");
  });

  it("flag ON: no adoption (pacing already met) means no re-score", async () => {
    setFlag(true);
    const upserts: any[] = [];
    await enforceCluePacing(ctxWith(upserts), run, outline(12, 12));
    expect(llm.calls).toBe(0);
    expect(upserts).toHaveLength(0);
  });
});
