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
}));

vi.mock("@cml/story-validation", () => ({
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

  it("retries once on fail, accumulates costs, and updates fair-play handoff state", async () => {
    mockAuditFairPlay
      .mockResolvedValueOnce({
        overallStatus: "fail",
        violations: [
          {
            severity: "minor",
            rule: "Clue Visibility",
            description: "Need earlier clue visibility.",
            suggestion: "Move one clue earlier.",
          },
        ],
        warnings: ["One clue lands too late."],
        recommendations: ["Rebalance placement."],
        cost: 0.03,
      })
      .mockResolvedValueOnce({
        overallStatus: "pass",
        violations: [],
        warnings: [],
        recommendations: [],
        cost: 0.04,
      });

    mockExtractClues.mockResolvedValue({
      clues: [
        {
          id: "clue_anchor",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "Grease marked the key slot before supper.",
          pointsTo: "Timeline tampering occurred before the test scene.",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_bridge",
          sourceInCML: "CASE.inference_path.steps[0].correction",
          description: "Witness notes conflict with the expected clock order.",
          pointsTo: "Contradiction narrows the timeline path.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "contradiction",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_late_support",
          sourceInCML: "CASE.inference_path.steps[0].required_evidence[0]",
          description: "A porter recalled a scraping sound in the corridor.",
          pointsTo: "Supports movement reconstruction without introducing new facts.",
          placement: "late",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: {
        early: ["clue_anchor"],
        mid: ["clue_bridge"],
        late: ["clue_late_support"],
      },
      fairPlayChecks: {
        allEssentialCluesPresent: true,
        noNewFactsIntroduced: true,
        redHerringsDontBreakLogic: true,
      },
      cost: 0.02,
    });

    const ctx = {
      client: {},
      inputs: { targetLength: "medium", tone: "Golden Age Mystery", theme: "clock-room murder" },
      runId: "run-agent6-flow",
      projectId: "proj-agent6-flow",
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
          quality_controls: {
            clue_visibility_requirements: {
              late_min: 0,
            },
          },
          cast: [{ name: "Iwan Hale", alibi_window: "after supper", culprit_eligibility: "eligible" }],
          false_assumption: { statement: "" },
          culpability: { culprits: [] },
          inference_path: {
            steps: [
              {
                observation: "Grease marked the key slot before supper.",
                correction: "The clock timeline was deliberately shifted.",
                required_evidence: ["Witness notes conflict with the expected order."],
              },
            ],
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
          {
            id: "clue_anchor",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "Grease marked the key slot before supper.",
            pointsTo: "Timeline tampering occurred before the test scene.",
            placement: "mid",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_support_early",
            sourceInCML: "CASE.inference_path.steps[0].correction",
            description: "A witness recalled the key being handled before tea.",
            pointsTo: "Supports correction on timeline order.",
            placement: "early",
            criticality: "essential",
            evidenceType: "contradiction",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_support_late",
            sourceInCML: "CASE.inference_path.steps[0].required_evidence[0]",
            description: "A porter heard scraping near the corridor clock.",
            pointsTo: "Corroborates movement sequence.",
            placement: "late",
            criticality: "supporting",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: {
          early: ["clue_support_early"],
          mid: ["clue_anchor"],
          late: ["clue_support_late"],
        },
      },
    } as any;

    await runAgent6(ctx);

    expect(mockAuditFairPlay).toHaveBeenCalledTimes(2);
    expect(mockExtractClues).toHaveBeenCalledTimes(1);
    expect(ctx.fairPlayAudit?.overallStatus).toBe("pass");
    expect(Array.isArray(ctx.allCoverageIssues)).toBe(true);
    expect(ctx.agentCosts.agent5_clues).toBeCloseTo(1.02, 6);
    expect(ctx.agentCosts.agent6_fairplay).toBeCloseTo(0.07, 6);
  });

  it("passes strict first-pass acceptance directives in fair-play feedback payload", async () => {
    mockAuditFairPlay
      .mockResolvedValueOnce({
        overallStatus: "fail",
        violations: [
          {
            severity: "critical",
            rule: "Logical Deducibility",
            description: "Clock-tampering contradiction is not reader-solvable before reveal.",
            suggestion: "Add contradiction chain earlier.",
          },
          {
            severity: "critical",
            rule: "Discriminating Test Timing",
            description: "Discriminating test relies on facts first seen too late.",
            suggestion: "Move dependent clues to early/mid.",
          },
        ],
        warnings: [],
        recommendations: [],
        cost: 0.02,
      })
      .mockResolvedValueOnce({
        overallStatus: "pass",
        violations: [],
        warnings: [],
        recommendations: [],
        cost: 0.02,
      });

    mockExtractClues.mockResolvedValue({
      clues: [
        {
          id: "clue_mechanism_visibility_core",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "Grease traces in the key slot show the clock stoppage was staged before supper.",
          pointsTo: "Clock stoppage was staged by tampering before the discriminating test scene.",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_core_contradiction_chain",
          sourceInCML: "CASE.inference_path.steps[0].correction",
          description: "The observed chime order contradicts the displayed clock time.",
          pointsTo: "Overturns the false assumption that the clock stopped naturally.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "contradiction",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_core_elimination_chain",
          sourceInCML: "CASE.cast[1].alibi_window",
          description: "Agnes Pike remained in the pantry during the tampering window per signed service log.",
          pointsTo: "Eliminates Agnes Pike because corroborated access logs place Agnes Pike away from the study.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "elimination",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: {
        early: ["clue_mechanism_visibility_core"],
        mid: ["clue_core_contradiction_chain", "clue_core_elimination_chain"],
        late: [],
      },
      fairPlayChecks: {
        allEssentialCluesPresent: true,
        noNewFactsIntroduced: true,
        redHerringsDontBreakLogic: true,
      },
      cost: 0.01,
    });

    const ctx = {
      client: {},
      inputs: { targetLength: "medium", tone: "Golden Age Mystery", theme: "clock-room murder" },
      runId: "run-agent6-flow-payload",
      projectId: "proj-agent6-flow-payload",
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
            { name: "Iwan Hale", alibi_window: "after supper", culprit_eligibility: "eligible" },
            { name: "Agnes Pike", alibi_window: "in pantry", culprit_eligibility: "eligible" },
          ],
          false_assumption: { statement: "The clock stopped naturally." },
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
            evidence_clues: ["clue_mechanism_visibility_core"],
          },
        },
      },
      clues: {
        clues: [
          {
            id: "clue_seed",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A porter saw the study door ajar.",
            pointsTo: "Possible access path.",
            placement: "late",
            criticality: "supporting",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: { early: [], mid: [], late: ["clue_seed"] },
      },
    } as any;

    await runAgent6(ctx);

    expect(mockExtractClues).toHaveBeenCalledTimes(1);
    const retryInputs = mockExtractClues.mock.calls[0]?.[1];
    const requiredCluePhrases = Array.isArray(retryInputs?.fairPlayFeedback?.requiredCluePhrases)
      ? retryInputs.fairPlayFeedback.requiredCluePhrases
      : [];
    const targetedClueIds = Array.isArray(retryInputs?.fairPlayFeedback?.targetedClueIds)
      ? retryInputs.fairPlayFeedback.targetedClueIds
      : [];
    const preserveClueIds = Array.isArray(retryInputs?.fairPlayFeedback?.preserveClueIds)
      ? retryInputs.fairPlayFeedback.preserveClueIds
      : [];
    const joined = requiredCluePhrases.join(" ");

    expect(joined).toContain("PAIR CONTRACT");
    expect(joined).toContain("observation -> correction -> elimination");
    expect(joined).toContain("clue_core_contradiction_chain");
    expect(joined).toContain("DISCRIMINATING ID PARITY CONTRACT");
    expect(joined).toContain("CAST PATH COUPLING CONTRACT");
    expect(targetedClueIds).toContain("clue_mechanism_visibility_core");
    expect(preserveClueIds).toContain("clue_seed");
  });
});
