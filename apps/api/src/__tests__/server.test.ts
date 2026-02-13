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
import { describe, expect, it, vi, afterEach } from "vitest";
import { createServer } from "../server.js";

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
