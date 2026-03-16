import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreCard from "../ScoreCard.vue";
// ── Helpers ──────────────────────────────────────────────────────────────────
function makeScore(overrides = {}) {
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
function makePhase(overrides = {}) {
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
function makeReport(overrides = {}) {
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
    it("shows ■ Aborted when run_outcome is aborted", () => {
        const wrapper = mount(ScoreCard, {
            props: {
                report: makeReport({
                    passed: false,
                    run_outcome: "aborted",
                    run_outcome_reason: "Release gate hard-stop",
                }),
            },
        });
        expect(wrapper.text()).toContain("■ Aborted");
    });
    it("prefers run_outcome over legacy passed flag", () => {
        const wrapper = mount(ScoreCard, {
            props: {
                report: makeReport({
                    passed: true,
                    run_outcome: "failed",
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
    it("renders report when canonical post-generation diagnostics are present", () => {
        const wrapper = mount(ScoreCard, {
            props: {
                report: makeReport({
                    diagnostics: [
                        {
                            key: "agent9_prose_post_generation_summary",
                            agent: "agent9_prose",
                            phase_name: "Prose Generation",
                            diagnostic_type: "post_generation_summary",
                            captured_at: "2026-03-13T00:00:00.000Z",
                            details: {
                                expected_chapters_total: 20,
                                chapters_generated_committed: 16,
                                chapters_failed_uncommitted: 4,
                                story_words_total: 23200,
                                expected_story_min_words: 21000,
                                expected_story_max_words: 26000,
                                chapter_words_hard_floor: 704,
                                clue_obligation_required_ids_by_chapter: [
                                    { chapter: 3, required_clue_ids: ["clue_early_1"] },
                                ],
                                clue_obligation_normalized_required_ids_by_chapter: [
                                    { chapter: 3, normalized_required_clue_ids: ["clue_early_1"] },
                                ],
                                count_reconciliation: {
                                    failed_uncommitted_chapter_ranges: [{ start: 19, end: 20 }],
                                    run_state: "partial_generation",
                                },
                                expected_chapter_count: 20,
                                chapters_generated: 16,
                            },
                        },
                    ],
                }),
            },
        });
        expect(wrapper.text()).toContain("Generation Quality Report");
        expect(wrapper.text()).toContain("✓ Passed");
        expect(wrapper.text()).toContain("Prose progress");
        expect(wrapper.text()).toContain("Partial generation");
        expect(wrapper.text()).toContain("16");
        expect(wrapper.text()).toContain("/ 20");
        expect(wrapper.text()).toContain("4");
        expect(wrapper.text()).toContain("19-20");
        expect(wrapper.text()).toContain("Word state (viability hard floor)");
        expect(wrapper.text()).toContain("704 words");
        expect(wrapper.text()).toContain("Word state (completeness story total)");
        expect(wrapper.text()).toContain("23200 words");
        expect(wrapper.text()).toContain("21000-26000");
        expect(wrapper.text()).toContain("Required clue obligations (raw IDs)");
        expect(wrapper.text()).toContain("Ch3: clue_early_1");
        expect(wrapper.text()).toContain("Required clue obligations (normalized IDs)");
    });
    it("falls back to legacy progress metrics when canonical keys are absent", () => {
        const wrapper = mount(ScoreCard, {
            props: {
                report: makeReport({
                    diagnostics: [
                        {
                            key: "agent9_prose_post_generation_summary",
                            agent: "agent9_prose",
                            phase_name: "Prose Generation",
                            diagnostic_type: "post_generation_summary",
                            captured_at: "2026-03-13T00:00:00.000Z",
                            details: {
                                expected_chapter_count: 12,
                                chapters_generated: 9,
                            },
                        },
                    ],
                }),
            },
        });
        expect(wrapper.text()).toContain("Prose progress");
        expect(wrapper.text()).toContain("9");
        expect(wrapper.text()).toContain("/ 12");
    });
    it("prefers prose_presentation DTO when available", () => {
        const wrapper = mount(ScoreCard, {
            props: {
                report: makeReport({
                    prose_presentation: {
                        run_state: "complete",
                        chapters: {
                            expected: 12,
                            committed: 12,
                            failed_uncommitted: 0,
                            failed_uncommitted_ranges: [],
                        },
                        words: {
                            viability_hard_floor: 704,
                            quality_preferred_target: 1050,
                            completeness_story_total: 24400,
                            completeness_story_min: 21000,
                            completeness_story_max: 26000,
                        },
                        clue_obligations: {
                            required_ids_by_chapter: [
                                { chapter: 7, required_clue_ids: ["clue_07_a", "clue_07_b"] },
                            ],
                            normalized_required_ids_by_chapter: [
                                { chapter: 7, normalized_required_clue_ids: ["clue_07_a", "clue_07_b"] },
                            ],
                        },
                    },
                }),
            },
        });
        expect(wrapper.text()).toContain("Complete");
        expect(wrapper.text()).toContain("12");
        expect(wrapper.text()).toContain("/ 12");
        expect(wrapper.text()).toContain("24400 words");
        expect(wrapper.text()).toContain("Ch7: clue_07_a, clue_07_b");
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
//# sourceMappingURL=ScoreCard.test.js.map