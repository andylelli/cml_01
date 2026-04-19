import fs from "fs/promises";
import path from "path";

const RUN_SUMMARY_PREFIX = "canary-run-summary";
const ATTEMPT_HISTORY_PREFIX = "canary-attempt-history";
const DASHBOARD_SUMMARY_PREFIX = "canary-dashboard-summary";

export async function updateTelemetryRollups({ ledger }) {
  if (!ledger?.workspaceRoot || !ledger?.jsonlPath) {
    return;
  }

  const runSummary = buildRunSummary(ledger);
  const outDir = ledger.outputDir ?? path.dirname(ledger.jsonlPath);
  const ledgerBaseName = path.basename(ledger.jsonlPath, ".jsonl");
  const runSummaryBaseName = ledgerBaseName.startsWith("canary-ledger-")
    ? ledgerBaseName.replace(/^canary-ledger-/, `${RUN_SUMMARY_PREFIX}-`)
    : `${RUN_SUMMARY_PREFIX}-${ledgerBaseName}`;
  await fs.writeFile(
    path.join(outDir, `${runSummaryBaseName}.json`),
    `${JSON.stringify(runSummary, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(outDir, `${runSummaryBaseName}.md`),
    renderRunSummaryMarkdown(runSummary),
    "utf8"
  );

  const attemptHistory = await buildAttemptHistory(ledger);
  await fs.writeFile(
    path.join(outDir, `${ATTEMPT_HISTORY_PREFIX}.json`),
    `${JSON.stringify(attemptHistory, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(outDir, `${ATTEMPT_HISTORY_PREFIX}.md`),
    renderAttemptHistoryMarkdown(attemptHistory),
    "utf8"
  );

  const globalSummary = await buildGlobalSummary(ledger.workspaceRoot);
  await fs.writeFile(
    path.join(outDir, `${DASHBOARD_SUMMARY_PREFIX}.json`),
    `${JSON.stringify(globalSummary, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(outDir, `${DASHBOARD_SUMMARY_PREFIX}.md`),
    renderGlobalSummaryMarkdown(globalSummary),
    "utf8"
  );
}

async function buildAttemptHistory(ledger) {
  const outDir = ledger.outputDir ?? path.dirname(ledger.jsonlPath);
  const entries = Array.isArray(ledger.entries) ? ledger.entries : [];
  const patchStaging = await readPatchStagingArtifacts(outDir);
  const rollbackArtifacts = await readRollbackArtifacts(outDir);

  const attempts = entries.map((entry) => {
    const iteration = Number(entry?.iteration ?? 0);
    const outputClass = entry?.outputSignature?.class ?? null;
    const inputClass = entry?.inputSignature?.class ?? null;

    return {
      iteration,
      timestamp: entry?.timestamp ?? null,
      decision: entry?.decision ?? "unknown",
      stopReason: entry?.stopReason ?? null,
      inputSignatureClass: inputClass,
      outputSignatureClass: outputClass,
      changedFiles: Array.isArray(entry?.changedFiles) ? entry.changedFiles : [],
      selectedPlaybooks: Array.isArray(entry?.selectedPlaybooks) ? entry.selectedPlaybooks : [],
      patchStagingFiles: patchStaging
        .filter((item) => item.iteration === iteration)
        .map((item) => item.path),
      rollback: rollbackArtifacts[String(iteration)] ?? null,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    outputDir: outDir,
    ledger: {
      jsonlPath: ledger.jsonlPath,
      mdPath: ledger.mdPath,
    },
    stats: {
      attempts: attempts.length,
      withChangedFiles: attempts.filter((item) => item.changedFiles.length > 0).length,
      withRollbackSnapshots: attempts.filter((item) => item.rollback !== null).length,
      patchStagingFileCount: patchStaging.length,
    },
    attempts,
  };
}

async function readPatchStagingArtifacts(outDir) {
  const patchDir = path.join(outDir, "patch-staging");
  let entries = [];
  try {
    entries = await fs.readdir(patchDir, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      const iteration = extractIterationFromName(entry.name);
      return {
        path: path.join(patchDir, entry.name),
        iteration,
      };
    })
    .filter((item) => Number.isInteger(item.iteration));
}

async function readRollbackArtifacts(outDir) {
  const failedChangesDir = path.join(outDir, "failed-changes");
  let iterationDirs = [];
  try {
    iterationDirs = await fs.readdir(failedChangesDir, { withFileTypes: true });
  } catch {
    return {};
  }

  const byIteration = {};
  for (const dirEntry of iterationDirs) {
    if (!dirEntry.isDirectory()) {
      continue;
    }
    const iteration = extractIterationFromName(dirEntry.name);
    if (!Number.isInteger(iteration)) {
      continue;
    }

    const artifactDir = path.join(failedChangesDir, dirEntry.name);
    const manifestPath = path.join(artifactDir, "manifest.json");
    let manifest = null;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    } catch {
      manifest = null;
    }

    byIteration[String(iteration)] = {
      path: artifactDir,
      manifestPath,
      restoredFiles: Array.isArray(manifest?.files)
        ? manifest.files.map((item) => ({
            path: item.path,
            action: item.action,
          }))
        : [],
      reason: manifest?.reason ?? null,
      archivedAt: manifest?.archivedAt ?? null,
    };
  }

  return byIteration;
}

function extractIterationFromName(name) {
  const match = String(name).match(/iter(\d+)/i);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

function buildRunSummary(ledger) {
  const entries = ledger.entries ?? [];
  const statusCounts = countBy(entries.map((entry) => entry.decision ?? "unknown"));
  const stopReasonCounts = countBy(
    entries
      .map((entry) => entry.stopReason)
      .filter((value) => typeof value === "string" && value.trim().length > 0)
  );
  const signatureCounts = countBy(
    entries
      .map((entry) => entry.inputSignature?.class)
      .filter((value) => typeof value === "string" && value.trim().length > 0)
  );
  const deterministicFallbackCount = entries.reduce(
    (sum, entry) => sum + (entry.deterministicFallbackExceptions?.length ?? 0),
    0
  );
  const warningTotal = entries.reduce((sum, entry) => sum + Number(entry.canary?.warningsCount ?? 0), 0);
  const noOpIterationCount = entries.filter(
    (entry) => Array.isArray(entry.changedFiles) && entry.changedFiles.length === 0
  ).length;
  const resumeFingerprintMismatchCount = entries.filter((entry) =>
    String(entry.stopReason ?? "").includes("fingerprint mismatch")
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    ledger: {
      jsonlPath: ledger.jsonlPath,
      mdPath: ledger.mdPath,
    },
    totals: {
      iterations: entries.length,
      warningTotal,
      deterministicFallbackCount,
      noOpIterationCount,
      resumeFingerprintMismatchCount,
    },
    statusCounts,
    stopReasonCounts,
    signatureCounts,
  };
}

async function buildGlobalSummary(workspaceRoot) {
  const dir = path.join(workspaceRoot, "logs", "canary-loops");
  const summaryFiles = await findSummaryFilesRecursively(dir);

  const summaries = [];
  for (const filePath of summaryFiles) {
    try {
      const payload = JSON.parse(await fs.readFile(filePath, "utf8"));
      summaries.push(payload);
    } catch {
      // Skip malformed summary payloads.
    }
  }

  const totalIterations = summaries.reduce((sum, item) => sum + Number(item.totals?.iterations ?? 0), 0);
  const totalWarnings = summaries.reduce((sum, item) => sum + Number(item.totals?.warningTotal ?? 0), 0);
  const deterministicFallbackCount = summaries.reduce(
    (sum, item) => sum + Number(item.totals?.deterministicFallbackCount ?? 0),
    0
  );

  return {
    generatedAt: new Date().toISOString(),
    runCount: summaries.length,
    totalIterations,
    totalWarnings,
    deterministicFallbackCount,
  };
}

async function findSummaryFilesRecursively(rootDir) {
  let children = [];
  try {
    children = await fs.readdir(rootDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of children) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      const nested = await findSummaryFilesRecursively(absolutePath);
      files.push(...nested);
      continue;
    }
    if (
      entry.isFile()
      && (
        entry.name.endsWith(".summary.json")
        || /^canary-run-summary-.*\.json$/i.test(entry.name)
      )
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

function countBy(values) {
  const out = {};
  for (const value of values) {
    out[value] = (out[value] ?? 0) + 1;
  }
  return out;
}

function renderRunSummaryMarkdown(summary) {
  const lines = [
    "# Canary Loop Run Summary",
    "",
    `- generatedAt: \`${summary.generatedAt}\``,
    `- iterations: \`${summary.totals.iterations}\``,
    `- warningTotal: \`${summary.totals.warningTotal}\``,
    `- deterministicFallbackCount: \`${summary.totals.deterministicFallbackCount}\``,
    `- noOpIterationCount: \`${summary.totals.noOpIterationCount}\``,
    "",
    "## Status Counts",
    "",
  ];

  for (const [key, value] of Object.entries(summary.statusCounts)) {
    lines.push(`- ${key}: ${value}`);
  }

  lines.push("", "## Top Stop Reasons", "");
  for (const [key, value] of Object.entries(summary.stopReasonCounts)) {
    lines.push(`- ${key}: ${value}`);
  }

  return `${lines.join("\n")}\n`;
}

function renderGlobalSummaryMarkdown(summary) {
  const lines = [
    "# Canary Loop Dashboard",
    "",
    `- generatedAt: \`${summary.generatedAt}\``,
    `- runCount: \`${summary.runCount}\``,
    `- totalIterations: \`${summary.totalIterations}\``,
    `- totalWarnings: \`${summary.totalWarnings}\``,
    `- deterministicFallbackCount: \`${summary.deterministicFallbackCount}\``,
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function renderAttemptHistoryMarkdown(history) {
  const lines = [
    "# Attempt History",
    "",
    `- generatedAt: \`${history.generatedAt}\``,
    `- attempts: \`${history.stats.attempts}\``,
    `- attempts with changed files: \`${history.stats.withChangedFiles}\``,
    `- attempts with rollback snapshots: \`${history.stats.withRollbackSnapshots}\``,
    `- patch staging files: \`${history.stats.patchStagingFileCount}\``,
    "",
  ];

  if (!history.attempts.length) {
    lines.push("No attempts recorded.", "");
    return `${lines.join("\n")}\n`;
  }

  for (const attempt of history.attempts) {
    lines.push(`## Iteration ${attempt.iteration}`);
    lines.push(`- timestamp: \`${attempt.timestamp ?? "unknown"}\``);
    lines.push(`- decision: \`${attempt.decision}\``);
    if (attempt.stopReason) {
      lines.push(`- stop reason: ${attempt.stopReason}`);
    }
    lines.push(`- input signature: \`${attempt.inputSignatureClass ?? "none"}\``);
    lines.push(`- output signature: \`${attempt.outputSignatureClass ?? "none"}\``);

    if (attempt.selectedPlaybooks.length) {
      lines.push(`- playbooks: ${attempt.selectedPlaybooks.join(", ")}`);
    }

    if (attempt.changedFiles.length) {
      lines.push("- changed files:");
      for (const filePath of attempt.changedFiles) {
        lines.push(`  - ${filePath}`);
      }
    }

    if (attempt.patchStagingFiles.length) {
      lines.push("- patch staging payloads:");
      for (const filePath of attempt.patchStagingFiles) {
        lines.push(`  - ${filePath}`);
      }
    }

    if (attempt.rollback) {
      lines.push(`- rollback snapshots: \`${attempt.rollback.path}\``);
      if (attempt.rollback.reason) {
        lines.push(`- rollback reason: ${attempt.rollback.reason}`);
      }
      if (attempt.rollback.restoredFiles.length) {
        lines.push("- restored files:");
        for (const restored of attempt.rollback.restoredFiles) {
          lines.push(`  - ${restored.path} (${restored.action})`);
        }
      }
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
