/**
 * REVIEW_05 §13 (M1) — the judge's `noResolution` fact, and why a detector now wins it.
 *
 * MEASURED. Across the 7 internal/external pairs the corpus holds, ranking agreement is 43%. Exclude
 * ONE story — `2026-08-02-1936`, the one whose reveal names nobody — and it is 60% overall and **86%
 * on the pairs the external reader separated by ≥5 points**, which is the published calibration
 * target. On that story the judge scored the ending 6/10 with "the culprit is identified by process
 * of elimination"; the external reader gave it 4/10 for "No completed culprit exposure".
 *
 * `noResolution` was the only structural fact with NO deterministic extractor — pure judge opinion,
 * and the judge was wrong on the one story where it decided the ranking.
 */

import { describe, expect, it } from "vitest";

import { mergeFacts } from "../facts.js";

describe("noResolution precedence", () => {
  it("lets a deterministic verdict override a judge that believes the reveal disclosed", () => {
    const merged = mergeFacts({ noResolution: true }, { noResolution: false });
    expect(merged.noResolution).toBe(true);
  });

  it("still uses the judge when no detector spoke", () => {
    expect(mergeFacts({}, { noResolution: true }).noResolution).toBe(true);
    expect(mergeFacts({}, { noResolution: false }).noResolution).toBe(false);
  });

  it("treats an absent detector as absent, never as a clean reveal", () => {
    // The A_70/A_71 rule: "not measured" must not read as "measured and fine".
    expect(mergeFacts({}, {}).noResolution).toBeUndefined();
  });
});
