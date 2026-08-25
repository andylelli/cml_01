/**
 * agent9-prose/lint.ts
 * Prose linter (n-gram, fingerprint, entropy, template-bleed),
 * season/month lock utilities, and opening-sentence helpers.
 */
import { getGenerationParams } from "@cml/story-validation";
import { detectControlPlaneLeakage } from "@cml/story-validation";
import { classifyOpeningStyle } from "../types/narrative-state.js";
import {
  ARC_POSITION_REGISTER,
} from "../constants/arc-position.js";
import { detectConfiguredBannedPhrases } from "./banned-phrases.js";
import type { ProseChapter, ProseLinterIssue, MacroArcEntry, ProseGenerationInputs } from "./types.js";
import { MONTH_TO_SEASON, normalizeMonthToken, type CanonicalSeason } from "../shared/temporal-anchor.js";
import { CLEARANCE_TERMS_RE } from "../shared/clearance-vocabulary.js";
export const normalizeParagraphForFingerprint = (paragraph: string): string =>
  paragraph
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokenizeWords = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);

const OPENER_FUNCTION_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "for",
  "from",
  "he",
  "her",
  "his",
  "i",
  "in",
  "it",
  "my",
  "of",
  "our",
  "she",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "we",
  "with",
  "you",
]);

const isMeaningfulOpenerToken = (token: string): boolean =>
  token.length > 2 && !OPENER_FUNCTION_WORDS.has(token);

export const toNgrams = (tokens: string[], n: number): Set<string> => {
  const grams = new Set<string>();
  if (tokens.length < n) return grams;
  for (let i = 0; i <= tokens.length - n; i += 1) {
    grams.add(tokens.slice(i, i + n).join(" "));
  }
  return grams;
};

export const jaccardSimilarity = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
};

export const extractOpeningSentence = (paragraph: string): string => {
  // P2-16: Handle Unicode ellipsis (…) and curly/smart closing quotes as sentence terminators.
  // \u2019 is a right single quotation mark used as an apostrophe in contractions ("don't", "wasn't").
  // Including it in the character-class terminator splits at contractions — e.g. "She wasn\u2019" — producing
  // a bogus first sentence that corrupts opening-style entropy classification. Removed from the class.
  const firstSentence = paragraph.match(/^[^.!?…\u201d]+[.!?…\u201d]+/);
  if (firstSentence?.[0]) return firstSentence[0].trim();
  // Fallback: soft 150-char limit (prefer a word boundary to avoid mid-word cut).
  const slice = paragraph.slice(0, 150);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trim();
};

export const shannonEntropy = (values: string[]): number => {
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

export const lintBatchProse = (
  batchChapters: ProseChapter[],
  priorChapters: ProseChapter[],
  priorOpeningStyles: string[],
  options?: {
    mode?: "standard" | "repair";
    chapterOffset?: number;
    entropyThreshold?: number;
    entropyMinWindow?: number;
    entropyWarmupChapters?: number;
    /** When true, skip the n-gram overlap check (see templateLinterProfile.skipNgramCheck). */
    skipNgramCheck?: boolean;
    /** P2-H: Suspect clearances required in this batch.  When populated, lintBatchProse
     *  checks that each suspect name co-occurs with elimination vocabulary in the prose.
     *  Failures are typed as suspect_clearance_missing — classified as clue_timing (rank 95)
     *  by classifyFailure so they receive highest-priority retry handling. */
    matchingClearances?: Array<{ suspect_name: string; clearance_method?: string }>;
    /** [PHASE 5] Macro arc plan for structural archetype validation. */
    macroArcPlan?: MacroArcEntry[];
    /** [PHASE 5] Chapter number of the first chapter in this batch (1-based). */
    batchChapterStart?: number;
    /** Stage 9: hard-banned phrase families that should fail pre-commit linting. */
    bannedPhrases?: string[];
    /** FIX-C2: Full names of victim characters. When provided, any sentence mentioning a
     *  victim name alongside alibi-reasoning language is flagged as victim_alibi_error.
     *  Victims have no alibi — such sentences are a logic error. */
    victimNames?: string[];
    /** Section 10: when enabled, hard-fail malformed quote/apostrophe boundary corruption. */
    boundaryIntegrityGateEnabled?: boolean;
    /** Cast/character full names. Their name tokens are excluded from the repeated-opener gate:
     *  in dialogue-driven prose a paragraph naturally opens with a character name, which is content,
     *  not scaffold "template bleed". Without this, a chapter that opens 3+ paragraphs with the same
     *  cast name false-fails (the dominant failure mode on small-cast runs). */
    castNames?: string[];
    /**
     * A_72 C3: also raise an issue when a sentence repeats ACROSS chapters. Default OFF, and the
     * measurement is why — see `CROSS_CHAPTER_ECHO_MIN_CHARS`.
     */
    crossChapterEcho?: boolean;
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
  const boundaryIntegrityGateEnabled = options?.boundaryIntegrityGateEnabled !== false;
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
  // BUG FIX (BUG-4): When the caller passes [] for priorOpeningStyles (as generateProse always
  // does), the entropy window collapses to just the current batch — typically 1 entry for the
  // default batchSize=1. With window < entropyMinWindow=2 the check never fires, disabling the
  // entire entropy linter for normal operation. Fix: derive effective prior opening styles from
  // priorChapters (committed chapters) when priorOpeningStyles is empty. priorChapters is already
  // in scope as the second parameter and is the correct source of historical style data.
  const effectivePriorOpeningStyles = priorOpeningStyles.length > 0
    ? priorOpeningStyles
    : priorChapters.map((ch) =>
        ch.paragraphs?.[0] ? classifyOpeningStyle(extractOpeningSentence(ch.paragraphs[0])) : 'general-descriptive'
      );
  const openingWindow = [
    ...effectivePriorOpeningStyles.slice(-entropyConfig.opening_styles_prior_window),
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
          // Pillar 6 (Unit 6.1): persist the matched text so the retry builder can
          // inject a precise BANNED PARAGRAPH block rather than vague "rewrite" guidance.
          matchingPriorParagraph: normalized,
        });
        break;
      }
      batchSeen.add(normalized);
    }
    if (issues.some((issue) => issue.type === "paragraph_fingerprint")) break;
  }

  // P4 / FIX-PR1: Opening-paragraph duplicate gate — lower char threshold for paragraphs 0 and 1.
  // Template boilerplate location lines (< 45 chars) escape the standard sentence-dedup but still
  // signal scaffold leakage when the same sentence repeats in the opening two paragraphs.
  // This gate runs unconditionally before the standard sentenceLoop.
  openingDupLoop: for (const chapter of batchChapters) {
    const openingParas = (chapter.paragraphs ?? []).slice(0, 2);
    const openingSentencesSeen = new Set<string>();
    for (const para of openingParas) {
      for (const sentence of para.split(/(?<=[.!?\u2026])\s+/)) {
        const norm = normalizeParagraphForFingerprint(sentence);
        if (norm.length < 20) continue;
        if (openingSentencesSeen.has(norm)) {
          issues.push({
            type: 'intra_chapter_sentence_duplicate',
            message: 'Template linter: duplicate sentence in the opening paragraph(s). Rewrite the chapter opening — no sentence may appear twice in the first two paragraphs.',
            matchingPriorParagraph: norm,
          });
          break openingDupLoop;
        }
        openingSentencesSeen.add(norm);
      }
    }
  }

  // Deterministic paragraph-opener uniqueness gate.
  // Within each chapter, content openers should stay diverse while avoiding
  // false positives from pronouns/articles and common function words.
  // R1 (ANALYSIS_44): report EVERY distinct repeated opener in a single pass rather than
  // breaking at the first. The old break-at-first behaviour fed the retry only one offending
  // opener; the model fixed that one and the next pre-existing duplicate surfaced on the
  // following attempt (the "whack-a-mole" that burned the per-chapter retry budget). Each
  // distinct opener is emitted as its own issue so the singular message + the feedback regex
  // (`repeated content opener detected ("X")`) are preserved while every opener reaches the retry.
  // Character-name tokens are content, not scaffold: a paragraph opening with a cast name is
  // natural in dialogue-driven prose and must not trip the "template bleed" opener gate.
  const nameOpenerTokens = new Set<string>();
  for (const name of options?.castNames ?? []) {
    for (const token of tokenizeWords(String(name ?? ""))) nameOpenerTokens.add(token);
  }
  const isNonScaffoldOpener = (token: string): boolean =>
    isMeaningfulOpenerToken(token) && !nameOpenerTokens.has(token);

  for (const chapter of batchChapters) {
    const firstWordCounts = new Map<string, number>();
    const firstTwoWordsSeen = new Set<string>();
    const reportedOpeners = new Set<string>();
    for (const paragraph of chapter.paragraphs ?? []) {
      const tokens = tokenizeWords(paragraph);
      if (tokens.length === 0) continue;
      const firstWord = tokens[0];
      const firstTwoWords = tokens.length >= 2 ? `${tokens[0]} ${tokens[1]}` : tokens[0];
      const firstWordMeaningful = isNonScaffoldOpener(firstWord);
      const firstTwoWordsMeaningful =
        tokens.length >= 2 && isNonScaffoldOpener(tokens[0]) && isNonScaffoldOpener(tokens[1]);
      const currentFirstWordCount = firstWordMeaningful ? (firstWordCounts.get(firstWord) ?? 0) + 1 : 0;

      let offendingOpener: string | null = null;
      if (firstTwoWordsMeaningful && firstTwoWordsSeen.has(firstTwoWords)) {
        offendingOpener = firstTwoWords;
      } else if (currentFirstWordCount >= 3) {
        offendingOpener = firstWord;
      }

      if (offendingOpener && !reportedOpeners.has(offendingOpener)) {
        reportedOpeners.add(offendingOpener);
        issues.push({
          type: "template_bleed",
          message: `Template linter: repeated content opener detected ("${offendingOpener}"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.`,
          matchingPriorParagraph: offendingOpener,
        });
      }
      if (firstWordMeaningful) {
        firstWordCounts.set(firstWord, currentFirstWordCount);
      }
      if (firstTwoWordsMeaningful) {
        firstTwoWordsSeen.add(firstTwoWords);
      }
    }
  }

  /**
   * A_72 C3 — intra-chapter sentence dedup, and the comment that used to sit here was WRONG.
   *
   * It said *"cross-chapter repeats are covered by paragraph_fingerprint"*. They are not:
   * `paragraph_fingerprint` matches whole PARAGRAPHS above its own min-chars, so one sentence
   * repeated across two chapters inside different paragraphs is covered by nothing at all. That is
   * three of the five verbatim repeats in the 2026-08-23 manuscript, whose external read scored
   * `prose` 6/10 and named repetition as the cause (A_72 §5).
   *
   * THE THRESHOLD WAS ALSO TOO HIGH. It was 45 normalised characters. The sentence the reader quoted
   * back — *"By then it was a ten minutes past eleven."* — normalises to **40**, so it was never
   * checked. MEASURED over 198 archived manuscripts, dropping the threshold to 30 raises intra-chapter
   * detections from 76 to 111 across the whole corpus (**0.56 per book**), and every one of the 35 it
   * adds is a genuine repeat: *"a physical check followed the talk"*, *"service resumed forty past
   * ten"*, *"it became a narrower corridor"*.
   */
  const SENTENCE_DEDUP_MIN_CHARS = 30;
  sentenceLoop: for (const chapter of batchChapters) {
    const chapterSentences = new Set<string>();
    for (const paragraph of chapter.paragraphs ?? []) {
      const sentences = paragraph.split(/(?<=[.!?\u2026])\s+/);
      for (const sentence of sentences) {
        const norm = normalizeParagraphForFingerprint(sentence);
        if (norm.length < SENTENCE_DEDUP_MIN_CHARS) continue;
        if (chapterSentences.has(norm)) {
          issues.push({
            type: "intra_chapter_sentence_duplicate",
            message: "Template linter: repeated sentence detected within a chapter. Rewrite or remove the duplicate sentence.",
            matchingPriorParagraph: norm,
          });
          break sentenceLoop;
        }
        chapterSentences.add(norm);
      }
    }
  }

  /**
   * A_72 C3 — the same sentence in TWO chapters. Warning-priced, and the measurement is the reason.
   *
   * MEASURED over 198 archived manuscripts at a 30-character floor: intra-chapter repeats run 0.56 per
   * book, but cross-chapter repeats run a **median of 6 per book** (max 35). Every lint issue becomes a
   * `batchError` and drives a retry, so raising these unconditionally would put a retry on essentially
   * every chapter of every run — the exact cost that kept `AGENT9_FOLD_SUSPECT_CLEARANCES` switched off
   * for a month.
   *
   * So it is counted always and raised only when the caller opts in. What it counts is worth having on
   * its own: sampling the corpus, these are catchphrases and verbatim alibi recitals —
   *
   *     "that's the only certainty we have"        "one mustn't jump to conclusions"
   *     "we must look beyond the obvious"          "ambition is not a crime, Miss Voss"
   *     "I was in the smoking room from eight fifty to nine thirty"
   *
   * — which is, in the reader's words across read after read, *"repeated catchphrases feel
   * artificial"*. `dialogue` has reached 8 exactly once in 35 external reads (A_72 §1.1). This is the
   * first instrument pointed at why.
   */
  const CROSS_CHAPTER_ECHO_MIN_CHARS = 30;
  {
    const seenBefore = new Map<string, number>();
    priorChapters.forEach((chapter, idx) => {
      for (const paragraph of chapter.paragraphs ?? []) {
        for (const sentence of paragraph.split(/(?<=[.!?…])\s+/)) {
          const norm = normalizeParagraphForFingerprint(sentence);
          if (norm.length >= CROSS_CHAPTER_ECHO_MIN_CHARS && !seenBefore.has(norm)) seenBefore.set(norm, idx + 1);
        }
      }
    });
    const echoes: string[] = [];
    for (const chapter of batchChapters) {
      for (const paragraph of chapter.paragraphs ?? []) {
        for (const sentence of paragraph.split(/(?<=[.!?…])\s+/)) {
          const norm = normalizeParagraphForFingerprint(sentence);
          if (norm.length < CROSS_CHAPTER_ECHO_MIN_CHARS) continue;
          if (seenBefore.has(norm) && !echoes.includes(norm)) echoes.push(norm);
        }
      }
    }
    if (echoes.length > 0) {
      // Always visible, even when it is not allowed to fail the batch.
      console.warn(
        `[Agent 9][A_72 C3] cross-chapter sentence echo: ${echoes.length} sentence(s) repeat a chapter seen earlier` +
          ` — e.g. "${echoes[0]!.slice(0, 80)}"`,
      );
      if (options?.crossChapterEcho) {
        issues.push({
          type: "cross_chapter_sentence_echo",
          message:
            `Template linter: ${echoes.length} sentence(s) in this chapter already appear verbatim in an earlier chapter. ` +
            `Rewrite them — a line a character has already said reads as a catchphrase. First: "${echoes[0]!.slice(0, 80)}"`,
          matchingPriorParagraph: echoes[0],
        });
      }
    }
  }


  // N-gram overlap check: catches near-duplicate prose that evades exact fingerprinting
  // (e.g. when the LLM swaps a few words but keeps the same sentence structure).
  // Skipped for the final (reveal) chapter: the detective recap legitimately echoes prior
  // chapter vocabulary and would always produce false positives at any reasonable threshold.
  // We compare configurable n-gram Jaccard similarity against a bounded prior paragraph set.
  // BUG FIX: skipNgramCheck must only skip the n-gram section; suspect-clearance, template-bleed,
  // and debug-note checks must still run even for the reveal chapter.
  if (!options?.skipNgramCheck) {
  const priorCandidates = priorChapters
    .flatMap((chapter) => chapter.paragraphs ?? [])
    .map((paragraph) => normalizeParagraphForFingerprint(paragraph))
    .filter((paragraph) => paragraph.length >= styleLinterConfig.ngram.min_chars)
    .slice(-styleLinterConfig.ngram.prior_paragraph_limit);
  const priorNgrams = priorCandidates.map((paragraph) =>
    toNgrams(tokenizeWords(paragraph), styleLinterConfig.ngram.gram_size),
  );

  // FIX-P1: Tighten n-gram threshold for consecutive same-archetype chapters.
  // Two chapters with the same structural archetype (e.g. two FIRST_CONTACT scenes in a row)
  // draw on the same narrative idioms and legitimately produce higher overlap — so the
  // default threshold is too permissive. Cap at 0.60 when archetypes match.
  const _p1CurrentArchetype: string = (options?.macroArcPlan && typeof options?.batchChapterStart === 'number')
    ? String(options.macroArcPlan.find((e) => e.chapter === options!.batchChapterStart!)?.archetype ?? '')
    : '';
  const _p1PriorArchetype: string = (options?.macroArcPlan && typeof options?.batchChapterStart === 'number' && options.batchChapterStart > 1)
    ? String(options.macroArcPlan.find((e) => e.chapter === options!.batchChapterStart! - 1)?.archetype ?? '')
    : '';
  const effectiveNgramThreshold = (
    _p1CurrentArchetype && _p1PriorArchetype && _p1CurrentArchetype === _p1PriorArchetype
  ) ? Math.min(styleLinterConfig.ngram.overlap_threshold, 0.60)
    : styleLinterConfig.ngram.overlap_threshold;

  if (priorNgrams.length > 0) {
    outer: for (const chapter of batchChapters) {
      for (const paragraph of chapter.paragraphs ?? []) {
        const normalized = normalizeParagraphForFingerprint(paragraph);
        if (normalized.length < styleLinterConfig.ngram.min_chars) continue;
        const candidate = toNgrams(tokenizeWords(normalized), styleLinterConfig.ngram.gram_size);
        if (candidate.size < styleLinterConfig.ngram.min_candidate_ngrams) continue;
        // P3-D: find the prior paragraph with the highest overlap (not just first over threshold)
        // so matchingPriorParagraph carries the most-similar passage for the BANNED block.
        let maxOverlap = 0;
        let maxOverlapIdx = -1;
        for (let bi = 0; bi < priorNgrams.length; bi++) {
          const overlap = jaccardSimilarity(candidate, priorNgrams[bi]);
          if (overlap > maxOverlap) {
            maxOverlap = overlap;
            maxOverlapIdx = bi;
          }
        }
        if (maxOverlap >= effectiveNgramThreshold) {
          issues.push({
            type: "ngram_overlap",
            message: `Template linter: high n-gram overlap detected (${maxOverlap.toFixed(2)} >= ${effectiveNgramThreshold.toFixed(2)}). Rephrase this passage to avoid template leakage.`,
            matchingPriorParagraph: priorCandidates[maxOverlapIdx],
          });
          break outer;
        }
      }
    }
  }
  } // end !skipNgramCheck

  // Stage 9 hard-ban phrase linter: catches known banned phrase families before commit.
  if (options?.bannedPhrases && options.bannedPhrases.length > 0) {
    const bannedPhraseHits = detectConfiguredBannedPhrases(batchChapters, options.bannedPhrases, 1);
    for (const phrase of bannedPhraseHits.slice(0, 8)) {
      issues.push({
        type: "banned_phrase",
        message: `Template linter: banned phrase detected in generated prose: "${phrase}"`,
        matchingPriorParagraph: phrase,
      });
    }
  }

  for (const chapter of batchChapters) {
    const chapterText = (chapter.paragraphs ?? []).join('\n\n');
    const leakageFindings = detectControlPlaneLeakage(chapterText)
      .filter((finding) => finding.confidence === 'hard');
    for (const finding of leakageFindings.slice(0, 6)) {
      issues.push({
        type: 'control_plane_leakage',
        message: `Control-plane leakage (${finding.code}): "${finding.excerpt}". Remove prompt, validation, retry, fallback, or scaffold language from prose.`,
        matchingPriorParagraph: finding.excerpt,
      });
    }
  }

  // P2-H: Suspect clearance check — for any chapter carrying a clearance obligation
  // (from prose_requirements.suspect_clearance_scenes), verify the prose names the suspect
  // with elimination-adjacent vocabulary.  Failures are typed suspect_clearance_missing so
  // classifyFailure() maps them to clue_timing (rank 95) for highest-priority retry handling.
  // A_73 §11.1 — single-sourced from shared/clearance-vocabulary.ts (this was a private copy, one
  // of four byte-identical ones). Same matcher, one definition.
  const CLEARANCE_TERMS = CLEARANCE_TERMS_RE;
  // P2-H evidence gate: mirrors SuspectClosureValidator's EVIDENCE_TERMS so a chapter that
  // passes P2-H always satisfies the release gate too.  Without this, a sentence like
  // "[Suspect] was cleared." (bare clearance, no evidence connector) passes P2-H but fails the validator.
  const CLEARANCE_EVIDENCE_TERMS =
    /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;
  if (options?.matchingClearances && options.matchingClearances.length > 0) {
    // Per-paragraph co-location check: the suspect name, clearance term, AND evidence
    // connector must all appear in the SAME paragraph.  Checking the full chapter blob is
    // a weaker gate than what SuspectClosureValidator enforces (per-scene co-occurrence)
    // and causes false-passes where a suspect name appears in one paragraph and a clearance
    // term in another.
    // A_67 FIX-1 (de-register): co-locate at CHAPTER granularity, not per-paragraph. This matches
    // SuspectClosureValidator's per-scene rule (a scene == a chapter downstream), so a clearance
    // dramatised across several of a chapter's paragraphs now PASSES and the model is no longer forced
    // to compress it into a single report-register sentence to satisfy the gate. All three signals —
    // name, a clearance term, an evidence connector — must still co-occur within the SAME chapter; a
    // suspect named in one chapter and cleared in another still fails. Term-sets stay narrower-or-equal
    // to the validator's, so a lint pass still implies a release-gate pass.
    const chapterBlobs = batchChapters.map((ch) => (ch.paragraphs ?? []).join('\n\n'));
    for (const clearance of options.matchingClearances) {
      const suspectName = clearance.suspect_name;
      const escapedName = suspectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const suspectPattern = new RegExp(`\\b${escapedName}\\b`, 'i');
      // Also match by surname alone (last word), matching SuspectClosureValidator behaviour.
      const surnameParts = suspectName.trim().split(/\s+/);
      const surname = surnameParts[surnameParts.length - 1];
      const escapedSurname = surname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const surnamePattern = new RegExp(`\\b${escapedSurname}\\b`, 'i');
      const hasCoLocatedClearance = chapterBlobs.some(
        (blob) =>
          (suspectPattern.test(blob) || surnamePattern.test(blob)) &&
          CLEARANCE_TERMS.test(blob) &&
          CLEARANCE_EVIDENCE_TERMS.test(blob)
      );
      if (!hasCoLocatedClearance) {
        // A_67 FIX-1: the message models FICTION, not a copy-me template. The old `Example:` sentence
        // was reproduced verbatim in 5/5 shipped stories ("an example IS a template" to an LLM), and the
        // "do not split across paragraphs" rule structurally forbade the dramatic aftermath phrasing
        // reviewers keep asking for. We keep the accepted vocabulary (a word list, not a sentence, so it
        // is not copyable) so the gate stays satisfiable, but hand no reusable sentence.
        issues.push({
          type: "suspect_clearance_missing",
          message: `Clue obligation: suspect clearance missing for "${suspectName}". ` +
            `Somewhere in this chapter, dramatise how the evidence rules "${suspectName}" out: name them, ` +
            `show the specific alibi or observation that clears them (a named witness, a physical record, a ` +
            `timeline that does not fit), and let the detective conclude they could not have done it. Use ` +
            `natural clearing language ("cleared", "ruled out", "innocent", "alibi holds", "could not have") ` +
            `together with an evidence connector ("because", "the evidence", "the alibi", "the timeline"). ` +
            `Spread it across the scene in as many sentences as it takes — do NOT compress it into one flat ` +
            `report sentence that merely asserts the alibi was confirmed.`,
        });
      }
    }
  }

  // ANALYSIS_17 Issue I — Template-bleed linter check.
  // Detects raw scene-template text that the LLM has reproduced verbatim instead of
  // synthesizing into natural period prose.  Hard-fails the chapter so it retries
  // with an explicit instruction to rewrite as fiction.
  // P2-7: Use AND conditions for multi-phrase checks to avoid false positives.
  // Single-phrase patterns only kept where the phrase is highly distinctive to the template.
  const TEMPLATE_BLEED_CHECKS: Array<(p: string) => boolean> = [
    // Template 2: "felt sharply" + "clung to coats and curtains"
    (p) => /\bfelt sharply\b/i.test(p) && /\bclung to coats and curtains\b/i.test(p),
    // Template 3: "By the time they reached" + "left the room feeling"
    (p) => /^by the time they reached\b/im.test(p) && /\bleft the room feeling\b/i.test(p),
    // Template 4: "seemed to signal a ... turn in events" (already two-part — keep)
    (p) => /\bseemed to signal a\b.{0,40}\bturn in events\b/i.test(p),
    // Template 5: "met them with" + "threaded through the scene"
    (p) => /\bmet them with\b/i.test(p) && /\bthreaded through the scene\b/i.test(p),
    // Template 5: "sharpened the ... tension" + "threaded through the scene"
    (p) => /\bsharpened the\b.{0,40}\btension\b/i.test(p) && /\bthreaded through the scene\b/i.test(p),
    // Specific grounding-lead variants (distinctive enough to stand alone)
    (p) => /\b(carried overcast|met them with overcast)\b/i.test(p),
    (p) => /affecting outdoor activities/i.test(p),
    (p) => /tense and brooding,? with an underlying sense of unease among the guests/i.test(p),
    // High-frequency template fragments observed across multiple runs — single phrases
    // that are unique enough to the scaffold that they cannot appear in genuine period prose.
    // These were left undetected because earlier checks required two-part AND conditions.
    // "tense and foreboding, reflecting the underlying class tensions and societal unease"
    (p) => /\btense and foreboding, reflecting the underlying class tensions\b/i.test(p),
    // "reflecting the socio-political climate of the era and the hidden secrets"
    (p) => /\breflecting the socio-political climate of the era and the hidden secrets\b/i.test(p),
    // Double-rendering artifact: template variable rendered twice, second copy is a fragment
    // e.g. "creating a somber mood. skies," or "creating a somber mood. in every corridor"
    (p) => /creating a somber mood\.\s+(skies,|in every corridor|and the)/i.test(p),
    // "felt sharply tense and foreboding" without a second anchor — distinctive enough alone
    (p) => /\bfelt sharply tense and foreboding\b/i.test(p),
    // Fix 4: Location-boilerplate — formulaic "The [Room] in [Place] [verb]" scene-metadata openings
    (p) => /^The [A-Z][A-Za-z\s]+ in [A-Z][A-Za-z\s,]+\s+(?:held|had|was|offered|provided|carried)\b/m.test(p),
    // Fix 4: Location-boilerplate — formulaic "Entering The [Room] in [Place]," openings
    (p) => /^Entering [Tt]he [A-Z][A-Za-z\s]+ in [A-Z][A-Za-z\s,]+,/m.test(p),
  ];
  // ANALYSIS_17 Issue III — Debug-note bleed linter check.
  // Catches internal annotation metadata that has leaked verbatim into prose output.
  const DEBUG_NOTE_PATTERNS: Array<RegExp | ((p: string) => boolean)> = [
    /the detail is explicit:/i,
    /this detail added\b.*?\btexture\b/i,
    /\[locked fact\]/i,
    /without changing the essential deduction chain/i,
    // Fix 6: Report-note bleed — planning-output sentences that survived prose transformation
    // Narrowed to two-anchor to avoid false positives in clock/mechanical mysteries where
    // characters naturally say "the mechanism relies on..." in period dialogue.
    // Only fire when the phrase accompanies abstract story-planning vocabulary.
    (p) => /\bthe mechanism relies on\b/i.test(p) && /\b(the (?:killer|culprit|murderer|suspect|deduction|alibi|victim)|for the plan to work|without being discovered|to avoid detection|to create a false)\b/i.test(p),
    /\bfor the purposes of this (?:scene|chapter|narrative)\b/i,
    /\bthe (?:time|value|reading|interval) was recorded as\b/i,
    /\bthe (?:exact|precise) (?:amount|value|time|phrase|interval) .{0,40}(?:wound back|came to|amounts to|equals)\b/i,
    // Fix 10a: "waiting for investigator to arrive" — template-prompt phrase that leaks when the
    // LLM echoes the amateur-detective framing (Issue 6 from story quality review).
    /\buntil the investigator\b.{0,40}\b(?:arriv|comes?|is here)\b/i,
    /\bhold on\b.{0,50}\buntil.*investigator\b/i,
    // FIX-PR2: Additional investigator-wait variants — "we must wait" and "will arrive" phrasing
    // that escapes the existing hold-on/until patterns (story_20260520-1846 regression).
    /\bwe (?:must|have to|need to) wait\b.{0,40}\b(?:investigator|detective|inspector)\b/i,
    /\bthe (?:investigator|detective|inspector) (?:will|should) (?:know|arrive|be here)\b/i,
    // Fix 10b: Report-style obligation language leaking into prose (Issue 7 from story quality review).
    // These look like planning annotations, not period fiction.
    /\bthis evidence points to\b.{0,80}\b(?:involvement|guilt|culpability)\b/i,
    /\bdirect evidence ties\b.{0,80}\baccess point\b/i,
    // FIX-PR1: Arithmetic / ledger sentences — interval calculations belong in a case report,
    // not period fiction. Prefer MICRO-REGEN repair over full-chapter retry.
    /\binterval\b.{0,50}\bcame to \d+\s+minutes?\b/i,
    /\ba difference of \d+\s+minutes?\b/i,
    /\ban interval of \d+\s+minutes?\b/i,
    /\bthe gap\b.{0,50}\bwas \d+\s+minutes?\b/i,
    /\b(?:total|sum|amount)\b.{0,30}\b(?:came to|equals?|was)\s+\d+\s+minutes?\b/i,
  ];
  for (const chapter of batchChapters) {
    // R2: Room-list preamble check — first paragraph only.
    // Catches template openings that list 3+ named rooms as a set-piece orientation
    // rather than grounding the POV character in a specific scene moment.
    const firstPara = (chapter.paragraphs ?? [])[0] ?? '';
    const roomMatches = firstPara.match(/\b(?:Hall|Library|Study|Garden|Kitchen|Cellar|Parlour|Gallery|Pantry|Scullery|Conservatory|Drawing\s+Room|Morning\s+Room|Dining\s+Room|Servants['']?\s+(?:Hall|Quarters)|Smoking\s+Room|Billiard\s+Room)\b/gi);
    if ((roomMatches?.length ?? 0) >= 3) {
      issues.push({
        type: 'template_bleed',
        message:
          'Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.',
      });
    }
    // FIX-PR2 Group A: Weather/atmosphere opener check for chapters 2+.
    // Chapter 1 may open with setting; all subsequent chapters must open with action.
    const isNotFirstChapter = priorChapters.length + chapterOffset > 0 || batchChapters.indexOf(chapter) > 0;
    if (isNotFirstChapter) {
      const GROUP_A_OPENER_RE = /^(The rain fell|The wind howled|The fog lay|The mist hung|Outside, the |The night was |The storm |The darkness |The silence |The air was thick)/i;
      if (GROUP_A_OPENER_RE.test(firstPara.trimStart())) {
        issues.push({
          type: 'template_bleed',
          message: 'Template linter (Group A): chapter 2+ opens with a weather/atmosphere preamble. Open with a character action, clock anchor, or spoken line instead.',
        });
      }
    }
    // FIX-P2 / FIX-PR2 Group C: Cross-chapter stock phrase check.
    // These phrases are forbidden if they appear in more than one chapter.
    const GROUP_C_PHRASES = [
      'time is of the essence',
      'pressed for time',
      'no time to lose',
      'the investigation continues',
      'wasted no time',
      'not a moment to spare',
      'every moment counts',
      'the clock was ticking',
    ];
    const chapterFullText = (chapter.paragraphs ?? []).join(' ').toLowerCase();
    const allPriorText = priorChapters.map((pc) => (pc.paragraphs ?? []).join(' ')).join(' ').toLowerCase();
    for (const phrase of GROUP_C_PHRASES) {
      if (chapterFullText.includes(phrase) && allPriorText.includes(phrase)) {
        issues.push({
          type: 'template_bleed',
          message: `Template linter (Group C): stock phrase "${phrase}" already appeared in a prior chapter. Remove or replace this instance.`,
        });
      }
    }
    // M1 (ROADMAP_TO_80): adjacent verbatim-duplicate sentence — the Ch6 doubled-opener bug.
    // Exact match on a substantial sentence → zero false positives.
    {
      const sentences = (chapter.paragraphs ?? []).join(' ').match(/[^.!?]+[.!?]+/g) ?? [];
      for (let i = 1; i < sentences.length; i += 1) {
        const a = sentences[i - 1].trim().toLowerCase();
        const b = sentences[i].trim().toLowerCase();
        if (a.length > 40 && a === b) {
          issues.push({
            type: 'template_bleed',
            message: 'Template linter: a sentence is repeated verbatim back-to-back. Remove the duplicate.',
          });
          break;
        }
      }
    }
    // M1: cross-chapter repeated OPENING sentence — the templated-opener signature. Flag when this
    // chapter's first sentence is identical to a prior chapter's first sentence.
    {
      const firstSentence = (firstPara.match(/^[^.!?]+[.!?]/)?.[0] ?? '').trim().toLowerCase();
      if (firstSentence.length > 40) {
        const priorOpeners = priorChapters.map(
          (pc) => ((pc.paragraphs ?? [])[0] ?? '').match(/^[^.!?]+[.!?]/)?.[0]?.trim().toLowerCase() ?? '',
        );
        if (priorOpeners.some((o) => o.length > 40 && o === firstSentence)) {
          issues.push({
            type: 'template_bleed',
            message: 'Template linter: this chapter opens with the same sentence as a prior chapter. Rewrite the opening uniquely from the scene.',
          });
        }
      }
    }
    for (const paragraph of chapter.paragraphs ?? []) {
      for (const check of TEMPLATE_BLEED_CHECKS) {
        if (check(paragraph)) {
          issues.push({
            type: 'template_bleed',
            message:
              'Template linter: scene-template text leaked into prose. Rewrite the chapter opening as natural prose synthesized from the scene context — do not reproduce location metadata, weather descriptions, or scaffold phrases verbatim.',
          });
          break;
        }
      }
      for (const pattern of DEBUG_NOTE_PATTERNS) {
        const matched =
          pattern instanceof RegExp
            ? pattern.test(paragraph)
            : pattern(paragraph);
        if (matched) {
          issues.push({
            type: 'debug_note_bleed',
            message:
              'Internal audit note leaked into prose. Never reproduce instruction metadata in your fiction output. Rewrite the passage as natural narrative.',
          });
          break;
        }
      }
      // FIX-C2: Victim alibi gate — victims need no alibi; alibi reasoning about a victim is a logic error.
      if (options?.victimNames && options.victimNames.length > 0) {
        const ALIBI_VERB_RE = /\b(alibi|was seen|could not have been|account for (?:her|his|their) time|whereabouts|where was (?:she|he)|her movements|his movements)\b/i;
        for (const victimName of options.victimNames) {
          if (paragraph.toLowerCase().includes(victimName.toLowerCase()) && ALIBI_VERB_RE.test(paragraph)) {
            issues.push({
              type: 'victim_alibi_error',
              message: `Victim alibi error: a sentence about "${victimName}" contains alibi reasoning. The victim needs no alibi. Rewrite or remove the sentence.`,
            });
          }
        }
      }
      // FIX-C3: Gender-collective agreement — catches "both men" / "the two gentlemen" in the same
      // paragraph as feminine pronouns (she/her), and vice versa.  Heuristic gate: a paragraph that
      // names a mixed-gender pair must not use a single-gender collective noun.
      const COLLECTIVE_MALE_RE = /\b(both men|the two gentlemen|two men|both gentlemen)\b/i;
      const COLLECTIVE_FEMALE_RE = /\b(both women|the two ladies|two women|both ladies)\b/i;
      const FEMALE_PRONOUN_RE = /\b(she|her)\b/i;
      const MALE_PRONOUN_RE = /\b(he|him)\b/i;
      if (COLLECTIVE_MALE_RE.test(paragraph) && FEMALE_PRONOUN_RE.test(paragraph)) {
        issues.push({
          type: 'debug_note_bleed',
          message: 'Gender agreement: "both men" / "the two gentlemen" used in a paragraph that also contains feminine pronouns (she/her). At least one character in the group uses she/her. Use individual names instead of a gendered collective.',
        });
      } else if (COLLECTIVE_FEMALE_RE.test(paragraph) && MALE_PRONOUN_RE.test(paragraph)) {
        issues.push({
          type: 'debug_note_bleed',
          message: 'Gender agreement: "both women" / "the two ladies" used in a paragraph that also contains masculine pronouns (he/him). At least one character in the group uses he/him. Use individual names instead of a gendered collective.',
        });
      }
    }
  }

  // FIX-E2: Resolution chapter — forbid summary-verdict final sentence.
  // A resolution chapter must close with an in-scene moment (dialogue, action, sensation),
  // not a narrator pronouncement that wraps up the case like an end-of-report summary.
  if (options?.macroArcPlan && typeof options?.batchChapterStart === 'number') {
    const _e2Chapter = options.batchChapterStart;
    const _e2ArcEntry = options.macroArcPlan.find((e) => Number(e.chapter) === _e2Chapter);
    if (_e2ArcEntry?.archetype === 'RESOLUTION') {
      for (const chapter of batchChapters) {
        const paras = chapter.paragraphs ?? [];
        const finalPara = paras[paras.length - 1] ?? '';
        if (RESOLUTION_VERDICT_CLOSER_RULES.some((rule) => rule.pattern.test(finalPara))) {
          issues.push({
            type: 'debug_note_bleed',
            message: RESOLUTION_VERDICT_CLOSER_MESSAGE,
          });
          break;
        }
      }
    }
  }

  // [PHASE 5] Structural archetype validator — mustNotContain check disabled (false positives
  // from common mystery words). Archetype contracts are enforced via prompt injection only.

  if (boundaryIntegrityGateEnabled) {
    const ALLOWED_APOSTROPHE_SUFFIXES = new Set(['s', 'd', 'll', 're', 've', 'm', 't', 'em']);
    const MALFORMED_APOSTROPHE_RE = /\b([A-Za-z]{3,})'([A-Za-z]{2,})\b/g;

    for (let chapterIndex = 0; chapterIndex < batchChapters.length; chapterIndex += 1) {
      const chapter = batchChapters[chapterIndex];
      const chapterText = (chapter.paragraphs ?? []).join('\n');
      if (!chapterText) continue;

      const chapterNumber = chapterOffset + priorChapters.length + chapterIndex + 1;
      const findings: string[] = [];

      const quoteCount = (chapterText.match(/["\u201c\u201d]/g) ?? []).length;
      if (quoteCount % 2 !== 0) {
        findings.push('unbalanced quotation marks');
      }

      let malformedToken: string | undefined;
      let malformedMatch: RegExpExecArray | null;
      while ((malformedMatch = MALFORMED_APOSTROPHE_RE.exec(chapterText)) !== null) {
        const left = malformedMatch[1] ?? '';
        const right = malformedMatch[2] ?? '';
        const rightLower = right.toLowerCase();
        if (ALLOWED_APOSTROPHE_SUFFIXES.has(rightLower)) continue;
        if (/^[A-Z]/.test(left) || /^[A-Z]/.test(right)) continue;
        malformedToken = malformedMatch[0];
        break;
      }

      if (malformedToken) {
        findings.push(`malformed apostrophe token "${malformedToken}"`);
      }

      if (findings.length > 0) {
        issues.push({
          type: 'boundary_integrity',
          message:
            `Boundary integrity failure in chapter ${chapterNumber}: ${findings.join('; ')}. ` +
            'Repair punctuation boundaries before commit (balanced quotes, valid contractions/possessives only).',
        });
      }
    }
  }

  // C1: Sentence-fragment truncation check.
  // Detects paragraphs where the last content before a closing quote mark is whitespace, or
  // a bare article/preposition — both are hallmarks of LLM token-limit truncation mid-sentence.
  // Pattern: space-before-close-quote OR (the|a|an|its|their|our|to|for|of|with|in|by|at)+close-quote
  const TRUNCATED_BEFORE_CLOSE_QUOTE_RE =
    /(?:\s[""\u201d]|(?:^|\s)(?:the|a|an|its|their|our|my|your|his|her|to|for|of|with|in|by|at)\s*[""\u201d])\s*$/i;
  for (let chIdx = 0; chIdx < batchChapters.length; chIdx += 1) {
    const chapter = batchChapters[chIdx];
    const chapterNumber = chapterOffset + priorChapters.length + chIdx + 1;
    for (const paragraph of chapter.paragraphs ?? []) {
      const trimmed = paragraph.trimEnd();
      if (TRUNCATED_BEFORE_CLOSE_QUOTE_RE.test(trimmed)) {
        issues.push({
          type: 'sentence_fragment_truncation',
          message:
            `Chapter ${chapterNumber}: a paragraph ends with an incomplete sentence before a closing quotation mark. ` +
            'Complete every sentence inside dialogue — do not leave quoted speech or narration cut off mid-clause.',
        });
        break; // one issue per chapter is enough
      }
    }
  }

  return issues;
};

// CanonicalSeason / MONTH_TO_SEASON / normalizeMonthToken now live in the shared single
// source of truth (../shared/temporal-anchor.ts). Re-exported here so the agent9-prose
// modules that `import type { CanonicalSeason } from "./lint.js"` keep resolving.
export { MONTH_TO_SEASON, normalizeMonthToken };
export type { CanonicalSeason };

/**
 * X4 (REVIEW_05 §10.6) — the rules that bind the MODEL, exported so the deterministic injectors can
 * be measured against them.
 *
 * FIX-E2 used to hold these five regexes as a local inside `lintBatchProse`, which meant the standard
 * existed in exactly one place and could be checked in exactly one direction: prose the model wrote.
 * On run `mystery-1785870981757` the story's closing sentence — *"Captain Ivor Hale was responsible;
 * the evidence allowed no other reading."* — was written by `enforceCulpritEvidencePresence`, laundered
 * by the B5 scaffold floor, and shipped. It matches the first rule below. **The linter forbids the
 * model from writing that shape and the injector writes it anyway.**
 *
 * §10.6 offers two ways out and recommends the second for now: subjecting injector output to these
 * rules and REFUSING (Option 1) converts a bad sentence into a missing one, which
 * [ADR-0003](../../../../architecture/decisions/0003-never-abort-release-gate.md) forbids for a
 * repairable defect. So the injection stands and the contradiction is RECORDED — which is also the
 * firing-rate evidence the injector-retirement work (THINK_01 Move 5) needs.
 *
 * Exported as data, not as a predicate over chapters, precisely so the same rule text can be applied
 * to a single sentence at the moment of injection.
 */
export interface ModelBoundSentenceRule {
  /** Stable id — what a telemetry line names, so a count can be tracked across runs. */
  id: string;
  pattern: RegExp;
  /** What the model is told, in the words the model is told it. */
  rule: string;
}

export const RESOLUTION_VERDICT_CLOSER_MESSAGE =
  'Resolution chapter must close with an in-scene moment (dialogue, action, or sensation), not a summary verdict sentence. Rewrite the final paragraph to end inside the scene.';

export const RESOLUTION_VERDICT_CLOSER_RULES: ReadonlyArray<ModelBoundSentenceRule> = [
  { id: 'verdict_closer.was_responsible', pattern: /^[A-Z][a-z][\w\s]+ was responsible\b/, rule: RESOLUTION_VERDICT_CLOSER_MESSAGE },
  { id: 'verdict_closer.beyond', pattern: /\bplaced the matter beyond\b/i, rule: RESOLUTION_VERDICT_CLOSER_MESSAGE },
  { id: 'verdict_closer.evidence_beyond', pattern: /\bevidence (?:confirmed|established)\b.{0,40}\bbeyond\b/i, rule: RESOLUTION_VERDICT_CLOSER_MESSAGE },
  { id: 'verdict_closer.case_closed', pattern: /\bthe case was closed\b/i, rule: RESOLUTION_VERDICT_CLOSER_MESSAGE },
  { id: 'verdict_closer.justice_served', pattern: /\bjustice had been served\b/i, rule: RESOLUTION_VERDICT_CLOSER_MESSAGE },
];

/**
 * Which model-binding rules a single sentence violates. Empty array is the normal answer and the one
 * worth reporting: a zero that is never written cannot be told apart from a check that never ran.
 *
 * The `^`-anchored rule is applied to the sentence itself. That is the point — an injected sentence is
 * appended to the END of a final paragraph, so as prose it sits mid-paragraph, and a whole-paragraph
 * check would miss the shape the linter would have caught had the model written it as the closer.
 */
export const findModelBoundRuleViolations = (
  sentence: string,
  rules: ReadonlyArray<ModelBoundSentenceRule> = RESOLUTION_VERDICT_CLOSER_RULES,
): ModelBoundSentenceRule[] => {
  const text = String(sentence ?? '').trim();
  if (!text) return [];
  return rules.filter((rule) => rule.pattern.test(text));
};

export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
export const capitalizeWord = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const deriveTemporalSeasonLock = (
  temporalContext: ProseGenerationInputs['temporalContext'] | undefined,
): { month: string; season: CanonicalSeason } | undefined => {
  const month = normalizeMonthToken(temporalContext?.specificDate?.month);
  if (!month) return undefined;

  const season = MONTH_TO_SEASON[month];
  if (!season) return undefined;

  return { month, season };
};

/** Returns the exclusive allowed-vocabulary string for the given canonical season. */
export const getSeasonAllowList = (season: CanonicalSeason | string): string => {
  const allowLists: Record<CanonicalSeason, string> = {
    autumn: 'autumn, autumnal, fall',
    winter: 'winter, wintry, midwinter',
    spring: 'spring, vernal, springtime',
    summer: 'summer, summery, midsummer',
  };
  return allowLists[season as CanonicalSeason] ?? season;
};

export interface SeasonLockRewriteOptions {
  contextAware?: boolean;
  protectedCollocations?: boolean;
  semanticDiffGuard?: boolean;
}

export interface SeasonLockTelemetry {
  replacements: number;
  protectedCollisionsBlocked: number;
  semanticDiffBlocks: number;
}

const SEASON_MONTH_CONTEXT_RE = /\b(january|february|march|april|may|june|july|august|september|october|november|december|weather|season|morning|afternoon|evening|night|dawn|dusk|midnight|rain|wind|fog|mist|storm|thunder|overcast|cloudy|sunlight|daylight|frost|snow|chill|cold|warm|humid|drizzle)\b/i;
const MECHANICAL_CONTEXT_RE = /\b(clock|pendulum|escapement|gear|gears|watch|mechanism|mainspring|main\s+spring|coil|torsion|barrel|winding|wound|spring|springs|chime|ratchet|lever)\b/i;
const SPRING_MECHANICAL_COLLOCATION_RE = /\b(main\s*spring|mainspring|suspension\s+spring|coil\s+spring|leaf\s+spring|clock\s+spring|watch\s+spring|spring\s+tension|spring\s+housing|spring\s+barrel|spring\s+mechanism|spring\s+steel|spring-loaded)\b/i;

const conflictingSeasonTerms: Record<CanonicalSeason, string[]> = {
  spring: ['summer', 'summertime', 'midsummer', 'summery', 'autumn', 'autumnal', 'winter', 'wintertime', 'wintry'],
  summer: ['spring', 'springtime', 'vernal', 'autumn', 'autumnal', 'winter', 'wintertime', 'wintry'],
  autumn: ['spring', 'springtime', 'vernal', 'summer', 'summertime', 'midsummer', 'summery', 'winter', 'wintertime', 'wintry'],
  winter: ['spring', 'springtime', 'vernal', 'summer', 'summertime', 'midsummer', 'summery', 'autumn', 'autumnal'],
};

// These patterns MUST cover every token that temporal-consistency.ts SEASON_PATTERNS can detect
// as a wrong-season match — otherwise enforceMonthSeasonLockOnChapter silently lets the word
// through and the chapter validator flags it as a contradiction on every attempt.
//
// temporal-consistency.ts canonical sets:
//   spring  → spring | springtime | vernal
//   summer  → summer | summertime | midsummer | summery
//   autumn  → autumn | autumnal          (fall removed — too ambiguous as a verb)
//   winter  → winter | wintertime | wintry
export const conflictingSeasonPatterns: Record<CanonicalSeason, RegExp[]> = {
  spring: [/\b(summer|summertime|midsummer|summery|autumn|autumnal|winter|wintertime|wintry)\b/gi],
  summer: [/\b(spring|springtime|vernal|autumn|autumnal|winter|wintertime|wintry)\b/gi],
  autumn: [/\b(spring|springtime|vernal|summer|summertime|midsummer|summery|winter|wintertime|wintry)\b/gi],
  winter: [/\b(spring|springtime|vernal|summer|summertime|midsummer|summery|autumn|autumnal)\b/gi],
};

// Module-level: avoids recreating on every chapter processed by enforceMonthSeasonLockOnChapter.
export const SEASONAL_PRESENCE_RE = /\b(spring|summer|autumn|fall|winter|january|february|march|april|may|june|july|august|september|october|november|december|rain|snow|fog|mist|frost|ice|warm|cold|chill|damp|drizzle|storm|thunder|wind|overcast|cloudy|sunny|humid)\b/i;

const isProtectedSpringContext = (windowText: string): boolean => {
  if (!/\bspring(?:time)?\b/i.test(windowText) && !/\bvernal\b/i.test(windowText)) return false;
  return SPRING_MECHANICAL_COLLOCATION_RE.test(windowText)
    || (MECHANICAL_CONTEXT_RE.test(windowText) && !SEASON_MONTH_CONTEXT_RE.test(windowText));
};

export const countMechanicalSeasonCollisions = (chapter: ProseChapter, season: CanonicalSeason): number => {
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0) return 0;
  const text = chapter.paragraphs.join(' ');
  if (!text) return 0;
  const escapedSeason = escapeRegExp(season);
  const collisionRe = new RegExp(
    `\\b(?:main\\s*spring|mainspring|suspension|coil|leaf|clock|watch|torsion|balance|pendulum|escapement)\\s+${escapedSeason}\\b` +
      `|\\b${escapedSeason}\\s+(?:tension|housing|barrel|steel|mechanism)\\b`,
    'gi',
  );
  return (text.match(collisionRe) ?? []).length;
};

export const enforceMonthSeasonLockOnChapterWithTelemetry = (
  chapter: ProseChapter,
  lock: { month: string; season: CanonicalSeason } | undefined,
  options?: SeasonLockRewriteOptions,
): { chapter: ProseChapter; telemetry: SeasonLockTelemetry } => {
  const telemetry: SeasonLockTelemetry = {
    replacements: 0,
    protectedCollisionsBlocked: 0,
    semanticDiffBlocks: 0,
  };

  if (!lock) return { chapter, telemetry };
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0) return { chapter, telemetry };

  const chapterText = chapter.paragraphs.join(' ');
  if (!SEASONAL_PRESENCE_RE.test(chapterText)) return { chapter, telemetry };

  const expectedSeason = lock.season;
  const conflictTerms = conflictingSeasonTerms[expectedSeason] ?? [];
  const contextAware = options?.contextAware === true;
  const protectedCollocations = options?.protectedCollocations === true;
  const semanticDiffGuard = options?.semanticDiffGuard === true;
  let changed = false;

  const rewritten = chapter.paragraphs.map((paragraph) => {
    let next = paragraph;
    let replacementsInParagraph = 0;

    for (const term of conflictTerms) {
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
      next = next.replace(pattern, (matched: string, offset: number, fullText: string) => {
        const windowStart = Math.max(0, offset - 80);
        const windowEnd = Math.min(fullText.length, offset + matched.length + 80);
        const contextWindow = fullText.slice(windowStart, windowEnd);

        if (contextAware && !SEASON_MONTH_CONTEXT_RE.test(contextWindow)) {
          return matched;
        }

        const isSpringToken = /^(spring|springtime|vernal)$/i.test(matched);
        if (protectedCollocations && isSpringToken && isProtectedSpringContext(contextWindow)) {
          telemetry.protectedCollisionsBlocked += 1;
          return matched;
        }

        replacementsInParagraph += 1;
        return matched.charAt(0) === matched.charAt(0).toUpperCase()
          ? capitalizeWord(expectedSeason)
          : expectedSeason;
      });
    }

    if (replacementsInParagraph <= 0) return paragraph;

    if (semanticDiffGuard) {
      const beforeHadSpringLike = /\b(spring|springtime|vernal)\b/i.test(paragraph);
      const introducedCollisions = countMechanicalSeasonCollisions({ title: chapter.title, paragraphs: [next] }, expectedSeason) > 0;
      if (beforeHadSpringLike && introducedCollisions) {
        telemetry.semanticDiffBlocks += 1;
        return paragraph;
      }
    }

    telemetry.replacements += replacementsInParagraph;
    changed = true;
    return next;
  });

  if (!changed) return { chapter, telemetry };

  return {
    chapter: {
      ...chapter,
      paragraphs: rewritten,
    },
    telemetry,
  };
};

