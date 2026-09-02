import { describe, expect, it } from "vitest";
import { buildCharacterContractsBlock } from "../agent9-prose/prompt-blocks.js";
import {
  getTieredBannedPhrasePolicy,
  getRepairBannedPhrases,
  getWarningBannedPhrases,
  detectConfiguredBannedPhrases,
} from "../agent9-prose/banned-phrases.js";

// ───────────────────────────────────────────────────────────────────────────
// Item 14 — the SIGNATURE TIC prompt line instructs SPARING use (the old
// "at least once" per-chapter mandate compounded into verbatim tic spam).
// ───────────────────────────────────────────────────────────────────────────
describe("buildCharacterContractsBlock — signature tic wording (item 14)", () => {
  const bundle = {
    characters: [
      {
        name: "Ivor Hale",
        speechMannerisms: "Clipped naval cadence.",
        signatureTic: "Mark the tide.",
        voiceFragments: [],
        humourLevel: 0,
        humourStyle: "none",
        forbiddenCliché: "shipshape and Bristol fashion",
        permittedBehavioursByAct: {},
      },
    ],
  } as any;

  it("keeps ownership absolute but makes frequency sparing", () => {
    const block = buildCharacterContractsBlock(bundle, undefined, 2);
    expect(block).toContain('SIGNATURE TIC');
    expect(block).toContain('"Mark the tide."');
    // Ownership: still exclusively this character's.
    expect(block).toMatch(/never in anyone else's mouth/i);
    // Frequency: sparing, not mandated.
    expect(block).toMatch(/at most once in this chapter/i);
    expect(block).toMatch(/prefer a varied paraphrase over the verbatim phrase/i);
    expect(block).toMatch(/most chapters should omit it entirely/i);
    // The compounding per-chapter mandate is gone.
    expect(block).not.toMatch(/at least once/i);
  });

  it("back-compat: no signatureTic ⇒ no SIGNATURE TIC line, block otherwise intact", () => {
    const noTic = {
      characters: [{ ...bundle.characters[0], signatureTic: undefined }],
    } as any;
    const block = buildCharacterContractsBlock(noTic, undefined, 2);
    expect(block).not.toContain("SIGNATURE TIC");
    expect(block).toContain("Ivor Hale"); // the contract entry itself still renders
  });
});

// ───────────────────────────────────────────────────────────────────────────
// A_82 §12.15 P10 — MEASURED (external read 84/100): the sparing-RATE instruction did not hold.
// "isn't it just the way" reached 25 prompts and 4 chapters of one manuscript. When a chapter
// number and total chapter count are supplied, the tic is offered in exactly ONE deterministically
// assigned chapter and omitted from every other — an operation, not a restraint (A_75).
// ───────────────────────────────────────────────────────────────────────────
describe("buildCharacterContractsBlock — signature tic restricted to one assigned chapter (A_82 P10)", () => {
  const threeCharBundle = {
    characters: [
      { name: "Ivor Hale", signatureTic: "Mark the tide.", voiceFragments: [], humourLevel: 0, humourStyle: "none", forbiddenCliché: "x", permittedBehavioursByAct: {} },
      { name: "Beatrice Quill", signatureTic: "Isn't it just the way.", voiceFragments: [], humourLevel: 0, humourStyle: "none", forbiddenCliché: "x", permittedBehavioursByAct: {} },
      { name: "Hugo Vane", signatureTic: "One picks up an interest.", voiceFragments: [], humourLevel: 0, humourStyle: "none", forbiddenCliché: "x", permittedBehavioursByAct: {} },
    ],
  } as any;
  const TOTAL_CHAPTERS = 10;
  // index-in-cast mod totalChapters + 1: Hale (0) -> ch1, Quill (1) -> ch2, Vane (2) -> ch3.

  it("offers the tic ONLY in the character's assigned chapter", () => {
    const ch1 = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 1, TOTAL_CHAPTERS);
    expect(ch1).toContain("SIGNATURE TIC");
    expect(ch1).toContain('"Mark the tide."'); // Hale's, assigned to ch1
    expect(ch1).not.toContain("Isn't it just the way"); // Quill's, assigned to ch2 — absent, not softened
    expect(ch1).not.toContain("One picks up an interest"); // Vane's, assigned to ch3
  });

  it("moves to a different character in a different chapter — every chapter offers at most the assigned character's tic", () => {
    const ch2 = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 2, TOTAL_CHAPTERS);
    expect(ch2).toContain("Isn't it just the way");
    expect(ch2).not.toContain("Mark the tide");
    expect(ch2).not.toContain("One picks up an interest");
  });

  it("a chapter with no assigned character offers NO signature tic at all", () => {
    // Only 3 characters across 10 chapters — chapters 4-10 have no character assigned to them.
    const ch5 = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 5, TOTAL_CHAPTERS);
    expect(ch5).not.toContain("SIGNATURE TIC");
  });

  it("the assignment is STABLE across repeated calls — a retry/regen of the same chapter must not vary", () => {
    const first = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 2, TOTAL_CHAPTERS);
    const second = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 2, TOTAL_CHAPTERS);
    expect(first).toBe(second);
  });

  it("drops the sparing-RATE language entirely once an assignment exists — this is an operation, not a restraint", () => {
    const ch1 = buildCharacterContractsBlock(threeCharBundle, undefined, 2, undefined, 1, TOTAL_CHAPTERS);
    expect(ch1).not.toMatch(/most chapters should omit it entirely/i);
    expect(ch1).not.toMatch(/prefer a varied paraphrase over the verbatim phrase/i);
    expect(ch1).toMatch(/the one chapter it may appear/i);
  });

  it("back-compat: omitting chapterNumber/totalChapters falls back to the old sparing-rate wording for every character", () => {
    const noAssignment = buildCharacterContractsBlock(threeCharBundle, undefined, 2);
    expect(noAssignment).toMatch(/most chapters should omit it entirely/i);
    expect(noAssignment).toContain("Mark the tide");
    expect(noAssignment).toContain("Isn't it just the way");
    expect(noAssignment).toContain("One picks up an interest");
  });
});

// ───────────────────────────────────────────────────────────────────────────
// X43 (architecture/REVIEW_10.md §4) — the voice fragments were being COPIED,
// not matched, and the guard they needed was already two lines above them.
//
// Measured over the four runs with both a character bundle and a cold read:
// 28–50% of fragments came back as verbatim ≥5-word spans, and the rate tracks
// the reader's dialogue mark with no overlap between the 7s and the 6s.
// ───────────────────────────────────────────────────────────────────────────
describe("buildCharacterContractsBlock — voice fragments are a sample, not a script (X43)", () => {
  const bundle = {
    characters: [
      {
        name: "Ivor Hale",
        speechMannerisms: "Clipped naval cadence.",
        signatureTic: "Mark the tide.",
        voiceFragments: [
          { register: "comfortable", text: "Well, that's the way the biscuit crumbles, isn't it?" },
          { register: "guarded", text: "I can't rightly say where I was at every moment." },
        ],
        humourLevel: 0,
        humourStyle: "none",
        forbiddenCliché: "shipshape and Bristol fashion",
        permittedBehavioursByAct: {},
      },
    ],
  } as any;

  it("forbids verbatim reuse, across chapters, and forbids remixing the wording", () => {
    const block = buildCharacterContractsBlock(bundle, undefined, 2);
    expect(block).toMatch(/REGISTER SAMPLE/);
    expect(block).toMatch(/do NOT reproduce any phrase from them verbatim or near-verbatim/i);
    // Per-chapter guards compound into cross-chapter repetition — the item-14 lesson, applied here.
    expect(block).toMatch(/here or in any other chapter/i);
    // The other half of the defect: "Every detail demands attention or shadows gather reign".
    expect(block).toMatch(/do not\s+remix their wording/i);
    // The instruction that caused it is gone.
    expect(block).not.toMatch(/match this register and rhythm/i);
  });

  it("still shows the fragments — they are evidence about the voice, and removing them is not the fix", () => {
    const block = buildCharacterContractsBlock(bundle, undefined, 2);
    expect(block).toContain("[comfortable]");
    expect(block).toContain("biscuit crumbles");
    expect(block).toContain("[guarded]");
  });

  it("back-compat: no fragments ⇒ no sample block at all, and the tic guard is untouched", () => {
    const none = { characters: [{ ...bundle.characters[0], voiceFragments: [] }] } as any;
    const block = buildCharacterContractsBlock(none, undefined, 2);
    expect(block).not.toMatch(/REGISTER SAMPLE/);
    expect(block).toContain("SIGNATURE TIC");
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Item 15 — the worker time-injector echo + arc-summary fillers join the
// tiered banned-phrase policy (hard = retry/enforce; soft = rewrite).
// ───────────────────────────────────────────────────────────────────────────
describe("tiered banned-phrase policy — injector echo + arc fillers (item 15)", () => {
  const policy = getTieredBannedPhrasePolicy();

  it("hard tier bans the time-injector frame 'the hour stood at'", () => {
    expect(policy.hard).toContain("the hour stood at");
    // Hard bans feed BOTH the repair set and the warning set (existing tier semantics).
    expect(getRepairBannedPhrases(policy)).toContain("the hour stood at");
    expect(getWarningBannedPhrases(policy)).toContain("the hour stood at");
  });

  it("soft tier bans the three arc-summary fillers", () => {
    for (const phrase of [
      "the investigation had entered a new phase",
      "finally coming into focus",
      "setting the stage for the final confrontation",
    ]) {
      expect(policy.soft).toContain(phrase);
      expect(getRepairBannedPhrases(policy)).toContain(phrase);
      expect(getWarningBannedPhrases(policy)).toContain(phrase);
    }
  });

  it("each new phrase is detected in prose via the normalized matcher", () => {
    const chapters = [
      {
        title: "1",
        paragraphs: [
          "The hour stood at nine. The investigation had entered a new phase, the truth finally coming into focus, setting the stage for the final confrontation.",
        ],
      },
    ] as any;
    const hits = detectConfiguredBannedPhrases(chapters, getWarningBannedPhrases(policy));
    expect(hits).toContain("the hour stood at");
    expect(hits).toContain("the investigation had entered a new phase");
    expect(hits).toContain("finally coming into focus");
    expect(hits).toContain("setting the stage for the final confrontation");
  });

  it("neutral time phrasing stays clean — 'The clock read eight.' trips nothing", () => {
    const chapters = [{ title: "1", paragraphs: ["The clock read eight."] }] as any;
    expect(detectConfiguredBannedPhrases(chapters, getWarningBannedPhrases(policy))).toEqual([]);
  });
});
