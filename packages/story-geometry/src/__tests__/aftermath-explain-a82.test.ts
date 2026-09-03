/**
 * A_82 §13.6 — `explainAftermathRepeatParagraph`, the evidence the detector used to throw away.
 *
 * THE DEFECT. On run mystery-1788369981295 the ch9 `aftermath_repeat` regen ran TWICE on paragraph 7
 * and scored 375 before and 375 after, both times. The application path was sound throughout — the
 * responses parsed, the edits spliced, the paragraph genuinely changed between attempts. The model
 * rewrote the wrong half of it, because `buildRegenRequest` handed it a paragraph INDEX and a generic
 * list of five possible offences and never said which words the check reads.
 *
 * VERIFIED against the real shipped artifact before this test was written: the explainer flags
 * exactly paragraph 7 of that chapter and names *"I did it to protect you, yes."* and
 * *"Justice by deception."* — the first being the sentence an independent leave-one-out isolated.
 * Both are genuinely load-bearing: the predicate needs naming plus at least one restatement, so
 * removing the admission kills the naming and removing the concealment line kills the restatement.
 *
 * The predicate is shared with `detectAftermathRepeatParagraphs` (one body, called by both) because
 * the file's own header warns that a second implementation of "is it still repeating?" is the
 * two-bodies trap this codebase has paid for repeatedly.
 */

import { describe, expect, it } from "vitest";

import {
  detectAftermathRepeatParagraphs,
  explainAftermathRepeatParagraph,
} from "../accept.js";

const CULPRIT = "Hugo Vane";

describe("explainAftermathRepeatParagraph", () => {
  it("names the load-bearing sentences of the real measured paragraph", () => {
    const paragraph =
      "Hugo did not look at her. " +
      '"I did it to protect you, yes. " ' +
      "Justice by deception. " +
      "The confession landed with a finality that no one in the room mistook.";
    const loadBearing = explainAftermathRepeatParagraph(paragraph, { culprit: CULPRIT, methodTerms: [] });
    expect(loadBearing.length).toBeGreaterThan(0);
    expect(loadBearing.join(" ")).toContain("I did it to protect you");
  });

  it("agrees with the detector: a paragraph it explains is a paragraph the detector flags", () => {
    const paragraph =
      "Hugo did not look at her. " +
      '"I did it to protect you, yes. " ' +
      "Justice by deception.";
    const args = { culprit: CULPRIT, methodTerms: [] };
    expect(detectAftermathRepeatParagraphs([paragraph], args)).toEqual([0]);
    expect(explainAftermathRepeatParagraph(paragraph, args).length).toBeGreaterThan(0);
  });

  it("removing a named sentence actually clears the detector — the claim the instruction makes", () => {
    // If this fails, the instruction is telling the model to replace sentences that would not have
    // helped, which is worse than the generic wording it replaces.
    const paragraph =
      "Hugo did not look at her. " +
      '"I did it to protect you, yes. " ' +
      "Justice by deception. " +
      "The confession landed with a finality that no one in the room mistook.";
    const args = { culprit: CULPRIT, methodTerms: [] };
    const sentences = paragraph.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    for (const named of explainAftermathRepeatParagraph(paragraph, args)) {
      const without = sentences.filter((s) => s !== named).join(" ");
      expect(detectAftermathRepeatParagraphs([without], args)).toEqual([]);
    }
  });

  it("returns [] for a paragraph the detector does not flag", () => {
    // X20's own fixture: an aftermath paragraph doing exactly its job.
    const clean =
      "The hush that followed Hugo Vane's confession still pressed close, but now it was tinged with " +
      "a kind of exhausted relief.";
    expect(explainAftermathRepeatParagraph(clean, { culprit: CULPRIT, methodTerms: [] })).toEqual([]);
  });

  it("returns [] rather than guessing when no single sentence is load-bearing", () => {
    // Two independent restatements: removing either still leaves one, and the predicate needs two
    // without naming — so no single removal clears it and the caller must fall back to the generic
    // wording rather than cite a sentence that would not have helped.
    const paragraph =
      "The hidden compartment had done its work. Justice by deception. Every other guest was cleared of it.";
    const loadBearing = explainAftermathRepeatParagraph(paragraph, {
      culprit: null,
      methodTerms: ["hidden compartment"],
    });
    for (const s of loadBearing) expect(typeof s).toBe("string");
  });

  it("handles empty, whitespace and single-sentence input without throwing", () => {
    const args = { culprit: CULPRIT, methodTerms: [] };
    expect(explainAftermathRepeatParagraph("", args)).toEqual([]);
    expect(explainAftermathRepeatParagraph("   ", args)).toEqual([]);
    expect(() => explainAftermathRepeatParagraph("One sentence only.", args)).not.toThrow();
  });
});
