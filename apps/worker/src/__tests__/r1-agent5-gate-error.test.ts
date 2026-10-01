/**
 * A5-06 (R1) — every Agent 5 hard gate now throws through `failAgent5(message, gate)`, and the
 * failure-class label each site emits is UNCHANGED: for every site the typed classifier returns exactly
 * what the legacy message regex returns for that site's message.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const forced = vi.hoisted(() => ({ gate: "" as string }));

vi.mock("../jobs/clue-contracts/contracts.js", async (importOriginal) => {
  const real: any = await importOriginal();
  const issue = (m: string) => [{ message: m, severity: "critical" }];
  return {
    ...real,
    repairInvalidSourcePaths: () => [],
    reconcileModelAudit: () => undefined,
    repairCastNamePathConsistency: () => [],
    sanitizeEraTimeStyleInClues: () => [],
    repairLockedFactClueTimeTranspositions: () => [],
    synthesizeMissingCulpritDiscriminatingClues: () => [],
    checkSourcePathValidity: () => ({ issues: forced.gate === "source_path" ? issue("bad path") : [] }),
    checkInferenceStepBounds: () => (forced.gate === "step_index" ? issue("step 9") : []),
    checkCastNamePathConsistency: () => (forced.gate === "cast_path" ? issue("cast") : []),
    checkModelAuditConsistency: () => (forced.gate === "audit_consistency" ? issue("audit") : []),
    checkEraTimeStyleInClues: () => (forced.gate === "era_time_style" ? issue("9:15") : []),
    findLockedFactClueTimeConflicts: () => (forced.gate === "time_conflict" ? ["clock disagrees"] : []),
    findCulpritDiscriminatingGaps: () => (forced.gate === "culprit_evidence" ? ["Eleanor Vance"] : []),
    enforceAgent5DeterministicContracts: () => {
      if (forced.gate === "deterministic_contract") throw new Error("Agent 5 strict contract gate failed: late slot missing");
      return { warnings: [] };
    },
    findRedHerringOverlapDetails: () =>
      forced.gate === "red_herring_overlap"
        ? [{ redHerringId: "rh_1", overlapScore: 9, matchedStepIndexes: [1], matchedCorrectionWords: ["clock"] }]
        : [],
  };
});

import { Agent5GateError, AGENT5_GATE_LABEL, classifyAgent5Failure, classifyAgent5FailureMessage, type Agent5Gate } from "../jobs/agents/agent5/gate-error.js";
import { applyFinalCoverageRepairAndGate, runDeterministicClueChecks } from "../jobs/agents/agent5/evidence-remediation.js";
import { separateRedHerringsFromSolution } from "../jobs/agents/agent5/coverage-retries.js";
import { extractInitialClues } from "../jobs/agents/agent5/extraction.js";

type Failure = { message: string; gate?: Agent5Gate };
const fakeRun = (failures: Failure[]): any => ({
  clueDensity: "moderate",
  strictPromptFeedbackBase: undefined,
  proactiveFirstPassFeedback: undefined,
  mergeStrictPromptFeedback: () => undefined,
  cluesStart: 0,
  recordHardFailPhaseScore: () => undefined,
  extractWithAttempt: async () => { throw new SyntaxError("Unexpected token } in JSON"); },
  failAgent5: (message: string, gate?: Agent5Gate): never => {
    failures.push({ message, gate });
    throw gate ? new Agent5GateError(gate, message) : new Error(message);
  },
});
const fakeCtx = (): any => ({
  cml: { CASE: { inference_path: { steps: [] }, cast: [] } },
  warnings: [],
  errors: [],
  hardLogicDevices: { devices: [] },
  reportProgress: () => undefined,
  inputs: {},
});
const clues = (): any => ({ clues: [], redHerrings: [{ id: "rh_1", description: "a clock" }] });
const snapshot = (critical: string[]) => (): any => ({
  coverageResult: { uncoveredSteps: [], hasCriticalGaps: critical.length > 0 },
  falseAssumptionIssues: [],
  discrimTestIssues: [],
  allCoverageIssues: critical.map((message) => ({ severity: "critical", message })),
});

/** Drive one site; return the failure it raised. */
const trigger = async (gate: Agent5Gate, coverageMessages: string[] = ["step 3 has no clue"]): Promise<Failure> => {
  forced.gate = gate;
  const failures: Failure[] = [];
  const run = fakeRun(failures);
  const ctx = fakeCtx();
  const go = async () => {
    if (gate === "extraction_payload") return extractInitialClues(ctx, run, {} as any);
    if (gate === "red_herring_overlap") return separateRedHerringsFromSolution(ctx, run, {} as any, clues());
    if (gate === "deterministic_contract") return applyFinalCoverageRepairAndGate(ctx, run, clues(), snapshot([])(), snapshot([]), undefined);
    if (gate === "coverage") return applyFinalCoverageRepairAndGate(ctx, run, clues(), snapshot([])(), snapshot(coverageMessages), undefined);
    return runDeterministicClueChecks(ctx, run, clues());
  };
  const err = await go().then(() => null, (e) => e);
  expect(err).toBeInstanceOf(Agent5GateError);
  expect(err.gate).toBe(gate);
  expect(String(err)).toBe(`Error: ${err.message}`); // name unchanged
  expect(failures).toHaveLength(1);
  return failures[0];
};

// Today's label per site — what the legacy regex gave the message each site emits.
const EXPECTED: Record<Agent5Gate, string> = {
  extraction_payload: "agent5.unknown_failure",
  red_herring_overlap: "agent5.red_herring_overlap",
  source_path: "agent5.invalid_source_path",
  step_index: "agent5.unknown_failure",
  cast_path: "agent5.unknown_failure",
  audit_consistency: "agent5.unknown_failure",
  era_time_style: "agent5.time_style_violation",
  time_conflict: "agent5.unknown_failure",
  culprit_evidence: "agent5.discriminating_id_coverage",
  deterministic_contract: "agent5.unknown_failure",
  coverage: "agent5.unknown_failure",
};

beforeEach(() => { forced.gate = ""; });

describe("A5-06 — each failAgent5 site names its gate and keeps today's label", () => {
  for (const gate of Object.keys(EXPECTED) as Agent5Gate[]) {
    it(`${gate}`, async () => {
      const { message, gate: raised } = await trigger(gate);
      expect(raised).toBe(gate);
      expect(classifyAgent5FailureMessage(message)).toBe(EXPECTED[gate]); // the old classifier
      expect(classifyAgent5Failure(message, raised)).toBe(EXPECTED[gate]); // the new one agrees
    });
  }

  it("a by_message gate still follows its message text (coverage naming an evidence id)", async () => {
    const { message, gate } = await trigger("coverage", ["discriminating test evidence id clue_9 is missing"]);
    expect(classifyAgent5FailureMessage(message)).toBe("agent5.discriminating_id_coverage");
    expect(classifyAgent5Failure(message, gate)).toBe("agent5.discriminating_id_coverage");
  });

  it("every constant label equals the regex verdict on that gate's fixed text, whatever the count", () => {
    const templates: Partial<Record<Agent5Gate, (n: number) => string>> = {
      source_path: (n) => `Agent 5 source-path gate failed with ${n} invalid source path(s).`,
      step_index: (n) => `Agent 5 step-index gate failed with ${n} out-of-range inference step reference(s).`,
      cast_path: (n) => `Agent 5 cast-path consistency gate failed with ${n} issue(s).`,
      audit_consistency: (n) => `Agent 5 audit-consistency gate failed with ${n} mismatch(es).`,
      era_time_style: (n) => `Agent 5 era time-style gate failed with ${n} digit-based time issue(s).`,
      time_conflict: (n) => `Agent 5 CML-clue consistency gate failed (${n} time conflict(s)).`,
      extraction_payload: () => "Agent 5 extraction failed on malformed model payload in deterministic mode",
      red_herring_overlap: (n) => `Agent 5 red-herring overlap gate failed after deterministic sanitization. Overlapping red herring(s): rh_${n}, source path evidence id`,
    };
    for (const [gate, make] of Object.entries(templates) as [Agent5Gate, (n: number) => string][]) {
      for (const n of [0, 1, 7, 123]) {
        expect(AGENT5_GATE_LABEL[gate]).toBe(classifyAgent5FailureMessage(make(n)));
      }
    }
  });

  it("an untyped failure keeps the regex", () => {
    expect(classifyAgent5Failure("Agent 5 era time-style gate failed")).toBe("agent5.time_style_violation");
    expect(classifyAgent5Failure("something else")).toBe("agent5.unknown_failure");
  });
});
