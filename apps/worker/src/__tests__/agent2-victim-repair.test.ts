import { describe, expect, it } from "vitest";
import { enforceVictimRoleInvariant } from "../jobs/agents/agent2-run.js";

/**
 * K1 (ANALYSIS_51 §1) — the victim invariant is deterministic and repair-not-abort.
 * These tests exercise the worker-layer repair seam directly.
 */

type Char = { name: string; roleArchetype?: string };

function castRaw(opts: {
  characters: Char[];
  possibleCulprits?: string[];
  victimCandidates?: string[];
  pairs?: Array<{ character1: string; character2: string; tension?: string }>;
}): Record<string, unknown> {
  return {
    characters: opts.characters.map((c) => ({ ...c })),
    crimeDynamics: {
      possibleCulprits: opts.possibleCulprits ?? [],
      redHerrings: [],
      victimCandidates: opts.victimCandidates ?? [],
      detectiveCandidates: [],
    },
    relationships: { pairs: opts.pairs ?? [] },
  };
}

const FIVE: Char[] = [
  { name: "Eleanor Voss", roleArchetype: "amateur detective" },
  { name: "Mallory Finch", roleArchetype: "physician" },
  { name: "Ivor Hale", roleArchetype: "retired captain" },
  { name: "Beatrice Quill", roleArchetype: "companion" },
  { name: "Sylvia Trent", roleArchetype: "matriarch" },
];

describe("enforceVictimRoleInvariant — repair, never abort", () => {
  it("never throws and resolves a victim when none is designated", () => {
    const cast = castRaw({ characters: FIVE, possibleCulprits: ["Mallory Finch", "Ivor Hale", "Beatrice Quill"] });
    const warnings: string[] = [];
    expect(() => enforceVictimRoleInvariant(cast, warnings)).not.toThrow();

    const cd = cast.crimeDynamics as Record<string, unknown>;
    expect((cd.victimCandidates as string[]).length).toBe(1);
    const victim = (cd.victimCandidates as string[])[0];
    // the resolved victim is a non-detective, non-culprit character (Sylvia Trent)
    expect(victim).toBe("Sylvia Trent");
    const victimChar = (cast.characters as Char[]).find((c) => c.name === victim);
    expect(victimChar?.roleArchetype).toBe("victim");
    expect(warnings.some((w) => /designated Sylvia Trent as the named victim/.test(w))).toBe(true);
  });

  it("removes the victim from possibleCulprits when they overlap (the phantom-victim bug)", () => {
    // The classic defect: the victim is back-filled as the first non-detective, who is also a suspect.
    const cast = castRaw({
      characters: FIVE,
      possibleCulprits: ["Mallory Finch", "Ivor Hale"],
      victimCandidates: ["Mallory Finch"], // victim == a culprit candidate
    });
    const warnings: string[] = [];
    enforceVictimRoleInvariant(cast, warnings);

    const cd = cast.crimeDynamics as Record<string, unknown>;
    const culprits = (cd.possibleCulprits as string[]).map((n) => n.toLowerCase());
    expect(culprits).not.toContain("mallory finch");
    // pool topped back up so >= 2 suspects remain
    expect((cd.possibleCulprits as string[]).length).toBeGreaterThanOrEqual(2);
    expect(warnings.some((w) => /removed the victim Mallory Finch from possibleCulprits/.test(w))).toBe(true);
  });

  it("synthesises the motive-anchor relationship when the victim is untethered", () => {
    const cast = castRaw({
      characters: FIVE,
      possibleCulprits: ["Mallory Finch", "Ivor Hale", "Beatrice Quill"],
      victimCandidates: ["Sylvia Trent"],
      pairs: [{ character1: "Sylvia Trent", character2: "Eleanor Voss", tension: "low" }], // tied only to detective
    });
    const warnings: string[] = [];
    enforceVictimRoleInvariant(cast, warnings);

    const pairs = (cast.relationships as { pairs: Array<Record<string, unknown>> }).pairs;
    const tied = pairs.some((p) => {
      const a = String(p.character1).toLowerCase();
      const b = String(p.character2).toLowerCase();
      return (a === "sylvia trent" && b === "mallory finch") || (b === "sylvia trent" && a === "mallory finch");
    });
    expect(tied).toBe(true);
    expect(warnings.some((w) => /motive-anchor relationship Sylvia Trent/.test(w))).toBe(true);
  });

  it("leaves a healthy cast untouched (no warnings)", () => {
    const cast = castRaw({
      characters: [
        { name: "Eleanor Voss", roleArchetype: "amateur detective" },
        { name: "Mallory Finch", roleArchetype: "physician" },
        { name: "Ivor Hale", roleArchetype: "retired captain" },
        { name: "Sylvia Trent", roleArchetype: "victim" },
      ],
      possibleCulprits: ["Mallory Finch", "Ivor Hale"],
      victimCandidates: ["Sylvia Trent"],
      pairs: [{ character1: "Sylvia Trent", character2: "Mallory Finch", tension: "high" }],
    });
    const warnings: string[] = [];
    enforceVictimRoleInvariant(cast, warnings);
    expect(warnings).toEqual([]);
  });

  it("does not throw on a too-small cast (defers to checkCast)", () => {
    const cast = castRaw({ characters: [{ name: "Solo", roleArchetype: "detective" }] });
    const warnings: string[] = [];
    expect(() => enforceVictimRoleInvariant(cast, warnings)).not.toThrow();
  });
});
