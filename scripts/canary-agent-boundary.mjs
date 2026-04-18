import fs from "fs/promises";
import path from "path";
import { config as loadDotEnv } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { loadSeedCMLFiles } from "@cml/prompts-llm";
import { getGenerationParams } from "@cml/story-validation";
import { validateCml } from "@cml/cml";
import {
  deriveHardLogicDirectives,
  buildNoveltyConstraints,
  normalizePrimaryAxis,
  runAgent1,
  runAgent2,
  runAgent2e,
  runAgent2b,
  runAgent2c,
  runAgent2d,
  runAgent3b,
  runAgent3,
  runAgent5,
  runAgent6,
  runAgent7,
  runAgent65,
} from "../apps/worker/dist/jobs/agents/index.js";
import { resolveWorkerRuntimePaths } from "../apps/worker/dist/jobs/runtime-paths.js";
import { resolveArtifacts } from "./canary-loop/artifacts.mjs";

const workspaceRoot = process.cwd();
loadDotEnv({ path: path.join(workspaceRoot, ".env") });
loadDotEnv({ path: path.join(workspaceRoot, ".env.local") });

const AGENT_LABELS = {
  "1": "Agent1-SettingRefiner",
  "2": "Agent2-CastDesigner",
  "2e": "Agent2e-BackgroundContext",
  "3b": "Agent3b-HardLogicDeviceGenerator",
  "3": "Agent3-CMLGenerator",
  "4": "Agent4-Revision",
  "5": "Agent5-ClueExtraction",
  "6": "Agent6-FairPlay",
  "2b": "Agent2b-CharacterProfiles",
  "2c": "Agent2c-LocationProfiles",
  "2d": "Agent2d-TemporalContext",
  "65": "Agent65-WorldBuilder",
  "7": "Agent7-NarrativeOutline",
};

const REQUIRED_CODES = {
  "1": [],
  "2": ["1"],
  "2e": ["1", "2"],
  "3b": ["1", "2", "2e"],
  "3": ["1", "2", "2e", "3b"],
  "4": ["3"],
  "5": ["3"],
  "6": ["3", "5"],
  "2b": ["2", "3"],
  "2c": ["1", "2e", "3"],
  "2d": ["1", "2e", "3"],
  "65": ["1", "2", "2e", "3", "3b", "5", "2b", "2c", "2d"],
  "7": ["2", "3", "5"],
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const runId = String(args.runId ?? "").trim();
  const agentCode = normalizeAgentCode(args.agent);

  if (!runId) {
    throw new Error("runId is required for canary-agent-boundary");
  }
  if (!agentCode || !AGENT_LABELS[agentCode]) {
    throw new Error("--agent is required and must be one of: 1,2,2e,3b,3,4,5,6,2b,2c,2d,65,7");
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
    agentCode,
    allowMissingAgentRecords: true,
  });

  const { upstreamByCode, missingRequiredCodes } = await hydrateUpstreamArtifacts({
    runState: artifactBundle.runState,
    runFolder: artifactBundle.runFolder,
    requiredCodes: REQUIRED_CODES[agentCode] ?? [],
  });

  const ctx = await buildBaseContext({
    client,
    runId: artifactBundle.runId,
    projectId: artifactBundle.runState.projectId,
  });

  applyHydratedContext(ctx, upstreamByCode);
  await synthesizeMissingRequiredContext({
    agentCode,
    missingRequiredCodes,
    ctx,
  });

  console.log("CANARY_AGENT", AGENT_LABELS[agentCode]);
  console.log("RUN_ID", artifactBundle.runId);
  console.log("HYDRATED_CODES", Object.keys(upstreamByCode).join(",") || "none");

  if (agentCode === "4") {
    await runAgent4BoundaryCheck(ctx);
  } else {
    await runAgentBoundary(agentCode, ctx);
  }

  console.log("CANARY_STATUS success");
  console.log("WARNINGS_COUNT", String(ctx.warnings.length));
  if (ctx.warnings.length > 0) {
    console.log("WARNINGS", JSON.stringify(ctx.warnings.slice(0, 8)));
  }
}

async function runAgentBoundary(agentCode, ctx) {
  const handlers = {
    "1": runAgent1,
    "2": runAgent2,
    "2e": runAgent2e,
    "3b": runAgent3b,
    "3": runAgent3,
    "5": runAgent5,
    "6": runAgent6,
    "2b": runAgent2b,
    "2c": runAgent2c,
    "2d": runAgent2d,
    "65": runAgent65,
    "7": runAgent7,
  };

  const handler = handlers[agentCode];
  if (!handler) {
    throw new Error(`No boundary handler configured for agent '${agentCode}'.`);
  }

  await handler(ctx);
}

async function runAgent4BoundaryCheck(ctx) {
  if (!ctx.cml) {
    throw new Error("Agent4 boundary requires hydrated CML from Agent3 output.");
  }

  const validation = validateCml(ctx.cml);
  if (!validation.valid) {
    const top = validation.errors.slice(0, 5).join("; ");
    throw new Error(`Agent4 revision boundary failed CML validation: ${top}`);
  }

  ctx.reportProgress("agent4", "Hydrated CML passes revision boundary checks", 100);
}

async function hydrateUpstreamArtifacts({ runState, runFolder, requiredCodes }) {
  const out = {};
  const missingRequiredCodes = [];

  for (const code of requiredCodes) {
    try {
      const raw = await readLatestAgentJson(runState, runFolder, code);
      out[code] = raw;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing required hydrated response")) {
        missingRequiredCodes.push(code);
        continue;
      }
      throw error;
    }
  }

  // Optional world document may be consumed by Agent7 if available in this run.
  if (!out["65"]) {
    try {
      out["65"] = await readLatestAgentJson(runState, runFolder, "65");
    } catch {
      // Optional artifact, ignore missing.
    }
  }

  return {
    upstreamByCode: out,
    missingRequiredCodes,
  };
}

async function synthesizeMissingRequiredContext({ agentCode, missingRequiredCodes, ctx }) {
  if (!missingRequiredCodes.length) {
    return;
  }

  const derivableForAgent = {
    "65": ["2b", "2c", "2d"],
  };

  const allowed = new Set(derivableForAgent[agentCode] ?? []);
  const unsupported = missingRequiredCodes.filter((code) => !allowed.has(code));
  if (unsupported.length > 0) {
    throw new Error(
      `Missing required hydrated response for agent code(s): ${unsupported.join(", ")}.`
    );
  }

  for (const code of missingRequiredCodes) {
    console.log("SYNTHESIZING_CODE", code);
    await runAgentBoundary(code, ctx);
  }
}

function applyHydratedContext(ctx, upstreamByCode) {
  if (upstreamByCode["1"]) {
    ctx.setting = wrapSetting(upstreamByCode["1"]);
  }
  if (upstreamByCode["2"]) {
    ctx.cast = wrapCast(upstreamByCode["2"]);
  }
  if (upstreamByCode["2e"]) {
    ctx.backgroundContext = extractBackgroundContext(upstreamByCode["2e"]);
  }
  if (upstreamByCode["3b"]) {
    ctx.hardLogicDevices = wrapHardLogic(upstreamByCode["3b"]);
  }
  if (upstreamByCode["3"]) {
    ctx.cml = extractCml(upstreamByCode["3"]);
  }
  if (upstreamByCode["5"]) {
    ctx.clues = wrapClues(upstreamByCode["5"]);
  }
  if (upstreamByCode["6"]) {
    ctx.fairPlayAudit = wrapFairPlayAudit(upstreamByCode["6"]);
  }
  if (upstreamByCode["2b"]) {
    ctx.characterProfiles = wrapCharacterProfiles(upstreamByCode["2b"]);
  }
  if (upstreamByCode["2c"]) {
    ctx.locationProfiles = wrapLocationProfiles(upstreamByCode["2c"]);
  }
  if (upstreamByCode["2d"]) {
    ctx.temporalContext = wrapTemporalContext(upstreamByCode["2d"]);
  }
  if (upstreamByCode["65"]) {
    ctx.worldDocument = wrapWorldDocument(upstreamByCode["65"]);
  }
}

async function buildBaseContext({ client, runId, projectId }) {
  const { examplesRoot } = resolveWorkerRuntimePaths(import.meta.url);
  const seedEntries = await loadSeedCMLFiles(examplesRoot);
  const theme = process.env.DEFAULT_MYSTERY_THEME ?? "A classic country-house murder with tangled inheritance motives";
  const primaryAxis = normalizePrimaryAxis(undefined);
  const initialHardLogicDirectives = deriveHardLogicDirectives(theme, primaryAxis, undefined);
  const noveltyConstraints = buildNoveltyConstraints(seedEntries);

  const fairPlayParams = getGenerationParams()?.agent6_fairplay?.params;
  const criticalFairPlayRules = new Set(
    Array.isArray(fairPlayParams?.critical_rules)
      ? fairPlayParams.critical_rules.map((v) => String(v).toLowerCase().trim()).filter(Boolean)
      : ["information parity", "logical deducibility", "no withholding", "discriminating test timing"]
  );

  return {
    client,
    runId,
    projectId,
    examplesRoot,
    seedEntries,
    primaryAxis,
    initialHardLogicDirectives,
    hardLogicDirectives: initialHardLogicDirectives,
    noveltyConstraints,
    revisedByAgent4: false,
    revisionAttempts: undefined,
    errors: [],
    warnings: [],
    agentCosts: {},
    agentDurations: {},
    coverageResult: undefined,
    outlineCoverageIssues: [],
    allCoverageIssues: [],
    hasCriticalFairPlayFailure: false,
    criticalFairPlayRules,
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
    inputs: {
      runId,
      projectId,
      theme,
      tone: process.env.DEFAULT_MYSTERY_TONE ?? "Golden Age Mystery",
      narrativeStyle: process.env.DEFAULT_NARRATIVE_STYLE ?? "classic",
      targetLength: process.env.DEFAULT_TARGET_LENGTH ?? "medium",
      detectiveType: process.env.DEFAULT_DETECTIVE_TYPE ?? "amateur",
      eraPreference: process.env.DEFAULT_ERA_PREFERENCE ?? "1930s",
      castSize: Number(process.env.DEFAULT_CAST_SIZE ?? 6),
      skipNoveltyCheck: true,
    },
    locationSpec: {
      location: process.env.DEFAULT_LOCATION ?? "English countryside",
      institution: process.env.DEFAULT_INSTITUTION ?? "country house",
    },
  };
}

async function readLatestAgentJson(runState, runFolder, agentCode) {
  const records = Array.isArray(runState?.records) ? runState.records : [];
  const matches = records
    .filter((record) => parseAgentCode(record.agent) === agentCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  if (matches.length === 0) {
    throw new Error(`Missing required hydrated response for agent code '${agentCode}'.`);
  }

  const latest = matches[matches.length - 1];
  if (!latest.responseFile) {
    throw new Error(`Missing response file metadata for agent code '${agentCode}'.`);
  }

  const responsePath = path.join(runFolder, latest.responseFile);
  const body = await fs.readFile(responsePath, "utf8");
  return extractResponseJson(body);
}

function extractResponseJson(markdown) {
  const textBlockMatch = markdown.match(/##\s+Response Body[\s\S]*?```text\s*([\s\S]*?)```/i);
  if (!textBlockMatch) {
    throw new Error("Unable to parse response body JSON block.");
  }
  const raw = textBlockMatch[1].trim();
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Response body JSON parse failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function wrapSetting(raw) {
  if (raw && typeof raw === "object" && raw.setting) {
    return raw;
  }
  return { setting: raw };
}

function wrapCast(raw) {
  if (raw && typeof raw === "object" && raw.cast) {
    return raw;
  }
  return { cast: raw };
}

function wrapHardLogic(raw) {
  if (raw && typeof raw === "object" && Array.isArray(raw.devices)) {
    return raw;
  }
  return { devices: Array.isArray(raw) ? raw : [] };
}

function extractCml(raw) {
  if (raw && typeof raw === "object" && raw.cml) {
    return raw.cml;
  }
  return raw;
}

function wrapClues(raw) {
  if (raw && typeof raw === "object" && Array.isArray(raw.clues)) {
    return raw;
  }
  return { clues: Array.isArray(raw) ? raw : [], clueTimeline: { early: [], mid: [], late: [] }, redHerrings: [] };
}

function wrapFairPlayAudit(raw) {
  if (raw && typeof raw === "object" && raw.overallStatus) {
    return raw;
  }
  return {
    overallStatus: "needs-revision",
    violations: [],
    warnings: ["Hydrated fair-play audit could not be normalized."],
    recommendations: [],
  };
}

function extractBackgroundContext(raw) {
  if (raw && typeof raw === "object" && raw.backgroundContext) {
    return raw.backgroundContext;
  }
  return raw;
}

function wrapCharacterProfiles(raw) {
  if (raw && typeof raw === "object" && Array.isArray(raw.profiles)) {
    return raw;
  }
  return { profiles: Array.isArray(raw) ? raw : [] };
}

function wrapLocationProfiles(raw) {
  if (raw && typeof raw === "object" && Array.isArray(raw.keyLocations)) {
    return raw;
  }
  return { keyLocations: [], primary: undefined, atmosphere: undefined };
}

function wrapTemporalContext(raw) {
  if (raw && typeof raw === "object" && raw.specificDate) {
    return raw;
  }
  return { specificDate: { month: "Unknown", year: "Unknown" } };
}

function wrapWorldDocument(raw) {
  if (raw && typeof raw === "object" && (raw.worldDocument || raw.chapters || raw.settingBible)) {
    return raw;
  }
  return raw;
}

function parseAgentCode(input) {
  const text = String(input ?? "").trim();
  const match = text.match(/agent\s*([0-9]+(?:\.[0-9]+)?[a-z]?)/i);
  if (!match) {
    return null;
  }
  return normalizeAgentCode(match[1]);
}

function normalizeAgentCode(rawCode) {
  if (rawCode === undefined || rawCode === null) {
    return null;
  }
  return String(rawCode).toLowerCase().replace(/\.5$/, "5").replace(/[^0-9a-z]/g, "");
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
