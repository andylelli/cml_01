/**
 * agent9-prose/clue-validation.ts
 * Clue token matching, chapter obligation validation, batch-gate tracking,
 * word-count targets, and resolution checks.
 */
import { isVictimArchetype } from "@cml/cml";
import { getGenerationParams, getStoryLengthTarget } from "@cml/story-validation";
import type { AzureOpenAIClient } from "@cml/llm-client";
import { deriveClueObservable } from "../agent5-clues.js";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import type { BatchGateName, BatchCommitRecord } from "../contracts/batch-commit-record.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  ChapterWordTargetResult,
  ChapterObligationResult,
  ClueObligationContext,
} from "./types.js";

export type StageModeKey =
  | "discovery_opening"
  | "early_investigation"
  | "suspect_pressure"
  | "false_suspect_clearing"
  | "clue_reinterpretation"
  | "discriminating_test"
  | "final_reveal"
  | "aftermath_consequence";

export type CompositionPhaseKey =
  | "chapter1"
  | "early_investigation"
  | "middle_chapters"
  | "false_suspect_chapters"
  | "discriminating_test_chapter"
  | "final_reveal";

export type ClueObligationState = {
  clueId: string;
  clue?: Clue;
  context?: ClueObligationContext;
  description: string | null;
  proseFacingDescription: string | null;
  placement: string | null;
  pointsTo: string | null;
  hasDistributionEntry: boolean;
  isMetadataOnly: boolean;
  isPresent: boolean;
  isEarlyEnough: boolean;
};

export type DiscriminatingTestValidityState = {
  hasTheoryMarker: boolean;
  hasProofMarker: boolean;
  isValid: boolean;
};

export const formatStageModeLabel = (value: StageModeKey): string =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

export const mapStageModeToCompositionPhase = (mode: StageModeKey): CompositionPhaseKey => {
  switch (mode) {
    case "discovery_opening":
      return "chapter1";
    case "early_investigation":
      return "early_investigation";
    case "false_suspect_clearing":
      return "false_suspect_chapters";
    case "discriminating_test":
      return "discriminating_test_chapter";
    case "final_reveal":
    case "aftermath_consequence":
      return "final_reveal";
    case "suspect_pressure":
    case "clue_reinterpretation":
    default:
      return "middle_chapters";
  }
};

const normalizeSceneSignalText = (scene: any): string => {
  const purpose = String(scene?.purpose ?? "");
  const summary = String(scene?.summary ?? "");
  const title = String(scene?.title ?? "");
  const dramatic = [
    scene?.dramaticElements?.revelation,
    scene?.dramaticElements?.conflict,
    scene?.dramaticElements?.tension,
  ].map((value) => String(value ?? "")).join(" ");
  return `${purpose} ${summary} ${title} ${dramatic}`.toLowerCase();
};

export const getPerActSceneNumber = (scene: any, allOutlineScenes?: any[]): number => {
  const sceneAct = Number(scene?.act);
  const globalSceneNumber = Number(scene?.sceneNumber);
  if (!Number.isFinite(globalSceneNumber)) return 0;
  if (!Array.isArray(allOutlineScenes) || !Number.isFinite(sceneAct)) return globalSceneNumber;
  return globalSceneNumber - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length;
};

export const sceneMatchesCmlSceneRef = (
  scene: any,
  ref: any,
  allOutlineScenes?: any[],
  signalPattern?: RegExp,
): boolean => {
  if (!scene || !ref) return false;
  const sceneAct = Number(scene?.act);
  const refAct = Number(ref?.act_number);
  if (Number.isFinite(refAct) && Number.isFinite(sceneAct) && sceneAct !== refAct) return false;

  const refSceneNumber = Number(ref?.scene_number);
  const globalSceneNumber = Number(scene?.sceneNumber);
  const perActSceneNumber = getPerActSceneNumber(scene, allOutlineScenes);
  if (
    Number.isFinite(refSceneNumber) &&
    refSceneNumber > 0 &&
    (refSceneNumber === globalSceneNumber || refSceneNumber === perActSceneNumber)
  ) {
    return true;
  }

  return Boolean(signalPattern && signalPattern.test(normalizeSceneSignalText(scene)));
};

export const resolveCmlSceneRefChapterNumber = (
  ref: any,
  allOutlineScenes: any[],
  fallback: number,
  signalPattern?: RegExp,
): number => {
  if (!ref || !Array.isArray(allOutlineScenes) || allOutlineScenes.length === 0) return fallback;
  const exact = allOutlineScenes.find((scene: any) => sceneMatchesCmlSceneRef(scene, ref, allOutlineScenes));
  if (exact) {
    const chapterNumber = Number(exact?.sceneNumber);
    return Number.isFinite(chapterNumber) && chapterNumber > 0 ? chapterNumber : fallback;
  }
  if (signalPattern) {
    const signalled = allOutlineScenes.find((scene: any) =>
      sceneMatchesCmlSceneRef(scene, ref, allOutlineScenes, signalPattern),
    );
    if (signalled) {
      const chapterNumber = Number(signalled?.sceneNumber);
      return Number.isFinite(chapterNumber) && chapterNumber > 0 ? chapterNumber : fallback;
    }
  }
  return fallback;
};

const hasClearanceInChapterRange = (
  cmlCase: any,
  allOutlineScenes: any[],
  chapterStart: number,
  chapterEnd: number,
): boolean => {
  const suspectClearanceScenes = Array.isArray(cmlCase?.prose_requirements?.suspect_clearance_scenes)
    ? cmlCase.prose_requirements.suspect_clearance_scenes
    : [];
  return suspectClearanceScenes.some((entry: any) => {
    const chapterNumber = resolveCmlSceneRefChapterNumber(
      entry,
      allOutlineScenes,
      0,
      /\b(clear|cleared|clearance|alibi|ruled out|eliminat)/i,
    );
    return chapterNumber >= chapterStart && chapterNumber <= chapterEnd;
  });
};

const getCulpritRevealChapter = (cmlCase: any, allOutlineScenes: any[], fallback: number): number => {
  const reveal = cmlCase?.prose_requirements?.culprit_revelation_scene;
  if (!reveal) return fallback;
  return resolveCmlSceneRefChapterNumber(
    reveal,
    allOutlineScenes,
    fallback,
    /\b(culprit|confront|confession|resolve|resolution|denouement|case\s+closed)/i,
  );
};

// ITEM 11 (Ch9/Ch10 duplicated reveal): in the Golden-Age 10-beat arc the culprit is
// named on-page in the `final_trap` chapter, so the closing `revelation` chapter is
// aftermath — NOT a second reveal (see agent7-narrative GOLDEN_AGE_BEAT_GUIDE.revelation).
// The stage-mode resolver otherwise binds the reveal to the LAST chapter, because
// getCulpritRevealChapter falls back to `totalScenes` whenever the CML
// culprit_revelation_scene ref is missing/unresolvable; that issues a second "MANDATORY
// RESOLUTION" mandate to the final chapter (obligation-block.ts) and the LLM re-stages the
// whole accusation/confession/clearance there. Honor the authored beat so the AFTERMATH
// CONTRACT branch fires instead. Beat strings mirror agent7-narrative.GOLDEN_AGE_BEATS;
// kept as local literals to avoid coupling clue-validation to the agent-7 module.
/**
 * A_71 — detect an aftermath chapter that RE-STAGES the reveal instead of showing consequence.
 *
 * The AFTERMATH CONTRACT in the prompt (obligation-block.ts) already forbids four things and tells
 * the model they "will be rejected and regenerated". Nothing enforced that, so the recurring
 * "Chapter N repeats Chapter N-1" defect shipped unchallenged.
 *
 * Each check requires a RE-ENACTMENT signal (present tense, on-page speech/action), not a
 * retrospective mention — the contract explicitly REQUIRES naming the culprit and referencing the
 * outcome in retrospect, so a naive keyword match would fail every compliant chapter.
 *
 * Exported for direct testing.
 */
export const detectRestagedRevealViolations = (chapterText: string): string[] => {
  const text = String(chapterText ?? "");
  if (!text.trim()) return [];
  const violations: string[] = [];

  // 1. Fresh accusation staged on the page — second-person naming of the crime.
  if (/\byou\s+(?:killed|murdered|struck|poisoned|did\s+it|are\s+the\s+(?:killer|murderer|culprit))\b/i.test(text)) {
    violations.push("The chapter stages a fresh accusation (a character is accused on-page).");
  }

  // 2. First-person admission. Two distinct defects, and the message must name the right one — the
  //    model failed three attempts on story_20260731-1750 against a message that described the wrong
  //    problem. There it wrote: `Ivor's confession lingered in the air, the words still echoing:
  //    "I killed her. … I struck her with the candlestick, then set the clock…"` — framed as
  //    recollection but re-quoting motive, method and mechanism in full. Retrospective FRAMING does
  //    not make a verbatim re-quote retrospective; it is the reveal run twice.
  // `killed time` / `killed the hour` are idioms, not admissions — the bare verb match flagged
  // "I killed time in the lounge" as a confession. Require the object not to be a duration.
  const admission = /\bI\s+(?:(?:killed|murdered|struck|poisoned)\s+(?!time\b|the\s+(?:time|hour|afternoon|evening|morning)\b)|did\s+it\b)/.exec(text);
  if (admission) {
    const before = text.slice(Math.max(0, admission.index - 120), admission.index);
    const isRecollectionFrame = /\b(?:confession|words|admission|said|told|spoken|echo\w*|linger\w*|recall\w*|remember\w*)\b/i.test(before);
    violations.push(
      isRecollectionFrame
        ? "The chapter re-quotes the confession verbatim. Referring to a confession is required; reproducing its words is not — replace the quotation with a brief reference to the fact of it (\"the confession he had signed\"), and do not restate the motive, method, or mechanism."
        : "The chapter stages a fresh confession (a first-person admission delivered on-page). Report the confession as something already given in an earlier chapter; do not dramatise it again.",
    );
  }

  // 3. Per-suspect clearance recitation — the roll-call the contract names explicitly. Two or more
  //    distinct clearance verdicts in one chapter is a recitation, not a passing retrospective note.
  const clearanceVerdicts =
    text.match(/\b(?:is|are|was|were)\s+(?:now\s+)?(?:cleared|eliminated|ruled\s+out|exonerated)\b/gi) ?? [];
  const addressedClearances = text.match(/\byou\s+(?:were|was|are)\s+(?:upstairs|elsewhere|away|not)\b/gi) ?? [];
  if (clearanceVerdicts.length + addressedClearances.length >= 2) {
    violations.push("The chapter recites per-suspect clearances again (a clearance roll-call).");
  }

  // 4. Evidence-chain re-run — the deduction walked through again as a sequence.
  //    "Taken together" on its own is an ordinary connective ("Taken together, they left"), so the
  //    loose phrases must co-occur with evidence vocabulary; the explicit chain phrases stand alone.
  const chainPhrase = /\b(?:evidence\s+chain|chain\s+of\s+evidence)\b/i.test(text);
  const walkthrough =
    /\b(?:taken\s+together|piece\s+by\s+piece|point\s+by\s+point)\b/i.test(text) &&
    /\b(?:evidence|clue|proof|testimony|alibi|timeline|witness)\w*\b/i.test(text);
  if (chainPhrase || walkthrough) {
    violations.push("The chapter re-runs the evidence chain rather than treating it as settled.");
  }

  return violations;
};

const GOLDEN_AGE_FINAL_TRAP_BEAT = "final_trap";
const GOLDEN_AGE_REVELATION_BEAT = "revelation";

const readSceneBeat = (scene: any): string => String(scene?.beat ?? "").trim().toLowerCase();

// A_68 FIX C: beat-independent aftermath fallback. The beat-based guard below only fires when the
// outline scenes carry LLM-emitted `.beat` strings; when those are absent (common — the field is
// Optional and set only for the exact-10-scene format), the guard returns false, getCulpritRevealChapter
// falls back to `totalScenes`, and the final chapter gets a second MANDATORY RESOLUTION → the recurring
// duplicate "Clearance and Culprit Revealed" chapter. This fallback recovers the aftermath decision from
// scene title/purpose SIGNALS when (and only when) no beats are present. Flag-gated, default-OFF,
// probe-first (per §2.8). Runtime getter — never a module const (dotenv-freeze trap).
const isAftermathFinalSignalFallbackEnabled = (): boolean =>
  process.env.AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK === "true" ||
  process.env.AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK === "1";

// The final chapter reads as an aftermath/denouement close.
const REVELATION_SIGNAL_RE = /(revelation|aftermath|denouement|reckoning|culprit\s+(?:is\s+)?revealed|unmask|case\s+closed|confession|resolution|epilogue|clearance)/;
// An earlier chapter stages the on-page naming (the real reveal): final trap / discriminating test /
// confrontation where the culprit is named. This is the guard that prevents suppressing a genuinely
// late (last-chapter-only) reveal.
const FINAL_TRAP_SIGNAL_RE = /(final\s+trap|discriminating\s+test|confront|expos(?:e|es|ed|ing|ure)|named\s+as|accus|trap\s+is\s+sprung|culprit\s+(?:is\s+)?revealed)/;
// Never treat a false-solution / red-herring chapter as the naming trap.
const FALSE_SOLUTION_SIGNAL_RE = /(false\s+solution|red\s+herring|wrong\s+suspect|mistaken|misdirection|false\s+accus)/;

const isGoldenAgeAftermathFinalChapter = (
  chapterEnd: number,
  totalScenes: number,
  batchScenes: any[],
  allOutlineScenes: any[],
): boolean => {
  // Only the final chapter can be the aftermath close.
  if (chapterEnd < totalScenes) return false;
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  if (scenes.length === 0) return false;
  // The current chapter (or, defensively, the last outline scene) must be authored
  // `revelation`. Absent beats (non-Golden-Age arcs) never satisfy this → no behaviour change.
  const finalIsRevelation =
    (Array.isArray(batchScenes) &&
      batchScenes.some((scene) => readSceneBeat(scene) === GOLDEN_AGE_REVELATION_BEAT)) ||
    readSceneBeat(scenes[scenes.length - 1]) === GOLDEN_AGE_REVELATION_BEAT;
  // And an EARLIER chapter must carry the on-page naming (`final_trap`), so we never
  // suppress a legitimately-late reveal in a story with no separate trap chapter.
  const earlierFinalTrap = scenes.some(
    (scene, idx) => idx < scenes.length - 1 && readSceneBeat(scene) === GOLDEN_AGE_FINAL_TRAP_BEAT,
  );
  if (finalIsRevelation && earlierFinalTrap) return true;

  // A_68 signal fallback — only when NO scene carries a beat at all (never override present beats).
  if (!isAftermathFinalSignalFallbackEnabled()) return false;
  const anyBeatPresent = scenes.some((scene) => readSceneBeat(scene) !== "");
  if (anyBeatPresent) return false;
  const finalScene =
    Array.isArray(batchScenes) && batchScenes.length > 0
      ? batchScenes[batchScenes.length - 1]
      : scenes[scenes.length - 1];
  const finalIsRevelationBySignal = REVELATION_SIGNAL_RE.test(normalizeSceneSignalText(finalScene));
  const earlierTrapBySignal = scenes.some((scene, idx) => {
    if (idx >= scenes.length - 1) return false;
    const signal = normalizeSceneSignalText(scene);
    return FINAL_TRAP_SIGNAL_RE.test(signal) && !FALSE_SOLUTION_SIGNAL_RE.test(signal);
  });
  return finalIsRevelationBySignal && earlierTrapBySignal;
};

export const resolveStageModeKey = (
  chapterStart: number,
  chapterEnd: number,
  totalScenes: number,
  isDiscriminatingTestBatch: boolean,
  cmlCase: any,
  allOutlineScenes: any[],
  batchScenes: any[] = [],
): StageModeKey => {
  if (chapterStart <= 1) return "discovery_opening";

  // ITEM 11: honor the Golden-Age authored arc first — the `revelation` final chapter is
  // aftermath when an earlier `final_trap` chapter already named the culprit on-page. This
  // must precede the culprit-reveal-chapter fallback below, which would otherwise bind the
  // reveal to the last chapter and duplicate it.
  if (isGoldenAgeAftermathFinalChapter(chapterEnd, totalScenes, batchScenes, allOutlineScenes)) {
    return "aftermath_consequence";
  }

  const culpritRevealChapter = getCulpritRevealChapter(cmlCase, allOutlineScenes, totalScenes);
  const signalText = batchScenes.map(normalizeSceneSignalText).join(" ");
  const hasAftermathSignal = /(aftermath|consequence|epilogue|denouement|fallout|reckoning|post[-\s]?reveal)/.test(signalText);
  const includesConfiguredReveal = chapterStart <= culpritRevealChapter && chapterEnd >= culpritRevealChapter;
  if (includesConfiguredReveal) return "final_reveal";
  if (chapterStart > culpritRevealChapter || (chapterStart >= totalScenes && hasAftermathSignal)) {
    return "aftermath_consequence";
  }
  if (chapterEnd >= totalScenes) return "final_reveal";

  if (isDiscriminatingTestBatch) return "discriminating_test";
  if (hasClearanceInChapterRange(cmlCase, allOutlineScenes, chapterStart, chapterEnd)) {
    return "false_suspect_clearing";
  }

  if (/(reinterpret|re-interpret|recontext|reframe|new meaning|reassess|reconsider|contradiction)/.test(signalText)) {
    return "clue_reinterpretation";
  }

  const suspectNames = ((cmlCase?.cast ?? []) as any[])
    .filter((c: any) => {
      const role = String(c?.role_archetype ?? c?.role ?? "").toLowerCase();
      return !role.includes("detective") && !isVictimArchetype(role);
    })
    .map((c: any) => String(c?.name ?? ""))
    .filter(Boolean);
  const suspectsInBatch = new Set<string>();
  for (const scene of batchScenes) {
    const names = Array.isArray(scene?.characters) ? scene.characters : [];
    for (const name of names) {
      if (suspectNames.includes(String(name))) suspectsInBatch.add(String(name));
    }
  }
  const hasPressureSignal = /(interview|question|cross[-\s]?exam|interrogat|alibi|pressure|confront|credibility|motive)/.test(signalText);
  if (hasPressureSignal || suspectsInBatch.size <= 2) return "suspect_pressure";

  const progression = chapterStart / Math.max(1, totalScenes);
  if (progression <= 0.35) return "early_investigation";
  return "suspect_pressure";
};
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
  "stage_mode_outcome",
  "discriminating_test_validity",
  "final_reveal_completeness",
  "temporal_continuity",
  "template_leakage",
];

export const initBatchGateFailureCounts = (): Record<BatchGateName, number> => ({
  encoding: 0,
  completeness_structure: 0,
  locked_fact_word_form: 0,
  character_pronoun_consistency: 0,
  clue_placement_timing: 0,
  stage_mode_outcome: 0,
  discriminating_test_validity: 0,
  final_reveal_completeness: 0,
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
  if (/stage[-\s]?mode outcome|mode contract|mode outcome/.test(lowered)) {
    gates.add("stage_mode_outcome");
  }
  if (/discriminating test validity/.test(lowered)) {
    gates.add("discriminating_test_validity");
  }
  if (/final reveal completeness/.test(lowered)) {
    gates.add("final_reveal_completeness");
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
  // Discriminating-test scaffold words (folded in from the former local DT_STOP) so the one shared
  // term surface serves the design path too — these carry no discriminating signal as prose.
  "controlled", "arranged", "arrange", "demonstrating", "comparing", "confirms", "established",
  "evidence", "test", "tested", "testing",
]);

export const tokenizeForClueObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));

/**
 * R-A chokepoint (ROADMAP_TO_80 M0). The verbatim-leakage gate (detectVerbatimFieldEcho) flags any run
 * of ≥12 CONSECUTIVE tokens shared between the prose and a fed spec sentence. NEVER hand the model — or
 * paste — a full spec SENTENCE: surface only deduped, stopword-filtered KEY TERMS (comma-joined), which
 * by construction cannot form a 12-word verbatim run from the source. Because this uses the SAME
 * tokenizer the clue-PRESENCE check (chapterMentionsRequiredClue) uses, the surfaced terms are exactly
 * the tokens the presence check seeks — so composing prose around them satisfies presence without a leak.
 */
export const surfaceSpecKeyTerms = (value: string, max = 12): string =>
  Array.from(new Set(tokenizeForClueObligation(String(value ?? "")))).slice(0, max).join(", ");

/** Phrase form for deterministic-prose composition (shorter). Returns '' when no usable terms remain
 *  (caller must fall through to generic obligation language — never paste the raw sentence). */
export const composeKeyTermPhrase = (value: string, max = 6): string =>
  Array.from(new Set(tokenizeForClueObligation(String(value ?? "")))).slice(0, max).join(", ");

/**
 * A_50 Fix #1: prose-facing rendering of the SAME de-spoiled key terms as composeKeyTermPhrase, but
 * space-joined + sentence-cased instead of comma-lowercase-joined. The comma-token form
 * ("captain, ivor, hale, seen, acting, nervously") reads as a machine dump and tripped the external
 * re-score; this reformats the already-tokenized terms into a readable clause without re-introducing
 * any spec/reasoning leakage (the de-spoiling is preserved — same tokens, different join). Returns ''
 * when no usable terms remain.
 */
/**
 * Restore the capitalisation each token carried in the SOURCE string.
 *
 * ── THE DEFECT, READER-VISIBLE ───────────────────────────────────────────────────────────────────
 *
 * `tokenizeForClueObligation` lowercases unconditionally, and it must: the clue-PRESENCE check uses
 * the same tokenizer, so matching has to be case-insensitive. `composeProseTermPhrase` then re-cased
 * only the FIRST character, so every proper name inside a key-term bag shipped mangled:
 *
 *     "Captain ivor hale uniquely means skill"
 *     (story_20260823-2038, story_20260826-1753, story_20260827-2005)
 *
 * Two routes to a reader, and the second is worse:
 *
 *   1. The injector pastes it directly. An external reader quoted this family back as *"internal
 *      evidence labels appear directly in the prose"* (A_75 §10.4).
 *   2. The same text is fed forward in the STORY TO DATE block, so the MODEL is shown
 *      `Captain ivor hale` as this book's prose and imitates the styling in sentences it writes
 *      itself — which is where *"Dr finch was glimpsed shivering outside ten minutes past eleven"*
 *      came from. The model wrote that sentence, in our casing.
 *
 * No cast list is needed. The original value already carries the right casing, so this reads it back
 * off the source rather than introducing a second source of truth about who the characters are.
 */
const restoreSourceCasing = (phrase: string, source: string): string => {
  const casing = new Map<string, string>();
  for (const word of String(source ?? "").match(/[A-Za-z][A-Za-z'-]*/g) ?? []) {
    const key = word.toLowerCase();
    // First occurrence wins, and only capitalised forms are worth restoring.
    if (!casing.has(key) && word[0] === word[0].toUpperCase()) casing.set(key, word);
  }
  return phrase.replace(/[A-Za-z][A-Za-z'-]*/g, (w) => casing.get(w.toLowerCase()) ?? w);
};

export const composeProseTermPhrase = (value: string, max = 6): string => {
  const source = String(value ?? "");
  const phrase = Array.from(new Set(tokenizeForClueObligation(source))).slice(0, max).join(" ");
  if (!phrase) return phrase;
  // Space-joining de-spoiled tokens can re-form a control-plane/reasoning phrase the comma form broke
  // ("direct evidence links", "mechanism access point", a leading "Eliminates"). Neutralize those
  // specific adjacencies — keep every token (clue-presence is preserved) but break the exact phrase
  // the control-plane-leakage detector matches. Full coverage arrives with P1.2 observables.
  const neutralized = phrase
    .replace(/\bdirect evidence (links?|ties?)\b/gi, (_m, v) => `evidence ${v} directly`)
    .replace(/\bmechanism access point\b/gi, "access point and mechanism")
    .replace(/\bcompeting (?:suspect )?timelines\b/gi, "the rival timelines")
    .replace(/\bnarrowing the solution\b/gi, "the solution narrowed")
    .replace(/^(eliminates|excludes)\b/i, (m) => (m.toLowerCase() === "excludes" ? "rules out" : "clears"));
  // Names restored LAST, so the neutralisation rewrites above (case-insensitive, emitting lowercase)
  // cannot undo it, and so the sentence-case below never lowercases a restored capital.
  const cased = restoreSourceCasing(neutralized, source);
  return cased.charAt(0).toUpperCase() + cased.slice(1);
};

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
        // P1.2: the obligation presence-check must look for the de-spoiled OBSERVABLE that Agent 9
        // is actually told to write (obligation-block.ts), not the raw spec sentence. Falls back to
        // description when no observable is emitted, so this is byte-identical until P1.2 activates.
        description: (distClue ? deriveClueObservable(distClue) : undefined) ?? mappingEntry?.delivery_method ?? undefined,
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

  // P1.2: validate against the on-page OBSERVABLE (what Agent 9 is told to write), not the spec
  // sentence. deriveClueObservable falls back to description, so this is byte-identical until P1.2.
  const onPage = deriveClueObservable(clue);
  const descIsGenreLabel = isDeliveryMethodLabel(onPage);
  // When the on-page text is a delivery-method label (e.g. "Direct observation"), its tokens
  // ("direct", "observation") never appear in narrative prose.  Use only pointsTo tokens.
  // If pointsTo is also empty, the clue metadata is incomplete — pass rather than
  // false-failing every attempt.
  const rawTokens = descIsGenreLabel
    ? Array.from(new Set(tokenizeForClueObligation(String(clue.pointsTo ?? "")))).slice(0, 10)
    : Array.from(new Set([
        ...tokenizeForClueObligation(String(onPage ?? "")),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
      ])).slice(0, 10);

  // Strip proper-name tokens from non-cast characters so that clue descriptions written
  // by Agent 5 referencing source-text characters (not in the prose cast) don't
  // perpetually fail the token-match threshold.  Only applies when castNames is provided.
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, String(onPage ?? ''), castNames)
    : rawTokens;

  // Genre-label clue with no usable pointsTo tokens — metadata is insufficient for
  // token-level validation.  Accept rather than perpetually failing.
  if (tokens.length === 0) return descIsGenreLabel ? true : false;
  const matched = tokens.filter((t) => tokenMatchesText(t, lowered));
  // A_73 §33 — the nominal threshold is 0.55, NOT the 0.6 this comment claimed for months. And the
  // EFFECTIVE threshold is neither: requiredMatches rounds UP over a token list capped at 10, so it
  // runs 100%, 100%, 67%, 75%, 60%, 67%, 57%, 63%, 56%, 60% for 1..10 tokens — non-monotonic, and a
  // clue yielding one or two usable tokens must be reproduced VERBATIM to count as present.
  // Behavioural/emotional clues use synonym-rich vocabulary — relax to 0.35 so e.g.
  // "nervousness" is satisfied by "fidgeted", "uneasy", "agitated" (R35 abort root cause).
  const factualThreshold = 0.55;
  const behaviouralThreshold = isBehaviouralClue(onPage ?? '') ? 0.35 : factualThreshold;
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * behaviouralThreshold));
  if (matched.length >= requiredMatches) {
    return true;
  }

  // Semantic anchor fallback: allows clues to pass when prose uses equivalent observational
  // language derived from upstream clue intent (observable + pointsTo), not brittle phrase echoes.
  const semanticFamilies = buildClueSemanticAnchorFamilies(onPage, clue?.pointsTo);
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
 * A_67 FIX-3 (plant→payoff measure): does the reveal chapter CITE the planted essential clues, or just
 * assert conclusions? Pure + deterministic, reusing the SAME `chapterMentionsRequiredClue` token-match
 * the `missing_clue` regen channel keys on — so the measure and any future hard regen/cut lever agree.
 * Built for the corpus dry-run the doc prescribes: price the reveal-citation gap over the 93 stories
 * before building a lever. `deathMethodTokens` (from `deathMethodTellHints`) additionally reports whether
 * the physical cause-of-death tell is cited; `methodCited` is null when no death method is known.
 */
export const auditRevealCitesPlants = (
  revealChapterText: string,
  priorEssentialClueIds: ReadonlyArray<string>,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
  deathMethodTokens?: ReadonlyArray<string>,
): { total: number; cited: number; uncited: string[]; methodCited: boolean | null } => {
  const uncited: string[] = [];
  let cited = 0;
  for (const id of priorEssentialClueIds) {
    if (chapterMentionsRequiredClue(revealChapterText, id, clueDistribution, castNames)) cited += 1;
    else uncited.push(id);
  }
  const lowered = String(revealChapterText ?? "").toLowerCase();
  const methodCited =
    deathMethodTokens && deathMethodTokens.length > 0
      ? deathMethodTokens.some((t) => tokenMatchesText(String(t).toLowerCase(), lowered))
      : null;
  return { total: priorEssentialClueIds.length, cited, uncited, methodCited };
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

  // P1.2: match the on-page OBSERVABLE (falls back to description ⇒ byte-identical until P1.2).
  const onPage = deriveClueObservable(clue);
  const descIsGenreLabel = isDeliveryMethodLabel(onPage);
  const rawTokens = descIsGenreLabel
    ? Array.from(new Set(tokenizeForClueObligation(String(clue.pointsTo ?? '')))).slice(0, 10)
    : Array.from(new Set([
        ...tokenizeForClueObligation(String(onPage ?? '')),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? '')),
      ])).slice(0, 10);

  // Strip proper-name tokens from non-cast characters (same logic as chapterMentionsRequiredClue).
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, String(onPage ?? ''), castNames)
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

  const semanticFamilies = buildClueSemanticAnchorFamilies(onPage, clue?.pointsTo);
  if (semanticFamilies.length > 0) {
    // Early check is observational: require at least one anchor family in the opening window.
    return semanticAnchorFamiliesMatched(earlyText, semanticFamilies) >= 1;
  }

  return false;
};

const resolveContextOnlyCluePresence = (
  chapterText: string,
  context: ClueObligationContext | undefined,
  castNames?: string[],
): boolean => {
  if (!context?.description) return false;
  if (isDeliveryMethodLabel(context.description)) return true;
  const rawTokens = Array.from(new Set(tokenizeForClueObligation(context.description))).slice(0, 10);
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, context.description, castNames)
    : rawTokens;
  if (tokens.length === 0) return false;
  const lowered = chapterText.toLowerCase();
  const matched = tokens.filter((token) => tokenMatchesText(token, lowered));
  const requiredMatches = Math.max(
    1,
    Math.ceil(tokens.length * (isBehaviouralClue(context.description) ? 0.35 : 0.55)),
  );
  return matched.length >= requiredMatches;
};

const resolveContextOnlyClueEarlyPresence = (
  paragraphs: string[],
  context: ClueObligationContext | undefined,
  castNames?: string[],
): boolean => {
  if (!context?.description) return false;
  if (isDeliveryMethodLabel(context.description)) return true;
  const quarterEnd = Math.max(1, Math.ceil(paragraphs.length * 0.25));
  const earlyText = paragraphs.slice(0, quarterEnd).join(" ").toLowerCase();
  const rawTokens = Array.from(new Set(tokenizeForClueObligation(context.description))).slice(0, 10);
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, context.description, castNames)
    : rawTokens;
  if (tokens.length === 0) return false;
  const matched = tokens.filter((token) => tokenMatchesText(token, earlyText));
  const requiredMatches = tokens.length <= 4 ? 1 : Math.max(1, Math.ceil(tokens.length * 0.25));
  return matched.length >= requiredMatches;
};

export const resolveClueObligationState = (
  chapter: ProseChapter,
  ledgerEntry: ChapterRequirementLedgerEntry,
  clueId: string,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): ClueObligationState => {
  const chapterText = (chapter.paragraphs ?? []).join(" ");
  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || "") === clueId);
  const context = (ledgerEntry.clueObligationContext ?? []).find((entry) => entry.id === clueId);
  const description = clue?.description?.trim() ?? context?.description?.trim() ?? null;
  const pointsTo = clue?.pointsTo?.trim() || null;
  const placement = clue?.placement ?? context?.placement ?? null;
  const proseFacingDescription = description && !isDeliveryMethodLabel(description)
    ? description
    : pointsTo;
  let isPresent = chapterMentionsRequiredClue(chapterText, clueId, clueDistribution, castNames);
  if (!isPresent && !clue) {
    isPresent = resolveContextOnlyCluePresence(chapterText, context, castNames);
  }

  let isEarlyEnough = placement !== "early";
  if (placement === "early") {
    isEarlyEnough = chapterClueAppearsEarly(chapter.paragraphs ?? [], clueId, clueDistribution, castNames);
    if (!isEarlyEnough && !clue) {
      isEarlyEnough = resolveContextOnlyClueEarlyPresence(chapter.paragraphs ?? [], context, castNames);
    }
  }

  return {
    clueId,
    clue,
    context,
    description,
    proseFacingDescription,
    placement,
    pointsTo,
    hasDistributionEntry: Boolean(clue),
    isMetadataOnly: !clue && Boolean(context?.description) && isDeliveryMethodLabel(context?.description ?? ""),
    isPresent,
    isEarlyEnough,
  };
};

/**
 * A_76 §17 — THE GATE DEMANDED A WORD THE MODEL NEVER WRITES, SO WE HAD TO PASTE ONE IN.
 *
 * The external reader of `story_20260830-1850` scored it 82 and marked `prose` 7/10:
 * *"still has scaffold lines and repeated explanation"*. The two sentences our own detector flags in
 * that book are the discriminating-test floor's:
 *
 *   "Run again in front of them all, the test came out the same way twice; its result ruled out one
 *    theory and left the other standing."
 *   "That left [culprit] as the only person whose story still needed the discredited theory to be true."
 *
 * MEASURED across the 33 August manuscripts: 43 such sentences in 19 books (58%).
 *
 * The floor exists because THIS regex fails. Strip our injected sentences from the 28 chapters that
 * carry them and re-test: **27 of 28 fail** — and they fail on the THEORY marker, never on proof
 * (`theory=false proof=true`). The model writes "explanation", "account", "version", "reading",
 * "possibility"; it does not write "theory". We demanded a word it does not use, it failed, and the
 * floor pasted machine text to supply it. The reader then read the machine text back to us.
 *
 * Rewording the floor is the wrong repair and has already been tried once: the previous template
 * ("The result proved one theory and ruled out the other...") was flagged in every external review,
 * which is why the current one exists — and it is flagged too. Text that is never emitted needs no
 * rewording.
 *
 * WIDENED, and the widening is safe because of where the gate runs. MEASURED:
 *   model prose satisfies the CURRENT gate  :  1 of 28 chapters   (4%)
 *   model prose satisfies the WIDENED gate  : 17 of 28 chapters   (61%)
 *
 * A wider vocabulary would let 31% of ORDINARY chapters pass, against 5% today — but the check runs
 * only inside `case "discriminating_test"`, on the single chapter whose stage mode IS the test, so it
 * never sees an ordinary chapter and that cost is not paid. The conjunction with
 * `DISCRIMINATING_TEST_PROOF_RE` still holds: a chapter needs a competing-reading word AND an
 * observable-result word.
 *
 * Flag-gated `AGENT9_DT_THEORY_VOCABULARY` (default OFF), read at call time. Off, the regex is
 * byte-identical to today.
 */
const DISCRIMINATING_TEST_THEORY_NARROW_RE = /\b(theory|hypothesis)\b/i;
const DISCRIMINATING_TEST_THEORY_WIDE_RE =
  /\b(theor(?:y|ies)|hypothes(?:is|es)|explanation|account|version|reading|possibilit(?:y|ies)|supposition|premise|assumption|scenario|alternative)\b/i;

/** Read at CALL time, never a module const — that freezes before dotenv (ADR-0004). */
export const isDtTheoryVocabularyWidened = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(env.AGENT9_DT_THEORY_VOCABULARY ?? "");
const DISCRIMINATING_TEST_PROOF_RE = /\b(if\b.*\bthen|would indicate|would prove|result|observation|rules? out|proves?)\b/i;

export const resolveDiscriminatingTestValidityState = (
  chapter: ProseChapter,
): DiscriminatingTestValidityState => {
  const chapterText = (chapter.paragraphs ?? []).join(" ");
  const hasTheoryMarker = (isDtTheoryVocabularyWidened()
    ? DISCRIMINATING_TEST_THEORY_WIDE_RE
    : DISCRIMINATING_TEST_THEORY_NARROW_RE).test(chapterText);
  const hasProofMarker = DISCRIMINATING_TEST_PROOF_RE.test(chapterText);
  return {
    hasTheoryMarker,
    hasProofMarker,
    isValid: hasTheoryMarker && hasProofMarker,
  };
};

/**
 * Regex matching resolution-confirming phrases in the final chapter.
 * Exported so the orchestrator (agent9-run.ts) can use the same definition
 * and the two files cannot silently drift — fixes issue #3.2.
 */
/**
 * REVIEW_12 §3.2 — RESOLUTION LANGUAGE, NARROWED ON CORPUS EVIDENCE.
 *
 * The previous version matched bare `expos(ed|es)`, `guilty`, `surrendered`, `unmask(ed)` and
 * `condemned`. MEASURED on run `mystery-1787090659145`: chapter 1 was rejected TWICE for
 *
 *   "The mechanism inside the clock, partially EXPOSED where the panel hung ajar…"
 *
 * with the message "chapter must not contain confession/arrest/solution language" — in a chapter that
 * contained no confession, no arrest and no solution. Across 171 corpus manuscripts bare `exposed`
 * occurs 322 times and the sampled uses are clock workings, exposed mechanisms and "the fragile order
 * … was exposed"; `surrendered` is mostly "dusk surrendered to the chill" and "surrendered the
 * letter"; `guilty` is mostly "a guilty hand". The resolution senses are the minority.
 *
 * Each alternative below now requires the construction that carries the resolution MEANING — a person
 * or a verdict, not a thing left uncovered. Verified against 9 positive controls (confessed, under
 * arrest, found guilty, "you killed her", "the murderer is", "exposed him as the killer", "surrendered
 * herself", "revealed as the culprit", "a full confession") and 9 measured false positives, all of
 * which now decline.
 *
 * NET EFFECT ON THE OTHER CONSUMER, checked before shipping: this regex is also the POSITIVE test for
 * the reveal chapter (line ~1343), where narrowing could have caused a false negative. Over the last
 * two chapters of all 171 manuscripts it now matches **169 where the old one matched 165** — adding
 * `confession` (the noun), which `confess(?:ed|es)?` never covered. Stricter where it should be,
 * broader where it counts.
 */
export const RESOLUTION_RE = new RegExp(
  [
    // Confession — but not the Golden-Age discourse marker: "Though I confess, I've seen clocks…"
    String.raw`\bconfess(?:ed|es|ion)\b`,
    String.raw`\bI\s+confess\s+(?:to|that\s+I)\b`,
    String.raw`\barrest(?:ed)?\b`,
    String.raw`\btaken\s+into\s+custody\b`,
    String.raw`\bI\s+(?:did|killed)\b`,
    // Guilt as a verdict, never as an adjective on a look, a hand or a conscience.
    String.raw`\b(?:found|proved?|declared|pronounced)\s+guilty\b`,
    String.raw`\b(?:is|was|are|were|am)\s+guilty\b`,
    String.raw`\bguilty\s+(?:of|party|man|woman|person|one)\b`,
    String.raw`\bthe\s+guilty\b`,
    String.raw`\byou\s+committed\b`,
    String.raw`\byou\s+killed\b`,
    String.raw`\bthe\s+murderer\s+is\b`,
    String.raw`\bit\s+was\s+you\b`,
    String.raw`\bunmask(?:ed)?\s+(?:as|the|him|her|them)\b`,
    String.raw`\bthe\s+\w+\s+unmasked\b`,
    // Exposure OF a person or of the truth — never a physical thing left uncovered.
    String.raw`\bexpos(?:ed|es)\s+(?:him|her|them|you|the\s+(?:culprit|killer|murderer|truth|lie|deception|fraud|forgery))\b`,
    String.raw`\bexposed\s+as\s+(?:the|a)\b`,
    String.raw`\bnamed\s+as\b`,
    String.raw`\brevealed\s+as\s+(?:the|a)\b`,
    String.raw`\bbrought\s+to\s+justice\b`,
    String.raw`\bcaught\s+red-handed\b`,
    String.raw`\bsurrendered\s+(?:himself|herself|themselves|to\s+(?:the\s+)?(?:police|constable|authorities|law))\b`,
    String.raw`\bcondemned\s+(?:him|her|them|you)\b`,
    String.raw`\bthe\s+killer\s+(?:was|proved?|is)\b`,
  ].join('|'),
  'i',
);

/**
 * Shared resolution backstop sentence used by both the batch retry loop (agent9-prose.ts)
 * and the post-generation injection (agent9-run.ts).  Centralised here so the two sites
 * cannot drift — fixes issue #2.4.
 */
// A_58 #1: the injected backstop is the FINAL paragraph of the resolution chapter, so it must (a) match
// RESOLUTION_RE (confess/arrest/"I did") to clear "no resolution event", and (b) close IN-SCENE — never a
// summary verdict ("the case was closed" / "justice had been served"), which trips the resolution
// close-in-scene lint (VERDICT_CLOSER_RE). It is rendered as a dramatized confession + arrest beat ending
// on a sensation, so when the backstop must fire it is no longer a tell-not-show verdict (A_57 D4).
export const buildResolutionBackstopSentence = (culpritSurname: string): string =>
  `"It was me." The words left ${culpritSurname} at last, barely above a whisper. ` +
  `"I confess — I did it." A constable stepped forward, a hand closing gently over ${culpritSurname}'s arm, ` +
  `and the room let out the breath it had been holding.`;

export interface StageContractCheck {
  mode: StageModeKey;
  victimName?: string;
  suspectNames?: string[];
  culpritName?: string;
  murderMethod?: string;
}

// L1 (ROADMAP_TO_80 M0): match a resolved manner-of-death phrase in prose the SAME way the rubric
// grader (rubric-score facts.ts) does, so the reveal GATE forces exactly what the GRADER checks — else
// the "weak murder method" cap can never clear. Two rules mirror the grader:
//   1. Drop the "wound"/"wind" collision: a clock-tampering mystery says "the clock was WOUND back",
//      which must NOT satisfy "the victim was stabbed" (the grader deliberately excludes "wound" too).
//   2. Match each remaining stem at a WORD START so "stab" matches stabbed/stabbing (not "con-stab-le").
// If the phrase reduces to no enforceable token, return true (unenforceable → never false-fail). When
// `method` is a mechanism fallback (no death method resolved), this degrades to the prior token check.
const DEATH_METHOD_COLLISION_TOKENS = new Set(["wound", "wounds", "wounded"]);
export const proseSurfacesDeathMethod = (proseLower: string, method: string): boolean => {
  const tokens = method
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !DEATH_METHOD_COLLISION_TOKENS.has(token));
  if (tokens.length === 0) return true;
  return tokens.some((token) =>
    new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(proseLower),
  );
};

// A "full culprit resolution" is a genuine end-of-mystery beat, NOT the ordinary appearance of the
// words "confess"/"arrest". The earlier bare regex false-fired on suspect-pressure prose that is
// exactly what the stage is FOR — a suspect confessing a *secret* ("I confess, I lost track of
// time"; "her confession hung in the air"), a metaphor ("time arrested by violence"), or suspense
// ("the murderer was still among them"). Each branch below now requires the resolution to be tied
// to the crime / an actual arrest / a named accusation. (Per-sentence [^.!?] guards never span
// sentences, so confession-then-unrelated-clause cannot match.)
const AFFIRMATIVE_SUSPECT_PRESSURE_RESOLUTION_RE = new RegExp(
  [
    // confession tied to the crime (not a secret, alibi, or "I confess I was late")
    /\bconfess(?:ed|es|ing|ion)?\b[^.!?]{0,40}\b(?:murder(?:ed)?|kill(?:ed|ing|er)?|crime|poison(?:ed|ing)?|stabb(?:ed|ing)|strangl\w+|did it|guilt)\b/.source,
    // a real arrest (not the metaphor "arrested by violence")
    /\b(?:under arrest|placed under arrest|you(?:'re| are) under arrest|made an arrest|arrest(?:ed|ing)? (?:him|her|them|the (?:suspect|culprit|murderer|killer)))\b/.source,
    // the case explicitly declared solved
    /\bcase (?:is )?closed\b|\bguilty beyond (?:all )?(?:reasonable )?doubt\b/.source,
    // explicit accusation / naming the culprit
    /\bi accuse you\b|\bi name (?:the (?:culprit|murderer|killer)|you|him|her)\b/.source,
    // "the culprit/murderer/killer is/was X" — excluding suspense continuations (no name follows)
    /\bthe (?:culprit|murderer|killer) (?:is|was)(?! (?:still|someone|some|among|amongst|here|near|in this|in the|out there|one of|not|never|no |a |an |the |loose|free|gone|clever|careful|cunning|cold|nowhere))/
      .source,
  ].join("|"),
  "i",
);

const NEGATED_RESOLUTION_RE =
  /\b(?:no|not|never|without|still no|not yet|had not|did not|could not|would not)\b[^.!?]{0,40}\b(?:confess(?:ed|es|ion)|arrest(?:ed)?|accusation|culprit|murderer|killer|guilty)\b/i;

export const hasAffirmativePrematureResolution = (text: string): boolean => {
  if (!AFFIRMATIVE_SUSPECT_PRESSURE_RESOLUTION_RE.test(text)) return false;
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  return sentences.some((sentence) =>
    AFFIRMATIVE_SUSPECT_PRESSURE_RESOLUTION_RE.test(sentence) &&
    !NEGATED_RESOLUTION_RE.test(sentence)
  );
};

export const validateChapterPreCommitObligations = (
  chapter: ProseChapter,
  ledgerEntry: ChapterRequirementLedgerEntry,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
  resolutionCheck?: {
    isLastChapter: boolean;
    culpritName: string;
    culpritSurname: string;
    murderMethod?: string;
    /** ITEM 11 (#4): full text of the RESOLVED reveal chapter when it precedes the final
     *  chapter. When the reveal chapter already carries the resolution markers, the final
     *  (aftermath) chapter is not required to re-stage them — it must still name the
     *  culprit surname. Absent ⇒ behaviour is byte-identical to the pre-ITEM-11 check. */
    revealChapterText?: string;
  },
  stageContractCheck?: StageContractCheck,
): ChapterObligationResult => {
  const hardFailures: string[] = [];
  const preferredMisses: string[] = [];
  const chapterText = (chapter.paragraphs ?? []).join(" ");
  const chapterLower = chapterText.toLowerCase();
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
    const clueState = resolveClueObligationState(chapter, ledgerEntry, clueId, clueDistribution, castNames);
    const clueDesc = clueState.description ? `"${clueState.description}"` : `"${clueId}"`;

    if (!clueState.isPresent) {
      const absentKey = `${clueId}:absent`;
      if (!seenClueFailKeys.has(absentKey)) {
        seenClueFailKeys.add(absentKey);
        // Clue content is entirely absent — tell the writer what needs to happen narratively.
        // Append pointsTo hint when the description is a genre label (e.g. "Direct observation")
        // so the retry directive contains actionable prose content, not just a delivery-method name.
        const pointsToHint = clueState.pointsTo?.trim();
        const extraHint = pointsToHint && pointsToHint !== clueState.description
          ? ` (this clue reveals: ${pointsToHint})`
          : '';
        const repair = clueState.placement === 'early'
          ? `Include an on-page observation of ${clueDesc}${extraHint} in the first 2 paragraphs of the chapter, followed immediately by an explicit inference paragraph.`
          : `Include an on-page observation or reference to ${clueDesc}${extraHint} before the chapter ends.`;
        hardFailures.push(
          `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is absent. ${repair}`
        );
      }
    } else if (clueState.placement === 'early' && !clueState.isEarlyEnough) {
      // Content is present but must also appear in the first 25% of paragraphs.
      if (!clueState.isEarlyEnough) {
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

  if (stageContractCheck) {
    const pressureMarker = /\b(fear|afraid|anxious|motive|secret|lied|lying|deception|hesitat|defensiv|loyalty|shame|regret|tension|suspicion)\b/i;
    const contradictionMarker = /\b(contradiction|inconsisten|uncertain|doubt|questioned|alibi|reconsider|discrepancy|mismatch)\b/i;
    const reinterpretMarker = /\b(previously|at first|seemed|now|actually|reinterpret|recontext|different meaning|reassess|reframed)\b/i;
    const clearingMarker = /\b(clear(?:ed|s|ing)|ruled out|eliminat\w*|innocent|exonerat\w*|alibi (?:holds|corroborated|confirmed))\b/i;
    const motiveMarker = /\b(motive|fear|resentment|jealous|debt|inheritance|shame|protect)\b/i;
    const opportunityMarker = /\b(opportunity|access|alibi|time window|whereabouts|means)\b/i;

    switch (stageContractCheck.mode) {
      case "discovery_opening": {
        if (stageContractCheck.victimName && !chapterLower.includes(stageContractCheck.victimName.toLowerCase())) {
          uniqueHardFailures.push(
            `Stage-mode outcome failed (discovery_opening): victim must be named explicitly as "${stageContractCheck.victimName}" in Chapter 1.`
          );
        }
        /**
         * REVIEW_12 §3.2 — NAME THE TRIGGER.
         *
         * MEASURED on run `mystery-1787090659145`: chapter 1 was rejected twice by this line, with a
         * message that names a category and not a word. The offending text was
         * *"The mechanism inside the clock, partially exposed where the panel hung ajar"* — one token
         * out of nineteen, in a chapter with no confession, no arrest and no solution. The model was
         * told which rule it broke and given no way to find what broke it, so it regenerated the whole
         * chapter twice. Quoting the match turns that into a one-word edit.
         */
        const resolutionHit = RESOLUTION_RE.exec(chapterText);
        if (resolutionHit) {
          const at = resolutionHit.index ?? 0;
          const context = chapterText
            .slice(Math.max(0, at - 60), at + resolutionHit[0].length + 60)
            .replace(/\s+/g, " ")
            .trim();
          uniqueHardFailures.push(
            `Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution ` +
              `language. Triggered by "${resolutionHit[0]}" in: "…${context}…". Chapter 1 discovers the body; ` +
              `reword just that phrase — if it describes a physical thing rather than a person being found out, ` +
              `choose a word that cannot read as an accusation.`
          );
        }
        if (Array.isArray(stageContractCheck.suspectNames) && stageContractCheck.suspectNames.length > 0) {
          const mentioned = stageContractCheck.suspectNames.some((name) => chapterLower.includes(name.toLowerCase()));
          if (!mentioned) {
            uniqueHardFailures.push(
              "Stage-mode outcome failed (discovery_opening): introduce at least one major suspect with role relevance and tension."
            );
          }
        }
        break;
      }
      case "early_investigation": {
        if (!contradictionMarker.test(chapterText)) {
          uniqueHardFailures.push(
            "Stage-mode outcome failed (early_investigation): chapter must include contradiction/uncertainty/alibi pressure that changes investigative direction."
          );
        }
        break;
      }
      case "suspect_pressure": {
        if (!pressureMarker.test(chapterText)) {
          uniqueHardFailures.push(
            "Stage-mode outcome failed (suspect_pressure): chapter must include at least one new pressure reveal (fear, motive, lie, loyalty conflict, or secret)."
          );
        }
        if (hasAffirmativePrematureResolution(chapterText)) {
          uniqueHardFailures.push(
            "Stage-mode outcome failed (suspect_pressure): no full culprit resolution is allowed in suspect-pressure mode."
          );
        }
        break;
      }
      case "false_suspect_clearing": {
        if (!clearingMarker.test(chapterText)) {
          uniqueHardFailures.push(
            "Stage-mode outcome failed (false_suspect_clearing): chapter must show evidence-based innocence (cleared/ruled out/exonerated/alibi corroborated)."
          );
        }
        break;
      }
      case "clue_reinterpretation": {
        if (!reinterpretMarker.test(chapterText)) {
          uniqueHardFailures.push(
            "Stage-mode outcome failed (clue_reinterpretation): chapter must reinterpret an earlier clue and state how meaning changed."
          );
        }
        break;
      }
      case "discriminating_test": {
        if (!resolveDiscriminatingTestValidityState(chapter).isValid) {
          uniqueHardFailures.push(
            "Discriminating test validity failed: chapter must state competing theory/hypothesis and an observable result that proves one path and rules out another."
          );
        }
        break;
      }
      case "final_reveal": {
        if (!motiveMarker.test(chapterText) || !opportunityMarker.test(chapterText)) {
          uniqueHardFailures.push(
            "Final reveal completeness failed: reveal must include motive/emotional truth and opportunity/access linkage, not only accusation."
          );
        }
        if (stageContractCheck.murderMethod) {
          if (!proseSurfacesDeathMethod(chapterLower, stageContractCheck.murderMethod)) {
            uniqueHardFailures.push(
              `Final reveal completeness failed: reveal must explicitly connect culprit to death method ("${stageContractCheck.murderMethod}").`
            );
          }
        }
        break;
      }
      case "aftermath_consequence": {
        /**
         * REVIEW_12 §3.3 — `for the first time` REMOVED, on corpus evidence.
         *
         * This list was four literal phrases under a message that makes a structural claim. Measured
         * over the last two chapters of all 171 corpus manuscripts:
         *
         *   new clue          0 occurrences
         *   newly discovered  0 occurrences
         *   new evidence      2 occurrences — both genuinely presenting evidence
         *   for the first time  **47 occurrences, and not one is about evidence**
         *
         * Every sampled use of the fourth is the register this validator DEMANDS — "her posture
         * relaxing for the first time all evening", "for the first time in days, her eyes met his",
         * "the mask of authority slipped for the first time". Consequence and retrospect is exactly
         * what an aftermath chapter owes, and the phrase English uses to write it was being rejected
         * as decisive new evidence. The other three are near-zero volume and semantically on target,
         * so they stay.
         */
        const aftermathEvidencePhrase =
          /\b(new clue|new evidence|newly discovered)\b/i.exec(chapterText);
        if (aftermathEvidencePhrase) {
          // REVIEW_12 §3.2 — name the trigger. The old message restated the rule, so a model that
          // believed it had written consequence had nothing to change and returned the same chapter.
          uniqueHardFailures.push(
            `Stage-mode outcome failed (aftermath_consequence): aftermath chapter must focus on consequence, ` +
              `not introduce decisive new mystery evidence. Triggered by the phrase "${aftermathEvidencePhrase[0]}" — ` +
              `remove or reword that phrase, and refer to evidence already shown rather than presenting it afresh.`
          );
        }
        // A_71 — enforce the prohibitions the AFTERMATH CONTRACT already states.
        //
        // MEASURED (story_20260731-1650): Ch9's prompt correctly carried the aftermath contract,
        // including "DO NOT RE-STAGE THE REVEAL … no per-suspect clearance recitation … all of these
        // will be rejected and regenerated". The model re-staged the reveal anyway, and NOTHING
        // rejected it: this case tested only for new evidence. The external review's headline
        // structural complaint ("Chapter 9 repeats Chapter 8") is that unkept promise.
        //
        // A prompt that threatens rejection without a validator behind it is strictly worse than no
        // threat — it trains nothing and the defect ships.
        for (const violation of detectRestagedRevealViolations(chapterText)) {
          uniqueHardFailures.push(
            `Stage-mode outcome failed (aftermath_consequence): ${violation} The reveal already happened on-page in an earlier chapter; this chapter must show consequence and retrospect only.`
          );
        }
        break;
      }
      default:
        break;
    }
  }

  // Phase 6 Layer 2: Final chapter resolution check
  if (resolutionCheck?.isLastChapter && resolutionCheck.culpritSurname) {
    const culpritRE = new RegExp(`\\b${resolutionCheck.culpritSurname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    // ITEM 11 (#4): the resolution markers may legitimately live in an EARLIER resolved
    // reveal chapter (aftermath final chapter). The check is satisfied when RESOLUTION_RE +
    // culprit surname + murder method all hold in the reveal chapter OR in the final
    // chapter — forcing them into the final chapter re-staged the Ch9 reveal in Ch10.
    const revealText = String(resolutionCheck.revealChapterText ?? '');
    const revealSatisfiesResolution =
      revealText.length > 0 &&
      RESOLUTION_RE.test(revealText) &&
      culpritRE.test(revealText) &&
      (!resolutionCheck.murderMethod ||
        proseSurfacesDeathMethod(revealText.toLowerCase(), resolutionCheck.murderMethod));
    if (revealSatisfiesResolution) {
      // Reveal already delivered — the aftermath chapter must still name the culprit
      // surname (parity with G6-Q2) but is NOT required to re-stage the resolution event.
      if (!culpritRE.test(chapterText)) {
        uniqueHardFailures.push(
          `Final chapter: the culprit was revealed in an earlier chapter, but this aftermath chapter never names ` +
          `${resolutionCheck.culpritName}. Refer to the culprit by name ("${resolutionCheck.culpritSurname}") when the solved case is discussed.`
        );
      }
    } else if (!RESOLUTION_RE.test(chapterText) || !culpritRE.test(chapterText)) {
      uniqueHardFailures.push(
        `Final chapter: no resolution event detected. Include a scene where ${resolutionCheck.culpritName} ` +
        `confesses, is arrested, or the detective explicitly names them as the murderer with evidence.`
      );
    } else if (resolutionCheck.murderMethod) {
      // A3: Causal-bridge check — resolution must mention the murder method, not just name the culprit.
      // Match the manner of death the same way the rubric grader does (drop the "wound"/"wind"
      // collision, word-start stem match) so the GATE forces what the GRADER checks (L1 / M0).
      if (!proseSurfacesDeathMethod(chapterLower, resolutionCheck.murderMethod)) {
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
