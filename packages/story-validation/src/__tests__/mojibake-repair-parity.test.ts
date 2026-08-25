/**
 * A_73 §11.2 / §22.1 — the DETECTOR and the REPAIR table must agree.
 *
 * X79 unified the detector after a release-gate hard stop read a shorter list than the validator.
 * The two repair tables were left alone and drifted, so the saved manuscript and the rendered one
 * were different text — and, worse, the double-encoded family was DETECT-ONLY: the gate aborts a
 * run on `mojibake/encoding artifact remains` and neither table could remove it.
 *
 * This is the parity test that class needed. `mojibake-one-vocabulary.test.ts` pins that there is
 * one detector; this pins that everything the detector can find, the repairer can fix.
 */
import { describe, it, expect } from "vitest";
import { repairMojibake } from "@cml/cml";
import { MOJIBAKE_PATTERN } from "../chapter-validator.js";

/** One specimen per family the detector matches. Extend this list when the detector gains a case. */
const SPECIMENS: ReadonlyArray<readonly [string, string]> = [
  ["double-encoded apostrophe", "It wasnÃ¢â‚¬â„¢t the clock."],
  ["double-encoded left double quote", "He said Ã¢â‚¬Å“stopÃ¢â‚¬\x9d."],
  ["double-encoded en dash", "half Ã¢â‚¬â€œ past"],
  ["double-encoded ellipsis", "he pausedÃ¢â‚¬Â¦"],
  ["single-encoded apostrophe", "It wasnâ€™t the clock."],
  ["single-encoded quotes", "He said â€œstopâ€\x9d."],
  ["single-encoded ellipsis", "he pausedâ€¦"],
  ["stray Â", "10Â°"],
  ["replacement char", "caf�"],
  ["façade, detector's double-encoded form", "the faË†Â§ade of the hotel"],
];

describe("mojibake: the repairer can fix everything the detector flags", () => {
  it.each(SPECIMENS)("%s is detected before repair and absent after", (_label, sample) => {
    expect(MOJIBAKE_PATTERN.test(sample)).toBe(true);
    const repaired = repairMojibake(sample);
    expect(
      MOJIBAKE_PATTERN.test(repaired),
      `repairMojibake left a detectable artifact: ${JSON.stringify(repaired)}`,
    ).toBe(false);
  });

  it("is idempotent — repairing twice changes nothing", () => {
    for (const [, sample] of SPECIMENS) {
      const once = repairMojibake(sample);
      expect(repairMojibake(once)).toBe(once);
    }
  });

  it("repairs the `faˆ§ade` form too, which the DETECTOR does not recognise", () => {
    /**
     * A_73, found while writing this test: the divergence also runs the other way. The API's table
     * carried a `faˆ§ade` → `façade` rule for a form `MOJIBAKE_PATTERN` has never matched (the
     * detector knows only the double-encoded `Ë†Â§`). So one body repaired something the other could
     * not see — harmless, but it is the same two-body defect with the roles reversed, and it is the
     * reason this file asserts the two directions separately instead of assuming they are one set.
     *
     * The rule is KEPT: it fixes a real artifact. What is fixed is that it is now written down.
     */
    const sample = "the faˆ§ade of the hotel";
    expect(MOJIBAKE_PATTERN.test(sample)).toBe(false); // detector is blind to this form
    expect(repairMojibake(sample)).toBe("the façade of the hotel");
  });

  it("leaves clean prose untouched", () => {
    const clean = "It wasn’t the clock — she said “stop”, and paused…";
    expect(repairMojibake(clean)).toBe(clean);
  });

  it("repairs the double-encoded form completely, not down to its single-encoded substring", () => {
    // Ordering guard: a double-encoded sequence CONTAINS a single-encoded one. If the short rules
    // ran first the remainder would survive, which is how a detect-only hard stop is reintroduced.
    const repaired = repairMojibake("It wasnÃ¢â‚¬â„¢t");
    expect(repaired).toBe("It wasn’t");
  });
});
