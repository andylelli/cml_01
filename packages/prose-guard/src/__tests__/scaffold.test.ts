import { describe, expect, it } from "vitest";
import { mutateThenValidate } from "../mutate.js";
import { detectScaffoldNotProse, noScaffoldValidator } from "../scaffold.js";

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
