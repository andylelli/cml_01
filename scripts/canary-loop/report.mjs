import fs from "fs/promises";
import path from "path";

export async function updateTelemetryRollups({ ledger }) {
  if (!ledger?.workspaceRoot || !ledger?.jsonlPath) {
    return;
  }

  const runSummary = buildRunSummary(ledger);
  const runSummaryBase = ledger.jsonlPath.replace(/\.jsonl$/i, ".summary");
  await fs.writeFile(`${runSummaryBase}.json`, `${JSON.stringify(runSummary, null, 2)}\n`, "utf8");
  await fs.writeFile(`${runSummaryBase}.md`, renderRunSummaryMarkdown(runSummary), "utf8");

  const globalSummary = await buildGlobalSummary(ledger.workspaceRoot);
  const outDir = path.join(ledger.workspaceRoot, "documentation", "analysis", "canary-loops");
  await fs.writeFile(path.join(outDir, "SUMMARY.json"), `${JSON.stringify(globalSummary, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(outDir, "SUMMARY.md"), renderGlobalSummaryMarkdown(globalSummary), "utf8");
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
  const dir = path.join(workspaceRoot, "documentation", "analysis", "canary-loops");
  const children = await fs.readdir(dir, { withFileTypes: true });
  const summaryFiles = children
    .filter((entry) => entry.isFile() && entry.name.endsWith(".summary.json"))
    .map((entry) => path.join(dir, entry.name));

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
