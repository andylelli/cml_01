import path from "path";
import fs from "fs/promises";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { config as loadDotEnv } from "dotenv";
import YAML from "yaml";
import {
  applyQuickRunPreset,
  buildDefaultRequest,
  runCanaryLoop,
} from "./canary-loop/controller.mjs";
import { parseBoolean, parseInteger, DEFAULTS } from "./canary-loop/config.mjs";

const workspaceRoot = process.cwd();
const defaultRequestYamlDir = path.join(workspaceRoot, "scripts", "canary-loop");
loadDotEnv({ path: path.join(workspaceRoot, ".env") });
loadDotEnv({ path: path.join(workspaceRoot, ".env.local") });

async function main() {
  const rawArgs = parseArgs(process.argv.slice(2));
  const yamlPathArg = firstDefined(rawArgs.yaml, rawArgs.inputYaml);
  const yamlConfig = await maybeLoadYamlRequest(yamlPathArg);
  const mergedArgs = {
    ...(yamlConfig?.inputs ?? {}),
    ...rawArgs,
  };
  const hasExplicitEnableMajorRework =
    Object.prototype.hasOwnProperty.call(rawArgs, "enableMajorRework")
    || Object.prototype.hasOwnProperty.call(yamlConfig?.inputs ?? {}, "enableMajorRework");

  const runtimeAgentInputs = await resolveRuntimeAgentInputs({
    agent: mergedArgs.agent,
    startFromAgent: mergedArgs.startFromAgent,
  });

  let request = buildDefaultRequest({
    runId: mergedArgs.runId,
    agent: runtimeAgentInputs.agent,
    startFromAgent: runtimeAgentInputs.startFromAgent,
    hydratePriorFromRun: parseBoolean(
      mergedArgs.hydratePriorFromRun,
      DEFAULTS.hydratePriorFromRun
    ),
    quickRun: parseBoolean(mergedArgs.quickRun, DEFAULTS.quickRun),
    mode: mergedArgs.mode ?? DEFAULTS.mode,
    maxIterations: parseInteger(mergedArgs.maxIterations, DEFAULTS.maxIterations),
    maxUnchanged: parseInteger(mergedArgs.maxUnchanged, DEFAULTS.maxUnchanged),
    testScope: mergedArgs.testScope ?? DEFAULTS.testScope,
    canaryCommand: mergedArgs.canaryCommand,
    stopOnNewFailureClass: parseBoolean(
      mergedArgs.stopOnNewFailureClass,
      DEFAULTS.stopOnNewFailureClass
    ),
    allowFiles: splitCsv(mergedArgs.allowFiles),
    denyFiles: splitCsv(mergedArgs.denyFiles),
    resume: mergedArgs.resume,
    overrideFileCap: parseInteger(mergedArgs.overrideFileCap, undefined),
    startChapter: parseInteger(mergedArgs.startChapter, undefined),
    confirmSharedEdits: parseBoolean(
      mergedArgs.confirmSharedEdits,
      DEFAULTS.confirmSharedEdits
    ),
    rollbackFailedChanges: parseBoolean(
      mergedArgs.rollbackFailedChanges,
      DEFAULTS.rollbackFailedChanges
    ),
    partialRollbackEnabled: parseBoolean(
      mergedArgs.partialRollbackEnabled,
      DEFAULTS.partialRollbackEnabled
    ),
    autoExpandUpstreamScope: parseBoolean(
      mergedArgs.autoExpandUpstreamScope,
      DEFAULTS.autoExpandUpstreamScope
    ),
    enableMajorRework: parseBoolean(
      mergedArgs.enableMajorRework,
      DEFAULTS.enableMajorRework
    ),
  });

  request = applyQuickRunPreset(request);
  if (request.quickRun && hasExplicitEnableMajorRework) {
    request.enableMajorRework = parseBoolean(
      mergedArgs.enableMajorRework,
      request.enableMajorRework
    );
  }
  if (request.quickRun) {
    // Boundary canary execution reads this env variable directly.
    process.env.CANARY_FORCE_FRESH_UPSTREAM = "false";
  }

  const result = await runCanaryLoop({
    workspaceRoot,
    request,
  });

  printResult(result, request);
  process.exit(result.exitCode);
}

async function maybeLoadYamlRequest(inputYamlArg) {
  if (!inputYamlArg) {
    return null;
  }

  const resolvedPath = path.isAbsolute(inputYamlArg)
    ? inputYamlArg
    : path.resolve(defaultRequestYamlDir, inputYamlArg);

  const raw = await fs.readFile(resolvedPath, "utf8");
  const parsed = YAML.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Expected YAML object in ${resolvedPath}.`);
  }

  const inputs = normalizeYamlInputs(parsed);

  console.log("CANARY_REQUEST_FILE", resolvedPath);
  return {
    resolvedPath,
    inputs,
  };
}

function normalizeYamlInputs(parsedYaml) {
  if (
    parsedYaml.inputs
    && typeof parsedYaml.inputs === "object"
    && !Array.isArray(parsedYaml.inputs)
  ) {
    return parsedYaml.inputs;
  }
  return parsedYaml;
}

async function resolveRuntimeAgentInputs({ agent, startFromAgent }) {
  const trimmedAgent = normalizeCliString(agent);
  const trimmedStartFromAgent = normalizeCliString(startFromAgent);
  if (trimmedAgent && trimmedStartFromAgent) {
    return {
      agent: trimmedAgent,
      startFromAgent: trimmedStartFromAgent,
    };
  }

  if (!input.isTTY || !output.isTTY) {
    if (!trimmedAgent) {
      throw new Error(
        "Agent is blank. Provide --agent, set agent in --yaml/--inputYaml, or run in an interactive terminal."
      );
    }
    return {
      agent: trimmedAgent,
      startFromAgent: trimmedStartFromAgent,
    };
  }

  const rl = createInterface({ input, output });
  try {
    const runtimeAgent = trimmedAgent || await promptForRequiredValue(rl, "Agent", "Agent6-FairPlay");
    const runtimeStartFrom = trimmedStartFromAgent
      || await promptWithDefault(rl, "startFromAgent", runtimeAgent);
    return {
      agent: runtimeAgent,
      startFromAgent: runtimeStartFrom,
    };
  } finally {
    rl.close();
  }
}

async function promptForRequiredValue(rl, label, exampleValue) {
  while (true) {
    const value = normalizeCliString(await rl.question(`${label} (required, e.g. ${exampleValue}): `));
    if (value) {
      return value;
    }
    console.log(`${label} cannot be blank.`);
  }
}

async function promptWithDefault(rl, label, defaultValue) {
  const value = normalizeCliString(await rl.question(`${label} [default: ${defaultValue}]: `));
  return value || defaultValue;
}

function normalizeCliString(value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : undefined;
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function parseArgs(argv) {
  const out = {};
  const multiTokenKeys = new Set(["canaryCommand"]);
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

    if (multiTokenKeys.has(key)) {
      const values = [];
      let cursor = i + 1;
      while (cursor < argv.length && !argv[cursor].startsWith("--")) {
        values.push(argv[cursor]);
        cursor += 1;
      }
      out[key] = values.join(" ");
      i = cursor - 1;
      continue;
    }

    out[key] = next;
    i += 1;
  }
  return out;
}

function splitCsv(value) {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const normalized = value
      .map((v) => String(v).trim())
      .filter(Boolean);
    return normalized.length ? normalized : undefined;
  }
  const values = String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length ? values : undefined;
}

function printResult(result, request) {
  console.log("CANARY_LOOP_STATUS", result.status);
  for (const message of result.messages ?? []) {
    console.log("CANARY_LOOP_NOTE", message);
  }

  if (result.signature) {
    console.log("SIGNATURE_CLASS", result.signature.class);
    console.log("SIGNATURE_CONFIDENCE", result.signature.confidence);
  }

  if (result.rootCause) {
    console.log("ROOT_CAUSE_LAYER", result.rootCause.sourceLayer);
    console.log("ROOT_CAUSE_CONFIDENCE", result.rootCause.confidence);
  }

  if (result.retryFeedbackPacket) {
    console.log("RETRY_PACKET", JSON.stringify(result.retryFeedbackPacket));
  }

  if (result.selectedPlaybooks?.length) {
    console.log("SELECTED_PLAYBOOKS", result.selectedPlaybooks.join(","));
  }

  if (result.ledger) {
    console.log("LEDGER_JSONL", result.ledger.jsonlPath);
    console.log("LEDGER_MD", result.ledger.mdPath);
  }

  if (result.majorReworkLog) {
    console.log("MAJOR_REWORK_LOG_JSONL", result.majorReworkLog.jsonlPath);
    console.log("MAJOR_REWORK_LOG_MD", result.majorReworkLog.mdPath);
  }

  if (result.hydration) {
    console.log("HYDRATION_SOURCE_RUN", result.hydration.sourceRunId);
    console.log("HYDRATION_START_FROM", result.hydration.startFromAgent);
    console.log("HYDRATION_UPSTREAM_COUNT", result.hydration.upstreamAgents?.length ?? 0);
    console.log(
      "HYDRATION_MISSING_REQUIRED",
      (result.hydration.missingRequiredArtifacts ?? []).join(",") || "none"
    );
  }

  if (request?.quickRun === true) {
    console.log("QUICK_RUN", "true");
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("CANARY_LOOP_FATAL", message);
  process.exit(2);
});
