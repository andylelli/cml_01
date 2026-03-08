import { describe, expect, it } from "vitest";
import { validateArtifact } from "@cml/cml";

describe("cast_design contract drift guardrails", () => {
  const basePayload = {
    characters: [
      {
        name: "Avery Flint",
        ageRange: "35-45",
        occupation: "Solicitor",
        roleArchetype: "gatekeeper",
        publicPersona: "Measured and formal in public settings.",
        privateSecret: "Embezzled funds from a dormant trust account.",
        motiveSeed: "Victim threatened to expose the theft.",
        motiveStrength: "strong",
        alibiWindow: "Claims to be in the conservatory from 8:30-9:00 PM.",
        accessPlausibility: "possible",
        stakes: "Disbarment and imprisonment.",
        characterArcPotential: "Facade collapses under pressure.",
      },
    ],
    relationships: {
      pairs: [
        {
          character1: "Avery Flint",
          character2: "Nora Vale",
          relationship: "Former confidants",
          tension: "high",
          sharedHistory: "Fell out over contested inheritance papers.",
        },
      ],
    },
    diversity: {
      stereotypeCheck: ["No reductive tropes."],
      recommendations: ["Diversify professional backgrounds."],
    },
  };

  it("accepts current runtime crimeDynamics keys and latencyMs", () => {
    const payload = {
      ...basePayload,
      crimeDynamics: {
        possibleCulprits: ["Avery Flint"],
        redHerrings: ["Nora Vale"],
        victimCandidates: ["Jonas Pike"],
        detectiveCandidates: ["Inspector Hale"],
      },
      cost: 0.42,
      latencyMs: 311,
    };

    const result = validateArtifact("cast_design", payload);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects legacy renamed fields to catch schema drift", () => {
    const payload = {
      ...basePayload,
      crimeDynamics: {
        suspectPool: ["Avery Flint"],
        culpritViability: ["Avery Flint"],
      },
      cost: 0.42,
      durationMs: 311,
    } as any;

    const result = validateArtifact("cast_design", payload);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "crimeDynamics.possibleCulprits is required",
        "crimeDynamics.redHerrings is required",
        "crimeDynamics.victimCandidates is required",
        "crimeDynamics.detectiveCandidates is required",
        "latencyMs is required",
      ])
    );
  });
});
