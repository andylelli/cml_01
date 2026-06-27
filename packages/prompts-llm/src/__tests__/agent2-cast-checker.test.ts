import { describe, expect, it } from "vitest";
import { checkCast, summarizeCastCheck } from "../agent2-cast-checker.js";
import type { CastDesign, CharacterProfile } from "../agent2-cast.js";

function makeChar(overrides: Partial<CharacterProfile> & { name: string }): CharacterProfile {
  return {
    name: overrides.name,
    ageRange: overrides.ageRange ?? "40s",
    occupation: overrides.occupation ?? "solicitor",
    roleArchetype: overrides.roleArchetype ?? "suspect",
    publicPersona: overrides.publicPersona ?? "a composed, respectable professional",
    privateSecret: overrides.privateSecret ?? "embezzled from the estate trust years ago",
    motiveSeed: overrides.motiveSeed ?? "stands to lose everything if the audit proceeds",
    motiveStrength: overrides.motiveStrength ?? "strong",
    alibiWindow: overrides.alibiWindow ?? "in the library from 9 to 10",
    accessPlausibility: overrides.accessPlausibility ?? "possible",
    stakes: overrides.stakes ?? "ruin and disgrace",
    characterArcPotential: overrides.characterArcPotential ?? "cracks under pressure",
    gender: overrides.gender ?? "male",
    ...(overrides.role ? { role: overrides.role } : {}),
  };
}

function pair(c1: string, c2: string, tension: "none" | "low" | "moderate" | "high" = "moderate") {
  return { character1: c1, character2: c2, relationship: `${c1} and ${c2} feud`, tension, sharedHistory: `${c1} wronged ${c2}` };
}

/** A clean 4-person cast: distinct archetypes, all gendered, connected ring with a high-tension edge. */
function cleanCast(): CastDesign {
  return {
    characters: [
      makeChar({ name: "Edmund Crale", roleArchetype: "estate solicitor", gender: "male" }),
      makeChar({ name: "Vivienne Ashe", roleArchetype: "widowed heiress", gender: "female", occupation: "landowner" }),
      makeChar({ name: "Gideon Pryce", roleArchetype: "amateur sleuth", gender: "male", occupation: "physician" }),
      makeChar({ name: "Maud Sefton", roleArchetype: "household companion", gender: "female", occupation: "companion" }),
    ],
    relationships: {
      pairs: [
        pair("Edmund Crale", "Vivienne Ashe", "high"),
        pair("Vivienne Ashe", "Gideon Pryce", "low"),
        pair("Gideon Pryce", "Maud Sefton", "moderate"),
        pair("Maud Sefton", "Edmund Crale", "low"),
      ],
    },
    diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: { possibleCulprits: [], redHerrings: [], victimCandidates: [], detectiveCandidates: [] },
  };
}

describe("checkCast — clean cast passes", () => {
  it("a well-formed cast has no errors and healthy metrics", () => {
    const r = checkCast(cleanCast(), { expectedCount: 4 });
    expect(r.ok).toBe(true);
    expect(r.issues.filter((i) => i.severity === "error")).toEqual([]);
    expect(r.metrics.archetypeUniqueRatio).toBe(1);
    expect(r.metrics.genderCompleteness).toBe(1);
    expect(r.metrics.graph.isolatedNodes).toEqual([]);
    expect(r.metrics.graph.highTensionEdges).toBe(1);
    expect(r.metrics.graph.danglingNames).toEqual([]);
    expect(summarizeCastCheck(r)).toContain("ok=true");
  });
});

describe("checkCast — error-severity issues", () => {
  it("flags placeholder characters (the load-bearing §6 invariant)", () => {
    const cast = cleanCast();
    cast.characters[2] = makeChar({ name: "Placeholder 3" });
    const r = checkCast(cast, { expectedCount: 4 });
    expect(r.ok).toBe(false);
    expect(r.metrics.placeholderCount).toBe(1);
    expect(r.issues.some((i) => i.code === "placeholder_character")).toBe(true);
    expect(r.feedback[0]).toMatch(/placeholder/i);
  });

  it("flags a missing/illegal gender", () => {
    const cast = cleanCast();
    delete (cast.characters[1] as Partial<CharacterProfile>).gender;
    const r = checkCast(cast);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "missing_gender" && i.character === "Vivienne Ashe")).toBe(true);
    expect(r.metrics.genderCompleteness).toBeLessThan(1);
  });

  it("flags an illegal enum (the near-miss that coercion would silently mask)", () => {
    const cast = cleanCast();
    (cast.characters[0] as unknown as Record<string, unknown>).motiveStrength = "overwhelming";
    const r = checkCast(cast);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "illegal_motive_strength")).toBe(true);
    expect(r.metrics.illegalEnumCount).toBe(1);
  });

  it("flags a count mismatch when expectedCount is given", () => {
    const cast = cleanCast();
    cast.characters.pop();
    const r = checkCast(cast, { expectedCount: 4 });
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "count_mismatch")).toBe(true);
  });
});

describe("checkCast — warn-severity quality signals (feed the single retry, never kill the run)", () => {
  it("flags duplicate archetypes with a targeted re-cast instruction", () => {
    const cast = cleanCast();
    cast.characters[1] = makeChar({ name: "Vivienne Ashe", roleArchetype: "estate solicitor", gender: "female" });
    const r = checkCast(cast);
    expect(r.ok).toBe(true); // warn, not error — does not kill the run
    const dup = r.issues.find((i) => i.code === "duplicate_archetype");
    expect(dup).toBeDefined();
    expect(dup!.feedback).toContain("Vivienne Ashe");
    expect(dup!.feedback).toContain("Edmund Crale");
    expect(r.metrics.archetypeUniqueRatio).toBeLessThan(1); // a duplicate exists
  });

  it("fires the aggregate low-diversity signal only when below the 70% bar", () => {
    const cast = cleanCast();
    // 3 of 4 share one archetype -> 2 unique / 4 = 0.5 < 0.7
    cast.characters[1] = makeChar({ name: "Vivienne Ashe", roleArchetype: "estate solicitor", gender: "female" });
    cast.characters[3] = makeChar({ name: "Maud Sefton", roleArchetype: "estate solicitor", gender: "female" });
    const r = checkCast(cast);
    expect(r.metrics.archetypeUniqueRatio).toBeLessThan(0.7);
    expect(r.issues.some((i) => i.code === "low_archetype_diversity")).toBe(true);
  });

  it("flags an isolated node", () => {
    const cast = cleanCast();
    cast.relationships.pairs = [pair("Edmund Crale", "Vivienne Ashe", "high")];
    const r = checkCast(cast);
    expect(r.metrics.graph.isolatedNodes.sort()).toEqual(["Gideon Pryce", "Maud Sefton"]);
    expect(r.issues.filter((i) => i.code === "isolated_node")).toHaveLength(2);
  });

  it("flags edges that reference a non-cast name", () => {
    const cast = cleanCast();
    cast.relationships.pairs.push(pair("Edmund Crale", "A Ghost", "low"));
    const r = checkCast(cast);
    expect(r.metrics.graph.danglingNames).toContain("A Ghost");
    expect(r.issues.some((i) => i.code === "edge_references_noncast_name")).toBe(true);
  });

  it("flags a cast with no high-tension edge", () => {
    const cast = cleanCast();
    cast.relationships.pairs = cast.relationships.pairs.map((p) => ({ ...p, tension: "low" as const }));
    const r = checkCast(cast);
    expect(r.metrics.graph.highTensionEdges).toBe(0);
    expect(r.issues.some((i) => i.code === "no_high_tension_edge")).toBe(true);
  });

  it("flags a thinly drawn character (deterministic replacement for the stereotype hard-gate)", () => {
    const cast = cleanCast();
    cast.characters[3] = makeChar({ name: "Maud Sefton", publicPersona: "quiet", privateSecret: "a secret", roleArchetype: "companion" });
    const r = checkCast(cast);
    expect(r.ok).toBe(true);
    expect(r.issues.some((i) => i.code === "thinly_drawn_character" && i.character === "Maud Sefton")).toBe(true);
  });
});

describe("checkCast — robustness & ordering", () => {
  it("never throws on malformed input", () => {
    expect(() => checkCast({} as unknown as CastDesign)).not.toThrow();
    expect(() => checkCast({ characters: null } as unknown as CastDesign)).not.toThrow();
  });

  it("orders feedback errors-first and de-duplicates", () => {
    const cast = cleanCast();
    cast.characters[0] = makeChar({ name: "Placeholder 1" });
    cast.relationships.pairs = cast.relationships.pairs.map((p) => ({ ...p, tension: "low" as const }));
    const r = checkCast(cast, { expectedCount: 4 });
    const firstErrorIdx = r.issues.findIndex((i) => i.severity === "error");
    expect(firstErrorIdx).toBeGreaterThanOrEqual(0);
    // feedback is unique
    expect(new Set(r.feedback).size).toBe(r.feedback.length);
  });

  it("reads the redesign's edges[] shape as well as the legacy pairs[] shape", () => {
    const cast = cleanCast();
    // swap to edges shape
    (cast as unknown as Record<string, unknown>).relationships = {
      edges: [
        { a: "Edmund Crale", b: "Vivienne Ashe", tension: "high" },
        { a: "Gideon Pryce", b: "Maud Sefton", tension: "moderate" },
      ],
    };
    const r = checkCast(cast);
    expect(r.metrics.graph.edges).toBe(2);
    expect(r.metrics.graph.highTensionEdges).toBe(1);
    expect(r.metrics.graph.isolatedNodes).toEqual([]);
  });
});

describe("checkCast — K1 victim invariant (warn-severity, never errors)", () => {
  /** A 5-person cast with a first-class, distinct, tied victim. */
  function castWithVictim(): CastDesign {
    return {
      characters: [
        makeChar({ name: "Eleanor Voss", roleArchetype: "amateur sleuth", gender: "female" }),
        makeChar({ name: "Mallory Finch", roleArchetype: "estate physician", gender: "female" }),
        makeChar({ name: "Ivor Hale", roleArchetype: "retired captain", gender: "male" }),
        makeChar({ name: "Beatrice Quill", roleArchetype: "household companion", gender: "female" }),
        makeChar({
          name: "Sylvia Trent",
          roleArchetype: "victim",
          gender: "female",
          publicPersona: "the imperious matriarch who controlled the estate purse",
          privateSecret: "had just rewritten her will to disinherit the family",
        }),
      ],
      relationships: {
        pairs: [
          pair("Sylvia Trent", "Mallory Finch", "high"),
          pair("Mallory Finch", "Ivor Hale", "low"),
          pair("Ivor Hale", "Beatrice Quill", "moderate"),
          pair("Beatrice Quill", "Eleanor Voss", "low"),
        ],
      },
      diversity: { stereotypeCheck: [], recommendations: [] },
      crimeDynamics: {
        possibleCulprits: ["Mallory Finch", "Ivor Hale", "Beatrice Quill"],
        redHerrings: [],
        victimCandidates: ["Sylvia Trent"],
        detectiveCandidates: ["Eleanor Voss"],
      },
    };
  }

  it("a distinct, profiled, tied victim raises no victim warnings", () => {
    const r = checkCast(castWithVictim(), { expectedCount: 5 });
    expect(r.metrics.victimName).toBe("Sylvia Trent");
    expect(r.metrics.victimDistinct).toBe(true);
    expect(r.metrics.victimTiedToSuspect).toBe(true);
    expect(r.issues.some((i) => i.code.startsWith("victim_") || i.code === "missing_victim")).toBe(false);
    expect(summarizeCastCheck(r)).toContain("victim=Sylvia Trent");
  });

  it("flags a missing victim (warn, not error)", () => {
    const cast = castWithVictim();
    cast.characters[4].roleArchetype = "houseguest";
    cast.crimeDynamics.victimCandidates = [];
    const r = checkCast(cast, { expectedCount: 5 });
    expect(r.ok).toBe(true); // warn-severity: never aborts
    expect(r.metrics.victimName).toBeNull();
    expect(r.issues.some((i) => i.code === "missing_victim" && i.severity === "warn")).toBe(true);
  });

  it("flags a victim who is also a culprit-candidate", () => {
    const cast = castWithVictim();
    cast.crimeDynamics.possibleCulprits = ["Sylvia Trent", "Mallory Finch", "Ivor Hale"];
    const r = checkCast(cast, { expectedCount: 5 });
    expect(r.metrics.victimDistinct).toBe(false);
    expect(r.issues.some((i) => i.code === "victim_is_suspect" && i.severity === "warn")).toBe(true);
  });

  it("flags a victim with no relationship to any culprit-candidate (no motive anchor)", () => {
    const cast = castWithVictim();
    // sever the victim↔suspect edge, leave the victim attached only to the detective
    cast.relationships = { pairs: [pair("Sylvia Trent", "Eleanor Voss", "moderate"), pair("Mallory Finch", "Ivor Hale", "low")] };
    const r = checkCast(cast, { expectedCount: 5 });
    expect(r.metrics.victimTiedToSuspect).toBe(false);
    expect(r.issues.some((i) => i.code === "victim_not_tied_to_suspect" && i.severity === "warn")).toBe(true);
  });
});

describe("checkCast — A_52 role model (explicit role counts)", () => {
  function roleCast(roles: string[]): CastDesign {
    const names = ["Eleanor Voss", "Mallory Finch", "Ivor Hale", "Beatrice Quill", "Sylvia Trent"];
    return {
      characters: names.map((name, i) =>
        makeChar({ name, role: roles[i] as CharacterProfile["role"], roleArchetype: roles[i] === "victim" ? "victim" : `archetype-${i}`, gender: i % 2 === 0 ? "female" : "male" }),
      ),
      relationships: { pairs: [pair("Ivor Hale", "Mallory Finch", "high")] },
      diversity: { stereotypeCheck: [], recommendations: [] },
      crimeDynamics: { possibleCulprits: ["Mallory Finch", "Beatrice Quill", "Sylvia Trent"], redHerrings: [], victimCandidates: ["Ivor Hale"], detectiveCandidates: ["Eleanor Voss"] },
    };
  }

  it("a 1-detective / 1-victim / 3-suspect cast raises no role-count warnings", () => {
    const r = checkCast(roleCast(["detective", "suspect", "victim", "suspect", "suspect"]), { expectedCount: 5 });
    expect(r.issues.some((i) => i.code === "role_count_detective" || i.code === "role_count_victim")).toBe(false);
    expect(r.metrics.victimName).toBe("Ivor Hale");
  });

  it("flags two detectives and zero victims (warn-severity)", () => {
    const r = checkCast(roleCast(["detective", "detective", "suspect", "suspect", "suspect"]), { expectedCount: 5 });
    expect(r.issues.some((i) => i.code === "role_count_detective" && i.severity === "warn")).toBe(true);
    expect(r.issues.some((i) => i.code === "role_count_victim" && i.severity === "warn")).toBe(true);
    expect(r.ok).toBe(true); // warn-severity never aborts
  });
});
