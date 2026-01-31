describe("Export API", () => {
  it("exports selected artifacts as a JSON file", async () => {
    // Create project and run pipeline to generate artifacts
    const created = await request(app).post("/api/projects").send({ name: "Export Project" });
    await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s", locationPreset: "CountryHouse" });
    await request(app).post(`/api/projects/${created.body.id}/run`);
    // Wait for pipeline to finish (simulate with delay)
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Export setting and cast artifacts
    const response = await request(app)
      .post(`/api/projects/${created.body.id}/export`)
      .send({ artifactTypes: ["setting", "cast"] });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.headers["content-disposition"]).toMatch(/attachment/);
    const exported = response.body;
    expect(exported.setting).toBeDefined();
    expect(exported.cast).toBeDefined();
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
    vi.useFakeTimers();
    const created = await request(app).post("/api/projects").send({ name: "Run Project" });

    const run = await request(app).post(`/api/projects/${created.body.id}/run`);
    expect(run.status).toBe(202);

    vi.advanceTimersByTime(0);

    const latestRun = await request(app).get(`/api/projects/${created.body.id}/runs/latest`);
    expect(latestRun.status).toBe(200);

    const events = await request(app).get(`/api/runs/${latestRun.body.id}/events`);
    expect(events.status).toBe(200);
    expect(events.body.events.length).toBeGreaterThan(0);

    const setting = await request(app).get(`/api/projects/${created.body.id}/setting/latest`);
    expect(setting.status).toBe(200);

    const cast = await request(app).get(`/api/projects/${created.body.id}/cast/latest`);
    expect(cast.status).toBe(200);

    const gamePack = await request(app).get(`/api/projects/${created.body.id}/game-pack/latest`);
    expect(gamePack.status).toBe(200);

    const fairPlay = await request(app).get(`/api/projects/${created.body.id}/fair-play/latest`);
    expect(fairPlay.status).toBe(200);

    const settingValidation = await request(app).get(
      `/api/projects/${created.body.id}/setting/validation/latest`,
    );
    expect(settingValidation.status).toBe(200);

    const castValidation = await request(app).get(`/api/projects/${created.body.id}/cast/validation/latest`);
    expect(castValidation.status).toBe(200);

    const cml = await request(app)
      .get(`/api/projects/${created.body.id}/cml/latest`)
      .set("x-cml-mode", "advanced");
    expect(cml.status).toBe(200);

    const running = await request(app).get(`/api/projects/${created.body.id}/status`);
    expect(running.body.status).toBe("running");

    vi.advanceTimersByTime(5000);

    const idle = await request(app).get(`/api/projects/${created.body.id}/status`);
    expect(idle.body.status).toBe("idle");
  });

  it("regenerates a single artifact scope", async () => {
    const created = await request(app).post("/api/projects").send({ name: "Regen Project" });
    await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s" });
    await request(app).post(`/api/projects/${created.body.id}/run`);

    const regen = await request(app)
      .post(`/api/projects/${created.body.id}/regenerate`)
      .send({ scope: "clues" });
    expect(regen.status).toBe(200);

    const clues = await request(app).get(`/api/projects/${created.body.id}/clues/latest`);
    expect(clues.status).toBe(200);
    expect(clues.body.payload?.items?.length).toBeGreaterThan(0);
    expect(clues.body.payload?.items?.[0]?.revealChapter).toBeDefined();
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
    await request(app).post(`/api/projects/${created.body.id}/run`);

    const response = await request(app).get(`/api/projects/${created.body.id}/game-pack/pdf`);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/pdf/);
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
