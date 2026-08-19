import { describe, it, expect } from "vitest";
import { INJECTION_TEMPLATES } from "../jobs/agents/agent9-run.js";
import { detectTemplateLeakage, detectScaffoldNotProse } from "@cml/prose-guard";

/**
 * X64 / X65 — the locked-fact injector, measured against what it actually shipped.
 *
 * `story_20260819-0147` contains exactly two injected sentences, each appearing TWICE, verbatim:
 *
 *   "It had taken forty-five minutes in all."                                            ×2
 *   "Length of the thin control wire from Rooftop Terrace to clock mechanism came to
 *    twenty-five feet."                                                                  ×2
 *
 * Both were by construction. A_62 replaced one fixed string with a rotation "selected
 * deterministically from the VALUE" — but a locked fact's value is invariant across the manuscript,
 * which is what makes it locked, so the rotation could never rotate and MAX_INJECTIONS_PER_FACT = 2
 * delivered two identical sentences. And the `length` variant used the fact's `description` as its
 * SUBJECT, which is a schema label rather than a noun phrase.
 *
 * The existing non-membership test missed both: its fixtures ("the corridor", "the drop") are
 * already noun phrases, and it asserted that different VALUES vary — which is true, and irrelevant,
 * because one manuscript has one value per fact.
 */

/** The real 08-19 registry entries, verbatim from the run checkpoint. */
const WIRE_DESC = "Length of the thin control wire from rooftop terrace to clock mechanism";
const WIRE_VALUE = "twenty-five feet";
const DURATION_VALUE = "forty-five minutes";

describe("X65 — a schema label is not a sentence subject", () => {
  it("does not paste the description verbatim as the subject", () => {
    const out = INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, "0");
    expect(out).not.toContain("Length of the thin control wire from rooftop terrace to clock mechanism");
    expect(out.toLowerCase()).not.toMatch(/^length of/);
  });

  it("recovers the thing itself from the label", () => {
    // "Length of the thin control wire from rooftop terrace to clock mechanism"
    //   → strip the measurement head, drop the prepositional tail → "The thin control wire"
    expect(INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, "0")).toMatch(/The thin control wire/);
  });

  it("handles the shapes the old fixtures used, unchanged", () => {
    expect(INJECTION_TEMPLATES.length("the corridor", "thirty feet", "0")).toMatch(/[Tt]he corridor|Measured out/);
    expect(INJECTION_TEMPLATES.weight("the paperweight", "three pounds")).toBe("The paperweight weighed three pounds.");
  });

  it("never emits a bare label with no article", () => {
    for (const d of [WIRE_DESC, "Distance from the terrace to the lobby", "Weight of the bronze statuette", ""]) {
      const out = INJECTION_TEMPLATES.length(d, "ten feet", "0");
      expect(out, `on: ${d}`).toMatch(/^(The|A|An|His|Her|Its|Their|It|Measured out)\b/);
    }
  });
});

describe("X64 — the rotation must rotate WITHIN a manuscript, not across values", () => {
  // MAX_INJECTIONS_PER_FACT is 2, so these are the only two sentences a fact can ever produce in one
  // manuscript. They must differ — not "usually differ", which is what a hash of the value gave.
  it("the two injections of ONE fact are always different sentences", () => {
    for (const [type, desc, value] of [
      ["duration_minutes", "d", DURATION_VALUE],
      ["length", WIRE_DESC, WIRE_VALUE],
      ["time", "d", "a quarter to three"],
    ] as const) {
      const first = (INJECTION_TEMPLATES as any)[type](desc, value, "0");
      const second = (INJECTION_TEMPLATES as any)[type](desc, value, "1");
      expect(second, `${type} repeated itself`).not.toBe(first);
    }
  });

  it("the exact pair the 08-19 manuscript shipped verbatim is now two sentences", () => {
    expect(INJECTION_TEMPLATES.duration_minutes("d", DURATION_VALUE, "1"))
      .not.toBe(INJECTION_TEMPLATES.duration_minutes("d", DURATION_VALUE, "0"));
    expect(INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, "1"))
      .not.toBe(INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, "0"));
  });

  it("stays deterministic: same fact, same occurrence, same sentence across runs", () => {
    expect(INJECTION_TEMPLATES.time("d", "a quarter to three", "1"))
      .toBe(INJECTION_TEMPLATES.time("d", "a quarter to three", "1"));
  });

  it("different VALUES still start on different variants — A_62's contract, kept", () => {
    const outputs = new Set(
      ["half past three", "seven o'clock", "ten minutes past eleven", "a quarter to eight", "noon"]
        .map((v) => INJECTION_TEMPLATES.time("d", v, "0").replace(v, "{v}")),
    );
    expect(outputs.size).toBeGreaterThan(1);
  });

  it("omitting the seed preserves the old behaviour exactly", () => {
    expect(INJECTION_TEMPLATES.time("d", "half past three")).toBe(INJECTION_TEMPLATES.time("d", "half past three"));
  });

  it("every chapter variant still clears the detectors that police this class", () => {
    for (let i = 1; i <= 12; i++) {
      for (const out of [
        INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, String(i)),
        INJECTION_TEMPLATES.duration_minutes("d", DURATION_VALUE, String(i)),
        INJECTION_TEMPLATES.time("d", "a quarter to three", String(i)),
      ]) {
        expect(detectTemplateLeakage(out), `leakage on: ${out}`).toEqual([]);
        expect(detectScaffoldNotProse(out), `scaffold on: ${out}`).toEqual([]);
      }
    }
  });
});

/**
 * Regressions found by RUNNING the fix — run `mystery-1787167692140`, 2026-08-19.
 *
 * Two defects survived the first attempt and only the paid run exposed them:
 *
 *  1. The occurrence seed never reached the call site. The substitution that was supposed to pass
 *     `String(globalCount)` was applied without an assertion and silently no-opped, so every
 *     injection still asked for occurrence 0 and the manuscript shipped "It had taken twenty minutes
 *     in all." TWICE — the identical defect X64 was written to fix.
 *  2. `measurementSubject` turned "Distance FROM the lobby clock TO the dining hall" into "The lobby
 *     grandfather clock", so the run shipped "The lobby grandfather clock came to forty feet.": no
 *     longer a schema label, and now grammatical and false. A clock is not forty feet long.
 */
describe("regressions from run mystery-1787167692140", () => {
  const DISTANCE_DESC =
    "Distance from lobby grandfather clock to dining hall wall clock, crucial for sound travel timing.";

  it("a distance is measured BY its endpoints, not OF them", () => {
    const out = INJECTION_TEMPLATES.length(DISTANCE_DESC, "forty feet", "0");
    expect(out).not.toMatch(/grandfather clock came to/i);
    expect(out).toBe("The distance came to forty feet.");
  });

  it("still names the thing itself when the description is an OF-shape", () => {
    expect(INJECTION_TEMPLATES.length(WIRE_DESC, WIRE_VALUE, "0")).toBe(
      "The thin control wire came to twenty-five feet.",
    );
  });

  it("drops the trailing rationale a description carries after a comma", () => {
    for (const out of ["0", "1"].map((o) => INJECTION_TEMPLATES.length(DISTANCE_DESC, "forty feet", o))) {
      expect(out).not.toMatch(/crucial for sound travel timing/);
    }
  });

  it("the exact duration sentence that shipped twice now differs by occurrence", () => {
    expect(INJECTION_TEMPLATES.duration_minutes("The deliberate lag", "twenty minutes", "0"))
      .toBe("It had taken twenty minutes in all.");
    expect(INJECTION_TEMPLATES.duration_minutes("The deliberate lag", "twenty minutes", "1"))
      .toBe("Twenty minutes had passed before it was done.");
  });

  it("no output is ever a bare schema label", () => {
    for (const d of [DISTANCE_DESC, WIRE_DESC, "Weight of the bronze statuette", "Span between the two towers"]) {
      for (const o of ["0", "1"]) {
        const out = INJECTION_TEMPLATES.length(d, "ten feet", o);
        expect(out, `on: ${d} / ${o}`).not.toMatch(/^(?:Length|Width|Height|Depth|Distance|Weight|Span) of|^(?:Distance|Span) from/);
      }
    }
  });
});
