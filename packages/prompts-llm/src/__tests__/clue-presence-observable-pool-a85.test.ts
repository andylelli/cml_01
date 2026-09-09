/**
 * A_85 F5 — `AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL`: an early clue is present when its OBSERVATION is
 * on the page; its inference words are not required.
 *
 * MEASURED on run 24901: the chapter-1 clue regen wrote the observation correctly, matched 5 of the
 * 10 pool tokens, and the check demanded 6. The five missed were the clue's conclusion words. The
 * floor then pasted the label into chapter 1. These tests use that run's real clue record and the
 * sentence the regen actually wrote, in both flag states, and pin that the rule is a union (never
 * stricter than before).
 */

import { afterEach, describe, expect, it } from "vitest";
import {
  chapterClueAppearsEarly,
  chapterMentionsRequiredClue,
  earlyObservationOnPage,
  isCluePresenceObservablePoolEnabled,
} from "../agent9-prose/clue-validation.js";

// verbatim from data/store.json, artifact 759, run 24901
const CLUE = {
  id: "clue_pressure_discrepancy_suggestion",
  category: "testimonial",
  description: "This pressure discrepancy suggests the entry was forged, not the genuine work of the chemist who normally wrote with lighter pressure.",
  observable: "The forged entry's handwriting pressure is heavier than the chemist's normal style.",
  inference: "The forged ledger entry was not written by the chemist, indicating falsification.",
  pointsTo: "pressure, discrepancy, suggests",
  placement: "early",
  criticality: "essential",
};
const clueDistribution: any = { clues: [CLUE] };
const CAST = ["Neville Ingram", "Adela Ashgrove", "Dorothy Carrick", "Katherine Jardine", "Lavinia Yardley", "Ferdinand Underhill"];

/** The four clue-bearing sentences the chapter-1 regen wrote (Agent9-Regen-Ch1-missing_clue response, run 24901), verbatim. */
const OBSERVATION =
  "He bent closer, eyes narrowing; the entry’s handwriting was oddly heavy, the pressure uneven compared to the lighter, more practiced strokes visible on the previous page. " +
  "He noted the ledger’s page again: the ink’s irregular flow, the pressure of the pen, the faint chemical odor rising from the paper. " +
  "Neville Ingram let his gaze travel once more across the scene: the ledger’s stained page, the unnatural heaviness of the handwriting, the deep bruise on Adela Ashgrove’s temple, the bloodied brass paperweight. " +
  "He wrote a single line in his notebook: ‘Ledger—ink blots, pressure wrong, entry date—compare with logs.’ The chemist, Dorothy said, had always written with a light hand.";
/** The conclusion without the observation — what a REVEAL says, not what chapter 1 shows. */
const CONCLUSION_ONLY = "The discrepancy suggests the entry was forged; the pressure told against it.";

const withEnv = (value: string | undefined, fn: () => void) => {
  const prior = process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL;
  if (value === undefined) delete process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL;
  else process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL = value;
  try { fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL;
    else process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL = prior;
  }
};
afterEach(() => { delete process.env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL; });

describe("AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL — run 24901's chapter-1 clue", () => {
  it("flag OFF: the regen's correct observation is judged ABSENT (the defect, pinned)", () => {
    withEnv(undefined, () => {
      expect(isCluePresenceObservablePoolEnabled()).toBe(false);
      expect(chapterMentionsRequiredClue(OBSERVATION, CLUE.id, clueDistribution, CAST)).toBe(false);
    });
  });

  it("flag ON: the same observation is present", () => {
    withEnv("true", () => {
      expect(isCluePresenceObservablePoolEnabled()).toBe(true);
      expect(chapterMentionsRequiredClue(OBSERVATION, CLUE.id, clueDistribution, CAST)).toBe(true);
    });
  });

  it("flag ON: the early-enough check agrees when the observation opens the chapter", () => {
    const paragraphs = [OBSERVATION, "Rain again.", "The tide turned.", "Nobody spoke.", "Gulls."];
    // union: ON is never stricter than OFF, and the observation in the first quarter is enough
    let off = false;
    withEnv(undefined, () => { off = chapterClueAppearsEarly(paragraphs, CLUE.id, clueDistribution, CAST); });
    withEnv("true", () => {
      const on = chapterClueAppearsEarly(paragraphs, CLUE.id, clueDistribution, CAST);
      expect(on).toBe(true);
      if (off) expect(on).toBe(true);
    });
  });

  it("the rule is a UNION: whatever the old pool accepted is still accepted", () => {
    let oldVerdict = false;
    withEnv(undefined, () => { oldVerdict = chapterMentionsRequiredClue(CONCLUSION_ONLY, CLUE.id, clueDistribution, CAST); });
    withEnv("true", () => {
      const newVerdict = chapterMentionsRequiredClue(CONCLUSION_ONLY, CLUE.id, clueDistribution, CAST);
      // union: if the old pool accepted it, the new rule must too
      if (oldVerdict) expect(newVerdict).toBe(true);
      // and the helper alone is honest about the conclusion-only text: no observation there
      expect(earlyObservationOnPage(CLUE, CONCLUSION_ONLY.toLowerCase(), CAST)).toBe(false);
    });
  });

  it("a non-early clue is untouched by the flag", () => {
    const late = { ...CLUE, id: "clue_late", placement: "late" };
    const dist: any = { clues: [late] };
    withEnv("true", () => {
      expect(earlyObservationOnPage(late, OBSERVATION.toLowerCase(), CAST)).toBe(false);
      expect(chapterMentionsRequiredClue(OBSERVATION, "clue_late", dist, CAST)).toBe(
        chapterMentionsRequiredClue(OBSERVATION, "clue_late", dist, CAST),
      );
    });
  });

  it("an observable that is only a delivery-method label never counts as an observation", () => {
    withEnv("true", () => {
      expect(earlyObservationOnPage({ ...CLUE, observable: "Direct observation" }, OBSERVATION.toLowerCase(), CAST)).toBe(false);
    });
  });

  it("env is read at call time", () => {
    withEnv(undefined, () => expect(chapterMentionsRequiredClue(OBSERVATION, CLUE.id, clueDistribution, CAST)).toBe(false));
    withEnv("1", () => expect(chapterMentionsRequiredClue(OBSERVATION, CLUE.id, clueDistribution, CAST)).toBe(true));
    withEnv("off", () => expect(chapterMentionsRequiredClue(OBSERVATION, CLUE.id, clueDistribution, CAST)).toBe(false));
  });
});
