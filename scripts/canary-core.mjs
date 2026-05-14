import path from "path";
import { mkdir, writeFile } from "fs/promises";
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
// Derive CANARY_CLUE_STATUS from audit arrays, not raw LLM status field.
// The Agent 5 LLM sometimes returns status="fail" even with empty audit arrays;
// the audit content is the authoritative fair-play check.
const _clueAudit = result.clues.audit ?? {};
const _auditHasFail =
  (_clueAudit.missingDiscriminatingEvidenceIds ?? []).length > 0 ||
  (_clueAudit.weakEliminationSuspects ?? []).length > 0 ||
  (_clueAudit.invalidSourcePaths ?? []).length > 0;
console.log("CANARY_CLUE_STATUS", _auditHasFail ? "fail" : "pass");
console.log("CANARY_CLUE_AUDIT", JSON.stringify(_clueAudit));
console.log("WARNINGS_COUNT", result.warnings.length);
if (result.warnings.length) {
  console.log("WARNINGS", JSON.stringify(result.warnings.slice(0, 6)));
}

// ── Save human-readable story to C:\CML\stories ──────────────────────────
try {
  const prose = result.prose ?? {};
  const chapters = Array.isArray(prose.chapters) ? prose.chapters : [];

  if (chapters.length > 0) {
    const runId = result.metadata.runId;
    const rawTitle = String(prose.title || prose.note || result.cml?.title || "Mystery Story");
    const storyTitle = rawTitle.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, "...").replace(/[\u2013\u2014]/g, "-").trim();

    // Slug from title: lowercase, replace non-alnum with underscores, trim
    const slug = storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const storyDir = path.join(root, "stories", `story_${datePart}`);
    const storyFile = path.join(storyDir, `${slug}.md`);

    const lines = [`# ${storyTitle}`, ``, `*Run ID: ${runId} — Generated ${now.toDateString()}*`, ``, `---`];

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const chTitle = String(ch.title || `Chapter ${i + 1}`).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, "...").replace(/[\u2013\u2014]/g, "-").trim();
      lines.push(``, `## Chapter ${i + 1}: ${chTitle}`, ``);
      const paragraphs = Array.isArray(ch.paragraphs) ? ch.paragraphs : (ch.text ? [ch.text] : []);
      for (const p of paragraphs) {
        const text = String(p ?? "").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, "...").replace(/[\u2013\u2014]/g, "-").trim();
        if (text) lines.push(text, ``);
      }
      lines.push(`---`);
    }

    const content = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
    await mkdir(storyDir, { recursive: true });
    await writeFile(storyFile, content, "utf-8");
    console.log("STORY_SAVED", storyFile);
  }
} catch (storySaveErr) {
  console.error("STORY_SAVE_FAILED", String(storySaveErr));
}

// Exit 0 for success or warning (pipeline completed, only soft issues remain).
// Exit 1 for hard failure (prose generation aborted, etc.).
process.exit(result.status === "failure" ? 1 : 0);
