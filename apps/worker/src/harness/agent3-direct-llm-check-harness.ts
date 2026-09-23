/**
 * AGENT 3 DIRECT HARNESS — one CML, from one project's real upstream artifacts, no pipeline.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────────────────────────
 *
 * A_102 measured that 52 of 61 archived cases (85%) never connect the culprit to the ACT of killing:
 * the discriminating test proves the alibi was false and nobody ever proves who struck the blow. The
 * external reader has named this as the headline issue in four consecutive reads. It is Agent 3's to
 * fix, and Agent 3 sits at the top of the pipeline, so the only ways to exercise a change to it were
 * a full run (~£1.15) or a resume from `cml` (nearly as much).
 *
 * A_101 §15 is the argument for building this: `harness:agent5:direct` cost pennies and overturned a
 * fix that a full run would have shipped into a book. Agent 3 is the stage with the most expensive
 * failures and the only one with no way to test a prompt change cheaply.
 *
 * ── IT REUSES PRODUCTION, IT DOES NOT COPY IT ───────────────────────────────────────────────────
 *
 * The request is built by `buildCmlGenerationRequest` — the same function `agent3-run` calls — from
 * a context assembled out of a real project's persisted `setting`, `cast`, `background_context` and
 * `hard_logic_devices`. A harness with its own copy of the input builder would test a prompt nobody
 * runs. `generateCML` then does the call, the normalisation and the validation exactly as production
 * does.
 *
 * ── AND IT MEASURES THE THING IT WAS BUILT FOR ──────────────────────────────────────────────────
 *
 * Every run prints A_102's classification of the case it just produced: does the discriminating test
 * or any part of the case connect the culprit to the death method, or does it stop at presence? That
 * is the number a change to Agent 3 has to move, so the harness reports it rather than leaving it to
 * a separate script that might drift.
 *
 * Usage:
 *   npm run -w @cml/worker harness:agent3:direct -- --project <projectId> [options]
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { AzureOpenAIClient, LLMLogger, type LogLevel } from "@cml/llm-client";
import { generateCML } from "@cml/prompts-llm";

import { buildCmlGenerationRequest } from "../jobs/agents/agent3-run.js";
import { deriveHardLogicDirectives, mergeHardLogicDirectives } from "../jobs/agents/shared.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

type CliArgs = {
  projectId: string;
  storePath: string;
  theme?: string;
  primaryAxis?: string;
  tone?: string;
  model?: string;
  temperature: number;
  maxAttempts: number;
  runId: string;
  outputPath?: string;
};

const __filename = fileURLToPath(import.meta.url);
const workerRoot = path.resolve(path.dirname(__filename), "..", "..");
const repoRoot = path.resolve(workerRoot, "..", "..");

const printUsage = (): void => {
  // eslint-disable-next-line no-console
  console.log(
    [
      "Agent3 Direct LLM Harness — generate ONE CML from a project's real upstream artifacts.",
      "",
      "Usage:",
      "  npm run -w @cml/worker harness:agent3:direct -- --project <projectId> [options]",
      "",
      "Required:",
      "  --project <projectId>     A project with setting, cast, background_context and hard_logic_devices",
      "",
      "Options:",
      "  --store <path>            Artifact store (default: <repo>/data/store.json)",
      "  --theme <text>            Override the theme (default: the project's own)",
      "  --axis <axis>             temporal|spatial|identity|behavioral|authority (default: the project's)",
      "  --tone <text>             Override the tone",
      "  --model <deployment>      Default: AZURE_OPENAI_DEPLOYMENT_NAME",
      "  --temperature <number>    Default: the configured Agent 3 temperature",
      "  --maxAttempts <number>    Default: 1 — a harness run should not hide a first-attempt failure",
      "  --runId <id>              Default: harness-agent3-<timestamp>",
      "  --out <path>              Where to write the CML and the report",
      "  --help",
    ].join("\n"),
  );
};

const parseArgs = (argv: string[]): CliArgs => {
  const get = (name: string): string | undefined => {
    const i = argv.indexOf(name);
    return i < 0 ? undefined : argv[i + 1];
  };
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }
  const projectId = get("--project");
  if (!projectId) throw new Error("Missing required --project argument.");
  const temperature = Number(get("--temperature") ?? "NaN");
  const maxAttempts = Number(get("--maxAttempts") ?? "1");
  return {
    projectId,
    storePath: get("--store") ?? path.join(repoRoot, "data", "store.json"),
    theme: get("--theme"),
    primaryAxis: get("--axis"),
    tone: get("--tone"),
    model: get("--model"),
    temperature,
    maxAttempts: Number.isFinite(maxAttempts) && maxAttempts > 0 ? maxAttempts : 1,
    runId: get("--runId") ?? `harness-agent3-${Date.now()}`,
    outputPath: get("--out"),
  };
};

/** The latest artifact of a type for a project, reading both row spellings. */
const latestArtifact = (rows: any[], projectId: string, type: string): any => {
  let found: any;
  for (const r of rows) {
    if ((r.project_id ?? r.projectId) !== projectId) continue;
    if ((r.artifact_type ?? r.type) !== type) continue;
    found = r.payload_json ? JSON.parse(r.payload_json) : r.payload;
  }
  return found;
};

/**
 * A_102's classification, computed on the case this run produced.
 *
 * A case "proves the act" when the discriminating test names a noun of its own `death_method`, or
 * when the physical traces or a culprit-linked fact do. Presence, access and knowledge do not count —
 * that is the whole distinction.
 */
const provesTheAct = (caseBlock: any): { verdict: string; detail: string } => {
  const dm = String(caseBlock?.death_method ?? "").trim();
  if (!dm) return { verdict: "UNKNOWN", detail: "the case records no death_method" };
  const words = dm
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["with", "were", "from", "into", "that", "this", "used", "been"].includes(w));
  if (words.length === 0) return { verdict: "UNKNOWN", detail: `death_method has no usable noun: "${dm}"` };

  const has = (text: string): boolean => words.some((w) => text.toLowerCase().includes(w));
  const dt = caseBlock?.discriminating_test ?? {};
  const testText = `${dt.design ?? ""} ${dt.knowledge_revealed ?? ""} ${dt.pass_condition ?? ""}`;
  const traces: string[] = Array.isArray(caseBlock?.constraint_space?.physical?.traces)
    ? caseBlock.constraint_space.physical.traces.map(String)
    : [];
  const culprits: string[] = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map(String)
    : [];
  const namesCulprit = (t: string): boolean =>
    culprits.some((c) => t.includes(c) || t.includes(String(c.split(/\s+/).pop())));

  if (has(testText)) return { verdict: "PROVES THE ACT", detail: `the discriminating test names the means of death` };
  const trace = traces.find((t) => has(t));
  if (trace) {
    return {
      verdict: namesCulprit(trace) ? "PROVES THE ACT" : "TRACE ONLY",
      detail: `physical trace: "${trace}"${namesCulprit(trace) ? "" : " — but it names no culprit"}`,
    };
  }
  return {
    verdict: "PRESENCE ONLY",
    detail: `nothing connects ${culprits.join(", ") || "the culprit"} to "${dm}" — pass_condition: "${String(dt.pass_condition ?? "").slice(0, 110)}"`,
  };
};

const main = async (): Promise<void> => {
  dotenv.config({ path: path.join(workerRoot, ".env.local") });
  dotenv.config({ path: path.join(workerRoot, ".env") });
  dotenv.config({ path: path.join(repoRoot, ".env.local") });
  dotenv.config({ path: path.join(repoRoot, ".env") });

  const args = parseArgs(process.argv.slice(2));

  const store = JSON.parse(await readFile(args.storePath, "utf8"));
  const rows: any[] = store.artifacts ?? [];
  const setting = latestArtifact(rows, args.projectId, "setting");
  const cast = latestArtifact(rows, args.projectId, "cast");
  const backgroundContext = latestArtifact(rows, args.projectId, "background_context");
  const hardLogicDevices = latestArtifact(rows, args.projectId, "hard_logic_devices");
  const priorCml = latestArtifact(rows, args.projectId, "cml");

  const missing = [
    ["setting", setting],
    ["cast", cast],
    ["background_context", backgroundContext],
    ["hard_logic_devices", hardLogicDevices],
  ]
    .filter(([, v]) => !v)
    .map(([n]) => n);
  if (missing.length > 0) {
    throw new Error(`project ${args.projectId} is missing: ${missing.join(", ")}. Agent 3 cannot be run against it.`);
  }

  const priorCase = priorCml?.CASE ?? priorCml;
  const theme = args.theme ?? String(priorCase?.meta?.theme ?? "") ?? undefined;
  const primaryAxis = (args.primaryAxis ?? priorCase?.meta?.primary_axis ?? "temporal") as never;

  /**
   * The context `buildCmlGenerationRequest` reads — no more of it than that function touches, so a
   * field it starts reading tomorrow fails loudly here rather than being silently undefined.
   */
  const initialDirectives = deriveHardLogicDirectives(theme || undefined, primaryAxis, undefined);
  const ctx = {
    setting,
    cast,
    backgroundContext,
    hardLogicDevices,
    hardLogicDirectives: mergeHardLogicDirectives(initialDirectives, hardLogicDevices.devices ?? []),
    lockedFactRegistry: [],
    primaryAxis,
    inputs: { theme: theme || undefined, tone: args.tone },
    runId: args.runId,
    projectId: args.projectId,
  } as unknown as OrchestratorContext;

  const request = buildCmlGenerationRequest(ctx, undefined);

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  if (!endpoint || !apiKey) throw new Error("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY must be set.");

  const logger = new LLMLogger({
    logLevel: process.env.LOG_LEVEL as LogLevel | undefined,
    logToConsole: true,
    logToFile: true,
    logFilePath: process.env.LOG_FILE_PATH || "apps/api/logs/llm.jsonl",
  });
  const client = new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: args.model || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE || 60),
    logger,
  });

  const started = Date.now();
  const result = await generateCML(client, request as never, path.join(repoRoot, "library", "works"), args.maxAttempts);
  const latencyMs = Date.now() - started;

  const caseBlock = (result.cml as any)?.CASE ?? result.cml;
  const classification = provesTheAct(caseBlock);

  const report = {
    harness: { ...args, latencyMs, cost: result.cost },
    request: { theme: request.theme, primaryAxis: request.primaryAxis, castNames: request.castNames, mechanismFamilies: request.mechanismFamilies },
    classification,
    normalizationNotes: result.normalizationNotes ?? [],
    cml: result.cml,
  };

  const outPath = args.outputPath ?? path.join(workerRoot, "logs", `agent3-direct-harness-${args.runId}.json`);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(report, null, 2), "utf8");

  const culprits = (caseBlock?.culpability?.culprits ?? []).join(", ");
  // eslint-disable-next-line no-console
  console.log(
    [
      "",
      `Agent3 direct harness — ${args.projectId}`,
      `  attempts=${result.attempt ?? "?"} cost=$${(result.cost ?? 0).toFixed(3)} latency=${(latencyMs / 1000).toFixed(1)}s`,
      `  culprit: ${culprits || "(none)"}   death_method: ${caseBlock?.death_method ?? "(none)"}`,
      `  A_102 classification: ${classification.verdict}`,
      `    ${classification.detail}`,
      ...(report.normalizationNotes.length > 0
        ? ["  normalization had to invent:", ...report.normalizationNotes.map((n: string) => `    ${n}`)]
        : []),
      `  output=${outPath}`,
      "",
    ].join("\n"),
  );
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Harness failed: ${(error as Error).message}`);
  process.exit(1);
});
