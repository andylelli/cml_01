/**
 * Book covers in the API — documentation/covers/COVER-HARNESS-PLAN.md.
 *
 * Owner, 2026-10-03: the cover is ONE image with the title painted in — never lettered afterwards — so it is
 * made as soon as the book HAS a title, and true to the story's decade:
 *
 *   setting artifact (Agent 1)   → rememberSetting: the picture's only source (place, atmosphere, era — no crime)
 *   cml artifact (Agent 3)       → startRunCover: CASE.meta.title is known → paint the finished cover   painting → ready
 *   story saved (end of run)     → finishRunCover: copy cover.png beside the manuscript; if the final title differs
 *                                  from the painted one, paint it again with the final title
 *
 * On demand, `POST /api/projects/:id/cover` makes a cover for any project with prose (from its opening chapters),
 * e.g. to remake one. A cover never fails or delays a run: every step is fire-and-forget from the run's side,
 * records a run event, and writes a `cover` artifact whose `status` the UI follows.
 */
import type { Express } from "express";
import express from "express";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import {
  resolveCoverRequest,
  createImageClientFromEnv,
  listCoverStyles,
  paintCover,
  resolveCardsDir,
  runCoverPostPass,
  storyInputFromSetting,
  type CoverChatClient,
  type CoverPostPassResult,
  type ImageClient,
  type TitleChecker,
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
  status: "painting" | "ready" | "failed";
  style: string;
  /** The finished cover (title painted in), workspace-relative. */
  path?: string;
  outDir?: string;
  /** The title painted into the image. */
  title?: string;
  styles?: string[];
  palette?: string;
  framing?: string;
  seed?: number;
  anchors?: unknown;
  /** The vision read-back of the painted title. */
  titleCheck?: { ok: boolean; read: string; attempts: number };
  provider?: string;
  model?: string;
  error?: string;
  /** "setting" = painted during the run from the setting; "opening" = made from a finished book's chapters. */
  source?: "setting" | "opening";
  generatedAt: string;
}

/** Test seams: fake image/text/title-check clients. Production builds all three from env. */
export interface CoverDeps {
  image?: ImageClient;
  llm?: CoverChatClient;
  checkTitle?: TitleChecker | null;
  env?: NodeJS.ProcessEnv;
}

const rel = (paths: CoverPaths, abs: string) => path.relative(paths.workspaceRoot, abs).replace(/\\/g, "/");
const abs = (paths: CoverPaths, relPath: string) => path.resolve(paths.workspaceRoot, relPath);

/** Projects with a cover being painted. A second request is refused (on demand) or waits and repaints (run). */
const busy = new Map<string, Promise<unknown>>();
export const coverInFlight = (projectId: string) => busy.has(projectId);

/** The run's setting payload, per project — the picture is painted from it once the title exists. */
const settings = new Map<string, unknown>();
/** Where the finished manuscript went, per project — the cover is copied there when it is ready. */
const storyDirOf = new Map<string, string>();

export const latestCover = async (repo: Repo, projectId: string) =>
  ((await repo.getLatestArtifact(projectId, "cover"))?.payload ?? null) as CoverState | null;

const save = (repo: Repo, projectId: string, state: CoverState) => repo.createArtifact(projectId, "cover", state, null);

const eventFor = (repo: Repo, runId?: string) => async (step: string, message: string) => {
  if (runId) await repo.addRunEvent(runId, step, message).catch(() => {});
};

/** Copy the ready cover beside the manuscript, when both exist. */
const copyBesideManuscript = async (repo: Repo, paths: CoverPaths, projectId: string) => {
  const dir = storyDirOf.get(projectId);
  const cur = await latestCover(repo, projectId);
  if (!dir || cur?.status !== "ready" || !cur.path) return;
  mkdirSync(dir, { recursive: true });
  copyFileSync(abs(paths, cur.path), path.join(dir, "cover.png"));
};

/** The run's setting arrived: remember it — it is the cover's only picture source. Nothing is painted yet. */
export const rememberSetting = (projectId: string, setting: unknown) => {
  settings.set(projectId, setting);
};

/**
 * The book has a title: paint the finished cover, title included. Called when the CML arrives (and again at the
 * end if the title changed). Not awaited by the run. If a painting is already running it is waited for, then
 * repainted only if its title is not the one wanted.
 */
export const startRunCover = async (
  repo: Repo,
  paths: CoverPaths,
  a: { projectId: string; runId: string; style: string; title: string; inputs?: Record<string, unknown> },
  deps: CoverDeps = {},
): Promise<void> => {
  const title = a.title.trim();
  const pending = busy.get(a.projectId);
  if (pending) {
    await pending.catch(() => {});
    const cur = await latestCover(repo, a.projectId);
    if (cur?.status === "ready" && cur.title === title) return;
  }
  const setting = settings.get(a.projectId) ?? (await repo.getLatestArtifact(a.projectId, "setting"))?.payload;
  const event = eventFor(repo, a.runId);
  const job = (async () => {
    const started = new Date().toISOString();
    await save(repo, a.projectId, { status: "painting", style: a.style, source: "setting", title, generatedAt: started });
    await event("cover_started", `Book cover: painting "${title}" (${a.style})`);
    const r = await paintCover({
      outDir: path.join(paths.storiesDir, "_covers", a.projectId, started.replace(/[:.]/g, "-")),
      style: a.style,
      input: storyInputFromSetting({ setting: setting as Record<string, unknown>, inputs: a.inputs, title }),
      logger: buildLlmLogger(paths.workspaceRoot),
      logContext: { runId: a.runId, projectId: a.projectId },
      log: (line) => console.log(line),
      ...deps,
    });
    const rec = r.manifest?.covers.find((c) => c.coverPath);
    if (!r.ok || !r.coverPath || !rec) {
      await save(repo, a.projectId, { status: "failed", style: a.style, source: "setting", title, error: r.error, generatedAt: new Date().toISOString() });
      await event("cover_warning", `Book cover skipped: ${r.error ?? "unknown error"}`);
      return;
    }
    await save(repo, a.projectId, {
      status: "ready",
      style: a.style,
      source: "setting",
      title,
      path: rel(paths, r.coverPath),
      outDir: rel(paths, r.outDir),
      styles: rec.styles,
      palette: rec.palette,
      framing: rec.framing,
      seed: r.manifest?.seed,
      anchors: r.manifest?.anchors,
      titleCheck: rec.titleCheck,
      provider: r.provider,
      model: r.model,
      generatedAt: new Date().toISOString(),
    });
    const check = rec.titleCheck ? (rec.titleCheck.ok ? " · title read back OK" : ` · title read back as "${rec.titleCheck.read}"`) : "";
    await event("cover_done", `Book cover ready (${rec.styles.join(" + ")}, ${rec.framing ?? ""})${check}`);
    await copyBesideManuscript(repo, paths, a.projectId);
  })();
  busy.set(a.projectId, job);
  try {
    await job;
  } finally {
    if (busy.get(a.projectId) === job) busy.delete(a.projectId);
  }
};

/**
 * End of the run: the manuscript is saved. Copy the cover beside it, and repaint when the final title differs from
 * the one painted (rare — the CML title is normally the book's title).
 */
export const finishRunCover = async (
  repo: Repo,
  paths: CoverPaths,
  a: { projectId: string; runId: string; style: string; title: string; storyDir: string; inputs?: Record<string, unknown> },
  deps: CoverDeps = {},
) => {
  storyDirOf.set(a.projectId, a.storyDir);
  await busy.get(a.projectId)?.catch(() => {});
  const cur = await latestCover(repo, a.projectId);
  if (cur?.status === "ready" && cur.title === a.title.trim()) return copyBesideManuscript(repo, paths, a.projectId);
  return startRunCover(repo, paths, a, deps);
};

/** Has this run already started (or made) its cover? */
export const hasRunCover = async (repo: Repo, projectId: string) => busy.has(projectId) || !!(await latestCover(repo, projectId));

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

/** A cover made from a FINISHED book's opening chapters — on demand, or when a run never produced a setting. */
export const startCover = async (
  repo: Repo,
  paths: CoverPaths,
  a: StartCoverArgs,
): Promise<CoverPostPassResult | { ok: false; error: string }> => {
  if (busy.has(a.projectId)) return { ok: false, error: "a cover is already being made for this project" };
  const event = eventFor(repo, a.runId);
  const job = (async () => {
    await save(repo, a.projectId, { status: "painting", style: a.style, source: "opening", title: a.title, generatedAt: new Date().toISOString() });
    await event("cover_started", `Book cover: painting "${a.title}" (${a.style})`);
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
    if (r.ok && r.coverPath && chosen) {
      await save(repo, a.projectId, {
        status: "ready",
        style: a.style,
        source: "opening",
        title: a.title,
        path: rel(paths, r.coverPath),
        outDir: rel(paths, r.outDir),
        styles: chosen.styles,
        palette: chosen.palette,
        framing: chosen.framing,
        seed: r.manifest?.seed,
        anchors: r.manifest?.anchors,
        titleCheck: chosen.titleCheck,
        provider: r.provider,
        model: r.model,
        generatedAt: new Date().toISOString(),
      });
      await event("cover_done", `Book cover ready (${chosen.styles.join(" + ")}, ${r.provider}/${r.model})`);
    } else {
      await save(repo, a.projectId, { status: "failed", style: a.style, source: "opening", title: a.title, error: r.error, generatedAt: new Date().toISOString() });
      await event("cover_warning", `Book cover skipped: ${r.error ?? "unknown error"}`);
      console.log(`[covers] ${a.projectId}: ${r.error}`);
    }
    return r;
  })();
  busy.set(a.projectId, job);
  try {
    return await job;
  } finally {
    busy.delete(a.projectId);
  }
};

/** What the cases list needs: the finished cover's URL (cache-busted) and the status. */
export const coverSummaryFor = async (repo: Repo, projectId: string) => {
  const cur = await latestCover(repo, projectId);
  if (!cur) return null;
  return {
    status: cur.status,
    imageUrl: cur.path ? `/api/projects/${projectId}/cover.png?v=${encodeURIComponent(cur.generatedAt)}` : null,
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
  /** The style library (with each card's decades) and whether an image model is configured. */
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
    res.json({
      ...cur,
      inProgress,
      imageUrl: cur.path ? `/api/projects/${req.params.id}/cover.png?v=${encodeURIComponent(cur.generatedAt)}` : null,
    });
  });

  /** The finished cover. A painting cover has no image yet (it appears whole, title included). */
  app.get("/api/projects/:id/cover.png", async (req, res) => {
    const repo = await repoPromise;
    const cur = await latestCover(repo, req.params.id);
    const file = cur?.path ? abs(paths, cur.path) : "";
    // The path comes from our own artifact, but it is still confined to stories/ before it is served.
    if (!cur?.path || !file.startsWith(paths.storiesDir + path.sep) || !existsSync(file)) {
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
    const storyFile = (await repo.getLatestArtifact(projectId, "story_file"))?.payload as { relPath?: string } | undefined;
    const storyDir = storyFile?.relPath
      ? path.join(paths.storiesDir, path.dirname(storyFile.relPath))
      : path.join(paths.storiesDir, "_covers", projectId, "opening");
    // The SAME title the app shows (synopsis first — storyTitleFor); it is painted into the cover.
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
    res.status(202).json({ started: true, style, title, provider: image.client.provider, model: image.client.model });
  });
};

/**
 * The run's cover hooks, so server.ts carries two calls instead of the logic (size ratchet).
 */
export const createRunCoverHooks = (
  repo: Repo,
  paths: CoverPaths,
  run: { projectId: string; runId: string; spec?: Record<string, unknown> },
) => {
  // The UI's "Book cover" choice (spec.coverStyle), else CML_COVER_GEN → "auto"; null = no cover this run.
  const coverStyle = resolveCoverRequest(run.spec?.coverStyle);
  return {
  /** Called for every artifact as the run persists it: remember the setting; paint once the CML names the book. */
  onArtifact(type: string, payload: unknown) {
    if (!coverStyle) return;
    if (type === "setting") rememberSetting(run.projectId, payload);
    else if (type === "cml") {
      const title = cleanStoryTitle((payload as { CASE?: { meta?: { title?: unknown } } } | null)?.CASE?.meta?.title);
      if (title) void startRunCover(repo, paths, { projectId: run.projectId, runId: run.runId, style: coverStyle, title, inputs: run.spec });
    }
  },
  /**
   * Called once the manuscript is saved: copy the cover beside it, repainting only if the final title differs.
   * Only when the run never started a cover (no titled CML) is one made now, from the finished chapters.
   */
  async onStorySaved(a: { storyRelPath: string; title: unknown; prose: Record<string, unknown>; inputs: unknown; cml: unknown }) {
    // Where the manuscript went — recorded for every run, so a cover made later (button) lands beside it.
    await repo.createArtifact(run.projectId, "story_file", { relPath: a.storyRelPath }, null);
    if (!coverStyle) return;
    const storyDir = path.join(paths.storiesDir, path.dirname(a.storyRelPath));
    const title = cleanStoryTitle(a.title) ?? "Untitled Mystery";
    if (await hasRunCover(repo, run.projectId)) {
      void finishRunCover(repo, paths, { projectId: run.projectId, runId: run.runId, style: coverStyle, title, storyDir, inputs: run.spec });
    } else {
      void startCover(repo, paths, {
        projectId: run.projectId,
        runId: run.runId,
        style: coverStyle,
        storyDir,
        title,
        prose: a.prose,
        inputs: a.inputs as Record<string, unknown>,
        cml: a.cml as Record<string, unknown>,
      });
    }
  },
  };
};

/** A project row for the cases list, with its cover summary (null when it has none). */
export const withCover = async <P extends { id: string }>(repo: Repo, project: P) => ({
  ...project,
  cover: await coverSummaryFor(repo, project.id),
});
