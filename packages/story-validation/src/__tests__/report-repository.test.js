/**
 * Unit tests for FileReportRepository
 * Uses a real temp directory to test all persistence operations.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { FileReportRepository } from "../report-repository.js";
// ─── Fixtures ─────────────────────────────────────────────────────────────────
function makeReport(overrides = {}) {
    return {
        project_id: "proj-1",
        run_id: "run-1",
        generated_at: new Date("2026-02-24T10:00:00Z").toISOString(),
        total_duration_ms: 60000,
        total_cost: 0.12,
        overall_score: 82,
        overall_grade: "B",
        passed: true,
        phases: [],
        summary: {
            phases_passed: 9,
            phases_failed: 0,
            total_phases: 9,
            pass_rate: 100,
            weakest_phase: "agent1-background",
            strongest_phase: "agent4-hard-logic",
            retry_stats: {
                total_retries: 1,
                phases_retried: 1,
                retry_rate: "11.11",
                retried_phases: [{ agent: "agent2-cast", retry_count: 1, max_retries: 3 }],
            },
            total_cost: 0.12,
        },
        threshold_config: { mode: "standard" },
        ...overrides,
    };
}
// ─── Setup / Teardown ─────────────────────────────────────────────────────────
let tempDir;
beforeEach(async () => {
    // Create a unique temp directory per test
    tempDir = join(tmpdir(), `cml-report-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await fs.mkdir(tempDir, { recursive: true });
});
afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
});
// ─── save() ───────────────────────────────────────────────────────────────────
describe("FileReportRepository.save()", () => {
    it("creates the project directory and writes the report file", async () => {
        const repo = new FileReportRepository(tempDir);
        const report = makeReport();
        await repo.save(report);
        const filePath = join(tempDir, "proj-1", "run-1.json");
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        expect(parsed.project_id).toBe("proj-1");
        expect(parsed.run_id).toBe("run-1");
        expect(parsed.overall_score).toBe(82);
    });
    it("overwrites an existing report with the same project/run id", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ overall_score: 70 }));
        await repo.save(makeReport({ overall_score: 85 }));
        const filePath = join(tempDir, "proj-1", "run-1.json");
        const parsed = JSON.parse(await fs.readFile(filePath, "utf-8"));
        expect(parsed.overall_score).toBe(85);
    });
    it("handles multiple projects without collision", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ project_id: "proj-A", run_id: "run-1" }));
        await repo.save(makeReport({ project_id: "proj-B", run_id: "run-1" }));
        const fileA = join(tempDir, "proj-A", "run-1.json");
        const fileB = join(tempDir, "proj-B", "run-1.json");
        expect(JSON.parse(await fs.readFile(fileA, "utf-8")).project_id).toBe("proj-A");
        expect(JSON.parse(await fs.readFile(fileB, "utf-8")).project_id).toBe("proj-B");
    });
    it("rejects contradictory reports that violate invariants", async () => {
        const repo = new FileReportRepository(tempDir);
        const contradictory = makeReport({
            run_id: 'run-contradiction',
            passed: false,
            aborted: true,
            abort_reason: 'Template linter failed chapter batch.',
            diagnostics: [
                {
                    key: 'agent9_prose_post_generation_summary',
                    agent: 'agent9_prose',
                    phase_name: 'Prose Generation',
                    diagnostic_type: 'post_generation_summary',
                    captured_at: new Date().toISOString(),
                    details: {
                        template_linter_failed_checks: 0,
                    },
                },
            ],
        });
        await expect(repo.save(contradictory)).rejects.toThrow(/template_linter_abort_without_failed_checks/);
    });
    it("rejects reports where NSD revealed clues have no evidence anchors", async () => {
        const repo = new FileReportRepository(tempDir);
        const contradictory = makeReport({
            run_id: 'run-nsd-missing-anchors',
            passed: false,
            diagnostics: [
                {
                    key: 'agent9_prose_post_generation_summary',
                    agent: 'agent9_prose',
                    phase_name: 'Prose Generation',
                    diagnostic_type: 'post_generation_summary',
                    captured_at: new Date().toISOString(),
                    details: {
                        nsd_transfer_trace: [
                            {
                                newly_revealed_clue_ids: ['clue_1'],
                                clue_evidence_anchors: [],
                            },
                        ],
                    },
                },
            ],
        });
        await expect(repo.save(contradictory)).rejects.toThrow(/nsd_revealed_clues_missing_evidence_anchors/);
    });
    it("rejects reports when canonical and legacy post-generation aliases disagree", async () => {
        const repo = new FileReportRepository(tempDir);
        const contradictory = makeReport({
            run_id: "run-alias-mismatch",
            passed: false,
            diagnostics: [
                {
                    key: "agent9_prose_post_generation_summary",
                    agent: "agent9_prose",
                    phase_name: "Prose Generation",
                    diagnostic_type: "post_generation_summary",
                    captured_at: new Date().toISOString(),
                    details: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 14,
                        chapters_failed_uncommitted: 6,
                        story_words_total: 12345,
                        chapter_words_hard_floor: 704,
                        expected_chapter_count: 21,
                        chapters_generated: 15,
                    },
                },
            ],
        });
        await expect(repo.save(contradictory)).rejects.toThrow(/canonical_legacy_progress_metric_mismatch/);
    });
});
// ─── get() ────────────────────────────────────────────────────────────────────
describe("FileReportRepository.get()", () => {
    it("returns the saved report by project and run id", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ overall_score: 77, overall_grade: "C" }));
        const result = await repo.get("proj-1", "run-1");
        expect(result).not.toBeNull();
        expect(result.overall_score).toBe(77);
        expect(result.overall_grade).toBe("C");
    });
    it("returns null when project does not exist", async () => {
        const repo = new FileReportRepository(tempDir);
        const result = await repo.get("no-such-project", "run-1");
        expect(result).toBeNull();
    });
    it("returns null when run id does not exist", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport());
        const result = await repo.get("proj-1", "no-such-run");
        expect(result).toBeNull();
    });
    it("throws when an existing report file violates invariants", async () => {
        const repo = new FileReportRepository(tempDir);
        const dirPath = join(tempDir, "proj-1");
        await fs.mkdir(dirPath, { recursive: true });
        const invalid = makeReport({
            run_id: "run-invalid",
            diagnostics: [
                {
                    key: "agent9_prose_post_generation_summary",
                    agent: "agent9_prose",
                    phase_name: "Prose Generation",
                    diagnostic_type: "post_generation_summary",
                    captured_at: new Date().toISOString(),
                    details: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 14,
                        chapters_failed_uncommitted: 6,
                        story_words_total: 12000,
                        chapter_words_hard_floor: 704,
                        expected_chapter_count: 19,
                        chapters_generated: 13,
                    },
                },
            ],
        });
        await fs.writeFile(join(dirPath, "run-invalid.json"), JSON.stringify(invalid), "utf-8");
        await expect(repo.get("proj-1", "run-invalid")).rejects.toThrow(/canonical_legacy_progress_metric_mismatch/);
    });
});
// ─── list() ───────────────────────────────────────────────────────────────────
describe("FileReportRepository.list()", () => {
    it("returns empty array when project has no reports", async () => {
        const repo = new FileReportRepository(tempDir);
        const result = await repo.list("proj-1");
        expect(result).toEqual([]);
    });
    it("returns all reports for a project", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-1", generated_at: "2026-02-24T10:00:00Z" }));
        await repo.save(makeReport({ run_id: "run-2", generated_at: "2026-02-24T11:00:00Z" }));
        await repo.save(makeReport({ run_id: "run-3", generated_at: "2026-02-24T12:00:00Z" }));
        const result = await repo.list("proj-1");
        expect(result).toHaveLength(3);
    });
    it("returns reports sorted most-recent first", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-A", generated_at: "2026-02-24T08:00:00Z" }));
        await repo.save(makeReport({ run_id: "run-B", generated_at: "2026-02-24T10:00:00Z" }));
        await repo.save(makeReport({ run_id: "run-C", generated_at: "2026-02-24T12:00:00Z" }));
        const result = await repo.list("proj-1");
        expect(result[0].run_id).toBe("run-C");
        expect(result[1].run_id).toBe("run-B");
        expect(result[2].run_id).toBe("run-A");
    });
    it("respects the limit parameter", async () => {
        const repo = new FileReportRepository(tempDir);
        for (let i = 1; i <= 5; i++) {
            await repo.save(makeReport({ run_id: `run-${i}`, generated_at: `2026-02-24T0${i}:00:00Z` }));
        }
        const result = await repo.list("proj-1", 2);
        expect(result).toHaveLength(2);
        // Most recent two
        expect(result[0].run_id).toBe("run-5");
        expect(result[1].run_id).toBe("run-4");
    });
    it("does not return reports from other projects", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ project_id: "proj-1", run_id: "run-1" }));
        await repo.save(makeReport({ project_id: "proj-2", run_id: "run-2" }));
        const result = await repo.list("proj-1");
        expect(result).toHaveLength(1);
        expect(result[0].run_id).toBe("run-1");
    });
    it("skips malformed or invariant-violating files while listing", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-valid", generated_at: "2026-02-24T10:00:00Z" }));
        const dirPath = join(tempDir, "proj-1");
        const invalid = makeReport({
            run_id: "run-invalid-list",
            generated_at: "2026-02-24T11:00:00Z",
            diagnostics: [
                {
                    key: "agent9_prose_post_generation_summary",
                    agent: "agent9_prose",
                    phase_name: "Prose Generation",
                    diagnostic_type: "post_generation_summary",
                    captured_at: new Date().toISOString(),
                    details: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 14,
                        chapters_failed_uncommitted: 6,
                        story_words_total: 12000,
                        chapter_words_hard_floor: 704,
                        expected_chapter_count: 18,
                        chapters_generated: 14,
                    },
                },
            ],
        });
        await fs.writeFile(join(dirPath, "run-invalid-list.json"), JSON.stringify(invalid), "utf-8");
        await fs.writeFile(join(dirPath, "run-malformed.json"), "{ not-json", "utf-8");
        const result = await repo.list("proj-1", 10);
        expect(result.map(r => r.run_id)).toEqual(["run-valid"]);
    });
});
// ─── getAggregate() ───────────────────────────────────────────────────────────
describe("FileReportRepository.getAggregate()", () => {
    it("returns zero stats when no reports exist", async () => {
        const repo = new FileReportRepository(tempDir);
        const stats = await repo.getAggregate();
        expect(stats.totalGenerations).toBe(0);
        expect(stats.successRate).toBe(0);
        expect(stats.averageScore).toBe(0);
        expect(stats.averageRetries).toBe(0);
        expect(stats.commonFailures).toEqual([]);
    });
    it("counts total generations correctly", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ project_id: "proj-1", run_id: "run-1" }));
        await repo.save(makeReport({ project_id: "proj-1", run_id: "run-2" }));
        await repo.save(makeReport({ project_id: "proj-2", run_id: "run-1" }));
        const stats = await repo.getAggregate();
        expect(stats.totalGenerations).toBe(3);
    });
    it("calculates successRate as percentage of passed reports", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-1", passed: true }));
        await repo.save(makeReport({ run_id: "run-2", passed: true }));
        await repo.save(makeReport({ run_id: "run-3", passed: false }));
        const stats = await repo.getAggregate();
        expect(stats.successRate).toBeCloseTo(66.67, 1);
    });
    it("calculates averageScore across all reports", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-1", overall_score: 80 }));
        await repo.save(makeReport({ run_id: "run-2", overall_score: 60 }));
        const stats = await repo.getAggregate();
        expect(stats.averageScore).toBeCloseTo(70, 1);
    });
    it("populates scoreDistribution grade counts", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ run_id: "run-A", overall_grade: "A" }));
        await repo.save(makeReport({ run_id: "run-B", overall_grade: "B" }));
        await repo.save(makeReport({ run_id: "run-B2", overall_grade: "B" }));
        await repo.save(makeReport({ run_id: "run-F", overall_grade: "F" }));
        const stats = await repo.getAggregate();
        expect(stats.scoreDistribution.A).toBe(1);
        expect(stats.scoreDistribution.B).toBe(2);
        expect(stats.scoreDistribution.C).toBe(0);
        expect(stats.scoreDistribution.F).toBe(1);
    });
    it("tracks common failures from failed phases", async () => {
        const failedPhase = {
            agent: "agent4-hard-logic",
            phase_name: "Hard Logic",
            score: {
                agent: "agent4-hard-logic",
                validation_score: 40,
                quality_score: 40,
                completeness_score: 40,
                consistency_score: 40,
                total: 40,
                grade: "F",
                passed: false,
                tests: [],
            },
            duration_ms: 5000,
            cost: 0.05,
            threshold: 85,
            passed: false,
            tests: [],
        };
        const repo = new FileReportRepository(tempDir);
        const failedSummary = {
            phases_passed: 8,
            phases_failed: 1,
            total_phases: 9,
            pass_rate: 88.89,
            weakest_phase: "agent4-hard-logic",
            strongest_phase: "agent1-background",
            retry_stats: {
                total_retries: 1,
                phases_retried: 1,
                retry_rate: "11.11",
                retried_phases: [{ agent: "agent4-hard-logic", retry_count: 1, max_retries: 3 }],
            },
            total_cost: 0.12,
        };
        await repo.save(makeReport({
            run_id: "run-1",
            passed: false,
            run_outcome: "failed",
            phases: [failedPhase],
            summary: failedSummary,
        }));
        await repo.save(makeReport({
            run_id: "run-2",
            passed: false,
            run_outcome: "failed",
            phases: [failedPhase],
            summary: failedSummary,
        }));
        const stats = await repo.getAggregate();
        const hardLogicFailure = stats.commonFailures.find((f) => f.phase === "agent4-hard-logic");
        expect(hardLogicFailure).toBeDefined();
        expect(hardLogicFailure.count).toBe(2);
    });
    it("ignores malformed or invariant-violating files in aggregate stats", async () => {
        const repo = new FileReportRepository(tempDir);
        await repo.save(makeReport({ project_id: "proj-1", run_id: "run-valid", overall_score: 80, passed: true }));
        const dirPath = join(tempDir, "proj-1");
        const invalid = makeReport({
            run_id: "run-invalid-agg",
            overall_score: 20,
            passed: false,
            diagnostics: [
                {
                    key: "agent9_prose_post_generation_summary",
                    agent: "agent9_prose",
                    phase_name: "Prose Generation",
                    diagnostic_type: "post_generation_summary",
                    captured_at: new Date().toISOString(),
                    details: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 14,
                        chapters_failed_uncommitted: 6,
                        story_words_total: 12000,
                        chapter_words_hard_floor: 704,
                        expected_chapter_count: 18,
                        chapters_generated: 14,
                    },
                },
            ],
        });
        await fs.writeFile(join(dirPath, "run-invalid-agg.json"), JSON.stringify(invalid), "utf-8");
        await fs.writeFile(join(dirPath, "run-malformed-agg.json"), "{ broken", "utf-8");
        const stats = await repo.getAggregate();
        expect(stats.totalGenerations).toBe(1);
        expect(stats.averageScore).toBe(80);
        expect(stats.successRate).toBe(100);
    });
});
//# sourceMappingURL=report-repository.test.js.map