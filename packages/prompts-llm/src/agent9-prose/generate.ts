/**
 * agent9-prose/generate.ts
 * Core prose generation loop: generateProse() orchestrator, batch scoring,
 * retry feedback, victim-alive detection, and pronoun-error extraction.
 */
import { isVictimArchetype } from "@cml/cml";
import { createHash } from "node:crypto";
import { jsonrepair } from "jsonrepair";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import {
  ChapterValidator,
  CharacterConsistencyValidator,
  getGenerationParams,
  getPronounPolicySettings,
  getStoryLengthTarget,
  repairChapterPronouns,
  repairPronouns,
  detectPronounDriftEvents,
  type PronounDriftCastEntry,
  detectVerbatimFieldEcho,
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
  resolveStageModeKey,
  sceneMatchesCmlSceneRef,
  validateChapterPreCommitObligations,
  validateBatchInferenceChain,
  RESOLUTION_RE,
  buildResolutionBackstopSentence,
  surfaceSpecKeyTerms,
} from "./clue-validation.js";
import {
  tokenizeWords,
  toNgrams,
  jaccardSimilarity,
  lintBatchProse,
  MONTH_TO_SEASON,
  deriveTemporalSeasonLock,
  getSeasonAllowList,
  enforceMonthSeasonLockOnChapterWithTelemetry,
  countMechanicalSeasonCollisions,
} from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import {
  sanitizeScenesCharacters,
  sanitizeGeneratedChapter,
  stripInternalAuditPhrasing,
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
import {
  detectConfiguredBannedPhrases,
  getRepairBannedPhrases,
  getTieredBannedPhrasePolicy,
  getWarningBannedPhrases,
  mergeUniquePhrases,
} from "./banned-phrases.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { buildChapterObligationBlock } from "./obligation-block.js";
import { buildProsePrompt, resolveVictimName, resolveDeathMethod } from "./prompt-builder.js";
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
import { polishPassingChapter, runFullStoryRepetitionPolish, shouldPolishChapter } from "./post-pass-polish.js";
import { resolvePolishProvider } from "./polish-provider.js";
import {
  applyDeterministicClearancePatch,
  buildCompletionFallbackChapter,
  buildChapterRepairContext,
  repairChapterDeterministically,
  resolveBatchMatchingClearances,
  resolveFallbackStageMode,
} from "./deterministic-repair.js";
// First-principles LLD §6.4 / P3.3 — scoped clue-regen (the A1 replacement), default-off behind
// AGENT9_REGEN_CLUE. When enabled, runs BEFORE repairChapterDeterministically so a successful regen
// makes the clue present and the deterministic A1 patch does not inject (A1 demoted to logged floor).
import { runClueRegenPass } from "./regen-integration.js";
import { makeRegenFn } from "./regen-llm.js";
import { buildStoryBible, resolveDiscriminatingTestChapter } from "../story-bible.js";
import type { StoryBible } from "../story-bible.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
  ProseGenerationResult,
  ProseLinterStats,
  ProseLinterIssue,
  ChapterRequirementLedgerEntry,
  UnderflowTelemetry,
  FallbackChapterTelemetry,
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

const CHAPTER_ACCEPTANCE_POLICY = {
  // Accept residual pronoun mismatches once explicit retry guidance and deterministic
  // repair have already been attempted repeatedly for the chapter.
  residualPronounAcceptanceAttempt: 3,
};

const shouldAcceptResidualPronounIssues = (attempt: number): boolean =>
  attempt >= CHAPTER_ACCEPTANCE_POLICY.residualPronounAcceptanceAttempt;

const shouldTreatBatchAsAttemptsExhausted = (
  attempt: number,
  maxBatchAttempts: number,
  forceTerminalFallback: boolean,
): boolean => attempt >= maxBatchAttempts || forceTerminalFallback;

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
        // R-A (M0): surface key terms, never quote the full description back — quoting it re-seeds the
        // very verbatim leak the retry is meant to cure.
        const terms = ctx?.description ? surfaceSpecKeyTerms(ctx.description) : '';
        return terms ? `${terms} [${id}]` : id;
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

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── A_55 #2: pre-test mechanism-leak gate ────────────────────────────────────────────────────────
// Mirrors @cml/rubric-score structural-verifiers.resolveMechanismExplainedChapter so that what we
// PREVENT at prose-time is exactly what the rubric would HARD-CAP (plot_structure & pacing ≤6 when the
// concealment mechanism is fully explained before the discriminating-test scene). A chapter "explains"
// the mechanism only when ≥50% of the mechanism description's salient terms co-occur AND causal/method
// EXPLANATION language is present — merely PLANTING the clue (naming the object, no causal language)
// does not trip it. Holistic: derived entirely from hidden_model.mechanism.description + the chapter's
// stage mode, never from a specific story/character/plot.
// The detector itself now lives in the ./mechanism-detect.js leaf module so the pre-scoring
// mechanism-reveal regen pass (regen-integration.ts) can key off the SAME predicate without a circular
// import (generate.ts already imports runClueRegenPass from regen-integration.js). Imported here for the
// internal generation-time gate uses below AND re-exported so existing `from "./generate.js"` importers
// and the barrel keep working unchanged.
import {
  MECHANISM_EXPLANATION_MARKER_A9,
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  mechanismExplanationParagraphIndex,
} from "./mechanism-detect.js";
export {
  MECHANISM_EXPLANATION_MARKER_A9,
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  mechanismExplanationParagraphIndex,
};
// Stage modes that precede the discriminating-test scene. A FULL mechanism explanation in any of these
// spoils the test; it is only legitimate at/after `discriminating_test` (and in the reveal/aftermath).
const PRE_DISCRIMINATING_TEST_MODES = new Set<string>([
  "discovery_opening",
  "early_investigation",
  "suspect_pressure",
  "false_suspect_clearing",
  "clue_reinterpretation",
]);

// ── A_55 #4: severity-aware best-attempt ranking ─────────────────────────────────────────────────
// The completion-first fallback retains the "best" parseable attempt across retries. Ranking by raw
// error COUNT lets a cosmetic-heavy attempt (entropy/opener/fingerprint residue) lose to one that has
// fewer errors but a STRUCTURAL defect (missing clue, victim acting after death, early resolution,
// mechanism leak). Rank by (structuralCount, totalCount) so a 0-structural attempt always wins, with
// total count as the tiebreak. Cosmetic classes mirror the accept-after-exhaustion bypass messages.
const COSMETIC_BATCH_ERROR_RE =
  /opening-style entropy too low|repeated content opener detected|repeated verbatim back-to-back|opens with the same sentence as a prior chapter|paragraph[_ ]fingerprint|repeated long paragraph fingerprint|high n-gram overlap|debug note|internal audit/i;
export const scoreBatchErrorSeverity = (errors: string[]): { structural: number; cosmetic: number; rank: number } => {
  let structural = 0;
  let cosmetic = 0;
  for (const e of errors) {
    if (COSMETIC_BATCH_ERROR_RE.test(e)) cosmetic += 1;
    else structural += 1;
  }
  return { structural, cosmetic, rank: structural * 1000 + errors.length };
};

/**
 * Scans generated paragraphs for the victim's name acting as the subject of a
 * current-scene living action. Historical testimony and corpse/body references
 * are ignored so legitimate backstory does not trip the resurrection gate.
 * Only used for chapters 2+ (caller must guard chapterNumber > 1).
 */
export const detectVictimAlive = (chapter: { paragraphs?: string[] }, victimName: string): string[] => {
  if (!victimName || !chapter?.paragraphs) return [];
  const escapedName = escapeRegExp(victimName.trim());
  // A_55 #3b: cover PAST-TENSE verbs (the register of Golden-Age mystery prose) as well as present
  // tense. The prior pattern listed ONLY present-tense forms (says/asks/stands), so in past-tense prose
  // ("Harcourt said…", "Harcourt stood…") it matched almost nothing — every real active-victim sentence
  // fell through this pre-commit gate to the post-hoc reframe pass. Mirrors @cml/story-validation
  // ACTIVE_VERB_RE (the authoritative lifecycle gate). The full victim name is still required in the
  // sentence (as the authoritative validator does), so a shared family surname cannot false-trip it.
  const ACTIVE_VERBS =
    `(?:said|says?|asked|asks?|replied|replies|answered|answers?|entered|enters?|sat|sits?|stood|stands?|` +
    `nodded|nods?|walked|walks?|crossed|cross(?:es)?|confirmed|confirms?|turned|turns?|looked|looks?|spoke|speaks?|` +
    `reacted|reacts?|responded|responds?|moved|moves?|appeared|appears?|summoned|summons?|gestured|gestures?|` +
    `examined|examines?|glanced|glances?|watched|watches?|smiled|smiles?|rose|rises?|stepped|steps?|laughed|laughs?|` +
    `leaned|leans?|wrote|writes?|listened|listens?|pointed|points?|opened|opens?|closed|closes?|handed|hands?|` +
    `pushed|pushes?|pulled|pulls?|whispered|whispers?|muttered|mutters?|declared|declares?|insisted|insists?|` +
    `is\\s+\\w+ing|was\\s+\\w+ing)`;
  const victimSubjectPattern = new RegExp(
    `\\b${escapedName}\\b(?:\\s*,[^.!?]{0,40},)?\\s+(?:\\w+\\s+){0,3}${ACTIVE_VERBS}\\b`,
    'i',
  );
  // Verb-first dialogue attribution: "…," said Harcourt / replied Sir Reginald Harcourt.
  const victimAttributionPattern = new RegExp(
    `\\b(?:said|asked|replied|answered|confessed|admitted|whispered|muttered|declared|insisted)\\b[^.!?]{0,20}\\b${escapedName}\\b`,
    'i',
  );
  const victimBodyActionPattern = new RegExp(
    `\\b${escapedName}\\b(?:'s|\\u2019s)\\s+` +
    `(?:eyes?|lips?|hands?|fingers?|face|gaze|head|shoulders?|voice|breath|posture)\\s+` +
    `(?:pressed|tightened|shifted|moved|turned|rose|fell|flicked|darted|narrowed|softened|hardened|trembled|caught|broke|lifted|lowered)\\b`,
    'i',
  );
  const victimActivePresencePattern = new RegExp(
    `\\b(?:gathered|assembled|stood|sat|waited|entered|joined|addressed|watched|listened)\\b[^.!?]{0,120}\\b${escapedName}\\b|` +
    `\\b${escapedName}\\b[^.!?]{0,120}\\b(?:gathered|assembled|stood|sat|waited|entered|joined|watched|listened)\\b`,
    'i',
  );
  const historicalOrReportedContext =
    /\b(?:before|prior to|earlier|once|formerly|in life|while alive|when alive|had\s+\w+|used to|remembered|recalled|reported|testified|wrote|letter|diary|journal|statement|said that|claimed that)\b/i;
  const deadBodyContext =
    /\b(?:body|corpse|dead|death|murdered|killed|lifeless|remains|coffin|mortuary|wound|blood|autopsy|post-mortem)\b/i;
  // A_58 #4: return the matching SENTENCE, not the whole paragraph. The hit requires the full victim
  // name, so the offending sentence names the victim — surfacing the paragraph start (which can be a
  // DIFFERENT character) produced a misleading "VICTIM ALIVE: <non-victim>…" diagnostic in the run log.
  const offendingSentences: string[] = [];
  for (const para of chapter.paragraphs) {
    const sentences = para.match(/[^.!?]+[.!?]*/g) ?? [para];
    for (const sentence of sentences) {
      const hit =
        (victimSubjectPattern.test(sentence) ||
          victimAttributionPattern.test(sentence) ||
          victimBodyActionPattern.test(sentence) ||
          victimActivePresencePattern.test(sentence)) &&
        !historicalOrReportedContext.test(sentence) &&
        !deadBodyContext.test(sentence);
      if (hit) offendingSentences.push(sentence.trim());
    }
  }
  return offendingSentences;
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

export type RetryPromptMode = "surgical_patch" | "targeted_rebuild" | "full_rebuild";

export interface RetryPromptStrategy {
  mode: RetryPromptMode;
  includePriorDraft: boolean;
  issueFamilies: string[];
  rationale: string[];
}

const detectRetryIssueFamilies = (errors: string[]): string[] => {
  const families = new Set<string>();
  for (const error of errors) {
    const lowered = error.toLowerCase();
    if (/clue evidence|clue obligation|clue visibility|missing required clue|discriminating test/.test(lowered)) {
      families.add("clue");
    }
    if (/stage-mode outcome|final reveal completeness|fair-play|no withholding|spoiler/.test(lowered)) {
      families.add("stage");
    }
    if (/setting drift|scene location coverage missing|location anchor|setting fidelity|location coverage/.test(lowered)) {
      families.add("setting");
    }
    if (/template linter|opening-style entropy|paragraph fingerprint|n-gram overlap|metadata leakage|meta-language|repeated content opener|template leakage/.test(lowered)) {
      families.add("template");
    }
    if (/word count|hard floor|preferred target|minimum words|underflow/.test(lowered)) {
      families.add("word_count");
    }
    if (/weak sensory grounding|weak atmosphere\/time grounding/.test(lowered)) {
      families.add("grounding");
    }
    if (/pronoun|entity fidelity|illegal_named_walk_on|detective_name_inconsistency|timeline|continuity|victim alive|identity/.test(lowered)) {
      families.add("continuity");
    }
    if (/boundary integrity|unbalanced quotation|malformed apostrophe|chapter\.paragraphs|structure|format|incomplete sentence/.test(lowered)) {
      families.add("structure");
    }
  }
  return Array.from(families);
};

export function chooseRetryPromptStrategy(
  errors: string[],
  attempt: number,
  maxAttempts: number,
  packet?: RetryPacket,
): RetryPromptStrategy {
  const issueFamilies = detectRetryIssueFamilies(errors);
  const familyCount = issueFamilies.length;
  const rationale: string[] = [];

  if (attempt >= maxAttempts || packet?.deterministicMitigation?.type === "split_chapter" || packet?.deterministicMitigation?.type === "structural_pivot") {
    rationale.push("final-attempt or hard mitigation triggered");
    return {
      mode: "full_rebuild",
      includePriorDraft: false,
      issueFamilies,
      rationale,
    };
  }

  if (issueFamilies.includes("template")) {
    rationale.push("template failure detected; prior wording is likely harmful anchor");
  }

  if (
    familyCount >= 3
    || errors.length >= 4
    || (packet?.shouldEscalate === true && packet.failureClass !== "template")
    || (issueFamilies.includes("clue") && issueFamilies.includes("stage"))
    || (issueFamilies.includes("clue") && issueFamilies.includes("template"))
    || (issueFamilies.includes("continuity") && issueFamilies.includes("template"))
  ) {
    rationale.push("multi-family failure requires coordinated rewrite");
    return {
      mode: "targeted_rebuild",
      includePriorDraft: false,
      issueFamilies,
      rationale,
    };
  }

  if (issueFamilies.includes("template")) {
    return {
      mode: "targeted_rebuild",
      includePriorDraft: false,
      issueFamilies,
      rationale,
    };
  }

  rationale.push("single-family fix can preserve stable draft sections");
  return {
    mode: "surgical_patch",
    includePriorDraft: true,
    issueFamilies,
    rationale,
  };
}

const extractQuotedValues = (errors: string[]): string[] =>
  Array.from(new Set(
    errors.flatMap((error) =>
      Array.from(error.matchAll(/"([^"]{1,220})"/g))
        .map((match) => String(match[1] || "").trim())
        .filter(Boolean)
    )
  ));

const extractMissingClueDescriptions = (errors: string[]): string[] =>
  Array.from(new Set(
    errors
      .map((error) => error.match(/clue evidence "([^"]+)"/i)?.[1]?.trim())
      .filter((value): value is string => Boolean(value))
  ));

const buildRetryPrimaryFailures = (errors: string[], packet?: RetryPacket): string[] => {
  const combined = [
    ...(packet?.mustFix ?? []).slice(1),
    ...errors,
  ];
  const seen = new Set<string>();
  const failures: string[] = [];
  for (const item of combined) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    failures.push(trimmed);
    if (failures.length >= 6) break;
  }
  return failures;
};

const buildRetryRewriteActions = (
  errors: string[],
  strategy: RetryPromptStrategy,
  packet: RetryPacket | undefined,
): string[] => {
  const actions: string[] = [];
  const quotedValues = extractQuotedValues(errors);
  const missingClues = extractMissingClueDescriptions(errors);
  const locationAnchor = errors
    .map((error) => error.match(/expected location anchor "([^"]+)"/i)?.[1]?.trim())
    .find(Boolean);
  // R1 (ANALYSIS_44): collect EVERY repeated opener the linter reported (it now emits one
  // issue per distinct opener) so the retry fixes them all in one pass instead of whack-a-mole.
  const openerPhrases = [
    ...new Set(
      errors
        .map((error) => error.match(/repeated content opener detected \("([^"]+)"\)/i)?.[1]?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  if (strategy.mode !== "surgical_patch") {
    actions.push("Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.");
    actions.push("Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.");
  } else {
    actions.push("Preserve paragraphs that are already valid, but fully rewrite every paragraph touched by a failing issue.");
  }

  if (missingClues.length > 0) {
    actions.push(
      `Insert or move a dedicated observation-plus-inference block for each missing clue: ${missingClues.map((value) => `"${value}"`).join("; ")}. The observation and inference must be separate full paragraphs.`
    );
  }

  if (locationAnchor) {
    actions.push(`Ground the chapter explicitly in "${locationAnchor}" on-page; make the anchor visible in scene prose, not only implied by atmosphere.`);
  }

  if (errors.some((error) => /stage-mode outcome|final reveal completeness/i.test(error))) {
    actions.push("Rewrite the chapter outcome so it matches the required story stage: if pressure mode is active, end with unresolved pressure; if reveal mode is active, include the full proof chain rather than accusation only.");
  }

  if (openerPhrases.length > 0) {
    actions.push(`Every paragraph must begin with a different name or meaningful word — no two paragraphs may share the same opening name/word (pronouns and articles like she/the/a are fine). Replace these repeated opener pattern(s) ${openerPhrases.map((value) => `"${value}"`).join(", ")} with distinct paragraph openings from different angles: sensory detail, object, movement, thought, or another speaker.`);
  }

  if (errors.some((error) => /weak sensory grounding|weak atmosphere\/time grounding/i.test(error))) {
    actions.push("Rewrite the first two paragraphs so the opening contains the exact sensory and atmosphere words counted by the validator, not loose synonyms.");
  }

  if (errors.some((error) => /discriminating test/i.test(error))) {
    actions.push("Write the discriminating test as an explicit scene beat with setup, execution, and conclusion, not as a compressed summary line.");
  }

  if (errors.some((error) => /word count|hard floor|preferred target/i.test(error))) {
    actions.push("Hit the full word target by adding concrete action, dialogue, and inference beats; do not use recap-only padding.");
  }

  if (errors.some((error) => /pronoun|entity fidelity|continuity|timeline|victim alive|identity/i.test(error))) {
    actions.push("Keep cast-canonical names, roles, and pronouns stable in every paragraph. If a sentence drifts, rewrite the whole sentence cleanly.");
  }

  if (errors.some((error) => /boundary integrity|unbalanced quotation|malformed apostrophe|chapter\.paragraphs|structure|format|incomplete sentence/i.test(error))) {
    actions.push("Before returning JSON, verify paragraph boundaries and punctuation integrity so the chapter does not fail on structure after content is fixed.");
  }

  if (packet?.failureClass === "fair_play" && packet.failureSubcode === "stage_mode_outcome") {
    actions.push("Do not accidentally resolve the case while fixing clue or setting issues; preserve unresolved pressure unless this chapter is explicitly the final reveal.");
  }

  if (actions.length === 0 && quotedValues.length > 0) {
    actions.push(`Address the validator's exact flagged text or phrases: ${quotedValues.map((value) => `"${value}"`).join("; ")}.`);
  }

  return actions.slice(0, 7);
};

const buildRetrySuccessChecklist = (
  errors: string[],
  strategy: RetryPromptStrategy,
  packet?: RetryPacket,
): string[] => {
  const checklist: string[] = [];
  const missingClues = extractMissingClueDescriptions(errors);
  const locationAnchor = errors
    .map((error) => error.match(/expected location anchor "([^"]+)"/i)?.[1]?.trim())
    .find(Boolean);
  // R1 (ANALYSIS_44): collect every reported opener for the checklist.
  const openerPhrases = [
    ...new Set(
      errors
        .map((error) => error.match(/repeated content opener detected \("([^"]+)"\)/i)?.[1]?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  checklist.push("Every listed issue below is resolved in this single attempt before you answer.");

  if (missingClues.length > 0) {
    checklist.push(`Each missing clue appears on-page as observable evidence, followed immediately by a separate inference paragraph: ${missingClues.map((value) => `"${value}"`).join("; ")}.`);
  }
  if (locationAnchor) {
    checklist.push(`The chapter explicitly grounds the scene in "${locationAnchor}".`);
  }
  if (errors.some((error) => /stage-mode outcome/i.test(error))) {
    checklist.push("The chapter outcome now matches the required story stage and does not drift into the wrong resolution mode.");
  }
  if (errors.some((error) => /final reveal completeness/i.test(error))) {
    checklist.push("If this is a reveal chapter, the proof chain includes motive, opportunity/access, and explicit evidence linkage.");
  }
  if (openerPhrases.length > 0) {
    // R2 (ANALYSIS_44): the two-word-opener gate fails on the SECOND occurrence, so the prior
    // "no more than two paragraphs" wording described a state that actually fails. Require true
    // uniqueness of meaningful openers instead.
    checklist.push(`No two paragraphs begin with the same name or meaningful word — each of these openers appeared more than once and must now be unique: ${openerPhrases.map((value) => `"${value}"`).join(", ")} (pronouns and articles like she/the/a are fine).`);
  }
  if (errors.some((error) => /weak sensory grounding/i.test(error))) {
    checklist.push("The first two paragraphs contain at least two exact sensory markers counted by the validator.");
  }
  if (errors.some((error) => /weak atmosphere\/time grounding/i.test(error))) {
    checklist.push("The first two paragraphs contain at least one exact atmosphere/time marker counted by the validator.");
  }
  if (errors.some((error) => /word count|hard floor|preferred target/i.test(error))) {
    checklist.push("The chapter reaches the required length target without filler recap.");
  }
  if (errors.some((error) => /pronoun|entity fidelity|continuity|timeline|victim alive|identity/i.test(error))) {
    checklist.push("Character names, roles, and pronouns are consistent in every sentence.");
  }
  if (errors.some((error) => /boundary integrity|unbalanced quotation|malformed apostrophe|chapter\.paragraphs|structure|format|incomplete sentence/i.test(error))) {
    checklist.push("The JSON contains multiple paragraph strings with balanced punctuation and no structural corruption.");
  }
  if (packet?.failureClass) {
    checklist.push(`Primary failure class cleared: ${packet.failureClass}${packet.failureSubcode ? ` / ${packet.failureSubcode}` : ""}.`);
  }
  if (strategy.mode !== "surgical_patch") {
    checklist.push("The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.");
  }

  return checklist.slice(0, 8);
};

export function buildSinglePassRetryPrompt(args: {
  errors: string[];
  chapterRange: string;
  attempt: number;
  maxAttempts: number;
  packet?: RetryPacket;
}): { prompt: string; strategy: RetryPromptStrategy } {
  const { errors, chapterRange, attempt, maxAttempts, packet } = args;
  const strategy = chooseRetryPromptStrategy(errors, attempt, maxAttempts, packet);
  const primaryFailures = buildRetryPrimaryFailures(errors, packet);
  const rewriteActions = buildRetryRewriteActions(errors, strategy, packet);
  const checklist = buildRetrySuccessChecklist(errors, strategy, packet);

  const lines: string[] = [];
  lines.push("SINGLE-PASS RETRY CONTRACT");
  lines.push(`Goal: resolve every listed issue for chapter(s) ${chapterRange} in this one retry.`);
  lines.push(`Retry mode: ${strategy.mode.toUpperCase()}.`);
  lines.push(`Attempt context: ${attempt}/${maxAttempts}${packet?.failureClass ? ` | primary class: ${packet.failureClass}` : ""}${packet?.failureSubcode ? ` | subcode: ${packet.failureSubcode}` : ""}.`);
  if (strategy.rationale.length > 0) {
    lines.push(`Why this mode: ${strategy.rationale.join("; ")}.`);
  }
  lines.push("");
  lines.push("SOURCE OF TRUTH");
  if (strategy.includePriorDraft) {
    lines.push("- Use the existing draft as reference only for paragraphs that already satisfy the rules.");
  } else {
    lines.push("- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.");
  }
  lines.push("- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.");
  lines.push("");
  lines.push("PRIMARY FAILURES");
  primaryFailures.forEach((failure) => lines.push(`- ${failure}`));
  lines.push("");
  lines.push("REWRITE PLAN");
  rewriteActions.forEach((action) => lines.push(`- ${action}`));
  lines.push("");
  lines.push("SUCCESS CHECKLIST");
  checklist.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("OUTPUT RULES");
  lines.push(`- Return complete corrected JSON for chapter(s) ${chapterRange} only.`);
  lines.push("- Do not explain what you changed.");
  lines.push("- Do not leave one issue unresolved while fixing another.");
  lines.push("- If two instructions conflict, prefer the one that clears the validator and preserves story logic.");

  return {
    prompt: lines.join("\n"),
    strategy,
  };
}

export function buildTerminalRetryExecutionBlock(args: {
  errors: string[];
  chapterRange: string;
  attempt: number;
  maxAttempts: number;
  packet?: RetryPacket;
}): string {
  const { errors, chapterRange, attempt, maxAttempts, packet } = args;
  const uniqueErrors = Array.from(new Set(errors.map((e) => e.trim()).filter(Boolean))).slice(0, 8);
  const hasDiscriminatingTestError = uniqueErrors.some((e) => /discriminating test/i.test(e));
  const hasClueError = uniqueErrors.some((e) => /clue evidence|clue obligation|clue visibility|missing required clue/i.test(e));
  const hasTemplateError = uniqueErrors.some((e) => /template linter|high n-gram overlap|fingerprint|repeated sentence|repeated content opener|template leakage/i.test(e));
  const hasGroundingError = uniqueErrors.some((e) => /weak sensory grounding|weak atmosphere\/time grounding|location anchoring|setting fidelity/i.test(e));
  const hasContinuityError = uniqueErrors.some((e) => /pronoun|entity fidelity|timeline|continuity|victim alive|identity/i.test(e));

  const lines: string[] = [];
  lines.push("TERMINAL RETRY EXECUTION MODE");
  lines.push(`Scope: chapter(s) ${chapterRange}`);
  lines.push(`Attempt: ${attempt}/${maxAttempts}${packet?.failureClass ? ` | class: ${packet.failureClass}` : ""}${packet?.failureSubcode ? ` | subcode: ${packet.failureSubcode}` : ""}`);
  lines.push("Objective: resolve every active validator error in a single pass.");
  lines.push("Use failed draft as negative example only. Do not preserve its sentence structures.");
  lines.push("");
  lines.push("ACTIVE ERRORS TO CLEAR");
  uniqueErrors.forEach((e) => lines.push(`- ${e}`));
  if (packet?.mustFix?.length) {
    const packetFixes = packet.mustFix.map((m) => m.trim()).filter(Boolean).slice(0, 5);
    if (packetFixes.length > 0) {
      lines.push("");
      lines.push("PACKET MUST-FIX ITEMS");
      packetFixes.forEach((m) => lines.push(`- ${m}`));
    }
  }
  lines.push("");
  lines.push("EXECUTION RULES");
  lines.push("- Solve all listed errors together; do not optimize one and regress another.");
  lines.push("- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.");
  lines.push("- Return complete corrected JSON for the target chapter batch only.");
  lines.push("- No commentary or explanation outside JSON.");

  if (hasDiscriminatingTestError) {
    lines.push("");
    lines.push("DISCRIMINATING TEST FIX CONTRACT (MANDATORY)");
    lines.push("- Include explicit competing hypotheses (Theory A vs Theory B) in-scene.");
    lines.push("- Execute one concrete, observable test action and report the direct result.");
    lines.push("- Show prove-vs-rule-out logic explicitly using because/therefore/which proves.");
    lines.push("- Name each ruled-out suspect and the culprit explicitly from cast-canonical names.");
    lines.push("- The test must be a visible scene sequence, not retrospective summary.");
  }

  if (hasClueError) {
    lines.push("");
    lines.push("CLUE DELIVERY FIX CONTRACT");
    lines.push("- Surface each required clue as an observable on-page detail before deduction.");
    lines.push("- Follow each key observation with explicit inference in a separate paragraph.");
  }

  if (hasTemplateError) {
    lines.push("");
    lines.push("TEMPLATE RESET CONTRACT");
    lines.push("- Rewrite all failing paragraphs from new sentence skeletons.");
    lines.push("- Avoid repeated paragraph openers and high-overlap phrasing from prior chapters.");
  }

  if (hasGroundingError) {
    lines.push("");
    lines.push("GROUNDING FIX CONTRACT");
    lines.push("- Ensure first two paragraphs include required sensory and atmosphere/time anchors counted by validator.");
  }

  if (hasContinuityError) {
    lines.push("");
    lines.push("CONTINUITY FIX CONTRACT");
    lines.push("- Re-check every pronoun/name reference against cast-canonical identity before output.");
  }

  lines.push("");
  lines.push("FINAL PRE-SUBMIT CHECK");
  lines.push("- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.");
  lines.push("- If any listed error remains unresolved, revise before returning.");

  return lines.join("\n");
}

// ─── TWO-PHASE RETRY (ANALYSIS_38) ────────────────────────────────────────────
// Phase 1 (logic): discriminating test, clue obligations, stage outcome,
//   continuity/pronoun, character identity, hard word-floor, structure.
// Phase 2 (quality): template linter (n-gram, fingerprint, repeated sentence/opener),
//   sensory/atmosphere grounding, preferred word count, opening-style entropy.
// Routing: when both phases are active, feedback focuses on Phase 1 only and
//   defers Phase 2 to the next attempt. This prevents instruction overload and
//   stops quality churn from masking unresolved logic failures.
// ─────────────────────────────────────────────────────────────────────────────

export type RetryPhase = "logic" | "quality" | "mixed";

/**
 * Splits a set of validation errors into logic (Phase 1) and quality (Phase 2) buckets.
 * Logic errors must be resolved before quality errors receive dedicated feedback.
 */
export function classifyRetryPhase(errors: string[]): {
  phase: RetryPhase;
  logicErrors: string[];
  qualityErrors: string[];
} {
  const logicErrors = errors.filter((e) => {
    return (
      /discriminating test/i.test(e) ||
      /clue evidence|clue obligation|clue visibility|missing required clue|\bclue_[a-z_]+\b/i.test(e) ||
      /stage-mode outcome failed/i.test(e) ||
      /^VICTIM ALIVE:/i.test(e) ||
      /pronoun|entity fidelity|illegal_named_walk_on|detective_name_inconsistency|timeline|continuity|victim alive|victim alibi|identity/i.test(e) ||
      /character.*name.*not found|name.*not in.*cast/i.test(e) ||
      /boundary integrity|unbalanced quotation|malformed apostrophe|chapter\.paragraphs|incomplete sentence/i.test(e) ||
      /word count below hard floor/i.test(e)
    );
  });
  const qualityErrors = errors.filter((e) => !logicErrors.includes(e));
  const phase: RetryPhase =
    logicErrors.length > 0 && qualityErrors.length > 0 ? "mixed"
    : logicErrors.length > 0 ? "logic"
    : "quality";
  return { phase, logicErrors, qualityErrors };
}

/**
 * Header prepended when the retry is locked to Phase 1 (logic only).
 * Tells the model exactly why quality issues are omitted from this attempt.
 */
export function buildLogicPhaseHeader(deferredQualityErrors: string[]): string {
  const lines: string[] = [];
  lines.push("RETRY PHASE: 1 of 2 — LOGIC CONTRACTS ONLY");
  lines.push("This attempt resolves logic/contract failures only. Style and quality issues are held until logic is clean.");
  lines.push("Focus exclusively on the errors listed above. Do not attempt to restyle, restructure, or reopen settled passages.");
  if (deferredQualityErrors.length > 0) {
    lines.push("");
    lines.push(`DEFERRED TO PHASE 2 (${deferredQualityErrors.length} quality issue(s) — address ONLY after this attempt passes logic gates):`);
    deferredQualityErrors.slice(0, 5).forEach((e) => lines.push(`  (deferred) ${e}`));
    if (deferredQualityErrors.length > 5) lines.push(`  ... and ${deferredQualityErrors.length - 5} more.`);
  }
  return lines.join("\n");
}

/**
 * Header prepended when the retry is locked to Phase 2 (quality/polish only).
 * Tells the model logic is locked and must not regress.
 */
export function buildQualityPhaseHeader(): string {
  const lines: string[] = [];
  lines.push("RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY");
  lines.push("Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.");
  lines.push("REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.");
  lines.push("Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.");
  lines.push("If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.");
  return lines.join("\n");
}
// ─────────────────────────────────────────────────────────────────────────────

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
  const entityFidelityErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    (
      e.toLowerCase().includes('illegal_named_walk_on') ||
      e.toLowerCase().includes('detective_name_inconsistency') ||
      e.toLowerCase().includes('entity fidelity') ||
      e.toLowerCase().includes('name inconsistency')
    )
  );
  const characterErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    !entityFidelityErrors.includes(e) &&
    (e.toLowerCase().includes('character') || e.toLowerCase().includes('name'))
  );
  // Use specific patterns for setting-drift messages rather than broad includes('setting'),
  // because "metadata key-value leakage (e.g. \"Setting:\", \"Mood:\")" also contains the
  // word "setting" in its example text, which would mis-bucket it here instead of templateErrors.
  const settingErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !entityFidelityErrors.includes(e) && !characterErrors.includes(e) &&
    (/setting drift|setting markers/i.test(e) || e.toLowerCase().includes('location'))
  );
  const testErrors = errors.filter(e => !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && e.toLowerCase().includes('discriminating test'));
  // Word-count errors contain "chapter" so they would otherwise match qualityErrors and receive
  // misleading "vary paragraph lengths" guidance. Extract them first; the MICRO-PROMPT [word_count]
  // directive in buildRetryMicroPromptDirectives already gives the correct repair instruction.
  const wordCountErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !entityFidelityErrors.includes(e) && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) &&
    /word count below/i.test(e)
  );
  // Template-linter errors (n-gram overlap, paragraph fingerprint, opening-style entropy, and
  // chapter-validator scaffold/metadata/meta-language leakage) are extracted BEFORE qualityErrors
  // because several of them contain the words "paragraph" or "chapter" and would otherwise fall
  // into qualityErrors, where they receive wrong advice ("vary paragraph lengths").
  const templateErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    !entityFidelityErrors.includes(e) &&
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    (/template linter/i.test(e) ||
      /templated scaffold prose|metadata key-value leakage|meta-language about storytelling/i.test(e))
  );
  const stageModeErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) &&
    !entityFidelityErrors.includes(e) &&
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    !templateErrors.includes(e) &&
    /stage-mode outcome failed/i.test(e)
  );
  const qualityErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) && !pronounErrors.includes(e) /* [PHASE 2] */ && !entityFidelityErrors.includes(e) && !characterErrors.includes(e) && !settingErrors.includes(e) && !testErrors.includes(e) && !wordCountErrors.includes(e) && !templateErrors.includes(e) && !stageModeErrors.includes(e) &&
    !/^VICTIM ALIVE:/i.test(e) &&
    !/weak sensory grounding/i.test(e) &&  // handled by REPAIR [sensory_grounding] micro-prompt
    (e.toLowerCase().includes('paragraph') || e.toLowerCase().includes('chapter'))
  );
  const victimAliveErrors = errors.filter(e => e.includes('VICTIM ALIVE:'));
  const otherErrors = errors.filter(e =>
    !clueValidationErrors.includes(e) &&
    !pronounErrors.includes(e) && // [PHASE 2]
    !entityFidelityErrors.includes(e) &&
    !characterErrors.includes(e) &&
    !settingErrors.includes(e) &&
    !testErrors.includes(e) &&
    !wordCountErrors.includes(e) &&
    !templateErrors.includes(e) &&
    !stageModeErrors.includes(e) &&
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
    const stageModeRawErrors = rawErrors.filter((e) => /stage-mode outcome failed/i.test(e));

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

    if (stageModeRawErrors.some((e) => /suspect_pressure/i.test(e) && /no full culprit resolution/i.test(e))) {
      directives.push(
        `REPAIR [suspect_pressure_no_resolution — attempt ${attemptNum}]: remove all final-verdict language.\n` +
        `  Do NOT write confession, arrest, case solved, culprit named as murderer, guilt proved, or final accusation.\n` +
        `  Keep the chapter ending as unresolved pressure: one contradiction, one narrowed suspicion, or one new question.\n` +
        `  Allowed: "this makes Roy harder to dismiss" / "the timeline no longer protects him".\n` +
        `  Forbidden: "this proves Roy did it" / "Roy was the murderer" / "the case was solved".`
      );
    }

    if (stageModeRawErrors.some((e) => /discovery_opening/i.test(e) && /confession|arrest|solution/i.test(e))) {
      directives.push(
        `REPAIR [opening_no_solution_language — attempt ${attemptNum}]: Chapter 1 must stop at discovery and first suspicion.\n` +
        `  Remove words such as confession, arrest, solution, solved, culprit, guilty, murderer, proves, and final accusation unless they refer only to the fact of a murder.\n` +
        `  End with an open investigative question or a physical clue, not a deduction that explains the crime.`
      );
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

    const boundaryIntegrityError = rawErrors.find((e) =>
      /boundary integrity|unbalanced quotation marks|malformed apostrophe/i.test(e)
    );
    if (boundaryIntegrityError) {
      directives.push(
        `REPAIR [boundary_integrity — attempt ${attemptNum}]: The chapter has punctuation-boundary corruption (unbalanced quotes or malformed apostrophes).\n` +
        `  Before returning JSON, run this exact checklist:\n` +
        `  1) Every opening quote has a closing quote in the same paragraph.\n` +
        `  2) Apostrophes only appear in valid contractions/possessives (don't, can't, detective's), never fused tokens like word'paused.\n` +
        `  3) If a sentence is edited, rewrite the whole sentence so punctuation and spacing remain intact.\n` +
        `  Return only clean prose with balanced punctuation.`
      );
    }

    const fragmentTruncationError = rawErrors.find((e) =>
      /incomplete sentence before a closing quotation mark/i.test(e)
    );
    if (fragmentTruncationError) {
      directives.push(
        `REPAIR [sentence_fragment_truncation — attempt ${attemptNum}]: One or more paragraphs end with a truncated sentence immediately before a closing quotation mark.\n` +
        `  Before returning, scan every paragraph that contains a closing quote mark and verify:\n` +
        `  1) The sentence immediately before the closing quote is grammatically complete (ends with a full stop, question mark, or exclamation mark).\n` +
        `  2) There is NO trailing whitespace or bare article/preposition (the, a, an, to, for, in, by, of) immediately before a closing quote.\n` +
        `  Rewrite any truncated sentence to its natural conclusion. Do not shorten the chapter to avoid the issue — extend the sentence instead.`
      );
    }

    const entityFidelityError = rawErrors.find((e) =>
      /entity fidelity|illegal_named_walk_on|detective_name_inconsistency/i.test(e)
    );
    if (entityFidelityError) {
      directives.push(
        `REPAIR [entity_fidelity — attempt ${attemptNum}]: Character identity consistency failed.\n` +
        `  Use cast-canonical names only and keep detective naming stable in this chapter.\n` +
        `  Do not introduce titled walk-on names unless that exact person exists in cast.\n` +
        `  If a title+surname form is chosen for a character, keep it consistent across all paragraphs.`
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
      if (attemptNum <= 2 && retriesRemaining >= 1) {
        directives.push(
          `REPAIR [template_overlap — attempt ${attemptNum} — STRUCTURED REWRITE MODE]: Overlap detected; freeform retry mode is disabled for this chapter.\n` +
          `  Treat the prior draft as DISCARDED. Rebuild paragraph-by-paragraph in this order:\n` +
          `  Para 1: A named character performs a concrete physical action tied to this chapter's scene objective.\n` +
          `  Para 2: Introduce one scene-specific clue/observation through dialogue or direct sensory perception.\n` +
          `  Para 3+: Advance the conflict with chapter-specific consequences; vary sentence openings and clause structures.\n` +
          `  Do NOT preserve sentence skeletons from prior drafts. Every paragraph must use a distinct syntactic frame.`
        );
      } else if (retriesRemaining >= 2) {
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
  

  if (entityFidelityErrors.length > 0) {
    feedback += `═══ ENTITY FIDELITY ERRORS (${entityFidelityErrors.length}) ═══\n`;
    entityFidelityErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: Use canonical cast identities and keep detective naming stable across the chapter.\n`;
    feedback += `✓ If a title/surname form is used (for example, "Inspector Hale"), keep that form consistent instead of switching variants mid-scene.\n`;
    feedback += `✓ Do NOT introduce new titled walk-on names; use anonymous roles ("a constable", "the footman") unless the person exists in cast.\n\n`;
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
        feedback += `\nPreserve continuity with the established story facts, but rebuild the phrasing from new sentence structures.\n`;
        feedback += `Keep the clue state, cast facts, and chapter obligations intact while making the prose read like a genuinely new draft.\n\n`;
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
    // R3: template_bleed opening feedback — fires when the opener-uniqueness or location-boilerplate
    // linter fires. Two distinct sub-cases:
    //   (a) character-name / word-dominance opener: the same first word (e.g. a protagonist's name)
    //       starts 3+ paragraphs, or the same two-word opener appears twice.
    //   (b) location-boilerplate opener: the chapter opens with a room-inventory phrase.
    // matchingPriorParagraph carries the offending first-two-word token (lowercased), so we
    // read its first token to discriminate. "the" / "entering" → location bleed; anything else
    // (a proper name, a verb, etc.) → character/word dominance.
    const bleedIssues = (options?.linterIssues ?? []).filter(i => i.type === 'template_bleed');
    if (bleedIssues.length > 0) {
      const firstBleedOpener = (bleedIssues[0].matchingPriorParagraph ?? '').toLowerCase().trim();
      const firstBleedToken = firstBleedOpener.split(/\s+/)[0] ?? '';
      const isLocationBleed = firstBleedToken === 'the' || firstBleedToken === 'entering';
      if (isLocationBleed) {
        feedback += `⛔ LOCATION BOILERPLATE OPENING — your chapter opens with a room name or location set-piece.\n`;
        feedback += `  WRONG: "The Library in Little Middleton held a tense weight..."\n`;
        feedback += `  WRONG: "Entering The Study in [Location], she noticed..."\n`;
        feedback += `  WRONG: First paragraph names three or more rooms (Hall, Library, Study...) as an orientation list.\n`;
        feedback += `  RIGHT: Open with a character action, sensory reaction, or dialogue specific to this scene moment.\n`;
        feedback += `  The first word must NOT be "The" followed by a room name, nor "Entering The".\n\n`;
      } else if (firstBleedToken) {
        const capitalised = firstBleedToken.charAt(0).toUpperCase() + firstBleedToken.slice(1);
        feedback += `⛔ REPEATED PARAGRAPH OPENER — too many paragraphs in this chapter begin with "${capitalised}".\n`;
        feedback += `  The automated validator rejected this chapter because "${capitalised}" appears as the opening word of 3 or more paragraphs, or the same two-word opener (e.g. "${firstBleedOpener}") appears more than once.\n`;
        feedback += `  You MUST rewrite the chapter so that no more than 2 paragraphs begin with "${capitalised}".\n`;
        feedback += `  Vary your paragraph openings by using:\n`;
        feedback += `    - a sensory detail (sound, smell, temperature, quality of light)\n`;
        feedback += `    - another character's name, action, or spoken words\n`;
        feedback += `    - an object, physical element, or environmental detail\n`;
        feedback += `    - a temporal or spatial marker ("A moment later...", "In the far corner...", "By the time...")\n`;
        feedback += `    - an interior thought or realisation that does NOT lead with ${capitalised}'s name\n`;
        feedback += `  Each paragraph must open from a genuinely different angle. "${capitalised}" must not begin more than 2 paragraphs in the entire chapter.\n\n`;
      }
    }
  }

  if (wordCountErrors.length > 0) {
    feedback += `═══ WORD COUNT FAILURES (${wordCountErrors.length}) ═══\n`;
    wordCountErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\nSee RETRY MICRO-PROMPTS below for the specific word target and expansion strategy.\n\n`;
  }

  if (stageModeErrors.length > 0) {
    feedback += `═══ STAGE-MODE OUTCOME FAILURES (${stageModeErrors.length}) ═══\n`;
    stageModeErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\nThe chapter is violating the required story-stage behavior. Do not merely change wording; change the chapter outcome.\n`;
    feedback += `Use the RETRY MICRO-PROMPTS below to decide whether this chapter should stop at pressure, perform a test, or deliver final revelation.\n\n`;
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

export function buildCanonicalRetryBrief(args: {
  errors: string[];
  caseData: CaseData;
  chapterRange: string;
  attempt: number;
  maxAttempts: number;
  packet?: RetryPacket;
  redesignEnabled?: boolean;
  enhancedFeedbackOptions?: {
    linterIssues?: ProseLinterIssue[];
    enableSurgicalFingerprintRetry?: boolean;
    priorChapterParagraphs?: string[];
    lastBatchChapterTexts?: string[];
    promptTargetWords?: number;
  };
}): { feedback: string; strategy: RetryPromptStrategy } {
  const {
    errors,
    caseData,
    chapterRange,
    attempt,
    maxAttempts,
    packet,
    redesignEnabled,
    enhancedFeedbackOptions,
  } = args;
  const singlePassRetry = buildSinglePassRetryPrompt({
    errors,
    chapterRange,
    attempt,
    maxAttempts,
    packet,
  });
  const useTerminalRetryMode = attempt >= Math.max(3, maxAttempts - 1);
  const retryPhaseInfo = classifyRetryPhase(errors);

  let feedback: string;
  let strategy = singlePassRetry.strategy;
  if (useTerminalRetryMode) {
    feedback = `${singlePassRetry.prompt}\n\n${buildTerminalRetryExecutionBlock({
      errors,
      chapterRange,
      attempt,
      maxAttempts,
      packet,
    })}`;
  } else if (retryPhaseInfo.phase === "mixed") {
    const logicSinglePass = buildSinglePassRetryPrompt({
      errors: retryPhaseInfo.logicErrors,
      chapterRange,
      attempt,
      maxAttempts,
      packet,
    });
    strategy = logicSinglePass.strategy;
    const qualityLinterTypes = new Set(["paragraph_fingerprint", "ngram_overlap", "template_bleed", "opening_style_entropy"]);
    const logicPhaseOptions = {
      ...enhancedFeedbackOptions,
      linterIssues: (enhancedFeedbackOptions?.linterIssues ?? []).filter((issue) => !qualityLinterTypes.has(issue.type)),
    };
    feedback = `${logicSinglePass.prompt}\n\n${buildLogicPhaseHeader(retryPhaseInfo.qualityErrors)}\n\n${buildEnhancedRetryFeedback(
      retryPhaseInfo.logicErrors,
      caseData,
      chapterRange,
      attempt,
      maxAttempts,
      logicPhaseOptions,
    )}`;
  } else if (retryPhaseInfo.phase === "quality") {
    const qualitySinglePass = buildSinglePassRetryPrompt({
      errors: retryPhaseInfo.qualityErrors,
      chapterRange,
      attempt,
      maxAttempts,
      packet,
    });
    strategy = qualitySinglePass.strategy;
    feedback = `${qualitySinglePass.prompt}\n\n${buildQualityPhaseHeader()}\n\n${buildEnhancedRetryFeedback(
      retryPhaseInfo.qualityErrors,
      caseData,
      chapterRange,
      attempt,
      maxAttempts,
      enhancedFeedbackOptions,
    )}`;
  } else {
    feedback = `${singlePassRetry.prompt}\n\n${buildEnhancedRetryFeedback(
      errors,
      caseData,
      chapterRange,
      attempt,
      maxAttempts,
      enhancedFeedbackOptions,
    )}`;
  }

  if (redesignEnabled && packet) {
    feedback = `${feedback}\n\n${buildRetryFeedback(packet)}`;
  }

  return { feedback, strategy };
}

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

// A_66 P1+P2, completed for THIS path — the "Fix 2" final sweep was the last ungated
// deterministic pronoun mutation in the pipeline: probe #3's first re-run (mystery-1784832044130)
// applied 11 flips from exactly here while generation-params said `pronoun_policy: verify`.
// The law now holds end-to-end:
//   P1 — the sweep obeys the policy: under verify/off (checkingEnabled=false) it never runs,
//        never even computes candidates. Deterministic pronoun repair is strict/relaxed-only.
//   P2 — every chapter mutation wraps in the HIGH-PRECISION guard: a sweep whose result raises
//        attribution-flips + impossible-self-references REVERTS for that chapter, and reporting
//        keys on TEXT CHANGE, never repairCount (the probe-#1 silent-mutation telemetry hole).
// Exported for the fixture tests — fixture the FAILURE, not the fix (A_66 §6).
export function applyFinalPronounSweep(
  chapters: ProseChapter[],
  castCharacters: PronounDriftCastEntry[],
  checkingEnabled: boolean,
): { chaptersChanged: number; revertedChapters: number } {
  const result = { chaptersChanged: 0, revertedChapters: 0 };
  if (!checkingEnabled || castCharacters.length === 0) return result;
  for (let ci = 0; ci < chapters.length; ci++) {
    const ch = chapters[ci];
    if (!Array.isArray(ch.paragraphs) || ch.paragraphs.length === 0) continue;
    const chText = (ch.paragraphs as string[]).join('\n\n');
    const swept = repairPronouns(chText, castCharacters, { crossParagraphInheritance: true });
    if (swept.text === chText) continue; // text-change honesty — repairCount lies both ways
    const before = detectPronounDriftEvents(chText, castCharacters).length;
    const after = detectPronounDriftEvents(swept.text, castCharacters).length;
    if (after > before) {
      result.revertedChapters++;
      console.warn(
        `[Agent 9] Final pronoun sweep REVERTED for chapter ${ci + 1} (A_66 P2): high-precision mismatches would rise (${before} → ${after}).`,
      );
      continue;
    }
    chapters[ci] = { ...ch, paragraphs: swept.text.split('\n\n') };
    result.chaptersChanged++;
  }
  if (result.chaptersChanged > 0) {
    console.log(
      `[Agent 9] Final pronoun sweep changed text in ${result.chaptersChanged} chapter(s) (guarded, A_66 P2).`,
    );
  }
  return result;
}

export async function generateProse(
  client: AzureOpenAIClient,
  inputs: ProseGenerationInputs,
  maxAttempts?: number
): Promise<ProseGenerationResult> {
  const configuredMaxAttempts = getGenerationParams().agent9_prose.generation.default_max_attempts;
  const resolvedMaxAttempts = maxAttempts ?? configuredMaxAttempts;
  const enableSurgicalFingerprintRetry = inputs.enableSurgicalFingerprintRetry !== false;
  const preferCompletionOnFailure = inputs.preferCompletionOnFailure !== false;
  // R4 (ANALYSIS_44): surface the resolved terminal-on-exhaustion mode so post-mortems can tell
  // whether a stalled run would have best-effort-committed (true) or hard-aborted (false).
  console.warn(
    `[Agent 9] Prose generation start: preferCompletionOnFailure=${preferCompletionOnFailure} (false ⇒ retry-exhaustion hard-aborts the run).`,
  );
  const start = Date.now();
  const outlineActs = Array.isArray(inputs.outline.acts) ? inputs.outline.acts : [];
  const scenes = outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
  const sceneCount = scenes.length;

  const resumeCheckpoint = inputs.resumeCheckpoint;
  const resumedChapters = Array.isArray(resumeCheckpoint?.chapters)
    ? resumeCheckpoint.chapters
        .filter((chapter): chapter is ProseChapter =>
          Boolean(chapter)
          && typeof chapter.title === 'string'
          && Array.isArray(chapter.paragraphs)
          && chapter.paragraphs.every((paragraph) => typeof paragraph === 'string')
        )
        .slice(0, sceneCount)
    : [];
  
  const chapters: ProseChapter[] = [...resumedChapters];
  const chapterSummaries: ChapterSummary[] = resumedChapters.map((chapter, idx) =>
    extractChapterSummary(chapter, idx + 1, (inputs.cast as any)?.characters?.map((c: any) => c?.name).filter(Boolean) ?? []),
  );
  const chapterValidationHistory: Array<{ chapterNumber: number; attempt: number; errors: string[] }> = [];
  const requestContractViolations: Array<{ chapterRange: string; errors: string[] }> = [];
  const retryPacketHistory: Array<{ chapterRange: string; packet: RetryPacket }> = [];
  const batchCommitRecords: BatchCommitRecord[] = [];
  const fallbackTelemetry: FallbackChapterTelemetry[] = [];
  const provisionalChapterScores: ProvisionalChapterScore[] = [];
  // E5: Collect prompt fingerprints per chapter for traceability
  const promptFingerprints: Array<{ chapter: number; hash: string; section_sizes: Record<string, number> }> =
    Array.isArray(resumeCheckpoint?.promptFingerprints)
      ? resumeCheckpoint.promptFingerprints.filter((entry) =>
          Boolean(entry)
          && Number.isFinite(Number(entry.chapter))
          && typeof entry.hash === 'string'
          && entry.hash.length > 0
          && Boolean(entry.section_sizes)
        )
      : [];
  const chapterValidator = new ChapterValidator();
  const pronounValidator = new CharacterConsistencyValidator();
  const temporalSeasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const progressCallback = inputs.onProgress || (() => {});
  const cast = normalizeProseCastOrThrow(inputs.cast);
  const castCharacters = cast.characters;
  const castNames = castCharacters.map(c => c.name);
  const rolloutFlagsRaw = (getGenerationParams().agent9_prose as any)?.rollout_flags;
  const rolloutFlags = {
    phrase_family_detection_enabled: rolloutFlagsRaw?.phrase_family_detection_enabled !== false,
    uncapped_repair_targets_enabled: rolloutFlagsRaw?.uncapped_repair_targets_enabled !== false,
    precommit_phrase_gate_enabled: rolloutFlagsRaw?.precommit_phrase_gate_enabled !== false,
    tiered_phrase_contract_enabled: rolloutFlagsRaw?.tiered_phrase_contract_enabled !== false,
    phrase_specific_linter_enabled: rolloutFlagsRaw?.phrase_specific_linter_enabled !== false,
    blue_sky_mode_enabled: rolloutFlagsRaw?.blue_sky_mode_enabled === true,
    season_lock_context_aware_enabled: rolloutFlagsRaw?.season_lock_context_aware_enabled !== false,
    season_lock_protected_collocations_enabled:
      rolloutFlagsRaw?.season_lock_protected_collocations_enabled !== false,
    boundary_integrity_gate_enabled: rolloutFlagsRaw?.boundary_integrity_gate_enabled !== false,
    semantic_rewrite_diff_guard_enabled: rolloutFlagsRaw?.semantic_rewrite_diff_guard_enabled !== false,
    entity_fidelity_gate_enabled: rolloutFlagsRaw?.entity_fidelity_gate_enabled !== false,
    culprit_alias_gate_enabled: rolloutFlagsRaw?.culprit_alias_gate_enabled !== false,
    integrity_retry_packet_enabled: rolloutFlagsRaw?.integrity_retry_packet_enabled !== false,
    integrity_blue_sky_mode_enabled: rolloutFlagsRaw?.integrity_blue_sky_mode_enabled === true,
    opener_exhaustion_bypass_enabled: rolloutFlagsRaw?.opener_exhaustion_bypass_enabled !== false,
  };
  const phrasePolicyRequired =
    rolloutFlags.tiered_phrase_contract_enabled
    || rolloutFlags.phrase_specific_linter_enabled
    || rolloutFlags.phrase_family_detection_enabled;
  const bannedPhrasePolicy = phrasePolicyRequired
    ? getTieredBannedPhrasePolicy(inputs.caseData)
    : { hard: [], soft: [], watch: [] };
  const configuredRepairPhrases = rolloutFlags.phrase_family_detection_enabled
    ? getRepairBannedPhrases(bannedPhrasePolicy)
    : [];
  const configuredWarningPhrases = rolloutFlags.phrase_family_detection_enabled
    ? getWarningBannedPhrases(bannedPhrasePolicy)
    : [];
  const proseModelConfig = getGenerationParams().agent9_prose.prose_model;
  const batchSize = Math.max(1, Math.min(inputs.batchSize || 1, proseModelConfig.max_batch_size));
  const pronounCheckingEnabled = getPronounPolicySettings().checkingEnabled;
  // P3.3 — scoped clue-regen, OFF by default (behaviour identical to today unless explicitly enabled).
  const regenClueEnabled = process.env.AGENT9_REGEN_CLUE === "true" || process.env.AGENT9_REGEN_CLUE === "1";
  let regenBible: StoryBible | null = null; // built lazily on the first chapter that needs it
  const proseLinterStats: ProseLinterStats = {
    checksRun: 0,
    failedChecks: 0,
    openingStyleEntropyFailures: 0,
    openingStyleEntropyBypasses: 0,
    openerBypasses: 0,
    paragraphFingerprintFailures: 0,
    ngramOverlapFailures: 0,
    bannedPhraseFailures: 0,
    boundaryIntegrityFailures: 0,
  };
  const integrityTelemetry = {
    seasonLockReplacements: 0,
    seasonLockProtectedCollisionsBlocked: 0,
    semanticRewriteDiffBlocks: 0,
  };
  const hardFloorMissChapters = new Set<number>();
  const preferredTargetMissChapters = new Set<number>();
  let hardFloorMissCount = 0;
  let preferredTargetMissCount = 0;
  let underflowExpansionAttempts = 0;
  let underflowExpansionRecovered = 0;
  let underflowExpansionFailed = 0;
  const chapterWordCounts: Array<{ chapter: number; words: number }> = resumedChapters.map((chapter, idx) => ({
    chapter: idx + 1,
    words: countWords((chapter.paragraphs ?? []).join(' ')),
  }));
  // FIX-C2: eagerly track which batch indices required at least one retry so the
  // count survives a throw that exits generateProse() before the post-loop aggregation.
  const retriedBatches = new Set<number>();

  // A_71 — the post-pass polish is ONCE PER CHAPTER, after that chapter has passed. Invariant.
  //
  // The accept path is re-entered on every batch attempt, so a chapter that passed on attempt 1 is
  // re-evaluated (and was re-polished) on attempts 2, 3, … whenever ANOTHER chapter in the same batch
  // forced a batch retry. Measured on the 2026-07-31 agent-loop run: Ch4 was polished 4×, Ch6 3×,
  // Ch7/Ch8/Ch9 2× each — 13 calls for 5 chapters, at ~2.4x the projected spend.
  //
  // The default `attempt === 1` guard masked this, which is why it never showed before: it is only
  // visible once AGENT9_POLISH_RETRIED_CHAPTERS or AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS lifts that
  // guard. Run-scoped, so it holds across batches, attempts, and both opt-in flags.
  const polishedChapterNumbers = new Set<number>();

  // Deep-copy the caller's NarrativeState so mutations during generation (updateNSD calls)
  // do not bleed back into the orchestrator's copy.  Array/object fields need explicit
  // spreading because the outer spread {...inputs.narrativeState} is only one level deep.
  let liveNarrativeState: NarrativeState | undefined = resumeCheckpoint?.narrativeState
    ? {
        ...resumeCheckpoint.narrativeState,
        lockedFacts: [...(resumeCheckpoint.narrativeState.lockedFacts ?? [])],
        characterPronouns: { ...(resumeCheckpoint.narrativeState.characterPronouns ?? {}) },
        cluesRevealedToReader: [...(resumeCheckpoint.narrativeState.cluesRevealedToReader ?? [])],
      }
    : inputs.narrativeState
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

  const escapeForRegex = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const victimNamesForActiveCoverage = new Set<string>(
    ((inputs.caseData as any)?.CASE?.cast ?? [])
      .filter((entry: any) => isVictimArchetype(entry?.role_archetype ?? entry?.role))
      .map((entry: any) => String(entry?.name ?? '').trim().toLowerCase())
      .filter(Boolean),
  );

  const validateSceneCastAndLocationCoverage = (
    chapter: ProseChapter,
    scene: any,
    chapterNumber: number,
  ): string[] => {
    const errors: string[] = [];
    const chapterText = (chapter.paragraphs ?? []).join(" ");
    const chapterTextLower = chapterText.toLowerCase();

    const expectedCharacters = (Array.isArray(scene?.characters) ? scene.characters : [])
      .map((entry: any) => (typeof entry === 'string' ? entry : String(entry?.name ?? '')))
      .map((name: string) => name.trim())
      .filter((name: string) =>
        name.length > 0 &&
        (chapterNumber <= 1 || !victimNamesForActiveCoverage.has(name.toLowerCase()))
      );

    if (expectedCharacters.length > 0) {
      const matched = expectedCharacters.filter((name: string) => {
        const normalized = name.toLowerCase();
        if (chapterTextLower.includes(normalized)) return true;
        const surname = normalized.split(/\s+/).pop() ?? "";
        return surname.length >= 4
          && new RegExp(`\\b${escapeForRegex(surname)}\\b`, 'i').test(chapterText);
      });

      if (matched.length === 0) {
        errors.push(
          `Chapter ${chapterNumber}: scene cast coverage missing — expected at least one of [${expectedCharacters.join(', ')}] to appear by name in prose.`,
        );
      }
    }

    const sceneLocationRaw = String(scene?.setting?.location ?? scene?.location ?? "").trim();
    if (sceneLocationRaw.length > 0) {
      const normalizedLocation = sceneLocationRaw.toLowerCase();
      const locationTokens = normalizedLocation
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 4)
        .slice(0, 5);

      const hasLocationMention =
        chapterTextLower.includes(normalizedLocation)
        || locationTokens.some((token) =>
          new RegExp(`\\b${escapeForRegex(token)}\\b`, 'i').test(chapterText),
        );

      if (!hasLocationMention) {
        errors.push(
          `Chapter ${chapterNumber}: scene location coverage missing — expected location anchor "${sceneLocationRaw}" was not grounded in prose.`,
        );
      }
    }

    return errors;
  };

  if (chapters.length > 0 && chapters.length < sceneCount) {
    progressCallback(
      'prose',
      `Resuming prose generation from chapter ${chapters.length + 1}/${sceneCount} using checkpointed chapters.`,
      91,
    );
  }

  // Generate and validate scenes in configurable batches.
  // When batchSize=1 (default) this processes one chapter per LLM call;
  // higher values group multiple scenes into a single call for throughput gains.
  for (let batchStart = chapters.length; batchStart < scenes.length; batchStart += batchSize) {
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
    const dtSceneCheck = cmlCase?.prose_requirements?.discriminating_test_scene;
    // A_55 #2: salient terms of the concealment mechanism, computed once. Used by the pre-test
    // mechanism-leak gate below to keep the method withheld until the discriminating-test scene.
    const mechanismTermsA55 = deriveMechanismTerms(
      String((cmlCase as any)?.hidden_model?.mechanism?.description ?? ""),
    );
    // A_61 RC2.4 — when Bible-authoritative, the pre-test boundary is the frozen macro-arc DISCRIMINATING
    // chapter (read once), not re-derived from the stage-mode-name set. Null → keep today's stage-mode path.
    const bibleAuthoritativeA55 =
      process.env.AGENT9_BIBLE_AUTHORITATIVE === "true" || process.env.AGENT9_BIBLE_AUTHORITATIVE === "1";
    const dtBoundaryChapter = bibleAuthoritativeA55
      ? resolveDiscriminatingTestChapter(inputs.macroArcPlan ?? inputs.storyContract?.macroArcPlan ?? [])
      : null;
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

    // FIX 2: retain the best LLM attempt across retries. On exhaustion we commit this best
    // real prose instead of the deterministic completion template — the template was the
    // source of the `clue_id_*` / scene-objective leakage and the canned repeated beats.
    // "Best" = fewest hard validation errors; ties keep the earliest attempt.
    let bestAttemptChapters: ProseChapter[] | null = null;
    let bestAttemptErrorCount = Number.POSITIVE_INFINITY;
    // A_55 #4: severity rank of the retained best attempt (structuralCount*1000 + totalCount). Lower is
    // better; a structurally-clean attempt always outranks one with a structural defect.
    let bestAttemptSeverityRank = Number.POSITIVE_INFINITY;
    const cloneProseChapter = (c: ProseChapter): ProseChapter => ({
      ...c,
      title: c.title,
      paragraphs: Array.isArray(c.paragraphs) ? [...c.paragraphs] : [],
    });

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
          const enhancedFeedbackOptions = {
            linterIssues: lastLinterIssues,
            enableSurgicalFingerprintRetry,
            priorChapterParagraphs: chapters.flatMap(ch => ch.paragraphs),
            lastBatchChapterTexts, // TYPE 2: expose pronoun offending sentences
            promptTargetWords: getPromptPreferredWords(inputs.targetLength ?? "medium"),
          };
          const canonicalRetry = buildCanonicalRetryBrief({
            errors: lastBatchErrors,
            caseData: inputs.caseData,
            chapterRange: batchLabel,
            attempt,
            maxAttempts: maxBatchAttempts,
            packet: currentRetryPacket,
            redesignEnabled,
            enhancedFeedbackOptions,
          });
          if (lastBatchRawResponse && attempt < maxBatchAttempts && canonicalRetry.strategy.includePriorDraft) {
            prompt.messages.push({ role: "assistant" as const, content: lastBatchRawResponse });
          }
          prompt.messages.push({ role: "user" as const, content: canonicalRetry.feedback });
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
            retryAttempt: attempt,
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
          // A_58 #11: trim trailing whitespace for the DISPLAY so a model that pads its response with
          // dozens of blank lines doesn't bury the meaningful tail (the stored response is untouched).
          const rawTail = response.content.trimEnd().slice(-300);
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
        const batchClearanceContext = resolveBatchMatchingClearances({
          batchScenes,
          batchStart,
          cmlCase,
          scenes,
        });

        // Validate each chapter in the batch individually
        let batchErrors: string[] = [];
        const provisionalBatchScores: ProvisionalChapterScore[] = [];
        for (let i = 0; i < proseBatch.chapters.length; i++) {
          // P2-10: Run season lock before pronoun repair; sanitize (anonymizeUnknownTitledNames)
          // runs AFTER pronoun repair so it doesn't weaken antecedents that pronoun repair needs.
          const initialSeasonLockResult = enforceMonthSeasonLockOnChapterWithTelemetry(
            proseBatch.chapters[i],
            temporalSeasonLock,
            {
              contextAware: rolloutFlags.season_lock_context_aware_enabled,
              protectedCollocations: rolloutFlags.season_lock_protected_collocations_enabled,
              semanticDiffGuard: rolloutFlags.semantic_rewrite_diff_guard_enabled,
            },
          );
          integrityTelemetry.seasonLockReplacements += initialSeasonLockResult.telemetry.replacements;
          integrityTelemetry.seasonLockProtectedCollisionsBlocked +=
            initialSeasonLockResult.telemetry.protectedCollisionsBlocked;
          integrityTelemetry.semanticRewriteDiffBlocks += initialSeasonLockResult.telemetry.semanticDiffBlocks;
          let chapter = initialSeasonLockResult.chapter;
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
          const sceneForChapter = batchScenes[i] as any;
          const repairContext = buildChapterRepairContext({
            chapterNumber,
            scene: sceneForChapter,
            sceneCount,
            caseData: inputs.caseData,
            cmlCase,
            scenes,
            dtSceneCheck,
            ledgerEntry,
            clueDistribution: inputs.clueDistribution,
            matchingClearances: batchClearanceContext.chapterMatchingClearances[i] ?? batchClearanceContext.batchMatchingClearances,
          });
          const chapterMode = repairContext.stageMode;
          const suspectNames = repairContext.suspectNames;
          const culpritName = repairContext.culpritName ?? "";
          // L1 (ROADMAP_TO_80 M0): surface the DEATH method (stabbing/etc.) in the reveal, not the
          // concealment mechanism. Falls back to the mechanism description when no death method is derivable.
          const murderMethod: string = resolveDeathMethod(inputs.caseData) || ((inputs.caseData as any)?.CASE?.hidden_model?.mechanism?.description ?? '');
          const stageContractCheck = {
            mode: chapterMode,
            victimName: resolveVictimName(inputs.cast).trim() || undefined,
            suspectNames,
            culpritName: culpritName || undefined,
            murderMethod: murderMethod || undefined,
          };

          // Deterministic pronoun repair before validation — catches unambiguous mismatches cheaply.
          // Controlled by agent9_prose.validation.pronoun_policy / pronoun_checking_enabled.
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

          // P3.3 (default-off, AGENT9_REGEN_CLUE) — dramatize any MISSING required clue in-scene via a
          // scoped LLM regen BEFORE the deterministic A1 patch. A successful plant makes the clue
          // present, so `repairChapterDeterministically` will not inject the A1 scaffold; whatever regen
          // cannot resolve is logged and falls through to the deterministic floor (never silent).
          if (regenClueEnabled) {
            try {
              if (!regenBible) {
                regenBible = buildStoryBible({
                  lockedFacts: inputs.lockedFacts,
                  cast: cmlCase?.cast,
                  victim: resolveVictimName(inputs.cast) || undefined,
                  culprits: cmlCase?.culpability?.culprits,
                  macroArcPlan: inputs.macroArcPlan ?? inputs.storyContract?.macroArcPlan,
                  cmlCase,
                  characterBundle: inputs.characterBundle as any,
                  storyContract: inputs.storyContract as any,
                });
              }
              const cluePass = await runClueRegenPass({
                chapter,
                ledgerEntry,
                bible: regenBible,
                regen: makeRegenFn({ client, model: inputs.model, runId: inputs.runId, projectId: inputs.projectId }),
                clueDistribution: inputs.clueDistribution,
                castNames,
                onUnresolved: (d, reason) =>
                  console.warn(`[Agent 9] regen-clue UNRESOLVED ch${chapterNumber} ${d.obligationRef}: ${reason} (deterministic floor will apply)`),
              });
              if (cluePass.ran) {
                chapter = cluePass.chapter;
                proseBatch.chapters[i] = chapter;
                if (cluePass.repaired.length > 0) {
                  console.warn(`[Agent 9] regen-clue planted [${cluePass.repaired.join(", ")}] in ch${chapterNumber} (A1 patch suppressed for these).`);
                }
              }
            } catch (err) {
              // Regen is best-effort: any failure leaves `chapter` untouched and the deterministic
              // repair below runs exactly as it does today. Never breaks the run.
              console.warn(`[Agent 9] regen-clue pass failed ch${chapterNumber}: ${err instanceof Error ? err.message : String(err)} (falling through to deterministic repair).`);
            }
          }

          const deterministicRepair = repairChapterDeterministically({
            chapter,
            repairContext,
            ledgerEntry,
            clueDistribution: inputs.clueDistribution,
            caseData: inputs.caseData,
            castNames,
            // Keep runtime behavior aligned with prior flow: clearance insertion remains
            // a targeted linter-triggered fallback instead of an always-on prevalidation patch.
            applyClearancePatch: false,
          });
          chapter = deterministicRepair.chapter;
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

            // Verbatim field-echo gate: reject chapters that transcribe a fed schema
            // field (clue.description / pointsTo / discriminating_test.design) verbatim
            // instead of dramatizing it. Name-agnostic; the >=12 consecutive-word run
            // threshold leaves short locked facts ("forty minutes") untouched. This is
            // the gate that was missing when run_1d55f7c7 shipped the verbatim
            // "A controlled reenactment demonstrates the grandfather clock's spring
            // tension and hand positions…" sentence into Chapters 9 and 10.
            {
              const dt: any = (inputs.caseData as any)?.CASE?.discriminating_test ?? {};
              const fedObligationStrings: string[] = [
                dt.design, dt.test_description, dt.expected_result,
                ...(inputs.clueDistribution?.clues ?? []).flatMap((c: any) => [c?.description, c?.pointsTo, c?.points_to]),
              ].filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0);
              const candidateProse = (candidate.paragraphs as string[]).join('\n\n');
              for (const echo of detectVerbatimFieldEcho(candidateProse, fedObligationStrings).slice(0, 4)) {
                hardErrors.push(
                  `Chapter ${chapterNumber}: a clue/test description was copied verbatim into the prose ` +
                  `(${echo.wordCount} consecutive words from "${echo.source}…"). ` +
                  `Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.`,
                );
              }
            }

            const obligations = ledgerEntry
              ? validateChapterPreCommitObligations(
                  candidate,
                  ledgerEntry,
                  inputs.clueDistribution,
                  castNames,
                  isLastBatch ? (() => {
                    const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
                    // A_71 — ITEM 11's validator half was DEAD: this object never carried
                    // revealChapterText, so `revealSatisfiesResolution` was always false and the
                    // final chapter was unconditionally required to re-stage the confession/arrest —
                    // even when an earlier chapter already delivered it. That is the mechanism behind
                    // the recurring "Chapter N repeats Chapter N-1" defect, and it put this check in
                    // direct contradiction with the aftermath re-stage detector (the model burned
                    // three attempts caught between "must confess" and "must not confess").
                    // Committed earlier chapters ARE the reveal candidates; join them so the check
                    // can see a resolution that already happened on-page.
                    const priorChaptersText = chapters
                      .map((c) => (c?.paragraphs ?? []).join(" "))
                      .join(" ");
                    return culpritSurname
                      ? {
                          isLastChapter: true,
                          culpritName,
                          culpritSurname,
                          murderMethod: murderMethod || undefined,
                          revealChapterText: priorChaptersText,
                        }
                      : undefined;
                  })() : undefined,
                  stageContractCheck
                )
              : undefined;

            const sceneCoverageErrors = validateSceneCastAndLocationCoverage(
              candidate,
              batchScenes[i],
              chapterNumber,
            );
            if (sceneCoverageErrors.length > 0) {
              hardErrors.push(...sceneCoverageErrors);
            }
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

            // A_55 #2: a pre-test chapter must PLANT the mechanism clue but WITHHOLD the method. A full
            // causal explanation here spoils the discriminating test and the rubric hard-caps
            // plot_structure & pacing ≤6. Gated to pre-test stage modes (the test scene + reveal may
            // explain freely) and to the rubric's own detector so we only block what would be capped.
            if (
              mechanismTermsA55.length > 0 &&
              // RC2.4: dereference the frozen Bible boundary when authoritative, else the stage-mode set.
              (dtBoundaryChapter != null
                ? chapterNumber < dtBoundaryChapter
                : PRE_DISCRIMINATING_TEST_MODES.has(chapterMode as string))
            ) {
              const candidateTextLower = (candidate.paragraphs ?? []).join("\n").toLowerCase();
              if (chapterFullyExplainsMechanism(candidateTextLower, mechanismTermsA55)) {
                hardErrors.push(
                  `Chapter ${chapterNumber}: the concealment mechanism is explained before the ` +
                  `discriminating-test scene. Plant the physical clue (name the object/observation), but ` +
                  `do NOT reveal HOW the trick worked — withhold the method/causal explanation until the ` +
                  `discriminating-test scene or the final reveal.`,
                );
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
                const expandedSeasonLockResult = enforceMonthSeasonLockOnChapterWithTelemetry(
                  expanded,
                  temporalSeasonLock,
                  {
                    contextAware: rolloutFlags.season_lock_context_aware_enabled,
                    protectedCollocations: rolloutFlags.season_lock_protected_collocations_enabled,
                    semanticDiffGuard: rolloutFlags.semantic_rewrite_diff_guard_enabled,
                  },
                );
                integrityTelemetry.seasonLockReplacements += expandedSeasonLockResult.telemetry.replacements;
                integrityTelemetry.seasonLockProtectedCollisionsBlocked +=
                  expandedSeasonLockResult.telemetry.protectedCollisionsBlocked;
                integrityTelemetry.semanticRewriteDiffBlocks += expandedSeasonLockResult.telemetry.semanticDiffBlocks;
                chapter = expandedSeasonLockResult.chapter;
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
                const deterministicRepair = repairChapterDeterministically({
                  chapter,
                  repairContext,
                  ledgerEntry,
                  clueDistribution: inputs.clueDistribution,
                  caseData: inputs.caseData,
                  castNames,
                  applyClearancePatch: false,
                });
                chapter = deterministicRepair.chapter;
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
          // Surviving mismatches keep retrying until the chapter acceptance policy permits
          // residual acceptance on later attempts.
          // Controlled by agent9_prose.validation.pronoun_policy / pronoun_checking_enabled.
          if (pronounCheckingEnabled && castCharacters.length > 0) {
            const chapterText = chapter.paragraphs.join('\n\n');
            const pronounStory = { id: 'pronoun-check', projectId: 'pronoun-check',
              scenes: [{ number: chapterNumber, title: chapter.title, text: chapterText }] };
            const validatorErrors = pronounValidator.validate(pronounStory, inputs.caseData as any).errors;
            const pronounIssues = validatorErrors
              .filter((e) => e.type === 'pronoun_gender_mismatch')
              .map((e) => e.message);
            const entityFidelityIssues = rolloutFlags.entity_fidelity_gate_enabled
              ? validatorErrors
                  .filter((e) => e.type === 'illegal_named_walk_on' || e.type === 'detective_name_inconsistency')
                  .map((e) => `Entity fidelity: ${e.message}`)
              : [];

            if (entityFidelityIssues.length > 0) {
              chapterErrors.push(...entityFidelityIssues);
            }

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
                const residualValidatorErrors = pronounValidator.validate(residualStory, inputs.caseData as any).errors;
                const residualPronounIssues = residualValidatorErrors
                  .filter((e) => e.type === 'pronoun_gender_mismatch')
                  .map((e) => e.message);
                const residualEntityIssues = rolloutFlags.entity_fidelity_gate_enabled
                  ? residualValidatorErrors
                      .filter((e) => e.type === 'illegal_named_walk_on' || e.type === 'detective_name_inconsistency')
                      .map((e) => `Entity fidelity: ${e.message}`)
                  : [];
                if (residualEntityIssues.length > 0) {
                  chapterErrors.push(...residualEntityIssues);
                }
                if (residualPronounIssues.length > 0) {
                  if (shouldAcceptResidualPronounIssues(attempt)) {
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
                if (shouldAcceptResidualPronounIssues(attempt)) {
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
          // A_67 polish scope: by default the polish pass runs only on chapters that passed cleanly on
          // the FIRST attempt — but the reveal/discriminating-test chapters (where planning/validation
          // leakage concentrates) most often needed a retry, so they silently skip polish. When
          // AGENT9_POLISH_RETRIED_CHAPTERS is on, run one polish pass on any accepted chapter regardless
          // of attempt (still one call, still rollback-guarded). Default off — opt-in (adds one LLM call
          // per retried chapter) so it can be probed against the current behaviour.
          const polishRetriedChapters =
            process.env.AGENT9_POLISH_RETRIED_CHAPTERS === "true" || process.env.AGENT9_POLISH_RETRIED_CHAPTERS === "1";
          // A_68 (prose audit): the machine-prose the external review flags concentrates in the
          // reveal / discriminating-test / clearance chapters — which (a) most often needed a retry
          // (so attempt!==1 skipped them) AND (b) score HIGH on the provisional preview because it is
          // composed of word/clue/issue density with ZERO prose-flatness term, so a clue-complete
          // reveal chapter clears the <95 gate and is excluded a second time. AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS
          // runs polish on any ACCEPTED high-leakage-stage-mode chapter regardless of attempt AND bypasses
          // the provisional gate for it. Rollback-guarded (worst case = today's accepted chapter). Default
          // OFF — opt-in / probe (one extra LLM call per such chapter). Runtime getter (dotenv-freeze trap).
          // A_71 — PROMOTED TO DEFAULT-ON. Measured on the 2026-07-31 full run with this off: the
          // three-part default gate (passed AND attempt===1 AND provisional<95) excluded EVERY
          // chapter and the polish stage made zero calls — the pass was effectively dead. Two
          // subsequent runs with it on produced 8 and 6 polish calls, zero errors, every one
          // rollback-guarded. Set AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS=false to restore the old
          // behaviour. Runtime getter, never a module const (dotenv-freeze trap).
          const polishHighLeakageChapters =
            process.env.AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS !== "false" &&
            process.env.AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS !== "0";
          const isHighLeakageStageMode =
            repairContext.stageMode === "final_reveal" ||
            repairContext.stageMode === "discriminating_test" ||
            repairContext.stageMode === "suspect_pressure" ||
            repairContext.stageMode === "false_suspect_clearing";
          const polishHighLeakage = polishHighLeakageChapters && isHighLeakageStageMode;
          if (chapterErrors.length === 0) {
            const provisionalPreview = buildProvisionalChapterScore(
              chapter,
              chapterNumber,
              ledgerEntry,
              evaluation.contentValidation.issues,
              inputs.clueDistribution,
              castNames,
            );
            if (
              shouldPolishChapter({
                chapterNumber,
                chapterPassed: true,
                alreadyPolished: polishedChapterNumbers,
                attempt,
                provisionalScore: provisionalPreview.score,
                polishRetriedChapters,
                polishHighLeakage,
              })
            ) {
              // Claim the chapter BEFORE the call, not after. Marking on success would let a rollback
              // (validator regression, truncation, refusal) re-open the chapter for another polish on
              // the next batch attempt — which is the same repeat spend by a different route. One
              // attempt per chapter, outcome irrelevant.
              polishedChapterNumbers.add(chapterNumber);
              // Flag-gated alternate provider for this stage only (AGENT9_POLISH_PROVIDER=anthropic).
              // Resolved HERE, inside the `chapterErrors.length === 0` branch, so the guarantee is
              // structural rather than a convention: a chapter that failed its gates never reaches
              // this line, and so is never sent to the polish provider. Undefined ⇒ today's client.
              // Share the host client's logger AND cost tracker, so a Sonnet 5 polish call lands in
              // logs/llm.jsonl + logs/llm-prompts-full.jsonl and in per-agent cost attribution
              // exactly as an Azure call does. Without this the stage bills silently and invisibly.
              const polishProvider = resolvePolishProvider({
                logger: typeof (client as any)?.getLogger === "function" ? (client as any).getLogger() : undefined,
                costTracker:
                  typeof (client as any)?.getCostTracker === "function" ? (client as any).getCostTracker() : undefined,
              });
              const polished = await polishPassingChapter({
                chapter,
                client,
                repairContext,
                model: inputs.model,
                polishClient: polishProvider?.client,
                polishModel: polishProvider?.model,
                runId: inputs.runId,
                projectId: inputs.projectId,
                validateCandidate: async (candidate) => {
                  let polishedCandidate = candidate;
                  if (pronounCheckingEnabled && castCharacters.length > 0) {
                    const pronRepair = repairChapterPronouns(polishedCandidate, castCharacters);
                    if (pronRepair.repairCount > 0) {
                      polishedCandidate = pronRepair.chapter;
                    }
                  }
                  polishedCandidate = sanitizeGeneratedChapter(polishedCandidate, castNames);
                  const polishedEvaluation = evaluateCandidate(polishedCandidate, false);
                  const polishedErrors = [...polishedEvaluation.hardErrors];
                  if (chapterNumber > 1) {
                    const retryVictimName = resolveVictimName(inputs.cast);
                    if (retryVictimName) {
                      const victimAliveSentences = detectVictimAlive(polishedCandidate, retryVictimName);
                      for (const offendingSentence of victimAliveSentences) {
                        polishedErrors.push(`VICTIM ALIVE: "${offendingSentence.slice(0, 120)}"`);
                      }
                    }
                  }
                  return { chapter: polishedCandidate, hardErrors: polishedErrors };
                },
              });
              if (polished.keptPolishedVersion) {
                chapter = polished.chapter;
                proseBatch.chapters[i] = chapter;
                evaluation = evaluateCandidate(chapter, false);
              }
            }
          }

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
        // P2-H scene matching: try exact (act + scene) first; fall back to act-only for
        // the last batch in each act when no exact match is found. The helper is reused by
        // both validation-exhaustion fallback and generation-exception fallback so clearance
        // obligations stay consistent no matter how the batch exits.
        const { chapterMatchingClearances, batchMatchingClearances } = batchClearanceContext;
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
        if (rolloutFlags.phrase_specific_linter_enabled) {
          linterOptions.bannedPhrases = bannedPhrasePolicy.hard;
        }
        linterOptions.boundaryIntegrityGateEnabled = rolloutFlags.boundary_integrity_gate_enabled;
        // Cast names: exclude character-name paragraph openers from the template-bleed gate
        // (a paragraph opening with a cast name is natural prose, not scaffold repetition).
        linterOptions.castNames = castNames;
        // [PHASE 5] Pass macro arc plan and batch start for archetype validation
        if (inputs.macroArcPlan && inputs.macroArcPlan.length > 0) {
          linterOptions.macroArcPlan = inputs.macroArcPlan;
          linterOptions.batchChapterStart = batchStart + 1;
        }
        let linterIssues = lintBatchProse(proseBatch.chapters, chapters, [], linterOptions);
        // A_67 FIX-1(b): when the suspect-elimination regen channel is on, do NOT take the deterministic
        // register-paragraph shortcut here — let the suspect_clearance_missing issue escalate to an LLM
        // retry so the clearance is dramatized rather than pasted. The post-LLM regen pass + injector floor
        // (agent9-run) still guarantee coverage, so this never strands the release gate.
        const suspectElimRegenOn =
          process.env.AGENT9_REGEN_SUSPECT_ELIM === "true" || process.env.AGENT9_REGEN_SUSPECT_ELIM === "1";
        if (!suspectElimRegenOn && batchMatchingClearances.length > 0 && linterIssues.some((issue) => issue.type === "suspect_clearance_missing")) {
          let insertedClearances = 0;
          proseBatch.chapters = proseBatch.chapters.map((chapter, idx) => {
            const patch = applyDeterministicClearancePatch(
              chapter,
              chapterMatchingClearances[idx] ?? batchMatchingClearances,
              chapterRequirementLedger[idx],
              inputs.clueDistribution,
            );
            insertedClearances += patch.insertedSuspects.length;
            return patch.chapter;
          });
          if (insertedClearances > 0) {
            linterIssues = lintBatchProse(proseBatch.chapters, chapters, [], linterOptions);
            console.warn(
              `[Agent 9] Deterministic clearance patch applied for ch${batchLabel}: inserted ${insertedClearances} suspect-clearance paragraph(s) before retry escalation.`,
            );
          }
        }
        const precommitLinterIssues = rolloutFlags.precommit_phrase_gate_enabled
          ? linterIssues
          : linterIssues.filter((issue) => issue.type !== "banned_phrase");
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
          if (linterIssues.some((issue) => issue.type === "banned_phrase")) {
            proseLinterStats.bannedPhraseFailures += 1;
          }
          if (linterIssues.some((issue) => issue.type === "boundary_integrity")) {
            proseLinterStats.boundaryIntegrityFailures += 1;
          }
          if (hasNarrativeHardErrors) {
            // F4: Split deferred gate by issue type.
            // opening_style_entropy depends on multi-chapter context and may resolve naturally
            // as the story grows — safe to defer.
            // paragraph_fingerprint and ngram_overlap are exact-match violations: a repeated
            // phrase or paragraph is wrong regardless of whether a narrative error also exists.
            // These are never deferred so they cannot accumulate across chapters while the
            // narrative-error retry loop is running.
            const nonDeferrableIssues = precommitLinterIssues.filter(
              (issue) => issue.type !== 'opening_style_entropy'
            );
            if (nonDeferrableIssues.length > 0) {
              batchErrors.push(...nonDeferrableIssues.map((issue) => issue.message));
            }
            const deferredCount = precommitLinterIssues.length - nonDeferrableIssues.length;
            if (deferredCount > 0) {
              console.warn(
                `[Agent 9] Deferred opening-style entropy for ch${batchLabel} attempt ${attempt}/${maxBatchAttempts} while narrative hard errors remain.`,
              );
            }
          } else {
            batchErrors.push(...precommitLinterIssues.map((issue) => issue.message));
          }
        }

        const isEntropyOnlyFailure =
          batchErrors.length > 0 &&
          precommitLinterIssues.length > 0 &&
          precommitLinterIssues.every((issue) => issue.type === "opening_style_entropy") &&
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

        // R3 (ANALYSIS_44): repeated-paragraph-opener exhaustion backstop. A `template_bleed`
        // opener residual is cosmetic and reliably trips on first drafts; without a bypass it can
        // hard-abort a whole run (it is in none of the other accept-after-exhaustion paths). Mirror
        // the entropy bypass, but scope by MESSAGE STRING — the `template_bleed` type is shared with
        // the location-inventory check, which must stay blocking; only the "repeated content opener
        // detected" message is accepted here. The `every(...)` guards ensure a co-occurring real
        // defect (including a location-inventory template_bleed) keeps the batch blocking.
        const isOpenerOnlyFailure =
          batchErrors.length > 0 &&
          precommitLinterIssues.length > 0 &&
          precommitLinterIssues.every((issue) => issue.type === "template_bleed") &&
          batchErrors.every((error) =>
            // Cosmetic opener/duplicate template_bleed messages — accept-after-exhaustion rather than
            // hard-abort. The M1 (ROADMAP_TO_80) adjacent-duplicate and cross-chapter repeated-opener
            // checks emit their own messages and carry no `matchingPriorParagraph`, so they generate no
            // actionable retry feedback; without these prefixes they would hard-stop a run that a
            // deterministic fallback chapter can legitimately trip. (See template-bleed-no-backstop memory.)
            error.startsWith("Template linter: repeated content opener detected") ||
            error.startsWith("Template linter: a sentence is repeated verbatim back-to-back") ||
            error.startsWith("Template linter: this chapter opens with the same sentence as a prior chapter"),
          );

        if (
          isOpenerOnlyFailure &&
          attempt >= maxBatchAttempts &&
          rolloutFlags.opener_exhaustion_bypass_enabled
        ) {
          proseLinterStats.openerBypasses += 1;
          console.warn(
            `[Agent 9] Batch ch${batchLabel} exhausted opener retries; accepting batch with repeated-opener warning to avoid false hard-stop.`,
          );
          progressCallback(
            'prose',
            `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} accepted with residual repeated-opener warning after ${maxBatchAttempts} attempts`,
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
          precommitLinterIssues.length > 0 &&
          precommitLinterIssues.every((issue) =>
            issue.type === "paragraph_fingerprint" || issue.type === "debug_note_bleed"
          );
        if (isLinterOnlyFingerprintOrNoteFailure) {
          // Strip debug-note paragraphs before accepting so they don't appear in the story.
          let debugNoteStripped = 0;
          for (let ci = 0; ci < proseBatch.chapters.length; ci++) {
            const ch = proseBatch.chapters[ci];
            if (!Array.isArray(ch.paragraphs)) continue;
            const filtered = (ch.paragraphs as string[]).filter(
              (p: string) => stripInternalAuditPhrasing(p).trim().length > 0
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

        // [G3] Inference-path chain check (soft / preferred-miss only — does not block commits).
        // For each chapter in this batch, verify that if a revealed clue is required by a
        // reader-observable inference step, the step's observation tokens appear in the chapter.
        if (inputs.storyContract?.inferenceChain && inputs.storyContract.inferenceChain.length > 0) {
          const g3Misses = validateBatchInferenceChain(
            proseBatch.chapters,
            batchScenes as Array<{ cluesRevealed?: string[] }>,
            inputs.storyContract.inferenceChain,
            chapterStart,
          );
          if (g3Misses.length > 0) {
            console.warn(
              `[Agent 9] G3 inference-chain soft misses for ch${batchLabel}:\n` +
              g3Misses.map(m => `  - ${m}`).join('\n')
            );
            // Feed into batchErrors on first attempt only as non-blocking advisory (won't cause a retry
            // on its own — if batchErrors already has hard failures these are appended; if no hard
            // failures exist the error block is skipped and the batch is committed normally).
            if (attempt === 1) {
              // Log but do NOT add to batchErrors — this is advisory only
            }
          }
        }

        // FIX 2 + A_55 #4: snapshot the STRUCTURALLY-soundest attempt seen so far (not merely the
        // fewest-errors one), so a cosmetic-heavy attempt never loses to one carrying a structural
        // defect. Ranks by (structuralCount, totalCount). Runs for every attempt (including 0-error
        // ones, though those commit directly below), so a good attempt-2 is never lost to a worse one.
        const attemptSeverity = scoreBatchErrorSeverity(batchErrors);
        if (attemptSeverity.rank < bestAttemptSeverityRank) {
          bestAttemptSeverityRank = attemptSeverity.rank;
          bestAttemptErrorCount = batchErrors.length;
          bestAttemptChapters = proseBatch.chapters.map(cloneProseChapter);
        }

        if (batchErrors.length > 0) {
          let forceTerminalFallback = false;
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
              if (!preferCompletionOnFailure) {
                const abortErr = new Error(
                  `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} marked non-convergent after attempt ${attempt}/${maxBatchAttempts}: ${packet.failureClass}`,
                );
                (abortErr as any).retriedBatches = retriedBatches.size;
                throw abortErr;
              }
              console.warn(
                `[Agent 9] Completion-first mode: ch${batchLabel} marked non-convergent at attempt ${attempt}/${maxBatchAttempts}; routing directly to deterministic fallback instead of spending more LLM retries.`,
              );
              forceTerminalFallback = true;
            }
          }

          // F: Failure diagnostics — log raw vs extracted content metrics to diagnose
          // truncation, parse failures, and word count regressions across retry attempts.
          const rawResponseLength = response.content.length;
          const extractedChapterWordCounts = proseBatch.chapters.map((ch) =>
            countWords((ch.paragraphs ?? []).join(' '))
          );
          const totalExtractedWords = extractedChapterWordCounts.reduce((a, b) => a + b, 0);
          // A_58 #11: trim trailing whitespace for the DISPLAY (model padding shouldn't bury the tail).
          const rawTail = response.content.trimEnd().slice(-300);
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

          const attemptsExhausted = shouldTreatBatchAsAttemptsExhausted(
            attempt,
            maxBatchAttempts,
            forceTerminalFallback,
          );
          if (attemptsExhausted) {
            const errorSummary = batchErrors.slice(0, 5).join('; ');
            if (!preferCompletionOnFailure) {
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

            const exhaustionIssues = [...batchErrors];
            const fallbackInitialWords = proseBatch.chapters.map((chapter) =>
              countWords((chapter.paragraphs ?? []).join(' ')),
            );
            // FIX 2: prefer the best real LLM attempt over the deterministic template. The
            // template only fires when no parseable LLM attempt was ever retained for this batch.
            const usedBestAttempt = bestAttemptChapters !== null
              && bestAttemptChapters.length === proseBatch.chapters.length;
            proseBatch.chapters = usedBestAttempt
              ? bestAttemptChapters!.map(cloneProseChapter)
              : proseBatch.chapters.map((chapter, idx) =>
                buildCompletionFallbackChapter(
                  chapter,
                  batchScenes[idx],
                  chapterStart + idx,
                  chapterRequirementLedger[idx],
                  inputs.clueDistribution,
                  inputs.caseData,
                  {
                    stageMode: resolveFallbackStageMode({
                      scene: batchScenes[idx],
                      chapterNumber: chapterStart + idx,
                      sceneCount,
                      cmlCase,
                      allScenes: scenes,
                      dtSceneCheck,
                    }),
                    matchingClearances: chapterMatchingClearances[idx] ?? batchMatchingClearances,
                    focusName: ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? undefined,
                  },
                ),
              );
            const fallbackValidationErrors: string[] = [];
            proseBatch.chapters.forEach((fallbackChapter, idx) => {
              const fallbackChapterNumber = chapterStart + idx;
              if (!fallbackChapter.title || typeof fallbackChapter.title !== 'string') {
                fallbackValidationErrors.push(`Chapter ${fallbackChapterNumber}: fallback title is missing.`);
              }
              if (!Array.isArray(fallbackChapter.paragraphs) || fallbackChapter.paragraphs.length === 0) {
                fallbackValidationErrors.push(`Chapter ${fallbackChapterNumber}: fallback paragraphs are missing.`);
              }

              const fallbackContentValidation = chapterValidator.validateChapter({
                title: fallbackChapter.title,
                paragraphs: fallbackChapter.paragraphs,
                chapterNumber: fallbackChapterNumber,
                totalChapters: sceneCount,
                temporalMonth: temporalSeasonLock?.month,
                temporalSeason: temporalSeasonLock?.season,
              }, inputs.caseData);
              fallbackContentValidation.issues
                .filter((issue) => issue.severity === 'critical' || issue.severity === 'major')
                .forEach((issue) => {
                  fallbackValidationErrors.push(
                    `Chapter ${fallbackChapterNumber}: fallback validation failed: ${issue.message}` +
                    `${issue.suggestion ? ` (${issue.suggestion})` : ''}`,
                  );
                });

              const fallbackLedgerEntry = chapterRequirementLedger[idx];
              if (fallbackLedgerEntry) {
                const sceneForChapter = batchScenes[idx] as any;
                const isDiscriminatingTestChapter = dtSceneCheck
                  ? sceneMatchesCmlSceneRef(
                      sceneForChapter,
                      dtSceneCheck,
                      scenes,
                      /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i,
                    )
                  : fallbackChapterNumber >= Math.ceil(sceneCount * 0.70);
                const chapterMode = resolveStageModeKey(
                  fallbackChapterNumber,
                  fallbackChapterNumber,
                  sceneCount,
                  isDiscriminatingTestChapter,
                  cmlCase,
                  scenes,
                  [sceneForChapter],
                );
                const suspectNames = ((cmlCase?.cast ?? []) as any[])
                  .filter((entry: any) => {
                    const role = String(entry?.role_archetype ?? entry?.role ?? '').toLowerCase();
                    return !role.includes('detective') && !isVictimArchetype(role);
                  })
                  .map((entry: any) => String(entry?.name ?? ''))
                  .filter(Boolean);
                const culpritName: string = ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? '';
                // L1 (ROADMAP_TO_80 M0): surface the DEATH method (stabbing/etc.) in the reveal, not the
          // concealment mechanism. Falls back to the mechanism description when no death method is derivable.
          const murderMethod: string = resolveDeathMethod(inputs.caseData) || ((inputs.caseData as any)?.CASE?.hidden_model?.mechanism?.description ?? '');
                const fallbackObligations = validateChapterPreCommitObligations(
                  fallbackChapter,
                  fallbackLedgerEntry,
                  inputs.clueDistribution,
                  castNames,
                  isLastBatch ? (() => {
                    const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
                    // A_71 — ITEM 11's validator half was DEAD: this object never carried
                    // revealChapterText, so `revealSatisfiesResolution` was always false and the
                    // final chapter was unconditionally required to re-stage the confession/arrest —
                    // even when an earlier chapter already delivered it. That is the mechanism behind
                    // the recurring "Chapter N repeats Chapter N-1" defect, and it put this check in
                    // direct contradiction with the aftermath re-stage detector (the model burned
                    // three attempts caught between "must confess" and "must not confess").
                    // Committed earlier chapters ARE the reveal candidates; join them so the check
                    // can see a resolution that already happened on-page.
                    const priorChaptersText = chapters
                      .map((c) => (c?.paragraphs ?? []).join(" "))
                      .join(" ");
                    return culpritSurname
                      ? {
                          isLastChapter: true,
                          culpritName,
                          culpritSurname,
                          murderMethod: murderMethod || undefined,
                          revealChapterText: priorChaptersText,
                        }
                      : undefined;
                  })() : undefined,
                  {
                    mode: chapterMode,
                    victimName: resolveVictimName(inputs.cast).trim() || undefined,
                    suspectNames,
                    culpritName: culpritName || undefined,
                    murderMethod: murderMethod || undefined,
                  },
                );
                fallbackValidationErrors.push(...fallbackObligations.hardFailures);
              }

              fallbackValidationErrors.push(
                ...validateSceneCastAndLocationCoverage(fallbackChapter, batchScenes[idx], fallbackChapterNumber),
              );

              const retryVictimName = resolveVictimName(inputs.cast).trim();
              if (fallbackChapterNumber > 1 && retryVictimName) {
                const victimAliveSentences = detectVictimAlive(fallbackChapter, retryVictimName);
                if (victimAliveSentences.length > 0) {
                  fallbackValidationErrors.push(
                    `Chapter ${fallbackChapterNumber}: fallback wrote the deceased victim "${retryVictimName}" as actively alive.`,
                  );
                }
              }
            });
            if (fallbackValidationErrors.length > 0) {
              if (usedBestAttempt) {
                // FIX 2: we are committing the best real LLM attempt as best-effort. Residual
                // validation issues are downgraded to warnings rather than aborting the run with
                // unreadable template prose. Readable-but-imperfect beats scaffold leakage.
                // HOWEVER, leakage/echo residuals are surfaced DISTINCTLY (not silently bundled
                // into the generic warning) so a best-effort commit that still contains verbatim
                // schema transcription is visible rather than masked behind "required retry".
                const leakageResiduals = fallbackValidationErrors.filter((e) =>
                  /copied verbatim|control-plane leakage|copies the discriminating-test design|schema field copied|metadata key-value/i.test(e),
                );
                if (leakageResiduals.length > 0) {
                  console.error(
                    `[Agent 9] BEST-EFFORT COMMIT WITH UNRESOLVED LEAKAGE for ch${batchLabel} after ${maxBatchAttempts} attempts — ` +
                    `${leakageResiduals.length} leakage/echo residual(s) shipped: ` +
                    leakageResiduals.slice(0, 3).join('; ') +
                    `${leakageResiduals.length > 3 ? ` (and ${leakageResiduals.length - 3} more)` : ''}`,
                  );
                  (proseBatch as any).bestEffortLeakageResiduals =
                    ((proseBatch as any).bestEffortLeakageResiduals ?? 0) + leakageResiduals.length;
                }
                console.warn(
                  `[Agent 9] Best-effort commit for ch${batchLabel} after ${maxBatchAttempts} attempts; ` +
                  `${fallbackValidationErrors.length} residual issue(s) downgraded to warnings: ` +
                  fallbackValidationErrors.slice(0, 5).join('; ') +
                  `${fallbackValidationErrors.length > 5 ? ` (and ${fallbackValidationErrors.length - 5} more)` : ''}`,
                );
              } else {
                const fallbackErr = new Error(
                  `Completion fallback for chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation: ` +
                  fallbackValidationErrors.slice(0, 5).join('; ') +
                  `${fallbackValidationErrors.length > 5 ? ` (and ${fallbackValidationErrors.length - 5} more)` : ''}`,
                );
                (fallbackErr as any).retriedBatches = retriedBatches.size;
                (fallbackErr as any).fallbackValidationFailed = true;
                throw fallbackErr;
              }
            }
            const fallbackScores = proseBatch.chapters.map((chapter, idx) =>
              buildProvisionalChapterScore(
                chapter,
                chapterStart + idx,
                chapterRequirementLedger[idx],
                [],
                inputs.clueDistribution,
                castNames,
              ),
            );
            provisionalBatchScores.splice(0, provisionalBatchScores.length, ...fallbackScores);
            proseBatch.chapters.forEach((chapter, idx) => {
              fallbackTelemetry.push({
                chapterNumber: chapterStart + idx,
                reason: 'retry_exhaustion',
                sourceFailureClass: priorBatchRetryPackets[priorBatchRetryPackets.length - 1]?.failureSubcode
                  ?? priorBatchRetryPackets[priorBatchRetryPackets.length - 1]?.failureClass,
                initialWords: fallbackInitialWords[idx] ?? 0,
                finalWords: countWords((chapter.paragraphs ?? []).join(' ')),
                expansionAttempts: 0,
                committed: true,
              });
            });
            console.warn(
              `[Agent 9] Completion-first fallback accepted for ch${batchLabel} after ${maxBatchAttempts} attempts. ` +
              `Top issues: ${errorSummary}`,
            );
            progressCallback(
              'prose',
              `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} forced to completion fallback after retry exhaustion`,
              overallProgress,
            );
            batchErrors = [];
            lastBatchErrors = exhaustionIssues;
          }
          if (batchErrors.length > 0) {
            continue;
          }
        }

        provisionalChapterScores.push(...provisionalBatchScores);

        // [G4] DT scene scheduling check — if this batch covers the discriminating-test scene,
        // verify that at least one of its required evidence clues is freshly scheduled here.
        // Advisory-only: if the clue is absent from the outline (batchScenes.cluesRevealed),
        // no prose retry can fix it; log a warning so the issue surfaces in diagnostics.
        // Note: prose-level enforcement (clue present in chapter text) is handled by the
        // per-chapter validateChapterPreCommitObligations gate above.
        (() => {
          const dtScene = (inputs.caseData as any)?.CASE?.prose_requirements?.discriminating_test_scene;
          const dTest = (inputs.caseData as any)?.CASE?.discriminating_test;
          if (!dtScene || !dTest) return;
          const coversDiscriminatingScene = (batchScenes as any[]).some((scene: any) =>
            sceneMatchesCmlSceneRef(
              scene,
              dtScene,
              scenes,
              /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i,
            ),
          );
          if (!coversDiscriminatingScene) return;
          const evidenceClues: string[] = Array.isArray(dTest.evidence_clues)
            ? dTest.evidence_clues.map(String)
            : [];
          if (evidenceClues.length === 0) return;
          const priorRevealed = new Set(liveNarrativeState?.cluesRevealedToReader ?? []);
          const batchClueIds = (batchScenes as any[])
            .flatMap((s: any) => Array.isArray(s.cluesRevealed) ? s.cluesRevealed : [])
            .map(String).filter(Boolean);
          // A_55 #5: the test may either PRODUCE fresh evidence OR re-apply evidence the reader was
          // already shown — both are fair play. The genuine gap is a test scene that references NONE of
          // its evidence clues (it cannot then be dramatized as discriminating). Warn only on that. The
          // Agent-7 `ensureDiscriminatingTestEvidencePresent` pass guarantees ≥1 is scheduled, so this
          // should now be rare; when it fires it is a true outline omission.
          const dtCluesPresent = evidenceClues.filter(id => batchClueIds.includes(id));
          const freshDTClues = dtCluesPresent.filter(id => !priorRevealed.has(id));
          // A_58 #3: the DT-scene matcher's fallback regex (/discriminating|test|prove|disprove/) can
          // ALSO match a later resolution chapter, which re-triggers this gap spuriously even though the
          // real DT scene already cited its evidence earlier (observed: gap fired on ch10 while ch9 had
          // shown clue_mechanism_visibility_core). If any DT evidence clue was ALREADY revealed in a prior
          // scene, the test was satisfied upstream — this match is a duplicate, not a true outline gap.
          const dtEvidenceShownEarlier = evidenceClues.some(id => priorRevealed.has(id));
          if (dtCluesPresent.length === 0 && !dtEvidenceShownEarlier) {
            const needed = evidenceClues.slice(0, 3).join(', ');
            console.warn(
              `[Agent 9] G4 DT-scene scheduling gap ch${batchLabel}: discriminating-test scene ` +
              `references none of its DT evidence clues in the outline (needed one of: ${needed}). ` +
              `This is an outline-level gap that prose generation cannot repair.`
            );
          } else if (dtCluesPresent.length > 0 && freshDTClues.length === 0) {
            console.info(
              `[Agent 9] DT-scene ch${batchLabel}: test re-applies already-planted evidence ` +
              `(${dtCluesPresent.join(', ')}) rather than producing fresh evidence — acceptable fair play.`
            );
          }
        })();

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
          const recurringPhraseWarnings = mergeUniquePhrases(
            detectRecurringPhrases(chapters, undefined, undefined,
              (inputs.lockedFacts ?? []).map((f) => f.value)),
            rolloutFlags.phrase_family_detection_enabled
              ? detectConfiguredBannedPhrases(chapters, configuredWarningPhrases)
              : [],
          ).slice(0, 10);
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
          if (preferCompletionOnFailure) {
            const { chapterMatchingClearances, batchMatchingClearances } = resolveBatchMatchingClearances({
              batchScenes,
              batchStart,
              cmlCase,
              scenes,
            });
            // FIX 2: in the exception path too, prefer the best retained LLM attempt over the
            // built-from-scratch template. Template only when no parseable attempt was kept.
            const usedBestAttempt = bestAttemptChapters !== null
              && bestAttemptChapters.length === batchScenes.length;
            const fallbackChapters = usedBestAttempt
              ? bestAttemptChapters!.map(cloneProseChapter)
              : batchScenes.map((scene, idx) =>
                buildCompletionFallbackChapter(
                  undefined,
                  scene,
                  chapterStart + idx,
                  chapterRequirementLedger[idx],
                  inputs.clueDistribution,
                  inputs.caseData,
                  {
                    stageMode: resolveFallbackStageMode({
                      scene,
                      chapterNumber: chapterStart + idx,
                      sceneCount,
                      cmlCase,
                      allScenes: scenes,
                      dtSceneCheck,
                    }),
                    matchingClearances: chapterMatchingClearances[idx] ?? batchMatchingClearances,
                    focusName: ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? undefined,
                  },
                ),
              );
            const fallbackValidationErrors: string[] = [];
            fallbackChapters.forEach((fallbackChapter, idx) => {
              const fallbackChapterNumber = chapterStart + idx;
              const fallbackLedgerEntry = chapterRequirementLedger[idx];
              fallbackValidationErrors.push(
                ...validateSceneCastAndLocationCoverage(fallbackChapter, batchScenes[idx], fallbackChapterNumber),
              );
              if (fallbackLedgerEntry) {
                const sceneForChapter = batchScenes[idx] as any;
                const isDiscriminatingTestChapter = dtSceneCheck
                  ? sceneMatchesCmlSceneRef(
                      sceneForChapter,
                      dtSceneCheck,
                      scenes,
                      /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i,
                    )
                  : fallbackChapterNumber >= Math.ceil(sceneCount * 0.70);
                const chapterMode = resolveStageModeKey(
                  fallbackChapterNumber,
                  fallbackChapterNumber,
                  sceneCount,
                  isDiscriminatingTestChapter,
                  cmlCase,
                  scenes,
                  [sceneForChapter],
                );
                const suspectNames = ((cmlCase?.cast ?? []) as any[])
                  .filter((entry: any) => {
                    const role = String(entry?.role_archetype ?? entry?.role ?? '').toLowerCase();
                    return !role.includes('detective') && !isVictimArchetype(role);
                  })
                  .map((entry: any) => String(entry?.name ?? ''))
                  .filter(Boolean);
                const culpritName: string = ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? '';
                // L1 (ROADMAP_TO_80 M0): surface the DEATH method (stabbing/etc.) in the reveal, not the
          // concealment mechanism. Falls back to the mechanism description when no death method is derivable.
          const murderMethod: string = resolveDeathMethod(inputs.caseData) || ((inputs.caseData as any)?.CASE?.hidden_model?.mechanism?.description ?? '');
                const fallbackObligations = validateChapterPreCommitObligations(
                  fallbackChapter,
                  fallbackLedgerEntry,
                  inputs.clueDistribution,
                  castNames,
                  isLastBatch ? (() => {
                    const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
                    // A_71 — ITEM 11's validator half was DEAD: this object never carried
                    // revealChapterText, so `revealSatisfiesResolution` was always false and the
                    // final chapter was unconditionally required to re-stage the confession/arrest —
                    // even when an earlier chapter already delivered it. That is the mechanism behind
                    // the recurring "Chapter N repeats Chapter N-1" defect, and it put this check in
                    // direct contradiction with the aftermath re-stage detector (the model burned
                    // three attempts caught between "must confess" and "must not confess").
                    // Committed earlier chapters ARE the reveal candidates; join them so the check
                    // can see a resolution that already happened on-page.
                    const priorChaptersText = chapters
                      .map((c) => (c?.paragraphs ?? []).join(" "))
                      .join(" ");
                    return culpritSurname
                      ? {
                          isLastChapter: true,
                          culpritName,
                          culpritSurname,
                          murderMethod: murderMethod || undefined,
                          revealChapterText: priorChaptersText,
                        }
                      : undefined;
                  })() : undefined,
                  {
                    mode: chapterMode,
                    victimName: resolveVictimName(inputs.cast).trim() || undefined,
                    suspectNames,
                    culpritName: culpritName || undefined,
                    murderMethod: murderMethod || undefined,
                  },
                );
                fallbackValidationErrors.push(...fallbackObligations.hardFailures);
              }
            });
            // A_62 abort class #4 (M1v4 run 3, mystery-1784236058900): a transport outage during the
            // FINAL batch leaves no best attempt (all content attempts died before any draft), so the
            // built-from-scratch fallback carries no resolution event — and the last-batch obligations
            // then make the abort CERTAIN. The retry-exhaustion path has had a deterministic resolution
            // backstop since A_44 (isResolutionOnlyFailure, ~l.3353); the exception path never got it.
            // Mirror it with the same `.every()` semantics: only when resolution absence is the ONLY
            // hard failure — mixed failures still abort (they are genuine), and a fallback that already
            // resolves is never double-injected (Item 16's duplicate-clearance lesson).
            if (
              !usedBestAttempt &&
              isLastBatch &&
              fallbackValidationErrors.length > 0 &&
              fallbackValidationErrors.every((e) => e.includes('no resolution event detected'))
            ) {
              const culpritName: string = ((inputs.caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? '';
              const culpritSurname = culpritName.trim().split(/\s+/).pop() ?? culpritName;
              if (culpritSurname && fallbackChapters.length > 0) {
                const lastIdx = fallbackChapters.length - 1;
                const lastChapter = fallbackChapters[lastIdx];
                const paragraphs = [...((lastChapter.paragraphs ?? []) as string[])];
                paragraphs.push(buildResolutionBackstopSentence(culpritSurname));
                fallbackChapters[lastIdx] = { ...lastChapter, paragraphs };
                fallbackValidationErrors.length = 0;
                console.warn(
                  `[Agent 9] Resolution backstop (exception path): ch${batchLabel} fallback lacked a ` +
                  `resolution event after a generation exception; injected deterministic resolution for "${culpritName}".`,
                );
              }
            }
            if (fallbackValidationErrors.length > 0) {
              if (usedBestAttempt) {
                // FIX 2: best-effort commit of the best real LLM attempt; residual issues warn.
                const leakageResiduals = fallbackValidationErrors.filter((e) =>
                  /copied verbatim|control-plane leakage|copies the discriminating-test design|schema field copied|metadata key-value/i.test(e),
                );
                if (leakageResiduals.length > 0) {
                  console.error(
                    `[Agent 9] BEST-EFFORT COMMIT WITH UNRESOLVED LEAKAGE (exception path) for ch${batchLabel} — ` +
                    `${leakageResiduals.length} leakage/echo residual(s) shipped: ` +
                    leakageResiduals.slice(0, 3).join('; ') +
                    `${leakageResiduals.length > 3 ? ` (and ${leakageResiduals.length - 3} more)` : ''}`,
                  );
                }
                console.warn(
                  `[Agent 9] Best-effort commit (exception path) for ch${batchLabel}; ` +
                  `${fallbackValidationErrors.length} residual issue(s) downgraded to warnings: ` +
                  fallbackValidationErrors.slice(0, 5).join('; ') +
                  `${fallbackValidationErrors.length > 5 ? ` (and ${fallbackValidationErrors.length - 5} more)` : ''}`,
                );
              } else {
                const fallbackErr = new Error(
                  `Generation-exception fallback for chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation: ` +
                  fallbackValidationErrors.slice(0, 5).join('; ') +
                  `${fallbackValidationErrors.length > 5 ? ` (and ${fallbackValidationErrors.length - 5} more)` : ''}`,
                );
                (fallbackErr as any).retriedBatches = retriedBatches.size;
                (fallbackErr as any).fallbackValidationFailed = true;
                throw fallbackErr;
              }
            }
            fallbackChapters.forEach((chapter, idx) => {
              fallbackTelemetry.push({
                chapterNumber: chapterStart + idx,
                reason: 'generation_exception',
                sourceFailureClass: 'generation_exception',
                initialWords: 0,
                finalWords: countWords((chapter.paragraphs ?? []).join(' ')),
                expansionAttempts: 0,
                committed: true,
              });
            });
            const batchRevealedIds = batchScenes
              .flatMap((s: any) => (Array.isArray(s?.cluesRevealed) ? s.cluesRevealed : []))
              .map((id: unknown) => String(id))
              .filter(Boolean);

            for (let i = 0; i < fallbackChapters.length; i++) {
              const chapter = fallbackChapters[i];
              const chapterNumber = chapterStart + i;
              chapters.push(chapter);
              chapterWordCounts.push({ chapter: chapterNumber, words: countWords((chapter.paragraphs ?? []).join(' ')) });
              chapterSummaries.push(
                extractChapterSummary(chapter, chapterNumber, castNames),
              );
              provisionalChapterScores.push(
                buildProvisionalChapterScore(
                  chapter,
                  chapterNumber,
                  chapterRequirementLedger[i],
                  [],
                  inputs.clueDistribution,
                  castNames,
                ),
              );
            }

            if (liveNarrativeState && fallbackChapters.length > 0) {
              const lastFallbackChapter = fallbackChapters[fallbackChapters.length - 1];
              liveNarrativeState = updateNSD(liveNarrativeState, {
                paragraphs: lastFallbackChapter?.paragraphs,
                cluesRevealedIds: batchRevealedIds,
                arcPosition: currentBatchArcPosition,
              });
            }

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
                fallbackChapters,
                chapterStart,
                chapterEnd,
                [errorMsg],
                [],
                nsdCheckpoint,
              );
            }

            retriedBatches.add(Math.floor(batchStart / batchSize));
            batchSuccess = true;
            progressCallback(
              'prose',
              `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} forced to deterministic fallback after generation exception`,
              overallProgress,
            );
            console.warn(
              `[Agent 9] Completion-first fallback (exception path): ch${batchLabel} after ${maxBatchAttempts} attempts. Last error: ${errorMsg}`,
            );
            break;
          }
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

  // A_65b Ph4 — locked values and injector fragments are MANDATED repetitions, not repair
  // targets (the census: the pass was scrubbing our own A1 leads and locked-fact phrasings,
  // and the "fresh alternative" risked locked_fact_absent regens downstream).
  const recurringPhrases = detectRecurringPhrases(chapters, undefined, undefined,
    (inputs.lockedFacts ?? []).map((f) => f.value));
  const configuredDetectedPhrases = rolloutFlags.phrase_family_detection_enabled
    ? detectConfiguredBannedPhrases(chapters, configuredRepairPhrases)
    : [];
  const repairPhraseCandidatesBase = mergeUniquePhrases(recurringPhrases, configuredDetectedPhrases);
  const repairPhraseCandidates = rolloutFlags.uncapped_repair_targets_enabled
    ? repairPhraseCandidatesBase
    : repairPhraseCandidatesBase.slice(0, 8);
  if (repairPhraseCandidates.length > 0) {
    try {
      const repairedChapters = await runAtmosphereRepairIfNeeded(
        client,
        chapters,
        repairPhraseCandidates,
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

  // A_68 (prose audit, cross-chapter axis): the atmosphere repair above is a blind phrase-for-phrase
  // token swap; it cannot fix sentence-opening monotony or reword a recurring filler in-voice. When
  // AGENT9_FULLSTORY_POLISH is on, hand each chapter that carries a cross-chapter repetition (recurring
  // n-gram or a shared opening shape) to the LLM to VARY those phrasings, with a self-contained guard
  // (locked values + cast names + number/time tokens + length all preserved) that rolls that chapter
  // back to its committed text on any regression. Default OFF — opt-in / probe (bounded extra calls).
  const fullStoryPolishEnabled =
    process.env.AGENT9_FULLSTORY_POLISH === "true" || process.env.AGENT9_FULLSTORY_POLISH === "1";
  // A_69 §8 — which chapters this pass actually rewrote. Previously discarded, which made the lever
  // unmeasurable: the A_69 smoke probe had to reconstruct it from logs/llm.jsonl by hand.
  let fullStoryPolishEditedChapters: number[] = [];
  if (fullStoryPolishEnabled && recurringPhrases.length > 0) {
    try {
      const fullStory = await runFullStoryRepetitionPolish({
        chapters,
        client,
        model: inputs.model,
        runId: inputs.runId,
        projectId: inputs.projectId,
        lockedValues: (inputs.lockedFacts ?? []).map((f) => f.value),
        recurringPhrases,
        castNames,
      });
      if (fullStory.chapters.length === chapters.length) {
        chapters.splice(0, chapters.length, ...fullStory.chapters);
        fullStoryPolishEditedChapters = fullStory.editedChapters;
      }
    } catch {
      // Best-effort cross-chapter polish; keep the committed chapters if it fails.
    }
  }

  // Fix 2: the final conservative pronoun sweep over all committed chapters — full-cast,
  // crossParagraphInheritance for coverage. A_66: this call site is now policy-obedient and
  // high-precision-guarded (see applyFinalPronounSweep) — under `verify`/`off` it is a no-op.
  applyFinalPronounSweep(chapters, castCharacters, pronounCheckingEnabled);

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
    failureSubcode: packet.failureSubcode,
    shouldEscalate: packet.shouldEscalate,
  }));

  const phraseTelemetry = {
    recurringPhraseCount: recurringPhrases.length,
    configuredDetectedPhraseCount: configuredDetectedPhrases.length,
    configuredRepairPhraseCount: configuredRepairPhrases.length,
    repairPhraseCandidateCount: repairPhraseCandidates.length,
    hardBanLinterFailures: proseLinterStats.bannedPhraseFailures,
    // A_69 §8 — cross-chapter polish outcome (empty when the lever is off or nothing was rewritten).
    fullStoryPolishEnabled,
    fullStoryPolishEditedChapters,
    rolloutFlags: {
      phraseFamilyDetectionEnabled: rolloutFlags.phrase_family_detection_enabled,
      uncappedRepairTargetsEnabled: rolloutFlags.uncapped_repair_targets_enabled,
      precommitPhraseGateEnabled: rolloutFlags.precommit_phrase_gate_enabled,
      tieredPhraseContractEnabled: rolloutFlags.tiered_phrase_contract_enabled,
      phraseSpecificLinterEnabled: rolloutFlags.phrase_specific_linter_enabled,
      blueSkyModeEnabled: rolloutFlags.blue_sky_mode_enabled,
      seasonLockContextAwareEnabled: rolloutFlags.season_lock_context_aware_enabled,
      seasonLockProtectedCollocationsEnabled: rolloutFlags.season_lock_protected_collocations_enabled,
      boundaryIntegrityGateEnabled: rolloutFlags.boundary_integrity_gate_enabled,
      semanticRewriteDiffGuardEnabled: rolloutFlags.semantic_rewrite_diff_guard_enabled,
      entityFidelityGateEnabled: rolloutFlags.entity_fidelity_gate_enabled,
      culpritAliasGateEnabled: rolloutFlags.culprit_alias_gate_enabled,
      integrityRetryPacketEnabled: rolloutFlags.integrity_retry_packet_enabled,
      integrityBlueSkyModeEnabled: rolloutFlags.integrity_blue_sky_mode_enabled,
    },
  };

  const mechanicalSeasonCollisionCount = temporalSeasonLock
    ? chapters.reduce(
        (sum, chapter) => sum + countMechanicalSeasonCollisions(chapter, temporalSeasonLock.season),
        0,
      )
    : 0;

  const integrityTelemetrySummary = {
    seasonLockReplacements: integrityTelemetry.seasonLockReplacements,
    seasonLockProtectedCollisionsBlocked: integrityTelemetry.seasonLockProtectedCollisionsBlocked,
    semanticRewriteDiffBlocks: integrityTelemetry.semanticRewriteDiffBlocks,
    mechanicalSeasonCollisionCount,
  };

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
    phraseTelemetry,
    integrityTelemetry: integrityTelemetrySummary,
    underflow,
    fallbackTelemetry,
    provisionalChapterScores,
    requestContractViolations: requestContractViolations.length > 0 ? requestContractViolations : undefined,
    retryPackets: retryPacketsForTelemetry.length > 0 ? retryPacketsForTelemetry : undefined,
    batchCommitRecords: batchCommitRecords.length > 0 ? batchCommitRecords : undefined,
  } : proseLinterStats.checksRun > 0 || requestContractViolations.length > 0 || retryPacketsForTelemetry.length > 0 || batchCommitRecords.length > 0 ? {
    totalBatches,
    batchesWithRetries,
    failureHistory: [],
    linter: proseLinterStats,
    phraseTelemetry,
    integrityTelemetry: integrityTelemetrySummary,
    underflow,
    fallbackTelemetry,
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
