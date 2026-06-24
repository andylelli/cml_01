import { describe, expect, it } from "vitest";
import {
  surfaceSpecKeyTerms,
  composeKeyTermPhrase,
  tokenizeForClueObligation,
} from "../agent9-prose/clue-validation.js";

// Mirrors @cml/story-validation's detectVerbatimFieldEcho (minRun consecutive shared tokens) so the
// test is self-contained: returns the longest shared consecutive-token run between `prose` and `source`.
const longestSharedRun = (prose: string, source: string): number => {
  const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter(Boolean);
  const p = ` ${tok(prose).join(" ")} `;
  const f = tok(source);
  let best = 0;
  for (let i = 0; i < f.length; i++) {
    let j = i;
    while (j < f.length && p.includes(` ${f.slice(i, j + 1).join(" ")} `)) j++;
    best = Math.max(best, j - i);
  }
  return best;
};

const DESIGN =
  "With the household looking on, the inspector reset the garden window to the same six-inch gap and " +
  "waited for the next gust; when the wind struck the exposed pendulum, the hands turned back and the " +
  "clock stopped at a false hour, just as it had on the morning of the murder.";

describe("R-A key-term chokepoint (ROADMAP_TO_80 M0)", () => {
  it("surfaceSpecKeyTerms yields clean, deduped, length-bounded terms (no stopwords, len>=4)", () => {
    const terms = surfaceSpecKeyTerms(DESIGN).split(", ");
    expect(terms.length).toBeLessThanOrEqual(12);
    expect(new Set(terms).size).toBe(terms.length); // deduped
    for (const t of terms) {
      expect(t.length).toBeGreaterThanOrEqual(4);
    }
    // every surfaced term is itself a valid obligation token (so the presence check will seek it)
    for (const t of terms) expect(tokenizeForClueObligation(t)).toContain(t);
  });

  it("key terms share NO 12-consecutive-word run with the source sentence (the gate's threshold)", () => {
    expect(longestSharedRun(surfaceSpecKeyTerms(DESIGN), DESIGN)).toBeLessThan(12);
    expect(longestSharedRun(composeKeyTermPhrase(DESIGN), DESIGN)).toBeLessThan(12);
  });

  it("presence parity: prose containing the surfaced terms satisfies the clue-presence token overlap", () => {
    const terms = surfaceSpecKeyTerms(DESIGN);
    const chapter = `The inspector studied the garden window and the pendulum; the household watched as the gust struck and the clock stopped at a false hour. ${terms}`;
    const clueTokens = Array.from(new Set(tokenizeForClueObligation(DESIGN)));
    const required = Math.max(1, Math.ceil(clueTokens.length * 0.25));
    const matched = clueTokens.filter((t) => chapter.toLowerCase().includes(t)).length;
    expect(matched).toBeGreaterThanOrEqual(required);
  });

  it("composeKeyTermPhrase returns '' for all-stopword input (caller falls through to generic language)", () => {
    expect(composeKeyTermPhrase("the and that with from into over")).toBe("");
    expect(composeKeyTermPhrase("")).toBe("");
  });
});
