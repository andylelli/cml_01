import path from "path";
import { config } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { generateMystery } from "../apps/worker/dist/jobs/mystery-orchestrator.js";
import { loadCanaryInputOverrides } from "./canary-loop/canary-input-overrides.mjs";

const root = process.cwd();
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local") });

const parseEnvBool = (value, fallback) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

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
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, true),
    logFilePath: process.env.LOG_FILE_PATH ?? path.resolve(root, "logs", "llm.jsonl"),
    logFullPromptsToFile: parseEnvBool(process.env.LOG_FULL_PROMPTS_TO_FILE, true),
    fullPromptLogFilePath:
      process.env.FULL_PROMPT_LOG_FILE_PATH ?? path.resolve(root, "logs", "llm-prompts-full.jsonl"),
    logActualPromptDocsToFile: parseEnvBool(process.env.LOG_ACTUAL_PROMPT_DOCS_TO_FILE, true),
    actualPromptDocsDir:
      process.env.ACTUAL_PROMPT_DOCS_DIR ??
      path.resolve(root, "documentation", "prompts", "actual"),
  }),
});

const canaryInputConfig = await loadCanaryInputOverrides({ workspaceRoot: root });
const inputs = canaryInputConfig.inputs;

if (!inputs.theme || typeof inputs.theme !== "string") {
  throw new Error(`Missing required 'theme' in ${canaryInputConfig.sources.coreInputsPath}`);
}

console.log("CANARY_INPUTS_FILE", canaryInputConfig.sources.coreInputsPath);
if (canaryInputConfig.sources.quickRunEnabled && canaryInputConfig.sources.quickRunRequestPath) {
  console.log("CANARY_QUICKRUN_OVERRIDES_FILE", canaryInputConfig.sources.quickRunRequestPath);
}
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
