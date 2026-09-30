/**
 * X4 (architecture/REVIEW_05.md §10.6) — the injector-vs-linter class.
 *
 * `lint.ts` forbids the model from closing a resolution chapter with a summary verdict. The
 * deterministic floors write exactly that shape and are not subject to the rule. On run
 * `mystery-1785870981757` the manuscript's only sentence naming its murderer was a machine's, and it
 * matched the forbidden pattern.
 *
 * §10.6 chooses Option 2 — record, do not refuse — because refusing means shipping without the
 * obligation, which ADR-0003 forbids for a repairable defect. So the bar these tests hold is:
 *
 *   1. the standard is ONE registry, and the injector's real output is measured against it — not a
 *      second copy of the regexes that can drift from the linter's;
 *   2. recording never alters what ships;
 *   3. a zero is EMITTED, because "no telemetry" and "no violations" must not look the same.
 */

import { describe, expect, it } from "vitest";

import {
  buildCulpritEvidenceSentence,
  buildSuspectClearanceSentence,
  findModelBoundRuleViolations,
} from "@cml/prompts-llm";



describe("findModelBoundRuleViolations", () => {
  it("catches the culprit-evidence injector's own sentence", () => {
    // THE FINDING, as an assertion. If this ever goes green-by-passing (no violations), either the
    // injector stopped writing verdict prose or the rule was weakened — both worth a failed test.
    const violations = findModelBoundRuleViolations(buildCulpritEvidenceSentence("Captain Ivor Hale"));
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.map((v) => v.id)).toContain("verdict_closer.beyond");
  });

  it("catches the laundered form the B5 scaffold floor rewrites it into", () => {
    // The shipped sentence was not the injector's — it was the floor's rewrite of it. A check that
    // only knew the original would have found nothing on the run that produced this whole review.
    const shipped = "Captain Ivor Hale was responsible; the evidence allowed no other reading.";
    expect(findModelBoundRuleViolations(shipped).map((v) => v.id)).toContain(
      "verdict_closer.was_responsible",
    );
  });

  it("does not fire on ordinary prose, or on the clearance sentence", () => {
    expect(findModelBoundRuleViolations("She set the lamp down and did not look at him again.")).toEqual([]);
    expect(findModelBoundRuleViolations("")).toEqual([]);
    expect(findModelBoundRuleViolations(buildSuspectClearanceSentence("Ellsworth"))).toEqual([]);
  });
});
