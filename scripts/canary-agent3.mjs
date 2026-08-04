import fs from "fs/promises";
import path from "path";
import { config as loadDotEnv } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { loadSeedCMLFiles } from "@cml/prompts-llm";
import { resolveArtifacts } from "./canary-loop/artifacts.mjs";
import { extractResponseJson } from "./canary-loop/response-body.mjs";
// REVIEW_04 §11.1 A3 — one body for "which attempt shipped?", shared with canary-agent-boundary.mjs.
import { readLatestAgentJson as readLatestAgentJsonShared } from "./canary-loop/hydrate.mjs";
import { deriveHardLogicDirectives, buildNoveltyConstraints, normalizePrimaryAxis, runAgent3 } from "../apps/worker/dist/jobs/agents/index.js";
import { resolveWorkerRuntimePaths } from "../apps/worker/dist/jobs/runtime-paths.js";

const workspaceRoot = process.cwd();
loadDotEnv({ path: path.join(workspaceRoot, ".env") });
loadDotEnv({ path: path.join(workspaceRoot, ".env.local") });

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const runId = args.runId;

  if (!runId) {
    console.log("CANARY_STATUS failure");
    console.log("WARNINGS_COUNT 0");
    console.error("runId is required for canary-agent3");
    process.exit(1);
  }

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";

  if (!endpoint || !apiKey) {
    console.log("CANARY_SKIPPED_MISSING_AZURE_ENV");
    process.exit(2);
  }

  const client = new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
    logger: new LLMLogger({
      logToConsole: true,
      logToFile: true,
      logFilePath: process.env.LOG_FILE_PATH ?? "apps/api/logs/llm.jsonl",
    }),
  });

  const artifactBundle = await resolveArtifacts({
    workspaceRoot,
    runId,
    agentCode: "3",
  });

  const runState = artifactBundle.runState;
  const settingRaw = await readLatestAgentJson(runState, artifactBundle.runFolder, "1");
  const castRaw = await readLatestAgentJson(runState, artifactBundle.runFolder, "2");
  const backgroundContextRaw = await readLatestAgentJson(runState, artifactBundle.runFolder, "2e");
  const hardLogicDevicesRaw = await readLatestAgentJson(runState, artifactBundle.runFolder, "3b");

  const { examplesRoot } = resolveWorkerRuntimePaths(import.meta.url);
  const seedEntries = await loadSeedCMLFiles(examplesRoot);

  const theme = process.env.DEFAULT_MYSTERY_THEME ?? "A classic country-house murder with tangled inheritance motives";
  const primaryAxis = normalizePrimaryAxis(undefined);
  const hardLogicDirectives = deriveHardLogicDirectives(theme, primaryAxis, undefined);
  const noveltyConstraints = buildNoveltyConstraints(seedEntries);

  const warnings = [];
  const errors = [];
  const agentCosts = {};
  const agentDurations = {};

  const ctx = {
    client,
    runId,
    projectId: runState.projectId,
    examplesRoot,
    primaryAxis,
    hardLogicDirectives,
    noveltyConstraints,
    seedEntries,
    inputs: {
      theme,
      tone: "Golden Age Mystery",
      narrativeStyle: "classic",
      skipNoveltyCheck: true,
      runId,
      projectId: runState.projectId,
    },
    setting: { setting: settingRaw },
    cast: { cast: castRaw },
    backgroundContext: backgroundContextRaw,
    hardLogicDevices: hardLogicDevicesRaw,
    errors,
    warnings,
    agentCosts,
    agentDurations,
    revisedByAgent4: false,
    revisionAttempts: undefined,
    enableScoring: false,
    scoreAggregator: undefined,
    reportRepository: undefined,
    retryManager: undefined,
    scoringLogger: undefined,
    noveltyAudit: undefined,
    savePartialReport: async () => {},
    reportProgress: (stage, message) => {
      console.log(`PROGRESS ${stage} - ${message}`);
    },
  };

  await runAgent3(ctx);

  console.log("CANARY_STATUS success");
  console.log("RUN_ID", runId);
  console.log("WARNINGS_COUNT", warnings.length);
  if (warnings.length) {
    console.log("WARNINGS", JSON.stringify(warnings.slice(0, 6)));
  }
}

/** Thin adapter: the shared resolver, given this file's markdown reader. */
async function readLatestAgentJson(runState, runFolder, agentCode) {
  return readLatestAgentJsonShared(runState, runFolder, agentCode, async (responsePath) =>
    extractResponseJson(await fs.readFile(responsePath, "utf8")),
  );
}


function parseAgentCode(input) {
  const text = String(input ?? "").trim();
  const match = text.match(/agent\s*([0-9]+(?:\.[0-9]+)?[a-z]?)/i);
  if (!match) {
    return null;
  }
  return String(match[1]).toLowerCase().replace(/\.5$/, "5").replace(/[^0-9a-z]/g, "");
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = "true";
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  console.log("CANARY_STATUS failure");
  console.log("WARNINGS_COUNT 0");
  process.exit(1);
});
