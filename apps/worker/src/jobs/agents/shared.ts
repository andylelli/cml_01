/**
 * Orchestrator shared context, types, and utility functions.
 *
 * All runAgentN() functions accept OrchestratorContext and mutate it in place.
 * Shared low-level utilities (delay, executeAgentWithRetry, etc.) live here
 * so they are importable by every agent run file without creating circular
 * dependencies with mystery-orchestrator.ts.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type {
  SettingRefinementResult,
  CastDesignResult,
  BackgroundContextArtifact,
  HardLogicDeviceResult,
  HardLogicDeviceIdea,
  ClueDistributionResult,
  FairPlayAuditResult,
  NarrativeOutline,
  CharacterProfilesResult,
  LocationProfilesResult,
  TemporalContextResult,
  ProseGenerationResult,
  NoveltyAuditResult,
  NarrativeState,
  WorldDocumentResult,
} from "@cml/prompts-llm";
import { checkPointsToDistinctness } from "@cml/prompts-llm";
import type { StoryGeometry } from "@cml/story-geometry";
import type {
  ScoreAggregator,
  RetryManager,
  FileReportRepository,
  PhaseScore,
  GenerationReport,
  ValidationReport,
} from "@cml/story-validation";
import { buildRetryFeedback, getFailedComponents, parseHonestScorerMode } from "@cml/story-validation";
import type { ScoringLogger } from "../scoring-logger.js";
import type { RunLogger } from "../run-logger.js";
import type { MysteryGenerationInputs } from "../mystery-orchestrator.js";

// ============================================================================
// Shared types
// ============================================================================

export type DifficultyMode = "standard" | "increase" | "extreme";

// ============================================================================
// Locked Fact Registry — Pillar 1
// ============================================================================

export type LockedFact = {
  id: string;
  value: string;
  description: string;
};

export type LockedFactRegistry = LockedFact[];

// ============================================================================
// Character Bundle — Pillar 2
// ============================================================================

export type CharacterBundleEntry = {
  name: string;
  /** 2–3 voice fragments from Agent 65 world document (register-labelled) */
  voiceFragments: Array<{ register: string; text: string }>;
  /** Humour style from Agent 2b profile */
  humourStyle: string;
  /** Humour level 0–1 from Agent 2b profile */
  humourLevel: number;
  /** One phrase stylistically incompatible with this character's voice — never use */
  forbiddenCliché: string;
  /** Internal conflict from Agent 2b profile */
  internalConflict: string;
  /** Speech mannerisms from Agent 2b profile */
  speechMannerisms: string;
  /** Per-act permitted behaviour note (derived from role + motive) */
  permittedBehavioursByAct: { act1: string; act2: string; act3: string };
};

export type CharacterBundle = {
  runId: string;
  characters: CharacterBundleEntry[];
};

export type CmlPrimaryAxis = "temporal" | "spatial" | "identity" | "behavioral" | "authority";

export type HardLogicDirectives = {
  mechanismFamilies: string[];
  complexityLevel: "simple" | "moderate" | "complex";
  hardLogicModes: string[];
  difficultyMode: DifficultyMode;
};

export type ClueGuardrailIssue = {
  severity: "critical" | "warning";
  message: string;
};

export interface InferenceCoverageResult {
  issues: ClueGuardrailIssue[];
  coverageMap: Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>;
  uncoveredSteps: number[];
  hasCriticalGaps: boolean;
}

export type ProseChapterScorePoint = {
  chapter: number;
  total_chapters: number;
  individual_score: number;
  cumulative_score: number;
  individual_validation_score: number;
  individual_quality_score: number;
  individual_completeness_score: number;
  individual_consistency_score: number;
  cumulative_validation_score: number;
  cumulative_quality_score: number;
  cumulative_completeness_score: number;
  cumulative_consistency_score: number;
};

export type ProsePassAccounting = {
  pass_type: string;
  duration_ms: number;
  cost: number;
  chapters_generated: number;
};

export type ProseScoringSnapshot = {
  startedAtMs: number | null;
  chaptersGenerated: number;
  latestChapterScore: number | null;
  latestCumulativeScore: number | null;
  postGenerationSummaryLogged: boolean;
};

export type OutlineCoverageIssue = {
  type: "missing_discriminating_test_scene" | "missing_suspect_closure_scene";
  message: string;
};

// ============================================================================
// OrchestratorContext — fat parameter bag shared by all runAgentN() functions
// ============================================================================

export interface OrchestratorContext {
  // ── Infrastructure ──────────────────────────────────────────────────────
  client: AzureOpenAIClient;
  inputs: MysteryGenerationInputs;
  runId: string;
  projectId: string | undefined;
  startTime: number;

  // ── Callbacks ────────────────────────────────────────────────────────────
  reportProgress: (stage: any, message: string, pct: number) => void;
  savePartialReport: () => Promise<void>;

  // ── Scoring (all optional — disabled when ENABLE_SCORING env is false) ──
  enableScoring: boolean;
  scoreAggregator: ScoreAggregator | undefined;
  retryManager: RetryManager | undefined;
  scoringLogger: ScoringLogger | undefined;
  reportRepository: FileReportRepository | undefined;

  // ── Run logger (always active — not gated on ENABLE_SCORING) ────────────
  runLogger: RunLogger;

  // ── Mutable collective tracking ──────────────────────────────────────────
  errors: string[];
  warnings: string[];
  agentCosts: Record<string, number>;
  agentDurations: Record<string, number>;

  // ── Pre-computed / init-time values ─────────────────────────────────────
  primaryAxis: CmlPrimaryAxis;
  initialHardLogicDirectives: any;
  locationSpec: { location: string; institution: string };
  noveltyConstraints: any;
  criticalFairPlayRules: Set<string>;
  maxCmlRevisionAttempts: number;

  // ── Runtime paths and seed data (computed once, passed through context) ──
  examplesRoot: string;
  workerAppRoot: string;
  workspaceRoot: string;
  seedEntries: Array<{ filename: string; cml: CaseData }>;

  // ── Agent results (optional until populated by the respective runAgentN) ─
  setting?: SettingRefinementResult;
  cast?: CastDesignResult;
  backgroundContext?: BackgroundContextArtifact;
  hardLogicDevices?: HardLogicDeviceResult;
  hardLogicDirectives?: HardLogicDirectives;  // merged directives after Agent 3b
  /**
   * R4 step 4 (architecture/REVIEW_01.md) — how often Agent 7's coercion layer fired this run, and
   * under which structured-output arm. Written by `recordAgent7Coercion`; read by S7 as the only
   * admissible evidence that a coercion site has stopped firing and can be deleted.
   */
  agent7Coercion?: {
    structuredOutput: boolean;
    beatsCoerced: number;
    beatsDropped: number;
    fieldsHoisted: number;
    firings: number;
  };
  /**
   * X4 (architecture/REVIEW_05.md §10.6) — how often a deterministic prose injector wrote a sentence
   * that violates a rule the MODEL is held to. Written by `recordAgent9Injection` in `agent9-run.ts`.
   *
   * `injections` counts every injected sentence; `violations` counts the subset that break a
   * model-binding rule. Both are needed: the ratio is what tells an injector-retirement decision
   * (THINK_01 Move 5, §12.4) whether the floors are firing at all, and whether what they write would
   * have been rejected had a model written it.
   */
  agent9InjectorLint?: {
    injections: number;
    violations: number;
    /** `${injector}:${ruleId}` → count. Named so an A/B analyser needs no regex over prose. */
    byRule: Record<string, number>;
  };
  cml?: CaseData;                    // may be reassigned by Agent 4 / Agent 6 retries
  noveltyAudit?: NoveltyAuditResult;
  clues?: ClueDistributionResult;    // may be reassigned by Agent 6 retries
  coverageResult?: InferenceCoverageResult;
  allCoverageIssues?: ClueGuardrailIssue[];
  fairPlayAudit?: FairPlayAuditResult; // may be reassigned by Agent 6 retries
  hasCriticalFairPlayFailure?: boolean;
  agent5FirstPassPassed?: boolean;
  agent5RetryInvoked?: boolean;
  agent5FailureClass?: string;
  agent6FirstPassPassed?: boolean;
  agent6RetryInvoked?: boolean;
  agent6FailureClass?: string;
  narrative?: NarrativeOutline;        // may be reassigned by Agent 7 retries
  /**
   * Agent 7.5 — the manuscript contract (architecture/GEOMETRY-AGENT-DESIGN.md). Written by
   * `runAgent75` after the outline and read by Agent 9 twice: as prompt input before a chapter is
   * generated, and as the acceptance test after the manuscript is committed. Absent when the stage
   * is `off` or could not derive — every consumer must treat that as "no contract", never as "the
   * contract is satisfied".
   */
  storyGeometry?: StoryGeometry;
  failedNarrative?: NarrativeOutline;  // last outline candidate that failed schema validation (debug-only; set on Agent 7 abort)
  outlineCoverageIssues?: OutlineCoverageIssue[];
  characterProfiles?: CharacterProfilesResult;
  locationProfiles?: LocationProfilesResult;
  temporalContext?: TemporalContextResult;
  worldDocument?: WorldDocumentResult;
  prose?: ProseGenerationResult;       // may be reassigned by Agent 9 retries
  validationReport?: ValidationReport;

  // ── A_57 §9.1/D2: the discriminating staged/true contradiction pair, computed once by the Agent 9
  //    world-state ledger and read by the final rubric scorer (single source of truth). ───────────────
  discriminatingContradiction?: { values: [string, string]; descriptions: [string, string] } | null;

  // ── Pillar 1: Locked Fact Registry (populated by Agent 3b when enableLockedFactRegistry) ─
  lockedFactRegistry?: LockedFactRegistry;

  // ── Pillar 2: Character Bundle (populated after Agent 65 when enableCharacterBundle) ─────
  characterBundle?: CharacterBundle;

  // ── Result flags ─────────────────────────────────────────────────────────
  revisedByAgent4: boolean;
  revisionAttempts: number | undefined;
  revisedByAgent4FairPlay: boolean;
  fairPlayRevisionAttempts: number;

  // ── Prose-specific state (initialised before Agent 9) ───────────────────
  narrativeState?: NarrativeState;
  characterGenderMap?: Record<string, string>;
  baselineProseGuardrails?: string[];
  proseScoringSnapshot: ProseScoringSnapshot;
  proseChapterScores: ProseChapterScorePoint[];
  proseSecondRunChapterScores: ProseChapterScorePoint[];
  prosePassAccounting: ProsePassAccounting[];
  proseRewritePassCount: number;
  proseRepairPassCount: number;
  latestProseScore: PhaseScore | null;
  nsdTransferTrace: any[];
}

// ============================================================================
// Hard logic directive merger — used exclusively by Agent 3b run file
// ============================================================================

export const mergeHardLogicDirectives = (
  base: HardLogicDirectives,
  hardLogicDevices: HardLogicDeviceIdea[],
): HardLogicDirectives => {
  const mechanismFamilies = new Set(base.mechanismFamilies);
  const hardLogicModes = new Set(base.hardLogicModes);

  for (const device of hardLogicDevices) {
    for (const family of device.mechanismFamilyHints ?? []) {
      if (family.trim().length > 0) mechanismFamilies.add(family.trim());
    }
    for (const mode of device.modeTags ?? []) {
      if (mode.trim().length > 0) hardLogicModes.add(mode.trim());
    }
    switch (device.principleType) {
      case "mathematical_principle":
        mechanismFamilies.add("quantitative contradiction");
        break;
      case "cognitive_bias":
        mechanismFamilies.add("cognitive-bias exploitation");
        break;
      case "social_logic":
        mechanismFamilies.add("authority-channel manipulation");
        break;
      default:
        mechanismFamilies.add("physical-constraint proof");
        break;
    }
  }

  return {
    mechanismFamilies: Array.from(mechanismFamilies),
    hardLogicModes: Array.from(hardLogicModes),
    complexityLevel: base.complexityLevel,
    difficultyMode: base.difficultyMode,
  };
};

// ============================================================================
// Outline quality gate helpers — used by Agent 7 and Agent 9 run files
// ============================================================================

export const buildOutlineRepairGuardrails = (
  issues: OutlineCoverageIssue[],
  cml: CaseData,
): string[] => {
  const guardrails: string[] = [];
  const cmlCase = (cml as any)?.CASE ?? {};

  if (issues.some((i) => i.type === "missing_discriminating_test_scene")) {
    const discrimTest = cmlCase.discriminating_test;
    const method = discrimTest?.method ?? "constraint_proof";
    const design = discrimTest?.design ?? "";
    const designClause = design ? " (" + design + ")" : "";
    guardrails.push(
      "Include a dedicated discriminating test scene in late Act II or early Act III where the detective explicitly stages a " + method + designClause + " that rules out at least one suspect using on-page evidence. The scene summary MUST contain words like test/experiment/re-enactment AND ruled out/eliminated/excluded AND evidence/proof/because.",
    );
  }

  if (issues.some((i) => i.type === "missing_suspect_closure_scene")) {
    const culpritsList: string[] = cmlCase.culpability?.culprits ?? [];
    const culpritClause = culpritsList.length > 0 ? " (" + culpritsList.join(", ") + ")" : "";
    // A_67 FIX-1(c): fold closure into the reveal/discriminating-test scene rather than allocating a
    // scene whose sole purpose is clearing suspects (the duplicate "clearance chapter"). Default-off
    // (probe before default-on); when off, the historical dedicated-scene guardrail is kept.
    const foldSuspectClearances =
      process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "true" || process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "1";
    guardrails.push(
      foldSuspectClearances
        ? "In Act III, rule out each non-culprit suspect with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references, folded INTO the discriminating-test / reveal scene as the detective works through the evidence — do NOT allocate a separate scene whose sole purpose is clearing suspects. The culprit" + culpritClause + " must be identified with a complete evidence chain."
        : "In Act III, include at least one scene where the detective explains why each non-culprit suspect is cleared with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references. The culprit" + culpritClause + " must be identified with a complete evidence chain.",
    );
  }

  return guardrails;
};

// ============================================================================
// Clue guardrail helpers — shared by Agent 5 and Agent 6 run files
// ============================================================================

const getCaseQualityControls = (cml: CaseData) => {
  const legacy = cml as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  return cmlCase.quality_controls?.clue_visibility_requirements ?? {};
};

const normalizeClueTimeline = (clues: ClueDistributionResult) => {
  clues.clueTimeline = {
    early: clues.clues.filter((c) => c.placement === "early").map((c) => c.id),
    mid: clues.clues.filter((c) => c.placement === "mid").map((c) => c.id),
    late: clues.clues.filter((c) => c.placement === "late").map((c) => c.id),
  };
};

export const applyClueGuardrails = (cml: CaseData, clues: ClueDistributionResult) => {
  const requirements = getCaseQualityControls(cml);
  const issues: ClueGuardrailIssue[] = [];
  const fixes: string[] = [];

  const essential = clues.clues.filter((c) => c.criticality === "essential");
  const essentialMin = Number(requirements?.essential_clues_min ?? 3);

  if (essential.length < essentialMin) {
    issues.push({
      severity: "critical",
      message: `Essential clue count ${essential.length} is below required minimum ${essentialMin}`,
    });
  }

  const essentialLate = essential.filter((c) => c.placement === "late");
  if (essentialLate.length > 0) {
    essentialLate.forEach((clue, index) => {
      clue.placement = index % 2 === 0 ? "mid" : "early";
    });
    fixes.push(`Repositioned ${essentialLate.length} essential clue(s) from late to early/mid placement`);
  }

  const earlyMin = Number(requirements?.early_clues_min ?? 1);
  const midMin = Number(requirements?.mid_clues_min ?? 1);
  const lateMin = Number(requirements?.late_clues_min ?? 1);

  const counts = {
    early: clues.clues.filter((c) => c.placement === "early").length,
    mid: clues.clues.filter((c) => c.placement === "mid").length,
    late: clues.clues.filter((c) => c.placement === "late").length,
  };

  if (counts.early < earlyMin) {
    issues.push({
      severity: "critical",
      message: `Early clue count ${counts.early} is below required minimum ${earlyMin}`,
    });
  }
  if (counts.mid < midMin) {
    issues.push({
      severity: "critical",
      message: `Mid clue count ${counts.mid} is below required minimum ${midMin}`,
    });
  }
  if (counts.late < lateMin) {
    issues.push({
      severity: "warning",
      message: `Late clue count ${counts.late} is below preferred minimum ${lateMin}`,
    });
  }

  const detectiveOnlyPattern = /(detective[-\s]?only|only\s+the\s+detective|private\s+insight|withheld\s+from\s+reader)/i;
  const detectiveOnlyClues = clues.clues.filter(
    (c) => detectiveOnlyPattern.test(c.description) || detectiveOnlyPattern.test(c.pointsTo),
  );

  if (detectiveOnlyClues.length > 0) {
    issues.push({
      severity: "critical",
      message: `Detected ${detectiveOnlyClues.length} clue(s) implying detective-only/private information`,
    });
  }

  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const clue of clues.clues) {
    if (seenIds.has(clue.id)) {
      duplicateIds.add(clue.id);
    }
    seenIds.add(clue.id);
  }
  if (duplicateIds.size > 0) {
    issues.push({
      severity: "critical",
      message: `Duplicate clue IDs detected: ${Array.from(duplicateIds).join(", ")}`,
    });
  }

  // A_56 5-A (P1.2 distinctness): no two SOLVING clues should resolve to the SAME implication —
  // redundant "points to X" essentials are a top cause of a flabby, repetitive middle. Repair-not-abort:
  // when a collision group has >1 essential clue, keep ONE as the anchor and DEMOTE the extras to
  // "supporting" (never delete the clue; never drop the total essential count below the required
  // minimum). Holistic — keyed off `pointsTo` only, no story-specific terms. Groups with a single
  // essential (one essential + supporting echoes) are left untouched; only redundant essentials demote.
  const distinct = checkPointsToDistinctness(clues.clues);
  if (!distinct.ok) {
    const byId = new Map(clues.clues.map((c) => [c.id, c]));
    let essentialCount = clues.clues.filter((c) => c.criticality === "essential").length;
    let demoted = 0;
    for (const collision of distinct.collisions) {
      const essentialsInGroup = collision.clueIds
        .map((id) => byId.get(id))
        .filter((c): c is NonNullable<typeof c> => !!c && c.criticality === "essential");
      // Keep essentialsInGroup[0] as the anchor; demote the rest while the minimum is preserved.
      for (let i = 1; i < essentialsInGroup.length; i++) {
        if (essentialCount <= essentialMin) break;
        essentialsInGroup[i].criticality = "supporting";
        essentialCount -= 1;
        demoted += 1;
      }
    }
    if (demoted > 0) {
      fixes.push(
        `Demoted ${demoted} redundant essential clue(s) to supporting (P1.2 distinctness — shared "points to" implication)`,
      );
    }
    issues.push({
      severity: "warning",
      message:
        `Detected ${distinct.collisions.length} clue group(s) sharing a 'points to' implication: ` +
        distinct.collisions.map((c) => `"${c.normalized}" (${c.clueIds.join(", ")})`).join("; "),
    });
  }

  normalizeClueTimeline(clues);

  return {
    issues,
    fixes,
    hasCriticalIssues: issues.some((i) => i.severity === "critical"),
  };
};

// ============================================================================
// Utility functions (moved verbatim from mystery-orchestrator.ts)
// ============================================================================

/**
 * Remove warnings from the run's channel IN PLACE. The array identity is load-bearing.
 *
 * WHY THIS IS A SHARED HELPER RATHER THAN THREE LINES AT THE CALL SITE. Agent 6 previously cleared
 * its transient warnings with `ctx.warnings = ctx.warnings.filter(...)`. `filter` returns a NEW
 * array, and that call is unconditional at the end of every Agent 6 — so every run severed
 * `ctx.warnings` from the orchestrator's array and **everything Agent 7, Agent 7.5 and Agent 9 pushed
 * afterwards went nowhere**: regen-unresolved notes, release-gate reasons, geometry violations. Every
 * archived report shows zero `[Agent 9]` warnings, not because Agent 9 is quiet. The clearing did not
 * work either — the report reads the orchestrator's array, which still held every line it removed.
 *
 * One exported body means the behaviour is unit-testable directly, rather than inferred from a source
 * scan of the call site. A comment claiming the invariant is what let this survive; see
 * `warning-channel-aliasing.test.ts` for the property, and REVIEW_04 §4.3 for the measurement.
 *
 * Returns how many entries were removed, so a caller can log a no-op distinctly from a clearance.
 */
export function clearWarningsInPlace(warnings: string[], toClear: ReadonlySet<string>): number {
  if (!Array.isArray(warnings) || warnings.length === 0) return 0;
  if (toClear.size === 0) return 0;
  const kept = warnings.filter((warning) => !toClear.has(String(warning).trim()));
  const removed = warnings.length - kept.length;
  if (removed === 0) return 0;
  warnings.length = 0;
  for (const warning of kept) warnings.push(warning);
  return removed;
}

export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function applyAbortedRunMetadata(report: GenerationReport, reason: string): void {
  const infraPattern =
    /(\[infra[_\-\s]?precheck\]|infra[_\-\s]?failure|enotfound|eai_again|dns\s+resolution\s+failed|azure\s+endpoint\s+dns|etimedout|econnreset|socket\s+hang\s+up)/i;
  report.run_outcome = infraPattern.test(reason) ? "infra_failure" : "aborted";
  report.run_outcome_reason = reason;
  report.passed = false;

  if (report.scoring_outcome) {
    report.scoring_outcome.passed_threshold = false;
  }

  (report as any).in_progress = false;
  (report as any).aborted = true;
  (report as any).abort_reason = reason;
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function appendRetryFeedback(base: string, retryFeedback?: string): string {
  if (!retryFeedback || retryFeedback.trim().length === 0) {
    return base;
  }
  const prefix = base.trim().length > 0 ? base : "";
  return `${prefix}${prefix ? "\n\n" : ""}Retry guidance:\n${retryFeedback}`;
}

export function appendRetryFeedbackOptional(base: string | undefined, retryFeedback?: string): string | undefined {
  if (base === undefined) {
    return undefined;
  }
  return appendRetryFeedback(base, retryFeedback);
}

export function preAgent9LlmRetriesEnabled(): boolean {
  const raw = String(process.env.AGENT_PRE9_ENABLE_LLM_RETRIES ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

/**
 * ANALYSIS_50 Phase 3 — honest-scorer selector. Reads the umbrella `HONEST_SCORERS` flag
 * (off/shadow/enforce, default OFF). `off` returns the vanity score unchanged (byte-identical).
 * `shadow` computes the honest score, logs the vanity↔honest delta, but RETURNS the vanity score.
 * `enforce` returns the honest score. Never throws — a scorer error keeps the vanity score.
 */
export function applyHonestScorer(
  vanity: PhaseScore,
  honest: () => PhaseScore | null | undefined,
  warnings: string[],
  label: string,
): PhaseScore {
  const mode = parseHonestScorerMode(process.env.HONEST_SCORERS);
  if (mode === "off") return vanity;
  let h: PhaseScore | null | undefined;
  try {
    h = honest();
  } catch (err) {
    warnings.push(`[honest-scorer][${mode}] ${label} error: ${(err as Error).message}; keeping vanity score`);
    return vanity;
  }
  if (!h) return vanity;
  warnings.push(
    `[honest-scorer][${mode}] ${label} vanity=${vanity.total}/${vanity.grade} ` +
      `honest=${h.total}/${h.grade} passed=${h.passed}` +
      (h.component_failures && h.component_failures.length ? ` weak=${h.component_failures.join(",")}` : ""),
  );
  return mode === "enforce" ? h : vanity;
}

export function preAgent9ContractRecoveryEnabled(): boolean {
  // Contract recovery is enabled by default so schema/structural near-misses
  // are repaired consistently across all story parameter combinations.
  const raw = String(process.env.AGENT_PRE9_ENABLE_CONTRACT_RECOVERY ?? "").trim().toLowerCase();
  if (!raw) return true;
  if (raw === "0" || raw === "false" || raw === "no" || raw === "off") return false;
  if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") return true;
  return true;
}

export async function executeAgentWithRetry<T>(
  agentId: string,
  phaseName: string,
  executeAgent: (retryFeedback?: string) => Promise<{ result: T; cost: number }>,
  scoreOutput: (result: T) => Promise<{ adapted: any; score: PhaseScore }>,
  retryManager: RetryManager,
  scoreAggregator: ScoreAggregator,
  scoringLogger: ScoringLogger,
  runId: string,
  projectId: string,
  warnings: string[],
  onPhaseScored?: () => Promise<void>,
  // A_53 P2 (agent65-score-failure-aborts-via-shared-retry): phases whose output is creative texture
  // (e.g. Agent 6.5 World Builder) are NOT abort-critical — a sub-threshold score degrades to a
  // warning + best-effort document instead of killing the whole pipeline. Defaults to abort-critical
  // to preserve existing behavior for the load-bearing phases.
  abortCritical: boolean = true,
): Promise<{ result: T; duration: number; cost: number; retryCount: number }> {
  let attempts = 0;
  let totalCost = 0;
  const startTime = Date.now();
  let retryFeedback: string | undefined;
  const retriesEnabled = preAgent9LlmRetriesEnabled();

  while (true) {
    const attemptStart = Date.now();

    const { result, cost } = await executeAgent(retryFeedback);
    totalCost += cost;

    const attemptDuration = Date.now() - attemptStart;

    try {
      const { adapted, score } = await scoreOutput(result);

      scoreAggregator.upsertPhaseScore(agentId, phaseName, score, attemptDuration, cost);
      scoringLogger.logPhaseScore(agentId, phaseName, score, attemptDuration, cost, runId, projectId);

      if (onPhaseScored) {
        try { await onPhaseScored(); } catch { /* best-effort */ }
      }

      const phasePassed = scoreAggregator.passesThreshold(score);
      if (phasePassed) {
        const totalDuration = Date.now() - startTime;
        if (attempts > 0) {
          warnings.push(`${phaseName}: ✓ Passed after ${attempts} retry(s) - ${score.grade} (${score.total}/100)`);
        }
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      if (!retriesEnabled) {
        warnings.push(
          `${phaseName}: deterministic mode active - skipping scoring retry (score ${score.total}/100, ${score.grade})`
        );
        const totalDuration = Date.now() - startTime;
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      if (!retryManager.canRetry(agentId)) {
        if (retryManager.shouldAbortOnMaxRetries() && abortCritical) {
          throw new Error(
            `${phaseName} failed after ${attempts + 1} attempt(s) and all retries are exhausted. ` +
            `Aborting generation. Failure reason: ${score.failure_reason || `Score ${score.total}/100 (${score.grade}) below threshold`}`
          );
        }
        warnings.push(
          abortCritical
            ? `${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - Max retries exceeded`
            : `${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - non-critical phase, continuing with best-effort document`,
        );
        const totalDuration = Date.now() - startTime;
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      const failedComponents = getFailedComponents(score);
      const effectiveFailureReason = score.failure_reason
        || (failedComponents.length > 0
            ? `Component minimums not met: ${failedComponents.join('; ')}`
            : `Score ${score.total}/100 (${score.grade}) below threshold`);

      attempts++;
      retryManager.recordRetry(agentId, effectiveFailureReason, score.total);

      const backoffMs = retryManager.getBackoffDelay(agentId);
      const maxRetries = retryManager.getMaxRetries(agentId);
      scoringLogger.logRetryAttempt(agentId, phaseName, attempts, effectiveFailureReason, backoffMs, maxRetries, runId, projectId);

      retryFeedback = buildRetryFeedback(score, attempts);

      warnings.push(`${phaseName}: ↻ Retry ${attempts}/${maxRetries} - Score: ${score.total}/100 (${score.grade}), waiting ${backoffMs}ms...`);

      if (backoffMs > 0) {
        await delay(backoffMs);
      }
    } catch (scoringError) {
      scoringLogger.logScoringError(agentId, phaseName, scoringError, runId, projectId);
      warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
      const totalDuration = Date.now() - startTime;
      return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
    }
  }
}

// ============================================================================
// Init-time utilities — called by generateMystery before ctx construction
// ============================================================================

export const normalizePrimaryAxis = (
  axis: MysteryGenerationInputs["primaryAxis"] | undefined,
): CmlPrimaryAxis => {
  switch (axis) {
    case "temporal":
    case "spatial":
      return axis;
    case "social":
      return "authority";
    case "psychological":
      return "behavioral";
    case "mechanical":
      return "identity";
    default:
      return "temporal";
  }
};

export const deriveHardLogicDirectives = (
  theme: string | undefined,
  primaryAxis: MysteryGenerationInputs["primaryAxis"] | undefined,
  locationPreset: string | undefined,
): HardLogicDirectives => {
  const text = `${theme ?? ""} ${locationPreset ?? ""}`.toLowerCase();
  const familySet = new Set<string>();
  const modeSet = new Set<string>();

  const addFamily = (value: string) => familySet.add(value);
  const addMode = (value: string) => modeSet.add(value);

  switch (primaryAxis) {
    case "temporal":
      addFamily("schedule contradiction");
      addFamily("timing window trap");
      break;
    case "spatial":
      addFamily("access path illusion");
      addFamily("geometry-based movement");
      break;
    case "social":
      addFamily("authority-channel manipulation");
      addFamily("status-based witness distortion");
      break;
    case "psychological":
      addFamily("cognitive bias exploitation");
      addFamily("memory anchoring misdirection");
      break;
    case "mechanical":
      addFamily("mechanical sequence trigger");
      addFamily("acoustic or pressure misread");
      break;
    default:
      break;
  }

  if (/(locked[-\s]?room|impossible crime)/.test(text)) {
    addMode("locked-room");
    addFamily("sealed-space constraint proof");
  }
  if (/train|rail|liner|ship|seaside|hotel/.test(text)) {
    addMode("transit or seaside topology");
    addFamily("timetable dependency");
  }
  if (/inheritance|will|estate/.test(text)) {
    addMode("inheritance pressure logic");
    addFamily("document-chain contradiction");
  }
  if (/(math|mathematics|geometry|probability|pure mathematics)/.test(text)) {
    addMode("mathematical principle");
    addFamily("probability misdirection");
    addFamily("geometric visibility constraint");
  }
  if (/(botanical|medical|toxin|toxicology|botany)/.test(text)) {
    addMode("botanical or medical mechanism");
    addFamily("dose-timing asymmetry");
  }
  if (/acoustic|sound|echo/.test(text)) {
    addMode("acoustics");
    addFamily("acoustic mislocalization");
  }
  if (/(multi-layer|double-bluff|double bluff|nested)/.test(text)) {
    addMode("multi-layer deception");
    addFamily("stacked false assumptions");
  }

  let difficultyMode: DifficultyMode = "standard";
  if (/make it brutal|extreme mode/.test(text)) {
    difficultyMode = "extreme";
    addMode("near-impossible construction");
    addFamily("precision timing geometry");
  } else if (/increase difficulty|escalation mode/.test(text)) {
    difficultyMode = "increase";
    addMode("multi-step reasoning");
    addFamily("dual-principle contradiction");
  }

  const complexityLevel: "simple" | "moderate" | "complex" =
    difficultyMode === "standard" ? "moderate" : "complex";

  if (familySet.size === 0) {
    addFamily("constraint contradiction");
    addFamily("inference-path trap");
  }

  return {
    mechanismFamilies: Array.from(familySet).slice(0, 6),
    complexityLevel,
    hardLogicModes: Array.from(modeSet).slice(0, 6),
    difficultyMode,
  };
};

export const buildNoveltyConstraints = (seedEntries: Array<{ filename: string; cml: CaseData }>) => {
  const titles = seedEntries
    .map((seed) => {
      const meta = (seed.cml as any)?.CASE?.meta ?? (seed.cml as any)?.meta ?? {};
      return meta?.title || seed.filename;
    })
    .filter((title): title is string => Boolean(title));

  const avoidancePatterns = seedEntries.flatMap((seed) => {
    const cmlCase = (seed.cml as any)?.CASE ?? {};
    const meta = cmlCase.meta ?? {};
    const crimeClass = meta.crime_class ?? {};
    const era = meta?.era?.decade ?? "";
    const location = meta?.setting?.location ?? "";
    const falseAssumption = cmlCase?.false_assumption?.statement ?? "";
    const discrimMethod = cmlCase?.discriminating_test?.method ?? "";
    const discrimDesign = cmlCase?.discriminating_test?.design ?? "";
    const crimeSubtype = crimeClass?.subtype ?? "";
    const axis = cmlCase?.false_assumption?.type ?? "";
    return [
      era && location ? `Era+location combo: ${era} / ${location}` : "",
      crimeSubtype ? `Crime method/subtype: ${crimeSubtype}` : "",
      axis ? `False assumption type: ${axis}` : "",
      falseAssumption ? `False assumption statement: ${falseAssumption}` : "",
      discrimMethod ? `Discriminating test method: ${discrimMethod}` : "",
      discrimDesign ? `Discriminating test design: ${discrimDesign}` : "",
    ].filter(Boolean);
  });

  const uniqueAvoidance = Array.from(new Set(avoidancePatterns)).slice(0, 12);

  return {
    divergeFrom: titles.slice(0, 8),
    areas: [
      "crime method + motive combination",
      "false assumption statement and justification",
      "discriminating test design and trigger",
      "era + location pairing",
      "culprit access path and opportunity channel",
      "constraint-space anchors and contradictions",
    ],
    avoidancePatterns: uniqueAvoidance,
  };
};
