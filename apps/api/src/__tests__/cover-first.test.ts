import express from "express";
import request from "supertest";
import { existsSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createCanvas } from "@napi-rs/canvas";
import { describe, expect, it } from "vitest";
import { createRepository } from "../db.js";
import { coverSummaryFor, registerCoverRoutes, setCoverTitle, startCoverFirst } from "../covers.js";

/**
 * documentation/covers/ — the cover is made FIRST in a run: painted from the setting artifact, lettered when
 * the CML names the book, re-lettered with the final title and copied beside the manuscript. Fake image and
 * text clients; no network call is made.
 */
const fakeArt = () => {
  const c = createCanvas(1024, 1536);
  const x = c.getContext("2d");
  x.fillStyle = "#203040";
  x.fillRect(0, 0, 1024, 1536);
  return c.toBuffer("image/png");
};

const SETTING = {
  setting: {
    era: { decade: "1930s" },
    location: { type: "Country house", description: "A manor above a marsh." },
    atmosphere: { visualDescription: "Flint walls under a low sky.", weather: "fog", timeOfDay: "dusk", mood: "uneasy" },
  },
};

describe("cover made first, during the run", () => {
  it("paints from the setting, letters with the CML title, re-letters and copies at the end", async () => {
    const root = mkdtempSync(join(tmpdir(), "cml-cover-first-"));
    const paths = { workspaceRoot: root, storiesDir: join(root, "stories") };
    const repo = await createRepository();
    const app = express();
    registerCoverRoutes(app, Promise.resolve(repo), paths);
    const project = await repo.createProject("Cover First");
    const run = await repo.createRun(project.id, "running");
    let imageCalls = 0;

    await startCoverFirst(
      repo,
      paths,
      { projectId: project.id, runId: run.id, style: "auto", setting: SETTING, inputs: { primaryAxis: "spatial" } },
      {
        env: {} as NodeJS.ProcessEnv,
        image: { provider: "fake", model: "m", generate: async () => { imageCalls++; return { png: fakeArt(), provider: "fake", model: "m", latencyMs: 1 }; } },
        llm: { chat: async () => ({ content: JSON.stringify({ place: "a flint manor", clue_objects: ["a lamp"] }) }) },
      },
    );

    // Art, untitled: shown already, marked not lettered.
    let cover = await request(app).get(`/api/projects/${project.id}/cover`);
    expect(cover.body.status).toBe("art");
    expect(cover.body.lettered).toBe(false);
    expect((await request(app).get(`/api/projects/${project.id}/cover.png`)).status).toBe(200);
    expect((await coverSummaryFor(repo, project.id))?.imageUrl).toMatch(/cover\.png\?v=/);

    // Agent 3 names the book.
    await setCoverTitle(repo, paths, { projectId: project.id, runId: run.id, title: "The Marsh Clock" });
    cover = await request(app).get(`/api/projects/${project.id}/cover`);
    expect(cover.body).toMatchObject({ status: "ready", lettered: true, title: "The Marsh Clock" });

    // End of run: final title differs; the cover goes beside the manuscript.
    const storyDir = join(paths.storiesDir, "story_x");
    await setCoverTitle(repo, paths, { projectId: project.id, runId: run.id, title: "Death at the Marsh", storyDir });
    cover = await request(app).get(`/api/projects/${project.id}/cover`);
    expect(cover.body.title).toBe("Death at the Marsh");
    expect(existsSync(join(storyDir, "cover.png"))).toBe(true);
    expect(imageCalls).toBe(1);

    const events = (await repo.getRunEvents(run.id)).map((e) => e.step);
    expect(events).toEqual(expect.arrayContaining(["cover_started", "cover_art_done", "cover_done"]));
  });

  it("a title that arrives while the art is still painting is applied when it finishes", async () => {
    const root = mkdtempSync(join(tmpdir(), "cml-cover-first-"));
    const paths = { workspaceRoot: root, storiesDir: join(root, "stories") };
    const repo = await createRepository();
    const project = await repo.createProject("Early Title");
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const painting = startCoverFirst(
      repo,
      paths,
      { projectId: project.id, runId: "r", style: "auto", setting: SETTING },
      {
        env: {} as NodeJS.ProcessEnv,
        image: { provider: "fake", model: "m", generate: async () => { await gate; return { png: fakeArt(), provider: "fake", model: "m", latencyMs: 1 }; } },
        llm: { chat: async () => ({ content: JSON.stringify({ place: "a manor", clue_objects: ["a key"] }) }) },
      },
    );
    await new Promise((r) => setTimeout(r, 50));
    await setCoverTitle(repo, paths, { projectId: project.id, title: "Came Early" });
    release();
    await painting;
    const cur = (await repo.getLatestArtifact(project.id, "cover"))?.payload as { status: string; title: string };
    expect(cur).toMatchObject({ status: "ready", title: "Came Early" });
  });
});
