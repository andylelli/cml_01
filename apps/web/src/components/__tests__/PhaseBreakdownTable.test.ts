import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PhaseBreakdownTable from "../PhaseBreakdownTable.vue";
import type { ScoringPhaseReport, ScoringPhaseScore, ScoringTestResult } from "../types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeTest(overrides: Partial<ScoringTestResult> = {}): ScoringTestResult {
  return {
    name: "Era authenticity",
    category: "validation",
    passed: true,
    score: 100,
    weight: 1.0,
    ...overrides,
  };
}

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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("PhaseBreakdownTable", () => {
  it("shows empty state when phases array is empty", () => {
    const wrapper = mount(PhaseBreakdownTable, { props: { phases: [] } });
    expect(wrapper.text()).toContain("No phase data available");
  });

  it("renders phase row with name and score", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase()] },
    });
    expect(wrapper.text()).toContain("Setting Refinement");
    expect(wrapper.text()).toContain("85");
  });

  it("shows ✓ for a passing phase", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase({ passed: true })] },
    });
    expect(wrapper.text()).toContain("✓");
  });

  it("shows ✗ for a failing phase", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: {
        phases: [
          makePhase({
            passed: false,
            score: makeScore({ grade: "F", total: 55, passed: false }),
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("✗");
  });

  it("shows grade badge", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase({ score: makeScore({ grade: "A", total: 92 }) })] },
    });
    expect(wrapper.text()).toContain("A");
  });

  it("shows formatted duration", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase({ duration_ms: 12_000 })] },
    });
    expect(wrapper.text()).toContain("12s");
  });

  it("shows cost formatted to 3 decimal places", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase({ cost: 0.25 })] },
    });
    expect(wrapper.text()).toContain("$0.250");
  });

  it("detail panel is hidden initially", () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase()] },
    });
    // Category Scores heading only appears in expanded detail
    expect(wrapper.text()).not.toContain("Category Scores");
  });

  it("expands detail panel on row click", async () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase()] },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Category Scores");
  });

  it("shows all four category score labels when expanded", async () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase()] },
    });
    await wrapper.find("button").trigger("click");
    const text = wrapper.text();
    expect(text).toContain("Validation");
    expect(text).toContain("Quality");
    expect(text).toContain("Completeness");
    expect(text).toContain("Consistency");
  });

  it("collapses detail panel on second click", async () => {
    const wrapper = mount(PhaseBreakdownTable, {
      props: { phases: [makePhase()] },
    });
    const btn = wrapper.find("button");
    await btn.trigger("click");
    await btn.trigger("click");
    expect(wrapper.text()).not.toContain("Category Scores");
  });

  it("shows component failure reason when present", async () => {
    const phase = makePhase({
      score: makeScore({
        component_failures: ["completeness (45 < 60)"],
        failure_reason: "Component failures: completeness (45 < 60)",
        passed: false,
      }),
      passed: false,
    });
    const wrapper = mount(PhaseBreakdownTable, { props: { phases: [phase] } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Component failures: completeness (45 < 60)");
  });

  it("shows retry count badge in row when retry_count > 0", () => {
    const phase = makePhase({ retry_count: 2 });
    const wrapper = mount(PhaseBreakdownTable, { props: { phases: [phase] } });
    // template renders "↻ 2 retrys" (retry + s plural suffix)
    expect(wrapper.text()).toContain("2 retry");
  });

  it("shows test results inside expanded panel", async () => {
    const phase = makePhase({
      tests: [
        makeTest({ name: "Era authenticity check", category: "validation", passed: true, score: 100 }),
        makeTest({ name: "Sensory richness", category: "quality", passed: false, score: 45, message: "Too sparse" }),
      ],
      score: makeScore({
        tests: [
          makeTest({ name: "Era authenticity check", category: "validation", passed: true, score: 100 }),
          makeTest({ name: "Sensory richness", category: "quality", passed: false, score: 45, message: "Too sparse" }),
        ],
      }),
    });
    const wrapper = mount(PhaseBreakdownTable, { props: { phases: [phase] } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Era authenticity check");
    expect(wrapper.text()).toContain("Sensory richness");
    expect(wrapper.text()).toContain("Too sparse");
  });

  it("shows errors section when phase has errors", async () => {
    const phase = makePhase({ errors: ["Scorer threw: timeout after 5s"] });
    const wrapper = mount(PhaseBreakdownTable, { props: { phases: [phase] } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Scorer threw: timeout after 5s");
  });

  it("renders multiple phases", () => {
    const phases = [
      makePhase({ agent: "agent1-setting", phase_name: "Setting Refinement" }),
      makePhase({ agent: "agent9-prose", phase_name: "Prose Generation", score: makeScore({ grade: "C", total: 72 }) }),
    ];
    const wrapper = mount(PhaseBreakdownTable, { props: { phases } });
    expect(wrapper.text()).toContain("Setting Refinement");
    expect(wrapper.text()).toContain("Prose Generation");
  });
});
