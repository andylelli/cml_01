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
import { tmpdir } from "os";
import { FileReportRepository } from "@cml/story-validation";

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
    } finally {
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
    } finally {
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
  let reportsDir: string;

  /** Minimal valid GenerationReport written to disk so the API can read it */
  function makeReport(projectId: string, runId: string, score = 82, passed = true) {
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
    // Write reports to the location the server will look for them:
    // process.cwd()/apps/api/data/reports  (first candidate in getReportRepository)
    reportsDir = join(process.cwd(), "apps", "api", "data", "reports");
    await fs.mkdir(reportsDir, { recursive: true });
  });

  afterAll(async () => {
    // Remove only the test project directories we created
    for (const proj of ["score-proj-1", "score-proj-2", "score-proj-agg"]) {
      await fs.rm(join(reportsDir, proj), { recursive: true, force: true });
    }
  });

  // ── GET /api/projects/:projectId/runs/:runId/report ──────────────────────

  it("returns 404 when no report exists for a project/run", async () => {
    const res = await request(app).get(
      "/api/projects/nonexistent-proj/runs/nonexistent-run/report"
    );
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  it("returns 200 with report JSON when report exists", async () => {
    const projectDir = join(reportsDir, "score-proj-1");
    await fs.mkdir(projectDir, { recursive: true });
    await fs.writeFile(
      join(projectDir, "run-abc.json"),
      JSON.stringify(makeReport("score-proj-1", "run-abc", 85)),
      "utf-8"
    );

    const res = await request(app).get(
      "/api/projects/score-proj-1/runs/run-abc/report"
    );
    expect(res.status).toBe(200);
    expect(res.body.project_id).toBe("score-proj-1");
    expect(res.body.run_id).toBe("run-abc");
    expect(res.body.overall_score).toBe(85);
    expect(res.body.overall_grade).toBe("B");
    expect(res.body.passed).toBe(true);
    expect(res.body.summary).toBeDefined();
  });

  // ── GET /api/projects/:projectId/reports/history ─────────────────────────

  it("returns empty reports array when project has no reports", async () => {
    const res = await request(app).get(
      "/api/projects/score-proj-empty/reports/history"
    );
    expect(res.status).toBe(200);
    expect(res.body.reports).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it("returns reports list with correct envelope shape", async () => {
    const projectDir = join(reportsDir, "score-proj-2");
    await fs.mkdir(projectDir, { recursive: true });
    await fs.writeFile(
      join(projectDir, "run-1.json"),
      JSON.stringify(makeReport("score-proj-2", "run-1", 80)),
      "utf-8"
    );
    await fs.writeFile(
      join(projectDir, "run-2.json"),
      JSON.stringify(makeReport("score-proj-2", "run-2", 90)),
      "utf-8"
    );

    const res = await request(app).get(
      "/api/projects/score-proj-2/reports/history"
    );
    expect(res.status).toBe(200);
    expect(res.body.projectId).toBe("score-proj-2");
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.reports)).toBe(true);
    expect(res.body.reports).toHaveLength(2);
  });

  it("respects ?limit query parameter (capped at 100)", async () => {
    const res = await request(app).get(
      "/api/projects/score-proj-2/reports/history?limit=1"
    );
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(1);
    expect(res.body.reports).toHaveLength(1);
  });

  it("defaults limit to 10 when not provided", async () => {
    const res = await request(app).get(
      "/api/projects/score-proj-2/reports/history"
    );
    expect(res.body.limit).toBe(10);
  });

  // ── GET /api/reports/aggregate ───────────────────────────────────────────

  it("returns aggregate stats with correct shape", async () => {
    const projectDir = join(reportsDir, "score-proj-agg");
    await fs.mkdir(projectDir, { recursive: true });
    await fs.writeFile(
      join(projectDir, "run-pass.json"),
      JSON.stringify(makeReport("score-proj-agg", "run-pass", 88, true)),
      "utf-8"
    );
    await fs.writeFile(
      join(projectDir, "run-fail.json"),
      JSON.stringify(makeReport("score-proj-agg", "run-fail", 55, false)),
      "utf-8"
    );

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
