/**
 * agent9-prose/lint.ts
 * Prose linter (n-gram, fingerprint, entropy, template-bleed),
 * season/month lock utilities, and opening-sentence helpers.
 */
import { getGenerationParams } from "@cml/story-validation";
import { classifyOpeningStyle } from "../types/narrative-state.js";
import {
  ARC_POSITION_REGISTER,
} from "../constants/arc-position.js";
import type { ProseChapter, ProseLinterIssue, MacroArcEntry, ProseGenerationInputs } from "./types.js";
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
    /** FIX-C2: Full names of victim characters. When provided, any sentence mentioning a
     *  victim name alongside alibi-reasoning language is flagged as victim_alibi_error.
     *  Victims have no alibi — such sentences are a logic error. */
    victimNames?: string[];
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

  // Intra-chapter sentence dedup: catches sentence-level repetition within a single chapter
  // that falls below the paragraph_fingerprint_min_chars threshold (short ~60–80 char sentences).
  // Each chapter gets its own Set — cross-chapter repeats are covered by paragraph_fingerprint.
  const SENTENCE_DEDUP_MIN_CHARS = 45;
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

  // P2-H: Suspect clearance check — for any chapter carrying a clearance obligation
  // (from prose_requirements.suspect_clearance_scenes), verify the prose names the suspect
  // with elimination-adjacent vocabulary.  Failures are typed suspect_clearance_missing so
  // classifyFailure() maps them to clue_timing (rank 95) for highest-priority retry handling.
  const CLEARANCE_TERMS =
    /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;
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
    const allParagraphs = batchChapters.flatMap((ch) => ch.paragraphs ?? []);
    for (const clearance of options.matchingClearances) {
      const suspectName = clearance.suspect_name;
      const escapedName = suspectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const suspectPattern = new RegExp(`\\b${escapedName}\\b`, 'i');
      // Also match by surname alone (last word), matching SuspectClosureValidator behaviour.
      const surnameParts = suspectName.trim().split(/\s+/);
      const surname = surnameParts[surnameParts.length - 1];
      const escapedSurname = surname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const surnamePattern = new RegExp(`\\b${escapedSurname}\\b`, 'i');
      const hasCoLocatedClearance = allParagraphs.some(
        (para) =>
          (suspectPattern.test(para) || surnamePattern.test(para)) &&
          CLEARANCE_TERMS.test(para) &&
          CLEARANCE_EVIDENCE_TERMS.test(para)
      );
      if (!hasCoLocatedClearance) {
        issues.push({
          type: "suspect_clearance_missing",
          message: `Clue obligation: suspect clearance missing for "${suspectName}". ` +
            `This chapter must include a paragraph that (a) names "${suspectName}" explicitly, ` +
            `(b) contains a clearance phrase (e.g. "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have"), ` +
            `AND (c) contains an evidence connector (e.g. "because", "therefore", "which proves", "alibi", "timeline", "evidence"). ` +
            `Example: "${suspectName}'s alibi was confirmed because multiple witnesses saw them in [location] at the time." ` +
            `Do not split the clearance across separate paragraphs.`,
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
  const DEBUG_NOTE_PATTERNS: RegExp[] = [
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
        if (pattern.test(paragraph)) {
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
      const VERDICT_CLOSER_RE = [
        /^[A-Z][a-z][\w\s]+ was responsible\b/,
        /\bplaced the matter beyond\b/i,
        /\bevidence (?:confirmed|established)\b.{0,40}\bbeyond\b/i,
        /\bthe case was closed\b/i,
        /\bjustice had been served\b/i,
      ];
      for (const chapter of batchChapters) {
        const paras = chapter.paragraphs ?? [];
        const finalPara = paras[paras.length - 1] ?? '';
        if (VERDICT_CLOSER_RE.some((re) => re.test(finalPara))) {
          issues.push({
            type: 'debug_note_bleed',
            message: 'Resolution chapter must close with an in-scene moment (dialogue, action, or sensation), not a summary verdict sentence. Rewrite the final paragraph to end inside the scene.',
          });
          break;
        }
      }
    }
  }

  // [PHASE 5] Structural archetype validator — mustNotContain check disabled (false positives
  // from common mystery words). Archetype contracts are enforced via prompt injection only.

  return issues;
};

export type CanonicalSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export const MONTH_TO_SEASON: Record<string, CanonicalSeason> = {
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
export const normalizeMonthToken = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normal = value.trim().toLowerCase();
  return normal.length > 0 ? normal : undefined;
};

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

export const enforceMonthSeasonLockOnChapter = (
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
  // P1-4: Restore lightweight guard — skip the regex scan entirely when the chapter contains
  // no seasonal or weather vocabulary at all. This prevents non-seasonal uses of season words
  // ("summer residence", "winter of their years") from being silently replaced on every chapter.
  if (!SEASONAL_PRESENCE_RE.test(chapterText)) return chapter;
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
