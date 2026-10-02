/**
 * Book covers in the API — documentation/covers/COVER-HARNESS-PLAN.md.
 *
 * Two ways in, one body (`startCover`):
 *   - after a run, when the spec asked for one (`coverStyle`) or CML_COVER_GEN is on — see server.ts;
 *   - on demand, `POST /api/projects/:id/cover`, for any project that has prose.
 *
 * A cover is a post-pass on a finished book: it never fails a run, and it is never awaited by one. Its
 * outcome is a run event (`cover_started` / `cover_done` / `cover_warning`) and a `cover` artifact.
 */
import type { Express } from "express";
import express from "express";
import { existsSync } from "fs";
import path from "path";
import {
  createImageClientFromEnv,
  listCoverStyles,
  resolveCardsDir,
  runCoverPostPass,
  type CoverPostPassResult,
} from "@cml/covers";
import { buildLlmLogger } from "@cml/worker/jobs/cli-runtime.js";
import type { createRepository } from "./db.js";

type Repo = Awaited<ReturnType<typeof createRepository>>;
type RepoPromise = ReturnType<typeof createRepository>;

export interface StartCoverArgs {
  projectId: string;
  /** Absent for an on-demand cover (no run to attach events to). */
  runId?: string;
  style: string;
  storyDir: string;
  title: string;
  prose: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  cml?: Record<string, unknown> | null;
}

/** One cover at a time per project — a second click while one is painting is refused, not queued. */
const inFlight = new Set<string>();
export const coverInFlight = (projectId: string) => inFlight.has(projectId);

const workspaceRootOf = (storyDir: string) => path.resolve(storyDir, "..", "..");

export const startCover = async (repo: Repo, a: StartCoverArgs): Promise<CoverPostPassResult | { ok: false; error: string }> => {
  if (inFlight.has(a.projectId)) return { ok: false, error: "a cover is already being made for this project" };
  inFlight.add(a.projectId);
  const event = async (step: string, message: string) => {
    if (a.runId) await repo.addRunEvent(a.runId, step, message).catch(() => {});
  };
  try {
    await event("cover_started", `Book cover: generating (${a.style})`);
    const root = workspaceRootOf(a.storyDir);
    const r = await runCoverPostPass({
      storyDir: a.storyDir,
      style: a.style,
      title: a.title,
      prose: a.prose as never,
      inputs: a.inputs,
      cml: a.cml,
      logger: buildLlmLogger(root),
      logContext: a.runId ? { runId: a.runId, projectId: a.projectId } : undefined,
      log: (line) => console.log(line),
    });
    if (r.ok && r.coverPath) {
      const chosen = r.manifest?.covers.find((c) => c.coverPath);
      await repo.createArtifact(
        a.projectId,
        "cover",
        {
          path: path.relative(root, r.coverPath).replace(/\\/g, "/"),
          outDir: path.relative(root, r.outDir).replace(/\\/g, "/"),
          style: a.style,
          styles: chosen?.styles ?? [],
          palette: chosen?.palette,
          anchors: r.manifest?.anchors,
          provider: r.provider,
          model: r.model,
          generatedAt: new Date().toISOString(),
        },
        null,
      );
      await event("cover_done", `Book cover ready (${(chosen?.styles ?? [a.style]).join(" + ")}, ${r.provider}/${r.model})`);
    } else {
      await event("cover_warning", `Book cover skipped: ${r.error ?? "unknown error"}`);
      console.log(`[covers] ${a.projectId}: ${r.error}`);
    }
    return r;
  } finally {
    inFlight.delete(a.projectId);
  }
};

const latestProse = async (repo: Repo, projectId: string) => {
  for (const type of ["prose_medium", "prose_short", "prose_long", "prose"]) {
    const art = await repo.getLatestArtifact(projectId, type);
    if (art) return art.payload as Record<string, unknown>;
  }
  return null;
};

export const registerCoverRoutes = (
  app: Express,
  repoPromise: RepoPromise,
  paths: { workspaceRoot: string; storiesDir: string },
) => {
  /** The style library and whether an image model is configured — the UI's select reads this. */
  app.get("/api/cover-styles", (_req, res) => {
    try {
      const styles = listCoverStyles(resolveCardsDir(paths.workspaceRoot));
      const image = createImageClientFromEnv(process.env);
      res.json({
        styles,
        image: image.client ? { provider: image.client.provider, model: image.client.model } : null,
        imageError: image.error ?? null,
      });
    } catch (e) {
      res.status(500).json({ error: `cover styles unavailable: ${(e as Error).message}` });
    }
  });

  app.get("/api/projects/:id/cover", async (req, res) => {
    const repo = await repoPromise;
    const art = await repo.getLatestArtifact(req.params.id, "cover");
    const inProgress = coverInFlight(req.params.id);
    if (!art) {
      res.status(inProgress ? 202 : 404).json({ inProgress, error: inProgress ? undefined : "No cover yet" });
      return;
    }
    res.json({ ...(art.payload as Record<string, unknown>), inProgress, imageUrl: `/api/projects/${req.params.id}/cover.png` });
  });

  app.get("/api/projects/:id/cover.png", async (req, res) => {
    const repo = await repoPromise;
    const art = await repo.getLatestArtifact(req.params.id, "cover");
    const rel = (art?.payload as { path?: string } | undefined)?.path;
    const abs = rel ? path.resolve(paths.workspaceRoot, rel) : "";
    // The path comes from our own artifact, but it is still confined to stories/ before it is served.
    if (!rel || !abs.startsWith(paths.storiesDir + path.sep) || !existsSync(abs)) {
      res.status(404).json({ error: "No cover image" });
      return;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(abs);
  });

  /** Make (or remake) a cover for a finished project. 202 + poll GET /cover; refused while one is painting. */
  app.post("/api/projects/:id/cover", express.json(), async (req, res) => {
    const repo = await repoPromise;
    const projectId = req.params.id;
    if (coverInFlight(projectId)) {
      res.status(409).json({ error: "A cover is already being made for this project" });
      return;
    }
    const prose = await latestProse(repo, projectId);
    if (!prose) {
      res.status(404).json({ error: "This project has no prose yet" });
      return;
    }
    const image = createImageClientFromEnv(process.env);
    if (!image.client) {
      res.status(503).json({ error: image.error });
      return;
    }
    const style = typeof req.body?.style === "string" && req.body.style.trim() ? req.body.style.trim() : "auto";
    const spec = (await repo.getLatestSpec(projectId))?.spec as Record<string, unknown> | undefined;
    const cml = (await repo.getLatestArtifact(projectId, "cml"))?.payload as Record<string, any> | undefined;
    const synopsis = (await repo.getLatestArtifact(projectId, "synopsis"))?.payload as { title?: string } | undefined;
    const storyFile = (await repo.getLatestArtifact(projectId, "story_file"))?.payload as { relPath?: string } | undefined;
    const storyDir = storyFile?.relPath
      ? path.join(paths.storiesDir, path.dirname(storyFile.relPath))
      : path.join(paths.storiesDir, `covers_${projectId}`);
    const title =
      (typeof prose.title === "string" && prose.title) || synopsis?.title || cml?.CASE?.meta?.title || "Untitled Mystery";
    const latestRun = await repo.getLatestRun(projectId);
    void startCover(repo, {
      projectId,
      runId: latestRun?.id,
      style,
      storyDir,
      title,
      prose,
      inputs: spec ? { ...spec, eraPreference: spec.decade } : undefined,
      cml,
    });
    res.status(202).json({ started: true, style, provider: image.client.provider, model: image.client.model });
  });
};
