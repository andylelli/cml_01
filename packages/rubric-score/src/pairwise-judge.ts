/**
 * The PAIRWISE judge — PLAN-TO-90 §7.2 **M1.2**.
 *
 * ── WHY THIS EXISTS, AND WHY IT IS NOT ANOTHER MODEL SWAP ────────────────────────────────────────
 *
 * [PLAN-TO-90 §2](../../../architecture/PLAN-TO-90.md) is blocked on one sentence: *"there is
 * currently no instrument in this project that can tell an 86 from an 81."* Phase 0b.0 tested the
 * obvious escape — a better judge — and **falsified it**, at n=8 on the two manuscripts in question:
 *
 *     gpt-4.1-mini    86 -> 70.4    81 -> 69.3    gap +1.1   spread 7
 *     claude-opus-5   86 -> 52.3    81 -> 54.6    gap -2.3   spread 8   <- ranks them backwards
 *
 * Every one of those numbers came from asking for a **cardinal** judgement: put an absolute mark on
 * one manuscript, alone, against an internalised standard. That is the hardest question anyone can ask
 * a judge, and the measured spread (7-8) exceeds the difference it is being asked to resolve (5).
 *
 * **This asks an ordinal question instead**, which nothing in this project has ever tried: *given these
 * two books, which is the better mystery?* No scale to calibrate, no absolute anchor to drift against,
 * and both texts in front of the judge at once.
 *
 * ── WHAT IT MUST SURVIVE TO BE BELIEVED ──────────────────────────────────────────────────────────
 *
 * **Position bias is the known failure mode of every pairwise LLM judge.** A judge that prefers
 * whichever manuscript is labelled A will score 100% on half the pairs and 0% on the other half, and
 * a single-orientation harness reports that as 50% and calls it noise. So `PairwiseVerdict.winner` is a
 * SIDE rather than a manuscript — the caller must map it back — and `foldOrientations` only returns a
 * verdict when both orientations name the same book. A pair whose orientations disagree is
 * `inconsistent`, reported as its own rate and never averaged away.
 *
 * The other rule this file is built on comes from 0b.0's method note: **n=3 lied.** At n=3 the current
 * judge looked like it separated the 86 from the 81 (+3.7 against a spread of 3, "SEPARATES"); at n=8
 * the same judge on the same two files gave +1.1 against a spread of 7. Nothing here reports an
 * agreement rate without the count it was computed from.
 *
 * ── WHAT IT IS NOT ───────────────────────────────────────────────────────────────────────────────
 *
 * Not a replacement for `scoreStory`. A ranking cannot produce a headline mark, and PLAN-TO-90 0.4
 * already decided the internal number is a health signal. This is the instrument for the only question
 * the project actually needs answered between paid reads: **did that change help?**
 */

import { stripFences } from "./llm-judge.js";
import type { ChatArgs, ChatFn } from "./llm-judge.js";
import { CATEGORIES, type Category } from "./types.js";

/** Which side of the prompt a manuscript was shown on. The whole harness turns on this. */
export type Side = "A" | "B";

export interface PairwiseSubject {
  /** Stable identifier — a bundleId from the external-read ledger, or a story path. */
  id: string;
  /** The finished manuscript, as prose. */
  text: string;
}

export interface PairwiseRequest {
  systemPrompt: string;
  userMessage: string;
}

export interface PairwiseVerdict {
  /** Which SIDE the judge preferred — not which manuscript. The caller maps it back. */
  winner: Side;
  /** The judge's own confidence, 1 (a coin toss) to 5 (no contest). Reported, never used as a weight. */
  confidence: number;
  /** One sentence per category the judge says decided it. Empty is allowed; invented is not. */
  reasons: string[];
  /** Per-category winners, where the judge offered them. Sparse by design. */
  categoryWinners: Partial<Record<Category, Side>>;
  /** Raw content, kept for the transcript when a verdict looks wrong. */
  raw?: string;
}

export interface PairwiseJudgeOptions {
  model?: string;
  /** Low, like the rubric judge: a ranking must be reproducible before it can be calibrated. */
  temperature?: number;
  maxTokens?: number;
}

export type PairwiseJudge = (req: PairwiseRequest) => Promise<PairwiseVerdict>;

/**
 * The instruction. Deliberately short.
 *
 * It names the ten rubric categories so the verdict is commensurable with everything else this project
 * measures, and then gets out of the way — the failure mode of the cardinal prompt is that it asks the
 * model to hold a numeric standard in its head, and repeating that here would import the same problem
 * in a new shape.
 *
 * "You may not call it a tie" is doing real work. A judge permitted to abstain abstains on exactly the
 * close pairs the project needs ranked, and an abstention rate is not a gauge. Confidence carries the
 * uncertainty instead.
 */
export function buildPairwiseSystemPrompt(): string {
  return [
    "You are an experienced reader of Golden Age detective fiction, comparing two complete manuscripts.",
    "",
    "Read both. Decide which is the BETTER MYSTERY, judged as a reader would: the quality of the premise,",
    "the opening, the plot's construction, the clarity of its people, the dialogue, the atmosphere, the",
    "fairness and force of its clues, the pacing, the reveal, and the prose.",
    "",
    "Rules:",
    "- Judge the books, not their length, formatting, or chapter count.",
    "- You MUST choose one. A tie is not a permitted answer; if they are close, say so with a low confidence.",
    "- Ignore which one was shown first. The order is arbitrary.",
    "- Give your reasons as concrete differences between the two texts, not general praise.",
    "",
    "Return ONLY JSON:",
    "{",
    '  "winner": "A" | "B",',
    '  "confidence": 1-5,',
    '  "reasons": ["one concrete difference", "..."],',
    '  "category_winners": { "premise": "A" | "B", "pacing": "A" | "B", ... }',
    "}",
    "",
    `Valid category keys: ${CATEGORIES.join(", ")}. Include only the categories that actually differ.`,
  ].join("\n");
}

/**
 * Lay the two manuscripts out for comparison.
 *
 * `maxCharsEach` exists because two full manuscripts are ~30K tokens together and the pair count grows
 * quadratically — 34 ledger manuscripts are 561 pairs. Truncation is a real risk to validity (a judge
 * that never sees the ending cannot judge the ending), so it is OFF by default and, when a caller opts
 * in, the prompt SAYS the text was cut. A judge silently reading half a book is the sort of thing this
 * project has shipped before.
 */
export function buildPairwiseUserMessage(
  a: PairwiseSubject,
  b: PairwiseSubject,
  opts: { maxCharsEach?: number } = {},
): string {
  const cut = (text: string): { body: string; truncated: boolean } => {
    const limit = opts.maxCharsEach;
    if (!limit || text.length <= limit) return { body: text, truncated: false };
    return { body: text.slice(0, limit), truncated: true };
  };
  const ca = cut(a.text);
  const cb = cut(b.text);
  const note = (t: { truncated: boolean }) => (t.truncated ? " [TRUNCATED — the ending is not shown]" : "");
  return [
    `=== MANUSCRIPT A${note(ca)} ===`,
    ca.body,
    "",
    `=== MANUSCRIPT B${note(cb)} ===`,
    cb.body,
    "",
    "Which is the better mystery? Return only the JSON object.",
  ].join("\n");
}

/** Map whatever the model wrote into `A` / `B`, or undefined. Never guesses. */
function asSide(raw: unknown): Side | undefined {
  const s = String(raw ?? "").trim().toUpperCase();
  if (s === "A" || s.startsWith("MANUSCRIPT A")) return "A";
  if (s === "B" || s.startsWith("MANUSCRIPT B")) return "B";
  return undefined;
}

export function parsePairwiseVerdict(content: string): PairwiseVerdict {
  const parsed = JSON.parse(stripFences(content)) as Record<string, unknown>;
  const winner = asSide(parsed.winner);
  if (!winner) {
    // A verdict with no winner is not a tie — it is an unusable response, and calling it a tie would
    // quietly bias every aggregate toward "cannot separate", which is the hypothesis under test.
    throw new Error(`pairwise verdict has no usable winner (got ${JSON.stringify(parsed.winner)})`);
  }
  const rawConfidence = Number(parsed.confidence);
  const confidence = Number.isFinite(rawConfidence) ? Math.min(5, Math.max(1, Math.round(rawConfidence))) : 3;

  const categoryWinners: Partial<Record<Category, Side>> = {};
  const rawCats = parsed.category_winners;
  if (rawCats && typeof rawCats === "object") {
    for (const [key, value] of Object.entries(rawCats as Record<string, unknown>)) {
      const cat = CATEGORIES.find((c) => c === key.toLowerCase().replace(/[^a-z]+/g, "_"));
      const side = asSide(value);
      if (cat && side) categoryWinners[cat] = side;
    }
  }

  return {
    winner,
    confidence,
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons.filter((r): r is string => typeof r === "string") : [],
    categoryWinners,
    raw: content,
  };
}

/** Wrap any chat function into a pairwise judge. Provider-agnostic, exactly like `createLLMRubricJudge`. */
export function createLLMPairwiseJudge(chat: ChatFn, opts: PairwiseJudgeOptions = {}): PairwiseJudge {
  return async (req: PairwiseRequest): Promise<PairwiseVerdict> => {
    const args: ChatArgs = {
      model: opts.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        { role: "user", content: req.userMessage },
      ],
      temperature: opts.temperature ?? 0.2,
      maxTokens: opts.maxTokens ?? 1200,
      jsonMode: true,
    };
    const res = await chat(args);
    return parsePairwiseVerdict(res.content);
  };
}

// ============================================================================
// Aggregation — what a set of verdicts is allowed to claim
// ============================================================================

export interface PairOutcome {
  /** The two manuscripts, in ledger order. */
  first: string;
  second: string;
  /** The manuscript each orientation preferred, by id. */
  pickedWhenFirstIsA?: string;
  pickedWhenFirstIsB?: string;
}

export interface PairJudgement {
  first: string;
  second: string;
  /** The id both orientations agreed on, or undefined when they disagreed or a call failed. */
  consistentPick?: string;
  /** True when this pair produced no usable verdict — whether it flipped or a call failed. */
  inconsistent: boolean;
  /**
   * True when an orientation never returned — an API error, a content filter, a malformed verdict.
   *
   * FOUND IN THE FIRST REAL RUN, 2026-08-23. A pair whose call failed was folded in as `inconsistent`
   * and printed as `FLIP`, so an Azure content-filter rejection was being reported as POSITION BIAS.
   * That is this harness doing the exact thing it was built to prevent: turning "no data" into a
   * finding about the judge. Failures are now their own bucket and are excluded from the consistency
   * denominator, because a call that did not happen says nothing about whether the judge is consistent.
   *
   * (The filter rejection is worth its own note: a pairwise prompt carries TWO murder mysteries, so it
   * doubles the violent content per call. `violence: medium, filtered: true` on one of the first 40
   * pairs. Cardinal judging never hit this because it only ever showed one book.)
   */
  failed: boolean;
}

/**
 * Fold a pair's two orientations into one judgement.
 *
 * A verdict is only a verdict when the judge names the same MANUSCRIPT with the labels swapped.
 * Otherwise the judge preferred a POSITION, and that is the thing this harness exists to catch.
 */
export function foldOrientations(outcome: PairOutcome): PairJudgement {
  const { pickedWhenFirstIsA, pickedWhenFirstIsB } = outcome;
  if (!pickedWhenFirstIsA || !pickedWhenFirstIsB) {
    // No data, NOT a disagreement. See `PairJudgement.failed`.
    return { first: outcome.first, second: outcome.second, inconsistent: true, failed: true };
  }
  const agreed = pickedWhenFirstIsA === pickedWhenFirstIsB;
  return {
    first: outcome.first,
    second: outcome.second,
    consistentPick: agreed ? pickedWhenFirstIsA : undefined,
    inconsistent: !agreed,
    failed: false,
  };
}

/**
 * NAMED `Pairwise…` ON PURPOSE: `./calibration.ts` already exports a `CalibrationSummary` for the
 * cardinal judge's external-rescore deltas. Two different summaries under one name in one package is
 * the two-body problem this repo keeps paying for; the compiler caught this one on the first build.
 */
export interface PairwiseCalibrationSummary {
  /** Pairs where both orientations agreed. */
  consistent: number;
  /** Pairs where the judge preferred a position rather than a book. Failures are NOT counted here. */
  inconsistent: number;
  /** Pairs where a call never returned (API error, content filter, unparseable verdict). */
  failed: number;
  /** Of the consistent pairs, how many matched the human ordering. */
  correct: number;
  /** Consistent pairs that had a human ordering to match at all. */
  scored: number;
  /** `correct / scored`, or null when nothing was scorable — never a silent 0. */
  agreement: number | null;
  consistencyRate: number | null;
}

/**
 * Score a set of folded judgements against the human marks.
 *
 * `minGap` exists because a 1-mark difference between two external reads is inside the reader's own
 * noise; asking the judge to reproduce it measures nothing. Pairs below the gap are excluded from
 * `scored` rather than counted as failures.
 */
export function summarisePairs(
  judgements: ReadonlyArray<PairJudgement>,
  externalMarks: Readonly<Record<string, number>>,
  minGap = 5,
): PairwiseCalibrationSummary {
  let consistent = 0;
  let inconsistent = 0;
  let failed = 0;
  let correct = 0;
  let scored = 0;

  for (const j of judgements) {
    if (j.failed) {
      failed += 1;
      continue;
    }
    if (j.inconsistent || !j.consistentPick) {
      inconsistent += 1;
      continue;
    }
    consistent += 1;
    const a = externalMarks[j.first];
    const b = externalMarks[j.second];
    if (a == null || b == null || Math.abs(a - b) < minGap) continue;
    scored += 1;
    const humanPick = a > b ? j.first : j.second;
    if (humanPick === j.consistentPick) correct += 1;
  }

  // Failures are excluded from the denominator: a call that did not happen is not evidence that the
  // judge preferred a position.
  const total = consistent + inconsistent;
  return {
    consistent,
    inconsistent,
    failed,
    correct,
    scored,
    agreement: scored > 0 ? correct / scored : null,
    consistencyRate: total > 0 ? consistent / total : null,
  };
}
