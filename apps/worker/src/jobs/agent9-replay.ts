/**
 * Agent 9 replay bench — re-run ONLY prose generation against a prior run's frozen upstream artifacts.
 *
 * Agent 9 (`runAgent9`) is a pure function of the `OrchestratorContext` that agents 1–8 build. Every
 * upstream artifact it needs (cml, cast, character/location profiles, temporal context, hard-logic
 * devices, outline, clues, world document, setting, background, fair-play report) is persisted per run
 * in `data/store.json`. This bench loads those artifacts, reconstructs a minimal context, and calls the
 * CURRENT `runAgent9` — so prose fixes (leakage, pronouns, chapter-as-contract) can be validated for
 * ~10 LLM calls instead of re-running the full ~40-call pipeline.
 *
 * Fidelity note: `coverageResult` and `outlineCoverageIssues` are computed by Agents 6/6.5 and are NOT
 * persisted as artifacts, so they are stubbed (empty / no-critical-gaps). The replay is therefore
 * FAITHFUL but not bit-identical to the original run — ideal for iterating on prose quality.
 *
 * Usage (from repo root):
 *   node --use-system-ca apps/worker/dist/jobs/agent9-replay.js <projectId> [label]
 * Env:
 *   REPLAY_DRY=1          load artifacts + build context + validate, but DO NOT call the LLM
 *   REPLAY_PROSE_BATCH=N  chapters per LLM call (default 10, mirroring the batched runs)
 *   CML_WORKSPACE_ROOT    override workspace root (default: process.cwd())
 * Azure creds are read from .env.local / .env at the workspace root (never printed).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { AzureOpenAIClient } from "@cml/llm-client";
import { createLLMRubricJudge, scoreStory } from "@cml/rubric-score";

import { runAgent9 } from "./agents/agent9-run.js";
import type { OrchestratorContext } from "./agents/shared.js";
import { RunLogger } from "./run-logger.js";

// ── tiny .env loader (no dependency; never echoes values) ────────────────────
function loadEnvFiles(root: string): void {
  for (const name of [".env.local", ".env"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = val;
    }
  }
}

// ── store.json artifact loader ───────────────────────────────────────────────
interface StoreArtifact {
  id?: string;
  projectId?: string;
  project_id?: string;
  type?: string;
  artifact_type?: string;
  payload?: unknown;
  payload_json?: unknown;
}

function loadStore(workspaceRoot: string): StoreArtifact[] {
  const path = join(workspaceRoot, "data", "store.json");
  if (!existsSync(path)) throw new Error(`Artifact store not found at ${path}`);
  const j = JSON.parse(readFileSync(path, "utf8"));
  const arts = j.artifacts ?? j.artifact_versions;
  if (!Array.isArray(arts)) throw new Error(`No 'artifacts' array in ${path}`);
  return arts as StoreArtifact[];
}

/** Latest payload for (projectId, type); store has no version field, so last-wins by array order. */
function latestArtifact(store: StoreArtifact[], projectId: string, type: string): unknown {
  let found: unknown;
  for (const a of store) {
    if ((a.project_id ?? a.projectId) !== projectId) continue;
    if ((a.artifact_type ?? a.type) !== type) continue;
    let payload = a.payload !== undefined ? a.payload : a.payload_json;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        /* leave as string */
      }
    }
    found = payload;
  }
  return found;
}

function findSpec(workspaceRoot: string, projectId: string): any {
  const path = join(workspaceRoot, "data", "store.json");
  const j = JSON.parse(readFileSync(path, "utf8"));
  const specs = Array.isArray(j.specs) ? j.specs : Object.values(j.specs ?? {});
  const mine = (specs as any[]).filter((s) => s && (s.project_id ?? s.projectId) === projectId);
  const rec = mine[mine.length - 1] ?? (specs as any[])[(specs as any[]).length - 1];
  return rec?.spec ?? rec ?? {};
}

// ── mirror orchestrator.assembleFullProse (so the rubric scores the same text) ─
function assembleFullProse(prose: any): string {
  const chapters = Array.isArray(prose?.chapters) ? prose.chapters : [];
  return chapters
    .map((c: any) => {
      const body = Array.isArray(c?.paragraphs)
        ? c.paragraphs.join("\n\n")
        : String(c?.content ?? c?.text ?? "");
      const title = c?.title ? `${c.title}\n\n` : "";
      return `${title}${body}`.trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

// ── AzureOpenAIClient (mirrors apps/api buildLlmClient) ──────────────────────
function buildClient(): AzureOpenAIClient {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";
  if (!endpoint || !apiKey) {
    throw new Error(
      "Missing Azure credentials. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY (or put them in .env.local at the workspace root).",
    );
  }
  return new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
  } as any);
}

/**
 * Score an existing Agent-9 resume checkpoint (e.g. a run that generated all chapters but died before
 * writing output). Recovers the prose from `completedChapters`, scores it with the same shadow rubric,
 * and writes the salvaged story + report. Activated via REPLAY_SCORE_CHECKPOINT=<path>.
 */
async function scoreCheckpoint(checkpointPath: string, workspaceRoot: string): Promise<void> {
  if (!existsSync(checkpointPath)) throw new Error(`Checkpoint not found: ${checkpointPath}`);
  loadEnvFiles(workspaceRoot);
  const cp = JSON.parse(readFileSync(checkpointPath, "utf8"));
  const chapters: any[] = Array.isArray(cp.completedChapters) ? cp.completedChapters : [];
  const proseText = chapters
    .map((c) => `${c?.title ? `${c.title}\n\n` : ""}${(c?.paragraphs ?? []).join("\n\n")}`.trim())
    .filter(Boolean)
    .join("\n\n");
  const projectId: string = cp.projectId;
  const runId: string = cp.runId ?? "checkpoint";
  console.log(`[score-checkpoint] checkpoint : ${checkpointPath}`);
  console.log(`[score-checkpoint] runId      : ${runId}`);
  console.log(`[score-checkpoint] chapters   : ${chapters.length} | prose ${proseText.length} chars`);
  if (proseText.length < 200) throw new Error("Checkpoint prose too short to score.");

  const store = loadStore(workspaceRoot);
  const cml = latestArtifact(store, projectId, "cml");
  if (cml === undefined) throw new Error(`No 'cml' artifact for project ${projectId} (needed for hard-cap facts).`);
  const client = buildClient();
  const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const judge = createLLMRubricJudge(
    (chatArgs: any) =>
      client.chat({
        ...chatArgs,
        model: chatArgs.model ?? model,
        logContext: { agent: "RubricScorer", runId, projectId },
      } as any),
    { model, temperature: 0.2, maxTokens: 4000 },
  );
  const rubric: any = await scoreStory({ prose: proseText, cml, judge });
  console.info(
    `[Rubric] ${rubric.final}/100 (${rubric.band}); raw ${rubric.rawTotal}` +
      (rubric.capsApplied.length ? `; caps: ${rubric.capsApplied.join("; ")}` : ""),
  );

  const outDir = join(workspaceRoot, "stories", `replay_${runId}`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "agent9-replay.md"), proseText, "utf8");
  writeFileSync(
    join(outDir, "agent9-replay.report.json"),
    JSON.stringify(
      {
        runId,
        projectId,
        source: "recovered-from-checkpoint",
        generatedAt: new Date().toISOString(),
        proseChars: proseText.length,
        chapters: chapters.length,
        rubric: {
          final: rubric.final,
          band: rubric.band,
          raw_total: rubric.rawTotal,
          caps_applied: rubric.capsApplied,
          categories: rubric.categories,
        },
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`[score-checkpoint] salvaged story + report written to ${outDir}`);
}

async function main(): Promise<void> {
  const scoreCheckpointPath = process.env.REPLAY_SCORE_CHECKPOINT;
  if (scoreCheckpointPath) {
    await scoreCheckpoint(scoreCheckpointPath, process.env.CML_WORKSPACE_ROOT || process.cwd());
    return;
  }

  const projectId = process.argv[2];
  const label = (process.argv[3] || "").trim();
  if (!projectId) {
    console.error(
      "Usage: node --use-system-ca apps/worker/dist/jobs/agent9-replay.js <projectId> [label]",
    );
    process.exit(1);
    return;
  }

  const workspaceRoot = process.env.CML_WORKSPACE_ROOT || process.cwd();
  const workerAppRoot = join(workspaceRoot, "apps", "worker");
  const dry = process.env.REPLAY_DRY === "1";
  loadEnvFiles(workspaceRoot);

  const runId = label || `replay-${Date.now()}`;
  console.log(`[replay-agent9] project   : ${projectId}`);
  console.log(`[replay-agent9] runId     : ${runId}`);
  console.log(`[replay-agent9] workspace : ${workspaceRoot}`);
  console.log(`[replay-agent9] mode      : ${dry ? "DRY (no LLM)" : "LIVE"}`);

  // ── load upstream artifacts ────────────────────────────────────────────────
  const store = loadStore(workspaceRoot);
  const required = (type: string): unknown => {
    const a = latestArtifact(store, projectId, type);
    if (a === undefined) {
      throw new Error(`Required artifact '${type}' not found for project ${projectId} in data/store.json`);
    }
    return a;
  };

  const cml = required("cml");
  const cast = required("cast");
  const characterProfiles = required("character_profiles");
  const locationProfiles = required("location_profiles");
  const temporalContext = required("temporal_context");
  const hardLogicDevices = required("hard_logic_devices");
  const narrative = required("outline");
  const clues = required("clues");
  const worldDocument = latestArtifact(store, projectId, "world_document");
  const setting = latestArtifact(store, projectId, "setting");
  const backgroundContext = latestArtifact(store, projectId, "background_context");
  const fairPlayAudit = latestArtifact(store, projectId, "fair_play_report");

  console.log(
    `[replay-agent9] artifacts : cml, cast, character_profiles, location_profiles, temporal_context, ` +
      `hard_logic_devices, outline, clues` +
      `${worldDocument ? ", world_document" : ""}${setting ? ", setting" : ""}` +
      `${backgroundContext ? ", background_context" : ""}${fairPlayAudit ? ", fair_play_report" : ""}`,
  );

  const spec = findSpec(workspaceRoot, projectId);
  const inputs: any = {
    ...spec,
    runId,
    projectId,
    proseBatchSize: Number(process.env.REPLAY_PROSE_BATCH ?? 10),
    resumeAgent9FromCheckpoint: false,
  };

  const client = buildClient();
  const runLogger = new RunLogger(join(workerAppRoot, "logs"), runId, projectId);

  // ── reconstruct a minimal OrchestratorContext ──────────────────────────────
  const ctx = {
    client,
    inputs,
    runId,
    projectId,
    startTime: Date.now(),
    reportProgress: (_stage: any, message: string, pct: number) =>
      console.log(`[replay-agent9]   ${pct}% ${message}`),
    savePartialReport: async () => {},
    enableScoring: false,
    scoreAggregator: undefined,
    retryManager: undefined,
    scoringLogger: undefined,
    reportRepository: undefined,
    runLogger,
    errors: [] as string[],
    warnings: [] as string[],
    agentCosts: {} as Record<string, number>,
    agentDurations: {} as Record<string, number>,
    primaryAxis: (spec?.primaryAxis ?? "temporal") as any,
    initialHardLogicDirectives: {},
    locationSpec: { location: "", institution: "" },
    noveltyConstraints: {},
    criticalFairPlayRules: new Set<string>(),
    maxCmlRevisionAttempts: 3,
    examplesRoot: join(workerAppRoot, "examples"),
    workerAppRoot,
    workspaceRoot,
    seedEntries: [] as Array<{ filename: string; cml: any }>,
    revisedByAgent4: false,
    revisionAttempts: undefined,
    revisedByAgent4FairPlay: false,
    fairPlayRevisionAttempts: 0,
    proseScoringSnapshot: {
      startedAtMs: null,
      chaptersGenerated: 0,
      latestChapterScore: null,
      latestCumulativeScore: null,
      postGenerationSummaryLogged: false,
    },
    proseChapterScores: [] as any[],
    proseSecondRunChapterScores: [] as any[],
    prosePassAccounting: [] as any[],
    proseRewritePassCount: 0,
    proseRepairPassCount: 0,
    latestProseScore: null,
    nsdTransferTrace: [] as any[],

    // upstream artifacts
    cml,
    cast,
    characterProfiles,
    locationProfiles,
    temporalContext,
    hardLogicDevices,
    narrative,
    clues,
    worldDocument,
    setting,
    backgroundContext,
    fairPlayAudit,
    noveltyAudit: undefined,
    characterBundle: undefined,

    // computed-but-not-persisted → stubbed (see fidelity note)
    coverageResult: { hasCriticalGaps: false, issues: [] as any[] },
    outlineCoverageIssues: [] as any[],
  } as unknown as OrchestratorContext;

  if (dry) {
    console.log("[replay-agent9] DRY run: context assembled and precondition fields present. Exiting before LLM calls.");
    return;
  }

  // ── re-run Agent 9 (current code) ──────────────────────────────────────────
  console.log("[replay-agent9] running Agent 9 prose generation ...");
  await runAgent9(ctx);

  // ── write output ───────────────────────────────────────────────────────────
  const proseText = assembleFullProse(ctx.prose);
  const outDir = join(workspaceRoot, "stories", `replay_${runId}`);
  mkdirSync(outDir, { recursive: true });
  const mdPath = join(outDir, "agent9-replay.md");
  writeFileSync(mdPath, proseText, "utf8");
  console.log(`[replay-agent9] prose written: ${mdPath} (${proseText.length} chars)`);

  // ── rubric (same path as the live shadow scorer) ───────────────────────────
  let rubric: any = null;
  if (proseText.length >= 200 && (process.env.RUBRIC_SCORING_MODE ?? "shadow").toLowerCase() !== "off") {
    try {
      const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
      const judge = createLLMRubricJudge(
        (chatArgs: any) =>
          client.chat({
            ...chatArgs,
            model: chatArgs.model ?? model,
            logContext: { agent: "RubricScorer", runId, projectId },
          } as any),
        { model, temperature: 0.2, maxTokens: 4000 },
      );
      rubric = await scoreStory({ prose: proseText, cml, judge });
      console.info(
        `[Rubric] ${rubric.final}/100 (${rubric.band}); raw ${rubric.rawTotal}` +
          (rubric.capsApplied.length ? `; caps: ${rubric.capsApplied.join("; ")}` : ""),
      );
    } catch (e) {
      console.warn(`[replay-agent9] rubric scoring skipped: ${(e as Error)?.message ?? e}`);
    }
  }

  const reportPath = join(outDir, "agent9-replay.report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        runId,
        projectId,
        generatedAt: new Date().toISOString(),
        proseChars: proseText.length,
        chapters: Array.isArray((ctx.prose as any)?.chapters) ? (ctx.prose as any).chapters.length : 0,
        rubric: rubric
          ? {
              final: rubric.final,
              band: rubric.band,
              raw_total: rubric.rawTotal,
              caps_applied: rubric.capsApplied,
              categories: rubric.categories,
            }
          : null,
        warnings: ctx.warnings,
        errors: ctx.errors,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`[replay-agent9] report written: ${reportPath}`);
  console.log(`[replay-agent9] DONE — open ${mdPath}`);
}

main().catch((e) => {
  console.error("[replay-agent9] FAILED:", e?.stack ?? e);
  process.exit(1);
});
