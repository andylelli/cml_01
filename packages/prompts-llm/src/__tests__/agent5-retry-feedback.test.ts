/**
 * A5-09 — the retry-feedback normaliser split out of `buildCluePrompt`. Byte-equality of the whole prompt was
 * proven old-dist vs new-dist over the archived CMLs; this pins the normaliser's own contract.
 */
import { describe, expect, it } from "vitest";
import { normalizeRetryFeedback, buildRetryModeBlock } from "../agent5/retry-feedback.js";
import { buildCluePrompt } from "../agent5-clues.js";

const castIndexMap = [{ name: "Alice", index: 0 }];
const caseData = { inference_path: { steps: [{ correction: "the stopped clock was wound backwards" }] } };

describe("A5-09 normalizeRetryFeedback", () => {
  it("returns undefined when the retry block does not render", () => {
    expect(normalizeRetryFeedback(undefined, caseData, castIndexMap)).toBeUndefined();
    expect(normalizeRetryFeedback({}, caseData, castIndexMap)).toBeUndefined();
    expect(normalizeRetryFeedback({ violations: [], warnings: [], targetedClueIds: ["clue_1"] }, caseData, castIndexMap)).toBeUndefined();
  });

  it("trims, de-duplicates and caps the payload lists", () => {
    const n = normalizeRetryFeedback(
      {
        warnings: ["w"],
        targetedClueIds: [" clue_1 ", "clue_1", "", ...Array.from({ length: 30 }, (_, i) => `t${i}`)],
        requiredReplacements: [" a -> b ", " ", "a -> b"],
        forbiddenTerms: [" stopped "],
      },
      caseData,
      castIndexMap,
    )!;
    expect(n.correctionTargets).toEqual(["[warning] w"]);
    expect(n.targetedClueIds).toHaveLength(18);
    expect(n.targetedClueIds[0]).toBe("clue_1");
    expect(n.requiredReplacements).toEqual(["a -> b", "a -> b"]); // trimmed, not de-duplicated
    expect(n.forbiddenTerms).toEqual(["stopped", "clock", "wound"]); // explicit first, then correction terms, de-duplicated
    expect(n.effectiveCastIndexMap).toBe(castIndexMap); // payload map empty -> the CML's
  });

  it("buildCluePrompt appends exactly the retry block the normaliser and builder produce", () => {
    const cml = { CASE: { ...caseData, cast: [{ name: "Alice" }] } };
    const feedback = { violations: [{ severity: "critical" as const, rule: "r", description: "rh_1 overlap", suggestion: "" }] };
    const withRetry = buildCluePrompt({ cml, clueDensity: "moderate", redHerringBudget: 2, fairPlayFeedback: feedback });
    const block = buildRetryModeBlock(normalizeRetryFeedback(feedback, cml.CASE, castIndexMap)!);
    expect(withRetry.user.endsWith(block)).toBe(true);
    expect(block).toContain("- Explicitly rewrite both rh_1 and rh_2");
  });
});
