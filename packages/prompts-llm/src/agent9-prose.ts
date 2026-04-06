/**
 * Agent 9: Prose Generator
 *
 * Generates full narrative prose from the narrative outline + CML + cast.
 * Output Format: JSON (chapters with paragraphs)
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { createHash } from 'node:crypto';
import { jsonrepair } from "jsonrepair";
import type { NarrativeOutline } from "./agent7-narrative.js";
import type { CastDesign } from "./agent2-cast.js";
import type { ClueDistributionResult, Clue } from "./agent5-clues.js";
import {
  ChapterValidator,
  CharacterConsistencyValidator,
  STORY_LENGTH_TARGETS,
  anonymizeUnknownTitledNames,
  getGenerationParams,
  repairChapterPronouns,
  repairPronouns,
} from "@cml/story-validation";
import type { NarrativeState } from "./types/narrative-state.js";
import { classifyOpeningStyle, updateNSD } from "./types/narrative-state.js";

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
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
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  detectiveType?: 'police' | 'private' | 'amateur'; // Affects phantom-name warnings
  qualityGuardrails?: string[];
  moralAmbiguityNote?: string;
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
  };
  onProgress?: (phase: string, message: string, percentage: number) => void;
  /** Number of scenes to process per LLM call (1–10, default 1). Higher values increase throughput at the cost of coarser retry granularity. */
  batchSize?: number;
  /** Called after each batch of chapters is successfully generated and validated.
   *  The fourth argument contains validation issues from any failed attempts for this batch. */
  onBatchComplete?: (chapters: ProseChapter[], batchStart: number, batchEnd: number, validationIssues: string[]) => Promise<void> | void;
  /** Corrective directives from provisional chapter scoring, applied to subsequent chapter prompts. */
  provisionalScoringFeedback?: {
    fromChapter: number;
    score: number;
    deficits: string[];
    directives: string[];
  }[];
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
      paragraphFingerprintFailures: number;
      ngramOverlapFailures: number;
    };
    underflow?: UnderflowTelemetry;
    provisionalChapterScores?: Array<{
      chapter: number;
      score: number;
      deficits: string[];
      directives: string[];
    }>;
  };
}

interface ProseLinterStats {
  checksRun: number;
  failedChecks: number;
  openingStyleEntropyFailures: number;
  openingStyleEntropyBypasses: number;
  paragraphFingerprintFailures: number;
  ngramOverlapFailures: number;
}

interface ProseLinterIssue {
  type: "opening_style_entropy" | "paragraph_fingerprint" | "ngram_overlap";
  message: string;
}

interface ClueObligationContext {
  id: string;
  /** Human-readable description for the model — from Clue.description or clue_to_scene_mapping.delivery_method. */
  description?: string;
  /** 'early' | 'mid' | 'late' — resolved from Clue.placement or inferred from act_number. */
  placement?: string;
  /** Raw delivery_method text from clue_to_scene_mapping, when clue is not in clueDistribution. */
  deliveryMethod?: string;
}

interface ChapterRequirementLedgerEntry {
  chapterNumber: number;
  hardFloorWords: number;
  preferredWords: number;
  requiredClueIds: string[];
  /** Per-clue prose context — used so validators and retry builders can emit prose-facing text
   *  instead of raw internal IDs when the clue is absent from clueDistribution. */
  clueObligationContext?: ClueObligationContext[];
}

interface ChapterWordTargetResult {
  wordCount: number;
  hardFloorWords: number;
  preferredWords: number;
  isBelowHardFloor: boolean;
  isBelowPreferred: boolean;
}

interface ChapterObligationResult {
  hardFailures: string[];
  preferredMisses: string[];
  wordTarget: ChapterWordTargetResult;
}

interface UnderflowTelemetry {
  hardFloorMisses: number;
  preferredTargetMisses: number;
  hardFloorMissChapters: number[];
  preferredTargetMissChapters: number[];
  expansionAttempts: number;
  expansionRecovered: number;
  expansionFailed: number;
}

const countWords = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
};

const getChapterWordTargets = (targetLength: "short" | "medium" | "long") => {
  const config = getGenerationParams().agent9_prose.word_policy;
  // Hard floor is a fraction of the preferred chapter target, NOT of STORY_LENGTH_TARGETS.chapterMinWords.
  // Using the preferred words as the base keeps the floor proportional to what we actually ask the model
  // to produce (e.g. short story: floor(1300 × 0.77) = 1001 rather than floor(800 × 0.88) = 704).
  return {
    hardFloorWords: Math.max(
      config.min_hard_floor_words,
      Math.floor(config.preferred_chapter_words[targetLength] * config.hard_floor_relaxation_ratio),
    ),
    preferredWords: config.preferred_chapter_words[targetLength],
  };
};

const CLUE_TOKEN_STOPWORDS = new Set<string>([
  // Common auxiliary and preposition words that provide no discriminating signal
  "about", "after", "again", "against", "also", "been", "between", "both", "could", "does", "done",
  "each", "even", "ever", "every", "first", "found", "from", "have", "having", "here", "however",
  "into", "just", "later", "make", "made", "might", "more", "most", "much", "only", "onto",
  "other", "over", "same", "some", "such", "than", "that", "them", "then", "their", "there",
  "these", "they", "this", "those", "through", "under", "upon", "very", "were", "when", "where",
  "which", "while", "will", "with", "would", "without", "afterward", "during",
]);

const tokenizeForClueObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));

/**
 * Remove tokens that are proper-name words from non-cast characters.
 * A token is considered a non-cast proper-name token if it appears as a
 * capitalized word (≥ 3 chars) in `rawDescription` AND is not a substring of
 * any cast member's name. Such tokens come from Agent-5 clue descriptions that
 * reference source-text characters not present in the generated prose cast —
 * they can never match the chapter text, causing perpetual false-fail retries.
 */
const filterNonCastProperNameTokens = (
  tokens: string[],
  rawDescription: string,
  castNames: string[],
): string[] => {
  if (castNames.length === 0) return tokens;
  const castNamesLower = castNames.map((n) => n.toLowerCase());
  // Collect all capitalized words (≥ 3 chars) from the raw description as potential proper names
  const capitalizedWords = new Set(
    (rawDescription.match(/\b[A-Z][a-z]{2,}\b/g) ?? []).map((w) => w.toLowerCase()),
  );
  return tokens.filter((token) => {
    if (!capitalizedWords.has(token)) return true; // Not a proper-name token, keep it
    // It is a proper-name token — keep only if it's a substring of some cast member's name
    return castNamesLower.some((cn) => cn.includes(token) || token.includes(cn));
  });
};

// Delivery-method genre labels that Agent 5 sometimes puts in clue.description.
// These describe HOW a clue is delivered, not WHAT is observed — their tokens
// ("direct", "observation", "hearsay", etc.) will never appear in narrative prose
// and cause the token-matcher to always fail.
const CLUE_DELIVERY_METHOD_LABELS = new Set<string>([
  'direct observation',
  'physical evidence',
  'hearsay',
  'written record',
  'testimony',
  'forensic evidence',
  'circumstantial evidence',
  'verbal testimony',
  'documentary evidence',
  'material evidence',
  'eyewitness account',
  'confession',
  'deduction',
  'inference',
]);

const isDeliveryMethodLabel = (description: string | null | undefined): boolean => {
  if (!description) return false;
  return CLUE_DELIVERY_METHOD_LABELS.has(description.trim().toLowerCase());
};

/**
 * Check whether `token` (already lowercase, length ≥4) is present in `loweredText`.
 * Strips common English inflection suffixes so that, e.g.:
 *   "observation" matches "observed", "observing", "observable"
 *   "direct"      matches "directly", "direction", "directed"
 *   "tamper"      matches "tampered", "tampering"
 * Suffixes are tried longest-first so "ation" beats "ion" for "observation".
 */
const tokenMatchesText = (token: string, loweredText: string): boolean => {
  if (loweredText.includes(token)) return true;
  if (token.length < 5) return false;
  // Strip known inflection suffixes — require root ≥ 4 chars to avoid false positives
  const suffixes = ['ation', 'tion', 'ing', 'ion', 'ed', 'er'];
  for (const sfx of suffixes) {
    const rootLen = token.length - sfx.length;
    if (rootLen >= 4 && token.endsWith(sfx) && loweredText.includes(token.slice(0, rootLen))) {
      return true;
    }
  }
  // Fallback: chop one character (handles simple -s / short inflections)
  return loweredText.includes(token.slice(0, -1));
};

const getRequiredClueIdsForScene = (
  cmlCase: any,
  scene: any,
): string[] => {
  const mapped = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
    .filter((entry: any) =>
      Number(entry?.act_number) === Number(scene?.act) &&
      Number(entry?.scene_number) === Number(scene?.sceneNumber)
    )
    .map((entry: any) => String(entry?.clue_id || ""))
    .filter(Boolean);

  const sceneClues = (Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed : [])
    .map((id: unknown) => String(id || ""))
    .filter(Boolean);

  return Array.from(new Set([...mapped, ...sceneClues]));
};

const buildChapterRequirementLedger = (
  cmlCase: any,
  batchScenes: unknown[],
  chapterStart: number,
  targetLength: "short" | "medium" | "long",
  clueDistribution?: ClueDistributionResult,
): ChapterRequirementLedgerEntry[] => {
  const { hardFloorWords, preferredWords } = getChapterWordTargets(targetLength);
  return (batchScenes as any[]).map((scene, idx) => {
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene);
    const clueObligationContext: ClueObligationContext[] = requiredClueIds.map((id) => {
      const distClue = (clueDistribution?.clues ?? []).find((c) => c.id === id);
      const mappingEntry = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
        .find((e: any) => String(e?.clue_id) === id);
      return {
        id,
        description: distClue?.description ?? mappingEntry?.delivery_method ?? undefined,
        placement: distClue?.placement ?? (Number(mappingEntry?.act_number) === 1 ? 'early' : undefined),
        deliveryMethod: mappingEntry?.delivery_method ?? undefined,
      };
    });
    return {
      chapterNumber: chapterStart + idx,
      hardFloorWords,
      preferredWords,
      requiredClueIds,
      clueObligationContext,
    };
  });
};

// Behavioural/emotional clue descriptions use synonym-rich vocabulary that prose replaces
// with contextual equivalents. A 0.60 token threshold is too strict for these clues.
// If the description contains any of these markers, use 0.35 instead.
const BEHAVIOURAL_MARKERS = new Set([
  'behaviour', 'behavioral', 'emotion', 'emotional',
  'nervous', 'anxious', 'guilty', 'frightened', 'terrified', 'panicked',
  'suspicious', 'jealous', 'jealousy', 'angry', 'anger', 'grief',
  'distressed', 'evasive', 'agitated', 'uncomfortable', 'demeanour',
  'demeanor', 'motive', 'attitude', 'secretive', 'concealing', 'deceiving',
]);

const isBehaviouralClue = (description: string): boolean => {
  const lower = description.toLowerCase();
  for (const marker of BEHAVIOURAL_MARKERS) {
    if (lower.includes(marker)) return true;
  }
  return false;
};

const chapterMentionsRequiredClue = (
  chapterText: string,
  clueId: string,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): boolean => {
  const lowered = chapterText.toLowerCase();
  if (lowered.includes(clueId.toLowerCase())) {
    return true;
  }

  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || "") === clueId);
  if (!clue) return false;

  const descIsGenreLabel = isDeliveryMethodLabel(clue.description);
  // When description is a delivery-method label (e.g. "Direct observation"), its tokens
  // ("direct", "observation") never appear in narrative prose.  Use only pointsTo tokens.
  // If pointsTo is also empty, the clue metadata is incomplete — pass rather than
  // false-failing every attempt.
  const rawTokens = descIsGenreLabel
    ? Array.from(new Set(tokenizeForClueObligation(String(clue.pointsTo ?? "")))).slice(0, 10)
    : Array.from(new Set([
        ...tokenizeForClueObligation(String(clue.description ?? "")),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
      ])).slice(0, 10);

  // Strip proper-name tokens from non-cast characters so that clue descriptions written
  // by Agent 5 referencing source-text characters (not in the prose cast) don't
  // perpetually fail the token-match threshold.  Only applies when castNames is provided.
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, String(clue.description ?? ''), castNames)
    : rawTokens;

  // Genre-label clue with no usable pointsTo tokens — metadata is insufficient for
  // token-level validation.  Accept rather than perpetually failing.
  if (tokens.length === 0) return descIsGenreLabel ? true : false;
  const matched = tokens.filter((t) => tokenMatchesText(t, lowered));
  // Threshold 0.6 for factual clues: 60% of semantic tokens must match.
  // Behavioural/emotional clues use synonym-rich vocabulary — relax to 0.35 so e.g.
  // "nervousness" is satisfied by "fidgeted", "uneasy", "agitated" (R35 abort root cause).
  const behaviouralThreshold = isBehaviouralClue(clue?.description ?? '') ? 0.35 : 0.6;
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * behaviouralThreshold));
  return matched.length >= requiredMatches;
};

/**
 * For early-placement clues: check whether the clue tokens appear in the first
 * 25% of the chapter paragraphs (paragraph-window, not character offset).
 * Uses the same token-matching logic as chapterMentionsRequiredClue.
 */
const chapterClueAppearsEarly = (
  paragraphs: string[],
  clueId: string,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): boolean => {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return false;
  const quarterEnd = Math.max(1, Math.ceil(paragraphs.length * 0.25));
  const earlyText = paragraphs.slice(0, quarterEnd).join(' ').toLowerCase();

  if (earlyText.includes(clueId.toLowerCase())) return true;

  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || '') === clueId);
  if (!clue) return false;

  const descIsGenreLabel = isDeliveryMethodLabel(clue.description);
  const rawTokens = descIsGenreLabel
    ? Array.from(new Set(tokenizeForClueObligation(String(clue.pointsTo ?? '')))).slice(0, 10)
    : Array.from(new Set([
        ...tokenizeForClueObligation(String(clue.description ?? '')),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? '')),
      ])).slice(0, 10);

  // Strip proper-name tokens from non-cast characters (same logic as chapterMentionsRequiredClue).
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, String(clue.description ?? ''), castNames)
    : rawTokens;

  if (tokens.length === 0) return descIsGenreLabel ? true : false;
  const matched = tokens.filter((t) => tokenMatchesText(t, earlyText));
  // Early-placement only requires observational signal in the first quarter — not the full
  // analytical inference. Clue descriptions use conclusory language ("cannot be trusted to
  // indicate the time of death") while early prose is observational ("the clock stood at
  // half-past eleven"). A 25% token threshold (2 of 8) is enough to confirm the observation
  // beat is present early; the 40% threshold is used for the full-chapter presence check.
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * 0.25));
  return matched.length >= requiredMatches;
};

export const validateChapterPreCommitObligations = (
  chapter: ProseChapter,
  ledgerEntry: ChapterRequirementLedgerEntry,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): ChapterObligationResult => {
  const hardFailures: string[] = [];
  const preferredMisses: string[] = [];
  const chapterText = (chapter.paragraphs ?? []).join(" ");
  const wordCount = countWords(chapterText);
  const wordTarget: ChapterWordTargetResult = {
    wordCount,
    hardFloorWords: ledgerEntry.hardFloorWords,
    preferredWords: ledgerEntry.preferredWords,
    isBelowHardFloor: wordCount < ledgerEntry.hardFloorWords,
    isBelowPreferred: wordCount < ledgerEntry.preferredWords,
  };

  if (wordTarget.isBelowHardFloor) {
    hardFailures.push(
      `Chapter ${ledgerEntry.chapterNumber}: word count below hard floor (${wordCount}/${ledgerEntry.hardFloorWords})`
    );
  } else if (wordTarget.isBelowPreferred) {
    preferredMisses.push(
      `Chapter ${ledgerEntry.chapterNumber}: word count below preferred target (${wordCount}/${ledgerEntry.preferredWords})`
    );
  }

  for (const clueId of ledgerEntry.requiredClueIds) {
    const clue = (clueDistribution?.clues ?? []).find((e) => String(e?.id || '') === clueId);
    const ctx = (ledgerEntry.clueObligationContext ?? []).find((c) => c.id === clueId);
    const resolvedDesc = clue?.description?.trim() ?? ctx?.description?.trim() ?? null;
    const clueDesc = resolvedDesc ? `"${resolvedDesc}"` : `"${clueId}"`;
    const resolvedPlacement = clue?.placement ?? ctx?.placement ?? null;

    // Primary check via distribution; for unresolved IDs, also check ctx.description tokens
    let isPresent = chapterMentionsRequiredClue(chapterText, clueId, clueDistribution, castNames);
    if (!isPresent && !clue && ctx?.description) {
      // If ctx.description is a genre label, skip token matching — it can never match prose
      if (isDeliveryMethodLabel(ctx.description)) {
        isPresent = true;
      } else {
        const rawCtxTokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
        // Apply the same non-cast proper-name filter to the fallback path.
        const ctxTokens = castNames?.length
          ? filterNonCastProperNameTokens(rawCtxTokens, ctx.description, castNames)
          : rawCtxTokens;
        if (ctxTokens.length > 0) {
          const lowered = chapterText.toLowerCase();
          const matched = ctxTokens.filter((t) => tokenMatchesText(t, lowered));
          // Match threshold to clue type: 0.35 for behavioural/emotional, 0.6 for factual
          const isBehavioural = ctx?.description ? isBehaviouralClue(ctx.description) : false;
          const threshold = Math.max(1, Math.ceil(ctxTokens.length * (isBehavioural ? 0.35 : 0.6)));
          isPresent = matched.length >= threshold;
        }
      }
    }

    if (!isPresent) {
      // Clue content is entirely absent — tell the writer what needs to happen narratively.
      // Append pointsTo hint when the description is a genre label (e.g. "Direct observation")
      // so the retry directive contains actionable prose content, not just a delivery-method name.
      const pointsToHint = clue?.pointsTo?.trim();
      const extraHint = pointsToHint && pointsToHint !== resolvedDesc
        ? ` (this clue reveals: ${pointsToHint})`
        : '';
      const repair = resolvedPlacement === 'early'
        ? `Include an on-page observation of ${clueDesc}${extraHint} in the first 2 paragraphs of the chapter, followed immediately by an explicit inference paragraph.`
        : `Include an on-page observation or reference to ${clueDesc}${extraHint} before the chapter ends.`;
      hardFailures.push(
        `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is absent. ${repair}`
      );
    } else if (resolvedPlacement === 'early') {
      // Content is present but must also appear in the first 25% of paragraphs
      let isEarly = chapterClueAppearsEarly(chapter.paragraphs ?? [], clueId, clueDistribution, castNames);
      if (!isEarly && !clue && ctx?.description) {
        if (isDeliveryMethodLabel(ctx.description)) {
          isEarly = true;
        } else {
          const quarterEnd = Math.max(1, Math.ceil((chapter.paragraphs ?? []).length * 0.25));
          const earlyText = (chapter.paragraphs ?? []).slice(0, quarterEnd).join(' ').toLowerCase();
          const rawCtxEarlyTokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
          const ctxEarlyTokens = castNames?.length
            ? filterNonCastProperNameTokens(rawCtxEarlyTokens, ctx.description, castNames)
            : rawCtxEarlyTokens;
          if (ctxEarlyTokens.length > 0) {
            const matched = ctxEarlyTokens.filter((t) => tokenMatchesText(t, earlyText));
            const threshold = ctxEarlyTokens.length <= 4 ? 1 : Math.max(1, Math.ceil(ctxEarlyTokens.length * 0.4));
            isEarly = matched.length >= threshold;
          }
        }
      }
      if (!isEarly) {
        const quarterEndForMsg = Math.max(1, Math.ceil((chapter.paragraphs ?? []).length * 0.25));
        hardFailures.push(
          `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is present but must appear in paragraphs 1-${quarterEndForMsg} — move the observation beat to paragraph 1 or 2.`
        );
      }
    }
  }

  // Deduplicate: two clue IDs with the same description produce identical error strings.
  // Keep only the first occurrence so the retry directive is not repeated verbatim.
  const uniqueHardFailures = Array.from(new Set(hardFailures));
  return { hardFailures: uniqueHardFailures, preferredMisses, wordTarget };
};

const normalizeParagraphForFingerprint = (paragraph: string): string =>
  paragraph
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenizeWords = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);

const toNgrams = (tokens: string[], n: number): Set<string> => {
  const grams = new Set<string>();
  if (tokens.length < n) return grams;
  for (let i = 0; i <= tokens.length - n; i += 1) {
    grams.add(tokens.slice(i, i + n).join(" "));
  }
  return grams;
};

const jaccardSimilarity = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
};

const extractOpeningSentence = (paragraph: string): string => {
  const firstSentence = paragraph.match(/^[^.!?]+[.!?]/);
  return (firstSentence?.[0] ?? paragraph).trim();
};

const shannonEntropy = (values: string[]): number => {
  if (values.length === 0) return 0;
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  let entropy = 0;
  for (const count of counts.values()) {
    const p = count / values.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
};

const lintBatchProse = (
  batchChapters: ProseChapter[],
  priorChapters: ProseChapter[],
  priorOpeningStyles: string[],
  options?: {
    mode?: "standard" | "repair";
    chapterOffset?: number;
    entropyThreshold?: number;
    entropyMinWindow?: number;
    entropyWarmupChapters?: number;
  },
): ProseLinterIssue[] => {
  const issues: ProseLinterIssue[] = [];
  const styleLinterConfig = getGenerationParams().agent9_prose.style_linter;
  const entropyConfig = styleLinterConfig.entropy;
  const mode = options?.mode ?? "standard";
  const chapterOffset = Math.max(0, options?.chapterOffset ?? 0);
  const entropyMinWindow = Math.max(
    2,
    options?.entropyMinWindow ??
      (mode === "repair" ? entropyConfig.min_window_repair : entropyConfig.min_window_standard),
  );
  const entropyWarmupChapters = Math.max(
    0,
    options?.entropyWarmupChapters ??
      (mode === "repair" ? entropyConfig.warmup_chapters_repair : entropyConfig.warmup_chapters_standard),
  );
  const generatedChapterCount = chapterOffset + priorChapters.length + batchChapters.length;
  const adaptiveStandardEntropyThreshold = (() => {
    // Short stories have fewer chapters to establish variety, so the threshold starts lower
    // and tightens as the run grows.  Three tiers:
    //   ≤6 chapters  → 0.65 (lenient: small window = low inherent entropy)
    //   ≤10 chapters → 0.72 (moderate)
    //   >10 chapters → 0.80 (strict: any style recycling is now clearly a template defect)
    if (generatedChapterCount <= entropyConfig.standard.early_chapter_max) {
      return entropyConfig.standard.early_threshold;
    }
    if (generatedChapterCount <= entropyConfig.standard.mid_chapter_max) {
      return entropyConfig.standard.mid_threshold;
    }
    return entropyConfig.standard.late_threshold;
  })();
  const entropyThreshold =
    options?.entropyThreshold ??
    (mode === "repair" ? entropyConfig.repair_threshold : adaptiveStandardEntropyThreshold);

  const candidateOpeningStyles = batchChapters
    .map((chapter) => (chapter.paragraphs?.[0] ? classifyOpeningStyle(extractOpeningSentence(chapter.paragraphs[0])) : "general-descriptive"))
    .filter(Boolean);
  const openingWindow = [
    ...priorOpeningStyles.slice(-entropyConfig.opening_styles_prior_window),
    ...candidateOpeningStyles,
  ].slice(-entropyConfig.opening_styles_total_window);
  const entropyCheckReady = generatedChapterCount > entropyWarmupChapters;
  if (entropyCheckReady && openingWindow.length >= entropyMinWindow) {
    const entropy = shannonEntropy(openingWindow);
    if (entropy < entropyThreshold) {
      issues.push({
        type: "opening_style_entropy",
        message: `Template linter: opening-style entropy too low (${entropy.toFixed(2)} < ${entropyThreshold.toFixed(2)}). Vary chapter openings and avoid repeated style buckets.`,
      });
    }
  }

  // Paragraph fingerprint check: exact deduplication of long prose blocks across chapters.
  // Minimum length is configurable to avoid false positives on short scene-setter fragments.
  const priorFingerprints = new Set<string>();
  priorChapters.forEach((chapter) => {
    (chapter.paragraphs ?? []).forEach((paragraph) => {
      const normalized = normalizeParagraphForFingerprint(paragraph);
      if (normalized.length >= styleLinterConfig.paragraph_fingerprint_min_chars) {
        priorFingerprints.add(normalized);
      }
    });
  });
  const batchSeen = new Set<string>();
  for (const chapter of batchChapters) {
    for (const paragraph of chapter.paragraphs ?? []) {
      const normalized = normalizeParagraphForFingerprint(paragraph);
      if (normalized.length < styleLinterConfig.paragraph_fingerprint_min_chars) continue;
      if (priorFingerprints.has(normalized) || batchSeen.has(normalized)) {
        issues.push({
          type: "paragraph_fingerprint",
          message: "Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.",
        });
        break;
      }
      batchSeen.add(normalized);
    }
    if (issues.some((issue) => issue.type === "paragraph_fingerprint")) break;
  }

  // N-gram overlap check: catches near-duplicate prose that evades exact fingerprinting
  // (e.g. when the LLM swaps a few words but keeps the same sentence structure).
  // We compare configurable n-gram Jaccard similarity against a bounded prior paragraph set.
  const priorCandidates = priorChapters
    .flatMap((chapter) => chapter.paragraphs ?? [])
    .map((paragraph) => normalizeParagraphForFingerprint(paragraph))
    .filter((paragraph) => paragraph.length >= styleLinterConfig.ngram.min_chars)
    .slice(-styleLinterConfig.ngram.prior_paragraph_limit);
  const priorNgrams = priorCandidates.map((paragraph) =>
    toNgrams(tokenizeWords(paragraph), styleLinterConfig.ngram.gram_size),
  );

  if (priorNgrams.length > 0) {
    outer: for (const chapter of batchChapters) {
      for (const paragraph of chapter.paragraphs ?? []) {
        const normalized = normalizeParagraphForFingerprint(paragraph);
        if (normalized.length < styleLinterConfig.ngram.min_chars) continue;
        const candidate = toNgrams(tokenizeWords(normalized), styleLinterConfig.ngram.gram_size);
        if (candidate.size < styleLinterConfig.ngram.min_candidate_ngrams) continue;
        for (const base of priorNgrams) {
          const overlap = jaccardSimilarity(candidate, base);
          if (overlap >= styleLinterConfig.ngram.overlap_threshold) {
            issues.push({
              type: "ngram_overlap",
              message: `Template linter: high n-gram overlap detected (${overlap.toFixed(2)} >= ${styleLinterConfig.ngram.overlap_threshold.toFixed(2)}). Rephrase this passage to avoid template leakage.`,
            });
            break outer;
          }
        }
      }
    }
  }

  return issues;
};

type CanonicalSeason = 'spring' | 'summer' | 'autumn' | 'winter';

const MONTH_TO_SEASON: Record<string, CanonicalSeason> = {
  january: 'winter',
  february: 'winter',
  march: 'spring',
  april: 'spring',
  may: 'spring',
  june: 'summer',
  july: 'summer',
  august: 'summer',
  september: 'autumn',
  october: 'autumn',
  november: 'autumn',
  december: 'winter',
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── WORLD FIX C (ANALYSIS_17) ───────────────────────────────────────────
// Remove month-word guard from enforceMonthSeasonLockOnChapter().
// Previously the repair only fired when the canonical month word (e.g. "january")
// appeared verbatim in the chapter text. The most common failure mode is seasonal
// drift in chapters that never mention the month explicitly — the guard silently
// skipped those cases, letting the validator catch and burn a retry instead.
// All WORLD FIX C changes are tagged [WORLD FIX C] below.
//
// To revert World Fix C in full:
//   1. In enforceMonthSeasonLockOnChapter(), replace the [WORLD FIX C] comment
//      and `const chapterText = chapter.paragraphs.join(' ');` line with:
//        const monthPattern = new RegExp(`\\b${escapeRegExp(lock.month)}\\b`, 'i');
//        const chapterText = chapter.paragraphs.join(' ');
//        if (!monthPattern.test(chapterText)) {
//          return chapter;
//        }
// ─────────────────────────────────────────────────────────────────────────
const normalizeMonthToken = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normal = value.trim().toLowerCase();
  return normal.length > 0 ? normal : undefined;
};

const capitalizeWord = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const deriveTemporalSeasonLock = (
  temporalContext: ProseGenerationInputs['temporalContext'] | undefined,
): { month: string; season: CanonicalSeason } | undefined => {
  const month = normalizeMonthToken(temporalContext?.specificDate?.month);
  if (!month) return undefined;

  const season = MONTH_TO_SEASON[month];
  if (!season) return undefined;

  return { month, season };
};

/** Returns the exclusive allowed-vocabulary string for the given canonical season. */
const getSeasonAllowList = (season: CanonicalSeason | string): string => {
  const allowLists: Record<CanonicalSeason, string> = {
    autumn: 'autumn, autumnal, fall',
    winter: 'winter, wintry, midwinter',
    spring: 'spring, vernal, springtime',
    summer: 'summer, summery, midsummer',
  };
  return allowLists[season as CanonicalSeason] ?? season;
};

// These patterns MUST cover every token that temporal-consistency.ts SEASON_PATTERNS can detect
// as a wrong-season match — otherwise enforceMonthSeasonLockOnChapter silently lets the word
// through and the chapter validator flags it as a contradiction on every attempt.
//
// temporal-consistency.ts canonical sets:
//   spring  → spring | springtime | vernal
//   summer  → summer | summertime | midsummer | summery
//   autumn  → autumn | autumnal | fall
//   winter  → winter | wintertime | wintry
const conflictingSeasonPatterns: Record<CanonicalSeason, RegExp[]> = {
  spring: [/\b(summer|summertime|midsummer|summery|autumn|autumnal|fall|winter|wintertime|wintry)\b/gi],
  summer: [/\b(spring|springtime|vernal|autumn|autumnal|fall|winter|wintertime|wintry)\b/gi],
  autumn: [/\b(spring|springtime|vernal|summer|summertime|midsummer|summery|winter|wintertime|wintry)\b/gi],
  winter: [/\b(spring|springtime|vernal|summer|summertime|midsummer|summery|autumn|autumnal|fall)\b/gi],
};

const enforceMonthSeasonLockOnChapter = (
  chapter: ProseChapter,
  lock: { month: string; season: CanonicalSeason } | undefined,
): ProseChapter => {
  if (!lock) return chapter;
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0) return chapter;

  // [WORLD FIX C] Apply repair unconditionally — do not gate on the month word being present.
  // The most common failure mode is seasonal-language drift in chapters that never mention the
  // month explicitly. The repair is safe to run always: if no conflicting season words appear,
  // `changed` stays false and the original chapter is returned unchanged.
  const chapterText = chapter.paragraphs.join(' ');
  const expectedSeason = lock.season;
  const patterns = conflictingSeasonPatterns[expectedSeason];
  let changed = false;

  const rewritten = chapter.paragraphs.map((paragraph) => {
    let next = paragraph;
    for (const pattern of patterns) {
      next = next.replace(pattern, (matched) => {
        changed = true;
        return matched.charAt(0) === matched.charAt(0).toUpperCase()
          ? capitalizeWord(expectedSeason)
          : expectedSeason;
      });
    }
    return next;
  });

  if (!changed) return chapter;

  return {
    ...chapter,
    paragraphs: rewritten,
  };
};

// ─── WORLD FIX A (ANALYSIS_17) ───────────────────────────────────────────
// Add authoritative season enforcement into buildWorldBriefBlock().
// Previously the World Document injected era atmosphere (eraRegister) but no
// season vocabulary rule. Season enforcement lived in the temporal_context block
// (medium priority, droppable under token pressure). This fix derives the correct
// season from historicalMoment.specificDate and emits a "## Season Lock" section
// inside world_document (high priority, never dropped).
// All WORLD FIX A changes are tagged [WORLD FIX A] below.
//
// To revert World Fix A in full:
//   1. In buildWorldBriefBlock(), delete the entire [WORLD FIX A] code block:
//      from `const hmDateLower = String(hm.specificDate ?? '').toLowerCase();`
//      through the closing `}` of the `if (hmMonth) { ... }` block.
//      (The four preceding lines — lines.push Era, eraRegister, emotionalRegister,
//      physicalConstraints — are unchanged and must be kept.)
// ─────────────────────────────────────────────────────────────────────────
/**
 * Builds the WORLD DOCUMENT brief block injected into per-chapter prose prompts.
 *
 * When a WorldDocument is present, it supersedes raw character/location/temporal
 * blocks with richer, emotionally-grounded context. The gross structure of
 * temporal/fashion/location is still provided  by the regular blocks so the
 * world brief focuses on voice, humour, and emotional arc.
 */
const buildWorldBriefBlock = (
  worldDoc: any,
  chapterIndex: number,
  totalChapters: number,
  characterPronouns?: Record<string, string>, // [PHASE 1] inline (he/him) labels in Character Voices headings
): string => {
  if (!worldDoc) return '';

  const lines: string[] = [];
  lines.push('\n\nWORLD DOCUMENT (use this as your primary creative context):');

  // Historical moment
  const hm = worldDoc.historicalMoment;
  if (hm) {
    lines.push(`\n## Era: ${hm.specificDate}`);
    if (hm.eraRegister) lines.push(hm.eraRegister);
    if (hm.emotionalRegister) lines.push(`Emotional register: ${hm.emotionalRegister}`);
    if (Array.isArray(hm.physicalConstraints) && hm.physicalConstraints.length > 0) {
      lines.push('Physical constraints: ' + hm.physicalConstraints.slice(0, 4).join(' | '));
    }
    if (Array.isArray(hm.currentTensions) && hm.currentTensions.length > 0) {
      lines.push('Current tensions (weave into background texture): ' + hm.currentTensions.slice(0, 3).join(' | '));
    }
    if (hm.wartimeServiceContext) {
      const wsc = hm.wartimeServiceContext;
      lines.push(`Wartime context — ${wsc.serviceStatus}: ${wsc.socialTexture}${wsc.absenceEffect ? ` Absence effect: ${wsc.absenceEffect}` : ''}`);
    }
    // [WORLD FIX A] Season lock: derive season authoritatively from specificDate.
    // Lives in world_document (high priority) and cannot be dropped by token-budget cuts.
    // This is the canonical temporal contract — all other season references are secondary.
    const hmDateLower = String(hm.specificDate ?? '').toLowerCase();
    const hmMonth = Object.keys(MONTH_TO_SEASON).find(m => hmDateLower.includes(m));
    if (hmMonth) {
      const hmSeason = MONTH_TO_SEASON[hmMonth];
      const hmForbidden = ['spring', 'summer', 'autumn', 'winter']
        .filter(s => s !== hmSeason)
        .join(', ');
      lines.push(`\n## Season Lock (mandatory — derived from ${hm.specificDate})`);
      lines.push(`Season: ${hmSeason}. Allowed vocabulary: ${getSeasonAllowList(hmSeason)}`);
      lines.push(`Forbidden seasonal words — never use in narration, dialogue, or metaphor: ${hmForbidden} and their adjectival forms.`);
      lines.push(`Every weather description, atmosphere, and time-of-year reference must be consistent with ${hmSeason}.`);
    }
  }

  // Story theme
  if (worldDoc.storyTheme) {
    lines.push(`\n## Story Theme\n${worldDoc.storyTheme}`);
  }

  // Emotional arc overview + position-specific beat
  const arc = worldDoc.storyEmotionalArc;
  if (arc) {
    if (arc.dominantRegister) {
      lines.push(`\n## Story Emotional Register\nDominant: ${arc.dominantRegister}`);
    }
    if (Array.isArray(arc.turningPoints)) {
    const arcPosition = chapterIndex <= 1 ? 'opening'
      : chapterIndex <= Math.floor(totalChapters * 0.25) ? 'early'
      : chapterIndex <= Math.floor(totalChapters * 0.4) ? 'first_turn'
      : chapterIndex <= Math.floor(totalChapters * 0.55) ? 'mid'
      : chapterIndex <= Math.floor(totalChapters * 0.7) ? 'second_turn'
      : chapterIndex <= Math.floor(totalChapters * 0.8) ? 'pre_climax'
      : chapterIndex === totalChapters - 1 ? 'resolution'
      : 'climax';
    const tp = arc.turningPoints.find((t: any) => t.position === arcPosition);
    if (tp?.emotionalDescription) {
      lines.push(`\n## Emotional register at this point in the story\n${tp.emotionalDescription}`);
    }
    }
    // Ending note — only in final act (helps shape denouement texture)
    if (arc.endingNote && chapterIndex >= Math.floor(totalChapters * 0.75)) {
      lines.push(`\n## Ending note (shape final chapters toward this)\n${arc.endingNote}`);
    }
  }

  // Character portraits — physical appearance + era intersection
  if (Array.isArray(worldDoc.characterPortraits) && worldDoc.characterPortraits.length > 0) {
    lines.push('\n## Character Portraits (appearance & era)');
    for (const portrait of worldDoc.characterPortraits) {
      lines.push(`\n### ${portrait.name}`);
      if (portrait.portrait) lines.push(portrait.portrait);
      if (portrait.eraIntersection) lines.push(`Era intersection: ${portrait.eraIntersection}`);
    }
  }

  // Character voice sketches — all available registers (comfortable, evasive, stressed, formal, humorous)
  if (Array.isArray(worldDoc.characterVoiceSketches) && worldDoc.characterVoiceSketches.length > 0) {
    lines.push('\n## Character Voices');
    for (const sketch of worldDoc.characterVoiceSketches) {
      const pronounsLabel = characterPronouns?.[sketch.name] ? ` (${characterPronouns[sketch.name]})` : ''; // [PHASE 1]
      lines.push(`\n### ${sketch.name}${pronounsLabel}`);
      if (sketch.voiceDescription) lines.push(sketch.voiceDescription);
      // Show up to 3 fragments across all registers so the LLM can vary voice by context
      const fragments = (sketch.fragments ?? []).slice(0, 3);
      for (const frag of fragments) {
        lines.push(`[${frag.register}] ${frag.text}`);
      }
      if (sketch.humourNote) lines.push(`Humour: ${sketch.humourNote}`);
    }
  }

  // Location registers — emotional register, camera angle, era note per key location
  if (Array.isArray(worldDoc.locationRegisters) && worldDoc.locationRegisters.length > 0) {
    lines.push('\n## Location Registers (scene framing guides)');
    for (const reg of worldDoc.locationRegisters) {
      lines.push(`\n${reg.name}: ${reg.emotionalRegister}. Camera angle: ${reg.cameraAngle}.${reg.eraNote ? ` Era: ${reg.eraNote}` : ''}`);
    }
  }

  // Humour placement map — scene-position-specific humour permission
  if (Array.isArray(worldDoc.humourPlacementMap) && worldDoc.humourPlacementMap.length > 0) {
    const arcPosForHumour = chapterIndex <= 1 ? 'opening'
      : chapterIndex <= Math.floor(totalChapters * 0.25) ? 'early'
      : chapterIndex <= Math.floor(totalChapters * 0.4) ? 'first_turn'
      : chapterIndex <= Math.floor(totalChapters * 0.55) ? 'mid'
      : chapterIndex <= Math.floor(totalChapters * 0.7) ? 'second_turn'
      : chapterIndex <= Math.floor(totalChapters * 0.8) ? 'pre_climax'
      : chapterIndex === totalChapters - 1 ? 'resolution'
      : 'climax';
    const humourEntry = worldDoc.humourPlacementMap.find((e: any) => e.scenePosition === arcPosForHumour);
    if (humourEntry) {
      const permitted = humourEntry.permittedCharacters?.join(', ') ?? '';
      const forms = humourEntry.permittedForms?.join(', ') ?? '';
      lines.push(`\n## Humour guidance for this story position (${arcPosForHumour})`);
      lines.push(`Permission: ${humourEntry.humourPermission}${humourEntry.condition ? ` — condition: ${humourEntry.condition}` : ''}`);
      if (permitted) lines.push(`Characters who may be funny: ${permitted}`);
      if (forms) lines.push(`Permitted forms: ${forms}`);
      lines.push(`Rationale: ${humourEntry.rationale}`);
    }
  }

  // Break moment — include near the right scene position
  const bm = worldDoc.breakMoment;
  if (bm) {
    const relativePos = chapterIndex / Math.max(1, totalChapters);
    if (relativePos >= 0.6 && relativePos <= 0.85) {
      lines.push(`\n## Character Break Moment (this section of the story)\nCharacter: ${bm.character}\nForm: ${bm.form}\nNarrative function: ${bm.narrativeFunction}`);
    }
  }

  // Reveal implications — only in final act
  if (worldDoc.revealImplications && chapterIndex >= Math.floor(totalChapters * 0.75)) {
    lines.push(`\n## Reveal Implications (plant these subtly)\n${worldDoc.revealImplications}`);
  }

  return lines.join('\n');
};

const buildContextSummary = (caseData: CaseData, cast: CastDesign) => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const title = meta.title ?? "Untitled Mystery";
  const falseAssumption = cmlCase.false_assumption?.statement ?? "";
  const culpritNames = cmlCase.culpability?.culprits ?? [];
  const culprit = Array.isArray(culpritNames) ? culpritNames.join(", ") : "Unknown";
  // Annotate each character with their pronoun form so the user message —
  // the last instruction the LLM reads before generating — carries explicit
  // pronoun identity alongside every name. For non-binary characters the
  // annotation uses the singular form to prime the correct completion path.
  const castNames = cast.characters.map((c: any) => {
    const g = (c.gender ?? '').toLowerCase();
    if (g === 'non-binary') return `${c.name} (they/them)`;
    if (g === 'female')     return `${c.name} (she/her)`;
    if (g === 'male')       return `${c.name} (he/him)`;
    return c.name;
  }).join(', ');

  // When any cast member is non-binary, add an explicit forbidden-forms reminder
  // directly in the user message — the proximal generation trigger.
  const nonBinaryCast = cast.characters.filter((c: any) => (c.gender ?? '').toLowerCase() === 'non-binary');
  const nonBinaryUserReminder = nonBinaryCast.length > 0
    ? `\n\n⚠ PRONOUN REMINDER: ${nonBinaryCast.map((c: any) => c.name).join(', ')} use they/them/their (singular). ` +
      `Never write she/her or he/him for these characters.`
    : '';

  // Resolve victim's full name from cast by role field or roleArchetype substring
  const victimCharacter = cast.characters.find(
    (c: any) => {
      if (c.role === 'victim') return true;
      const archetype: string = c.roleArchetype ?? (c as any).role_archetype ?? '';
      return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    }
  );
  const victimName = (victimCharacter as any)?.name ?? '';
  const victimLine = victimName ? `\nVictim: ${victimName}` : '';

  return `# Case Overview\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCrime: ${crimeClass.category ?? "murder"} (${crimeClass.subtype ?? "unknown"})\nCulprit: ${culprit}${victimLine}\nFalse assumption: ${falseAssumption}\nCast: ${castNames}${nonBinaryUserReminder}\n\nSetting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type.`;
};

/**
 * Returns the victim character's full name from the cast, or '' if not found.
 * Used to enforce named-victim guardrails in prose prompts.
 */
export const resolveVictimName = (cast: CastDesign): string => {
  const victimChar = cast.characters.find(
    (c: any) => {
      if (c.role === 'victim') return true;
      const archetype: string = c.roleArchetype ?? (c as any).role_archetype ?? '';
      return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    }
  );
  return (victimChar as any)?.name ?? '';
};

/**
 * Extract prose requirements from CML for validation
 * Returns formatted string describing mandatory prose elements
 */
const buildProseRequirements = (caseData: CaseData, scenesForChapter?: unknown[]): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const proseReqs = cmlCase.prose_requirements ?? {};
  
  if (!proseReqs || Object.keys(proseReqs).length === 0) {
    return '';
  }

  let output = '\n\nCRITICAL PROSE REQUIREMENTS:\n\n';
  output += 'The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.\n\n';

  // Discriminating test scene
  if (proseReqs.discriminating_test_scene) {
    const dts = proseReqs.discriminating_test_scene;
    output += `**Discriminating Test Scene (Act ${dts.act_number}, Scene ${dts.scene_number}):**\n`;
    // tests_assumption_elements does not exist in cml_2_0 schema — removed (PS-3 fix)
    output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
    // discriminating_test_scene.outcome does not exist in schema — omit rather than output 'N/A'
    if (dts.test_type) output += `Test type: ${dts.test_type}\n`;
    output += '\n';
  }

  // Suspect clearance scenes
  if (proseReqs.suspect_clearance_scenes && proseReqs.suspect_clearance_scenes.length > 0) {
    output += '**Suspect Clearance Scenes:**\n';
    proseReqs.suspect_clearance_scenes.forEach((clearance: any) => {
      output += `- ${clearance.suspect_name} (Act ${clearance.act_number}, Scene ${clearance.scene_number}): ${clearance.clearance_method}\n`;
      // CML schema field is supporting_clues, not required_clues (PS-4 fix)
      if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
        output += `  Clues: ${clearance.supporting_clues.join(', ')}\n`;
      }
    });
    output += '\n';
  }

  // Culprit revelation scene
  if (proseReqs.culprit_revelation_scene) {
    const crs = proseReqs.culprit_revelation_scene;
    output += `**Culprit Revelation Scene (Act ${crs.act_number}, Scene ${crs.scene_number}):**\n`;
    output += `Method: ${crs.revelation_method || 'detective explanation'}\n`;
    // culprit_revelation_scene has no required_clues in schema — use clue_to_scene_mapping (PS-4 fix)
    const crsClues = ((proseReqs.clue_to_scene_mapping ?? []) as any[]).filter(
      (m: any) => m.act_number === crs.act_number && m.scene_number === crs.scene_number
    ).map((m: any) => m.clue_id).filter(Boolean);
    if (crsClues.length > 0) {
      output += `Must reference clues: ${crsClues.join(', ')}\n`;
    }
    output += '\n';
  }

  // Identity rules (culprit reference restrictions)
  // The CML schema defines identity_rules as an ARRAY of per-character objects, not a scalar.
  // Each entry has: character_name, revealed_in_act (optional), before_reveal_reference, after_reveal_reference
  if (Array.isArray(proseReqs.identity_rules) && proseReqs.identity_rules.length > 0) {
    output += '**Identity Protection Rules:**\n';
    for (const rule of proseReqs.identity_rules) {
      output += `Character: ${rule.character_name}\n`;
      if (rule.revealed_in_act != null) {
        output += `- Before Act ${rule.revealed_in_act}: refer as "${rule.before_reveal_reference}"\n`;
        output += `- From Act ${rule.revealed_in_act} onward: refer as "${rule.after_reveal_reference}"\n`;
      } else {
        output += `- Before revelation: refer as "${rule.before_reveal_reference}"\n`;
        output += `- After revelation: refer as "${rule.after_reveal_reference}"\n`;
      }
    }
    output += '\n';
  }

  // Clue to scene mapping for this chapter
  if (proseReqs.clue_to_scene_mapping && scenesForChapter) {
    const relevantClues = proseReqs.clue_to_scene_mapping.filter((mapping: any) => {
      // Use Number() coercion: act_number/scene_number may arrive as strings from JSON
      return scenesForChapter.some((scene: any) => 
        Number(scene.act) === Number(mapping.act_number) && Number(scene.sceneNumber) === Number(mapping.scene_number)
      );
    });
    
    if (relevantClues.length > 0) {
      output += '**Clue Placement for These Chapters:**\n';
      relevantClues.forEach((mapping: any) => {
        output += `- ${mapping.clue_id} must appear in Act ${mapping.act_number}, Scene ${mapping.scene_number} via ${mapping.delivery_method}\n`;
      });
      output += '\n';
    }
  }

  output += '**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.\n';

  return output;
};

/**
 * Strip phantom character names from scene data.
 *
 * 1. Characters array — remove any name not in the valid cast list.
 * 2. Summary / title text — replace any `Title Surname` pattern
 *    whose surname is not a valid cast member with an anonymous equivalent.
 *
 * This prevents phantom names baked into the narrative outline (e.g. from stale
 * LLM examples) from instructing the prose LLM to write about non-existent people.
 * If filtering the characters array would leave it empty, the original is preserved
 * so the scene still has context.
 */
function sanitizeScenesCharacters(scenes: any[], validCastNames: string[]): any[] {
  const validSet = new Set(validCastNames);
  const sanitizeText = (text: string): string => anonymizeUnknownTitledNames(text, validCastNames);

  return scenes.map(scene => {
    if (!scene) return scene;
    const sanitized = Array.isArray(scene.characters)
      ? scene.characters.filter((name: any) => typeof name === 'string' && validSet.has(name))
      : scene.characters;

    // Sanitize all free-text fields that the prose LLM reads — not just summary/title.
    // The outline LLM commonly writes phantom names in purpose and dramaticElements too.
    const sanitizedDramaticElements = scene.dramaticElements
      ? Object.fromEntries(
          Object.entries(scene.dramaticElements as Record<string, any>).map(([k, v]) => [
            k,
            typeof v === 'string' ? sanitizeText(v) : v,
          ])
        )
      : scene.dramaticElements;

    return {
      ...scene,
      characters: sanitized?.length > 0 ? sanitized : scene.characters,
      summary: typeof scene.summary === 'string' ? sanitizeText(scene.summary) : scene.summary,
      title: typeof scene.title === 'string' ? sanitizeText(scene.title) : scene.title,
      purpose: typeof scene.purpose === 'string' ? sanitizeText(scene.purpose) : scene.purpose,
      dramaticElements: sanitizedDramaticElements,
    };
  });
}

/**
 * Sanitize generated chapter prose to remove invented titled names before validation.
 *
 * Converts unknown `Title Surname` mentions into anonymous role phrases
 * (e.g. "Detective Harlow" -> "the detective"). This acts as a hard safety
 * net for late-chapter retries where the model may still drift into
 * genre-attractor names.
 */
function sanitizeGeneratedChapter(chapter: ProseChapter, validCastNames: string[]): ProseChapter {
  const sanitizeText = (text: string): string => anonymizeUnknownTitledNames(text, validCastNames);

  return {
    ...chapter,
    title: typeof chapter.title === 'string' ? sanitizeText(chapter.title) : chapter.title,
    summary: typeof chapter.summary === 'string' ? sanitizeText(chapter.summary) : chapter.summary,
    paragraphs: Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs.map((p) => (typeof p === 'string' ? sanitizeText(p) : p))
      : chapter.paragraphs,
  };
}

export function buildTimelineStateBlock(
  temporalLock: { month: string; season: CanonicalSeason } | undefined,
  lockedFacts: ProseGenerationInputs['lockedFacts'] | undefined,
  cmlCase: any,
): string {
  const lines: string[] = [];

  if (temporalLock) {
    lines.push(`- Timeline anchor: ${capitalizeWord(temporalLock.month)} (${temporalLock.season}).`);
    lines.push(`- Month, season, weather, and time-of-year language in this batch must stay compatible with ${temporalLock.season}.`);
  }

  const constraintTime = cmlCase?.constraint_space?.time ?? cmlCase?.constraint_space?.timeline ?? {};
  const anchors = Array.isArray(constraintTime?.anchors) ? constraintTime.anchors : [];
  anchors
    .map((anchor: unknown) => String(anchor ?? '').trim())
    .filter(Boolean)
    .slice(0, 5)
    .forEach((anchor: string) => lines.push(`- Established timeline fact: ${anchor}`));

  (lockedFacts ?? [])
    .filter((fact) => /time|clock|hour|minute|midnight|dawn|dusk|morning|afternoon|evening|night/i.test(`${fact.description} ${fact.value}`))
    .slice(0, 6)
    .forEach((fact) => lines.push(`- If referenced, use exact time phrase: "${fact.value}" (${fact.description}).`));

  if (lines.length === 0) {
    return '';
  }

  return `\n\nFROZEN TIMELINE STATE (DO NOT ALTER):\n${lines.join('\n')}`;
}

export function buildChapterObligationBlock(
  scenesForChapter: unknown[],
  chapterStart: number,
  cmlCase: any,
  lockedFacts: ProseGenerationInputs['lockedFacts'] | undefined,
  temporalLock: { month: string; season: CanonicalSeason } | undefined,
  clueDistribution?: ClueDistributionResult,
  wordTarget?: { targetWords: number },
): string {
  if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0) {
    return '';
  }

  const proseRequirements = cmlCase?.prose_requirements ?? {};
  const dtScene = proseRequirements?.discriminating_test_scene;
  const clearanceScenes = Array.isArray(proseRequirements?.suspect_clearance_scenes)
    ? proseRequirements.suspect_clearance_scenes
    : [];

  const clueMap = new Map<string, Clue>(
    (clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  const deliveryMethodMap = new Map<string, { delivery_method?: string; act_number?: number; scene_number?: number }>(
    ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .filter((e: any) => e?.clue_id)
      .map((e: any) => [String(e.clue_id), e]),
  );

  const lines: string[] = ['CHAPTER OBLIGATION CONTRACT (MUST SATISFY):'];

  (scenesForChapter as any[]).forEach((scene, idx) => {
    const chapterNumber = chapterStart + idx;
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene);
    const locationAnchor = String(scene?.setting?.location || scene?.location || '').trim();
    const matchingClearances = clearanceScenes.filter((entry: any) =>
      Number(entry?.act_number) === Number(scene?.act) &&
      Number(entry?.scene_number) === Number(scene?.sceneNumber),
    );
    const isDiscriminatingTestChapter =
      Number(dtScene?.act_number) === Number(scene?.act) &&
      Number(dtScene?.scene_number) === Number(scene?.sceneNumber);

    lines.push(`- Chapter ${chapterNumber}:`);
    if (wordTarget) {
      lines.push(`  - Word count: Target AT LEAST ${wordTarget.targetWords} words. Do not cut this chapter short.`);
    }
    lines.push(`  - Location anchor: ${locationAnchor || 'use the canonical scene location immediately in the opening paragraph'}.`);

    if (requiredClueIds.length > 0) {
      lines.push(`  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):`);
      for (const clueId of requiredClueIds) {
        const clue = clueMap.get(clueId);
        if (clue) {
          const earlyFlag = clue.placement === 'early'
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${clue.description.trim()} [${clueId}]${earlyFlag}`);
          lines.push(`      Points to: ${clue.pointsTo.trim()}`);
          if (clue.placement === 'early') {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):`);
            lines.push(`         Paragraph 1: The POV character physically approaches or directly observes this evidence.`);
            lines.push(`           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).`);
            lines.push(`         Paragraph 2 (immediately following): The detective or POV character explicitly reasons`);
            lines.push(`           about what this evidence implies — who it implicates, why it may be unreliable,`);
            lines.push(`           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.`);
          }
        } else {
          // Fallback: no distribution data — use delivery_method from clue_to_scene_mapping if available
          const mapping = deliveryMethodMap.get(clueId);
          const fallbackDesc = mapping?.delivery_method
            ? mapping.delivery_method.trim()
            : 'observable evidence relevant to the investigation';
          const isEarlyMapping = Number(mapping?.act_number) === 1;
          const earlyFlagFallback = isEarlyMapping
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${fallbackDesc} [${clueId}]${earlyFlagFallback}`);
          lines.push(`      Points to: what this observation reveals about the time or circumstances of the crime.`);
          if (isEarlyMapping) {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):`);
            lines.push(`         Paragraph 1: The POV character physically approaches or directly observes this evidence.`);
            lines.push(`           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).`);
            lines.push(`         Paragraph 2 (immediately following): The detective or POV character explicitly reasons`);
            lines.push(`           about what this evidence implies — who it implicates, why it may be unreliable,`);
            lines.push(`           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.`);
          }
        }
      }
    } else {
      lines.push(`  - Clue obligations: none for this chapter.`);
    }

    if (matchingClearances.length > 0) {
      lines.push(`  - Suspect clearance required: ${matchingClearances.map((entry: any) => `${entry.suspect_name} via ${entry.clearance_method}`).join('; ')}.`);
    }
    if (isDiscriminatingTestChapter) {
      lines.push('  - Discriminating test required: YES. Dramatize the trap or confrontation explicitly; do not summarize it afterward.');
    }
  });

  if ((lockedFacts ?? []).length > 0) {
    lines.push('- Locked fact phrase obligations:');
    (lockedFacts ?? []).slice(0, 8).forEach((fact) => {
      lines.push(`  - If this batch mentions ${fact.description}, write exactly: "${fact.value}".`);
    });
  }

  if (temporalLock) {
    lines.push(`- Seasonal vocabulary allow-list: ${getSeasonAllowList(temporalLock.season)}.`);
    lines.push(`- Forbidden seasonal words: ${['spring', 'summer', 'autumn', 'winter'].filter((s) => s !== temporalLock.season).join(', ')}.`);
  }

  return `\n\n${lines.join('\n')}`;
}

export function detectRecurringPhrases(
  chapters: ProseChapter[],
  ngramSize = 7,
  threshold = 3,
): string[] {
  const chapterHits = new Map<string, Set<number>>();

  chapters.forEach((chapter, index) => {
    const tokens = tokenizeWords((chapter.paragraphs ?? []).join(' '));
    const grams = toNgrams(tokens, ngramSize);
    for (const gram of grams) {
      const parts = gram.split(' ');
      const contentWords = parts.filter((part) => part.length > 3 && !CLUE_TOKEN_STOPWORDS.has(part));
      if (contentWords.length < 3) continue;
      if (!chapterHits.has(gram)) {
        chapterHits.set(gram, new Set<number>());
      }
      chapterHits.get(gram)!.add(index);
    }
  });

  return Array.from(chapterHits.entries())
    .filter(([, hits]) => hits.size >= threshold)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 15)
    .map(([phrase]) => phrase);
}

/**
 * Build per-chapter clue description block from agent5 ClueDistributionResult.
 * Maps each scene's clue IDs to full Clue objects so the prose agent knows exactly
 * what evidence to surface and how it should be observable to the reader.
 * Also includes mapping-only clues from clue_to_scene_mapping that have delivery_method.
 */
function buildClueDescriptionBlock(
  scenesForChapter: unknown[],
  clueDistribution: ClueDistributionResult | undefined,
  cmlCase?: any,
): string {
  if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0) return '';

  const clueMap = clueDistribution?.clues?.length
    ? new Map<string, Clue>(clueDistribution.clues.map(c => [c.id, c]))
    : new Map<string, Clue>();
  const relevantClues: Clue[] = [];
  for (const scene of scenesForChapter as any[]) {
    const clueIds: string[] = Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [];
    for (const id of clueIds) {
      const clue = clueMap.get(id);
      if (clue && !relevantClues.some(c => c.id === id)) {
        relevantClues.push(clue);
      }
    }
  }

  // Collect mapping-only clues (in clue_to_scene_mapping but not yet in relevantClues)
  const seenMappingIds = new Set<string>();
  const mappingOnlyLines: string[] = [];
  for (const scene of scenesForChapter as any[]) {
    for (const entry of ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])) {
      const id = String(entry?.clue_id ?? '');
      if (!id || seenMappingIds.has(id)) continue;
      if (Number(entry?.act_number) !== Number((scene as any)?.act)) continue;
      if (entry?.scene_number !== undefined && entry?.scene_number !== null &&
          Number(entry.scene_number) !== Number((scene as any)?.sceneNumber)) continue;
      if (!entry?.delivery_method) continue;
      if (relevantClues.some((c) => c.id === id)) continue;
      seenMappingIds.add(id);
      mappingOnlyLines.push(`\n• [${id}] ${entry.delivery_method}`);
      mappingOnlyLines.push(`  Category: structural | Placement: early (Act ${entry.act_number})`);
      mappingOnlyLines.push(`  Points to: what this observation reveals about the time or circumstances of the crime.`);
    }
  }

  if (relevantClues.length === 0 && mappingOnlyLines.length === 0) return '';

  const lines: string[] = [
    '\n\n⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:',
    'The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:',
  ];
  for (const clue of relevantClues) {
    lines.push(`\n• [${clue.id}] ${clue.description}`);
    lines.push(`  Category: ${clue.category} | Criticality: ${clue.criticality}${clue.supportsInferenceStep ? ` | Supports inference step ${clue.supportsInferenceStep}` : ''}`);
    lines.push(`  Points to: ${clue.pointsTo}`);
  }
  lines.push(...mappingOnlyLines);
  lines.push('\nFor each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.');
  return lines.join('\n');
}

/**
 * Format the NarrativeState into a read-only system prompt block.
 * Injected between the continuity context and the discriminating-test checklist.
 */
function buildNSDBlock(state: NarrativeState | undefined): string {
  if (!state) return '';

  const lines: string[] = ['\n\n═══ NARRATIVE STATE (read-only — do not contradict) ═══'];

  if (state.lockedFacts.length > 0) {
    lines.push('\nLOCKED FACTS — use verbatim whenever this evidence is described:');
    state.lockedFacts.forEach(f => lines.push(`  • ${f.description}: "${f.value}"`, ));
  }

  if (Object.keys(state.characterPronouns).length > 0) {
    lines.push('\nCHARACTER PRONOUNS — never deviate from these:');
    Object.entries(state.characterPronouns).forEach(([name, pronouns]) => lines.push(`  • ${name}: ${pronouns}`));
  }

  if (state.cluesRevealedToReader.length > 0) {
    lines.push(`\nCLUES ALREADY REVEALED TO READER: ${state.cluesRevealedToReader.join(', ')} — do not reveal these as new information.`);
  }

  lines.push('═══════════════════════════════════════════════════════');
  return lines.join('\n');
}

// ─── PHASE 1 (ANALYSIS_16) ────────────────────────────────────────────────
// Dedicated pronoun_accuracy prompt block with 9-rule continuity contract.
// All PHASE 1 changes are tagged [PHASE 1] below.
//
// To revert Phase 1 in full:
//   1. Delete buildPronounAccuracyBlock() function (below)
//   2. Remove `pronounAccuracyBlock: string` from PromptSectionInputs
//   3. Remove `pronoun_accuracy: 400` from perBlockTokenCap
//   4. Remove `{ key: 'pronoun_accuracy', ... }` from buildPromptContextBlocks orderedSections
//   5. Remove `characterPronouns?` parameter from buildWorldBriefBlock (and the pronounsLabel line inside)
//   6. Revert buildWorldBriefBlock call site to 3-arg form (drop last arg)
//   7. Delete `const pronounAccuracyBlock = buildPronounAccuracyBlock(cast)` assignment
//   8. Remove `pronounAccuracyBlock,` from the buildPromptContextBlocks({...}) call
//   9. Restore old Rule 2 (pronoun list) inside characterConsistencyRules
// ─────────────────────────────────────────────────────────────────────────
/**
 * Builds a dedicated PRONOUN ACCURACY block with a 9-rule continuity contract.
 * Inserted at position 0 (before character_consistency) so pronoun rules have
 * the highest priority ordering in every prose prompt.
 */
function buildPronounAccuracyBlock(cast: any[]): string {
  if (!cast || cast.length === 0) return '';

  // Only include characters with a known, defined gender.
  // Unknown-gender characters are intentionally omitted: assigning them a spurious
  // "they/them/their" mandate would contradict the validator (which has no gender
  // stored for them) and could generate false pronoun constraints in the prompt.
  const knownGenderCast = cast.filter((c: any) => {
    const g = c.gender?.toLowerCase();
    return g === 'male' || g === 'female' || g === 'non-binary';
  });

  if (knownGenderCast.length === 0) return '';

  // Table columns: subject / object / possessive / reflexive.
  // Using four distinct forms prevents ambiguity — 'she/her/her' looked like a typo;
  // 'she/her/herself' gives three distinct tokens the model can act on.
  const pronounTable = knownGenderCast.map((c: any) => {
    const gender = c.gender!.toLowerCase();
    const pronouns = gender === 'male'       ? 'he/him/his/himself'
                   : gender === 'female'     ? 'she/her/her/herself'
                   : /* non-binary */          'they/them/their/themselves';
    return `  • ${c.name}: ${pronouns}`;
  }).join('\n');

  // When any cast member is non-binary, hoist a dedicated warning block to the
  // very top of the pronoun section — before the table and rules — so budget
  // truncation (which cuts from the end) cannot remove it. Lists the exact
  // forbidden forms by name to suppress the LLM's binary-gender completion priors.
  const nonBinaryChars = knownGenderCast.filter((c: any) => c.gender?.toLowerCase() === 'non-binary');
  let nonBinaryWarning = '';
  if (nonBinaryChars.length > 0) {
    const nbNames = nonBinaryChars.map((c: any) => c.name);
    const forbiddenLine = nbNames.length === knownGenderCast.length
      ? 'ALL characters in this story use they/them/their. NEVER write she/her/herself or he/him/his/himself for any character.'
      : `FORBIDDEN for ${nbNames.join(', ')}: she / her / herself / he / him / his / himself. Use only: they / them / their / themselves.`;
    const exampleChar = nbNames[0];
    nonBinaryWarning =
      `\n⚠ NON-BINARY CAST — SINGULAR THEY/THEM/THEIR ⚠` +
      `\n${forbiddenLine}` +
      `\nThese are SINGULAR pronouns for ONE individual — not a group.` +
      `\nExample: "${exampleChar} adjusted their collar as they crossed the room." — correct.` +
      `\nExample: "${exampleChar} adjusted her collar as she crossed the room." — WRONG.\n`;
  }

  return `\n\nPRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT${nonBinaryWarning}\n\nThe following pronouns are locked facts, on the same level as character names\nand hard-logic device values. Using the wrong pronoun is a continuity error,\nnot a style choice.\n\nCanonical pronoun table (subject / object / possessive / reflexive):\n${pronounTable}\n\nMANDATORY PRE-OUTPUT CHECK: Before generating the JSON, re-read every sentence\nthat contains a pronoun and verify it against the table. If any mismatch is found,\ncorrect it before outputting. This check is not optional.\n\nRules:\n1. Every sentence is subject to this table — no exceptions for dialogue, reflection,\n   narration, or attribution.\n2. When characters of different genders appear in the same sentence and a pronoun\n   could refer to more than one of them, use the character's name instead of a pronoun\n   to eliminate ambiguity entirely.\n3. A pronoun must never migrate from one character to another across a semicolon,\n   comma splice, or consecutive sentence — even when the same pronoun gender applies\n   to multiple characters.\n4. "Her" takes two grammatical functions — both are exclusively female:\n   • Indirect object (before the/a/an/another): "he told her the truth", "gave her a letter"\n   • Possessive determiner (before a noun): "her coat", "her voice"\n   For a MALE character: use "him" (indirect object) or "his" (possessive). Never "her".\n5. Reflexive pronouns (himself/herself/themselves) must match the table above.\n   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.\n6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must\n   agree with the SPEAKER's gender — not the last character named inside the quoted speech.\n7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun\n   gender must still match the referent character's canonical set in the table.\n8. Singular "they/them/their" for a specific named non-binary character carries the same\n   mandatory status as gendered pronouns. It is not a plural — treat it as grammatically\n   identical to he/him/his or she/her/her for the purposes of agreement.`;
}

type PromptBlockPriority = "critical" | "high" | "medium" | "optional";

interface PromptContextBlock {
  key: string;
  content: string;
  priority: PromptBlockPriority;
}

interface PromptSectionInputs {
  pronounAccuracyBlock: string; // [PHASE 1] dedicated pronoun block
  /** True when any cast member uses they/them/their — elevates character_personality to critical priority. */
  hasNonBinaryCast: boolean;
  characterConsistencyRules: string;
  characterPersonalityContext: string;
  physicalPlausibilityRules: string;
  eraAuthenticityRules: string;
  locationProfilesContext: string;
  temporalContextBlock: string;
  lockedFactsBlock: string;
  clueDescriptionBlock: string;
  nsdBlock: string;
  continuityBlock: string;
  discriminatingTestBlock: string;
  humourGuideBlock: string;
  craftGuideBlock: string;
  sceneGroundingChecklist: string;
  provisionalScoringFeedbackBlock: string;
  worldDocumentBlock: string;
}

export function formatProvisionalScoringFeedbackBlock(
  feedback: Array<{
    fromChapter: number;
    score: number;
    deficits: string[];
    directives: string[];
  }> | undefined,
): string {
  const effectiveFeedback = Array.isArray(feedback) ? feedback.slice(-2) : [];
  if (effectiveFeedback.length === 0) return '';

  const lines: string[] = [];
  // Isolation wrapper — instructs the model that this block is private diagnostic
  // content that must never be reproduced verbatim in narrative output. Without this
  // wrapper the model tends to echo imperative directives into prose (chapters 2, 13, 15
  // pattern). The wrapper+framing change is two-layer: structural isolation + observational
  // phrasing (no imperative "Required corrections:" language).
  lines.push('\n\n[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]');
  lines.push('\nPRIOR CHAPTER QUALITY OBSERVATIONS:');
  for (const item of effectiveFeedback) {
    lines.push(`- Chapter ${item.fromChapter} (score ${item.score}/100):`);
    if (item.deficits.length > 0) {
      lines.push(`  Quality gaps noted: ${item.deficits.join('; ')}`);
    }
    if (item.directives.length > 0) {
      lines.push(`  Address in upcoming chapters: ${item.directives.join(' | ')}`);
    }
  }
  lines.push('[END INTERNAL DIAGNOSTICS]');
  return lines.join('\n');
}

const buildPromptContextBlocks = (sections: PromptSectionInputs): PromptContextBlock[] => {
  const orderedSections: Array<{ key: string; priority: PromptBlockPriority; content: string }> = [
    { key: 'pronoun_accuracy', content: sections.pronounAccuracyBlock, priority: 'critical' }, // [PHASE 1] position 0
    { key: 'character_consistency', content: `\n\n${sections.characterConsistencyRules}`, priority: 'critical' },
    { key: 'world_document', content: sections.worldDocumentBlock, priority: 'high' },
    { key: 'character_personality', content: sections.characterPersonalityContext, priority: sections.hasNonBinaryCast ? 'critical' : 'high' },
    { key: 'physical_plausibility', content: `\n\n${sections.physicalPlausibilityRules}`, priority: 'high' },
    { key: 'era_authenticity', content: sections.eraAuthenticityRules, priority: 'high' },
    { key: 'location_profiles', content: sections.locationProfilesContext, priority: 'medium' },
    { key: 'temporal_context', content: sections.temporalContextBlock, priority: 'medium' },
    { key: 'locked_facts', content: sections.lockedFactsBlock, priority: 'critical' },
    { key: 'clue_descriptions', content: sections.clueDescriptionBlock, priority: 'critical' },
    { key: 'narrative_state', content: sections.nsdBlock, priority: 'critical' },
    { key: 'continuity_context', content: sections.continuityBlock, priority: 'medium' },
    { key: 'discriminating_test', content: sections.discriminatingTestBlock, priority: 'critical' },
    { key: 'humour_guide', content: sections.humourGuideBlock, priority: 'optional' },
    { key: 'craft_guide', content: sections.craftGuideBlock, priority: 'optional' },
    { key: 'scene_grounding', content: sections.sceneGroundingChecklist, priority: 'critical' },
    { key: 'provisional_scoring_feedback', content: sections.provisionalScoringFeedbackBlock, priority: 'critical' },
  ];

  return orderedSections
    .filter((section) => section.content.trim().length > 0)
    .map((section) => ({ key: section.key, content: section.content, priority: section.priority }));
};

const estimateTokenCount = (value: string): number => {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
};

const truncateToTokenBudget = (value: string, maxTokens: number): string => {
  if (!value || maxTokens <= 0) return '';
  const maxChars = maxTokens * 4;
  if (value.length <= maxChars) return value;
  const truncated = value.slice(0, Math.max(0, maxChars - 24)).trimEnd();
  return `${truncated}\n[truncated for prompt budget]`;
};

const applyPromptBudgeting = (
  baseSystem: string,
  developer: string,
  user: string,
  blocks: PromptContextBlock[],
  budgetTokens: number,
): { composedSystem: string; droppedBlocks: string[]; truncatedBlocks: string[] } => {
  const fixedTokens = estimateTokenCount(baseSystem) + estimateTokenCount(developer) + estimateTokenCount(user);
  const availableForBlocks = Math.max(0, budgetTokens - fixedTokens);

  const perBlockTokenCap: Partial<Record<string, number>> = {
    pronoun_accuracy: 700, // [PHASE 1] — raised from 400: 8 rules + table for ~12-char cast ≈ 560 tokens; 400 truncated rules 5-9
    character_personality: 1400, // raised from 900: physicalMannerisms + privateLonging + motiveSeed add ~150 tokens per character
    location_profiles: 1000,
    temporal_context: 850,
    continuity_context: 500,
    humour_guide: 850,
    craft_guide: 850,
  };

  const truncatedBlocks: string[] = [];
  let workingBlocks = blocks
    .filter((block) => block.content.trim().length > 0)
    .map((block) => {
      const maxTokens = perBlockTokenCap[block.key];
      if (!maxTokens) return block;
      const originalTokens = estimateTokenCount(block.content);
      if (originalTokens <= maxTokens) return block;
      truncatedBlocks.push(block.key);
      return {
        ...block,
        content: truncateToTokenBudget(block.content, maxTokens),
      };
    });

  const computeBlockTokens = () => workingBlocks.reduce((sum, block) => sum + estimateTokenCount(block.content), 0);
  let blockTokens = computeBlockTokens();
  const droppedBlocks: string[] = [];

  // Deterministic drop order: optional -> medium -> high (critical never dropped).
  const dropOrder: PromptBlockPriority[] = ["optional", "medium", "high"];
  for (const priority of dropOrder) {
    if (blockTokens <= availableForBlocks) break;
    const candidates = workingBlocks.filter((block) => block.priority === priority);
    for (const block of candidates) {
      if (blockTokens <= availableForBlocks) break;
      droppedBlocks.push(block.key);
      workingBlocks = workingBlocks.filter((entry) => entry.key !== block.key);
      blockTokens = computeBlockTokens();
    }
  }

  const composedSystem =
    baseSystem +
    workingBlocks.map((block) => block.content).join('') +
    `\n\nPROMPT BUDGET SUMMARY: budget=${budgetTokens} tokens; fixed=${fixedTokens}; context=${blockTokens}; dropped=[${droppedBlocks.join(', ') || 'none'}]; truncated=[${truncatedBlocks.join(', ') || 'none'}]` +
    `\n\n${developer}`;

  return { composedSystem, droppedBlocks, truncatedBlocks };
};

/**
 * Strip raw prose paragraph arrays from location profiles before injecting into context.
 * Prevents the LLM from transcribing pre-written prose blocks verbatim (context leakage).
 * Keeps all structural data: names, types, purpose, sensoryDetails, atmosphere.
 */
function stripLocationParagraphs(locationProfiles: any): any {
  if (!locationProfiles || typeof locationProfiles !== 'object') return locationProfiles;
  const strip = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(strip);
    if (obj && typeof obj === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'paragraphs') continue; // drop prose blocks
        out[k] = strip(v);
      }
      return out;
    }
    return obj;
  };
  return strip(locationProfiles);
}

export const buildProsePrompt = (inputs: ProseGenerationInputs, scenesOverride?: unknown[], chapterStart = 1, chapterSummaries: ChapterSummary[] = []) => {
  const { outline, targetLength = "medium", narrativeStyle = "classic" } = inputs;
  const outlineActs = Array.isArray(outline.acts) ? outline.acts : [];
  const scenes = Array.isArray(scenesOverride)
    ? scenesOverride
    : outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));

  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const era = cmlCase.meta?.era?.decade ?? "Unknown era";
  const cast = inputs.cast.characters || [];

  // Derive victim name for guardrail injection
  const proseVictimName = resolveVictimName(inputs.cast);
  const victimIdentityRule = proseVictimName
    ? `- VICTIM IDENTITY: The murder victim is ${proseVictimName}. Introduce them by full name in the discovery chapter and refer to them by name throughout. Never write "an unknown victim", "the body of a stranger", or "the victim" without first having established the victim's name. The victim must feel like a real person whose death matters.`
    : '';

  const system = `You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: ${cast.map((c: any) => { const g = c.gender?.toLowerCase(); const label = g === 'female' ? 'woman' : g === 'male' ? 'man' : ''; return label ? `${c.name} (${label})` : c.name; }).join(', ')}.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: ${cast.map((c: any) => c.name).join(', ')}?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
${inputs.moralAmbiguityNote ? `- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "${inputs.moralAmbiguityNote}" — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.` : '- MORAL COMPLEXITY: When writing the denouement, include at least one detail that complicates the moral verdict — a motive the reader can understand, a consequence that feels unjust, or a relationship that can never recover.'}
${victimIdentityRule}`;

  // [PHASE 1] Rule 2 (per-character pronoun list + 'Never switch pronouns mid-story') removed from
  // characterConsistencyRules — it is now covered exclusively by the pronounAccuracyBlock above.
  // Pre-Phase-1 Rule 2 was:
  //   "2. Gender pronouns must match character definition:\n   - Name: he/him/his ...\n   - Never switch pronouns mid-story"
  // Old Rule 3 (character roles) has been renumbered to Rule 2.
  const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.\n   COMPLETE CAST (no other named characters exist): ${cast.map((c: any) => c.name).join(', ')}\n   - "Mr. Jennings entered the room" \u2192 ILLEGAL. Jennings is not in the cast.\n   - "Constable Reed took notes" \u2192 ILLEGAL. Reed is not in the cast.\n   - "A constable took notes" \u2192 LEGAL (no name given).\n\n2. Character roles are fixed:\n${cast.map((c: any) => `   - ${c.name}: ${c.role || 'character'}`).join('\n')}\n   - Never place characters in locations inconsistent with their role`;

  const pronounAccuracyBlock = buildPronounAccuracyBlock(cast); // [PHASE 1]
  const hasNonBinaryCast = cast.some((c: any) => c.gender?.toLowerCase() === 'non-binary');

  // Build character personality/voice/humour guidance from character profiles
  let characterPersonalityContext = '';
  if (inputs.characterProfiles && Array.isArray(inputs.characterProfiles.profiles)) {
    const HUMOUR_STYLE_DESCRIPTIONS: Record<string, string> = {
      understatement: 'Increases seriousness by pretending not to. Deadpan delivery of extraordinary facts.',
      dry_wit: 'Sharp observations about human behaviour. Concise, often one-liners.',
      polite_savagery: 'Maintains perfect civility while delivering devastating verbal incisions.',
      self_deprecating: 'Turns wit inward. Disarming, often hides intelligence or pain.',
      observational: 'Notices absurdity in situations and people. Comments wryly on what others miss.',
      deadpan: 'Delivers the remarkable as though it were mundane. Flat affect, maximum impact.',
      sardonic: 'Darker edge. Mocking tone that reveals cynicism or world-weariness.',
      blunt: 'Says what others are thinking. Lacks social filter. Comic through honesty.',
      none: 'This character is not humorous. They are earnest, tense, or grief-stricken.',
    };

    const personalities = inputs.characterProfiles.profiles.map((profile: any) => {
      const name = profile.name || 'Unknown';
      const persona = profile.publicPersona || '';
      const secret = profile.privateSecret || '';
      const stakes = profile.stakes || '';
      const internalConflict = profile.internalConflict || '';
      const personalStake = profile.personalStakeInCase || '';
      const humourStyle = profile.humourStyle || 'none';
      const humourLevel = typeof profile.humourLevel === 'number' ? profile.humourLevel : 0;
      const speechMannerisms = profile.speechMannerisms || '';
      const styleDesc = HUMOUR_STYLE_DESCRIPTIONS[humourStyle] || '';

      let humourGuidance = '';
      if (humourStyle !== 'none' && humourLevel > 0) {
        const frequency = humourLevel >= 0.7 ? 'frequently' : humourLevel >= 0.4 ? 'occasionally' : 'rarely';
        humourGuidance = '\n  Humour: ' + humourStyle.replace(/_/g, ' ') + ' (level ' + humourLevel.toFixed(1) + ' - ' + frequency + ' witty). ' + styleDesc;
      } else {
        humourGuidance = '\n  Humour: None - this character plays it straight. Their seriousness provides contrast for wittier characters.';
      }

      const physicalMannerisms = profile.physicalMannerisms || '';
      const privateLonging = profile.privateLonging || '';
      const motiveSeed = profile.motiveSeed || '';
      const motiveStrength = profile.motiveStrength || '';

      const voiceLine = speechMannerisms ? '\n  Voice & Mannerisms: ' + speechMannerisms : '';
      const conflictLine = internalConflict ? '\n  Internal Conflict: ' + internalConflict : '';
      const stakeLine = personalStake ? '\n  Personal Stake in Case: ' + personalStake : '';
      // physicalMannerisms - schema note: "deploy at most one per scene, not as a list"
      const physicalLine = physicalMannerisms ? '\n  Physical tells (deploy one per scene, not all at once): ' + physicalMannerisms : '';
      // privateLonging - schema note: "let it leak into one or two moments"
      const longingLine = privateLonging ? '\n  Private longing (let surface in 1-2 moments, never central): ' + privateLonging : '';
      const motiveLine = motiveSeed ? '\n  Motive seed: ' + motiveSeed + (motiveStrength ? ' (' + motiveStrength + ')' : '') : '';

      // For non-binary characters, open the entry with their pronoun identity so
      // the LLM activates the correct pronoun context when writing about them.
      const castChar = (inputs.cast?.characters ?? []).find((c: any) => c.name === name);
      const gender = (castChar as any)?.gender?.toLowerCase() ?? '';
      const pronounTag = gender === 'non-binary' ? ' [they/them/their — singular]' : '';

      return name + pronounTag + ':\n  Public: ' + persona + '\n  Hidden: ' + secret + '\n  Stakes: ' + stakes + humourGuidance + voiceLine + motiveLine + conflictLine + physicalLine + longingLine + stakeLine;
    }).join('\n\n');

    characterPersonalityContext = '\n\nCHARACTER PERSONALITIES, VOICES & HUMOUR:\n\nEach character has a distinct personality, voice, humour style, and hidden depth. Use these to create authentic, differentiated characters whose wit (or lack thereof) reveals who they are:\n\n' + personalities + '\n\nWRITING GUIDANCE:\n1. Dialogue: Each character should sound different. Humour style shapes HOW they speak, humourLevel shapes HOW OFTEN.\n2. Internal thoughts: Reference their hidden secrets and stakes to add subtext.\n3. Body language: Show personality through gestures, posture, habits.\n4. Reactions: Characters react differently to same events based on personality.\n5. Speech patterns: Use speechMannerisms for verbal tics, rhythm, formality level.\n6. Personal stake: Characters with personalStakeInCase defined should reference it at least twice across the story through internal monologue, hesitation, or action — especially the detective.\n7. HUMOUR CONTRAST: Characters with high humourLevel (0.7+) should deliver wit frequently. Characters with low/zero should play it straight. The CONTRAST between witty and earnest characters creates the best comedy.\n8. HUMOUR AS CHARACTER: A character\'s humour style reveals their psychology - self_deprecating masks insecurity, polite_savagery masks aggression, deadpan masks emotion.\n9. NEVER force humour on a character with humourLevel 0 or style none.';
  }

  const physicalPlausibilityRules = `\nPHYSICAL PLAUSIBILITY REQUIREMENTS:\n\nAll physical evidence must obey real-world physics:\n\n1. VIABLE Evidence by Location:\n   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents\n   Exterior (calm): secured items, structural damage, witness observations\n   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence\n\n2. IMPLAUSIBLE Evidence (DO NOT USE):\n   ❌ Footprints on wooden deck (treated wood doesn't retain prints)\n   ❌ Footprints in rain/storm (washed away immediately)\n   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)\n   ❌ Light objects in storm (blown away)\n\n3. For struggle evidence use:\n   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds\n   ❌ Objects embedded in hard surfaces, shattered steel/iron`;

  const eraAuthenticityRules = era !== "Unknown era" ? `\nERA AUTHENTICITY (${era}):\n\n1. FORBIDDEN terms (did not exist):\n   ${era === '1950s' ? '❌ cell phone, internet, email, computer, GPS, digital camera, text message, app, online' : '❌ Modern technology'}\n\n2. REQUIRED period markers (include 2+ per scene):\n   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady\n   ✓ Period technology: ${era === '1950s' ? 'telephone, telegram, radio, typewriter' : 'period-appropriate items'}\n   ✓ Fashion: ${era === '1950s' ? 'gloves, hats, formal suits, stockings' : 'period clothing'}\n\n3. Use period-authentic language and social norms` : '';

  // Build location profiles context (avoid nested template literals)
  // Strip raw prose paragraphs first to prevent context leakage into generated prose.
  let locationProfilesContext = '';
  if (inputs.locationProfiles) {
    const loc = stripLocationParagraphs(inputs.locationProfiles);
    const primaryName = loc.primary?.name || 'N/A';
    const primaryPlace = loc.primary?.place || '';
    const primaryCountry = loc.primary?.country || '';
    const geographicContext = primaryPlace && primaryCountry 
      ? primaryPlace + ', ' + primaryCountry 
      : primaryPlace || primaryCountry || '';
    const primarySummary = loc.primary?.summary || '';
    const keyLocs = (loc.keyLocations || []).map((l: any) => 
      '- ' + l.name + ' (' + l.type + '): ' + l.purpose
    ).join('\\n');
    const mood = loc.atmosphere?.mood || 'N/A';
    const weather = loc.atmosphere?.weather || 'N/A';
    
    // Build comprehensive sensory palette
    const sensoryExamples = (loc.keyLocations || []).slice(0, 3).map((l: any) => {
      const senses = l.sensoryDetails || {};
      const sights = (senses.sights || []).slice(0, 3).join(', ');
      const sounds = (senses.sounds || []).slice(0, 3).join(', ');
      const smells = (senses.smells || []).slice(0, 3).join(', ');
      const tactile = (senses.tactile || []).slice(0, 2).join(', ');
      return l.name + ' (' + l.type + '):\\n  - Visual: ' + sights + '\\n  - Sounds: ' + sounds + '\\n  - Scents: ' + smells + (tactile ? '\\n  - Touch: ' + tactile : '');
    }).join('\\n\\n');
    
    const locationLine = geographicContext 
      ? 'Primary Location: ' + primaryName + ' (' + geographicContext + ')\\n' + primarySummary
      : 'Primary Location: ' + primaryName + '\\n' + primarySummary;
    
    // Add specific sensory usage examples
    const sensoryGuidance = '\n\n⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.\n\nSCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room\'s qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.\n\nSENSORY WRITING TECHNIQUES:\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\n- Period authenticity: Use period-specific sensory details from location/temporal profiles\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature';
    
    locationProfilesContext = '\\n\\nLOCATION PROFILES:\\n\\nYou have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.\\n\\n' + locationLine + '\\n\\nKey Locations Available:\\n' + keyLocs + '\\n\\nAtmosphere: ' + mood + '\\nWeather: ' + weather + '\\n\\nUSAGE GUIDELINES:\\n1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room\'s general qualities\\n2. Geographic grounding: Reference the specific place (' + (geographicContext || 'setting') + ') naturally in dialogue or narrative\\n3. Action scenes: Integrate physical layout details (access, sightlines, constraints)\\n4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette\\n5. Era details: Weave in period markers naturally\\n6. Consistency: Keep all location descriptions aligned with profiles\\n7. Each chapter opening must anchor to a named location from this list\\n8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening\\n9. Do NOT use generic repeated manor/storm filler without profile-specific details\\n\\nSENSORY PALETTE (use 2-3 senses per scene):\\n' + sensoryExamples + sensoryGuidance;

    // Append chapter-specific sensory palette hints derived from sensoryVariants objects
    if (Array.isArray(scenesOverride) && scenesOverride.length > 0 && Array.isArray(loc.keyLocations)) {
      const paletteHints: string[] = [];
      scenesOverride.forEach((scene: any, idx: number) => {
        const sceneSettingObj = scene.setting;
        const sceneSetting: string = (typeof sceneSettingObj?.location === 'string' ? sceneSettingObj.location : '').toLowerCase();
        const sceneTimeOfDay: string = (typeof sceneSettingObj?.timeOfDay === 'string' ? sceneSettingObj.timeOfDay : '').toLowerCase();
        const sceneWeather: string = (typeof sceneSettingObj?.atmosphere === 'string' ? sceneSettingObj.atmosphere : '').toLowerCase();
        const chapterNum = chapterStart + idx;
        const matchedLocation = (loc.keyLocations as any[]).find((kl: any) =>
          (kl.id && sceneSetting.includes(kl.id.toLowerCase())) ||
          (kl.name && sceneSetting.includes(kl.name.toLowerCase()))
        );
        if (matchedLocation?.sensoryVariants?.length > 0) {
          // Try to match by timeOfDay + weather; fall back to cycling by chapter number
          const variants: any[] = matchedLocation.sensoryVariants;
          let variant: any = (sceneTimeOfDay || sceneWeather)
            ? (variants.find((v: any) =>
                (!sceneTimeOfDay || v.timeOfDay?.toLowerCase().includes(sceneTimeOfDay) || sceneTimeOfDay.includes(v.timeOfDay?.toLowerCase())) &&
                (!sceneWeather || v.weather?.toLowerCase().includes(sceneWeather) || sceneWeather.includes(v.weather?.toLowerCase()))
              ) ?? variants[chapterNum % variants.length])
            : variants[chapterNum % variants.length];
          if (variant) {
            const sights = (variant.sights || []).slice(0, 2).join(', ');
            const sounds = (variant.sounds || []).slice(0, 2).join(', ');
            const smells = (variant.smells || []).slice(0, 2).join(', ');
            paletteHints.push(
              `  Chapter ${chapterNum} (${matchedLocation.name}, ${variant.timeOfDay} / ${variant.weather} — ${variant.mood}):\n` +
              `    Sights: ${sights}\n    Sounds: ${sounds}\n    Smells: ${smells}`
            );
          }
        }
      });
      if (paletteHints.length > 0) {
        locationProfilesContext += '\\n\\nCHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):\\n' + paletteHints.join('\\n');
      }
    }
  }

  // Build temporal context (specific date, season, fashion, current affairs)
  let temporalContextBlock = '';
  if (inputs.temporalContext) {
    const dateInfo = inputs.temporalContext.specificDate;
    const dateStr = dateInfo.month + ' ' + dateInfo.year;
    const season = inputs.temporalContext.seasonal?.season || 'N/A';
    const seasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
    const lockedSeason = seasonLock?.season || season;
    const forbiddenSeasons = ['spring', 'summer', 'autumn', 'winter']
      .filter((s) => s !== lockedSeason)
      .join(', ');
    const seasonWeather = (inputs.temporalContext.seasonal?.weather || []).slice(0, 3).join(', ');
    const mensFormeal = (inputs.temporalContext.fashion?.mensWear?.formal || []).slice(0, 4).join(', ');
    const mensCasual = (inputs.temporalContext.fashion?.mensWear?.casual || []).slice(0, 3).join(', ');
    const mensAcc = (inputs.temporalContext.fashion?.mensWear?.accessories || []).slice(0, 3).join(', ');
    const womensFormeal = (inputs.temporalContext.fashion?.womensWear?.formal || []).slice(0, 4).join(', ');
    const womensCasual = (inputs.temporalContext.fashion?.womensWear?.casual || []).slice(0, 3).join(', ');
    const womensAcc = (inputs.temporalContext.fashion?.womensWear?.accessories || []).slice(0, 3).join(', ');
    const music = (inputs.temporalContext.cultural?.entertainment?.popularMusic || []).slice(0, 3).join(', ');
    const films = (inputs.temporalContext.cultural?.entertainment?.films || []).slice(0, 2).join(', ');
    const prices = (inputs.temporalContext.cultural?.dailyLife?.typicalPrices || []).slice(0, 4).join(', ');
    const majorEvents = (inputs.temporalContext.currentAffairs?.majorEvents || []).slice(0, 2).join('; ');
    const atmosphericDetails = (inputs.temporalContext.atmosphericDetails || []).slice(0, 4).join(' ');
    
    const fashionGuidance = '\\n\\nFASHION INTEGRATION TECHNIQUES:\\n- First appearance: Describe outfit to establish class/personality\\n- Accessories: Gloves, hats, pocket watches, jewelry reveal status\\n- Time-specific: Different outfits for different times of day\\n- Character traits: Fastidious dresser vs rumpled appearance\\n- Action integration: "She tugged at her glove" or "He adjusted his tie"\\n- Weather appropriate: Overcoats in winter, light linen in summer';
    
    const culturalGuidance = '\\n\\nCULTURAL TOUCHSTONE INTEGRATION:\\n- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"\\n- Background details: Radio playing, newspaper headlines, theater posters\\n- Social commentary: Characters discuss current events naturally\\n- Class indicators: Aristocrats discuss opera, servants discuss music halls\\n- Authentic references: Use actual songs, films, events from the specific date';
    
    temporalContextBlock = '\\n\\nTEMPORAL CONTEXT:\\n\\nThis story takes place in ' + dateStr + ' during ' + season + '.\\n\\nSeasonal Atmosphere:\\n- Weather patterns: ' + seasonWeather + '\\n- Season: ' + season + '\\n\\nPeriod Fashion (describe naturally):\\n- Men formal: ' + mensFormeal + '\\n- Men casual: ' + mensCasual + '\\n- Men accessories: ' + mensAcc + '\\n- Women formal: ' + womensFormeal + '\\n- Women casual: ' + womensCasual + '\\n- Women accessories: ' + womensAcc + '\\n\\nCultural Context (reference naturally):\\n- Music/entertainment: ' + music + (films ? '; Films: ' + films : '') + '\\n- Typical prices: ' + prices + (majorEvents ? '\\n- Current events: ' + majorEvents : '') + '\\n\\nAtmospheric Details:\\n' + atmosphericDetails + fashionGuidance + culturalGuidance + '\\n\\nUSAGE REQUIREMENTS:\\n1. Date references: Mention month/season at least once early in story\\n2. Fashion descriptions: Every character gets fashion description on first appearance\\n3. Cultural touchstones: Reference music/entertainment 2-3 times across story\\n4. Prices/daily life: Use when relevant (meals, tickets, wages)\\n5. Seasonal consistency: Weather and atmosphere must match ' + dateInfo.month + ' and ' + season + ' throughout\\n6. Historical accuracy: NO anachronisms for ' + dateStr + '\\n7. Month-season lock: If a chapter mentions ' + dateInfo.month + ', do not use conflicting season labels in that chapter.\\n8. Season lock (hard): This timeline is anchored to ' + dateInfo.month + ' (' + lockedSeason + '). Avoid incompatible seasonal labels (' + forbiddenSeasons + ') in the same chapter.'
    + '\\n9. SEASONAL LANGUAGE — EXCLUSIVE ALLOW-LIST:\\n   Allowed seasonal vocabulary (only these are permitted): ' + getSeasonAllowList(lockedSeason) + '\\n   Forbidden seasonal words (never use, even in metaphors or dialogue): ' + forbiddenSeasons + ' and their adjective forms.\\n   Replace any forbidden seasonal word immediately — in narration, dialogue, and internal character thought.\\n   Do not use forbidden words even as part of a simile, metaphor, or poetic line.';
  }


  // Build continuity context from chapter 2 onwards (character names, setting terms from earlier chapters)
  let continuityBlock = '';
  if (chapterSummaries.length > 0) {
    continuityBlock = buildContinuityContext(chapterSummaries, chapterStart);
  }

  // Build discriminating test checklist for late chapters.
  // The threshold is relative: we show the checklist once we're past 70% of the story.
  // totalScenes comes from the outline — same source of truth as agent7-narrative.
  let discriminatingTestBlock = '';
  const chapterEnd = chapterStart + scenes.length - 1;
  const totalScenes = (outline as any)?.totalScenes ?? scenes.length;
  const lateChapterThreshold = Math.ceil(totalScenes * 0.70);
  if (chapterEnd >= lateChapterThreshold) {
    const chapterRange = `${chapterStart}-${chapterEnd}`;
    discriminatingTestBlock = buildDiscriminatingTestChecklist(inputs.caseData, chapterRange, inputs.outline, totalScenes);
  }

  // Build locked facts block — ground truth physical evidence values the prose must never contradict
  let lockedFactsBlock = '';
  if (inputs.lockedFacts && inputs.lockedFacts.length > 0) {
    const factLines = inputs.lockedFacts
      .map(f => `  - ${f.description}: "${f.value}"`)
      .join('\n');
    lockedFactsBlock = `\n\nNON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):\nThe following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.\n\nFAILURE EXAMPLE: if the locked value is "at 11:47 PM" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at 11:47 PM". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you write "11:10 PM" or "11:10" — that is also a HARD FAIL. Words stay as words; digits stay as digits.\n\nCRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to digits, 24-hour format, or any other numeric form. Correct: "ten minutes past eleven". WRONG: "11:10", "11:10 PM", "twenty-three eleven".\n\nLocked facts:\n${factLines}\n\nIf a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.`;
  }

  // Build NSD block (narrative state document) — style register and fact history
  const nsdBlock = buildNSDBlock(inputs.narrativeState);

  // Build clue description block — injects full agent5 clue objects so prose agent knows
  // exactly what evidence to surface and how it should manifest for the reader.
  const clueDescriptionBlock = buildClueDescriptionBlock(scenes, inputs.clueDistribution, cmlCase);

  // Build humour guide block from writing guides
  let humourGuideBlock = '';
  if (inputs.writingGuides?.humour) {
    humourGuideBlock = '\n\nHUMOUR & WIT GUIDELINES (Golden Age Mystery Style):\n\n' +
      'Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.\n\n' +
      'TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.\n\n' +
      'APPROVED HUMOUR STYLES (use all of these naturally throughout):\n' +
      '1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."\n' +
      '2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."\n' +
      '3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.\n' +
      '4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.\n' +
      '5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.\n\n' +
      'ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.\n\n' +
      'SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.\n\n' +
      'DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."\n\n' +
      'RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.\n\n' +
      'BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.\n\n' +
      'RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.\n\n' +
      'EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.\n\n' +
      'FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.\n\n' +
      'GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.';
  }


  // Build whodunnit craft guide block from writing guides
  let craftGuideBlock = '';
  if (inputs.writingGuides?.craft) {
    craftGuideBlock = '\n\nWHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):\n\n' +
      'These principles ensure the mystery has emotional resonance, not just logical mechanics.\n\n' +
      '1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at 7:30").\n\n' +
      '2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."\n\n' +
      '3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.\n\n' +
      '4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.\n\n' +
      '5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."\n\n' +
      '6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.\n\n' +
      '7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.\n\n' +
      '8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.\n\n' +
      '9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.';
  }

  const qualityGuardrails = Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : [];
  
  // CRITICAL: Fair Play Clue Sequencing Guardrails
  // Prevent detective from discovering and using clues in the same chapter
  const fairPlayGuardrails = [
    "FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.",
    "FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.",
    "FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.",
    "FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters."
  ];
  
  const allGuardrails = [...fairPlayGuardrails, ...qualityGuardrails];
  const qualityGuardrailBlock = allGuardrails.length > 0
    ? `\n\nQUALITY GUARDRAILS (MUST SATISFY):\n${allGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}`
    : "";

  // Build prose requirements block for this chapter batch
  const proseRequirementsBlock = buildProseRequirements(inputs.caseData, scenes);
  const sceneGroundingChecklist = buildSceneGroundingChecklist(scenes, inputs.locationProfiles, chapterStart);

  const worldDocumentBlock = buildWorldBriefBlock(inputs.worldDocument, chapterStart - 1, totalScenes, inputs.narrativeState?.characterPronouns); // [PHASE 1]

  const provisionalScoringFeedbackBlock = formatProvisionalScoringFeedbackBlock(
    inputs.provisionalScoringFeedback,
  );

  // Para-range bounds are derived from the hard floor and chapter target so the paragraph count
  // guidance always guarantees the hard floor (min) and reaches the preferred target (max),
  // regardless of config changes to hard_floor_relaxation_ratio or preferred_chapter_words.
  const _shortT = getChapterWordTargets("short");
  const _medT   = getChapterWordTargets("medium");
  const _longT  = getChapterWordTargets("long");
  const chapterWordGuidance: Record<string, string> = {
    short: `${Math.ceil(_shortT.hardFloorWords / 120)}-${Math.ceil((_shortT.preferredWords + 200) / 180) + 1} substantial paragraphs (each 120–180 words) — MINIMUM ${_shortT.hardFloorWords} words; TARGET ≥ ${_shortT.preferredWords} words — do not stop early`,
    medium: `${Math.ceil(_medT.hardFloorWords / 150)}-${Math.ceil((_medT.preferredWords + 200) / 220) + 1} substantial paragraphs (each 150–220 words) — MINIMUM ${_medT.hardFloorWords} words; TARGET ≥ ${_medT.preferredWords} words — do not stop early`,
    long: `${Math.ceil(_longT.hardFloorWords / 180)}-${Math.ceil((_longT.preferredWords + 200) / 250) + 1} substantial paragraphs (each 180–250 words) — MINIMUM ${_longT.hardFloorWords} words; TARGET ≥ ${_longT.preferredWords} words — do not stop early`,
  };
  const chapterGuidance = chapterWordGuidance[targetLength] ?? chapterWordGuidance.medium;

  const chapterWordTargets = getChapterWordTargets(targetLength);
  const chapterTargetWords = chapterWordTargets.preferredWords + 200;
  const temporalLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const wordCountContract = [
    'WORD COUNT CONTRACT (NON-NEGOTIABLE):',
    `- Target: AT LEAST ${chapterTargetWords} words per chapter. Do not stop before reaching this threshold.`,
    '- Overshoot rather than undershoot. When in doubt, write one more paragraph.',
    '- Expand with concrete action beats, clue-linked dialogue, and sensory detail.',
    '- Never pad with recap, repeated atmosphere, or generic filler.',
  ].join('\n');
  const chapterObligationBlock = buildChapterObligationBlock(
    scenes,
    chapterStart,
    cmlCase,
    inputs.lockedFacts,
    temporalLock,
    inputs.clueDistribution,
    {
      targetWords: chapterTargetWords,
    },
  );
  const timelineStateBlock = buildTimelineStateBlock(
    temporalLock,
    inputs.lockedFacts,
    cmlCase,
  );

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has ${chapterGuidance}.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n- Chapter title format: EVERY chapter title MUST follow exactly \"Chapter N: [Descriptive title]\" (e.g. \"Chapter 1: The Frozen Clock\"). Do NOT use number-only (\"Chapter 1\") or title-only (\"The Frozen Clock\") formats — mixed formats are a validation error.\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Every chapter MUST open with the following in the FIRST TWO PARAGRAPHS — this is a VALIDATION REQUIREMENT and chapters that omit it are retried:\n   (a) 2+ sensory words from: smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim\n   (b) 1+ atmosphere/time word from: rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season\n   (c) A named location anchor from the setting profiles\n\n   Then establish time of day, weather, and lighting; describe the location using sensory details; set mood and atmosphere before advancing plot beats.\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   Generate new descriptions using actual location and character names from the provided profiles.\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   Use only character names from the provided cast list.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}${proseRequirementsBlock}`;

  const developerWithAudit = developer.replace(
    '  "note": ""\n}\n\nRequirements:',
    '  "note": "",\n  "audit": {\n    "locked_fact_phrases": "present in paragraph N | absent",\n    "season_words_used": "list seasonal words used in this batch | none",\n    "discriminating_test_present": "yes: chapter N paragraph M | no",\n    "required_clues_present": "clue_id or description: chapter N paragraph M | absent",\n    "early_observation_present": "description: chapter N paragraph M (first 25%) | absent",\n    "early_inference_present": "yes: paragraph immediately following observation | no"\n  }\n}\n\nThe audit field is a self-check only. Fill it honestly. It will be stripped before storage.\n\nRequirements:',
  );

  // Amateur detective extra warning — LLM tends to invent police officers for unnamed official response
  const amateurPoliceWarning = inputs.detectiveType === 'amateur'
    ? `\n\n⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.`
    : '';

  const developerWithContracts = developerWithAudit.replace(
    '\n\nNOVEL-QUALITY PROSE REQUIREMENTS:',
    `\n\n${wordCountContract}\n\nNOVEL-QUALITY PROSE REQUIREMENTS:`,
  );

  const scenesWithAdjustedEstimates = sanitizeScenesCharacters(
    (scenes as any[]).map((scene) => ({
      ...scene,
      estimatedWordCount: Math.max(
        typeof scene?.estimatedWordCount === 'number' ? scene.estimatedWordCount : 0,
        chapterTargetWords,
      ),
    })),
    cast.map((c: any) => c.name),
  );
  const user = `Write the full prose following the outline scenes.\n\n${chapterObligationBlock}${timelineStateBlock}\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(scenesWithAdjustedEstimates, null, 2)}`;

  const promptContextBlocks = buildPromptContextBlocks({
    pronounAccuracyBlock, // [PHASE 1]
    hasNonBinaryCast,
    characterConsistencyRules,
    characterPersonalityContext,
    physicalPlausibilityRules,
    eraAuthenticityRules,
    locationProfilesContext,
    temporalContextBlock,
    lockedFactsBlock,
    clueDescriptionBlock,
    nsdBlock,
    continuityBlock,
    discriminatingTestBlock,
    humourGuideBlock,
    craftGuideBlock,
    sceneGroundingChecklist,
    provisionalScoringFeedbackBlock,
    worldDocumentBlock,
  });

  const baseSystem = `${system}${amateurPoliceWarning}`;
  const { composedSystem } = applyPromptBudgeting(
    baseSystem,
    developerWithContracts,
    user,
    promptContextBlocks,
    6200,
  );

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: composedSystem },
    { role: "user", content: user },
  ];

  // Build early-placement clue checklist items from clueDistribution
  const earlyClueCheckItems: string[] = [];
  const clueMap = new Map<string, Clue>(
    (inputs.clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  (scenes as any[]).forEach((scene, idx) => {
    const chapterNumber = chapterStart + idx;
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene);
    for (const clueId of requiredClueIds) {
      const clue = clueMap.get(clueId);
      if (clue?.placement === 'early') {
        earlyClueCheckItems.push(
          `□ Chapter ${chapterNumber}: "${clue.description.trim()}" is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.`,
        );
      } else if (!clue) {
        // Unresolved clue ID — check delivery_method from clue_to_scene_mapping for early placement
        const mappingEntry = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
          .find((e: any) => String(e?.clue_id) === clueId && Number(e?.act_number) === 1);
        if (mappingEntry?.delivery_method) {
          earlyClueCheckItems.push(
            `□ Chapter ${chapterNumber}: "${mappingEntry.delivery_method.trim()}" [${clueId}] — place this observation in the first 25% of the chapter, followed immediately by an explicit inference or suspicion paragraph.`,
          );
        }
      }
    }
  });

  // Build a pronoun audit table so the model must enumerate the pronouns it used per
  // character rather than making a vague "I checked" assertion. This is stripped before
  // storage (like the `audit` field) — it exists only to force active self-review.
  // See ANALYSIS_24 Option C.
  const pronounAuditLines: string[] = [];
  // R01 fix: include non-binary characters — they are the hardest case for the LLM
  // and the PRONOUN AUDIT is the only mechanism that forces active per-character self-review.
  const castWithGender = cast.filter((c: any) => {
    const g = c.gender?.toLowerCase();
    return g === 'male' || g === 'female' || g === 'non-binary';
  });
  if (castWithGender.length > 0) {
    pronounAuditLines.push('□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.');
    pronounAuditLines.push('  Character            | Canonical     | Used in draft | Match?');
    pronounAuditLines.push('  ---------------------|---------------|---------------|-------');
    for (const c of castWithGender) {
      const g = (c.gender as string).toLowerCase();
      const canonical = g === 'female' ? 'she/her/her/herself' : g === 'non-binary' ? 'they/them/their/themselves' : 'he/him/his/himself';
      pronounAuditLines.push(`  ${c.name.padEnd(20)} | ${canonical.padEnd(25)} | [fill in]     | [yes/no]`);
    }
  }

  const checklistItems = [
    'BEFORE SUBMITTING YOUR JSON — verify this checklist:',
    `□ Each chapter reaches the hard floor of ${chapterWordTargets.hardFloorWords} words and aims for ${chapterTargetWords} words or more.`,
    '□ If you mention locked evidence, you used the exact locked phrase verbatim.',
    ...(temporalLock
      ? [
          `□ Allowed seasonal words only: ${getSeasonAllowList(temporalLock.season)}.`,
          `□ Forbidden seasonal words: ${['spring', 'summer', 'autumn', 'winter'].filter((s) => s !== temporalLock.season).join(', ')}.`,
        ]
      : []),
    ...earlyClueCheckItems,
    ...pronounAuditLines,
    '□ Return valid JSON only.',
  ];
  messages.push({ role: 'user' as const, content: checklistItems.join('\n') });

  // E5: Capture section sizes (char count per block before budgeting)
  const sectionSizes: Record<string, number> = {};
  for (const block of promptContextBlocks) {
    sectionSizes[block.key] = block.content.length;
  }

  return { system, developer: developerWithContracts, user, messages, sectionSizes };
};

const chunkScenes = (scenes: unknown[], chunkSize: number) => {
  const batches: unknown[][] = [];
  for (let i = 0; i < scenes.length; i += chunkSize) {
    batches.push(scenes.slice(i, i + chunkSize));
  }
  return batches;
};

export const stripAuditField = (parsed: any): any => {
  if (!parsed || typeof parsed !== 'object' || !('audit' in parsed)) {
    return parsed;
  }
  const { audit: _audit, ...rest } = parsed;
  return rest;
};

const parseProseResponse = (content: string) => {
  try {
    return stripAuditField(JSON.parse(content)) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  } catch (error) {
    const repaired = jsonrepair(content);
    return stripAuditField(JSON.parse(repaired)) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  }
};

interface ProvisionalChapterScore {
  chapter: number;
  score: number;
  deficits: string[];
  directives: string[];
}

const buildProvisionalChapterScore = (
  chapter: ProseChapter,
  chapterNumber: number,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  contentIssues: Array<{ message: string; severity?: string }>,
  clueDistribution?: ClueDistributionResult,
): ProvisionalChapterScore => {
  const chapterText = (chapter.paragraphs ?? []).join(' ');
  const wordCount = countWords(chapterText);
  const preferredWords = ledgerEntry?.preferredWords ?? 0;
  const hardFloorWords = ledgerEntry?.hardFloorWords ?? 0;
  const wordScore = preferredWords > 0 ? Math.min(100, Math.round((wordCount / preferredWords) * 100)) : 100;

  const paragraphCount = chapter.paragraphs?.length ?? 0;
  const paragraphScore = paragraphCount >= 6 ? 100 : paragraphCount >= 5 ? 93 : paragraphCount >= 4 ? 86 : paragraphCount >= 3 ? 76 : 65;

  const requiredClues = ledgerEntry?.requiredClueIds ?? [];
  const matchedClues = requiredClues.filter((clueId) => {
    if (chapterMentionsRequiredClue(chapterText, clueId, clueDistribution)) return true;
    // Fallback for mapping-only clues: chapterMentionsRequiredClue returns false when there
    // is no distribution entry. Apply the same token-matching fallback as the hard validator.
    const hasDistEntry = (clueDistribution?.clues ?? []).some((e) => String(e?.id || '') === clueId);
    if (hasDistEntry) return false;
    const ctx = (ledgerEntry?.clueObligationContext ?? []).find((c) => c.id === clueId);
    if (!ctx?.description) return false;
    if (isDeliveryMethodLabel(ctx.description)) return true;
    const tokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
    if (tokens.length === 0) return false;
    const lowered = chapterText.toLowerCase();
    const threshold = tokens.length <= 4 ? 1 : Math.max(1, Math.ceil(tokens.length * 0.4));
    return tokens.filter((t) => tokenMatchesText(t, lowered)).length >= threshold;
  });
  const clueScore = requiredClues.length > 0
    ? Math.round((matchedClues.length / requiredClues.length) * 100)
    : 100;

  const weightedIssuePenalty = contentIssues.reduce((penalty, issue) => {
    const sev = String(issue.severity ?? '').toLowerCase();
    if (sev === 'major' || sev === 'critical') return penalty + 18;
    if (sev === 'minor') return penalty + 8;
    return penalty + 5;
  }, 0);
  const issueScore = Math.max(0, 100 - weightedIssuePenalty);

  const provisionalScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(wordScore * 0.35 + paragraphScore * 0.2 + clueScore * 0.25 + issueScore * 0.2),
    ),
  );

  const deficits: string[] = [];
  const directives: string[] = [];

  if (wordScore < 100) {
    deficits.push(`word density below preferred target (${wordCount}/${preferredWords || 'n/a'})`);
    directives.push('Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.');
    if (hardFloorWords > 0 && wordCount < hardFloorWords) {
      directives.push(`Chapter is below hard floor (${wordCount}/${hardFloorWords}); expand with concrete evidence/action beats before retrying.`);
    }
  }

  if (paragraphScore < 95) {
    deficits.push(`paragraph structure too thin (${paragraphCount} paragraphs)`);
    directives.push('Use at least 4-5 substantial paragraphs with varied rhythm and one strong scene transition.');
  }

  if (clueScore < 100) {
    const missing = requiredClues.filter((clueId) => !matchedClues.includes(clueId));
    deficits.push(`required clue surfacing incomplete (${matchedClues.length}/${requiredClues.length})`);
    if (missing.length > 0) {
      // Resolve IDs to prose descriptions so the directive fed to the next chapter batch
      // references observable text the model can write, not opaque internal identifiers.
      const missingDescs = missing.map((id) => {
        const ctx = (ledgerEntry?.clueObligationContext ?? []).find((c) => c.id === id);
        return ctx?.description ? `"${ctx.description.trim()}" [${id}]` : id;
      });
      directives.push(`Surface missing clue evidence on-page with observable detail: ${missingDescs.join('; ')}.`);
    } else {
      directives.push('Surface required clue evidence on-page before any deduction beat.');
    }
  }

  const groundingIssue = contentIssues.find((issue) => /grounding|location anchoring|setting fidelity/i.test(issue.message));
  if (groundingIssue) {
    deficits.push('scene grounding weakness');
    directives.push('Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.');
  }

  const temporalIssue = contentIssues.find((issue) => /month\/season contradiction|temporal/i.test(issue.message));
  if (temporalIssue) {
    deficits.push('temporal consistency risk');
    directives.push('Maintain month-season lock in narration and dialogue; remove conflicting seasonal terms.');
  }

  if (deficits.length === 0 && provisionalScore < 95) {
    deficits.push('general prose quality drift');
    directives.push('Tighten causal clarity and add one explicit evidence-driven inference beat in the next chapter.');
  }

  return {
    chapter: chapterNumber,
    score: provisionalScore,
    deficits,
    directives,
  };
};

const validateChapterCount = (chapters: ProseChapter[], expected: number) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new Error("Invalid prose output: missing chapters");
  }
  if (expected > 0 && chapters.length !== expected) {
    throw new Error(`Invalid prose output: expected ${expected} chapters, got ${chapters.length}`);
  }
};

/**
 * Extract chapter summary for continuity tracking
 * Captures character names, setting vocabulary, and key events from completed chapters
 */
function extractChapterSummary(chapter: ProseChapter, chapterNumber: number, castNames: string[]): ChapterSummary {
  const text = chapter.paragraphs.join(' ');
  
  // Extract character names that actually appear in this chapter
  const charactersPresent = castNames.filter(name => {
    const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });
  
  // Extract setting-related terms (common location vocabulary)
  const settingPatterns = [
    /\b(library|drawing[- ]room|study|parlour|parlor|dining[- ]room|ballroom|conservatory|terrace|garden|stable|kitchen|servants?'? quarters?)\b/gi,
    /\b(cabin|stateroom|deck|gangway|saloon|smoking[- ]room|promenade)\b/gi,
    /\b(compartment|corridor|dining[- ]car|sleeping[- ]car|platform|station)\b/gi,
    /\b(lobby|suite|bedroom|restaurant|bar|lounge)\b/gi,
    /\b(estate|manor|cottage|villa|townhouse|apartment|flat)\b/gi
  ];
  
  const settingTerms: string[] = [];
  settingPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      const normalized = match.toLowerCase().trim();
      if (!settingTerms.includes(normalized)) {
        settingTerms.push(normalized);
      }
    });
  });
  
  // Extract first sentence of each paragraph as key events (simple heuristic)
  const keyEvents: string[] = [];
  chapter.paragraphs.slice(0, 3).forEach(para => {
    const firstSentence = para.match(/^[^.!?]+[.!?]/);
    if (firstSentence && firstSentence[0].length < 150) {
      keyEvents.push(firstSentence[0].trim());
    }
  });
  
  return {
    chapterNumber,
    title: chapter.title,
    charactersPresent: charactersPresent.slice(0, 8), // Limit to top 8
    settingTerms: settingTerms.slice(0, 10), // Limit to 10 terms
    keyEvents: keyEvents.slice(0, 3) // Max 3 events
  };
}

/**
 * Build continuity context from previous chapter summaries
 * Provides character name consistency and setting vocabulary for late chapters
 */
function buildContinuityContext(summaries: ChapterSummary[], currentChapterStart: number): string {
  if (summaries.length === 0) {
    return '';
  }

  // Use all previous chapter summaries for name/setting aggregation
  const relevantSummaries = summaries;

  // Aggregate character names across all previous chapters
  const allCharacters = new Set<string>();
  relevantSummaries.forEach(s => s.charactersPresent.forEach(c => allCharacters.add(c)));

  // Aggregate setting terms
  const allSettingTerms = new Set<string>();
  relevantSummaries.forEach(s => s.settingTerms.forEach(t => allSettingTerms.add(t)));
  
  let context = '\n\n═══════════════════════════════════════════════════════════\n';
  context += '📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY\n';
  context += '═══════════════════════════════════════════════════════════\n\n';
  context += '**CRITICAL: You are writing chapters ' + currentChapterStart + '+. Maintain consistency with earlier chapters.**\n\n';
  
  // Character names section
  if (allCharacters.size > 0) {
    context += '**Character Names Used in Chapters 1-' + Math.max(...relevantSummaries.map(s => s.chapterNumber)) + ':**\n';
    const charList = Array.from(allCharacters).slice(0, 12).join(', ');
    context += charList + '\n\n';
    context += '✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.\n';
    context += '✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character\'s canonical name in the list above.\n\n';
  }
  
  // Setting vocabulary section
  if (allSettingTerms.size > 0) {
    context += '**Setting Vocabulary Established in Earlier Chapters:**\n';
    const termList = Array.from(allSettingTerms).slice(0, 15).join(', ');
    context += termList + '\n\n';
    context += '✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.\n';
    context += '✓ Do NOT introduce new location types that contradict earlier chapters.\n\n';
  }
  
  // Recent chapter summaries for narrative flow
  const recentSummaries = summaries.slice(Math.max(0, summaries.length - 3), summaries.length);
  if (recentSummaries.length > 0) {
    context += '**Recent Chapter Summary (for narrative continuity):**\n';
    recentSummaries.forEach(summary => {
      context += `Chapter ${summary.chapterNumber}: ${summary.title}\n`;
      if (summary.keyEvents.length > 0) {
        context += `  Events: ${summary.keyEvents[0]}\n`;
      }
    });
    context += '\n';
  }
  
  context += '⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.\n';
  context += 'Double-check every character name against the list above before using it.\n';
  context += '═══════════════════════════════════════════════════════════\n';
  
  return context;
}

/**
/**
 * Opening style rotation used to assign a mandatory first-sentence style to each
 * chapter, ensuring no single style (especially "general-descriptive") accounts
 * for more than a third of chapters.
 *
 * The cycle is 6 styles long; "general-descriptive" appears once per cycle.
 * For 18 chapters that means 3 general-descriptive (17%) — well under the 50%
 * validation threshold that fires `opening_style_repetition`.
 *
 * Each directive is given to the LLM in the per-chapter scene grounding checklist
 * as a HARD REQUIREMENT so that the opening sentence pattern is enforced before
 * any sensory/atmosphere obligations.
 */
const OPENING_STYLE_ROTATION: Array<{ style: string; directive: string }> = [
  {
    style: 'character-action',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…".',
  },
  {
    style: 'dialogue-open',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. \'"[words]," [Name] said/asked/replied/murmured.\' The opening quote must be the first character on the line.',
  },
  {
    style: 'time-anchor',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At 9:30 PM…". Time must be in the first clause.',
  },
  {
    style: 'noun-phrase-atmosphere',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…".',
  },
  {
    style: 'temporal-subordinate',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…".',
  },
  {
    style: 'general-descriptive',
    directive:
      'OPENING STYLE: Atmospheric scene-setting is permitted here — but the first sentence MUST differ structurally from both the preceding and following chapters. Do not reuse the same clause structure or sensory vocabulary as adjacent chapters.',
  },
];

/**
 * Build an explicit chapter-by-chapter scene grounding checklist using
 * outline scene settings and location profile names.
 *
 * Also embeds:
 *  2b — per-chapter opening style directive (prevents opening_style_repetition)
 *  2c — canonical location capitalisation block (prevents location_name_variant)
 */
function buildSceneGroundingChecklist(
  scenes: unknown[],
  locationProfiles: any,
  chapterStart: number,
): string {
  if (!Array.isArray(scenes) || scenes.length === 0) return '';

  const locationNames = new Set<string>();
  if (locationProfiles?.primary?.name) {
    locationNames.add(String(locationProfiles.primary.name));
  }
  if (Array.isArray(locationProfiles?.keyLocations)) {
    for (const loc of locationProfiles.keyLocations) {
      if (loc?.name) locationNames.add(String(loc.name));
    }
  }
  // Pre-pass: also collect scene-level location names so that locations which appear
  // in the narrative outline but not in locationProfiles (e.g. "Wine Cellar" from
  // scene.setting.location) are included in the capitalisation enforcement block.
  for (const scene of scenes as any[]) {
    const sceneLocName = String(scene?.setting?.location || scene?.location || '').trim();
    if (sceneLocName.length > 0) locationNames.add(sceneLocName);
  }

  // 2c — Canonical location names for capitalisation enforcement
  const canonicalLocationList = Array.from(locationNames).slice(0, 12);
  const locationCapitalisationBlock =
    canonicalLocationList.length > 0
      ? `\nLOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):\n` +
        `All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.\n` +
        `Canonical forms: ${canonicalLocationList.map((n) => `"${n}"`).join(', ')}\n` +
        `Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. ` +
        `Every time you mention a named location, copy its capitalisation from the list above.`
      : '';

  const checklistLines: string[] = [];
  scenes.forEach((scene: any, idx) => {
    const chapterNumber = chapterStart + idx;
    const sceneLocation = String(scene?.setting?.location || scene?.location || '').trim();
    const locationHint = sceneLocation.length > 0
      ? sceneLocation
      : (locationNames.size > 0 ? Array.from(locationNames)[0] : 'the canonical primary location');

    // 2b — Deterministic opening style assignment (cycle index based on absolute chapter number
    // so assignments are stable across multi-batch generation)
    const styleIdx = (chapterNumber - 1) % OPENING_STYLE_ROTATION.length;
    const { directive: openingStyleDirective } = OPENING_STYLE_ROTATION[styleIdx];

    checklistLines.push(
      `- Chapter ${chapterNumber}: ${openingStyleDirective} ` +
      `Anchor opening in "${locationHint}". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season. These are validated requirements, not style suggestions; missing them triggers a retry.`
    );
  });

  const knownLocations = Array.from(locationNames).slice(0, 8).join(', ');
  const knownLocationLine = knownLocations.length > 0
    ? `Known location profile anchors: ${knownLocations}`
    : 'Known location profile anchors: use the primary location and scene setting terms from outline.';

  return `\n\nSCENE GROUNDING CHECKLIST (MUST FOLLOW):\n${knownLocationLine}${locationCapitalisationBlock}\n${checklistLines.join('\n')}`;
}

/**
 * Validate that discriminating test requirements can be satisfied by CML
 * Returns error message if validation fails, empty string if OK
 */
function validateChecklistRequirements(caseData: CaseData): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return ''; // No test to validate
  }
  
  const evidenceClues = discriminatingTest.evidence_clues || [];

  // Build the authoritative set of known clue IDs from clue_to_scene_mapping.
  // CASE.clue_registry does not exist in the cml_2_0 schema — the real source is
  // prose_requirements.clue_to_scene_mapping[].clue_id.
  const knownClueIds = new Set<string>(
    ((cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .map((entry: any) => String(entry?.clue_id || ''))
      .filter(Boolean)
  );

  // Check that all evidence clues exist in the known clue set.
  // Skip if there is no clue map — an empty mapping means we cannot validate.
  const missingClues: string[] = [];
  if (knownClueIds.size > 0) {
    evidenceClues.forEach((clue: any) => {
      const clueId = typeof clue === 'string' ? clue : clue.clue_id;
      if (clueId && !knownClueIds.has(clueId)) {
        missingClues.push(clueId);
      }
    });
  }
  
  if (missingClues.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test references clues not in clue_to_scene_mapping: ${missingClues.join(', ')}. Cannot generate checklist with invalid clue references.`;
  }
  
  // Check that eliminated suspects exist in cast
  const eliminated = discriminatingTest.eliminated_suspects || [];
  const cast = cmlCase.cast || [];
  const missingCast: string[] = [];
  
  eliminated.forEach((suspect: any) => {
    const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
    const exists = cast.some((member: any) => member.name === suspectName);
    if (!exists) {
      missingCast.push(suspectName);
    }
  });
  
  if (missingCast.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test eliminates suspects not in cast: ${missingCast.join(', ')}. Cannot eliminate non-existent characters.`;
  }
  
  return ''; // Validation passed
}

/**
 * Build discriminating test checklist from CML.
 * Provides explicit checkbox requirements for late chapters (past 70% of story) where the test should appear.
 * Breaks down complex multi-step reasoning into concrete requirements.
 */
export function buildDiscriminatingTestChecklist(
  caseData: CaseData, 
  chapterRange: string, 
  outline: NarrativeOutline,
  totalScenes: number
): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return '';
  }
  
  // Validate checklist requirements before building
  const validationError = validateChecklistRequirements(caseData);
  if (validationError) {
    return '\n\n' + validationError + '\n';
  }
  
  const proseReqs = cmlCase.prose_requirements ?? {};
  const dtScene = proseReqs.discriminating_test_scene;
  // discriminating_test.design is a string in the schema, not an object — access it directly.
  const testDescription = typeof discriminatingTest.design === 'string' ? discriminatingTest.design : '';
  // test_type lives in prose_requirements.discriminating_test_scene; use discriminating_test.method as fallback.
  const testType = dtScene?.test_type || discriminatingTest.method || 'unknown';

  // evidence_clues and eliminated_suspects are not in the cml_2_0 schema.
  // Derive them from clue_to_scene_mapping (filtered to the DT scene) and the cast minus culprits.
  const rawEvidenceClues: any[] = Array.isArray(discriminatingTest.evidence_clues) ? discriminatingTest.evidence_clues : [];
  const evidenceClues: any[] = rawEvidenceClues.length > 0
    ? rawEvidenceClues
    : ((proseReqs.clue_to_scene_mapping ?? []) as any[])
        .filter((e: any) => !dtScene || Number(e?.act_number) === Number(dtScene?.act_number))
        .map((e: any) => String(e?.clue_id || ''))
        .filter(Boolean);

  const culpritSet = new Set<string>((cmlCase.culpability?.culprits ?? []).map((n: any) => String(n)));
  const rawEliminated: any[] = Array.isArray(discriminatingTest.eliminated_suspects) ? discriminatingTest.eliminated_suspects : [];
  const eliminated: any[] = rawEliminated.length > 0
    ? rawEliminated
    : (cmlCase.cast ?? []).filter((c: any) => {
        if (culpritSet.has(c.name)) return false;
        if (String(c.culpability || '').toLowerCase() === 'guilty') return false;
        const role = String(c.role || '').toLowerCase();
        return role !== 'detective' && role !== 'victim';
      }).map((c: any) => c.name).filter(Boolean);
  
  // Only show checklist once we're in the late portion of the story (past 70% threshold).
  // This threshold is relative to totalScenes, matching chapter-validator.ts behaviour.
  const chapterNumbers = chapterRange.split('-').map(n => parseInt(n, 10));
  const lateThreshold = Math.ceil(totalScenes * 0.70);
  const isLateChapter = chapterNumbers.some(n => n >= lateThreshold);
  
  if (!isLateChapter) {
    return '';
  }
  
  // Extract clue locations from outline
  const clueLocations = extractClueLocations(caseData, outline);
  
  let checklist = '\n\n═══════════════════════════════════════════════════════════\n';
  checklist += '🎯 DISCRIMINATING TEST CHECKLIST - CRITICAL REQUIREMENTS\n';
  checklist += '═══════════════════════════════════════════════════════════\n\n';
  checklist += `This is a **${testType}** test. The detective must:\n\n`;
  checklist += `**Test Description:**\n${testDescription}\n\n`;
  checklist += `**MANDATORY CHECKLIST - Every box must be checked:**\n\n`;
  
  // Evidence clue requirements with locations
  if (evidenceClues.length > 0) {
    checklist += `☐ **Evidence Integration**\n`;
    evidenceClues.forEach((clue: any) => {
      const clueId = typeof clue === 'string' ? clue : clue.clue_id;
      const clueType = typeof clue === 'object' ? clue.type || 'clue' : 'clue';
      const location = clueLocations.get(clueId);
      const locationStr = location ? ` (appears in ${location})` : '';
      checklist += `  ☐ Explicitly reference or use clue: "${clueId}" (${clueType})${locationStr}\n`;
    });
    checklist += `\n`;
  }
  
  // Test execution requirements based on type
  checklist += `☐ **Test Execution**\n`;
  if (testType === 'timing_test' || testType === 'timeline_test') {
    checklist += `  ☐ Detective reviews or reconstructs the timeline\n`;
    checklist += `  ☐ Show calculation or reasoning about time windows\n`;
    checklist += `  ☐ Demonstrate which suspects had/lacked opportunity\n`;
  } else if (testType === 'physical_test' || testType === 'capability_test') {
    checklist += `  ☐ Detective tests or demonstrates the physical requirement\n`;
    checklist += `  ☐ Show measurement, demonstration, or verification\n`;
    checklist += `  ☐ Clearly show which suspects can/cannot meet requirement\n`;
  } else if (testType === 'knowledge_test' || testType === 'specialized_knowledge') {
    checklist += `  ☐ Detective identifies what specialized knowledge is required\n`;
    checklist += `  ☐ Show investigation of who has this knowledge\n`;
    checklist += `  ☐ Demonstrate which suspects possess/lack the knowledge\n`;
  } else if (testType === 'access_test' || testType === 'opportunity_test') {
    checklist += `  ☐ Detective maps who had access at critical time\n`;
    checklist += `  ☐ Show verification of alibis or access records\n`;
    checklist += `  ☐ Clearly eliminate suspects who lacked access\n`;
  } else {
    checklist += `  ☐ Detective performs the test or verification as a concrete scene beat, not a summary paragraph\n`;
    checklist += `  ☐ The detective confronts the culprit or key suspect directly with the evidence or mechanism\n`;
    checklist += `  ☐ Show the trap springing in real time: inconsistent answer, visible nerves, or a damning response\n`;
    checklist += `  ☐ Show clear reasoning and evidence evaluation leading into the confrontation\n`;
    checklist += `  ☐ Demonstrate which suspects pass/fail the test with explicit on-page elimination logic\n`;
  }
  checklist += `\n`;
  
  // Suspect elimination requirements
  if (eliminated.length > 0) {
    checklist += `☐ **Suspect Elimination**\n`;
    eliminated.forEach((suspect: any) => {
      const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
      checklist += `  ☐ Clearly eliminate "${suspectName}" from suspicion\n`;
    });
    checklist += `\n`;
  }
  
  // Detective reasoning requirements
  checklist += `☐ **Detective Reasoning**\n`;
  checklist += `  ☐ Detective explicitly states the test logic\n`;
  checklist += `  ☐ Show step-by-step deduction process\n`;
  checklist += `  ☐ Connect test results to innocence/guilt determination\n`;
  checklist += `\n`;
  
  // Prose quality requirements
  checklist += `☐ **Prose Integration**\n`;
  checklist += `  ☐ Scene is dramatic and engaging (not dry exposition)\n`;
  checklist += `  ☐ Use dialogue to reveal test logic naturally\n`;
  checklist += `  ☐ Build tension as test proceeds\n`;
  checklist += `  ☐ Clear moment of revelation when test succeeds\n`;
  checklist += `\n`;
  
  checklist += `⚠️ **VALIDATION:** If ANY checkbox above is unchecked in your prose, the chapter will FAIL validation.\n`;
  checklist += `This test is THE HARDEST element to get right. Take your time. Check every box.\n`;
  checklist += `CRITICAL: Render the discriminating test as a real-time dramatic scene with dialogue, confrontation, and a visible trap outcome. Do not hide it inside retrospective summary.\n`;
  checklist += `═══════════════════════════════════════════════════════════\n`;
  
  return checklist;
}

/**
 * Extract evidence clue locations from clue_to_scene_mapping.
 * Returns map of clue_id to Act/Scene location for checklist injection.
 * Each mapping entry already carries act_number and scene_number, so no
 * outline search is needed. CASE.clue_registry does not exist in the schema.
 */
function extractClueLocations(caseData: CaseData, outline: NarrativeOutline): Map<string, string> {
  const clueLocations = new Map<string, string>();
  const cmlCase = (caseData as any)?.CASE ?? {};
  const mappings = (cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[];

  for (const entry of mappings) {
    const clueId = String(entry?.clue_id || '');
    if (clueId && !clueLocations.has(clueId)) {
      clueLocations.set(clueId, `Act ${entry.act_number}, Scene ${entry.scene_number}`);
    }
  }

  return clueLocations;
}

/**
 * Build enhanced, categorized retry feedback
 * Helps LLM understand exactly what to fix
 */
const buildEnhancedRetryFeedback = (
  errors: string[],
  caseData: CaseData,
  chapterRange: string,
  attempt: number,
  maxAttempts: number
): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const cast = cmlCase.cast || [];
  const castNames = cast.map((c: any) => c.name);
  // CASE.meta.setting has location, place, country, institution — no location_type field.
  // Use the location name for setting-specific retry guidance.
  const locationType = cmlCase.meta?.setting?.location || '';
  
  // Categorize errors — clue errors must be separated FIRST to prevent them from
  // falling into qualityErrors (which matches anything containing "chapter").
  const clueValidationErrors = errors.filter(e => {
    const lc = e.toLowerCase();
    return lc.includes('clue evidence') || lc.includes('clue obligation') || lc.includes('clue visibility') || lc.includes('missing required clue');
  });
  // ─── PHASE 2 (ANALYSIS_16) ──────────────────────────────────────────────
  // Pronoun-specific retry feedback branch.
  // Pre-Phase-2: pronoun errors fell into characterErrors and received the
  //   name-hallucination solution block (wrong feedback for the failure mode).
  // All PHASE 2 changes are tagged [PHASE 2] below.
  //
  // To revert Phase 2 in full:
  //   1. Delete the pronounErrors filter (lines below)
  //   2. Remove `!pronounErrors.includes(e)` guards from settingErrors, testErrors,
  //      wordCountErrors, qualityErrors, and otherErrors filters
  //   3. Delete the `if (pronounErrors.length > 0) { ... }` feedback block
  // ─────────────────────────────────────────────────────────────────────────
  // [PHASE 2] Pronoun errors extracted before characterErrors so they get
  // targeted feedback instead of the name-hallucination solution block.
  const pronounErrors = errors.filter(e => !clueValidationErrors.includes(e) && (
    e.toLowerCase().includes('pronoun_gender_mismatch') ||
    /incorrect pronoun|wrong pronoun|should use he|should use she|should use they/i.test(e)
  ));
  const characterErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    (e.toLowerCase().includes('character') || e.toLowerCase().includes('name'))
  );
  const settingErrors = errors.filter(e => !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) && (e.toLowerCase().includes('setting') || e.toLowerCase().includes('location')));
  const testErrors = errors.filter(e => !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && e.toLowerCase().includes('discriminating test'));
  // Word-count errors contain "chapter" so they would otherwise match qualityErrors and receive
  // misleading "vary paragraph lengths" guidance. Extract them first; the MICRO-PROMPT [word_count]
  // directive in buildRetryMicroPromptDirectives already gives the correct repair instruction.
  const wordCountErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) &&
    /word count below/i.test(e)
  );
  const qualityErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) && !wordCountErrors.includes(e) &&
    (e.toLowerCase().includes('paragraph') || e.toLowerCase().includes('chapter'))
  );
  const otherErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) && // [PHASE 2]
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    !qualityErrors.includes(e)
  );

  const buildRetryMicroPromptDirectives = (rawErrors: string[], rangeLabel: string, attemptNum: number): string[] => {
    const directives: string[] = [];
    const loweredErrors = rawErrors.map((error) => error.toLowerCase());

    // Separate absent-clue errors from late-placed-clue errors — they need different repairs.
    const clueAbsentErrors = rawErrors.filter((e) =>
      e.toLowerCase().includes('clue evidence') && e.toLowerCase().includes('is absent')
    );
    const clueLatePlacedErrors = rawErrors.filter((e) =>
      e.toLowerCase().includes('first quarter of the chapter') ||
      (e.toLowerCase().includes('clue evidence') && e.toLowerCase().includes('is present but'))
    );
    const otherClueErrors = rawErrors.filter((e) =>
      (e.toLowerCase().includes('missing required clue obligation') ||
        e.toLowerCase().includes('clue visibility') ||
        e.toLowerCase().includes('clue obligation')) &&
      !clueAbsentErrors.includes(e) &&
      !clueLatePlacedErrors.includes(e)
    );
    const clueErrors = clueAbsentErrors.length > 0 || clueLatePlacedErrors.length > 0 || otherClueErrors.length > 0;

    // Extract quoted strings (“description”) from a set of error messages.
    const extractQuoted = (errs: string[]) =>
      Array.from(new Set(
        errs.flatMap((error) => Array.from(error.matchAll(/"([^"]+)"/g)).map((m) => String(m[1] || '')).filter(Boolean))
      ));

    if (clueLatePlacedErrors.length > 0) {
      const lateDescs = extractQuoted(clueLatePlacedErrors);
      const scope = lateDescs.length > 0 ? lateDescs.join(', ') : 'the required evidence';
      directives.push(
        `REPAIR [clue_early_placement — attempt ${attemptNum}]: ${scope} is already present in the chapter but appears TOO LATE.\n` +
        `  DO NOT write a new instance. Instead, MOVE the existing paragraph(s) about this evidence to before the 25% mark (within the first quarter of the chapter).\n` +
        `  After moving the observation, ensure the immediately following paragraph is a dedicated inference paragraph (the detective or POV character explicitly reasons about what the evidence implies). This inference paragraph must be a separate full paragraph, not a sentence appended to the observation.\n` +
        `  Everything else in the chapter can remain in place.`
      );
    }

    if (clueAbsentErrors.length > 0 || otherClueErrors.length > 0) {
      const absentDescs = extractQuoted([...clueAbsentErrors, ...otherClueErrors]);

      // Escalation tier is relative to remaining attempts so the directive strength
      // always matches how many retries are left, regardless of maxAttempts config value.
      // retriesRemaining >= 2 → early standard guidance
      // retriesRemaining === 1 → penultimate: paragraph structure required
      // retriesRemaining === 0 → final: mandatory rebuild block
      const retriesRemaining = maxAttempts - attemptNum;
      if (retriesRemaining >= 2) {
        const clueScope = absentDescs.length > 0
          ? `chapters ${rangeLabel} are missing: ${absentDescs.join(', ')}.`
          : `chapters ${rangeLabel} are missing required clue evidence.`;
        directives.push(
          `REPAIR [clue_visibility — attempt ${attemptNum}]: ${clueScope}\n` +
          `  Near the beginning of the chapter:\n` +
          `  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.\n` +
          `  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.\n` +
          `  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.`
        );
      } else if (retriesRemaining === 1) {
        const clueScope = absentDescs.length > 0 ? absentDescs.join(', ') : 'the required clue evidence';
        directives.push(
          `REPAIR [clue_visibility — attempt ${attemptNum} — PARAGRAPH STRUCTURE REQUIRED]: ${clueScope} still missing.\n` +
          `  You MUST include a two-paragraph sequence in the first quarter of the chapter:\n` +
          `  Paragraph A: The character physically approaches, examines, or directly perceives the evidence. Write this as a present-action beat, not a recalled memory. Include the exact required phrase if one is specified.\n` +
          `  Paragraph B: In the very next paragraph, the character explicitly says or thinks that this evidence may be misleading, was tampered with, or points to a specific person. Use first-person inference language ("She realised...", "He could not help but wonder..."). This must be a full separate paragraph, not a tacked-on sentence.\n` +
          `  The chapter must be at least 1450 words. Use action, inference dialogue, and sensory grounding to expand — not recap.`
        );
      } else {
        const clueScope = absentDescs.length > 0 ? absentDescs.join(', ') : 'the required clue evidence';
        directives.push(
          `REPAIR [clue_visibility — attempt ${attemptNum} — FINAL MANDATORY BLOCK]: ${clueScope} has failed every prior attempt.\n` +
          `  WITHIN THE FIRST 300 WORDS of the chapter, place this two-paragraph block:\n` +
          `  Block paragraph 1: Direct physical observation of the evidence by the POV character. Name it explicitly. Include any exact required phrase verbatim. Show, do not summarise.\n` +
          `  Block paragraph 2: Explicit reasoning that this evidence may have been manipulated, timed, or positioned to mislead. The character must state this in their own words.\n` +
          `  After this block, continue the chapter normally to reach at least 1500 words.\n` +
          `  REBUILD the chapter from scratch — do not patch or preserve prior wording. All prior text should be treated as discarded.`
        );
      }
    }

    const wordCountError = rawErrors.find((error) => /word count below (hard floor|preferred target|minimum)/i.test(error));
    if (wordCountError) {
      const match = wordCountError.match(/\((\d+)\/(\d+)\)/);
      const currentWords = match ? Number(match[1]) : undefined;
      const targetWords = match ? Number(match[2]) : undefined;
      const guidance = Number.isFinite(targetWords)
        ? `Raise chapter length to at least ${targetWords} words${Number.isFinite(currentWords) ? ` (currently ${currentWords})` : ""}.`
        : "Increase chapter length to satisfy minimum word threshold.";

      directives.push(
        `MICRO-PROMPT [word_count]: ${guidance} Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.`
      );
    }

    const temporalError = rawErrors.find((e) => /month\/season contradiction/i.test(e));
    if (temporalError) {
      // Extract month and wrong season from the error message:
      //   "Chapter N has month/season contradiction (january vs autumn)"
      const temporalMatch = temporalError.match(/\(([a-z]+) vs ([a-z,\s]+)\)/);
      const month = temporalMatch?.[1] ?? 'the story month';
      const wrongSeasons = temporalMatch?.[2]?.trim() ?? 'the wrong season';
      const correctSeason = (month && MONTH_TO_SEASON[month]) ?? 'the correct season';
      directives.push(
        `REPAIR [temporal_consistency — attempt ${attemptNum}]: This chapter contains ${wrongSeasons} language but the story month is ${month} (${correctSeason}).\n` +
        `  You MUST remove every reference to ${wrongSeasons} from the prose — this includes the words themselves and their adjectival forms (e.g. "autumnal", "summery", "wintry", "springtime").\n` +
        `  Replace with ${correctSeason}-appropriate language only. Use words like: ${getSeasonAllowList(correctSeason as CanonicalSeason)}.\n` +
        `  Check every atmospheric sentence, weather description, and sensory detail for forbidden season vocabulary before finalising.`
      );
    }

    const groundingErrors = loweredErrors.some((error) =>
      error.includes("scene location anchoring") || error.includes("grounding") || error.includes("setting fidelity")
    );
    if (groundingErrors) {
      directives.push(
        `MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats.`
      );
    }

    const entropyError = rawErrors.find((e) => /opening-style entropy too low/i.test(e));
    if (entropyError && attemptNum < maxAttempts) {
      directives.push(
        `REPAIR [opening_style]: This chapter opens with the same sentence pattern as prior chapters (entropy too low).\n` +
        `  You MUST begin the FIRST SENTENCE of this chapter with a structurally different type. Choose ONE of:\n` +
        `  • Spoken dialogue — open with a character speaking: \'"[words]," said/asked [Name].\'\n` +
        `  • Time anchor — open with a specific time: \'At half past nine...\' or \'At midnight...\' or \'At 9 PM...\'\n` +
        `  • Character in motion — ONE named character acts first: \'[Name] crossed/turned/moved/stepped/approached/examined/glanced/rose/returned [the/to/into]...\'\n` +
        `  • Noun-phrase atmosphere with a genitive: \'The [noun] of the [place]...\' or \'A [noun] in the [place]...\'\n` +
        `  • Temporal subordinate — begin with a time clause: \'When.../After.../Before.../As [Name]...\'\n` +
        `  Do NOT open with a general descriptive sentence (e.g., \'The dark room...\' or \'Silence filled the hall...\' or \'The air was heavy..\'). The very first sentence must be one of the five types above.`
      );
    }

    return directives;
  };

  const retryDirectives = buildRetryMicroPromptDirectives(errors, chapterRange, attempt);
  
  let feedback = `Attempt ${attempt}/${maxAttempts} — chapters ${chapterRange} — ${errors.length} validation issue(s) to resolve:\n\n`;
  
  if (clueValidationErrors.length > 0) {
    feedback += `═══ CLUE OBLIGATION FAILURES (${clueValidationErrors.length}) ═══\n`;
    clueValidationErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\nSee the RETRY MICRO-PROMPTS section below for specific paragraph-by-paragraph repair instructions.\n\n`;
  }

  // [PHASE 2] Pronoun-specific feedback block (targeted repair instructions).
  // Pre-Phase-2 these errors were handled by CHARACTER NAME ERRORS below (wrong bucket).
  if (pronounErrors.length > 0) {
    // Build a per-character directive for ONLY the characters that actually failed.
    // A full cast table is counterproductive — the model sees it as a reference rather
    // than an action. Instead emit one crisp FIX line per failing character.
    const failingCharacterDirectives = pronounErrors.map((msg) => {
      const nameMatch = /^Character "([^"]+)" has incorrect pronouns\. Should use ([^\s]+) but found: (.+)$/.exec(msg);
      if (!nameMatch) return `  ⚠️ ${msg}`;
      const [, name, correctPronounSet, wrongPronouns] = nameMatch;
      const castEntry = cast.find((c: any) => c.name === name);
      const gender = castEntry?.gender?.toLowerCase();
      const genderLabel = gender === 'male' ? 'MALE' : gender === 'female' ? 'FEMALE' : 'NON-BINARY';
      return (
        `  ⚠️ ${name} is ${genderLabel} — use "${correctPronounSet}" ONLY.\n` +
        `     You wrote: ${wrongPronouns} — these are WRONG for this character.\n` +
        `     Every time "${name}" appears: ${correctPronounSet}. No exceptions.`
      );
    }).join('\n');

    feedback += `═══ ⚠️ PRONOUN ERRORS — MUST FIX (${pronounErrors.length}) ═══\n`;
    feedback += `These specific characters had the WRONG pronouns. Fix each one before you submit:\n\n`;
    feedback += `${failingCharacterDirectives}\n\n`;
    feedback += `HOW TO FIX: Search your draft for every occurrence of each name above.\n`;
    feedback += `Replace any pronoun that does not match the gender shown.\n`;
    feedback += `Minimal sentence rewording is acceptable where it improves clarity (e.g. naming\n`;
    feedback += `the character explicitly instead of relying on a pronoun). Do NOT alter plot\n`;
    feedback += `points, clue details, alibis, or dialogue meaning.\n\n`;
  }

  if (characterErrors.length > 0) {
    feedback += `═══ CHARACTER NAME ERRORS (${characterErrors.length}) ═══\n`;
    characterErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: The ONLY characters who exist are: ${castNames.join(', ')}\n`;
    feedback += `❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.\n`;
    feedback += `✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].\n\n`;
    feedback += `✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".\n\n`;
  }
  
  if (settingErrors.length > 0) {
    feedback += `═══ SETTING DRIFT ERRORS (${settingErrors.length}) ═══\n`;
    settingErrors.forEach(e => feedback += `• ${e}\n`);
    if (locationType) {
      feedback += `\n✓ SOLUTION: This story is set in a "${locationType}"\n`;
      feedback += `✓ Use ONLY location vocabulary appropriate for this setting type\n`;
      feedback += `✓ DO NOT use terms from other settings (manor, train, hotel, etc.)\n\n`;
    }
  }
  
  if (testErrors.length > 0) {
    feedback += `═══ DISCRIMINATING TEST ERRORS (${testErrors.length}) ═══\n`;
    testErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: The discriminating test must be explicit and complete\n`;
    feedback += `✓ Include the detective's reasoning, the test itself, and clear elimination of suspects\n`;
    feedback += `✓ Reference specific evidence clues from the CML\n`;
    
    feedback += `✓ Use the discriminating test checklist from the prompt when provided\n`;
    feedback += `\n`;
  }
  
  if (qualityErrors.length > 0) {
    feedback += `═══ PROSE QUALITY ERRORS (${qualityErrors.length}) ═══\n`;
    qualityErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: Vary paragraph lengths (short, medium, long)\n`;
    feedback += `✓ Include sensory details and atmospheric description\n`;
    feedback += `✓ Ensure each chapter has substance (3+ paragraphs minimum)\n\n`;
  }

  if (wordCountErrors.length > 0) {
    feedback += `═══ WORD COUNT FAILURES (${wordCountErrors.length}) ═══\n`;
    wordCountErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\nSee RETRY MICRO-PROMPTS below for the specific word target and expansion strategy.\n\n`;
  }
  
  if (otherErrors.length > 0) {
    feedback += `═══ OTHER ERRORS (${otherErrors.length}) ═══\n`;
    otherErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n`;
  }

  if (retryDirectives.length > 0) {
    feedback += `═══ RETRY MICRO-PROMPTS (${retryDirectives.length}) ═══\n`;
    retryDirectives.forEach((directive) => {
      feedback += `• ${directive}\n`;
    });
    feedback += `\n`;
  }

  // When 3 or more distinct directives are active simultaneously, the model may shed implicit
  // prose structure (paragraph splitting) to satisfy all explicit constraints. Add a guardrail
  // to prevent single-paragraph collapse under directive overload.
  if (retryDirectives.length >= 3) {
    feedback += `═══ STRUCTURAL REMINDER ═══\n`;
    feedback += `The "paragraphs" array in the JSON output must contain MULTIPLE separate paragraph strings — one paragraph per array element. `;
    feedback += `Do NOT place the entire chapter text inside a single array element. `;
    feedback += `Aim for 5–8 paragraphs. Each paragraph should be a distinct prose unit of 3–8 sentences.\n\n`;
  }
  
  const isFinalAttempt = attempt >= maxAttempts;
  if (isFinalAttempt) {
    feedback += `Write completely fresh chapters for ${chapterRange} that satisfy every constraint listed above. Do not reuse prior wording.\n`;
  } else {
    feedback += `Return corrected JSON for chapters ${chapterRange}. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.\n`;
  }
  
  return feedback;
};

// ─── WORLD FIX B (ANALYSIS_17) ───────────────────────────────────────────
// Pass temporal lock and anti-leakage instruction into attemptUnderflowExpansion().
// Previously the expansion was a context-stripped LLM call: 4-sentence system
// prompt with no knowledge of the story's season or any anti-leakage guard.
// This introduced new failure types (seasonal drift, prompt leakage) on the very
// path meant to be the last-resort recovery. All WORLD FIX B changes are tagged
// [WORLD FIX B] below.
//
// To revert World Fix B in full:
//   1. Remove `temporalLock?: { month: string; season: CanonicalSeason }` from
//      the attemptUnderflowExpansion() parameter list.
//   2. Delete the `// [WORLD FIX B]` temporalLockLine variable and the
//      `if (temporalLockLine...)` spread in the system array.
//   3. Restore the 4-element system array join (delete the two new sentences:
//      "Output only narrative prose..." and the temporalLockLine spread).
//   4. Remove `temporalSeasonLock, // [WORLD FIX B]` from the call site
//      inside generateProse() (search for "WORLD FIX B" at the call site).
// ─────────────────────────────────────────────────────────────────────────
const parseExpandedChapterResponse = (content: string): ProseChapter => {
  const parsed = parseProseResponse(content) as any;
  const candidate = parsed?.chapter ?? parsed;

  if (!candidate || typeof candidate !== "object") {
    throw new Error("Invalid underflow expansion payload: missing chapter object");
  }

  if (!Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
    throw new Error("Invalid underflow expansion payload: chapter.paragraphs must be a non-empty array");
  }

  return {
    title: typeof candidate.title === "string" ? candidate.title : "Untitled Chapter",
    summary: typeof candidate.summary === "string" ? candidate.summary : undefined,
    paragraphs: candidate.paragraphs.map((value: unknown) => String(value ?? "")).filter(Boolean),
  };
};

export const attemptUnderflowExpansion = async (
  client: AzureOpenAIClient,
  chapter: ProseChapter,
  chapterNumber: number,
  scene: any,
  ledgerEntry: ChapterRequirementLedgerEntry,
  model: string | undefined,
  runId: string | undefined,
  projectId: string | undefined,
  temporalLock?: { month: string; season: CanonicalSeason }, // [WORLD FIX B]
  cast?: any[], // [ANALYSIS_16 PHASE D]
): Promise<ProseChapter> => {
  const chapterText = (chapter.paragraphs ?? []).join("\n\n");
  const currentWords = countWords(chapterText);
  // If below hard floor, target the hard floor; otherwise target the preferred word count.
  const expansionTarget = currentWords < ledgerEntry.hardFloorWords
    ? ledgerEntry.hardFloorWords
    : ledgerEntry.preferredWords;
  const missingWords = Math.max(0, expansionTarget - currentWords);
  const expansionConfig = getGenerationParams().agent9_prose.underflow_expansion;
  const expansionHint = Math.max(
    expansionConfig.min_additional_words,
    Math.min(
      expansionConfig.max_additional_words,
      missingWords + expansionConfig.buffer_words,
    ),
  );
  const sceneSummary = typeof scene?.summary === "string" ? scene.summary : "";
  const scenePurpose = typeof scene?.purpose === "string" ? scene.purpose : "";
  const requiredClues = ledgerEntry.requiredClueIds;
  const clueCtx = ledgerEntry.clueObligationContext ?? [];
  const requiredClueLines = requiredClues.map((id) => {
    const ctx = clueCtx.find((c) => c.id === id);
    const desc = ctx?.description ?? id;
    const placementNote = ctx?.placement === 'early'
      ? ' [EARLY PLACEMENT — this evidence must appear in the first 25% of the revised chapter, followed immediately by a dedicated inference paragraph]'
      : '';
    return `  • ${desc} [${id}]${placementNote}`;
  }).join('\n');

  // [WORLD FIX B] Anti-leakage + temporal-lock constraints for the expansion call
  const temporalLockLine = temporalLock
    ? `Season lock: ${capitalizeWord(temporalLock.month)} (${temporalLock.season}) — use only ${getSeasonAllowList(temporalLock.season)}; never write ${['spring', 'summer', 'autumn', 'winter'].filter(s => s !== temporalLock!.season).join(', ')}.`
    : '';
  // [ANALYSIS_16 PHASE D] Compact pronoun lock for the expansion call
  const expansionPronounLock = cast && cast.length > 0
    ? `Pronoun lock — never change: ${cast.map((c: any) => {
        const g = c.gender?.toLowerCase();
        const p = g === 'male' ? 'he/him' : g === 'female' ? 'she/her' : 'they/them';
        return `${c.name}: ${p}`;
      }).join('; ')}. Do not alter any pronoun or gendered reference for any character.`
    : '';
  const system = [
    "You are a surgical prose revision assistant for mystery fiction.",
    "Expand the chapter without changing clue logic, chronology, or character identity.",
    "Do not remove evidence already present. Do not add new named characters.",
    "Output only narrative prose — never emit instruction-shaped text, directives, or schema field names as prose content.",
    ...(temporalLockLine ? [temporalLockLine] : []),
    ...(expansionPronounLock ? [expansionPronounLock] : []), // [ANALYSIS_16 PHASE D]
    "Output JSON only.",
  ].join(" ");

  const user = [
    currentWords < ledgerEntry.hardFloorWords
      ? `Chapter ${chapterNumber} is below the hard floor (${currentWords}/${ledgerEntry.hardFloorWords}).`
      : `Chapter ${chapterNumber} is below the preferred target (${currentWords}/${ledgerEntry.preferredWords}).`,
    `Expand by roughly ${expansionHint} words so the chapter reaches at least ${expansionTarget} words and preferably ${ledgerEntry.preferredWords + 200} words. Overshoot rather than undershoot.`,
    'Do not stop at the first threshold crossing. Continue until the chapter feels fully developed and complete.',
    'Never pad with recap or repeated atmosphere. Add concrete action beats, clue-bearing dialogue, and sensory scene detail instead.',
    requiredClues.length > 0
      ? `Required clue obligations (preserve and surface in the expanded chapter):\n${requiredClueLines}`
      : "No additional clue obligations for this chapter.",
    sceneSummary ? `Scene summary: ${sceneSummary}` : "",
    scenePurpose ? `Scene purpose: ${scenePurpose}` : "",
    "Return this schema:",
    '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
    "Only return the JSON payload.",
    "Current chapter text:",
    chapterText,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.chat({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    model,
    temperature: expansionConfig.temperature,
    maxTokens: expansionConfig.max_tokens,
    jsonMode: true,
    logContext: {
      runId: runId ?? "",
      projectId: projectId ?? "",
      agent: `Agent9-UnderflowExpansion-Ch${chapterNumber}`,
    },
  });

  return parseExpandedChapterResponse(response.content);
};

// ─── ANALYSIS_20 ATMOSPHERE-REPAIR PHRASE-SUBSTITUTION (2026-03-29) ─────────
// Previous implementation: full-chapter rewrite. The LLM was given the entire
// chapter text and told to regenerate it replacing banned phrases. This let the
// model re-gender any character during reconstruction — producing 15–17 pronoun
// errors per run despite Phase D pronoun locks (ANALYSIS_16) and the
// deterministic repair pass (ANALYSIS_19). Root cause: you cannot ask an LLM
// to rewrite whole paragraphs and simultaneously guarantee it never touches
// unrelated sentence elements.
//
// New implementation: phrase-level token substitution. The LLM is only asked to
// generate a fresh synonym for each banned phrase token — the surrounding prose,
// pronouns, sentence structure, and character references are never sent for
// rewriting and cannot be altered. Replacements are applied as deterministic
// string substitutions to original paragraphs.
//
// Side-effect: the ANALYSIS_16 PHASE D cast/pronounLock parameters are no
// longer required (they were a mitigation for the old wholesale-rewrite
// approach) and have been removed from the function signature and call site.
//
// To revert to full-chapter-rewrite (not recommended — see ANALYSIS_19/20):
//   1. Restore old function body from git history (search commit tagged ANALYSIS_16_PHASE_D).
//   2. Re-add `cast: any[]` parameter, pronounLock variable, and spread.
//   3. Restore `inputs.cast.characters` call site argument in generateProse().
//   4. Restore temperature: 0.55, maxTokens from underflow_expansion config.
// ─────────────────────────────────────────────────────────────────────────────

interface PhraseReplacement {
  original: string;
  replacement: string;
}

const parsePhraseReplacementsResponse = (content: string): PhraseReplacement[] => {
  try {
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed?.replacements) ? parsed.replacements : [];
    return arr
      .filter((r: unknown) =>
        r && typeof r === 'object' &&
        typeof (r as any).original === 'string' &&
        typeof (r as any).replacement === 'string' &&
        (r as any).original.trim().length > 0 &&
        (r as any).replacement.trim().length > 0
      )
      .map((r: any) => ({ original: r.original.trim(), replacement: r.replacement.trim() }));
  } catch {
    return [];
  }
};

const applyPhraseSubstitutions = (
  paragraphs: string[],
  replacements: PhraseReplacement[],
): string[] => {
  if (replacements.length === 0) return paragraphs;
  return paragraphs.map((para) => {
    let result = para;
    for (const { original, replacement } of replacements) {
      const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'gi');
      result = result.replace(pattern, (match) => {
        // Preserve capitalisation: if the matched token starts uppercase, capitalise replacement.
        if (match[0] && match[0] !== match[0].toLowerCase()) {
          return replacement[0].toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
    return result;
  });
};

export const runAtmosphereRepairIfNeeded = async (
  client: AzureOpenAIClient,
  chapters: ProseChapter[],
  bannedPhrases: string[],
  model: string | undefined,
  runId: string | undefined,
  projectId: string | undefined,
): Promise<ProseChapter[]> => {
  if (bannedPhrases.length === 0) {
    return chapters;
  }

  const repaired = [...chapters];
  const repairTargets = chapters
    .map((chapter, index) => ({
      index,
      chapter,
      text: (chapter.paragraphs ?? []).join(' '),
    }))
    .filter(({ text }) => bannedPhrases.some((phrase) => text.toLowerCase().includes(phrase.toLowerCase())))
    .slice(0, 8);

  for (const target of repairTargets) {
    // Only send the phrases actually present in this chapter.
    const presentPhrases = bannedPhrases.filter((phrase) =>
      target.text.toLowerCase().includes(phrase.toLowerCase())
    );

    const response = await client.chat({
      messages: [
        {
          role: 'system',
          content: [
            'You are a prose variety assistant for mystery fiction.',
            'You will be given a list of overused phrases.',
            'For each phrase provide one fresh, scene-specific alternative of similar length and register.',
            'Output JSON only — no explanation, no prose outside the JSON.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Chapter ${target.index + 1} overuses these phrases — provide one fresh alternative for each:`,
            presentPhrases.map((p, i) => `${i + 1}. "${p}"`).join('\n'),
            '',
            'Return exactly this schema (one entry per phrase, same order):',
            '{"replacements":[{"original":"...","replacement":"..."}]}',
            'Only return the JSON payload.',
          ].join('\n'),
        },
      ],
      model,
      temperature: 0.7,
      maxTokens: Math.max(400, presentPhrases.length * 80),
      jsonMode: true,
      logContext: {
        runId: runId ?? '',
        projectId: projectId ?? '',
        agent: `Agent9-AtmosphereRepair-Ch${target.index + 1}`,
      },
    });

    const replacements = parsePhraseReplacementsResponse(response.content);
    if (replacements.length > 0) {
      repaired[target.index] = {
        ...target.chapter,
        paragraphs: applyPhraseSubstitutions(target.chapter.paragraphs ?? [], replacements),
      };
    }
    // If LLM returns unparseable or empty replacements, the chapter is left unchanged (best-effort).
  }

  return repaired;
};

export async function generateProse(
  client: AzureOpenAIClient,
  inputs: ProseGenerationInputs,
  maxAttempts?: number
): Promise<ProseGenerationResult> {
  const configuredMaxAttempts = getGenerationParams().agent9_prose.generation.default_max_attempts;
  const resolvedMaxAttempts = maxAttempts ?? configuredMaxAttempts;
  const start = Date.now();
  const outlineActs = Array.isArray(inputs.outline.acts) ? inputs.outline.acts : [];
  const scenes = outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
  const sceneCount = scenes.length;
  
  const chapters: ProseChapter[] = [];
  const chapterSummaries: ChapterSummary[] = [];
  const chapterValidationHistory: Array<{ chapterNumber: number; attempt: number; errors: string[] }> = [];
  const provisionalChapterScores: ProvisionalChapterScore[] = [];
  // E5: Collect prompt fingerprints per chapter for traceability
  const promptFingerprints: Array<{ chapter: number; hash: string; section_sizes: Record<string, number> }> = [];
  const chapterValidator = new ChapterValidator();
  const pronounValidator = new CharacterConsistencyValidator();
  const temporalSeasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const progressCallback = inputs.onProgress || (() => {});
  const castNames = inputs.cast.characters.map(c => c.name);
  const proseModelConfig = getGenerationParams().agent9_prose.prose_model;
  const batchSize = Math.max(1, Math.min(inputs.batchSize || 1, proseModelConfig.max_batch_size));
  const pronounCheckingEnabled = getGenerationParams().agent9_prose.validation.pronoun_checking_enabled;
  const proseLinterStats: ProseLinterStats = {
    checksRun: 0,
    failedChecks: 0,
    openingStyleEntropyFailures: 0,
    openingStyleEntropyBypasses: 0,
    paragraphFingerprintFailures: 0,
    ngramOverlapFailures: 0,
  };
  const hardFloorMissChapters = new Set<number>();
  const preferredTargetMissChapters = new Set<number>();
  let hardFloorMissCount = 0;
  let preferredTargetMissCount = 0;
  let underflowExpansionAttempts = 0;
  let underflowExpansionRecovered = 0;
  let underflowExpansionFailed = 0;
  // FIX-C2: eagerly track which batch indices required at least one retry so the
  // count survives a throw that exits generateProse() before the post-loop aggregation.
  const retriedBatches = new Set<number>();

  // Deep-copy the caller's NarrativeState so mutations during generation (updateNSD calls)
  // do not bleed back into the orchestrator's copy.  Array/object fields need explicit
  // spreading because the outer spread {...inputs.narrativeState} is only one level deep.
  let liveNarrativeState: NarrativeState | undefined = inputs.narrativeState
    ? {
        ...inputs.narrativeState,
        lockedFacts: [...inputs.narrativeState.lockedFacts],
        characterPronouns: { ...inputs.narrativeState.characterPronouns },
        cluesRevealedToReader: [...inputs.narrativeState.cluesRevealedToReader],
      }
    : undefined;
  let rollingProvisionalFeedback = Array.isArray(inputs.provisionalScoringFeedback)
    ? [...inputs.provisionalScoringFeedback]
    : [];

  // Generate and validate scenes in configurable batches.
  // When batchSize=1 (default) this processes one chapter per LLM call;
  // higher values group multiple scenes into a single call for throughput gains.
  for (let batchStart = 0; batchStart < scenes.length; batchStart += batchSize) {
    const batchScenes = scenes.slice(batchStart, batchStart + batchSize);
    const chapterStart = batchStart + 1;
    const chapterEnd = batchStart + batchScenes.length;
    const cmlCase = (inputs.caseData as any)?.CASE ?? {};
    const chapterRequirementLedger = buildChapterRequirementLedger(
      cmlCase,
      batchScenes,
      chapterStart,
      inputs.targetLength ?? "medium",
      inputs.clueDistribution,
    );
    const maxBatchAttempts = Math.max(1, resolvedMaxAttempts);
    let lastBatchErrors: string[] = [];
    let lastBatchRawResponse: string | null = null;
    let batchSuccess = false;

    const overallProgress = 91 + Math.floor((batchStart / sceneCount) * 3); // 91-94%
    const batchLabel = batchScenes.length > 1 ? `${chapterStart}-${chapterEnd}` : `${chapterStart}`;
    progressCallback('prose', `Generating chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount}...`, overallProgress);

    for (let attempt = 1; attempt <= maxBatchAttempts; attempt++) {
      try {
        // chapterSummaries already holds every committed chapter, so continuity
        // context is always up-to-date when buildProsePrompt is called.
        const prompt = buildProsePrompt(
          {
            ...inputs,
            narrativeState: liveNarrativeState,
            provisionalScoringFeedback: rollingProvisionalFeedback,
          },
          batchScenes,
          chapterStart,
          chapterSummaries,
        );

        // E5: Compute prompt fingerprint on first attempt only (captures base prompt structure)
        if (attempt === 1) {
          const promptText = prompt.messages.map((m) => m.content).join('\n');
          const promptHash = createHash('sha256').update(promptText).digest('hex').slice(0, 16);
          for (let ci = chapterStart; ci <= chapterEnd; ci++) {
            promptFingerprints.push({ chapter: ci, hash: promptHash, section_sizes: prompt.sectionSizes });
          }
        }

        // Add retry feedback on subsequent attempts.
        // Attempts 2/3: include the previous raw response as an assistant turn so the model
        // makes targeted edits. Final attempt: skip the assistant turn so the model rebuilds
        // cleanly (consistent with the "REBUILD from scratch" directive at attempt 4+).
        if (attempt > 1 && lastBatchErrors.length > 0) {
          const feedback = buildEnhancedRetryFeedback(
            lastBatchErrors, inputs.caseData, batchLabel, attempt, maxBatchAttempts
          );
          if (lastBatchRawResponse && attempt < maxBatchAttempts) {
            prompt.messages.push({ role: "assistant" as const, content: lastBatchRawResponse });
          }
          prompt.messages.push({ role: "user" as const, content: feedback });
        }

        // temperature=0.45: low enough to maintain clue-ID and character-name fidelity,
        // high enough to produce distinct prose across chapters without stylistic collapse.
        // Token budget is length-aware: long stories require ~2400 words/chapter (~3600 prose
        // tokens + JSON envelope), so they get 6 000 tokens per scene.  Short/medium fit
        // comfortably within 4 500 tokens.  Hard caps prevent runaway completions.
        const tokensPerScene = inputs.targetLength === "long" ? 6000 : 4500;
        const response = await client.chat({
          messages: prompt.messages,
          model: inputs.model,
          temperature: proseModelConfig.temperature,
          maxTokens: Math.min(tokensPerScene * batchScenes.length, 20000),
          jsonMode: true,
          logContext: {
            runId: inputs.runId ?? "",
            projectId: inputs.projectId ?? "",
            agent: `Agent9-ProseGenerator-Ch${batchLabel}`,
          },
        });

        let proseBatch: Omit<ProseGenerationResult, "cost" | "durationMs">;
        // Store raw response immediately so next retry can include it as the assistant turn.
        lastBatchRawResponse = response.content;
        try {
          proseBatch = parseProseResponse(response.content);
        } catch (parseError: unknown) {
          const rawLength = response.content.length;
          const rawTail = response.content.slice(-300);
          const appearsTruncated = !response.content.trimEnd().endsWith('}');
          console.error(
            `[Agent 9] PARSE FAILURE ch${batchLabel} attempt ${attempt}/${maxBatchAttempts}:\n` +
            `  raw response chars: ${rawLength}\n` +
            `  appears truncated: ${appearsTruncated}\n` +
            `  raw tail (last 300 chars): ${rawTail}\n` +
            `  error: ${parseError instanceof Error ? parseError.message : String(parseError)}`
          );
          throw parseError;
        }
        validateChapterCount(proseBatch.chapters, batchScenes.length);

        // Validate each chapter in the batch individually
        let batchErrors: string[] = [];
        const provisionalBatchScores: ProvisionalChapterScore[] = [];
        for (let i = 0; i < proseBatch.chapters.length; i++) {
          let chapter = enforceMonthSeasonLockOnChapter(
            sanitizeGeneratedChapter(proseBatch.chapters[i], castNames),
            temporalSeasonLock,
          );
          // Deterministic safety net: if the model collapsed the entire chapter into a single
          // overlong paragraph block (a known directive-overload behaviour on final attempts),
          // split it on sentence boundaries before validation so formatting failures don't
          // consume a retry attempt that could otherwise fix a real content issue.
          if (
            Array.isArray(chapter.paragraphs) &&
            chapter.paragraphs.length === 1 &&
            chapter.paragraphs[0].length > 2400
          ) {
            const raw = chapter.paragraphs[0];
            const sentences = raw.match(/[^.!?]+[.!?]+\s*/g) ?? [raw];
            const split: string[] = [];
            let current = '';
            for (const sentence of sentences) {
              if (current.length + sentence.length > 2400 && current.length > 0) {
                split.push(current.trim());
                current = '';
              }
              current += sentence;
            }
            if (current.trim()) split.push(current.trim());
            if (split.length > 1) {
              chapter = { ...chapter, paragraphs: split };
            }
          }
          proseBatch.chapters[i] = chapter;
          const chapterNumber = chapterStart + i;
          const ledgerEntry = chapterRequirementLedger[i];

          // Deterministic pronoun repair before validation — catches unambiguous mismatches cheaply.
          // Controlled by agent9_prose.validation.pronoun_checking_enabled in generation-params.yaml.
          if (pronounCheckingEnabled && inputs.cast.characters.length > 0) {
            const pronRepair = repairChapterPronouns(chapter, inputs.cast.characters);
            if (pronRepair.repairCount > 0) {
              chapter = pronRepair.chapter;
              proseBatch.chapters[i] = chapter;
              console.warn(
                `[Agent 9] Pre-validation pronoun repair: ch${chapterNumber} — ${pronRepair.repairCount} replacement(s) applied.`,
              );
            }
          }

          const evaluateCandidate = (candidate: ProseChapter, trackUnderflow = true) => {
            const hardErrors: string[] = [];

            if (!candidate.title || typeof candidate.title !== 'string') {
              hardErrors.push(`chapter.title is required and must be a string`);
            }
            if (!Array.isArray(candidate.paragraphs)) {
              hardErrors.push(`chapter.paragraphs must be an array`);
            } else if (candidate.paragraphs.length === 0) {
              hardErrors.push(`chapter.paragraphs cannot be empty`);
            } else {
              candidate.paragraphs.forEach((para, pIdx) => {
                if (typeof para !== 'string') {
                  hardErrors.push(`chapter.paragraphs[${pIdx}] must be a string`);
                }
              });
            }

            const contentValidation = chapterValidator.validateChapter({
              title: candidate.title,
              paragraphs: candidate.paragraphs,
              chapterNumber,
              totalChapters: sceneCount,
              temporalMonth: temporalSeasonLock?.month,
              temporalSeason: temporalSeasonLock?.season,
            }, inputs.caseData);

            contentValidation.issues
              .filter(issue => issue.severity === 'critical' || issue.severity === 'major')
              .forEach(issue => {
                hardErrors.push(`Chapter ${chapterNumber}: ${issue.message}${issue.suggestion ? ` (${issue.suggestion})` : ''}`);
              });

            const obligations = ledgerEntry
              ? validateChapterPreCommitObligations(candidate, ledgerEntry, inputs.clueDistribution, castNames)
              : undefined;
            if (obligations) {
              hardErrors.push(...obligations.hardFailures);
              if (trackUnderflow) {
                if (obligations.wordTarget.isBelowHardFloor) {
                  hardFloorMissCount += 1;
                  hardFloorMissChapters.add(chapterNumber);
                } else if (obligations.wordTarget.isBelowPreferred) {
                  preferredTargetMissCount += 1;
                  preferredTargetMissChapters.add(chapterNumber);
                }
              }
            }

            const preferredMisses = obligations?.preferredMisses ?? [];
            const hasOnlyHardFloorUnderflow =
              hardErrors.length > 0 &&
              hardErrors.every((error) => /word count below hard floor/i.test(error));
            // True whenever the hard floor is hit, even if other hard errors also exist.
            // Expansion fires in this case so the model can grow the chapter while
            // simultaneously satisfying any co-present clue/placement obligations
            // (which are included in the expansion prompt).
            const hasHardFloorUnderflow =
              hardErrors.some((error) => /word count below hard floor/i.test(error));
            // Fires when the chapter passes all hard checks but is still below the preferred
            // word target. With a permissive hard_floor_relaxation_ratio the hard floor may
            // be cleared while the chapter is still meaningfully short of preferred length.
            const hasPreferredMissOnly =
              hardErrors.length === 0 && preferredMisses.length > 0;

            return {
              hardErrors,
              preferredMisses,
              contentValidation,
              hasOnlyHardFloorUnderflow,
              hasHardFloorUnderflow,
              hasPreferredMissOnly,
            };
          };

          let evaluation = evaluateCandidate(chapter, true);

          // Option D: If the hard floor is hit (even alongside other hard errors), OR the chapter
          // passed the hard floor but is still below the preferred target, attempt a chapter-local
          // expansion. The expansion prompt includes clue placement obligations so it is safe to
          // run even when clue/placement hard errors co-exist with the word count failure.
          if ((evaluation.hasHardFloorUnderflow || evaluation.hasPreferredMissOnly) && ledgerEntry) {
            underflowExpansionAttempts += 1;
            try {
              const expanded = await attemptUnderflowExpansion(
                client,
                chapter,
                chapterNumber,
                batchScenes[i],
                ledgerEntry,
                inputs.model,
                inputs.runId,
                inputs.projectId,
                temporalSeasonLock, // [WORLD FIX B]
                inputs.cast.characters, // [ANALYSIS_16 PHASE D]
              );
              chapter = enforceMonthSeasonLockOnChapter(
                sanitizeGeneratedChapter(expanded, castNames),
                temporalSeasonLock,
              );
              proseBatch.chapters[i] = chapter;
              // Repeat pronoun repair after expansion — expansion is a full LLM rewrite.
              if (pronounCheckingEnabled && inputs.cast.characters.length > 0) {
                const pronRepair = repairChapterPronouns(chapter, inputs.cast.characters);
                if (pronRepair.repairCount > 0) {
                  chapter = pronRepair.chapter;
                  proseBatch.chapters[i] = chapter;
                  console.warn(
                    `[Agent 9] Post-expansion pronoun repair: ch${chapterNumber} — ${pronRepair.repairCount} replacement(s) applied.`,
                  );
                }
              }
              evaluation = evaluateCandidate(chapter, false);
              if (evaluation.hasOnlyHardFloorUnderflow || evaluation.hardErrors.length > 0) {
                underflowExpansionFailed += 1;
              } else {
                underflowExpansionRecovered += 1;
              }
            } catch {
              underflowExpansionFailed += 1;
            }
          }

          const chapterErrors = [...evaluation.hardErrors];

          // Targeted pronoun repair: validate → fix validator-confirmed characters → re-validate.
          // Any mismatches that survive repair are unresolvable and escalate to an LLM retry.
          // Controlled by agent9_prose.validation.pronoun_checking_enabled in generation-params.yaml.
          if (pronounCheckingEnabled && inputs.cast.characters.length > 0) {
            const chapterText = chapter.paragraphs.join('\n\n');
            const pronounStory = { id: 'pronoun-check', projectId: 'pronoun-check',
              scenes: [{ number: chapterNumber, title: chapter.title, text: chapterText }] };
            const pronounIssues = pronounValidator.validate(pronounStory, inputs.caseData as any).errors
              .filter((e) => e.type === 'pronoun_gender_mismatch')
              .map((e) => e.message);

            if (pronounIssues.length > 0) {
              const flaggedNames = pronounIssues
                .map((msg) => /^Character "([^"]+)" has incorrect pronouns/.exec(msg)?.[1] ?? null)
                .filter((n): n is string => n !== null);

              // Pass the FULL cast so lastSingleCharacter tracking is accurate for all
              // characters in the chapter.  The onlyNames option restricts actual repairs
              // to flagged characters — preventing the inheritance-corruption pattern where
              // a non-flagged male character's follow-up sentences are wrongly attributed
              // to a flagged female character and have their pronouns flipped.
              const onlyNames = new Set<string>(flaggedNames);
              const repaired = flaggedNames.length > 0
                ? repairPronouns(chapterText, inputs.cast.characters, { onlyNames })
                : { repairCount: 0, text: chapterText };

              if (repaired.repairCount > 0) {
                chapter = { ...chapter, paragraphs: repaired.text.split('\n\n') };
                proseBatch.chapters[i] = chapter;
                const residualStory = { ...pronounStory,
                  scenes: [{ ...pronounStory.scenes[0], text: repaired.text }] };
                chapterErrors.push(
                  ...pronounValidator.validate(residualStory, inputs.caseData as any).errors
                    .filter((e) => e.type === 'pronoun_gender_mismatch')
                    .map((e) => e.message)
                );
              } else {
                chapterErrors.push(...pronounIssues);
              }
            }
          }

          // Do NOT piggyback preferred-word-count misses onto hard errors.
          // When hard errors (e.g. a missing clue) dominate, appending a preferred miss adds
          // noise that pulls the model toward word-count expansion at the expense of the real fix.
          // Preferred misses contribute to provisional scoring but are not surfaced as retry errors.

          provisionalBatchScores.push(
            buildProvisionalChapterScore(
              chapter,
              chapterNumber,
              ledgerEntry,
              evaluation.contentValidation.issues,
              inputs.clueDistribution,
            ),
          );

          if (chapterErrors.length > 0) {
            batchErrors.push(...chapterErrors);
            chapterValidationHistory.push({ chapterNumber, attempt, errors: chapterErrors });
          }
        }

        // Online anti-template linter gate before committing this batch.
        proseLinterStats.checksRun += 1;
        const linterIssues = lintBatchProse(
          proseBatch.chapters,
          chapters,
          [],
          inputs.templateLinterProfile,
        );
        if (linterIssues.length > 0) {
          proseLinterStats.failedChecks += 1;
          if (linterIssues.some((issue) => issue.type === "opening_style_entropy")) {
            proseLinterStats.openingStyleEntropyFailures += 1;
          }
          if (linterIssues.some((issue) => issue.type === "paragraph_fingerprint")) {
            proseLinterStats.paragraphFingerprintFailures += 1;
          }
          if (linterIssues.some((issue) => issue.type === "ngram_overlap")) {
            proseLinterStats.ngramOverlapFailures += 1;
          }
          batchErrors.push(...linterIssues.map((issue) => issue.message));
        }

        const isEntropyOnlyFailure =
          batchErrors.length > 0 &&
          linterIssues.length > 0 &&
          linterIssues.every((issue) => issue.type === "opening_style_entropy") &&
          batchErrors.every((error) => error.startsWith("Template linter: opening-style entropy too low"));

        if (isEntropyOnlyFailure && attempt >= maxBatchAttempts) {
          proseLinterStats.openingStyleEntropyBypasses += 1;
          console.warn(
            `[Agent 9] Batch ch${batchLabel} exhausted entropy retries; accepting batch with entropy warning to avoid false hard-stop.`,
          );
          progressCallback(
            'prose',
            `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} accepted with residual entropy warning after ${maxBatchAttempts} attempts`,
            overallProgress,
          );
          batchErrors = [];
        }

        if (batchErrors.length > 0) {
          retriedBatches.add(Math.floor(batchStart / batchSize));
          lastBatchErrors = batchErrors;

          // F: Failure diagnostics — log raw vs extracted content metrics to diagnose
          // truncation, parse failures, and word count regressions across retry attempts.
          const rawResponseLength = response.content.length;
          const extractedChapterWordCounts = proseBatch.chapters.map((ch) =>
            countWords((ch.paragraphs ?? []).join(' '))
          );
          const totalExtractedWords = extractedChapterWordCounts.reduce((a, b) => a + b, 0);
          const rawTail = response.content.slice(-300);
          const appearsTruncated = !response.content.trimEnd().endsWith('}');
          console.warn(
            `[Agent 9] DIAGNOSTICS ch${batchLabel} attempt ${attempt}/${maxBatchAttempts}:\n` +
            `  raw response chars: ${rawResponseLength}\n` +
            `  extracted chapter word counts: [${extractedChapterWordCounts.join(', ')}] (total: ${totalExtractedWords})\n` +
            `  appears truncated: ${appearsTruncated}\n` +
            `  raw tail (last 300 chars): ${rawTail}`
          );

          console.warn(
            `[Agent 9] Batch ch${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}):\n` +
            batchErrors.map(e => `  - ${e}`).join('\n')
          );
          progressCallback(
            'prose',
            `❌ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}): ${batchErrors.length} issue(s)`,
            overallProgress
          );

          if (attempt >= maxBatchAttempts) {
            const errorSummary = batchErrors.slice(0, 5).join('; ');
            const abortErr = new Error(
              `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation after ${maxBatchAttempts} attempts. Issues: ${errorSummary}` +
              `${batchErrors.length > 5 ? ` (and ${batchErrors.length - 5} more)` : ''}`
            );
            (abortErr as any).retriedBatches = retriedBatches.size;
            // Tag the abort specifically when prompt leakage is the reason, so the
            // orchestrator abort log clearly identifies this distinct failure mode.
            const hasPromptLeakage = batchErrors.some(
              (e) => e.toLowerCase().includes('prompt leakage') || e.toLowerCase().includes('instruction-shaped')
            );
            if (hasPromptLeakage) {
              console.error(
                `[Agent 9] PROMPT-LEAKAGE ABORT: Ch${batchLabel} attempt ${attempt}/${maxBatchAttempts} — ` +
                `instruction-shaped prose detected at retry exhaustion. Aborting to prevent leakage from persisting in output.`
              );
              (abortErr as any).promptLeakagePersisted = true;
            }
            throw abortErr;
          }
          continue;
        }

        provisionalChapterScores.push(...provisionalBatchScores);

        // All chapters in this batch passed validation — commit them
        for (let i = 0; i < proseBatch.chapters.length; i++) {
          const chapter = proseBatch.chapters[i];
          const chapterNumber = chapterStart + i;
          chapters.push(chapter);
          // Extract summary immediately so the next batch's prompt has full continuity
          const summary = extractChapterSummary(chapter, chapterNumber, castNames);
          chapterSummaries.push(summary);
        }
        if (liveNarrativeState) {
          const lastProseChapter = proseBatch.chapters[proseBatch.chapters.length - 1];
          liveNarrativeState = updateNSD(liveNarrativeState, { paragraphs: lastProseChapter?.paragraphs });
        }

        // Feed chapter-level deficits forward so chapter N can correct chapter N+1.
        const feedbackFromBatch = provisionalChapterScores
          .filter((entry) => entry.chapter >= chapterStart && entry.chapter <= chapterEnd)
          .filter((entry) => entry.deficits.length > 0 || entry.score < 95)
          .map((entry) => ({
            fromChapter: entry.chapter,
            score: entry.score,
            deficits: entry.deficits,
            directives: entry.directives,
          }));
        if (feedbackFromBatch.length > 0) {
          rollingProvisionalFeedback = [...rollingProvisionalFeedback, ...feedbackFromBatch].slice(-4);
        }

        // Notify caller — pass validation issues from any failed attempts so the
        // orchestrator can surface them in the run history panel (§3.2).
        if (inputs.onBatchComplete) {
          await inputs.onBatchComplete(proseBatch.chapters, chapterStart, chapterEnd, lastBatchErrors);
        }

        batchSuccess = true;

        if (attempt > 1) {
          console.log(`[Agent 9] Batch ch${batchLabel} validated successfully on attempt ${attempt}`);
          progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validated (retry succeeded)`, overallProgress);
        } else {
          progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount} validated`, overallProgress);
        }

        break;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        lastBatchErrors = [errorMsg];
        // Clear the raw response: it may contain malformed JSON (parse failure) or wrong chapter
        // count output. Injecting broken content as an assistant turn on the next retry would
        // confuse the model. A clean rebuild is safer than asking it to edit invalid output.
        lastBatchRawResponse = null;

        if (attempt >= maxBatchAttempts) {
          const abortErr = new Error(
            `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} generation failed after ${maxBatchAttempts} attempts: ${errorMsg}`
          );
          (abortErr as any).retriedBatches = retriedBatches.size;
          throw abortErr;
        }
      }
    }

    if (!batchSuccess) {
      throw new Error(`Failed to generate chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} after all attempts`);
    }
  }

  const recurringPhrases = detectRecurringPhrases(chapters);
  if (recurringPhrases.length > 0) {
    try {
      const repairedChapters = await runAtmosphereRepairIfNeeded(
        client,
        chapters,
        recurringPhrases,
        inputs.model,
        inputs.runId,
        inputs.projectId,
      );
      if (repairedChapters.length === chapters.length) {
        chapters.splice(0, chapters.length, ...repairedChapters);
      }
    } catch {
      // Repetition repair is best-effort only. Keep the original chapters if repair fails.
    }
  }

  validateChapterCount(chapters, sceneCount);

  const durationMs = Date.now() - start;
  const costTracker = client.getCostTracker();
  // Aggregate cost across all per-chapter agent keys (Agent9-ProseGenerator-Ch1, -Ch2, ...)
  const allAgentCosts = costTracker.getSummary().byAgent;
  const cost = Object.entries(allAgentCosts)
    .filter(([key]) => key.startsWith("Agent9-ProseGenerator"))
    .reduce((sum, [, val]) => sum + val, 0);

  // FIX-C2: use the eagerly-maintained retriedBatches set (matches the value attached to
  // any abort error, so aborted and completed runs both report accurate counts).
  const batchesWithRetries = retriedBatches.size;
  const totalBatches = Math.ceil(sceneCount / batchSize);
  const note = chapterValidationHistory.length > 0
    ? `Generated in scene batches. ${batchesWithRetries} batch(es) required retry for validation.`
    : "Generated in scene batches.";
  const underflow: UnderflowTelemetry = {
    hardFloorMisses: hardFloorMissCount,
    preferredTargetMisses: preferredTargetMissCount,
    hardFloorMissChapters: Array.from(hardFloorMissChapters).sort((a, b) => a - b),
    preferredTargetMissChapters: Array.from(preferredTargetMissChapters).sort((a, b) => a - b),
    expansionAttempts: underflowExpansionAttempts,
    expansionRecovered: underflowExpansionRecovered,
    expansionFailed: underflowExpansionFailed,
  };

  return {
    status: "draft",
    tone: inputs.narrativeStyle,
    chapters,
    cast: inputs.cast.characters.map((c) => c.name),
    note,
    cost,
    durationMs,
    prompt_fingerprints: promptFingerprints.length > 0 ? promptFingerprints : undefined,
    validationDetails: chapterValidationHistory.length > 0 ? {
      totalBatches,
      batchesWithRetries,
      failureHistory: chapterValidationHistory.map(h => ({
        batchIndex: h.chapterNumber - 1,
        chapterRange: `${h.chapterNumber}`,
        attempt: h.attempt,
        errors: h.errors,
      })),
      linter: proseLinterStats,
      underflow,
      provisionalChapterScores,
    } : proseLinterStats.checksRun > 0 ? {
      totalBatches,
      batchesWithRetries,
      failureHistory: [],
      linter: proseLinterStats,
      underflow,
      provisionalChapterScores,
    } : undefined,
  };
}

