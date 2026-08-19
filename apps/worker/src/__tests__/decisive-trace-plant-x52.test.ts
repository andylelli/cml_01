/**
 * X52 (REVIEW_11 §8.2) — the decisive trace is planted only if someone labelled it `essential`.
 *
 * The fixture is the real clue from run `mystery-1786999938275`:
 *
 *   clue_late_optional_slot_1 [late/optional] → "A torn piece of Hugo Vane's cuff was found caught
 *   on the edge of the private study door frame."
 *
 * `applyPlantBeforeReveal` filters on `criticality === "essential"`, so this one was never planted,
 * first reached a prose prompt in chapter 8, and Agent 9 dramatized it there as the torn navy wool
 * that breaks Hugo. The cold reader: "it appears for the first time in the reveal. Plant it earlier."
 */

import { describe, expect, it, afterEach } from "vitest";
import { applyDecisiveTracePlant } from "../jobs/agents/agent7-run.js";

const CUFF = {
  id: "clue_late_optional_slot_1",
  category: "physical",
  criticality: "optional",
  description: "A torn piece of Hugo Vane's cuff was found caught on the edge of the private study door frame.",
  pointsTo: "someone was at the study door in a hurry",
};

const makeCtx = (clues: any[]) => ({
  cml: { CASE: { culpability: { culprits: ["Hugo Vane"] } } },
  clues: { clues },
  warnings: [] as string[],
});

/** Ten scenes across three acts, with the reveal at scene 8 — the 08-17 shape. */
const makeNarrative = (revealScene = 8) => {
  const scenes = Array.from({ length: 10 }, (_, i) => ({
    sceneNumber: i + 1,
    beat: i === 0 ? "gathering" : "investigation",
    cluesRevealed: i + 1 === revealScene ? ["clue_late_optional_slot_1"] : [],
    cluesPlanted: [] as string[],
  }));
  return { acts: [{ actNumber: 1, scenes }] } as any;
};

const plantedScenes = (n: any): number[] =>
  n.acts[0].scenes
    .map((s: any, i: number) => (s.cluesPlanted.includes("clue_late_optional_slot_1") ? i + 1 : 0))
    .filter(Boolean);

describe("applyDecisiveTracePlant (X52)", () => {
  const orig = process.env.AGENT7_PLANT_BEFORE_REVEAL;
  afterEach(() => { process.env.AGENT7_PLANT_BEFORE_REVEAL = orig; });

  it("plants the culprit-implicating physical clue that `essential` filtering skipped", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx([CUFF]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    // Reveal at scene 8 → latest allowed plant is scene 6, the window the reader asked for.
    expect(plantedScenes(narrative)).toEqual([6]);
    expect(ctx.warnings.some((w: string) => w.includes("X52 decisive-trace plant"))).toBe(true);
  });

  it("NEVER plants a culprit-implicating clue in the opening — that is the answer, not a plant", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx([CUFF]) as any;
    // Reveal at scene 3 → the only allowed index would be scene 1, which is the body discovery.
    const narrative = makeNarrative(3);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
    expect(ctx.warnings).toEqual([]);
  });

  it("ignores clues that do not name the culprit", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const other = { ...CUFF, description: "A torn piece of cloth was caught on the study door frame.", pointsTo: "someone left in a hurry" };
    const ctx = makeCtx([other]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });

  it("ignores testimonial clues — a witness statement cannot be planted as an unremarked object", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const spoken = { ...CUFF, category: "testimonial", description: "A maid recalls seeing Hugo Vane leave the study." };
    const ctx = makeCtx([spoken]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });

  it("matches the culprit by surname as well as full name", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const bySurname = { ...CUFF, description: "A torn piece of Vane's cuff, caught on the study door frame." };
    const ctx = makeCtx([bySurname]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([6]);
  });

  it("does not double-stamp a clue the essential pass already planted", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx([CUFF]) as any;
    const narrative = makeNarrative(8);
    narrative.acts[0].scenes[3].cluesPlanted.push("clue_late_optional_slot_1"); // scene 4, by the other pass
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([4]);
    expect(ctx.warnings).toEqual([]);
  });

  it("is inert when the flag is OFF", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "";
    const ctx = makeCtx([CUFF]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });

  /**
   * FOUND ON REVIEW 2026-08-18 — the first version matched the culprit with a bare lower-cased
   * `includes()` on the full name and the surname: no word boundary, no common-word guard. On the
   * 08-17 case (culprit Vane) a weathervane in the stable read as culprit-implicating evidence.
   * `@cml/story-geometry`'s `nameMatcher` is the repo's answer to exactly this (A_61 RC4.4).
   */
  it("does not match a surname buried inside another word — the weathervane case", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const weathervane = { ...CUFF, description: "The weathervane above the stable creaked all night." };
    const ctx = makeCtx([weathervane]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });

  it("does not match a surname buried in an ordinary verb", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const hale = { ...CUFF, description: "She exhaled slowly and set the lamp down beside the clock." };
    const ctx = { cml: { CASE: { culpability: { culprits: ["Ivor Hale"] } } }, clues: { clues: [hale] }, warnings: [] } as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });

  it("still matches the culprit as a whole word, surname alone included", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = makeCtx([{ ...CUFF, description: "A torn cuff, caught on the door frame, marked Vane's hurry." }]) as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([6]);
  });

  it("is inert when the case names no culprit", () => {
    process.env.AGENT7_PLANT_BEFORE_REVEAL = "1";
    const ctx = { cml: { CASE: { culpability: { culprits: [] } } }, clues: { clues: [CUFF] }, warnings: [] } as any;
    const narrative = makeNarrative(8);
    applyDecisiveTracePlant(ctx, narrative);
    expect(plantedScenes(narrative)).toEqual([]);
  });
});
