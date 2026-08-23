import fs from "fs/promises";
import path from "path";
import YAML from "yaml";
import { selectCanaryTheme } from "./theme-library.mjs";

const ALLOWED_INPUT_KEYS = new Set([
  "theme",
  "eraPreference",
  "locationPreset",
  "tone",
  "primaryAxis",
  "castSize",
  "castNames",
  "castGenders",
  "detectiveType",
  "targetLength",
  "narrativeStyle",
  "skipNoveltyCheck",
  "similarityThreshold",
  "proseBatchSize",
  "runId",
  "projectId",
  "enableLockedFactRegistry",
  "enableLockedFactGate",
  "enableCharacterBundle",
  "enableBindingGates",
  "forceWarnings",
  "enableSurgicalFingerprintRetry",
  "enableOutlineCompleteness",
]);

/**
 * REMOVED 2026-08-21 — this was the other half of X70, and the half that did the damage.
 *
 *     identity -> "social"   behavioral -> "psychological"   authority -> "mechanical"
 *
 * It translated the canonical five INTO the retired spellings on the way IN. `canary-core-inputs.yaml`
 * states in its own comments that this auto-mapping does not exist — *"canary-core.mjs contains no
 * reference to primaryAxis at all"* — which is true of that file and false of the pipeline: the map
 * lived here, one file over, and canary-core calls this loader on every run.
 *
 * WHAT IT DID, measured end to end on 2026-08-21:
 *
 *   yaml says     loader emitted    the agent received
 *   identity   -> social         -> authority   <- a different kind of mystery, silently
 *   authority  -> mechanical     -> THROWS      <- X70 made "mechanical" fatal, so the run dies
 *   behavioral -> psychological  -> behavioral  <- round-trips only by luck
 *
 * So of the three axes X70 was supposed to make reachable, exactly ONE worked. A live run requesting
 * `identity` produced an `authority` case and nothing anywhere said so.
 *
 * AND IT EXPLAINS THE CORPUS. Before X70 `normalizePrimaryAxis` ended in `default: return "temporal"`,
 * so all three spellings this map produced collapsed to temporal — the real reason **23 of 23 archived
 * cases are temporal**. X70 fixed the downstream default and left the upstream translation, so the
 * coercion survived its own fix and merely changed destination.
 *
 * The axis vocabulary has exactly one owner: `normalizePrimaryAxis`, which accepts the canonical five
 * AND the retired spellings. A second table that rewrites the vocabulary before the owner sees it is
 * the one-vocabulary-two-places defect this review has now found nine times.
 */

export function parseBooleanLike(value, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
}

function resolveYamlPath({ workspaceRoot, requestedPath, fallbackPath }) {
  const trimmed = String(requestedPath ?? "").trim();
  if (!trimmed) {
    return fallbackPath;
  }
  return path.isAbsolute(trimmed) ? trimmed : path.resolve(workspaceRoot, trimmed);
}

function parseOptionalBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }
  return undefined;
}

function sanitizeCanaryInputs(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const staged = Object.fromEntries(
    Object.entries(raw).filter(([key]) => ALLOWED_INPUT_KEYS.has(key))
  );

  const sanitized = { ...staged };

  if (typeof sanitized.primaryAxis === "string") {
    // Normalise whitespace and case only. NEVER re-spell: an unknown axis must reach
    // `normalizePrimaryAxis`, which throws and names the five, rather than being quietly
    // rewritten here into something that happens to parse.
    sanitized.primaryAxis = sanitized.primaryAxis.trim().toLowerCase();
  }

  if (sanitized.castSize !== undefined) {
    const castSize = Number(sanitized.castSize);
    sanitized.castSize = Number.isFinite(castSize) ? castSize : undefined;
  }

  if (sanitized.similarityThreshold !== undefined) {
    const similarityThreshold = Number(sanitized.similarityThreshold);
    sanitized.similarityThreshold = Number.isFinite(similarityThreshold)
      ? similarityThreshold
      : undefined;
  }

  if (sanitized.proseBatchSize !== undefined) {
    const proseBatchSize = Number(sanitized.proseBatchSize);
    sanitized.proseBatchSize = Number.isFinite(proseBatchSize)
      ? proseBatchSize
      : undefined;
  }

  if (sanitized.skipNoveltyCheck !== undefined) {
    sanitized.skipNoveltyCheck = parseOptionalBoolean(sanitized.skipNoveltyCheck);
  }

  if (sanitized.enableLockedFactRegistry !== undefined) {
    sanitized.enableLockedFactRegistry = parseOptionalBoolean(sanitized.enableLockedFactRegistry);
  }

  if (sanitized.enableLockedFactGate !== undefined) {
    sanitized.enableLockedFactGate = parseOptionalBoolean(sanitized.enableLockedFactGate);
  }

  if (sanitized.enableCharacterBundle !== undefined) {
    sanitized.enableCharacterBundle = parseOptionalBoolean(sanitized.enableCharacterBundle);
  }

  if (sanitized.enableBindingGates !== undefined) {
    sanitized.enableBindingGates = parseOptionalBoolean(sanitized.enableBindingGates);
  }

  if (sanitized.forceWarnings !== undefined) {
    sanitized.forceWarnings = parseOptionalBoolean(sanitized.forceWarnings);
  }

  if (sanitized.enableSurgicalFingerprintRetry !== undefined) {
    sanitized.enableSurgicalFingerprintRetry = parseOptionalBoolean(sanitized.enableSurgicalFingerprintRetry);
  }

  if (sanitized.enableOutlineCompleteness !== undefined) {
    sanitized.enableOutlineCompleteness = parseOptionalBoolean(sanitized.enableOutlineCompleteness);
  }

  if (sanitized.castNames !== undefined) {
    sanitized.castNames = Array.isArray(sanitized.castNames)
      ? sanitized.castNames.map((entry) => String(entry)).filter(Boolean)
      : undefined;
  }

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => value !== undefined)
  );
}

async function readYamlObject(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = YAML.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Expected YAML object in ${filePath}.`);
  }
  return parsed;
}

function extractQuickRunOverrides(parsedYaml) {
  const rootOverrides = sanitizeCanaryInputs(parsedYaml);
  const inputsOverrides = sanitizeCanaryInputs(parsedYaml?.inputs);
  const explicitOverrides = sanitizeCanaryInputs(parsedYaml?.canaryInputOverrides);
  return {
    ...rootOverrides,
    ...inputsOverrides,
    ...explicitOverrides,
  };
}

export async function loadCanaryInputOverrides({
  workspaceRoot,
  quickRun,
} = {}) {
  const root = workspaceRoot ?? process.cwd();
  const coreInputsPath = resolveYamlPath({
    workspaceRoot: root,
    requestedPath: process.env.CANARY_CORE_INPUTS_YAML,
    fallbackPath: path.join(root, "scripts", "canary-core-inputs.yaml"),
  });

  const quickRunEnabled =
    typeof quickRun === "boolean"
      ? quickRun
      : parseBooleanLike(process.env.CANARY_QUICK_RUN, false);

  const quickRunRequestPath = resolveYamlPath({
    workspaceRoot: root,
    requestedPath: process.env.CANARY_QUICKRUN_REQUEST_YAML,
    fallbackPath: path.join(root, "scripts", "canary-loop", "request.quickrun.rework.yaml"),
  });

  const coreInputYaml = await readYamlObject(coreInputsPath);
  const coreOverrides = sanitizeCanaryInputs(coreInputYaml);

  // A_52 item 5 (premise diversity): optional per-run theme rotation for the eval loop. CANARY_THEME=
  // poison|tide|acoustic|optics|identity|clock selects a structurally different mechanism family;
  // CANARY_THEME=rotate picks one per run. Unset → the YAML theme is used unchanged (default).
  const themeOverride = selectCanaryTheme(process.env.CANARY_THEME, Date.now());
  if (themeOverride) {
    coreOverrides.theme = themeOverride.theme;
    coreOverrides.primaryAxis = themeOverride.primaryAxis;
  }

  let quickRunOverrides = {};
  if (quickRunEnabled) {
    const quickRunYaml = await readYamlObject(quickRunRequestPath);
    quickRunOverrides = extractQuickRunOverrides(quickRunYaml);
  }

  return {
    inputs: {
      ...coreOverrides,
      ...quickRunOverrides,
    },
    sources: {
      coreInputsPath,
      quickRunEnabled,
      quickRunRequestPath: quickRunEnabled ? quickRunRequestPath : undefined,
      themeKey: themeOverride?.key,
    },
  };
}
