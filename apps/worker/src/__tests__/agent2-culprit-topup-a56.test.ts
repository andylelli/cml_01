import { describe, expect, it } from "vitest";
import { enforceVictimRoleInvariant } from "../jobs/agents/agent2-run.js";

// A_56 2-B — final culprit-count enforcement. Steps 3 (victim removal) and 5 (empty-pool promotion) can
// still leave possibleCulprits undersized (a single suspect), narrowing the mystery to a foregone
// conclusion. The final top-up grows the pool to min(3, eligible) from the remaining non-victim,
// non-detective cast. Repair-not-abort, capped at the actual eligible count.

describe("enforceVictimRoleInvariant — final culprit-count top-up (A_56 2-B)", () => {
  it("tops up an undersized possibleCulprits pool to min(3, eligible suspects)", () => {
    const castRaw = {
      characters: [
        { name: "Insp. Vale", role: "detective", roleArchetype: "detective" },
        { name: "Lord Ashby", role: "victim", roleArchetype: "victim" },
        { name: "Mrs Cole", role: "suspect", roleArchetype: "suspect" },
        { name: "Dr Finn", role: "suspect", roleArchetype: "suspect" },
        { name: "Mr Bray", role: "suspect", roleArchetype: "suspect" },
      ],
      crimeDynamics: {
        possibleCulprits: ["Mrs Cole"], // undersized: only one suspect
        victimCandidates: ["Lord Ashby"],
        detectiveCandidates: ["Insp. Vale"],
      },
    };
    const warnings: string[] = [];
    enforceVictimRoleInvariant(castRaw as any, warnings);

    const culprits = (castRaw.crimeDynamics as any).possibleCulprits as string[];
    expect(culprits.length).toBe(3); // min(3, 3 eligible suspects)
    // The victim and detective are never added to the culprit pool.
    expect(culprits.map((c) => c.toLowerCase())).not.toContain("lord ashby");
    expect(culprits.map((c) => c.toLowerCase())).not.toContain("insp. vale");
    expect(warnings.some((w) => /topped up possibleCulprits/.test(w))).toBe(true);
  });

  it("does not over-grow a pool that already meets the minimum", () => {
    const castRaw = {
      characters: [
        { name: "Insp. Vale", role: "detective", roleArchetype: "detective" },
        { name: "Lord Ashby", role: "victim", roleArchetype: "victim" },
        { name: "Mrs Cole", role: "suspect", roleArchetype: "suspect" },
        { name: "Dr Finn", role: "suspect", roleArchetype: "suspect" },
        { name: "Mr Bray", role: "suspect", roleArchetype: "suspect" },
      ],
      crimeDynamics: {
        possibleCulprits: ["Mrs Cole", "Dr Finn", "Mr Bray"],
        victimCandidates: ["Lord Ashby"],
        detectiveCandidates: ["Insp. Vale"],
      },
    };
    const warnings: string[] = [];
    enforceVictimRoleInvariant(castRaw as any, warnings);
    expect(((castRaw.crimeDynamics as any).possibleCulprits as string[]).length).toBe(3);
    expect(warnings.some((w) => /topped up possibleCulprits/.test(w))).toBe(false);
  });
});
