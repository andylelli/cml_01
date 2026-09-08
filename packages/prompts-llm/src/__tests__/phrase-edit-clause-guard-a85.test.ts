/**
 * A_85 F3 — `AGENT9_PHRASE_EDIT_CLAUSE_GUARD`: an atmosphere-repair edit must not splice across a
 * clause boundary the model's own phrase does not include.
 *
 * MEASURED on run 24901 (external read 78/100, prose 5/10). The atmosphere repair returned
 *   { original: "thought was never borne by one alone",
 *     replacement: "burden was never shouldered by a single soul" }
 * for "The cost of truth, he thought, was never borne by one alone." The A_71 punctuation-tolerant
 * matcher swallowed the comma the model dropped and the replacement deleted "thought," — the book
 * shipped "The cost of truth, he burden was never shouldered by a single soul." Chapter 9 got the
 * same edit. The reviewer quoted both. These are that run's real edits, both flag states.
 */

import { afterEach, describe, expect, it } from "vitest";
import {
  applyPhraseSubstitutions,
  isPhraseEditClauseGuardEnabled,
  phraseEditCrossesClauseBoundary,
} from "../agent9-prose/repair.js";

const CH8 = "The cost of truth, he thought, was never borne by one alone.";
const CH9 = "The cost of truth, Neville Ingram thought, was never borne by one alone.";
const EDIT_CH8 = { original: "thought was never borne by one alone", replacement: "burden was never shouldered by a single soul" };
const EDIT_CH9 = { original: "thought was never borne by one alone", replacement: "burden was always shouldered by more than a single mind" };

const withEnv = (value: string | undefined, fn: () => void) => {
  const prior = process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD;
  if (value === undefined) delete process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD;
  else process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD = value;
  try { fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD;
    else process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD = prior;
  }
};
afterEach(() => { delete process.env.AGENT9_PHRASE_EDIT_CLAUSE_GUARD; });

describe("AGENT9_PHRASE_EDIT_CLAUSE_GUARD — run 24901's two real edits", () => {
  it("flag OFF: the ch8 edit ships 'he burden' (the defect, pinned)", () => {
    withEnv(undefined, () => {
      expect(isPhraseEditClauseGuardEnabled()).toBe(false);
      const [out] = applyPhraseSubstitutions([CH8], [EDIT_CH8]);
      expect(out).toBe("The cost of truth, he burden was never shouldered by a single soul.");
    });
  });

  it("flag ON: both edits are refused and the sentences are untouched", () => {
    withEnv("true", () => {
      expect(isPhraseEditClauseGuardEnabled()).toBe(true);
      expect(applyPhraseSubstitutions([CH8], [EDIT_CH8])).toEqual([CH8]);
      expect(applyPhraseSubstitutions([CH9], [EDIT_CH9])).toEqual([CH9]);
    });
  });

  it("the predicate names the reason: the span has a comma the original lacks", () => {
    expect(phraseEditCrossesClauseBoundary(CH8, EDIT_CH8.original)).toBe(true);
    expect(phraseEditCrossesClauseBoundary(CH8, "was never borne by one alone")).toBe(false);
  });

  it("flag ON: an edit whose phrase carries its own comma still applies", () => {
    withEnv("true", () => {
      const [out] = applyPhraseSubstitutions(
        [CH8],
        [{ original: "he thought, was never borne by one alone", replacement: "he thought, was never borne by anyone alone" }],
      );
      expect(out).toBe("The cost of truth, he thought, was never borne by anyone alone.");
    });
  });

  it("flag ON: a plain within-clause edit still applies", () => {
    withEnv("true", () => {
      const [out] = applyPhraseSubstitutions(
        ["The fog pressed against the veranda glass like a hand."],
        [{ original: "like a hand", replacement: "like a palm laid flat" }],
      );
      expect(out).toBe("The fog pressed against the veranda glass like a palm laid flat.");
    });
  });
});
