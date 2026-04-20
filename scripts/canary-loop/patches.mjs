import fs from "fs/promises";
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

export async function acquireRunLock({ workspaceRoot, runId, agent }) {
  const lockDir = path.join(workspaceRoot, "logs", "canary-loops", ".locks");
  await fs.mkdir(lockDir, { recursive: true });
  const lockPath = path.join(lockDir, `${sanitize(runId)}-${sanitize(agent)}.lock`);
  try {
    const handle = await fs.open(lockPath, "wx");
    await handle.writeFile(`${new Date().toISOString()}\n`);
    return { lockPath, handle };
  } catch {
    throw new Error(`Canary loop lock already exists: ${lockPath}`);
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
  });

  return {
    changedFiles,
    changeDetails,
    majorReworkPacket,
    majorReworkBriefPath,
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
}) {
  const fileCap = Number.isInteger(overrideFileCap) && overrideFileCap > 0
    ? overrideFileCap
    : MAX_FILES_PER_ITERATION;

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
    if (!matchesAny(relativePath, effectiveAllow)) {
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
