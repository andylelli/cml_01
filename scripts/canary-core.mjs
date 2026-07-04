import path from "path";
import { config } from "dotenv";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { generateMystery } from "../apps/worker/dist/jobs/mystery-orchestrator.js";
import { saveReadableStory } from "../apps/worker/dist/jobs/save-readable-story.js";
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
    // Matches the API's buildLlmLogger() exactly, so a canary run produces the same logs as a UI run.
    logLevel: process.env.LOG_LEVEL,
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

const diagnostics = Array.isArray(result.scoringReport?.diagnostics)
  ? result.scoringReport.diagnostics
  : [];
const postGenerationDiagnostic = diagnostics.find((entry) =>
  entry?.key === "agent9_prose_post_generation_summary"
  || entry?.diagnostic_type === "post_generation_summary"
);
const metricDetails = postGenerationDiagnostic?.details ?? {};
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const integrityMetrics = {
  season_lock_replacements_total: toNumber(metricDetails.season_lock_replacements_total),
  season_lock_protected_collisions_blocked: toNumber(metricDetails.season_lock_protected_collisions_blocked),
  mechanical_term_collision_count: toNumber(metricDetails.mechanical_term_collision_count),
  boundary_integrity_failures_count: toNumber(metricDetails.boundary_integrity_failures_count),
  semantic_rewrite_diff_blocks_count: toNumber(metricDetails.semantic_rewrite_diff_blocks_count),
  entity_pronoun_drift_count: toNumber(metricDetails.entity_pronoun_drift_count),
  culprit_gate_alias_matches_count: toNumber(metricDetails.culprit_gate_alias_matches_count),
  culprit_gate_false_positive_count: toNumber(metricDetails.culprit_gate_false_positive_count),
};
console.log("CANARY_INTEGRITY_METRICS", JSON.stringify(integrityMetrics));
console.log("CANARY_MECHANICAL_TERM_COLLISION_COUNT", integrityMetrics.mechanical_term_collision_count);
console.log("CANARY_BOUNDARY_INTEGRITY_FAILURES_COUNT", integrityMetrics.boundary_integrity_failures_count);
console.log("CANARY_ENTITY_PRONOUN_DRIFT_COUNT", integrityMetrics.entity_pronoun_drift_count);
console.log("CANARY_CULPRIT_GATE_ALIAS_MATCHES_COUNT", integrityMetrics.culprit_gate_alias_matches_count);
console.log("CANARY_CULPRIT_GATE_FALSE_POSITIVE_COUNT", integrityMetrics.culprit_gate_false_positive_count);

const integrityAssertionFailures = [];
if (integrityMetrics.mechanical_term_collision_count > 0) {
  integrityAssertionFailures.push(
    `mechanical_term_collision_count == ${integrityMetrics.mechanical_term_collision_count} (expected 0)`
  );
}
if (integrityMetrics.culprit_gate_false_positive_count > 0) {
  integrityAssertionFailures.push(
    `culprit_gate_false_positive_count == ${integrityMetrics.culprit_gate_false_positive_count} (expected 0)`
  );
}
if (integrityAssertionFailures.length > 0) {
  console.log("CANARY_INTEGRITY_ASSERTIONS", JSON.stringify({
    status: "fail",
    failures: integrityAssertionFailures,
  }));
} else {
  console.log("CANARY_INTEGRITY_ASSERTIONS", JSON.stringify({
    status: "pass",
  }));
}

// ── Save the story to stories/ via the SAME writer the API uses (save-readable-story.ts) ──
// so a canary run produces the identical story file (title/slug/path/format) as a UI-triggered run.
// The title fallback mirrors the API's synopsis title (CASE.meta.title || "Untitled Mystery").
try {
  const prose = result.prose ?? {};
  const chapters = Array.isArray(prose.chapters) ? prose.chapters : [];

  if (chapters.length > 0) {
    const fallbackTitle = result.cml?.CASE?.meta?.title || "Untitled Mystery";
    const saved = await saveReadableStory({
      storiesDir: path.join(root, "stories"),
      prose,
      runId: result.metadata.runId,
      fallbackTitle,
    });
    console.log("STORY_SAVED", saved.absPath);
  }
} catch (storySaveErr) {
  console.error("STORY_SAVE_FAILED", String(storySaveErr));
}

// Exit 0 for success or warning (pipeline completed, only soft issues remain).
// Exit 1 for hard failure (prose generation aborted, etc.).
const integrityFailed = integrityAssertionFailures.length > 0;
process.exit(result.status === "failure" || integrityFailed ? 1 : 0);
