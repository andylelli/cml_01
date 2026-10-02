/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A5-D06 (remap invalidates the strict memos, as the purge does)
 * and A5-D07 (the Agent 5 / Agent 6 clue gates check the locked facts the prompt sent).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const seen = vi.hoisted(() => ({ timeConflictFacts: [] as unknown[], contractFacts: [] as unknown[] }));

vi.mock("../jobs/clue-contracts/contracts.js", async (importOriginal) => {
  const real: any = await importOriginal();
  return {
    ...real,
    findLockedFactClueTimeConflicts: (_cml: unknown, _clues: unknown, facts: unknown) => {
      seen.timeConflictFacts.push(facts);
      return [];
    },
    enforceAgent5DeterministicContracts: (_cml: unknown, _clues: unknown, opts: any) => {
      seen.contractFacts.push(opts?.hardLogicLockedFacts);
      throw new Error("stop here");
    },
  };
});
vi.mock("../jobs/agents/shared.js", async (importOriginal) => {
  const real: any = await importOriginal();
  return { ...real, applyClueGuardrails: () => ({ fixes: [], issues: [], hasCriticalIssues: false }) };
});

import {
  buildStrictPromptFeedback,
  buildStrictSourcePathWhitelist,
  strictPromptFeedbackCache,
  strictSourcePathWhitelistCache,
} from "../jobs/clue-contracts/contracts.js";
import {
  remapMissingDiscriminatingEvidenceIdsToExistingClues,
  runDeterministicClueChecks,
} from "../jobs/agents/agent5/evidence-remediation.js";
import { agent5GateLockedFacts, buildAgent5LockedFactsPayload } from "../jobs/agents/agent5/contract-payload.js";
import { applyAgent5ContractsToRegeneratedClues } from "../jobs/agents/agent6/retry-contract.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; seen.timeConflictFacts = []; seen.contractFacts = []; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

// ── A5-D06 ───────────────────────────────────────────────────────────────────

const remapFixture = () => ({
  cml: { CASE: { discriminating_test: { evidence_clues: ["clue_clock_winding_key_backward", "clue_scratch_marks_on_arbor"] } } } as any,
  clues: {
    clues: [
      { id: "clue_core_contradiction_chain", description: "Clock winding key has backward twist with contradiction evidence.", pointsTo: "Clock manipulation invalidates timeline assumptions.", sourceInCML: "CASE.discriminating_test.evidence_clues[0]", criticality: "essential", placement: "mid", evidenceType: "contradiction" },
      { id: "clue_3", description: "Fine scratch marks on winding arbor indicate deliberate tampering.", pointsTo: "Mechanical interference with the clock mechanism.", sourceInCML: "CASE.inference_path.steps[0].required_evidence[0]", criticality: "essential", placement: "early", evidenceType: "observation" },
    ],
    redHerrings: [],
  } as any,
});
const MISSING = ["clue_clock_winding_key_backward", "clue_scratch_marks_on_arbor"];

describe("A5-D06 — the evidence-id remap invalidates the strict memos", () => {
  it("flag OFF: the memos survive the remap (today — stale)", () => {
    setFlag(false);
    const { cml, clues } = remapFixture();
    buildStrictSourcePathWhitelist(cml);
    buildStrictPromptFeedback(cml);
    const result = remapMissingDiscriminatingEvidenceIdsToExistingClues(cml, clues, MISSING);
    expect(result.remapped.length).toBeGreaterThan(0);
    expect(strictSourcePathWhitelistCache.has(cml)).toBe(true);
    expect(strictPromptFeedbackCache.has(cml)).toBe(true);
  });

  it("flag ON: both memos are dropped, exactly as the purge drops them", () => {
    setFlag(true);
    const { cml, clues } = remapFixture();
    buildStrictSourcePathWhitelist(cml);
    buildStrictPromptFeedback(cml);
    const result = remapMissingDiscriminatingEvidenceIdsToExistingClues(cml, clues, MISSING);
    expect(result.remapped.length).toBeGreaterThan(0);
    expect(strictSourcePathWhitelistCache.has(cml)).toBe(false);
    expect(strictPromptFeedbackCache.has(cml)).toBe(false);
  });

  it("flag OFF: a remap that changes nothing leaves the memos alone", () => {
    setFlag(false);
    const { cml, clues } = remapFixture();
    buildStrictSourcePathWhitelist(cml);
    remapMissingDiscriminatingEvidenceIdsToExistingClues(cml, clues, []);
    expect(strictSourcePathWhitelistCache.has(cml)).toBe(true);
  });

  it("flag ON (A5-12): the memos are bypassed, so nothing is cached to go stale", () => {
    setFlag(true);
    const { cml, clues } = remapFixture();
    buildStrictSourcePathWhitelist(cml);
    buildStrictPromptFeedback(cml);
    remapMissingDiscriminatingEvidenceIdsToExistingClues(cml, clues, []);
    expect(strictSourcePathWhitelistCache.has(cml)).toBe(false);
    expect(strictPromptFeedbackCache.has(cml)).toBe(false);
  });
});

// ── A5-D07 ───────────────────────────────────────────────────────────────────

const RAW_A = { id: "clock_time", value: "7:15", description: "raw device 0" };
const RAW_B = { id: "other_device", value: "9:00", description: "raw device 1" };
const REGISTRY = [{ id: "clock_time", value: "quarter past seven", description: "registry (wordified)" }];

const ctxWith = (over: Partial<{ enable: boolean; registry: unknown[] | undefined }> = {}): any => ({
  inputs: { enableLockedFactRegistry: over.enable ?? true },
  lockedFactRegistry: "registry" in over ? over.registry : REGISTRY,
  hardLogicDevices: { devices: [{ lockedFacts: [RAW_A] }, { lockedFacts: [RAW_B] }, {}] },
  cml: { CASE: { discriminating_test: { evidence_clues: [] } } },
  clues: { clues: [], redHerrings: [] },
  warnings: [],
  errors: [],
});

describe("A5-D07 — agent5GateLockedFacts", () => {
  it("flag OFF: every device's raw facts, whatever the registry (today)", () => {
    setFlag(false);
    expect(agent5GateLockedFacts(ctxWith())).toEqual([RAW_A, RAW_B]);
    expect(agent5GateLockedFacts({ ...ctxWith(), hardLogicDevices: undefined })).toBeUndefined();
  });

  it("flag ON: exactly the facts the prompt sent", () => {
    setFlag(true);
    const ctx = ctxWith();
    expect(agent5GateLockedFacts(ctx)).toBe(buildAgent5LockedFactsPayload(ctx).lockedFacts);
    expect(agent5GateLockedFacts(ctx)).toEqual(REGISTRY);
  });

  it("flag ON: raw device facts when the prompt sent none (registry disabled, empty or absent)", () => {
    setFlag(true);
    expect(agent5GateLockedFacts(ctxWith({ enable: false }))).toEqual([RAW_A, RAW_B]);
    expect(agent5GateLockedFacts(ctxWith({ registry: [] }))).toEqual([RAW_A, RAW_B]);
    expect(agent5GateLockedFacts(ctxWith({ registry: undefined }))).toEqual([RAW_A, RAW_B]);
  });
});

describe("A5-D07 — both gate sites read the helper", () => {
  const noop = (): any => ({ failAgent5: (m: string) => { throw new Error(m); } });

  for (const on of [false, true]) {
    const expected = on ? REGISTRY : [RAW_A, RAW_B];
    it(`flag ${on ? "ON" : "OFF"}: Agent 5's time-conflict gate checks ${on ? "the registry" : "raw device facts"}`, () => {
      setFlag(on);
      try { runDeterministicClueChecks(ctxWith(), noop(), { clues: [], redHerrings: [] } as any); } catch { /* later gates */ }
      expect(seen.timeConflictFacts[0]).toEqual(expected);
    });

    it(`flag ${on ? "ON" : "OFF"}: Agent 6's regenerated-clue contract checks ${on ? "the registry" : "raw device facts"}`, () => {
      setFlag(on);
      expect(() => applyAgent5ContractsToRegeneratedClues(ctxWith(), "test")).toThrow();
      expect(seen.contractFacts.length).toBeGreaterThan(0);
      for (const facts of seen.contractFacts) expect(facts).toEqual(expected);
    });
  }
});
