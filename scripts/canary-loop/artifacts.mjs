import fs from "fs/promises";
import path from "path";
import { parseAgentCode } from "./config.mjs";

export async function resolveArtifacts({
  workspaceRoot,
  runId,
  agentCode,
  startChapter,
  allowMissingAgentRecords = false,
}) {
  const promptsRoot = path.join(workspaceRoot, "documentation", "prompts", "actual");
  const runFolder = await resolveRunFolder(promptsRoot, runId);
  if (!runFolder) {
    throw new Error(`Unable to resolve run folder for runId '${runId}'.`);
  }

  const runStatePath = path.join(runFolder, ".actual-run-state.json");
  const runState = await readJsonIfPresent(runStatePath);
  if (!runState) {
    throw new Error(`Run folder is missing .actual-run-state.json: ${runFolder}`);
  }

  const records = Array.isArray(runState.records) ? runState.records : [];
  const matchingRecords = records
    .filter((record) => parseAgentCode(record.agent) === agentCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  const agentRequests = [];
  const agentResponses = [];
  let missingRequestCount = 0;
  let missingResponseCount = 0;
  let emptyResponseBodyCount = 0;

  for (const record of matchingRecords) {
    const requestFile = normalizeRecordFile(record.requestFile);
    const responseFile = normalizeRecordFile(record.responseFile);

    if (requestFile) {
      const requestPath = path.join(runFolder, requestFile);
      if (await exists(requestPath)) {
        agentRequests.push(requestPath);
      } else {
        missingRequestCount += 1;
      }
    } else {
      missingRequestCount += 1;
    }

    if (responseFile) {
      const responsePath = path.join(runFolder, responseFile);
      if (await exists(responsePath)) {
        agentResponses.push(responsePath);
        const body = await fs.readFile(responsePath, "utf8");
        if (!body.trim()) {
          emptyResponseBodyCount += 1;
        }
      } else {
        missingResponseCount += 1;
      }
    } else {
      missingResponseCount += 1;
    }
  }

  if (matchingRecords.length === 0 && !allowMissingAgentRecords) {
    throw new Error(
      `No records found in ${path.basename(runFolder)} for agent code '${agentCode}'.`
    );
  }

  const resolvedRunId = runState.runId ?? runId;
  const runReportPath = await resolveRunReportPath(workspaceRoot, runState.projectId, resolvedRunId);
  const runReport = await readJsonIfPresent(runReportPath);

  const chapterCount = deriveChapterCount({ runReport, agentResponses });
  if (agentCode === "9" && Number.isInteger(startChapter) && chapterCount && startChapter > chapterCount) {
    throw new Error(
      `Invalid --startChapter ${startChapter}. Resolved chapter count is ${chapterCount}.`
    );
  }

  const logs = await gatherScopedLogs(workspaceRoot, runFolder, resolvedRunId);

  return {
    runId: resolvedRunId,
    projectId: runState.projectId,
    runFolder,
    runReportPath: runReportPath ?? undefined,
    runReport: runReport ?? undefined,
    runStatePath,
    runState,
    chapterCount: chapterCount ?? undefined,
    chapterWindow:
      agentCode === "9" && Number.isInteger(startChapter)
        ? { start: startChapter, end: chapterCount ?? startChapter }
        : undefined,
    agentRequests,
    agentResponses,
    logs,
    integrity: {
      missingRequestCount,
      missingResponseCount,
      emptyResponseBodyCount,
    },
  };
}

async function resolveRunFolder(promptsRoot, runId) {
  if (!(await exists(promptsRoot))) {
    return null;
  }

  const children = await fs.readdir(promptsRoot, { withFileTypes: true });
  const runDirs = children
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("run_"))
    .map((entry) => path.join(promptsRoot, entry.name))
    .sort();

  if (runDirs.length === 0) {
    return null;
  }

  if (runId === "latest") {
    return runDirs[runDirs.length - 1];
  }

  for (const dir of runDirs) {
    if (path.basename(dir) === runId || path.basename(dir).includes(runId)) {
      return dir;
    }
  }

  for (const dir of runDirs) {
    const state = await readJsonIfPresent(path.join(dir, ".actual-run-state.json"));
    if (!state) {
      continue;
    }
    if (state.runId === runId) {
      return dir;
    }
  }

  return null;
}

async function resolveRunReportPath(workspaceRoot, projectId, runId) {
  const reportsRoot = path.join(workspaceRoot, "apps", "api", "data", "reports");
  if (!(await exists(reportsRoot))) {
    return null;
  }

  if (projectId && runId) {
    const direct = path.join(reportsRoot, projectId, `${runId}.json`);
    if (await exists(direct)) {
      return direct;
    }
  }

  const projectFolders = await fs.readdir(reportsRoot, { withFileTypes: true });
  for (const entry of projectFolders) {
    if (!entry.isDirectory()) {
      continue;
    }
    const folder = path.join(reportsRoot, entry.name);
    const files = await fs.readdir(folder, { withFileTypes: true });
    for (const fileEntry of files) {
      if (!fileEntry.isFile() || !fileEntry.name.endsWith(".json")) {
        continue;
      }
      if (runId && !fileEntry.name.includes(runId)) {
        continue;
      }
      const filePath = path.join(folder, fileEntry.name);
      const report = await readJsonIfPresent(filePath);
      if (!report) {
        continue;
      }
      const reportRunId = report.run_id ?? report.runId;
      if (reportRunId === runId) {
        return filePath;
      }
    }
  }

  return null;
}

function deriveChapterCount({ runReport, agentResponses }) {
  if (runReport && Number.isInteger(runReport.chapter_count) && runReport.chapter_count > 0) {
    return runReport.chapter_count;
  }

  let maxChapter = 0;
  for (const responsePath of agentResponses) {
    const basename = path.basename(responsePath);
    const match = basename.match(/chapter[_-]?(\d+)/i);
    if (match) {
      const chapter = Number.parseInt(match[1], 10);
      if (Number.isFinite(chapter)) {
        maxChapter = Math.max(maxChapter, chapter);
      }
    }
  }
  return maxChapter > 0 ? maxChapter : null;
}

async function gatherScopedLogs(workspaceRoot, runFolder, runId) {
  const collected = [];
  const runLog = path.join(runFolder, "run.log");
  if (await exists(runLog)) {
    collected.push(runLog);
  }

  const activityLog = path.join(workspaceRoot, "logs", "activity.jsonl");
  if (await exists(activityLog)) {
    collected.push(activityLog);
  }

  if (runId) {
    const runLocalLog = path.join(workspaceRoot, "logs", `${runId}.log`);
    if (await exists(runLocalLog)) {
      collected.push(runLocalLog);
    }
  }

  return collected;
}

function normalizeRecordFile(fileName) {
  if (!fileName || typeof fileName !== "string") {
    return null;
  }
  const trimmed = fileName.trim();
  return trimmed ? trimmed : null;
}

async function readJsonIfPresent(filePath) {
  if (!filePath || !(await exists(filePath))) {
    return null;
  }
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
