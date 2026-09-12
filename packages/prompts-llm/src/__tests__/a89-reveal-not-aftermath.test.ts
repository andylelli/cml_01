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
import { resolveStageModeKey, isAftermathFinalScene } from "../agent9-prose/clue-validation.ts";

/**
 * A_89 B3 — the aftermath chapter must never also carry the reveal contract.
 *
 * ITEM 11 established for the STAGE MODE that a closing `revelation` chapter is aftermath when an
 * earlier `final_trap` chapter names the culprit on-page. The obligation block asked the same
 * question with an independent predicate and answered it differently, so the final chapter received
 * "walk the full evidence chain" beside "do NOT end on the arrest/confession line".
 *
 * MEASURED across every run in the prompt log: the reveal contract was assigned in 39 runs and
 * collided with AFTERMATH REQUIRED in 37 of them (95%). A_87's "last revelation beat wins" made it
 * universal, because the last revelation beat is the final scene in 44 of 45 outlines. The external
 * reader of run 88651 wrote the symptom back: "Chapter 10 still recaps too much evidence."
 *
 * The metric below is culprit-NAMING mandates, not reveal contracts: the DT contract's required beats
 * include "(5) culprit named and case sealed", so it is a naming mandate too. Counting only the
 * reveal contract mistakes a Golden-Age arc — where the final_trap chapter does the naming — for a
 * loss.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const PAIRS: any[] = JSON.parse(
  fs.readFileSync(path.join(here, "fixtures", "a87-scene-ref-pairs.json"), "utf8"),
);
const caseFor = (p: any): any => ({
  meta: { setting: { location: "Archived Hall" } },
  cast: p.cast?.length ? p.cast : [{ name: "Alice Grey", role: "detective" }],
  culpability: { culprits: p.culprits?.length ? p.culprits : ["Edgar Vale"] },
  hidden_model: { mechanism: { description: p.mechanism || "the mechanism" } },
  prose_requirements: p.prose_requirements,
});

const tally = (on: boolean) => {
  const prior = process.env.AGENT9_SCENE_REF_ARBITRATION;
  if (on) process.env.AGENT9_SCENE_REF_ARBITRATION = "1";
  else delete process.env.AGENT9_SCENE_REF_ARBITRATION;
  try {
    let one = 0, none = 0, many = 0, revealOnAftermath = 0;
    for (const p of PAIRS) {
      const cml = caseFor(p);
      const naming: number[] = [];
      let revealCh = -1;
      p.scenes.forEach((s: any, i: number) => {
        const stage = resolveStageModeKey(i + 1, i + 1, p.scenes.length, false, cml, p.scenes, [s] as any);
        const b = buildChapterObligationBlock(
          [s], i + 1, cml, [] as any, undefined, { clues: [] } as any,
          undefined, undefined, undefined, undefined, undefined, undefined, p.scenes, stage as any,
        );
        if (b.includes("CULPRIT REVELATION REQUIRED") || b.includes("DISCRIMINATING TEST (")) naming.push(i + 1);
        if (b.includes("CULPRIT REVELATION REQUIRED")) revealCh = i + 1;
      });
      if (naming.length === 1) one++; else if (naming.length === 0) none++; else many++;
      if (revealCh > 0 && isAftermathFinalScene(p.scenes[revealCh - 1], p.scenes)) revealOnAftermath++;
    }
    return { one, none, many, revealOnAftermath };
  } finally {
    if (prior === undefined) delete process.env.AGENT9_SCENE_REF_ARBITRATION;
    else process.env.AGENT9_SCENE_REF_ARBITRATION = prior;
  }
};

describe("A_89 B3 — one culprit-naming chapter, never the aftermath one", () => {
  it("THE DEFECT and THE FIX: reveal-on-aftermath 31/45 -> 0", () => {
    // Flag OFF is the historical behaviour: 31 of 45 books hand the reveal contract to the chapter
    // whose stage mode is `aftermath_consequence`. The production prompt log agrees — the reveal
    // contract collided with AFTERMATH REQUIRED in 37 of the 39 runs where it was assigned.
    expect(tally(false).revealOnAftermath).toBe(31);
    expect(tally(true).revealOnAftermath).toBe(0);
  });

  it("MEASURED: exactly one naming chapter goes from 3/45 to 30/45", () => {
    expect(tally(false)).toMatchObject({ one: 3, none: 0, many: 42 });
    expect(tally(true)).toMatchObject({ one: 30, none: 0, many: 15 });
  });

  it("no book is left with NO culprit-naming chapter in either state", () => {
    expect(tally(false).none).toBe(0);
    expect(tally(true).none).toBe(0);
  });

  it("KNOWN-POSITIVE: isAftermathFinalScene fires on a Golden-Age arc and not otherwise", () => {
    const golden = [
      { sceneNumber: 1, act: 1, beat: "gathering" },
      { sceneNumber: 2, act: 3, beat: "final_trap" },
      { sceneNumber: 3, act: 3, beat: "revelation" },
    ];
    expect(isAftermathFinalScene(golden[2], golden)).toBe(true);
    expect(isAftermathFinalScene(golden[1], golden)).toBe(false);
    // No earlier final_trap — a legitimately late reveal must NOT be suppressed.
    const lateReveal = [
      { sceneNumber: 1, act: 1, beat: "gathering" },
      { sceneNumber: 2, act: 2, beat: "secrets" },
      { sceneNumber: 3, act: 3, beat: "revelation" },
    ];
    expect(isAftermathFinalScene(lateReveal[2], lateReveal)).toBe(false);
  });
});
