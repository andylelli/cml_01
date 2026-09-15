/**
 * A_94 — the 80/100 read of run 31372, traced to its causes, each fix pinned on the run's own material.
 *
 *   the reader said                                    the cause, MEASURED
 *   "template/scaffold language", six phrases          five were the model's own sentences copied
 *                                                      chapter to chapter (×8, ×4, ×4, ×9) with the
 *                                                      atmosphere pass off; repetition 516/10k vs 23.6
 *   "Ch.10 starts well, then reverts to alibi recap"   the outline's final scene ordered "confirm alibis
 *                                                      of all suspects", and the aftermath prompt carried
 *                                                      that purpose beside the AFTERMATH CONTRACT (1 of 1)
 *   "Ch.9 becomes a list of evidence"                  the case and outline had a demonstration; the
 *                                                      prose reported it
 *   wit 8.8 per 10k                                    the beat asked for a remark and got no shape
 *
 * Every flag here defaults OFF, and with all four off the outputs are byte-identical to before.
 */

import { afterEach, describe, expect, it } from "vitest";

import {
  AFTERMATH_SCENE_PURPOSE,
  buildTestAsEventLines,
  buildWitBeatLines,
  buildWitShapeLines,
  isAftermathScenePurposeEnabled,
  isTestAsEventEnabled,
  isWitShapesEnabled,
  reframeSceneForAftermath,
} from "../agent9-prose/obligation-block.js";
import { HUMOUR_STYLES } from "../agent9-prose/prompt-blocks.js";
import { buildRepeatBanBlock, collectRepeatedSpans, isRepeatBanEnabled } from "../agent9-prose/repeat-ban.js";

const FLAGS = ["AGENT9_WIT_SHAPES", "AGENT9_TEST_AS_EVENT", "AGENT9_AFTERMATH_SCENE_PURPOSE", "AGENT9_REPEAT_BAN_LIST"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});
const off = () => FLAGS.forEach((f) => delete process.env[f]);

describe("flags default OFF", () => {
  it("nothing here is on unless .env says so", () => {
    off();
    expect(isWitShapesEnabled()).toBe(false);
    expect(isTestAsEventEnabled()).toBe(false);
    expect(isAftermathScenePurposeEnabled()).toBe(false);
    expect(isRepeatBanEnabled()).toBe(false);
  });
});

// ── the 31372 final scene, verbatim from the stored outline (artifact 941) ──────────────────────
const SCENE_10 = {
  title: "Clearances and Culprit Revealed",
  purpose: "Confirm alibis of all suspects except the culprit; confront Adela Sallow with evidence and reveal her guilt",
  summary:
    "Rosalind systematically confirms the alibis of Prudence Danvers, Barnaby Blackwood, Marguerite Greaves, and " +
    "Henrietta Tremayne, clearing them of suspicion. She then confronts Adela Sallow, revealing the manipulated time " +
    "of death and her access to the mirror mechanism, exposing her as the murderer.",
  setting: { location: "Theatre alley" },
  characters: ["Rosalind Loxley", "Adela Sallow"],
};

describe("R2 — the aftermath chapter does not receive the reveal scene's purpose", () => {
  it("replaces purpose and summary, keeps everything else on the scene", () => {
    const out = reframeSceneForAftermath(SCENE_10 as any) as any;
    expect(out.purpose).toBe(AFTERMATH_SCENE_PURPOSE);
    expect(out.summary).toBeUndefined();
    expect(out.title).toBe(SCENE_10.title);
    expect(out.setting).toEqual(SCENE_10.setting);
    expect(out.characters).toEqual(SCENE_10.characters);
  });

  it("KNOWN-POSITIVE: the run's own purpose carries the recap the reader complained of, and the reframed one does not", () => {
    expect(SCENE_10.purpose).toMatch(/Confirm alibis of all suspects/);
    expect(SCENE_10.summary).toMatch(/systematically confirms the alibis/);
    const reframed = JSON.stringify(reframeSceneForAftermath(SCENE_10 as any));
    expect(reframed).not.toMatch(/Confirm alibis of all suspects|systematically confirms|clearing them of suspicion|Prudence Danvers/);
    // The instruction NOT to confirm alibis is the one place the word may appear.
    expect(reframed).toMatch(/Do not confirm alibis/);
  });

  it("the aftermath purpose forbids the four things B3 forbids and asks for cost", () => {
    for (const phrase of ["confirm alibis", "re-stage the accusation", "re-quote the confession", "walk the evidence chain", "cost"]) {
      expect(AFTERMATH_SCENE_PURPOSE.toLowerCase()).toContain(phrase);
    }
  });
});

describe("R3 — the test as an event", () => {
  it("orders witness-commits BEFORE performed BEFORE explained, and carries no worked example", () => {
    const text = buildTestAsEventLines().join("\n");
    const i = (s: string) => text.indexOf(s);
    expect(i("BEFORE anything is explained")).toBeGreaterThan(-1);
    expect(i("BEFORE anything is explained")).toBeLessThan(i("PERFORMED on the page"));
    expect(i("PERFORMED on the page")).toBeLessThan(i("Only AFTER the demonstration"));
    // A_67 — no illustrative content that could be reproduced.
    expect(text).not.toMatch(/mirror|recess|alley|clock|Rosalind|Adela/i);
  });
});

describe("R4 — the wit beat asks for the two shapes the instrument counts", () => {
  const beat = { name: "Ottoline Dunmore", humourStyle: "polite_savagery", humourLevel: 0.6 };

  it("OFF: the beat is byte-identical to A_91's", () => {
    off();
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES).join("\n");
    expect(lines).toContain("ONE WIT BEAT");
    expect(lines).not.toContain("FLAT ANSWER");
  });

  it("ON: the flat answer and the short retort are named as countable operations, not rates", () => {
    process.env.AGENT9_WIT_SHAPES = "true";
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES).join("\n");
    expect(lines).toContain("THE FLAT ANSWER");
    expect(lines).toContain("four words or fewer");
    expect(lines).toContain("THE SHORT RETORT");
    expect(lines).toContain("six words or fewer");
    expect(lines).not.toMatch(/per 10k|per cent|%/);
  });

  it("R4b — MEASURED on the first pair: the shapes are additions, and no register is named in narration", () => {
    process.env.AGENT9_WIT_SHAPES = "true";
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES).join("\n");
    expect(lines).toContain("additions, not a diet");
    expect(lines).toContain("NEVER NAME A REGISTER OR A SHAPE IN NARRATION");
    // seed 1358: "'There are,' she replied. Four words, final." — the rule itself narrated
    expect(lines).toContain("never pointed at");
    // the wording that was read as a diet is gone
    expect(lines).not.toContain("Let people be short with each other");
  });

  it("no beat, no shapes — the band's 'none' still means none", () => {
    process.env.AGENT9_WIT_SHAPES = "true";
    expect(buildWitBeatLines(undefined, HUMOUR_STYLES)).toEqual([]);
    expect(buildWitShapeLines()).toHaveLength(2);
  });
});

describe("R5 — the repeat ban list", () => {
  // Three prior chapters; the run's own worst offender copied once per chapter, plus a locked value.
  const tic = "She tucked a stray lock of hair behind her ear and said nothing.";
  const locked = "The clock had stopped at ten minutes past three.";
  const ch = (n: number) => ({
    title: `Chapter ${n}`,
    paragraphs: [`Rosalind walked the alley in the fog of chapter ${n}. ${tic}`, `Nothing in chapter ${n} changed that. ${locked} Nobody disputed it.`],
  });
  const prior = [ch(1), ch(2), ch(3)];

  it("KNOWN-POSITIVE: the copied tic is found, ×3, once per chapter", () => {
    const spans = collectRepeatedSpans(prior, []);
    const hit = spans.find((s) => s.span.includes("stray lock of hair"));
    expect(hit?.count).toBe(3);
  });

  it("a locked value is exempt: mandated repetition is never listed, nor rebuilt around it", () => {
    const withLocked = collectRepeatedSpans(prior, ["ten minutes past three"]);
    // Not the value, and not the words either side of it stitched into a passage.
    expect(withLocked.some((s) => /ten minutes|minutes past|past three/.test(s.span))).toBe(false);
    const without = collectRepeatedSpans(prior, []);
    expect(without.some((s) => s.span.includes("ten minutes past three"))).toBe(true);
  });

  it("the windows of one copied sentence collapse to ONE entry carrying the passage", () => {
    const spans = collectRepeatedSpans(prior, ["ten minutes past three"]);
    const ticEntries = spans.filter((s) => /tucked|stray|lock of hair|behind her ear/.test(s.span));
    expect(ticEntries.length).toBe(1);
    expect(ticEntries[0]!.span).toContain("stray lock of hair behind her ear");
    expect(ticEntries[0]!.count).toBe(3);
  });

  it("the block is empty with nothing repeated, and names the count when there is", () => {
    expect(buildRepeatBanBlock([ch(1)], [])).toBe("");
    const block = buildRepeatBanBlock(prior, [{ value: "ten minutes past three" }]);
    expect(block).toContain("PHRASES THIS BOOK HAS ALREADY USED");
    expect(block).toMatch(/×3\s+"/);
    expect(block).not.toContain("ten minutes past three");
  });
});
