import { describe, expect, it } from "vitest";
import { anonymiseNamedWalkOns, buildAllowedNameParts, CharacterConsistencyValidator } from "../character-validator.js";

// A_62 abort class #8 (M1v9-8, mystery-1784256689298): a missing_clue regen wrote a cut-off
// address — "Mr. In…" — AFTER the standalone walk-on sweep, and the detector convicted "Mr. In"
// as an out-of-cast walk-on in ch4 and ch9, tipping the run to majors>5 needs_revision ONE run
// short of closing the M1 gate. A capitalized function word after an honorific is interrupted
// dialogue or a sentence boundary, never a person.

const allowed = buildAllowedNameParts(["Eleanor Voss", "Captain Ivor Hale", "Hugo Vane"]);

const storyWith = (text: string) => ({
  id: "s1",
  projectId: "p1",
  scenes: [{ number: 4, title: "Chapter 4", text, paragraphs: [text] }],
});

const cml = {
  CASE: {
    cast: [
      { name: "Eleanor Voss", role_archetype: "Detective", gender: "female" },
      { name: "Captain Ivor Hale", role_archetype: "Suspect", gender: "male" },
      { name: "Hugo Vane", role_archetype: "Victim", gender: "male" },
    ],
    culpability: { culprits: [] },
  },
} as any;

const walkOnErrors = (text: string) =>
  new CharacterConsistencyValidator()
    .validate(storyWith(text) as any, cml)
    .errors.filter((e: any) => e.type === "illegal_named_walk_on");

describe("walk-on function-word guard — abort class #8 (precision half)", () => {
  it("FIXTURE: a cut-off address 'Mr. In…' is NOT a walk-on", () => {
    const cutOff = `"Thank you, Mr. In—" The door swung shut before the name was finished.`;
    expect(walkOnErrors(cutOff)).toEqual([]);
  });

  it("a REAL out-of-cast titled name still flags (recall preserved)", () => {
    const real = "Mr. Bayless arrived from the village with the evening post.";
    expect(walkOnErrors(real).length).toBeGreaterThan(0);
  });

  it("the anonymiser leaves 'Mr. In—' untouched (never rewrite a cut-off address into 'the man—')", () => {
    const cutOff = `"Not now, Mr. In the hallway beyond, the clocks struck four."`;
    const res = anonymiseNamedWalkOns(cutOff, allowed);
    expect(res.text).toBe(cutOff);
    expect(res.replaced).toEqual([]);
  });

  it("the anonymiser still rewrites a REAL walk-on", () => {
    const real = "Mr. Bayless tipped his hat at the gate.";
    const res = anonymiseNamedWalkOns(real, allowed);
    expect(res.text).toMatch(/^The man tipped his hat/);
    expect(res.replaced).toEqual(["Mr. Bayless"]);
  });

  it("cast members are never touched by either path", () => {
    const castText = "Captain Hale waited in the lounge.";
    expect(walkOnErrors(castText)).toEqual([]);
    expect(anonymiseNamedWalkOns(castText, allowed).text).toBe(castText);
  });
});
