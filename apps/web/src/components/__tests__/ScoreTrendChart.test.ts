import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreTrendChart from "../ScoreTrendChart.vue";
import type { GenerationReport, ScoringPhaseReport, ScoringPhaseScore } from "../types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeScore(): ScoringPhaseScore {
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
  };
}

function makePhase(): ScoringPhaseReport {
  return {
    agent: "agent1-setting",
    phase_name: "Setting Refinement",
    score: makeScore(),
    duration_ms: 12_000,
    cost: 0.25,
    threshold: 75,
    passed: true,
    tests: [],
  };
}

function makeReport(
  score: number,
  passed = true,
  date = "2026-01-01T00:00:00Z"
): GenerationReport {
  return {
    project_id: "proj-1",
    run_id: "run-1",
    generated_at: date,
    total_duration_ms: 60_000,
    total_cost: 1.0,
    overall_score: score,
    overall_grade: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
    passed,
    phases: [makePhase()],
    summary: {
      phases_passed: passed ? 1 : 0,
      phases_failed: passed ? 0 : 1,
      total_phases: 1,
      pass_rate: passed ? 100 : 0,
      weakest_phase: "agent1-setting",
      strongest_phase: "agent1-setting",
      retry_stats: {
        total_retries: 0,
        phases_retried: 0,
        retry_rate: "0%",
        retried_phases: [],
      },
      total_cost: 1.0,
    },
    threshold_config: { mode: "standard" },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ScoreTrendChart", () => {
  it("shows empty state message when fewer than 2 history items", () => {
    const wrapper = mount(ScoreTrendChart, { props: { history: [] } });
    expect(wrapper.text()).toContain("At least 2 generations needed to show trend");
  });

  it("shows empty state with exactly 1 history item", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(80)] },
    });
    expect(wrapper.text()).toContain("At least 2 generations needed to show trend");
  });

  it("renders SVG chart when 2 or more history items provided", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(75), makeReport(82)] },
    });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders polyline in SVG for 2+ points", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(75), makeReport(82)] },
    });
    expect(wrapper.find("polyline").exists()).toBe(true);
  });

  it("shows the 'Score Trend' heading", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(75), makeReport(82)] },
    });
    expect(wrapper.text()).toContain("Score Trend");
  });

  it("displays average score correctly", () => {
    // avg of 80 and 90 = 85
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(80), makeReport(90)] },
    });
    expect(wrapper.text()).toContain("85");
  });

  it("shows ↑ Improving trend when last score exceeds first by > 3", () => {
    // first=70, last=80 → diff=10 → improving
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(70), makeReport(80)] },
    });
    expect(wrapper.text()).toContain("↑ Improving");
  });

  it("shows ↓ Declining trend when last score is more than 3 below first", () => {
    // first=85, last=74 → diff=-11 → declining
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(85), makeReport(74)] },
    });
    expect(wrapper.text()).toContain("↓ Declining");
  });

  it("shows → Stable trend when difference is ≤ 3", () => {
    // first=80, last=82 → diff=2 → stable
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(80), makeReport(82)] },
    });
    expect(wrapper.text()).toContain("→ Stable");
  });

  it("renders one circle per data point", () => {
    const history = [makeReport(75), makeReport(80), makeReport(85)];
    const wrapper = mount(ScoreTrendChart, { props: { history } });
    const circles = wrapper.findAll("circle");
    expect(circles).toHaveLength(3);
  });

  it("shows legend items for Passed, Failed, and Threshold", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(75), makeReport(82)] },
    });
    const text = wrapper.text();
    expect(text).toContain("Passed");
    expect(text).toContain("Failed");
    expect(text).toContain("Threshold");
  });

  it("renders threshold dashed line at 75", () => {
    const wrapper = mount(ScoreTrendChart, {
      props: { history: [makeReport(75), makeReport(82)] },
    });
    // Dashed line is rendered as a <line> with stroke-dasharray
    const lines = wrapper.findAll("line");
    const dashedLine = lines.find((l) => l.attributes("stroke-dasharray"));
    expect(dashedLine).toBeDefined();
  });
});
