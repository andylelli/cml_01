import fs from "fs/promises";
import os from "os";
import path from "path";
import {
  GENERATED_ARTIFACT_DENY_GLOBS,
  MAX_FILES_PER_ITERATION,
  SHARED_FILE_CONFIRM_GLOBS,
} from "./config.mjs";
import {
  buildMajorReworkPacket,
  hasMajorReworkPlaybook,
  renderMajorReworkBrief,
} from "./rework.mjs";

const DEFAULT_ALLOW_GLOBS = [
  "scripts/**",
  "packages/**",
  "apps/**",
  "logs/canary-loops/**",
];
const STALE_LOCK_MAX_AGE_MS = 30 * 60 * 1000;

export async function acquireRunLock({ workspaceRoot, runId, agent }) {
  const lockDir = path.join(workspaceRoot, "logs", "canary-loops", ".locks");
  await fs.mkdir(lockDir, { recursive: true });
  const lockPath = path.join(lockDir, `${sanitize(runId)}-${sanitize(agent)}.lock`);

  const writeFreshLock = async () => {
    const handle = await fs.open(lockPath, "wx");
    await handle.writeFile(
      `${JSON.stringify({
        createdAt: new Date().toISOString(),
        pid: process.pid,
        hostname: os.hostname(),
      })}\n`
    );
    return { lockPath, handle };
  };

  try {
    return await writeFreshLock();
  } catch (error) {
    if (error?.code !== "EEXIST") {
      throw error;
    }

    const stale = await isStaleLock(lockPath);
    if (!stale.stale) {
      const detail = stale.reason ? ` (${stale.reason})` : "";
      throw new Error(`Canary loop lock already exists: ${lockPath}${detail}`);
    }

    try {
      await fs.unlink(lockPath);
    } catch (unlinkError) {
      if (unlinkError?.code !== "ENOENT") {
        throw new Error(`Canary loop lock already exists: ${lockPath} (stale cleanup failed)`);
      }
    }

    return await writeFreshLock();
  }
}

export async function releaseRunLock(lock) {
  if (!lock) {
    return;
  }
  try {
    await lock.handle?.close();
  } catch {
    // Ignore close errors for lock cleanup.
  }
  try {
    await fs.unlink(lock.lockPath);
  } catch {
    // Ignore unlink errors for lock cleanup.
  }
}

async function isStaleLock(lockPath) {
  let stats;
  try {
    stats = await fs.stat(lockPath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { stale: true, reason: "lock_missing" };
    }
    return { stale: false, reason: "lock_stat_failed" };
  }

  const ageMs = Date.now() - Number(stats.mtimeMs ?? Date.now());
  if (ageMs > STALE_LOCK_MAX_AGE_MS) {
    return { stale: true, reason: `expired_${Math.floor(ageMs / 1000)}s` };
  }

  const metadata = await readLockMetadata(lockPath);
  if (!Number.isInteger(metadata?.pid) || metadata.pid <= 0) {
    return { stale: false, reason: "missing_pid_recent" };
  }

  if (!(await isProcessRunning(metadata.pid))) {
    return { stale: true, reason: `dead_pid_${metadata.pid}` };
  }

  return { stale: false, reason: `active_pid_${metadata.pid}` };
}

async function readLockMetadata(lockPath) {
  try {
    const raw = await fs.readFile(lockPath, "utf8");
    const line = String(raw ?? "").split(/\r?\n/, 1)[0].trim();
    if (!line) {
      return null;
    }

    if (line.startsWith("{")) {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
      return null;
    }

    // Backward compatibility for historical lock format containing only timestamp.
    return {
      createdAt: line,
    };
  } catch {
    return null;
  }
}

async function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

export async function applyPlaybookPatch({
  workspaceRoot,
  outputDir,
  request,
  normalizedAgent,
  signature,
  rootCause,
  selectedPlaybooks,
  retryFeedbackPacket,
  iteration,
  sessionId,
  chapterWindow,
  hydration,
  reworkContext,
  wavePlan,
}) {
  const runOutputDir =
    outputDir ??
    path.join(workspaceRoot, "logs", "canary-loops");
  const patchFilePath = path.join(
    runOutputDir,
    "patch-staging",
    `${sanitize(request.runId)}-${sanitize(normalizedAgent.canonicalAgent)}-${sanitize(
      sessionId
    )}-iter${iteration}.json`
  );

  const payload = {
    runId: request.runId,
    agent: normalizedAgent.canonicalAgent,
    iteration,
    signatureClass: signature.class,
    rootCauseLayer: rootCause.sourceLayer,
    selectedPlaybooks,
    retryFeedbackPacket,
    startFromAgent: request.startFromAgent ?? request.agent,
    hydratePriorFromRun: request.hydratePriorFromRun,
    hydration,
    chapterStart: chapterWindow?.start,
    fromChapter: chapterWindow?.start,
    chapterWindow,
    wavePlan,
  };

  const changeDetails = [];
  let majorReworkPacket = null;
  let majorReworkBriefPath = null;
  if (hasMajorReworkPlaybook(selectedPlaybooks)) {
    majorReworkPacket = buildMajorReworkPacket({
      agent: normalizedAgent.canonicalAgent,
      agentScope: reworkContext,
      signature,
      rootCause,
      retryFeedbackPacket,
      selectedPlaybooks,
      iteration,
    });
    payload.majorReworkPacket = majorReworkPacket;

    majorReworkBriefPath = path.join(
      runOutputDir,
      "rework-lab",
      `${sanitize(request.runId)}-${sanitize(normalizedAgent.canonicalAgent)}-${sanitize(sessionId)}-iter${iteration}.md`
    );
    changeDetails.push(
      ...(await writeIfChanged(majorReworkBriefPath, renderMajorReworkBrief(majorReworkPacket)))
    );
  }

  changeDetails.push(
    ...(await writeIfChanged(patchFilePath, `${JSON.stringify(payload, null, 2)}\n`))
  );
  const changedFiles = changeDetails.map((change) => change.filePath);
  const effectiveAllow = request.allowFiles?.length ? request.allowFiles : DEFAULT_ALLOW_GLOBS;
  const effectiveDeny = [...GENERATED_ARTIFACT_DENY_GLOBS, ...(request.denyFiles ?? [])];

  validatePatchScope({
    workspaceRoot,
    changedFiles,
    effectiveAllow,
    effectiveDeny,
    overrideFileCap: request.overrideFileCap,
    confirmSharedEdits: request.confirmSharedEdits,
    majorReworkMode: hasMajorReworkPlaybook(selectedPlaybooks),
    rollbackGuaranteed: request.rollbackFailedChanges === true,
    defaultFileCap: Number(request.majorReworkConfig?.maxFilesPerWave ?? MAX_FILES_PER_ITERATION),
  });

  return {
    changedFiles,
    changeDetails,
    majorReworkPacket,
    majorReworkBriefPath,
    wavePlan,
    notes: changedFiles.length
      ? [
          "Applied deterministic patch-staging payload.",
          ...(hasMajorReworkPlaybook(selectedPlaybooks)
            ? ["Generated major-rework research brief and packet for this iteration."]
            : []),
        ]
      : ["No-op patch: generated payload already up to date."],
  };
}

export async function rollbackFailedImplementationChanges({
  workspaceRoot,
  outputDir,
  iteration,
  changeDetails,
  reason,
  keepFilePaths = [],
  rollbackMode = "whole",
  rollbackEvidence = [],
  waveId = null,
}) {
  const runOutputDir =
    outputDir ??
    path.join(workspaceRoot, "logs", "canary-loops");
  const keepSet = new Set(
    (keepFilePaths ?? []).map((filePath) => path.resolve(String(filePath)))
  );
  const implementationChanges = (changeDetails ?? []).filter((change) => {
    if (!change?.filePath) {
      return false;
    }
    if (keepSet.has(path.resolve(change.filePath))) {
      return false;
    }
    return !isPathInside(change.filePath, runOutputDir);
  });

  const keptFiles = (changeDetails ?? [])
    .filter((change) => change?.filePath && keepSet.has(path.resolve(change.filePath)))
    .map((change) => toPosix(path.relative(workspaceRoot, change.filePath)));

  if (implementationChanges.length === 0) {
    return {
      rolledBackCount: 0,
      archivedDir: null,
      restoredFiles: [],
      keptFiles,
    };
  }

  const archiveDir = path.join(
    runOutputDir,
    "failed-changes",
    `iter${String(iteration).padStart(2, "0")}`
  );
  const manifest = {
    archivedAt: new Date().toISOString(),
    reason: String(reason ?? "unresolved iteration result"),
    rollbackMode,
    rollbackEvidence,
    waveId,
    files: [],
    keptFiles,
  };

  for (const change of implementationChanges) {
    const filePath = change.filePath;
    const relativePath = toPosix(path.relative(workspaceRoot, filePath));
    const afterContent = await readTextIfExists(filePath);

    if (typeof change.previousContent === "string") {
      const beforePath = path.join(archiveDir, "before", relativePath);
      await fs.mkdir(path.dirname(beforePath), { recursive: true });
      await fs.writeFile(beforePath, change.previousContent, "utf8");
    }

    if (typeof afterContent === "string") {
      const afterPath = path.join(archiveDir, "after", relativePath);
      await fs.mkdir(path.dirname(afterPath), { recursive: true });
      await fs.writeFile(afterPath, afterContent, "utf8");
    }

    if (change.existedBefore) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, change.previousContent ?? "", "utf8");
      manifest.files.push({ path: relativePath, action: "restore_previous" });
    } else {
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore already-removed files.
      }
      manifest.files.push({ path: relativePath, action: "delete_new_file" });
    }
  }

  await fs.mkdir(archiveDir, { recursive: true });
  await fs.writeFile(path.join(archiveDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return {
    rolledBackCount: implementationChanges.length,
    archivedDir: archiveDir,
    restoredFiles: manifest.files.map((entry) => entry.path),
    keptFiles,
  };
}

function validatePatchScope({
  workspaceRoot,
  changedFiles,
  effectiveAllow,
  effectiveDeny,
  overrideFileCap,
  confirmSharedEdits,
  majorReworkMode,
  rollbackGuaranteed,
  defaultFileCap,
}) {
  const fileCap = Number.isInteger(overrideFileCap) && overrideFileCap > 0
    ? overrideFileCap
    : defaultFileCap;

  if (changedFiles.length > fileCap) {
    throw new Error(
      `Patch scope exceeded file cap (${changedFiles.length} > ${fileCap}).`
    );
  }

  for (const absolutePath of changedFiles) {
    const relativePath = toPosix(path.relative(workspaceRoot, absolutePath));
    if (matchesAny(relativePath, effectiveDeny)) {
      throw new Error(`Patch scope violation: '${relativePath}' matches deny glob.`);
    }
    if (!matchesAny(relativePath, effectiveAllow) && !(majorReworkMode && rollbackGuaranteed)) {
      throw new Error(`Patch scope violation: '${relativePath}' is outside allowlist.`);
    }
    if (matchesAny(relativePath, SHARED_FILE_CONFIRM_GLOBS) && !confirmSharedEdits) {
      throw new Error(
        `Shared-file edit requires explicit confirmation (--confirmSharedEdits=true): '${relativePath}'.`
      );
    }
  }
}

function matchesAny(filePath, globs) {
  return globs.some((glob) => globToRegex(glob).test(filePath));
}

function globToRegex(glob) {
  const normalized = toPosix(glob);
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const withDoubleStar = escaped.replace(/\*\*/g, "::DOUBLE_STAR::");
  const withStar = withDoubleStar.replace(/\*/g, "[^/]*");
  const regexText = withStar.replace(/::DOUBLE_STAR::/g, ".*");
  return new RegExp(`^${regexText}$`);
}

function toPosix(value) {
  return String(value).replace(/\\/g, "/");
}

async function writeIfChanged(filePath, nextContent) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let previous = null;
  try {
    previous = await fs.readFile(filePath, "utf8");
  } catch {
    previous = null;
  }

  if (previous === nextContent) {
    return [];
  }

  await fs.writeFile(filePath, nextContent, "utf8");
  return [
    {
      filePath,
      existedBefore: previous !== null,
      previousContent: previous,
    },
  ];
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function isPathInside(targetPath, parentPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sanitize(text) {
  return String(text).replace(/[^a-zA-Z0-9_-]/g, "_");
}
