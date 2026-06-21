import { describe, it, expect } from "vitest";
import { anonymizeUnknownTitledNames, findUnknownTitledNameMentions } from "../name-sanitizer.js";

describe("name-sanitizer", () => {
  const cast = ["Beatrice Holloway", "Arthur Pendleton", "Clara Voss", "Gerald Fitzwilliam"];

  it("detects unknown titled names", () => {
    const text = "Inspector Harlow spoke to Mr. Pendleton while Detective Smythe watched.";
    const unknown = findUnknownTitledNameMentions(text, cast);

    expect(unknown).toContain("Inspector Harlow");
    expect(unknown).toContain("Detective Smythe");
    expect(unknown).not.toContain("Mr. Pendleton");
  });

  it("anonymizes unknown titled names and preserves valid cast surnames", () => {
    const text = "Inspector Harlow entered. Mr. Pendleton remained calm. Detective Smythe frowned.";
    const sanitized = anonymizeUnknownTitledNames(text, cast);

    expect(sanitized).toContain("an inspector entered");
    expect(sanitized).toContain("Mr. Pendleton remained calm");
    expect(sanitized).toContain("the detective frowned");
  });

  it("handles titles without dots and complex surnames", () => {
    const castWithComplex = ["Martha O'Neil", "Sarah Smith-Jones"];
    const text = "Mr O'Neil nodded. Dr Smith-Jones sighed. Inspector Harlow waited.";
    const sanitized = anonymizeUnknownTitledNames(text, castWithComplex);

    expect(sanitized).toContain("Mr O'Neil nodded");
    expect(sanitized).toContain("Dr Smith-Jones sighed");
    expect(sanitized).toContain("an inspector waited");
  });

  it("does not flag compound titled full cast names as unknown", () => {
    const castWithTitle = ["Detective Inspector Eleanor Graves", ...cast];
    const text = "Detective Inspector Eleanor Graves questioned Inspector Harlow in the hall.";

    const unknown = findUnknownTitledNameMentions(text, castWithTitle);
    const sanitized = anonymizeUnknownTitledNames(text, castWithTitle);

    expect(unknown).not.toContain("Detective Inspector Eleanor Graves");
    expect(unknown).toContain("Inspector Harlow");
    expect(sanitized).toContain("Detective Inspector Eleanor Graves questioned");
    expect(sanitized).toContain("an inspector in the hall");
  });
});
