/**
 * X49 (REVIEW_11 §6) — the guilt vocabulary, and the idiom that outlived X27.
 *
 * MEASURED on run `mystery-1786999938275`: **0 of chapter 8's 112 sentences matched `GUILT_MARKER` at
 * all**, in the reveal chapter an external reader scored 9/10. The case's death method was "struck
 * with a heavy bronze statuette" and the marker carried every method in the genre except a blow —
 * while `FIRST_PERSON_ADMISSION` forty lines away already had `struck (him|her|them) down`.
 *
 * Every pattern below was chosen by sweeping all 187 corpus manuscripts and counting only sentences
 * the old marker did not already match. `struck…down` fired twice, both genuine disclosures. Bare
 * `drowned` was REJECTED there: it takes 40+ sentences of "drowned out by the storm", which is X27's
 * defect exactly. `battered` is bounded to a person because this corpus is full of "battered logbook".
 */

import { describe, expect, it } from "vitest";
import { findManuscriptDisclosure } from "../accept.js";
import type { GeometryChapter } from "../types.js";

const ch = (n: number, ...paragraphs: string[]): GeometryChapter =>
  ({ chapterNumber: n, paragraphs }) as unknown as GeometryChapter;

const discloses = (paragraph: string, culprit = "Hugo Vane"): boolean =>
  findManuscriptDisclosure([ch(1, paragraph)], culprit)?.verdict === "met";

describe("GUILT_MARKER — blunt force is a murder method (X49)", () => {
  it("recognises the death method this pipeline actually generated", () => {
    // The shape of the 08-17 reveal, with the attribution the manuscript did not have.
    expect(discloses("Hugo Vane struck her down with a heavy bronze statuette.")).toBe(true);
  });

  it("recognises the passive form a reveal chapter writes", () => {
    expect(discloses("It was Hugo Vane by whom she was struck down, there beneath the clock.")).toBe(true);
  });

  it("recognises the blow phrasings", () => {
    expect(discloses("Hugo Vane had dealt the fatal blow before the bell tower chimed.")).toBe(true);
    expect(discloses("The killing blow was Hugo Vane's, and the clock was made to lie about the hour.")).toBe(true);
  });

  it("recognises the drowning and beating forms, at parity with FIRST_PERSON_ADMISSION", () => {
    expect(discloses("Hugo Vane held her under until she stopped moving.")).toBe(true);
    expect(discloses("Hugo Vane drowned her in the shallows before the tide turned.")).toBe(true);
    expect(discloses("Hugo Vane beat him to death in the boathouse.")).toBe(true);
  });

  it("does NOT fire on the sound-sense of 'drowned' — the reason bare `drowned` was rejected", () => {
    expect(discloses("Hugo Vane's reply was drowned out by the storm against the windows.")).toBe(false);
    expect(discloses("The crackle of the embers was almost drowned beneath the patter of drizzle, and Hugo Vane said nothing.")).toBe(false);
  });

  it("does NOT fire on a battered object — this corpus is full of battered logbooks", () => {
    expect(discloses("Hugo Vane set the battered logbook down on the reception desk.")).toBe(false);
  });

  it("does NOT fire on the clock striking, or on a thought striking someone", () => {
    expect(discloses("The clock struck three as Hugo Vane crossed the hall.")).toBe(false);
    expect(discloses("It struck Hugo Vane then that the bell tower had already chimed.")).toBe(false);
    expect(discloses("Hugo Vane struck a match and held it to the lamp.")).toBe(false);
  });
});

describe("GUILT_IDIOM — 'the glance she shot at him' (X49b)", () => {
  /**
   * X27 stripped `shot a glance` — VERB then NOUN. English also writes the noun first and the verb in
   * a relative clause, and that order is what made the advisory reveal-locator report "the manuscript
   * discloses in chapter 4" on the 08-17 run. Chapter 4 is an interrogation scene; the cold reader
   * put the reveal in chapter 8, where the contract bound it. Swept over 187 manuscripts: 6 sentences
   * match the inverted order and all six are this idiom.
   */
  it("does not read the inverted idiom as a disclosure — the ch4 false positive", () => {
    expect(
      discloses("Eleanor caught the quick glance Beatrice shot toward Hugo Vane, a silent question-or warning-passing between them."),
    ).toBe(false);
  });

  it("does not read 'shot through with' as a disclosure", () => {
    expect(discloses("The relief was shot through with grief, and Hugo Vane felt none of it.")).toBe(false);
  });

  it("still strips the original verb-then-noun order (X27 unchanged)", () => {
    expect(discloses("He shot a pointed glance at Hugo Vane, who bristled but said nothing.")).toBe(false);
  });

  it("STRIPS, never rejects — a real disclosure in the same sentence as an idiom still counts", () => {
    // X21's rule: removing the idiomatic span and testing what remains cannot mask a real accusation.
    expect(
      discloses("Eleanor caught the glance Beatrice shot at him, then said it plainly: Hugo Vane had struck her down."),
    ).toBe(true);
  });
});

/**
 * FOUND ON REVIEW 2026-08-18 — `ADMISSION_ATTRIBUTION` matched VERB-then-NAME only.
 *
 * English writes the speech tag both ways, and only `said Beatrice Quill` had a test. The other order
 * certified a second character's confession as the culprit's reveal — the false-certification class
 * REVIEW_05 §10.1 exists to prevent, which then hands the judge `noResolution = false`.
 */
describe("confessionDisclosure — the attribution must be read in both word orders", () => {
  // Culprit named explicitly: the default in `discloses` is "Hugo Vane", whose first-name alternative
  // would match "Hugo Hale" and make these pass for the wrong reason.
  const CULPRIT = "Hugo Hale";
  const para = (tag: string) =>
    `Hugo Hale stiffened by the window. "I killed her," ${tag}. The room went very quiet.`;
  const tells = (text: string) => discloses(text, CULPRIT);

  it("refuses someone else's confession when the tag is VERB-first (the covered case)", () => {
    expect(tells(para("said Beatrice Quill"))).toBe(false);
  });

  it("refuses it when the tag is SUBJECT-first — this returned `met` before the fix", () => {
    expect(tells(para("Beatrice Quill said"))).toBe(false);
  });

  it("refuses it for every attribution verb in either order", () => {
    for (const verb of ["whispered", "admitted", "confessed", "replied", "cried"]) {
      expect(tells(para(`Beatrice Quill ${verb}`))).toBe(false);
      expect(tells(para(`${verb} Beatrice Quill`))).toBe(false);
    }
  });

  it("still ACCEPTS the culprit's own confession in either order", () => {
    expect(tells(para("Hugo Hale said"))).toBe(true);
    expect(tells(para("said Hugo Hale"))).toBe(true);
  });

  it("still accepts an unattributed confession after the culprit is named", () => {
    // No speech tag at all: the paragraph named the culprit first, so the admission is theirs.
    expect(tells('Hugo Hale sank into the chair. "I killed her." The clock went on ticking.')).toBe(true);
  });

  it("reads the NEAREST attribution, not a later one", () => {
    // Beatrice speaks after; the admission belongs to the tag beside it.
    expect(
      tells('Hugo Hale went white. "I killed her," Hugo Hale said. Beatrice Quill said nothing at all.'),
    ).toBe(true);
  });
});

/**
 * X59 (found on the 08-19 run) — the THIRD word order of the same idiom.
 *
 * "She shot Hugo Vane a look that was more tired than accusatory" (ch2 of story_20260819-0147).
 * Ditransitive: verb, recipient, noun. Neither X27's `shot a glance` nor X49b's `glance … shot`
 * reaches it, and it is the most dangerous of the three because the recipient is a NAME — the
 * sentence pairs the culprit with a guilt verb, which is the conjunction `disclosingSentence` hunts.
 * It made `findManuscriptDisclosure` report that manuscript as disclosing at chapter 2; the reveal is
 * chapter 10. MEASURED: 25 such sentences across 171 manuscripts, all 25 the idiom, none covered.
 */
describe("GUILT_IDIOM — 'she shot him a look' (X59)", () => {
  it("does not read the ditransitive idiom as a disclosure — the live ch2 false positive", () => {
    expect(
      discloses("She shot Hugo Vane a look that was more tired than accusatory, then returned to her notes."),
    ).toBe(false);
  });

  it("covers the shapes the corpus actually writes", () => {
    for (const s of [
      "Hugo's eyes flashed, and he shot Beatrice a look of pure venom.",
      "She shot Hugo Vane a pointed look, the challenge clear.",
      "She shot Hugo Vane a sideways glance, her eyes wary.",
      "He shot Hugo Vane a look, daring him to contradict.",
    ]) expect(discloses(s)).toBe(false);
  });

  it("still reads a REAL shooting as a disclosure — no article-plus-look-noun follows", () => {
    // The boundary: a recipient followed by an article and a look-noun is the idiom; anything else
    // leaves `shot` standing as the murder verb it also is.
    expect(discloses("Hugo Vane shot the man where he stood, and the clock went on ticking.", "Hugo Vane")).toBe(true);
    expect(discloses("Hugo Vane shot her dead in the study.", "Hugo Vane")).toBe(true);
  });
});
