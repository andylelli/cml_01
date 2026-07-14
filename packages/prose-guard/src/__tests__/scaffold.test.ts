import { describe, expect, it } from "vitest";
import { mutateThenValidate } from "../mutate.js";
import {
  detectScaffoldNotProse,
  noScaffoldValidator,
  detectReportStyleClearance,
  noReportStyleClearanceValidator,
} from "../scaffold.js";

// ───────────────────────────────────────────────────────────────────────────
// A_59 #1/#4 GOLDEN — the deductive-scaffold leakage the injectors emit
// ───────────────────────────────────────────────────────────────────────────
describe("detectScaffoldNotProse — fires on the injector signatures, not on clean prose", () => {
  // verbatim from the A_59 Sundial run (deterministic-repair.ts A1/A2 templates)
  const a1Leak =
    "Evelyn Harcourt pressed on to the next concrete detail: Poison concealed hollow cubes releasing toxin. " +
    "That detail shifted the reasoning. Evelyn Harcourt weighed Wind direction stable door acoustics caused, " +
    "and the trail bent toward Auditory illusions invalidating servants footsteps timing.";
  const a2Leak =
    "Evelyn Harcourt set out the two competing readings so everyone could weigh them side by side.";

  it("catches the A1 clue/inference surfacing scaffold", () => {
    const hits = detectScaffoldNotProse(a1Leak);
    const rules = hits.map((h) => h.rule);
    expect(rules).toContain("A1:pressed_on");
    expect(rules).toContain("A1:trail_bent_toward");
    expect(rules).toContain("A1:shifted_reasoning");
  });

  it("catches the A2 'two competing readings' validation leak", () => {
    expect(detectScaffoldNotProse(a2Leak).some((h) => h.rule === "A2:two_competing_readings")).toBe(true);
  });

  it("catches the generalised reasoning-verb + connective shape (not just the seed phrases)", () => {
    const shape = "She weighed the cold tea and the trail bent toward the gardener.";
    expect(detectScaffoldNotProse(shape).some((h) => h.rule.startsWith("shape:"))).toBe(true);
  });

  it("catches the B5/B7 injected clearance + culprit-evidence templates", () => {
    expect(
      detectScaffoldNotProse("Mallory was thoroughly cleared by the evidence; the alibi confirmed it.").some(
        (h) => h.rule === "B7:thoroughly_cleared",
      ),
    ).toBe(true);
    expect(
      detectScaffoldNotProse(
        "James was responsible, and the evidence placed the matter beyond all reasonable doubt.",
      ).some((h) => h.rule === "B5:beyond_reasonable_doubt"),
    ).toBe(true);
  });

  it("catches the detective self-clearance report frame", () => {
    expect(
      detectScaffoldNotProse('"As for myself—I was with two witnesses," Evelyn said.').some(
        (h) => h.rule === "D4:as_for_myself",
      ),
    ).toBe(true);
  });

  it("does NOT fire on genuine dramatized prose", () => {
    const clean =
      "Evelyn knelt by the sundial, pressing a fingertip to the brass until the cold of it answered her. " +
      '"You wound this back," she said, and James looked away. The tea had gone cold in his cup.';
    expect(detectScaffoldNotProse(clean)).toEqual([]);
  });

  // Item 15 — the A1 trail seed matches the inflected forms, not only the past-tense original.
  it("catches the inflected trail forms (bends/bending) and still the past-tense bent", () => {
    for (const line of [
      "The trail bent toward the gardener before anyone spoke.",
      "The trail bends toward the gardener before anyone speaks.",
      "She watched the trail bending toward the gardener.",
    ]) {
      expect(detectScaffoldNotProse(line).some((h) => h.rule === "A1:trail_bent_toward")).toBe(true);
    }
  });

  it("does NOT fire the trail seed on unrelated trail prose", () => {
    expect(detectScaffoldNotProse("The trail wound toward the cliffs and vanished in gorse.")).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Item 15 (S0) — post-confession validation-note family (two-anchor rule)
// ───────────────────────────────────────────────────────────────────────────
describe("detectScaffoldNotProse — S0 validation-note family fires only on >= 2 anchors", () => {
  it("fires when two anchors co-occur in one chapter (the S0 residue)", () => {
    const s0 =
      "We must not forget the sequence of the keys. That detail matters more than any confession.";
    expect(detectScaffoldNotProse(s0).some((h) => h.rule === "S0:validation_note")).toBe(true);
  });

  it("fires on the answer-to + texture-change anchor pair", () => {
    const s0 =
      "Everything that follows in this account must answer to that single fact. " +
      "The texture of the night changed there, and no one in the room pretended otherwise.";
    expect(detectScaffoldNotProse(s0).some((h) => h.rule === "S0:validation_note")).toBe(true);
  });

  it("does NOT fire on a lone conversational anchor", () => {
    expect(detectScaffoldNotProse('"We must not forget our duty," the colonel said.')).toEqual([]);
    expect(detectScaffoldNotProse("That detail matters to me more than you know.")).toEqual([]);
  });

  it("does NOT fire on ordinary dramatized prose", () => {
    const clean =
      "The confession hung in the air. Evelyn folded the letter twice and slid it under the lamp, " +
      "and the others watched her hands rather than her face.";
    expect(detectScaffoldNotProse(clean)).toEqual([]);
  });
});

describe("noScaffoldValidator — gates a regen under mutateThenValidate", () => {
  const clean = "The garden held its breath. Evelyn turned the dial and watched the shadow refuse to move.";

  it("a mutation that injects scaffold is reverted; the clean prose ships", () => {
    const injectScaffold = (p: string): string =>
      `${p} She weighed the timing, and the trail bent toward the gardener.`;
    const outcome = mutateThenValidate(clean, injectScaffold, noScaffoldValidator);
    expect(outcome.reverted).toBe(true);
    expect(outcome.value).toBe(clean);
    expect(outcome.reason).toMatch(/scaffold_not_prose/);
  });

  it("partial cleanup still registers as a score improvement (not all-or-nothing)", () => {
    const twoHits = noScaffoldValidator(
      "She pressed on to the next concrete detail; the trail bent toward the gardener.",
    );
    const oneHit = noScaffoldValidator("She pressed on to the next concrete detail.");
    expect(oneHit.score).toBeGreaterThan(twoHits.score);
    expect(oneHit.ok).toBe(false);
  });

  it("clean prose passes", () => {
    expect(noScaffoldValidator(clean).ok).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// A_57 D4 — report-style clearance (the single source shared with the rubric cap)
// ───────────────────────────────────────────────────────────────────────────
describe("detectReportStyleClearance — verdict prose fires, dramatized deduction does not", () => {
  it("fires on 'was cleared because …'", () => {
    expect(detectReportStyleClearance("Beatrice was cleared because the timeline held.")).toBe(true);
  });

  it("fires on the deterministic clearance-patch 'placed X outside the fatal sequence' signature", () => {
    expect(
      detectReportStyleClearance("The evidence placed Hugo Vane outside the fatal sequence of events."),
    ).toBe(true);
  });

  it("fires on the 'established by the evidence and the timeline' frame", () => {
    expect(detectReportStyleClearance("Her innocence was established by the evidence and the timeline.")).toBe(true);
  });

  it("fires on the detective self-clearance 'As for myself—' frame", () => {
    expect(detectReportStyleClearance("As for myself—I had been in the library all evening.")).toBe(true);
  });

  it("does NOT fire on a dramatized, witnessed clearance", () => {
    const dramatized =
      '"I was in the kitchen with Cook when the clock struck," Beatrice said, and Cook nodded — she had ' +
      "watched Beatrice scald the milk at that very hour.";
    expect(detectReportStyleClearance(dramatized)).toBe(false);
  });

  it("noReportStyleClearanceValidator gates a mutation that introduces a verdict", () => {
    const clean = "Beatrice caught his eye and looked away; the milk had scalded while the clock chimed.";
    const toVerdict = (p: string): string => `${p} Beatrice was cleared because the timeline held.`;
    const outcome = mutateThenValidate(clean, toVerdict, noReportStyleClearanceValidator);
    expect(outcome.reverted).toBe(true);
    expect(outcome.reason).toMatch(/report_style_clearance/);
  });
});
