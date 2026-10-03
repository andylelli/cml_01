import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildProfilesPrompt, castMemberForProfile, generateCharacterProfiles } from "../agent2b-character-profiles.js";
import { designCast, type CastInputs } from "../agent2-cast.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => {
  saved = process.env[FLAG];
  delete process.env[FLAG];
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
  vi.restoreAllMocks();
});

// ── A1X-D11 — Agent 2b pairs profile i with cast member i ────────────────────────────────────────────────
const profileInputs = {
  caseData: { CASE: { meta: { title: "The Glasshouse Affair" } } },
  cast: { characters: [{ name: "Eleanor Voss", occupation: "secretary" }, { name: "Captain Ivor Hale", occupation: "soldier" }] },
  tone: "Classic",
} as any;

describe("A1X-D11 — Agent 2b pairs a profile with its cast member by name", () => {
  const errors = ["profiles[0].paragraphs: required"];
  const previous = [{ name: "Captain Ivor Hale" }, { name: "Eleanor Voss" }];
  const promptText = () => JSON.stringify(buildProfilesPrompt(profileInputs, errors, previous).messages);

  it("flag OFF: index pairing — the error names cast[0] whatever profile[0] was", () => {
    expect(castMemberForProfile(profileInputs, { name: "Captain Ivor Hale" }, 0)?.name).toBe("Eleanor Voss");
    expect(promptText()).toContain('The profile for \\"Eleanor Voss\\" is missing or incomplete');
  });

  it("flag ON: name pairing (case-insensitive), index only when no name matches", () => {
    process.env[FLAG] = "1";
    expect(castMemberForProfile(profileInputs, { name: "captain ivor hale" }, 0)?.name).toBe("Captain Ivor Hale");
    expect(castMemberForProfile(profileInputs, { name: "Nobody" }, 1)?.name).toBe("Captain Ivor Hale");
    expect(castMemberForProfile(profileInputs, undefined, 0)?.name).toBe("Eleanor Voss");
    expect(promptText()).toContain('The profile for \\"Captain Ivor Hale\\" is missing or incomplete');
  });

  it("flag OFF: the prompt with no previous profiles is unchanged by the new parameter", () => {
    const a = JSON.stringify(buildProfilesPrompt(profileInputs, errors).messages);
    const b = JSON.stringify(buildProfilesPrompt(profileInputs, errors, previous).messages);
    expect(b).toBe(a);
  });

  it("repair: the single-profile repair prompt carries the profile's own character", async () => {
    // Profile 0 is Hale (no paragraphs), profile 1 is Voss: the model swapped the order.
    const reply = JSON.stringify({
      status: "draft",
      tone: "Classic",
      targetWordCount: 1000,
      profiles: [
        { name: "Captain Ivor Hale", summary: "s", publicPersona: "p", privateSecret: "x", motiveSeed: "m", motiveStrength: "moderate", alibiWindow: "a", accessPlausibility: "possible", stakes: "s", humourStyle: "none", humourLevel: 0, speechMannerisms: "s", paragraphs: [] },
        { name: "Eleanor Voss", summary: "s", publicPersona: "p", privateSecret: "x", motiveSeed: "m", motiveStrength: "moderate", alibiWindow: "a", accessPlausibility: "possible", stakes: "s", humourStyle: "none", humourLevel: 0, speechMannerisms: "s", paragraphs: ["one", "two", "three", "four"] },
      ],
    });
    const run = async () => {
      const repairPrompts: string[] = [];
      const client = {
        chat: vi.fn(async (req: any) => {
          if (req.logContext?.agent === "Agent2b-ProfileRepair") {
            repairPrompts.push(String(req.messages[1].content));
            return { content: JSON.stringify({ paragraphs: ["a", "b", "c", "d"] }) };
          }
          return { content: reply };
        }),
        getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
      };
      await generateCharacterProfiles(client as any, profileInputs, 1);
      return repairPrompts;
    };
    const off = await run();
    expect(off).toHaveLength(1);
    expect(off[0]).toContain('"name": "Eleanor Voss"');
    process.env[FLAG] = "1";
    const on = await run();
    expect(on).toHaveLength(1);
    expect(on[0]).toContain('"name": "Captain Ivor Hale"');
  });
});

// ── A1X-Q07 — legacy-mode blind re-roll for deterministically-fixable misses ──────────────────────────────
const castInputs = (): CastInputs => ({
  runId: "run-q07", projectId: "proj-q07", castSize: 5, setting: "1930s country house",
  characterNames: ["Agnes Pryor", "Basil Wyke", "Cecily Marlow", "Duncan Ferrers", "Hester Lowe"],
  crimeType: "murder", tone: "golden age", detectiveType: "amateur",
});
const ARCHETYPES = ["Amateur Sleuth", "Primary suspect", "Financial suspect", "Romantic suspect", "Social rival"];
const castReply = (opts: { culprits?: number; archetype?: string } = {}) => {
  const characters = Array.from({ length: 5 }, (_, k) => ({
    name: `Person ${k + 1}`, ageRange: "40s", occupation: "resident",
    roleArchetype: opts.archetype ?? ARCHETYPES[k], publicPersona: "composed", privateSecret: "ruined",
    motiveSeed: "the estate", motiveStrength: "moderate", alibiWindow: "after dinner", accessPlausibility: "possible",
    stakes: "reputation", characterArcPotential: "faces the truth", gender: k % 2 ? "female" : "male",
  }));
  const others = characters.slice(1).map((c) => c.name);
  return JSON.stringify({
    characters,
    relationships: { pairs: [] },
    diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: { possibleCulprits: others.slice(0, opts.culprits ?? 3), redHerrings: others.slice(0, 1), victimCandidates: others.slice(-1), detectiveCandidates: ["Person 1"] },
  });
};
async function runCast(responses: string[]) {
  let i = 0;
  const client = {
    chat: vi.fn(async () => ({ content: responses[Math.min(i++, responses.length - 1)] })),
    getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent2-CastDesigner": 0.01 } }) }),
  };
  const r = await designCast(client as any, castInputs(), 3);
  return { calls: client.chat.mock.calls.length, cast: r.cast };
}

describe("A1X-Q07 — legacy mode repairs fixable misses without a blind re-roll", () => {
  it("flag OFF: a short possibleCulprits list re-rolls", async () => {
    const { calls } = await runCast([castReply({ culprits: 1 }), castReply()]);
    expect(calls).toBe(2);
  });

  it("flag ON: a short possibleCulprits list is topped up on the first attempt", async () => {
    process.env[FLAG] = "1";
    const { calls, cast } = await runCast([castReply({ culprits: 1 }), castReply()]);
    expect(calls).toBe(1);
    expect(cast.crimeDynamics.possibleCulprits.length).toBeGreaterThanOrEqual(3);
    expect(cast.crimeDynamics.possibleCulprits).not.toContain("Person 1");
  });

  it("flag OFF: low archetype diversity re-rolls to the final attempt", async () => {
    const { calls } = await runCast(Array(3).fill(castReply({ archetype: "Suspect" })));
    expect(calls).toBe(3);
  });

  it("flag ON: low archetype diversity is diversified on the first attempt", async () => {
    process.env[FLAG] = "1";
    const { calls, cast } = await runCast(Array(3).fill(castReply({ archetype: "Suspect" })));
    expect(calls).toBe(1);
    expect(new Set(cast.characters.map((c: any) => c.roleArchetype)).size).toBeGreaterThan(1);
  });

  it("flag ON: constrained mode keeps its feedback retries", async () => {
    process.env[FLAG] = "1";
    process.env.AGENT2_CONSTRAINED_CAST = "on";
    try {
      const { calls } = await runCast([castReply({ culprits: 1 }), castReply()]);
      expect(calls).toBe(2);
    } finally {
      delete process.env.AGENT2_CONSTRAINED_CAST;
    }
  });
});
