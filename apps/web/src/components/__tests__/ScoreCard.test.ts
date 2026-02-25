import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreCard from "../ScoreCard.vue";
import type { GenerationReport, ScoringPhaseReport, ScoringPhaseScore } from "../types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeScore(overrides: Partial<ScoringPhaseScore> = {}): ScoringPhaseScore {
  return {
    agent: "agent1-setting",
    validation_score: 90,
    quality_score: 85,
    completeness_score: 80,
    consistency_score: 75,
    total: 85,
    grade: "B",
    passed: true,
    tests: [],
    ...overrides,
  };
}

function makePhase(overrides: Partial<ScoringPhaseReport> = {}): ScoringPhaseReport {
  return {
    agent: "agent1-setting",
    phase_name: "Setting Refinement",
    score: makeScore(),
    duration_ms: 12_000,
    cost: 0.25,
    threshold: 75,
    passed: true,
    tests: [],
    ...overrides,
  };
}

function makeReport(overrides: Partial<GenerationReport> = {}): GenerationReport {
  return {
    project_id: "proj-1",
    run_id: "run-1",
    generated_at: "2026-02-20T10:30:00Z",
    total_duration_ms: 180_000,
    total_cost: 5.45,
    overall_score: 82,
    overall_grade: "B",
    passed: true,
    phases: [makePhase()],
    summary: {
      phases_passed: 9,
      phases_failed: 0,
      total_phases: 9,
      pass_rate: 100,
      weakest_phase: "agent9-prose",
      strongest_phase: "agent1-setting",
      retry_stats: {
        total_retries: 0,
        phases_retried: 0,
        retry_rate: "0%",
        retried_phases: [],
      },
      total_cost: 5.45,
    },
    threshold_config: { mode: "standard" },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ScoreCard", () => {
  it("shows empty state when report is null", () => {
    const wrapper = mount(ScoreCard, { props: { report: null } });
    expect(wrapper.text()).toContain("No quality report available");
    expect(wrapper.text()).toContain("ENABLE_SCORING=true");
  });

  it("does not show grade badge when report is null", () => {
    const wrapper = mount(ScoreCard, { props: { report: null } });
    // No grade letter in content
    expect(wrapper.text()).not.toMatch(/^[ABCDF]$/m);
  });

  it("displays overall grade and score", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    expect(wrapper.text()).toContain("B");
    expect(wrapper.text()).toContain("82");
  });

  it("shows ✓ Passed when report.passed is true", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport({ passed: true }) } });
    expect(wrapper.text()).toContain("✓ Passed");
  });

  it("shows ✗ Failed when report.passed is false", () => {
    const wrapper = mount(ScoreCard, {
      props: {
        report: makeReport({
          passed: false,
          overall_grade: "F",
          overall_score: 55,
        }),
      },
    });
    expect(wrapper.text()).toContain("✗ Failed");
  });

  it("displays formatted total duration", () => {
    // 180_000ms → 3m
    const wrapper = mount(ScoreCard, { props: { report: makeReport({ total_duration_ms: 180_000 }) } });
    expect(wrapper.text()).toContain("3m");
  });

  it("displays cost formatted to 3 decimal places", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport({ total_cost: 5.45 }) } });
    expect(wrapper.text()).toContain("$5.450");
  });

  it("shows phases passed/failed count", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    expect(wrapper.text()).toContain("9✓");
    expect(wrapper.text()).toContain("0✗");
    expect(wrapper.text()).toContain("of 9 total");
  });

  it("shows pass rate percentage", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    expect(wrapper.text()).toContain("100%");
  });

  it("shows weakest phase with friendly label", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    // agent9-prose → "Prose Generation"
    expect(wrapper.text()).toContain("Prose Generation");
  });

  it("shows strongest phase with friendly label", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    // agent1-setting → "Setting Refinement"
    expect(wrapper.text()).toContain("Setting Refinement");
  });

  it("shows 'None needed' when no retries occurred", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    expect(wrapper.text()).toContain("None needed");
  });

  it("shows retry count when retries > 0", () => {
    const report = makeReport();
    report.summary.retry_stats.total_retries = 3;
    report.summary.retry_stats.phases_retried = 2;
    const wrapper = mount(ScoreCard, { props: { report } });
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("2");
  });

  it("shows threshold config mode", () => {
    const wrapper = mount(ScoreCard, { props: { report: makeReport() } });
    expect(wrapper.text()).toContain("standard");
  });

  it("renders grade A in green tone (emerald class)", () => {
    const report = makeReport({ overall_grade: "A", overall_score: 95 });
    const wrapper = mount(ScoreCard, { props: { report } });
    // Grade badge div should have emerald class
    const badge = wrapper.find("[class*='emerald']");
    expect(badge.exists()).toBe(true);
  });

  it("renders grade F in red tone (rose class)", () => {
    const report = makeReport({ overall_grade: "F", overall_score: 40, passed: false });
    const wrapper = mount(ScoreCard, { props: { report } });
    const roseBadge = wrapper.find("[class*='rose']");
    expect(roseBadge.exists()).toBe(true);
  });
});
