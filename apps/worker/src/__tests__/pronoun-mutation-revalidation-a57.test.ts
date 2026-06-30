import { describe, expect, it } from "vitest";
import { mutateThenValidate } from "@cml/prose-guard";
import { buildPronounStabilityValidator } from "../jobs/agents/agent9-run.js";

// A_57 D5 — re-validate-after-mutation for the pronoun property. The validator must (a) measure
// pronoun_gender_mismatch via the deterministic CharacterConsistencyValidator (gender from cml.CASE.cast),
// and (b) compose with mutateThenValidate so a pass that FLIPS a correct pronoun run is reverted while a
// pass that FIXES one ships. This is the "pure-win" half of D5 (the §3.3 sweep-flips-pronoun bug).

const cml = {
  CASE: {
    cast: [
      { name: "Daphne Sinclair", gender: "female", role_archetype: "suspect" },
      { name: "Arthur Hale", gender: "male", role_archetype: "detective" },
    ],
  },
};

const proseWith = (paragraphs: string[]) => ({ chapters: [{ title: "Ch1", paragraphs }] });

// Daphne (female) written correctly with she/her.
const CLEAN = proseWith([
  "Daphne Sinclair smoothed her apron. She had served the household for a decade, and her loyalty was never in question.",
]);
// Daphne (female) written with masculine pronouns — the D5 defect.
const MISGENDERED = proseWith([
  "Daphne Sinclair smoothed his coat. He had served the household for a decade, and his loyalty was never in question.",
]);

describe("buildPronounStabilityValidator (A_57 D5)", () => {
  const validate = buildPronounStabilityValidator(cml, "run1", "proj1");

  it("scores clean (correctly-gendered) prose higher than misgendered prose", () => {
    const clean = validate(CLEAN);
    const dirty = validate(MISGENDERED);
    expect(clean.ok).toBe(true);
    expect(clean.score).toBeGreaterThan(dirty.score);
    expect(dirty.ok).toBe(false);
    expect(dirty.violations.join()).toMatch(/pronoun_gender_mismatch/);
  });

  it("REVERTS a mutation that flips a correct pronoun run to the wrong gender", () => {
    const outcome = mutateThenValidate(CLEAN, () => MISGENDERED, validate);
    expect(outcome.reverted).toBe(true);
    expect(outcome.value).toBe(CLEAN); // original is preserved
  });

  it("APPLIES a mutation that repairs a misgendered run", () => {
    const outcome = mutateThenValidate(MISGENDERED, () => CLEAN, validate);
    expect(outcome.applied).toBe(true);
    expect(outcome.value).toBe(CLEAN);
  });

  it("APPLIES a pronoun-neutral cleanup (no regression) — clean stays clean", () => {
    // A cosmetic edit that does not touch pronouns must always ship.
    const cosmetic = proseWith([
      "Daphne Sinclair smoothed her apron — carefully. She had served the household for a decade, and her loyalty was never in question.",
    ]);
    const outcome = mutateThenValidate(CLEAN, () => cosmetic, validate);
    expect(outcome.applied).toBe(true);
    expect(outcome.value).toBe(cosmetic);
  });

  it("is inert (score 100, never blocks) when gender data is unavailable", () => {
    const noGender = buildPronounStabilityValidator({ CASE: { cast: [] } }, "r", "p");
    expect(noGender(MISGENDERED).score).toBe(100);
    expect(noGender(MISGENDERED).ok).toBe(true);
  });

  // A_58 review: the violation label MUST be count-free. The earlier label embedded the count
  // ("pronoun_gender_mismatch:N"); via mutateThenValidate's "new-violation ⇒ revert" rule a PARTIAL repair
  // (5→2) produced "…:2" ∉ ["…:5"] and was reverted, so only a repair to exactly 0 ever shipped. A stable
  // label means two non-zero states share the same violation set, so only the score gates acceptance.
  it("uses a COUNT-FREE violation label (so partial repairs are not reverted)", () => {
    const v = validate(MISGENDERED);
    expect(v.ok).toBe(false);
    expect(v.violations).toEqual(["pronoun_gender_mismatch"]); // exactly this — no ":N" count suffix
    for (const label of v.violations) expect(label).not.toMatch(/:\d/);
  });

  it("APPLIES an improvement and REVERTS a regression purely by score, with the label held constant", () => {
    // Stub two non-zero states to isolate the mutateThenValidate interaction from the validator's
    // competing-gender counting quirks: same (count-free) label, different scores.
    const worse = { ok: false, score: 50, violations: ["pronoun_gender_mismatch"] };
    const better = { ok: false, score: 80, violations: ["pronoun_gender_mismatch"] };
    const improve = mutateThenValidate("A", () => "B", (x: string) => (x === "A" ? worse : better));
    expect(improve.applied).toBe(true); // partial improvement (50→80) ships — the bug being fixed
    const regress = mutateThenValidate("A", () => "B", (x: string) => (x === "A" ? better : worse));
    expect(regress.reverted).toBe(true); // 80→50 still reverts on score
  });
});
