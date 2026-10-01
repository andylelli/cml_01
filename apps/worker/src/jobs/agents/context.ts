/**
 * ORC-07 — one initialiser for `OrchestratorContext`.
 *
 * The orchestrator and the Agent 9 replay each hand-wrote the ~40-field context literal, and the replay
 * cast its copy `as unknown as OrchestratorContext`, so a new required field was caught in one place and
 * silently missing in the other (its `criticalFairPlayRules` was already an empty set). Callers now pass
 * what differs per caller; the initial run state lives here once, and the compiler checks the rest.
 */
import type { CaseData } from "@cml/cml";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type {
BackgroundContextArtifact,
CastDesignResult,
CharacterProfilesResult,
ClueDistributionResult,
FairPlayAuditResult,
HardLogicDeviceResult,
LocationProfilesResult,
NarrativeOutline,
NoveltyAuditResult,
ProseGenerationResult,
SettingRefinementResult,
TemporalContextResult,
WorldDocumentResult
} from "@cml/prompts-llm";
import type { StoryGeometry } from "@cml/story-geometry";
import type {
FileReportRepository,
RetryManager,
ScoreAggregator,
ValidationReport
} from "@cml/story-validation";
import type { MysteryGenerationInputs, MysteryGenerationProgress } from "../run-contract.js";
import type { RunLogger } from "../run-logger.js";
import type { ScoringLogger } from "../scoring-logger.js";
import type { ClueGuardrailIssue,InferenceCoverageResult } from "./clue-guardrails.js";
import type { OutlineCoverageIssue } from "./outline-guardrails.js";
import type { CmlPrimaryAxis,HardLogicDirectives } from "./premise.js";

/** Agent 6 treats a violation of any of these as critical, whatever severity the auditor gave it. */
export const CRITICAL_FAIR_PLAY_RULES = ["Clue Visibility", "No Withholding", "Logical Deducibility"] as const;

/** A6-08 (R1): the rule names Agent 6 treats as critical, as a type. */
export type CriticalFairPlayRule = (typeof CRITICAL_FAIR_PLAY_RULES)[number];

/**
 * A6-08 (R1): the one predicate for "this violation is critical" — the two inline copies in
 * agent6/structural-retry.ts used `v.severity === "critical" || rules.has(v.rule)`, and this keeps that exactly.
 *
 * KNOWN DEFECT, preserved on purpose (R1 changes nothing observable): the match is CASE-SENSITIVE and exact, so
 * an auditor that writes "clue visibility" or "Clue visibility" is not critical by rule. And the full-mode audit
 * prompt (packages/prompts-llm/src/agent6-fairplay.ts, the 9-point checklist then the 8 answered checks) asks
 * for differently named checks ("Clue Coverage", "Inference Chain", "No New Information", ...) — only the
 * checklist header mentions these three names — so a rule-name match depends on which list the model copies.
 */
export const isCriticalFairPlayViolation = (
  violation: { severity?: string; rule?: string },
  rules: ReadonlySet<string> = new Set<string>(CRITICAL_FAIR_PLAY_RULES),
): boolean => violation.severity === "critical" || rules.has(violation.rule as string);

/** Counters and accumulators every run starts from. */
type RunStateKey =
  | "criticalFairPlayRules"
  | "maxCmlRevisionAttempts"
  | "revisedByAgent4"
  | "revisionAttempts"
  | "revisedByAgent4FairPlay"
  | "fairPlayRevisionAttempts"
  | "proseScoringSnapshot";

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/** Everything a caller must supply: the required fields that are not run state. Any other field may be set. */
export type OrchestratorContextBase = Omit<Pick<OrchestratorContext, RequiredKeys<OrchestratorContext>>, RunStateKey> &
  Partial<OrchestratorContext>;

export function newProseScoringSnapshot(): ProseScoringSnapshot {
  return {
    startedAtMs: null,
    chaptersGenerated: 0,
    latestChapterScore: null,
    latestCumulativeScore: null,
    postGenerationSummaryLogged: false,
  };
}

export function createOrchestratorContext(base: OrchestratorContextBase): OrchestratorContext {
  const initial: Pick<OrchestratorContext, RunStateKey> = {
    criticalFairPlayRules: new Set(CRITICAL_FAIR_PLAY_RULES),
    maxCmlRevisionAttempts: 3,
    revisedByAgent4: false,
    revisionAttempts: undefined,
    revisedByAgent4FairPlay: false,
    fairPlayRevisionAttempts: 0,
    proseScoringSnapshot: newProseScoringSnapshot(),
  };
  return { ...initial, ...base };
}

// ── The context type and its run state (moved from shared.ts, ORC-06) ──

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
  /**
   * A_90 — where a DURATION sits on the clock: the id of the clock fact (or another duration's
   * computed `<id>_start` / `<id>_end`) it starts or ends at. Declared by the device under
   * `AGENT3B_DURATION_ANCHORS`; absent means the duration is unplaced and the chronology reports it.
   */
  anchor?: { at: string; edge: "start" | "end" };
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

// ============================================================================
// OrchestratorContext — fat parameter bag shared by all runAgentN() functions
// ============================================================================

/**
 * Agent 7's coercion counters (REVIEW_05 R4; A7-11 added the per-site counts). Declared here once;
 * agent7/normalize.ts accumulates and emits them.
 */
export interface Agent7CoercionCounters {
  /** Which arm produced these counts — the comparison is meaningless without it. */
  structuredOutput: boolean;
  /** Beats mapped from a synonym onto the canonical Golden-Age arc. */
  beatsCoerced: number;
  /** Beats dropped as unrecognised. */
  beatsDropped: number;
  /** Scene fields recovered from a wrongly-nested `setting` object. */
  fieldsHoisted: number;
  /** A7-11 — formatNarrative's own coercions (OutlineCoercionCounts), summed over every outline it returned. */
  parseRepaired: number;
  parseExtracted: number;
  totalsSynthesized: number;
  totalScenesCorrected: number;
  mechanismStagesCleared: number;
  /** A7-11 — scene clue ids dropped because the clue distribution has no such clue (was silent). */
  clueIdsDropped: number;
  /** Times any coercion changed anything at all. */
  firings: number;
}

export interface OrchestratorContext {
  // ── Infrastructure ──────────────────────────────────────────────────────
  client: AzureOpenAIClient;
  inputs: MysteryGenerationInputs;
  runId: string;
  projectId: string | undefined;
  startTime: number;

  // ── Callbacks ────────────────────────────────────────────────────────────
  reportProgress: (stage: MysteryGenerationProgress["stage"], message: string, pct: number) => void; // ORC-15: typed
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
  initialHardLogicDirectives: HardLogicDirectives;
  locationSpec: { location: string; institution: string };
  noveltyConstraints: { divergeFrom: string[]; areas: string[]; avoidancePatterns: string[] };
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
  agent7Coercion?: Agent7CoercionCounters;
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
  characterGenderMap?: Record<string, string>;
  baselineProseGuardrails?: string[];
  proseScoringSnapshot: ProseScoringSnapshot;
}
