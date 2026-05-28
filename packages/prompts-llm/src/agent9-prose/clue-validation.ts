/**
 * agent9-prose/clue-validation.ts
 * Clue token matching, chapter obligation validation, batch-gate tracking,
 * word-count targets, and resolution checks.
 */
import { getGenerationParams, getStoryLengthTarget } from "@cml/story-validation";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import type { BatchGateName, BatchCommitRecord } from "../contracts/batch-commit-record.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  ChapterWordTargetResult,
  ChapterObligationResult,
  ClueObligationContext,
} from "./types.js";
export const countWords = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
};

export const getChapterWordTargets = (targetLength: "short" | "medium" | "long") => {
  const target = getStoryLengthTarget(targetLength);
  // Hard floor comes from resolved story-length policy: floor(min_words / chapter_count).
  // Preferred words are the chapter ideal words for the selected length.
  return {
    hardFloorWords: target.chapterMinWords,
    preferredWords: target.chapterIdealWords,
  };
};

export const getWordTargetMultiplier = (): number => {
  const raw = getGenerationParams().agent9_prose?.story_length_policy?.word_target_multiplier;
  if (typeof raw !== "number" || Number.isNaN(raw)) return 1;
  return Math.max(0.5, Math.min(3, raw));
};

export const getPromptPreferredWords = (targetLength: "short" | "medium" | "long"): number => {
  const { preferredWords } = getChapterWordTargets(targetLength);
  return Math.max(1, Math.round(preferredWords * getWordTargetMultiplier()));
};

export const getAgent9CostTotal = (client: AzureOpenAIClient): number => {
  const byAgent = client.getCostTracker().getSummary().byAgent;
  return Object.entries(byAgent)
    .filter(([key]) => key.startsWith("Agent9-ProseGenerator"))
    .reduce((sum, [, value]) => sum + Number(value ?? 0), 0);
};

export const ALL_BATCH_GATES: BatchGateName[] = [
  "encoding",
  "completeness_structure",
  "locked_fact_word_form",
  "character_pronoun_consistency",
  "clue_placement_timing",
  "temporal_continuity",
  "template_leakage",
];

export const initBatchGateFailureCounts = (): Record<BatchGateName, number> => ({
  encoding: 0,
  completeness_structure: 0,
  locked_fact_word_form: 0,
  character_pronoun_consistency: 0,
  clue_placement_timing: 0,
  temporal_continuity: 0,
  template_leakage: 0,
});

export const inferBatchGatesFromError = (error: string): BatchGateName[] => {
  const lowered = error.toLowerCase();
  const gates = new Set<BatchGateName>();

  if (
    /encoding|utf-8|control char|mojibake|json|parse|unexpected end|invalid prose output/.test(lowered)
  ) {
    gates.add("encoding");
  }
  if (
    /paragraph|chapter\.paragraphs|chapter\.title|word count|hard floor|minimum words|preferred target|structure/.test(lowered)
  ) {
    gates.add("completeness_structure");
  }
  if (/locked fact|word-form|verbatim|word-phrased/.test(lowered)) {
    gates.add("locked_fact_word_form");
  }
  if (/\bpronoun\b|\bgender\s+mismatch\b|\bname\s+mismatch\b|\bidentity\s+(?:drift|mismatch)\b|\bphantom\b|\brole\s+drift\b/.test(lowered)) {
    gates.add("character_pronoun_consistency");
  }
  if (/clue|discriminating test|fair-play|suspect elimination|evidence anchor|revealed/.test(lowered)) {
    gates.add("clue_placement_timing");
  }
  if (/\btimeline\s+test\b|\btemporal\s+continuity\b|\btime(?:line)?\s+constraint\b/.test(lowered)) {
    gates.add("temporal_continuity");
  }
  if (/template|opening-style entropy|ngram|fingerprint|prompt leakage|instruction-shaped/.test(lowered)) {
    gates.add("template_leakage");
  }

  if (gates.size === 0) {
    gates.add("completeness_structure");
  }
  return Array.from(gates);
};

export const noteBatchGateFailures = (
  errors: string[],
  counts: Record<BatchGateName, number>,
): void => {
  const failedGates = new Set<BatchGateName>();
  for (const error of errors) {
    for (const gate of inferBatchGatesFromError(error)) {
      failedGates.add(gate);
    }
  }
  for (const gate of failedGates) {
    counts[gate] += 1;
  }
};

export const buildBatchGateOutcomes = (
  counts: Record<BatchGateName, number>,
): BatchCommitRecord["gateOutcomes"] =>
  ALL_BATCH_GATES.map((gate) => ({
    gate,
    passed: counts[gate] === 0,
    failedAttempts: counts[gate],
  }));

export const CLUE_TOKEN_STOPWORDS = new Set<string>([
  // Common auxiliary and preposition words that provide no discriminating signal
  "about", "after", "again", "against", "also", "been", "between", "both", "could", "does", "done",
  "each", "even", "ever", "every", "first", "found", "from", "have", "having", "here", "however",
  "into", "just", "later", "make", "made", "might", "more", "most", "much", "only", "onto",
  "other", "over", "same", "some", "such", "than", "that", "them", "then", "their", "there",
  "these", "they", "this", "those", "through", "under", "upon", "very", "were", "when", "where",
  "which", "while", "will", "with", "would", "without", "afterward", "during",
]);

export const tokenizeForClueObligation = (value: string): string[] =>
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
export const filterNonCastProperNameTokens = (
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
export const CLUE_DELIVERY_METHOD_LABELS = new Set<string>([
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

export const isDeliveryMethodLabel = (description: string | null | undefined): boolean => {
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
export const tokenMatchesText = (token: string, loweredText: string): boolean => {
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
  // Only fires when root is still long enough to be a meaningful stem (≥5 chars)
  return token.length >= 6 && loweredText.includes(token.slice(0, -1));
};

export const getRequiredClueIdsForScene = (
  cmlCase: any,
  scene: any,
  allOutlineScenes?: any[],
): string[] => {
  const sceneAct = Number(scene?.act);
  // P1-1: CML clue_to_scene_mapping uses per-act scene numbers (e.g. 1,2,3 per act),
  // but the narrative outline's sceneNumber is global (e.g. 1-9 across all acts).
  // Convert global → per-act by subtracting the count of scenes in prior acts.
  const perActSceneNum = allOutlineScenes
    ? Number(scene?.sceneNumber) - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length
    : Number(scene?.sceneNumber);
  const mapped = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
    .filter((entry: any) =>
      Number(entry?.act_number) === sceneAct &&
      Number(entry?.scene_number) === perActSceneNum
    )
    .map((entry: any) => String(entry?.clue_id || ""))
    .filter(Boolean);

  const sceneClues = (Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed : [])
    .map((id: unknown) => String(id || ""))
    .filter(Boolean);

  return Array.from(new Set([...mapped, ...sceneClues]));
};

export const buildChapterRequirementLedger = (
  cmlCase: any,
  batchScenes: unknown[],
  chapterStart: number,
  targetLength: "short" | "medium" | "long",
  clueDistribution?: ClueDistributionResult,
  allOutlineScenes?: any[],
): ChapterRequirementLedgerEntry[] => {
  const { hardFloorWords, preferredWords } = getChapterWordTargets(targetLength);

  // Build lookup maps once to avoid O(n²) .find() inside the per-scene .map().
  const distClueMap = new Map<string, Clue>(
    (clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  const mappingEntryMap = new Map<string, any>();
  for (const entry of ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])) {
    const id = String(entry?.clue_id ?? '');
    if (id && !mappingEntryMap.has(id)) mappingEntryMap.set(id, entry);
  }

  return (batchScenes as any[]).map((scene, idx) => {
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene, allOutlineScenes);
    const clueObligationContext: ClueObligationContext[] = requiredClueIds.map((id) => {
      const distClue = distClueMap.get(id);
      const mappingEntry = mappingEntryMap.get(id);
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
export const BEHAVIOURAL_MARKERS = new Set([
  'behaviour', 'behavioral', 'emotion', 'emotional',
  'nervous', 'anxious', 'guilty', 'frightened', 'terrified', 'panicked',
  'suspicious', 'jealous', 'jealousy', 'angry', 'anger', 'grief',
  'distressed', 'evasive', 'agitated', 'uncomfortable', 'demeanour',
  'demeanor', 'motive', 'attitude', 'secretive', 'concealing', 'deceiving',
  'observed', 'exhibiting', 'signs',
]);

export const isBehaviouralClue = (description: string): boolean => {
  const lower = description.toLowerCase();
  for (const marker of BEHAVIOURAL_MARKERS) {
    if (lower.includes(marker)) return true;
  }
  return false;
};

export const buildClueSemanticAnchorFamilies = (
  description: string | undefined,
  pointsTo: string | undefined,
): string[][] => {
  const combined = `${description ?? ""} ${pointsTo ?? ""}`.toLowerCase();
  const families: string[][] = [];

  if (/clock|dial|chime|time|hour|minute|hall clock|watch/.test(combined)) {
    families.push(["clock", "dial", "chime", "hour", "minute", "time"]);
  }
  if (/sun|daylight|window|shadow|position|outside light/.test(combined)) {
    families.push(["sun", "daylight", "window", "shadow", "outside", "light", "position"]);
  }
  if (/tamper|wound|set back|reset|adjust|stopped|mechanism/.test(combined)) {
    families.push(["tamper", "wound", "reset", "adjust", "stopped", "mechanism"]);
  }
  if (/dust|powder|residue|fingerprint|smudge/.test(combined)) {
    families.push(["dust", "powder", "residue", "fingerprint", "smudge"]);
  }
  if (/witness|statement|testimony|heard|saw|alibi/.test(combined)) {
    families.push(["witness", "statement", "testimony", "heard", "saw", "alibi"]);
  }
  if (/poison|arsenic|toxin|dose|pharmaceutical|prescription/.test(combined)) {
    families.push(["poison", "arsenic", "toxin", "dose", "pharmaceutical", "prescription"]);
  }
  if (/financial|debt|ledger|inheritance|will|bankrupt/.test(combined)) {
    families.push(["financial", "debt", "ledger", "inheritance", "will", "bankrupt"]);
  }
  if (/document|letter|telegram|written|manuscript|envelope/.test(combined)) {
    families.push(["document", "letter", "telegram", "written", "manuscript", "envelope"]);
  }
  if (/emotional|behaviour|reaction|distress|outburst|demeanour/.test(combined)) {
    families.push(["emotional", "behaviour", "reaction", "distress", "outburst", "demeanour"]);
  }

  return families;
};

export const semanticAnchorFamiliesMatched = (
  text: string,
  families: string[][],
): number => {
  const lowered = text.toLowerCase();
  let matchedFamilies = 0;
  for (const family of families) {
    if (family.some((token) => tokenMatchesText(token, lowered))) {
      matchedFamilies += 1;
    }
  }
  return matchedFamilies;
};

export const chapterMentionsRequiredClue = (
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
  const factualThreshold = 0.55;
  const behaviouralThreshold = isBehaviouralClue(clue?.description ?? '') ? 0.35 : factualThreshold;
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * behaviouralThreshold));
  if (matched.length >= requiredMatches) {
    return true;
  }

  // Semantic anchor fallback: allows clues to pass when prose uses equivalent observational
  // language derived from upstream clue intent (description + pointsTo), not brittle phrase echoes.
  const semanticFamilies = buildClueSemanticAnchorFamilies(clue?.description, clue?.pointsTo);
  if (semanticFamilies.length > 0) {
    const requiredFamilies = Math.min(2, semanticFamilies.length);
    const familyHits = semanticAnchorFamiliesMatched(chapterText, semanticFamilies);
    if (familyHits >= requiredFamilies) {
      return true;
    }
  }

  return false;
};

/**
 * For early-placement clues: check whether the clue tokens appear in the first
 * 25% of the chapter paragraphs (paragraph-window, not character offset).
 * Uses the same token-matching logic as chapterMentionsRequiredClue.
 */
export const chapterClueAppearsEarly = (
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
  if (matched.length >= requiredMatches) {
    return true;
  }

  const semanticFamilies = buildClueSemanticAnchorFamilies(clue?.description, clue?.pointsTo);
  if (semanticFamilies.length > 0) {
    // Early check is observational: require at least one anchor family in the opening window.
    return semanticAnchorFamiliesMatched(earlyText, semanticFamilies) >= 1;
  }

  return false;
};

/**
 * Regex matching resolution-confirming phrases in the final chapter.
 * Exported so the orchestrator (agent9-run.ts) can use the same definition
 * and the two files cannot silently drift — fixes issue #3.2.
 */
export const RESOLUTION_RE = /\b(confess(?:ed|es)?|arrest(?:ed)?|taken\s+into\s+custody|I\s+(?:did|killed)|guilty|you\s+committed|you\s+killed|the\s+murderer\s+is|it\s+was\s+you|unmask(?:ed)?|expos(?:ed|es)|named\s+as|revealed\s+as|proved?\s+guilty|brought\s+to\s+justice|caught\s+red-handed|surrendered|condemned|the\s+killer\s+(?:was|proved?|is))\b/i;

/**
 * Shared resolution backstop sentence used by both the batch retry loop (agent9-prose.ts)
 * and the post-generation injection (agent9-run.ts).  Centralised here so the two sites
 * cannot drift — fixes issue #2.4.
 */
export const buildResolutionBackstopSentence = (culpritSurname: string): string =>
  `${culpritSurname} confessed at last, the evidence having made denial impossible. ` +
  `They were taken into custody before long. The case was closed.`;

export const validateChapterPreCommitObligations = (
  chapter: ProseChapter,
  ledgerEntry: ChapterRequirementLedgerEntry,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
  resolutionCheck?: { isLastChapter: boolean; culpritName: string; culpritSurname: string; murderMethod?: string },
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

  // Dedup by (clueId, errorType) — not by error string — so distinct clue IDs with the
  // same description are not conflated (fix #48).  Two clues that happen to share a
  // description both need to be placed, so both errors must survive to the retry directive.
  const seenClueFailKeys = new Set<string>();

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
          // Match threshold to clue type: 0.35 for behavioural/emotional, 0.55 for factual
          // P2-22: was 0.6 for factual — now aligned with chapterMentionsRequiredClue (factualThreshold=0.55).
          const isBehavioural = ctx?.description ? isBehaviouralClue(ctx.description) : false;
          const threshold = Math.max(1, Math.ceil(ctxTokens.length * (isBehavioural ? 0.35 : 0.55)));
          isPresent = matched.length >= threshold;
        }
      }
    }

    if (!isPresent) {
      const absentKey = `${clueId}:absent`;
      if (!seenClueFailKeys.has(absentKey)) {
        seenClueFailKeys.add(absentKey);
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
      }
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
            // P2-22: align CTX early-fallback threshold with chapterClueAppearsEarly (0.25),
            // was 0.4 — the early check is observational, not analytical.
            const threshold = ctxEarlyTokens.length <= 4 ? 1 : Math.max(1, Math.ceil(ctxEarlyTokens.length * 0.25));
            isEarly = matched.length >= threshold;
          }
        }
      }
      if (!isEarly) {
        const earlyKey = `${clueId}:early`;
        if (!seenClueFailKeys.has(earlyKey)) {
          seenClueFailKeys.add(earlyKey);
          const quarterEndForMsg = Math.max(1, Math.ceil((chapter.paragraphs ?? []).length * 0.25));
          hardFailures.push(
            `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is present but must appear in paragraphs 1-${quarterEndForMsg} — move the observation beat to paragraph 1 or 2.`
          );
        }
      }
    }
  }

  // No string-level Set dedup here: clue failures are now deduplicated by (clueId, errorType)
  // in the loop above (#48).  Resolution check appended directly.
  const uniqueHardFailures = [...hardFailures];

  // Phase 6 Layer 2: Final chapter resolution check
  if (resolutionCheck?.isLastChapter && resolutionCheck.culpritSurname) {
    const culpritRE = new RegExp(`\\b${resolutionCheck.culpritSurname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (!RESOLUTION_RE.test(chapterText) || !culpritRE.test(chapterText)) {
      uniqueHardFailures.push(
        `Final chapter: no resolution event detected. Include a scene where ${resolutionCheck.culpritName} ` +
        `confesses, is arrested, or the detective explicitly names them as the murderer with evidence.`
      );
    } else if (resolutionCheck.murderMethod) {
      // A3: Causal-bridge check — resolution must mention the murder method, not just name the culprit.
      // Tokenise the method string (e.g. "clock tampering" → ["clock", "tamper"]) and require
      // at least one token to appear in the final chapter so the confession is substantive.
      const methodTokens = resolutionCheck.murderMethod
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 3);
      const chapterLower = chapterText.toLowerCase();
      const methodPresent = methodTokens.some(t => chapterLower.includes(t));
      if (!methodPresent) {
        uniqueHardFailures.push(
          `Final chapter: resolution does not mention the murder method ("${resolutionCheck.murderMethod}"). ` +
          `The confession or accusation must explicitly reference how the murder was committed, not just name the culprit.`
        );
      }
    }
  }

  return { hardFailures: uniqueHardFailures, preferredMisses, wordTarget };
};

// ---------------------------------------------------------------------------
// G3: Inference-path chain check
// ---------------------------------------------------------------------------

/**
 * For each chapter in the batch, check that if a revealed clue is required
 * by a reader-observable inference step, the step's observation tokens are
 * present in the chapter text.  Returns preferred-miss messages (soft check).
 *
 * @param chapters     The prose chapters produced for this batch (in order).
 * @param batchScenes  The outline scenes for this batch — provides cluesRevealed per scene.
 * @param inferenceChain  From StoryContract.inferenceChain.
 * @param chapterStart  1-based index of the first chapter in this batch.
 */
export const validateBatchInferenceChain = (
  chapters: ProseChapter[],
  batchScenes: Array<{ cluesRevealed?: string[] }>,
  inferenceChain: Array<{ observation: string; required_evidence: string[]; reader_observable: boolean }>,
  chapterStart: number,
): string[] => {
  const preferredMisses: string[] = [];

  const observableSteps = inferenceChain.filter(s => s.reader_observable && s.observation.trim().length > 20);
  if (observableSteps.length === 0) return preferredMisses;

  for (let i = 0; i < chapters.length && i < batchScenes.length; i++) {
    const chapterNumber = chapterStart + i;
    const chapterText = (chapters[i].paragraphs ?? []).join(' ').toLowerCase();
    const revealedIds: string[] = (batchScenes[i].cluesRevealed ?? []).map(String);

    for (const step of observableSteps) {
      // Only check if this chapter reveals a clue that this step depends on
      const hasRequiredClue = step.required_evidence.some(id => revealedIds.includes(String(id)));
      if (!hasRequiredClue) continue;

      // Tokenise the observation — skip short/common tokens
      const obsTokens = step.observation
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 4);

      if (obsTokens.length === 0) continue;

      const matchCount = obsTokens.filter(t => chapterText.includes(t)).length;
      const matchRatio = matchCount / obsTokens.length;

      if (matchRatio < 0.25) {
        // At least 25% of observation tokens should appear — otherwise the context is missing
        const obsPreview = step.observation.slice(0, 80);
        preferredMisses.push(
          `Chapter ${chapterNumber}: inference step observation "${obsPreview}..." has low token coverage (${matchCount}/${obsTokens.length} tokens). ` +
          `Ensure the prose grounds the evidence in observable context so the reader can follow the reasoning chain.`
        );
      }
    }
  }

  return preferredMisses;
};

