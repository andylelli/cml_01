import fs from "fs/promises";
import path from "path";
import { parseJsonText } from "./json.mjs";

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
      featureSnapshot: entry?.featureSnapshot ?? null,
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
      manifest = parseJsonText(await fs.readFile(manifestPath, "utf8"));
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
  const featureNarrative = buildFeatureNarrative(entries);

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
    featureNarrative,
  };
}

function buildFeatureNarrative(entries) {
  const all = Array.isArray(entries) ? entries : [];
  const snapshots = all
    .map((entry) => entry?.featureSnapshot)
    .filter(Boolean);
  if (!snapshots.length) {
    return {
      available: false,
      enabled: {},
      scope: {},
      observed: {},
      narrative: [
        "Feature narrative unavailable for this run because entries predate feature-snapshot instrumentation.",
      ],
    };
  }

  const first = snapshots[0] ?? {};
  const firstEnabled = first.enabled ?? {};
  const firstScope = first.scope ?? {};

  const majorReworkIterations = all.filter((entry) =>
    (entry?.selectedPlaybooks ?? []).some((id) => String(id).startsWith("pb.rework."))
  ).length;
  const escalationCounts = countBy(
    snapshots
      .map((snapshot) => String(snapshot?.observed?.escalationStage ?? "none"))
      .filter(Boolean)
  );
  const cacheHitIterations = snapshots.filter((snapshot) => snapshot?.observed?.usedCachedFix === true).length;
  const oscillationSignalIterations = snapshots.filter(
    (snapshot) => snapshot?.observed?.oscillationDetected === true
  ).length;
  const historicalIntelIterations = snapshots.filter((snapshot) => {
    const observed = snapshot?.observed ?? {};
    return Number(observed.historicalFailureCount ?? 0) > 0 || Number(observed.priorRunFailedPlaybooksCount ?? 0) > 0;
  }).length;
  const rollbackIterations = all.filter((entry) =>
    (entry?.plannedActions ?? []).some((action) => /^Rolled back\s+\d+/i.test(String(action)))
  ).length;
  const partialRollbackIterations = all.filter((entry) =>
    (entry?.plannedActions ?? []).some((action) => /partial-win/i.test(String(action)))
  ).length;
  const autoExpandedTo = String(firstScope.autoExpandedTo ?? "").trim();

  return {
    available: true,
    enabled: {
      hydratePriorFromRun: firstEnabled.hydratePriorFromRun === true,
      rollbackFailedChanges: firstEnabled.rollbackFailedChanges === true,
      partialRollbackEnabled: firstEnabled.partialRollbackEnabled === true,
      autoExpandUpstreamScope: firstEnabled.autoExpandUpstreamScope === true,
      enableMajorRework: firstEnabled.enableMajorRework !== false,
    },
    scope: {
      selectedAgent: String(firstScope.selectedAgent ?? ""),
      requestedStartBoundary: String(firstScope.requestedStartBoundary ?? ""),
      effectiveStartBoundary: String(firstScope.effectiveStartBoundary ?? ""),
      isBroadScopeBoundary: firstScope.isBroadScopeBoundary === true,
      autoExpandedBoundary: autoExpandedTo || null,
    },
    observed: {
      majorReworkIterations,
      rollbackIterations,
      partialRollbackIterations,
      cacheHitIterations,
      oscillationSignalIterations,
      historicalIntelIterations,
      escalationCounts,
    },
    narrative: buildFeatureNarrativeLines({
      enabled: {
        hydratePriorFromRun: firstEnabled.hydratePriorFromRun === true,
        rollbackFailedChanges: firstEnabled.rollbackFailedChanges === true,
        partialRollbackEnabled: firstEnabled.partialRollbackEnabled === true,
        autoExpandUpstreamScope: firstEnabled.autoExpandUpstreamScope === true,
        enableMajorRework: firstEnabled.enableMajorRework !== false,
      },
      scope: {
        selectedAgent: String(firstScope.selectedAgent ?? ""),
        requestedStartBoundary: String(firstScope.requestedStartBoundary ?? ""),
        effectiveStartBoundary: String(firstScope.effectiveStartBoundary ?? ""),
        isBroadScopeBoundary: firstScope.isBroadScopeBoundary === true,
        autoExpandedBoundary: autoExpandedTo || null,
      },
      observed: {
        majorReworkIterations,
        rollbackIterations,
        partialRollbackIterations,
        cacheHitIterations,
        oscillationSignalIterations,
        historicalIntelIterations,
      },
    }),
  };
}

function buildFeatureNarrativeLines({ enabled, scope, observed }) {
  const lines = [];
  lines.push(
    `Deep changes (major rework): ${enabled.enableMajorRework ? "enabled" : "disabled"}; selected in ${observed.majorReworkIterations} iteration(s).`
  );
  lines.push(
    `Scope boundary: requested='${scope.requestedStartBoundary || "n/a"}', effective='${scope.effectiveStartBoundary || "n/a"}', selected='${scope.selectedAgent || "n/a"}', broad-scope boundary=${scope.isBroadScopeBoundary}.`
  );
  if (scope.autoExpandedBoundary) {
    lines.push(`Auto-expand upstream scope: enabled and applied to '${scope.autoExpandedBoundary}'.`);
  } else {
    lines.push(
      `Auto-expand upstream scope: ${enabled.autoExpandUpstreamScope ? "enabled but not triggered" : "disabled"}.`
    );
  }
  lines.push(
    `Rollback behavior: rollback=${enabled.rollbackFailedChanges}, partialRollback=${enabled.partialRollbackEnabled}, rollback events=${observed.rollbackIterations}, partial-win keep events=${observed.partialRollbackIterations}.`
  );
  lines.push(
    `Historical intelligence: used in ${observed.historicalIntelIterations} iteration(s); cache hits in ${observed.cacheHitIterations} iteration(s); oscillation signals in ${observed.oscillationSignalIterations} iteration(s).`
  );
  lines.push(
    `Hydration mode: prior-run hydration is ${enabled.hydratePriorFromRun ? "enabled" : "disabled"}.`
  );
  return lines;
}

async function buildGlobalSummary(workspaceRoot) {
  const dir = path.join(workspaceRoot, "logs", "canary-loops");
  const summaryFiles = await findSummaryFilesRecursively(dir);

  const summaries = [];
  for (const filePath of summaryFiles) {
    try {
      const payload = parseJsonText(await fs.readFile(filePath, "utf8"));
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

  lines.push("", "## Feature Narrative", "");
  const featureLines = summary.featureNarrative?.narrative ?? [];
  if (!featureLines.length) {
    lines.push("- Feature narrative unavailable for this run (older ledger format).", "");
  } else {
    for (const line of featureLines) {
      lines.push(`- ${line}`);
    }
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

    const snapshot = attempt.featureSnapshot ?? null;
    if (snapshot) {
      const enabled = snapshot.enabled ?? {};
      const observed = snapshot.observed ?? {};
      const scope = snapshot.scope ?? {};
      lines.push(
        `- feature summary: escalation='${observed.escalationStage ?? "none"}', majorReworkSelected=${observed.majorReworkSelected === true}, cachedFix=${observed.usedCachedFix === true}, promptRetries=${Number(observed.promptRetryCount ?? 0)}, historicalFailures=${Number(observed.historicalFailureCount ?? 0)}`
      );
      lines.push(
        `- feature flags: majorRework=${enabled.enableMajorRework === true}, partialRollback=${enabled.partialRollbackEnabled === true}, autoExpand=${enabled.autoExpandUpstreamScope === true}, rollback=${enabled.rollbackFailedChanges === true}`
      );
      lines.push(
        `- feature scope: requested='${scope.requestedStartBoundary ?? ""}', effective='${scope.effectiveStartBoundary ?? ""}', selected='${scope.selectedAgent ?? ""}'`
      );
      if (scope.autoExpandedTo) {
        lines.push(`- feature scope: auto-expanded to '${scope.autoExpandedTo}'`);
      }
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
