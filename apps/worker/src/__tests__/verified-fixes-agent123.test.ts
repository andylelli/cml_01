/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A34-D12 (flagged), and the unflagged A1X-D01 (shadow only) and
 * A1X-D10 (telemetry text only).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { applyCmlRepairAndRevalidate } from "../jobs/agents/agent3/cml-acceptance.js";
import { enforceVictimRoleInvariant } from "../jobs/agents/agent2-run.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = { [FLAG]: process.env[FLAG], CML_IDENTITY_ROLE_WINS: process.env.CML_IDENTITY_ROLE_WINS };
  delete process.env.CML_IDENTITY_ROLE_WINS;
});
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  vi.restoreAllMocks();
});
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

describe("A34-D12 — a repair that leaves the CML invalid returns the POST-repair validation", () => {
  // Invalid (most of the schema is missing), with a step whose empty required_evidence the repair fills.
  const result = (): any => ({
    cml: { CASE: { inference_path: { steps: [{ observation: "Soot in the hatch.", required_evidence: [] }] } } },
    validation: { valid: false, errors: ["STALE pre-repair error"], warnings: [] },
    cost: 0,
  });
  const ctx = (): any => ({ warnings: [], errors: [], lockedFactRegistry: [], inputs: {} });

  it("flag OFF: the stale pre-repair validation is returned (today)", () => {
    setFlag(false);
    const input = result();
    const out = applyCmlRepairAndRevalidate(input, ctx(), "first attempt");
    expect(out).toBe(input);
    expect(out.validation.errors).toEqual(["STALE pre-repair error"]);
    expect(out.cml.CASE.inference_path.steps[0].required_evidence).toHaveLength(1); // repaired in place
  });

  it("flag ON: the post-repair validation travels with the repaired CML", () => {
    setFlag(true);
    const input = result();
    const out = applyCmlRepairAndRevalidate(input, ctx(), "first attempt");
    expect(out.cml).toBe(input.cml);
    expect(out.validation.valid).toBe(false);
    expect(out.validation.errors).not.toContain("STALE pre-repair error");
    expect(out.validation.errors.length).toBeGreaterThan(0);
  });
});

describe("A1X-D01 — the victim fallback goes through resolveIdentity (shadow only)", () => {
  const cast = (): any => ({
    characters: [
      { name: "Inspector Hale", role: "detective", roleArchetype: "detective" },
      { name: "Agnes Pike", roleArchetype: "Friend of the victim" },
      { name: "Iwan Moss", roleArchetype: "gardener" },
      { name: "Clara Venn", roleArchetype: "cook" },
    ],
    crimeDynamics: { possibleCulprits: ["Iwan Moss", "Clara Venn"] },
  });

  it("CML_IDENTITY_ROLE_WINS OFF: same victim as before, and the disagreement is logged", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const c = cast();
    const warnings: string[] = [];
    enforceVictimRoleInvariant(c, warnings);
    // The old substring verdict still decides: "Friend of the victim" counts as the victim archetype, so the
    // lock step sees nothing to relabel (the defect, kept until the owner flips CML_IDENTITY_ROLE_WINS).
    expect(c.characters[1].roleArchetype).toBe("Friend of the victim");
    expect(warnings.join("\n")).not.toMatch(/designated Agnes Pike/);
    expect(warn.mock.calls.some((args) => /\[identity-disagree\] site=agent2\.victim kind=victim member="Agnes Pike" old=true unified=false/.test(String(args[0])))).toBe(true);
  });

  it("CML_IDENTITY_ROLE_WINS ON: the unified predicate decides (a relational label is not a victim archetype)", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    process.env.CML_IDENTITY_ROLE_WINS = "1";
    const c = cast();
    const warnings: string[] = [];
    enforceVictimRoleInvariant(c, warnings);
    // Agnes is still the victim (first non-detective non-culprit), but no longer by the substring match,
    // so the lock step relabels her archetype explicitly.
    expect(c.characters[1].roleArchetype).toBe("victim");
    expect(warnings.join("\n")).toMatch(/designated Agnes Pike as the named victim \(was "Friend of the victim"\)/);
  });
});

describe("A1X-D10 — the Agent 1 re-roll warning says what the re-roll does", () => {
  it("no longer claims schema-repair guardrails", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync(new URL("../jobs/agents/agent1-run.ts", import.meta.url), "utf8");
    expect(src).toContain("retrying setting generation (same prompt, re-roll only)");
    expect(src).not.toContain("retrying setting generation with schema repair guardrails");
  });
});
