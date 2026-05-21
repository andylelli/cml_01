/**
 * agent9-prose/generate.ts
 * Core prose generation loop: generateProse() orchestrator, batch scoring,
 * retry feedback, victim-alive detection, and pronoun-error extraction.
 */
import { createHash } from "node:crypto";
import { jsonrepair } from "jsonrepair";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import {
  ChapterValidator,
  CharacterConsistencyValidator,
  getGenerationParams,
  getStoryLengthTarget,
  repairChapterPronouns,
  repairPronouns,
} from "@cml/story-validation";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { CastDesign } from "../agent2-cast.js";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import type { NarrativeState } from "../types/narrative-state.js";
import { classifyOpeningStyle, initNarrativeState, updateNSD } from "../types/narrative-state.js";
import { buildAssetLibrary, selectChapterAtoms } from "../asset-library.js";
import type { AssetLibrary } from "../types/asset-library.js";
import {
  buildProseRequestContract,
  validateRequestContract,
} from "../contracts/prose-request-contract.js";
import type { BatchCommitRecord, BatchGateName } from "../contracts/batch-commit-record.js";
import {
  buildRetryFeedback,
  classifyFailure,
  shouldContinueRetry,
} from "../retry-protocol.js";
import type { RetryPacket } from "../retry-protocol.js";
import {
  ARC_POSITION_REGISTER,
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  countWords,
  getChapterWordTargets,
  getPromptPreferredWords,
  getAgent9CostTotal,
  ALL_BATCH_GATES,
  initBatchGateFailureCounts,
  inferBatchGatesFromError,
  noteBatchGateFailures,
  buildBatchGateOutcomes,
  CLUE_TOKEN_STOPWORDS,
  tokenizeForClueObligation,
  isBehaviouralClue,
  isDeliveryMethodLabel,
  tokenMatchesText,
  getRequiredClueIdsForScene,
  buildChapterRequirementLedger,
  chapterMentionsRequiredClue,
  validateChapterPreCommitObligations,
  RESOLUTION_RE,
  buildResolutionBackstopSentence,
} from "./clue-validation.js";
import {
  tokenizeWords,
  toNgrams,
  jaccardSimilarity,
  lintBatchProse,
  capitalizeWord,
  MONTH_TO_SEASON,
  deriveTemporalSeasonLock,
  getSeasonAllowList,
  enforceMonthSeasonLockOnChapter,
} from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import {
  sanitizeScenesCharacters,
  sanitizeGeneratedChapter,
  enforceMinimumParagraphStructure,
  normalizeProseCastOrThrow,
  stripAuditField,
  parseProseResponse,
} from "./sanitization.js";
import {
  extractBeatFingerprints,
  detectRecurringPhrases,
  buildIdentityMap,
  tagCharacter,
  selectSensoryVariant,
} from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { buildChapterObligationBlock } from "./obligation-block.js";
import { buildProsePrompt, resolveVictimName } from "./prompt-builder.js";
import { stripLocationParagraphs } from "./prompt-blocks.js";
import {
  extractChapterSummary,
  buildContinuityContext,
  buildStoryToDateBlock,
  buildSceneGroundingChecklist,
} from "./context-management.js";
import { buildDiscriminatingTestChecklist } from "./discriminating.js";
import {
  attemptUnderflowExpansion,
  runAtmosphereRepairIfNeeded,
} from "./repair.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
  ProseGenerationResult,
  ProseLinterStats,
  ProseLinterIssue,
  ChapterRequirementLedgerEntry,
  UnderflowTelemetry,
} from "./types.js";

export const chunkScenes = (scenes: unknown[], chunkSize: number) => {
  const batches: unknown[][] = [];
  for (let i = 0; i < scenes.length; i += chunkSize) {
    batches.push(scenes.slice(i, i + chunkSize));
  }
  return batches;
};


export function extractAndStripUsedAssets(rawResponse: string): {
  prose: string;
  usedAssetIds: string[];
} {
  const match = rawResponse.match(/<used_assets>([\s\S]*?)<\/used_assets>/i);
  const usedAssetIds = match
    ? match[1].split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const prose = rawResponse.replace(/<used_assets>[\s\S]*?<\/used_assets>/gi, '').trimEnd();
  return { prose, usedAssetIds };
}


export interface ProvisionalChapterScore {
  chapter: number;
  score: number;
  deficits: string[];
  directives: string[];
}

export const buildProvisionalChapterScore = (
  chapter: ProseChapter,
  chapterNumber: number,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  contentIssues: Array<{ message: string; severity?: string }>,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
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
    if (chapterMentionsRequiredClue(chapterText, clueId, clueDistribution, castNames)) return true;
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
    // Mirror the real validator thresholds: behavioural clues at 0.35, factual at 0.55.
    const isBehavioural = isBehaviouralClue(ctx.description);
    const threshold = tokens.length <= 4 ? 1 : Math.max(1, Math.ceil(tokens.length * (isBehavioural ? 0.35 : 0.55)));
    return tokens.filter((t) => tokenMatchesText(t, lowered)).length >= threshold;
  });
  const matchedClueSet = new Set(matchedClues);
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
    const missing = requiredClues.filter((clueId) => !matchedClueSet.has(clueId));
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

export const validateChapterCount = (chapters: ProseChapter[], expected: number) => {
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

export const sanitizeForContentPolicy = (text: string): string => {
  const words = text.trim().split(/\s+/);
  if (words.length <= 12) return text; // short enough — show as-is
  const head = words.slice(0, 6).join(' ');
  const tail = words.slice(-6).join(' ');
  return `${head} ... ${tail}`;
};

/**
 * Scans generated paragraphs for the victim's name co-occurring with a present-tense
 * active verb — a deterministic signal that the victim was written as alive.
 * Only used for chapters 2+ (caller must guard chapterNumber > 1).
 */
export const detectVictimAlive = (chapter: { paragraphs?: string[] }, victimName: string): string[] => {
  if (!victimName || !chapter?.paragraphs) return [];
  const nameLower = victimName.toLowerCase();
  // Fix 1: Expanded to include simple-past tense forms (said, stood, walked, spoke, etc.)
  // and additional present-tense verbs (summons, gestures, examines, moves, appears, etc.)
  // that the original pattern missed.  Also catches "is/was [verb]-ing" progressive forms.
  const presentVerbPattern = /\b(says?|said|asks?|asked|enters?|entered|sits?|sat|stands?|stood|nods?|nodded|walks?|walked|cross(?:es)?|crossed|confirms?|confirmed|turns?|turned|looks?|looked|speaks?|spoke|reacts?|reacted|replies?|replied|responds?|responded|moves?|moved|appears?|appeared|summons?|summoned|gestures?|gestured|examines?|examined|glances?|glanced|watches?|watched|smiles?|smiled|rises?|rose|steps?|stepped|laughs?|laughed|leans?|leaned|reads?|read|writes?|wrote|listens?|listened|points?|pointed|opens?|opened|closes?|closed|hands?|handed|pushes?|pushed|pulls?|pulled|is\s+(?:\w+ing)|was\s+(?:\w+ing))\b/i;
  const offendingParagraphs: string[] = [];
  for (const para of chapter.paragraphs) {
    // Split to sentences so the victim's name and present-tense verb must co-occur in the
    // SAME sentence — avoids false positives where the name is possessive/past-tense in one
    // sentence and a living character's verb appears elsewhere in the same paragraph.
    const sentences = para.match(/[^.!?]+[.!?]*/g) ?? [para];
    const hit = sentences.some(s => s.toLowerCase().includes(nameLower) && presentVerbPattern.test(s));
    if (hit) offendingParagraphs.push(para);
  }
  return offendingParagraphs;
};

/**
 * Build enhanced, categorized retry feedback
 * Helps LLM understand exactly what to fix
 */
/**
 * TYPE 2 (Pronoun Drift): Scan chapter texts for sentences that still contain
 * wrong-gender pronouns for a named character after the repair pass.
 * Used by buildEnhancedRetryFeedback to quote specific offending sentences in retry feedback.
 */
export function extractPronounOffendingSentences(texts: string[], characterName: string, wrongPronounsStr: string): string[] {
  const wrongPronouns = wrongPronounsStr.split(/[,\s]+/).map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (!wrongPronouns.length) return [];
  const pattern = new RegExp(`\\b(${wrongPronouns.join('|')})\\b`, 'i');
  const nameParts = characterName.trim().split(/\s+/).map((p) => p.toLowerCase());
  const offending: string[] = [];
  for (const text of texts) {
    const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.length > 400) continue; // skip very long runs — probably concatenated
      const sLow = sentence.toLowerCase();
      const hasName = nameParts.some((part) => sLow.includes(part));
      if (hasName && pattern.test(sentence)) {
        offending.push(sentence);
      }
    }
  }
  return Array.from(new Set(offending));
}

export const buildEnhancedRetryFeedback = (
  errors: string[],
  caseData: CaseData,
  chapterRange: string,
  attempt: number,
  maxAttempts: number,
  options?: {
    /** Pillar 6 (Unit 6.2): Full linter issue objects from the failed batch.
     *  When a paragraph_fingerprint issue has matchingPriorParagraph set and
     *  enableSurgicalFingerprintRetry is true, injects a BANNED PARAGRAPH block. */
    linterIssues?: ProseLinterIssue[];
    enableSurgicalFingerprintRetry?: boolean;
    /** All paragraphs from prior committed chapters. When fingerprint/ngram has been
     *  detected, injected as a comprehensive "DO NOT REPRODUCE" lock to prevent the
     *  whack-a-mole pattern where the model cycles through different source paragraphs. */
    priorChapterParagraphs?: string[];
    /** TYPE 2: Chapter texts from the failed batch (post-repair). Used to quote specific
     *  offending sentences in pronoun error feedback so the LLM knows exactly which
     *  sentences to fix, rather than getting a general "found: her, she" message. */
    lastBatchChapterTexts?: string[];
    /** LLM-facing preferred word count for this chapter batch (chapter_ideal_words * word_target_multiplier).
     *  When set, n-gram and fingerprint retry directives reinforce this target so the model does not
     *  shrink the chapter while rephrasing away overlap issues. Use the prompt target, NOT the
     *  validation floor — the goal is to keep the LLM writing at the aspirational level. */
    promptTargetWords?: number;
  },
): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const cast = cmlCase.cast || [];
  const castNames = cast.map((c: any) => c.name);
  // CASE.meta.setting has location, place, country, institution — no location_type field.
  // Use the location name for setting-specific retry guidance.
  const locationType = cmlCase.meta?.setting?.location || '';
  
  // Categorize errors — clue errors must be separated FIRST to prevent them from
  // falling into qualityErrors (which matches anything containing "chapter").
  // Use both description-based phrases AND the structured clue ID pattern (clue_[a-z_]+)
  // so errors are matched regardless of whether the description or ID appears in the string.
  const clueValidationErrors = errors.filter(e => {
    const lc = e.toLowerCase();
    return /\bclue_[a-z_]+\b/.test(e) ||
      lc.includes('clue evidence') || lc.includes('clue obligation') || lc.includes('clue visibility') || lc.includes('missing required clue');
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
    e.toLowerCase().includes('pronoun drift') || // BUG-5 FIX: systematic-drift errors were falling into otherErrors
    /incorrect pronoun|wrong pronoun|should use he|should use she|should use they/i.test(e)
  ));
  const characterErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    (e.toLowerCase().includes('character') || e.toLowerCase().includes('name'))
  );
  // Use specific patterns for setting-drift messages rather than broad includes('setting'),
  // because "metadata key-value leakage (e.g. \"Setting:\", \"Mood:\")" also contains the
  // word "setting" in its example text, which would mis-bucket it here instead of templateErrors.
  const settingErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) &&
    (/setting drift|setting markers/i.test(e) || e.toLowerCase().includes('location'))
  );
  const testErrors = errors.filter(e => !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && e.toLowerCase().includes('discriminating test'));
  // Word-count errors contain "chapter" so they would otherwise match qualityErrors and receive
  // misleading "vary paragraph lengths" guidance. Extract them first; the MICRO-PROMPT [word_count]
  // directive in buildRetryMicroPromptDirectives already gives the correct repair instruction.
  const wordCountErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) &&
    /word count below/i.test(e)
  );
  // Template-linter errors (n-gram overlap, paragraph fingerprint, opening-style entropy, and
  // chapter-validator scaffold/metadata/meta-language leakage) are extracted BEFORE qualityErrors
  // because several of them contain the words "paragraph" or "chapter" and would otherwise fall
  // into qualityErrors, where they receive wrong advice ("vary paragraph lengths").
  const templateErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    (/template linter/i.test(e) ||
      /templated scaffold prose|metadata key-value leakage|meta-language about storytelling/i.test(e))
  );
  const qualityErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) && !wordCountErrors.includes(e) && !templateErrors.includes(e) &&
    !/^VICTIM ALIVE:/i.test(e) &&
    !/weak sensory grounding/i.test(e) &&  // handled by REPAIR [sensory_grounding] micro-prompt
    (e.toLowerCase().includes('paragraph') || e.toLowerCase().includes('chapter'))
  );
  const victimAliveErrors = errors.filter(e => e.includes('VICTIM ALIVE:'));
  const otherErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) && // [PHASE 2]
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    !templateErrors.includes(e) &&
    !qualityErrors.includes(e) &&
    !victimAliveErrors.includes(e)
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
      // Extract per-clue details from each error string. The error format is:
      //   Chapter N: clue evidence "DESCRIPTION" is absent. Include an on-page observation
      //   of "DESCRIPTION" (this clue reveals: REVEAL_TEXT) in the first 2 paragraphs...
      // Both description and reveal are available — use both in the directive so the
      // inference paragraph is grounded in the specific significance of the clue.
      const extractClueDetails = (err: string): { description: string; reveal: string } => {
        const descMatch = err.match(/clue evidence "([^"]+)"/);
        const revealMatch = err.match(/\(this clue reveals:\s*([^)]+)\)/i);
        return {
          description: descMatch ? descMatch[1].trim() : err,
          reveal: revealMatch ? revealMatch[1].trim() : '',
        };
      };

      const absentClueDetails = [...clueAbsentErrors, ...otherClueErrors].map(extractClueDetails);
      const clueCount = absentClueDetails.length;

      // Escalation tier is relative to remaining attempts so the directive strength
      // always matches how many retries are left, regardless of maxAttempts config value.
      // retriesRemaining >= 2 → early standard guidance with per-clue pairs
      // retriesRemaining === 1 → penultimate: explicit Paragraph A/B per clue
      // retriesRemaining === 0 → final: mandatory within-300-word block per clue
      const retriesRemaining = maxAttempts - attemptNum;
      if (retriesRemaining >= 2) {
        const header = clueCount === 1
          ? `chapters ${rangeLabel} are missing 1 clue.`
          : `chapters ${rangeLabel} are missing ${clueCount} clues.`;
        let body = `\n  For EACH missing clue below, insert a two-paragraph block near the beginning of the chapter:\n`;
        absentClueDetails.forEach(({ description, reveal }, i) => {
          const clueLabel = clueCount > 1 ? `  [Clue ${i + 1}]: "${description}"` : `  Clue: "${description}"`;
          const inferenceText = reveal
            ? `state explicitly: "${reveal}". `
            : `state what this implies — who it implicates, what is suspicious, or what inference it supports. `;
          body +=
            `${clueLabel}\n` +
            `  • Observation paragraph: A character directly observes or discovers this evidence. Be specific and sensory — describe what is seen, touched, or heard. Include the exact quoted phrase verbatim.\n` +
            `  • Inference paragraph (immediately after): The detective or POV character ${inferenceText}Use first-person inference language ("She realised...", "He could not help but notice..."). This must be a full separate paragraph, not a tacked-on sentence.\n`;
        });
        body += `  Do not bury the evidence in atmosphere or background dialogue.`;
        directives.push(`REPAIR [clue_visibility — attempt ${attemptNum}]: ${header}${body}`);
      } else if (retriesRemaining === 1) {
        let body = `\n  You MUST include the following two-paragraph sequence(s) in the first quarter of the chapter:\n`;
        absentClueDetails.forEach(({ description, reveal }, i) => {
          const clueLabel = clueCount > 1 ? `  [Clue ${i + 1}]: "${description}"` : `  Clue: "${description}"`;
          const inferenceText = reveal
            ? `explicitly state: "${reveal}".`
            : `explicitly state what this evidence implies and who it implicates.`;
          body +=
            `${clueLabel}\n` +
            `  Paragraph A: The character physically approaches, examines, or directly perceives this evidence. Write as a present-action beat, not a recalled memory. Include the exact quoted phrase verbatim.\n` +
            `  Paragraph B (immediately after Paragraph A): The detective or POV character ${inferenceText} Use first-person inference language ("She realised...", "He could not help but wonder..."). Full separate paragraph — not a tacked-on sentence.\n`;
        });
        body += `  The chapter must be at least 1450 words. Use action, inference, and sensory grounding to expand — not recap.`;
        directives.push(`REPAIR [clue_visibility — attempt ${attemptNum} — PARAGRAPH STRUCTURE REQUIRED]: ${clueCount} clue(s) still missing.${body}`);
      } else {
        let body = `\n  WITHIN THE FIRST 300 WORDS of the chapter, place the following block(s):\n`;
        absentClueDetails.forEach(({ description, reveal }, i) => {
          const clueLabel = clueCount > 1 ? `  [Clue ${i + 1}]: "${description}"` : `  Clue: "${description}"`;
          const inferenceText = reveal
            ? `The character must state in their own words: "${reveal}".`
            : `The character must state explicitly that this evidence was manipulated, timed, or points to a specific suspect.`;
          body +=
            `${clueLabel}\n` +
            `  Block paragraph 1: Direct physical observation of the evidence by the POV character. Include the exact quoted phrase verbatim. Show, do not summarise.\n` +
            `  Block paragraph 2: ${inferenceText}\n`;
        });
        body +=
          `  After all blocks, continue the chapter normally to reach at least 1500 words.\n` +
          `  REBUILD the chapter from scratch — do not patch or preserve prior wording. All prior text is discarded.`;
        directives.push(`REPAIR [clue_visibility — attempt ${attemptNum} — FINAL MANDATORY BLOCK]: ${clueCount} clue(s) have failed every prior attempt.${body}`);
      }
    }

    const wordCountError = rawErrors.find((error) => /word count below (hard floor|preferred target|minimum)/i.test(error));
    if (wordCountError) {
      const match = wordCountError.match(/\((\d+)\/(\d+)\)/);
      const currentWords = match ? Number(match[1]) : undefined;
      const targetWords = match ? Number(match[2]) : undefined;
      const gap = (Number.isFinite(targetWords) && Number.isFinite(currentWords)) ? targetWords! - currentWords! : undefined;
      const retriesRemaining = maxAttempts - attemptNum;

      if (retriesRemaining >= 2) {
        // Early attempt: generic guidance, model has room to self-correct.
        const guidance = Number.isFinite(targetWords)
          ? `Raise chapter length to at least ${targetWords} words${Number.isFinite(currentWords) ? ` (currently ${currentWords})` : ""}.`
          : "Increase chapter length to satisfy minimum word threshold.";
        directives.push(
          `MICRO-PROMPT [word_count]: ${guidance} Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.`
        );
      } else if (retriesRemaining === 1) {
        // Penultimate attempt: prescribe the exact number of paragraphs and beat types.
        const paraEstimate = gap ? Math.max(2, Math.ceil(gap / 180)) : 3;
        const wordTarget = targetWords ?? 'the minimum';
        const currentStr = Number.isFinite(currentWords) ? ` (currently ${currentWords} words)` : '';
        directives.push(
          `REPAIR [word_count \u2014 attempt ${attemptNum} \u2014 ADD ${paraEstimate} PARAGRAPHS]: Chapter is still short${currentStr}. You MUST reach ${wordTarget} words.\n` +
          `  Add exactly ${paraEstimate} full paragraphs (80\u2013200 words each). Choose beats from:\n` +
          `  \u2022 A dialogue exchange where a character reveals, deflects, or challenges a suspicion\n` +
          `  \u2022 A physical search of the scene with specific sensory detail (tactile, olfactory, visual \u2014 not generic atmosphere)\n` +
          `  \u2022 The POV character's internal reasoning paragraph \u2014 what does this evidence imply? Who does it implicate?\n` +
          `  Do NOT add recap sentences. Every new paragraph must advance scene action or reveal character information.`
        );
      } else {
        // Final attempt: full rebuild mandate with explicit word target.
        const wordTarget = targetWords ?? 'the minimum';
        directives.push(
          `REPAIR [word_count \u2014 attempt ${attemptNum} \u2014 FINAL: REBUILD TO ${wordTarget} WORDS]: Word count has failed every prior attempt.\n` +
          `  REBUILD from scratch. Do not patch the prior draft.\n` +
          `  Write the chapter in full. Target: ${wordTarget} words minimum. Cover ALL of:\n` +
          `  (1) Scene opening with named location + atmosphere (1\u20132 paragraphs)\n` +
          `  (2) At least two character interactions (dialogue or action)\n` +
          `  (3) All required evidence observations\n` +
          `  (4) At least one explicit inference paragraph where a character reasons about the evidence\n` +
          `  Do not submit until the chapter is at least ${wordTarget} words.`
        );
      }
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

    // Sensory-grounding failure: chapter-validator checks paragraph 1+2 for ≥2 terms from a
    // specific vocabulary list. The generic "include sensory details" instruction fails every
    // time because the model doesn't know which terms are counted. Give the exact list + position.
    const sensoryGroundingError = rawErrors.find((e) => /weak sensory grounding/i.test(e));
    if (sensoryGroundingError) {
      const foundMatch = sensoryGroundingError.match(/\((\d+) sensory markers? found\)/i);
      const foundCount = foundMatch ? Number(foundMatch[1]) : 0;
      const needed = 2 - foundCount;
      const retriesRemaining = maxAttempts - attemptNum;
      if (retriesRemaining >= 2) {
        directives.push(
          `REPAIR [sensory_grounding — attempt ${attemptNum}]: The opening block (first 2 paragraphs) has only ${foundCount} sensory marker(s). Need at least 2.\n` +
          `  In paragraph 1 or 2, add ${needed} more word(s) from the EXACT list the validator counts:\n` +
          `  • Smell/scent: smell, scent, odor, fragrance\n` +
          `  • Sound: sound, echo, silence, whisper, creak\n` +
          `  • Tactile: cold, warm, damp, rough, smooth\n` +
          `  • Visual/light: glow, shadow, flicker, dim\n` +
          `  Use these words naturally in a sentence — e.g. "The cold of the hallway pressed against her cheeks" or "A creak from the floorboards above broke the silence."\n` +
          `  Do NOT use synonyms like 'chill' or 'murmur' — they are not counted.`
        );
      } else if (retriesRemaining === 1) {
        directives.push(
          `REPAIR [sensory_grounding — attempt ${attemptNum} — EXPLICIT INSERTION REQUIRED]: Opening still has only ${foundCount} sensory marker(s) after ${attemptNum - 1} attempt(s).\n` +
          `  REWRITE paragraph 1 to include at least two of these exact words:\n` +
          `    smell / scent / odor / fragrance / sound / echo / silence / whisper / creak / cold / warm / damp / rough / smooth / glow / shadow / flicker / dim\n` +
          `  Example opening: "The cold air of the drawing room carried the faint scent of cigarette ash, and the shadow of the curtain flickered in the draught from the hall."\n` +
          `  These words must appear in paragraph 1 or paragraph 2 — not later in the chapter.`
        );
      } else {
        directives.push(
          `REPAIR [sensory_grounding — attempt ${attemptNum} — FINAL: REWRITE OPENING PARAGRAPH]: Sensory grounding has failed every prior attempt.\n` +
          `  Replace paragraph 1 entirely with the following structure:\n` +
          `  "[Named location]. [One sentence with a sound or tactile word from: cold/warm/damp/rough/smooth/sound/echo/silence/whisper/creak]. [One sentence with a visual or smell word from: glow/shadow/flicker/dim/smell/scent/odor/fragrance]."\n` +
          `  Example: "The library was cold, the faint scent of old paper hanging in the dim afternoon light."\n` +
          `  Two sensory words from the approved list must appear in the first two paragraphs. Do not use synonyms.`
        );
      }
    }

    // Atmosphere/time grounding failure: chapter-validator checks paragraph 1+2 for ≥1 term
    // from a specific vocabulary list. Give the exact list so the LLM doesn't use synonyms.
    const atmosphereGroundingError = rawErrors.find((e) => /weak atmosphere\/time grounding/i.test(e));
    if (atmosphereGroundingError) {
      const retriesRemaining = maxAttempts - attemptNum;
      if (retriesRemaining >= 1) {
        directives.push(
          `REPAIR [atmosphere_grounding — attempt ${attemptNum}]: The opening block (first 2 paragraphs) is missing an atmosphere/time marker. Need at least 1.\n` +
          `  In paragraph 1 or 2, use ONE or more words from this EXACT list — synonyms are NOT counted:\n` +
          `  • Weather: rain, wind, fog, storm, mist, thunder\n` +
          `  • Time of day: evening, morning, night, dawn, dusk, afternoon, midday, noon, midnight, twilight, sunrise, sunset\n` +
          `  • Light/sky: daylight, sunlight, overcast, cloudy, bright, grey, gray, dark, light\n` +
          `  • Season: season\n` +
          `  Example: "Morning light filtered through the fog-draped windows." or "The night air was still."\n` +
          `  One word from the list above must appear in paragraph 1 or paragraph 2. Do NOT use synonyms like 'dusk-like' or 'nighttime' — only the exact words listed count.`
        );
      } else {
        directives.push(
          `REPAIR [atmosphere_grounding — attempt ${attemptNum} — FINAL: INSERT TIME/WEATHER WORD]: Opening still missing atmosphere/time marker.\n` +
          `  Rewrite paragraph 1 to begin with a time or weather anchor. Choose exactly one from:\n` +
          `    rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / grey / gray / dark / light\n` +
          `  Example paragraph 1: "Morning arrived grey and overcast, the fog pressing close against the windows of the manor." \n` +
          `  The chosen word must appear in the first two paragraphs. Do not use any synonym not on this list.`
        );
      }
    }

    // Generic location-anchoring and setting-fidelity fallback — only fires when
    // the error is NOT a sensory-grounding or atmosphere-grounding failure (those are handled above).
    const groundingErrors = loweredErrors.some((error) =>
      (error.includes("scene location anchoring") || error.includes("grounding") || error.includes("setting fidelity")) &&
      !error.includes("weak sensory grounding") &&
      !error.includes("weak atmosphere")
    );
    if (groundingErrors) {
      directives.push(
        `MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats.`
      );
    }

    const entropyError = rawErrors.find((e) => /opening-style entropy too low/i.test(e));
    if (entropyError && attemptNum < maxAttempts) {
      if (attemptNum >= 3) {
        // After two failed attempts to vary the opening, mandate spoken dialogue exclusively.
        // Offering 5 structural choices allows the model to keep picking the same bucket.
        directives.push(
          `REPAIR [opening_style — attempt ${attemptNum} — MANDATORY DIALOGUE OPEN]: Opening-style entropy has failed on ${attemptNum - 1} prior attempt(s). You MUST open with SPOKEN DIALOGUE as the absolute first sentence.\n` +
          `  The very first character in your prose MUST be a quotation mark ("). Examples:\n` +
          `  • "I cannot believe she is gone," Dr. Finch said, her voice barely above a whisper.\n` +
          `  • "The clock was stopped deliberately," Beatrice said flatly, setting the evidence on the table.\n` +
          `  • "Where were you between nine and eleven?" she asked, fixing him with a steady gaze.\n` +
          `  Any opening that does not start with a quotation mark will fail validation. Do not begin with description, atmosphere, or a character name.`
        );
      } else {
        directives.push(
          `REPAIR [opening_style]: This chapter opens with the same sentence pattern as prior chapters (entropy too low).\n` +
          `  You MUST begin the FIRST SENTENCE of this chapter with a structurally different type. Choose ONE of:\n` +
          `  • Spoken dialogue — open with a character speaking: \'"[words]," said/asked [Name].\'\n` +
          `  • Time anchor — open with a specific time: \'That morning...\' or \'By the time dawn broke...\' or \'It was nearing four o\'clock.\'\n` +
          `  • Character in motion — ONE named character acts first: \'[Name] crossed/turned/moved/stepped/approached/examined/glanced/rose/returned [the/to/into]...\'\n` +
          `  • Noun-phrase atmosphere with a genitive: \'The [noun] of the [place]...\' or \'A [noun] in the [place]...\'\n` +
          `  • Temporal subordinate — begin with a time clause: \'When.../After.../Before.../As [Name]...\'\n` +
          `  Do NOT open with a general descriptive sentence (e.g., \'The dark room...\' or \'Silence filled the hall...\' or \'The air was heavy..\'). The very first sentence must be one of the five types above.`
        );
      }
    }

    // N-gram overlap and paragraph fingerprint: both indicate the prose recycles phrasing
    // from prior chapters. Escalate with decreasing degrees of freedom on each attempt so
    // later retries are tightly prescribed rather than heavily prompted.
    const ngramOverlapError = rawErrors.find((e) => /high n-gram overlap/i.test(e));
    const fingerprintError = rawErrors.find((e) => /repeated long paragraph fingerprint/i.test(e));
    if (ngramOverlapError || fingerprintError) {
      const retriesRemaining = maxAttempts - attemptNum;
      if (retriesRemaining >= 2) {
        directives.push(
          `REPAIR [template_overlap — attempt ${attemptNum}]: Your prose shares too many repeated phrases with earlier chapters.\n` +
          `  Rewrite EVERY paragraph from scratch — do not preserve or lightly rephrase any sentence that appeared in a prior chapter.\n` +
          `  Each paragraph must be unique to this chapter's scene: who is present, what specific object or clue is examined, what tension emerges.\n` +
          `  Start each paragraph with a structurally different sentence type (action, dialogue, sensory observation, time-anchor — never a generic atmospheric statement).`
        );
      } else if (retriesRemaining === 1) {
        directives.push(
          `REPAIR [template_overlap — attempt ${attemptNum} — PARAGRAPH-BY-PARAGRAPH REBUILD]: Repeated phrasing still detected after ${attemptNum - 1} attempt(s).\n` +
          `  Treat the prior draft as DISCARDED. Write each paragraph in this explicit order:\n` +
          `  Para 1: A named character performs a specific physical action — NOT atmospheric description.\n` +
          `  Para 2: A new piece of information enters through dialogue or direct observation — unique to this scene.\n` +
          `  Para 3+: Continue with the scene's specific events. Vary sentence length: mix 1-sentence paragraphs with 5–6 sentence paragraphs.\n` +
          `  Do NOT reuse any sentence structure from the prior attempt. Begin each sentence with a different subject or clause type.`
        );
      } else {
        directives.push(
          `REPAIR [template_overlap — attempt ${attemptNum} — FINAL: DISCARD PRIOR DRAFT]: Template overlap detected on every prior attempt.\n` +
          `  REBUILD completely. The prior text is discarded.\n` +
          `  Write using THIS structure: (1) open with spoken dialogue, (2) describe one specific physical object in sensory detail, (3) advance the plot with a character decision or revelation, (4) close with an unanswered question or stated suspicion.\n` +
          `  No sentence may share a first word with any sentence used in the prior ${attemptNum - 1} attempt(s) of this chapter.`
        );
      }
      // P3-C: when template overlap and clue timing co-occur, ease constraint pressure by
      // permitting clue delivery across multiple paragraphs rather than forcing it to paragraph 1.
      // Trying to hit an exact placement while avoiding all repeated phrasing is the root cause
      // of the congestion spiral that exhausts retries without resolving either failure.
      const hasClueTimingError = rawErrors.some(
        (e) => /clue obligation|clue evidence|clue timing|missing required clue/i.test(e),
      );
      if (hasClueTimingError) {
        directives.push(
          `PLACEMENT RELIEF [template+clue co-occurrence — attempt ${attemptNum}]: Both a template overlap AND a clue obligation failure were detected.\n` +
          `  Do NOT force every required clue into a single paragraph — you may spread clue delivery across 2\u20133 paragraphs or reveal clues through dialogue.\n` +
          `  Priority: write EVERY paragraph as entirely fresh prose first. Then weave in clue details as natural observations or conversations.\n` +
          `  A chapter that avoids template repetition but omits a clue can be corrected on the next retry. ` +
          `A chapter that copies prior prose to satisfy a clue will fail the template check immediately.`
        );
      }
      // Word count floor: rephrasing to fix template overlap must not shrink the chapter below the
      // hard floor. Without this constraint, models progressively shorten text across retries while
      // trying to avoid repeated phrases, ultimately failing the word count check.
      if (options?.promptTargetWords && options.promptTargetWords > 0) {
        directives.push(
          `WORD COUNT TARGET [template_overlap — attempt ${attemptNum}]: While rephrasing for uniqueness, you MUST write at least ${options.promptTargetWords} words.\n` +
          `  Do NOT shorten this chapter. A rewrite significantly shorter than ${options.promptTargetWords} words will fail validation.\n` +
          `  Expand with additional investigation beats, character reactions, or sensory detail — do not cut content to achieve variety.`
        );
      }
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
      const genderLabel = gender === 'male' ? 'MALE' : 'FEMALE';

      // TYPE 2: Quote specific offending sentences from the failed chapter text.
      let offendingBlock = '';
      if (options?.lastBatchChapterTexts?.length) {
        const offendingSentences = extractPronounOffendingSentences(options.lastBatchChapterTexts, name, wrongPronouns);
        if (offendingSentences.length > 0) {
          offendingBlock = `\n     Exact sentences to fix:\n` +
            offendingSentences.slice(0, 3).map((s) => `       → "${s}"`).join('\n');
        }
      }

      return (
        `  ⚠️ ${name} is ${genderLabel} — use "${correctPronounSet}" ONLY.\n` +
        `     You wrote: ${wrongPronouns} — these are WRONG for this character.\n` +
        `     Every time "${name}" appears: ${correctPronounSet}. No exceptions.` +
        offendingBlock
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

    // On second+ attempt with pronoun errors, emit the full canonical pronoun table for all
    // characters — targeted one-line directives alone have not fixed the problem at this point.
    if (attempt >= 2) {
      const pronounTable = cast
        .filter((c: any) => c.name && ['male', 'female'].includes(String(c.gender ?? '').toLowerCase()))
        .map((c: any) => {
          const g = String(c.gender).toLowerCase();
          const subj = g === 'male' ? 'he' : 'she';
          const obj  = g === 'male' ? 'him' : 'her';
          const poss = g === 'male' ? 'his' : 'her';
          return `  ${c.name.padEnd(24)} ${g.toUpperCase().padEnd(8)} ${subj} / ${obj} / ${poss}`;
        })
        .join('\n');
      if (pronounTable) {
        feedback += `📋 FULL CAST PRONOUN TABLE (attempt ${attempt} — use this as a reference for every pronoun in your draft):\n`;
        feedback += `${'  NAME'.padEnd(26)}${'GENDER'.padEnd(10)}PRONOUNS\n`;
        feedback += `${'  '.padEnd(26)}${''.padEnd(10)}subject / object / possessive\n`;
        feedback += `${pronounTable}\n\n`;
        feedback += `⛔ Any pronoun not matching the table above is WRONG. Fix before submitting.\n\n`;
      }
    }
  }

  if (victimAliveErrors.length > 0) {
    feedback += `═══ ⛔ VICTIM ALIVE ERRORS (${victimAliveErrors.length}) ═══\n`;
    feedback += `The murder victim appeared as a living character. This character is DEAD — they cannot enter rooms, speak, gesture, or react.\n\n`;
    feedback += `Offending sentences detected:\n`;
    victimAliveErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ REMOVE every sentence where the victim acts, speaks, or is physically present.\n`;
    feedback += `✓ CORRECT: "[name] had often said..." / "[name]'s effects were found" / "witnesses recalled..."\n`;
    feedback += `✗ WRONG: "[name] crossed the room" / "[name] nodded" / "[name] replied"\n\n`;
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
    const dtRetriesRemaining = maxAttempts - attempt;
    feedback += `═══ DISCRIMINATING TEST ERRORS (${testErrors.length}) ═══\n`;
    testErrors.forEach(e => feedback += `• ${e}\n`);
    if (dtRetriesRemaining >= 2) {
      feedback += `\n✓ SOLUTION: The discriminating test must be explicit and complete\n`;
      feedback += `✓ Include the detective's reasoning, the test itself, and clear elimination of suspects\n`;
      feedback += `✓ Reference specific evidence clues from the CML\n`;
      feedback += `✓ Use the discriminating test checklist from the prompt when provided\n`;
    } else if (dtRetriesRemaining === 1) {
      feedback += `\n⚠️ PENULTIMATE ATTEMPT — WRITE THE DISCRIMINATING TEST AS THREE ORDERED PARTS:\n`;
      feedback += `  Part 1 — SETUP: The detective explicitly names the test (e.g. "To determine who could have [done X], we must check...").\n`;
      feedback += `  Part 2 — EXECUTION: The test is performed step by step — each non-culprit suspect is considered in turn with specific evidence cited per person.\n`;
      feedback += `  Part 3 — VERDICT: The detective states who is eliminated and who alone remains. Name every eliminated suspect explicitly.\n`;
      feedback += `  Each part must be a distinct paragraph. Reference at least two specific clue IDs or evidence items from the earlier prompt checklist.\n`;
    } else {
      feedback += `\n🚨 FINAL ATTEMPT — MANDATORY DISCRIMINATING TEST REBUILD:\n`;
      feedback += `  Write the discriminating test as exactly three paragraphs:\n`;
      feedback += `  Paragraph A: The detective declares aloud: "There is one thing only the true culprit could have done: [specific test]." Then explains the evidence basis.\n`;
      feedback += `  Paragraph B: Goes through each non-culprit suspect by name: "[Suspect] could not have [done X] because [specific evidence from the CML]."\n`;
      feedback += `  Paragraph C: States the culprit: "Only [Culprit Name] could have [done X]." Names the culprit explicitly and states at least two items of proof.\n`;
      feedback += `  Use the EXACT character names from the cast. This three-paragraph block must appear in the chapter — not compressed into single-sentence dialogue.\n`;
    }
    feedback += `\n`;
  }
  
  if (qualityErrors.length > 0) {
    feedback += `═══ PROSE QUALITY ERRORS (${qualityErrors.length}) ═══\n`;
    qualityErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: Vary paragraph lengths (short, medium, long)\n`;
    feedback += `✓ Include sensory details and atmospheric description\n`;
    feedback += `✓ Ensure each chapter has substance (3+ paragraphs minimum)\n\n`;
  }

  // P2-A (gate fix): also enter the TEMPLATE LEAKAGE block when linterIssues carries
  // fingerprint or ngram issues that were deferred on the previous attempt (because narrative
  // hard errors were present and the deferred gate prevented linter messages from being
  // pushed into batchErrors).  Without this, the BANNED PARAGRAPH/NEAR-DUPLICATE blocks
  // can never fire when a clue error co-occurs with a template error on every attempt.
  const hasLinterTemplateIssue = (options?.linterIssues ?? []).some(
    (issue) => issue.type === "paragraph_fingerprint" || issue.type === "ngram_overlap",
  );
  if (templateErrors.length > 0 || hasLinterTemplateIssue) {
    const shownTemplateErrors = templateErrors.length > 0 ? templateErrors : [];
    if (shownTemplateErrors.length > 0) {
      feedback += `═══ TEMPLATE LEAKAGE ERRORS (${shownTemplateErrors.length}) ═══\n`;
      shownTemplateErrors.forEach(e => feedback += `• ${e}\n`);
      feedback += `\n`;
    } else {
      // Linter detected template issues but they were deferred on the prior attempt.
      feedback += `═══ TEMPLATE LEAKAGE DETECTED ═══\n`;
      feedback += `• Your prose closely matches or repeats a paragraph from a prior chapter.\n`;
      feedback += `  Every paragraph must be original prose unique to this chapter's scene.\n\n`;
    }
    // P2-A: derive from the dedicated linter-issues channel rather than templateErrors strings.
    // When the deferred linter gate suppresses template errors from batchErrors on attempt 1
    // (because narrative hard errors dominate), templateErrors is empty on attempt 2 but
    // lastLinterIssues still carries the fingerprint/ngram issue.  Using the issues channel
    // means BANNED PARAGRAPH fires even in that deferred-gate scenario.
    const hasNgramOverlap = (options?.linterIssues ?? []).some((issue) => issue.type === "ngram_overlap") ||
      templateErrors.some(e => /high n-gram overlap/i.test(e));
    const hasFingerprintDupe = (options?.linterIssues ?? []).some((issue) => issue.type === "paragraph_fingerprint") ||
      templateErrors.some(e => /repeated long paragraph fingerprint/i.test(e));
    const hasEntropyLow = templateErrors.some(e => /opening-style entropy too low/i.test(e));
    const hasScaffold = templateErrors.some(e => /templated scaffold prose/i.test(e));
    const hasMetadata = templateErrors.some(e => /metadata key-value leakage/i.test(e));
    const hasMetaLanguage = templateErrors.some(e => /meta-language about storytelling/i.test(e));
    if (hasNgramOverlap || hasFingerprintDupe) {
      // Pillar 6 (Unit 6.2): when the flag is active and matching prior paragraphs are
      // available, inject targeted BANNED PARAGRAPH blocks for ALL accumulated matches.
      // Using filter (not find) injects every banned paragraph carried forward from prior
      // retries, preventing the whack-a-mole pattern.
      const fingerprintIssues = (options?.linterIssues ?? []).filter(
        (issue) => issue.type === "paragraph_fingerprint" && issue.matchingPriorParagraph,
      );
      if (hasFingerprintDupe && options?.enableSurgicalFingerprintRetry && fingerprintIssues.length > 0) {
        for (const fpIssue of fingerprintIssues) {
          const bannedFpText = sanitizeForContentPolicy(fpIssue.matchingPriorParagraph!);
          feedback += `⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:\n`;
          feedback += `"${bannedFpText}"\n\n`;
        }
        feedback += `Every sentence in your response must be a sentence that could NOT appear in any of the above passages.\n`;
        feedback += `You may write about the same event, but from a different physical position, a different\n`;
        feedback += `sensory angle, or at a different moment in the scene. You may not preserve a single clause.\n\n`;
      } else if (!options?.enableSurgicalFingerprintRetry || fingerprintIssues.length === 0) {
        if (hasFingerprintDupe) {
          feedback += `⛔ REPEAT PHRASE DETECTED — your prose shares too many words/phrases with earlier chapters.\n`;
          feedback += `  You MUST rewrite every paragraph from scratch — do not lift or lightly rephrase any sentence from a prior chapter.\n`;
          feedback += `  The linter compares word-sequence similarity (n-gram Jaccard) across all prior paragraphs.\n`;
          feedback += `  See RETRY MICRO-PROMPTS below for a paragraph-by-paragraph rebuild strategy.\n\n`;
        }
      }
      // P3-D: inject BANNED NEAR-DUPLICATE blocks for ALL accumulated n-gram overlap matches.
      const ngramIssues = (options?.linterIssues ?? []).filter(
        (issue) => issue.type === "ngram_overlap" && issue.matchingPriorParagraph,
      );
      if (hasNgramOverlap && options?.enableSurgicalFingerprintRetry && ngramIssues.length > 0) {
        for (const ngramIssue of ngramIssues) {
          const bannedNgramText = sanitizeForContentPolicy(ngramIssue.matchingPriorParagraph!);
          feedback += `⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:\n`;
          feedback += `"${bannedNgramText}"\n\n`;
        }
        feedback += `Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.\n`;
        feedback += `Different words for the same image are not sufficient — the sentence structure must also differ.\n\n`;
      } else if (hasNgramOverlap && (!options?.enableSurgicalFingerprintRetry || ngramIssues.length === 0)) {
        feedback += `⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes a prior chapter paragraph.\n`;
        feedback += `Rewrite the flagged paragraph so its sentence structure and phrasing are entirely new.\n\n`;
      }
      // When fingerprint/ngram has fired and prior chapter paragraphs are available, inject a
      // comprehensive "PRIOR CHAPTER LOCK" to prevent the model from cycling through different
      // source paragraphs each attempt (whack-a-mole pattern). Each prior paragraph's opening
      // sentence is listed as a unique identifier; the model must produce prose that starts nothing
      // like any of them. (min_chars=140 matches the ngram overlap min_chars config value.)
      const priorParas = (options?.priorChapterParagraphs ?? []).filter(p => p.length >= 140);
      if (priorParas.length > 0) {
        feedback += `⛔ PRIOR CHAPTER DUPLICATION LOCK — ${priorParas.length} protected passage(s):\n`;
        feedback += `Your prose has been detected copying from an earlier chapter. `;
        feedback += `Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. `;
        feedback += `Do not reproduce, rephrase, or structurally echo any of them:\n\n`;
        for (const para of priorParas) {
          const firstSentence = para.match(/^[^.!?]+[.!?]/)?.[0] ?? para.slice(0, 120);
          feedback += `  • "${sanitizeForContentPolicy(firstSentence.trim())}"\n`;
        }
        feedback += `\nWrite as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.\n\n`;
      }
    }
    if (hasEntropyLow) {
      feedback += `⛔ OPENING STYLE ENTROPY — this chapter opens with the same structural pattern as prior chapters.\n`;
      feedback += `  See RETRY MICRO-PROMPTS below for the five permitted opening structures.\n\n`;
    }
    if (hasScaffold) {
      feedback += `⛔ SCAFFOLD LEAKAGE — your prose contains a pattern matching the boilerplate template (e.g. "At The [Location], the smell of...").\n`;
      feedback += `  Remove ALL sentences matching this form. Replace with chapter-specific prose grounded in profile details.\n\n`;
    }
    if (hasMetadata) {
      feedback += `⛔ METADATA LEAKAGE — your output contains raw field labels (e.g. "Setting:", "Mood:", "Atmosphere:").\n`;
      feedback += `  These are FORBIDDEN in prose. Remove them entirely. Embed the information as narrative description instead.\n\n`;
    }
    if (hasMetaLanguage) {
      feedback += `⛔ META-LANGUAGE — your prose contains craft terminology (e.g. "sensory detail", "narrative beat", "plot point").\n`;
      feedback += `  These terms are FORBIDDEN in prose. Remove them and rewrite as pure narrative showing the story.\n\n`;
    }
    // R3: Location-boilerplate opening feedback — fires when a template_bleed linter issue
    // was detected. Provides concrete WRONG/RIGHT examples so the LLM corrects the specific
    // failure mode (room-inventory opener or "The [Room] in [Place] [verb]" opener).
    const hasLocationBleed = (options?.linterIssues ?? []).some(i => i.type === 'template_bleed');
    if (hasLocationBleed) {
      feedback += `⛔ LOCATION BOILERPLATE OPENING — your chapter opens with a room name or location set-piece.\n`;
      feedback += `  WRONG: "The Library in Little Middleton held a tense weight..."\n`;
      feedback += `  WRONG: "Entering The Study in [Location], she noticed..."\n`;
      feedback += `  WRONG: First paragraph names three or more rooms (Hall, Library, Study...) as an orientation list.\n`;
      feedback += `  RIGHT: Open with a character action, sensory reaction, or dialogue specific to this scene moment.\n`;
      feedback += `  The first word must NOT be "The" followed by a room name, nor "Entering The".\n\n`;
    }
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
    feedback += `═══ FINAL ATTEMPT — COMPLETE REBUILD REQUIRED ═══\n`;
    feedback += `This is attempt ${attempt}/${maxAttempts}. All prior attempts failed. Do NOT reference or preserve any text from previous responses.\n`;
    feedback += `Write chapters ${chapterRange} completely from scratch. Satisfy EVERY constraint listed above in a single pass.\n`;
    // Reinstate the sensory-grounding gate explicitly here. Prior attempts may have failed
    // on template_overlap (never triggering the sensory_grounding repair directive), so the
    // LLM writes a fresh opening unaware that the sensory check still applies.
    feedback += `CRITICAL — SENSORY GROUNDING GATE (checked by automated validator on this attempt):\n`;
    feedback += `  The chapter opening (first 2 paragraphs) MUST contain at least 2 words from this EXACT list — synonyms are NOT counted:\n`;
    feedback += `  smell / scent / odor / fragrance / sound / echo / silence / whisper / creak / cold / warm / damp / rough / smooth / glow / shadow / flicker / dim\n`;
    feedback += `  Example: "The cold of the hallway pressed against her cheeks. A whisper of candlelight flickered across the clock face."\n`;
    feedback += `  Two sensory words from the list above must appear within the first two paragraphs. Do NOT use synonyms (e.g. 'chill', 'murmur') — they are not counted.\n`;
    feedback += `CRITICAL — ATMOSPHERE/TIME GROUNDING GATE (checked by automated validator on this attempt):\n`;
    feedback += `  The chapter opening (first 2 paragraphs) MUST also contain at least 1 word from this EXACT list:\n`;
    feedback += `  rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / grey / gray / dark / light / season\n`;
    feedback += `  Example: "Morning light filtered through the fog-draped windows." or "The night air carried the scent of damp earth."\n`;
    feedback += `  One word from this list must appear in paragraph 1 or paragraph 2. Synonyms (e.g. 'dusk-like', 'nighttime') are NOT counted.\n`;
    feedback += `Submit the full chapter JSON — do not return partial content or indicate you are continuing.\n`;
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
  const requestContractViolations: Array<{ chapterRange: string; errors: string[] }> = [];
  const retryPacketHistory: Array<{ chapterRange: string; packet: RetryPacket }> = [];
  const batchCommitRecords: BatchCommitRecord[] = [];
  const provisionalChapterScores: ProvisionalChapterScore[] = [];
  // E5: Collect prompt fingerprints per chapter for traceability
  const promptFingerprints: Array<{ chapter: number; hash: string; section_sizes: Record<string, number> }> = [];
  const chapterValidator = new ChapterValidator();
  const pronounValidator = new CharacterConsistencyValidator();
  const temporalSeasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const progressCallback = inputs.onProgress || (() => {});
  const cast = normalizeProseCastOrThrow(inputs.cast);
  const castCharacters = cast.characters;
  const castNames = castCharacters.map(c => c.name);
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
  const chapterWordCounts: Array<{ chapter: number; words: number }> = [];
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
  const redesignEnabled = inputs.bottomUpRedesignEnabled !== false;

  // Generate and validate scenes in configurable batches.
  // When batchSize=1 (default) this processes one chapter per LLM call;
  // higher values group multiple scenes into a single call for throughput gains.
  for (let batchStart = 0; batchStart < scenes.length; batchStart += batchSize) {
    const batchScenes = scenes.slice(batchStart, batchStart + batchSize);
    const chapterStart = batchStart + 1;
    const chapterEnd = batchStart + batchScenes.length;
    // Hoist isLastBatch here (outside the attempt loop) so both P1-B guardrail
    // and the linter call site can reference it without a forward-reference error.
    const isLastBatch = chapterEnd >= sceneCount;
    const batchStartedAt = Date.now();
    const batchCostBefore = getAgent9CostTotal(client);
    const batchGateFailureCounts = initBatchGateFailureCounts();
    let batchPromptHash = "";
    let batchSelectedObligationAtomIds: string[] = [];
    const cmlCase = (inputs.caseData as any)?.CASE ?? {};
    // §4.4: Arc position for this batch — used to populate previousChapterArcPosition in NSD
    const totalScenesCount = (inputs.outline as any)?.totalScenes ?? scenes.length;
    const arcAnchorChapter = chapterEnd;
    const currentBatchArcPosition = arcAnchorChapter <= 1 ? 'opening'
      : arcAnchorChapter <= Math.floor(totalScenesCount * 0.25) ? 'early'
      : arcAnchorChapter <= Math.floor(totalScenesCount * 0.4) ? 'first_turn'
      : arcAnchorChapter <= Math.floor(totalScenesCount * 0.55) ? 'mid'
      : arcAnchorChapter <= Math.floor(totalScenesCount * 0.7) ? 'second_turn'
      : arcAnchorChapter <= Math.floor(totalScenesCount * 0.8) ? 'pre_climax'
      : arcAnchorChapter === totalScenesCount ? 'resolution'
      : 'climax';
    const chapterRequirementLedger = buildChapterRequirementLedger(
      cmlCase,
      batchScenes,
      chapterStart,
      inputs.targetLength ?? "medium",
      inputs.clueDistribution,
      scenes, // P1-1: all scenes for per-act scene number normalisation
    );
    const maxBatchAttempts = Math.max(1, resolvedMaxAttempts);
    let lastBatchErrors: string[] = [];
    let lastLinterIssues: ProseLinterIssue[] = [];
    // Pillar 6 (Unit 6.3): first sentence of the last failing chapter — used to derive the
    // forbidden-opening structure for structural_pivot mode.
    let lastBatchFirstSentence: string = '';
    let lastBatchRawResponse: string | null = null;
    let lastBatchChapterTexts: string[] = []; // TYPE 2: expose pronoun offending sentences in retry feedback
    let currentRetryPacket: RetryPacket | undefined;
    const priorBatchRetryPackets: RetryPacket[] = [];
    let batchSuccess = false;

    const overallProgress = 91 + Math.floor((batchStart / sceneCount) * 3); // 91-94%
    const batchLabel = batchScenes.length > 1 ? `${chapterStart}-${chapterEnd}` : `${chapterStart}`;
    progressCallback('prose', `Generating chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount}...`, overallProgress);

    for (let attempt = 1; attempt <= maxBatchAttempts; attempt++) {
      try {
        if (redesignEnabled) {
          const requestState = liveNarrativeState ?? initNarrativeState(inputs.lockedFacts ?? [], {});
          const requestContract = buildProseRequestContract({
            caseData: inputs.caseData,
            outline: inputs.outline,
            clueDistribution: inputs.clueDistribution,
            batchScenes,
            chapterStart,
            targetLength: inputs.targetLength ?? "medium",
            assetLibrary: buildAssetLibrary(
              inputs.worldDocument,
              inputs.characterProfiles,
              inputs.locationProfiles,
              inputs.temporalContext,
            ),
            narrativeState: requestState,
            retryPacket: currentRetryPacket,
          });
          const contractValidation = validateRequestContract(requestContract);
          if (!contractValidation.valid) {
            requestContractViolations.push({
              chapterRange: batchLabel,
              errors: contractValidation.errors,
            });
            throw new Error(
              `Request contract validation failed for chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}: ${contractValidation.errors.join('; ')}`,
            );
          }
        }

        // chapterSummaries already holds every committed chapter, so continuity
        // context is always up-to-date when buildProsePrompt is called.
        const mitigationGuardrails: string[] = [];
        const mitigationType = currentRetryPacket?.deterministicMitigation?.type;
        const mitigationParams = currentRetryPacket?.deterministicMitigation?.params;
        if (mitigationType === "tighten_obligation") {
          mitigationGuardrails.push(
            "RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.",
            "RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.",
          );
          if (mitigationParams?.diversifyStructure === true) {
            mitigationGuardrails.push(
              "RETRY MITIGATION: Keep clue obligations fixed, but diversify sentence skeletons and paragraph openings so the chapter does not echo prior scaffolds.",
            );
          }
        }
        if (mitigationType === "split_chapter") {
          const minParagraphs = Number(currentRetryPacket?.deterministicMitigation?.params?.minParagraphs ?? 4);
          mitigationGuardrails.push(
            `RETRY MITIGATION: Split-chapter mode is active. Use at least ${Math.max(4, minParagraphs)} substantial paragraphs per chapter with explicit scene transitions.`,
          );
        }
        if (mitigationType === "freshen_atoms") {
          mitigationGuardrails.push(
            "RETRY MITIGATION: Refresh texture usage. Rephrase observations with different lexical framing while preserving all clue obligations and chronology.",
          );
        }
        // Pillar 6 (Unit 6.3): structural pivot mode — activated when a paragraph_fingerprint
        // failure recurs on attempt ≥ 2.  Injects three concrete constraints:
        //  (a) the forbidden opening structure parsed from the failing chapter's first sentence,
        //  (b) three required alternative opening structures to give the model escape routes,
        //  (c) a positional freeze banning clock-proximity phrases from the first three paragraphs.
        if (mitigationType === "structural_pivot") {
          const forbiddenOpening = lastBatchFirstSentence
            ? `"${lastBatchFirstSentence.slice(0, 200)}"`
            : "(same opening structure as prior attempt)";
          mitigationGuardrails.push(
            `RETRY MITIGATION: Structural pivot mode is active — paragraph fingerprint has now failed twice for this chapter.`,
            `FORBIDDEN OPENING STRUCTURE: Do NOT begin this chapter with: ${forbiddenOpening}`,
            `  You MUST choose a structurally different opening from one of these three alternatives:`,
            `  (a) MID-DIALOGUE — the very first word of the chapter is spoken by a character (open quote, then speech).`,
            `  (b) PHYSICAL ACTION — the first sentence describes a character performing a concrete physical action they have not yet performed in any prior chapter (rising, moving, picking up an object, leaving a room).`,
            `  (c) SENSORY INTRUSION — the first sentence is an external sensory event interrupting the scene (a sound from outside, a knock, a clock ticking, a door slamming).`,
            `POSITIONAL FREEZE: The first three paragraphs must NOT position any character "near the clock", "before the clock", "approached the clock", "gestured toward the clock", or any synonymous phrase. The clock may be referenced in dialogue only within the first three paragraphs.`,
          );
        }
        // Anti-copy guardrail: fires on EVERY attempt for non-final batches.
        // The LLM can reach back into the STORY TO DATE context block and copy a paragraph
        // verbatim on ANY attempt — not just the final one — triggering fingerprint and n-gram
        // checks. Pre-empt this from attempt 1 onwards.
        // EXCEPTION: the final/reveal batch is exempt — the detective recap legitimately echoes
        // prior-chapter vocabulary (the same reason skipNgramCheck: true is applied for isLastBatch
        // at the linter call site). Injecting it there would force the model to avoid the recap
        // vocabulary it needs for the denouement.
        if (chapters.length > 0 && !isLastBatch) {
          mitigationGuardrails.push(
            "STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. " +
            "You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. " +
            "Every sentence in this chapter must be original prose unique to this scene. " +
            "Reusing even a clause from prior chapter text will cause this attempt to fail immediately.",
          );
        }

        const prompt = buildProsePrompt(
          {
            ...inputs,
            // P2-21: Pass normalized cast so buildProsePrompt doesn't re-do its own unsafe
            // Array.isArray(inputs.cast?.characters) coercion — normalizeProseCastOrThrow
            // already validated and typed the cast at generateProse() entry.
            cast,
            narrativeState: liveNarrativeState,
            provisionalScoringFeedback: rollingProvisionalFeedback,
            qualityGuardrails: [
              ...(Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : []),
              ...mitigationGuardrails,
            ],
          },
          batchScenes,
          chapterStart,
          chapterSummaries,
          chapters,
        );
        batchSelectedObligationAtomIds = [...(prompt.selectedObligationAtomIds ?? [])];
        if (inputs.onAtomsSelected) {
          inputs.onAtomsSelected(prompt.selectedObligationAtomIds ?? []);
        }

        const promptText = prompt.messages.map((m) => m.content).join('\n');
        const promptHash = createHash('sha256').update(promptText).digest('hex').slice(0, 16);
        batchPromptHash = promptHash;
        // E5: Compute prompt fingerprint on first attempt only (captures base prompt structure)
        if (attempt === 1) {
          for (let ci = chapterStart; ci <= chapterEnd; ci++) {
            promptFingerprints.push({ chapter: ci, hash: promptHash, section_sizes: prompt.sectionSizes });
          }
        }

        // Add retry feedback on subsequent attempts.
        // Attempts 2/3: include the previous raw response as an assistant turn so the model
        // makes targeted edits. Final attempt: skip the assistant turn so the model rebuilds
        // cleanly (consistent with the "REBUILD from scratch" directive at attempt 4+).
        if (attempt > 1 && lastBatchErrors.length > 0) {
          let feedback = buildEnhancedRetryFeedback(
            lastBatchErrors, inputs.caseData, batchLabel, attempt, maxBatchAttempts,
            {
              linterIssues: lastLinterIssues,
              enableSurgicalFingerprintRetry: inputs.enableSurgicalFingerprintRetry,
              // Pass all committed chapter paragraphs so the feedback can inject a comprehensive
              // prior-chapter duplication lock when fingerprint/ngram issues have been detected.
              priorChapterParagraphs: chapters.flatMap(ch => ch.paragraphs),
              lastBatchChapterTexts, // TYPE 2: expose pronoun offending sentences
              // Pass LLM-facing preferred word count so n-gram/fingerprint retry directives keep
              // the model writing at the aspirational target and prevent progressive shrinkage.
              promptTargetWords: getPromptPreferredWords(inputs.targetLength ?? "medium"),
            },
          );
          if (redesignEnabled && currentRetryPacket) {
            feedback = `${feedback}\n\n${buildRetryFeedback(currentRetryPacket)}`;
          }
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
        // Graduated temperature escalation: +0.10 per retry above 1 when template overlap
        // persists. Flat +0.10 is insufficient — the model anchors to the same output.
        // Graduated escalation forces increasing lexical diversity at each attempt.
        const _hasTemplateOverlap = lastBatchErrors.some(e => /high n-gram overlap|repeated long paragraph fingerprint/i.test(e));
        const retryTemperature = (() => {
          if (!_hasTemplateOverlap || attempt <= 1) return proseModelConfig.temperature;
          // +0.10 per retry above 1, capped at +0.40 (max 0.85).
          const boost = Math.min((attempt - 1) * 0.10, 0.40);
          return Math.min(proseModelConfig.temperature + boost, 0.85);
        })();
        const tokensPerScene = inputs.targetLength === "long" ? 6000 : 4500;
        const response = await client.chat({
          messages: prompt.messages,
          model: inputs.model,
          temperature: retryTemperature,
          maxTokens: Math.min(tokensPerScene * batchScenes.length, 20000),
          jsonMode: true,
          logContext: {
            runId: inputs.runId ?? "",
            projectId: inputs.projectId ?? "",
            agent: `Agent9-ProseGenerator-Ch${batchLabel}`,
          },
        });

        let proseBatch: Omit<ProseGenerationResult, "cost" | "durationMs">;
        let batchUsedTextureAtomIds: string[] = [];
        // Store raw response immediately so next retry can include it as the assistant turn.
        lastBatchRawResponse = response.content;
        try {
          const extracted = extractAndStripUsedAssets(response.content);
          const allowedTextureAtoms = new Set(prompt.textureAtomIds ?? []);
          batchUsedTextureAtomIds = extracted.usedAssetIds.filter((id) => allowedTextureAtoms.has(id));
          proseBatch = parseProseResponse(extracted.prose);
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
          // P2-10: Run season lock before pronoun repair; sanitize (anonymizeUnknownTitledNames)
          // runs AFTER pronoun repair so it doesn't weaken antecedents that pronoun repair needs.
          let chapter = enforceMonthSeasonLockOnChapter(
            proseBatch.chapters[i],
            temporalSeasonLock,
          );
          let structureRepairApplied: { before: number; after: number } | null = null;
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

          // P0 deterministic final-attempt structure gate:
          // if the batch is on its last retry and the chapter has fewer than 3 paragraphs,
          // force a paragraph split pass so structural formatting failures are repaired
          // before hard validation decides the batch outcome.
          const splitMitigationMinParagraphs =
            currentRetryPacket?.deterministicMitigation?.type === 'split_chapter'
              ? Math.max(4, Number(currentRetryPacket?.deterministicMitigation?.params?.minParagraphs ?? 4))
              : 3;
          const shouldForceStructureRepair =
            (attempt >= maxBatchAttempts || currentRetryPacket?.deterministicMitigation?.type === 'split_chapter')
            && Array.isArray(chapter.paragraphs)
            && chapter.paragraphs.length < splitMitigationMinParagraphs;
          if (shouldForceStructureRepair) {
            const before = chapter.paragraphs.length;
            const repaired = enforceMinimumParagraphStructure(chapter, splitMitigationMinParagraphs);
            const after = Array.isArray(repaired.paragraphs) ? repaired.paragraphs.length : before;
            if (after > before) {
              chapter = repaired;
              structureRepairApplied = { before, after };
            }
          }

          proseBatch.chapters[i] = chapter;
          const chapterNumber = chapterStart + i;
          if (structureRepairApplied) {
            console.warn(
              `[Agent 9] Final-attempt structure repair: ch${chapterNumber} — paragraphs ${structureRepairApplied.before} -> ${structureRepairApplied.after}.`,
            );
          }
          const ledgerEntry = chapterRequirementLedger[i];

          // Deterministic pronoun repair before validation — catches unambiguous mismatches cheaply.
          // Controlled by agent9_prose.validation.pronoun_checking_enabled in generation-params.yaml.
          let chapterPronRepairCount = 0;
          if (pronounCheckingEnabled && castCharacters.length > 0) {
            const pronRepair = repairChapterPronouns(chapter, castCharacters);
            if (pronRepair.repairCount > 0) {
              chapter = pronRepair.chapter;
              proseBatch.chapters[i] = chapter;
              chapterPronRepairCount = pronRepair.repairCount;
              console.warn(
                `[Agent 9] Pre-validation pronoun repair: ch${chapterNumber} — ${pronRepair.repairCount} replacement(s) applied.`,
              );
            }
          }
          // P2-10: Sanitize (anonymize unknown titled names) after pronoun repair so that
          // weakened antecedents don't cause pronoun misresolution.
          chapter = sanitizeGeneratedChapter(chapter, castNames);
          proseBatch.chapters[i] = chapter;

          const evaluateCandidate = (candidate: ProseChapter, trackUnderflow = true) => {
            const hardErrors: string[] = [];

            if (!candidate.title || typeof candidate.title !== 'string') {
              hardErrors.push(`chapter.title is required and must be a string`);
            }

            // Pronoun drift gate: if the pre-validation repair had to fix more than 8
            // pronouns, the LLM generated systematic gender confusion in this chapter.
            // Force a retry (on early attempts) so the PHASE 2 pronoun feedback can guide
            // correction. On attempts >= 4 the repair has already been applied to the text,
            // so blocking further is counter-productive — accept the repaired chapter.
            if (chapterPronRepairCount > 8 && attempt < 4) {
              const maleChars = (inputs.cast?.characters ?? [])
                .filter((c: any) => (typeof c.gender === 'string' ? c.gender : '').toLowerCase() === 'male')
                .map((c: any) => String(c.name ?? '').trim())
                .filter(Boolean);
              const femaleChars = (inputs.cast?.characters ?? [])
                .filter((c: any) => (typeof c.gender === 'string' ? c.gender : '').toLowerCase() === 'female')
                .map((c: any) => String(c.name ?? '').trim())
                .filter(Boolean);
              const maleGuidance = maleChars.length > 0
                ? `For male character${maleChars.length > 1 ? 's' : ''} ${maleChars.join(', ')}: use he/him/his in every sentence. When ${maleChars.length === 1 ? maleChars[0].split(' ').pop() : 'a male character'} and a female character appear in the same sentence, name them explicitly rather than relying on a pronoun.`
                : femaleChars.length > 0
                  ? `All named characters in this story use she/her pronouns. Do not use he/him for any of them.`
                  : `Review the pronoun table in the ⛔ ABSOLUTE PRONOUN LOCK and apply each character's assigned pronouns strictly.`;
              hardErrors.push(
                `Chapter ${chapterNumber}: Pronoun drift — ${chapterPronRepairCount} pronoun corrections were required, indicating systematic gender confusion. ` +
                `Review the ⛔ ABSOLUTE PRONOUN LOCK above. ${maleGuidance}`
              );
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

              // Fix 10c: Victim-name gate — Chapter 1 must introduce the victim by full name.
              // The VICTIM IDENTITY prompt rule instructs this; the gate enforces it.
              if (chapterNumber === 1) {
                const retryVictimNameForGate = resolveVictimName(inputs.cast).trim();
                if (retryVictimNameForGate) {
                  const candidateText = (candidate.paragraphs as string[]).join(' ').toLowerCase();
                  if (!candidateText.includes(retryVictimNameForGate.toLowerCase())) {
                    hardErrors.push(
                      `Chapter 1: The victim "${retryVictimNameForGate}" must be introduced by full name in the discovery chapter. ` +
                      `Their name must appear at least once. Do not write "the victim" or "the body" without first using their actual name.`
                    );
                  }
                }
              }
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
              ? validateChapterPreCommitObligations(
                  candidate,
                  ledgerEntry,
                  inputs.clueDistribution,
                  castNames,
                  isLastBatch ? (() => {
                    const culpritName: string = ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? '';
                    const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
                    const murderMethod: string = (inputs.caseData as any)?.CASE?.hidden_model?.mechanism?.description ?? '';
                    return culpritSurname ? { isLastChapter: true, culpritName, culpritSurname, murderMethod: murderMethod || undefined } : undefined;
                  })() : undefined
                )
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
              hardErrors.every((error) => /word count below (hard floor|minimum)/i.test(error));
            // True whenever the hard floor is hit, even if other hard errors also exist.
            // Expansion fires in this case so the model can grow the chapter while
            // simultaneously satisfying any co-present clue/placement obligations
            // (which are included in the expansion prompt).
            const hasHardFloorUnderflow =
              hardErrors.some((error) => /word count below (hard floor|minimum)/i.test(error));
            // Fires when the chapter passes all hard checks but is still below the preferred
            // word target. With a permissive hard_floor_relaxation_ratio the hard floor may
            // be cleared while the chapter is still meaningfully short of preferred length.
            // The preferred_miss_expansion_ratio gate prevents expansion from firing for
            // chapters that are merely marginally below the aspirational preferred count —
            // without it, every LLM output (which typically clears the low hard floor but
            // misses the preferred target) would trigger an expansion call.
            // ?? 1.0 fallback: if story-validation dist is stale (field not yet compiled),
            // undefined * n === NaN and x < NaN is always false, silently disabling all
            // expansion. Falling back to 1.0 preserves the old behaviour (expand every
            // preferred-miss chapter) rather than silently doing nothing.
            const preferredMissRatio = getGenerationParams().agent9_prose.underflow_expansion.preferred_miss_expansion_ratio ?? 1.0;
            const obligationWordCount = obligations?.wordTarget.wordCount ?? 0;
            const obligationPreferredWords = obligations?.wordTarget.preferredWords ?? 0;
            const hasPreferredMissOnly =
              hardErrors.length === 0 &&
              preferredMisses.length > 0 &&
              obligationPreferredWords > 0 &&
              obligationWordCount < obligationPreferredWords * preferredMissRatio;

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
          // Gated by agent9_prose.underflow_expansion.enabled (default: true).
          const expansionEnabled = getGenerationParams().agent9_prose.underflow_expansion.enabled;
          if (expansionEnabled && (evaluation.hasHardFloorUnderflow || evaluation.hasPreferredMissOnly) && ledgerEntry) {
            const maxExpansionPasses = evaluation.hasHardFloorUnderflow ? 6 : 1;
            let attemptedExpansion = false;
            let expansionErrored = false;
            for (let expansionPass = 1; expansionPass <= maxExpansionPasses; expansionPass++) {
              underflowExpansionAttempts += 1;
              attemptedExpansion = true;
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
                  castCharacters, // [ANALYSIS_16 PHASE D]
                );
                chapter = enforceMonthSeasonLockOnChapter(
                  expanded,
                  temporalSeasonLock,
                );
                proseBatch.chapters[i] = chapter;
                // Repeat pronoun repair after expansion — expansion is a full LLM rewrite.
                // P2-10: Sanitize after pronoun repair so antecedents are intact during repair.
                if (pronounCheckingEnabled && castCharacters.length > 0) {
                  const pronRepair = repairChapterPronouns(chapter, castCharacters);
                  if (pronRepair.repairCount > 0) {
                    chapter = pronRepair.chapter;
                    proseBatch.chapters[i] = chapter;
                    console.warn(
                      `[Agent 9] Post-expansion pronoun repair: ch${chapterNumber} — ${pronRepair.repairCount} replacement(s) applied.`,
                    );
                  }
                }
                chapter = sanitizeGeneratedChapter(chapter, castNames);
                proseBatch.chapters[i] = chapter;
                evaluation = evaluateCandidate(chapter, false);

                // Stop early when the hard floor is satisfied or when this chapter only needed
                // preferred-target enrichment.
                if (!evaluation.hasHardFloorUnderflow || !evaluation.hardErrors.some((error) => /word count below (hard floor|minimum)/i.test(error))) {
                  break;
                }

                // If this was not a pure underflow case, avoid repeated expansion loops.
                const hasNonUnderflowHardErrors = evaluation.hardErrors.some(
                  (error) => !/word count below (hard floor|minimum)/i.test(error),
                );
                if (hasNonUnderflowHardErrors) {
                  break;
                }
              } catch {
                expansionErrored = true;
                break;
              }
            }

            if (attemptedExpansion) {
              if (!expansionErrored && !evaluation.hasHardFloorUnderflow && evaluation.hardErrors.length === 0) {
                underflowExpansionRecovered += 1;
              } else {
                underflowExpansionFailed += 1;
              }
            }
          }

          const chapterErrors = [...evaluation.hardErrors];

          // Targeted pronoun repair: validate → fix validator-confirmed characters → re-validate.
          // Any mismatches that survive repair are unresolvable and escalate to an LLM retry.
          // Controlled by agent9_prose.validation.pronoun_checking_enabled in generation-params.yaml.
          if (pronounCheckingEnabled && castCharacters.length > 0) {
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
                ? repairPronouns(chapterText, castCharacters, { onlyNames, crossParagraphInheritance: true })
                : { repairCount: 0, text: chapterText };

              if (repaired.repairCount > 0) {
                chapter = { ...chapter, paragraphs: repaired.text.split('\n\n') };
                proseBatch.chapters[i] = chapter;
                const residualStory = { ...pronounStory,
                  scenes: [{ ...pronounStory.scenes[0], text: repaired.text }] };
                const residualPronounIssues = pronounValidator.validate(residualStory, inputs.caseData as any).errors
                  .filter((e) => e.type === 'pronoun_gender_mismatch')
                  .map((e) => e.message);
                if (residualPronounIssues.length > 0) {
                  if (attempt >= 3) {
                    // After two LLM passes with explicit pronoun feedback and targeted repair,
                    // residual issues are in mixed-gender context sentences the repair cannot
                    // safely fix without risking false replacements. Accept at attempt 3+ to
                    // prevent infinite retries. pronoun_gender_mismatch is not a hard release
                    // gate — applyDeterministicPronounSweep will make one final pass.
                    console.warn(
                      `[Agent 9] Ch${chapterNumber} residual pronoun issue(s) after targeted repair on attempt ${attempt} (accepted): ${residualPronounIssues.join('; ')}`,
                    );
                  } else {
                    chapterErrors.push(...residualPronounIssues);
                  }
                }
              } else {
                if (attempt >= 3) {
                  // Targeted repair made 0 additional fixes after two passes. These issues
                  // survived all repair attempts and are unresolvable without risking false
                  // replacements in ambiguous-context sentences. Accept at attempt 3+.
                  console.warn(
                    `[Agent 9] Ch${chapterNumber} pronoun issue(s) unresolvable by targeted repair on attempt ${attempt} (accepted): ${pronounIssues.join('; ')}`,
                  );
                } else {
                  chapterErrors.push(...pronounIssues);
                }
              }
            }
          }

          // Layer 6: Victim-alive detector — flags chapters 2+ where victim appears as living
          if (chapterNumber > 1) {
            const retryVictimName = resolveVictimName(inputs.cast);
            if (retryVictimName) {
              const victimAliveSentences = detectVictimAlive(chapter, retryVictimName);
              for (const offendingSentence of victimAliveSentences) {
                chapterErrors.push(`VICTIM ALIVE: "${offendingSentence.slice(0, 120)}"`);
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
              castNames,
            ),
          );

          if (chapterErrors.length > 0) {
            batchErrors.push(...chapterErrors);
            chapterValidationHistory.push({ chapterNumber, attempt, errors: chapterErrors });
          }
        }

        // Online anti-template linter gate before committing this batch.
        // The final chapter (reveal/denouement) is exempt from the n-gram overlap check because
        // the detective recap prose legitimately echoes prior-chapter vocabulary.
        proseLinterStats.checksRun += 1;
        const hasNarrativeHardErrors = batchErrors.length > 0;
        // isLastBatch is hoisted before the attempt loop to avoid forward-reference error.
        // P2-H: compute which clearance obligations apply to this batch's scenes.
        // Exclude victim characters — they cannot appear as suspects needing clearance.
        const _batchVictimNames = new Set<string>(
          ((cmlCase?.cast ?? []) as any[])
            .filter((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('victim'))
            .map((c: any) => String(c.name ?? '').trim().toLowerCase())
        );
        const allClearanceScenes: Array<{ act_number: number; scene_number: number; suspect_name: string; clearance_method?: string }> =
          Array.isArray(cmlCase.prose_requirements?.suspect_clearance_scenes)
            ? cmlCase.prose_requirements.suspect_clearance_scenes.filter(
                (entry: any) => !_batchVictimNames.has(String(entry?.suspect_name ?? '').trim().toLowerCase())
              )
            : [];
        // P2-H scene matching: try exact (act + scene) first; fall back to act-only for
        // the last batch in each act when no exact match is found.  The CML agent outputs
        // scene_number values (e.g. 4-6 for act 3) that do not align with the outline's
        // global sceneNumber (e.g. 8-9 for act 3 in a 9-scene story), causing exact matching
        // to silently produce zero results.  The fallback fires the clearance gate on the
        // last chapter of each act, which is the natural position for clearance prose.
        let batchMatchingClearances = allClearanceScenes.filter((entry) =>
          batchScenes.some(
            (scene: any) =>
              Number(entry.act_number) === Number(scene.act) &&
              Number(entry.scene_number) === Number(scene.sceneNumber),
          ),
        );
        if (batchMatchingClearances.length === 0 && allClearanceScenes.length > 0) {
          const nextScene = scenes[batchStart + batchScenes.length] as any;
          const batchActNumbers = new Set((batchScenes as any[]).map((s: any) => Number(s.act)));
          const isLastBatchInAct = !nextScene || !batchActNumbers.has(Number(nextScene?.act));
          if (isLastBatchInAct) {
            batchMatchingClearances = allClearanceScenes.filter((entry) =>
              batchActNumbers.has(Number(entry.act_number)),
            );
          }
        }
        // Skip the n-gram overlap check for the final three arc positions (pre_climax,
        // climax, resolution — typically chapters 8-10 in a 10-chapter story).
        // These late chapters must reference the same forensic evidence that earlier
        // chapters established.  The pre_climax chapter builds directly on the
        // second_turn evidence; the climax chapter (revelation) echoes all prior clues;
        // the resolution chapter recaps the detective's deduction.  All three
        // legitimately echo prior-chapter vocabulary, and enforcing 0.80 Jaccard
        // overlap for them exhausts retries without meaningful quality improvement.
        // Exact-duplicate detection (paragraph fingerprint) is still active.
        const isLateChapter = ['pre_climax', 'climax', 'resolution'].includes(currentBatchArcPosition);
        const linterOptions: NonNullable<Parameters<typeof lintBatchProse>[3]> = isLateChapter
          ? { ...(inputs.templateLinterProfile ?? {}), skipNgramCheck: true }
          : { ...(inputs.templateLinterProfile ?? {}) };
        if (batchMatchingClearances.length > 0) {
          linterOptions.matchingClearances = batchMatchingClearances;
        }
        // [PHASE 5] Pass macro arc plan and batch start for archetype validation
        if (inputs.macroArcPlan && inputs.macroArcPlan.length > 0) {
          linterOptions.macroArcPlan = inputs.macroArcPlan;
          linterOptions.batchChapterStart = batchStart + 1;
        }
        const linterIssues = lintBatchProse(proseBatch.chapters, chapters, [], linterOptions);
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
          if (hasNarrativeHardErrors) {
            // F4: Split deferred gate by issue type.
            // opening_style_entropy depends on multi-chapter context and may resolve naturally
            // as the story grows — safe to defer.
            // paragraph_fingerprint and ngram_overlap are exact-match violations: a repeated
            // phrase or paragraph is wrong regardless of whether a narrative error also exists.
            // These are never deferred so they cannot accumulate across chapters while the
            // narrative-error retry loop is running.
            const nonDeferrableIssues = linterIssues.filter(
              (issue) => issue.type !== 'opening_style_entropy'
            );
            if (nonDeferrableIssues.length > 0) {
              batchErrors.push(...nonDeferrableIssues.map((issue) => issue.message));
            }
            const deferredCount = linterIssues.length - nonDeferrableIssues.length;
            if (deferredCount > 0) {
              console.warn(
                `[Agent 9] Deferred opening-style entropy for ch${batchLabel} attempt ${attempt}/${maxBatchAttempts} while narrative hard errors remain.`,
              );
            }
          } else {
            batchErrors.push(...linterIssues.map((issue) => issue.message));
          }
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

        // Fingerprint/debug-note-only failure backstop: these linter issues persist across
        // repeated LLM retries — paragraph fingerprint matches cannot be fixed by prompting,
        // and debug notes occasionally survive 6 attempts despite explicit feedback.
        // When all retries are exhausted and NO narrative (content-validation) hard errors
        // remain, accept the batch rather than producing a false hard-stop.
        // Pre-accept: strip any debug-note paragraphs deterministically so they do not
        // appear in the final story text.
        const isLinterOnlyFingerprintOrNoteFailure =
          attempt >= maxBatchAttempts &&
          !hasNarrativeHardErrors &&
          batchErrors.length > 0 &&
          linterIssues.length > 0 &&
          linterIssues.every((issue) =>
            issue.type === "paragraph_fingerprint" || issue.type === "debug_note_bleed"
          );
        if (isLinterOnlyFingerprintOrNoteFailure) {
          // Strip debug-note paragraphs before accepting so they don't appear in the story.
          const DEBUG_NOTE_STRIP_PATTERNS = [
            /the detail is explicit:/i,
            /this detail added\b.*?\btexture\b/i,
            /\[locked fact\]/i,
            /without changing the essential deduction chain/i,
            /\bthe mechanism relies on\b/i,
            /\bfor the purposes of this (?:scene|chapter|narrative)\b/i,
            /\bthe (?:time|value|reading|interval) was recorded as\b/i,
            /\bthe (?:exact|precise) (?:amount|value|time|phrase|interval) .{0,40}(?:wound back|came to|amounts to|equals)\b/i,
            /\buntil the investigator\b.{0,40}\b(?:arriv|comes?|is here)\b/i,
            /\bhold on\b.{0,50}\buntil.*investigator\b/i,
            /\bthis evidence points to\b.{0,80}\b(?:involvement|guilt|culpability)\b/i,
            /\bdirect evidence ties\b.{0,80}\baccess point\b/i,
          ];
          let debugNoteStripped = 0;
          for (let ci = 0; ci < proseBatch.chapters.length; ci++) {
            const ch = proseBatch.chapters[ci];
            if (!Array.isArray(ch.paragraphs)) continue;
            const filtered = (ch.paragraphs as string[]).filter(
              (p: string) => !DEBUG_NOTE_STRIP_PATTERNS.some((re) => re.test(p))
            );
            if (filtered.length < ch.paragraphs.length) {
              debugNoteStripped += ch.paragraphs.length - filtered.length;
              proseBatch.chapters[ci] = { ...ch, paragraphs: filtered };
            }
          }
          if (debugNoteStripped > 0) {
            console.warn(
              `[Agent 9] Batch ch${batchLabel} pre-accept debug note strip: removed ${debugNoteStripped} paragraph(s).`
            );
          }
          console.warn(
            `[Agent 9] Batch ch${batchLabel} exhausted retries with only paragraph-fingerprint/debug-note linter issues; accepting to avoid false hard-stop.`,
          );
          progressCallback(
            'prose',
            `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} accepted with residual linter warning after ${maxBatchAttempts} attempts`,
            overallProgress,
          );
          batchErrors = [];
        }

        // Resolution-only failure backstop: if the final chapter batch exhausted all retries
        // with ONLY "no resolution event detected" errors, inject a deterministic resolution
        // paragraph instead of aborting. This mirrors the entropy-bypass pattern above.
        const isResolutionOnlyFailure =
          isLastBatch &&
          attempt >= maxBatchAttempts &&
          batchErrors.length > 0 &&
          batchErrors.every((e) => e.includes('no resolution event detected'));
        if (isResolutionOnlyFailure && proseBatch.chapters.length > 0) {
          const culpritName: string = ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? '';
          const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
          if (culpritSurname) {
            const lastIdx = proseBatch.chapters.length - 1;
            const lastChapter = proseBatch.chapters[lastIdx];
            const paragraphs = [...((lastChapter.paragraphs ?? []) as string[])];
            // Centralised in buildResolutionBackstopSentence so agent9-prose.ts and agent9-run.ts
            // cannot drift to different backstop sentences.
            paragraphs.push(buildResolutionBackstopSentence(culpritSurname));
            proseBatch.chapters[lastIdx] = { ...lastChapter, paragraphs };
            console.warn(
              `[Agent 9] Resolution backstop: ch${batchLabel} attempt ${attempt}/${maxBatchAttempts} — ` +
              `no resolution event after all retries; injected deterministic resolution paragraph for "${culpritName}".`
            );
            progressCallback(
              'prose',
              `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} accepted with injected resolution after ${maxBatchAttempts} attempts`,
              overallProgress,
            );
            batchErrors = [];
          }
        }

        if (batchErrors.length > 0) {
          retriedBatches.add(Math.floor(batchStart / batchSize));
          lastBatchErrors = batchErrors;
          // TYPE 2: Save chapter text so retry feedback can quote specific offending sentences.
          lastBatchChapterTexts = proseBatch.chapters.map(
            (ch: any) => Array.isArray(ch.paragraphs) ? (ch.paragraphs as string[]).join('\n\n') : ''
          );
          // Pillar 6 (Unit 6.2): save the full linter issue objects so the next retry
          // can extract matchingPriorParagraph for the BANNED PARAGRAPH block.
          // Accumulate fingerprint/n-gram issues across retries so every prior
          // matching paragraph is carried into the BANNED block on subsequent prompts.
          // This prevents the whack-a-mole pattern where avoiding one banned paragraph
          // causes the LLM to land on a different prior-chapter paragraph.
          // Other issue types (sensory grounding, clue timing, etc.) are replaced by
          // the latest so only current failures drive the retry narrative.
          const prevFpNgrams = lastLinterIssues.filter(
            (prev) =>
              (prev.type === "paragraph_fingerprint" || prev.type === "ngram_overlap") &&
              prev.matchingPriorParagraph &&
              !linterIssues.some((curr) => curr.matchingPriorParagraph === prev.matchingPriorParagraph),
          );
          lastLinterIssues = [...prevFpNgrams, ...linterIssues];
          // Pillar 6 (Unit 6.3): save the first sentence of the failing chapter so
          // structural_pivot mode can derive a forbidden-opening structure.
          const failingFirstParagraph = proseBatch.chapters[0]?.paragraphs?.[0] ?? '';
          const sentenceEnd = failingFirstParagraph.search(/(?<=[.!?])\s/);
          lastBatchFirstSentence = sentenceEnd > 0
            ? failingFirstParagraph.slice(0, sentenceEnd).trim()
            : failingFirstParagraph.slice(0, 200).trim();
          noteBatchGateFailures(batchErrors, batchGateFailureCounts);

          if (redesignEnabled) {
            const packet = classifyFailure({
              validationErrors: batchErrors,
              attempt,
              maxRetries: maxBatchAttempts,
              priorPackets: priorBatchRetryPackets,
            });
            currentRetryPacket = packet;
            priorBatchRetryPackets.push(packet);
            // P2-19: Prune history to last 20 entries to prevent O(N²) growth when
            // classifyFailure scans all prior entries on every call.
            retryPacketHistory.push({ chapterRange: batchLabel, packet });
            if (retryPacketHistory.length > 20) retryPacketHistory.splice(0, retryPacketHistory.length - 20);

            const shouldFreshenAssistantContext =
              packet.deterministicMitigation?.type === 'freshen_atoms'
              || packet.deterministicMitigation?.params?.freshenAtoms === true
              // Clear the assistant context anchor when template overlap persists at attempt 3+.
              // Injecting the same bad response as an assistant turn anchors the model to the
              // same probability region regardless of repair directives — removing it forces a
              // cold restart with only the system prompt + user repair feedback.
              || (attempt > 2 && batchErrors.some(e => /high n-gram overlap|repeated long paragraph fingerprint/i.test(e)));
            if (shouldFreshenAssistantContext) {
              // Avoid anchoring the next retry to the same malformed assistant output.
              lastBatchRawResponse = null;
            }

            const priorPackets = priorBatchRetryPackets.slice(0, -1);
            const canContinue = shouldContinueRetry(packet, priorPackets);
            if (!canContinue && attempt < maxBatchAttempts) {
              const abortErr = new Error(
                `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} marked non-convergent after attempt ${attempt}/${maxBatchAttempts}: ${packet.failureClass}`,
              );
              (abortErr as any).retriedBatches = retriedBatches.size;
              throw abortErr;
            }
          }

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
          chapterWordCounts.push({ chapter: chapterNumber, words: countWords((chapter.paragraphs ?? []).join(' ')) });
          // Extract summary immediately so the next batch's prompt has full continuity
          const summary = extractChapterSummary(chapter, chapterNumber, castNames);
          chapterSummaries.push(summary);
        }
        const batchRevealedIds = batchScenes
          .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []))
          .map((id: unknown) => String(id))
          .filter(Boolean);
        if (liveNarrativeState) {
          const lastProseChapter = proseBatch.chapters[proseBatch.chapters.length - 1];
          // §1.3: Propagate clue reveals from the batch scenes into the internal NSD
          liveNarrativeState = updateNSD(liveNarrativeState, {
            paragraphs: lastProseChapter?.paragraphs,
            cluesRevealedIds: batchRevealedIds,
            arcPosition: currentBatchArcPosition,  // §4.4: track previous chapter arc position
          });

          // §1.2: Set victimConfirmedDeadChapter when victim and death language first co-occur
          if (liveNarrativeState.victimConfirmedDeadChapter === undefined) {
            const victimNameLower = resolveVictimName(inputs.cast).toLowerCase();
            if (victimNameLower) {
              const batchText = proseBatch.chapters
                .flatMap((ch: any) => (Array.isArray(ch.paragraphs) ? ch.paragraphs : []))
                .join(' ')
                .toLowerCase();
              const deathPattern = /\b(dead|body|corpse|killed|murder(?:ed)?|lifeless|deceased|slain|strangled|shot|stabbed)\b/;
              if (batchText.includes(victimNameLower) && deathPattern.test(batchText)) {
                liveNarrativeState = {
                  ...liveNarrativeState,
                  victimConfirmedDeadChapter: chapterStart,
                };
              }
            }
          }

          // §3.3c: Stamp lastUsedSensoryVariant for each scene's primary location after commit
          if (inputs.locationProfiles) {
            const locProfs = stripLocationParagraphs(inputs.locationProfiles);
            const updatedSensory = { ...liveNarrativeState.lastUsedSensoryVariant };
            let sensoryUpdated = false;
            for (let si = 0; si < batchScenes.length; si++) {
              const scene = batchScenes[si] as any;
              const sceneSettingObj = scene.setting;
              const sceneLoc = (typeof sceneSettingObj?.location === 'string' ? sceneSettingObj.location : '').toLowerCase();
              const sceneTimeOfDay = typeof sceneSettingObj?.timeOfDay === 'string' ? sceneSettingObj.timeOfDay : '';
              const sceneWeather = typeof sceneSettingObj?.atmosphere === 'string' ? sceneSettingObj.atmosphere : '';
              const matchedLocation = ((locProfs.keyLocations ?? []) as any[]).find((kl: any) =>
                (kl.id && sceneLoc.includes(kl.id.toLowerCase())) ||
                (kl.name && sceneLoc.includes(kl.name.toLowerCase()))
              );
              if (matchedLocation?.sensoryVariants?.length > 0) {
                const locationKey: string = matchedLocation.id ?? matchedLocation.name ?? '';
                const variant = selectSensoryVariant(
                  matchedLocation.sensoryVariants,
                  batchStart + si,
                  updatedSensory[locationKey],
                  { timeOfDay: sceneTimeOfDay, weather: sceneWeather },
                );
                if (variant?.id) {
                  updatedSensory[locationKey] = variant.id;
                  sensoryUpdated = true;
                }
              }
            }
            if (sensoryUpdated) {
              liveNarrativeState = { ...liveNarrativeState, lastUsedSensoryVariant: updatedSensory };
            }
          }

          // §5.4: Pending warning pattern — each commit recalculates recurring phrase
          // warnings and forwards them only to the next batch.
          const recurringPhraseWarnings = detectRecurringPhrases(chapters).slice(0, 10);
          liveNarrativeState = { ...liveNarrativeState, recurringPhraseWarnings };

          // Break-moment one-time deployment stamping. The full break-moment instruction
          // is injected only in the 60-85% window; once committed, mark it as deployed.
          if (inputs.worldDocument?.breakMoment?.character) {
            const relativeBatchPos = chapterEnd / Math.max(1, sceneCount);
            if (relativeBatchPos >= 0.60 && relativeBatchPos <= 0.85) {
              const existing = liveNarrativeState.deployedAssets['break_moment:story:full'] ?? [];
              if (existing.length === 0) {
                liveNarrativeState = {
                  ...liveNarrativeState,
                  deployedAssets: {
                    ...liveNarrativeState.deployedAssets,
                    'break_moment:story:full': [chapterEnd],
                  },
                };
              }
            }
          }
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

        const uniqueDeployedAtomIds = Array.from(
          new Set([
            ...batchSelectedObligationAtomIds,
            ...batchUsedTextureAtomIds,
          ]),
        );
        const lastChapterTail = proseBatch.chapters[proseBatch.chapters.length - 1]?.paragraphs?.slice(-1)[0] ?? "";
        const continuityTailPreview = String(
          liveNarrativeState?.continuityTail
          || lastChapterTail,
        )
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 220);
        const batchCommitRecord: BatchCommitRecord = {
          chapterStart,
          chapterEnd,
          chapterRange: batchLabel,
          attemptCount: attempt,
          gateOutcomes: buildBatchGateOutcomes(batchGateFailureCounts),
          newClueIdsRevealed: Array.from(new Set(batchRevealedIds)),
          cumulativeClueSet: [...new Set(liveNarrativeState?.cluesRevealedToReader ?? batchRevealedIds)],
          deployedAtomIds: uniqueDeployedAtomIds,
          continuityTailPreview,
          promptFingerprintHash: batchPromptHash,
          durationMs: Date.now() - batchStartedAt,
          cost: Math.max(0, getAgent9CostTotal(client) - batchCostBefore),
        };
        batchCommitRecords.push(batchCommitRecord);

        // Notify caller — pass validation issues from any failed attempts so the
        // orchestrator can surface them in the run history panel (§3.2).
        if (inputs.onBatchComplete) {
          const nsdCheckpoint = liveNarrativeState
            ? {
                cluesRevealedToReader: [...liveNarrativeState.cluesRevealedToReader],
                previousChapterArcPosition: liveNarrativeState.previousChapterArcPosition,
                continuityTail: liveNarrativeState.continuityTail,
                chapter: chapterEnd,
              }
            : undefined;
          await inputs.onBatchComplete(
            proseBatch.chapters,
            chapterStart,
            chapterEnd,
            lastBatchErrors,
            batchUsedTextureAtomIds,
            nsdCheckpoint,
            batchCommitRecord,
          );
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
        noteBatchGateFailures(lastBatchErrors, batchGateFailureCounts);
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

  // Fix 2: applyDeterministicPronounSweep — final conservative pronoun repair on all
  // committed chapters.  Catches residual mismatches that were accepted at attempt 3+
  // in the per-chapter pronoun gate (where the targeted repair could not safely fix
  // mixed-gender context sentences within the retry budget).
  // Does NOT use onlyNames (full-cast sweep) and uses crossParagraphInheritance for
  // better coverage.  The existing female→male guard in repairPronouns prevents false
  // replacements on correct male pronouns that follow a female character.
  if (castCharacters.length > 0) {
    let sweepRepairTotal = 0;
    for (let ci = 0; ci < chapters.length; ci++) {
      const ch = chapters[ci];
      if (!Array.isArray(ch.paragraphs) || ch.paragraphs.length === 0) continue;
      const chText = (ch.paragraphs as string[]).join('\n\n');
      const swept = repairPronouns(chText, castCharacters, { crossParagraphInheritance: true });
      if (swept.repairCount > 0) {
        chapters[ci] = { ...ch, paragraphs: swept.text.split('\n\n') };
        sweepRepairTotal += swept.repairCount;
      }
    }
    if (sweepRepairTotal > 0) {
      console.log(`[Agent 9] Deterministic pronoun sweep: ${sweepRepairTotal} repair(s) across ${chapters.length} chapter(s).`);
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
    chapterWordCounts,
  };

  const retryPacketsForTelemetry = retryPacketHistory.map(({ chapterRange, packet }) => ({
    chapterRange,
    attempt: packet.attempt,
    failureClass: packet.failureClass,
    shouldEscalate: packet.shouldEscalate,
  }));

  const validationDetails = chapterValidationHistory.length > 0 ? {
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
    requestContractViolations: requestContractViolations.length > 0 ? requestContractViolations : undefined,
    retryPackets: retryPacketsForTelemetry.length > 0 ? retryPacketsForTelemetry : undefined,
    batchCommitRecords: batchCommitRecords.length > 0 ? batchCommitRecords : undefined,
  } : proseLinterStats.checksRun > 0 || requestContractViolations.length > 0 || retryPacketsForTelemetry.length > 0 || batchCommitRecords.length > 0 ? {
    totalBatches,
    batchesWithRetries,
    failureHistory: [],
    linter: proseLinterStats,
    underflow,
    provisionalChapterScores,
    requestContractViolations: requestContractViolations.length > 0 ? requestContractViolations : undefined,
    retryPackets: retryPacketsForTelemetry.length > 0 ? retryPacketsForTelemetry : undefined,
    batchCommitRecords: batchCommitRecords.length > 0 ? batchCommitRecords : undefined,
  } : undefined;

  return {
    status: "draft",
    tone: inputs.narrativeStyle,
    chapters,
    cast: castCharacters.map((c) => c.name),
    note,
    cost,
    durationMs,
    prompt_fingerprints: promptFingerprints.length > 0 ? promptFingerprints : undefined,
    validationDetails,
  };
}
