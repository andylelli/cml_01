import { describe, expect, it } from "vitest";
import { adaptCastForScoring } from "../jobs/scoring-adapters/index.js";

describe("adaptCastForScoring null-safe mapping", () => {
  it("does not throw when crimeDynamics and relationships arrays are missing", () => {
    const castDesign = {
      characters: [
        {
          name: "Aled Price",
          ageRange: "30-39",
          roleArchetype: "Local solicitor",
          publicPersona: "Reserved and exact",
          privateSecret: "Heavy gambling debts",
          motiveSeed: "Victim held his promissory notes",
          motiveStrength: "high",
          alibiWindow: "8:00-8:30",
          accessPlausibility: "High",
          stakes: "Professional ruin",
        },
      ],
      crimeDynamics: {},
      relationships: {},
    } as any;

    expect(() => adaptCastForScoring(castDesign)).not.toThrow();

    const adapted = adaptCastForScoring(castDesign);
    expect(adapted.cast).toHaveLength(1);
    expect(adapted.cast[0].culprit_eligibility).toBe("ineligible");
    expect(adapted.cast[0].relationships).toEqual([]);
  });
});
