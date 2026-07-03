import { describe, expect, it } from "vitest";
import { buildContinuityContext } from "../agent9-prose/context-management.js";
import type { ChapterSummary } from "../agent9-prose/types.js";

// P1.3 — the time-anchor dereference seam: the Bible override is authoritative; default = scrape.

const summaries: ChapterSummary[] = [
  {
    chapterNumber: 1,
    title: "The Body",
    charactersPresent: ["Evelyn Harcourt"],
    settingTerms: ["the manor"],
    keyEvents: ["The clock in the hall read half past three when the body was found."],
  },
];

describe("buildContinuityContext time anchor", () => {
  it("falls back to the scraped anchor when no override is given (today's behaviour)", () => {
    const out = buildContinuityContext(summaries, 2);
    expect(out).toMatch(/LOCKED TIME ANCHOR/);
    expect(out.toLowerCase()).toMatch(/half past three/);
    expect(out).toMatch(/established in earlier chapters/);
  });

  it("uses the Bible override as authoritative and flags a conflicting scraped time", () => {
    // ground truth says the true time is 4:20; the prose had drifted to 'half past three'
    const out = buildContinuityContext(summaries, 2, "twenty minutes past four in the afternoon");
    expect(out).toMatch(/from the case ground truth/);
    expect(out).toMatch(/twenty minutes past four/);
    expect(out).toMatch(/CONFLICT: other times appear/);
    expect(out.toLowerCase()).toMatch(/half past three/); // listed as the conflicting/erroneous one
  });

  it("a blank override falls back to the scrape", () => {
    const out = buildContinuityContext(summaries, 2, "   ");
    expect(out).toMatch(/established in earlier chapters/);
  });
});
