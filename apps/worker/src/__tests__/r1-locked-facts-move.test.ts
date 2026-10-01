/**
 * A34-03 (R1) — the pure locked-fact helpers moved to @cml/cml (packages/cml/src/locked-facts.ts).
 * The old worker paths re-export the SAME functions, and `numberToWordsSmall` was not unified with
 * `spellMinuteCount` because the two are not identical over 0..999.
 */
import { describe, expect, it } from "vitest";
import * as cml from "@cml/cml";
import * as registryModule from "../jobs/agents/agent3b/locked-fact-registry.js";
import * as agent3bRun from "../jobs/agents/agent3b-run.js";

describe("A34-03 — old import paths keep resolving to the moved functions", () => {
  it("re-exports are the @cml/cml functions themselves", () => {
    expect(registryModule.stripLeadingArticleFromLockedValue).toBe(cml.stripLeadingArticleFromLockedValue);
    expect(registryModule.impliedIntervalFactId).toBe(cml.impliedIntervalFactId);
    expect(agent3bRun.stripLeadingArticleFromLockedValue).toBe(cml.stripLeadingArticleFromLockedValue);
    expect(agent3bRun.impliedIntervalFactId).toBe(cml.impliedIntervalFactId);
  });

  it("wordifyLockedFactValue keeps its outputs", () => {
    const w = cml.wordifyLockedFactValue;
    expect(w("10:50 PM")).toBe("ten-fifty");
    expect(w("10:00 p.m.")).toBe("ten o'clock");
    expect(w("23:05")).toBe("eleven-five");
    expect(w("0:30")).toBe("twelve-thirty");
    expect(w("24:00")).toBe("24:00");
    expect(w("4 metres from the door")).toBe("four metres from the door");
    expect(w("a quarter past eleven")).toBe("a quarter past eleven");
  });
});

describe("A34-03 — numberToWordsSmall vs spellMinuteCount over 0..999 (NOT unified)", () => {
  it("agree on 1..99", () => {
    for (let n = 1; n <= 99; n += 1) expect(cml.numberToWordsSmall(n)).toBe(cml.spellMinuteCount(n));
  });

  it("differ on 0 and on every n in 100..999", () => {
    expect(cml.numberToWordsSmall(0)).toBe("zero");
    expect(cml.spellMinuteCount(0)).toBeNull();
    for (let n = 100; n <= 999; n += 1) {
      expect(cml.numberToWordsSmall(n)).toBe(String(n));
      expect(cml.spellMinuteCount(n)).toBeNull();
    }
  });
});
