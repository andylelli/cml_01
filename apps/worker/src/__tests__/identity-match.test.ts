import { describe, it, expect } from "vitest";
import {
  namesMatch,
  surname,
  nameAppearsAsWord,
  roleArchetypeIncludesWord,
  isDetectiveArchetype,
} from "../jobs/agents/identity-match.js";

// A_53 P4 (Pattern D): word-boundary / surname-aware matching replaces raw String.includes on
// names and roles, which false-positives across a real cast.

describe("namesMatch", () => {
  it("matches exact (case-insensitive) and shared surname", () => {
    expect(namesMatch("Ada Blythe", "ada blythe")).toBe(true);
    expect(namesMatch("Inspector Blythe", "Ada Blythe")).toBe(true); // shared surname
  });
  it("does not match unrelated names", () => {
    expect(namesMatch("Ann", "Joanna")).toBe(false);
    expect(namesMatch("Ada Blythe", "Bruno Cade")).toBe(false);
  });
  it("returns false for empty inputs", () => {
    expect(namesMatch("", "Ada")).toBe(false);
    expect(namesMatch("Ada", undefined)).toBe(false);
  });
});

describe("nameAppearsAsWord", () => {
  it("matches the full name or surname as a whole word", () => {
    expect(nameAppearsAsWord("Ada Blythe", "A porter cleared Ada Blythe before tea.")).toBe(true);
    expect(nameAppearsAsWord("Ada Blythe", "The alibi clears Blythe entirely.")).toBe(true);
  });
  it("does not substring-match a different name", () => {
    expect(nameAppearsAsWord("Ann", "Annabelle was in the library.")).toBe(false);
    expect(nameAppearsAsWord("Ann", "Joanna left at nine.")).toBe(false);
  });
});

describe("roleArchetypeIncludesWord", () => {
  it("matches a whole word but not a substring qualifier", () => {
    expect(roleArchetypeIncludesWord("victim", "victim")).toBe(true);
    expect(roleArchetypeIncludesWord("the victim", "victim")).toBe(true);
    // word-boundary still matches possessive — the A3 fix uses exact-match, not this helper, for victim.
    expect(roleArchetypeIncludesWord("doctor", "victim")).toBe(false);
  });
});

describe("isDetectiveArchetype", () => {
  it("recognises genuine detective archetypes", () => {
    expect(isDetectiveArchetype("Detective Inspector")).toBe(true);
    expect(isDetectiveArchetype("amateur sleuth")).toBe(true);
    expect(isDetectiveArchetype("Private Investigator")).toBe(true);
    expect(isDetectiveArchetype("Police Inspector")).toBe(true);
  });
  it("excludes non-police inspector/investigator occupations (suspects)", () => {
    expect(isDetectiveArchetype("building inspector")).toBe(false);
    expect(isDetectiveArchetype("insurance investigator")).toBe(false);
    expect(isDetectiveArchetype("health inspector")).toBe(false);
  });
  it("returns false for unrelated archetypes", () => {
    expect(isDetectiveArchetype("Authority Figure")).toBe(false);
    expect(isDetectiveArchetype("")).toBe(false);
  });
});

describe("surname", () => {
  it("returns the last token lower-cased", () => {
    expect(surname("Ada Blythe")).toBe("blythe");
    expect(surname("Madonna")).toBe("madonna");
    expect(surname("")).toBe("");
  });
});
