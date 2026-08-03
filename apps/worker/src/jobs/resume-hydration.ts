/**
 * R5 (architecture/REVIEW.md) — durable execution: resume a run instead of restarting it.
 *
 * THE PROBLEM. A run is a single in-process async call. Any failure after stage 1 discards
 * everything before it — a crash at Agent 9 throws away thirteen stages and ~£1.40 of a ~£1.50 run,
 * and burns a slot in whatever N≥4 batch gate is in flight. The corpus contains runs lost to a hung
 * socket, a Windows process abort (0xC0000409), and a laptop entering standby.
 *
 * THE SOURCE OF TRUTH. The orchestrator already persists every stage's artifact through its
 * `onArtifact` callback, under stable names. Those names are the checkpoint boundary — no new
 * persistence layer is needed, only the read path back in.
 *
 * SCOPE NOTE — deliberately narrower than REVIEW R5 step 1. That step proposed extracting
 * `hydrateUpstreamArtifacts` out of `scripts/canary-agent-boundary.mjs` so production and the A/B
 * harness share one implementation. That extraction was NOT done here: the harness reads a different
 * substrate (the `documentation/prompts/actual/run_...` folders plus `.actual-run-state.json`), carries its own
 * synthesis fallbacks for missing codes, and is the project's only measurement tool. Rewriting it to
 * deliver production resume would have put the measurement tooling at risk for no added capability.
 * Production resume is built here against the artifacts production already writes; unifying the two
 * read paths remains open and is tracked as such.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, type Dirent } from "node:fs";
import { join } from "node:path";

import type { OrchestratorContext } from "./agents/index.js";
import { latestArtifact, loadArtifactStore, type StoreArtifact } from "./artifact-store.js";

/** Artifact names as written by `onArtifact` — the persisted checkpoint keys. */
export type ResumeArtifactName =
  | "setting"
  | "cast"
  | "background_context"
  | "hard_logic_devices"
  | "cml"
  | "clues"
  | "fair_play_report"
  | "character_profiles"
  | "location_profiles"
  | "temporal_context"
  | "world_document"
  | "outline"
  | "prose";

/** A previously-persisted run, keyed by artifact name. Partial by nature — a died run is partial. */
export type ResumeBundle = Partial<Record<ResumeArtifactName, unknown>>;

/**
 * The single mapping from persisted artifact name → the `ctx` field the pipeline reads.
 *
 * ONE table, deliberately. The recurring trap in this codebase is one concept with several bodies
 * (two clearance injectors, two SHIPPED definitions); a second copy of this mapping would be the
 * same mistake. Stage guards, resume application, and coverage reporting all read from here.
 */
export const RESUME_FIELD_BY_ARTIFACT = {
  setting: "setting",
  cast: "cast",
  background_context: "backgroundContext",
  hard_logic_devices: "hardLogicDevices",
  cml: "cml",
  clues: "clues",
  fair_play_report: "fairPlayAudit",
  character_profiles: "characterProfiles",
  location_profiles: "locationProfiles",
  temporal_context: "temporalContext",
  world_document: "worldDocument",
  outline: "narrative",
  prose: "prose",
} as const satisfies Record<ResumeArtifactName, keyof OrchestratorContext>;

export type ResumeStageField = (typeof RESUME_FIELD_BY_ARTIFACT)[ResumeArtifactName];

export interface ResumeApplication {
  /** ctx fields populated from the bundle. */
  restored: ResumeStageField[];
  /** Artifact names present in the bundle but empty/null — treated as absent, not restored. */
  skippedEmpty: ResumeArtifactName[];
  /** Artifact names in the bundle that this build does not recognise. */
  unknown: string[];
}

const isPresent = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
};

/**
 * Populate `ctx` from a persisted bundle. Returns what was restored so the caller can report it —
 * a silent restore would be indistinguishable from a fresh run, which is exactly the class of
 * measurement defect this architecture keeps producing.
 *
 * An entry present-but-empty is treated as ABSENT and re-run. Half an artifact is worse than none:
 * downstream stages would consume a shape that passed a truthiness check but carries no content.
 */
export function applyResumeBundle(ctx: OrchestratorContext, bundle: ResumeBundle): ResumeApplication {
  const restored: ResumeStageField[] = [];
  const skippedEmpty: ResumeArtifactName[] = [];
  const unknown: string[] = [];

  for (const [name, value] of Object.entries(bundle ?? {})) {
    const field = (RESUME_FIELD_BY_ARTIFACT as Record<string, ResumeStageField | undefined>)[name];
    if (!field) {
      unknown.push(name);
      continue;
    }
    if (!isPresent(value)) {
      skippedEmpty.push(name as ResumeArtifactName);
      continue;
    }
    (ctx as unknown as Record<string, unknown>)[field] = value;
    restored.push(field);
  }

  return { restored, skippedEmpty, unknown };
}

/**
 * Should this stage be skipped? True only when its artifact is already populated on ctx.
 *
 * Deliberately checks the LIVE ctx rather than the bundle: a stage that ran in this process must
 * also count as done, so the same guard works for both resume and normal execution.
 */
export function isStageSatisfied(ctx: OrchestratorContext, field: ResumeStageField): boolean {
  return isPresent((ctx as unknown as Record<string, unknown>)[field]);
}

/**
 * ctx fields a stage writes that are NOT persisted as artifacts.
 *
 * THE BUG THIS TABLE EXISTS FOR. Restoring a stage's artifact restores only its *primary* output.
 * Several stages also write derived state that no artifact captures, and skipping such a stage
 * leaves that state `undefined` — where it fails in one of two ways:
 *
 *   LOUD  — `agent3-run.ts:84` reads `ctx.hardLogicDirectives!` and immediately calls
 *           `.hardLogicModes.join(...)`. Skipping Agent 3b while running Agent 3 is a TypeError.
 *           That is the exact shape of a run that died *inside* Agent 3, which is a likely resume.
 *   SILENT — the novelty gate reads `ctx.noveltyAudit?.blocking` and the coverage gate reads
 *           `ctx.coverageResult?.hasCriticalGaps`. Optional chaining means missing data reads as
 *           "nothing wrong", so a resumed run would sail through a binding gate that never ran.
 *           A gate that cannot evaluate must say so — it must never pass by default.
 *
 * The loud case is prevented structurally by resuming only a CONTIGUOUS PREFIX (see
 * `ResumeSkipTracker`). The silent case cannot be — the consumer runs later by design — so it is
 * reported instead: every degraded signal is named in the warnings and on the report.
 */
export const STAGE_SECONDARY_OUTPUTS: Partial<Record<ResumeStageField, ReadonlyArray<string>>> = {
  hardLogicDevices: ["hardLogicDirectives"],
  cml: ["noveltyAudit"],
  clues: ["coverageResult"],
  fairPlayAudit: ["coverageResult"],
  narrative: ["outlineCoverageIssues"],
};

/** Which of a stage's unpersisted outputs are absent from ctx right now. */
export function missingSecondaryOutputs(
  ctx: OrchestratorContext,
  field: ResumeStageField,
): ReadonlyArray<string> {
  const declared = STAGE_SECONDARY_OUTPUTS[field] ?? [];
  const bag = ctx as unknown as Record<string, unknown>;
  return declared.filter((name) => !isPresent(bag[name]));
}

/**
 * Enforces the two rules that make skipping safe.
 *
 * RULE 1 — CONTIGUOUS PREFIX. Once any stage has actually executed, no later stage may be skipped,
 * even if its artifact happens to be present. Without this, a store holding `hard_logic_devices` but
 * not `cml` would skip Agent 3b and run Agent 3 — and Agent 3 consumes state only Agent 3b writes.
 * Per-stage independent checks cannot express "start at the first missing one"; this can.
 *
 * RULE 2 — NAME WHAT WAS LOST. A skipped stage's unpersisted outputs are recorded, so the gates
 * they feed can report "not evaluated" instead of silently passing.
 */
export class ResumeSkipTracker {
  private exhausted = false;
  readonly skipped: ResumeStageField[] = [];
  /** `stageField -> unpersisted outputs that are now absent`. Feeds the report diagnostic. */
  readonly degraded = new Map<ResumeStageField, ReadonlyArray<string>>();

  shouldSkip(ctx: OrchestratorContext, field: ResumeStageField): boolean {
    if (this.exhausted || !isStageSatisfied(ctx, field)) {
      // The first stage that must run closes the prefix for every stage after it.
      this.exhausted = true;
      return false;
    }
    this.skipped.push(field);
    const missing = missingSecondaryOutputs(ctx, field);
    if (missing.length > 0) this.degraded.set(field, missing);
    return true;
  }

  /** Flat list of derived signals unavailable this run, e.g. ["coverageResult", "noveltyAudit"]. */
  degradedSignals(): string[] {
    return [...new Set([...this.degraded.values()].flat())].sort();
  }
}

/**
 * Build the resume summary recorded on the report. `resumed_from` is what lets the ledger tell a
 * resumed run from a fresh one — without it, a resumed run's cost and duration would silently
 * under-report against fresh runs in the same batch.
 */
export function buildResumeDiagnostic(
  resumeFromRunId: string,
  application: ResumeApplication,
  skippedStages: ResumeStageField[],
  degradedSignals: ReadonlyArray<string> = [],
): Record<string, unknown> {
  return {
    resumed_from: resumeFromRunId,
    restored_artifacts: application.restored,
    skipped_stages: skippedStages,
    empty_artifacts_ignored: application.skippedEmpty,
    unknown_artifacts_ignored: application.unknown,
    // A resumed run's totals cover only the stages that actually executed.
    partial_cost_accounting: true,
    /**
     * Derived state that no artifact captures, lost because its producing stage was skipped.
     * Non-empty means one or more gates COULD NOT EVALUATE on this run — they did not pass, they
     * were not run. A ledger entry that ignores this field is reading a weaker run as a clean one.
     */
    signals_unavailable: [...degradedSignals],
    gates_fully_evaluated: degradedSignals.length === 0,
  };
}

// ============================================================================
// Load path — reading a dead run's artifacts back off disk
// ============================================================================

/** Every artifact name resume knows how to restore, in pipeline order. */
export const RESUME_ARTIFACT_NAMES = Object.keys(RESUME_FIELD_BY_ARTIFACT) as ResumeArtifactName[];

export interface ResumeLoad {
  bundle: ResumeBundle;
  /** Artifact names found in the store. */
  found: ResumeArtifactName[];
  /** Artifact names the pipeline knows about but the dead run never produced. */
  missing: ResumeArtifactName[];
}

/**
 * Collect a dead run's artifacts from the file-backed store into a bundle the orchestrator accepts.
 *
 * Keyed by PROJECT, not run: `data/store.json` scopes artifacts by project id, which is the id the
 * API allocates per generation. That is the id an operator has after a crash.
 *
 * Absence is not an error here. A run that died at Agent 9 legitimately has no `prose` artifact, and
 * a run that died at Agent 3 has neither profiles nor outline — the whole point is to restore what
 * exists and re-run the rest. The caller decides whether what came back is enough to be worth
 * resuming; `missing` is reported so that decision is made on evidence rather than on a truthy check.
 */
export function loadResumeBundle(store: StoreArtifact[], projectId: string): ResumeLoad {
  const bundle: ResumeBundle = {};
  const found: ResumeArtifactName[] = [];
  const missing: ResumeArtifactName[] = [];

  for (const name of RESUME_ARTIFACT_NAMES) {
    const payload = latestArtifact(store, projectId, name);
    if (payload === undefined || payload === null) {
      missing.push(name);
      continue;
    }
    bundle[name] = payload;
    found.push(name);
  }

  return { bundle, found, missing };
}

/** Convenience wrapper: read the store from disk, then collect the bundle. */
export function loadResumeBundleFromWorkspace(workspaceRoot: string, projectId: string): ResumeLoad {
  return loadResumeBundle(loadArtifactStore(workspaceRoot), projectId);
}

// ============================================================================
// Build fingerprint — refusing to resume across a rebuild
// ============================================================================

/**
 * REVIEW R5 step 5. Resuming a run whose upstream artifacts were produced by DIFFERENT code than the
 * code now finishing it produces a story that is neither the old build's nor the new one's, and no
 * artifact records the mix. That is the `probe-validity-process-start-vs-dist-build` trap with the
 * evidence destroyed: a mid-flight rebuild is exactly what an operator does while debugging the
 * crash they are about to resume from.
 *
 * The fingerprint is over the compiled dist, not the source, because dist is what actually executes
 * (`worker-consumes-cml-packages-via-dist`). Size + mtime rather than content hashing: this runs on
 * every resume and a full content hash of every dist file costs seconds for no extra signal — any
 * rebuild rewrites mtimes.
 */
export const FINGERPRINT_DIST_ROOTS = [
  join("apps", "worker", "dist"),
  join("packages", "prompts-llm", "dist"),
  join("packages", "llm-client", "dist"),
  join("packages", "story-validation", "dist"),
  join("packages", "cml", "dist"),
  join("packages", "cml-core", "dist"),
];

const collectDistFiles = (dir: string, out: string[]): void => {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // a package without a dist contributes nothing rather than throwing
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectDistFiles(full, out);
    else if (entry.name.endsWith(".js")) out.push(full);
  }
};

/**
 * A short, stable digest of the current build. Returns `null` when nothing is built — an unbuilt
 * tree cannot be fingerprinted, and refusing to resume on that basis would be a false alarm.
 */
export function computeBuildFingerprint(workspaceRoot: string): string | null {
  const files: string[] = [];
  for (const rel of FINGERPRINT_DIST_ROOTS) collectDistFiles(join(workspaceRoot, rel), files);
  if (files.length === 0) return null;

  files.sort(); // readdir order is filesystem-dependent; the digest must not be
  const hash = createHash("sha256");
  for (const file of files) {
    try {
      const st = statSync(file);
      hash.update(`${file.slice(workspaceRoot.length)}:${st.size}:${Math.floor(st.mtimeMs)}\n`);
    } catch {
      // Raced with a rebuild mid-walk. Fold the absence in rather than crashing — a torn read
      // yields a different digest, which is the correct outcome: it IS a changed build.
      hash.update(`${file.slice(workspaceRoot.length)}:missing\n`);
    }
  }
  return `${files.length}-${hash.digest("hex").slice(0, 16)}`;
}

const fingerprintPath = (workerAppRoot: string, runId: string): string =>
  join(workerAppRoot, "logs", `run-fingerprint-${runId}.json`);

/**
 * Record the build a run executed under. Best-effort by design: failing to write a diagnostic
 * sidecar must never abort a real run — it would trade a £1.50 story for a logging problem.
 */
export function writeRunFingerprint(
  workerAppRoot: string,
  runId: string,
  fingerprint: string | null,
): void {
  if (!fingerprint) return;
  try {
    mkdirSync(join(workerAppRoot, "logs"), { recursive: true });
    writeFileSync(
      fingerprintPath(workerAppRoot, runId),
      JSON.stringify({ runId, fingerprint, recordedAt: new Date().toISOString() }, null, 2),
      "utf8",
    );
  } catch {
    /* best-effort */
  }
}

export function readRunFingerprint(workerAppRoot: string, runId: string): string | null {
  try {
    const raw = JSON.parse(readFileSync(fingerprintPath(workerAppRoot, runId), "utf8"));
    return typeof raw?.fingerprint === "string" ? raw.fingerprint : null;
  } catch {
    return null;
  }
}

export type FingerprintVerdict =
  | { ok: true; reason: "match" | "no_baseline" | "not_built"; detail: string }
  | { ok: false; reason: "mismatch"; detail: string };

/**
 * Compare the build that produced the artifacts against the build about to consume them.
 *
 * An UNKNOWN baseline is allowed through with a reason: runs from before this guard existed have no
 * sidecar, and refusing every one of them would make resume useless on exactly the backlog of dead
 * runs it was built for. A KNOWN mismatch is refused — that is the case where silence is expensive.
 */
export function checkBuildFingerprint(
  recorded: string | null,
  current: string | null,
): FingerprintVerdict {
  if (!current) return { ok: true, reason: "not_built", detail: "no dist found; cannot fingerprint" };
  if (!recorded) {
    return {
      ok: true,
      reason: "no_baseline",
      detail: "original run recorded no build fingerprint; resuming unverified",
    };
  }
  if (recorded === current) return { ok: true, reason: "match", detail: recorded };
  return {
    ok: false,
    reason: "mismatch",
    detail: `artifacts were produced by build ${recorded}, current build is ${current} — rebuild happened since the run died`,
  };
}
