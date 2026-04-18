import fs from "fs/promises";
import path from "path";
import {
  GENERATED_ARTIFACT_DENY_GLOBS,
  MAX_FILES_PER_ITERATION,
  SHARED_FILE_CONFIRM_GLOBS,
} from "./config.mjs";

const DEFAULT_ALLOW_GLOBS = [
  "scripts/**",
  "packages/**",
  "apps/**",
  "documentation/analysis/canary-loops/**",
];

export async function acquireRunLock({ workspaceRoot, runId, agent }) {
  const lockDir = path.join(workspaceRoot, "documentation", "analysis", "canary-loops", ".locks");
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
}) {
  const patchFilePath = path.join(
    workspaceRoot,
    "documentation",
    "analysis",
    "canary-loops",
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

  const changedFiles = await writeIfChanged(patchFilePath, `${JSON.stringify(payload, null, 2)}\n`);
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
    notes: changedFiles.length
      ? ["Applied deterministic patch-staging payload."]
      : ["No-op patch: generated payload already up to date."],
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
  return [filePath];
}

function sanitize(text) {
  return String(text).replace(/[^a-zA-Z0-9_-]/g, "_");
}
