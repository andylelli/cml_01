import path from "path";
import { config as loadDotEnv } from "dotenv";
import { buildDefaultRequest, runCanaryLoop } from "./canary-loop/controller.mjs";
import { parseBoolean, parseInteger, DEFAULTS } from "./canary-loop/config.mjs";

const workspaceRoot = process.cwd();
loadDotEnv({ path: path.join(workspaceRoot, ".env") });
loadDotEnv({ path: path.join(workspaceRoot, ".env.local") });

async function main() {
  const rawArgs = parseArgs(process.argv.slice(2));
  const request = buildDefaultRequest({
    runId: rawArgs.runId,
    agent: rawArgs.agent,
    startFromAgent: rawArgs.startFromAgent,
    hydratePriorFromRun: parseBoolean(
      rawArgs.hydratePriorFromRun,
      DEFAULTS.hydratePriorFromRun
    ),
    mode: rawArgs.mode ?? DEFAULTS.mode,
    maxIterations: parseInteger(rawArgs.maxIterations, DEFAULTS.maxIterations),
    maxUnchanged: parseInteger(rawArgs.maxUnchanged, DEFAULTS.maxUnchanged),
    testScope: rawArgs.testScope ?? DEFAULTS.testScope,
    canaryCommand: rawArgs.canaryCommand,
    stopOnNewFailureClass: parseBoolean(
      rawArgs.stopOnNewFailureClass,
      DEFAULTS.stopOnNewFailureClass
    ),
    allowFiles: splitCsv(rawArgs.allowFiles),
    denyFiles: splitCsv(rawArgs.denyFiles),
    resume: rawArgs.resume,
    overrideFileCap: parseInteger(rawArgs.overrideFileCap, undefined),
    startChapter: parseInteger(rawArgs.startChapter, undefined),
    confirmSharedEdits: parseBoolean(
      rawArgs.confirmSharedEdits,
      DEFAULTS.confirmSharedEdits
    ),
    rollbackFailedChanges: parseBoolean(
      rawArgs.rollbackFailedChanges,
      DEFAULTS.rollbackFailedChanges
    ),
    autoExpandUpstreamScope: parseBoolean(
      rawArgs.autoExpandUpstreamScope,
      DEFAULTS.autoExpandUpstreamScope
    ),
  });

  const result = await runCanaryLoop({
    workspaceRoot,
    request,
  });

  printResult(result);
  process.exit(result.exitCode);
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
  const values = String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length ? values : undefined;
}

function printResult(result) {
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

  if (result.hydration) {
    console.log("HYDRATION_SOURCE_RUN", result.hydration.sourceRunId);
    console.log("HYDRATION_START_FROM", result.hydration.startFromAgent);
    console.log("HYDRATION_UPSTREAM_COUNT", result.hydration.upstreamAgents?.length ?? 0);
    console.log(
      "HYDRATION_MISSING_REQUIRED",
      (result.hydration.missingRequiredArtifacts ?? []).join(",") || "none"
    );
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("CANARY_LOOP_FATAL", message);
  process.exit(2);
});
