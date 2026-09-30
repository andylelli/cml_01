import { describe, expect, it } from "vitest";
import { ScoreAggregator } from "../aggregator.js";
import { getThreshold } from "../thresholds.js";
import type { PhaseScore } from "../types.js";

/**
 * SCO-04 — two resolvers answer "what is this phase's bar": the aggregator DISPLAYS a threshold looked up
 * by the orchestrator's phase id, and DECIDES `passed` by the scorer's own agent name. They disagreed for
 * Agent 3b under HONEST_SCORERS=enforce (display 85, decide 75 — fixed in CR-06, SCO-D02). This pins
 * agreement for every live (phase id, scorer name) pair in standard mode — the only mode any caller
 * uses — so the next drift fails here instead of in a report.
 */
const LIVE_PAIRS: Array<[phaseId: string, scorerNames: string[]]> = [
  ["agent1_setting", ["agent1-setting-refinement", "agent1-setting"]],
  ["agent2_cast", ["agent2-cast"]],
  ["agent2b_profiles", ["agent2b-character-profiles"]],
  ["agent2c_location_profiles", ["agent2c-location-profiles", "agent2c-location"]],
  ["agent2d_temporal_context", ["agent2d-temporal-context"]],
  ["agent2e_background_context", ["agent2e-background"]],
  ["agent3_cml", ["agent3-cml-generation", "agent3-cml"]],
  ["agent3b_hard_logic_devices", ["agent4-hard-logic", "agent3b-hard-logic"]],
  ["agent5_clues", ["agent5-clue-distribution"]],
  ["agent6_fairplay", ["agent6-fair-play-audit"]],
  ["agent65_world_builder", ["agent65-world-builder"]],
  ["agent7_narrative", ["agent7-narrative-outline", "agent7-narrative"]],
  ["agent8_novelty", ["agent8-novelty-audit"]],
  ["agent9_prose", ["agent9-prose"]],
];

const score = (agent: string): PhaseScore => ({
  agent, total: 100, grade: "A", passed: true, tests: [],
  validation_score: 100, quality_score: 100, completeness_score: 100, consistency_score: 100,
});

describe("displayed and deciding thresholds agree (SCO-04)", () => {
  for (const [phaseId, names] of LIVE_PAIRS) {
    for (const name of names) {
      it(`${phaseId} / ${name}`, () => {
        const agg = new ScoreAggregator({ mode: "standard" });
        agg.upsertPhaseScore(phaseId, phaseId, score(name), 0, 0);
        const displayed = (agg as any).phases[0].threshold;
        expect(getThreshold(name, { mode: "standard" })).toBe(displayed);
      });
    }
  }
});
