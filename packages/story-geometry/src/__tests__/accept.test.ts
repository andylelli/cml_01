/**
 * The Phase-1 acceptance criterion, as a test (GEOMETRY-AGENT-DESIGN §10).
 *
 *   "A geometry compiler that does not flag 'three clock times', 'chapter 9 never discloses', and
 *    'chapter 10 repeats chapter 9' on those two files is not ready for phase 2."
 *
 * The manuscripts below are miniature reconstructions of the two 08-02 runs' measured defects, in the
 * reviewers' own terms. They are not the real files — but they are the exact shapes, and they cost
 * nothing to run on every commit.
 */

import { describe, expect, it } from "vitest";

import { chapterIndexFor, checkManuscriptGeometry, foldTypography } from "../accept.js";
import { deriveStoryGeometry } from "../derive.js";
import type { GeometryChapter, GeometryOutline } from "../types.js";

/** A stand-in for `@cml/prompts-llm`'s `parseClockTime`, covering the shapes these fixtures use. */
const WORD_HOURS: Record<string, number> = {
  twelve: 12, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11,
};
const WORD_MINUTES: Record<string, number> = { quarter: 15, half: 30, ten: 10, five: 5, twenty: 20 };
const parseClockTime = (raw?: string): number | null => {
  const text = String(raw ?? "").toLowerCase().trim();
  if (!text) return null;
  const digital = text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (digital) return (Number(digital[1]) % 12) * 60 + Number(digital[2]);
  const past = text.match(/\b(?:a\s+)?(quarter|half|ten|five|twenty)\s+past\s+(\w+)\b/);
  if (past && WORD_MINUTES[past[1]!] !== undefined && WORD_HOURS[past[2]!] !== undefined) {
    return (WORD_HOURS[past[2]!]! % 12) * 60 + WORD_MINUTES[past[1]!]!;
  }
  const to = text.match(/\b(?:a\s+)?(quarter|half|ten|five|twenty)\s+to\s+(\w+)\b/);
  if (to && WORD_MINUTES[to[1]!] !== undefined && WORD_HOURS[to[2]!] !== undefined) {
    return (((WORD_HOURS[to[2]!]! % 12) * 60 - WORD_MINUTES[to[1]!]!) + 720) % 720;
  }
  const oclock = text.match(/\b(\w+)\s+o'?clock\b/);
  if (oclock && WORD_HOURS[oclock[1]!] !== undefined) return (WORD_HOURS[oclock[1]!]! % 12) * 60;
  return null;
};

const TEN_CHAPTER_OUTLINE: GeometryOutline = {
  acts: [
    {
      scenes: [
        { beat: "gathering" }, { beat: "crime" }, { beat: "first_enquiries" }, { beat: "motives" },
        { beat: "alibis" }, { beat: "false_solution" }, { beat: "secrets" }, { beat: "pattern" },
        { beat: "final_trap" }, { beat: "revelation" },
      ],
    },
  ],
};

const CML = {
  CASE: {
    culpability: { culprits: ["Hugo Hale"] },
    death_method: "strangled with a cord",
    hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
    false_solution: { accused_suspect: "Eleanor Frey" },
  },
};

const CLUES = [
  { id: "c_fabric", category: "physical", criticality: "essential", description: "a torn scrap of grey fabric", keyTerms: ["fabric"] },
];

const geometry = deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: TEN_CHAPTER_OUTLINE });

const chapter = (paragraphs: string[]): GeometryChapter => ({ paragraphs });
const filler = chapter(["The rain went on against the glass, and nobody said very much."]);

/** A manuscript that satisfies the contract, used as the control. */
const cleanManuscript = (): GeometryChapter[] => [
  chapter([
    "The ligature marks at the throat were plain enough, and the cord lay where it had fallen.",
    "A torn scrap of grey fabric had caught on the terrace rail, and nobody thought anything of it.",
    "The clock on the mantel showed 8:50.",
  ]),
  filler, filler, filler, filler,
  chapter(["Eleanor Frey had no account of her evening, and the room decided that settled it."]),
  filler, filler,
  chapter([
    "Hugo Hale had strangled him, and the ligature told them how.",
    "The torn fabric matched the tear at his cuff exactly.",
    "He had done it because exposure would have ruined him, and at 10:15, not at 8:50.",
  ]),
  chapter(["The house emptied slowly. Eleanor did not look back at it, and the rain kept on."]),
];

describe("checkManuscriptGeometry — the control", () => {
  it("reports no violations on a manuscript that honours the contract", () => {
    const report = checkManuscriptGeometry(geometry, cleanManuscript(), { parseClockTime });
    expect(report.violations).toEqual([]);
  });

  it("records satisfied checks too — a zero that is never written cannot be told from a check that never ran", () => {
    const report = checkManuscriptGeometry(geometry, cleanManuscript(), { parseClockTime });
    expect(report.checks.length).toBeGreaterThan(5);
    expect(report.checks.every((c) => c.verdict === "met")).toBe(true);
  });
});

describe("checkManuscriptGeometry — the three defects Phase 1 must flag", () => {
  it("flags a third clock time (Genette, order — story 1936's headline defect)", () => {
    const chapters = cleanManuscript();
    chapters[3] = chapter(["The porter was certain he had heard the gate at a quarter past eleven."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });

    expect(report.violations.map((v) => v.code)).toContain("unaccounted_time");
    expect(report.extraTimes).toHaveLength(1);
    expect(report.extraTimes[0]).toMatchObject({ chapter: 4, minutes: 11 * 60 + 15 });
  });

  it("flags a reveal chapter that never discloses (Barthes, suspended answer where disclosure was due)", () => {
    const chapters = cleanManuscript();
    chapters[8] = chapter([
      "Everything now pointed toward Hugo Hale, and the inspector said as much.",
      "The truth was poised to emerge in the hours ahead.",
    ]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("reveal_culprit_not_named");
    expect(report.violations.find((v) => v.code === "reveal_culprit_not_named")?.chapter).toBe(9);
  });

  it("flags an aftermath chapter that repeats the reveal (Genette, unmotivated repeating narration)", () => {
    const chapters = cleanManuscript();
    chapters[9] = chapter([
      "The house emptied slowly.",
      "Hugo Hale had strangled him with the cord, because exposure would have ruined him.",
    ]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    const violation = report.violations.find((v) => v.code === "aftermath_repeat");
    expect(violation).toBeDefined();
    expect(violation?.chapter).toBe(10);
    // The paragraph indices are what a scoped, edit-list regeneration would target.
    expect(violation?.paragraphIndices).toEqual([1]);
  });
});

describe("checkManuscriptGeometry — the remaining contract fields", () => {
  it("flags a murder method that never physically appears in chapter 1", () => {
    const chapters = cleanManuscript();
    chapters[0] = chapter(["He lay by the window, quite still, and the room was very cold.", "A torn scrap of grey fabric had caught on the rail."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("method_signature_absent");
  });

  it("flags a clincher that is never produced as proof", () => {
    const chapters = cleanManuscript();
    chapters[8] = chapter(["Hugo Hale had strangled him with the cord, because exposure would have ruined him."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("clincher_absent_at_payoff");
  });

  it("flags a clincher produced at the payoff but never planted early", () => {
    const chapters = cleanManuscript();
    chapters[0] = chapter(["The ligature marks at the throat were plain enough.", "The clock showed 8:50."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("clincher_not_planted");
  });

  it("flags suspect clearances delivered as a register", () => {
    const chapters = cleanManuscript();
    chapters[9] = chapter([
      "Eleanor was cleared, because the porter saw her at the gate.",
      "Marlowe was ruled out; the timeline accounted for him.",
      "The cook was eliminated by witness accounts of the kitchen.",
    ]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("clearance_over_budget");
  });

  it("never invents a violation from missing input", () => {
    const report = checkManuscriptGeometry(geometry, [], { parseClockTime });
    expect(report.violations.filter((v) => v.scope === "chapter")).toEqual([]);
  });
});

describe("checkManuscriptGeometry — regressions found by the Phase-1 backtest", () => {
  /**
   * FOUND 2026-08-03 by `scripts/geometry-backtest.mjs` against the real manuscript.
   *
   * The paragraph-scoped conjunction declared `the_clock_s_deception` chapter 9 compliant — the exact
   * chapter the external reviewer said *"only points toward Hugo"*. The shipped markdown carries
   * 5–8-sentence paragraphs, so "Hugo Vane" and the word "guilty" co-occurred inside a paragraph that
   * is a suspect-clearance register and names nobody as the murderer.
   *
   * The lesson generalises past this check: a conjunction is only evidence at the granularity a
   * reader reads it, and this repository's committed paragraphs are not that granularity.
   */
  it("does not accept a clearance register as disclosure just because it mentions the culprit", () => {
    const chapters = cleanManuscript();
    chapters[8] = chapter([
      "The lounge itself seemed to exhale, the tension shifting as the circle of suspicion narrowed.",
      "Captain Ivor Hale, cleared by the evidence, stood with his arms at his sides. Dr. Mallory Finch, her innocence confirmed by the timeline, looked at the floor. Eleanor's gaze landed on Hugo Vane, who had maintained a studied calm. Someone in this room was guilty.",
    ]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("reveal_culprit_not_named");
  });

  it("still accepts a real disclosure — the name and the act in one sentence", () => {
    const chapters = cleanManuscript();
    chapters[8] = chapter([
      "Captain Ivor Hale, cleared by the evidence, stood with his arms at his sides.",
      "It was Hugo Hale who had strangled him, and the ligature marks told them how. He had done it because exposure would have ruined him. The torn fabric matched the tear at his cuff exactly.",
    ]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).not.toContain("reveal_culprit_not_named");
  });
});

describe("chapterIndexFor — the alignment the whole test rests on", () => {
  /**
   * FOUND ON REVIEW 2026-08-03. Chapter lookup was `chapters[n - 1]`. Reordering a compliant
   * manuscript produced SIX fabricated violations — including "the reveal never names the culprit"
   * against a chapter that names them in its first sentence. In `apply` mode that would have
   * regenerated clean chapters to repair defects they do not have.
   */
  const numbered = (n: number, text: string): GeometryChapter => ({ chapterNumber: n, paragraphs: [text] });

  it("honours the declared chapter number over array position", () => {
    const chapters = [numbered(3, "c"), numbered(1, "a"), numbered(2, "b")];
    expect(chapterIndexFor(chapters, 1)).toBe(1);
    expect(chapterIndexFor(chapters, 3)).toBe(0);
  });

  it("falls back to position only when NO chapter declares a number", () => {
    const chapters = [{ paragraphs: ["a"] }, { paragraphs: ["b"] }];
    expect(chapterIndexFor(chapters, 2)).toBe(1);
    expect(chapterIndexFor(chapters, 3)).toBe(-1);
  });

  it("reports a chapter as absent rather than guessing when numbering exists but does not match", () => {
    expect(chapterIndexFor([numbered(1, "a"), numbered(2, "b")], 7)).toBe(-1);
  });

  it("produces the same verdict whatever order the chapters arrive in", () => {
    const inOrder = cleanManuscript().map((c, i) => ({ ...c, chapterNumber: i + 1 }));
    const shuffled = [inOrder[9], inOrder[4], ...inOrder.slice(0, 4), ...inOrder.slice(5, 9)];
    const a = checkManuscriptGeometry(geometry, inOrder, { parseClockTime });
    const b = checkManuscriptGeometry(geometry, shuffled, { parseClockTime });
    expect(b.violations.map((v) => v.code).sort()).toEqual(a.violations.map((v) => v.code).sort());
    expect(a.violations).toEqual([]);
  });
});

describe("clearance budget — counting exonerations, not argued ones", () => {
  /**
   * FOUND 2026-08-04 against real manuscripts. The check required a clearance word AND an evidence
   * connector in the SAME sentence, which had it exactly backwards: story 1810's chapter 9 — the
   * register a reviewer called "validation logic, not story" — reads "You are cleared." / "You are
   * ruled out." / "You could not have done it.", and scored ZERO, because a bare verdict cites no
   * evidence. The conjunct was filtering out precisely the most mechanical clearances.
   */
  const revealChapter = geometry.chapterContract.find((c) => c.role === "reveal")!.chapter;

  const withReveal = (paragraphs: string[]) => {
    const chapters = cleanManuscript();
    chapters[revealChapter - 1] = chapter([
      ...(chapters[revealChapter - 1]!.paragraphs ?? []),
      ...paragraphs,
    ]);
    return checkManuscriptGeometry(geometry, chapters, { parseClockTime });
  };

  it("flags bare verdicts, which cite no evidence at all", () => {
    const report = withReveal(["You are cleared. You are ruled out. You could not have done it."]);
    const violation = report.violations.find((v) => v.code === "clearance_over_budget");
    expect(violation).toBeDefined();
    expect(violation?.message).toMatch(/spends 3 sentences/);
    // The offending sentences travel with the finding so a reader can judge it.
    expect(violation?.message).toMatch(/You are cleared/);
  });

  it("stays within budget when elimination is dramatized rather than listed", () => {
    // The 08-04 run's shape: two clearances, in dialogue, carrying feeling rather than a verdict.
    const report = withReveal([
      "\u2018Then I suppose I am to be ruled out at last?\u2019 she said, and did not look up.",
      "Finch allowed herself a rare, quiet moment \u2014 relief rather than triumph \u2014 for the innocent had been spared.",
    ]);
    expect(report.violations.map((v) => v.code)).not.toContain("clearance_over_budget");
  });
});

describe("typography folding — the instrument and the text must agree on a match", () => {
  /**
   * FOUND 2026-08-04 on a live run. The CML held `actual_time_of_death: "two o’clock"` (U+2019); the
   * shipped manuscript printed "two o'clock" (U+0027) — 233 straight apostrophes, zero curly, because
   * prose sanitization normalises smart quotes and the case model never passes through it. Counting
   * raw reported the case's true time as absent from a story that states it thirteen times.
   */
  it("matches a CML value written with a curly apostrophe against straight-quoted prose", () => {
    const curlyCase = {
      CASE: {
        culpability: { culprits: ["Hugo O\u2019Hale"] },
        death_method: "strangled with a cord",
        hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
        false_solution: { accused_suspect: "Eleanor Frey" },
      },
    };
    const g = deriveStoryGeometry({ cml: curlyCase, clues: CLUES, narrative: TEN_CHAPTER_OUTLINE });
    const chapters = cleanManuscript();
    // The prose spells the culprit with a STRAIGHT apostrophe, as the sanitizer leaves it.
    chapters[8] = chapter([
      "Hugo O'Hale had strangled him, and the ligature told them how.",
      "The torn fabric matched the tear at his cuff exactly.",
      "He had done it because exposure would have ruined him.",
    ]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).not.toContain("reveal_culprit_not_named");
  });

  it("recognises a time written with either apostrophe", () => {
    const chapters = cleanManuscript();
    chapters[3] = chapter(["The gate went at eleven o\u2019clock, she was certain of it."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime });
    expect(report.extraTimes.map((t) => t.minutes)).toContain(11 * 60);
  });

  it("folds en/em dashes and non-breaking spaces too", () => {
    expect(foldTypography("a\u00A0quarter\u2014to\u2013three")).toBe("a quarter-to-three");
  });
});

describe("the time-model anchors are folded too", () => {
  /**
   * A PARTIAL FIX IS WORSE THAN NONE, 2026-08-04. The first typography fix folded the manuscript but
   * not the case's own anchors. `parseClockTime("two o’clock")` returns null on the curly form, so the
   * true time never entered the allowed set — while the now-folded prose parsed "two o'clock" cleanly
   * and was reported as a THIRD time. The check accused the manuscript of inventing the very hour the
   * case had declared.
   */
  it("does not report the case's own true time as a third time when it is curly-quoted", () => {
    const curlyTimes = {
      CASE: {
        culpability: { culprits: ["Hugo Hale"] },
        death_method: "strangled with a cord",
        hidden_model: {
          mechanism: { actual_time_of_death: "two o\u2019clock", apparent_time_of_death: "a quarter to three" },
        },
        false_solution: { accused_suspect: "Eleanor Frey" },
      },
    };
    const g = deriveStoryGeometry({ cml: curlyTimes, clues: CLUES, narrative: TEN_CHAPTER_OUTLINE });
    const chapters = cleanManuscript();
    chapters[1] = chapter(["The clock had not chimed after two o'clock, and she had noticed."]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });

    expect(report.extraTimes.map((t) => t.phrase.toLowerCase())).not.toContain("two o'clock");
  });

  it("still flags a genuine third time under the same conditions", () => {
    const curlyTimes = {
      CASE: {
        culpability: { culprits: ["Hugo Hale"] },
        death_method: "strangled with a cord",
        hidden_model: {
          mechanism: { actual_time_of_death: "two o\u2019clock", apparent_time_of_death: "a quarter to three" },
        },
        false_solution: { accused_suspect: "Eleanor Frey" },
      },
    };
    const g = deriveStoryGeometry({ cml: curlyTimes, clues: CLUES, narrative: TEN_CHAPTER_OUTLINE });
    const chapters = cleanManuscript();
    chapters[1] = chapter(["The porter heard the gate at half past two, he was certain."]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });
    expect(report.extraTimes.map((t) => t.minutes)).toContain(150);
  });
});

describe("met_by_injection — telling the pipeline's own sentences apart from prose", () => {
  /**
   * MEASURED on run mystery-1785870981757. The manuscript named its murderer in exactly one sentence
   * and no human wrote it: "Captain Ivor Hale was responsible; the evidence allowed no other reading."
   * That is the B5 scaffold floor's rewrite of what `enforceCulpritEvidencePresence` injected, so a
   * registry holding only the injector's phrasing would match nothing.
   */
  const TEMPLATES = [
    /\bwas responsible,\s*and the evidence placed the matter beyond all reasonable doubt\b/i,
    /\bwas responsible;\s*the evidence allowed no other reading\b/i,
  ];
  const verdictFor = (paragraphs: string[], templates = TEMPLATES) => {
    const chapters = cleanManuscript();
    chapters[8] = chapter(paragraphs);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime, injectionTemplates: templates });
    return report.checks.find((c) => c.code === "reveal_culprit_not_named")!.verdict;
  };

  it("calls an authored disclosure `met`", () => {
    expect(verdictFor(["Hugo Hale had strangled him, and the ligature told them how."])).toBe("met");
  });

  it("calls the SHIPPED (laundered) injector sentence `met_by_injection`, not met", () => {
    expect(verdictFor(["Hugo Hale was responsible; the evidence allowed no other reading."]))
      .toBe("met_by_injection");
  });

  it("also catches the injector's original phrasing, before a floor rewrites it", () => {
    expect(verdictFor(["Hugo Hale was responsible, and the evidence placed the matter beyond all reasonable doubt."]))
      .toBe("met_by_injection");
  });

  it("calls a missing disclosure `unmet` — the story-1936 shape", () => {
    expect(verdictFor(["Everything pointed toward Hugo Hale.", "The truth was poised to emerge in the hours ahead."]))
      .toBe("unmet");
  });

  it("does not raise a violation for met_by_injection — the floor already fired", () => {
    const chapters = cleanManuscript();
    chapters[8] = chapter(["Hugo Hale was responsible; the evidence allowed no other reading."]);
    const report = checkManuscriptGeometry(geometry, chapters, { parseClockTime, injectionTemplates: TEMPLATES });
    expect(report.violations.map((v) => v.code)).not.toContain("reveal_culprit_not_named");
  });

  it("degrades to `met` when no templates are supplied, rather than guessing", () => {
    expect(verdictFor(["Hugo Hale was responsible; the evidence allowed no other reading."], [])).toBe("met");
  });
});

describe("accounted times — a locked clock value is not a third time", () => {
  /**
   * FOUND 2026-08-04 on a live run: `third_time` flagged "half past two" as an incoherence in a story
   * where that value is `kitchen_timer_setting`, a LOCKED FACT the injector prints seven times.
   * Geometry called the manuscript incoherent for stating a time the case itself declared.
   */
  const withLocked = (lockedFacts: Array<{ id: string; value: string }>) =>
    deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: TEN_CHAPTER_OUTLINE, lockedFacts });

  it("does not flag a clock value the case locked", () => {
    const g = withLocked([{ id: "kitchen_timer_setting", value: "half past two" }]);
    const chapters = cleanManuscript();
    chapters[3] = chapter(["The kitchen timer was still set for half past two, exactly as she had left it."]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).not.toContain("unaccounted_time");
  });

  it("still flags a time nothing accounts for", () => {
    const g = withLocked([{ id: "kitchen_timer_setting", value: "half past two" }]);
    const chapters = cleanManuscript();
    chapters[3] = chapter(["The porter heard the gate at a quarter past eleven, he was certain."]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("unaccounted_time");
    expect(report.extraTimes.map((t) => t.minutes)).toContain(11 * 60 + 15);
  });

  it("ignores locked facts that are not clock times", () => {
    // "forty minutes" is a duration; it must not widen the allowed set to something it cannot parse.
    const g = withLocked([{ id: "pendulum_pause_duration", value: "forty minutes" }]);
    expect(g.timeModel.accountedTimes).toEqual(["forty minutes"]);
    const chapters = cleanManuscript();
    chapters[3] = chapter(["The porter heard the gate at a quarter past eleven."]);
    const report = checkManuscriptGeometry(g, chapters, { parseClockTime });
    expect(report.violations.map((v) => v.code)).toContain("unaccounted_time");
  });
});
