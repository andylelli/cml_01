import path from "path";
import fs from "fs/promises";
import { config } from "dotenv";
import YAML from "yaml";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { generateMystery } from "../apps/worker/dist/jobs/mystery-orchestrator.js";

const root = process.cwd();
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local") });

const DEFAULT_INPUTS_PATH = path.join(root, "scripts", "canary-core-inputs.yaml");
const requestedInputsPath = process.env.CANARY_CORE_INPUTS_YAML || DEFAULT_INPUTS_PATH;

async function loadCoreInputs(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = YAML.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Expected a YAML object at ${filePath}`);
  }

  // Keep only fields accepted by MysteryGenerationInputs.
  const allowedKeys = new Set([
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

  const sanitized = Object.fromEntries(Object.entries(parsed).filter(([key]) => allowedKeys.has(key)));

  // Accept UI axis labels and map to orchestrator-compatible values.
  if (typeof sanitized.primaryAxis === "string") {
    const axis = sanitized.primaryAxis.trim().toLowerCase();
    const axisAliasMap = {
      identity: "social",
      behavioral: "psychological",
      authority: "mechanical",
    };
    sanitized.primaryAxis = axisAliasMap[axis] || axis;
  }

  return sanitized;
}

const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";

if (!endpoint || !apiKey) {
  console.log("CANARY_SKIPPED_MISSING_AZURE_ENV");
  process.exit(2);
}

const client = new AzureOpenAIClient({
  endpoint,
  apiKey,
  defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-4o-mini",
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
  requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
  logger: new LLMLogger({
    logToConsole: true,
    logToFile: true,
    logFilePath: process.env.LOG_FILE_PATH ?? "apps/api/logs/llm.jsonl",
  }),
});

const theme =
  process.env.DEFAULT_MYSTERY_THEME ??
  "A classic country-house murder with tangled inheritance motives";

const yamlInputs = await loadCoreInputs(requestedInputsPath);
const inputs = {
  targetLength: "medium",
  narrativeStyle: "classic",
  skipNoveltyCheck: false,
  theme,
  ...yamlInputs,
};

if (!inputs.theme || typeof inputs.theme !== "string") {
  throw new Error(`Missing required 'theme' in ${requestedInputsPath}`);
}

console.log("CANARY_INPUTS_FILE", requestedInputsPath);
console.log("CANARY_INPUTS", JSON.stringify(inputs));

const result = await generateMystery(client, inputs, (progress) => {
  console.log(`PROGRESS ${progress.stage} - ${progress.message}`);
});

console.log("CANARY_STATUS", result.status);
console.log("RUN_ID", result.metadata.runId);
console.log("CANARY_CLUE_COUNT", result.clues.clues.length);
console.log("CANARY_RED_HERRING_COUNT", result.clues.redHerrings.length);
console.log("CANARY_CLUE_STATUS", result.clues.status ?? "none");
console.log("CANARY_CLUE_AUDIT", JSON.stringify(result.clues.audit ?? {}));
console.log("WARNINGS_COUNT", result.warnings.length);
if (result.warnings.length) {
  console.log("WARNINGS", JSON.stringify(result.warnings.slice(0, 6)));
}
