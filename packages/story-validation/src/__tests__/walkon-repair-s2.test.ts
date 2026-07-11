import { describe, expect, it } from "vitest";
import { anonymiseNamedWalkOns, buildAllowedNameParts, CharacterConsistencyValidator } from "../character-validator.js";

// Roadmap S2 — the reliability floor: an out-of-cast titled walk-on is rewritten to a role noun so it
// never aborts the run on `illegal_named_walk_on`; in-cast titled names are untouched.

const cast = ["Dr. Mallory Finch", "Captain Ivor Hale", "Beatrice Quill"];
const allowed = buildAllowedNameParts(cast);

describe("anonymiseNamedWalkOns — both directions", () => {
  it("rewrites an out-of-cast titled walk-on to a role noun", () => {
    const r = anonymiseNamedWalkOns("Mrs. Green brought the tea and left.", allowed);
    expect(r.text).toBe("The woman brought the tea and left.");
    expect(r.replaced).toContain("Mrs. Green");
  });

  it("maps police titles to their role and capitalises mid-sentence correctly", () => {
    expect(anonymiseNamedWalkOns("Then Inspector Bayless arrived.", allowed).text).toBe("Then the inspector arrived.");
    expect(anonymiseNamedWalkOns("Mr. Hewitt nodded.", allowed).text).toBe("The man nodded.");
  });

  it("leaves in-cast titled names untouched (both surname and title forms)", () => {
    const r = anonymiseNamedWalkOns("Dr. Finch examined the body while Captain Hale watched.", allowed);
    expect(r.text).toBe("Dr. Finch examined the body while Captain Hale watched.");
    expect(r.replaced).toEqual([]);
  });

  it("handles multiple walk-ons in one paragraph", () => {
    const r = anonymiseNamedWalkOns("Mrs. Green and Mrs. Hall whispered together.", allowed);
    expect(r.replaced.length).toBe(2);
    expect(r.text).not.toMatch(/Green|Hall/);
  });
});

describe("anonymiseNamedWalkOns clears the illegal_named_walk_on major end-to-end", () => {
  const cml: any = { CASE: { cast: [
    { name: "Dr. Mallory Finch", role_archetype: "detective", gender: "female" },
    { name: "Beatrice Quill", role_archetype: "suspect", gender: "female" },
  ] } };
  const walkonScene = "Dr. Finch questioned Beatrice Quill. Mrs. Green hovered by the door.";

  it("the validator flags the walk-on before repair, and none after", () => {
    const before = new CharacterConsistencyValidator().validate({ scenes: [{ number: 1, title: "Ch1", text: walkonScene }] } as any, cml);
    expect((before.errors ?? []).some((e: any) => e.type === "illegal_named_walk_on")).toBe(true);

    const allowedParts = buildAllowedNameParts(cml.CASE.cast.map((c: any) => c.name));
    const fixed = anonymiseNamedWalkOns(walkonScene, allowedParts).text;
    const after = new CharacterConsistencyValidator().validate({ scenes: [{ number: 1, title: "Ch1", text: fixed }] } as any, cml);
    expect((after.errors ?? []).some((e: any) => e.type === "illegal_named_walk_on")).toBe(false);
  });
});
