import { describe, expect, it } from "vitest";
import { substituteRoleAliasesInPostRevealChapters } from "../jobs/agents/agent9-run.js";
import { NarrativeContinuityValidator, computeArrestPivotIndex } from "@cml/story-validation";

// Roadmap Phase A — the role-alias repair boundary must be a SUPERSET of the detector's flagged set.
// Previously it used floor(0.8*tc), leaving a middle post-reveal chapter unrepaired → identity_role_alias_break
// critical aborted the run (M1 clock: reveal ch8, alias ch9 of 10). Now it mirrors the detector's arrest pivot.

const cml: any = { CASE: { culpability: { culprits: ["Beatrice Quill"] } } };
const chOf = (texts: string[]) => ({ chapters: texts.map((t, i) => ({ title: `Ch${i + 1}`, paragraphs: [t] })) });
const validate = (prose: any) => {
  const story = { scenes: prose.chapters.map((c: any, i: number) => ({ number: i + 1, title: c.title, text: c.paragraphs.join("\n\n") })) };
  return new NarrativeContinuityValidator().validate(story as any).errors.filter((e: any) => e.type === "identity_role_alias_break");
};

describe("computeArrestPivotIndex", () => {
  it("returns the FIRST arrest/confession chapter index in the reveal window", () => {
    const texts = ["opening", "clues", "more clues", "questioning", "pressure", "the net tightens", "suspicion", "the inspector arrested her at last", "aftermath", "epilogue"];
    expect(computeArrestPivotIndex(texts)).toBe(7); // 0-based ch8
  });
  it("returns -1 when there is no arrest/confession", () => {
    expect(computeArrestPivotIndex(["a", "b", "c"])).toBe(-1);
  });
});

describe("substituteRoleAliasesInPostRevealChapters — boundary aligned with the detector", () => {
  it("repairs a MIDDLE post-reveal chapter the old floor(0.8) boundary skipped", () => {
    // reveal/arrest in ch8; role alias in ch9 AND ch10 → both must be repaired (old code left ch9).
    const prose = chOf([
      "The house was quiet.", "A clue.", "Another.", "Questions.", "Unease.", "The net.", "Suspicion falls.",
      "Beatrice Quill was arrested for the murder.",
      "Later, the killer's motive became clear to them all.",   // ch9 — alias
      "In the end, the murderer had confessed everything.",     // ch10 — alias
    ]);
    expect(validate(prose).length).toBeGreaterThan(0); // fires before repair
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cml);
    expect(validate(fixed)).toEqual([]); // zero after repair — ch9 no longer escapes
    expect(fixed.chapters[8].paragraphs[0]).toContain("Beatrice Quill");
  });

  it("does NOT rename a role alias in a PRE-reveal chapter (before any arrest)", () => {
    const prose = chOf([
      "The killer struck in the night, unseen.", // ch1 — pre-reveal alias, must stay
      "clues", "more",
      "Beatrice Quill was arrested at last.",
    ]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cml);
    expect(fixed.chapters[0].paragraphs[0]).toContain("killer"); // untouched — culprit still hidden
    expect(fixed.chapters[0].paragraphs[0]).not.toContain("Beatrice");
  });

  it("is a no-op when there is no arrest/confession anywhere", () => {
    const prose = chOf(["the killer moved", "clues", "the murderer watched"]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cml);
    expect(fixed.chapters[0].paragraphs[0]).toContain("killer"); // unchanged
  });
});

describe("substituteRoleAliasesInPostRevealChapters — A_64 §2 F4 role-predicate guard", () => {
  // dv_clock_off ch10 shipped "Beatrice Quill could not have been Captain Ivor Hale": the sweep
  // substituted the culprit's proper name into a NEGATED identity predicate, where the alias names a
  // ROLE. Under negation the guard substitutes "responsible" — clearance meaning preserved, no
  // role-alias term left for the identity_role_alias_break detector, no identity nonsense.
  const cmlHale: any = { CASE: { culpability: { culprits: ["Captain Ivor Hale"] } } };

  it("substitutes 'responsible' (never the culprit's name) into a negated identity predicate", () => {
    const prose = chOf([
      "opening", "clues",
      "Captain Ivor Hale was arrested for the murder.",
      "The alibi placed Beatrice Quill elsewhere; Beatrice Quill could not have been the killer.", // post-reveal
    ]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cmlHale);
    const text = fixed.chapters[3].paragraphs[0];
    expect(text).toContain("Beatrice Quill could not have been responsible");
    expect(text).not.toContain("could not have been Captain Ivor Hale"); // the shipped corruption
    expect(validate(fixed)).toEqual([]); // the detector this sweep repairs still reads clean
  });

  it("still substitutes the culprit's name in affirmative post-reveal aliases", () => {
    const prose = chOf([
      "opening", "clues",
      "Captain Ivor Hale confessed to the murder.",
      "So the killer had been among them all along.", // affirmative — name is correct
    ]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cmlHale);
    expect(fixed.chapters[3].paragraphs[0]).toContain("Captain Ivor Hale had been among them");
  });

  it("keeps the name in a POSSESSIVE alias even under negation (referential use)", () => {
    const prose = chOf([
      "opening", "clues",
      "Captain Ivor Hale was arrested at dawn.",
      "She had not been the killer's target after all.", // possessive → referential → name is right
    ]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cmlHale);
    expect(fixed.chapters[3].paragraphs[0]).toContain("Captain Ivor Hale's target");
    expect(fixed.chapters[3].paragraphs[0]).not.toContain("responsible's");
  });

  it("covers the contracted negation forms (wasn't / couldn't have been)", () => {
    const prose = chOf([
      "opening", "clues",
      "Captain Ivor Hale was arrested for the murder.",
      "Hugo Vane wasn't the murderer, whatever the village said.",
    ]);
    const fixed = substituteRoleAliasesInPostRevealChapters(prose, cmlHale);
    expect(fixed.chapters[3].paragraphs[0]).toContain("wasn't responsible");
    expect(fixed.chapters[3].paragraphs[0]).not.toContain("wasn't Captain");
  });
});
