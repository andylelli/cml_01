import path from "path";
import { config } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { generateMysterySimple } from "../apps/worker/dist/jobs/mystery-orchestrator.js";

const root = process.cwd();
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local") });

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

const result = await generateMysterySimple(client, theme, (progress) => {
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
