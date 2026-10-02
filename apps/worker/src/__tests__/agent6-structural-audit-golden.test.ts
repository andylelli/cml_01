import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { classifyFairPlayFailure } from "../jobs/agents/agent6-escalation-policy.js";
import { runDeterministicStructuralAudit } from "../jobs/agents/agent6/retry-contract.js";

/**
 * A6-13 — `runDeterministicStructuralAudit` is the authority for Agent 6's escalation to a CML revision
 * and had no test. Characterised here on the committed golden bundles (their stored CML and clues), so a
 * change to the audit shows as a snapshot diff before it changes a run.
 */
const GOLDEN = join(__dirname, "..", "..", "..", "..", "eval", "golden");
const bundles = readdirSync(GOLDEN).filter((f) => /^bundle-.*\.json$/.test(f)).sort();

describe("runDeterministicStructuralAudit on the golden bundles (A6-13)", () => {
  it("finds the bundles", () => expect(bundles.length).toBeGreaterThanOrEqual(4));
  for (const file of bundles) {
    it(file, () => {
      const b = JSON.parse(readFileSync(join(GOLDEN, file), "utf8"));
      expect(runDeterministicStructuralAudit(b.artifacts.cml, b.artifacts.clues)).toMatchSnapshot();
    });
  }
});

describe("classifyFairPlayFailure — the audit's critical rules (A6-13: the old local copy ignored them)", () => {
  const sparseFreeCml = {
    CASE: {
      inference_path: { steps: [{ observation: "The clock in the hall had been wound back an hour.", required_evidence: ["clue_1"] }] },
      constraint_space: { time: { contradictions: ["a"], anchors: ["b"] }, access: { actors: ["c", "d"] }, physical: { traces: ["e"] } },
    },
  };
  const audit = (rule: string, severity = "critical") => ({ violations: [{ rule, severity }] }) as any;
  it("a critical clue-visibility or logical-deducibility violation is clue_coverage even with full coverage", () => {
    expect(classifyFairPlayFailure(undefined, audit("Clue Visibility"), sparseFreeCml as any)).toBe("clue_coverage");
    expect(classifyFairPlayFailure(undefined, audit("Logical Deducibility"), sparseFreeCml as any)).toBe("clue_coverage");
  });
  it("a non-critical one is not", () => {
    expect(classifyFairPlayFailure(undefined, audit("Clue Visibility", "minor"), sparseFreeCml as any)).toBe("clue_only");
  });
});

describe("runDeterministicStructuralAudit — a known negative", () => {
  it("the same CML with its clues removed fails, with gaps named", () => {
    const b = JSON.parse(readFileSync(join(GOLDEN, bundles[0]), "utf8"));
    const r = runDeterministicStructuralAudit(b.artifacts.cml, { clues: [] });
    expect(r.passed).toBe(false);
    expect(JSON.stringify(r).length).toBeGreaterThan(JSON.stringify(runDeterministicStructuralAudit(b.artifacts.cml, b.artifacts.clues)).length);
  });
});
