/**
 * agent9-prose/types.ts
 * Shared types, interfaces and arc-planning utilities for Agent 9 prose generation.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { CastDesign } from "../agent2-cast.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import { STORY_LENGTH_TARGETS, getStoryLengthTarget } from "@cml/story-validation";
import type { StoryContract } from "../story-contract.js";
import type { NarrativeState } from "../types/narrative-state.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { BatchCommitRecord, BatchGateName } from "../contracts/batch-commit-record.js";
import type { RetryPacket } from "../retry-protocol.js";
export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

// [PHASE 5] Narrative arc archetype system
const BASE_ARCHETYPES = [
  'DISCOVERY',        // body found — no interrogation
  'FIRST_CONTACT',    // initial interviews — no evidence found yet
  'EVIDENCE',         // physical discovery — no formal accusation
  'ALIBI_PROBE',      // test one alibi — result must be stated
  'RED_HERRING',      // follow wrong lead — disproved within chapter
  'REVERSAL',         // prior assumption overturned — new theory formed
  'ISOLATION',        // eliminate one suspect definitively
  'DISCRIMINATING',   // apply discriminating test logic
  'CONFRONTATION',    // direct accusation scene — culprit present
  'RESOLUTION',       // confession, arrest, aftermath
] as const;

type Archetype = typeof BASE_ARCHETYPES[number];

export interface MacroArcEntry {
  chapter: number;
  archetype: Archetype;
  mustContain: string;
  mustNotContain: string;
}

// P2-24: mustNotContain values use chapter-specific content rules, not cross-chapter state
// references ("same confrontation as prior chapter") that cannot be verified from the current
// chapter alone.  Each contract now describes what must NOT appear within THIS chapter only.
const ARCHETYPE_CONTRACTS: Record<Archetype, { mustContain: string; mustNotContain: string }> = {
  DISCOVERY:     { mustContain: 'body found / victim identified', mustNotContain: 'formal accusation or interrogation' },
  FIRST_CONTACT: { mustContain: 'at least two suspect interviews', mustNotContain: 'physical evidence discovery' },
  EVIDENCE:      { mustContain: 'new physical clue discovered', mustNotContain: 'formal accusation' },
  ALIBI_PROBE:   { mustContain: 'one alibi tested with a stated result', mustNotContain: '' },
  RED_HERRING:   { mustContain: 'wrong lead followed and disproved', mustNotContain: 'final culprit identified' },
  REVERSAL:      { mustContain: 'prior theory overturned by new evidence', mustNotContain: 'culprit accusation or arrest' },
  ISOLATION:     { mustContain: 'one suspect definitively eliminated', mustNotContain: 'new body or crime' },
  DISCRIMINATING:{ mustContain: 'discriminating test logic applied to culprit', mustNotContain: 'unresolved crime or no test performed' },
  CONFRONTATION: { mustContain: 'culprit directly present and addressed', mustNotContain: '' },
  RESOLUTION:    { mustContain: 'confession or arrest, method explained', mustNotContain: 'unresolved loose ends' },
};

export function buildMacroArcPlan(chapterCount: number): MacroArcEntry[] {
  const n = Math.max(5, chapterCount);
  const archetypes: Archetype[] = [];
  archetypes.push('DISCOVERY');
  const middle = n <= 7
    ? BASE_ARCHETYPES.slice(1, -1).filter(a => a !== 'REVERSAL')
    : BASE_ARCHETYPES.slice(1, -1);
  const step = (middle.length - 1) / Math.max(1, n - 2);
  for (let i = 0; i < n - 2; i++) {
    archetypes.push(middle[Math.round(i * step)]);
  }
  archetypes.push('RESOLUTION');
  return archetypes.map((archetype, idx) => ({
    chapter: idx + 1,
    archetype,
    ...ARCHETYPE_CONTRACTS[archetype],
  }));
}

export interface ChapterSummary {
  chapterNumber: number;
  title: string;
  charactersPresent: string[];
  settingTerms: string[];
  keyEvents: string[];
}

export interface ProseGenerationInputs {
  caseData: CaseData;
  outline: NarrativeOutline;
  cast: CastDesign;
  /** Optional model/deployment override for prose generation only. */
  model?: string;
  characterProfiles?: any; // CharacterProfilesResult
  locationProfiles?: any; // LocationProfilesResult
  temporalContext?: any; // TemporalContextResult
  worldDocument?: any; // WorldDocumentResult — when present, supersedes raw profile blocks
  /** Pillar 2: Character Context Bundle — per-character voice, humour, forbidden clichés, and per-act behaviour contracts */
  characterBundle?: { runId: string; characters: Array<{ name: string; voiceFragments: Array<{ register: string; text: string }>; humourStyle: string; humourLevel: number; forbiddenCliché: string; internalConflict: string; speechMannerisms: string; signatureTic?: string; permittedBehavioursByAct: { act1: string; act2: string; act3: string }; }> };
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  detectiveType?: 'police' | 'private' | 'amateur'; // Affects phantom-name warnings
  qualityGuardrails?: string[];
  moralAmbiguityNote?: string;
  /**
   * A_57 D3 — when the mystery's mechanism requires an environmental condition (sunlight for a sundial,
   * a tide, a temperature) that the setting weather contradicts, this carries a generic instruction to
   * render a brief, justified local exception so the clue holds WITHOUT fighting the established ambient.
   * Computed by `checkMechanismEnvironmentConsistency`; absent when there is no conflict.
   */
  mechanismEnvironmentException?: string;
  lockedFacts?: Array<{ id: string; value: string; description: string; appearsInChapters?: string[] }>;
  /** Agent5 clue distribution — used to inject full clue descriptions into per-chapter prose prompts. */
  clueDistribution?: ClueDistributionResult;
  /** Live narrative state threaded through prose batches — prevents style/fact repetition. */
  narrativeState?: NarrativeState;
  writingGuides?: { humour?: string; craft?: string };
  runId?: string;
  projectId?: string;
  /** Optional anti-template linter profile; repair mode relaxes early-chapter entropy checks. */
  templateLinterProfile?: {
    mode?: "standard" | "repair";
    chapterOffset?: number;
    entropyThreshold?: number;
    entropyMinWindow?: number;
    entropyWarmupChapters?: number;
    /** When true, skip the n-gram overlap check (used for the final/reveal chapter whose
     *  detective recap prose legitimately echoes prior-chapter vocabulary). */
    skipNgramCheck?: boolean;
  };
  onProgress?: (phase: string, message: string, percentage: number) => void;
  /** Number of scenes to process per LLM call (1–10, default 1). Higher values increase throughput at the cost of coarser retry granularity. */
  batchSize?: number;
  /** Called after each batch of chapters is successfully generated and validated.
   *  The fourth argument contains validation issues from any failed attempts for this batch. */
  onBatchComplete?: (
    chapters: ProseChapter[],
    batchStart: number,
    batchEnd: number,
    validationIssues: string[],
    usedTextureAtomIds?: string[],
    nsdCheckpoint?: {
      cluesRevealedToReader: string[];
      previousChapterArcPosition?: string;
      continuityTail: string;
      chapter: number;
    },
    batchCommitRecord?: BatchCommitRecord,
  ) => Promise<void> | void;
  /** Called immediately before the LLM call for each batch with the obligation atom IDs selected
   *  for that batch. The orchestrator uses this to stamp deployedAssets once the batch commits. */
  onAtomsSelected?: (atomIds: string[]) => void;
  /** Corrective directives from provisional chapter scoring, applied to subsequent chapter prompts. */
  provisionalScoringFeedback?: {
    fromChapter: number;
    score: number;
    deficits: string[];
    directives: string[];
  }[];
  /** Feature flag for bottom-up request/obligation contract execution path. */
  bottomUpRedesignEnabled?: boolean;
  /** Pillar 6: When true, inject a BANNED PARAGRAPH block into retry prompts when a
   *  paragraph_fingerprint match fires, and activate structural-pivot mode on repeated
    *  fingerprint failures (attempt ≥ 2). Default true — disable explicitly only for
    *  controlled experiments. */
  enableSurgicalFingerprintRetry?: boolean;
  /** Pillar 4: When true, each scene's pivotElement, factEstablished, and (for Act I–II)
   *  redHerringPlacement are injected into the per-chapter obligation block as MANDATORY
   *  directives that the prose LLM must enact. */
  enableOutlineCompleteness?: boolean;
  /** [PHASE 5] Pre-computed macro arc plan — structural archetype contract per chapter. */
  macroArcPlan?: MacroArcEntry[];
  /** [G5] Pre-compiled StoryContract oracle (victim, culprit alibi, inference chain, time anchors). */
  storyContract?: StoryContract;
  /** Optional persisted checkpoint to resume chapter generation without replaying committed chapters. */
  resumeCheckpoint?: {
    chapters: ProseChapter[];
    narrativeState?: NarrativeState;
    promptFingerprints?: Array<{
      chapter: number;
      hash: string;
      section_sizes: Record<string, number>;
    }>;
  };
  /**
   * Completion-first mode.
   * When true (default), exhausted prose retries will degrade to deterministic fallback
   * chapter text instead of aborting the entire run.
   */
  preferCompletionOnFailure?: boolean;
}

export interface ProseGenerationResult {
  status: "draft" | "final";
  tone?: string;
  chapters: ProseChapter[];
  cast: string[];
  note?: string;
  cost: number;
  durationMs: number;
  /** E5: Per-chapter prompt fingerprints for traceability and regression debugging. */
  prompt_fingerprints?: Array<{
    chapter: number;
    hash: string;
    section_sizes: Record<string, number>;
  }>;
  validationDetails?: {
    totalBatches: number;
    batchesWithRetries: number;
    failureHistory: Array<{
      batchIndex: number;
      chapterRange: string;
      attempt: number;
      errors: string[];
    }>;
    linter: {
      checksRun: number;
      failedChecks: number;
      openingStyleEntropyFailures: number;
      openingStyleEntropyBypasses: number;
      openerBypasses?: number;
      paragraphFingerprintFailures: number;
      ngramOverlapFailures: number;
      bannedPhraseFailures?: number;
      boundaryIntegrityFailures?: number;
    };
    phraseTelemetry?: {
      recurringPhraseCount: number;
      configuredDetectedPhraseCount: number;
      configuredRepairPhraseCount: number;
      repairPhraseCandidateCount: number;
      hardBanLinterFailures: number;
      rolloutFlags?: {
        phraseFamilyDetectionEnabled: boolean;
        uncappedRepairTargetsEnabled: boolean;
        precommitPhraseGateEnabled: boolean;
        tieredPhraseContractEnabled: boolean;
        phraseSpecificLinterEnabled: boolean;
        blueSkyModeEnabled: boolean;
        seasonLockContextAwareEnabled?: boolean;
        seasonLockProtectedCollocationsEnabled?: boolean;
        boundaryIntegrityGateEnabled?: boolean;
        semanticRewriteDiffGuardEnabled?: boolean;
        entityFidelityGateEnabled?: boolean;
        culpritAliasGateEnabled?: boolean;
        integrityRetryPacketEnabled?: boolean;
        integrityBlueSkyModeEnabled?: boolean;
      };
    };
    integrityTelemetry?: {
      seasonLockReplacements: number;
      seasonLockProtectedCollisionsBlocked: number;
      semanticRewriteDiffBlocks: number;
      mechanicalSeasonCollisionCount: number;
    };
    underflow?: UnderflowTelemetry;
    fallbackTelemetry?: FallbackChapterTelemetry[];
    provisionalChapterScores?: Array<{
      chapter: number;
      score: number;
      deficits: string[];
      directives: string[];
    }>;
    requestContractViolations?: Array<{
      chapterRange: string;
      errors: string[];
    }>;
    retryPackets?: Array<{
      chapterRange: string;
      attempt: number;
      failureClass: string;
      failureSubcode?: string;
      shouldEscalate: boolean;
    }>;
    batchCommitRecords?: BatchCommitRecord[];
  };
}

export interface FallbackChapterTelemetry {
  chapterNumber: number;
  reason: "retry_exhaustion" | "generation_exception";
  sourceFailureClass?: string;
  initialWords: number;
  finalWords: number;
  expansionAttempts: number;
  committed: boolean;
}

export interface ProseLinterStats {
  checksRun: number;
  failedChecks: number;
  openingStyleEntropyFailures: number;
  openingStyleEntropyBypasses: number;
  // ANALYSIS_44 R3: count of chapters accepted at retry exhaustion because the only residual
  // was a repeated-paragraph-opener (template_bleed) issue.
  openerBypasses: number;
  paragraphFingerprintFailures: number;
  ngramOverlapFailures: number;
  bannedPhraseFailures: number;
  boundaryIntegrityFailures: number;
}

export interface ProseLinterIssue {
  type: "opening_style_entropy" | "paragraph_fingerprint" | "intra_chapter_sentence_duplicate" | "ngram_overlap" | "banned_phrase" | "suspect_clearance_missing" | "template_bleed" | "debug_note_bleed" | "control_plane_leakage" | "archetype_violation" | "victim_alibi_error" | "boundary_integrity" | "sentence_fragment_truncation";
  message: string;
  /** Pillar 6 (Unit 6.1): The normalized prior paragraph text that triggered a
   *  paragraph_fingerprint match.  Populated when a fingerprint dupe fires so that
   *  buildEnhancedRetryFeedback can inject a targeted BANNED PARAGRAPH block (Unit 6.2)
   *  instead of the vague "rewrite from scratch" instruction. Also set for ngram_overlap
   *  issues (P3-D) to enable a parallel BANNED NEAR-DUPLICATE block. */
  matchingPriorParagraph?: string;
}

export interface ClueObligationContext {
  id: string;
  /** Human-readable description for the model — from Clue.description or clue_to_scene_mapping.delivery_method. */
  description?: string;
  /** 'early' | 'mid' | 'late' — resolved from Clue.placement or inferred from act_number. */
  placement?: string;
  /** Raw delivery_method text from clue_to_scene_mapping, when clue is not in clueDistribution. */
  deliveryMethod?: string;
}

export interface ChapterRequirementLedgerEntry {
  chapterNumber: number;
  hardFloorWords: number;
  preferredWords: number;
  requiredClueIds: string[];
  /** Per-clue prose context — used so validators and retry builders can emit prose-facing text
   *  instead of raw internal IDs when the clue is absent from clueDistribution. */
  clueObligationContext?: ClueObligationContext[];
}

export interface ChapterWordTargetResult {
  wordCount: number;
  hardFloorWords: number;
  preferredWords: number;
  isBelowHardFloor: boolean;
  isBelowPreferred: boolean;
}

export interface ChapterObligationResult {
  hardFailures: string[];
  preferredMisses: string[];
  wordTarget: ChapterWordTargetResult;
}

export interface UnderflowTelemetry {
  hardFloorMisses: number;
  preferredTargetMisses: number;
  hardFloorMissChapters: number[];
  preferredTargetMissChapters: number[];
  expansionAttempts: number;
  expansionRecovered: number;
  expansionFailed: number;
  chapterWordCounts: Array<{ chapter: number; words: number }>;
}
