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
  /**
   * X38-at-source — the ids of the locked facts this value is a CONSEQUENCE of, as declared by the
   * device that authored it. Optional, and absent means PRIMARY.
   *
   * The distinction is the whole point. Three related numbers can disagree in three ways, and which
   * one is wrong is a property of the mechanism, not of the numbers: a clock-delay device's interval
   * is derived from the two times it separates, while a poison's onset, a tide's period or a fuse's
   * burn are physical constants and the times must be chosen to fit THEM. Only the author knows
   * which, so only the author declares it — and nothing in the pipeline rewrites a locked fact that
   * has not been declared derived. Locked facts reach the page verbatim, so a repair that guesses
   * wrong is unrecoverable. Detection may guess; repair may not.
   */
  derivedFrom?: string[];
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

/**
 * The five story axes, and the ONE vocabulary for them.
 *
 * THE DEFECT THIS REPLACES (found by review, 2026-08-20). Two incompatible vocabularies were in use
 * at once: the CML layer named these five, while `MysteryGenerationInputs` and the API named
 * `social | psychological | mechanical`. Only `temporal` and `spatial` were common to both, and
 * `normalizePrimaryAxis` ended in `default: return "temporal"` — so three of the five values the
 * canary's own input file documents were **silently coerced to temporal**:
 *
 *     identity -> temporal      behavioral -> temporal      authority -> temporal
 *
 * The coercion was invisible: no warning, no error, and a `deriveHardLogicDirectives` switch that
 * matched none of them and therefore seeded ZERO mechanism families. `canary-core-inputs.yaml` even
 * documented an auto-mapping that does not exist anywhere in `canary-core.mjs`.
 *
 * MEASURED CONSEQUENCE: **23 of 23 archived cases are `false_assumption.type: temporal`** and 24 of
 * 24 devices are clock-family. Four of the five axes this generator advertises have never been
 * produced once — never validated, never scored, never read — and 5 of the 15 geometry codes are
 * temporal-only, so a third of geometry would go silent on an axis nobody has ever run.
 *
 * A generator whose parameters change every run cannot have a parameter that silently means one
 * thing. So: one union, and `normalizePrimaryAxis` THROWS on anything it does not recognise.
 */
export const CML_PRIMARY_AXES = ["temporal", "spatial", "identity", "behavioral", "authority"] as const;

export type CmlPrimaryAxis = (typeof CML_PRIMARY_AXES)[number];

/**
 * Input spellings retired in favour of the canonical five, still accepted so existing configs and
 * saved specs keep working.
 *
 * `mechanical` is deliberately NOT here. It used to map to `identity`, which is wrong in a way that
 * changes the book: a mechanical mystery turns on a device, and the identity axis is impersonation,
 * twins and swaps. A caller asking for a mechanism was handed an identity-swap plot. There is no
 * correct target for it in the canonical five, so it now throws and says so rather than guessing —
 * a mechanism story is expressed as a `temporal` or `spatial` axis with a mechanism family.
 */
const LEGACY_AXIS_ALIASES: Readonly<Record<string, CmlPrimaryAxis>> = {
  social: "authority",
  psychological: "behavioral",
};

/** What a caller may pass: the canonical five, or a retired spelling. */
export type PrimaryAxisInput = CmlPrimaryAxis | keyof typeof LEGACY_AXIS_ALIASES;

/** The axis used when a caller specifies none. Explicit, so it is never mistaken for a coercion. */
export const DEFAULT_PRIMARY_AXIS: CmlPrimaryAxis = "temporal";

export type HardLogicDirectives = {
  mechanismFamilies: string[];
  complexityLevel: "simple" | "moderate" | "complex";
  hardLogicModes: string[];
  difficultyMode: DifficultyMode;
  /**
   * Families a keyword rule matched but the axis guard refused, as `name (owner axis, why)`.
   *
   * Surfaced rather than dropped on purpose. A silently discarded input is how the full-story
   * polish spent a month looking dormant (X85) — and refusing a family the caller can see in their
   * own location preset is exactly the kind of decision that must leave a mark on the run.
   */
  refusedFamilies: string[];
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
    // Carried forward, not recomputed: this merger folds in Agent 3b's device hints and derives
    // nothing from keywords, so it has no refusal of its own to add.
    refusedFamilies: base.refusedFamilies,
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

  const culpritsList: string[] = cmlCase.culpability?.culprits ?? [];
  const culpritClause = culpritsList.length > 0 ? " (" + culpritsList.join(", ") + ")" : "";

  // The FLOOR: the outline has no closure language at all, so ask for some.
  if (issues.some((i) => i.type === "missing_suspect_closure_scene")) {
    guardrails.push(
      "In Act III, include at least one scene where the detective explains why each non-culprit suspect is cleared with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references. The culprit" + culpritClause + " must be identified with a complete evidence chain.",
    );
  }

  // THE CEILING (X32) USED TO ADD A FOLD INSTRUCTION HERE. It does not any more, and the reason is
  // worth keeping: this text only ever reached the model as part of an outline RETRY, and putting the
  // repair on the retry path is what kept `AGENT9_FOLD_SUSPECT_CLEARANCES` switched off — 11 of 32
  // archived outlines allocate the clearance job more than once, so the flag re-rolled a third of all
  // outlines at a fresh Agent 7 call each, to fix a defect a re-roll may simply reproduce.
  //
  // The fold is now deterministic: `applySuspectClearanceGate` marks the scene that OWNS the job and
  // the prose prompt tells every other chapter not to re-argue it. No retry, no LLM call, and the
  // instruction lands on the writer rather than on the outliner. See
  // `packages/story-validation/src/suspect-clearance-gate.ts`.

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

/**
 * Resolve a caller's axis to the canonical vocabulary, or THROW.
 *
 * Throwing is the point. The previous body ended in `default: return "temporal"`, which turned every
 * typo, every retired spelling and three of the five documented values into a temporal mystery with
 * no signal of any kind — see `CML_PRIMARY_AXES` for the measured consequence. A silent coercion on
 * the one input that decides what KIND of mystery this is cannot be distinguished, downstream or in
 * an archive, from a caller who asked for temporal.
 *
 * The three outcomes are now distinct and all of them are legible:
 *   • a recognised axis (canonical or retired spelling) → the canonical value
 *   • no axis at all                                    → `DEFAULT_PRIMARY_AXIS`, reported via
 *     `onDefault` so the run log records that nobody chose
 *   • anything else                                     → an error naming what was passed and what
 *     is accepted, at init, before a penny of generation is spent
 */
export const normalizePrimaryAxis = (
  axis: string | undefined | null,
  onDefault?: (message: string) => void,
): CmlPrimaryAxis => {
  if (axis === undefined || axis === null || String(axis).trim() === "") {
    onDefault?.(
      `primaryAxis not specified; defaulting to "${DEFAULT_PRIMARY_AXIS}". ` +
        `The five axes are ${CML_PRIMARY_AXES.join(", ")} — set one explicitly to vary the mystery's kind.`,
    );
    return DEFAULT_PRIMARY_AXIS;
  }

  const raw = String(axis).trim().toLowerCase();
  if ((CML_PRIMARY_AXES as readonly string[]).includes(raw)) return raw as CmlPrimaryAxis;

  const alias = LEGACY_AXIS_ALIASES[raw];
  if (alias) return alias;

  throw new Error(
    `Unknown primaryAxis "${axis}". Accepted: ${CML_PRIMARY_AXES.join(", ")}` +
      ` (retired spellings still accepted: ${Object.keys(LEGACY_AXIS_ALIASES).join(", ")}).` +
      ` "mechanical" was removed because it mapped to "identity", which is a different kind of` +
      ` mystery — express a mechanism story as temporal or spatial with a mechanism family.`,
  );
};

/**
 * Seed mechanism families from the axis and the theme.
 *
 * The axis parameter is the CANONICAL one (post-`normalizePrimaryAxis`), which it was not before.
 * The switch below listed `social | psychological | mechanical` while every caller that had already
 * normalised passed `identity | behavioral | authority` — so three of the five axes fell through
 * `default: break` and seeded **no families at all**, on top of being coerced to temporal. Both
 * halves of that are now impossible: the type is the canonical union, and every member has a case.
 */
/**
 * Which axis each mechanism family BELONGS to — the switch below is the definition, this is its index.
 *
 * WHY THIS EXISTS. `deriveHardLogicDirectives` seeds two families from the axis and then lets keyword
 * rules append more. Those rules matched against `theme + locationPreset` merged into one string and
 * had no idea what axis they were adding to, so:
 *
 *     primaryAxis: authority, locationPreset: SeasideHotel
 *       -> [authority-channel manipulation, status-based witness distortion, TIMETABLE DEPENDENCY]
 *
 * `/train|rail|liner|ship|seaside|hotel/` matches `SeasideHotel` twice over, so every seaside run was
 * handed a temporal mechanism family whatever axis it asked for — and `SeasideHotel` is the DEFAULT
 * location in `canary-core-inputs.yaml`. MEASURED on the first authority case ever generated: its
 * locked facts came out `high_tide_time`, `murder_claimed_time`, `promenade_length`,
 * `wet_sand_mark_length` — a tide-and-clock mechanism wearing an authority label.
 *
 * That is the second half of the temporal monoculture. [X88] forced the axis LABEL to collapse; this
 * forced the MECHANISM. Fixing X88 alone would have produced four more non-temporal labels over four
 * more temporal mechanisms, and the sweep would have reported five successes.
 *
 * THE RULE, and the distinction it turns on: **a theme is intent, a location is scenery.** If the
 * caller writes a theme about a liner they are asking for a transit mystery and any family it implies
 * is theirs to have. If they merely set the story in a seaside hotel, that must colour the setting
 * without redirecting the mystery onto an axis they did not choose. So a family listed here is
 * refused when the LOCATION alone introduced it and it belongs to a different axis; families absent
 * from this table (sealed-space, document-chain, dose-timing, acoustic mislocalization, …) are
 * axis-neutral and always allowed.
 */
const FAMILY_AXIS: Readonly<Record<string, CmlPrimaryAxis>> = {
  "schedule contradiction": "temporal",
  "timing window trap": "temporal",
  "timetable dependency": "temporal",
  "access path illusion": "spatial",
  "geometry-based movement": "spatial",
  "role substitution proof": "identity",
  "witness misidentification constraint": "identity",
  "cognitive bias exploitation": "behavioral",
  "memory anchoring misdirection": "behavioral",
  "authority-channel manipulation": "authority",
  "status-based witness distortion": "authority",
};

export const deriveHardLogicDirectives = (
  theme: string | undefined,
  primaryAxis: CmlPrimaryAxis | undefined,
  locationPreset: string | undefined,
): HardLogicDirectives => {
  // `text` stays the merged string every keyword rule below already matches on — behaviour unchanged.
  // `themeText` is the half that carries INTENT, and is what decides whether a matched family is
  // allowed to introduce a different axis. See FAMILY_AXIS above.
  const themeText = `${theme ?? ""}`.toLowerCase();
  const text = `${themeText} ${locationPreset ?? ""}`.toLowerCase();
  const familySet = new Set<string>();
  const modeSet = new Set<string>();
  /** Families the location introduced that belong to another axis — reported, never silently dropped. */
  const refusedFamilies: string[] = [];

  /**
   * `addFamily` is used by the axis switch AND by the keyword rules. Only the keyword rules can be
   * wrong here, and only when the LOCATION matched: the axis switch is the definition of what the
   * axis wants, and a theme match is the caller asking for it explicitly.
   */
  const addFamily = (value: string) => familySet.add(value);
  /**
   * A family added because a keyword matched. `viaTheme` says whether the CALLER asked for it (the
   * regex hit the theme) or whether only the location did.
   */
  const addKeywordFamily = (value: string, viaTheme: boolean) => {
    const owner = FAMILY_AXIS[value];
    if (primaryAxis && owner && owner !== primaryAxis && !viaTheme) {
      refusedFamilies.push(`${value} (${owner} family, introduced by location not theme)`);
      return;
    }
    familySet.add(value);
  };
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
    case "authority":
      addFamily("authority-channel manipulation");
      addFamily("status-based witness distortion");
      break;
    case "behavioral":
      addFamily("cognitive bias exploitation");
      addFamily("memory anchoring misdirection");
      break;
    case "identity":
      // Identity is impersonation, substitution and mistaken role — NOT the mechanical families that
      // the retired `mechanical` alias used to land here. Those were the wrong seeds for this axis
      // and are why an identity story would have been written as a device story.
      addFamily("role substitution proof");
      addFamily("witness misidentification constraint");
      break;
    case undefined:
      break;
  }

  /**
   * Keyword rules, each with its pattern NAMED so the rule can answer a second question: did this
   * match the THEME, or only the location? `addKeywordFamily` needs that to tell a caller asking for
   * a transit mystery from a caller who merely set one in a seaside hotel.
   */
  const RULES: ReadonlyArray<{ re: RegExp; mode: string; families: string[] }> = [
    { re: /(locked[-\s]?room|impossible crime)/, mode: "locked-room", families: ["sealed-space constraint proof"] },
    { re: /train|rail|liner|ship|seaside|hotel/, mode: "transit or seaside topology", families: ["timetable dependency"] },
    { re: /inheritance|will|estate/, mode: "inheritance pressure logic", families: ["document-chain contradiction"] },
    {
      re: /(math|mathematics|geometry|probability|pure mathematics)/,
      mode: "mathematical principle",
      families: ["probability misdirection", "geometric visibility constraint"],
    },
    { re: /(botanical|medical|toxin|toxicology|botany)/, mode: "botanical or medical mechanism", families: ["dose-timing asymmetry"] },
    { re: /acoustic|sound|echo/, mode: "acoustics", families: ["acoustic mislocalization"] },
    { re: /(multi-layer|double-bluff|double bluff|nested)/, mode: "multi-layer deception", families: ["stacked false assumptions"] },
  ];

  for (const rule of RULES) {
    if (!rule.re.test(text)) continue;
    // The MODE always applies: it describes the SETTING, which the location legitimately determines.
    // Only the FAMILY — what kind of deduction the mystery turns on — is axis-guarded.
    addMode(rule.mode);
    const viaTheme = rule.re.test(themeText);
    for (const family of rule.families) addKeywordFamily(family, viaTheme);
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
    // Insertion order, and the axis switch runs first — so the axis's own families always lead and
    // the slice can only ever truncate keyword extras.
    mechanismFamilies: Array.from(familySet).slice(0, 6),
    complexityLevel,
    hardLogicModes: Array.from(modeSet).slice(0, 6),
    difficultyMode,
    refusedFamilies,
  };
};

/**
 * A_79 B — TWO DEFECTS, AND THE SECOND IS THE EXPENSIVE ONE.
 *
 * 1. THE TITLE READ MISSED A THIRD OF THE SHELF. `CASE.meta ?? meta` matches neither of the two
 *    shapes actually on disk for five of the fourteen legacy seeds, which put their title at
 *    `case_metadata.title`. Those five fell through to the raw filename, so Agent 3 was told in as
 *    many words to diverge from "trents_last_case_cml2.yaml".
 *
 * 2. THE LIST WAS ALPHABETICAL, AND ALMOST ALL OF IT WAS DISCARDED DOWNSTREAM. The seed titles were
 *    cut with `.slice(0, 8)` over a sorted readdir. With cross-run novelty on,
 *    `mergeWithReserve(priorTitles, seeds, MAX_DIVERGE_FROM=12, reserve=3)` then leaves the seeds
 *    THREE slots. Alphabetical order makes those three slots constant for the life of the project:
 *    a_jury_of_her_peers, a_study_in_scarlet, the_big_bow_mystery. Trent's Last Case and The
 *    Mysterious Affair at Styles — two of the most imitated plots in the genre, and both on our own
 *    shelf — could never once be named. Enlarging the corpus made this WORSE, because every work
 *    added after "the_b…" landed behind the cut.
 *
 * The fix is ordering, not capacity: the works sharing this story's axis lead the list, because a
 * same-axis seed is the one the run is actually at risk of re-deriving. Sort is stable, so order
 * within a group stays the readdir order and the output stays deterministic.
 */
const seedTitleOf = (seed: { filename: string; cml: CaseData }): string => {
  const root = seed.cml as any;
  const fromMeta =
    root?.CASE?.meta?.title || root?.case_metadata?.title || root?.meta?.title || root?.CASE?.title;
  if (fromMeta) return String(fromMeta);
  // Never emit a filename as a title. A humanised stem is a book; "x_cml2.yaml" is a path.
  return seed.filename
    .replace(/\.(ya?ml)$/i, "")
    .replace(/_cml2$/i, "")
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const seedAxisOf = (seed: { cml: CaseData }): string => {
  const C = (seed.cml as any)?.CASE ?? {};
  return String(C.false_assumption?.type || C.meta?.primary_axis || C.meta?.primaryAxis || "")
    .trim()
    .toLowerCase();
};

export const buildNoveltyConstraints = (
  seedEntries: Array<{ filename: string; cml: CaseData }>,
  primaryAxis?: string,
) => {
  const wanted = String(primaryAxis ?? "").trim().toLowerCase();
  const ordered = wanted
    ? [...seedEntries].sort(
        (a, b) => Number(seedAxisOf(b) === wanted) - Number(seedAxisOf(a) === wanted),
      )
    : seedEntries;

  const titles = ordered.map(seedTitleOf).filter((title): title is string => Boolean(title));

  const avoidancePatterns = ordered.flatMap((seed) => {
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
    // 12, not 8, to match MAX_DIVERGE_FROM downstream — so this function stops being the binding
    // cut and the merge decides, which is where the reserve policy actually lives.
    divergeFrom: Array.from(new Set(titles)).slice(0, 12),
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
