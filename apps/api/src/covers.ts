/**
 * Book covers in the API — documentation/covers/COVER-HARNESS-PLAN.md.
 *
 * In a UI run the cover is made FIRST, so it can be seen beside the artifacts while the book is written:
 *
 *   setting artifact (Agent 1, the run's first)  → startCoverFirst: paint the art, untitled   status "painting" → "art"
 *   cml artifact (Agent 3, CASE.meta.title)       → setCoverTitle: letter it (free)           status "ready"
 *   story saved (end of run)                      → setCoverTitle again with the final title, and copy cover.png
 *                                                   beside the manuscript
 *
 * On demand, `POST /api/projects/:id/cover` makes a cover for any project with prose (from its opening
 * chapters), e.g. to remake one. A cover never fails or delays a run: every step is fire-and-forget from the
 * run's point of view, records a run event, and writes a `cover` artifact whose `status` the UI follows.
 */
import type { Express } from "express";
import express from "express";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import {
  createImageClientFromEnv,
  letterCover,
  listCoverStyles,
  paintCoverArt,
  resolveCardsDir,
  runCoverPostPass,
  storyInputFromSetting,
  type CoverPostPassResult,
} from "@cml/covers";
import { buildLlmLogger } from "@cml/worker/jobs/cli-runtime.js";
import type { createRepository } from "./db.js";
import { cleanStoryTitle, storyTitleFor } from "./project-title.js";

type Repo = Awaited<ReturnType<typeof createRepository>>;
type RepoPromise = ReturnType<typeof createRepository>;

export interface CoverPaths {
  workspaceRoot: string;
  storiesDir: string;
}

/** The `cover` artifact payload. Each change appends a new artifact; the latest is the truth. */
export interface CoverState {
  status: "painting" | "art" | "ready" | "failed";
  style: string;
  /** The lettered cover (status "ready"), workspace-relative. */
  path?: string;
  /** The untitled art (status "art" and after), workspace-relative. */
  artPath?: string;
  /** The generateCovers out dir, workspace-relative — letterCover works there. */
  outDir?: string;
  title?: string;
  styles?: string[];
  palette?: string;
  framing?: string;
  seed?: number;
  anchors?: unknown;
  provider?: string;
  model?: string;
  error?: string;
  /** "setting" = painted first, during the run; "opening" = made from a finished book's chapters. */
  source?: "setting" | "opening";
  generatedAt: string;
}

const rel = (paths: CoverPaths, abs: string) => path.relative(paths.workspaceRoot, abs).replace(/\\/g, "/");
const abs = (paths: CoverPaths, relPath: string) => path.resolve(paths.workspaceRoot, relPath);

/** Projects with a cover being painted (first) or made (on demand). A second request is refused, not queued. */
const busy = new Set<string>();
export const coverInFlight = (projectId: string) => busy.has(projectId);

/** The latest title asked for, per project — a painting that finishes after the title arrived letters itself. */
const wantedTitle = new Map<string, string>();
/** Where the finished manuscript went, per project — the lettered cover is copied there too. */
const storyDirOf = new Map<string, string>();
/** Serialises lettering per project, so two titles arriving together cannot interleave their writes. */
const letterChain = new Map<string, Promise<unknown>>();

export const latestCover = async (repo: Repo, projectId: string) =>
  ((await repo.getLatestArtifact(projectId, "cover"))?.payload ?? null) as CoverState | null;

const save = (repo: Repo, projectId: string, state: CoverState) => repo.createArtifact(projectId, "cover", state, null);

const eventFor = (repo: Repo, runId?: string) => async (step: string, message: string) => {
  if (runId) await repo.addRunEvent(runId, step, message).catch(() => {});
};

/** Letter the current art with the wanted title, and copy it beside the manuscript when that exists. */
const letterNow = async (repo: Repo, paths: CoverPaths, projectId: string, runId?: string) => {
  const title = wantedTitle.get(projectId);
  const cur = await latestCover(repo, projectId);
  if (!title || !cur?.outDir || !cur.artPath || cur.status === "painting" || cur.status === "failed") return;
  const storyDir = storyDirOf.get(projectId);
  const event = eventFor(repo, runId);
  try {
    if (!(cur.status === "ready" && cur.title === title && cur.path)) {
      const r = await letterCover({ outDir: abs(paths, cur.outDir), title });
      await save(repo, projectId, { ...cur, status: "ready", title, path: rel(paths, r.coverPath), generatedAt: new Date().toISOString() });
      await event("cover_done", `Book cover lettered: "${title}"`);
    }
    if (storyDir) {
      mkdirSync(storyDir, { recursive: true });
      const latest = await latestCover(repo, projectId);
      if (latest?.path) copyFileSync(abs(paths, latest.path), path.join(storyDir, "cover.png"));
    }
  } catch (e) {
    await event("cover_warning", `Book cover lettering skipped: ${(e as Error).message}`);
  }
};

const queueLetter = (repo: Repo, paths: CoverPaths, projectId: string, runId?: string) => {
  const next = (letterChain.get(projectId) ?? Promise.resolve()).then(() => letterNow(repo, paths, projectId, runId));
  letterChain.set(projectId, next.catch(() => {}));
  return next;
};

/**
 * Paint the cover FIRST — from the run's setting artifact, before the book has a title. Called from the run's
 * artifact callback; not awaited by the run.
 */
export const startCoverFirst = async (
  repo: Repo,
  paths: CoverPaths,
  a: { projectId: string; runId: string; style: string; setting: unknown; inputs?: Record<string, unknown> },
  /** Test seam: fake image/text clients. Production builds both from env. */
  deps: Pick<Parameters<typeof paintCoverArt>[0], "image" | "llm" | "env"> = {},
) => {
  if (busy.has(a.projectId)) return;
  busy.add(a.projectId);
  const event = eventFor(repo, a.runId);
  const started = new Date().toISOString();
  try {
    await save(repo, a.projectId, { status: "painting", style: a.style, source: "setting", generatedAt: started });
    await event("cover_started", `Book cover: painting (${a.style})`);
    const outDir = path.join(paths.storiesDir, "_covers", a.projectId, started.replace(/[:.]/g, "-"));
    const r = await paintCoverArt({
      outDir,
      style: a.style,
      input: storyInputFromSetting({ setting: a.setting as Record<string, unknown>, inputs: a.inputs }),
      logger: buildLlmLogger(paths.workspaceRoot),
      logContext: { runId: a.runId, projectId: a.projectId },
      log: (line) => console.log(line),
      ...deps,
    });
    if (!r.ok || !r.artPath) {
      await save(repo, a.projectId, { status: "failed", style: a.style, source: "setting", error: r.error, generatedAt: new Date().toISOString() });
      await event("cover_warning", `Book cover skipped: ${r.error ?? "unknown error"}`);
      return;
    }
    const rec = r.manifest?.covers.find((c) => c.artPath);
    await save(repo, a.projectId, {
      status: "art",
      style: a.style,
      source: "setting",
      artPath: rel(paths, r.artPath),
      outDir: rel(paths, r.outDir),
      styles: rec?.styles,
      palette: rec?.palette,
      framing: rec?.framing,
      seed: r.manifest?.seed,
      anchors: r.manifest?.anchors,
      provider: r.provider,
      model: r.model,
      generatedAt: new Date().toISOString(),
    });
    await event("cover_art_done", `Book cover painted (${(rec?.styles ?? []).join(" + ")}, ${rec?.framing ?? ""}) — title to come`);
  } finally {
    busy.delete(a.projectId);
  }
  // A title may have arrived while the art was painting.
  await queueLetter(repo, paths, a.projectId, a.runId);
};

/**
 * The book has a (new) title — letter the cover with it. `storyDir`, when given, is where the manuscript was
 * saved; the lettered cover is copied there as cover.png.
 */
export const setCoverTitle = async (
  repo: Repo,
  paths: CoverPaths,
  a: { projectId: string; runId?: string; title: string; storyDir?: string },
) => {
  const title = a.title.trim();
  if (!title) return;
  wantedTitle.set(a.projectId, title);
  if (a.storyDir) storyDirOf.set(a.projectId, a.storyDir);
  await queueLetter(repo, paths, a.projectId, a.runId);
};

/** Is there an early (painted-first) cover for this project that lettering can use? */
export const hasPaintedCover = async (repo: Repo, projectId: string) => {
  const cur = await latestCover(repo, projectId);
  return !!cur && (cur.status === "painting" || !!cur.artPath);
};

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

/** A cover made from a FINISHED book's opening chapters — on demand, or when a run's early cover never started. */
export const startCover = async (
  repo: Repo,
  paths: CoverPaths,
  a: StartCoverArgs,
): Promise<CoverPostPassResult | { ok: false; error: string }> => {
  if (busy.has(a.projectId)) return { ok: false, error: "a cover is already being made for this project" };
  busy.add(a.projectId);
  const event = eventFor(repo, a.runId);
  try {
    await save(repo, a.projectId, { status: "painting", style: a.style, source: "opening", generatedAt: new Date().toISOString() });
    await event("cover_started", `Book cover: generating (${a.style})`);
    const r = await runCoverPostPass({
      storyDir: a.storyDir,
      style: a.style,
      title: a.title,
      prose: a.prose as never,
      inputs: a.inputs,
      cml: a.cml,
      logger: buildLlmLogger(paths.workspaceRoot),
      logContext: a.runId ? { runId: a.runId, projectId: a.projectId } : undefined,
      log: (line) => console.log(line),
    });
    const chosen = r.manifest?.covers.find((c) => c.coverPath);
    if (r.ok && r.coverPath && chosen?.artPath) {
      wantedTitle.set(a.projectId, a.title);
      await save(repo, a.projectId, {
        status: "ready",
        style: a.style,
        source: "opening",
        title: a.title,
        path: rel(paths, r.coverPath),
        artPath: rel(paths, path.join(r.outDir, chosen.artPath)),
        outDir: rel(paths, r.outDir),
        styles: chosen.styles,
        palette: chosen.palette,
        framing: chosen.framing,
        seed: r.manifest?.seed,
        anchors: r.manifest?.anchors,
        provider: r.provider,
        model: r.model,
        generatedAt: new Date().toISOString(),
      });
      await event("cover_done", `Book cover ready (${chosen.styles.join(" + ")}, ${r.provider}/${r.model})`);
    } else {
      await save(repo, a.projectId, { status: "failed", style: a.style, source: "opening", error: r.error, generatedAt: new Date().toISOString() });
      await event("cover_warning", `Book cover skipped: ${r.error ?? "unknown error"}`);
      console.log(`[covers] ${a.projectId}: ${r.error}`);
    }
    return r;
  } finally {
    busy.delete(a.projectId);
  }
};

/** What the cases list needs: the image to show (lettered if possible) and a cache-busting version. */
export const coverSummaryFor = async (repo: Repo, projectId: string) => {
  const cur = await latestCover(repo, projectId);
  if (!cur) return null;
  const hasImage = !!(cur.path || cur.artPath);
  return {
    status: cur.status,
    imageUrl: hasImage ? `/api/projects/${projectId}/cover.png?v=${encodeURIComponent(cur.generatedAt)}` : null,
    lettered: !!cur.path,
  };
};

const latestProse = async (repo: Repo, projectId: string) => {
  for (const type of ["prose_medium", "prose_short", "prose_long", "prose"]) {
    const art = await repo.getLatestArtifact(projectId, type);
    if (art) return art.payload as Record<string, unknown>;
  }
  return null;
};

export const registerCoverRoutes = (app: Express, repoPromise: RepoPromise, paths: CoverPaths) => {
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
    const cur = await latestCover(repo, req.params.id);
    const inProgress = coverInFlight(req.params.id) || cur?.status === "painting";
    if (!cur) {
      res.status(inProgress ? 202 : 404).json({ inProgress, error: inProgress ? undefined : "No cover yet" });
      return;
    }
    // Keep the cover's lettering in step with the title the app shows. Re-lettering is local and free; it runs
    // in the background and the next read returns the new image (generatedAt busts the cache).
    const shownTitle = await storyTitleFor(repo, req.params.id);
    if (shownTitle && cur.title !== shownTitle && cur.artPath && (cur.status === "ready" || cur.status === "art")) {
      void setCoverTitle(repo, paths, { projectId: req.params.id, title: shownTitle });
    }
    const hasImage = !!(cur.path || cur.artPath);
    res.json({
      ...cur,
      inProgress,
      lettered: !!cur.path,
      imageUrl: hasImage ? `/api/projects/${req.params.id}/cover.png?v=${encodeURIComponent(cur.generatedAt)}` : null,
    });
  });

  /** The lettered cover when there is one, else the untitled art (a cover painted first, title to come). */
  app.get("/api/projects/:id/cover.png", async (req, res) => {
    const repo = await repoPromise;
    const cur = await latestCover(repo, req.params.id);
    const relPath = cur?.path ?? cur?.artPath;
    const file = relPath ? abs(paths, relPath) : "";
    // The path comes from our own artifact, but it is still confined to stories/ before it is served.
    if (!relPath || !file.startsWith(paths.storiesDir + path.sep) || !existsSync(file)) {
      res.status(404).json({ error: "No cover image" });
      return;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(file);
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
      : path.join(paths.storiesDir, "_covers", projectId, "opening");
    // The SAME title the app shows (synopsis first — storyTitleFor), not the prose's own: MEASURED, they differ
    // ("The Manor Clock's Silent Betrayal" vs "The Shadows of Ashford Manor") and the cover read the wrong one.
    const title =
      (await storyTitleFor(repo, projectId)) ??
      cleanStoryTitle(prose.title) ??
      cleanStoryTitle(cml?.CASE?.meta?.title) ??
      "Untitled Mystery";
    const latestRun = await repo.getLatestRun(projectId);
    void startCover(repo, paths, {
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
