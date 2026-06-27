import { describe, expect, it } from "vitest";
import { deriveStoryTitle, isGenerationResidueTitle } from "../story-title.js";

const DIAGNOSTIC_NOTE = "Generated in scene batches. 10 batch(es) required retry for validation.";

describe("isGenerationResidueTitle", () => {
  it("flags the Agent-9 diagnostic note", () => {
    expect(isGenerationResidueTitle(DIAGNOSTIC_NOTE)).toBe(true);
  });

  it("flags distinctive fragments of the note", () => {
    expect(isGenerationResidueTitle("Generated in scene batches")).toBe(true);
    expect(isGenerationResidueTitle("3 batch(es) required")).toBe(true);
    expect(isGenerationResidueTitle("required retry for validation")).toBe(true);
  });

  it("does not flag a real title", () => {
    expect(isGenerationResidueTitle("The Sedgemoor Manor Murder")).toBe(false);
    expect(isGenerationResidueTitle("A Study in Scarlet")).toBe(false);
  });

  it("ignores non-string input", () => {
    expect(isGenerationResidueTitle(undefined)).toBe(false);
    expect(isGenerationResidueTitle(null)).toBe(false);
    expect(isGenerationResidueTitle(42)).toBe(false);
  });
});

describe("deriveStoryTitle", () => {
  it("prefers the prose title when present and real", () => {
    expect(deriveStoryTitle({ title: "The Locked Study" }, "Fallback")).toBe("The Locked Study");
  });

  it("trims surrounding whitespace from the prose title", () => {
    expect(deriveStoryTitle({ title: "  The Locked Study  " })).toBe("The Locked Study");
  });

  it("NEVER uses prose.note as a title — falls through to the fallback", () => {
    expect(deriveStoryTitle({ note: DIAGNOSTIC_NOTE }, "The Real Title")).toBe("The Real Title");
  });

  it("rejects a residue prose.title and falls through to the fallback", () => {
    expect(deriveStoryTitle({ title: DIAGNOSTIC_NOTE }, "The Real Title")).toBe("The Real Title");
  });

  it("rejects a residue fallback and returns the generic default", () => {
    expect(deriveStoryTitle({ title: "" }, DIAGNOSTIC_NOTE)).toBe("Mystery Story");
  });

  it("returns the generic default when nothing usable is present", () => {
    expect(deriveStoryTitle({ note: DIAGNOSTIC_NOTE })).toBe("Mystery Story");
    expect(deriveStoryTitle(null)).toBe("Mystery Story");
    expect(deriveStoryTitle(undefined, "   ")).toBe("Mystery Story");
  });

  it("uses the fallback when the prose has no title", () => {
    expect(deriveStoryTitle({}, "The Big Bow Mystery")).toBe("The Big Bow Mystery");
  });
});
