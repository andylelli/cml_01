import { describe, expect, it } from "vitest";
import { repairCaseSoundness } from "../case-soundness-repair.js";
import { buildStoryWorldState, runContradictionGate } from "../world-state.js";
import { verifyDiscriminator } from "../discriminator-verifier.js";

// A_61 RC2.5 — deterministic repair-not-abort so the case-soundness gates can be promoted to blocking.

const gateOf = (caseBlock: any) => {
  const ws = buildStoryWorldState({
    cast: caseBlock.cast,
    victim: caseBlock.cast?.find((c: any) => /victim/i.test(String(c.role_archetype ?? "")))?.name ?? null,
    culprits: caseBlock.culpability?.culprits ?? [],
  });
  return runContradictionGate(ws);
};

describe("repairCaseSoundness — character_missing_gender (the kind that fires)", () => {
  it("assigns name-inferred gender, and the gate no longer reports it", () => {
    const caseBlock = {
      cast: [
        { name: "Margaret Vane", role_archetype: "suspect" }, // no gender → inferred female
        { name: "Reginald Ashford", role_archetype: "victim" }, // → inferred male
      ],
      culpability: { culprits: ["Margaret Vane"] },
    };
    const before = gateOf(caseBlock);
    expect(before.conflicts.some((c) => c.kind === "character_missing_gender")).toBe(true);
    const { repairs } = repairCaseSoundness(caseBlock);
    expect(caseBlock.cast[0].gender).toBe("female");
    expect(caseBlock.cast[1].gender).toBe("male");
    expect(repairs.length).toBeGreaterThan(0);
    expect(gateOf(caseBlock).conflicts.some((c) => c.kind === "character_missing_gender")).toBe(false);
  });

  it("alternates deterministically for an unrecognised name", () => {
    const caseBlock = {
      cast: [{ name: "Zyx Qwph", role_archetype: "suspect" }],
      culpability: { culprits: ["Zyx Qwph"] },
    };
    repairCaseSoundness(caseBlock);
    expect(["male", "female"]).toContain(caseBlock.cast[0].gender);
    // idx 0 → female by the alternation rule
    expect(caseBlock.cast[0].gender).toBe("female");
  });
});

describe("repairCaseSoundness — culprit derivation & partition repairs", () => {
  it("no_culprit → derives from cast culpability=guilty", () => {
    const caseBlock = {
      cast: [{ name: "Hugo Vane", role_archetype: "suspect", gender: "male", culpability: "guilty" }],
      culpability: { culprits: [] },
      discriminating_test: {},
    };
    const { repairs, residualBlocked } = repairCaseSoundness(caseBlock);
    expect(caseBlock.culpability.culprits).toContain("Hugo Vane");
    expect(residualBlocked).not.toContain("no_culprit");
    expect(repairs.join(" ")).toMatch(/derived culprit/);
  });

  it("no_culprit with no guilty cast → residualBlocked (negative direction)", () => {
    const caseBlock = {
      cast: [{ name: "Ann Vale", role_archetype: "suspect", gender: "female" }],
      culpability: { culprits: [] },
      discriminating_test: {},
    };
    const { residualBlocked } = repairCaseSoundness(caseBlock);
    expect(residualBlocked).toContain("no_culprit");
  });

  it("culprit_is_victim → drops the victim from culprits", () => {
    const caseBlock = {
      cast: [
        { name: "Lady Beatrice Ellsworth", role_archetype: "victim", gender: "female" },
        { name: "Reginald Ashford", role_archetype: "suspect", gender: "male", culpability: "guilty" },
      ],
      culpability: { culprits: ["Lady Beatrice Ellsworth", "Reginald Ashford"] },
      discriminating_test: {},
    };
    repairCaseSoundness(caseBlock);
    expect(caseBlock.culpability.culprits).not.toContain("Lady Beatrice Ellsworth");
    expect(caseBlock.culpability.culprits).toContain("Reginald Ashford");
  });

  it("culprit_eliminated → removes the culprit from eliminated_suspects", () => {
    const caseBlock = {
      cast: [
        { name: "Hugo Vane", role_archetype: "suspect", gender: "male" },
        { name: "Ann Vale", role_archetype: "suspect", gender: "female" },
      ],
      culpability: { culprits: ["Hugo Vane"] },
      discriminating_test: { eliminated_suspects: ["Hugo Vane", "Ann Vale"] },
    };
    repairCaseSoundness(caseBlock);
    expect(caseBlock.discriminating_test.eliminated_suspects).not.toContain("Hugo Vane");
    expect(caseBlock.discriminating_test.eliminated_suspects).toContain("Ann Vale");
  });

  it("suspect_unaccounted → completes an explicit-but-incomplete elimination set", () => {
    const caseBlock = {
      cast: [
        { name: "Hugo Vane", role_archetype: "suspect", gender: "male" },
        { name: "Ann Vale", role_archetype: "suspect", gender: "female" },
        { name: "Cyril Poole", role_archetype: "suspect", gender: "male" },
      ],
      culpability: { culprits: ["Hugo Vane"] },
      discriminating_test: { eliminated_suspects: ["Ann Vale"] }, // Cyril missing
    };
    repairCaseSoundness(caseBlock);
    const verdict = verifyDiscriminator({
      culprits: caseBlock.culpability.culprits,
      suspects: ["Hugo Vane", "Ann Vale", "Cyril Poole"],
      eliminatedSuspects: caseBlock.discriminating_test.eliminated_suspects,
      evidenceClueCount: 1,
    });
    expect(verdict.issues.some((i) => i.kind === "suspect_unaccounted")).toBe(false);
  });

  it("review fix — a victim marked guilty is NOT re-derived as culprit after the victim-drop empties culprits", () => {
    const caseBlock = {
      cast: [
        { name: "Lady Beatrice Ellsworth", role_archetype: "victim", gender: "female", culpability: "guilty" }, // stale guilty tag
        { name: "Reginald Ashford", role_archetype: "suspect", gender: "male", culpability: "innocent" },
      ],
      culpability: { culprits: ["Lady Beatrice Ellsworth"] }, // only the victim → step 7 empties it
      discriminating_test: {},
    };
    const { residualBlocked } = repairCaseSoundness(caseBlock);
    expect(caseBlock.culpability.culprits).not.toContain("Lady Beatrice Ellsworth"); // NOT re-derived
    expect(residualBlocked).toContain("no_culprit"); // honestly unrepairable (no non-victim guilty cast)
  });

  it("is idempotent — a second run repairs nothing", () => {
    const caseBlock = {
      cast: [{ name: "Margaret Vane", role_archetype: "suspect" }],
      culpability: { culprits: ["Margaret Vane"] },
      discriminating_test: {},
    };
    repairCaseSoundness(caseBlock);
    const second = repairCaseSoundness(caseBlock);
    expect(second.repairs).toEqual([]);
  });

  it("mutates the passed caseBlock (repair-at-source, so the prose prompt sees it)", () => {
    const caseBlock: any = { cast: [{ name: "Margaret Vane", role_archetype: "suspect" }], culpability: { culprits: ["Margaret Vane"] } };
    const ref = caseBlock;
    repairCaseSoundness(caseBlock);
    expect(ref.cast[0].gender).toBeDefined();
  });
});
