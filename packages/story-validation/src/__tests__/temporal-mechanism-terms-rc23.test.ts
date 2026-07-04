import { describe, expect, it } from "vitest";
import {
  analyzeTemporalConsistency,
  extractCaseMechanismTerms,
  buildSpringMechanicalRe,
} from "../temporal-consistency.js";

// A_61 RC2.3 — the mechanical-"spring" season exclusion is derived from the CASE's declared mechanism
// vocabulary, so a novel device (sundial/gnomon) is excluded by construction — no per-mechanism regex.

describe("extractCaseMechanismTerms — harvests mechanism vocab, never season words", () => {
  const cmlCase = {
    discriminating_test: { design: "a brass sundial gnomon with a spring-loaded blade" },
    hidden_model: { mechanism: { description: "the gnomon rig", delivery_path: [{ step: "the catch released" }] } },
    death_method: "stabbed",
  };
  it("includes case mechanism nouns", () => {
    const terms = extractCaseMechanismTerms(cmlCase);
    expect(terms).toEqual(expect.arrayContaining(["sundial", "gnomon", "brass", "blade", "catch", "stabbed"]));
  });
  it("excludes season words even when the mechanism text literally contains 'spring'", () => {
    expect(extractCaseMechanismTerms(cmlCase)).not.toContain("spring");
  });
  it("is null-safe → [] for a missing case", () => {
    expect(extractCaseMechanismTerms(undefined)).toEqual([]);
    expect(extractCaseMechanismTerms({})).toEqual([]);
  });
});

describe("analyzeTemporalConsistency — case-derived exclusion closes the novel-mechanism gap", () => {
  const text = "It was August. The gnomon spring was wound tight under the noon sun.";

  it("WITHOUT case terms the builtin fallback still false-flags 'spring' (proves the gap)", () => {
    const a = analyzeTemporalConsistency(text, "August", []);
    expect(a.conflictingSeasons).toContain("spring");
  });

  it("WITH the case's 'gnomon' term the collocation is excluded → no season conflict", () => {
    const a = analyzeTemporalConsistency(text, "August", ["gnomon"]);
    expect(a.conflictingSeasons).not.toContain("spring");
  });
});

describe("analyzeTemporalConsistency — genuine seasonal 'spring' still flags (both directions)", () => {
  it("a real vernal 'spring' is NOT suppressed by unrelated case terms", () => {
    const a = analyzeTemporalConsistency(
      "In August the beds were heavy with spring blossom and a vernal freshness.",
      "August",
      ["gnomon", "blade", "sundial"],
    );
    expect(a.conflictingSeasons).toContain("spring");
  });
});

describe("review fix — a harvested generic modifier must NOT strip a genuine seasonal 'spring'", () => {
  it("'cold' from death_method 'cold steel blade' does not suppress the August-vs-spring conflict", () => {
    const terms = extractCaseMechanismTerms({ death_method: "cold steel blade" });
    expect(terms).not.toContain("cold"); // generic modifier is no longer harvested
    const a = analyzeTemporalConsistency("It was August. The cold spring air bit at her cheeks.", "August", terms);
    expect(a.conflictingSeasons).toContain("spring");
  });
  it("'early' is not harvested either", () => {
    expect(extractCaseMechanismTerms({ discriminating_test: { design: "released in the early hours" } })).not.toContain("early");
  });
});

describe("buildSpringMechanicalRe([]) is the byte-identical fallback", () => {
  it("still strips a builtin mainspring collocation", () => {
    const re = buildSpringMechanicalRe([]);
    expect("the clock's mainspring had snapped".replace(re, " ")).not.toMatch(/spring/);
  });
});
