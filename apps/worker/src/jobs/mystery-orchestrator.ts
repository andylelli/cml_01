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
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { promises as dns } from "dns";
import { resolveWorkerRuntimePaths } from "./runtime-paths.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
// Final-story rubric scoring (aligning-the-scoring-system.md): LLM critic + deterministic cap engine.
import { scoreStory, createLLMRubricJudge } from "@cml/rubric-score";
// Agent 5 redesign shadow (10_agent_5 §9.1): the authoritative clue-spec derived from the CML.
import { deriveClueSpec } from "@cml/clue-spec";
import type { CaseData } from "@cml/cml";
import { loadSeedCMLFiles, findUnplantedDiscriminatingClues, assembleScoringChapterTexts } from "@cml/prompts-llm";
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
import { bandRunWarnings } from "./run-warnings.js";
import { evaluateRetryGateGuard } from "./retry-gate-guard.js";
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
  type CharacterBundle,
  type CharacterBundleEntry,
} from "./agents/index.js";
import {
  isCrossRunNoveltyEnabled,
  loadNoveltyLedger,
  appendNoveltyLedger,
  mergePriorRunsIntoConstraints,
  extractPriorRunRecord,
} from "./novelty-ledger.js";
import { writeCorpusSnapshot } from "./corpus-snapshot.js";

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
  /**
   * Optional gender lock map: character name → 'male' | 'female'.
   * When provided alongside castNames, Agent 2 is instructed to treat these as
   * non-negotiable. Prevents per-run gender ambiguity for names the LLM might
   * misread (e.g. gender-neutral titles or uncommon first names).
   */
  castGenders?: Record<string, 'male' | 'female'>;
  detectiveType?: "police" | "private" | "amateur";
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";

  /** Skip Agent 8 novelty check if true */
  skipNoveltyCheck?: boolean;
  /** Agent 8 similarity threshold, default 0.9 */
  similarityThreshold?: number;

  /** Chapters per LLM call (1–10, default 1) */
  proseBatchSize?: number;

  /** Optional filesystem path for Agent 9 checkpoint persistence/resume JSON. */
  agent9CheckpointPath?: string;
  /** When true, Agent 9 resumes from the checkpoint file if available. */
  resumeAgent9FromCheckpoint?: boolean;

  runId?: string;
  projectId?: string;

  /** Pillar 1: accumulate locked facts from Agent 3b and propagate to Agents 5, 7, 9 */
  enableLockedFactRegistry?: boolean;
  /** Pillar 1: pre-generation gate — halt if outline/clues disagree with registry */
  enableLockedFactGate?: boolean;
  /** Pillar 2: assemble Character Context Bundle from Agents 2b + 65 and pass to Agent 9 */
  enableCharacterBundle?: boolean;
  /** Pillar 3: halt pipeline when a quality-evaluator result has blocking=true */
  enableBindingGates?: boolean;
  /** Pillar 3: override a blocking gate — log audit warning instead of throwing */
  forceWarnings?: boolean;
  /** Pillar 6: inject BANNED PARAGRAPH blocks and structural-pivot mode into Agent 9 retry prompts
    *  when a paragraph fingerprint failure recurs across attempts. Default is enabled;
    *  set false only for explicit control experiments. */
  enableSurgicalFingerprintRetry?: boolean;
  /** Pillar 4: require pivotElement, factEstablished, permittedBehavioursByAct, and
   *  redHerringPlacement per outline scene; post-Agent-7 validator halts on null/generic values;
   *  Agent 9 enacts pivotElement, factEstablished, and redHerringPlacement per chapter */
  enableOutlineCompleteness?: boolean;
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

/**
 * Called immediately after each pipeline agent completes with a persisted-ready
 * artifact. Allows the API to write incremental artifacts to the DB during the
 * run so the UI can display them via polling before the pipeline finishes.
 */
export type ArtifactCallback = (type: string, payload: unknown) => Promise<void>;

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
// Pillar 2 — Character Bundle Assembler
// ============================================================================

const HUMOUR_STYLE_CLICHE: Record<string, string> = {
  polite_savagery:  "she felt a wave of unease",
  sardonic:         "palpable tension filled the room",
  dry_wit:          "a surge of determination washed over her",
  self_deprecating: "she knew with certainty she was right",
  observational:    "everyone could sense the atmosphere",
  understatement:   "the situation was extremely serious",
  deadpan:          "he was utterly speechless",
  blunt:            "she chose her words with great care",
  none:             "sighed deeply and felt a sense of peace",
};

function assembleCharacterBundle(
  runId: string,
  characterProfiles: CharacterProfilesResult,
  worldDocument: WorldDocumentResult,
): CharacterBundle {
  const entries: CharacterBundleEntry[] = (characterProfiles.profiles ?? []).map((profile) => {
    const name = profile.name ?? "";
    const humourStyle: string = (profile as any).humourStyle ?? "none";
    const humourLevel: number = typeof (profile as any).humourLevel === "number" ? (profile as any).humourLevel : 0;
    const internalConflict: string = (profile as any).internalConflict ?? "";
    const speechMannerisms: string = (profile as any).speechMannerisms ?? "";
    const motiveSeed: string = (profile as any).motiveSeed ?? "";
    // A_61 RC5.3 — the LLM-emitted signature tic (the binding idiolect anchor the dialogue gate checks).
    const signatureTic: string = String((profile as any).signatureTic ?? "").trim();

    // Voice fragments from world document voice sketches
    const voiceSketch = (worldDocument.characterVoiceSketches ?? []).find(
      (s: any) => s.name === name,
    );
    const voiceFragments: Array<{ register: string; text: string }> = (
      (voiceSketch?.fragments ?? []) as Array<{ register?: string; text?: string }>
    )
      .filter((f) => f.text)
      .slice(0, 3)
      .map((f) => ({ register: f.register ?? "neutral", text: f.text! }));

    // Forbidden cliché: style-matched phrase this character would never say
    const forbiddenCliché = HUMOUR_STYLE_CLICHE[humourStyle] ?? HUMOUR_STYLE_CLICHE["none"];

    // Per-act permitted behaviours — derived from motive seed + role
    const act1 = `Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. ${motiveSeed ? `Hidden motive: "${motiveSeed}" — do not surface in Act I.` : ""}`;
    const act2 = `May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. ${internalConflict ? `Internal conflict emerging: "${internalConflict}"` : ""}`;
    const act3 = `Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.`;

    return {
      name,
      voiceFragments,
      humourStyle,
      humourLevel,
      forbiddenCliché,
      internalConflict,
      speechMannerisms,
      signatureTic,
      permittedBehavioursByAct: { act1, act2, act3 },
    };
  });

  return { runId, characters: entries };
}

// ============================================================================
// Final-story rubric scoring (aligning-the-scoring-system.md)
// ============================================================================
// An LLM critic scores the finished prose across the 10-category /100 rubric; a deterministic cap
// engine then enforces the rubric's hard caps. Runs in SHADOW: the score is logged and attached to
// the report as a diagnostic, but does NOT (yet) replace the headline overall_score. Wrapped so it
// can NEVER break a run. Set RUBRIC_SCORING_MODE=off to skip.

/** Assemble each chapter into its own string (title + body), in order. */
function assembleChapters(prose: any): string[] {
  // A_64 §2 (the 7.2 rewire) — DELEGATED to the shared assembly so the dual-value lever's ship-scope
  // detector and this scoring text provably read the same string (the split-brain that let the cap
  // fire while the enabled lever stayed silent on every 7.2 arm).
  return assembleScoringChapterTexts(Array.isArray(prose?.chapters) ? prose.chapters : []);
}

function assembleFullProse(prose: any): string {
  return assembleChapters(prose).join("\n\n");
}

async function runRubricScoring(args: {
  prose: unknown;
  cml: unknown;
  client: AzureOpenAIClient;
  aggregator?: ScoreAggregator;
  warnings: string[];
  runId: string;
  projectId?: string;
  /** A_57 D2 — the world-state ledger's canonical staged/true pair (for the dual-value-without-contrast cap). */
  discriminatingPair?: { values: [string, string] } | null;
}): Promise<void> {
  const mode = (process.env.RUBRIC_SCORING_MODE ?? "shadow").toLowerCase();
  if (mode === "off") return;
  try {
    const chapters = assembleChapters(args.prose);
    const proseText = chapters.join("\n\n");
    if (proseText.length < 200) return; // nothing meaningful to score
    // K2 §3: the final judge model is independently configurable so it can point at a STRONGER deployment
    // than the per-agent scorers. RUBRIC_JUDGE_MODEL wins; falls back to the run's default deployment.
    const model = process.env.RUBRIC_JUDGE_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const judge = createLLMRubricJudge(
      (chatArgs) =>
        args.client.chat({
          ...chatArgs,
          model: chatArgs.model ?? model,
          logContext: { agent: "RubricScorer", runId: args.runId, projectId: args.projectId ?? "unknown" },
        } as any),
      { model, temperature: 0.2, maxTokens: 4000 },
    );
    // K2 §1: inject the live findUnplantedDiscriminatingClues (A_50 §9.3) and the true chapter boundaries
    // so the structural verifiers can veto/confirm the judge's checkable flags.
    const r = await scoreStory({
      prose: proseText,
      cml: args.cml,
      judge,
      chapters,
      findUnplanted: findUnplantedDiscriminatingClues,
      discriminatingPair: args.discriminatingPair,
    });
    const vetoes = [
      r.structural?.unplantedEvidenceVetoed && "unplanted-evidence vetoed",
      r.structural?.mechanismTimingVetoed && "mechanism-timing vetoed",
      r.structural?.citationsDropped?.length && `citations dropped: ${r.structural.citationsDropped.join(",")}`,
    ].filter(Boolean);
    console.info(
      `[Rubric] ${r.final}/100 (${r.band}); raw ${r.rawTotal}` +
        (r.capsApplied.length ? `; caps: ${r.capsApplied.join("; ")}` : "") +
        (vetoes.length ? `; structural: ${vetoes.join("; ")}` : ""),
    );
    args.warnings.push(`Final-story rubric (shadow): ${r.final}/100 — ${r.band}`);
    args.aggregator?.upsertDiagnostic("rubric_score", "scoring", "Final-Story Rubric", "rubric_score", {
      final: r.final,
      band: r.band,
      raw_total: r.rawTotal,
      categories: r.categories,
      caps_applied: r.capsApplied,
      structural: r.structural,
      overall_view: r.rubric.overall_view,
      main_problems: r.rubric.main_problems,
      fastest_fixes: r.rubric.fastest_fixes,
      // A_71 (A_70 §6) — attribute the score to the model that produced it.
      //
      // A_70 measured the judge running on `gpt-4o-mini`, the cheapest deployed model, and filed it
      // under A_67 §3.2's open "internal-judge sensitivity unproven". The lever to fix that
      // (`RUBRIC_JUDGE_MODEL`) has existed since K2 §3 — but while it is unset the judge silently
      // inherits `AZURE_OPENAI_DEPLOYMENT_NAME`, so changing the BASE model retunes the scale that
      // gates and caps the whole pipeline, with nothing on the artifact to say it moved. Every
      // cross-run rubric comparison in the ledger assumes a fixed judge; this records whether it was.
      judge_model: model,
      judge_model_explicit: Boolean(process.env.RUBRIC_JUDGE_MODEL),
      judge_model_source: process.env.RUBRIC_JUDGE_MODEL
        ? "RUBRIC_JUDGE_MODEL"
        : "AZURE_OPENAI_DEPLOYMENT_NAME (inherited)",
    });
    if (!process.env.RUBRIC_JUDGE_MODEL) {
      args.warnings.push(
        `Final-story rubric: judge model "${model}" inherited from AZURE_OPENAI_DEPLOYMENT_NAME — ` +
          `set RUBRIC_JUDGE_MODEL to pin the scale that gates and caps the pipeline`,
      );
    }
  } catch (e) {
    args.warnings.push(`Rubric scoring skipped: ${describeError(e)}`);
  }
}

// ============================================================================
// Agent 5 clue-spec shadow (10_agent_5_clues_red_herrings.md §4.1 / §9.1)
// ============================================================================
// deriveClueSpec computes the AUTHORITATIVE required-clue set from the frozen CML (the redesign's
// "coverage is constructed, not audited"). In shadow it logs how many of Agent 5's shipped clues map
// to a derived slot — the §9.1 coverage signal — without changing the live clue set. Never throws.
// Set AGENT5_DERIVE_SHADOW=0 to silence.

function runClueSpecShadow(args: { cml: unknown; clues: unknown; warnings: string[] }): void {
  if (/^(0|false|no|off)$/i.test(process.env.AGENT5_DERIVE_SHADOW ?? "")) return; // default on
  try {
    const caseData = (args.cml as any)?.CASE ?? args.cml;
    const spec = deriveClueSpec(caseData);
    const shipped = ((args.clues as any)?.clues ?? []) as any[];
    const stripCase = (s: unknown): string => String(s ?? "").replace(/^CASE\./i, "").trim();
    const derivedIds = new Set(spec.clueSlots.map((s) => s.id));
    const derivedSources = new Set(spec.clueSlots.map((s) => stripCase(s.sourceInCML)));
    const derivedStepEv = new Set(
      spec.clueSlots.filter((s) => s.supportsInferenceStep != null).map((s) => `${s.supportsInferenceStep}:${s.evidenceType}`),
    );
    let covered = 0;
    for (const c of shipped) {
      const src = stripCase(c?.sourceInCML);
      const stepEv = c?.supportsInferenceStep != null && c?.evidenceType ? `${c.supportsInferenceStep}:${c.evidenceType}` : "";
      if (derivedIds.has(c?.id) || (src && derivedSources.has(src)) || (stepEv && derivedStepEv.has(stepEv))) covered++;
    }
    const pct = shipped.length ? Math.round((100 * covered) / shipped.length) : 0;
    console.info(
      `[Agent 5 clue-spec shadow] deriveClueSpec: ${spec.clueSlots.length} required slots + ${spec.redHerringSlots.length} red-herring slots; ` +
        `${shipped.length} shipped clues, ${covered}/${shipped.length} (${pct}%) map to a derived slot.`,
    );
    args.warnings.push(`Clue-spec (shadow): ${spec.clueSlots.length} required slots; ${pct}% of shipped clues map to one.`);
  } catch (e) {
    args.warnings.push(`Clue-spec shadow skipped: ${describeError(e)}`);
  }
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
    const seedEntries = loadSeedCMLFilesCached(EXAMPLES_ROOT);
    let noveltyConstraints = buildNoveltyConstraints(
      seedEntries as Array<{ filename: string; cml: CaseData }>
    );
    // Cross-run novelty (ANALYSIS_49 T1.7, opt-in via NOVELTY_CROSS_RUN): fold the most recent shipped
    // runs into the avoidance constraints so Agent 3 diverges from recent runs, not just static seeds.
    if (isCrossRunNoveltyEnabled()) {
      try {
        const priorRuns = await loadNoveltyLedger();
        noveltyConstraints = mergePriorRunsIntoConstraints(noveltyConstraints, priorRuns);
        if (priorRuns.length > 0) {
          warnings.push(`Cross-run novelty: diverging from ${Math.min(priorRuns.length, 20)} recent run(s)`);
        }
      } catch (err) {
        warnings.push(`Cross-run novelty load skipped: ${describeError(err)}`);
      }
    }

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

    // ── Retry-gate guard (A_50): at most one retry-bearing enforce gate per run ──
    const retryGateGuard = evaluateRetryGateGuard();
    for (const w of retryGateGuard.warnings) ctx.warnings.push(w);
    if (retryGateGuard.fatal) throw new Error(retryGateGuard.fatal);

    // ── Pipeline ────────────────────────────────────────────────────────────
    await runAgent1(ctx);   // Era & Setting Refiner
    if (onArtifact && ctx.setting) await onArtifact("setting", ctx.setting).catch(() => {});
    await runAgent2(ctx);   // Cast & Motive Designer
    if (onArtifact && ctx.cast) await onArtifact("cast", ctx.cast).catch(() => {});
    await runAgent2e(ctx);  // Background Context
    if (onArtifact && ctx.backgroundContext) await onArtifact("background_context", ctx.backgroundContext).catch(() => {});
    await runAgent3b(ctx);  // Hard-Logic Device Ideation
    if (onArtifact && ctx.hardLogicDevices) await onArtifact("hard_logic_devices", ctx.hardLogicDevices).catch(() => {});
    await runAgent3(ctx);   // CML Generator (+ Agent 4 auto-revision)
    if (onArtifact && ctx.cml) await onArtifact("cml", ctx.cml).catch(() => {});

    // ── Pillar 3 (Unit 3.2): Novelty binding gate ───────────────────────────
    if (inputs.enableBindingGates && ctx.noveltyAudit?.blocking) {
      if (!inputs.forceWarnings) {
        const errorMsg =
          `Binding gate: Agent 8 novelty audit is blocking (status: ${ctx.noveltyAudit.status}). ` +
          `Set forceWarnings: true to override.`;
        errors.push(errorMsg);
        throw new Error(errorMsg);
      } else {
        ctx.warnings.push(
          `Binding gate OVERRIDDEN (forceWarnings): Agent 8 novelty audit blocking — ` +
          `status: ${ctx.noveltyAudit.status}, highest similarity: ${ctx.noveltyAudit.highestSimilarity.toFixed(2)}, ` +
          `most similar: ${ctx.noveltyAudit.mostSimilarSeed}`
        );
      }
    }

    await runAgent5(ctx);   // Clue Distributor
    if (onArtifact && ctx.clues) await onArtifact("clues", ctx.clues).catch(() => {});
    runClueSpecShadow({ cml: ctx.cml, clues: ctx.clues, warnings }); // shadow: log derived-vs-shipped coverage
    await runAgent6(ctx);   // Fair-Play Auditor + clue refinement loop
    if (onArtifact && ctx.fairPlayAudit) await onArtifact("fair_play_report", ctx.fairPlayAudit).catch(() => {});

    // ── Pillar 3 (Unit 3.2): Fair-play binding gate ──────────────────────────
    if (inputs.enableBindingGates && ctx.fairPlayAudit?.blocking) {
      if (!inputs.forceWarnings) {
        const errorMsg =
          `Binding gate: Agent 6 fair-play audit is blocking ` +
          `(overallStatus: ${ctx.fairPlayAudit.overallStatus}, violations: ${ctx.fairPlayAudit.violations.length}). ` +
          `Set forceWarnings: true to override.`;
        errors.push(errorMsg);
        throw new Error(errorMsg);
      } else {
        ctx.warnings.push(
          `Binding gate OVERRIDDEN (forceWarnings): Agent 6 fair-play audit blocking — ` +
          `overallStatus: ${ctx.fairPlayAudit.overallStatus}, violations: ${ctx.fairPlayAudit.violations.length}`
        );
      }
    }

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
    if (onArtifact && ctx.characterProfiles) await onArtifact("character_profiles", ctx.characterProfiles).catch(() => {});
    await runAgent2c(ctx);  // Location Profiles
    if (onArtifact && ctx.locationProfiles) await onArtifact("location_profiles", ctx.locationProfiles).catch(() => {});
    await runAgent2d(ctx);  // Temporal Context
    if (onArtifact && ctx.temporalContext) await onArtifact("temporal_context", ctx.temporalContext).catch(() => {});

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
    if (onArtifact && ctx.worldDocument) await onArtifact("world_document", ctx.worldDocument).catch(() => {});

    // ── Pillar 2 (Unit 2.1): Assemble Character Context Bundle ────────────────
    if (inputs.enableCharacterBundle && ctx.characterProfiles && ctx.worldDocument) {
      ctx.characterBundle = assembleCharacterBundle(ctx.runId, ctx.characterProfiles, ctx.worldDocument);
      try {
        const logsDir = join(WORKER_APP_ROOT, "logs");
        if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
        writeFileSync(
          join(logsDir, `character-bundle-${ctx.runId}.json`),
          JSON.stringify(ctx.characterBundle, null, 2),
          "utf8",
        );
      } catch (err) {
        ctx.warnings.push(`Pillar 2: failed to write character-bundle file: ${String(err)}`);
      }
      ctx.warnings.push(
        `Pillar 2: character bundle assembled with ${ctx.characterBundle.characters.length} character(s): ` +
          ctx.characterBundle.characters.map((c) => c.name).join(", "),
      );
    }

    await preflightAzureEndpointDns({
      stageLabel: "narrative",
      reportProgress,
      warnings,
    });

    await runAgent7(ctx);   // Narrative Outliner
    if (onArtifact && ctx.narrative) await onArtifact("outline", ctx.narrative).catch(() => {});

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

    await runAgent9(ctx);
    if (onArtifact && ctx.prose) await onArtifact("prose", ctx.prose).catch(() => {});

    // Final-story rubric (shadow): score the finished prose with the LLM critic + cap engine, log it,
    // and attach it to the report as a diagnostic. Never throws into the run.
    await runRubricScoring({
      prose: ctx.prose,
      cml: ctx.cml,
      client,
      aggregator: scoreAggregator,
      warnings,
      runId,
      projectId,
      discriminatingPair: ctx.discriminatingContradiction ?? null,
    });

    // A_71 (A_70 §5) — surface the content-filter refusal tally. Measured on the 07-27 run: 10
    // refusals, all `Agent9-Regen-Ch*-missing_clue`, visible ONLY in raw logs. The never-abort gate
    // held and the story shipped, which is exactly why the class needs a number: it is invisible in
    // every artifact, premise-dependent (it recurs on the blunt-force-plus-staining story family),
    // and it injects unmodelled variance into any A/B whose replays regenerate that prose.
    const contentFilterSummary = client.getContentFilterTracker?.().getSummary();
    if (contentFilterSummary && contentFilterSummary.total > 0) {
      const families = Object.entries(contentFilterSummary.byFamily)
        .sort((a, b) => b[1] - a[1])
        .map(([family, count]) => `${family} ×${count}`)
        .join(", ");
      warnings.push(
        `Content filter: ${contentFilterSummary.total} Azure refusal(s) — ${families}. ` +
          `The pipeline generated content its own next call refused; affected regens fell back to the deterministic backstop.`
      );
    }
    if (enableScoring && scoreAggregator && contentFilterSummary) {
      scoreAggregator.upsertDiagnostic(
        "content_filter_refusals",
        "orchestrator",
        "Content Filter",
        "content_filter_refusals",
        {
          total: contentFilterSummary.total,
          by_agent: contentFilterSummary.byAgent,
          by_family: contentFilterSummary.byFamily,
          // Bounded sample: enough to identify the prompt family without copying the whole log.
          samples: contentFilterSummary.refusals.slice(0, 10),
        }
      );
    }

    // ── Complete ─────────────────────────────────────────────────────────────
    const totalDurationMs = Date.now() - startTime;
    const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
    reportProgress("complete", "Mystery generation complete!", 100);
    runLogger.logComplete("complete", Date.now() - startTime, warnings, errors);

    let scoringReport: GenerationReport | undefined;
    if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
      try {
        // A_64 §2 F5 — the run's FULL warnings array must reach the artifact. The 7.5-pool autopsy
        // found 67 scaffold-regen calls with zero artifact trace (the #12/#13 forensic-blindness
        // family): chain logs die with the terminal; the report is the durable record. Everything
        // Agent 9 pushes to ctx.warnings aliases this array, so this captures the whole run.
        // A_65b Ph2 — banded: `info` (telemetry/status) vs `warn` (defect/floor firings). The
        // full array is preserved for forensics; status accounting counts `warn` only.
        const warningBands = bandRunWarnings(warnings);
        scoreAggregator.upsertDiagnostic("run_warnings", "orchestrator", "Run Warnings", "run_warnings", {
          count: warnings.length,
          warn_count: warningBands.warn.length,
          info_count: warningBands.info.length,
          warnings: [...warnings],
          warn: warningBands.warn,
          info: warningBands.info,
        });
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
        // A_70 §4 — when finalization fails, the last in_progress partial stays on disk as the ONLY
        // record of the run. Measured on mystery-1785175520689: the invariant
        // `failed_phase_signal_cannot_have_passed_outcome` threw here, leaving a snapshot frozen
        // before Agent 9 that reads `overall_score: 96, run_outcome: passed, 13/13 phases` for a run
        // that actually scored 66 with three chapters failing validation.
        //
        // The API read path already corrects this (A_44 R5a finalizeStaleInProgressReport), but
        // direct-file consumers do not — scripts/target80-ledger-row.mjs reads the JSON with a bare
        // readFileSync and would record 96/A. Stamp the truth onto the artifact so every consumer
        // sees it, not just the ones that go through the API.
        //
        // `in_progress` deliberately stays TRUE: report-repository skips in_progress snapshots when
        // listing, and flipping it would promote this partial to a "real" report. We add the terminal
        // markers alongside it. Best-effort throughout — this must never turn a bad report into a
        // failed run (§2.8 never-abort).
        await markStaleInProgressReport(describeError(reportError));
      }
    }

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
    if (isCrossRunNoveltyEnabled() && status !== "failure" && ctx.cml) {
      try {
        await appendNoveltyLedger(extractPriorRunRecord(ctx.cml, runId));
      } catch {
        // best-effort persistence; ignore
      }
    }

    // A_67 FIX-3 — per-run corpus snapshot (best-effort; gated by CORPUS_SNAPSHOT_DIR, no-op when unset).
    // The live store retains only the latest project; this accumulates a corpus so the plant→payoff
    // measure (scripts/reveal-cites-plants-coverage.mjs) can be run over many stories. Never affects the run.
    if (process.env.CORPUS_SNAPSHOT_DIR && status !== "failure") {
      const snap = writeCorpusSnapshot({
        dir: process.env.CORPUS_SNAPSHOT_DIR,
        projectId,
        runId,
        cml: ctx.cml,
        clues: ctx.clues,
        outline: ctx.narrative,
        prose: ctx.prose,
      });
      if (snap) console.log(`[corpus-snapshot] wrote ${snap} (A_67 FIX-3 plant→payoff corpus).`);
    }

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
      const canonicalProseElapsedMs =
        typeof agentDurations["agent9_prose"] === "number" && agentDurations["agent9_prose"] > 0
          ? agentDurations["agent9_prose"]
          : Date.now() - proseScoringSnapshot.startedAtMs;
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
        prose_duration_ms_first_pass: canonicalProseElapsedMs,
        prose_duration_ms_total: canonicalProseElapsedMs,
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
      const elapsedMs =
        typeof agentDurations["agent9_prose"] === "number" && agentDurations["agent9_prose"] > 0
          ? agentDurations["agent9_prose"]
          : Date.now() - proseScoringSnapshot.startedAtMs;
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
