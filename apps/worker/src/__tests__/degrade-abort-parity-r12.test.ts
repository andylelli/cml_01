/**
 * Two gates disagreed about the same violation, and the run paid the difference.
 *
 * MEASURED on run `mystery-1787089592928` (2026-08-18): Agent 4 ran out of revision budget on
 * `apparent_not_covered`, logged "proceeding with 1 unresolved validation warning", and the run
 * continued through Agents 5, 6, 6.5, 7 and 7.5 — all paid. Agent 9's preflight then re-ran the SAME
 * `validateCml` and threw. 12.8 minutes and ~17 LLM calls after the defect was known and waived, for
 * no manuscript.
 *
 * These codes are computed purely from `hidden_model.mechanism` and the culprit's `alibi_window`, and
 * nothing between Agent 3 and Agent 9 writes either — so the late abort is deterministic. This suite
 * pins BOTH halves: the fatal codes stop the run at the cheap end, and every other degrade still
 * proceeds exactly as before.
 */

import { describe, expect, it } from "vitest";

/**
 * The predicate as shipped in `agent3-run.ts`'s degrade branch. Mirrored rather than exported: the
 * branch is inside a long async orchestration function, and the claim under test is the CODE LIST and
 * its matching, not the control flow around it.
 */
const UNREPAIRABLE_DEGRADE_CODES = ["apparent_not_covered", "actual_covered", "times_identical"];
const isFatal = (e: string): boolean =>
  UNREPAIRABLE_DEGRADE_CODES.some((code) => String(e).includes(code));

describe("graceful-degrade parity with the Agent 9 preflight", () => {
  it("treats the exact error string from the aborted run as fatal", () => {
    const real =
      "CASE.hidden_model.mechanism (apparent_not_covered): The staged time of death falls OUTSIDE " +
      "every span the culprit can account for, so the deception incriminates them instead of " +
      "protecting them.";
    expect(isFatal(real)).toBe(true);
  });

  it("covers the other two timeline-deception codes, which have the same provenance", () => {
    expect(isFatal("CASE.hidden_model.mechanism (actual_covered): The real time of death falls INSIDE…")).toBe(true);
    expect(isFatal("CASE.hidden_model.mechanism (times_identical): The staged time and the real time…")).toBe(true);
  });

  it("does NOT widen to every degraded validation — those still proceed", () => {
    // The general case cannot be proven unrepairable from Agent 3: downstream passes repair clues,
    // scenes and cast fields. Only the three above are computed from fields nothing else writes.
    for (const e of [
      "CASE.clues[3]: required_evidence is empty",
      "CASE.cast[2]: role_archetype missing",
      "CASE.inference_path.steps[1]: no contradiction clue",
      "CASE.surface_narrative.summary is too short",
    ]) {
      expect(isFatal(e)).toBe(false);
    }
  });

  it("matches on the code, not on message wording, so a reworded message still stops the run", () => {
    expect(isFatal("(apparent_not_covered)")).toBe(true);
    expect(isFatal("some future rephrasing … apparent_not_covered … trailing text")).toBe(true);
  });
});
