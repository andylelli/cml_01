import { describe, expect, it } from "vitest";
import { castNameReferencedInProse } from "../phase-scorers/agent9-prose-scorer.js";

// A_61 RC4.4 — the character-name-consistency scorer must count a cast member as referenced when prose
// uses a natural short form (surname / first+surname), not only the verbatim decorated full name.

describe("castNameReferencedInProse — RC4.4 both directions", () => {
  it("counts a surname-only reference", () => {
    expect(castNameReferencedInProse("Dr. Eliza Hawthorne", "hawthorne knelt beside the body")).toBe(true);
  });
  it("counts a first+surname reference", () => {
    expect(castNameReferencedInProse("Captain Ivor Hale", "ivor hale lit his pipe")).toBe(true);
  });
  it("counts the verbatim full name", () => {
    expect(castNameReferencedInProse("Beatrice Quill", "beatrice quill said nothing")).toBe(true);
  });
  it("still fails when the cast member is never referenced (genuine gap preserved)", () => {
    expect(castNameReferencedInProse("Sylvia Trent", "the inspector questioned the gardener")).toBe(false);
  });
});
