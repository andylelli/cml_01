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
  STORY_LENGTH_TARGETS,
  anonymizeUnknownTitledNames,
  getGenerationParams,
} from "@cml/story-validation";
import type { NarrativeState } from "./types/narrative-state.js";
import { classifyOpeningStyle } from "./types/narrative-state.js";
import { updateNSD } from "./types/narrative-state.js";

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
  "about", "after", "again", "against", "between", "could", "every", "first", "found", "from",
  "having", "however", "later", "might", "other", "their", "there", "these", "those", "through",
  "under", "where", "which", "while", "would", "without", "afterward", "during",
]);

const tokenizeForClueObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));

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

const chapterMentionsRequiredClue = (
  chapterText: string,
  clueId: string,
  clueDistribution?: ClueDistributionResult,
): boolean => {
  const lowered = chapterText.toLowerCase();
  if (lowered.includes(clueId.toLowerCase())) {
    return true;
  }

  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || "") === clueId);
  if (!clue) return false;

  const tokens = Array.from(new Set([
    ...tokenizeForClueObligation(String(clue.description ?? "")),
    ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
  ])).slice(0, 10);

  if (tokens.length === 0) return false;
  const matched = tokens.filter((t) => tokenMatchesText(t, lowered));
  const requiredMatches = Math.max(2, Math.ceil(tokens.length * 0.4));
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
): boolean => {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return false;
  const quarterEnd = Math.max(1, Math.ceil(paragraphs.length * 0.25));
  const earlyText = paragraphs.slice(0, quarterEnd).join(' ').toLowerCase();

  if (earlyText.includes(clueId.toLowerCase())) return true;

  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || '') === clueId);
  if (!clue) return false;

  const tokens = Array.from(new Set([
    ...tokenizeForClueObligation(String(clue.description ?? '')),
    ...tokenizeForClueObligation(String(clue.pointsTo ?? '')),
  ])).slice(0, 10);

  if (tokens.length === 0) return false;
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
    let isPresent = chapterMentionsRequiredClue(chapterText, clueId, clueDistribution);
    if (!isPresent && !clue && ctx?.description) {
      const tokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
      if (tokens.length > 0) {
        const lowered = chapterText.toLowerCase();
        const matched = tokens.filter((t) => tokenMatchesText(t, lowered));
        // Short delivery_methods (≤4 tokens) use threshold 1 — the content word alone is sufficient.
        const threshold = tokens.length <= 4 ? 1 : Math.max(2, Math.ceil(tokens.length * 0.4));
        isPresent = matched.length >= threshold;
      }
    }

    if (!isPresent) {
      // Clue content is entirely absent — tell the writer what needs to happen narratively
      const repair = resolvedPlacement === 'early'
        ? `Include an on-page observation of ${clueDesc} in the first quarter of the chapter, followed immediately by an explicit inference paragraph.`
        : `Include an on-page observation or reference to ${clueDesc} before the chapter ends.`;
      hardFailures.push(
        `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is absent. ${repair}`
      );
    } else if (resolvedPlacement === 'early') {
      // Content is present but must also appear in the first 25% of paragraphs
      let isEarly = chapterClueAppearsEarly(chapter.paragraphs ?? [], clueId, clueDistribution);
      if (!isEarly && !clue && ctx?.description) {
        const quarterEnd = Math.max(1, Math.ceil((chapter.paragraphs ?? []).length * 0.25));
        const earlyText = (chapter.paragraphs ?? []).slice(0, quarterEnd).join(' ').toLowerCase();
        const tokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
        if (tokens.length > 0) {
          const matched = tokens.filter((t) => tokenMatchesText(t, earlyText));
          // Short delivery_methods (≤4 tokens) use threshold 1 — the content word alone is sufficient.
          const threshold = tokens.length <= 4 ? 1 : Math.max(2, Math.ceil(tokens.length * 0.4));
          isEarly = matched.length >= threshold;
        }
      }
      if (!isEarly) {
        hardFailures.push(
          `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark.`
        );
      }
    }
  }

  return { hardFailures, preferredMisses, wordTarget };
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

const conflictingSeasonPatterns: Record<CanonicalSeason, RegExp[]> = {
  spring: [/\b(summer|midsummer|autumn|winter|wintry)\b/gi],
  summer: [/\b(spring|vernal|autumn|winter|wintry)\b/gi],
  autumn: [/\b(spring|vernal|summer|midsummer|winter|wintry)\b/gi],
  winter: [/\b(spring|vernal|summer|midsummer|autumn)\b/gi],
};

const enforceMonthSeasonLockOnChapter = (
  chapter: ProseChapter,
  lock: { month: string; season: CanonicalSeason } | undefined,
): ProseChapter => {
  if (!lock) return chapter;
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0) return chapter;

  const monthPattern = new RegExp(`\\b${escapeRegExp(lock.month)}\\b`, 'i');
  const chapterText = chapter.paragraphs.join(' ');
  if (!monthPattern.test(chapterText)) {
    return chapter;
  }

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
  const castNames = cast.characters.map((c) => c.name).join(", ");

  // Resolve victim's full name from cast by roleArchetype (camelCase) or role_archetype (snake_case)
  const victimCharacter = cast.characters.find(
    (c: any) => {
      const archetype: string = c.roleArchetype ?? (c as any).role_archetype ?? '';
      return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    }
  );
  const victimName = (victimCharacter as any)?.name ?? '';
  const victimLine = victimName ? `\nVictim: ${victimName}` : '';

  return `# Case Overview\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCrime: ${crimeClass.category ?? "murder"} (${crimeClass.subtype ?? "unknown"})\nCulprit: ${culprit}${victimLine}\nFalse assumption: ${falseAssumption}\nCast: ${castNames}\n\nSetting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type.`;
};

/**
 * Returns the victim character's full name from the cast, or '' if not found.
 * Used to enforce named-victim guardrails in prose prompts.
 */
export const resolveVictimName = (cast: CastDesign): string => {
  const victimChar = cast.characters.find(
    (c: any) => {
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
    if (dts.test_type) output += `Test type: ${dts.test_type}\n`;
    output += `Outcome: ${dts.outcome || 'N/A'}\n\n`;
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
    lines.push(`  - Location anchor: ${locationAnchor || 'use the canonical scene location immediately in the opening paragraph'}.`);

    if (requiredClueIds.length > 0) {
      lines.push(`  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):`);
      for (const clueId of requiredClueIds) {
        const clue = clueMap.get(clueId);
        if (clue) {
          const earlyFlag = clue.placement === 'early'
            ? ' ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter'
            : '';
          lines.push(`    • ${clue.description.trim()} [${clueId}]${earlyFlag}`);
          lines.push(`      Points to: ${clue.pointsTo.trim()}`);
          if (clue.placement === 'early') {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear before the 25% mark):`);
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
            ? ' ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter'
            : '';
          lines.push(`    • ${fallbackDesc} [${clueId}]${earlyFlagFallback}`);
          lines.push(`      Points to: what this observation reveals about the time or circumstances of the crime.`);
          if (isEarlyMapping) {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear before the 25% mark):`);
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

  if (state.usedOpeningStyles.length > 0) {
    lines.push(`\nDO NOT OPEN THIS CHAPTER WITH: ${state.usedOpeningStyles.slice(-5).join(', ')} (already used in prior chapters)`);
  }

  if (state.usedSensoryPhrases.length > 0) {
    lines.push(`\nDO NOT REUSE THESE SENSORY PHRASES (already used): ${state.usedSensoryPhrases.slice(-10).join('; ')}`);
  }

  if (state.cluesRevealedToReader.length > 0) {
    lines.push(`\nCLUES ALREADY REVEALED TO READER: ${state.cluesRevealedToReader.join(', ')} — do not reveal these as new information.`);
  }

  lines.push('═══════════════════════════════════════════════════════');
  return lines.join('\n');
}

type PromptBlockPriority = "critical" | "high" | "medium" | "optional";

interface PromptContextBlock {
  key: string;
  content: string;
  priority: PromptBlockPriority;
}

interface PromptSectionInputs {
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
  lines.push('\n\nPROVISIONAL CHAPTER SCORE FEEDBACK (APPLY TO NEXT CHAPTERS):');
  lines.push('Treat the following deficits as hard corrective targets for this batch.');
  for (const item of effectiveFeedback) {
    lines.push(`- From Chapter ${item.fromChapter}: score ${item.score}/100`);
    if (item.deficits.length > 0) {
      lines.push(`  Deficits: ${item.deficits.join('; ')}`);
    }
    if (item.directives.length > 0) {
      lines.push(`  Required corrections: ${item.directives.join(' | ')}`);
    }
  }
  lines.push('Do not repeat the same deficits in the next chapter.');
  return lines.join('\n');
}

const buildPromptContextBlocks = (sections: PromptSectionInputs): PromptContextBlock[] => {
  const orderedSections: Array<{ key: string; priority: PromptBlockPriority; content: string }> = [
    { key: 'character_consistency', content: `\n\n${sections.characterConsistencyRules}`, priority: 'critical' },
    { key: 'character_personality', content: sections.characterPersonalityContext, priority: 'high' },
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
    character_personality: 900,
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
The ONLY characters who exist in this story are: ${cast.map((c: any) => c.name).join(', ')}.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: ${cast.map((c: any) => c.name).join(', ')}?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.

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

  const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.\n   COMPLETE CAST (no other named characters exist): ${cast.map((c: any) => c.name).join(', ')}\n   - "Mr. Jennings entered the room" \u2192 ILLEGAL. Jennings is not in the cast.\n   - "Constable Reed took notes" \u2192 ILLEGAL. Reed is not in the cast.\n   - "A constable took notes" \u2192 LEGAL (no name given).\n\n2. Gender pronouns must match character definition:\n${cast.map((c: any) => {
    const gender = c.gender?.toLowerCase();
    const pronouns = gender === 'male' ? 'he/him/his' : gender === 'female' ? 'she/her/her' : 'they/them/their';
    return `   - ${c.name}: ${pronouns}`;
  }).join('\n')}\n   - Never switch pronouns mid-story\n\n3. Character roles are fixed:\n${cast.map((c: any) => `   - ${c.name}: ${c.role || 'character'}`).join('\n')}\n   - Never place characters in locations inconsistent with their role`;

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

      const voiceLine = speechMannerisms ? '\n  Voice & Mannerisms: ' + speechMannerisms : '';
      const conflictLine = internalConflict ? '\n  Internal Conflict: ' + internalConflict : '';
      const stakeLine = personalStake ? '\n  Personal Stake in Case: ' + personalStake : '';

      return name + ':\n  Public: ' + persona + '\n  Hidden: ' + secret + '\n  Stakes: ' + stakes + humourGuidance + voiceLine + conflictLine + stakeLine;
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
    const sensoryGuidance = '\n\n⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not copy or paraphrase any template text.\n\nSENSORY WRITING TECHNIQUES:\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\n- Period authenticity: Use period-specific sensory details from location/temporal profiles\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature';
    
    locationProfilesContext = '\\n\\nLOCATION PROFILES:\\n\\nYou have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.\\n\\n' + locationLine + '\\n\\nKey Locations Available:\\n' + keyLocs + '\\n\\nAtmosphere: ' + mood + '\\nWeather: ' + weather + '\\n\\nUSAGE GUIDELINES:\\n1. First mention of location: Use full sensory description from profiles\\n2. Geographic grounding: Reference the specific place (' + (geographicContext || 'setting') + ') naturally in dialogue or narrative\\n3. Action scenes: Integrate physical layout details (access, sightlines, constraints)\\n4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette\\n5. Era details: Weave in period markers naturally\\n6. Consistency: Keep all location descriptions aligned with profiles\\n7. Each chapter opening must anchor to a named location from this list\\n8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening\\n9. Do NOT use generic repeated manor/storm filler without profile-specific details\\n\\nSENSORY PALETTE (use 2-3 senses per scene):\\n' + sensoryExamples + sensoryGuidance;

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
    lockedFactsBlock = `\n\nNON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES:\nThe following physical evidence values are ground truth. If this chapter mentions or describes the relevant evidence, it MUST use the exact phrase shown — verbatim, not paraphrased. Any chapter that contradicts these values or substitutes different numbers, times, distances, or quantities will fail validation:\n${factLines}\n- If a locked fact is not relevant to this chapter, skip it. But if you do mention it, you must use exactly the phrase above.`;
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

  const provisionalScoringFeedbackBlock = formatProvisionalScoringFeedbackBlock(
    inputs.provisionalScoringFeedback,
  );

  const chapterWordGuidance: Record<string, string> = {
    short: `5-7 substantial paragraphs (each 120–180 words) — MINIMUM ${getChapterWordTargets("short").hardFloorWords} words; TARGET ≥ ${getChapterWordTargets("short").preferredWords} words — do not stop early`,
    medium: `7-10 substantial paragraphs (each 150–220 words) — MINIMUM ${getChapterWordTargets("medium").hardFloorWords} words; TARGET ≥ ${getChapterWordTargets("medium").preferredWords} words — do not stop early`,
    long: `10-14 substantial paragraphs (each 180–250 words) — MINIMUM ${getChapterWordTargets("long").hardFloorWords} words; TARGET ≥ ${getChapterWordTargets("long").preferredWords} words — do not stop early`,
  };
  const chapterGuidance = chapterWordGuidance[targetLength] ?? chapterWordGuidance.medium;

  const chapterWordTargets = getChapterWordTargets(targetLength);
  const chapterTargetWords = chapterWordTargets.preferredWords + 200;
  const temporalLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const wordCountContract = [
    'WORD COUNT CONTRACT (NON-NEGOTIABLE):',
    `- Target: AT LEAST ${chapterTargetWords} words per chapter. Do not stop before reaching this threshold.`,
    `- Hard minimum: ${chapterWordTargets.hardFloorWords} words — this is a floor, not a target. The floor alone is not enough.`,
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
  );
  const timelineStateBlock = buildTimelineStateBlock(
    temporalLock,
    inputs.lockedFacts,
    cmlCase,
  );

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has ${chapterGuidance}.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Begin key scenes with atmospheric description\n   - Establish time of day, weather, lighting\n   - Describe location using sensory details (sight, sound, smell, touch)\n   - Set mood and atmosphere before action begins\n   - Use location and temporal context to ground reader\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

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

  const developerWithContracts = `${developerWithAudit}\n\n${wordCountContract}`;

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
    const tokens = Array.from(new Set(tokenizeForClueObligation(ctx.description))).slice(0, 10);
    if (tokens.length === 0) return false;
    const lowered = chapterText.toLowerCase();
    const threshold = tokens.length <= 4 ? 1 : Math.max(2, Math.ceil(tokens.length * 0.4));
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
 * Build an explicit chapter-by-chapter scene grounding checklist using
 * outline scene settings and location profile names.
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

  const checklistLines: string[] = [];
  scenes.forEach((scene: any, idx) => {
    const chapterNumber = chapterStart + idx;
    const sceneLocation = String(scene?.setting?.location || scene?.location || '').trim();
    const locationHint = sceneLocation.length > 0
      ? sceneLocation
      : (locationNames.size > 0 ? Array.from(locationNames)[0] : 'the canonical primary location');

    checklistLines.push(
      `- Chapter ${chapterNumber}: anchor opening in "${locationHint}"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.`
    );
  });

  const knownLocations = Array.from(locationNames).slice(0, 8).join(', ');
  const knownLocationLine = knownLocations.length > 0
    ? `Known location profile anchors: ${knownLocations}`
    : 'Known location profile anchors: use the primary location and scene setting terms from outline.';

  return `\n\nSCENE GROUNDING CHECKLIST (MUST FOLLOW):\n${knownLocationLine}\n${checklistLines.join('\n')}`;
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
  const clueRegistry = cmlCase.clue_registry || [];
  
  // Check that all evidence clues exist in clue registry
  const missingClues: string[] = [];
  evidenceClues.forEach((clue: any) => {
    const clueId = typeof clue === 'string' ? clue : clue.clue_id;
    const exists = clueRegistry.some((registryClue: any) => 
      registryClue.clue_id === clueId
    );
    if (!exists) {
      missingClues.push(clueId);
    }
  });
  
  if (missingClues.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test references clues that don't exist in clue_registry: ${missingClues.join(', ')}. Cannot generate checklist with invalid clue references.`;
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
  
  const testDesign = discriminatingTest.design;
  const testType = testDesign.test_type || 'unknown';
  const testDescription = testDesign.description || '';
  const evidenceClues = discriminatingTest.evidence_clues || [];
  const eliminated = discriminatingTest.eliminated_suspects || [];
  
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
 * Extract evidence clue locations from narrative outline
 * Returns map of clue_id to Act/Scene location for checklist injection
 */
function extractClueLocations(caseData: CaseData, outline: NarrativeOutline): Map<string, string> {
  const clueLocations = new Map<string, string>();
  const cmlCase = (caseData as any)?.CASE ?? {};
  const clueRegistry = cmlCase.clue_registry || [];
  
  // Build set of clue IDs we're looking for
  const clueIds = new Set<string>(clueRegistry.map((c: any) => String(c.clue_id || '')));
  
  // Search through outline acts and scenes
  outline.acts?.forEach((act: any) => {
    const actNum = act.act_number;
    act.scenes?.forEach((scene: any) => {
      const sceneNum = scene.scene_number;
      const sceneText = JSON.stringify(scene).toLowerCase();
      
      // Check each clue ID
      clueIds.forEach((clueId: string) => {
        if (clueId && sceneText.includes(clueId.toLowerCase())) {
          const location = `Act ${actNum}, Scene ${sceneNum}`;
          // Store first occurrence (could track multiple if needed)
          if (!clueLocations.has(clueId)) {
            clueLocations.set(clueId, location);
          }
        }
      });
    });
  });
  
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
  const locationType = cmlCase.meta?.setting?.location_type || '';
  
  // Categorize errors — clue errors must be separated FIRST to prevent them from
  // falling into qualityErrors (which matches anything containing "chapter").
  const clueValidationErrors = errors.filter(e => {
    const lc = e.toLowerCase();
    return lc.includes('clue evidence') || lc.includes('clue obligation') || lc.includes('clue visibility') || lc.includes('missing required clue');
  });
  const characterErrors = errors.filter(e => !clueValidationErrors.includes(e) && (e.toLowerCase().includes('character') || e.toLowerCase().includes('name')));
  const settingErrors = errors.filter(e => !clueValidationErrors.includes(e) && !characterErrors.includes(e) && (e.toLowerCase().includes('setting') || e.toLowerCase().includes('location')));
  const testErrors = errors.filter(e => !clueValidationErrors.includes(e) && e.toLowerCase().includes('discriminating test'));
  // Word-count errors contain "chapter" so they would otherwise match qualityErrors and receive
  // misleading "vary paragraph lengths" guidance. Extract them first; the MICRO-PROMPT [word_count]
  // directive in buildRetryMicroPromptDirectives already gives the correct repair instruction.
  const wordCountErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) &&
    /word count below/i.test(e)
  );
  const qualityErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) && !wordCountErrors.includes(e) &&
    (e.toLowerCase().includes('paragraph') || e.toLowerCase().includes('chapter'))
  );
  const otherErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
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

      if (attemptNum <= 2) {
        const clueScope = absentDescs.length > 0
          ? `chapters ${rangeLabel} are missing: ${absentDescs.join(', ')}.`
          : `chapters ${rangeLabel} are missing required clue evidence.`;
        directives.push(
          `REPAIR [clue_visibility — attempt 2]: ${clueScope}\n` +
          `  Near the beginning of the chapter:\n` +
          `  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.\n` +
          `  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.\n` +
          `  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.`
        );
      } else if (attemptNum === 3) {
        const clueScope = absentDescs.length > 0 ? absentDescs.join(', ') : 'the required clue evidence';
        directives.push(
          `REPAIR [clue_visibility — attempt 3 — PARAGRAPH STRUCTURE REQUIRED]: ${clueScope} still missing.\n` +
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

    const groundingErrors = loweredErrors.some((error) =>
      error.includes("scene location anchoring") || error.includes("grounding") || error.includes("setting fidelity")
    );
    if (groundingErrors) {
      directives.push(
        `MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats.`
      );
    }

    const entropyError = rawErrors.find((e) => /opening-style entropy too low/i.test(e));
    if (entropyError) {
      directives.push(
        `REPAIR [opening_style]: This chapter opens with the same sentence pattern as prior chapters (entropy too low).\n` +
        `  You MUST begin the FIRST SENTENCE of this chapter with a structurally different type. Choose ONE of:\n` +
        `  • Spoken dialogue — open with a character speaking: \'"..." said/asked [Name].\'\n` +
        `  • Time anchor — open with a specific time and location: \'At half past nine in the [room]...\'\n` +
        `  • Character in motion — a named character acts first: \'[Name] crossed/entered/turned/examined...\'\n` +
        `  • Noun-phrase atmosphere with a genitive: \'The [noun] of the [place]...\'\n` +
        `  Do NOT open with a standalone descriptive sentence about general setting atmosphere (e.g., \'The [adj] air...\'  or \'The room was...\'). The very first sentence must belong to one of the four types above.`
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
  
  const isFinalAttempt = attempt >= maxAttempts;
  if (isFinalAttempt) {
    feedback += `Write completely fresh chapters for ${chapterRange} that satisfy every constraint listed above. Do not reuse prior wording.\n`;
  } else {
    feedback += `Return corrected JSON for chapters ${chapterRange}. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.\n`;
  }
  
  return feedback;
};

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

  const system = [
    "You are a surgical prose revision assistant for mystery fiction.",
    "Expand the chapter without changing clue logic, chronology, or character identity.",
    "Do not remove evidence already present. Do not add new named characters.",
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
    const response = await client.chat({
      messages: [
        {
          role: 'system',
          content: [
            'You are a surgical prose revision assistant for mystery fiction.',
            'Replace repeated atmospheric phrasing with fresh, scene-specific language.',
            'Do not change plot events, clue evidence, chronology, or who says what.',
            'Output JSON only.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Chapter ${target.index + 1} contains repeated atmospheric phrasing used elsewhere in the story.`,
            `Banned phrases already overused: ${bannedPhrases.map((phrase) => `"${phrase}"`).join(', ')}.`,
            'Replace those repeated phrases with fresh alternatives tied to this chapter\'s location and action.',
            'Do not alter clue logic, factual content, or chapter structure.',
            'Return this schema:',
            '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
            'Only return the JSON payload.',
            'Current chapter text:',
            (target.chapter.paragraphs ?? []).join('\n\n'),
          ].join('\n\n'),
        },
      ],
      model,
      temperature: 0.55,
      maxTokens: getGenerationParams().agent9_prose.underflow_expansion.max_tokens,
      jsonMode: true,
      logContext: {
        runId: runId ?? '',
        projectId: projectId ?? '',
        agent: `Agent9-AtmosphereRepair-Ch${target.index + 1}`,
      },
    });

    repaired[target.index] = parseExpandedChapterResponse(response.content);
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
  const temporalSeasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const progressCallback = inputs.onProgress || (() => {});
  const castNames = inputs.cast.characters.map(c => c.name);
  const proseModelConfig = getGenerationParams().agent9_prose.prose_model;
  const batchSize = Math.max(1, Math.min(inputs.batchSize || 1, proseModelConfig.max_batch_size));
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

  // Deep-copy the caller's NarrativeState so mutations during generation (updateNSD calls)
  // do not bleed back into the orchestrator's copy.  Array/object fields need explicit
  // spreading because the outer spread {...inputs.narrativeState} is only one level deep.
  let liveNarrativeState: NarrativeState | undefined = inputs.narrativeState
    ? {
        ...inputs.narrativeState,
        lockedFacts: [...inputs.narrativeState.lockedFacts],
        characterPronouns: { ...inputs.narrativeState.characterPronouns },
        usedOpeningStyles: [...inputs.narrativeState.usedOpeningStyles],
        usedSensoryPhrases: [...inputs.narrativeState.usedSensoryPhrases],
        cluesRevealedToReader: [...inputs.narrativeState.cluesRevealedToReader],
        chapterSummaries: [...inputs.narrativeState.chapterSummaries],
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
          proseBatch.chapters[i] = chapter;
          const chapterNumber = chapterStart + i;
          const ledgerEntry = chapterRequirementLedger[i];

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
              ? validateChapterPreCommitObligations(candidate, ledgerEntry, inputs.clueDistribution)
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
              );
              chapter = enforceMonthSeasonLockOnChapter(
                sanitizeGeneratedChapter(expanded, castNames),
                temporalSeasonLock,
              );
              proseBatch.chapters[i] = chapter;
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
          liveNarrativeState?.usedOpeningStyles ?? [],
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
            throw new Error(
              `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation after ${maxBatchAttempts} attempts. Issues: ${errorSummary}` +
              `${batchErrors.length > 5 ? ` (and ${batchErrors.length - 5} more)` : ''}`
            );
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
          liveNarrativeState = updateNSD(liveNarrativeState, proseBatch.chapters, chapterStart);
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
          throw new Error(
            `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} generation failed after ${maxBatchAttempts} attempts: ${errorMsg}`
          );
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

  const batchesWithRetries = new Set(
    chapterValidationHistory.map((h) => Math.floor((h.chapterNumber - 1) / batchSize)),
  ).size;
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

