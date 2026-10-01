/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — Agent 6 items A6-D08, A5-11 / A5-D04 (Agent 6's Agent-5
 * regenerations), and the unflagged A6-02 (retries-on arm only).
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
        retries: { max_retry_cost_usd: 0.15, max_fair_play_attempts: 2, max_total_attempts_with_targeted_regen: 3 },
        blind_reader: { pass_criteria: { min_confidence: "likely", max_remediation_cycles: 0 } },
      },
    },
  }),
}));

import { __testables, runAgent6 } from "../jobs/agents/agent6-run.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = { [FLAG]: process.env[FLAG], AGENT_PRE9_ENABLE_LLM_RETRIES: process.env.AGENT_PRE9_ENABLE_LLM_RETRIES };
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

describe("A6-02 — failure-derived phrases lead the required-phrase list (unflagged)", () => {
  const sevenCast = Array.from({ length: 7 }, (_, i) => ({ name: `Member Number${i}` }));
  const audit = {
    overallStatus: "fail",
    violations: [{
      severity: "critical", rule: "Logical Deducibility",
      description: "The reader cannot see that the clock was tampered with before the discriminating test.",
      suggestion: "Move the grease-smear clue to an early essential slot before the discriminating test.",
    }],
    warnings: [], recommendations: [],
  } as any;
  const cml = { CASE: { cast: sevenCast, culpability: { culprits: ["Member Number0"] } } } as any;

  it("with a 7-member cast the violation-specific phrase survives the cap", () => {
    const phrases = __testables.deriveRequiredCluePhrases(audit, cml);
    expect(phrases.length).toBeLessThanOrEqual(16);
    // Before A6-02 the list opened with the fixed ACCEPTANCE lines and the cast-binding rules filled the rest.
    expect(phrases[0]).not.toMatch(/^ACCEPTANCE:/);
    expect(phrases).toContain(audit.violations[0].suggestion);
    expect(phrases.some((p: string) => /clock was tampered with/.test(p))).toBe(true);
    const payload = __testables.buildFairPlayFeedbackPayload(audit, cml);
    expect(payload.requiredCluePhrases).toContain(audit.violations[0].suggestion);
    expect(payload.requiredCluePhrases.length).toBeLessThanOrEqual(18);
  });

  it("the default (retries-off) path never reaches it: a failed audit makes no clue regeneration", async () => {
    delete process.env.AGENT_PRE9_ENABLE_LLM_RETRIES;
    mockAuditFairPlay.mockResolvedValue({ overallStatus: "fail", violations: audit.violations, warnings: [], recommendations: [], cost: 0.01 });
    try { await runAgent6(agent6Ctx()); } catch { /* a failed audit may end the stage; only the call count matters */ }
    expect(mockAuditFairPlay).toHaveBeenCalled();
    expect(mockExtractClues).not.toHaveBeenCalled();
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

describe("A5-11 / A5-D04 — Agent 6's fair-play clue regeneration carries the strict contract and locked facts", () => {
  const regenerate = async (on: boolean) => {
    setFlag(on);
    process.env.AGENT_PRE9_ENABLE_LLM_RETRIES = "true";
    mockAuditFairPlay
      .mockResolvedValueOnce({
        overallStatus: "fail",
        violations: [{ severity: "minor", rule: "Clue Visibility", description: "Need earlier clue visibility.", suggestion: "Move one clue earlier." }],
        warnings: [], recommendations: [], cost: 0.03,
      })
      .mockResolvedValueOnce({ overallStatus: "pass", violations: [], warnings: [], recommendations: [], cost: 0.04 });
    mockExtractClues.mockResolvedValue({
      clues: [
        { id: "clue_anchor", sourceInCML: "CASE.inference_path.steps[0].observation", description: "Grease marked the key slot before supper.", pointsTo: "Timeline tampering occurred before the test scene.", placement: "early", criticality: "essential", evidenceType: "observation", supportsInferenceStep: 1 },
        { id: "clue_bridge", sourceInCML: "CASE.inference_path.steps[0].correction", description: "Witness notes conflict with the expected clock order.", pointsTo: "Contradiction narrows the timeline path.", placement: "mid", criticality: "essential", evidenceType: "contradiction", supportsInferenceStep: 1 },
        { id: "clue_late_support", sourceInCML: "CASE.inference_path.steps[0].required_evidence[0]", description: "A porter recalled a scraping sound in the corridor.", pointsTo: "Supports movement reconstruction without introducing new facts.", placement: "late", criticality: "essential", evidenceType: "observation", supportsInferenceStep: 1 },
      ],
      redHerrings: [],
      clueTimeline: { early: ["clue_anchor"], mid: ["clue_bridge"], late: ["clue_late_support"] },
      fairPlayChecks: { allEssentialCluesPresent: true, noNewFactsIntroduced: true, redHerringsDontBreakLogic: true, redHerringBudgetMet: true },
      cost: 0.02,
    });
    await runAgent6(agent6Ctx());
    expect(mockExtractClues).toHaveBeenCalledTimes(1);
    return mockExtractClues.mock.calls[0][1];
  };

  it("flag OFF: the payload omits them (today)", async () => {
    const payload = await regenerate(false);
    expect("strictContract" in payload).toBe(false);
    expect("lockedFacts" in payload).toBe(false);
  });

  it("flag ON: the payload carries them", async () => {
    const payload = await regenerate(true);
    expect(payload.lockedFacts).toBe(LOCKED);
    expect(payload.strictContract).toBeTruthy();
    expect(Object.keys(payload.strictContract).sort()).toEqual([
      "requiredDirectCulpritClue", "requiredIdToSourceMappings", "requiredLateClueSlot", "requiredStepCoverageFloors", "strictSourcePaths",
    ]);
  });
});
