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
  });
});
