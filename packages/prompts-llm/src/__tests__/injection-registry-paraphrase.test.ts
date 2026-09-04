/**
 * The registry must recognise the shape the model PARAPHRASES our injections into, not only the
 * shape the code writes.
 *
 * MEASURED on story_20260903-2136 (external read 77/100, prose 5/10). The code writes
 * "That detail shifted the reasoning. Weighed against the rest, <bag> bent the trail toward <bag>."
 * The shipped book contains "That detail turned the logic stacked against the rest, <bag> bent the
 * trail toward <bag>." — and `isInjectedSentence` returned false for all four occurrences, so the
 * recap-strip pass could not remove them and the retirement metrics did not count them.
 *
 * Baselined over all 32 archived manuscripts before the pattern was added: 6 occurrences in 2 books,
 * every one a token bag, zero authored prose. This registry feeds a pass that DELETES text.
 */

import { describe, expect, it } from "vitest";

import { isInjectedSentence } from "../agent9-prose/injection-templates.js";

describe("isInjectedSentence — the paraphrased clue-inference line", () => {
  it("recognises the real shipped sentences it used to miss", () => {
    const real = [
      "That detail turned the logic stacked against the rest, Junior stagehand recalls stage manager ledger bent the trail toward Ledger absent blackout indicating possible swap.",
      "That detail overturned the logic stacked against the rest, Conductor baton small unusual leather patch bent the trail toward Modification muffles drumstick sound delaying audible.",
      "That detail upended the logic stacked against the rest, Brass candlestick wiped traces blood groove bent the trail toward something.",
      "Those details tilted the logic stacked against the rest, Gerald Yardley uniquely knowledge access bent the trail toward opportunity.",
    ];
    for (const s of real) expect(isInjectedSentence(s), s.slice(0, 60)).toBe(true);
  });

  it("still recognises the form the code actually writes", () => {
    expect(
      isInjectedSentence(
        "Weighed against the rest, Victim last seen alive minutes past bent the trail toward Temporal conflict hale alibi.",
      ),
    ).toBe(true);
  });

  it("recognises the LIST-GRAMMAR form the flag switches to", () => {
    expect(isInjectedSentence("Weighed against the rest, one detail told against the account: the torn cuff.")).toBe(true);
    expect(isInjectedSentence("What it pointed to: the locked study.")).toBe(true);
  });

  it("does NOT match authored prose that merely reasons about evidence", () => {
    // The anchor is "the logic stacked against the rest", a phrase no author writes. These are the
    // shapes a real chapter uses for the same beat, and deleting one would cost real writing.
    const authored = [
      "That detail changed everything she had assumed about the evening.",
      "The logic of it stacked up against him, detail by patient detail.",
      "Those details, taken together, told against the account he had given.",
      "She weighed it against the rest of what she knew and found it wanting.",
    ];
    for (const s of authored) expect(isInjectedSentence(s), s).toBe(false);
  });

  it("the pre-existing opener pattern still claims our own paragraph opener, correctly", () => {
    /**
     * "That detail shifted the reasoning" was in this test's authored list on the first pass, and it
     * matched — via the PRE-EXISTING `/(?:Those details|That detail) shifted the reasoning/i`, not
     * the pattern added here. That is right, not a false positive: `buildClueInferenceParagraph`
     * writes exactly that string as the paragraph opener, so it IS our text. The badly-chosen
     * example is kept here as the assertion it should always have been.
     */
    expect(isInjectedSentence("That detail shifted the reasoning, though she could not yet say how.")).toBe(true);
  });
});
