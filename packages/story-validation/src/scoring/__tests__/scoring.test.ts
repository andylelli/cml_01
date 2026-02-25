/**
 * Unit tests for the scoring system
 * Covers: grade calculation, threshold logic, component minimums, RetryManager, ScoreAggregator
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateGrade,
  passesThreshold,
  getFailedComponents,
  getThreshold,
  COMPONENT_MINIMUMS,
  DEFAULT_THRESHOLDS,
} from "../thresholds.js";
import { ScoreAggregator } from "../aggregator.js";
import { RetryManager } from "../retry-manager.js";
import type { PhaseScore, ThresholdConfig } from "../types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build a passing PhaseScore with all components comfortably above minimums */
function makeScore(
  overrides: Partial<PhaseScore> = {},
  agent = "agent2-cast"
): PhaseScore {
  return {
    agent,
    validation_score: 80,
    quality_score: 75,
    completeness_score: 80,
    consistency_score: 75,
    total: 78,
    grade: "C",
    passed: true,
    tests: [],
    ...overrides,
  };
}

const standardConfig: ThresholdConfig = { mode: "standard" };
const strictConfig: ThresholdConfig = { mode: "strict" };
const lenientConfig: ThresholdConfig = { mode: "lenient" };

// ─── Grade Calculation ────────────────────────────────────────────────────────

describe("calculateGrade", () => {
  it("returns A for 90 and above", () => {
    expect(calculateGrade(90)).toBe("A");
    expect(calculateGrade(95)).toBe("A");
    expect(calculateGrade(100)).toBe("A");
  });

  it("returns B for 80–89", () => {
    expect(calculateGrade(80)).toBe("B");
    expect(calculateGrade(85)).toBe("B");
    expect(calculateGrade(89)).toBe("B");
  });

  it("returns C for 70–79", () => {
    expect(calculateGrade(70)).toBe("C");
    expect(calculateGrade(75)).toBe("C");
    expect(calculateGrade(79)).toBe("C");
  });

  it("returns D for 60–69", () => {
    expect(calculateGrade(60)).toBe("D");
    expect(calculateGrade(65)).toBe("D");
    expect(calculateGrade(69)).toBe("D");
  });

  it("returns F for below 60", () => {
    expect(calculateGrade(59)).toBe("F");
    expect(calculateGrade(0)).toBe("F");
  });
});

// ─── Threshold Resolution ─────────────────────────────────────────────────────

describe("getThreshold", () => {
  it("returns phase-specific strict threshold for agent4-hard-logic", () => {
    // strict mode has agent4-hard-logic = 90
    expect(getThreshold("agent4-hard-logic", strictConfig)).toBe(90);
  });

  it("returns DEFAULT_THRESHOLDS value in standard mode", () => {
    expect(getThreshold("agent2-cast", standardConfig)).toBe(DEFAULT_THRESHOLDS["agent2-cast"]);
    expect(getThreshold("agent4-hard-logic", standardConfig)).toBe(DEFAULT_THRESHOLDS["agent4-hard-logic"]);
  });

  it("uses override when provided", () => {
    const cfg: ThresholdConfig = { mode: "standard", overrides: { "agent2-cast": 90 } };
    expect(getThreshold("agent2-cast", cfg)).toBe(90);
  });

  it("falls back to 75 for unknown agents in standard mode", () => {
    expect(getThreshold("agent-unknown", standardConfig)).toBe(75);
  });
});

// ─── passesThreshold ──────────────────────────────────────────────────────────

describe("passesThreshold", () => {
  it("passes when composite meets threshold and all components are above minimums", () => {
    const score = makeScore({ agent: "agent2-cast", total: 80 });
    expect(passesThreshold(score, standardConfig)).toBe(true);
  });

  it("fails when composite is below threshold even if components are fine", () => {
    const score = makeScore({ agent: "agent2-cast", total: 60 }); // threshold=75
    expect(passesThreshold(score, standardConfig)).toBe(false);
  });

  it("fails when validation_score is below minimum (60)", () => {
    const score = makeScore({
      agent: "agent2-cast",
      total: 80,
      validation_score: 59, // below COMPONENT_MINIMUMS.validation_score
    });
    expect(passesThreshold(score, standardConfig)).toBe(false);
  });

  it("fails when quality_score is below minimum (50)", () => {
    const score = makeScore({
      agent: "agent2-cast",
      total: 80,
      quality_score: 49,
    });
    expect(passesThreshold(score, standardConfig)).toBe(false);
  });

  it("fails when completeness_score is below minimum (60)", () => {
    const score = makeScore({
      agent: "agent2-cast",
      total: 80,
      completeness_score: 59,
    });
    expect(passesThreshold(score, standardConfig)).toBe(false);
  });

  it("fails when consistency_score is below minimum (50)", () => {
    const score = makeScore({
      agent: "agent2-cast",
      total: 80,
      consistency_score: 49,
    });
    expect(passesThreshold(score, standardConfig)).toBe(false);
  });

  it("passes when components are exactly at their minimums", () => {
    const score = makeScore({
      agent: "agent2-cast",
      total: 80,
      validation_score: COMPONENT_MINIMUMS.validation_score,   // exactly 60
      quality_score: COMPONENT_MINIMUMS.quality_score,         // exactly 50
      completeness_score: COMPONENT_MINIMUMS.completeness_score, // exactly 60
      consistency_score: COMPONENT_MINIMUMS.consistency_score,  // exactly 50
    });
    expect(passesThreshold(score, standardConfig)).toBe(true);
  });

  it("strict mode raises the bar — a score of 80 fails agent4-hard-logic under strict", () => {
    // strict has agent4-hard-logic = 90
    const score = makeScore({ agent: "agent4-hard-logic", total: 80 });
    expect(passesThreshold(score, strictConfig)).toBe(false);
  });

  it("lenient mode lowers the bar — a score of 68 passes agent1-background under lenient", () => {
    // lenient default = 65
    const score = makeScore({ agent: "agent1-background", total: 68 });
    expect(passesThreshold(score, lenientConfig)).toBe(true);
  });
});

// ─── getFailedComponents ──────────────────────────────────────────────────────

describe("getFailedComponents", () => {
  it("returns empty array when all components meet minimums", () => {
    const score = makeScore();
    expect(getFailedComponents(score)).toEqual([]);
  });

  it("reports validation failure", () => {
    const score = makeScore({ validation_score: 50 });
    const failed = getFailedComponents(score);
    expect(failed).toHaveLength(1);
    expect(failed[0]).toMatch(/validation/);
  });

  it("reports multiple failures", () => {
    const score = makeScore({ validation_score: 50, completeness_score: 40 });
    const failed = getFailedComponents(score);
    expect(failed).toHaveLength(2);
    expect(failed.some((f) => f.includes("validation"))).toBe(true);
    expect(failed.some((f) => f.includes("completeness"))).toBe(true);
  });

  it("reports all four failures when everything is at zero", () => {
    const score = makeScore({
      validation_score: 0,
      quality_score: 0,
      completeness_score: 0,
      consistency_score: 0,
    });
    expect(getFailedComponents(score)).toHaveLength(4);
  });
});

// ─── RetryManager ─────────────────────────────────────────────────────────────

describe("RetryManager", () => {
  let manager: RetryManager;

  beforeEach(() => {
    // Pass a non-existent path so it falls back to getDefaultConfig()
    manager = new RetryManager("/non-existent/path/retry-limits.yaml");
  });

  it("allows retry when no retries have been recorded yet", () => {
    expect(manager.canRetry("agent2-cast")).toBe(true);
  });

  it("blocks retry after per-agent limit is reached", () => {
    // agent2-cast default max_retries = 3
    manager.recordRetry("agent2-cast", "below threshold", 60);
    manager.recordRetry("agent2-cast", "below threshold", 65);
    manager.recordRetry("agent2-cast", "below threshold", 68);
    expect(manager.canRetry("agent2-cast")).toBe(false);
  });

  it("tracks retry count correctly", () => {
    manager.recordRetry("agent7-narrative", "low quality", 55);
    manager.recordRetry("agent7-narrative", "low completeness", 60);
    expect(manager.getRetryCount("agent7-narrative")).toBe(2);
  });

  it("returns 0 for agents with no retries", () => {
    expect(manager.getRetryCount("agent9-prose")).toBe(0);
  });

  it("returns correct max retries for known agents", () => {
    expect(manager.getMaxRetries("agent4-hard-logic")).toBe(4); // most complex
    expect(manager.getMaxRetries("agent2-cast")).toBe(3);
  });

  it("returns exponential backoff delay based on current retry count for agent4", () => {
    // agent4 uses exponential with base 2000ms; retryCount starts at 0 → 2000 * 2^0 = 2000
    const delay = manager.getBackoffDelay("agent4-hard-logic");
    expect(delay).toBe(2000);
  });

  it("returns exponential backoff delay that grows as retry count increases", () => {
    const delay0 = manager.getBackoffDelay("agent4-hard-logic"); // retryCount = 0 → 2000
    manager.recordRetry("agent4-hard-logic", "low score", 60);   // retryCount → 1
    const delay1 = manager.getBackoffDelay("agent4-hard-logic"); // retryCount = 1 → 4000
    expect(delay1).toBeGreaterThan(delay0);
  });

  it("returns zero delay for 'none' backoff strategy", () => {
    // agent6-temporal-context uses none
    const delay = manager.getBackoffDelay("agent6-temporal-context");
    expect(delay).toBe(0);
  });

  it("returns false for unknown agent (no config entry)", () => {
    expect(manager.canRetry("agent-does-not-exist")).toBe(false);
  });

  it("shouldAbortOnMaxRetries returns the global config value", () => {
    // default config sets abort_on_max_retries: true
    expect(manager.shouldAbortOnMaxRetries()).toBe(true);
  });

  it("records retry history entries", () => {
    manager.recordRetry("agent9-prose", "validation failure", 45);
    const history = manager.getRetryHistory("agent9-prose");
    expect(history).toHaveLength(1);
    expect(history[0].reason).toBe("validation failure");
    expect(history[0].score_before).toBe(45);
    expect(history[0].attempt).toBe(1);
  });
});

// ─── ScoreAggregator ──────────────────────────────────────────────────────────

describe("ScoreAggregator", () => {
  const metadata = {
    story_id: "test-story-1",
    started_at: new Date("2026-02-24T10:00:00Z"),
    completed_at: new Date("2026-02-24T10:05:00Z"),
  };

  it("produces a report with correct overall score (average of phase totals)", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast Design", makeScore({ total: 80 }), 1000);
    agg.addPhaseScore("agent7-narrative", "Narrative Outline", makeScore({ total: 60, agent: "agent7-narrative" }), 1500);
    const report = agg.generateReport(metadata);
    expect(report.overall_score).toBeCloseTo(70); // (80 + 60) / 2
  });

  it("marks overall report as passed only when all phases pass", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore(
      "agent2-cast",
      "Cast Design",
      makeScore({ total: 80, passed: true }),
      1000
    );
    agg.addPhaseScore(
      "agent4-hard-logic",
      "Hard Logic",
      makeScore({ agent: "agent4-hard-logic", total: 60, passed: false }),
      2000
    );
    const report = agg.generateReport(metadata);
    expect(report.passed).toBe(false);
  });

  it("marks report passed when all phases pass", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast Design", makeScore({ total: 85 }), 1000);
    agg.addPhaseScore(
      "agent7-narrative",
      "Narrative",
      makeScore({ agent: "agent7-narrative", total: 80 }),
      1500
    );
    const report = agg.generateReport(metadata);
    expect(report.passed).toBe(true);
  });

  it("assigns correct grade to overall score", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast Design", makeScore({ total: 92 }), 1000);
    const report = agg.generateReport(metadata);
    expect(report.overall_grade).toBe("A");
  });

  it("includes all added phases in the report", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast Design", makeScore(), 1000);
    agg.addPhaseScore(
      "agent4-hard-logic",
      "Hard Logic",
      makeScore({ agent: "agent4-hard-logic" }),
      2000
    );
    const report = agg.generateReport(metadata);
    expect(report.phases).toHaveLength(2);
    expect(report.phases.map((p) => p.agent)).toContain("agent2-cast");
    expect(report.phases.map((p) => p.agent)).toContain("agent4-hard-logic");
  });

  it("calculates summary stats: phases_passed and phases_failed", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast", makeScore({ total: 85 }), 1000);
    agg.addPhaseScore(
      "agent4-hard-logic",
      "Hard Logic",
      makeScore({ agent: "agent4-hard-logic", total: 50, passed: false, validation_score: 40 }),
      2000
    );
    const report = agg.generateReport(metadata);
    expect(report.summary.phases_passed).toBe(1);
    expect(report.summary.phases_failed).toBe(1);
  });

  it("uses user_id as project_id when provided, story_id as run_id", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast", makeScore(), 1000);
    const report = agg.generateReport({ ...metadata, story_id: "run-abc", user_id: "proj-xyz" });
    expect(report.project_id).toBe("proj-xyz");
    expect(report.run_id).toBe("run-abc");
  });

  it("falls back to story_id as project_id when user_id is absent", () => {
    const agg = new ScoreAggregator(standardConfig);
    agg.addPhaseScore("agent2-cast", "Cast", makeScore(), 1000);
    const report = agg.generateReport({ ...metadata, story_id: "proj-abc" });
    expect(report.project_id).toBe("proj-abc");
  });

  it("produces empty-phase report with zero score when no phases added", () => {
    const agg = new ScoreAggregator(standardConfig);
    const report = agg.generateReport(metadata);
    expect(report.overall_score).toBe(0);
    expect(report.phases).toHaveLength(0);
    expect(report.passed).toBe(true); // vacuously true — no phases failed
  });
});
