import { describe, expect, it } from "vitest";

import { applyCanonicalVictimRescue, applyRecollectionFrame } from "../jobs/agents/agent9-run.js";

/**
 * A_90 §12 — run 81042's read (87/100) listed two of the canonical-victim rescue's frames among the
 * "generated artifacts": "In a remembered moment, He looked once more at Beatrice Whitlock's stopped
 * watch" and "Before the death, "Miss Dunmore," Ambrose Halloway said … "Beatrice Whitlock was
 * struck …"". Neither is a live appearance of the victim; the rescue's own predicate (an active
 * verb anywhere in a sentence carrying the name) framed them. Under
 * `AGENT9_VICTIM_RESCUE_EXACT_PREDICATE` the rescue reframes exactly what the validator flags.
 */
const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const saved = process.env.AGENT9_VICTIM_RESCUE_EXACT_PREDICATE;
  if (value === undefined) delete process.env.AGENT9_VICTIM_RESCUE_EXACT_PREDICATE;
  else process.env.AGENT9_VICTIM_RESCUE_EXACT_PREDICATE = value;
  try {
    return fn();
  } finally {
    if (saved === undefined) delete process.env.AGENT9_VICTIM_RESCUE_EXACT_PREDICATE;
    else process.env.AGENT9_VICTIM_RESCUE_EXACT_PREDICATE = saved;
  }
};

const castCharacters = [
  { name: "Beatrice Whitlock", gender: "female" },
  { name: "Ambrose Halloway", gender: "male" },
];
const cml = {
  CASE: {
    cast: [
      { name: "Beatrice Whitlock", role: "victim", role_archetype: "victim", gender: "female" },
      { name: "Ambrose Halloway", role: "detective", role_archetype: "detective", gender: "male" },
    ],
    culpability: { victim: "Beatrice Whitlock" },
  },
};
const issues = [{ characterName: "Beatrice Whitlock", deadByChapter: 1, reappearsChapter: 5 }];

const RUN_SENTENCE_1 =
  "He looked once more at Beatrice Whitlock's stopped watch—ten minutes past three—and at the manor clock's hands.";
const RUN_SENTENCE_2 =
  "“Miss Dunmore,” Ambrose Halloway said, dry and quite unhurried, “Beatrice Whitlock was struck on the head with a heavy bronze candlestick.”";
const LIVE_SENTENCE = "Then Beatrice Whitlock entered the room and looked at him.";

const prose = () => ({
  chapters: [
    { paragraphs: ["The lifeless body of Beatrice Whitlock lay beside the clock."] },
    { paragraphs: [RUN_SENTENCE_1, RUN_SENTENCE_2, LIVE_SENTENCE] },
  ],
});

describe("applyCanonicalVictimRescue — the run's two false positives", () => {
  it("OFF reproduces the read: both sentences framed", () => {
    const rescued = withFlag(undefined, () => applyCanonicalVictimRescue(prose(), castCharacters as any, cml as any, issues as any));
    const paras = rescued.prose.chapters[1].paragraphs as string[];
    expect(paras[0]).toMatch(/^(?:In a remembered moment|In life|Before the death), He looked once more/);
    expect(paras[1]).toMatch(/^(?:In a remembered moment|In life|Before the death), “Miss Dunmore/);
  });

  it("ON: a possessive object and a death statement are left alone; a live appearance is still framed, lowercased", () => {
    const rescued = withFlag("true", () => applyCanonicalVictimRescue(prose(), castCharacters as any, cml as any, issues as any));
    const paras = rescued.prose.chapters[1].paragraphs as string[];
    expect(paras[0]).toBe(RUN_SENTENCE_1);
    expect(paras[1]).toBe(RUN_SENTENCE_2);
    expect(paras[2]).toMatch(/^(?:In a remembered moment|In life|Before the death), then Beatrice Whitlock entered the room/);
    expect(rescued.repairCount).toBe(1);
  });
});

describe("applyRecollectionFrame", () => {
  it("lowercases a function-word opener and leaves a name alone", () => {
    expect(applyRecollectionFrame("In life, ", "He looked at the watch.", true)).toBe("In life, he looked at the watch.");
    expect(applyRecollectionFrame("In life, ", "Beatrice Whitlock smiled.", true)).toBe("In life, Beatrice Whitlock smiled.");
    expect(applyRecollectionFrame("In life, ", "He looked at the watch.", false)).toBe("In life, He looked at the watch.");
  });
});
