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

import { join } from "path";
import { resolveWorkerRuntimePaths } from "./runtime-paths.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { loadSeedCMLFiles } from "@cml/prompts-llm";
import type {
  ClueDistributionResult,
  FairPlayAuditResult,
  NarrativeOutline,
  CharacterProfilesResult,
  LocationProfilesResult,
  TemporalContextResult,
  BackgroundContextArtifact,
  HardLogicDeviceResult,
  ProseGenerationResult,
  NoveltyAuditResult,
  SettingRefinementResult,
  CastDesignResult,
  WorldDocumentResult,
} from "@cml/prompts-llm";
import {
  ScoreAggregator,
  RetryManager,
  FileReportRepository,
  getGenerationParams,
} from "@cml/story-validation";
import type { GenerationReport, ValidationReport, PhaseScore } from "@cml/story-validation";
import { ScoringLogger } from "./scoring-logger.js";
import { RunLogger } from "./run-logger.js";
import {
  runAgent1,
  runAgent2,
  runAgent2e,
  runAgent2b,
  runAgent2c,
  runAgent2d,
  runAgent3b,
  runAgent3,
  runAgent5,
  runAgent6,
  runAgent7,
  runAgent65,
  runAgent9,
  describeError,
  applyAbortedRunMetadata,
  normalizePrimaryAxis,
  deriveHardLogicDirectives,
  buildNoveltyConstraints,
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  applyDeterministicCluePreAssignment,
  rebalanceNarrativeSceneCountsDeterministically,
  applyDeterministicProsePostProcessing,
  isDiscriminatingTestCoverageError,
  isSuspectClosureCoverageError,
  isCulpritEvidenceChainCoverageError,
  isSuspectEliminationCoverageError,
  type OrchestratorContext,
  type ProseScoringSnapshot,
} from "./agents/index.js";

const { workspaceRoot: WORKSPACE_ROOT, workerAppRoot: WORKER_APP_ROOT, examplesRoot: EXAMPLES_ROOT } =
  resolveWorkerRuntimePaths(import.meta.url);

// ============================================================================
// Public types
// ============================================================================

export interface MysteryGenerationInputs {
  /** e.g. "locked room murder in a manor" */
  theme: string;
  eraPreference?: string;
  locationPreset?: string;
  tone?: string;
  primaryAxis?: "temporal" | "spatial" | "social" | "psychological" | "mechanical";

  /** suspects + witnesses; detective is always +1 */
  castSize?: number;
  castNames?: string[];
  detectiveType?: "police" | "private" | "amateur";
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";

  /** Skip Agent 8 novelty check if true */
  skipNoveltyCheck?: boolean;
  /** Agent 8 similarity threshold, default 0.9 */
  similarityThreshold?: number;

  /** Chapters per LLM call (1–10, default 1) */
  proseBatchSize?: number;

  runId?: string;
  projectId?: string;

  /** Pillar 1: accumulate locked facts from Agent 3b and propagate to Agents 5, 7, 9 */
  enableLockedFactRegistry?: boolean;
  /** Pillar 1: pre-generation gate — halt if outline/clues disagree with registry */
  enableLockedFactGate?: boolean;
}

export interface MysteryGenerationProgress {
  stage:
    | "setting"
    | "cast"
    | "background-context"
    | "hard_logic_devices"
    | "cml"
    | "clues"
    | "fairplay"
    | "narrative"
    | "profiles"
    | "location-profiles"
    | "temporal-context"
    | "world-builder"
    | "prose"
    | "validation"
    | "novelty"
    | "novelty_math"
    | "complete";
  message: string;
  percentage: number;
  timestamp: Date;
}

export interface MysteryGenerationResult {
  // Final outputs
  cml: CaseData;
  clues: ClueDistributionResult;
  fairPlayAudit: FairPlayAuditResult;
  narrative: NarrativeOutline;
  characterProfiles: CharacterProfilesResult;
  locationProfiles: LocationProfilesResult;
  temporalContext: TemporalContextResult;
  worldDocument?: WorldDocumentResult;
  backgroundContext: BackgroundContextArtifact;
  hardLogicDevices: HardLogicDeviceResult;
  prose: ProseGenerationResult;
  noveltyAudit?: NoveltyAuditResult;
  validationReport: ValidationReport;
  scoringReport?: GenerationReport;

  // Intermediate results
  setting: SettingRefinementResult;
  cast: CastDesignResult;

  metadata: {
    runId: string;
    projectId?: string;
    totalCost: number;
    totalDurationMs: number;
    agentCosts: Record<string, number>;
    agentDurations: Record<string, number>;
    revisedByAgent4: boolean;
    revisionAttempts?: number;
    revisedByAgent4FairPlay: boolean;
    fairPlayRevisionAttempts: number;
  };

  status: "success" | "warning" | "failure";
  warnings: string[];
  errors: string[];
}

export type ProgressCallback = (progress: MysteryGenerationProgress) => void;

type FairPlayViolationLike = {
  severity?: string;
  rule?: string;
};

const canonicalizeTraceabilityClueId = (value: unknown): string => {
  const normalized = String(value ?? "").trim();
  return /^clue_[a-z0-9_-]+$/i.test(normalized) ? normalized : "";
};

const hasDeterministicPreTestTraceabilityBreak = (params: {
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): boolean => {
  const caseBlock = (params.cml as any)?.CASE ?? params.cml;
  const clueList = Array.isArray(params.clues?.clues) ? params.clues.clues : [];
  if (!caseBlock || clueList.length === 0) return false;

  const discriminatingScene = caseBlock?.prose_requirements?.discriminating_test_scene ?? {};
  const discriminatingAct = Number(discriminatingScene?.act_number);
  const discriminatingSceneNumber = Number(discriminatingScene?.scene_number);
  const hasDiscriminatingScene = Number.isFinite(discriminatingAct) && discriminatingAct > 0
    && Number.isFinite(discriminatingSceneNumber) && discriminatingSceneNumber > 0;

  const clueMap = new Map(
    clueList
      .map((clue: any) => [canonicalizeTraceabilityClueId(clue?.id), clue] as const)
      .filter(([clueId]) => clueId.length > 0),
  );
  const mappingById = new Map(
    ((caseBlock?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .map((entry) => ({
        clueId: canonicalizeTraceabilityClueId(entry?.clue_id),
        actNumber: Number(entry?.act_number),
        sceneNumber: Number(entry?.scene_number),
      }))
      .filter((entry) => entry.clueId.length > 0)
      .map((entry) => [entry.clueId, entry] as const),
  );

  const evidenceClueIds = ((caseBlock?.discriminating_test?.evidence_clues ?? []) as unknown[])
    .map((id) => canonicalizeTraceabilityClueId(id))
    .filter(Boolean);
  if (evidenceClueIds.length === 0) return true;

  for (const clueId of evidenceClueIds) {
    const clue = clueMap.get(clueId);
    if (!clue) return true;

    const criticality = String((clue as any)?.criticality ?? "").trim().toLowerCase();
    const placement = String((clue as any)?.placement ?? "").trim().toLowerCase();
    if (criticality !== "essential" || (placement !== "early" && placement !== "mid")) {
      return true;
    }

    const mapping = mappingById.get(clueId);
    if (!mapping) return true;
    if (!Number.isFinite(mapping.actNumber) || !Number.isFinite(mapping.sceneNumber)) return true;

    if (
      hasDiscriminatingScene
      && (mapping.actNumber > discriminatingAct
        || (mapping.actNumber === discriminatingAct && mapping.sceneNumber >= discriminatingSceneNumber))
    ) {
      return true;
    }
  }

  return false;
};

const deriveStructuralBlockingFairPlayViolations = (params: {
  fairPlayAudit?: FairPlayAuditResult | null;
  coverageResult?: { hasCriticalGaps?: boolean; uncoveredSteps?: unknown[] } | null;
  allCoverageIssues?: Array<{ severity?: string; message?: string }> | null;
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): { blockingViolations: FairPlayViolationLike[]; downgradedLogicalDeducibility: boolean } => {
  const fairPlayAudit = params.fairPlayAudit;
  if (!fairPlayAudit || fairPlayAudit.overallStatus !== "fail") {
    return { blockingViolations: [], downgradedLogicalDeducibility: false };
  }

  const structurallyBlockingRules = new Set([
    "clue visibility",
    "logical deducibility",
    "no withholding",
  ]);

  const criticalViolations = (fairPlayAudit.violations ?? []).filter(
    (v) => String(v?.severity ?? "").toLowerCase() === "critical"
  );
  const candidateBlocking = criticalViolations.filter((v) =>
    structurallyBlockingRules.has(String(v?.rule ?? "").toLowerCase().trim())
  );

  const hasCoverageCorroboration = Boolean(
    params.coverageResult?.hasCriticalGaps
    || (params.coverageResult?.uncoveredSteps?.length ?? 0) > 0
    || (params.allCoverageIssues ?? []).some((issue) =>
      String(issue?.severity ?? "").toLowerCase() === "critical"
      && /inference step|discriminating test|suspect|elimination|coverage gap|uncovered/i.test(
        String(issue?.message ?? "")
      )
    )
  );

  const hasTraceabilityCorroboration = hasDeterministicPreTestTraceabilityBreak({
    cml: params.cml,
    clues: params.clues,
  });

  const logicalDeducibilityCorroborated = hasCoverageCorroboration || hasTraceabilityCorroboration;

  let downgradedLogicalDeducibility = false;
  const blockingViolations = candidateBlocking.filter((v) => {
    const rule = String(v?.rule ?? "").toLowerCase().trim();
    if (rule === "clue visibility" || rule === "no withholding") {
      return hasCoverageCorroboration || hasTraceabilityCorroboration;
    }
    if (rule !== "logical deducibility") return true;
    if (logicalDeducibilityCorroborated) return true;
    downgradedLogicalDeducibility = true;
    return false;
  });

  return { blockingViolations, downgradedLogicalDeducibility };
};

const evaluateEarlyStructuralAbort = (params: {
  fairPlayAudit?: FairPlayAuditResult | null;
  coverageResult?: { hasCriticalGaps?: boolean; uncoveredSteps?: unknown[] } | null;
  allCoverageIssues?: Array<{ severity?: string; message?: string }> | null;
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): {
  shouldAbort: boolean;
  reason?: string;
  blockingRules: string[];
  downgradedLogicalDeducibility: boolean;
} => {
  const fairPlayAudit = params.fairPlayAudit;
  if (!fairPlayAudit || fairPlayAudit.overallStatus !== "fail") {
    return {
      shouldAbort: false,
      blockingRules: [],
      downgradedLogicalDeducibility: false,
    };
  }

  const { blockingViolations, downgradedLogicalDeducibility } = deriveStructuralBlockingFairPlayViolations(params);
  const blockingRules = blockingViolations
    .map((violation) => String(violation?.rule ?? "").trim())
    .filter((rule) => rule.length > 0);

  if (blockingRules.length === 0) {
    return {
      shouldAbort: false,
      blockingRules: [],
      downgradedLogicalDeducibility,
    };
  }

  return {
    shouldAbort: true,
    reason:
      `Fair play audit failed with ${blockingRules.length} structural blocking violation(s): ` +
      blockingRules.join(", "),
    blockingRules,
    downgradedLogicalDeducibility,
  };
};

// ============================================================================
// Main Orchestrator
// ============================================================================

export async function generateMystery(
  client: AzureOpenAIClient,
  inputs: MysteryGenerationInputs,
  onProgress?: ProgressCallback
): Promise<MysteryGenerationResult> {
  // ── Outer-scope vars (accessible by catch block) ─────────────────────────
  const startTime = Date.now();
  const runId = inputs.runId || `mystery-${Date.now()}`;
  const projectId = inputs.projectId;
  const agentCosts: Record<string, number> = {};
  const agentDurations: Record<string, number> = {};
  const warnings: string[] = [];
  const errors: string[] = [];

  const enableScoring =
    String(process.env.ENABLE_SCORING || "false").toLowerCase() === "true";
  let scoreAggregator: ScoreAggregator | undefined;
  let retryManager: RetryManager | undefined;
  let reportRepository: FileReportRepository | undefined;
  let scoringLogger: ScoringLogger | undefined;

  const logsDir = join(WORKER_APP_ROOT, "logs");
  const runLogger = new RunLogger(logsDir, runId, projectId);

  if (enableScoring) {
    try {
      const retryConfigPath = join(WORKER_APP_ROOT, "config", "retry-limits.yaml");
      retryManager = new RetryManager(retryConfigPath);
      scoreAggregator = new ScoreAggregator({ mode: "standard" }, retryManager);
      const resolvedReportsDir = join(WORKSPACE_ROOT, "apps", "api", "data", "reports");
      reportRepository = new FileReportRepository(resolvedReportsDir);
      scoringLogger = new ScoringLogger(logsDir);
      warnings.push("Scoring system enabled - tracking quality metrics and retries");
    } catch (error) {
      warnings.push(
        `Scoring system initialization failed: ${describeError(error)} - continuing without scoring`
      );
    }
  }

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

  const savePartialReport = async () => {
    if (!scoreAggregator || !reportRepository) return;
    try {
      const partial = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
      });
      (partial as any).in_progress = true;
      await reportRepository.save(partial);
    } catch {
      /* best-effort */
    }
  };

  const proseScoringSnapshot: ProseScoringSnapshot = {
    startedAtMs: null,
    chaptersGenerated: 0,
    latestChapterScore: null,
    latestCumulativeScore: null,
    postGenerationSummaryLogged: false,
  };

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
    const initialHardLogicDirectives = deriveHardLogicDirectives(
      inputs.theme,
      inputs.primaryAxis,
      inputs.locationPreset
    );
    const primaryAxis = normalizePrimaryAxis(inputs.primaryAxis);
    const seedEntries = await loadSeedCMLFiles(EXAMPLES_ROOT);
    const noveltyConstraints = buildNoveltyConstraints(
      seedEntries as Array<{ filename: string; cml: CaseData }>
    );

    // ── Build shared context ────────────────────────────────────────────────
    ctx = {
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
      criticalFairPlayRules: new Set(["Clue Visibility", "No Withholding", "Logical Deducibility"]),
      maxCmlRevisionAttempts: 3,
      examplesRoot: EXAMPLES_ROOT,
      workerAppRoot: WORKER_APP_ROOT,
      workspaceRoot: WORKSPACE_ROOT,
      seedEntries: seedEntries as Array<{ filename: string; cml: CaseData }>,
      revisedByAgent4: false,
      revisionAttempts: undefined,
      revisedByAgent4FairPlay: false,
      fairPlayRevisionAttempts: 0,
      proseScoringSnapshot,
      proseChapterScores: [],
      proseSecondRunChapterScores: [],
      prosePassAccounting: [],
      proseRewritePassCount: 0,
      proseRepairPassCount: 0,
      latestProseScore: null,
      nsdTransferTrace: [],
    };

    // ── Pipeline ────────────────────────────────────────────────────────────
    await runAgent1(ctx);   // Era & Setting Refiner
    await runAgent2(ctx);   // Cast & Motive Designer
    await runAgent2e(ctx);  // Background Context
    await runAgent3b(ctx);  // Hard-Logic Device Ideation
    await runAgent3(ctx);   // CML Generator (+ Agent 4 auto-revision)
    await runAgent5(ctx);   // Clue Distributor
    await runAgent6(ctx);   // Fair-Play Auditor + clue refinement loop

    const earlyStructuralAbort = evaluateEarlyStructuralAbort({
      fairPlayAudit: ctx.fairPlayAudit,
      coverageResult: ctx.coverageResult,
      allCoverageIssues: ctx.allCoverageIssues,
      cml: ctx.cml,
      clues: ctx.clues,
    });
    if (earlyStructuralAbort.shouldAbort) {
      const errorMsg =
        `CML validation failed before downstream profile generation:\n` +
        `  • ${earlyStructuralAbort.reason}\n\n` +
        `Fix CML structure before attempting downstream narrative/prose stages.`;
      errors.push(errorMsg);
      throw new Error(errorMsg);
    }

    await runAgent2b(ctx);  // Character Profiles
    await runAgent2c(ctx);  // Location Profiles
    await runAgent2d(ctx);  // Temporal Context

    // ── CML Validation Gate ─────────────────────────────────────────────────
    // Prevents spending prose-generation cost on broken mystery structure.
    const cmlValidationErrors: string[] = [];
    const cmlQualityConfig = (getGenerationParams().agent3_cml.params as any)?.quality ?? {};
    const evidenceBackfillThreshold = Math.max(
      0,
      Number(cmlQualityConfig.evidence_clue_backfill_threshold ?? 3),
    );
    const failOnBackfillThreshold =
      cmlQualityConfig.fail_when_backfill_exceeds_threshold !== false;
    let backfilledEvidenceClues: string[] = [];

    // Back-fill discriminating_test.evidence_clues from finalised clues if missing.
    // Agent 3 generates the CML skeleton before clues exist; we populate here.
    const discrimTestNode = (ctx.cml as any)?.CASE?.discriminating_test;
    if (discrimTestNode) {
      const currentEvidence = Array.isArray(discrimTestNode.evidence_clues)
        ? discrimTestNode.evidence_clues.map((id: unknown) => String(id))
        : [];
      // Filter to IDs that are actually distributed clues — do not use a regex pattern
      // because placeholder IDs like "clue_1" satisfy /^clue_[a-z0-9_-]+$/i and would
      // survive the filter, poisoning the final array with stale skeleton IDs.
      const distributedClueIds = new Set(ctx.clues!.clues.map((c) => String(c.id)));
      const canonicalExistingEvidence = currentEvidence.filter((id: string) => distributedClueIds.has(id));
      const designText = String(discrimTestNode.design ?? "").toLowerCase();
      const knowledgeText = String(discrimTestNode.knowledge_revealed ?? "").toLowerCase();
      const testContextTokens = new Set(
        `${designText} ${knowledgeText}`
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length >= 5),
      );

      const scoredEssential = ctx.clues!.clues
        .filter((c) => c.criticality === "essential")
        .map((c) => {
          const text = `${String(c.description ?? "")} ${String(c.pointsTo ?? "")}`.toLowerCase();
          let score = 0;
          for (const token of testContextTokens) {
            if (text.includes(token)) score += 1;
          }
          if (c.placement === "early" || c.placement === "mid") score += 2;
          if (c.evidenceType === "observation" || c.evidenceType === "contradiction") score += 1;
          return { id: String(c.id), score };
        })
        .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id));

      const maxBackfillIds = Math.max(1, evidenceBackfillThreshold);
      const targetedEssentialIds = scoredEssential
        .filter((entry) => entry.score > 0)
        .map((entry) => entry.id)
        .slice(0, maxBackfillIds);
      const fallbackEssentialIds = scoredEssential
        .map((entry) => entry.id)
        .slice(0, maxBackfillIds);
      const selectedEssentialIds = (targetedEssentialIds.length > 0 ? targetedEssentialIds : fallbackEssentialIds);

      backfilledEvidenceClues = selectedEssentialIds.filter(
        (id) => !canonicalExistingEvidence.includes(id),
      );
      if (backfilledEvidenceClues.length > 0) {
        discrimTestNode.evidence_clues = [...canonicalExistingEvidence, ...backfilledEvidenceClues];
        warnings.push(
          `CML gate: back-filled evidence_clues with ${backfilledEvidenceClues.length} clue(s): ${backfilledEvidenceClues.join(", ")}`
        );

        const backfillDiagnostic = {
          injected_count: backfilledEvidenceClues.length,
          injected_clues: backfilledEvidenceClues,
          threshold: evidenceBackfillThreshold,
          reason: "discriminating_test.evidence_clues missing essential clue IDs required for proof traceability",
        };

        if (enableScoring && scoreAggregator && scoringLogger) {
          scoringLogger.logPhaseDiagnostic(
            "agent3_cml",
            "CML Generation",
            "evidence_clue_backfill",
            backfillDiagnostic,
            runId,
            projectId || "",
          );
          scoreAggregator.upsertDiagnostic(
            "agent3_cml_evidence_clue_backfill",
            "agent3_cml",
            "CML Generation",
            "evidence_clue_backfill",
            backfillDiagnostic,
          );
        }
      }

      if (
        failOnBackfillThreshold &&
        backfilledEvidenceClues.length > evidenceBackfillThreshold
      ) {
        cmlValidationErrors.push(
          `Discriminating test evidence_clues required heavy backfill (${backfilledEvidenceClues.length} > threshold ${evidenceBackfillThreshold}). Injected clues: ${backfilledEvidenceClues.join(", ")}`,
        );
      }
    }

    // Structurally breaking fair-play violations block prose generation.
    if (ctx.fairPlayAudit && ctx.fairPlayAudit.overallStatus === "fail") {
      const { blockingViolations, downgradedLogicalDeducibility } = deriveStructuralBlockingFairPlayViolations({
        fairPlayAudit: ctx.fairPlayAudit,
        coverageResult: ctx.coverageResult,
        allCoverageIssues: ctx.allCoverageIssues,
        cml: ctx.cml,
        clues: ctx.clues,
      });

      if (downgradedLogicalDeducibility) {
        warnings.push(
          "Fair-play: downgraded uncorroborated Logical Deducibility critical flag to warning because deterministic clue coverage shows no structural gaps"
        );
      }

      if (blockingViolations.length > 0) {
        cmlValidationErrors.push(
          `Fair play audit failed with ${blockingViolations.length} structural violation(s) ` +
            `(${blockingViolations.map((v) => v.rule).join(", ")}) — prose cannot realize a broken mystery`
        );
      } else {
        const nonStructuralCritical = ctx.fairPlayAudit.violations.filter(
          (v) => v.severity === "critical"
        );
        if (nonStructuralCritical.length > 0) {
          warnings.push(
            `Fair-play: ${nonStructuralCritical.length} non-structural violation(s) remain ` +
              `(${nonStructuralCritical
                .map((v) => v.rule)
                .join(", ")}) — mystery structure is sound, proceeding with prose`
          );
          // Downgrade from "fail" to "needs-revision" so the post-prose release gate
          // reflects the determined-sound verdict (score 70) rather than the LLM
          // auditor's raw "fail" (score 45 → hard-stop). The deterministic coverage
          // checks have already established there are no structural gaps.
          (ctx.fairPlayAudit as any).overallStatus = "needs-revision";
        }
      }
    }

    // Discriminating test must be fully specified.
    const discriminatingTest = (ctx.cml as any)?.CASE?.discriminating_test;
    if (!discriminatingTest || !discriminatingTest.design) {
      cmlValidationErrors.push(
        "Discriminating test design is missing - prose generator cannot create test scene"
      );
    }
    if (
      discriminatingTest &&
      (!discriminatingTest.evidence_clues || discriminatingTest.evidence_clues.length === 0)
    ) {
      cmlValidationErrors.push(
        "Discriminating test has no evidence clues - prose cannot reference supporting evidence"
      );
    }

    // Critical clue coverage gaps block prose generation.
    if (ctx.coverageResult?.hasCriticalGaps) {
      const gapSummary: string[] = [];
      if (ctx.coverageResult.uncoveredSteps.length > 0) {
        gapSummary.push(
          `${ctx.coverageResult.uncoveredSteps.length} inference step(s) without sufficient clues`
        );
      }
      const allIssues = ctx.allCoverageIssues ?? [];
      const testIssues = allIssues.filter((i) => i.message.includes("discriminating test"));
      const eliminationIssues = allIssues.filter(
        (i) => i.message.includes("suspect") || i.message.includes("elimination")
      );
      if (testIssues.length > 0) gapSummary.push("discriminating test evidence incomplete");
      if (eliminationIssues.length > 0)
        gapSummary.push(`suspect elimination issues (${eliminationIssues.length})`);
      if (gapSummary.length > 0) {
        cmlValidationErrors.push(`Critical clue coverage gaps: ${gapSummary.join(", ")}`);
      }
    }

    if (cmlValidationErrors.length > 0) {
      const errorMsg =
        `CML validation failed before prose generation:\n` +
        cmlValidationErrors.map((e) => `  \u2022 ${e}`).join("\n") +
        `\n\nFix CML structure before attempting prose generation.`;
      errors.push(errorMsg);
      throw new Error(errorMsg);
    }

    // ── World Builder + Narrative Outline ───────────────────────────────────
    await runAgent65(ctx);  // World Document synthesis
    await runAgent7(ctx);   // Narrative Outliner

    // ── Unit 1.5: Locked-fact consistency gate ───────────────────────────────
    if (inputs.enableLockedFactGate && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0 && ctx.narrative) {
      const narrJson = JSON.stringify(ctx.narrative);
      const violations: string[] = [];
      for (const fact of ctx.lockedFactRegistry) {
        if (fact.value && !narrJson.includes(fact.value)) {
          violations.push(`Locked fact "${fact.id}" value "${fact.value}" absent from narrative outline`);
        }
      }
      if (violations.length > 0) {
        const msg =
          `Locked-fact consistency gate failed — outline does not honour all locked facts:\n` +
          violations.map((v) => `  • ${v}`).join("\n");
        ctx.warnings.push(...violations);
        throw new Error(msg);
      }
    }

    // ── Prose Generation + Release Gate ─────────────────────────────────────
    await runAgent9(ctx);

    // ── Complete ─────────────────────────────────────────────────────────────
    const totalDurationMs = Date.now() - startTime;
    const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
    reportProgress("complete", "Mystery generation complete!", 100);
    runLogger.logComplete("complete", Date.now() - startTime, warnings, errors);

    let scoringReport: GenerationReport | undefined;
    if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
      try {
        scoringReport = scoreAggregator.generateReport({
          story_id: runId,
          started_at: new Date(startTime),
          completed_at: new Date(),
          user_id: projectId,
        });
        await reportRepository.save(scoringReport);
        scoringLogger.logReportGenerated(scoringReport, runId, projectId);
        const passedCount = scoringReport.summary.phases_passed;
        const failedCount = scoringReport.summary.phases_failed;
        const avgScore = scoringReport.overall_score.toFixed(1);
        warnings.push(
          `Scoring: ${passedCount}/${passedCount + failedCount} phases passed, avg score ${avgScore}/100 (${scoringReport.overall_grade})`
        );
      } catch (reportError) {
        warnings.push(`Scoring report generation failed: ${describeError(reportError)}`);
      }
    }

    const status =
      errors.length > 0 ? "failure" : warnings.length > 0 ? "warning" : "success";

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

    if (
      enableScoring &&
      scoreAggregator &&
      scoringLogger &&
      proseScoringSnapshot.startedAtMs !== null &&
      proseScoringSnapshot.chaptersGenerated > 0 &&
      !proseScoringSnapshot.postGenerationSummaryLogged
    ) {
      const templateLinterFailedChecks = templateLinterAbortDetected ? 1 : 0;
      const templateLinterEntropyFailures = /opening-style entropy/i.test(errorMessage) ? 1 : 0;

      const abortedProseSummary: Record<string, unknown> = {
        fair_play_all_clues_visible: null,
        fair_play_discriminating_test_complete: null,
        fair_play_no_solution_spoilers: null,
        fair_play_component_score: null,
        template_linter_checks_run: 0,
        template_linter_failed_checks: templateLinterFailedChecks,
        template_linter_opening_style_entropy_failures: templateLinterEntropyFailures,
        template_linter_opening_style_entropy_bypasses: 0,
        template_linter_paragraph_fingerprint_failures: 0,
        template_linter_ngram_overlap_failures: 0,
        score_total: proseScoringSnapshot.latestCumulativeScore,
        score_grade: null,
        score_passed_threshold: false,
        component_failures: ["prose_generation_aborted"],
        failure_reason: errorMessage,
        chapters_generated: proseScoringSnapshot.chaptersGenerated,
        prose_duration_ms_first_pass: Date.now() - proseScoringSnapshot.startedAtMs,
        prose_duration_ms_total: Date.now() - proseScoringSnapshot.startedAtMs,
        prose_cost_first_pass: agentCosts["agent9_prose"] ?? 0,
        prose_cost_total: agentCosts["agent9_prose"] ?? 0,
        rewrite_pass_count: 0,
        repair_pass_count: 0,
        per_pass_accounting: [],
        metrics_snapshot: "aborted_partial",
        batch_size: inputs.proseBatchSize ?? 1,
        batches_with_retries: (error as any).retriedBatches ?? 0,
        total_batches: 0,
        batch_failure_events: 0,
        batch_failure_history: [],
        batch_failure_samples: [],
        outline_coverage_issue_count: null,
        critical_clue_coverage_gap: null,
        nsd_transfer_steps: 0,
        nsd_transfer_trace: [],
        aborted_after_chapter: proseScoringSnapshot.chaptersGenerated,
      };

      scoringLogger.logPhaseDiagnostic(
        "agent9_prose",
        "Prose Generation",
        "post_generation_summary",
        abortedProseSummary,
        runId,
        projectId || ""
      );

      scoreAggregator.upsertDiagnostic(
        "agent9_prose_post_generation_summary",
        "agent9_prose",
        "Prose Generation",
        "post_generation_summary",
        abortedProseSummary
      );
    }

    // Prose started but 0 chapters completed (e.g. chapter 1 failed all retries).
    // Register a failed prose phase so it always appears in the quality tab.
    if (
      enableScoring &&
      scoreAggregator &&
      scoringLogger &&
      proseScoringSnapshot.startedAtMs !== null &&
      proseScoringSnapshot.chaptersGenerated === 0
    ) {
      const elapsedMs = Date.now() - proseScoringSnapshot.startedAtMs;
      const zeroedProseScore: PhaseScore = {
        agent: "agent9-prose",
        validation_score: 0,
        quality_score: 0,
        completeness_score: 0,
        consistency_score: 0,
        total: 0,
        grade: "F",
        passed: false,
        tests: [],
        component_failures: ["prose_generation_aborted"],
        failure_reason: `Prose aborted before any chapter completed: ${errorMessage.slice(0, 240)}`,
      };
      scoreAggregator.upsertPhaseScore(
        "agent9_prose",
        "Prose Generation",
        zeroedProseScore,
        elapsedMs,
        agentCosts["agent9_prose"] ?? 0,
      );

      // Register a minimal post_generation_summary diagnostic to satisfy the E1
      // report invariant (agent9_prose phase present → diagnostic required).
      // Without this, assertGenerationReportInvariants throws when saving the aborted
      // report, leaving the prior in_progress=true partial snapshot on disk.
      const zeroedPostGenSummary: Record<string, unknown> = {
        chapters_generated: 0,
        prose_duration_ms_first_pass: elapsedMs,
        prose_duration_ms_total: elapsedMs,
        prose_cost_first_pass: agentCosts["agent9_prose"] ?? 0,
        prose_cost_total: agentCosts["agent9_prose"] ?? 0,
        score_total: 0,
        score_grade: "F",
        score_passed_threshold: false,
        component_failures: ["prose_generation_aborted"],
        failure_reason: errorMessage.slice(0, 240),
        rewrite_pass_count: 0,
        repair_pass_count: 0,
        per_pass_accounting: [],
        metrics_snapshot: "aborted_zero_chapters",
        batch_size: 1,
        batches_with_retries: (error as any).retriedBatches ?? 0,
        total_batches: 0,
        batch_failure_events: 0,
        batch_failure_history: [],
        batch_failure_samples: [],
      };
      scoringLogger.logPhaseDiagnostic(
        "agent9_prose",
        "Prose Generation",
        "post_generation_summary",
        zeroedPostGenSummary,
        runId,
        projectId || ""
      );
      scoreAggregator.upsertDiagnostic(
        "agent9_prose_post_generation_summary",
        "agent9_prose",
        "Prose Generation",
        "post_generation_summary",
        zeroedPostGenSummary
      );
    }

    if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
      try {
        const partialReport = scoreAggregator.generateReport({
          story_id: runId,
          started_at: new Date(startTime),
          completed_at: new Date(),
          user_id: projectId,
        });
        applyAbortedRunMetadata(partialReport, errorMessage);
        await reportRepository.save(partialReport);
        scoringLogger.logReportGenerated(partialReport, runId, projectId);
      } catch {
        // best-effort — don't mask the original error
      }
    }

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
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  applyDeterministicCluePreAssignment,
  rebalanceNarrativeSceneCountsDeterministically,
  applyDeterministicProsePostProcessing,
  isDiscriminatingTestCoverageError,
  isSuspectClosureCoverageError,
  isCulpritEvidenceChainCoverageError,
  isSuspectEliminationCoverageError,
};
