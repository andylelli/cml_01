import { afterEach, describe, expect, it } from "vitest";
import { applyMotivePlantBeforeReveal } from "../jobs/agents/agent7-run.js";

/**
 * DIAGNOSIS-BATCH #2 — a motive-behavioral beat planted before the reveal, on the SAME shape as
 * applyPlantBeforeReveal.
 *
 * MEASURED twice: the 84/100 read asked for it once ("'You did this for me, didn't you?'... it
 * arrives too late... plant it earlier with one small moment") and the 78/100 read asked for it
 * again on a different culprit ("Give Kestrel one stronger motive scene with Montague").
 */

const FLAG = "AGENT7_MOTIVE_PLANT_BEFORE_REVEAL";

const makeCtx = (culprits: string[], clues: any[]) => ({
  cml: { CASE: { culpability: { culprits } } },
  clues: { clues },
  warnings: [] as string[],
});

const makeNarrative = (sceneClues: string[][]) => ({
  acts: [
    {
      actNumber: 1,
      scenes: sceneClues.map((ids, i) => ({ sceneNumber: i + 1, cluesRevealed: [...ids] })),
    },
  ],
});

const CLUES = [
  { id: "c_ess1", criticality: "essential" },
  { id: "c_ess2", criticality: "essential" },
  { id: "c_sup", criticality: "supporting" },
];

describe("applyMotivePlantBeforeReveal (diagnosis-batch #2)", () => {
  const orig = process.env[FLAG];
  afterEach(() => {
    if (orig === undefined) delete process.env[FLAG];
    else process.env[FLAG] = orig;
  });

  it("stamps a motive beat for the culprit ≥2 scenes before the latest essential reveal (flag on)", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess1"]]) as any; // reveal at idx 4
    applyMotivePlantBeforeReveal(ctx, narrative);
    const scenes = narrative.acts[0].scenes;
    const plantIdx = scenes.findIndex((s: any) => s.motiveBeatCulprit === "Ivor Kestrel");
    expect(plantIdx).toBeGreaterThanOrEqual(0);
    expect(plantIdx).toBeLessThanOrEqual(2); // >= 2 scenes before idx 4
    expect(ctx.warnings.some((w: string) => w.includes("motive-plant-before-reveal"))).toBe(true);
  });

  it("does nothing when the flag is off (default)", () => {
    delete process.env[FLAG];
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess1"]]) as any;
    applyMotivePlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => !s.motiveBeatCulprit)).toBe(true);
    expect(ctx.warnings).toEqual([]);
  });

  it("uses the LATEST essential reveal as the window, not the first", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    // essential reveals at idx 1 AND idx 5 — the window must be relative to idx 5, the latest.
    const narrative = makeNarrative([[], ["c_ess1"], [], [], [], ["c_ess2"]]) as any;
    applyMotivePlantBeforeReveal(ctx, narrative);
    const plantIdx = narrative.acts[0].scenes.findIndex((s: any) => s.motiveBeatCulprit);
    expect(plantIdx).toBeLessThanOrEqual(3); // >= 2 scenes before idx 5
  });

  it("prefers the sparsest scene — one already carrying a clue plant is deprioritized", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess1"]]) as any;
    (narrative.acts[0].scenes[0] as any).cluesPlanted = ["some_clue"]; // scene 1 already loaded
    applyMotivePlantBeforeReveal(ctx, narrative);
    const plantIdx = narrative.acts[0].scenes.findIndex((s: any) => s.motiveBeatCulprit);
    expect(plantIdx).not.toBe(0); // scene 1 (idx 0) has a plant already; scene 2 (idx 1) does not
  });

  it("does NOT plant when the reveal is too early for 'plant it earlier' to apply", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([["c_ess1"], [], [], []]) as any; // reveal at idx 0
    applyMotivePlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => !s.motiveBeatCulprit)).toBe(true);
  });

  it("does nothing with no named culprit", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx([], CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess1"]]) as any;
    applyMotivePlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => !s.motiveBeatCulprit)).toBe(true);
  });

  it("is additive only — never touches cluesRevealed or an existing cluesPlanted array", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess1"]]) as any;
    (narrative.acts[0].scenes[1] as any).cluesPlanted = ["untouched_clue"];
    applyMotivePlantBeforeReveal(ctx, narrative);
    expect((narrative.acts[0].scenes[1] as any).cluesPlanted).toEqual(["untouched_clue"]);
  });

  it("does not double-stamp a scene that already carries a motive beat", () => {
    process.env[FLAG] = "1";
    const ctx = makeCtx(["Ivor Kestrel"], CLUES) as any;
    const narrative = makeNarrative([[], [], ["c_ess1"]]) as any; // reveal at idx 2, only scenes 0 eligible
    (narrative.acts[0].scenes[0] as any).motiveBeatCulprit = "Someone Else";
    applyMotivePlantBeforeReveal(ctx, narrative);
    expect((narrative.acts[0].scenes[0] as any).motiveBeatCulprit).toBe("Someone Else"); // unchanged
  });
});
