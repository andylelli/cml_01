/**
 * A_71 — internal identifiers must never reach shipped prose.
 *
 * MEASURED source (story_20260731-1650, Chapter 9 — the only chapter that failed validation and so
 * never reached the post-pass polish). The external review capped Prose/polish at 6/10 citing
 * exactly these tokens.
 */
import { describe, expect, it } from "vitest";
import { scrubInternalIdentifiers, sanitizeGeneratedChapter } from "../agent9-prose/sanitization.js";

describe("scrubInternalIdentifiers", () => {
  it("removes a dash-wrapped identifier and closes the gap", () => {
    expect(
      scrubInternalIdentifiers("Witness accounts-clue_mid_1-place you away from the lobby."),
    ).toBe("Witness accounts place you away from the lobby.");
  });

  it("removes a trailing dash identifier", () => {
    expect(
      scrubInternalIdentifiers("the forensic report revealing tampering-clue_core_contradiction_chain proved it."),
    ).toBe("the forensic report revealing tampering proved it.");
  });

  it("removes a bare identifier without leaving double spaces", () => {
    expect(scrubInternalIdentifiers("The dust clue_mid_4 settled on the case.")).toBe(
      "The dust settled on the case.",
    );
  });

  it("removes a parenthesised identifier", () => {
    expect(scrubInternalIdentifiers("The chime (clue_mid_2) rang at a quarter to nine.")).toBe(
      "The chime rang at a quarter to nine.",
    );
  });

  it("does not leave a space before punctuation", () => {
    expect(scrubInternalIdentifiers("He named the witness clue_mid_1.")).toBe("He named the witness.");
  });

  it("covers the other identifier families, not just clues", () => {
    expect(scrubInternalIdentifiers("She crossed scene_3 toward the door.")).toBe("She crossed toward the door.");
    expect(scrubInternalIdentifiers("It matched atom_time_0810 exactly.")).toBe("It matched exactly.");
  });

  it("leaves ordinary prose untouched", () => {
    const clean = "Hugo Vane studied the clock face, its hands fixed at ten minutes past eight.";
    expect(scrubInternalIdentifiers(clean)).toBe(clean);
  });

  it("does not mangle legitimate hyphenated prose", () => {
    const clean = "The half-light of the seaside lobby caught the brass-cased clock.";
    expect(scrubInternalIdentifiers(clean)).toBe(clean);
  });

  it("handles empty and nullish input", () => {
    expect(scrubInternalIdentifiers("")).toBe("");
    expect(scrubInternalIdentifiers(undefined as unknown as string)).toBe("");
  });
});

describe("sanitizeGeneratedChapter", () => {
  it("scrubs identifiers without deleting the sentence that carried them", () => {
    const chapter = {
      title: "Chapter 9: The Revelation",
      paragraphs: [
        'Hugo moved on. "Dr. Mallory Finch, you were upstairs. Witness accounts-clue_mid_1-place you away from the lobby."',
      ],
    } as any;

    const out = sanitizeGeneratedChapter(chapter, ["Hugo Vane", "Mallory Finch"]);

    expect(out.paragraphs[0]).not.toMatch(/clue_/);
    // The reveal beat must survive — the old sentence-level stripper would have dropped it whole.
    expect(out.paragraphs[0]).toContain("Witness accounts place you away from the lobby");
  });
});

/** False-positive sweep: the prefix list must not reach into ordinary text. */
describe("scrub precision", () => {
  it("leaves near-miss words alone", () => {
    for (const s of ["the fact_finding mission", "Node_A of the plan", "He took a step_ back.", "a beat of silence"]) {
      expect(scrubInternalIdentifiers(s)).toBe(s);
    }
  });
});
