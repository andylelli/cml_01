import { describe, expect, it } from "vitest";
import { scoreStory, type RubricJudge } from "../score.js";
import {
  verifyStructure,
  verifyCitations,
  splitProseIntoChapters,
  type FlagCitation,
} from "../structural-verifiers.js";
import { computeCalibrationDelta, summarizeCalibration } from "../calibration.js";
import { CATEGORIES, type Category, type RubricScore } from "../types.js";

/** A clean rubric score (every category 8/10 → raw 80), with overridable flags + citations injected via the judge. */
function rubric(overrides: Partial<Record<Category, number>> = {}): RubricScore {
  const categories = CATEGORIES.map((c) => ({ category: c, mark: overrides[c] ?? 8, reason: "test" }));
  return {
    categories,
    total: categories.reduce((s, c) => s + c.mark, 0),
    overall_view: "v",
    what_works: [],
    main_problems: [],
    chapter_issues: [],
    fastest_fixes: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixture: a CASE whose discriminating test leans on one evidence clue, with the
// clue planted in Ch3 (before the test in Ch7) in the PLANTED variant, and not
// planted at all in the UNPLANTED variant.
// ─────────────────────────────────────────────────────────────────────────────
function caseWith(opts: {
  cluePlantedScene: { act: number; scene: number } | null; // null = unplanted (not in clue_to_scene_mapping)
}): unknown {
  const mapping: any[] = [];
  if (opts.cluePlantedScene) {
    mapping.push({ clue_id: "clockwork_expertise", act_number: opts.cluePlantedScene.act, scene_number: opts.cluePlantedScene.scene });
  }
  return {
    CASE: {
      cast: [
        { name: "Eleanor Voss", role: "detective" },
        { name: "Dr. Mallory Finch", role: "suspect" },
        { name: "Sylvia Trent", role: "victim" },
      ],
      culpability: { culprits: ["Dr. Mallory Finch"] },
      clues: [
        {
          id: "clockwork_expertise",
          description: "Finch's expert knowledge of antique clockwork mechanisms and escapement gears",
        },
      ],
      hidden_model: {
        mechanism: { description: "the pendulum clock was secretly wound backward to fake the escapement timeline" },
      },
      discriminating_test: { evidence_clues: ["clockwork_expertise"] },
      prose_requirements: {
        discriminating_test_scene: { act_number: 3, scene_number: 1 },
        clue_to_scene_mapping: mapping,
      },
    },
  };
}

// 7 chapters; the discriminating-test scene (act 3 / scene 1) maps to the last chapter.
const PLANTED_CHAPTERS = [
  "Chapter 1\n\nSylvia Trent lay dead beneath the tower clock, the gears above her silent.",
  "Chapter 2\n\nEleanor Voss questioned the household about the night of the death.",
  "Chapter 3\n\nFinch spoke at length of antique clockwork, escapement gears, and how a pendulum keeps time — his expert knowledge unmistakable.",
  "Chapter 4\n\nThe inspector revisited the study and the silent stairwell.",
  "Chapter 5\n\nA second interview deepened the unease around the guests.",
  "Chapter 6\n\nVoss laid out the timeline, troubled by a gap she could not place.",
  "Chapter 7\n\nAt the discriminating test, Voss showed that only Finch's clockwork expertise could have wound the pendulum clock backward to fake the escapement timeline — the reveal.",
];

// Same story but Ch3 never plants the clockwork expertise (the genuinely unplanted reveal).
const UNPLANTED_CHAPTERS = [
  "Chapter 1\n\nSylvia Trent lay dead beneath the tower clock, the gears above her silent.",
  "Chapter 2\n\nEleanor Voss questioned the household about the night of the death.",
  "Chapter 3\n\nThe inspector walked the frost-bitten garden and found nothing of note.",
  "Chapter 4\n\nThe inspector revisited the study and the silent stairwell.",
  "Chapter 5\n\nA second interview deepened the unease around the guests.",
  "Chapter 6\n\nVoss laid out the timeline, troubled by a gap she could not place.",
  "Chapter 7\n\nAt the discriminating test, Voss suddenly announced Finch's clockwork expertise — never mentioned before — proved he wound the pendulum clock backward.",
];

describe("verifyStructure — planted-evidence verifier (K2 §1)", () => {
  it("PLANTED story: every reveal clue is planted in an earlier chapter → allRevealEvidencePlanted", () => {
    const v = verifyStructure({
      cml: caseWith({ cluePlantedScene: { act: 1, scene: 1 } }), // CASE places the clue before the test
      chapters: PLANTED_CHAPTERS,
    });
    expect(v.allRevealEvidencePlanted).toBe(true);
    expect(v.unplantedEvidence).toEqual([]);
  });

  it("UNPLANTED story: the reveal clue never appears earlier → genuinely unplanted", () => {
    const v = verifyStructure({
      cml: caseWith({ cluePlantedScene: null }), // CASE has no scene mapping for the clue
      chapters: UNPLANTED_CHAPTERS,
    });
    expect(v.allRevealEvidencePlanted).toBe(false);
    expect(v.unplantedEvidence).toContain("clockwork_expertise");
  });
});

describe("scoreStory — the 'unplanted evidence' flag fires ONLY on the genuinely unplanted story", () => {
  // A templated judge that ALWAYS claims unplanted evidence (the gpt-4o-mini false-positive behaviour).
  const templatedJudge: RubricJudge = async () => ({
    rubric: rubric(),
    flags: { revealUsesUnplantedEvidence: true },
    // cite a real Ch7 reveal sentence so citation-verification passes; the planted-evidence VERIFIER
    // (not the citation check) is what must veto the flag on the planted story.
    flagCitations: [
      { flag: "revealUsesUnplantedEvidence", chapter: 7, sentence: "At the discriminating test" },
    ],
  });

  it("PLANTED: the structural verifier VETOES the judge's false 'unplanted' flag → ending not capped", async () => {
    const r = await scoreStory({
      prose: PLANTED_CHAPTERS.join("\n\n"),
      cml: caseWith({ cluePlantedScene: { act: 1, scene: 1 } }),
      chapters: PLANTED_CHAPTERS,
      judge: templatedJudge,
    });
    expect(r.facts.revealUsesUnplantedEvidence).toBe(false); // vetoed
    expect(r.structural?.unplantedEvidenceVetoed).toBe(true);
    expect(r.categories.find((c) => c.category === "ending")!.mark).toBe(8); // NOT capped to 5
    expect(r.capsApplied.some((c) => /unplanted/.test(c))).toBe(false);
  });

  it("UNPLANTED: the flag stands (and is even confirmed) → ending capped to 5", async () => {
    const r = await scoreStory({
      prose: UNPLANTED_CHAPTERS.join("\n\n"),
      cml: caseWith({ cluePlantedScene: null }),
      chapters: UNPLANTED_CHAPTERS,
      judge: templatedJudge,
    });
    expect(r.facts.revealUsesUnplantedEvidence).toBe(true);
    expect(r.structural?.unplantedEvidenceVetoed).toBeFalsy();
    expect(r.categories.find((c) => c.category === "ending")!.mark).toBe(5); // capped
    expect(r.capsApplied.some((c) => /not planted earlier/.test(c))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Mechanism-timing fixture: the mechanism is only fully explained in the LAST
// chapter (the test scene), so a "explained too early" flag must be DROPPED.
// ─────────────────────────────────────────────────────────────────────────────
describe("scoreStory — mechanism-timing veto (K2 §1)", () => {
  const mechanismCase = caseWith({ cluePlantedScene: { act: 1, scene: 1 } });

  const tooEarlyJudge: RubricJudge = async () => ({
    rubric: rubric(),
    flags: { mechanismExplainedTooEarly: true },
    flagCitations: [
      { flag: "mechanismExplainedTooEarly", chapter: 7, sentence: "wound the pendulum clock backward to fake the escapement timeline" },
    ],
  });

  it("drops a false 'explained too early' flag when the explanation is at/after the test chapter", async () => {
    // The mechanism phrasing appears only in Ch7 (the test chapter) → not too early.
    const v = verifyStructure({ cml: mechanismCase, chapters: PLANTED_CHAPTERS });
    expect(v.mechanismExplainedAtOrAfterTest).toBe(true);
    expect(v.mechanismExplainedChapter).toBe(7);
    expect(v.testChapter).toBe(7);

    const r = await scoreStory({
      prose: PLANTED_CHAPTERS.join("\n\n"),
      cml: mechanismCase,
      chapters: PLANTED_CHAPTERS,
      judge: tooEarlyJudge,
    });
    expect(r.facts.mechanismExplainedTooEarly).toBe(false); // vetoed
    expect(r.structural?.mechanismTimingVetoed).toBe(true);
    expect(r.categories.find((c) => c.category === "plot_structure")!.mark).toBe(8); // NOT capped
    expect(r.categories.find((c) => c.category === "pacing")!.mark).toBe(8);
  });

  it("CONFIRMS a real 'too early' condition when the mechanism is fully explained before the test", async () => {
    // Mechanism phrasing planted in Ch2, well before the Ch7 test → genuinely too early.
    const earlyChapters = [...PLANTED_CHAPTERS];
    earlyChapters[1] =
      "Chapter 2\n\nVoss already understood: the pendulum clock was secretly wound backward to fake the escapement timeline.";
    const r = await scoreStory({
      prose: earlyChapters.join("\n\n"),
      cml: mechanismCase,
      chapters: earlyChapters,
      judge: async () => ({ rubric: rubric() }), // judge says nothing; verifier confirms the defect
    });
    expect(r.facts.mechanismExplainedTooEarly).toBe(true);
    expect(r.categories.find((c) => c.category === "plot_structure")!.mark).toBe(6); // capped by confirmed defect
    expect(r.categories.find((c) => c.category === "pacing")!.mark).toBe(6);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Citation-verification fixture: a flag whose cited chapter+sentence is absent.
// ─────────────────────────────────────────────────────────────────────────────
describe("verifyCitations + scoreStory — drop flags whose cited evidence is absent (K2 §2)", () => {
  const chapters = ["Chapter 1\n\nThe body was discovered.", "Chapter 2\n\nThe inspector questioned the staff."];

  it("verifyCitations: a nonexistent chapter and an absent sentence both fail", () => {
    const cites: FlagCitation[] = [
      { flag: "noResolution", chapter: 9, sentence: "anything" }, // chapter 9 doesn't exist (2 chapters)
      { flag: "endingContradictsEarlier", chapter: 2, sentence: "a sentence that never appears in the prose at all" },
      { flag: "pronounsUnstable", chapter: 2, sentence: "the inspector questioned the staff" }, // present
    ];
    const results = verifyCitations(cites, chapters);
    expect(results.find((r) => r.flag === "noResolution")!.verified).toBe(false);
    expect(results.find((r) => r.flag === "endingContradictsEarlier")!.verified).toBe(false);
    expect(results.find((r) => r.flag === "pronounsUnstable")!.verified).toBe(true);
  });

  it("scoreStory drops a flag whose cited sentence does not appear in the prose", async () => {
    const judge: RubricJudge = async () => ({
      rubric: rubric(),
      flags: { endingContradictsEarlier: true, noResolution: true },
      flagCitations: [
        // endingContradictsEarlier: sentence is genuinely in Ch2 → KEPT
        { flag: "endingContradictsEarlier", chapter: 2, sentence: "The inspector questioned the staff" },
        // noResolution: cites a chapter that doesn't exist → DROPPED
        { flag: "noResolution", chapter: 5, sentence: "the case was abandoned" },
      ],
    });
    const r = await scoreStory({ prose: chapters.join("\n\n"), cml: {}, chapters, judge });
    expect(r.facts.endingContradictsEarlier).toBe(true); // kept (citation verified)
    expect(r.facts.noResolution).toBe(false); // dropped (bad citation)
    expect(r.structural?.citationsDropped).toContain("noResolution");
    expect(r.structural?.citationsDropped).not.toContain("endingContradictsEarlier");
    // ending capped by the verified contradiction flag, not by the dropped noResolution one
    expect(r.categories.find((c) => c.category === "ending")!.mark).toBe(4);
  });
});

describe("splitProseIntoChapters — recovers chapter boundaries from assembled prose", () => {
  it("splits on 'Chapter N' headings", () => {
    const chunks = splitProseIntoChapters(PLANTED_CHAPTERS.join("\n\n"));
    expect(chunks.length).toBe(7);
    expect(chunks[2]).toMatch(/clockwork/);
  });

  it("returns the whole text as one chapter when there are no headings", () => {
    expect(splitProseIntoChapters("A plain block of prose with no headings.")).toHaveLength(1);
  });

  it("scoreStory falls back to splitting the prose string when chapters aren't supplied", async () => {
    // No `chapters` passed → scoreStory must split the assembled prose itself and still veto.
    const judge: RubricJudge = async () => ({
      rubric: rubric(),
      flags: { revealUsesUnplantedEvidence: true },
      flagCitations: [{ flag: "revealUsesUnplantedEvidence", chapter: 7, sentence: "At the discriminating test" }],
    });
    const r = await scoreStory({
      prose: PLANTED_CHAPTERS.join("\n\n"),
      cml: caseWith({ cluePlantedScene: { act: 1, scene: 1 } }),
      judge,
    });
    expect(r.structural?.unplantedEvidenceVetoed).toBe(true);
  });
});

describe("calibration hook (K2 §3) — internal↔external delta", () => {
  it("flags single-digit agreement and computes per-category drift", () => {
    const d = computeCalibrationDelta(
      72,
      { storyId: "run_x", external: 56, categories: { ending: 5 }, source: "ChatGPT" },
      { ending: 8 },
    );
    expect(d.delta).toBe(16);
    expect(d.absDelta).toBe(16);
    expect(d.withinSingleDigits).toBe(false); // 16 ≥ 10
    expect(d.categoryDeltas?.ending).toBe(3); // internal 8 − external 5
  });

  it("agreement within single digits passes the K2 gate", () => {
    const d = computeCalibrationDelta(63, { storyId: "run_y", external: 58 });
    expect(d.withinSingleDigits).toBe(true); // |5| < 10
  });

  it("summarizeCalibration reports mean abs error and the within-band rate", () => {
    const s = summarizeCalibration([
      computeCalibrationDelta(72, { storyId: "a", external: 56 }), // 16, out
      computeCalibrationDelta(63, { storyId: "b", external: 58 }), // 5, in
    ]);
    expect(s.count).toBe(2);
    expect(s.meanAbsError).toBeCloseTo(10.5, 5);
    expect(s.withinBandRate).toBe(0.5);
  });
});
