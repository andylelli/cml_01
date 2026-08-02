/**
 * R5 (architecture/REVIEW.md) — resume CLI. The operator-facing end of durable execution.
 *
 * A run that dies at Agent 9 has already produced thirteen stages of artifacts and spent ~£1.40 of
 * its ~£1.50. Today the only recovery is to start again from stage 1. This entry point restores what
 * the dead run persisted and continues from the first stage that is missing.
 *
 * WHY A CLI AND NOT AN API ROUTE. The failures this exists for — a hung socket, a Windows process
 * abort, a laptop entering standby — kill the API process too. The recovery tool has to be something
 * an operator can run afterwards from a shell, against the artifacts on disk. The orchestrator input
 * (`resumeArtifacts`) is generic, so an API route can be added later without touching the pipeline.
 *
 * Usage (from repo root, after `npm run build:all`):
 *   node --use-system-ca apps/worker/dist/jobs/resume-run.js <projectId> [originalRunId]
 *
 * Env:
 *   RESUME_DRY=1              load + report what would be skipped, then exit before any LLM call
 *   RESUME_IGNORE_BUILD=1     proceed despite a build-fingerprint mismatch (records why in warnings)
 *   CML_WORKSPACE_ROOT        override workspace root (default: process.cwd())
 */

import { join } from "node:path";

import { generateMystery, type MysteryGenerationInputs } from "./mystery-orchestrator.js";
import { loadArtifactStore, loadProjectSpec } from "./artifact-store.js";
import { buildClient, loadEnvFiles } from "./cli-runtime.js";
import {
  checkBuildFingerprint,
  computeBuildFingerprint,
  loadResumeBundle,
  readRunFingerprint,
  RESUME_FIELD_BY_ARTIFACT,
  type ResumeArtifactName,
} from "./run-resume.js";
import { saveReadableStory, storyFolderName } from "./story-output.js";

/**
 * Enough of the pipeline to be worth resuming. Below `cml` there is nothing expensive to preserve —
 * agents 1–3 are a small fraction of run cost — and resuming from a sliver invites the subtler
 * failure of a run that is neither fresh nor faithful.
 */
const MINIMUM_USEFUL_ARTIFACT: ResumeArtifactName = "cml";

async function main(): Promise<void> {
  const projectId = process.argv[2];
  const originalRunId = (process.argv[3] || "").trim();
  if (!projectId) {
    console.error("Usage: node --use-system-ca apps/worker/dist/jobs/resume-run.js <projectId> [originalRunId]");
    process.exit(1);
    return;
  }

  const workspaceRoot = process.env.CML_WORKSPACE_ROOT || process.cwd();
  const workerAppRoot = join(workspaceRoot, "apps", "worker");
  const dry = process.env.RESUME_DRY === "1";
  loadEnvFiles(workspaceRoot);

  console.log(`[resume-run] project    : ${projectId}`);
  console.log(`[resume-run] workspace  : ${workspaceRoot}`);
  console.log(`[resume-run] mode       : ${dry ? "DRY (no LLM)" : "LIVE"}`);

  // ── what survived ──────────────────────────────────────────────────────────
  const store = loadArtifactStore(workspaceRoot);
  const { bundle, found, missing } = loadResumeBundle(store, projectId);

  console.log(`[resume-run] restored   : ${found.join(", ") || "(nothing)"}`);
  console.log(`[resume-run] will re-run: ${missing.join(", ") || "(nothing — run already complete)"}`);

  if (!found.includes(MINIMUM_USEFUL_ARTIFACT)) {
    console.error(
      `[resume-run] REFUSING: no '${MINIMUM_USEFUL_ARTIFACT}' artifact for this project. There is not enough ` +
        `upstream work to be worth resuming — start a fresh run instead.`,
    );
    process.exit(2);
    return;
  }
  if (missing.length === 0) {
    console.error(`[resume-run] REFUSING: every stage already has an artifact. Nothing to resume.`);
    process.exit(2);
    return;
  }

  // ── did the code change underneath the artifacts? ──────────────────────────
  // `probe-validity-process-start-vs-dist-build` with the evidence destroyed: a rebuild between the
  // crash and the resume produces a story that is half one build and half another, and no artifact
  // records the mix. Loud refusal, with an explicit override for the operator who knows better.
  const currentFingerprint = computeBuildFingerprint(workspaceRoot);
  const recordedFingerprint = originalRunId ? readRunFingerprint(workerAppRoot, originalRunId) : null;
  const verdict = checkBuildFingerprint(recordedFingerprint, currentFingerprint);
  console.log(`[resume-run] build      : ${verdict.reason} — ${verdict.detail}`);
  if (!verdict.ok && process.env.RESUME_IGNORE_BUILD !== "1") {
    console.error(
      `[resume-run] REFUSING: ${verdict.detail}.\n` +
        `             Resume with the build that produced the artifacts, or set RESUME_IGNORE_BUILD=1 ` +
        `to accept a mixed-generation run (and say so in the ledger).`,
    );
    process.exit(3);
    return;
  }
  if (!originalRunId) {
    console.log(`[resume-run] note       : no originalRunId given, so the build check could not run.`);
  }

  // ── inputs: the dead run's spec, not a new one ─────────────────────────────
  const spec = loadProjectSpec(workspaceRoot, projectId);
  const runId = `resume-${Date.now()}`;
  const inputs: MysteryGenerationInputs = {
    ...(spec as Partial<MysteryGenerationInputs>),
    theme: (spec.theme as string) || "A classic murder mystery",
    targetLength: ((spec.targetLength as "short" | "medium" | "long") ?? "medium"),
    narrativeStyle: ((spec.narrativeStyle as "classic" | "modern" | "atmospheric") ?? "classic"),
    runId,
    projectId,
    resumeFromRunId: originalRunId || projectId,
    resumeArtifacts: bundle,
  };

  if (dry) {
    console.log(
      `[resume-run] DRY: would skip ${found.map((n) => RESUME_FIELD_BY_ARTIFACT[n]).join(", ")} ` +
        `and start at '${missing[0]}'. Exiting before any LLM call.`,
    );
    return;
  }

  // ── run ────────────────────────────────────────────────────────────────────
  const client = buildClient(workspaceRoot);
  const startedAt = Date.now();
  console.log(`[resume-run] runId      : ${runId}`);
  console.log(`[resume-run] resuming ...`);

  const result = await generateMystery(client, inputs, (progress) => {
    console.log(`[resume-run]   ${progress.percentage}% ${progress.message}`);
  });

  const storyDir = join(workspaceRoot, "stories", storyFolderName(new Date()));
  const { filePath } = saveReadableStory(result.prose, runId, storyDir, `Resumed ${runId}`);
  const mins = ((Date.now() - startedAt) / 60000).toFixed(1);
  console.log(`[resume-run] story      : ${filePath}`);
  console.log(`[resume-run] DONE in ${mins} min — skipped ${found.length} stage(s) that had survived.`);

  // KNOWN LIMITATION, stated loudly rather than left for someone to discover mid-incident.
  //
  // `data/store.json` is written by the API's repository layer (apps/api/src/db.ts). This CLI runs
  // outside the API process — that is the whole point, since the failures it recovers from kill the
  // API too — and a second copy of the store writer here would be exactly the one-concept-several-
  // bodies trap the rest of this work removed. So the stages this run just regenerated are NOT
  // written back to the artifact store.
  //
  // Consequence: this run is not itself resumable. If it dies, the next resume restarts from the
  // same point THIS one did, not from where it got to. The story on disk is unaffected.
  console.log(
    `[resume-run] NOTE       : regenerated stages were not written back to data/store.json ` +
      `(the API owns that writer). A second failure would resume from the same point as this run, ` +
      `not from where it reached.`,
  );
}

main().catch((e) => {
  console.error("[resume-run] FAILED:", e?.stack ?? e);
  process.exit(1);
});
