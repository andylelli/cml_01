import { afterEach, describe, expect, it, vi } from "vitest";
import { designCast, type CastInputs } from "../agent2-cast.js";

const FLAG = "AGENT2_CONSTRAINED_CAST";

afterEach(() => {
  delete process.env[FLAG];
  vi.restoreAllMocks();
});

const makeInputs = (): CastInputs => ({
  runId: "run-stop-bleeding",
  projectId: "proj-stop-bleeding",
  castSize: 5,
  setting: "1930s country house",
  crimeType: "murder",
  tone: "golden age",
  detectiveType: "amateur",
});

const ARCHETYPES = [
  "Amateur Sleuth / Civilian Investigator",
  "Primary suspect",
  "Financial suspect",
  "Romantic suspect",
  "Social rival",
  "Gatekeeper witness",
];

const makeCharacter = (name: string, roleArchetype: string) => ({
  name,
  ageRange: "40s",
  occupation: "resident",
  roleArchetype,
  publicPersona: "a composed, respectable professional",
  privateSecret: "is quietly ruined and hiding it",
  motiveSeed: "stands to lose the estate if the audit proceeds",
  motiveStrength: "moderate" as const,
  alibiWindow: "after dinner, in the library",
  accessPlausibility: "possible" as const,
  stakes: "reputation and inheritance",
  characterArcPotential: "faces the truth",
  gender: "non-binary" as const,
});

const chars = (n: number) =>
  Array.from({ length: n }, (_, i) => makeCharacter(`Person ${i + 1}`, ARCHETYPES[i % ARCHETYPES.length]));

const payload = (characters: ReturnType<typeof makeCharacter>[]) => {
  const nonDetective = characters.slice(1).map((c) => c.name);
  return {
    characters,
    relationships: { pairs: [] },
    diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: {
      possibleCulprits: nonDetective.slice(0, 3),
      redHerrings: nonDetective.slice(0, 1),
      victimCandidates: nonDetective.slice(0, 1),
      detectiveCandidates: [characters[0].name],
    },
  };
};

describe("Agent 2 — stop the bleeding (AGENT2_CONSTRAINED_CAST)", () => {
  it("DEFAULT (flag off): a count miss is still padded with Placeholder characters (legacy preserved)", async () => {
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(payload(chars(4))) });
    const result = await designCast({ chat } as any, makeInputs(), 1);
    expect(result.cast.characters).toHaveLength(5);
    expect(result.cast.characters.some((c) => /^Placeholder/i.test(c.name))).toBe(true);
  });

  it("flag on: a persistent count miss THROWS instead of injecting Placeholder characters", async () => {
    process.env[FLAG] = "on";
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(payload(chars(4))) });
    await expect(designCast({ chat } as any, makeInputs(), 1)).rejects.toThrow(/count mismatch/i);
  });

  it("flag on: a count miss is fixed by a structured-feedback retry (no placeholder, prompt carries the feedback)", async () => {
    process.env[FLAG] = "on";
    const chat = vi
      .fn()
      .mockResolvedValueOnce({ content: JSON.stringify(payload(chars(4))) }) // short
      .mockResolvedValueOnce({ content: JSON.stringify(payload(chars(5))) }); // corrected
    const result = await designCast({ chat } as any, makeInputs(), 3);

    expect(chat).toHaveBeenCalledTimes(2);
    expect(result.cast.characters).toHaveLength(5);
    expect(result.cast.characters.some((c) => /^Placeholder/i.test(c.name))).toBe(false);

    // the second attempt's user prompt must carry the targeted count feedback
    const secondUserMessage = chat.mock.calls[1][0].messages.find((m: any) => m.role === "user");
    expect(secondUserMessage.content).toContain("Return EXACTLY 5 characters");
  });

  it("flag on: persistent missing required fields THROW instead of canned default-fill", async () => {
    process.env[FLAG] = "on";
    const broken = payload(chars(5));
    delete (broken.characters[2] as Partial<ReturnType<typeof makeCharacter>>).stakes;
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(broken) });
    await expect(designCast({ chat } as any, makeInputs(), 1)).rejects.toThrow(/missing required fields/i);
  });

  it("flag on: a clean cast of the right size passes untouched", async () => {
    process.env[FLAG] = "on";
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(payload(chars(5))) });
    const result = await designCast({ chat } as any, makeInputs(), 1);
    expect(result.cast.characters).toHaveLength(5);
    expect(result.cast.characters.some((c) => /^Placeholder/i.test(c.name))).toBe(false);
  });
});

describe("Agent 2 — diversity retry replaces the diversifyRoleArchetypes relabel (constrained path)", () => {
  const allSameArchetype = () => {
    const c = chars(5).map((ch) => ({ ...ch, roleArchetype: "Suspect" }));
    return payload(c);
  };

  it("flag on: re-casts duplicates via targeted feedback, then succeeds (no canned relabel)", async () => {
    process.env[FLAG] = "on";
    const chat = vi
      .fn()
      .mockResolvedValueOnce({ content: JSON.stringify(allSameArchetype()) }) // 1 unique archetype
      .mockResolvedValueOnce({ content: JSON.stringify(payload(chars(5))) }); // 5 distinct
    const result = await designCast({ chat } as any, makeInputs(), 3);

    expect(chat).toHaveBeenCalledTimes(2);
    const secondUser = chat.mock.calls[1][0].messages.find((m: any) => m.role === "user");
    expect(secondUser.content).toMatch(/distinct archetype/i); // the checker's targeted feedback
    const archetypes = new Set(result.cast.characters.map((c) => c.roleArchetype.toLowerCase()));
    expect(archetypes.size).toBeGreaterThanOrEqual(4);
  });

  it("flag on: on exhaustion, ACCEPTS the low-diversity cast unchanged (no canned labels, no throw)", async () => {
    process.env[FLAG] = "on";
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(allSameArchetype()) });
    const result = await designCast({ chat } as any, makeInputs(), 1);
    // every archetype is still the model's "Suspect" — NOT relabeled to "Primary suspect" etc.
    expect(result.cast.characters.every((c) => c.roleArchetype === "Suspect")).toBe(true);
  });

  it("flag OFF: legacy diversifyRoleArchetypes relabel still runs on the final attempt", async () => {
    const chat = vi.fn().mockResolvedValue({ content: JSON.stringify(allSameArchetype()) });
    const result = await designCast({ chat } as any, makeInputs(), 1);
    const archetypes = new Set(result.cast.characters.map((c) => c.roleArchetype.toLowerCase()));
    expect(archetypes.size).toBeGreaterThanOrEqual(4); // canned labels were applied
    expect(result.cast.characters.some((c) => c.roleArchetype !== "Suspect")).toBe(true);
  });
});
