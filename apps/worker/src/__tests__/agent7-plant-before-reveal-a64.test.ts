import { describe, expect, it, afterEach } from "vitest";
import { applyPlantBeforeReveal } from "../jobs/agents/agent7-run.js";

// A_64 §3.3 C1 — plant-before-reveal outline stamp (additive, RC3.5 pattern). The corpus's #1
// deficit: essential clues whose REVEAL is their first appearance, read as "introduced too late /
// unearned". Every essential clue revealed at scene ≥3 gets cluesPlanted stamped ≥2 scenes earlier.

const makeCtx = (clues: any[]) => ({
  cml: { CASE: {} },
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

describe("applyPlantBeforeReveal — A_64 C1", () => {
  const origEnv = process.env.AGENT7_PLANT_BEFORE_REVEAL;
  afterEach(() => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = origEnv;
  });

  const CLUES = [
    { id: "c_ess", criticality: "essential" },
    { id: "c_sup", criticality: "supporting" },
  ];

  it("stamps a plant ≥2 scenes before a late essential reveal (flag on)", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx(CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess"]]) as any; // reveal at scene 5 (idx 4)
    applyPlantBeforeReveal(ctx, narrative);
    const scenes = narrative.acts[0].scenes;
    const plantIdx = scenes.findIndex((s: any) => (s.cluesPlanted ?? []).includes("c_ess"));
    expect(plantIdx).toBeGreaterThanOrEqual(0);
    expect(plantIdx).toBeLessThanOrEqual(2); // ≥2 scenes before idx 4
    expect(ctx.warnings.some((w: string) => w.includes("plant-before-reveal"))).toBe(true);
  });

  it("does NOT plant an early essential reveal (scene ≤2 — the complaint cannot apply)", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx(CLUES) as any;
    const narrative = makeNarrative([["c_ess"], [], [], []]) as any;
    applyPlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => !(s.cluesPlanted ?? []).length)).toBe(true);
  });

  it("ignores supporting clues (essentials only — signature-narrow like the scheduler)", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx(CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_sup"]]) as any;
    applyPlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => !(s.cluesPlanted ?? []).length)).toBe(true);
  });

  it("is additive only — never touches cluesRevealed", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx(CLUES) as any;
    const narrative = makeNarrative([["c_sup"], [], [], [], ["c_ess"]]) as any;
    const before = JSON.stringify(narrative.acts[0].scenes.map((s: any) => s.cluesRevealed));
    applyPlantBeforeReveal(ctx, narrative);
    expect(JSON.stringify(narrative.acts[0].scenes.map((s: any) => s.cluesRevealed))).toBe(before);
  });

  it("is a no-op with the flag off (default)", () => {
    delete process.env.AGENT7_PLANT_BEFORE_REVEAL;
    const ctx = makeCtx(CLUES) as any;
    const narrative = makeNarrative([[], [], [], [], ["c_ess"]]) as any;
    applyPlantBeforeReveal(ctx, narrative);
    expect(narrative.acts[0].scenes.every((s: any) => s.cluesPlanted === undefined)).toBe(true);
    expect(ctx.warnings).toEqual([]);
  });

  it("spreads multiple plants by least-planted-first (no single dumping ground)", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx([
      { id: "e1", criticality: "essential" },
      { id: "e2", criticality: "essential" },
    ]) as any;
    const narrative = makeNarrative([[], [], [], [], ["e1"], ["e2"]]) as any;
    applyPlantBeforeReveal(ctx, narrative);
    const plantCounts = narrative.acts[0].scenes.map((s: any) => (s.cluesPlanted ?? []).length);
    expect(Math.max(...plantCounts)).toBe(1); // two plants, two different scenes
    expect(plantCounts.reduce((a: number, b: number) => a + b, 0)).toBe(2);
  });
});
