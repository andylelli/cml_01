import fs from "fs/promises";
import path from "path";
import { updateTelemetryRollups } from "./report.mjs";

const RUN_DIR_PREFIX = "canary-loop";
const LEDGER_FILE_PREFIX = "canary-ledger";

export async function createLedger({ workspaceRoot, runId, agent, resumePath, resumedEntries = [] }) {
  if (resumePath) {
    const jsonlPath = resumePath;
    const mdPath = jsonlPath.replace(/\.jsonl$/i, ".md");
    const outputDir = path.dirname(jsonlPath);
    return {
      workspaceRoot,
      outputDir,
      jsonlPath,
      mdPath,
      entries: resumedEntries,
      resumed: true,
    };
  }

  const rootOutputDir = path.join(workspaceRoot, "logs", "canary-loops");
  await fs.mkdir(rootOutputDir, { recursive: true });
  const outputDir = await createRunOutputDir(rootOutputDir);
  const timestamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..+$/, "");
  const safeAgent = sanitize(agent);
  const baseName = `${LEDGER_FILE_PREFIX}-${timestamp}-${runId}-${safeAgent}`;
  const jsonlPath = path.join(outputDir, `${baseName}.jsonl`);
  const mdPath = path.join(outputDir, `${baseName}.md`);

  await fs.writeFile(jsonlPath, "", "utf8");
  await fs.writeFile(
    mdPath,
    `# Canary Loop Ledger\n\n- runId: \`${runId}\`\n- agent: \`${agent}\`\n- startedAt: \`${new Date().toISOString()}\`\n\n`,
    "utf8"
  );

  return {
    workspaceRoot,
    outputDir,
    jsonlPath,
    mdPath,
    entries: [],
    resumed: false,
  };
}

async function createRunOutputDir(rootOutputDir) {
  const stamp = buildFolderTimestamp(new Date());
  let candidate = path.join(rootOutputDir, stamp);
  let index = 1;

  while (true) {
    try {
      await fs.mkdir(candidate, { recursive: false });
      return candidate;
    } catch {
      index += 1;
      candidate = path.join(rootOutputDir, `${stamp}-${String(index).padStart(2, "0")}`);
    }
  }
}

function buildFolderTimestamp(date) {
  const year = String(date.getUTCFullYear()).slice(-2);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${RUN_DIR_PREFIX}-${year}${month}${day}-${hours}${minutes}`;
}

export async function appendLedgerEntry(ledger, entry) {
  ledger.entries.push(entry);
  await fs.appendFile(ledger.jsonlPath, `${JSON.stringify(entry)}\n`, "utf8");
  await fs.writeFile(ledger.mdPath, renderMarkdown(ledger.entries), "utf8");
  await updateTelemetryRollups({ ledger });
}

export async function loadLedgerForResume(ledgerPath) {
  const jsonlPath = path.resolve(ledgerPath);
  const existsJsonl = await fileExists(jsonlPath);
  if (!existsJsonl) {
    throw new Error(`Resume ledger not found: ${jsonlPath}`);
  }

  const text = await fs.readFile(jsonlPath, "utf8");
  const entries = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const last = entries[entries.length - 1];
  const nextIteration = Number.isInteger(last?.iteration) ? last.iteration + 1 : 1;
  const unchangedCount = reconstructUnchangedCount(entries);

  return {
    jsonlPath,
    entries,
    nextIteration,
    unchangedCount,
    lastFingerprint: last?.workspaceFingerprint,
    lastEntry: last,
  };
}

function renderMarkdown(entries) {
  const lines = ["# Canary Loop Ledger", ""];
  for (const entry of entries) {
    lines.push(`## Iteration ${entry.iteration}`);
    lines.push(`- timestamp: \`${entry.timestamp}\``);
    lines.push(`- input signature: \`${entry.inputSignature?.class ?? "none"}\``);
    lines.push(`- confidence: \`${entry.inputSignature?.confidence ?? "n/a"}\``);
    lines.push(`- decision: \`${entry.decision}\``);
    if (entry.stopReason) {
      lines.push(`- stop reason: ${entry.stopReason}`);
    }
    if (entry.plannedActions?.length) {
      lines.push("- planned actions:");
      for (const action of entry.plannedActions) {
        lines.push(`  - ${action}`);
      }
    }
    if (entry.retryFeedbackPacket) {
      lines.push(`- retry packet must_fix: ${entry.retryFeedbackPacket.mustFix?.length ?? 0}`);
      lines.push(
        `- retry packet warnings_to_clear: ${entry.retryFeedbackPacket.warningsToClear?.length ?? 0}`
      );
    }
    if (entry.featureSnapshot) {
      const enabled = entry.featureSnapshot.enabled ?? {};
      const observed = entry.featureSnapshot.observed ?? {};
      const scope = entry.featureSnapshot.scope ?? {};
      lines.push("- feature snapshot:");
      lines.push(
        `  - enabled: majorRework=${enabled.enableMajorRework === true}, partialRollback=${enabled.partialRollbackEnabled === true}, autoExpand=${enabled.autoExpandUpstreamScope === true}, rollback=${enabled.rollbackFailedChanges === true}, hydratePrior=${enabled.hydratePriorFromRun === true}`
      );
      lines.push(
        `  - scope: requestedStart='${scope.requestedStartBoundary ?? ""}', effectiveStart='${scope.effectiveStartBoundary ?? ""}', selectedAgent='${scope.selectedAgent ?? ""}', broadBoundary=${scope.isBroadScopeBoundary === true}`
      );
      if (scope.autoExpandedTo) {
        lines.push(`  - scope: auto-expanded boundary to '${scope.autoExpandedTo}'`);
      }
      lines.push(
        `  - observed: escalation=${observed.escalationStage ?? "none"}, majorReworkSelected=${observed.majorReworkSelected === true}, cachedFix=${observed.usedCachedFix === true}, promptRetries=${Number(observed.promptRetryCount ?? 0)}, historicalFailures=${Number(observed.historicalFailureCount ?? 0)}, oscillationDetected=${observed.oscillationDetected === true}`
      );
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function sanitize(text) {
  return String(text).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function reconstructUnchangedCount(entries) {
  if (!entries.length) {
    return 0;
  }
  let unchanged = 0;
  for (let i = 1; i < entries.length; i += 1) {
    const prevClass = entries[i - 1]?.outputSignature?.class;
    const currClass = entries[i]?.outputSignature?.class;
    if (prevClass && currClass && prevClass === currClass) {
      unchanged += 1;
    } else {
      unchanged = 0;
    }
  }
  return unchanged;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
