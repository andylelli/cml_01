/**
 * agent9-prose/post-pass-polish.ts
 * Guarded quality-only polish for chapters that already satisfy hard validators.
 */
import type { AzureOpenAIClient, ChatCapableClient } from "@cml/llm-client";
import { parseProseResponse } from "./sanitization.js";
import { assessNarrativeBalanceSignals, buildNarrativeBalanceBlock } from "./narrative-balance.js";
import { formatStageModeLabel } from "./clue-validation.js";
import { resolveStageModel } from "./model-tiering.js";
import { tokenizeWords } from "./lint.js";
import type { ProseChapter } from "./types.js";
import type { ChapterRepairContext } from "./deterministic-repair.js";

export interface PostPassPolishResult {
  chapter: ProseChapter;
  applied: boolean;
  keptPolishedVersion: boolean;
  rollbackReason?: "validation_regression" | "obligation_regression" | "quality_no_gain";
}

const OBLIGATION_TOKEN_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "by", "is", "was", "were", "be", "as", "at", "from",
]);

const tokenizeObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !OBLIGATION_TOKEN_STOPWORDS.has(token));

const hasFuzzyObligationMatch = (haystackLower: string, phrase: string): boolean => {
  const tokens = Array.from(new Set(tokenizeObligation(phrase))).slice(0, 8);
  if (tokens.length === 0) return true;
  const minHits = tokens.length <= 3 ? tokens.length : Math.max(2, Math.ceil(tokens.length * 0.4));
  const hits = tokens.reduce((count, token) => (haystackLower.includes(token) ? count + 1 : count), 0);
  return hits >= minHits;
};

const countWords = (value: string): number => {
  const matches = value.match(/[A-Za-z0-9']+/g);
  return matches ? matches.length : 0;
};

const RAW_CLUE_ID_RE = /^clue_[a-z0-9_]+$/i;

export const hasPolishRegression = (args: {
  original: ProseChapter;
  polished: ProseChapter;
  repairContext: ChapterRepairContext;
}): boolean => {
  const originalText = (args.original.paragraphs ?? []).join(" ");
  const polishedText = (args.polished.paragraphs ?? []).join(" ");
  const originalLower = originalText.toLowerCase();
  const polishedLower = polishedText.toLowerCase();

  // Guard against over-compression that can silently remove validated obligations.
  const originalWords = countWords(originalText);
  const polishedWords = countWords(polishedText);
  if (originalWords >= 120 && polishedWords < Math.floor(originalWords * 0.8)) {
    return true;
  }

  for (const clueSummary of args.repairContext.requiredClueSummaries) {
    const normalizedSummary = String(clueSummary ?? "").trim();
    if (!normalizedSummary || RAW_CLUE_ID_RE.test(normalizedSummary)) continue;
    if (!hasFuzzyObligationMatch(originalLower, clueSummary)) continue;
    if (!hasFuzzyObligationMatch(polishedLower, clueSummary)) {
      return true;
    }
  }

  for (const clearance of args.repairContext.matchingClearances) {
    const suspect = String(clearance?.suspect_name ?? "").trim();
    if (!suspect) continue;
    const suspectLower = suspect.toLowerCase();
    if (!originalLower.includes(suspectLower)) continue;
    if (!polishedLower.includes(suspectLower)) {
      return true;
    }
  }

  return false;
};

/**
 * A_71 — the single source of truth for "does this chapter get a polish pass?".
 *
 * MANDATORY INVARIANT: at most ONE polish call per chapter per run, and only after that chapter has
 * passed its hard gates. Extracted as a pure predicate so the rule is testable without standing up
 * generateProse, and so the two opt-in flags cannot re-open a chapter that was already polished.
 *
 * Order matters — `chapterPassed` and `alreadyPolished` are checked before anything else, so no flag
 * combination can route a failing or already-polished chapter to the provider.
 */
export const shouldPolishChapter = (args: {
  chapterNumber: number;
  /** True only when the chapter cleared every hard gate. A failing chapter is never polished. */
  chapterPassed: boolean;
  /** Chapter numbers already given their one polish attempt this run. */
  alreadyPolished: ReadonlySet<number>;
  /** 1-based content attempt for this batch. */
  attempt: number;
  provisionalScore: number;
  polishRetriedChapters: boolean;
  polishHighLeakage: boolean;
}): boolean => {
  if (!args.chapterPassed) return false;
  if (args.alreadyPolished.has(args.chapterNumber)) return false;
  const attemptAllows = args.attempt === 1 || args.polishRetriedChapters || args.polishHighLeakage;
  if (!attemptAllows) return false;
  // High-leakage chapters bypass the provisional<95 gate: the provisional score is blind to prose
  // flatness, so it would exclude exactly the clue-complete reveal chapters that leak most.
  return args.provisionalScore < 95 || args.polishHighLeakage;
};

export const buildPostPassPolishPrompt = (args: {
  chapter: ProseChapter;
  repairContext: ChapterRepairContext;
}): string => {
  // A_71 — these were capped at 6 and 5 while hasPolishRegression checks EVERY required clue and
  // clearance. A chapter with more obligations than the cap was told to preserve a subset, dropped
  // one outside it, and was rolled back for the omission — a silent, self-inflicted rollback that
  // wasted the polish call. The guard defines the contract, so the prompt must state all of it.
  const requiredClues = args.repairContext.requiredClueSummaries;
  const clearances = args.repairContext.matchingClearances
    .map((entry) => entry.suspect_name)
    .filter(Boolean);
  const balanceBlock = buildNarrativeBalanceBlock(args.repairContext.stageMode);
  const balanceAssessment = assessNarrativeBalanceSignals(args.chapter, args.repairContext.stageMode);
  const lines: string[] = [];
  lines.push("LINE EDIT — MAKE THIS CHAPTER READ LIKE PUBLISHED FICTION");
  lines.push("");
  lines.push("This chapter is already logically correct. Every clue, alibi and clearance in it is right, and");
  lines.push("your job is not to check them. Your job is the sentences.");
  lines.push("");
  // A_71 — a single governing test, stated first. Two external reviews scored Prose/polish 6/10 and
  // 7/10 on chapters this pass had already touched, both citing "generated validation prose". A list
  // of prohibitions was not landing; a reader-facing test the model can apply to every sentence is a
  // better instrument than another rule.
  lines.push("THE TEST — apply it to every sentence:");
  lines.push("  Would a reader believe a novelist wrote this, or would they sense a machine assembling facts?");
  lines.push("  If the second, rewrite it. If a sentence reads as though it exists to satisfy a requirement,");
  lines.push("  it must be rewritten so it exists because the scene needed it.");
  lines.push("");
  lines.push("THE FIVE THINGS REVIEWERS KEEP FLAGGING — fix every instance you find:");
  lines.push("");
  lines.push("1. VERDICT SENTENCES. A conclusion announced instead of dramatised. The tells are a fact");
  lines.push("   followed by its own ruling in the same breath — \"…placed her elsewhere; she could not have");
  lines.push("   been responsible\" — or a clause naming its own function (\"the evidence chain\", \"the");
  lines.push("   testimony confirmed\", \"which proved\"). Replace the ruling with the moment it lands: who");
  lines.push("   stops arguing, what the investigator does next, what goes quiet. The reader draws the");
  lines.push("   conclusion; the prose does not hand it over.");
  lines.push("");
  lines.push("2. OVER-EXPLANATION. Prose that tells the reader how important something is —");
  lines.push("   \"this is what proves it\", \"the significance was unmistakable\", a detail followed by a");
  lines.push("   sentence explaining why it matters. Cut the explanation. Trust the detail. A murder weapon");
  lines.push("   described accurately does not need to be announced as the murder weapon.");
  lines.push("");
  lines.push("3. STACKED MODIFIERS THAT DESCRIBE NOTHING REAL. Adjective pile-ups assembled from setting");
  lines.push("   vocabulary rather than observed from a place — three or four qualifiers queued in front of");
  lines.push("   one noun, or a room given a grander name than it has elsewhere in the story. Picture the");
  lines.push("   object; write what is actually there; call each place by the same name every time.");
  lines.push("");
  lines.push("4. SPEC TEXT WEARING A SENTENCE. A computed value or measurement set down bare, as though");
  lines.push("   copied from a specification — a rate, a depth, an interval, a test outcome stated as a");
  lines.push("   result rather than as something anyone in the room saw or said. Keep the number exactly;");
  lines.push("   give it to a character to notice, doubt, or argue about.");
  lines.push("");
  lines.push("5. FLAT REPORTING OF SPEECH AND THOUGHT. Alibis recited, times stated, deductions narrated");
  lines.push("   as \"X realised that Y\". People under suspicion deflect, qualify, and answer the question");
  lines.push("   they wish had been asked. Let them. The investigator infers the rest.");
  lines.push("");
  // The A_67 lesson: illustrative prose in a prompt gets copied into stories verbatim. Any example
  // here must be impossible to reuse — hence a bare shape, not a sentence anyone could lift.
  lines.push("Do NOT copy any wording from these instructions into the chapter. They describe shapes to");
  lines.push("remove, not text to insert.");
  lines.push("");
  lines.push("ALSO, WHERE IT HELPS:");
  lines.push("- Vary sentence length and opening. Two long sentences in a row, or three openings sharing a");
  lines.push("  shape, flatten a paragraph however correct it is.");
  lines.push("- Cut repeated atmospheric phrasing. A sensory image used once is a detail; twice is a tic.");
  lines.push("- Prefer era-authentic diction where a phrase reads generically modern — a light lift, never a");
  lines.push("  re-voicing, and never at the cost of clarity.");
  lines.push("");
  lines.push("WHAT YOU MAY NOT DO:");
  lines.push("- Do not reorder events, add facts, remove evidence, or change who is implicated or cleared.");
  lines.push("- Do not invent a detail to make a sentence prettier. Every physical fact must already be here.");
  lines.push("- Do not shorten the chapter materially. This is a rewrite of sentences, not a trim.");
  lines.push("- If an improvement risks changing the logic, keep the original wording. Losing a small");
  lines.push("  improvement costs nothing; losing a clue fails the chapter.");
  lines.push("");
  lines.push("LOCKED STORY CONTRACT");
  lines.push(`- Stage mode remains ${formatStageModeLabel(args.repairContext.stageMode)}.`);
  lines.push(`- Investigator anchor: ${args.repairContext.investigatorName}.`);
  if (args.repairContext.culpritName) {
    lines.push(`- Culprit logic remains anchored to: ${args.repairContext.culpritName}.`);
  }
  if (requiredClues.length > 0) {
    lines.push(`- Preserve these required clue observations on-page: ${requiredClues.join("; ")}.`);
  }
  if (clearances.length > 0) {
    lines.push(`- Preserve suspect-clearance outcomes for: ${clearances.join(", ")}.`);
  }
  if (balanceBlock) {
    lines.push(balanceBlock);
  }
  if (balanceAssessment.hints.length > 0) {
    lines.push("SOFT BALANCE HINTS (ADVISORY ONLY)");
    for (const hint of balanceAssessment.hints.slice(0, 2)) {
      lines.push(`- ${hint}`);
    }
  }
  lines.push("");
  lines.push("OUTPUT RULES");
  lines.push("- Return full corrected JSON for exactly one chapter.");
  lines.push("- Keep the same title unless there is a minor punctuation or capitalization cleanup.");
  lines.push("- Return EVERY paragraph, edited or not, in its original order.");
  lines.push("- Preserve the narrative voice, period register, and atmosphere — this is a line-edit, not a re-voicing.");
  lines.push("- Before returning, reread your version once as a reader who does not know the plot. If any");
  lines.push("  sentence still reads as assembled rather than written, fix it and reread again.");
  return lines.join("\n");
};

export const polishPassingChapter = async (args: {
  chapter: ProseChapter;
  client: AzureOpenAIClient;
  repairContext: ChapterRepairContext;
  model?: string;
  runId?: string;
  projectId?: string;
  /**
   * Optional alternate provider for THIS stage only (see polish-provider.ts). When supplied, the
   * Agent 9 stage-model tier is bypassed and `polishModel` is used instead — `resolveStageModel`
   * returns an AZURE DEPLOYMENT NAME, which is meaningless to another provider and would 404.
   * Unset ⇒ identical behaviour to before this option existed.
   */
  polishClient?: ChatCapableClient;
  polishModel?: string;
  validateCandidate: (candidate: ProseChapter) => Promise<{ chapter: ProseChapter; hardErrors: string[] }> | { chapter: ProseChapter; hardErrors: string[] };
}): Promise<PostPassPolishResult> => {
  if (!Array.isArray(args.chapter?.paragraphs) || args.chapter.paragraphs.length === 0) {
    return { chapter: args.chapter, applied: false, keptPolishedVersion: false };
  }

  const client: ChatCapableClient = args.polishClient ?? args.client;
  // A_69 Increment 2 — polish-stage tier (AGENT9_MODEL_POLISH); unset falls back to args.model.
  // When an alternate provider is routed in, its own model id wins (see the note above).
  const model = args.polishClient ? args.polishModel : resolveStageModel("polish", args.model);

  const response = await client.chat({
    messages: [
      {
        role: "system",
        content: "Polish prose without changing story facts, logic, clue obligations, or chapter structure.",
      },
      {
        role: "user",
        content: `${buildPostPassPolishPrompt({
          chapter: args.chapter,
          repairContext: args.repairContext,
        })}\n\nSOURCE CHAPTER JSON\n${JSON.stringify({
          status: "draft",
          chapters: [args.chapter],
        }, null, 2)}`,
      },
    ],
    model,
    // Providers that reject `temperature` (current Claude models) drop it in their own client; this
    // value still governs the Azure path, so it stays.
    temperature: 0.2,
    maxTokens: 5000,
    jsonMode: true,
    logContext: {
      runId: args.runId ?? "",
      projectId: args.projectId ?? "",
      agent: `Agent9-PostPassPolish-Ch${args.repairContext.chapterNumber}`,
      retryAttempt: 1,
    },
  });

  // A truncated (`max_tokens`) or declined (`refusal`) reply is a PARTIAL document. Both are normal
  // 200s on Claude, so nothing throws — and a partial chapter can still parse into a plausible-looking
  // object that quietly drops the back half. Roll back on the finish reason rather than hoping
  // JSON.parse fails. The chapter we already accepted is the floor.
  if (response.finishReason === "max_tokens" || response.finishReason === "refusal") {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  let candidate: ProseChapter;
  try {
    const parsed = parseProseResponse(response.content);
    candidate = parsed.chapters?.[0];
  } catch {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  if (!candidate || !Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  const validated = await args.validateCandidate(candidate);
  if (validated.hardErrors.length > 0) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  if (hasPolishRegression({
    original: args.chapter,
    polished: validated.chapter,
    repairContext: args.repairContext,
  })) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "obligation_regression",
    };
  }

  const originalText = JSON.stringify(args.chapter);
  const polishedText = JSON.stringify(validated.chapter);
  if (originalText === polishedText) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "quality_no_gain",
    };
  }

  return {
    chapter: validated.chapter,
    applied: true,
    keptPolishedVersion: true,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// A_68 — full-story cross-chapter repetition polish.
// A per-chapter pass cannot see repetition that spans chapters (the recurring filler /
// sentence-opening monotony the external review flags). This stage takes a deterministically-built
// repetition map (recurring n-grams from detectRecurringPhrases + repeated chapter openings) and hands
// each affected chapter to the LLM to VARY those specific phrasings — with a self-contained
// validate-then-rollback guard (no ledger needed): a repetition-variation rewrite is accepted only when
// it preserves every locked-fact value, every cast name present, every number/time token, and the
// chapter's length. Otherwise that chapter rolls back to its committed text. Flag-gated; never regresses.
// ─────────────────────────────────────────────────────────────────────────────

const chapterFullText = (chapter: ProseChapter): string => (chapter.paragraphs ?? []).join("\n\n");

/**
 * A_70 §8.2 — the needle/haystack fix.
 *
 * `detectRecurringPhrases` emits NORMALIZED token n-grams (via `tokenizeWords`: lowercased,
 * punctuation stripped, single-spaced) — e.g. `"clock running oddly earlier this afternoon chimes"`.
 * This pass used to match them with a raw `.toLowerCase().includes()` against un-normalized chapter
 * text. A 7-word n-gram nearly always spans a sentence break ("…this afternoon. Chimes not as
 * usual…"), so the raw test could never match: measured 0/15 phrases on every arm of the A_70 A/B,
 * which made the phrase half of the targeting a SILENT no-op (no error, no warning, zero LLM calls).
 * Only the `repeatedOpenings` path ever fired — which is why A_69 §9.4 saw the pass vary words but
 * not images.
 *
 * Run both sides through the SAME tokenizer so needle and haystack are comparable.
 */
const normalizedText = (text: string): string => tokenizeWords(text).join(" ");

const OPENING_STOPWORDS = new Set([
  "the", "a", "an", "and", "but", "as", "of", "to", "in", "on", "it", "he", "she", "they", "there", "that", "this", "his", "her",
]);

/** First up-to-4 content words of a chapter's opening sentence, normalized — the "opening shape". */
const openingShape = (chapter: ProseChapter): string => {
  const first = String((chapter.paragraphs ?? [])[0] ?? "").trim();
  const words = first
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !OPENING_STOPWORDS.has(w));
  return words.slice(0, 3).join(" ");
};

/** Opening shapes shared by >=2 chapters — the monotony a per-chapter pass can't see. */
export const buildRepeatedOpenings = (chapters: ProseChapter[]): string[] => {
  const counts = new Map<string, number>();
  for (const ch of chapters) {
    const shape = openingShape(ch);
    if (shape.split(" ").length < 2) continue;
    counts.set(shape, (counts.get(shape) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([shape]) => shape);
};

const digitTokens = (text: string): string[] => text.match(/\b\d[\d:.,]*\d\b|\b\d\b/g) ?? [];

/**
 * Self-contained guard for a repetition-variation rewrite. Returns true (regressed → roll back) when the
 * rewrite drops any locked-fact value, any cast name that was present, any number/time token, or >12% of
 * the chapter's words. It does NOT need per-chapter ledgers: a rewrite that keeps every fact-bearing token
 * and the length, while only varying flagged phrasings, cannot alter the plot logic.
 */
export const hasRepetitionRewriteRegression = (args: {
  original: ProseChapter;
  rewritten: ProseChapter;
  lockedValues: ReadonlyArray<string>;
  castNames: ReadonlyArray<string>;
  /**
   * A_71 — required clue observables. The guard covered locked facts, cast names, digits and
   * length, but NOT clues: a variation rewrite could reword a clue out of the chapter and pass.
   * Optional so existing callers keep working; absent ⇒ previous behaviour exactly.
   */
  clueTerms?: ReadonlyArray<string>;
}): boolean => {
  const originalText = chapterFullText(args.original);
  const rewrittenText = chapterFullText(args.rewritten);
  const originalLower = originalText.toLowerCase();
  const rewrittenLower = rewrittenText.toLowerCase();

  const originalWords = countWords(originalText);
  const rewrittenWords = countWords(rewrittenText);
  if (originalWords >= 80 && rewrittenWords < Math.floor(originalWords * 0.88)) return true;

  for (const raw of args.lockedValues) {
    const value = String(raw ?? "").trim().toLowerCase();
    if (!value) continue;
    if (originalLower.includes(value) && !rewrittenLower.includes(value)) return true;
  }
  for (const raw of args.castNames) {
    const name = String(raw ?? "").trim().toLowerCase();
    if (!name) continue;
    if (originalLower.includes(name) && !rewrittenLower.includes(name)) return true;
  }
  // A clue present before the rewrite must survive it.
  for (const raw of args.clueTerms ?? []) {
    const term = String(raw ?? "").trim().toLowerCase();
    if (term.length < 4) continue;
    if (originalLower.includes(term) && !rewrittenLower.includes(term)) return true;
  }
  // Every number/time token present before must survive (a dropped time/number is a lost fact).
  const before = digitTokens(originalText);
  const afterCounts = new Map<string, number>();
  for (const t of digitTokens(rewrittenText)) afterCounts.set(t, (afterCounts.get(t) ?? 0) + 1);
  const beforeCounts = new Map<string, number>();
  for (const t of before) beforeCounts.set(t, (beforeCounts.get(t) ?? 0) + 1);
  for (const [token, n] of beforeCounts) {
    if ((afterCounts.get(token) ?? 0) < n) return true;
  }
  return false;
};

export const buildFullStoryRepetitionPolishPrompt = (args: {
  chapter: ProseChapter;
  repeatedPhrases: ReadonlyArray<string>;
  repeatedOpenings: ReadonlyArray<string>;
  lockedValues: ReadonlyArray<string>;
}): string => {
  const lines: string[] = [];
  lines.push("CROSS-CHAPTER REPETITION POLISH");
  lines.push("These phrasings and sentence-openings recur ACROSS the story and read as repetitive to a reader.");
  lines.push("Rewrite ONLY where they appear in THIS chapter so each reads fresh; vary the sentence openings.");
  lines.push("Change NOTHING else: preserve every named character, clue, alibi, clearance, number, time, and");
  lines.push("date exactly; do not shorten the chapter; do not alter who is implicated or cleared.");
  if (args.repeatedPhrases.length > 0) {
    lines.push("");
    lines.push("RECURRING PHRASINGS (vary each occurrence in this chapter):");
    for (const p of args.repeatedPhrases.slice(0, 10)) lines.push(`- "${p}"`);
  }
  if (args.repeatedOpenings.length > 0) {
    lines.push("");
    lines.push("REPEATED CHAPTER/SENTENCE OPENINGS (re-open differently if this chapter uses one):");
    for (const o of args.repeatedOpenings.slice(0, 6)) lines.push(`- "${o}…"`);
  }
  if (args.lockedValues.length > 0) {
    lines.push("");
    lines.push("MANDATED — reproduce these EXACT phrases verbatim; never vary them:");
    for (const v of args.lockedValues.slice(0, 12)) lines.push(`- "${v}"`);
  }
  lines.push("");
  lines.push("OUTPUT RULES");
  lines.push("- Return full corrected JSON for exactly one chapter, same title.");
  lines.push("- Preserve the narrative voice and period register — this is a variation pass, not a re-voicing.");
  lines.push("- If varying a phrasing would risk any factual or logical change, keep the original wording.");
  return lines.join("\n");
};

export interface FullStoryRepetitionPolishResult {
  chapters: ProseChapter[];
  editedChapters: number[];
}

export const runFullStoryRepetitionPolish = async (args: {
  chapters: ProseChapter[];
  client: AzureOpenAIClient;
  model?: string;
  runId?: string;
  projectId?: string;
  lockedValues: ReadonlyArray<string>;
  recurringPhrases: ReadonlyArray<string>;
  castNames: ReadonlyArray<string>;
  /** cost bound: how many chapters a single recurring phrase may trigger a rewrite in (default 2). */
  maxChaptersPerPhrase?: number;
}): Promise<FullStoryRepetitionPolishResult> => {
  const chapters = [...args.chapters];
  const repeatedOpenings = buildRepeatedOpenings(chapters);
  const phrases = (args.recurringPhrases ?? []).filter((p) => typeof p === "string" && p.trim().length > 0);
  if (phrases.length === 0 && repeatedOpenings.length === 0) {
    return { chapters, editedChapters: [] };
  }
  const cap = Math.max(1, args.maxChaptersPerPhrase ?? 2);

  // Decide target chapters: any chapter carrying a repeated opening, plus (per phrase, first `cap`
  // chapters that contain it) so a phrase in 6 chapters doesn't fan out to 6 LLM calls.
  const targetIdx = new Set<number>();
  chapters.forEach((ch, i) => {
    if (repeatedOpenings.includes(openingShape(ch))) targetIdx.add(i);
  });
  // A_70 §8.2: normalize each chapter once, then match normalized needles against normalized text.
  const normalizedChapters = chapters.map((ch) => normalizedText(chapterFullText(ch)));
  for (const phrase of phrases) {
    const needle = normalizedText(phrase);
    if (needle.length === 0) continue;
    let taken = 0;
    for (let i = 0; i < chapters.length && taken < cap; i++) {
      if (normalizedChapters[i].includes(needle)) {
        targetIdx.add(i);
        taken += 1;
      }
    }
  }
  if (targetIdx.size === 0) return { chapters, editedChapters: [] };

  const editedChapters: number[] = [];
  for (const i of Array.from(targetIdx).sort((a, b) => a - b)) {
    const original = chapters[i];
    if (!Array.isArray(original?.paragraphs) || original.paragraphs.length === 0) continue;
    // Per-chapter: only surface the phrases/openings that actually appear here.
    // A_70 §8.2 — the SECOND site of the same needle/haystack bug. Fixing only the targeting loop
    // above would not have helped: a chapter selected purely by phrase would arrive here, match
    // nothing under the raw comparison, and be skipped by the `continue` below — still zero calls.
    const localPhrases = phrases.filter((p) => normalizedChapters[i].includes(normalizedText(p)));
    const localOpening = repeatedOpenings.includes(openingShape(original)) ? [openingShape(original)] : [];
    if (localPhrases.length === 0 && localOpening.length === 0) continue;

    let candidate: ProseChapter | undefined;
    try {
      const response = await args.client.chat({
        messages: [
          { role: "system", content: "Vary repetitive phrasing across a story without changing any story fact, name, number, or logic." },
          {
            role: "user",
            content: `${buildFullStoryRepetitionPolishPrompt({
              chapter: original,
              repeatedPhrases: localPhrases,
              repeatedOpenings: localOpening,
              lockedValues: args.lockedValues,
            })}\n\nSOURCE CHAPTER JSON\n${JSON.stringify({ status: "draft", chapters: [original] }, null, 2)}`,
          },
        ],
        // A_69 Increment 2 — polish-stage tier (AGENT9_MODEL_POLISH); unset falls back to args.model.
        model: resolveStageModel("polish", args.model),
        temperature: 0.3,
        maxTokens: 5000,
        jsonMode: true,
        logContext: {
          runId: args.runId ?? "",
          projectId: args.projectId ?? "",
          agent: `Agent9-FullStoryRepetitionPolish-Ch${i + 1}`,
          retryAttempt: 1,
        },
      });
      candidate = parseProseResponse(response.content).chapters?.[0];
    } catch {
      candidate = undefined;
    }
    if (!candidate || !Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) continue;
    if (
      hasRepetitionRewriteRegression({
        original,
        rewritten: candidate,
        lockedValues: args.lockedValues,
        castNames: args.castNames,
      })
    ) {
      continue; // roll back this chapter to its committed text
    }
    chapters[i] = { ...original, ...candidate, title: original.title ?? candidate.title };
    editedChapters.push(i + 1);
  }

  return { chapters, editedChapters };
};
