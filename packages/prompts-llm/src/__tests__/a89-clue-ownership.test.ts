import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    getGenerationParams: () => ({ agent9_prose: { rollout_flags: { tiered_phrase_contract_enabled: false } } }),
  };
});

import { buildChapterObligationBlock } from "../agent9-prose/obligation-block.ts";
import {
  getRequiredClueIdsForScene,
  resolveClueOwnership,
  measureClueObligationLoad,
  summariseClueObligationLoad,
} from "../agent9-prose/clue-validation.ts";

/**
 * A_89 B1/B2 — one owning chapter per clue, and the obligation load counted.
 *
 * Every scene listing a clue received the same "MUST be dramatized" instruction, so the model staged
 * the same evidence repeatedly: a 41% median re-mandate rate over 47 logged runs, and a manuscript
 * ranking 25th worst of 212 for repeated six-word spans. The reader named the consequence three
 * times — "Chapters 3-6 circle the same evidence", "the proof becomes a speech", "Chapter 10 still
 * recaps too much evidence".
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const PAIRS: any[] = JSON.parse(
  fs.readFileSync(path.join(here, "fixtures", "a87-scene-ref-pairs.json"), "utf8"),
);

const scenes = [
  { sceneNumber: 1, act: 1, beat: "gathering", title: "A", purpose: "a", cluesRevealed: ["c1"] },
  { sceneNumber: 2, act: 1, beat: "crime", title: "B", purpose: "b", cluesRevealed: ["c1", "c2"] },
  { sceneNumber: 3, act: 2, beat: "motives", title: "C", purpose: "c", cluesRevealed: ["c1", "c2", "c3"] },
];
const cmlCase: any = {
  meta: { setting: { location: "Hall" } },
  cast: [{ name: "Alice Grey", role: "detective" }],
  culpability: { culprits: ["Edgar Vale"] },
  hidden_model: { mechanism: { description: "the mechanism" } },
  prose_requirements: { clue_to_scene_mapping: [] },
};
const clueDistribution: any = {
  clues: ["c1", "c2", "c3"].map((id) => ({
    id, category: "physical", description: `the ${id} detail`,
    observable: `a visible mark tied to ${id}`, pointsTo: "x", placement: "mid",
    criticality: "supporting", sourceInCML: "x",
  })),
};
const render = (sceneIndex: number, on: boolean): string => {
  const prior = process.env.AGENT9_CLUE_OWNERSHIP;
  if (on) process.env.AGENT9_CLUE_OWNERSHIP = "1"; else delete process.env.AGENT9_CLUE_OWNERSHIP;
  try {
    return buildChapterObligationBlock(
      [scenes[sceneIndex]], sceneIndex + 1, cmlCase, [] as any, undefined, clueDistribution,
      undefined, undefined, undefined, undefined, undefined, undefined, scenes, undefined,
    );
  } finally {
    if (prior === undefined) delete process.env.AGENT9_CLUE_OWNERSHIP;
    else process.env.AGENT9_CLUE_OWNERSHIP = prior;
  }
};

describe("A_89 B1 — one owning chapter per clue", () => {
  it("ownership is the FIRST scene that requires the clue", () => {
    const owner = resolveClueOwnership(cmlCase, scenes);
    expect(owner.get("c1")).toBe(1);
    expect(owner.get("c2")).toBe(2);
    expect(owner.get("c3")).toBe(3);
  });

  it("THE DEFECT, flag OFF: chapter 3 is told to dramatize all three clues", () => {
    const block = render(2, false);
    expect(block).toContain("CLUE OBLIGATIONS");
    expect(block).not.toContain("ALREADY ON THE PAGE");
    for (const id of ["c1", "c2", "c3"]) expect(block).toContain(`[${id}]`);
  });

  it("THE FIX, flag ON: chapter 3 dramatizes only what it owns and refers to the rest", () => {
    const block = render(2, true);
    expect(block).toContain("[c3]");            // owned — still dramatized
    expect(block).not.toContain("[c1]");        // owned by chapter 1
    expect(block).not.toContain("[c2]");        // owned by chapter 2
    expect(block).toContain("ALREADY ON THE PAGE");
    expect(block).toContain("do NOT re-stage");
  });

  it("the owning chapter is unaffected", () => {
    expect(render(0, true)).toContain("[c1]");
    expect(render(0, true)).not.toContain("ALREADY ON THE PAGE");
  });

  it("VALIDATION IS UNCHANGED: the clue is still REQUIRED in the later chapter", () => {
    // Narrowing what we ASK for must not narrow what we ACCEPT — that conflation is how a
    // formatting rule became a content filter in A_89 D1.
    expect(getRequiredClueIdsForScene(cmlCase, scenes[2], scenes)).toEqual(["c1", "c2", "c3"]);
  });
});

describe("A_89 B2 — the obligation load is counted, not capped", () => {
  it("reports totals, the re-mandate rate and the heaviest chapter", () => {
    const load = measureClueObligationLoad(cmlCase, scenes);
    expect(load.total).toBe(6);
    expect(load.distinct).toBe(3);
    expect(Math.round(load.reMandateRate * 100)).toBe(50);
    expect(load.heaviestChapter).toBe(3);
    expect(load.heaviestCount).toBe(3);
  });

  it("flags a chapter over budget, and says why it matters", () => {
    const heavy = [{ sceneNumber: 1, act: 1, cluesRevealed: Array.from({ length: 14 }, (_, i) => `x${i}`) }];
    const load = measureClueObligationLoad(cmlCase, heavy);
    expect(load.overBudget).toEqual([{ chapter: 1, count: 14 }]);
    expect(summariseClueObligationLoad(load)).toContain("OVER BUDGET");
    expect(summariseClueObligationLoad(load)).toContain("recite them instead");
  });

  it("MEASURED on the archive: 7 of 45 books carry an over-budget chapter", () => {
    const over = PAIRS.filter(
      (p) => measureClueObligationLoad({ prose_requirements: p.prose_requirements }, p.scenes).overBudget.length > 0,
    );
    expect(over.length).toBe(7);
  });
});
