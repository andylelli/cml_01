import { describe, expect, it } from "vitest";
import { EraAuthenticityValidator } from "../era-validator.js";

// A_62 abort class #7 (M1v8-2, mystery-1784247524200): "tablet" flagged as a 1940s anachronism
// 8×/8 chapters in a POISON mystery — every instance the PILL sense, the murder method itself.
// One polysemous word × per-chapter amplification crossed the majors>5 needs_revision threshold
// and aborted a run with zero criticals (the A_60 mechanical-"spring" shape, new lexeme).
// Fixture-driven per the RC-4 rule: the run's own sentence is the negative fixture.

const storyWith = (text: string) => ({
  id: "s1",
  projectId: "p1",
  scenes: [{ number: 1, title: "Chapter 1", text, paragraphs: [text] }],
  metadata: { era: "1940s" },
});

const cml = { CASE: { meta: { era: { decade: "1940s" } } } } as any;

const anachronisms = (text: string) =>
  new EraAuthenticityValidator()
    .validate(storyWith(text) as any, cml)
    .errors.filter((e: any) => e.type === "anachronism");

describe("era anachronism polysemy guard — abort class #7", () => {
  it("FIXTURE (the exact abort): the pill sense does NOT flag", () => {
    // Verbatim shape from the aborted run's prose.
    const pill =
      "The uniformity of that residue suggested deliberate tampering—perhaps a tablet, dissolved slowly, releasing its poison over time.";
    expect(anachronisms(pill).filter((e: any) => /tablet/i.test(e.message))).toEqual([]);
  });

  it("the computing sense STILL flags (recall preserved)", () => {
    const computing = "He swiped at the tablet, its glowing screen lighting the study.";
    expect(anachronisms(computing).filter((e: any) => /tablet/i.test(e.message)).length).toBeGreaterThan(0);
  });

  it("stone/writing senses do not flag either", () => {
    const stone = "The memorial tablet above the mantel bore the family motto in worn brass letters.";
    expect(anachronisms(stone).filter((e: any) => /tablet/i.test(e.message))).toEqual([]);
  });

  it("unguarded terms keep their bare-word behavior (no recall change beyond the guarded list)", () => {
    const laptop = "A laptop rested on the desk beside the inkwell.";
    expect(anachronisms(laptop).filter((e: any) => /laptop/i.test(e.message)).length).toBeGreaterThan(0);
  });

  // The BARE words 'mobile'/'digital' sit in the 1900s–1920s forbiddenTerms (the 1930s+ lists carry
  // the unambiguous phrases 'mobile phone'/'digital camera', which need no guard). Test the decade
  // where the bare term actually fires.
  const anachronisms1920s = (text: string) =>
    new EraAuthenticityValidator()
      .validate(storyWith(text) as any, { CASE: { meta: { era: { decade: "1920s" } } } } as any)
      .errors.filter((e: any) => e.type === "anachronism");

  it("sibling 'mobile' (1920s bare term): the adjective sense does NOT flag; the phone sense does", () => {
    const adjective = "Her features were mobile and expressive, shifting with every thought.";
    expect(anachronisms1920s(adjective).filter((e: any) => /"mobile"/i.test(e.message))).toEqual([]);
    const phone = "He thumbed at his mobile, the screen glowing as the call connected.";
    expect(anachronisms1920s(phone).filter((e: any) => /"mobile"/i.test(e.message)).length).toBeGreaterThan(0);
  });

  it("sibling 'digital' (1920s bare term): the fingers sense does NOT flag; the electronics sense does", () => {
    const fingers = "The pianist's digital dexterity impressed even the sceptical Captain.";
    expect(anachronisms1920s(fingers).filter((e: any) => /"digital"/i.test(e.message))).toEqual([]);
    const electronics = "A digital display blinked on the strange device by the window.";
    expect(anachronisms1920s(electronics).filter((e: any) => /"digital"/i.test(e.message)).length).toBeGreaterThan(0);
  });

  it("guard is window-scoped: computing context elsewhere in the chapter does not convict a pill", () => {
    const mixed =
      "The wireless device crackled in the corner of the lounge, forgotten. " +
      "Far upstairs, on the nightstand, a tablet dissolved slowly in the tumbler of water, its residue bitter. " +
      "Nobody looked at either.".padEnd(400, " ");
    // "device" sits ~100+ chars from "tablet" — outside the ±80 window; the pill stays innocent.
    expect(anachronisms(mixed).filter((e: any) => /tablet/i.test(e.message))).toEqual([]);
  });
});
