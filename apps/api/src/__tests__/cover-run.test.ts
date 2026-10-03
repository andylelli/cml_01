import express from "express";
import request from "supertest";
import { existsSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createCanvas } from "@napi-rs/canvas";
import { describe, expect, it } from "vitest";
import { createRepository } from "../db.js";
import { coverSummaryFor, finishRunCover, registerCoverRoutes, rememberSetting, startRunCover, type CoverDeps } from "../covers.js";

/**
 * documentation/covers/ — owner, 2026-10-03: ONE image with the title painted in, made once the CML names the
 * book, from the setting, true to the decade. Fake image / text / title-check clients; no network call is made.
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
    era: { decade: "1940s" },
    location: { type: "Country house", description: "A manor above a marsh." },
    atmosphere: { visualDescription: "Flint walls under a low sky.", weather: "fog", timeOfDay: "dusk", mood: "uneasy" },
  },
};
const FORTIES = ["home-front-poster", "wpa-exhibition-poster", "wpa-theatre-poster"];

const setup = async () => {
  const root = mkdtempSync(join(tmpdir(), "cml-cover-run-"));
  const paths = { workspaceRoot: root, storiesDir: join(root, "stories") };
  const repo = await createRepository();
  const app = express();
  registerCoverRoutes(app, Promise.resolve(repo), paths);
  const project = await repo.createProject("Cover Run");
  const run = await repo.createRun(project.id, "running");
  const prompts: string[] = [];
  const deps: CoverDeps = {
    env: {} as NodeJS.ProcessEnv,
    image: { provider: "fake", model: "m", generate: async (r) => { prompts.push(r.prompt); return { png: fakeArt(), provider: "fake", model: "m", latencyMs: 1 }; } },
    llm: { chat: async () => ({ content: JSON.stringify({ place: "a flint manor", clue_objects: ["a lamp"] }) }) },
    checkTitle: async (_png, title) => ({ ok: true, read: title.toUpperCase() }),
  };
  return { paths, repo, app, project, run, prompts, deps };
};

describe("cover in a run: painted once the title exists, title included", () => {
  it("setting is remembered (nothing painted); the CML title paints ONE finished cover from a 1940s card", async () => {
    const { paths, repo, app, project, run, prompts, deps } = await setup();
    rememberSetting(project.id, SETTING);
    expect(prompts).toHaveLength(0);

    await startRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "The Marsh Clock" }, deps);
    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toContain('exactly: "The Marsh Clock"');

    const cover = await request(app).get(`/api/projects/${project.id}/cover`);
    expect(cover.body).toMatchObject({ status: "ready", title: "The Marsh Clock", inProgress: false });
    expect(FORTIES).toContain(cover.body.styles[0]);
    expect(cover.body.titleCheck).toMatchObject({ ok: true, attempts: 1 });
    expect((await request(app).get(`/api/projects/${project.id}/cover.png`)).status).toBe(200);
    expect((await coverSummaryFor(repo, project.id))?.imageUrl).toMatch(/cover\.png\?v=/);

    const events = (await repo.getRunEvents(run.id)).map((e) => e.step);
    expect(events).toEqual(expect.arrayContaining(["cover_started", "cover_done"]));
  });

  it("end of run, same title: no new image, the cover is copied beside the manuscript", async () => {
    const { paths, repo, project, run, prompts, deps } = await setup();
    rememberSetting(project.id, SETTING);
    await startRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "The Marsh Clock" }, deps);
    const storyDir = join(paths.storiesDir, "story_x");
    await finishRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "The Marsh Clock", storyDir }, deps);
    expect(prompts).toHaveLength(1);
    expect(existsSync(join(storyDir, "cover.png"))).toBe(true);
  });

  it("end of run, a different final title: the cover is PAINTED again with it (never re-lettered)", async () => {
    const { paths, repo, project, run, prompts, deps } = await setup();
    rememberSetting(project.id, SETTING);
    await startRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "The Marsh Clock" }, deps);
    const storyDir = join(paths.storiesDir, "story_y");
    await finishRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "Death at the Marsh", storyDir }, deps);
    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain('exactly: "Death at the Marsh"');
    const cur = (await repo.getLatestArtifact(project.id, "cover"))?.payload as { title: string };
    expect(cur.title).toBe("Death at the Marsh");
    expect(existsSync(join(storyDir, "cover.png"))).toBe(true);
  });

  it("a second request for the same title while painting does not paint twice", async () => {
    const { paths, repo, project, run, prompts, deps } = await setup();
    rememberSetting(project.id, SETTING);
    const a = startRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "Same" }, deps);
    const b = startRunCover(repo, paths, { projectId: project.id, runId: run.id, style: "auto", title: "Same" }, deps);
    await Promise.all([a, b]);
    expect(prompts).toHaveLength(1);
  });
});
