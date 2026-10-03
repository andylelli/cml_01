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
import { isAftermathFinalScene } from "../prose-contract/clue-obligations.js";


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

describe("A_89 B3 — one culprit-naming chapter, never the aftermath one", () => {

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
