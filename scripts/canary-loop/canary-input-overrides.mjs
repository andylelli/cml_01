import fs from "fs/promises";
import path from "path";
import YAML from "yaml";

const ALLOWED_INPUT_KEYS = new Set([
  "theme",
  "eraPreference",
  "locationPreset",
  "tone",
  "primaryAxis",
  "castSize",
  "castNames",
  "detectiveType",
  "targetLength",
  "narrativeStyle",
  "skipNoveltyCheck",
  "similarityThreshold",
  "proseBatchSize",
  "runId",
  "projectId",
]);

const PRIMARY_AXIS_ALIAS_MAP = {
  identity: "social",
  behavioral: "psychological",
  authority: "mechanical",
};

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
    const axis = sanitized.primaryAxis.trim().toLowerCase();
    sanitized.primaryAxis = PRIMARY_AXIS_ALIAS_MAP[axis] || axis;
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
    },
  };
}
