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
 *   REPLAY_PROSE_BATCH=N          chapters per LLM call (default 10, mirroring the batched runs)
 *   REPLAY_SCORE_CHECKPOINT=path  skip generation; recover prose from an agent9 checkpoint and score it
 *   CML_WORKSPACE_ROOT            override workspace root (default: process.cwd())
 * Azure creds are read from .env.local / .env at the workspace root (never printed).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
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

const parseEnvBool = (v: string | undefined, def: boolean): boolean =>
  v === undefined || v === "" ? def : /^(1|true|yes|on)$/i.test(v);

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

// ── text helpers ─────────────────────────────────────────────────────────────
const normalizeText = (s: unknown): string =>
  String(s ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[–—]/g, "-")
    .trim();

/** Plain prose join — what the live shadow scorer rubric-scores (orchestrator.assembleFullProse). */
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

function storyFolderName(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `story_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

/** Readable story markdown, byte-for-byte the same shape the API's saveReadableStoryText writes. */
function saveReadableStory(
  prose: any,
  runId: string,
  storyDir: string,
  fallbackTitle: string,
): { filePath: string; slug: string; title: string } {
  const storyTitle = normalizeText(prose?.title || prose?.note || fallbackTitle || "Mystery Story") || "Mystery Story";
  const slug =
    storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "story";
  const chapters: any[] = Array.isArray(prose?.chapters) ? prose.chapters : [];
  const now = new Date();
  const lines: string[] = [`# ${storyTitle}`, ``, `*Run ID: ${runId} — Generated ${now.toDateString()}*`, ``, `---`];
  chapters.forEach((ch, i) => {
    const chTitle = normalizeText(ch?.title || `Chapter ${i + 1}`);
    lines.push(``, `## Chapter ${i + 1}: ${chTitle}`, ``);
    const paragraphs = Array.isArray(ch?.paragraphs) ? ch.paragraphs : ch?.text ? [ch.text] : [];
    for (const p of paragraphs) {
      const text = normalizeText(p);
      if (text) lines.push(text, ``);
    }
    lines.push(`---`);
  });
  const content = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  mkdirSync(storyDir, { recursive: true });
  const filePath = join(storyDir, `${slug}.md`);
  writeFileSync(filePath, content, "utf8");
  return { filePath, slug, title: storyTitle };
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

// ── AzureOpenAIClient (mirrors apps/api buildLlmClient, incl. the LLM logger) ─
function buildLlmLogger(workspaceRoot: string): LLMLogger {
  return new LLMLogger({
    logLevel: process.env.LOG_LEVEL as any,
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, true),
    logFilePath: process.env.LOG_FILE_PATH || join(workspaceRoot, "logs", "llm.jsonl"),
    logFullPromptsToFile: parseEnvBool(process.env.LOG_FULL_PROMPTS_TO_FILE, true),
    fullPromptLogFilePath:
      process.env.FULL_PROMPT_LOG_FILE_PATH || join(workspaceRoot, "logs", "llm-prompts-full.jsonl"),
    logActualPromptDocsToFile: parseEnvBool(process.env.LOG_ACTUAL_PROMPT_DOCS_TO_FILE, true),
    actualPromptDocsDir:
      process.env.ACTUAL_PROMPT_DOCS_DIR || join(workspaceRoot, "documentation", "prompts", "actual"),
  });
}

function buildClient(workspaceRoot: string): AzureOpenAIClient {
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
    logger: buildLlmLogger(workspaceRoot),
  } as any);
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

  const client = buildClient(workspaceRoot);
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
  } catch (e) {
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

  runLogger.logComplete("complete", Date.now() - startMs, ctx.warnings, ctx.errors);
  console.log(`[replay-agent9] DONE — ${storyDir}`);
}

main().catch((e) => {
  console.error("[replay-agent9] FAILED:", e?.stack ?? e);
  process.exit(1);
});
