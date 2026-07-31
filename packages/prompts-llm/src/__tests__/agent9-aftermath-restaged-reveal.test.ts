/**
 * A_71 — the aftermath chapter must not re-stage the reveal.
 *
 * MEASURED (story_20260731-1650): Ch9's prompt correctly carried the AFTERMATH CONTRACT — stage-mode
 * assignment worked, and the contract states that a re-staged reveal "will be rejected and
 * regenerated". No validator enforced it, so the model re-staged anyway and the chapter shipped.
 * The external review's headline structural complaint was exactly this ("Chapter 9 repeats Chapter 8").
 *
 * The strings below are taken from that shipped chapter.
 */
import { describe, expect, it } from "vitest";
import { detectRestagedRevealViolations } from "../agent9-prose/clue-validation.js";

describe("detectRestagedRevealViolations", () => {
  it("catches the shipped clearance roll-call verbatim", () => {
    const shipped =
      'Eleanor is eliminated. " Hugo moved on, his gaze steady. "Dr. Mallory Finch, you were upstairs tending to a patient. ' +
      "Witness accounts place you away from the lobby. Beatrice Quill is cleared by the staff.";
    const found = detectRestagedRevealViolations(shipped);
    expect(found.some((v) => /clearance roll-call/i.test(v))).toBe(true);
  });

  it("catches a fresh on-page accusation", () => {
    expect(
      detectRestagedRevealViolations('"Captain Hale, you killed her with the clock," Hugo said.').some((v) =>
        /fresh accusation/i.test(v),
      ),
    ).toBe(true);
  });

  it("catches a fresh on-page confession", () => {
    expect(
      detectRestagedRevealViolations('"I killed her," Hale whispered, "and I would do it again."').some((v) =>
        /fresh confession/i.test(v),
      ),
    ).toBe(true);
  });

  it("catches an evidence-chain re-run", () => {
    expect(
      detectRestagedRevealViolations(
        "Taken together, the hands, the chime, and the dust formed the chain of evidence against him.",
      ).some((v) => /evidence chain/i.test(v)),
    ).toBe(true);
  });

  // The contract REQUIRES retrospect — naming the culprit and referencing the settled outcome. A
  // detector that fired on those would reject every compliant aftermath chapter.
  it("permits a compliant aftermath chapter that names the culprit in retrospect", () => {
    const compliant =
      "By dawn the police had taken Captain Ivor Hale away, and the lobby felt larger for his absence. " +
      "Eleanor Voss set the tea things down without a word. Hugo Vane watched the rain thin over the water and " +
      "wondered what the hotel would become now that Sylvia Trent's name could be spoken plainly again.";
    expect(detectRestagedRevealViolations(compliant)).toEqual([]);
  });

  it("permits a single passing reference to someone having been cleared", () => {
    const compliant =
      "Dr. Finch, cleared at last, packed her bag in silence. The household would take longer to mend than the ledger.";
    expect(detectRestagedRevealViolations(compliant)).toEqual([]);
  });

  it("permits referencing the confession as a settled fact", () => {
    const compliant =
      "Hale's confession had been signed before midnight, and the constable spoke of it as a thing already done.";
    expect(detectRestagedRevealViolations(compliant)).toEqual([]);
  });

  it("returns nothing for empty input", () => {
    expect(detectRestagedRevealViolations("")).toEqual([]);
    expect(detectRestagedRevealViolations(undefined as unknown as string)).toEqual([]);
  });
});

/**
 * Measured on story_20260731-1750: the detector fired correctly but its MESSAGE described the wrong
 * defect, and the model failed all three retries. A re-quote framed as recollection is still the
 * reveal run twice — but the fix the model needs ("refer to it, don't reproduce it") is different
 * from the fix for a freshly dramatised confession.
 */
describe("confession violation messages are actionable", () => {
  it("names a verbatim re-quote as a re-quote, not a fresh confession", () => {
    const shipped =
      'Ivor\'s confession lingered in the air, the words still echoing: "I killed her. Mallory threatened to expose my debts. I struck her with the candlestick."';
    const [msg] = detectRestagedRevealViolations(shipped).filter((v) => /confession/i.test(v));
    expect(msg).toMatch(/re-quotes the confession/i);
    expect(msg).toMatch(/replace the quotation/i);
  });

  it("still names an unframed on-page confession as a fresh confession", () => {
    const fresh = 'Hale\'s face crumpled. "I killed her," he said, and the room went silent.';
    const [msg] = detectRestagedRevealViolations(fresh).filter((v) => /confession/i.test(v));
    expect(msg).toMatch(/stages a fresh confession/i);
  });

  it("keeps permitting a bare reference to the confession as settled fact", () => {
    expect(
      detectRestagedRevealViolations("Hale's confession had been signed before midnight, and the constable filed it."),
    ).toEqual([]);
  });
});

/** False-positive sweep on the aftermath detector. */
describe("aftermath detector precision", () => {
  it("does not read the idiom 'killed time' as a confession", () => {
    expect(detectRestagedRevealViolations("I killed time in the lounge until the rain stopped.")).toEqual([]);
  });

  it("does not treat 'taken together' as an evidence-chain re-run on its own", () => {
    expect(detectRestagedRevealViolations("Taken together, they left for the station.")).toEqual([]);
  });

  it("still catches a genuine walkthrough", () => {
    expect(detectRestagedRevealViolations("Taken together, the evidence damned him.").length).toBe(1);
  });
});
