import type { Express } from "express";
import type { createRepository } from "./db.js";

type RepoPromise = ReturnType<typeof createRepository>;
type RunPipeline = (repoPromise: RepoPromise, projectId: string, runId: string, specPayload?: Record<string, unknown>) => Promise<unknown>;

/** POST /api/projects/:id/run — starts a pipeline run in the background and answers 202. */
export function registerRunRoute(app: Express, repoPromise: RepoPromise, runPipeline: RunPipeline): void {
  // Owner decision 11 (ORC-Q06, 2026-10-01): one pipeline at a time per API process. The pipeline keeps
  // run-scoped state in modules, so a second concurrent run is refused rather than made safe. The slot is
  // taken synchronously on arrival (two requests cannot both pass) and freed when the pipeline itself
  // settles — a run past PIPELINE_TIMEOUT_MS is marked idle but keeps executing, and keeps the slot.
  let activeRun: { projectId: string; runId?: string } | null = null;

  app.post("/api/projects/:id/run", (_req, res) => {
    if (activeRun) {
      res.status(409).json({
        error: "A pipeline run is already executing on this server; one run at a time (owner decision 11).",
        activeProjectId: activeRun.projectId,
        activeRunId: activeRun.runId ?? null,
      });
      return;
    }
    const slot: { projectId: string; runId?: string; scheduled?: boolean } = { projectId: _req.params.id };
    activeRun = slot;
    const release = () => { if (activeRun === slot) activeRun = null; };
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          release();
          res.status(404).json({ error: "Project not found" });
          return null;
        }

        const hasAzureCreds = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
        if (!hasAzureCreds) {
          release();
          res.status(503).json({ error: "Azure OpenAI credentials missing; pipeline requires LLM access." });
          return null;
        }

        return repoPromise.then(async (repo) => {
          const run = await repo.createRun(project.id, "running");
          slot.runId = run.id;
          await repo.setProjectStatus(project.id, "running");
          await repo.addRunEvent(run.id, "run_started", "Pipeline run started");

          const latestSpec = await repo.getLatestSpec(project.id);
          const specPayload = (latestSpec?.spec as Record<string, unknown>) ?? undefined;

          slot.scheduled = true;
          setTimeout(() => {
            const PIPELINE_TIMEOUT_MS = parseInt(process.env.PIPELINE_TIMEOUT_MS || "7200000", 10); // default 2 hours
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Pipeline exceeded maximum allowed duration")), PIPELINE_TIMEOUT_MS)
            );
            const pipeline = runPipeline(repoPromise, project.id, run.id, specPayload);
            pipeline.then(release, release);
            Promise.race([pipeline, timeoutPromise])
              .then(async () => {
                await repo.updateRunStatus(run.id, "idle");
                await repo.setProjectStatus(project.id, "idle");
                await repo.addRunEvent(run.id, "run_finished", "Pipeline run finished");
              })
              .catch(async () => {
                await repo.updateRunStatus(run.id, "idle");
                await repo.setProjectStatus(project.id, "idle");
                await repo.addRunEvent(run.id, "run_failed", "Pipeline failed");
              });
          }, 0);

          res.status(202).json({ status: "running", projectId: project.id, runId: run.id });
          return project;
        });
      })
      .catch(() => {
        // A failure before the pipeline was scheduled frees the slot; once scheduled, the pipeline frees it.
        if (!slot.scheduled) release();
        res.status(500).json({ error: "Failed to start run" });
      });
  });
}
