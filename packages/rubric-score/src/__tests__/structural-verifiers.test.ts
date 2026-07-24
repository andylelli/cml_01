import { describe, expect, it } from "vitest";
import { scoreStory, type RubricJudge } from "../score.js";
import {
  verifyStructure,
  verifyCitations,
  splitProseIntoChapters,
  detectTemporalOrderingContradiction,
  detectDuplicateReveal,
  type FlagCitation,
} from "../structural-verifiers.js";
import { applyHardCaps } from "../hard-caps.js";
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

  // Over-detection fix (run mystery-1782585273377): when a clue's content cannot be resolved
  // (no prose-facing description → clueSearchTerms falls back to the bare id → no usable terms), the
  // prose scan is INDETERMINATE and must not veto a valid CASE-ordering "planted".
  it("does NOT flag an id-only clue as unplanted when the CASE ordering plants it before the test", () => {
    const caseIdOnly = {
      CASE: {
        cast: [
          { name: "Eleanor Voss", role: "detective" },
          { name: "Dr. Mallory Finch", role: "suspect" },
          { name: "Sylvia Trent", role: "victim" },
        ],
        culpability: { culprits: ["Dr. Mallory Finch"] },
        clues: [], // no description for "clue_1" → indeterminate prose scan
        hidden_model: { mechanism: { description: "the pendulum clock was wound backward to fake the timeline" } },
        discriminating_test: { evidence_clues: ["clue_1"] },
        prose_requirements: {
          discriminating_test_scene: { act_number: 3, scene_number: 1 },
          clue_to_scene_mapping: [{ clue_id: "clue_1", act_number: 1, scene_number: 1 }], // planted before the test
        },
      },
    };
    // The prose (PLANTED_CHAPTERS) never literally says "clue_1", yet it must NOT be flagged unplanted:
    // the CASE ordering places it before the test and the prose scan is indeterminate.
    const v = verifyStructure({ cml: caseIdOnly, chapters: PLANTED_CHAPTERS });
    expect(v.unplantedEvidence).not.toContain("clue_1");
  });
});

describe("verifyStructure — mechanism-timing requires EXPLANATION, not just term presence (K2 §1)", () => {
  // A crime-scene chapter dense with the mechanism's TERMS but only as planting/atmosphere (no causal /
  // method / agentive language) must NOT count as "mechanism explained" — the ch1 over-detection.
  const PLANT_HEAVY = [
    "Chapter 1\n\nSylvia Trent lay dead beneath the pendulum clock. The escapement gears stood still and the timeline felt wrong — the clock's scratched brass and frozen hands a silent mechanism, as though someone had fumbled with it.",
    ...PLANTED_CHAPTERS.slice(1, 6),
    "Chapter 7\n\nAt the discriminating test, Voss showed how Finch had wound the pendulum clock backward to fake the escapement timeline — the reveal.",
  ];

  it("a term-dense crime-scene chapter without explanation language is not the explanation chapter", () => {
    const v = verifyStructure({ cml: caseWith({ cluePlantedScene: { act: 1, scene: 1 } }), chapters: PLANT_HEAVY });
    expect(v.mechanismExplainedChapter).toBe(7); // ch1 plants the terms; ch7 actually explains ("to fake")
  });

  it("still detects a genuine EARLY explanation (terms + causal marker before the test)", () => {
    const earlyExplain = [
      "Chapter 1\n\nSylvia Trent lay dead beneath the pendulum clock.",
      "Chapter 2\n\nFinch had wound the pendulum clock backward to fake the escapement timeline, he confessed early — the whole mechanism laid bare.",
      ...PLANTED_CHAPTERS.slice(2),
    ];
    const v = verifyStructure({ cml: caseWith({ cluePlantedScene: { act: 1, scene: 1 } }), chapters: earlyExplain });
    expect(v.mechanismExplainedChapter).toBe(2); // explained at ch2, before the ch7 test
    expect(v.mechanismExplainedAtOrAfterTest).toBe(false);
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

// ─────────────────────────────────────────────────────────────────────────────
// A_68 FIX B/C — deterministic detectors + FIX A cap
// ─────────────────────────────────────────────────────────────────────────────
describe("A_68 FIX B — temporal reveal-ordering contradiction", () => {
  it("fires on the shipped sundial self-contradiction (before T1 … in fact T2>T1)", () => {
    const chapters = [
      "the body lay by the sundial in the cold june frost.",
      "the physical evidence proves lady beatrice died before twenty minutes past ten. in fact, the true time of death was ten minutes to eleven. your alibi does not hold.",
    ];
    const r = detectTemporalOrderingContradiction(chapters);
    expect(r.contradiction).toBe(true);
    expect(r.evidence).toContain("ch2");
  });

  it("parses digit-form times (before 10:20 … in fact 10:50)", () => {
    const r = detectTemporalOrderingContradiction(["x", "he died before 10:20. in fact the true time was 10:50."]);
    expect(r.contradiction).toBe(true);
  });

  it("does NOT fire on the CORRECT reveal (died at T2, not T1 as the shadow suggested)", () => {
    const chapters = [
      "the body lay by the sundial.",
      "lady beatrice died at ten minutes to eleven, not twenty minutes past ten as the shadow suggested.",
    ];
    expect(detectTemporalOrderingContradiction(chapters).contradiction).toBe(false);
  });

  it("does NOT fire on a normal timeline with different-event times", () => {
    const chapters = [
      "dinner was at eight o'clock and the guests arrived before seven o'clock.",
      "the detective reviewed the timeline: the train left at ten minutes past nine.",
    ];
    expect(detectTemporalOrderingContradiction(chapters).contradiction).toBe(false);
  });
});

describe("A_68 FIX C — duplicate reveal detector", () => {
  const caseData = { culpability: { culprits: ["Charles Pembroke"] } } as any;
  const lower = (chs: string[]): string[] => chs.map((c) => c.toLowerCase());

  it("flags ≥2 late chapters that each re-stage the full reveal", () => {
    const chapters = lower([
      "the garden was quiet.",
      "interviews continued through the afternoon.",
      "the final trap: charles pembroke was the murderer; he had reset the watch to fake the time. you killed her.",
      "clearance and culprit revealed: charles pembroke confessed. the discriminating test proved he had adjusted the sundial. the murderer was charles pembroke.",
    ]);
    const r = detectDuplicateReveal(caseData, chapters);
    expect(r.duplicate).toBe(true);
    expect(r.chapters).toEqual([3, 4]);
  });

  it("does NOT flag a single reveal followed by a pure aftermath chapter", () => {
    const chapters = lower([
      "the garden was quiet.",
      "the final trap: charles pembroke was the murderer; he had reset the watch to fake the time. you killed her.",
      "in the weeks that followed, the household grieved and the estate was quietly settled. the garden bloomed again.",
    ]);
    expect(detectDuplicateReveal(caseData, chapters).duplicate).toBe(false);
  });
});

describe("A_68 FIX A — mechanismIncoherent cap", () => {
  it("caps clues/plot/ending ≤6 and ceils the total ≤72", () => {
    const capped = applyHardCaps(rubric(), { mechanismIncoherent: true });
    const byCat = Object.fromEntries(capped.categories.map((c) => [c.category, c.mark]));
    expect(byCat.clues).toBeLessThanOrEqual(6);
    expect(byCat.plot_structure).toBeLessThanOrEqual(6);
    expect(byCat.ending).toBeLessThanOrEqual(6);
    expect(capped.final).toBeLessThanOrEqual(72);
  });

  it("does not cap a clean story", () => {
    const capped = applyHardCaps(rubric(), {});
    expect(capped.final).toBe(80);
  });
});
