import path from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
import { AzureOpenAIClient } from "@cml/llm-client";
import { buildLlmLogger } from "../apps/worker/dist/jobs/cli-runtime.js";
import { generateMystery } from "../apps/worker/dist/jobs/mystery-orchestrator.js";
import { saveReadableStory } from "../apps/worker/dist/jobs/save-readable-story.js";
import { loadCanaryInputOverrides } from "./canary-loop/canary-input-overrides.mjs";

const root = process.cwd();
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";

/**
 * X14 (REVIEW_05 §27.3) — THE DEPLOYMENT NAME IS A CREDENTIAL, not a preference.
 *
 * This read `?? "gpt-4o-mini"`. §20.4 found that the harnesses were resolving `gpt-4o-mini` while the
 * pipeline resolved `gpt-4.1-mini` — *"a £6 four-run probe would have measured a model the product
 * does not use, and nothing in the report would have said so"* — and fixed the `.env.local` override
 * that caused it. It then DELETED the key from `.env`, so the value now lives only in a git-ignored
 * file. A silent default put the whole of §20.4 one missing key away from returning, on a paid probe,
 * undetectably.
 *
 * Skipping is the same answer this script already gives for a missing endpoint or key, and for the
 * same reason: a run that cannot be attributed to a model is not cheaper than no run.
 */
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "";

if (!endpoint || !apiKey || !deployment) {
  console.log("CANARY_SKIPPED_MISSING_AZURE_ENV");
  if (endpoint && apiKey) {
    console.log("  reason: AZURE_OPENAI_DEPLOYMENT_NAME is unset. Set it in .env.local — it is not");
    console.log("  defaulted, because a probe that silently measures the wrong model is worse than none.");
  }
  process.exit(2);
}

const client = new AzureOpenAIClient({
  endpoint,
  apiKey,
  defaultModel: deployment,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
  requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
  logger: buildLlmLogger(root),
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

/**
 * REVIEW_03 item 7 — persist every stage artifact so a canary run is RESUMABLE.
 *
 * FOUND BY THE RESUME DRILL. R5 built resume against the artifacts `onArtifact` writes into
 * `data/store.json`, and the API supplies that callback. **The canary path did not** — it called
 * `generateMystery` with a progress callback and nothing else. So the runs R5 was built for were
 * exactly the runs it could not recover: every £1.50 batch run on this project goes through here,
 * and `run-resume.ts`'s own header cites the losses — "a hung socket, a Windows process abort
 * (0xC0000409), a laptop entering standby" — all of which were canary runs.
 *
 * A capability whose read path does not exist on the path that matters is this codebase's most
 * expensive recurring shape (A_70/A_71). It was one callback away from working.
 *
 * Failures are swallowed: persistence must never be able to abort a run that is otherwise fine.
 */
const projectId = inputs.projectId ?? `canary_${Date.now()}`;
const persistArtifact = async (type, payload) => {
  try {
    const dbPath = process.env.CML_JSON_DB_PATH || path.join(root, "data", "store.json");
    const store = existsSync(dbPath) ? JSON.parse(readFileSync(dbPath, "utf8")) : {};
    store.artifacts = Array.isArray(store.artifacts) ? store.artifacts : [];
    store.artifacts.push({
      id: `${projectId}_${type}_${store.artifacts.length}`,
      projectId,
      type,
      payload,
      createdAt: new Date().toISOString(),
    });
    writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf8");
  } catch (error) {
    console.log("CANARY_ARTIFACT_PERSIST_FAILED", type, String(error?.message ?? error));
  }
};

console.log("CANARY_PROJECT_ID", projectId);
const result = await generateMystery(
  client,
  { ...inputs, projectId },
  (progress) => {
    console.log(`PROGRESS ${progress.stage} - ${progress.message}`);
  },
  persistArtifact,
);

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
  // FULL array, one JSON line — the first-6 truncation silently discarded every Agent-9-era
  // warning (voice-idiolect tic metrics, NSD-anchor round notes, regen-pass notes): reports don't
  // store warnings, so the tail was unrecoverable from ANY artifact. The A/B analyzers and the
  // abort-class forensics both read these lines from the chain logs.
  console.log("WARNINGS", JSON.stringify(result.warnings));
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

/**
 * `mechanical_term_collision_count` is CONTEXT, not a defect — corrected 2026-08-04.
 *
 * `countMechanicalSeasonCollisions` counts places where the locked season's word is used
 * MECHANICALLY: "mainspring", "spring tension", "the pendulum's suspension spring". Its job is to
 * tell the season-lock rewriter what it must not touch — a high count means the rewriter had more to
 * protect, not that the prose is wrong.
 *
 * Asserting zero made that impossible to satisfy for a whole class of story. The 2026-08-04 run
 * ("The Silent Swing of the Pendulum") reported 13 and every single one was the phrase "the
 * pendulum's suspension spring" — the physical object the culprit tampered with, i.e. the mystery's
 * own murder mechanism. The assertion was demanding that a horology mystery set in spring not
 * mention a clock spring.
 *
 * That cost more than a red line: `CANARY_STATUS failure` for a known, benign reason on every such
 * run is how a status line stops being read at all, and probe runs need it to mean something.
 *
 * WHAT IS ACTUALLY A DEFECT is the rewriter CORRUPTING one of those mechanical uses — turning "the
 * suspension spring" into "the suspension autumn". That is what the two guards below count, and they
 * are what this now asserts. The collision count stays on the record as context.
 */
if (integrityMetrics.season_lock_replacements_total > 0 && integrityMetrics.mechanical_term_collision_count > 0) {
  // Replacements happened in a story that contains mechanical uses of the season word. The guards
  // should have blocked every one of them; if neither guard fired, a mechanical term may have been
  // rewritten into nonsense and nothing recorded it.
  const guardsFired =
    integrityMetrics.season_lock_protected_collisions_blocked + integrityMetrics.semantic_rewrite_diff_blocks_count;
  if (guardsFired === 0) {
    integrityAssertionFailures.push(
      `season_lock_replacements_total == ${integrityMetrics.season_lock_replacements_total} with ` +
        `${integrityMetrics.mechanical_term_collision_count} mechanical use(s) of the season word and ZERO guard ` +
        `blocks — a mechanical term may have been rewritten (expected at least one block, or no replacements)`
    );
  }
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

// Exit per the pinned SHIPPED definition (P0.2, TARGET_80_LEDGER header): a run
// ships iff release_gate_outcome.status ∈ {passed, warning} — a scored gate with
// zero hard stops. result.status is phase-threshold-driven and may read "failure"
// on a shipped run (Open Item 2's shape); it must never decide the exit code.
// Fallback to result.status only when no gate outcome exists (scoring disabled).
const integrityFailed = integrityAssertionFailures.length > 0;
const gateStatus = result.scoringReport?.release_gate_outcome?.status;
// A_71: prefer the report's own `shipped` field — one derivation, computed at report time — and
// re-derive only for pre-A_71 reports that predate the field. The hand-copied rule below is what
// let the same run read "shipped" here and "not shipped" elsewhere (A_70 §4).
const recordedShipped = result.scoringReport?.release_gate_outcome?.shipped;
const shipped =
  typeof recordedShipped === "boolean"
    ? recordedShipped
    : gateStatus === "passed" || gateStatus === "warning";
const hardFailed = gateStatus ? !shipped : result.status === "failure";
console.log("CANARY_RELEASE_GATE", gateStatus ?? "unknown");
process.exit(hardFailed || integrityFailed ? 1 : 0);
