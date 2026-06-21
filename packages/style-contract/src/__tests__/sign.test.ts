import { describe, expect, it } from "vitest";
import { deriveStyleContract, validateStyleContract, assertStyleContract } from "../sign.js";
import type { StyleContract } from "../types.js";

describe("deriveStyleContract — premise-derived defaults (§4.1)", () => {
  it("reads a wry country-house premise into a wry-comic, gentle-humour, gore-forbidden contract", () => {
    const c = deriveStyleContract({
      premise: "A wry country-house comedy of manners, gentle humour, no gore.",
      comparables: ["Sayers", "Marsh"],
      decade: 1931,
    });
    expect(c.register).toBe("wry-comic");
    expect(c.humourTolerance).toBe(2);
    expect(c.narrativeDistance).toBe("close-third");
    expect(c.proseConstraints.diction).toBe("period-formal");
    expect(c.proseConstraints.forbiddenDevices).toContain("gore");
    expect(c.comparables).toEqual(["Sayers", "Marsh"]);
  });

  it("reads a cold psychological premise into a humourless, periodic contract", () => {
    const c = deriveStyleContract({
      premise: "A cold, Highsmith-flavoured psychological grind of dread and obsession. Grim, no levity.",
      comparables: ["Highsmith"],
      decade: 1955,
    });
    expect(c.register).toBe("psychological");
    expect(c.humourTolerance).toBe(0);
    expect(c.proseConstraints.sentenceRhythm).toBe("periodic");
  });

  it("a hardboiled premise gets clipped rhythm and zero humour", () => {
    const c = deriveStyleContract({ premise: "Hardboiled gumshoe on the mean streets." });
    expect(c.register).toBe("hardboiled");
    expect(c.proseConstraints.sentenceRhythm).toBe("clipped");
    expect(c.humourTolerance).toBe(0);
  });

  it("falls back to classical-fair-play when the premise gives no register signal", () => {
    expect(deriveStyleContract({ premise: "A murder in a manor." }).register).toBe("classical-fair-play");
  });
});

describe("deriveStyleContract — user choice wins over derivation (§4.1 'a choice, not a generation')", () => {
  it("an explicit register overrides the premise heuristic and is not listed as derived", () => {
    const c = deriveStyleContract({ premise: "Hardboiled mean streets.", register: "cozy" });
    expect(c.register).toBe("cozy");
    expect(c.derivedDefaults).not.toContain("register");
  });

  it("derivedDefaults records exactly the fields that fell back to derivation", () => {
    const c = deriveStyleContract({ register: "noir", humourTolerance: 1, premise: "x" });
    expect(c.derivedDefaults).not.toContain("register");
    expect(c.derivedDefaults).not.toContain("humourTolerance");
    expect(c.derivedDefaults).toContain("narrativeDistance");
    expect(c.derivedDefaults).toContain("diction");
  });

  it("user forbiddenDevices merge with the register-derived base (de-duped, sorted)", () => {
    const c = deriveStyleContract({ register: "noir", forbiddenDevices: ["head-hopping", "modern idiom"] });
    expect(c.proseConstraints.forbiddenDevices).toContain("head-hopping");
    expect(c.proseConstraints.forbiddenDevices).toContain("modern idiom");
    // sorted + unique
    expect(c.proseConstraints.forbiddenDevices).toEqual([...new Set(c.proseConstraints.forbiddenDevices)].sort());
  });
});

describe("deriveStyleContract — purity & schema validity", () => {
  it("is deterministic: the same spec yields a byte-identical contract", () => {
    const spec = { premise: "A wry country-house comedy.", comparables: ["Sayers"], decade: 1931 };
    expect(JSON.stringify(deriveStyleContract(spec))).toBe(JSON.stringify(deriveStyleContract(spec)));
  });

  it("every signed contract is schema-valid", () => {
    for (const premise of ["wry comedy of manners", "cold psychological dread", "a quiet village poisoning", ""]) {
      const c = deriveStyleContract({ premise, decade: 1931 });
      expect(validateStyleContract(c), premise).toBe(true);
      expect(() => assertStyleContract(c)).not.toThrow();
    }
  });
});

describe("Spike A — the schema is expressible & strict (§9.1)", () => {
  // Two distinct premises hand-authored end-to-end, proving the schema holds a real book's voice.
  const wrySayers: StyleContract = {
    register: "wry-comic",
    comparables: ["Sayers", "Marsh"],
    narrativeDistance: "close-third",
    humourTolerance: 2,
    proseConstraints: { sentenceRhythm: "varied", forbiddenDevices: ["gore", "modern idiom"], diction: "period-formal" },
    exemplars: [{ speaker: "Lady Probert", text: "\"One does not, as a rule, expect the vicar to be the difficulty.\"" }],
    derivedDefaults: [],
  };
  const coldHighsmith: StyleContract = {
    register: "psychological",
    comparables: ["Highsmith"],
    narrativeDistance: "close-third",
    humourTolerance: 0,
    proseConstraints: { sentenceRhythm: "periodic", forbiddenDevices: ["modern idiom"], diction: "plain" },
    exemplars: [],
  };

  it("accepts two distinct hand-authored contracts", () => {
    expect(validateStyleContract(wrySayers)).toBe(true);
    expect(validateStyleContract(coldHighsmith)).toBe(true);
  });

  it("rejects a bad register enum, a missing proseConstraints, and an unknown key", () => {
    expect(validateStyleContract({ ...wrySayers, register: "slapstick" })).toBe(false);
    const noConstraints: Record<string, unknown> = { ...wrySayers };
    delete noConstraints.proseConstraints;
    expect(validateStyleContract(noConstraints)).toBe(false);
    expect(validateStyleContract({ ...wrySayers, surprise: true })).toBe(false);
  });

  it("rejects an out-of-range humourTolerance and a 5th exemplar", () => {
    expect(validateStyleContract({ ...wrySayers, humourTolerance: 4 })).toBe(false);
    expect(validateStyleContract({ ...wrySayers, exemplars: Array(5).fill({ text: "x" }) })).toBe(false);
  });
});
