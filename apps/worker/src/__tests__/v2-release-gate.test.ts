import { describe, expect, it } from "vitest";
import { ScoreAggregator } from "@cml/story-validation";
import { recordV2ReleaseGate } from "../jobs/agents/agent9-v2/run.js";

/**
 * v2's own gate is the run report's release gate (only v1 ever wrote release_gate_summary). MEASURED on
 * mystery-1790896091454: without it a 10-chapter book with no stop reported "failed — phases failed threshold".
 */
const meta = { story_id: "run_v2", started_at: new Date(0), completed_at: new Date(1000), user_id: "proj_v2" };
const reportFor = (result: { ship: boolean; stops: string[]; gateWarnings: string[] }) => {
  const scoreAggregator = new ScoreAggregator({ mode: "standard" } as any);
  // a failing phase, so the old phase-threshold fallback would say "failed"
  scoreAggregator.upsertPhaseScore("agent7_narrative", "Narrative Outline", {
    agent: "agent7-narrative", validation_score: 40, quality_score: 40, completeness_score: 40, consistency_score: 40,
    total: 40, grade: "F", passed: false, tests: [],
  } as any, 0, 0);
  recordV2ReleaseGate({ scoreAggregator, runId: "run_v2", projectId: "proj_v2" } as any, result);
  return scoreAggregator.generateReport(meta);
};

describe("v2 release gate → run outcome", () => {
  it("a clean gate ships: passed, even with a phase under threshold", () => {
    const r = reportFor({ ship: true, stops: [], gateWarnings: [] });
    expect(r.release_gate_outcome?.status).toBe("passed");
    expect(r.run_outcome).toBe("passed");
  });
  it("gate warnings ship as needs-review: status warning, outcome passed", () => {
    const r = reportFor({ ship: true, stops: [], gateWarnings: ["clue_missing ch3"] });
    expect(r.release_gate_outcome?.status).toBe("warning");
    expect(r.run_outcome).toBe("passed");
  });
  it("a fair-play stop is a hard stop: aborted", () => {
    const r = reportFor({ ship: false, stops: ["the decisive clue clue_7 is on no page before the reveal"], gateWarnings: [] });
    expect(r.release_gate_outcome?.status).toBe("failed");
    expect(r.run_outcome).toBe("aborted");
  });
});
