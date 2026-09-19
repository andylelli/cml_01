/**
 * THE THREE OPERATIONS FOUR v2 BOOKS MISSED, AND WHY THE FIX IS WORDING.
 *
 * MEASURED 2026-09-19 over three drafts of one contract (`resume-1789846757984`), per chapter:
 *
 *   em-dashes             asked "at least three"                delivered 6.3 / 7.9 / 8.2
 *   speech-open paragraphs asked "open on a line somebody speaks" delivered 1.5 / 2.8 / 1.7 of 6
 *   words                 asked "about 1000"                    delivered 722 / 648 / 678
 *   paragraphs            not asked                             delivered 14.5 / 16.9 / 16.2
 *
 * The brief is read: the unambiguous count arrived at twice the ask. The failures are the ambiguous
 * one and the statistic. And the reveal — "states the act in a verb they own" — was half-complied
 * with in 3 of 4 books: the name arrived, the act did not.
 */
import { describe, expect, it } from "vitest";

import { briefLawViolations, buildBrief, fullParagraphs, revealOperation } from "../brief.js";
import { buildContractCore } from "../contract.js";
import { collectCheckerFindings } from "../findings.js";
import { checkHardGates } from "../selector.js";
import type { ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      victim: { name: "Montague Gaunt" },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
        { name: "Montague Gaunt", role_archetype: "victim" },
      ],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: {
    clues: [
      { id: "clue_compass_tilt", observable: "the scuffed brass casing of the compass, worn along one edge", description: "worn edge", criticality: "essential" },
    ],
  },
  outline: {
    acts: [
      {
        scenes: [
          { sceneNumber: 1, act: 1, beat: "gathering", title: "Arrival", characters: ["Bertram Norbury"], setting: { location: "the office" }, cluesRevealed: ["clue_compass_tilt"] },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "The Test", characters: ["Bertram Norbury"], setting: { location: "the dunes" } },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "After", characters: ["Bertram Norbury"], setting: { location: "the promenade" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }, { name: "Montague Gaunt", role_archetype: "victim" }] },
  humourLevel: "classic",
});

describe("the reveal is asked for as a shape, not an abstraction", () => {
  it("names the culprit, a verb of killing and the victim in one sentence, as fact", () => {
    const line = revealOperation(core);
    expect(line).toContain(`Chapter ${core.roles.reveal}`);
    expect(line).toMatch(/Nora Quayle killed/);
    expect(line).toMatch(/as settled fact/);
    expect(line).toMatch(/verb of killing/);
  });

  it("is in the brief and passes the brief's own law", () => {
    const brief = buildBrief({ core, humourLevel: "classic" });
    expect(brief.asks.some((a) => a.section === "tests" && /verb of killing/.test(a.line))).toBe(true);
    expect(briefLawViolations(brief)).toEqual([]);
  });
});

describe("length is asked for as a count of full paragraphs", () => {
  it("derives the count from the chapter's target and never asks for fewer than six", () => {
    expect(fullParagraphs(1_000)).toBe(12);
    expect(fullParagraphs(1_500)).toBe(18);
    expect(fullParagraphs(200)).toBe(6);
  });

  it("the brief states it as an operation, and the word figure stays as the target it describes", () => {
    const brief = buildBrief({ core, humourLevel: "classic" });
    const length = brief.asks.filter((a) => a.section === "length").map((a) => a.line).join(" ");
    expect(length).toMatch(/At least \d+ paragraphs in each chapter run to four sentences or more/);
    expect(length).toMatch(/\d{3,} words/);
    expect(briefLawViolations(brief)).toEqual([]);
  });
});

describe("speech openings name the first character", () => {
  it("is unambiguous about what counts", () => {
    const brief = buildBrief({ core, humourLevel: "classic" });
    const page = brief.asks.filter((a) => a.section === "page").map((a) => a.line).join(" ");
    expect(page).toMatch(/first character of the paragraph is the opening quotation mark/);
  });
});

describe("a book below the contract minimum is ONE hard failure", () => {
  const ch = (number: number, words: number): ProseChapterLike => ({
    title: "t",
    number,
    paragraphs: [Array.from({ length: words }, (_u, i) => (i % 9 === 8 ? "word." : "word")).join(" ")],
  });
  const expected = core.scenes.map((s) => s.chapter);
  const min = core.book.words.min;

  it("KNOWN-POSITIVE: a complete book under the minimum gets exactly one book_short hit", () => {
    const perChapter = Math.floor((min * 0.6) / expected.length);
    const hits = checkHardGates(expected.map((n) => ch(n, perChapter)), core, expected).filter((h) => h.kind === "book_short");
    expect(hits).toHaveLength(1);
    expect(hits[0]?.detail).toMatch(new RegExp(`minimum of ${min}`));
  });

  it("a book at or over the minimum gets none", () => {
    const perChapter = Math.ceil((min * 1.1) / expected.length);
    const hits = checkHardGates(expected.map((n) => ch(n, perChapter)), core, expected).filter((h) => h.kind === "book_short");
    expect(hits).toEqual([]);
  });

  it("an INCOMPLETE book is not also called short — missing is the finding there", () => {
    const hits = checkHardGates(expected.slice(0, -1).map((n) => ch(n, 10)), core, expected);
    expect(hits.some((h) => h.kind === "book_short")).toBe(false);
    expect(hits.some((h) => h.kind === "chapter_missing")).toBe(true);
  });

  it("reaches no editor: an edit cannot lengthen a book", () => {
    const perChapter = Math.floor((min * 0.6) / expected.length);
    const findings = collectCheckerFindings(expected.map((n) => ch(n, perChapter)), core, expected);
    expect(findings.some((f) => /book_short/.test(f.class) || /minimum of/.test(f.note))).toBe(false);
  });
});
