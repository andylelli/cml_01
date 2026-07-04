import { describe, expect, it } from "vitest";
import { nameAliasesForMatch, nameAppearsInProse, extractStoryFacts } from "../facts.js";
import { verifyStructure } from "../structural-verifiers.js";

// A_61 RC4.4 — verifier/scorer precision sweep: a valid story that refers to a titled/multi-word cast
// name by its natural short form (surname / first+surname) must not be scored as if the name is absent.

describe("nameAliasesForMatch — natural short forms of a decorated full name", () => {
  it("yields surname and first+surname, drops the title", () => {
    const aliases = nameAliasesForMatch("Lady Beatrice Ellsworth");
    expect(aliases).toContain("Ellsworth");
    expect(aliases).toContain("Beatrice Ellsworth");
  });

  it("does not emit a collision-prone bare surname under 3 chars", () => {
    // hypothetical 2-char surname → surname alias suppressed; full/first+surname still present
    const aliases = nameAliasesForMatch("Mr Xu");
    expect(aliases).not.toContain("Xu");
  });
});

describe("nameAppearsInProse — surname-only reference counts, genuine miss still fails", () => {
  it("matches a surname-only reference", () => {
    expect(nameAppearsInProse("Lord Edmund Ashworth", "Ashworth was found slumped in the study.")).toBe(true);
  });
  it("matches title+surname prose via the surname alias", () => {
    expect(nameAppearsInProse("Dr. Eliza Hawthorne", "Dr. Hawthorne knelt by the body.")).toBe(true);
  });
  it("still fails when the name never appears (genuine miss)", () => {
    expect(nameAppearsInProse("Lord Edmund Ashworth", "The detective examined the empty study.")).toBe(false);
  });

  // Review fix — a common-word surname must NOT false-match atmospheric prose.
  it("does NOT match the weather word 'frost' for a never-named victim 'Eleanor Frost'", () => {
    expect(nameAppearsInProse("Eleanor Frost", "Frost coated the panes and the deceased woman lay still.")).toBe(false);
  });
  it("does NOT match 'rose'/'stone'/'marsh' as bare surnames", () => {
    expect(nameAliasesForMatch("Mary Rose")).not.toContain("Rose");
    expect(nameAliasesForMatch("Dr. Eliza Frost")).not.toContain("Frost");
    // first+surname is still available for a real reference
    expect(nameAppearsInProse("Mary Rose", "Mary Rose entered the parlour.")).toBe(true);
  });
});

describe("extractStoryFacts.victimUnnamed — RC4.4 both directions", () => {
  const cml = {
    CASE: {
      cast: [
        { name: "Lord Edmund Ashworth", role_archetype: "victim" },
        { name: "Inspector Gray", role_archetype: "detective" },
      ],
      culpability: { culprits: ["Hugo Vane"] },
    },
  };
  it("surname-only prose → victimUnnamed FALSE (the RC4.4 fix; was true)", () => {
    const facts = extractStoryFacts(cml, "The body of Ashworth lay in the conservatory.");
    expect(facts.victimUnnamed).toBe(false);
  });
  it("victim never named → victimUnnamed TRUE (genuine miss preserved)", () => {
    const facts = extractStoryFacts(cml, "A body lay in the conservatory; no one dared approach.");
    expect(facts.victimUnnamed).toBe(true);
  });
});

describe("verifyStructure.victimNamedInProse — RC4.4 both directions", () => {
  const cml = { CASE: { cast: [{ name: "Dr. Eliza Hawthorne", role_archetype: "victim" }], discriminating_test: {} } };
  it("surname-only prose → victimNamedInProse TRUE (vetoes the judge cap on a valid story)", () => {
    const v = verifyStructure({ cml, chapters: ["Hawthorne was discovered cold in the library."], victimName: "Dr. Eliza Hawthorne" });
    expect(v.victimNamedInProse).toBe(true);
  });
  it("victim never named → victimNamedInProse FALSE", () => {
    const v = verifyStructure({ cml, chapters: ["The library door stood ajar; the lamp still burned."], victimName: "Dr. Eliza Hawthorne" });
    expect(v.victimNamedInProse).toBe(false);
  });
});
