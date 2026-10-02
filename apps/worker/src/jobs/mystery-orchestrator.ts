/**
 * Mystery Generation Orchestrator — Thin Coordinator
 *
 * Delegates all per-agent logic to apps/worker/src/jobs/agents/.
 * Each runAgentN() mutates the shared OrchestratorContext in place.
 *
 * Pipeline:
 *   Agent1 (Setting) → Agent2 (Cast) → Agent2e (Background Context)
 *   → Agent3b (Hard Logic Devices) → Agent3 (CML + Agent4 auto-revision)
 *   → Agent5 (Clue Distribution) → Agent6 (Fair Play + clue loop)
 *   → Agent2b (Character Profiles) → Agent2c (Location Profiles)
 *   → Agent2d (Temporal Context) → [CML Validation Gate]
 *   → Agent6.5 (World Builder) → Agent7 (Narrative Outline)
 *   → Agent9 (Prose + Release Gate)
 */

import { readBooleanFlag } from "@cml/cml";
import { artifactPersister } from "./artifact-persistence.js";
import { recordRunEnvironment } from "./run-config.js";
import { join } from "path";
import { promises as dns } from "dns";
import { resolveWorkerRuntimePaths } from "./runtime-paths.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
// Final-story rubric scoring (aligning-the-scoring-system.md) — ORC-07: its own module.
// Agent 5 redesign shadow (10_agent_5 §9.1) — derived slots vs shipped clues; its own module (A5-Q07).
import { runClueSpecShadow } from "./clue-contracts/clue-spec-shadow.js";
import type { CaseData } from "@cml/cml";
import { loadSeedCMLFiles } from "@cml/prompts-llm";
import {
  ScoreAggregator,
  RetryManager,
  FileReportRepository,
} from "@cml/story-validation";
import type { GenerationReport } from "@cml/story-validation";
import { ScoringLogger } from "./scoring-logger.js";
import { RunLogger } from "./run-logger.js";
import { bandRunWarnings } from "./run-warnings.js";
import { evaluateRetryGateGuard } from "./retry-gate-guard.js";
import {
  runAgent1,
  runAgent2,
  runAgent2e,
  runAgent3b,
  runAgent3,
  runAgent5,
  runAgent6,
  runAgent7,
  runAgent65,
  runAgent75,
  runAgent9,
  describeError,
  normalizePrimaryAxis,
  deriveHardLogicDirectives,
  buildNoveltyConstraints,
  type OrchestratorContext,
  type ProseScoringSnapshot,
} from "./agents/index.js";
import { createOrchestratorContext, newProseScoringSnapshot } from "./agents/context.js";
import { assertFlagCapabilities } from "./flag-preflight.js";
import { registerShutdownFlush, clearShutdownFlush } from "../process-guards.js";
import {
  applyResumeBundle,
  computeBuildFingerprint,
  ResumeSkipTracker,
  writeRunFingerprint,
  type ResumeApplication,
  type ResumeStageField,
} from "./resume-hydration.js";

const { workspaceRoot: WORKSPACE_ROOT, workerAppRoot: WORKER_APP_ROOT, examplesRoot: EXAMPLES_ROOT } =
  resolveWorkerRuntimePaths(import.meta.url);

// A_53 P10 (seed-corpus-loaded-and-summarized-per-run): the 14 static seed CMLs are read-only and
// identical every run, but loadSeedCMLFiles re-reads + re-parses them on EVERY generateMystery call —
// wasteful in a canary-loop (many runs per process). Memoize at module scope keyed by the examples
// root. (loadSeedCMLFiles is synchronous, so we cache the parsed array directly.)
const seedEntriesCache = new Map<string, ReturnType<typeof loadSeedCMLFiles>>();
const loadSeedCMLFilesCached = (root: string): ReturnType<typeof loadSeedCMLFiles> => {
  let entries = seedEntriesCache.get(root);
  if (!entries) {
    entries = loadSeedCMLFiles(root);
    seedEntriesCache.set(root, entries);
  }
  return entries;
};

const shouldRunAzureEndpointPreflight = (): boolean => {
  const raw = String(process.env.AZURE_ENDPOINT_PREFLIGHT ?? "true").trim().toLowerCase();
  return !(raw === "0" || raw === "false" || raw === "off" || raw === "no");
};

const resolveAzureEndpointHost = (): string | null => {
  const endpointRaw = String(process.env.AZURE_OPENAI_ENDPOINT ?? "").trim();
  if (!endpointRaw) return null;

  const normalized = /^https?:\/\//i.test(endpointRaw)
    ? endpointRaw
    : `https://${endpointRaw}`;

  try {
    const url = new URL(normalized);
    return url.hostname || null;
  } catch {
    return null;
  }
};

const preflightAzureEndpointDns = async (params: {
  stageLabel: string;
  reportProgress: (stage: MysteryGenerationProgress["stage"], message: string, percentage: number) => void;
  warnings: string[];
}): Promise<void> => {
  if (!shouldRunAzureEndpointPreflight()) return;

  const host = resolveAzureEndpointHost();
  if (!host) {
    params.warnings.push(
      `Azure endpoint preflight skipped before ${params.stageLabel}: AZURE_OPENAI_ENDPOINT is missing or invalid.`
    );
    return;
  }

  params.reportProgress(
    params.stageLabel === "prose" ? "prose" : "narrative",
    `Preflight: resolving Azure endpoint host (${host})`,
    params.stageLabel === "prose" ? 95 : 70,
  );

  try {
    await dns.lookup(host);
  } catch (error) {
    throw new Error(
      `[INFRA_PRECHECK] Azure endpoint DNS resolution failed before ${params.stageLabel}: ${host} (${describeError(error)})`
    );
  }
};

// Public types — jobs/run-contract.ts (ORC-06); re-exported so importers keep this path.
export type { MysteryGenerationInputs, MysteryGenerationProgress, MysteryGenerationResult, ProgressCallback, ArtifactCallback } from "./run-contract.js";
import type { MysteryGenerationInputs, MysteryGenerationProgress, MysteryGenerationResult, ProgressCallback, ArtifactCallback } from "./run-contract.js";
import {
  applyEarlyStructuralAbort,
  applyFairPlayBindingGate,
  applyNoveltyBindingGate,
  deriveStructuralBlockingFairPlayViolations,
  evaluateEarlyStructuralAbort,
  runCmlPreProseGate,
} from "./pipeline/gates.js";
import {
  applyCrossRunNoveltyConstraints,
  assembleCharacterBundleStage,
  runProfileStages,
} from "./pipeline/stages.js";
import {
  buildScoringReport,
  recordCrossRunNovelty,
  runRubricAndContentFilter,
  writeRunCorpusSnapshot,
} from "./pipeline/finalize.js";
import {
  recordAbortedRun,
} from "./pipeline/abort.js";
// Re-exported so existing importers of this module keep their path.
export {
  assembleCharacterBundle,
} from "./pipeline/stages.js";

// ============================================================================
// Pillar 2 — Character Bundle Assembler
// ============================================================================

/**
 * SCO-Q08 (owner decision 8): the report is the durable record of every run (ADR-0010), so its machinery always
 * exists; ENABLE_SCORING decides only whether phases are scored (every phase-score write checks it).
 */
function createRunReporting(enableScoring: boolean, logsDir: string, warnings: string[]) {
  let retryManager: RetryManager | undefined;
  let scoreAggregator: ScoreAggregator | undefined;
  let reportRepository: FileReportRepository | undefined;
  let scoringLogger: ScoringLogger | undefined;
  try {
    retryManager = new RetryManager(join(WORKER_APP_ROOT, "config", "retry-limits.yaml"));
    scoreAggregator = new ScoreAggregator({ mode: "standard" }, retryManager);
    reportRepository = new FileReportRepository(join(WORKSPACE_ROOT, "apps", "api", "data", "reports"));
    scoringLogger = new ScoringLogger(logsDir);
    warnings.push(enableScoring
      ? "Scoring system enabled - tracking quality metrics and retries"
      : "Phase scoring off (ENABLE_SCORING) - the run report is still written");
  } catch (error) {
    warnings.push(`Scoring system initialization failed: ${describeError(error)} - continuing without scoring`);
  }
  return { retryManager, scoreAggregator, reportRepository, scoringLogger };
}

// ============================================================================
// Main Orchestrator
// ============================================================================

export async function generateMystery(
  client: AzureOpenAIClient,
  inputs: MysteryGenerationInputs,
  onProgress?: ProgressCallback,
  onArtifact?: ArtifactCallback
): Promise<MysteryGenerationResult> {
  // ── Outer-scope vars (accessible by catch block) ─────────────────────────
  const startTime = Date.now();
  const runId = inputs.runId || `mystery-${Date.now()}`;
  const projectId = inputs.projectId;
  const agentCosts: Record<string, number> = {};
  const agentDurations: Record<string, number> = {};
  const warnings: string[] = [];
  const errors: string[] = [];

  // REVIEW_02 §4.2 — refuse an impossible flag combination HERE, at t=0, rather than discovering it
  // as a 400 at stage 13 with the upstream spend already committed. Deliberately before the run
  // fingerprint and any agent: nothing has been produced yet, so nothing is lost.
  warnings.push(...assertFlagCapabilities());

  const enableScoring = readBooleanFlag("ENABLE_SCORING", false); // ORC-D07: `=1` read as off; owner decision 9's vocabulary ("y"/"n" no longer)

  const logsDir = join(WORKER_APP_ROOT, "logs");
  const runLogger = new RunLogger(logsDir, runId, projectId);

  // R5 — stamp the build this run executes under, before any stage produces an artifact. Read back
  // on resume to refuse mixing generations of code (see checkBuildFingerprint). Written here rather
  // than at the end because the runs worth resuming are precisely the ones that never reach the end.
  writeRunFingerprint(WORKER_APP_ROOT, runId, computeBuildFingerprint(WORKSPACE_ROOT));

  const { retryManager, scoreAggregator, reportRepository, scoringLogger } = createRunReporting(enableScoring, logsDir, warnings);

  recordRunEnvironment(WORKER_APP_ROOT, runId, scoreAggregator); // CR-22: the flag environment this run saw
  const reportProgress = (
    stage: MysteryGenerationProgress["stage"],
    message: string,
    percentage: number
  ) => {
    if (onProgress) {
      onProgress({ stage, message, percentage, timestamp: new Date() });
    }
    runLogger.logProgress(stage, message, warnings, errors);
  };

  /**
   * A_71 — an unfinished snapshot must never read as a run result.
   *
   * A_70 §4 fixed ONE exit path: `markStaleInProgressReport` stamps the truth when report
   * finalization throws. Every other way a run can end — a crash, a hard-stop whose own save
   * fails, the 0xC0000409 process abort of A_70 §8.5, a power loss — left the partial exactly as
   * written: `run_outcome: passed`, `overall_score: 96`, `phases: 13/13`. MEASURED: 7 of the 9
   * reports on disk are stranded partials of that shape.
   *
   * The structural fix is to make the artifact honest AT WRITE TIME rather than to add another
   * cleanup path for each new way a process can die. A partial now says what it is in the same
   * fields a naive reader looks at first.
   */
  const savePartialReport = async () => {
    if (!scoreAggregator || !reportRepository) return;
    try {
      const partial = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
        scoring_enabled: enableScoring,
      });
      Object.assign(partial as any, {
        in_progress: true,
        incomplete: true,
        incomplete_reason:
          "Live snapshot written while the run was still executing. Scores cover only the phases " +
          "completed so far and MUST NOT be read as a run result.",
        passed: false,
        run_outcome: "in_progress",
        run_outcome_reason: "Run still in progress when this snapshot was written",
        scoring_outcome: {
          ...(((partial as any).scoring_outcome as Record<string, unknown>) ?? {}),
          passed_threshold: false,
        },
      });
      await reportRepository.save(partial);
    } catch {
      /* best-effort */
    }
  };

  /**
   * A_73 Part IV §1 — hand the process guards this run's flush.
   *
   * `savePartialReport` is a closure over `scoreAggregator` and `reportRepository`, so there is no
   * module-level "current run" a signal handler could reach. Registering it here (and clearing it in
   * this function's `finally`) is the whole coupling: on an unhandled rejection, an uncaught
   * exception, or a Ctrl-C, the guards call exactly the writer A_71 §1.1 made honest, instead of the
   * process vanishing with the run's only record unwritten.
   */
  registerShutdownFlush(runId, savePartialReport);

  /**
   * A_70 §4 — stamp terminal "this run never finished" markers onto the surviving partial snapshot.
   *
   * Mirrors the field set the API applies on read (A_44 R5a `finalizeStaleInProgressReport`) so a
   * direct-file reader and an API reader agree about the same run. Keeps `in_progress: true` so the
   * repository still excludes it from listings. Best-effort: any failure is swallowed.
   */
  const markStaleInProgressReport = async (reason: string): Promise<void> => {
    if (!scoreAggregator || !reportRepository) return;
    try {
      const partial = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
        scoring_enabled: enableScoring,
      });
      Object.assign(partial as any, {
        in_progress: true,
        stale: true,
        stale_reason: "report_finalization_failed",
        incomplete: true,
        incomplete_reason:
          `Run ended before the report was finalized (report generation failed: ${reason}). ` +
          `Scores below cover only the phases that completed and MUST NOT be read as a run result.`,
        passed: false,
        run_outcome: "aborted",
        scoring_outcome: {
          ...(((partial as any).scoring_outcome as Record<string, unknown>) ?? {}),
          passed_threshold: false,
        },
      });
      await reportRepository.save(partial);
    } catch {
      /* best-effort — a failed marking must never fail the run */
    }
  };

  const proseScoringSnapshot: ProseScoringSnapshot = newProseScoringSnapshot();

  let ctx: OrchestratorContext | undefined;

  try {
    // ── Resolve init-time settings ──────────────────────────────────────────
    const resolveLocationPreset = (preset?: string) => {
      switch ((preset || "").toLowerCase()) {
        case "countryhouse":
          return { location: "Country house estate", institution: "Manor house" };
        case "seasidehotel":
          return { location: "Seaside hotel", institution: "Hotel" };
        case "village":
          return { location: "Rural village", institution: "Village" };
        case "liner":
          return { location: "Ocean liner", institution: "Passenger liner" };
        case "theatre":
          return { location: "Theatre district", institution: "Theatre" };
        default:
          return { location: preset || "Unspecified Location", institution: "Estate" };
      }
    };

    const locationSpec = resolveLocationPreset(inputs.locationPreset);
    // Normalise BEFORE deriving. These two ran the other way round, so the family seeding read the
    // caller's raw spelling against a switch written in the canonical vocabulary — a second reason
    // (on top of the silent coercion) that three of the five axes contributed no mechanism families.
    // An unknown axis now throws HERE, at init, before any paid call.
    const primaryAxis = normalizePrimaryAxis(inputs.primaryAxis, (message) => {
      warnings.push(`[axis] ${message}`);
    });
    const initialHardLogicDirectives = deriveHardLogicDirectives(
      inputs.theme,
      primaryAxis,
      inputs.locationPreset
    );
    const seedEntries = loadSeedCMLFilesCached(EXAMPLES_ROOT);
    // A_79 B — the axis is passed so same-axis seeds lead the diverge-from list. Downstream the merge
    // reserves only three seed slots; which three had been fixed by alphabetical order.
    let noveltyConstraints = buildNoveltyConstraints(
      seedEntries as Array<{ filename: string; cml: CaseData }>,
      primaryAxis
    );
    // Cross-run novelty (ANALYSIS_49 T1.7, opt-in via NOVELTY_CROSS_RUN): fold the most recent shipped
    // runs into the avoidance constraints so Agent 3 diverges from recent runs, not just static seeds.
    noveltyConstraints = await applyCrossRunNoveltyConstraints(noveltyConstraints, warnings);

    // ── Build shared context ────────────────────────────────────────────────
    ctx = createOrchestratorContext({
      client,
      inputs,
      runId,
      projectId,
      startTime,
      reportProgress,
      savePartialReport,
      enableScoring,
      scoreAggregator,
      retryManager,
      scoringLogger,
      reportRepository,
      runLogger,
      errors,
      warnings,
      agentCosts,
      agentDurations,
      primaryAxis,
      initialHardLogicDirectives,
      locationSpec,
      noveltyConstraints,
      examplesRoot: EXAMPLES_ROOT,
      workerAppRoot: WORKER_APP_ROOT,
      workspaceRoot: WORKSPACE_ROOT,
      seedEntries: seedEntries as Array<{ filename: string; cml: CaseData }>,
      // Held by identity: the failure summary below reads it after Agent 9 has written into it.
      proseScoringSnapshot,
    });

    // ── Retry-gate guard (A_50): at most one retry-bearing enforce gate per run ──
    const retryGateGuard = evaluateRetryGateGuard();
    for (const w of retryGateGuard.warnings) ctx.warnings.push(w);
    if (retryGateGuard.fatal) throw new Error(retryGateGuard.fatal);

    // ── Pipeline ────────────────────────────────────────────────────────────
    // R5 — restore any artifacts carried over from a failed run, then skip the stages they satisfy.
    const skippedStages: ResumeStageField[] = [];
    let resumeApplication: ResumeApplication | null = null;
    if (inputs.resumeArtifacts && Object.keys(inputs.resumeArtifacts).length > 0) {
      const applied = applyResumeBundle(ctx as OrchestratorContext, inputs.resumeArtifacts);
      resumeApplication = applied;
      warnings.push(
        `[R5] Resuming from run ${inputs.resumeFromRunId ?? "(unknown)"} — restored ${applied.restored.length} artifact(s): ${applied.restored.join(", ") || "none"}.`,
      );
      if (applied.skippedEmpty.length > 0) {
        warnings.push(`[R5] Ignored empty artifact(s), these stages will re-run: ${applied.skippedEmpty.join(", ")}.`);
      }
      if (applied.unknown.length > 0) {
        warnings.push(`[R5] Ignored unrecognised artifact key(s): ${applied.unknown.join(", ")}.`);
      }
    }

    /**
     * Run a stage unless its artifact is already present. One guard for every stage so resume,
     * normal execution, and the reporting of what was skipped all share a single code path.
     *
     * The tracker enforces CONTIGUOUS-PREFIX skipping. A per-stage `isStageSatisfied` check is not
     * enough: a store holding `hard_logic_devices` but not `cml` would skip Agent 3b and then run
     * Agent 3, which reads `ctx.hardLogicDirectives` — state only Agent 3b writes — and crashes.
     * Once any stage runs, everything after it runs too.
     */
    const skipTracker = new ResumeSkipTracker();
    const stage = async (
      field: ResumeStageField,
      run: (c: OrchestratorContext) => Promise<void>,
    ): Promise<void> => {
      // ctx is assigned above; the closure defers execution so TS cannot narrow it for us.
      const c = ctx as OrchestratorContext;
      if (skipTracker.shouldSkip(c, field)) {
        skippedStages.push(field);
        return;
      }
      await run(c);
    };

    /**
     * A binding gate whose input was never produced must report that it could not evaluate.
     *
     * `ctx.noveltyAudit?.blocking` and `ctx.coverageResult?.hasCriticalGaps` both read `undefined`
     * as "nothing wrong". On a fresh run that is correct — the stage ran and found nothing. On a
     * resumed run where the producing stage was SKIPPED it is a silent bypass of a gate, which is
     * the failure class this project has paid most for. Warn per signal, once, loudly.
     */
    // Called after the pipeline, when the tracker actually holds the skip record — calling it here,
    // before any stage has run, would always report nothing.
    const noteDegradedResumeSignals = (): void => {
      for (const [field, missing] of skipTracker.degraded) {
        warnings.push(
          `[R5] Stage '${field}' was restored from artifacts, so its derived signal(s) ` +
            `${missing.join(", ")} are UNAVAILABLE this run. Any gate reading them did not pass — ` +
            `it could not be evaluated. Treat this run as weaker evidence than a fresh one.`,
        );
      }
    };

    const persistArtifact = artifactPersister(onArtifact, warnings); // ORC-D13

    await stage("setting", (c) => runAgent1(c));            // Era & Setting Refiner
    await persistArtifact("setting", ctx.setting);
    await stage("cast", (c) => runAgent2(c));               // Cast & Motive Designer
    await persistArtifact("cast", ctx.cast);
    await stage("backgroundContext", (c) => runAgent2e(c)); // Background Context
    await persistArtifact("background_context", ctx.backgroundContext);
    await stage("hardLogicDevices", (c) => runAgent3b(c));  // Hard-Logic Device Ideation
    await persistArtifact("hard_logic_devices", ctx.hardLogicDevices);
    await stage("cml", (c) => runAgent3(c));                // CML Generator (+ Agent 4 auto-revision)
    await persistArtifact("cml", ctx.cml);

    // ── Pillar 3 (Unit 3.2): Novelty binding gate ───────────────────────────
    applyNoveltyBindingGate(ctx);

    await stage("clues", (c) => runAgent5(c));              // Clue Distributor
    await persistArtifact("clues", ctx.clues);
    runClueSpecShadow({ cml: ctx.cml, clues: ctx.clues, warnings }); // shadow: log derived-vs-shipped coverage
    await stage("fairPlayAudit", (c) => runAgent6(c));      // Fair-Play Auditor + clue refinement loop
    await persistArtifact("fair_play_report", ctx.fairPlayAudit);

    // ── Pillar 3 (Unit 3.2): Fair-play binding gate ──────────────────────────
    applyFairPlayBindingGate(ctx);

    applyEarlyStructuralAbort(ctx);

    // ── R9 (architecture/REVIEW_01.md) — the profile trio ───────────────────────
    // 2b/2c/2d are independent reads off the FROZEN CML: each writes a distinct artifact key
    // (characterProfiles / locationProfiles / temporalContext) and reads only upstream state that
    // is already settled (cml, cast, setting, backgroundContext). Anthropic's parallelisation
    // pattern ("sectioning") is exactly this shape, and they run sequentially today for no
    // structural reason.
    //
    // TWO HAZARDS, both handled below rather than hoped away:
    //   1. `ctx.savePartialReport` writes ONE file. Three concurrent calls race on it. Suppressed
    //      inside the block; one snapshot is taken after.
    //   2. `ctx.warnings` is a shared array. Concurrent pushes interleave non-deterministically,
    //      which would make run-to-run diffs unreadable. Each agent gets a private buffer, merged
    //      back in fixed 2b → 2c → 2d order.
    // Object mutation itself is safe under Node's single-threaded event loop; agentCosts and
    // agentDurations are shared by reference through the shallow clone, so they need no merge.
    //
    // Flag-gated default-OFF: this is a behaviour change (concurrency + error semantics), and the
    // corpus regime says those get probed, not assumed. Acceptance is byte-identical artifacts on a
    // fixed premise — verify before promoting.
    await runProfileStages(ctx, skipTracker, skippedStages, stage);
    await persistArtifact("character_profiles", ctx.characterProfiles);
    await persistArtifact("location_profiles", ctx.locationProfiles);
    await persistArtifact("temporal_context", ctx.temporalContext);

    // ── CML Validation Gate ─────────────────────────────────────────────────
    // Prevents spending prose-generation cost on broken mystery structure.
    runCmlPreProseGate(ctx);

    // ── World Builder + Narrative Outline ───────────────────────────────────
    await stage("worldDocument", (c) => runAgent65(c));     // World Document synthesis
    await persistArtifact("world_document", ctx.worldDocument);

    // ── Pillar 2 (Unit 2.1): Assemble Character Context Bundle ────────────────
    assembleCharacterBundleStage(ctx);

    await preflightAzureEndpointDns({
      stageLabel: "narrative",
      reportProgress,
      warnings,
    });

    await stage("narrative", (c) => runAgent7(c));          // Narrative Outliner
    await persistArtifact("outline", ctx.narrative);

    // ── Agent 7.5: Story Geometry ───────────────────────────────────────────
    // The manuscript contract, derived after the outline and binding on prose
    // (architecture/GEOMETRY-AGENT-DESIGN.md). Called directly rather than through `stage()`: the
    // stage guard enforces a contiguous skip prefix, and this stage legitimately produces nothing
    // when `AGENT75_GEOMETRY=off` — which would close the prefix and force prose to re-run on every
    // resume. Its artifact is restored by `applyResumeBundle` regardless, and `runAgent75` returns
    // early when the contract is already on ctx. Never throws (ADR-0003).
    if (await runAgent75(ctx)) await persistArtifact("outline", ctx.narrative); // A7-D09: re-persist a gate-mode repair
    await persistArtifact("story_geometry", ctx.storyGeometry);

    // ── Unit 1.5: Locked-fact consistency gate ───────────────────────────────
    if (inputs.enableLockedFactGate && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0 && ctx.narrative) {
      const narrJson = JSON.stringify(ctx.narrative);
      for (const fact of ctx.lockedFactRegistry) {
        if (fact.value && !narrJson.includes(fact.value)) {
          ctx.warnings.push(`Locked-fact consistency gate [warning]: locked fact "${fact.id}" value "${fact.value}" not found verbatim in narrative outline — Agent 9 will enforce via prose generation`);
        }
      }
    }

    // ── Prose Generation + Release Gate ─────────────────────────────────────
    await preflightAzureEndpointDns({
      stageLabel: "prose",
      reportProgress,
      warnings,
    });

    await stage("prose", (c) => runAgent9(c));
    await persistArtifact("prose", ctx.prose);

    // R5 — now that every stage has been decided, name any derived signal a skip cost us.
    noteDegradedResumeSignals();

    // Final-story rubric (shadow): score the finished prose with the LLM critic + cap engine, log it,
    // and attach it to the report as a diagnostic. Never throws into the run.
    await runRubricAndContentFilter(ctx);

    // ── Complete ─────────────────────────────────────────────────────────────
    const totalDurationMs = Date.now() - startTime;
    const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
    reportProgress("complete", "Mystery generation complete!", 100);
    runLogger.logComplete("complete", Date.now() - startTime, warnings, errors);

    let scoringReport: GenerationReport | undefined;
    scoringReport = await buildScoringReport(enableScoring, scoreAggregator, reportRepository, scoringLogger, resumeApplication, inputs, skippedStages, skipTracker, warnings, scoringReport, runId, startTime, projectId, markStaleInProgressReport);

    // A_65b Ph2 — status counts DEFECT-band warnings only: a run whose lines are all telemetry
    // ("Scoring system enabled", shadow scores, pre-audit PASS) reads clean, as it should.
    const status =
      errors.length > 0
        ? "failure"
        : bandRunWarnings(warnings).warn.length > 0
          ? "warning"
          : "success";

    // Cross-run novelty (ANALYSIS_49 T1.7): record this shipped run's fingerprint so future runs
    // diverge from it. Best-effort — never affects the run outcome.
    /**
     * A_74 §8 DE1 — THIS BLOCK HAD TWO SILENCES AND BOTH BIT.
     *
     * The ledger file's mtime was 2026-08-24 while two runs had shipped on 08-25, and nothing in
     * either run's output said why. There were only two ways that could happen and neither announced
     * itself: a `status === "failure"` run is skipped, and any write error was swallowed by an empty
     * catch. Both are now logged.
     *
     * The skip is worth more than a log line, because it is SURVIVORSHIP BIAS in the corpus. A run
     * that tripped a gate is exactly the run the next one should be diverging from; excluding it means
     * "diverge from recent runs" silently means "diverge from recent CLEAN runs". The behaviour is
     * kept — a failed run's CML may be half-built and recording it could poison the corpus — but it is
     * no longer invisible, and the count it prints is what tells a reader the corpus is smaller than
     * the number of runs they remember.
     */
    await recordCrossRunNovelty(ctx, status);

    // A_67 FIX-3 — per-run corpus snapshot (best-effort; gated by CORPUS_SNAPSHOT_DIR, no-op when unset).
    // The live store retains only the latest project; this accumulates a corpus so the plant→payoff
    // measure (scripts/reveal-cites-plants-coverage.mjs) can be run over many stories. Never affects the run.
    writeRunCorpusSnapshot(status, ctx);

    return {
      cml: ctx.cml!,
      clues: ctx.clues!,
      fairPlayAudit: ctx.fairPlayAudit!,
      narrative: ctx.narrative!,
      characterProfiles: ctx.characterProfiles!,
      locationProfiles: ctx.locationProfiles!,
      temporalContext: ctx.temporalContext!,
      worldDocument: ctx.worldDocument,
      backgroundContext: ctx.backgroundContext!,
      hardLogicDevices: ctx.hardLogicDevices!,
      prose: ctx.prose!,
      noveltyAudit: ctx.noveltyAudit,
      validationReport: ctx.validationReport!,
      scoringReport,
      setting: ctx.setting!,
      cast: ctx.cast!,
      metadata: {
        runId,
        projectId,
        totalCost,
        totalDurationMs,
        agentCosts,
        agentDurations,
        revisedByAgent4: ctx.revisedByAgent4,
        revisionAttempts: ctx.revisionAttempts,
        revisedByAgent4FairPlay: ctx.revisedByAgent4FairPlay,
        fairPlayRevisionAttempts: ctx.fairPlayRevisionAttempts,
      },
      status,
      warnings,
      errors,
    };
  } catch (error) {
    const errorMessage = describeError(error);
    errors.push(`Pipeline failure: ${errorMessage}`);

    const templateLinterAbortDetected = /template\s*linter/i.test(errorMessage);

    await recordAbortedRun(enableScoring, scoreAggregator, scoringLogger, proseScoringSnapshot, agentDurations, templateLinterAbortDetected, errorMessage, agentCosts, inputs, error, runId, projectId, reportRepository, startTime);

    runLogger.logComplete("failed", Date.now() - startTime, warnings, errors);
    const failureError = new Error(`Mystery generation failed: ${errorMessage}`);
    (failureError as any).partialArtifacts = {
      runId,
      projectId,
      setting: ctx?.setting,
      cast: ctx?.cast,
      backgroundContext: ctx?.backgroundContext,
      hardLogicDevices: ctx?.hardLogicDevices,
      cml: ctx?.cml,
      clues: ctx?.clues,
      fairPlayAudit: ctx?.fairPlayAudit,
      narrative: ctx?.narrative,
      failedNarrative: ctx?.failedNarrative,
      characterProfiles: ctx?.characterProfiles,
      locationProfiles: ctx?.locationProfiles,
      temporalContext: ctx?.temporalContext,
      worldDocument: ctx?.worldDocument,
      prose: ctx?.prose,
      noveltyAudit: ctx?.noveltyAudit,
      validationReport: ctx?.validationReport,
      warnings: [...warnings],
      errors: [...errors],
    };
    throw failureError;
  } finally {
    // A_73 Part IV §1 — the run is over, one way or another. A stale flush would let a LATER crash
    // rewrite a finished run's report with a snapshot of the run before it.
    clearShutdownFlush(runId);
  }
}

// ============================================================================
// Convenience Function: Generate with Default Settings
// ============================================================================

export async function generateMysterySimple(
  client: AzureOpenAIClient,
  theme: string,
  onProgress?: ProgressCallback
): Promise<MysteryGenerationResult> {
  return generateMystery(
    client,
    {
      theme,
      targetLength: "medium",
      narrativeStyle: "classic",
      skipNoveltyCheck: false,
    },
    onProgress
  );
}

// Test-only exports for deterministic guardrail unit coverage.
export const __testables = {
  deriveStructuralBlockingFairPlayViolations,
  evaluateEarlyStructuralAbort,
};
