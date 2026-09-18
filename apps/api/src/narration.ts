import express from "express";
import { promises as fs } from "fs";
import { createReadStream } from "fs";
import path from "path";
import {
  listPrebuiltVoices,
  planNarration,
  renderBook,
  proseToMarkdown,
  pickProseArtifact,
  parseChapters,
  detectCast,
  normaliseOptions,
  ffmpegBinary,
  type AzureCreds,
  type NarrationOptions,
  type RenderResult,
  type Voice,
} from "@cml/narrator";
import type { ProjectRepository } from "./db.js";

/* ------------------------------------------------------------------ *
 * Narration: a manuscript in the store becomes an audiobook you can play
 * and download from the workshop.
 *
 * All the expensive, correctness-critical work lives in @cml/narrator so the
 * workshop and the standalone app run the SAME code. What lives here is the
 * HTTP surface, the job registry, and where files land.
 * ------------------------------------------------------------------ */

const PROSE_LENGTHS = ["short", "medium", "long"] as const;

/**
 * Env at call time, never a module const — a .env edit lands on the next request.
 *
 * The key falls back to AZURE_OPENAI_API_KEY because on this deployment the two
 * are the same resource: `openai-ds1sweden` answers the Speech endpoints as well
 * as the OpenAI ones (MEASURED — voices/list, synthesis and the Custom Voice
 * control plane all return 200 in swedencentral, 401 elsewhere). The fallback is
 * reported by /api/narration/status as `keySource`, so it is never silent — if a
 * deployment ever splits the two resources, set AZURE_SPEECH_KEY explicitly.
 */
const settings = () => ({
  key: process.env.AZURE_SPEECH_KEY || process.env.AZURE_OPENAI_API_KEY || "",
  keySource: process.env.AZURE_SPEECH_KEY
    ? "AZURE_SPEECH_KEY"
    : process.env.AZURE_OPENAI_API_KEY
      ? "AZURE_OPENAI_API_KEY (fallback)"
      : "none",
  region: process.env.AZURE_SPEECH_REGION || "swedencentral",
  outputFormat: process.env.AZURE_OUTPUT_FORMAT || "audio-24khz-160kbitrate-mono-mp3",
  apiVersion: process.env.AZURE_CUSTOMVOICE_API_VERSION || "2024-02-01-preview",
  baseModel: process.env.AZURE_PERSONAL_VOICE_BASE_MODEL || "DragonLatestNeural",
  root: process.env.NARRATION_DIR || path.resolve(process.cwd(), "data", "narration"),
  rates: {
    usdPerMillionNeural: Number(process.env.USD_PER_MILLION_NEURAL || 15),
    usdPerMillionPersonal: Number(process.env.USD_PER_MILLION_PERSONAL || 24),
    usdToGbp: Number(process.env.USD_TO_GBP || 0.79),
  },
});

const creds = (): AzureCreds => {
  const s = settings();
  return {
    key: s.key,
    region: s.region,
    outputFormat: s.outputFormat,
    apiVersion: s.apiVersion,
  };
};

type NarrationJob = {
  projectId: string;
  status: "queued" | "running" | "assembling" | "done" | "failed" | "cancelled";
  title: string;
  voice: Voice;
  options: NarrationOptions;
  createdAt: string;
  updatedAt: string;
  progress: { done: number; total: number; cachedHits: number; phase?: string };
  totals?: RenderResult["totals"];
  estimate?: RenderResult["cost"];
  outputs?: RenderResult["outputs"];
  durationSeconds?: number;
  durationLabel?: string;
  elapsedSeconds?: number;
  cost?: RenderResult["cost"];
  warnings?: string[];
  error?: string | null;
};

const jobs = new Map<string, NarrationJob>();
const controllers = new Map<string, AbortController>();

const projectDir = (projectId: string) => path.join(settings().root, "projects", projectId);
const cacheDir = () => path.join(settings().root, "cache");
const jobFile = (projectId: string) => path.join(projectDir(projectId), "job.json");

async function persist(job: NarrationJob) {
  try {
    await fs.mkdir(projectDir(job.projectId), { recursive: true });
    await fs.writeFile(jobFile(job.projectId), JSON.stringify(job, null, 2), "utf8");
  } catch {
    /* a lost status file must never fail a render that is otherwise fine */
  }
}

/** Recover a finished render after a server restart. */
async function loadJob(projectId: string): Promise<NarrationJob | null> {
  const live = jobs.get(projectId);
  if (live) return live;
  try {
    const raw = await fs.readFile(jobFile(projectId), "utf8");
    const job = JSON.parse(raw) as NarrationJob;
    // A render cannot survive a restart; anything mid-flight is stale.
    if (job.status === "running" || job.status === "queued" || job.status === "assembling") {
      job.status = "failed";
      job.error = "Interrupted by a server restart.";
    }
    jobs.set(projectId, job);
    return job;
  } catch {
    return null;
  }
}

/** The manuscript for a project, as narratable markdown. */
async function manuscriptFor(
  repo: ProjectRepository,
  projectId: string,
  length?: string
): Promise<{ markdown: string; title: string; chapters: number; source: string } | null> {
  const byType: Record<string, { payload: unknown }> = {};
  for (const len of PROSE_LENGTHS) {
    const a = await repo.getLatestArtifact(projectId, `prose_${len}`);
    if (a) byType[`prose_${len}`] = a as { payload: unknown };
  }
  const legacy = await repo.getLatestArtifact(projectId, "prose");
  if (legacy) byType.prose = legacy as { payload: unknown };

  const picked = pickProseArtifact(byType, length && PROSE_LENGTHS.includes(length as never) ? length : null);
  if (!picked) return null;

  const project = await repo.getProject(projectId);
  const converted = proseToMarkdown(picked.artifact.payload, {
    fallbackTitle: project?.name || "Mystery Story",
  });
  return {
    markdown: converted.markdown,
    title: converted.title,
    chapters: converted.chapters,
    source: picked.type,
  };
}

function sendAudio(req: express.Request, res: express.Response, file: string, download?: string) {
  // Range matters: a 70-minute mp3 cannot be scrubbed without it, and a player
  // that cannot seek is a progress bar you are not allowed to touch.
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", file.endsWith(".m4b") ? "audio/mp4" : "audio/mpeg");
  if (download) {
    res.setHeader("Content-Disposition", `attachment; filename="${download.replace(/"/g, "")}"`);
  }
  return new Promise<void>((resolve, reject) => {
    fs.stat(file)
      .then((stat) => {
        const range = req.headers.range;
        if (!range) {
          res.setHeader("Content-Length", String(stat.size));
          const stream = createReadStream(file);
          stream.on("error", reject).on("end", resolve);
          stream.pipe(res);
          return;
        }
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        const start = match && match[1] ? Number(match[1]) : 0;
        const end = match && match[2] ? Number(match[2]) : stat.size - 1;
        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
          res.status(416).setHeader("Content-Range", `bytes */${stat.size}`);
          res.end();
          resolve();
          return;
        }
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
        res.setHeader("Content-Length", String(end - start + 1));
        const stream = createReadStream(file, { start, end });
        stream.on("error", reject).on("end", resolve);
        stream.pipe(res);
      })
      .catch(reject);
  });
}

export const registerNarrationRoutes = (
  app: express.Express,
  repoPromise: Promise<ProjectRepository>
) => {
  const wrap =
    (fn: (req: express.Request, res: express.Response) => Promise<unknown>) =>
    (req: express.Request, res: express.Response) => {
      Promise.resolve(fn(req, res)).catch((e: unknown) => {
        const err = e as { status?: number; message?: string };
        const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
        // Azure 4xx (a dead key, a bad region) is the most likely failure here
        // and is invisible if only 5xx is logged.
        console.error("[narration]", err.message || e);
        if (!res.headersSent) res.status(status).json({ error: err.message || "Narration failed" });
      });
    };

  /* ------------------------------ capability ------------------------------ */

  app.get(
    "/api/narration/status",
    wrap(async (_req, res) => {
      const s = settings();
      res.json({
        configured: Boolean(s.key),
        keySource: s.keySource,
        region: s.region,
        baseModel: s.baseModel,
        ffmpeg: ffmpegBinary(),
        pricing: s.rates,
      });
    })
  );

  let voiceCache: { at: number; voices: Voice[] } = { at: 0, voices: [] };

  app.get(
    "/api/narration/voices",
    wrap(async (_req, res) => {
      if (!settings().key) {
        res.json({ voices: [], error: "AZURE_SPEECH_KEY is not set." });
        return;
      }
      if (Date.now() - voiceCache.at < 10 * 60 * 1000 && voiceCache.voices.length) {
        res.json({ voices: voiceCache.voices, cached: true });
        return;
      }
      try {
        const voices = await listPrebuiltVoices(creds());
        voiceCache = { at: Date.now(), voices };
        res.json({ voices });
      } catch (e) {
        res.json({ voices: [], error: (e as Error).message });
      }
    })
  );

  /**
   * Which cases already have audio.
   *
   * One call for the whole list view. Asking per row would be N requests to
   * render a page that mostly says "no".
   */
  app.get(
    "/api/narration/library",
    wrap(async (_req, res) => {
      const base = path.join(settings().root, "projects");
      let ids: string[] = [];
      try {
        ids = await fs.readdir(base);
      } catch {
        res.json({ narrations: [] });
        return;
      }
      const narrations = [];
      for (const id of ids) {
        const job = await loadJob(id);
        if (job?.status === "done" && job.outputs?.mp3) {
          narrations.push({
            projectId: id,
            title: job.title,
            durationLabel: job.durationLabel,
            durationSeconds: job.durationSeconds,
            hasM4b: Boolean(job.outputs.m4b),
            voice: job.voice?.label || job.voice?.id,
          });
        }
      }
      res.json({ narrations });
    })
  );

  /* -------------------------------- plan --------------------------------- */

  app.get(
    "/api/projects/:id/narration/plan",
    wrap(async (req, res) => {
      const repo = await repoPromise;
      const book = await manuscriptFor(repo, req.params.id, req.query.length as string | undefined);
      if (!book) {
        res.status(404).json({ error: "No manuscript yet - generate the prose first." });
        return;
      }
      const plan = planNarration(book.markdown, {
        voiceKind: (req.query.voiceKind as string) || "prebuilt",
        rates: settings().rates,
      });
      res.json({ ...plan, title: book.title, source: book.source });
    })
  );

  /** Who speaks, and how often. Reads the prose; costs nothing. */
  app.get(
    "/api/projects/:id/narration/cast",
    wrap(async (req, res) => {
      const repo = await repoPromise;
      const book = await manuscriptFor(repo, req.params.id, req.query.length as string | undefined);
      if (!book) {
        res.status(404).json({ error: "No manuscript yet." });
        return;
      }
      const { chapters } = parseChapters(book.markdown);
      const paragraphs = chapters.flatMap((c) =>
        c.blocks.filter((b) => b.type === "p").map((b) => b.text as string)
      );
      const cast = detectCast(paragraphs);
      res.json({ cast, speakers: cast.length, dialogueLines: cast.reduce((n, c) => n + c.lines, 0) });
    })
  );

  /* ------------------------------- render -------------------------------- */

  app.post(
    "/api/projects/:id/narration/render",
    wrap(async (req, res) => {
      const projectId = req.params.id;
      const s = settings();
      if (!s.key) {
        res.status(428).json({ error: "AZURE_SPEECH_KEY is not set on the API." });
        return;
      }
      if (controllers.has(projectId)) {
        res.status(409).json({ error: "A narration is already running for this case." });
        return;
      }

      const repo = await repoPromise;
      const body = (req.body || {}) as {
        voice?: Voice;
        options?: NarrationOptions;
        length?: string;
      };
      const voice: Voice = body.voice?.id
        ? body.voice
        : { id: "en-GB-RyanNeural", kind: "prebuilt", label: "Ryan", locale: "en-GB" };

      const book = await manuscriptFor(repo, projectId, body.length);
      if (!book) {
        res.status(404).json({ error: "No manuscript yet - generate the prose first." });
        return;
      }

      const options = normaliseOptions(body.options || {}, voice);
      const plan = planNarration(book.markdown, {
        options,
        voiceKind: voice.kind,
        rates: s.rates,
      });

      const job: NarrationJob = {
        projectId,
        status: "queued",
        title: book.title,
        voice,
        options,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: { done: 0, total: plan.totals.chunks, cachedHits: 0 },
        totals: plan.totals,
        estimate: plan.estimate,
        error: null,
      };
      jobs.set(projectId, job);
      await persist(job);

      const controller = new AbortController();
      controllers.set(projectId, controller);

      // Fire and forget: the client polls. Rendering a book takes minutes.
      void (async () => {
        try {
          job.status = "running";
          await persist(job);
          const out = await fs.mkdir(projectDir(projectId), { recursive: true }).then(() => projectDir(projectId));

          const result = await renderBook({
            markdown: book.markdown,
            title: book.title,
            voice,
            options,
            creds: creds(),
            dirs: { cache: cacheDir(), out },
            baseModel: s.baseModel,
            signal: controller.signal,
            rates: s.rates,
            onProgress: (p) => {
              job.progress = { done: p.done, total: p.total, cachedHits: p.cachedHits, phase: p.phase };
              job.status = p.phase === "assembling" ? "assembling" : "running";
              job.updatedAt = new Date().toISOString();
              void persist(job);
            },
          });

          Object.assign(job, {
            status: "done",
            outputs: result.outputs,
            warnings: result.warnings.length ? result.warnings : undefined,
            durationSeconds: result.durationSeconds,
            durationLabel: result.durationLabel,
            elapsedSeconds: result.elapsedSeconds,
            cost: result.cost,
            totals: result.totals,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          const err = e as { cancelled?: boolean; name?: string; message?: string };
          const aborted = controller.signal.aborted || err.cancelled || err.name === "AbortError";
          job.status = aborted ? "cancelled" : "failed";
          job.error = aborted ? "Cancelled" : err.message || String(e);
          job.updatedAt = new Date().toISOString();
          if (!aborted) console.error("[narration] render failed:", job.error);
        } finally {
          controllers.delete(projectId);
          await persist(job);
        }
      })();

      res.status(202).json({ job });
    })
  );

  app.get(
    "/api/projects/:id/narration",
    wrap(async (req, res) => {
      const job = await loadJob(req.params.id);
      if (!job) {
        res.json({ job: null });
        return;
      }
      res.json({ job, running: controllers.has(req.params.id) });
    })
  );

  app.post(
    "/api/projects/:id/narration/cancel",
    wrap(async (req, res) => {
      const controller = controllers.get(req.params.id);
      controller?.abort();
      res.json({ cancelled: Boolean(controller) });
    })
  );

  app.delete(
    "/api/projects/:id/narration",
    wrap(async (req, res) => {
      controllers.get(req.params.id)?.abort();
      jobs.delete(req.params.id);
      // The shared chunk cache is deliberately kept: it is content-addressed,
      // so it makes a re-render free rather than stale.
      await fs.rm(projectDir(req.params.id), { recursive: true, force: true });
      res.json({ ok: true });
    })
  );

  /* -------------------------------- audio -------------------------------- */

  const resolveOutput = async (projectId: string, which: "mp3" | "m4b") => {
    const job = await loadJob(projectId);
    const name = job?.outputs?.[which];
    if (!name) return null;
    const dir = projectDir(projectId);
    const file = path.resolve(dir, name);
    if (!file.startsWith(path.resolve(dir))) return null;
    return { file, name, job };
  };

  // Streamed for the in-page player (seekable).
  app.get(
    "/api/projects/:id/narration/audio",
    wrap(async (req, res) => {
      const found = await resolveOutput(req.params.id, "mp3");
      if (!found) {
        res.status(404).json({ error: "Not rendered yet" });
        return;
      }
      await sendAudio(req, res, found.file);
    })
  );

  // Same bytes, but as a download.
  app.get(
    "/api/projects/:id/narration/download",
    wrap(async (req, res) => {
      const which = req.query.format === "m4b" ? "m4b" : "mp3";
      const found = await resolveOutput(req.params.id, which);
      if (!found) {
        res.status(404).json({ error: `No ${which} rendered yet` });
        return;
      }
      await sendAudio(req, res, found.file, found.name);
    })
  );

  app.get(
    "/api/projects/:id/narration/chapter/:file",
    wrap(async (req, res) => {
      const dir = path.join(projectDir(req.params.id), "chapters");
      const file = path.resolve(dir, req.params.file);
      if (!file.startsWith(path.resolve(dir))) {
        res.status(400).json({ error: "Bad path" });
        return;
      }
      try {
        await fs.access(file);
      } catch {
        res.status(404).json({ error: "No such chapter" });
        return;
      }
      await sendAudio(req, res, file, req.query.download ? req.params.file : undefined);
    })
  );
};
