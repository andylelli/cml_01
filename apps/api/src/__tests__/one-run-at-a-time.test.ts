import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * Owner decision 11 (ORC-Q06, 2026-10-01): the API refuses a second concurrent pipeline run. The slot is freed
 * when the pipeline settles, not when the request returns.
 */
const pending: Array<{ reject: (e: Error) => void }> = [];
vi.mock("@cml/worker/jobs/mystery-orchestrator.js", () => ({
  generateMystery: vi.fn(() => new Promise((_resolve, reject) => { pending.push({ reject }); })),
}));

const { createServer } = await import("../server.js");
const { generateMystery } = await import("@cml/worker/jobs/mystery-orchestrator.js");
const app = createServer();

describe("one pipeline run at a time", () => {
  const saved = { endpoint: process.env.AZURE_OPENAI_ENDPOINT, key: process.env.AZURE_OPENAI_API_KEY, deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME };
  beforeAll(() => {
    process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com";
    process.env.AZURE_OPENAI_API_KEY = "test-key";
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME = "test-deployment";
  });
  afterAll(() => {
    process.env.AZURE_OPENAI_ENDPOINT = saved.endpoint;
    process.env.AZURE_OPENAI_API_KEY = saved.key;
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME = saved.deployment;
  });

  const project = async (name: string) => {
    const created = await request(app).post("/api/projects").send({ name });
    await request(app).post(`/api/projects/${created.body.id}/specs`).send({ decade: "1930s", locationPreset: "CountryHouse" });
    return created.body.id as string;
  };

  it("refuses a second run with 409 while the first executes, and accepts one once it settles", async () => {
    const a = await project("Run A");
    const b = await project("Run B");

    const first = await request(app).post(`/api/projects/${a}/run`);
    expect(first.status).toBe(202);
    await vi.waitFor(() => expect(generateMystery).toHaveBeenCalledTimes(1));

    const second = await request(app).post(`/api/projects/${b}/run`);
    expect(second.status).toBe(409);
    expect(second.body.activeProjectId).toBe(a);
    expect(second.body.activeRunId).toBe(first.body.runId);

    pending[0].reject(new Error("the first run fails"));
    await vi.waitFor(async () => {
      const third = await request(app).post(`/api/projects/${b}/run`);
      expect(third.status).toBe(202);
    });
  });

  it("an unknown project does not take the slot", async () => {
    await vi.waitFor(async () => {
      pending.splice(0).forEach((p) => p.reject(new Error("settle")));
      const missing = await request(app).post("/api/projects/no-such-project/run");
      expect(missing.status).toBe(404);
    });
    const missingAgain = await request(app).post("/api/projects/no-such-project/run");
    expect(missingAgain.status).toBe(404);
  });
});
