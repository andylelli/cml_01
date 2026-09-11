import { describe, expect, it } from "vitest";
import { splitLifecycleSentences } from "../jobs/agents/agent9-run.js";

/**
 * A_88 — the lifecycle sentence splitter inserted a space before every closing quote.
 *
 * `[^.!?\n]+[.!?]*` stops at the terminator, so a closing quote begins the NEXT token. The three
 * callers rebuild the paragraph with `sentences.join(" ")`, which puts a space where the model
 * wrote none. MEASURED over the 3,392 paragraphs of the stored prose archive: the old pattern
 * corrupts 1,573 of them (46.4%).
 *
 * Confirmed as ours, not the model's: for the sentence below, every Agent 9 entry in
 * `logs/llm-prompts-full.jsonl` carries `cooperation.”` and only the stored artifact and the
 * RubricScorer carry `cooperation. ”`.
 */
const RQ = "”";
const LQ = "“";

describe("A_88 — the sentence splitter must not re-punctuate the prose", () => {
  it("keeps a closing curly quote attached to the sentence it closes", () => {
    const p = `${LQ}I expect your full cooperation.${RQ} Her words hung in the air.`;
    expect(splitLifecycleSentences(p)).toEqual([
      `${LQ}I expect your full cooperation.${RQ}`,
      "Her words hung in the air.",
    ]);
  });

  it("round-trips a dialogue paragraph unchanged — this is what the callers do", () => {
    const cases = [
      `${LQ}The chimes were unmistakable.${RQ} His words hovered between them.`,
      `${LQ}Who else knew?${RQ} she asked. ${LQ}Nobody,${RQ} he said.`,
      `He crossed the room. ${LQ}It was me.${RQ} The confession settled over the table.`,
      'She said, "I saw the clock." Then she left.',
      "A plain narrative paragraph with no dialogue at all. Two sentences, in fact.",
    ];
    for (const text of cases) {
      expect(splitLifecycleSentences(text).join(" ")).toBe(text);
    }
  });

  it("THE DEFECT: the old pattern inserted the space — kept here so it cannot come back", () => {
    const p = `${LQ}I expect your full cooperation.${RQ} Her words hung in the air.`;
    const oldSplit = (t: string) => (t.match(/[^.!?\n]+[.!?]*/g) ?? []).map((s) => s.trim()).filter(Boolean);
    expect(oldSplit(p).join(" ")).toContain(`. ${RQ}`);
    expect(splitLifecycleSentences(p).join(" ")).not.toContain(`. ${RQ}`);
  });

  it("still splits on terminators, and does not swallow the following sentence", () => {
    expect(splitLifecycleSentences("One. Two! Three?")).toEqual(["One.", "Two!", "Three?"]);
    expect(splitLifecycleSentences("")).toEqual([]);
  });
});
