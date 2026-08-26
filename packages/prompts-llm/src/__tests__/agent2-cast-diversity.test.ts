import { describe, expect, it, vi } from "vitest";
import { designCast, type CastInputs } from "../agent2-cast.js";

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
  // A_73 §40 — the cast is binary by design (1930s-1950s Golden Age). This fixture is about role
  // and trait DIVERSITY, which is unaffected by the gender value; "female" keeps it type-valid.
  gender: "female" as const,
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

  // A_53 P2 (repair-not-abort): a low-diversity cast is a warn-level quality miss, not a run-killer —
  // the final attempt accepts the best-effort deterministic diversification instead of throwing.
  it("accepts best-effort on final attempt when fallback cannot recover diversity (no abort)", async () => {
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

    const result = await designCast(client, makeInputs(), 1);
    expect(result.cast.characters).toHaveLength(5);
    expect(chat).toHaveBeenCalledTimes(1);
  });
});
