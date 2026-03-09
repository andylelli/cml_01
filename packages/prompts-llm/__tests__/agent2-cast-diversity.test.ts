import { describe, expect, it, vi } from "vitest";
import { designCast, type CastInputs } from "../src/agent2-cast.js";

const makeInputs = (): CastInputs => ({
  runId: "run-cast-diversity",
  projectId: "proj-cast-diversity",
  castSize: 5,
  setting: "1940s country house",
  crimeType: "murder",
  tone: "classic",
  detectiveType: "amateur",
});

const makeCharacter = (name: string, roleArchetype: string) => ({
  name,
  ageRange: "40s",
  occupation: "resident",
  roleArchetype,
  publicPersona: "polite",
  privateSecret: "hidden debt",
  motiveSeed: "inheritance",
  motiveStrength: "moderate" as const,
  alibiWindow: "after dinner",
  accessPlausibility: "possible" as const,
  stakes: "reputation",
  characterArcPotential: "faces the truth",
  gender: "non-binary" as const,
});

const makeLowDiversityPayload = () => ({
  characters: [
    makeCharacter("Ada Blythe", "Amateur Sleuth / Civilian Investigator"),
    makeCharacter("Bruno Cade", "Suspect"),
    makeCharacter("Clara Dune", "Suspect"),
    makeCharacter("Dylan Eames", "Suspect"),
    makeCharacter("Etta Firth", "Suspect"),
  ],
  relationships: { pairs: [] },
  diversity: { stereotypeCheck: [], recommendations: [] },
  crimeDynamics: {
    possibleCulprits: ["Bruno Cade", "Clara Dune", "Dylan Eames"],
    redHerrings: ["Etta Firth"],
    victimCandidates: ["Etta Firth"],
    detectiveCandidates: ["Ada Blythe"],
  },
});

describe("Agent 2 cast diversity hardening", () => {
  it("retries when archetype diversity is below threshold before final attempt", async () => {
    const low = makeLowDiversityPayload();
    const high = {
      ...low,
      characters: [
        makeCharacter("Ada Blythe", "Amateur Sleuth / Civilian Investigator"),
        makeCharacter("Bruno Cade", "Primary suspect"),
        makeCharacter("Clara Dune", "Financial suspect"),
        makeCharacter("Dylan Eames", "Romantic suspect"),
        makeCharacter("Etta Firth", "Gatekeeper witness"),
      ],
    };

    const chat = vi
      .fn()
      .mockResolvedValueOnce({ content: JSON.stringify(low) })
      .mockResolvedValueOnce({ content: JSON.stringify(high) });

    const client = { chat } as any;
    const result = await designCast(client, makeInputs(), 3);

    expect(chat).toHaveBeenCalledTimes(2);
    expect(result.attempt).toBe(2);
  });

  it("applies deterministic fallback on final attempt to meet diversity target", async () => {
    const low = makeLowDiversityPayload();
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(low) });
    const client = { chat } as any;

    const result = await designCast(client, makeInputs(), 1);
    const uniqueArchetypes = new Set(result.cast.characters.map((c) => c.roleArchetype.toLowerCase()));

    expect(chat).toHaveBeenCalledTimes(1);
    expect(uniqueArchetypes.size).toBeGreaterThanOrEqual(4);
  });

  it("fails final attempt when fallback cannot recover diversity", async () => {
    const unrecoverable = {
      ...makeLowDiversityPayload(),
      characters: [
        makeCharacter("Ada Blythe", "Detective"),
        makeCharacter("Bruno Cade", "Detective"),
        makeCharacter("Clara Dune", "Detective"),
        makeCharacter("Dylan Eames", "Detective"),
        makeCharacter("Etta Firth", "Detective"),
      ],
    };

    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(unrecoverable) });
    const client = { chat } as any;

    await expect(designCast(client, makeInputs(), 1)).rejects.toThrow(
      /role diversity guardrail failed after fallback/i,
    );
    expect(chat).toHaveBeenCalledTimes(1);
  });
});
