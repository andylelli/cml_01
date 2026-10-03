import { describe, expect, it } from "vitest";
import { ScoreAggregator } from "../aggregator.js";
import type { PhaseScore } from "../types.js";

/**
 * SCO-05 — characterise the run-outcome derivation in `generateReport` over its inputs before splitting
 * it out: the release-gate diagnostic (absent / validation_status / hard stops / warnings), a phase that
 * fails (plainly, with a hard-gate reason, with an infrastructure string), and the prose deliverable's
 * score. Every outcome field is snapshotted, so the split must reproduce them exactly.
 */
const phase = (agent: string, total: number, failure?: string): PhaseScore => ({
  agent, total, grade: total >= 90 ? "A" : total >= 60 ? "D" : "F", passed: total >= 75,
  validation_score: total, quality_score: total, completeness_score: total, consistency_score: total, tests: [],
  failure_reason: failure,
});

type Gate = null | { validation_status?: string; release_gate_hard_stop_count?: number; release_gate_warning_count?: number };
const GATES: Array<[string, Gate]> = [
  ["no-gate", null],
  ["gate-passed", { validation_status: "passed" }],
  ["gate-failed", { validation_status: "failed" }],
  ["gate-hardstop", { validation_status: "passed", release_gate_hard_stop_count: 1 }],
  ["gate-warnings", { validation_status: "unknown", release_gate_warning_count: 2 }],
  ["gate-other", { validation_status: "needs_review" }],
];
const PHASE_SETS: Array<[string, () => Array<[string, PhaseScore]>]> = [
  ["all-pass", () => [["agent1_setting", phase("agent1-setting-refinement", 95)], ["agent2_cast", phase("agent2-cast", 90)]]],
  ["one-fails", () => [["agent1_setting", phase("agent1-setting-refinement", 95)], ["agent2_cast", phase("agent2-cast", 50, "Score below threshold")]]],
  ["hard-gate", () => [["agent1_setting", phase("agent1-setting-refinement", 95)], ["agent2_cast", phase("agent2-cast", 50, "Deterministic hard gate failed: clue visibility")]]],
  ["infra", () => [["agent1_setting", phase("agent1-setting-refinement", 40, "[INFRA_PRECHECK] Azure endpoint DNS resolution failed")]]],
  ["prose-60", () => [["agent1_setting", phase("agent1-setting-refinement", 98)], ["agent9_prose", phase("agent9-prose", 60)]]],
  ["prose-100", () => [["agent1_setting", phase("agent1-setting-refinement", 80)], ["agent9_prose", phase("agent9-prose", 100)]]],
];

describe("generateReport run-outcome matrix (SCO-05)", () => {
  for (const [gName, gate] of GATES) {
    for (const [pName, phases] of PHASE_SETS) {
      it(`${gName} × ${pName}`, () => {
        const agg = new ScoreAggregator({ mode: "standard" });
        for (const [id, s] of phases()) agg.upsertPhaseScore(id, id, s, 0, 0);
        if (gate) agg.upsertDiagnostic("release_gate_summary", "agent9", "Prose", "release_gate_summary", gate as Record<string, unknown>);
        const r = agg.generateReport({ story_id: "run", started_at: new Date(0), completed_at: new Date(1000) } as any);
        const status = r.diagnostics.find((d) => d.key === "normalized_run_status")?.details;
        expect({
          run_outcome: r.run_outcome,
          run_outcome_reason: r.run_outcome_reason,
          passed: r.passed,
          phase_thresholds_met: r.phase_thresholds_met,
          overall_score: r.overall_score,
          overall_grade: r.overall_grade,
          scoring_outcome: r.scoring_outcome,
          release_gate_outcome: r.release_gate_outcome,
          display_status: status,
        }).toMatchSnapshot();
      });
    }
  }
});
