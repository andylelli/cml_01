/**
 * Agent 9 replay bench — re-run ONLY prose generation against a prior run's frozen upstream artifacts,
 * producing the SAME story file, prompt/run logs, and (additionally) a rubric report a normal run does.
 *
 * Agent 9 (`runAgent9`) is a pure function of the `OrchestratorContext` that agents 1–8 build. Every
 * upstream artifact it needs (cml, cast, character/location profiles, temporal context, hard-logic
 * devices, outline, clues, world document, setting, background, fair-play report) is persisted per run
 * in `data/store.json`. This bench loads those artifacts, reconstructs a minimal context, and calls the
 * CURRENT `runAgent9` — so prose fixes (leakage, pronouns, chapter-as-contract) can be validated for
 * ~10 LLM calls instead of re-running the full ~40-call pipeline.
 *
 * Outputs (mirroring a normal run):
 *   - stories/story_<YYYYMMDD-HHMM>/<slug>.md        the readable story (same format as the API writes)
 *   - stories/story_<YYYYMMDD-HHMM>/rubric-report.md a well-formatted rubric report (this bench's extra)
 *   - stories/story_<YYYYMMDD-HHMM>/rubric-report.json
 *   - logs/llm-prompts-full.jsonl, logs/llm.jsonl    LLM prompt logs (via the same LLMLogger)
 *   - documentation/prompts/actual/run_<...>/        per-agent request/response docs (Agent 9 only)
 *   - logs/agent9-checkpoint-<runId>.json            Agent 9 resume checkpoint (Agent 9 writes this)
 *   - apps/worker/logs/run_<date>_<runId>.json       RunLogger run summary (finalised complete/failed)
 * Not reproducible from a single agent: the 15-phase scoring report (apps/api/data/reports) and the
 * API's project activity.jsonl — those are pipeline/API-level aggregates.
 *
 * Fidelity note: `coverageResult` and `outlineCoverageIssues` are computed by Agents 6/6.5 and are NOT
 * persisted as artifacts, so they are stubbed (empty / no-critical-gaps). The replay is therefore
 * FAITHFUL but not bit-identical to the original run — ideal for iterating on prose quality.
 *
 * Usage (from repo root):
 *   node --use-system-ca apps/worker/dist/jobs/agent9-replay.js <projectId> [label]
 * Env:
 *   REPLAY_DRY=1                  load artifacts + build context + validate, but DO NOT call the LLM
 *   REPLAY_CAPTURE_PROMPTS=<file> run Agent 9's real prompt assembly against a recording stub —
 *                                 no network, no cost — and write every prompt to <file>. This is
 *                                 the free flag rehearsal: capture with the flags off, again with
 *                                 them on, and diff. REPLAY_DRY stops too early to answer that.
 *   REPLAY_CAPTURE_CAP=N          stop after N captured prompts (default 14)
 *   REPLAY_PROSE_BATCH=N          chapters per LLM call (default 10, mirroring the batched runs)
 *   REPLAY_SCORE_CHECKPOINT=path  skip generation; recover prose from an agent9 checkpoint and score it
 *   CML_WORKSPACE_ROOT            override workspace root (default: process.cwd())
 * Azure creds are read from .env.local / .env at the workspace root (never printed).
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { AzureOpenAIClient } from "@cml/llm-client";
import { createLLMRubricJudge, scoreStory } from "@cml/rubric-score";

import { runAgent9 } from "./agents/agent9-run.js";
import type { OrchestratorContext } from "./agents/shared.js";
import { latestArtifact, loadArtifactStore, loadProjectSpec } from "./artifact-store.js";
import { buildClient, loadEnvFiles } from "./cli-runtime.js";
import { RunLogger } from "./run-logger.js";
import {
  assembleFullProse,
  normalizeStoryText as normalizeText,
  saveReadableStory,
  storyFolderName,
} from "./story-output.js";

// ── shared readers ───────────────────────────────────────────────────────────
// R5 — `loadStore`, `latestArtifact`, `findSpec`, the .env loader, the client builder and the story
// writer all used to live here as private copies. They now come from `artifact-store.ts`,
// `cli-runtime.ts` and `story-output.ts`, shared with production resume and the eval harness: one
// body per concept, so a fix cannot land on one copy and miss the others.
const loadStore = loadArtifactStore;
const findSpec = loadProjectSpec;

// ── R6: frozen golden bundles ────────────────────────────────────────────────
/**
 * A bundle is a run's upstream artifacts, extracted from the store and committed so the eval set is
 * reproducible after `data/store.json` has moved on. See `scripts/eval-freeze-bundle.mjs`.
 */
interface GoldenBundle {
  id: string;
  projectId: string;
  spec: Record<string, unknown>;
  artifacts: Record<string, unknown>;
}

function loadGoldenBundle(path: string): GoldenBundle {
  if (!existsSync(path)) throw new Error(`Golden bundle not found: ${path}`);
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  if (!parsed || typeof parsed !== "object" || !parsed.artifacts) {
    throw new Error(`Malformed golden bundle (no 'artifacts' object): ${path}`);
  }
  return {
    id: String(parsed.id ?? "unnamed"),
    projectId: String(parsed.projectId ?? parsed.project_id ?? parsed.id ?? "bundle"),
    spec: (parsed.spec ?? {}) as Record<string, unknown>,
    artifacts: parsed.artifacts as Record<string, unknown>,
  };
}

// ── rubric report rendering ──────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  premise: "Premise / concept",
  opening_hook: "Opening hook",
  plot_structure: "Plot structure",
  character_clarity: "Character clarity",
  dialogue: "Dialogue",
  atmosphere: "Atmosphere / setting",
  clues: "Mystery clues / evidence logic",
  pacing: "Pacing",
  ending: "Ending / reveal",
  prose: "Prose / polish",
};

function renderRubricMarkdown(
  scored: any,
  meta: { runId: string; projectId?: string; storyTitle: string; proseChars: number; chapters: number },
): string {
  const rb = scored.rubric ?? {};
  const L: string[] = [];
  L.push(`# Rubric Report — ${meta.storyTitle}`, "");
  L.push(`> **${scored.final}/100** &middot; _${scored.band}_  `);
  L.push(
    `> Raw judge total **${scored.rawTotal}/100**${
      scored.final !== scored.rawTotal ? ` (hard caps removed ${scored.rawTotal - scored.final})` : ""
    }  `,
  );
  L.push(
    `> Run \`${meta.runId}\`${meta.projectId ? ` &middot; project \`${meta.projectId}\`` : ""} &middot; ` +
      `${meta.chapters} chapters &middot; ${meta.proseChars.toLocaleString()} chars &middot; ${new Date().toISOString()}`,
    "",
  );

  L.push(`## Category marks`, "");
  L.push(`| Category | Mark | Note |`, `|---|---:|---|`);
  for (const c of scored.categories ?? []) {
    const label = CATEGORY_LABELS[c.category] ?? c.category;
    const mark = `${c.mark}/10`;
    const note = `${c.capped ? "⚠ capped — " : ""}${normalizeText(c.reason).replace(/\|/g, "\\|").replace(/\s+/g, " ")}`;
    L.push(`| ${label} | ${c.capped ? `**${mark}**` : mark} | ${note} |`);
  }
  L.push("");

  L.push(`## Hard caps applied`, "");
  if ((scored.capsApplied ?? []).length) for (const cap of scored.capsApplied) L.push(`- ${cap}`);
  else L.push(`_None — no hard caps fired._`);
  L.push("");

  if (rb.overall_view) L.push(`## Overall view`, "", normalizeText(rb.overall_view), "");

  const bullets = (title: string, arr?: string[]) => {
    if (Array.isArray(arr) && arr.length) {
      L.push(`## ${title}`, "");
      for (const x of arr) L.push(`- ${normalizeText(x)}`);
      L.push("");
    }
  };
  bullets("What works", rb.what_works);
  bullets("Main problems", rb.main_problems);
  if (Array.isArray(rb.chapter_issues) && rb.chapter_issues.length) {
    L.push(`## Chapter issues`, "");
    for (const ci of rb.chapter_issues) {
      L.push(`- **Chapter ${ci.chapter}:** ${(ci.issues ?? []).map((s: string) => normalizeText(s)).join("; ")}`);
    }
    L.push("");
  }
  bullets("Fastest fixes", rb.fastest_fixes);

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

async function runRubric(
  client: AzureOpenAIClient,
  proseText: string,
  cml: unknown,
  runId: string,
  projectId?: string,
): Promise<any | null> {
  if (proseText.length < 200) return null;
  if ((process.env.RUBRIC_SCORING_MODE ?? "shadow").toLowerCase() === "off") return null;
  const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const judge = createLLMRubricJudge(
    (chatArgs: any) =>
      client.chat({
        ...chatArgs,
        model: chatArgs.model ?? model,
        logContext: { agent: "RubricScorer", runId, projectId: projectId ?? "unknown" },
      } as any),
    { model, temperature: 0.2, maxTokens: 4000 },
  );
  const scored = await scoreStory({ prose: proseText, cml, judge });
  console.info(
    `[Rubric] ${scored.final}/100 (${scored.band}); raw ${scored.rawTotal}` +
      (scored.capsApplied.length ? `; caps: ${scored.capsApplied.join("; ")}` : ""),
  );
  return scored;
}

/** Write the rubric report (md + json) into the story folder. */
function writeRubricReport(
  storyDir: string,
  scored: any,
  meta: { runId: string; projectId?: string; storyTitle: string; proseChars: number; chapters: number; source?: string },
): void {
  writeFileSync(join(storyDir, "rubric-report.md"), renderRubricMarkdown(scored, meta), "utf8");
  writeFileSync(
    join(storyDir, "rubric-report.json"),
    JSON.stringify(
      {
        runId: meta.runId,
        projectId: meta.projectId,
        source: meta.source ?? "agent9-replay",
        generatedAt: new Date().toISOString(),
        storyTitle: meta.storyTitle,
        proseChars: meta.proseChars,
        chapters: meta.chapters,
        final: scored.final,
        band: scored.band,
        raw_total: scored.rawTotal,
        caps_applied: scored.capsApplied,
        categories: scored.categories,
      },
      null,
      2,
    ),
    "utf8",
  );
}

/**
 * Score an existing Agent-9 resume checkpoint (e.g. a run that generated all chapters but died before
 * writing output). Recovers the prose, writes the readable story + rubric report into a normal
 * story_<timestamp> folder. Activated via REPLAY_SCORE_CHECKPOINT=<path>.
 */
async function scoreCheckpoint(checkpointPath: string, workspaceRoot: string): Promise<void> {
  if (!existsSync(checkpointPath)) throw new Error(`Checkpoint not found: ${checkpointPath}`);
  loadEnvFiles(workspaceRoot);
  const cp = JSON.parse(readFileSync(checkpointPath, "utf8"));
  const chapters: any[] = Array.isArray(cp.completedChapters) ? cp.completedChapters : [];
  const prose = { chapters };
  const proseText = assembleFullProse(prose);
  const projectId: string = cp.projectId;
  const runId: string = cp.runId ?? "checkpoint";
  console.log(`[score-checkpoint] checkpoint : ${checkpointPath}`);
  console.log(`[score-checkpoint] runId      : ${runId}`);
  console.log(`[score-checkpoint] chapters   : ${chapters.length} | prose ${proseText.length} chars`);
  if (proseText.length < 200) throw new Error("Checkpoint prose too short to score.");

  const store = loadStore(workspaceRoot);
  const cml = latestArtifact(store, projectId, "cml");
  if (cml === undefined) throw new Error(`No 'cml' artifact for project ${projectId} (needed for hard-cap facts).`);
  const client = buildClient(workspaceRoot);

  const storyDir = join(workspaceRoot, "stories", storyFolderName(new Date()));
  const { filePath, title } = saveReadableStory(prose, runId, storyDir, `Recovered ${runId}`);
  console.log(`[score-checkpoint] story      : ${filePath}`);

  const scored = await runRubric(client, proseText, cml, runId, projectId);
  if (scored) {
    writeRubricReport(storyDir, scored, {
      runId,
      projectId,
      storyTitle: title,
      proseChars: proseText.length,
      chapters: chapters.length,
      source: "recovered-from-checkpoint",
    });
    console.log(`[score-checkpoint] rubric     : ${join(storyDir, "rubric-report.md")}`);
  }
  console.log(`[score-checkpoint] DONE — ${storyDir}`);
}

async function main(): Promise<void> {
  const scoreCheckpointPath = process.env.REPLAY_SCORE_CHECKPOINT;
  if (scoreCheckpointPath) {
    await scoreCheckpoint(scoreCheckpointPath, process.env.CML_WORKSPACE_ROOT || process.cwd());
    return;
  }

  // R6 — a frozen bundle (eval/golden/*.json) is an alternative artifact SOURCE, not an alternative
  // code path: everything below this block is identical whether the artifacts came from the live
  // store or from a committed fixture. That is deliberate — a golden-set harness that ran its own
  // replay implementation would be measuring something other than what production does.
  const bundlePath = (process.env.REPLAY_BUNDLE || "").trim();
  const bundle = bundlePath ? loadGoldenBundle(bundlePath) : null;

  const projectId = bundle ? bundle.projectId : process.argv[2];
  const label = (process.argv[3] || "").trim();
  if (!projectId) {
    console.error(
      "Usage: node --use-system-ca apps/worker/dist/jobs/agent9-replay.js <projectId> [label]\n" +
        "   or: REPLAY_BUNDLE=eval/golden/<id>.json node --use-system-ca apps/worker/dist/jobs/agent9-replay.js",
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
  console.log(`[replay-agent9] source    : ${bundle ? `bundle ${bundlePath}` : "data/store.json"}`);
  console.log(`[replay-agent9] runId     : ${runId}`);
  console.log(`[replay-agent9] workspace : ${workspaceRoot}`);
  console.log(`[replay-agent9] mode      : ${dry ? "DRY (no LLM)" : "LIVE"}`);

  // ── load upstream artifacts ────────────────────────────────────────────────
  const store = bundle ? [] : loadStore(workspaceRoot);
  const optional = (type: string): unknown =>
    bundle ? bundle.artifacts[type] : latestArtifact(store, projectId, type);
  const required = (type: string): unknown => {
    const a = optional(type);
    if (a === undefined) {
      throw new Error(
        bundle
          ? `Required artifact '${type}' missing from bundle ${bundlePath} — re-freeze it with 'npm run eval:freeze'`
          : `Required artifact '${type}' not found for project ${projectId} in data/store.json`,
      );
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
  const worldDocument = optional("world_document");
  const setting = optional("setting");
  const backgroundContext = optional("background_context");
  const fairPlayAudit = optional("fair_play_report");

  console.log(
    `[replay-agent9] artifacts : cml, cast, character_profiles, location_profiles, temporal_context, ` +
      `hard_logic_devices, outline, clues` +
      `${worldDocument ? ", world_document" : ""}${setting ? ", setting" : ""}` +
      `${backgroundContext ? ", background_context" : ""}${fairPlayAudit ? ", fair_play_report" : ""}`,
  );

  const spec = bundle ? bundle.spec : findSpec(workspaceRoot, projectId);
  const inputs: any = {
    ...spec,
    runId,
    projectId,
    proseBatchSize: Number(process.env.REPLAY_PROSE_BATCH ?? 10),
    resumeAgent9FromCheckpoint: false,
  };

  // A_75 §15 — PROMPT CAPTURE, the free rehearsal.
  //
  // REPLAY_DRY exits before `runAgent9` and so never builds a prompt. That is the wrong stopping
  // point for the one question a flag rehearsal has to answer: does the flag's text actually REACH
  // the writer? This project has twice shipped a lever that was silently unsettable, and grepping
  // the module proves nothing (the A_66 vandal had three bodies across two packages).
  //
  // With REPLAY_CAPTURE_PROMPTS=<file> the client is replaced by a recorder that returns canned
  // prose and never opens a socket. Agent 9 runs its real prompt-assembly path for £0, every prompt
  // is written to the file, and a second run with the flags flipped can be diffed against it.
  const capturePath = (process.env.REPLAY_CAPTURE_PROMPTS || "").trim();
  const captured: Array<{ n: number; system: string; user: string }> = [];
  const captureCap = Number(process.env.REPLAY_CAPTURE_CAP || 14);

  // WRAP, do not replace. Agent 9 uses far more of the client than `chat()` — `getCostTracker()`
  // alone is called at eight sites — so a bare stub throws before the first prompt is ever built,
  // which reads as "the flag is silent" when in fact nothing ran. A Proxy keeps every real method
  // and intercepts only the network call.
  const realClient = buildClient(workspaceRoot);
  const client = capturePath
    ? (new Proxy(realClient as any, {
        get: (target, prop, receiver) => {
          if (prop !== "chat") return Reflect.get(target, prop, receiver);
          return async (options: any) => {
            const msg = (role: string) =>
              (options?.messages ?? [])
                .filter((m: any) => m?.role === role)
                .map((m: any) => String(m?.content ?? ""))
                .join(String.fromCharCode(10));
            captured.push({ n: captured.length + 1, system: msg("system"), user: msg("user") });
            if (captured.length >= captureCap) {
              writeFileSync(capturePath, JSON.stringify(captured, null, 2), "utf8");
              throw new Error(`[capture] reached REPLAY_CAPTURE_CAP=${captureCap} — prompts written to ${capturePath}`);
            }
            // Canned prose. It will not satisfy the validators, and that is fine: the retries it
            // provokes are themselves prompts worth capturing, and the cap stops the loop.
            return {
              content:
                "The rain had stopped. Miss Ash set the lamp on the sill and counted the keys again, one by one, until the last would not turn.",
              usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
              model: "capture-stub",
              finishReason: "stop",
              latencyMs: 0,
            };
          };
        },
      }) as AzureOpenAIClient)
    : realClient;

  if (capturePath) console.log(`[replay-agent9] mode      : CAPTURE (no network, cap ${captureCap}) -> ${capturePath}`);
  const runLogger = new RunLogger(join(workerAppRoot, "logs"), runId, projectId);

  // ── reconstruct a minimal OrchestratorContext ──────────────────────────────
  const startMs = Date.now();
  const ctx = {
    client,
    inputs,
    runId,
    projectId,
    startTime: startMs,
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
  try {
    await runAgent9(ctx);
    if (capturePath) {
      writeFileSync(capturePath, JSON.stringify(captured, null, 2), "utf8");
      console.log(`[replay-agent9] captured ${captured.length} prompt(s) -> ${capturePath}`);
      return;
    }
  } catch (e) {
    if (capturePath) {
      writeFileSync(capturePath, JSON.stringify(captured, null, 2), "utf8");
      console.log(`[replay-agent9] captured ${captured.length} prompt(s) -> ${capturePath}`);
      return;
    }
    runLogger.logComplete("failed", Date.now() - startMs, ctx.warnings, ctx.errors);
    throw e;
  }

  // ── write the readable story (normal location + format) ────────────────────
  const storyDir = join(workspaceRoot, "stories", storyFolderName(new Date()));
  const { filePath: storyPath, title } = saveReadableStory(ctx.prose, runId, storyDir, `Replay ${runId}`);
  console.log(`[replay-agent9] story written: ${storyPath}`);

  // ── rubric (same text the live shadow scorer uses) + report ────────────────
  const proseText = assembleFullProse(ctx.prose);
  const scored = await runRubric(client, proseText, cml, runId, projectId);
  if (scored) {
    writeRubricReport(storyDir, scored, {
      runId,
      projectId,
      storyTitle: title,
      proseChars: proseText.length,
      chapters: Array.isArray((ctx.prose as any)?.chapters) ? (ctx.prose as any).chapters.length : 0,
    });
    console.log(`[replay-agent9] rubric report: ${join(storyDir, "rubric-report.md")}`);
  }

  // R6 — machine-readable result for the eval harness. Written to a caller-chosen path so the
  // harness never has to guess which `stories/story_<timestamp>/` folder belonged to which bundle;
  // a timestamp race between two bundles in the same minute would otherwise cross the results.
  const resultOut = (process.env.REPLAY_RESULT_OUT || "").trim();
  if (resultOut) {
    writeFileSync(
      resultOut,
      JSON.stringify(
        {
          bundleId: bundle?.id ?? null,
          projectId,
          runId,
          storyPath,
          storyDir,
          chapters: Array.isArray((ctx.prose as any)?.chapters) ? (ctx.prose as any).chapters.length : 0,
          proseChars: proseText.length,
          warnings: ctx.warnings.length,
          errors: ctx.errors.length,
          // null when scoring is off or the prose was too short — the harness reports that as a
          // failed bundle rather than silently scoring it 0, which would look like a regression.
          rubric: scored
            ? {
                final: scored.final,
                band: scored.band,
                raw_total: scored.rawTotal,
                caps_applied: scored.capsApplied,
                categories: (scored.categories ?? []).map((c: any) => ({
                  category: c.category,
                  mark: c.mark,
                  capped: !!c.capped,
                })),
              }
            : null,
        },
        null,
        2,
      ),
      "utf8",
    );
    console.log(`[replay-agent9] result json : ${resultOut}`);
  }

  runLogger.logComplete("complete", Date.now() - startMs, ctx.warnings, ctx.errors);
  console.log(`[replay-agent9] DONE — ${storyDir}`);
}

main().catch((e) => {
  console.error("[replay-agent9] FAILED:", e?.stack ?? e);
  process.exit(1);
});
