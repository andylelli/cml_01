/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — Agent 6 item A6-D08. A5-11 / A5-D04 (Agent 6's Agent-5
 * regenerations) and A6-02 (required-phrase ordering) went with the retries-on arm — owner decision A6-Q01,
 * 2026-10-02; what stays of them is the default path: a failed audit regenerates nothing.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockAuditFairPlay = vi.hoisted(() => vi.fn());
const mockExtractClues = vi.hoisted(() => vi.fn());
const mockBlindReaderSimulation = vi.hoisted(() => vi.fn());

// Same module stub as agent6-run-flow.test.ts.
vi.mock("@cml/prompts-llm", () => ({
  auditFairPlay: (...args: any[]) => mockAuditFairPlay(...args),
  extractClues: (...args: any[]) => mockExtractClues(...args),
  blindReaderSimulation: (...args: any[]) => mockBlindReaderSimulation(...args),
  buildCMLPrompt: vi.fn(),
  reviseCml: vi.fn(),
  checkPointsToDistinctness: () => ({ ok: true, collisions: [] }),
  provesTheAct: () => ({ verdict: "UNKNOWN", detail: "", linkingTraces: [], weaponTracesNamingNobody: [], culpritTracesWithoutWeapon: [], usedInInferencePath: false, usedByStep: undefined }),
  splitMeansLinkTrace: () => undefined,
}));

vi.mock("@cml/story-validation", () => ({
  validateGenreStructure: () => ({ valid: true, errors: [], warnings: [] }),
  getGenerationParams: () => ({
    agent6_fairplay: {
      params: {
        blind_reader: { pass_criteria: { min_confidence: "likely" } },
      },
    },
  }),
}));

import { __testables, runAgent6 } from "../jobs/agents/agent6-run.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = { [FLAG]: process.env[FLAG] };
  mockAuditFairPlay.mockReset();
  mockExtractClues.mockReset();
  mockBlindReaderSimulation.mockReset();
  mockBlindReaderSimulation.mockResolvedValue({
    suspectedCulprit: "Iwan Hale", reasoning: "Same culprit.", confidenceLevel: "certain", missingInformation: [], cost: 0, durationMs: 1,
  });
});
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
});
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

describe("A6-D08 — no duplicate 'contradiction' backstop when a step has no correction", () => {
  const run = () => {
    const cml = { CASE: { inference_path: { steps: [{ observation: "A soot smear sat inside the clock hatch.", effect: "Someone opened the clock." }] } } } as any;
    const clues = {
      clues: [{
        id: "clue_seed", sourceInCML: "CASE.inference_path.steps[0].observation", description: "A faint soot smear marked the hinge.",
        pointsTo: "Someone handled the panel.", placement: "late", criticality: "supporting", evidenceType: "observation", supportsInferenceStep: 1,
      }],
      redHerrings: [],
      clueTimeline: { early: [], mid: [], late: ["clue_seed"] },
    } as any;
    const repairs = __testables.ensureCriticalFairPlayBackstopClues(cml, clues);
    return { repairs, ids: clues.clues.map((c: any) => c.id as string), clues };
  };

  it("flag OFF: adds the observation backstop AND a same-text contradiction clue (today)", () => {
    setFlag(false);
    const { ids, clues } = run();
    const obs = clues.clues.find((c: any) => c.id.startsWith("clue_fp_backstop_step_1"));
    const con = clues.clues.find((c: any) => c.id.startsWith("clue_fp_contradiction_step_1"));
    expect(ids.some((id: string) => id.startsWith("clue_fp_backstop_step_1"))).toBe(true);
    expect(con).toBeTruthy();
    expect(obs.evidenceType).toBe("observation");
    expect(con.description).toBe(obs.description);
    expect(con.pointsTo).toBe(obs.pointsTo);
  });

  it("flag ON: adds only the observation backstop", () => {
    setFlag(true);
    const { ids, repairs } = run();
    expect(ids.some((id: string) => id.startsWith("clue_fp_backstop_step_1"))).toBe(true);
    expect(ids.some((id: string) => id.startsWith("clue_fp_contradiction_step_1"))).toBe(false);
    expect(repairs.some((r: string) => /contradiction clue/.test(r))).toBe(false);
  });

  it("flag ON: a step WITH a correction still gets its contradiction backstop", () => {
    setFlag(true);
    const cml = { CASE: { inference_path: { steps: [{ observation: "A soot smear sat inside the clock hatch.", correction: "The clock face was opened before discovery." }] } } } as any;
    const clues = {
      clues: [{ id: "clue_seed_early", sourceInCML: "CASE.inference_path.steps[0].observation", description: "A soot smear marked the hatch.", pointsTo: "Someone handled it.", placement: "early", criticality: "essential", evidenceType: "observation", supportsInferenceStep: 1 }],
      redHerrings: [],
      clueTimeline: { early: ["clue_seed_early"], mid: [], late: [] },
    } as any;
    __testables.ensureCriticalFairPlayBackstopClues(cml, clues);
    expect(clues.clues.some((c: any) => c.id.startsWith("clue_fp_contradiction_step_1"))).toBe(true);
  });
});

describe("A6-Q01 — Agent 6 has no clue-regeneration retry", () => {
  const audit = {
    overallStatus: "fail",
    violations: [{
      severity: "critical", rule: "Logical Deducibility",
      description: "The reader cannot see that the clock was tampered with before the discriminating test.",
      suggestion: "Move the grease-smear clue to an early essential slot before the discriminating test.",
    }],
    warnings: [], recommendations: [],
  } as any;
  it("a failed audit makes no clue regeneration", async () => {
    mockAuditFairPlay.mockResolvedValue({ overallStatus: "fail", violations: audit.violations, warnings: [], recommendations: [], cost: 0.01 });
    try { await runAgent6(agent6Ctx()); } catch { /* a failed audit may end the stage; only the call count matters */ }
    expect(mockAuditFairPlay).toHaveBeenCalled();
    expect(mockExtractClues).not.toHaveBeenCalled();
  });
});

describe("A6-D09 — clue traceability sync reads prose_requirements without creating a stub", () => {
  const sync = __testables.synchronizeClueTraceabilityFromCurrentClues;
  // One late optional clue: not relevant to the pre-test mapping, so the sync writes nothing.
  const noopClues = () => ({
    clues: [{ id: "clue_late_1", placement: "late", criticality: "optional", evidenceType: "observation" }],
    clueTimeline: { early: [], mid: [], late: ["clue_late_1"] },
  }) as any;
  const writingClues = () => ({
    clues: [{ id: "clue_early_1", placement: "early", criticality: "essential", evidenceType: "observation", category: "physical" }],
    clueTimeline: { early: ["clue_early_1"], mid: [], late: [] },
  }) as any;

  it("flag OFF: a no-op still creates prose_requirements with an empty discriminating_test_scene (today)", () => {
    setFlag(false);
    const cml = { CASE: {} } as any;
    expect(sync(cml, noopClues())).toEqual([]);
    expect(cml.CASE.prose_requirements).toEqual({ discriminating_test_scene: {} });
  });

  it("flag ON: a no-op leaves CASE without prose_requirements", () => {
    setFlag(true);
    const cml = { CASE: {} } as any;
    expect(sync(cml, noopClues())).toEqual([]);
    expect("prose_requirements" in cml.CASE).toBe(false);
  });

  it("flag ON: a no-op on an existing prose_requirements adds no discriminating_test_scene", () => {
    setFlag(true);
    const cml = { CASE: { prose_requirements: { clue_to_scene_mapping: [] } } } as any;
    sync(cml, noopClues());
    expect(cml.CASE.prose_requirements).toEqual({ clue_to_scene_mapping: [] });
  });

  it("flag ON: a write creates prose_requirements holding only the mapping — the same mapping as OFF", () => {
    setFlag(false);
    const off = { CASE: {} } as any;
    const offUpdates = sync(off, writingClues());
    setFlag(true);
    const on = { CASE: {} } as any;
    const onUpdates = sync(on, writingClues());
    expect(onUpdates).toEqual(offUpdates);
    expect(onUpdates.length).toBeGreaterThan(0);
    expect(on.CASE.prose_requirements.clue_to_scene_mapping).toEqual(off.CASE.prose_requirements.clue_to_scene_mapping);
    expect(Object.keys(on.CASE.prose_requirements)).toEqual(["clue_to_scene_mapping"]);
    expect(off.CASE.prose_requirements.discriminating_test_scene).toEqual({});
  });

  it("flag ON: an existing discriminating_test_scene is still read for the pre-test budget", () => {
    setFlag(true);
    const cml = { CASE: { prose_requirements: { discriminating_test_scene: { act_number: 2, scene_number: 2 } } } } as any;
    sync(cml, writingClues());
    expect(cml.CASE.prose_requirements.clue_to_scene_mapping).toEqual([
      expect.objectContaining({ clue_id: "clue_early_1", act_number: 1, scene_number: 1 }),
    ]);
    expect(cml.CASE.prose_requirements.discriminating_test_scene).toEqual({ act_number: 2, scene_number: 2 });
  });
});

const LOCKED = [{ id: "fact_clock", value: "ten minutes past nine", description: "the stopped clock" }];

function agent6Ctx(): any {
  return {
    client: {},
    inputs: { targetLength: "medium", tone: "Golden Age Mystery", theme: "clock-room murder", enableLockedFactRegistry: true },
    lockedFactRegistry: LOCKED,
    runId: "run-vf-agent6",
    projectId: "proj-vf-agent6",
    reportProgress: () => undefined,
    warnings: [],
    errors: [],
    enableScoring: false,
    scoreAggregator: undefined,
    savePartialReport: async () => undefined,
    agentCosts: { agent5_clues: 1 },
    agentDurations: {},
    criticalFairPlayRules: new Set(["Clue Visibility", "No Withholding", "Logical Deducibility"]),
    cml: {
      CASE: {
        quality_controls: { clue_visibility_requirements: { late_min: 0 } },
        cast: [{ name: "Iwan Hale", alibi_window: "after supper", culprit_eligibility: "eligible" }],
        false_assumption: { statement: "" },
        culpability: { culprits: [] },
        inference_path: {
          steps: [{
            observation: "Grease marked the key slot before supper.",
            correction: "The clock timeline was deliberately shifted.",
            required_evidence: ["Witness notes conflict with the expected order."],
          }],
        },
        discriminating_test: {
          design: "Use clock timing to isolate the culprit",
          knowledge_revealed: "Only the culprit knew which key was moved",
          evidence_clues: ["clue_anchor"],
        },
      },
    },
    clues: {
      clues: [
        { id: "clue_anchor", sourceInCML: "CASE.inference_path.steps[0].observation", description: "Grease marked the key slot before supper.", pointsTo: "Timeline tampering occurred before the test scene.", placement: "mid", criticality: "essential", evidenceType: "observation", supportsInferenceStep: 1 },
        { id: "clue_support_early", sourceInCML: "CASE.inference_path.steps[0].correction", description: "A witness recalled the key being handled before tea.", pointsTo: "Supports correction on timeline order.", placement: "early", criticality: "essential", evidenceType: "contradiction", supportsInferenceStep: 1 },
      ],
      redHerrings: [],
      clueTimeline: { early: ["clue_support_early"], mid: ["clue_anchor"], late: [] },
    },
  };
}
