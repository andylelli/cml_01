import fs from "fs/promises";
import path from "path";

export const DEFAULTS = {
  mode: "apply",
  maxIterations: 5,
  maxUnchanged: 2,
  testScope: "targeted",
  stopOnNewFailureClass: true,
  hydratePriorFromRun: true,
  quickRun: false,
  confirmSharedEdits: false,
  rollbackFailedChanges: true,
  partialRollbackEnabled: true,
  autoExpandUpstreamScope: false,
  enableMajorRework: true,
};

export const MIN_CONFIDENCE = Number.parseFloat(process.env.CANARY_MIN_SIGNATURE_CONFIDENCE ?? "0.6");
export const MIN_ROOT_CAUSE_CONFIDENCE = Number.parseFloat(process.env.CANARY_MIN_ROOT_CAUSE_CONFIDENCE ?? "0.7");
export const MAX_FILES_PER_ITERATION = 4;
export const GENERATED_ARTIFACT_DENY_GLOBS = ["documentation/prompts/actual/run_*/**"];
export const SHARED_FILE_CONFIRM_GLOBS = [
  "apps/worker/src/jobs/mystery-orchestrator.ts",
  "packages/story-validation/**",
  "schema/**",
];

export const PIPELINE_AGENT_ORDER = [
  "1",
  "2",
  "2e",
  "3b",
  "3",
  "5",
  "6",
  "4",
  "2b",
  "2c",
  "2d",
  "7",
  "65",
  "9",
];

const AGENT_DISPLAY_BY_CODE = {
  "1": "Agent1-SettingRefiner",
  "2": "Agent2-CastDesigner",
  "4": "Agent4-Revision",
  "2e": "Agent2e-BackgroundContext",
  "2b": "Agent2b-CharacterProfiles",
  "2c": "Agent2c-LocationProfiles",
  "2d": "Agent2d-TemporalContext",
  "3": "Agent3-CMLGenerator",
  "3b": "Agent3b-HardLogicDeviceGenerator",
  "5": "Agent5-ClueExtraction",
  "6": "Agent6-FairPlay",
  "65": "Agent65-WorldBuilder",
  "7": "Agent7-NarrativeOutline",
  "9": "Agent9-Prose",
};

const AGENT_PACKAGE_BY_CODE = {
  "1": "@cml/worker",
  "2": "@cml/worker",
  "4": "@cml/worker",
  "2e": "@cml/worker",
  "2b": "@cml/worker",
  "2c": "@cml/worker",
  "2d": "@cml/worker",
  "3": "@cml/worker",
  "3b": "@cml/worker",
  "5": "@cml/worker",
  "6": "@cml/worker",
  "65": "@cml/worker",
  "7": "@cml/worker",
  "9": "@cml/worker",
};

export const agentToCanaryCommand = {
  "Agent1-SettingRefiner": "node scripts/canary-agent-boundary.mjs --agent 1",
  "Agent2-CastDesigner": "node scripts/canary-agent-boundary.mjs --agent 2",
  "Agent4-Revision": "node scripts/canary-agent-boundary.mjs --agent 4",
  "Agent2e-BackgroundContext": "node scripts/canary-agent-boundary.mjs --agent 2e",
  "Agent2b-CharacterProfiles": "node scripts/canary-agent-boundary.mjs --agent 2b",
  "Agent2c-LocationProfiles": "node scripts/canary-agent-boundary.mjs --agent 2c",
  "Agent2d-TemporalContext": "node scripts/canary-agent-boundary.mjs --agent 2d",
  "Agent3-CMLGenerator": "node scripts/canary-agent-boundary.mjs --agent 3",
  "Agent3b-HardLogicDeviceGenerator": "node scripts/canary-agent-boundary.mjs --agent 3b",
  "Agent5-ClueExtraction": "node scripts/canary-agent-boundary.mjs --agent 5",
  "Agent6-FairPlay": "node scripts/canary-agent-boundary.mjs --agent 6",
  "Agent65-WorldBuilder": "node scripts/canary-agent-boundary.mjs --agent 65",
  "Agent7-NarrativeOutline": "node scripts/canary-agent-boundary.mjs --agent 7",
  "Agent9-Prose": "node scripts/canary-agent9.mjs",
};

export const agentToTargetedTestCommands = {
  "Agent1-SettingRefiner": ["npm run -w @cml/worker test"],
  "Agent2-CastDesigner": ["npm run -w @cml/worker test"],
  "Agent4-Revision": ["npm run -w @cml/worker test"],
  "Agent2e-BackgroundContext": ["npm run -w @cml/worker test"],
  "Agent2b-CharacterProfiles": ["npm run -w @cml/worker test"],
  "Agent2c-LocationProfiles": ["npm run -w @cml/worker test"],
  "Agent2d-TemporalContext": ["npm run -w @cml/worker test"],
  "Agent3-CMLGenerator": ["npm run -w @cml/worker test"],
  "Agent3b-HardLogicDeviceGenerator": ["npm run -w @cml/worker test"],
  "Agent5-ClueExtraction": ["npm run -w @cml/worker test"],
  "Agent6-FairPlay": ["npm run -w @cml/worker test"],
  "Agent65-WorldBuilder": ["npm run -w @cml/worker test"],
  "Agent7-NarrativeOutline": ["npm run -w @cml/worker test"],
  "Agent9-Prose": ["npm run -w @cml/worker test"],
};

export const packageToFullTestCommands = {
  "@cml/worker": ["npm run -w @cml/worker test"],
  "@cml/api": ["npm run -w @cml/api test"],
  "@cml/web": ["npm run -w @cml/web test"],
};

export function parseAgentCode(input) {
  if (!input) {
    return null;
  }
  const text = String(input).trim();
  const fromAgentPrefix = text.match(/^agent\s*([0-9]+(?:\.[0-9]+)?[a-z]?)/i);
  if (fromAgentPrefix) {
    return normalizeAgentCode(fromAgentPrefix[1]);
  }
  const fromLoose = text.match(/^([0-9]+(?:\.[0-9]+)?[a-z]?)$/i);
  if (fromLoose) {
    return normalizeAgentCode(fromLoose[1]);
  }
  const fromEmbedded = text.match(/agent\s*([0-9]+(?:\.[0-9]+)?[a-z]?)/i);
  if (fromEmbedded) {
    return normalizeAgentCode(fromEmbedded[1]);
  }
  return null;
}

function normalizeAgentCode(rawCode) {
  return String(rawCode).toLowerCase().replace(/\.5$/, "5").replace(/[^0-9a-z]/g, "");
}

export function normalizeAgentInput(agentInput, registeredAgentCodes) {
  const code = parseAgentCode(agentInput);
  if (!code) {
    return null;
  }
  if (!registeredAgentCodes.has(code)) {
    return null;
  }
  return {
    code,
    canonicalAgent: AGENT_DISPLAY_BY_CODE[code] ?? `Agent${code}`,
  };
}

export function getAgentPackageForCode(code) {
  return AGENT_PACKAGE_BY_CODE[code] ?? null;
}

export function getCanonicalAgentForCode(code) {
  return AGENT_DISPLAY_BY_CODE[code] ?? null;
}

export async function loadRegisteredAgentCodes(workspaceRoot) {
  const registryPath = path.join(
    workspaceRoot,
    "apps",
    "worker",
    "src",
    "jobs",
    "agents",
    "index.ts"
  );
  const source = await fs.readFile(registryPath, "utf8");
  const matches = source.matchAll(/runAgent([0-9]+[a-z]?)/gi);
  const codes = new Set();
  for (const match of matches) {
    codes.add(String(match[1]).toLowerCase());
  }

  // Include explicitly mapped canary agents that are prompt-level (for example,
  // Agent 4 revision) and therefore may not have a dedicated runAgent* export.
  for (const code of Object.keys(AGENT_DISPLAY_BY_CODE)) {
    codes.add(code.toLowerCase());
  }

  return codes;
}

export function parseBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }
  return defaultValue;
}

export function parseInteger(value, defaultValue) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }
  return parsed;
}

export function getAgentMappingConformance(registeredAgentCodes) {
  const issues = [];
  for (const code of registeredAgentCodes) {
    const canonicalAgent = getCanonicalAgentForCode(code);
    if (!canonicalAgent) {
      issues.push(`Missing canonical display mapping for agent code '${code}'.`);
      continue;
    }

    if (!agentToCanaryCommand[canonicalAgent]) {
      issues.push(`Missing canary command mapping for ${canonicalAgent}.`);
    }

    const targeted = agentToTargetedTestCommands[canonicalAgent];
    const packageName = getAgentPackageForCode(code);
    const full = packageName ? packageToFullTestCommands[packageName] : null;
    if ((!targeted || targeted.length === 0) && (!full || full.length === 0)) {
      issues.push(`Missing targeted/full test mapping for ${canonicalAgent}.`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
