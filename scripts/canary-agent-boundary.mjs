import fs from "fs/promises";
import path from "path";
import { config as loadDotEnv } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { loadSeedCMLFiles, reviseCml } from "@cml/prompts-llm";
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
  runAgent9,
} from "../apps/worker/dist/jobs/agents/index.js";
import { resolveWorkerRuntimePaths } from "../apps/worker/dist/jobs/runtime-paths.js";
import { resolveArtifacts } from "./canary-loop/artifacts.mjs";
import { loadCanaryInputOverrides } from "./canary-loop/canary-input-overrides.mjs";
import { parseJsonText } from "./canary-loop/json.mjs";

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
  "9": "Agent9-Prose",
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
  "9": ["1", "2", "2e", "3b", "3", "5", "6", "2b", "2c", "2d", "7"],
};

const SYNTHESIS_ORDER = ["1", "2", "2e", "3b", "3", "5", "6", "2b", "2c", "2d", "65", "7"];

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const runId = String(args.runId ?? "").trim();
  const agentCode = normalizeAgentCode(args.agent);
  const startChapter = toPositiveInt(args.startChapter) ?? undefined;

  if (!runId) {
    throw new Error("runId is required for canary-agent-boundary");
  }
  if (!agentCode || !AGENT_LABELS[agentCode]) {
    throw new Error("--agent is required and must be one of: 1,2,2e,3b,3,4,5,6,2b,2c,2d,65,7,9");
  }

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";
  const forceFreshUpstream = parseBooleanEnv(process.env.CANARY_FORCE_FRESH_UPSTREAM, false);

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
    startChapter,
    allowMissingAgentRecords: true,
  });

  const { upstreamByCode, missingRequiredCodes } = await hydrateUpstreamArtifacts({
    runState: artifactBundle.runState,
    runFolder: artifactBundle.runFolder,
    requiredCodes: REQUIRED_CODES[agentCode] ?? [],
    forceFreshUpstream,
  });

  const canaryInputConfig = await loadCanaryInputOverrides({
    workspaceRoot,
    quickRun: parseBooleanEnv(process.env.CANARY_QUICK_RUN, false),
  });

  const ctx = await buildBaseContext({
    client,
    runId: artifactBundle.runId,
    projectId: artifactBundle.runState.projectId,
    canaryInputs: canaryInputConfig.inputs,
  });

  applyHydratedContext(ctx, upstreamByCode);
  await synthesizeMissingRequiredContext({
    agentCode,
    missingRequiredCodes,
    ctx,
    forceFreshUpstream,
  });

  if (startChapter) {
    console.log("FROM_CHAPTER", startChapter);
    console.log("CHAPTER_START", startChapter);
  }

  console.log("CANARY_AGENT", AGENT_LABELS[agentCode]);
  console.log("RUN_ID", artifactBundle.runId);
  console.log("CANARY_INPUTS_FILE", canaryInputConfig.sources.coreInputsPath);
  if (canaryInputConfig.sources.quickRunEnabled && canaryInputConfig.sources.quickRunRequestPath) {
    console.log("CANARY_QUICKRUN_OVERRIDES_FILE", canaryInputConfig.sources.quickRunRequestPath);
  }
  console.log("HYDRATED_CODES", Object.keys(upstreamByCode).join(",") || "none");

  try {
    if (agentCode === "4") {
      await runAgent4BoundaryCheck(ctx);
    } else {
      await runAgentBoundary(agentCode, ctx);
    }
  } catch (error) {
    emitFirstPassTelemetry(agentCode, ctx);
    emitAgent6RescueTelemetry(agentCode, ctx);
    throw error;
  }

  emitFirstPassTelemetry(agentCode, ctx);
  emitAgent6RescueTelemetry(agentCode, ctx);

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
    "9": runAgent9,
  };

  const handler = handlers[agentCode];
  if (!handler) {
    throw new Error(`No boundary handler configured for agent '${agentCode}'.`);
  }

  await handler(ctx);
}

function emitFirstPassTelemetry(agentCode, ctx) {
  const normalized = normalizeAgentCode(agentCode);

  if (normalized === "5" || normalized === "6" || typeof ctx.agent5FirstPassPassed === "boolean") {
    const status =
      typeof ctx.agent5FirstPassPassed === "boolean"
        ? (ctx.agent5FirstPassPassed ? "pass" : "fail")
        : "unknown";
    const retryInvoked =
      typeof ctx.agent5RetryInvoked === "boolean"
        ? String(ctx.agent5RetryInvoked)
        : "false";
    const failureClass = String(ctx.agent5FailureClass ?? "none").trim() || "none";
    console.log("AGENT5_FIRST_PASS_STATUS", status);
    console.log("AGENT5_RETRY_INVOKED", retryInvoked);
    console.log("AGENT5_FAILURE_CLASS", failureClass);
  }

  if (normalized === "6" || typeof ctx.agent6FirstPassPassed === "boolean") {
    const status =
      typeof ctx.agent6FirstPassPassed === "boolean"
        ? (ctx.agent6FirstPassPassed ? "pass" : "fail")
        : "unknown";
    const retryInvoked =
      typeof ctx.agent6RetryInvoked === "boolean"
        ? String(ctx.agent6RetryInvoked)
        : "false";
    const failureClass = String(ctx.agent6FailureClass ?? "none").trim() || "none";
    console.log("AGENT6_FIRST_PASS_STATUS", status);
    console.log("AGENT6_RETRY_INVOKED", retryInvoked);
    console.log("AGENT6_FAILURE_CLASS", failureClass);
  }
}

function emitAgent6RescueTelemetry(agentCode, ctx) {
  const normalized = normalizeAgentCode(agentCode);
  if (normalized !== "6") {
    return;
  }

  const telemetry = summarizeAgent6RescueTelemetry(ctx);
  if (!telemetry) {
    return;
  }

  console.log("AGENT6_RESCUE_TELEMETRY", JSON.stringify(telemetry));
}

function summarizeAgent6RescueTelemetry(ctx) {
  const warnings = Array.isArray(ctx?.warnings)
    ? ctx.warnings.map((warning) => String(warning ?? "").trim()).filter(Boolean)
    : [];
  const clueIds = Array.isArray(ctx?.clues?.clues)
    ? ctx.clues.clues.map((clue) => String(clue?.id ?? "").trim()).filter(Boolean)
    : [];

  const rescueWarningCounts = {
    strictStepFallback: 0,
    parityBridge: 0,
    auditVisibility: 0,
    fairPlayBackstop: 0,
    guardrailAutoFix: 0,
    synthesizedUpstreamContext: 0,
    otherRescue: 0,
  };

  const classifyRescueWarning = (warning) => {
    if (/strict-step fallback/i.test(warning)) return "strictStepFallback";
    if (/parity bridge/i.test(warning)) return "parityBridge";
    if (/clue_audit_visibility|audit-flagged hidden information/i.test(warning)) return "auditVisibility";
    if (/deterministic fair-play backstop/i.test(warning)) return "fairPlayBackstop";
    if (/guardrail auto-fix/i.test(warning)) return "guardrailAutoFix";
    if (/synthesized upstream context/i.test(warning)) return "synthesizedUpstreamContext";
    if (/strict direct culprit slot repair|strict late clue slot repair/i.test(warning)) return "otherRescue";
    return null;
  };

  for (const warning of warnings) {
    const category = classifyRescueWarning(warning);
    if (!category) continue;
    rescueWarningCounts[category] += 1;
  }

  const syntheticClueCounts = {
    parityBridge: 0,
    fairPlayBackstop: 0,
    contradictionBackstop: 0,
    auditVisibility: 0,
  };
  for (const clueId of clueIds) {
    if (/^clue_parity_bridge(?:_|$)/i.test(clueId)) {
      syntheticClueCounts.parityBridge += 1;
      continue;
    }
    if (/^clue_fp_backstop_step_/i.test(clueId)) {
      syntheticClueCounts.fairPlayBackstop += 1;
      continue;
    }
    if (/^clue_fp_contradiction_step_/i.test(clueId)) {
      syntheticClueCounts.contradictionBackstop += 1;
      continue;
    }
    if (/^clue_audit_visibility/i.test(clueId)) {
      syntheticClueCounts.auditVisibility += 1;
    }
  }

  const rescueWarningTotal = Object.values(rescueWarningCounts).reduce((sum, count) => sum + Number(count ?? 0), 0);
  const syntheticClueTotal = Object.values(syntheticClueCounts).reduce((sum, count) => sum + Number(count ?? 0), 0);
  const available = rescueWarningTotal > 0 || syntheticClueTotal > 0 || ctx?.agent6RetryInvoked === true;
  if (!available) {
    return null;
  }

  return {
    available: true,
    retryInvoked: ctx?.agent6RetryInvoked === true,
    failureClass: String(ctx?.agent6FailureClass ?? "none").trim() || "none",
    finalWarningCount: warnings.length,
    rescueWarningTotal,
    rescueWarningCounts,
    syntheticClueTotal,
    syntheticClueCounts,
  };
}

async function runAgent4BoundaryCheck(ctx) {
  if (!ctx.cml) {
    throw new Error("Agent4 boundary requires hydrated CML from Agent3 output.");
  }

  const initialValidation = validateCml(ctx.cml);
  if (initialValidation.valid) {
    ctx.reportProgress("agent4", "Hydrated CML passes revision boundary checks", 100);
    return;
  }

  ctx.warnings.push(
    `Agent4 boundary: hydrated CML failed validation with ${initialValidation.errors.length} error(s); running Agent4 revision semantics.`,
  );

  const originalPrompt = {
    system: "Boundary Agent4 revision execution",
    developer:
      "Apply CML 2.0 schema-compliant, minimal structural repairs while preserving valid existing narrative content.",
    user:
      "Repair hydrated CML validation failures for canary boundary execution while preserving fair-play structure and required_evidence completeness.",
  };

  const revised = await reviseCml(
    ctx.client,
    {
      originalPrompt,
      invalidCml: JSON.stringify(ctx.cml, null, 2),
      validationErrors: initialValidation.errors,
      attempt: 1,
      maxAttempts: 1,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    },
    1,
  );

  ctx.cml = revised.cml;
  ctx.revisedByAgent4 = true;
  ctx.revisionAttempts = revised.attempt;

  const revisedValidation = validateCml(ctx.cml);
  if (!revisedValidation.valid) {
    const top = revisedValidation.errors.slice(0, 5).join("; ");
    throw new Error(`Agent4 revision boundary failed CML validation after revision: ${top}`);
  }

  ctx.reportProgress(
    "agent4",
    `Hydrated CML revised successfully (${initialValidation.errors.length} -> 0 validation errors)`,
    100,
  );
}

async function hydrateUpstreamArtifacts({ runState, runFolder, requiredCodes, forceFreshUpstream = false }) {
  const out = {};
  const missingRequiredCodes = [];

  if (forceFreshUpstream) {
    return {
      upstreamByCode: {},
      missingRequiredCodes: [...new Set(requiredCodes)],
    };
  }

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

async function synthesizeMissingRequiredContext({ agentCode, missingRequiredCodes, ctx, forceFreshUpstream = false }) {
  if (!missingRequiredCodes.length) {
    return;
  }

  const executionPlan = buildSynthesisPlan(missingRequiredCodes);
  if (!executionPlan.length) {
    throw new Error(
      `Missing required hydrated response for agent code(s): ${missingRequiredCodes.join(", ")}.`
    );
  }

  if (!forceFreshUpstream) {
    const allowedLegacy = new Set(["2b", "2c", "2d"]);
    const unsupported = missingRequiredCodes.filter((code) => {
      if (agentCode === "9") {
        return false;
      }
      return !allowedLegacy.has(code);
    });
    if (unsupported.length > 0) {
      throw new Error(
        `Missing required hydrated response for agent code(s): ${unsupported.join(", ")}.`
      );
    }
  }

  for (const code of executionPlan) {
    if (hasContextForCode(ctx, code)) {
      continue;
    }
    console.log("SYNTHESIZING_CODE", code);
    await runAgentBoundary(code, ctx);
  }
}

function buildSynthesisPlan(requiredCodes) {
  const requiredSet = new Set(requiredCodes);
  const closure = new Set();

  function visit(code) {
    if (!code || closure.has(code)) {
      return;
    }
    const deps = REQUIRED_CODES[code] ?? [];
    for (const dep of deps) {
      visit(dep);
    }
    closure.add(code);
  }

  for (const code of requiredSet) {
    visit(code);
  }

  return SYNTHESIS_ORDER.filter((code) => closure.has(code));
}

function hasContextForCode(ctx, code) {
  switch (code) {
    case "1":
      return Boolean(ctx.setting);
    case "2":
      return Boolean(ctx.cast);
    case "2e":
      return Boolean(ctx.backgroundContext);
    case "3b":
      return Boolean(ctx.hardLogicDevices);
    case "3":
      return Boolean(ctx.cml);
    case "5":
      return Boolean(ctx.clues);
    case "6":
      return Boolean(ctx.fairPlayAudit);
    case "2b":
      return Boolean(ctx.characterProfiles);
    case "2c":
      return Boolean(ctx.locationProfiles);
    case "2d":
      return Boolean(ctx.temporalContext);
    case "65":
      return Boolean(ctx.worldDocument);
    case "7":
      return Boolean(ctx.narrative && ctx.coverageResult && Array.isArray(ctx.outlineCoverageIssues));
    default:
      return false;
  }
}

function parseBooleanEnv(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
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
  if (upstreamByCode["7"]) {
    const normalizedNarrative = wrapNarrative(upstreamByCode["7"]);
    ctx.narrative = normalizedNarrative;
    if (Array.isArray(upstreamByCode["7"]?.outlineCoverageIssues)) {
      ctx.outlineCoverageIssues = upstreamByCode["7"].outlineCoverageIssues;
    }
    if (upstreamByCode["7"]?.coverageResult) {
      ctx.coverageResult = upstreamByCode["7"].coverageResult;
    }
  }
}

async function buildBaseContext({ client, runId, projectId, canaryInputs = {} }) {
  const runtimePaths = resolveWorkerRuntimePaths(import.meta.url);
  const examplesRoot = path.join(workspaceRoot, "examples");
  const seedEntries = await loadSeedCMLFiles(examplesRoot);
  const theme = String(canaryInputs.theme ?? process.env.DEFAULT_MYSTERY_THEME ?? "").trim();
  if (!theme) {
    throw new Error("Canary execution requires a non-empty theme. Set it in scripts/canary-core-inputs.yaml.");
  }
  const primaryAxis = normalizePrimaryAxis(undefined);
  const initialHardLogicDirectives = deriveHardLogicDirectives(theme, primaryAxis, undefined);
  const noveltyConstraints = buildNoveltyConstraints(seedEntries);

  const castSizeRaw = canaryInputs.castSize ?? process.env.DEFAULT_CAST_SIZE;
  const castSize = castSizeRaw === undefined ? undefined : Number(castSizeRaw);
  const skipNoveltyCheck =
    typeof canaryInputs.skipNoveltyCheck === "boolean"
      ? canaryInputs.skipNoveltyCheck
      : parseBooleanEnv(process.env.CANARY_SKIP_NOVELTY_CHECK, undefined);

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
    startTime: Date.now(),
    examplesRoot,
    workerAppRoot: runtimePaths.workerAppRoot,
    workspaceRoot,
    seedEntries,
    primaryAxis,
    initialHardLogicDirectives,
    hardLogicDirectives: initialHardLogicDirectives,
    noveltyConstraints,
    maxCmlRevisionAttempts: Number(process.env.MAX_CML_REVISION_ATTEMPTS ?? 2),
    revisedByAgent4: false,
    revisionAttempts: undefined,
    revisedByAgent4FairPlay: false,
    fairPlayRevisionAttempts: 0,
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
    runLogger: {
      logProgress: () => {},
      logChapterWords: () => {},
      logComplete: () => {},
    },
    noveltyAudit: undefined,
    savePartialReport: async () => {},
    reportProgress: (stage, message) => {
      console.log(`PROGRESS ${stage} - ${message}`);
    },
    proseScoringSnapshot: {
      startedAtMs: null,
      chaptersGenerated: 0,
      latestChapterScore: null,
      latestCumulativeScore: null,
      postGenerationSummaryLogged: false,
    },
    proseChapterScores: [],
    proseSecondRunChapterScores: [],
    prosePassAccounting: [],
    proseRewritePassCount: 0,
    proseRepairPassCount: 0,
    latestProseScore: null,
    nsdTransferTrace: [],
    inputs: {
      runId,
      projectId,
      theme,
      tone: canaryInputs.tone ?? process.env.DEFAULT_MYSTERY_TONE,
      narrativeStyle: canaryInputs.narrativeStyle ?? process.env.DEFAULT_NARRATIVE_STYLE,
      targetLength: canaryInputs.targetLength ?? process.env.DEFAULT_TARGET_LENGTH,
      detectiveType: canaryInputs.detectiveType ?? process.env.DEFAULT_DETECTIVE_TYPE,
      eraPreference: canaryInputs.eraPreference ?? process.env.DEFAULT_ERA_PREFERENCE,
      castSize: Number.isFinite(castSize) ? castSize : undefined,
      skipNoveltyCheck,
    },
    locationSpec: {
      location: canaryInputs.locationPreset ?? process.env.DEFAULT_LOCATION,
      institution: process.env.DEFAULT_INSTITUTION,
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
    return parseJsonText(raw);
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

function wrapNarrative(raw) {
  if (!raw || typeof raw !== "object") {
    return { acts: [] };
  }
  if (Array.isArray(raw.acts)) {
    return raw;
  }
  if (raw.narrative && Array.isArray(raw.narrative.acts)) {
    return raw.narrative;
  }
  if (raw.outline && Array.isArray(raw.outline.acts)) {
    return raw.outline;
  }
  return { acts: [] };
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

function toPositiveInt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  console.log("CANARY_STATUS failure");
  console.log("WARNINGS_COUNT 0");
  process.exit(1);
});
