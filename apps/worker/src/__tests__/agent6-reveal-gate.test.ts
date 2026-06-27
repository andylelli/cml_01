/**
 * P2.1 (ANALYSIS_50) unit tests for the Agent 6 reveal gate:
 *  - T2.1 fooled-then-convinced verdict (early+mid reader naming the culprit = too obvious)
 *  - T2.2 red herring pointing at the real culprit
 *  - T2.3 manner-of-death deducibility from an essential early|mid clue
 *  - flag-mode parsing (off/shadow/enforce), default OFF
 */
import { describe, expect, it } from "vitest";
import {
  parseRevealGateMode,
  namesMatch,
  auditRedHerringTargets,
  resolveDeathMethodString,
  deathMethodTokens,
  auditDeathMethodDeducibility,
  evaluateRevealVerdict,
} from "../jobs/agents/agent6-reveal-gate.js";

const cml = (CASE: any) => ({ CASE }) as any;

describe("parseRevealGateMode", () => {
  it("defaults to off for unset/empty/off/false/0", () => {
    expect(parseRevealGateMode(undefined)).toBe("off");
    expect(parseRevealGateMode("")).toBe("off");
    expect(parseRevealGateMode("off")).toBe("off");
    expect(parseRevealGateMode("FALSE")).toBe("off");
    expect(parseRevealGateMode("0")).toBe("off");
  });
  it("maps enforce and any other truthy value", () => {
    expect(parseRevealGateMode("enforce")).toBe("enforce");
    expect(parseRevealGateMode("ENFORCE")).toBe("enforce");
    expect(parseRevealGateMode("shadow")).toBe("shadow");
    expect(parseRevealGateMode("on")).toBe("shadow");
    expect(parseRevealGateMode("anything")).toBe("shadow");
  });
});

describe("namesMatch", () => {
  it("matches on exact name or shared surname, ignoring case/whitespace", () => {
    expect(namesMatch("Dr. Alan Carter", "Carter")).toBe(true);
    expect(namesMatch("carter", "Dr. Alan Carter ")).toBe(true);
    expect(namesMatch("Mrs. Carter", "Carter")).toBe(true);
    expect(namesMatch("Alan Carter", "Beatrice Vane")).toBe(false);
    expect(namesMatch("", "Carter")).toBe(false);
  });
  it("does NOT false-positive on substring name collisions", () => {
    // The old substring logic returned true for these ("Joanna".includes("Ann")).
    expect(namesMatch("Ann", "Joanna")).toBe(false);
    expect(namesMatch("Bell", "Annabelle")).toBe(false);
    expect(namesMatch("Al", "Alice")).toBe(false);
  });
});

describe("auditRedHerringTargets (T2.2)", () => {
  it("flags a herring whose points_at_suspect is the culprit", () => {
    const res = auditRedHerringTargets(
      cml({
        culpability: { culprits: ["Dr. Alan Carter"] },
        red_herrings: [
          { id: "rh_1", points_at_suspect: "Beatrice Vane" },
          { id: "rh_2", points_at_suspect: "Carter" },
        ],
      }),
    );
    expect(res.ok).toBe(false);
    expect(res.offenders.map((o) => o.id)).toEqual(["rh_2"]);
  });
  it("passes when no herring points at the culprit", () => {
    const res = auditRedHerringTargets(
      cml({
        culpability: { culprits: ["Carter"] },
        red_herrings: [{ id: "rh_1", points_at_suspect: "Vane" }],
      }),
    );
    expect(res.ok).toBe(true);
    expect(res.offenders).toHaveLength(0);
  });
  it("ignores herrings without a points_at_suspect and missing fields", () => {
    expect(auditRedHerringTargets(cml({ culpability: { culprits: ["Carter"] }, red_herrings: [{ id: "rh_1" }] })).ok).toBe(true);
    expect(auditRedHerringTargets(cml({})).ok).toBe(true);
    expect(auditRedHerringTargets(undefined).ok).toBe(true);
  });
});

describe("death method resolution + tokens (T2.3)", () => {
  it("prefers CASE.death_method, then crime_class.subtype, then category", () => {
    expect(resolveDeathMethodString(cml({ death_method: "poisoning" }))).toBe("poisoning");
    expect(resolveDeathMethodString(cml({ meta: { crime_class: { subtype: "stabbing", category: "violent" } } }))).toBe("stabbing");
    expect(resolveDeathMethodString(cml({ meta: { crime_class: { category: "violent" } } }))).toBe("violent");
  });
  it("expands to curated synonym stems (not blind prefixes)", () => {
    expect(deathMethodTokens("blunt force trauma")).toEqual(["bludgeon", "blunt", "blow"]);
    expect(deathMethodTokens("death by poisoning")).toEqual(["poison", "arsenic", "cyanide", "toxin"]);
    expect(deathMethodTokens("stabbing")).toEqual(["stab", "blade", "knife", "dagger"]);
    expect(deathMethodTokens("")).toEqual([]);
  });
});

describe("auditDeathMethodDeducibility (T2.3)", () => {
  const cmlPoison = cml({ death_method: "poisoning" });
  it("passes when an essential early clue surfaces the method", () => {
    const res = auditDeathMethodDeducibility(cmlPoison, {
      clues: [{ placement: "early", criticality: "essential", description: "A vial of poison was found." }],
    });
    expect(res.ok).toBe(true);
  });
  it("passes via a synonym (stabbing deduced from a knife)", () => {
    const res = auditDeathMethodDeducibility(cml({ death_method: "stabbing" }), {
      clues: [{ placement: "mid", criticality: "essential", description: "a bloody knife on the floor" }],
    });
    expect(res.ok).toBe(true);
  });
  it("does not false-positive on unrelated words (gunshot vs 'the guns were locked away')", () => {
    const res = auditDeathMethodDeducibility(cml({ death_method: "gunshot" }), {
      clues: [{ placement: "early", criticality: "essential", description: "the guns were locked away in the cabinet" }],
    });
    expect(res.ok).toBe(false); // "guns" must NOT satisfy the gunshot death method
  });
  it("fails when only late/supporting clues mention it", () => {
    const res = auditDeathMethodDeducibility(cmlPoison, {
      clues: [
        { placement: "late", criticality: "essential", description: "The poison bottle." },
        { placement: "early", criticality: "supporting", description: "She was poisoned." },
        { placement: "mid", criticality: "essential", description: "An unrelated footprint." },
      ],
    });
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/poison/);
  });
  it("returns ok when there is no resolvable death method", () => {
    expect(auditDeathMethodDeducibility(cml({}), { clues: [] }).ok).toBe(true);
  });
});

describe("evaluateRevealVerdict (T2.1)", () => {
  it("fails as too_obvious when the early+mid reader names the culprit", () => {
    const v = evaluateRevealVerdict({ earlyMidGuess: "Dr. Carter", culprit: "Carter" });
    expect(v.verdict).toBe("too_obvious");
    expect(v.reasons[0]).toMatch(/too obvious/);
  });
  it("passes when the early+mid reader is fooled (names someone else)", () => {
    const v = evaluateRevealVerdict({ earlyMidGuess: "Vane", culprit: "Carter" });
    expect(v.verdict).toBe("pass");
  });
  it("passes but notes when misled away from the intended false solution", () => {
    const v = evaluateRevealVerdict({ earlyMidGuess: "Hartley", culprit: "Carter", falseSolutionSuspect: "Vane" });
    expect(v.verdict).toBe("pass");
    expect(v.reasons.join(" ")).toMatch(/intended\s+false solution/);
  });
});
