import { describe, expect, it } from "vitest";
import { ProseScorer } from "../phase-scorers/agent9-prose-scorer.js";
describe("ProseScorer stability guards", () => {
    it("returns finite scores when chapters array is empty", async () => {
        const scorer = new ProseScorer();
        const score = await scorer.score({}, { chapters: [] }, { threshold_config: { mode: "standard" }, targetLength: "medium" });
        expect(Number.isFinite(score.total)).toBe(true);
        expect(Number.isFinite(score.validation_score)).toBe(true);
        expect(score.passed).toBe(false);
    });
    it("does not produce NaN when cast is empty", async () => {
        const scorer = new ProseScorer();
        const score = await scorer.score({}, {
            chapters: [
                {
                    chapter_number: 1,
                    chapter_title: "Chapter One",
                    prose: "The room was cold. She waited by the window and listened to the rain.",
                },
            ],
        }, {
            threshold_config: { mode: "standard" },
            targetLength: "medium",
            cml: { CASE: { cast: [] } },
        });
        expect(Number.isFinite(score.consistency_score)).toBe(true);
        expect(score.tests.length).toBeGreaterThan(0);
    });
});
// ── D8: fair_play_validation rubric recalibration (35/35/15/15) ───────────────
describe("ProseScorer fair_play_validation rubric (D8)", () => {
    const scorer = new ProseScorer();
    const baseContext = {
        threshold_config: { mode: "standard" },
        targetLength: "medium",
    };
    const singleChapter = {
        chapters: [
            {
                chapter_number: 1,
                chapter_title: "End",
                prose: "She waited for the answer.",
            },
        ],
    };
    it("awards 100/100 fair-play score and passes when all four components pass", async () => {
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: true,
                no_solution_spoilers: true,
                fair_play_timing_compliant: true,
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest).toBeDefined();
        expect(fpTest?.score).toBe(100);
        expect(fpTest?.passed).toBe(true);
    });
    it("totals 85/100 fair-play score (passes) when only timing fails (loses 15 pts)", async () => {
        // 35+35+15+0 = 85 — still passes (>=60), but message should contain the detail
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: true,
                no_solution_spoilers: true,
                fair_play_timing_compliant: false,
                fair_play_timing_violations: [{ clue_id: "clue_1", chapter: 4 }],
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest).toBeDefined();
        expect(fpTest?.score).toBe(85);
        expect(fpTest?.passed).toBe(true); // 85 >= 60 → passes
        expect(fpTest?.message).toContain("85/100");
    });
    it("totals 70/100 when no_solution_spoilers and timing both fail (loses 15+15=30 pts)", async () => {
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: true,
                no_solution_spoilers: false,
                fair_play_timing_compliant: false,
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest?.score).toBe(70); // 35+35+0+0
        expect(fpTest?.passed).toBe(true); // 70 >= 60
    });
    it("totals 35/100 and fails when only all_clues_visible passes (35 pts)", async () => {
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: false,
                no_solution_spoilers: false,
                fair_play_timing_compliant: false,
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest?.score).toBe(35);
        expect(fpTest?.passed).toBe(false); // 35 < 60
    });
    it("defaults fair_play_timing_compliant to passing (15 pts) when field is absent — backwards compat", async () => {
        // Old reports without the timing field should score 100/100
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: true,
                no_solution_spoilers: true,
                // fair_play_timing_compliant intentionally absent
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest?.score).toBe(100);
        expect(fpTest?.passed).toBe(true);
    });
    it("includes violated chapter numbers in message when timing fails", async () => {
        const output = {
            ...singleChapter,
            fair_play_validation: {
                all_clues_visible: true,
                discriminating_test_complete: true,
                no_solution_spoilers: true,
                fair_play_timing_compliant: false,
                fair_play_timing_violations: [
                    { clue_id: "clue_knife", chapter: 5 },
                    { clue_id: "clue_ring", chapter: 5 },
                    { clue_id: "clue_hat", chapter: 7 },
                ],
            },
        };
        const score = await scorer.score({}, output, baseContext);
        const fpTest = score.tests.find(t => t.name === "Fair play compliance");
        expect(fpTest?.message ?? "").toMatch(/5/);
        expect(fpTest?.message ?? "").toMatch(/7/);
    });
});
describe("ProseScorer completeness diagnostics", () => {
    const scorer = new ProseScorer();
    const context = {
        threshold_config: { mode: "standard" },
        targetLength: "short",
        cml: {
            CASE: {
                prose_requirements: {
                    clue_to_scene_mapping: [{ clue_id: "clue_a" }, { clue_id: "clue_b" }],
                },
            },
        },
    };
    it("marks clue visibility as dominant subfailure when clues are missing", async () => {
        const output = {
            chapters: [
                {
                    chapter_number: 1,
                    chapter_title: "Chapter 1",
                    prose: new Array(1400).fill("word").join(" "),
                    clues_present: ["clue_a"],
                    discriminating_test_present: true,
                },
            ],
            overall_word_count: 16000,
            expected_clue_ids: ["clue_a", "clue_b"],
        };
        const score = await scorer.score({}, output, context);
        const diagnostics = score.breakdown?.completeness_diagnostics;
        expect(diagnostics).toBeDefined();
        expect(diagnostics?.clue_visibility?.status).toBe("critical_gap");
        expect(diagnostics?.clue_visibility?.missing_clue_ids).toContain("clue_b");
        expect(diagnostics?.dominant_subfailure).toBe("clue_visibility");
    });
    it("marks word count as dominant subfailure when total words are far below target", async () => {
        const output = {
            chapters: [
                {
                    chapter_number: 1,
                    chapter_title: "Chapter 1",
                    prose: "Brief chapter text only.",
                    clues_present: ["clue_a", "clue_b"],
                    discriminating_test_present: true,
                },
            ],
            overall_word_count: 3000,
            expected_clue_ids: ["clue_a", "clue_b"],
        };
        const score = await scorer.score({}, output, context);
        const diagnostics = score.breakdown?.completeness_diagnostics;
        expect(diagnostics).toBeDefined();
        expect(diagnostics?.word_count_target?.status).toBe("major_underflow");
        expect(diagnostics?.dominant_subfailure).toBe("word_count_target");
    });
    it("matches expected and visible clue IDs despite separator drift", async () => {
        const output = {
            chapters: [
                {
                    chapter_number: 1,
                    chapter_title: "Chapter 1",
                    prose: new Array(1400).fill("word").join(" "),
                    clues_present: ["clue-ring mark"],
                    discriminating_test_present: true,
                },
            ],
            overall_word_count: 16000,
            expected_clue_ids: ["clue_ring_mark"],
        };
        const score = await scorer.score({}, output, context);
        const diagnostics = score.breakdown?.completeness_diagnostics;
        expect(diagnostics?.clue_visibility?.status).toBe("pass");
        expect(diagnostics?.clue_visibility?.ratio).toBe(1);
        expect(diagnostics?.clue_visibility?.missing_clue_ids).toBeUndefined();
    });
});
describe("ProseScorer chapter count tolerance", () => {
    it("passes all-chapters-present validation when chapter count is within YAML tolerance", async () => {
        const scorer = new ProseScorer();
        const longChapterProse = new Array(900).fill("word").join(" ");
        const score = await scorer.score({}, {
            chapters: Array.from({ length: 17 }, (_, idx) => ({
                chapter_number: idx + 1,
                chapter_title: `Chapter ${idx + 1}`,
                prose: longChapterProse,
                discriminating_test_present: idx === 13,
                clues_present: [`clue_${idx + 1}`],
            })),
            overall_word_count: 17000,
            expected_clue_ids: Array.from({ length: 17 }, (_, idx) => `clue_${idx + 1}`),
        }, {
            threshold_config: { mode: "standard" },
            targetLength: "short",
            cml: { CASE: { cast: [] } },
        });
        const allChaptersTest = score.tests.find((t) => t.name === "All chapters present");
        expect(allChaptersTest).toBeDefined();
        expect(allChaptersTest?.passed).toBe(true);
        expect(allChaptersTest?.message ?? "").toContain("+/- 3");
    });
});
//# sourceMappingURL=agent9-prose-scorer.test.js.map