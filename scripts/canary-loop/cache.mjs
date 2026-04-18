import fs from "fs/promises";
import path from "path";

const CACHE_FILE = "signature-fix-cache.json";
const MAX_CACHE_AGE_DAYS = 30;

export async function loadSignatureFixCache(workspaceRoot) {
  const cachePath = getCachePath(workspaceRoot);
  const payload = await readJsonIfPresent(cachePath);
  if (!payload || typeof payload !== "object") {
    return {
      cachePath,
      entries: {},
    };
  }
  return {
    cachePath,
    entries: payload.entries && typeof payload.entries === "object" ? payload.entries : {},
  };
}

export function getCachedFix({ cache, agent, signature, rootCause, policyContext }) {
  if (!cache || !agent || !signature || !rootCause) {
    return null;
  }
  if (signature.class === "unknown.pipeline_failure") {
    return null;
  }

  const key = buildCacheKey(agent, signature.class, rootCause.sourceLayer);
  const entry = cache.entries[key];
  if (!entry || !Array.isArray(entry.playbooks) || entry.playbooks.length === 0) {
    return null;
  }

  if (isExpired(entry.updatedAt)) {
    return null;
  }

  const hasCodePlaybook = entry.playbooks.some((id) => String(id).startsWith("pb.code."));
  if (hasCodePlaybook && !isCodePlaybookAllowed(policyContext)) {
    return null;
  }

  return {
    key,
    playbooks: entry.playbooks,
    reason: `cache-hit:${key}`,
  };
}

export async function noteFixOutcome({
  cache,
  workspaceRoot,
  agent,
  signature,
  rootCause,
  selectedPlaybooks,
  outcome,
}) {
  if (!cache || !agent || !signature || !rootCause || !Array.isArray(selectedPlaybooks)) {
    return;
  }
  if (!selectedPlaybooks.length) {
    return;
  }

  const key = buildCacheKey(agent, signature.class, rootCause.sourceLayer);
  const current = cache.entries[key] ?? {
    uses: 0,
    passCount: 0,
    stopCount: 0,
  };

  cache.entries[key] = {
    signatureClass: signature.class,
    rootCauseLayer: rootCause.sourceLayer,
    playbooks: selectedPlaybooks,
    confidence: signature.confidence,
    uses: Number(current.uses ?? 0) + 1,
    passCount: Number(current.passCount ?? 0) + (outcome === "pass" ? 1 : 0),
    stopCount: Number(current.stopCount ?? 0) + (outcome === "stop" ? 1 : 0),
    updatedAt: new Date().toISOString(),
  };

  await persistCache(cache, workspaceRoot);
}

function isCodePlaybookAllowed(policyContext = {}) {
  const promptRetryCount = Number.isInteger(policyContext.promptRetryCount)
    ? policyContext.promptRetryCount
    : 0;
  const rootCauseLayer = policyContext.rootCauseLayer;
  if (promptRetryCount >= 2) {
    return true;
  }
  return rootCauseLayer === "runtime_validation" || rootCauseLayer === "orchestrator_policy";
}

function buildCacheKey(agent, signatureClass, rootCauseLayer) {
  return `${agent}|${signatureClass}|${rootCauseLayer}`;
}

function isExpired(updatedAt) {
  if (!updatedAt) {
    return true;
  }
  const ms = Date.parse(updatedAt);
  if (!Number.isFinite(ms)) {
    return true;
  }
  const maxAgeMs = MAX_CACHE_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - ms > maxAgeMs;
}

async function persistCache(cache, workspaceRoot) {
  const cachePath = cache.cachePath ?? getCachePath(workspaceRoot);
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  const payload = {
    updatedAt: new Date().toISOString(),
    entries: cache.entries,
  };
  await fs.writeFile(cachePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function getCachePath(workspaceRoot) {
  return path.join(workspaceRoot, "documentation", "analysis", "canary-loops", CACHE_FILE);
}

async function readJsonIfPresent(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}
