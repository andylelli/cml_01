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
