import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAuditFairPlay = vi.hoisted(() => vi.fn());
const mockExtractClues = vi.hoisted(() => vi.fn());
const mockBlindReaderSimulation = vi.hoisted(() => vi.fn());

vi.mock("@cml/prompts-llm", () => ({
  auditFairPlay: (...args: any[]) => mockAuditFairPlay(...args),
  extractClues: (...args: any[]) => mockExtractClues(...args),
  blindReaderSimulation: (...args: any[]) => mockBlindReaderSimulation(...args),
  buildCMLPrompt: vi.fn(),
  reviseCml: vi.fn(),
  // A_56 5-A: shared.ts applyClueGuardrails now imports this; stub as a no-op (no collisions).
  checkPointsToDistinctness: () => ({ ok: true, collisions: [] }),
  // 17-hitting-90 P1.3: @cml/prose-engine's contract now reads the means-link trace through these;
  // the module graph reaches them from here. Stubbed as "no trace", which is what a case without
  // A_102's trace carries.
  provesTheAct: () => ({ verdict: "UNKNOWN", detail: "", linkingTraces: [], weaponTracesNamingNobody: [], culpritTracesWithoutWeapon: [], usedInInferencePath: false, usedByStep: undefined }),
  splitMeansLinkTrace: () => undefined,
}));

vi.mock("@cml/story-validation", () => ({
  validateGenreStructure: () => ({ valid: true, errors: [], warnings: [] }),
  getGenerationParams: () => ({
    agent6_fairplay: {
      params: {
        retries: {
          max_retry_cost_usd: 0.15,
          max_fair_play_attempts: 2,
          max_total_attempts_with_targeted_regen: 3,
        },
        blind_reader: {
          pass_criteria: {
            min_confidence: "likely",
            max_remediation_cycles: 0,
          },
        },
      },
    },
  }),
}));

import { runAgent6 } from "../jobs/agents/agent6-run.js";

describe("agent6-run flow", () => {
  beforeEach(() => {
    mockAuditFairPlay.mockReset();
    mockExtractClues.mockReset();
    mockBlindReaderSimulation.mockReset();
    mockBlindReaderSimulation.mockResolvedValue({
      suspectedCulprit: "Iwan Hale",
      reasoning: "Evidence supports the same culprit.",
      confidenceLevel: "certain",
      missingInformation: [],
      cost: 0,
      durationMs: 1,
    });
  });

  it("runs one deterministic blind-reader rescue pass (the only blind-reader remediation since A6-Q01)", async () => {
    mockAuditFairPlay.mockResolvedValue({
      overallStatus: "pass",
      violations: [],
      warnings: [],
      recommendations: [],
      cost: 0.01,
    });

    mockBlindReaderSimulation
      .mockResolvedValueOnce({
        suspectedCulprit: "Agnes Pike",
        reasoning: "Initial read favors Agnes.",
        confidenceLevel: "likely",
        missingInformation: ["Need culprit-unique evidence wording."],
        cost: 0.001,
        durationMs: 2,
      })
      .mockResolvedValueOnce({
        suspectedCulprit: "Iwan Hale",
        reasoning: "Deterministic contract wording now points uniquely to Iwan.",
        confidenceLevel: "likely",
        missingInformation: [],
        cost: 0.001,
        durationMs: 2,
      });

    const ctx = {
      client: {},
      inputs: { targetLength: "medium", tone: "Golden Age Mystery", theme: "clock-room murder" },
      runId: "run-agent6-deterministic-rescue",
      projectId: "proj-agent6-deterministic-rescue",
      reportProgress: () => undefined,
      warnings: [],
      errors: [],
      enableScoring: false,
      scoreAggregator: undefined,
      savePartialReport: async () => undefined,
      agentCosts: { agent5_clues: 0 },
      agentDurations: {},
      criticalFairPlayRules: new Set(["Logical Deducibility", "No Withholding", "Discriminating Test Timing"]),
      cml: {
        CASE: {
          quality_controls: { clue_visibility_requirements: { late_min: 0 } },
          cast: [
            {
              name: "Iwan Hale",
              culprit_eligibility: "eligible",
              access_plausibility: "Had after-hours key access",
              alibi_window: "after supper",
            },
            {
              name: "Agnes Pike",
              culprit_eligibility: "eligible",
              access_plausibility: "limited",
              alibi_window: "in the pantry",
            },
          ],
          false_assumption: { statement: "The clock timeline is accurate." },
          culpability: { culprits: ["Iwan Hale"] },
          inference_path: {
            steps: [
              {
                observation: "Grease marked the key slot before supper.",
                correction: "The displayed time was staged by tampering.",
                required_evidence: ["Witness heard mismatched chimes."],
              },
            ],
          },
          hidden_model: {
            mechanism: { description: "Clock stoppage was staged by tampering with the movement." },
          },
          discriminating_test: {
            design: "Use key-grease and chime mismatch to isolate culprit",
            knowledge_revealed: "Clock stoppage was staged",
            evidence_clues: ["clue_1", "clue_2", "clue_3"],
          },
          prose_requirements: {
            clue_to_scene_mapping: [
              { clue_id: "clue_1" },
              { clue_id: "clue_2" },
              { clue_id: "clue_3" },
            ],
          },
        },
      },
      clues: {
        clues: [
          {
            id: "clue_1",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "Grease marked the key slot before supper.",
            pointsTo: "The mechanism was accessed before the stated timeline.",
            placement: "early",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_2",
            sourceInCML: "CASE.inference_path.steps[0].correction",
            description: "The displayed time was staged by tampering.",
            pointsTo: "Contradicts the initial assumption.",
            placement: "early",
            criticality: "essential",
            evidenceType: "contradiction",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_3",
            sourceInCML: "CASE.inference_path.steps[0].required_evidence[0]",
            description: "Witness heard mismatched chimes.",
            pointsTo: "Supports the corrected timeline.",
            placement: "mid",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: { early: ["clue_1", "clue_2"], mid: ["clue_3"], late: [] },
      },
    } as any;

    await runAgent6(ctx);

    expect(mockBlindReaderSimulation).toHaveBeenCalledTimes(2);
    expect(ctx.warnings.some((entry: string) => /blind-reader deterministic rescue/i.test(entry))).toBe(true);
  });
});
