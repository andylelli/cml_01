/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A7-02 step 2 and A7-D07.
 *
 * A7-02: every outline candidate Agent 7 adopts goes through `adoptOutlineCandidate` (attempt 1's normalisation
 * plus a warn-only schema validation). OFF: a retry candidate is adopted as the LLM returned it.
 * A7-D07: the clue-pacing gate counts only clue ids the clue distribution contains. OFF: any non-empty array.
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

import { validateArtifact } from "@cml/cml";
import { getSceneTarget } from "@cml/story-validation";
import { adoptOutlineCandidate } from "../jobs/agents/agent7/normalize.js";
import { ensureSchemaValid } from "../jobs/agents/agent7/generate.js";
import { enforceSceneCount } from "../jobs/agents/agent7/scene-count.js";
import { countClueBearingScenes, enforceCluePacing } from "../jobs/agents/agent7/clue-pacing.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; llm.calls = 0; llm.next = null; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

/** `n` scenes over three acts; scene k carries `idOf(k)` when k <= clued. */
const outline = (n: number, clued: number, idOf: (k: number) => string = (k) => `clue_${k}`): any => {
  const per = [Math.ceil(n / 3), Math.ceil(n / 3), n - 2 * Math.ceil(n / 3)];
  let k = 0;
  return {
    acts: per.map((count, i) => ({
      actNumber: i + 1,
      title: `Act ${i + 1}`,
      purpose: "p",
      estimatedWordCount: count * 1000,
      scenes: Array.from({ length: count }, () => {
        k += 1;
        return {
          sceneNumber: k, act: i + 1, title: `Scene ${k}`, setting: { location: "Library", timeOfDay: "evening", atmosphere: "tense" },
          characters: ["A"], purpose: "x", cluesRevealed: k <= clued ? [idOf(k)] : [], dramaticElements: {},
          summary: "s", estimatedWordCount: 1000,
        };
      }),
    })),
    totalScenes: n,
    estimatedTotalWords: n * 1000,
    pacingNotes: ["steady"],
    cost: 0,
    durationMs: 0,
  };
};

const distribution = (n: number) => ({ clues: Array.from({ length: n }, (_, i) => ({ id: `clue_${i + 1}`, placement: "mid" })) });

const ctxWith = (clues: any = { clues: [] }): any => ({
  enableScoring: false,
  scoreAggregator: undefined,
  inputs: { targetLength: "medium" },
  agentDurations: {},
  agentCosts: {},
  warnings: [] as string[],
  errors: [] as string[],
  cml: { CASE: {} },
  cast: { cast: [] },
  clues,
  reportProgress: () => undefined,
  runId: "r",
  projectId: "p",
});
const run: any = { minClueSceneRatio: 0.5, pacingGuardrails: [], lockedFactsSpread: {}, completenessSpread: {} };

/** A candidate with two defects attempt 1's normalisation repairs: no Act III purpose, a synonym beat. */
const defectiveCandidate = (n: number): any => {
  const o = outline(n, n);
  delete o.acts[2].purpose;
  o.acts[1].scenes[0].beat = "resolution";
  return o;
};

describe("A7-02 — adoptOutlineCandidate", () => {
  it("the fixture is a schema-valid outline (so a warning below is the candidate's defect, not the fixture's)", () => {
    expect(validateArtifact("narrative_outline", outline(9, 9)).errors).toEqual([]);
  });

  it("a valid candidate adopts silently and unchanged", () => {
    const ctx = ctxWith();
    const c = outline(9, 9);
    const v = adoptOutlineCandidate(ctx, c, "clue-pacing");
    expect(v.valid).toBe(true);
    expect(c).toEqual(outline(9, 9));
    expect(ctx.warnings.filter((w: string) => w.startsWith("[A7-02]"))).toEqual([]);
  });

  it("applies attempt 1's normalisation (act purpose, beat coercion) and validates warn-only", () => {
    const ctx = ctxWith();
    const c = defectiveCandidate(9);
    const v = adoptOutlineCandidate(ctx, c, "coverage");
    expect(c.acts[2].purpose).toMatch(/confrontation/);
    expect(c.acts[1].scenes[0].beat).toBe("revelation");
    expect(v.valid).toBe(validateArtifact("narrative_outline", c).valid);
  });

  it("an invalid candidate is reported, never thrown", () => {
    const ctx = ctxWith();
    const c = outline(9, 9);
    c.acts[0].scenes[0].characters = "not-an-array";
    expect(() => adoptOutlineCandidate(ctx, c, "scene-count")).not.toThrow();
    expect(ctx.warnings.some((w: string) => w.startsWith("[A7-02] outline candidate from scene-count fails schema validation (warn-only"))).toBe(true);
  });
});

describe("A7-02 — the scene-count retry route", () => {
  const n = getSceneTarget("medium");

  it("flag OFF: the retry candidate is adopted un-normalised (today)", async () => {
    setFlag(false);
    llm.next = defectiveCandidate(n);
    const adopted = await enforceSceneCount(ctxWith(), run, outline(3, 3));
    expect(llm.calls).toBe(1);
    expect(adopted.acts[2].purpose).toBeUndefined();
    expect(adopted.acts[1].scenes[0].beat).toBe("resolution");
  });

  it("flag ON: the adopted retry is normalised like attempt 1", async () => {
    setFlag(true);
    llm.next = defectiveCandidate(n);
    const ctx = ctxWith();
    const adopted = await enforceSceneCount(ctx, run, outline(3, 3));
    expect(llm.calls).toBe(1);
    expect(adopted.acts[2].purpose).toMatch(/confrontation/);
    expect(adopted.acts[1].scenes[0].beat).toBe("revelation");
    expect(ctx.warnings).toContain("act3.purpose was missing — synthesised default.");
  });
});

describe("A7-02 — the schema-repair route", () => {
  it("flag ON: the retry gets the full normalisation before the hard gate (adopted, not thrown)", async () => {
    setFlag(true);
    const first = outline(9, 9);
    first.acts[0].scenes[0].characters = "not-an-array"; // attempt 1 invalid -> schema retry
    llm.next = defectiveCandidate(9);
    const ctx = ctxWith();
    const adopted = await ensureSchemaValid(ctx, run, first);
    expect(llm.calls).toBe(1);
    expect(adopted.acts[2].purpose).toMatch(/confrontation/);
    expect(adopted.acts[1].scenes[0].beat).toBe("revelation");
  });

  it("flag OFF: the retry keeps its three passes only (beat coerced, purpose not filled)", async () => {
    setFlag(false);
    const first = outline(9, 9);
    first.acts[0].scenes[0].characters = "not-an-array";
    llm.next = defectiveCandidate(9);
    const ctx = ctxWith();
    // OFF has no act-purpose fill on the retry (A7-D02 is behind the same flag): the schema gate throws.
    await expect(ensureSchemaValid(ctx, run, first)).rejects.toThrow(/schema validation/);
    expect(ctx.failedNarrative.acts[1].scenes[0].beat).toBe("revelation");
    expect(ctx.failedNarrative.acts[2].purpose).toBeUndefined();
  });
});

describe("A7-D07 — the clue-pacing gate counts only known clue ids", () => {
  it("countClueBearingScenes: OFF counts hallucinated ids, ON does not", () => {
    const scenes = outline(6, 6, (k) => (k <= 2 ? `clue_${k}` : `ghost_${k}`)).acts.flatMap((a: any) => a.scenes);
    setFlag(false);
    expect(countClueBearingScenes(scenes, distribution(6) as any)).toBe(6);
    setFlag(true);
    expect(countClueBearingScenes(scenes, distribution(6) as any)).toBe(2);
    // No distribution ids to check against: the raw count stands.
    expect(countClueBearingScenes(scenes, { clues: [] } as any)).toBe(6);
  });

  it("flag OFF: an outline whose clue ids are all hallucinated passes the gate (no retry)", async () => {
    setFlag(false);
    const incoming = outline(12, 12, (k) => `ghost_${k}`);
    const adopted = await enforceCluePacing(ctxWith(distribution(12)), run, incoming);
    expect(llm.calls).toBe(0);
    expect(adopted).toBe(incoming);
  });

  it("flag ON: the same outline is below threshold and the pacing retry runs", async () => {
    setFlag(true);
    llm.next = outline(12, 12);
    const ctx = ctxWith(distribution(12));
    const adopted = await enforceCluePacing(ctx, run, outline(12, 12, (k) => `ghost_${k}`));
    expect(llm.calls).toBe(1);
    expect(ctx.warnings.some((w: string) => /clue pacing below threshold: 0\/12/.test(w))).toBe(true);
    expect(adopted.acts[0].scenes[0].cluesRevealed).toEqual(["clue_1"]);
  });
});
