import type { ClueDistributionResult } from "@cml/prompts-llm";
import { getGenerationParams } from "@cml/story-validation";
import type { ClueEvidenceAnchor, ClueEvidenceState, ClueEvidenceExtractionResult } from "./shared.js";

// ============================================================================
// Agent 9: Prose Generation
// ============================================================================

// Local alias matching the scorer's expected shape (agent9-prose-scorer.ts ChapterProse)
export interface ChapterProse {
  chapter_number: number;
  chapter_title: string;
  prose: string;
  clues_present?: string[];
  discriminating_test_present?: boolean;
}

export interface ProseOutput {
  chapters: ChapterProse[];
  /**
   * Union of all known clue IDs (clue_to_scene_mapping + ClueDistributionResult +
   * discriminating_test.evidence_clues + clue_registry) so the scorer can check
   * visibility against the same namespace used for detection.
   */
  expected_clue_ids?: string[];
  // Added so adaptProseForScoring can populate the fair-play consistency test (P-1 fix)
  fair_play_validation?: {
    all_clues_visible?: boolean;
    discriminating_test_complete?: boolean;
    no_solution_spoilers?: boolean;
    /** D7: true when no clue is first revealed in the same chapter where deduction/conclusion language appears. */
    fair_play_timing_compliant?: boolean;
    fair_play_timing_violations?: Array<{ clue_id: string; chapter: number }>;
  };
  completeness_diagnostics?: {
    expected_clue_ids_count?: number;
    visible_clue_ids_count?: number;
    clue_visibility_ratio?: number;
    missing_clue_ids?: string[];
  };
}

const DISCRIMINATING_REASONING_RE =
  /\b(test|experiment|reconstruct|re-enact|demonstrat|proved?|verification|timing|measured|compared|eliminat|ruled\s+out|constraint\s+proof|trap)\b/i;

const clueStateRank: Record<ClueEvidenceState, number> = {
  introduced: 0,
  hinted: 1,
  explicit: 2,
  confirmed: 3,
};

const mergeClueState = (current: ClueEvidenceState, candidate: ClueEvidenceState): ClueEvidenceState =>
  clueStateRank[candidate] > clueStateRank[current] ? candidate : current;

const getAdapterConfig = () => getGenerationParams().agent9_prose.scoring_adapter;

const isDiscriminatingTestChapter = (
  prose: string,
  discriminatingTokens: string[],
  cluesPresent: string[],
  discriminatingEvidenceIds: string[],
): boolean => {
  const discriminatingConfig = getAdapterConfig().discriminating;
  const regexSignal = DISCRIMINATING_PROSE_RE.test(prose);
  const lowerProse = prose.toLowerCase();
  const semanticSignal = discriminatingTokens.length > 0
    ? discriminatingTokens.filter((token) => lowerProse.includes(token)).length >= Math.max(
      discriminatingConfig.min_semantic_token_matches,
      Math.ceil(discriminatingTokens.length * discriminatingConfig.semantic_token_match_ratio),
    )
    : false;
  const evidenceSignal = discriminatingEvidenceIds.length > 0
    ? cluesPresent.some((id) => discriminatingEvidenceIds.includes(id)) && DISCRIMINATING_REASONING_RE.test(prose)
    : false;

  return regexSignal || semanticSignal || evidenceSignal;
};

type ClueSemanticSignature = {
  id: string;
  requiredTokens: string[];
};

const normalizeClueIdForMatch = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "");

const dedupeClueIdsByNormalized = (clueIds: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const raw of clueIds) {
    const clueId = String(raw ?? "").trim();
    if (!clueId) continue;
    const normalized = normalizeClueIdForMatch(clueId);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    deduped.push(clueId);
  }
  return deduped;
};

const buildClueIdMatchVariants = (clueId: string): string[] => {
  const base = clueId.toLowerCase().trim();
  if (!base) return [];
  const space = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const hyphen = space.replace(/\s+/g, "-");
  const underscore = space.replace(/\s+/g, "_");
  return Array.from(new Set([base, space, hyphen, underscore])).filter(Boolean);
};

const CLUE_TOKEN_STOPWORDS = new Set([
  "about", "after", "again", "before", "being", "between", "could", "every", "first",
  "found", "from", "have", "into", "itself", "might", "other", "over", "their", "there",
  "these", "those", "through", "under", "where", "which", "while", "would", "evidence",
  "clue", "scene", "reader", "toward", "towards", "because", "therefore", "study", "room",
  "house", "window", "door", "night", "suspect", "detective", "case", "mystery",
]);

const tokenizeForClueSignature = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));

const tokenizeSemanticTerms = (value: string): string[] => tokenizeForClueSignature(value);

const semanticRequiredTokenMatches = (tokenCount: number): number =>
  Math.max(
    getAdapterConfig().clue_semantic.min_token_matches,
    Math.ceil(tokenCount * getAdapterConfig().clue_semantic.token_match_ratio),
  );

const hasSemanticCoverage = (paragraph: string, signature: ClueSemanticSignature): boolean => {
  const lowered = paragraph.toLowerCase();
  const matchedTokens = signature.requiredTokens.filter((token) => lowered.includes(token));
  // 30% coverage with a 2-token minimum balances recall and precision for clue paraphrases.
  const requiredMatches = semanticRequiredTokenMatches(signature.requiredTokens.length);
  return matchedTokens.length >= requiredMatches;
};

const getKnownClueIds = (cmlCase?: any, clueDistribution?: ClueDistributionResult): string[] => {
  const rawMappingClueIds: string[] = ((cmlCase as any)?.prose_requirements?.clue_to_scene_mapping ?? [])
    .map((m: any) => String(m.clue_id || ""))
    .filter(Boolean);
  const discriminatingEvidenceIds: string[] = (((cmlCase as any)?.discriminating_test?.evidence_clues ?? []) as unknown[])
    .map((value) => String(value || ""))
    .filter(Boolean);
  const registryClueIds: string[] = (((cmlCase as any)?.clue_registry ?? []) as unknown[])
    .map((entry: any) => String(entry?.clue_id || entry?.id || ""))
    .filter(Boolean);
  const distributionClueIds: string[] = (clueDistribution?.clues ?? [])
    .map((c: any) => String(c?.id || ""))
    .filter(Boolean);

  // Only expose mapping IDs that agent5 generated real distribution entries for.
  // CML mapping entries such as "clue_early_1", "clue_mid_1", "clue_late_1" are
  // structural/placement IDs with no corresponding description in the clue
  // distribution.  The prose LLM never receives delivery instructions for them
  // (the NSD's validClueSet filters them), so they can never appear in the prose.
  // Including them in the expected set inflates the "missing clue" count and
  // permanently depresses the clue-visibility score.
  // When the distribution is non-empty, restrict mapping IDs to those that
  // normalise-match a distribution entry; fall back to all mapping IDs when there
  // is no distribution (e.g. tests or older pipeline paths).
  const distributionNormalizedSet = new Set(
    distributionClueIds.map(normalizeClueIdForMatch).filter(Boolean)
  );
  const mappingClueIds = distributionNormalizedSet.size > 0
    ? rawMappingClueIds.filter(id => distributionNormalizedSet.has(normalizeClueIdForMatch(id)))
    : rawMappingClueIds;

  return dedupeClueIdsByNormalized([
    ...mappingClueIds,
    ...distributionClueIds,
    ...discriminatingEvidenceIds,
    ...registryClueIds,
  ]);
};

const getDiscriminatingEvidenceClueIds = (cmlCase?: any): string[] => {
  const ids = (((cmlCase as any)?.discriminating_test?.evidence_clues ?? []) as unknown[])
    .map((value) => String(value || ""))
    .filter(Boolean);
  return Array.from(new Set(ids));
};

const buildDiscriminatingSemanticTokens = (cmlCase?: any): string[] => {
  const discriminatingConfig = getAdapterConfig().discriminating;
  const test = (cmlCase as any)?.discriminating_test ?? {};
  const tokenPool = [
    ...tokenizeSemanticTerms(String(test.design ?? "")),
    ...tokenizeSemanticTerms(String(test.knowledge_revealed ?? "")),
    ...tokenizeSemanticTerms(String(test.method ?? "")),
  ];
  return Array.from(new Set(tokenPool)).slice(0, discriminatingConfig.max_semantic_tokens);
};

const buildClueSignatures = (
  clueDistribution: ClueDistributionResult | undefined,
  knownClueIds: string[],
): ClueSemanticSignature[] => {
  const clueSemanticConfig = getAdapterConfig().clue_semantic;
  const signatureByNormalizedId = new Map<string, ClueSemanticSignature>();

  if (clueDistribution?.clues && Array.isArray(clueDistribution.clues)) {
    for (const clue of clueDistribution.clues) {
      const clueId = String((clue as any)?.id ?? "").trim();
      if (!clueId) continue;
      const normalizedId = normalizeClueIdForMatch(clueId);
      if (!normalizedId) continue;

      const tokenPool = [
        ...tokenizeForClueSignature(String((clue as any)?.description ?? "")),
        ...tokenizeForClueSignature(String((clue as any)?.pointsTo ?? "")),
      ];
      const uniqueTokens = Array.from(new Set(tokenPool));
      if (uniqueTokens.length === 0) continue;

      signatureByNormalizedId.set(normalizedId, {
        id: clueId,
        requiredTokens: uniqueTokens.slice(0, clueSemanticConfig.signature_tokens_from_distribution),
      });
    }
  }

  // Fallback signatures: when clueDistribution metadata is sparse or absent, derive
  // conservative semantic tokens from clue IDs so multi-token IDs can still be detected.
  for (const clueId of knownClueIds) {
    const normalizedId = normalizeClueIdForMatch(clueId);
    if (!normalizedId || signatureByNormalizedId.has(normalizedId)) continue;

    const idPhrase = clueId.replace(/[_-]+/g, " ");
    const idTokens = Array.from(new Set(tokenizeForClueSignature(idPhrase)));
    if (idTokens.length < 2) {
      continue;
    }

    signatureByNormalizedId.set(normalizedId, {
      id: clueId,
      requiredTokens: idTokens.slice(0, clueSemanticConfig.signature_tokens_from_id_fallback),
    });
  }

  return Array.from(signatureByNormalizedId.values());
};

const sentenceIndexForParagraph = (paragraph: string, token: string): number => {
  const sentences = paragraph
    .split(/[.!?]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const index = sentences.findIndex((sentence) => sentence.toLowerCase().includes(token));
  return index >= 0 ? index + 1 : 1;
};

const evidenceQuoteFromParagraph = (paragraph: string): string => {
  const normalized = paragraph.replace(/\s+/g, " ").trim();
  if (normalized.length <= 220) return normalized;
  return `${normalized.slice(0, 217)}...`;
};

/**
 * Extract clue visibility and chapter-level evidence anchors from prose.
 * This powers both scorer clue visibility and NSD-vs-visibility divergence telemetry.
 */
export function collectClueEvidenceFromProse(
  proseChapters: any[],
  cmlCase?: any,
  clueDistribution?: ClueDistributionResult,
): ClueEvidenceExtractionResult {
  const clueSemanticConfig = getAdapterConfig().clue_semantic;
  const knownClueIds = getKnownClueIds(cmlCase, clueDistribution);
  const discriminatingEvidenceIds = getDiscriminatingEvidenceClueIds(cmlCase);
  const discriminatingTokens = buildDiscriminatingSemanticTokens(cmlCase);

  const clueSignatures = buildClueSignatures(clueDistribution, knownClueIds);
  const clueSignatureById = Object.fromEntries(
    clueSignatures.map((signature) => [normalizeClueIdForMatch(signature.id), signature]),
  ) as Record<string, ClueSemanticSignature>;
  const evidenceByClue: Record<string, ClueEvidenceAnchor[]> = {};
  const evidenceByChapter: Record<number, string[]> = {};
  const clueStateById: Record<string, ClueEvidenceState> = {};
  for (const clueId of knownClueIds) {
    clueStateById[clueId] = "introduced";
  }

  for (let chapterIdx = 0; chapterIdx < proseChapters.length; chapterIdx++) {
    const chapter = proseChapters[chapterIdx];
    const chapterNumber = chapterIdx + 1;
    const rawParagraphs: string[] = Array.isArray(chapter?.paragraphs)
      ? chapter.paragraphs.map((p: unknown) => String(p ?? ""))
      : [String(chapter?.prose ?? "")];

    for (const clueId of knownClueIds) {
      let bestAnchor: ClueEvidenceAnchor | null = null;

      for (let paragraphIdx = 0; paragraphIdx < rawParagraphs.length; paragraphIdx++) {
        const paragraph = rawParagraphs[paragraphIdx];
        const lowered = paragraph.toLowerCase();
        if (!lowered) continue;
        const normalizedParagraph = normalizeClueIdForMatch(lowered);

        // Two-pass clue detection:
        //   Pass 1 (exact): clue ID string appears verbatim in the text → high confidence,
        //          state="explicit", immediately accepts and moves to next clue.
        //   Pass 2 (semantic): enough descriptive tokens from the Clue object match →
        //          lower confidence, state="hinted", keeps the best anchor per chapter.
        const clueVariants = buildClueIdMatchVariants(clueId);
        const explicitVariant = clueVariants.find((variant) => lowered.includes(variant));
        const explicitNormalizedMatch = normalizedParagraph.includes(
          normalizeClueIdForMatch(clueId),
        );
        if (explicitVariant || explicitNormalizedMatch) {
          const sentenceToken = explicitVariant ?? clueVariants[0] ?? clueId.toLowerCase();
          bestAnchor = {
            clue_id: clueId,
            chapter_number: chapterNumber,
            evidence_quote: evidenceQuoteFromParagraph(paragraph),
            evidence_offset: {
              chapter: chapterNumber,
              paragraph: paragraphIdx + 1,
              sentence: sentenceIndexForParagraph(paragraph, sentenceToken),
            },
            confidence: 1,
            state: "explicit",
          };
          break;
        }

        const signature = clueSignatureById[normalizeClueIdForMatch(clueId)];
        if (!signature) continue;

        const matchedTokens = signature.requiredTokens.filter((token) => lowered.includes(token));
        const requiredMatches = semanticRequiredTokenMatches(signature.requiredTokens.length);
        if (!hasSemanticCoverage(paragraph, signature)) continue;

        // Confidence = fraction of required tokens matched, capped at 0.95 to distinguish
        // semantic matches from the certainty of an exact ID hit.
        const confidence = Math.min(
          clueSemanticConfig.confidence_cap,
          matchedTokens.length / Math.max(requiredMatches, 1),
        );
        const candidate: ClueEvidenceAnchor = {
          clue_id: clueId,
          chapter_number: chapterNumber,
          evidence_quote: evidenceQuoteFromParagraph(paragraph),
          evidence_offset: {
            chapter: chapterNumber,
            paragraph: paragraphIdx + 1,
            sentence: sentenceIndexForParagraph(paragraph, matchedTokens[0] ?? signature.requiredTokens[0] ?? ""),
          },
          confidence,
          state: "hinted",
        };

        if (!bestAnchor || candidate.confidence > bestAnchor.confidence) {
          bestAnchor = candidate;
        }
      }

      if (!bestAnchor) continue;
      evidenceByClue[clueId] = [...(evidenceByClue[clueId] ?? []), bestAnchor];
      evidenceByChapter[chapterNumber] = [...(evidenceByChapter[chapterNumber] ?? []), clueId];
      clueStateById[clueId] = mergeClueState(clueStateById[clueId] ?? "introduced", bestAnchor.state);
    }

    const chapterClues = evidenceByChapter[chapterNumber] ?? [];
    const chapterProse = rawParagraphs.join("\n\n");
    const discriminatingChapter = isDiscriminatingTestChapter(
      chapterProse,
      discriminatingTokens,
      chapterClues,
      discriminatingEvidenceIds,
    );

    if (!discriminatingChapter || discriminatingEvidenceIds.length === 0) {
      continue;
    }

    for (const clueId of chapterClues) {
      if (!discriminatingEvidenceIds.includes(clueId)) {
        continue;
      }

      const anchors = evidenceByClue[clueId] ?? [];
      evidenceByClue[clueId] = anchors.map((anchor) =>
        anchor.chapter_number === chapterNumber
          ? {
              ...anchor,
              state: "confirmed",
              confidence: Math.max(anchor.confidence, clueSemanticConfig.confidence_cap),
            }
          : anchor,
      );
      clueStateById[clueId] = "confirmed";
    }
  }

  const visibleClueIds = Object.keys(evidenceByClue).filter((id) => (evidenceByClue[id] ?? []).length > 0);
  return {
    visibleClueIds,
    evidenceByClue,
    evidenceByChapter,
    clueStateById,
  };
}

// D7: Matches strong conclusion/accusation language used when a detective draws a final
// inference from evidence — separate from the looser DISCRIMINATING_PROS_RE used for
// discriminating-test detection.  Used exclusively for same-chapter timing enforcement.
const CONCLUSION_RE =
  /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is)\b/i;

// Regex that matches the kind of language the prose uses when running a
// discriminating / confrontation / denouement scene.
// .* replaced with [^.!?]{0,80} to prevent cross-sentence false positives (P-5 fix)
const DISCRIMINATING_PROSE_RE =
  /\b(accus|confess|confronted?|unmasked?|reveal(?:ed|s)|the murderer|the killer|guilty(?!\w)|arrested?|the culprit|gathered[^.!?]{0,80}suspects?|gathered[^.!?]{0,80}everyone|explained[^.!?]{0,80}crime|solved(?!\w)|the solution|the truth|now i know|i accuse|i name(?!\w))/i;

const SPOILER_PROSE_RE =
  /\b(the\s+culprit\s+was|the\s+killer\s+was|was\s+the\s+murderer|confess(?:ed)?\s+to\s+the\s+murder|admitted\s+to\s+the\s+murder|i\s+name\s+[A-Z][a-z]+|i\s+accuse\s+[A-Z][a-z]+)\b/i;

export function adaptProseForScoring(
  proseChapters: any[],
  cmlCase?: any,          // pass (cml as any).CASE for clue extraction
  clueDistribution?: ClueDistributionResult,
): ProseOutput {
  const fairPlayConfig = getAdapterConfig().fair_play;
  const evidence = collectClueEvidenceFromProse(proseChapters, cmlCase, clueDistribution);
  const knownClueIds = getKnownClueIds(cmlCase, clueDistribution);
  const discriminatingEvidenceIds = getDiscriminatingEvidenceClueIds(cmlCase);
  const discriminatingTokens = buildDiscriminatingSemanticTokens(cmlCase);

  const chapters: ChapterProse[] = proseChapters.map((ch: any, idx: number) => {
    const prose: string = ch.paragraphs?.join('\n\n') ?? ch.prose ?? '';
    const chapterNumber = idx + 1;
    const clues_present = evidence.evidenceByChapter[chapterNumber] ?? [];
    const discriminating_test_present = isDiscriminatingTestChapter(
      prose,
      discriminatingTokens,
      clues_present,
      discriminatingEvidenceIds,
    );

    return {
      chapter_number: idx + 1,          // sequential 1-based
      chapter_title: ch.title ?? '',
      prose,
      clues_present: clues_present.length > 0 ? clues_present : undefined,
      discriminating_test_present: discriminating_test_present || undefined,
    };
  });

  // Populate fair_play_validation so the scorer's consistency check runs (P-1 fix)
  const dtComplete = chapters.some(c => c.discriminating_test_present);
  const allCluesVisible =
    knownClueIds.length === 0 ||
    knownClueIds.every(id => evidence.visibleClueIds.includes(id));
  const missingClueIds = knownClueIds.filter((id) => !evidence.visibleClueIds.includes(id));
  const clueVisibilityRatio =
    knownClueIds.length > 0 ? evidence.visibleClueIds.length / knownClueIds.length : 1;
  // Spoiler check: look for accusation/solution language in the first 50% of chapters.
  // We deliberately stop at the halfway point so Act III climax language isn't penalised.
  const hasEarlyRevealCue = chapters
    .slice(0, Math.max(1, Math.ceil(chapters.length * fairPlayConfig.spoiler_early_chapter_ratio)))
    .some((chapter) => SPOILER_PROSE_RE.test(chapter.prose));
  const noSolutionSpoilers = !hasEarlyRevealCue;

  // D7: Fair-play timing check — each clue must be revealed to the reader at least one
  // chapter before it is used in a detective deduction or conclusion scene.
  // We flag violations only when a clue's first-reveal chapter is also a
  // discriminating-test or strong-conclusion chapter.
  // D7 fair-play timing: track the *first* chapter in which each clue becomes visible.
  // (Any later chapter that also contains the clue is not a timing violation — only the
  //  first reveal matters for the clue-before-deduction rule.)
  const firstRevealChapterById: Record<string, number> = {};
  for (const [chNumStr, clueIds] of Object.entries(evidence.evidenceByChapter)) {
    const chNum = Number(chNumStr);
    for (const clueId of clueIds) {
      if (!(clueId in firstRevealChapterById)) {
        firstRevealChapterById[clueId] = chNum;
      }
    }
  }
  const fairPlayTimingViolations: Array<{ clue_id: string; chapter: number }> = [];
  // Act I chapters (first 25%) are exempt from the timing check — early chapters commonly
  // use scene-setting language that incidentally triggers CONCLUSION_RE or discriminating tests.
  const actIExemptionEnd = Math.ceil(chapters.length * 0.25);
  for (const chapter of chapters) {
    const inActI = chapter.chapter_number <= actIExemptionEnd;
    const isDeductionChapter =
      !inActI && (chapter.discriminating_test_present || CONCLUSION_RE.test(chapter.prose));
    if (!isDeductionChapter) continue;
    const firstRevealedHere = Object.entries(firstRevealChapterById)
      .filter(([, firstChap]) => firstChap === chapter.chapter_number)
      .map(([clueId]) => clueId);
    for (const clueId of firstRevealedHere) {
      fairPlayTimingViolations.push({ clue_id: clueId, chapter: chapter.chapter_number });
    }
  }
  const fairPlayTimingCompliant = fairPlayTimingViolations.length === 0;

  return {
    chapters,
    // Expose the union of all known clue ID sources so the scorer can compare against
    // the same namespace the adapter used for detection.  Without this, the scorer
    // re-derives expected IDs from CASE.prose_requirements.clue_to_scene_mapping alone
    // (agent3 IDs), while the adapter detected using ClueDistributionResult IDs (agent5).
    // Because these two ID sets are independently generated, they almost never match,
    // so every clue appears "missing" and the visibility score is permanently 0/N.
    expected_clue_ids: knownClueIds.length > 0 ? knownClueIds : undefined,
    fair_play_validation: {
      all_clues_visible: allCluesVisible,
      discriminating_test_complete: dtComplete,
      no_solution_spoilers: noSolutionSpoilers,
      fair_play_timing_compliant: fairPlayTimingCompliant,
      fair_play_timing_violations: fairPlayTimingViolations.length > 0 ? fairPlayTimingViolations : undefined,
    },
    completeness_diagnostics: {
      expected_clue_ids_count: knownClueIds.length,
      visible_clue_ids_count: evidence.visibleClueIds.length,
      clue_visibility_ratio: clueVisibilityRatio,
      missing_clue_ids: missingClueIds.length > 0 ? missingClueIds : undefined,
    },
  };
}
