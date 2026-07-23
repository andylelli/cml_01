import { describe, expect, it } from "vitest";
import { repairPronouns, repairChapterPronouns } from "../pronoun-repair.js";

// A_66 — THE VANDALISM FIXTURES. Probe #1's entry-point forensics proved by byte-for-byte
// replay that every shipped pronoun-drift instance was pronoun-CORRECT in the accepted LLM
// draft and was flipped by this module's single-mention rule rebinding SUBJECT pronouns to
// OBJECT-position names ("He knelt beside Eleanor Voss" → "She knelt…"). These fixtures are
// the failure, verbatim from the clean drafts, and MUST hold under any future change here.

const CAST: any[] = [
  { name: "Hugo Vane", gender: "male", role: "investigator" },
  { name: "Eleanor Voss", gender: "female", role: "victim" },
  { name: "Dr. Mallory Finch", gender: "female" },
  { name: "Beatrice Quill", gender: "female" },
  { name: "Sylvia Trent", gender: "female" },
  { name: "Captain Ivor Hale", gender: "male" },
];

describe("A_66 positional rule — an object-position name never captures a subject pronoun", () => {
  const CLEAN_DRAFT_SENTENCES = [
    // probe #1 census, clean-draft forms (the shipped story had every one flipped):
    "He moved closer, heart thudding with a mixture of disbelief and dread, and knelt beside Eleanor Voss.",
    "He caught Dr. Finch's eye once more.",
    "He turned to Dr. Finch, voice softer.",
    "He remembered the contradiction of Eleanor's watch, the testimony of the guests, the persistent gaps in the timeline.",
    "He realised, as he watched Sylvia's shoulders sag in relief, that the ordeal had left scars on them all.",
  ];

  for (const sentence of CLEAN_DRAFT_SENTENCES) {
    it(`does not flip: "${sentence.slice(0, 60)}…"`, () => {
      const res = repairPronouns(sentence, CAST, { crossParagraphInheritance: true });
      expect(res.text).toBe(sentence);
      expect(res.repairCount).toBe(0);
    });
  }

  it("does not flip the reviewer's headline paragraph (clean-draft form, no name in sentence)", () => {
    // ch10: "Hugo watched the women…" then the introspection — the shipped story flipped all
    // four pronouns. Cross-paragraph inheritance + a female plural nearby must not capture.
    const paragraph =
      "Hugo watched the women gather their coats in silence.\n\nHe felt the ache of his own failure—his inability to save Eleanor, his blindness to the signs that had been there all along.";
    const res = repairPronouns(paragraph, CAST, { crossParagraphInheritance: true });
    expect(res.text).toBe(paragraph);
  });

  it("POSITIVE CONTROL: a subject-position name still captures and repairs its own wrong pronouns", () => {
    // The rule must not kill legitimate repair: name as sentence SUBJECT, wrong possessives after.
    const sentence = "Eleanor adjusted his gloves and smoothed his skirt before speaking.";
    const res = repairPronouns(sentence, CAST, {});
    expect(res.text).toBe("Eleanor adjusted her gloves and smoothed her skirt before speaking.");
    expect(res.repairCount).toBeGreaterThan(0);
  });

  it("honorific splitter: 'Dr. Mallory Finch' does not fracture the sentence mid-name", () => {
    // The [.!?] splitter historically broke on "Dr." — the same honorific class that blinded
    // the A3 scaffold detector. A sentence naming Dr. Finch as OBJECT must survive unchanged.
    const sentence = "He glanced at Dr. Mallory Finch, then away, and said nothing.";
    const res = repairPronouns(sentence, CAST, { crossParagraphInheritance: true });
    expect(res.text).toBe(sentence);
    expect(res.repairCount).toBe(0);
  });
});

describe("A_66 replay — repairChapterPronouns on a clean-draft chapter makes ZERO flips", () => {
  it("the census chapter ships byte-identical", () => {
    const chapter = {
      title: "Chapter 2",
      paragraphs: [
        "Hugo set the watch on the parquet beside Eleanor's hand.",
        "He glanced at the others—Dr. Finch's composure was brittle, her lips pressed tight, while Captain Hale's fingers drummed a silent tattoo against his sleeve.",
        "He reached for Eleanor's evening bag, its clasp stiff and cold beneath his fingers.",
      ],
    };
    const res = repairChapterPronouns(chapter, CAST);
    expect(res.chapter.paragraphs).toEqual(chapter.paragraphs);
  });
});
