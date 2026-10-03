import { afterEach, describe, expect, it } from "vitest";
import { buildBible } from "../bible.js";
import { buildContractCore } from "../contract.js";
import { completeProjects } from "./fixtures.js";

/**
 * Two defects in the v2 bible, found by tracing the owner's read of run mystery-1790960614933 (seed 82094) to the
 * brief: "Where and when: [object Object]." and the culprit's alibi listed like an innocent's ("Miss Fairweather is
 * cleared" followed in chapter 9). Both fixed behind CML_VERIFIED_FIXES; OFF unchanged.
 */
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });
const projects = completeProjects();
const bibleText = (p: (typeof projects)[number]) => {
  const core = buildContractCore(p.input);
  const bible = buildBible(p.input, core);
  return {
    core,
    text: bible.sections.map((s) => s.body).join("\n"),
    clock: bible.sections.find((s) => s.key === "chronology")?.body ?? "",
  };
};

describe("v2 bible — setting objects and the culprit's alibi", () => {
  it("has archived projects to check", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("ON: no '[object Object]' in any bible; OFF is what the archive produced", () => {
    let offHits = 0;
    for (const p of projects) {
      offHits += Number(bibleText(p).text.includes("[object Object]"));
    }
    process.env.CML_VERIFIED_FIXES = "1";
    for (const p of projects) expect(bibleText(p).text).not.toContain("[object Object]");
    // Recorded, not asserted: how many archived bibles carried the defect with the flag off.
    expect(offHits).toBeGreaterThanOrEqual(0);
  });

  it("ON: a culprit's alibi row reads as their cover; every line naming no culprit is unchanged (the budget keeps them)", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    let culpritRows = 0;
    for (const p of projects) {
      const { core, clock: text } = bibleText(p);
      for (const culprit of core.fairPlay.culprits) {
        // ON, no line names the culprit's "alibi"; the same rows read "cover"
        for (const line of text.split("\n").filter((l) => l.includes(culprit))) {
          expect(line).not.toMatch(/\balibi\b/i);
          if (/\bcover\b/i.test(line)) culpritRows++;
        }
      }
      // Lines that name no culprit are exactly what the flag-off build printed (some archived data already says
      // "claimed alibi" for an innocent — that is the data's wording, not this fix's).
      const namesNoCulprit = (l: string) => !core.fairPlay.culprits.some((c) => l.includes(c));
      delete process.env.CML_VERIFIED_FIXES;
      const offLines = bibleText(p).clock.split("\n").filter(namesNoCulprit);
      process.env.CML_VERIFIED_FIXES = "1";
      expect(text.split("\n").filter(namesNoCulprit)).toEqual(offLines);
    }
    expect(culpritRows).toBeGreaterThan(0); // known positive: the archive has culprit alibi rows to relabel
  });
});
