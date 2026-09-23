/**
 * ANALYSIS_99 §10.13 — the selector's hard gates on known-positives, and its calibration.
 *
 * A gate that has never been shown to fire on a real defect is a gate nobody can trust, and this
 * project has shipped several: the weather-opener lint that matched 0 of 1,933 archived openings
 * (A_88), the AM/PM check built on two literal backspace characters that returned false for every
 * input ever given to it (A_88), the scene-grounding gate that fired 0/10 on every run by
 * construction (A_86 item 71). Every gate below is asserted against text that should trip it AND
 * text that should not.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import {
  CALIBRATION,
  CALIBRATION_RHO,
  checkHardGates,
  chooseDraft,
  emDashPer1k,
  measureInstruments,
  scoreDraft,
  summariseSelection,
} from "../selector.js";
import type { Draft, ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
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
      {
        id: "clue_compass_tilt",
        observable: "the scuffed brass casing of the compass, worn along one edge",
        description: "the compass casing is worn where a thumb has tilted it",
        criticality: "essential",
      },
      {
        id: "clue_ledger_entry",
        observable: "a fresh ledger entry in different ink at nine o'clock",
        description: "the ledger carries a late entry",
        criticality: "essential",
      },
    ],
  },
  outline: {
    acts: [
      {
        scenes: [
          {
            sceneNumber: 1,
            act: 1,
            beat: "gathering",
            title: "Arrival",
            characters: ["Bertram Norbury", "Nora Quayle"],
            setting: { location: "the hotel office" },
            cluesRevealed: ["clue_compass_tilt"],
          },
          {
            sceneNumber: 2,
            act: 2,
            beat: "final_trap",
            title: "The Test",
            characters: ["Bertram Norbury", "Nora Quayle"],
            setting: { location: "the dunes" },
            cluesRevealed: ["clue_ledger_entry"],
          },
          {
            sceneNumber: 3,
            act: 3,
            beat: "revelation",
            title: "After",
            characters: ["Bertram Norbury"],
            setting: { location: "the promenade" },
          },
        ],
      },
    ],
  },
  cast: {
    characters: [
      { name: "Nora Quayle" },
      { name: "Bertram Norbury" },
      { name: "Montague Gaunt", role_archetype: "victim" },
    ],
  },
  humourLevel: "classic",
});

const chapter = (paragraphs: string[]): ProseChapterLike => ({ title: "t", paragraphs });

const draftOf = (chapters: ProseChapterLike[], attempt = 1): Draft => ({
  segment: 0,
  attempt,
  chapters,
  truncated: false,
  missing: [],
});

const CLEAN: ProseChapterLike[] = [
  chapter([
    "Bertram turned the compass over and found the scuffed brass casing, worn along one edge where a thumb had rested for years.",
    '"You hold it flat," he said.',
  ]),
  chapter([
    "The ledger lay open at a fresh entry, the ink a shade darker than the rest, written at nine o'clock.",
    "Nora watched him read it and said nothing at all.",
    // The reveal chapter of a CLEAN book names its culprit. It did not, and the hard gates did not
    // notice, which is the defect `reveal_unnamed` was added for: the release gate stopped runs for
    // a condition the selector could not see.
    "Nora Quayle killed him, and the compass had been saying so for two days.",
  ]),
  chapter(["The promenade had been swept, and the kiosk was open again."]),
];

describe("the hard gates fire on a real defect and not on clean prose", () => {
  it("clean prose trips nothing", () => {
    // `book_short` is excluded here only because CLEAN is a three-paragraph toy, not a book; the
    // length hit is pinned against real numbers in operations.test.ts.
    const hits = checkHardGates(CLEAN, core, [1, 2, 3]).filter((h) => h.kind !== "book_short");
    expect(hits, JSON.stringify(hits)).toEqual([]);
  });

  it("KNOWN-POSITIVE: a missing chapter", () => {
    const hits = checkHardGates(CLEAN.slice(0, 2), core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "chapter_missing" && h.chapter === 3)).toBe(true);
  });

  it("KNOWN-POSITIVE: a clue the chapter owes and does not carry", () => {
    const without = [chapter(["Bertram crossed the office and opened the window."]), CLEAN[1]!, CLEAN[2]!];
    const hits = checkHardGates(without, core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "clue_missing" && h.chapter === 1)).toBe(true);
  });

  it("KNOWN-POSITIVE: the culprit named before the reveal chapter", () => {
    const early = [
      chapter([...CLEAN[0]!.paragraphs, "Nora Quayle had killed him, and Bertram knew it."]),
      CLEAN[1]!,
      CLEAN[2]!,
    ];
    const hits = checkHardGates(early, core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "culprit_early" && h.chapter === 1)).toBe(true);
  });

  it("a SUSPICION is not an accusation — the gate does not fire on the middle of the book doing its job", () => {
    const suspicious = [
      chapter([...CLEAN[0]!.paragraphs, "Nora Quayle had been near the office all evening, and that troubled him."]),
      CLEAN[1]!,
      CLEAN[2]!,
    ];
    expect(checkHardGates(suspicious, core, [1, 2, 3]).some((h) => h.kind === "culprit_early")).toBe(false);
  });

  it("KNOWN-POSITIVE: a clue staged in a chapter that does not own it yet", () => {
    const early = [
      chapter([
        ...CLEAN[0]!.paragraphs,
        // The WHOLE clue on the early page. Under the corpus-chosen threshold (>= max(4, 90%) of the
        // key terms) a paraphrase that shares most of the vocabulary is not staging — see
        // selector-ranking.test.ts for why; this fixture is a genuine early staging.
        "The ledger lay open at a fresh ledger entry in different ink at nine o'clock, and nobody remarked on it.",
      ]),
      CLEAN[1]!,
      CLEAN[2]!,
    ];
    const hits = checkHardGates(early, core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "clue_early")).toBe(true);
  });

  it("KNOWN-POSITIVE: a clue id or an internal term on the page", () => {
    for (const leak of ["clue_compass_tilt was visible", "the discriminating test proved it", "per prose_requirements"]) {
      const leaked = [chapter([...CLEAN[0]!.paragraphs, leak]), CLEAN[1]!, CLEAN[2]!];
      expect(checkHardGates(leaked, core, [1, 2, 3]).some((h) => h.kind === "scaffold"), leak).toBe(true);
    }
  });
});

describe("the instruments", () => {
  it("measure the four canon-gap shapes", () => {
    const v = measureInstruments(CLEAN);
    expect(v.words).toBeGreaterThan(0);
    expect(v.dialogueOpenShare).toBeGreaterThan(0); // one paragraph opens on speech
    expect(v.registerRate).toBeGreaterThanOrEqual(0);
    expect(v.repetitionPer10k).toBeGreaterThanOrEqual(0);
  });

  it("the em-dash counter sees the ASCII form the pipeline actually writes", () => {
    const spaced = [chapter(["He turned - and she was already gone - before the bell."])];
    expect(emDashPer1k(spaced)).toBeGreaterThan(0);
    const real = [chapter(["He turned — and she was already gone — before the bell."])];
    expect(emDashPer1k(real)).toBeGreaterThan(0);
  });
});

describe("the composite and the choice", () => {
  it("a draft with fewer hard failures wins however good its prose", () => {
    const broken = draftOf([chapter(["Bertram crossed the office."]), CLEAN[1]!, CLEAN[2]!], 1);
    const clean = draftOf(CLEAN, 2);
    const scored = [
      { draft: broken, score: scoreDraft(broken, core, [1, 2, 3]) },
      { draft: clean, score: scoreDraft(clean, core, [1, 2, 3]) },
    ];
    expect(chooseDraft(scored)?.draft.attempt).toBe(2);
  });

  it("between clean drafts, the composite decides — and speech and length move it", () => {
    const flat = draftOf(
      [
        chapter([
          "Bertram turned the compass over and found the scuffed brass casing, worn along one edge where a thumb had rested.",
          "The matter remained unresolved.",
        ]),
        CLEAN[1]!,
        CLEAN[2]!,
      ],
      1,
    );
    const alive = draftOf(
      [
        chapter([
          '"You hold it flat," Bertram said, turning the compass over to the scuffed brass casing, worn along one edge where a thumb had rested for years and left its mark on the metal.',
          '"I hold it as I always have," she answered — and the sentence, short as it was, told him more than the ledger had.',
        ]),
        CLEAN[1]!,
        CLEAN[2]!,
      ],
      2,
    );
    const scored = [
      { draft: flat, score: scoreDraft(flat, core, [1, 2, 3]) },
      { draft: alive, score: scoreDraft(alive, core, [1, 2, 3]) },
    ];
    expect(chooseDraft(scored)?.draft.attempt).toBe(2);
  });

  it("wit is scored RAW and the band is reported, not folded into the composite", () => {
    // The first cut scored closeness to the band and normalised it against the corpus statistics for
    // the raw rate — two quantities through one z-score, which made the term identical for a target
    // of 0 and a target of 60. The calibration measured the raw rate, so the composite carries it,
    // and the band travels in the vector for the report and the brief to answer.
    const draft = draftOf(CLEAN);
    const dry = scoreDraft(draft, core, [1, 2, 3], { witTargetPer10k: 0 });
    const sharp = scoreDraft(draft, core, [1, 2, 3], { witTargetPer10k: 60 });
    expect(dry.contributions.witPer10k).toBe(sharp.contributions.witPer10k);
    expect(dry.vector.witTarget).toBe(0);
    expect(sharp.vector.witTarget).toBe(60);
  });

  it("an empty set of drafts yields null rather than an exception", () => {
    expect(chooseDraft([])).toBeNull();
    const empty = draftOf([]);
    expect(chooseDraft([{ draft: empty, score: scoreDraft(empty, core, [1, 2, 3]) }])).toBeNull();
  });

  it("the summary names the chosen draft and its numbers", () => {
    const draft = draftOf(CLEAN);
    const scored = [{ draft, score: scoreDraft(draft, core, [1, 2, 3]) }];
    const line = summariseSelection(scored, scored[0]!);
    expect(line).toMatch(/^\* draft 1: composite /);
    expect(line).toMatch(/speech-open/);
  });
});

describe("the calibration is what the script measured", () => {
  it("carries the corpus statistics and the weights argued in the header", () => {
    expect(CALIBRATION.registerRate.weight).toBe(-3);
    expect(CALIBRATION.dialogueOpenShare.weight).toBeGreaterThan(0);
    expect(Object.keys(CALIBRATION)).toHaveLength(6);
  });

  it("records that the composite beats register alone AND clears the design's bar", () => {
    // The first calibration reported 0.524 against a bar of 0.55 and was recorded as a miss. The
    // cause was a ledger defect, not the instruments: one review file holds three reads of TWO books
    // (79 and 82 of another book, then 87 of the folder's own) and every consumer took the first,
    // pairing a manuscript with another book's score. W1 fixed it; this is the corrected figure.
    expect(CALIBRATION_RHO.composite).toBeGreaterThan(CALIBRATION_RHO.registerAlone);
    expect(CALIBRATION_RHO.composite).toBeGreaterThanOrEqual(CALIBRATION_RHO.designBar);
  });
});
