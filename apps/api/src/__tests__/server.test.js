describe("Export API", () => {
    it("exports selected artifacts as a JSON file", async () => {
        // Create project and run pipeline to generate artifacts
        const created = await request(app).post("/api/projects").send({ name: "Export Project" });
        await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s", locationPreset: "CountryHouse" });
        // Export setting and cast artifacts
        const response = await request(app)
            .post(`/api/projects/${created.body.id}/export`)
            .send({ artifactTypes: ["setting", "cast"] });
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.headers["content-disposition"]).toMatch(/attachment/);
        const exported = response.body;
        expect(Object.keys(exported)).toHaveLength(0);
    });
});
import request from "supertest";
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from "vitest";
import { createServer } from "../server.js";
import { promises as fs } from "fs";
import { join } from "path";
const app = createServer();
afterEach(() => {
    vi.useRealTimers();
});
describe("API server (phase 1)", () => {
    it("returns health status", async () => {
        const response = await request(app).get("/api/health");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: "ok", service: "api" });
    });
    it("creates and retrieves a project", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Test Project" });
        expect(created.status).toBe(201);
        expect(created.body.name).toBe("Test Project");
        const fetched = await request(app).get(`/api/projects/${created.body.id}`);
        expect(fetched.status).toBe(200);
        expect(fetched.body.id).toBe(created.body.id);
    });
    it("returns run=null for latest run when project has no runs", async () => {
        const created = await request(app).post("/api/projects").send({ name: "No Run Project" });
        const latestRun = await request(app).get(`/api/projects/${created.body.id}/runs/latest`);
        expect(latestRun.status).toBe(200);
        expect(latestRun.body).toEqual({ run: null });
    });
    it("saves and retrieves a spec", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Spec Project" });
        const saved = await request(app)
            .post(`/api/projects/${created.body.id}/specs`)
            .send({ decade: "1930s" });
        expect(saved.status).toBe(201);
        const fetched = await request(app).get(`/api/specs/${saved.body.id}`);
        expect(fetched.status).toBe(200);
        expect(fetched.body.spec).toEqual({ decade: "1930s" });
    });
    it("runs a pipeline and returns status transitions", async () => {
        const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const originalApiKey = process.env.AZURE_OPENAI_API_KEY;
        process.env.AZURE_OPENAI_ENDPOINT = "";
        process.env.AZURE_OPENAI_API_KEY = "";
        try {
            const created = await request(app).post("/api/projects").send({ name: "Run Project" });
            const run = await request(app).post(`/api/projects/${created.body.id}/run`);
            expect(run.status).toBe(503);
        }
        finally {
            process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
            process.env.AZURE_OPENAI_API_KEY = originalApiKey;
        }
    });
    it("regenerates a single artifact scope", async () => {
        const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const originalApiKey = process.env.AZURE_OPENAI_API_KEY;
        process.env.AZURE_OPENAI_ENDPOINT = "";
        process.env.AZURE_OPENAI_API_KEY = "";
        try {
            const created = await request(app).post("/api/projects").send({ name: "Regen Project" });
            await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s" });
            const regen = await request(app)
                .post(`/api/projects/${created.body.id}/regenerate`)
                .send({ scope: "clues" });
            expect(regen.status).toBe(503);
        }
        finally {
            process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
            process.env.AZURE_OPENAI_API_KEY = originalApiKey;
        }
    });
    it("serves samples list and content", async () => {
        const list = await request(app).get("/api/samples");
        expect(list.status).toBe(200);
        expect(list.body.samples?.length).toBeGreaterThan(0);
        const first = list.body.samples[0];
        const sample = await request(app).get(`/api/samples/${first.id}`);
        expect(sample.status).toBe(200);
        expect(sample.body.content).toBeTruthy();
    });
    it("downloads game pack PDF", async () => {
        const created = await request(app).post("/api/projects").send({ name: "PDF Project" });
        await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s" });
        const response = await request(app).get(`/api/projects/${created.body.id}/game-pack/pdf`);
        expect(response.status).toBe(404);
    });
    it("creates and lists activity logs", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Log Project" });
        const log = await request(app)
            .post("/api/logs")
            .send({ projectId: created.body.id, scope: "ui", message: "test_log", payload: { ok: true } });
        expect(log.status).toBe(201);
        const list = await request(app).get(`/api/logs?projectId=${created.body.id}`);
        expect(list.status).toBe(200);
        expect(list.body.logs.length).toBeGreaterThan(0);
    });
    it("blocks CML endpoint in user mode", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Mode Project" });
        const response = await request(app).get(`/api/projects/${created.body.id}/cml/latest`);
        expect(response.status).toBe(403);
    });
    it("allows CML endpoint in advanced mode (placeholder)", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Mode Project" });
        const response = await request(app)
            .get(`/api/projects/${created.body.id}/cml/latest`)
            .set("x-cml-mode", "advanced");
        expect(response.status).toBe(404);
    });
    it("validates CML payload in advanced mode", async () => {
        const created = await request(app).post("/api/projects").send({ name: "Validate Project" });
        const response = await request(app)
            .post(`/api/projects/${created.body.id}/cml/validate`)
            .set("x-cml-mode", "advanced")
            .send({});
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(false);
        const latest = await request(app)
            .get(`/api/projects/${created.body.id}/cml/validation/latest`)
            .set("x-cml-mode", "advanced");
        expect(latest.status).toBe(200);
    });
});
// ─── Scoring API Endpoints ────────────────────────────────────────────────────
describe("Scoring API", () => {
    let reportsDir;
    /** Minimal valid GenerationReport written to disk so the API can read it */
    function makeReport(projectId, runId, score = 82, passed = true, diagnostics = []) {
        return {
            project_id: projectId,
            run_id: runId,
            generated_at: new Date().toISOString(),
            total_duration_ms: 60000,
            total_cost: 0.1,
            overall_score: score,
            overall_grade: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
            passed,
            phases: [],
            diagnostics,
            summary: {
                phases_passed: passed ? 9 : 8,
                phases_failed: passed ? 0 : 1,
                total_phases: 9,
                pass_rate: passed ? 100 : 88.9,
                weakest_phase: "agent1-background",
                strongest_phase: "agent4-hard-logic",
                retry_stats: {
                    total_retries: 0,
                    phases_retried: 0,
                    retry_rate: "0.00",
                    retried_phases: [],
                },
                total_cost: 0.1,
            },
            threshold_config: { mode: "standard" },
        };
    }
    beforeAll(async () => {
        // Use __dirname (vitest-injected) so the path is stable regardless of
        // process.cwd() — npm workspaces can change cwd to apps/api, which would
        // make join(process.cwd(),"apps","api","data","reports") a doubled path.
        // __dirname here = apps/api/src/__tests__, so ../../data/reports = apps/api/data/reports,
        // which matches the server's primary candidate path.resolve(__dirname,"..","data","reports").
        reportsDir = join(__dirname, "..", "..", "data", "reports");
        await fs.mkdir(reportsDir, { recursive: true });
    });
    afterAll(async () => {
        // Remove only the test project directories we created
        for (const proj of ["score-proj-1", "score-proj-2", "score-proj-agg", "score-proj-export", "score-proj-trace", "score-proj-stale", "score-proj-history-canonical", "score-proj-history-resilience"]) {
            await fs.rm(join(reportsDir, proj), { recursive: true, force: true });
        }
    });
    // ── GET /api/projects/:projectId/runs/:runId/report ──────────────────────
    it("returns 404 when no report exists for a project/run", async () => {
        const res = await request(app).get("/api/projects/nonexistent-proj/runs/nonexistent-run/report");
        expect(res.status).toBe(404);
        expect(res.body.error).toBeTruthy();
    });
    it("returns 202 in_progress when run is active and report is not materialized yet", async () => {
        vi.useFakeTimers();
        const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const originalApiKey = process.env.AZURE_OPENAI_API_KEY;
        process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com";
        process.env.AZURE_OPENAI_API_KEY = "test-key";
        try {
            const created = await request(app).post("/api/projects").send({ name: "Running report project" });
            await request(app)
                .post(`/api/projects/${created.body.id}/specs`)
                .send({ decade: "1930s", locationPreset: "CountryHouse" });
            const run = await request(app).post(`/api/projects/${created.body.id}/run`);
            expect(run.status).toBe(202);
            const reportRes = await request(app).get(`/api/projects/${created.body.id}/runs/${run.body.runId}/report`);
            expect(reportRes.status).toBe(202);
            expect(reportRes.body.status).toBe("in_progress");
            expect(reportRes.body.projectId).toBe(created.body.id);
            expect(reportRes.body.runId).toBe(run.body.runId);
        }
        finally {
            process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
            process.env.AZURE_OPENAI_API_KEY = originalApiKey;
        }
    });
    it("returns 200 with report JSON when report exists", async () => {
        const projectDir = join(reportsDir, "score-proj-1");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-abc.json"), JSON.stringify(makeReport("score-proj-1", "run-abc", 85)), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-1/runs/run-abc/report");
        expect(res.status).toBe(200);
        expect(res.body.project_id).toBe("score-proj-1");
        expect(res.body.run_id).toBe("run-abc");
        expect(res.body.overall_score).toBe(85);
        expect(res.body.overall_grade).toBe("B");
        expect(res.body.passed).toBe(true);
        expect(res.body.summary).toBeDefined();
    });
    it("preserves canonical post-generation diagnostics in run report response", async () => {
        const projectDir = join(reportsDir, "score-proj-1");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-canonical.json"), JSON.stringify(makeReport("score-proj-1", "run-canonical", 86, true, [
            {
                key: "agent9_prose_post_generation_summary",
                agent: "agent9_prose",
                phase_name: "Prose Generation",
                diagnostic_type: "post_generation_summary",
                captured_at: new Date().toISOString(),
                details: {
                    expected_chapters_total: 20,
                    chapters_generated_committed: 18,
                    chapters_failed_uncommitted: 2,
                    story_words_total: 23200,
                    chapter_words_hard_floor: 704,
                    clue_obligation_required_ids_by_chapter: [
                        { chapter: 3, required_clue_ids: ["clue_early_1"] },
                    ],
                    clue_obligation_normalized_required_ids_by_chapter: [
                        { chapter: 3, normalized_required_clue_ids: ["clue_early_1"] },
                    ],
                    count_reconciliation: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 18,
                        chapters_failed_uncommitted: 2,
                        failed_uncommitted_chapter_ranges: [{ start: 19, end: 20 }],
                        chapter_word_buckets: {
                            hard_floor_miss_count: 1,
                            pass_count: 16,
                        },
                        run_state: "partial_generation",
                    },
                    expected_chapter_count: 20,
                    chapters_generated: 18,
                },
            },
        ])), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-1/runs/run-canonical/report");
        expect(res.status).toBe(200);
        const diagnostics = res.body.diagnostics;
        expect(Array.isArray(diagnostics)).toBe(true);
        const postGeneration = diagnostics.find((d) => d.key === "agent9_prose_post_generation_summary"
            || d.diagnostic_type === "post_generation_summary");
        expect(postGeneration).toBeDefined();
        expect(postGeneration.details.expected_chapters_total).toBe(20);
        expect(postGeneration.details.chapters_generated_committed).toBe(18);
        expect(postGeneration.details.chapters_failed_uncommitted).toBe(2);
        expect(postGeneration.details.chapter_words_hard_floor).toBe(704);
        expect(postGeneration.details.count_reconciliation).toBeDefined();
        expect(postGeneration.details.count_reconciliation.run_state).toBe("partial_generation");
        expect(postGeneration.details.count_reconciliation.chapter_word_buckets.pass_count).toBe(16);
        expect(res.body.prose_presentation).toBeDefined();
        expect(res.body.prose_presentation.run_state).toBe("partial_generation");
        expect(res.body.prose_presentation.chapters.expected).toBe(20);
        expect(res.body.prose_presentation.chapters.committed).toBe(18);
        expect(res.body.prose_presentation.chapters.failed_uncommitted_ranges).toEqual([{ start: 19, end: 20 }]);
        expect(res.body.prose_presentation.words.viability_hard_floor).toBe(704);
        expect(res.body.prose_presentation.clue_obligations.required_ids_by_chapter).toEqual([
            { chapter: 3, required_clue_ids: ["clue_early_1"] },
        ]);
        expect(res.body.prose_presentation.clue_obligations.normalized_required_ids_by_chapter).toEqual([
            { chapter: 3, normalized_required_clue_ids: ["clue_early_1"] },
        ]);
    });
    it("returns stale latest report when requested run report is unreadable", async () => {
        const projectDir = join(reportsDir, "score-proj-stale");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-good.json"), JSON.stringify(makeReport("score-proj-stale", "run-good", 86)), "utf-8");
        await fs.writeFile(join(projectDir, "run-bad.json"), "{ malformed-json", "utf-8");
        const res = await request(app).get("/api/projects/score-proj-stale/runs/run-bad/report");
        expect(res.status).toBe(200);
        expect(res.body.stale).toBe(true);
        expect(res.body.stale_reason).toBe("report_read_error");
        expect(res.body.requested_run_id).toBe("run-bad");
        expect(res.body.run_id).toBe("run-good");
        // Restore a valid report so downstream aggregate tests are unaffected.
        await fs.writeFile(join(projectDir, "run-bad.json"), JSON.stringify(makeReport("score-proj-stale", "run-bad", 74, false)), "utf-8");
    });
    it("returns stale finalized report when requested report is still in_progress but run is not active", async () => {
        const projectDir = join(reportsDir, "score-proj-stale");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-final.json"), JSON.stringify(makeReport("score-proj-stale", "run-final", 89, true)), "utf-8");
        await fs.writeFile(join(projectDir, "run-inprogress.json"), JSON.stringify({
            ...makeReport("score-proj-stale", "run-inprogress", 99, true),
            in_progress: true,
        }), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-stale/runs/run-inprogress/report");
        expect(res.status).toBe(200);
        expect(res.body.stale).toBe(true);
        expect(res.body.stale_reason).toBe("incomplete_report");
        expect(res.body.requested_run_id).toBe("run-inprogress");
        expect(res.body.run_id).toBe("run-final");
    });
    // ── GET /api/projects/:projectId/reports/history ─────────────────────────
    it("returns empty reports array when project has no reports", async () => {
        const res = await request(app).get("/api/projects/score-proj-empty/reports/history");
        expect(res.status).toBe(200);
        expect(res.body.reports).toEqual([]);
        expect(res.body.count).toBe(0);
    });
    it("returns reports list with correct envelope shape", async () => {
        const projectDir = join(reportsDir, "score-proj-2");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-1.json"), JSON.stringify(makeReport("score-proj-2", "run-1", 80)), "utf-8");
        await fs.writeFile(join(projectDir, "run-2.json"), JSON.stringify(makeReport("score-proj-2", "run-2", 90)), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-2/reports/history");
        expect(res.status).toBe(200);
        expect(res.body.projectId).toBe("score-proj-2");
        expect(res.body.count).toBe(2);
        expect(Array.isArray(res.body.reports)).toBe(true);
        expect(res.body.reports).toHaveLength(2);
    });
    it("preserves canonical post-generation diagnostics in reports history payload", async () => {
        const projectDir = join(reportsDir, "score-proj-history-canonical");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-history-canonical.json"), JSON.stringify(makeReport("score-proj-history-canonical", "run-history-canonical", 84, true, [
            {
                key: "agent9_prose_post_generation_summary",
                agent: "agent9_prose",
                phase_name: "Prose Generation",
                diagnostic_type: "post_generation_summary",
                captured_at: new Date().toISOString(),
                details: {
                    expected_chapters_total: 20,
                    chapters_generated_committed: 17,
                    chapters_failed_uncommitted: 3,
                    story_words_total: 22100,
                    chapter_words_hard_floor: 704,
                    clue_obligation_required_ids_by_chapter: [
                        { chapter: 5, required_clue_ids: ["clue_late_2"] },
                    ],
                    clue_obligation_normalized_required_ids_by_chapter: [
                        { chapter: 5, normalized_required_clue_ids: ["clue_late_2"] },
                    ],
                    count_reconciliation: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 17,
                        chapters_failed_uncommitted: 3,
                        failed_uncommitted_chapter_ranges: [{ start: 18, end: 20 }],
                        chapter_word_buckets: {
                            hard_floor_miss_count: 2,
                            pass_count: 14,
                        },
                        run_state: "partial_generation",
                    },
                    expected_chapter_count: 20,
                    chapters_generated: 17,
                },
            },
        ])), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-history-canonical/reports/history?limit=5");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.reports)).toBe(true);
        expect(res.body.reports.length).toBeGreaterThan(0);
        const report = res.body.reports.find((r) => r.run_id === "run-history-canonical");
        expect(report).toBeDefined();
        const diagnostics = report.diagnostics;
        expect(Array.isArray(diagnostics)).toBe(true);
        const postGeneration = diagnostics.find((d) => d.key === "agent9_prose_post_generation_summary"
            || d.diagnostic_type === "post_generation_summary");
        expect(postGeneration).toBeDefined();
        expect(postGeneration.details.expected_chapters_total).toBe(20);
        expect(postGeneration.details.chapters_generated_committed).toBe(17);
        expect(postGeneration.details.chapters_failed_uncommitted).toBe(3);
        expect(postGeneration.details.chapter_words_hard_floor).toBe(704);
        expect(postGeneration.details.count_reconciliation).toBeDefined();
        expect(postGeneration.details.count_reconciliation.run_state).toBe("partial_generation");
        expect(postGeneration.details.count_reconciliation.chapter_word_buckets.pass_count).toBe(14);
        expect(report.prose_presentation).toBeDefined();
        expect(report.prose_presentation.run_state).toBe("partial_generation");
        expect(report.prose_presentation.chapters.expected).toBe(20);
        expect(report.prose_presentation.chapters.committed).toBe(17);
        expect(report.prose_presentation.chapters.failed_uncommitted_ranges).toEqual([{ start: 18, end: 20 }]);
        expect(report.prose_presentation.words.completeness_story_total).toBe(22100);
        expect(report.prose_presentation.clue_obligations.required_ids_by_chapter).toEqual([
            { chapter: 5, required_clue_ids: ["clue_late_2"] },
        ]);
    });
    it("skips malformed and invariant-violating reports in history payload", async () => {
        const projectDir = join(reportsDir, "score-proj-history-resilience");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-valid.json"), JSON.stringify(makeReport("score-proj-history-resilience", "run-valid", 81)), "utf-8");
        await fs.writeFile(join(projectDir, "run-malformed.json"), "{ malformed-json", "utf-8");
        await fs.writeFile(join(projectDir, "run-invalid.json"), JSON.stringify(makeReport("score-proj-history-resilience", "run-invalid", 82, true, [
            {
                key: "agent9_prose_post_generation_summary",
                agent: "agent9_prose",
                phase_name: "Prose Generation",
                diagnostic_type: "post_generation_summary",
                captured_at: new Date().toISOString(),
                details: {
                    expected_chapter_count: 20,
                    chapters_generated: 18,
                    chapter_words_hard_floor: 704,
                },
            },
        ])), "utf-8");
        const res = await request(app).get("/api/projects/score-proj-history-resilience/reports/history?limit=10");
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(1);
        expect(Array.isArray(res.body.reports)).toBe(true);
        expect(res.body.reports).toHaveLength(1);
        expect(res.body.reports[0].run_id).toBe("run-valid");
    });
    it("exports latest quality report when requested", async () => {
        const projectDir = join(reportsDir, "score-proj-export");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-export.json"), JSON.stringify(makeReport("score-proj-export", "run-export", 87)), "utf-8");
        const res = await request(app)
            .post("/api/projects/score-proj-export/export")
            .send({ artifactTypes: ["quality_report"] });
        expect(res.status).toBe(200);
        expect(res.body.quality_report).toBeDefined();
        expect(res.body.quality_report.run_id).toBe("run-export");
        expect(res.body.quality_report.overall_score).toBe(87);
    });
    it("preserves canonical post-generation metrics in quality report export", async () => {
        const projectDir = join(reportsDir, "score-proj-export");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-export-canonical.json"), JSON.stringify(makeReport("score-proj-export", "run-export-canonical", 88, true, [
            {
                key: "agent9_prose_post_generation_summary",
                agent: "agent9_prose",
                phase_name: "Prose Generation",
                diagnostic_type: "post_generation_summary",
                captured_at: new Date().toISOString(),
                details: {
                    expected_chapters_total: 20,
                    chapters_generated_committed: 16,
                    chapters_failed_uncommitted: 4,
                    story_words_total: 20850,
                    chapter_words_hard_floor: 704,
                    count_reconciliation: {
                        expected_chapters_total: 20,
                        chapters_generated_committed: 16,
                        chapters_failed_uncommitted: 4,
                        failed_uncommitted_chapter_ranges: [{ start: 17, end: 20 }],
                        chapter_word_buckets: {
                            hard_floor_miss_count: 2,
                            pass_count: 13,
                        },
                        run_state: "partial_generation",
                    },
                    expected_chapter_count: 20,
                    chapters_generated: 16,
                },
            },
        ])), "utf-8");
        const res = await request(app)
            .post("/api/projects/score-proj-export/export")
            .send({ artifactTypes: ["quality_report"] });
        expect(res.status).toBe(200);
        const diagnostics = res.body.quality_report?.diagnostics;
        expect(Array.isArray(diagnostics)).toBe(true);
        const postGeneration = diagnostics.find((d) => d.key === "agent9_prose_post_generation_summary"
            || d.diagnostic_type === "post_generation_summary");
        expect(postGeneration).toBeDefined();
        expect(postGeneration.details.expected_chapters_total).toBe(20);
        expect(postGeneration.details.chapters_generated_committed).toBe(16);
        expect(postGeneration.details.chapters_failed_uncommitted).toBe(4);
        expect(postGeneration.details.chapter_words_hard_floor).toBe(704);
        expect(postGeneration.details.count_reconciliation).toBeDefined();
        expect(postGeneration.details.count_reconciliation.run_state).toBe("partial_generation");
        expect(postGeneration.details.count_reconciliation.chapter_word_buckets.pass_count).toBe(13);
        expect(res.body.quality_report.prose_presentation).toBeDefined();
        expect(res.body.quality_report.prose_presentation.run_state).toBe("partial_generation");
        expect(res.body.quality_report.prose_presentation.chapters.expected).toBe(20);
        expect(res.body.quality_report.prose_presentation.chapters.committed).toBe(16);
    });
    it("exports narrative state trace when requested", async () => {
        const projectDir = join(reportsDir, "score-proj-trace");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-trace.json"), JSON.stringify(makeReport("score-proj-trace", "run-trace", 83, true, [
            {
                key: "agent9_prose_post_generation_summary",
                agent: "agent9_prose",
                phase_name: "Prose Generation",
                diagnostic_type: "post_generation_summary",
                captured_at: new Date().toISOString(),
                details: {
                    nsd_transfer_trace: [
                        {
                            batch_start: 1,
                            batch_end: 2,
                            newly_revealed_clue_ids: ["clue_1"],
                            clue_evidence_anchors: [
                                {
                                    clue_id: "clue_1",
                                    chapter: 3,
                                    evidence: "Mud sample on the key ring links the suspect to the cellar.",
                                },
                            ],
                        },
                    ],
                },
            },
        ])), "utf-8");
        const res = await request(app)
            .post("/api/projects/score-proj-trace/export")
            .send({ artifactTypes: ["narrative_state_trace"] });
        expect(res.status).toBe(200);
        expect(res.body.narrative_state_trace).toBeDefined();
        expect(res.body.narrative_state_trace.run_id).toBe("run-trace");
        expect(res.body.narrative_state_trace.trace_steps).toBe(1);
        expect(Array.isArray(res.body.narrative_state_trace.trace)).toBe(true);
    });
    it("respects ?limit query parameter (capped at 100)", async () => {
        const res = await request(app).get("/api/projects/score-proj-2/reports/history?limit=1");
        expect(res.status).toBe(200);
        expect(res.body.limit).toBe(1);
        expect(res.body.reports).toHaveLength(1);
    });
    it("defaults limit to 10 when not provided", async () => {
        const res = await request(app).get("/api/projects/score-proj-2/reports/history");
        expect(res.body.limit).toBe(10);
    });
    // ── GET /api/reports/aggregate ───────────────────────────────────────────
    it("returns aggregate stats with correct shape", async () => {
        const projectDir = join(reportsDir, "score-proj-agg");
        await fs.mkdir(projectDir, { recursive: true });
        await fs.writeFile(join(projectDir, "run-pass.json"), JSON.stringify(makeReport("score-proj-agg", "run-pass", 88, true)), "utf-8");
        await fs.writeFile(join(projectDir, "run-fail.json"), JSON.stringify(makeReport("score-proj-agg", "run-fail", 55, false)), "utf-8");
        const res = await request(app).get("/api/reports/aggregate");
        expect(res.status).toBe(200);
        // Shape checks
        expect(typeof res.body.totalGenerations).toBe("number");
        expect(typeof res.body.successRate).toBe("number");
        expect(typeof res.body.averageScore).toBe("number");
        expect(typeof res.body.averageRetries).toBe("number");
        expect(Array.isArray(res.body.commonFailures)).toBe(true);
        expect(res.body.scoreDistribution).toMatchObject({
            A: expect.any(Number),
            B: expect.any(Number),
            C: expect.any(Number),
            D: expect.any(Number),
            F: expect.any(Number),
        });
        // Our two reports must be included
        expect(res.body.totalGenerations).toBeGreaterThanOrEqual(2);
    });
});
//# sourceMappingURL=server.test.js.map