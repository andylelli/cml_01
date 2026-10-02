import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "../server.js";

/**
 * documentation/covers/ — the API surface. No image call is ever made here: the routes are exercised up to
 * the point where a provider would be needed, and the "no provider" path is the one asserted.
 */
const app = createServer();
const saved = { ...process.env };
afterEach(() => {
  for (const k of ["OPENAI_API_KEY", "CML_COVER_IMAGE_PROVIDER", "AZURE_OPENAI_IMAGE_ENDPOINT"]) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("cover routes", () => {
  it("lists the style library and reports a missing image model instead of pretending", async () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.CML_COVER_IMAGE_PROVIDER;
    delete process.env.AZURE_OPENAI_IMAGE_ENDPOINT;
    const res = await request(app).get("/api/cover-styles");
    expect(res.status).toBe(200);
    expect(res.body.styles.map((s: { id: string }) => s.id)).toEqual([
      "deco-portrait",
      "flat-travel-poster",
      "magazine-illustration",
      "painterly-poster",
    ]);
    expect(res.body.image).toBeNull();
    expect(res.body.imageError).toMatch(/no image model configured/);
  });

  it("reports the configured provider when a key is present (no call is made)", async () => {
    process.env.OPENAI_API_KEY = "test-not-a-key";
    const res = await request(app).get("/api/cover-styles");
    expect(res.body.image).toEqual({ provider: "openai", model: "gpt-image-2" });
  });

  it("a project with no cover is 404; asking for one without prose is refused", async () => {
    const created = await request(app).post("/api/projects").send({ name: "Cover Project" });
    const id = created.body.id;
    expect((await request(app).get(`/api/projects/${id}/cover`)).status).toBe(404);
    expect((await request(app).get(`/api/projects/${id}/cover.png`)).status).toBe(404);
    const post = await request(app).post(`/api/projects/${id}/cover`).send({ style: "auto" });
    expect(post.status).toBe(404);
    expect(post.body.error).toMatch(/no prose/);
  });
});
