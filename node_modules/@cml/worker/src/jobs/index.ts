import { AzureOpenAIClient, LLMLogger, LogLevel } from "@cml/llm-client";
import type { ProgressCallback } from "./mystery-orchestrator.js";
import { generateMysterySimple } from "./mystery-orchestrator.js";

export type JobName =
  | "settingJob"
  | "castJob"
  | "cmlJob"
  | "validateCmlJob"
  | "cluesJob"
  | "outlineJob"
  | "proseJob"
  | "gamePackJob"
  | "fullPipelineJob";

// Export orchestrator functions
export {
  generateMystery,
  generateMysterySimple,
  type MysteryGenerationInputs,
  type MysteryGenerationProgress,
  type MysteryGenerationResult,
  type ProgressCallback,
} from "./mystery-orchestrator.js";

export type JobContext = {
  runId?: string;
  projectId?: string;
};

export type JobHandler = (context: JobContext) => Promise<void>;

const parseEnvBool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

const buildLlmLogger = () =>
  new LLMLogger({
    logLevel: process.env.LOG_LEVEL as LogLevel | undefined,
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, false),
    logFilePath: process.env.LOG_FILE_PATH,
  });

const buildLlmClient = () => {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY || "";

  if (!endpoint || !apiKey) {
    return null;
  }

  return new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE || 60),
    logger: buildLlmLogger(),
  });
};

const runDefaultPipeline = async (jobName: JobName, context: JobContext) => {
  const client = buildLlmClient();
  if (!client) {
    throw new Error(
      "Azure OpenAI credentials are required to run worker jobs. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY."
    );
  }

  const theme =
    process.env.DEFAULT_MYSTERY_THEME ||
    "A classic country-house murder with tangled inheritance motives";

  console.log(
    `@cml/worker ${jobName} starting (runId=${context.runId ?? "n/a"}, projectId=${
      context.projectId ?? "n/a"
    })`
  );

  const onProgress: ProgressCallback = (progress) => {
    console.log(`@cml/worker ${jobName} ${progress.stage}: ${progress.message}`);
  };

  await generateMysterySimple(client, theme, onProgress);
};

const makePipelineJob = (jobName: JobName): JobHandler => {
  return async (context) => runDefaultPipeline(jobName, context);
};

export const jobRegistry: Record<JobName, JobHandler> = {
  settingJob: makePipelineJob("settingJob"),
  castJob: makePipelineJob("castJob"),
  cmlJob: makePipelineJob("cmlJob"),
  validateCmlJob: makePipelineJob("validateCmlJob"),
  cluesJob: makePipelineJob("cluesJob"),
  outlineJob: makePipelineJob("outlineJob"),
  proseJob: makePipelineJob("proseJob"),
  gamePackJob: makePipelineJob("gamePackJob"),
  fullPipelineJob: makePipelineJob("fullPipelineJob"),
};
