/**
 * PROSE ENGINE v2 — SEGMENTATION (ANALYSIS_99 §10.5).
 *
 * ── THE UNIT IS THE BOOK ─────────────────────────────────────────────────────────────────────────
 *
 * v1's unit is the chapter, and each chapter is handed the previous ones verbatim in a STORY TO DATE
 * block. A_90 §12 measured the consequence: **16 of 24 copied sentences came from the immediately
 * preceding chapter**, and A_94 found five of six reader-flagged "generated phrases" were the model's
 * own lines said again. The repeat ban (A_94 R5) suppresses 28 of 38 passages and loses to any
 * competing instruction (A_96 B4) — it is a ban on a channel the architecture holds open.
 *
 * v2 writes against the whole outline with the full prior text IN CONTEXT rather than quoted as a
 * thing to continue from. A model that wrote chapter 1 does not re-describe the coat in chapter 4,
 * and does not need to be told not to.
 *
 * ── WHY THE PLAN IS CHOSEN BY ARITHMETIC AND NOT BY TASTE ────────────────────────────────────────
 *
 * MEASURED (15_llm §6.1) over four archived runs: a chapter is ~2,700 output tokens and a short book
 * 21,600-30,100. `gpt-4.1` emits up to 32,768 in one call and v1 caps itself at 20,000
 * (`generate.ts:2847`) — a self-imposed ceiling, like the 24k prompt ceiling A_88 withdrew.
 *
 * So: one call when the book fits inside the writer's cap with room to spare, act-sized segments
 * when it does not, chapter-sized only if a single chapter would not fit. The design's own fallback,
 * in that order, and the run reports which it chose and why.
 */

import type { ContractCore, Segment, SegmentPlan } from "./types.js";

/** Output tokens per word, for English prose. Deliberately generous: an under-estimate truncates. */
export const TOKENS_PER_WORD = 1.45;

/** How much of the writer's output cap a plan may use. The remainder absorbs a long chapter. */
export const CAP_UTILISATION = 0.8;

/** Chapters per segment when the book does not fit in one call. An act, near enough. */
export const CHAPTERS_PER_ACT_SEGMENT = 4;

const estimate = (chapters: number[], core: ContractCore): number => {
  const words = chapters.reduce((sum, chapter) => {
    const scene = core.scenes.find((s) => s.chapter === chapter);
    return sum + (scene?.words.preferred ?? 1_000);
  }, 0);
  return Math.ceil(words * TOKENS_PER_WORD);
};

const chunk = (chapters: number[], size: number): number[][] => {
  const out: number[][] = [];
  for (let i = 0; i < chapters.length; i += size) out.push(chapters.slice(i, i + size));
  return out;
};

/**
 * Choose the writing plan. Pure, and it never returns an empty plan for a non-empty contract: a book
 * that will not fit any segmentation is written a chapter at a time, which is v1's unit and the
 * worst case rather than the default.
 */
export interface SegmentOptions {
  /**
   * Write at most this many chapters per call, whatever the cap would allow.
   *
   * 17-hitting-90 P1.1. MEASURED 2026-09-25: every v2 run to date — 17 of 17 in the prompt log —
   * fitted one call, and every book tapered: 1,244 → 414 words by chapter on seed 23403, with the
   * brief's per-chapter asks decaying alongside (paragraphs opening on speech 16 12 5 4 2 3 1 1 1 0
   * against an ask of six). v1, which writes a chapter a call, does not taper. The worker reads this
   * from `PROSE_V2_SEGMENT_CHAPTERS` at call time; unset, the cap decides as before.
   */
  chaptersPerCall?: number;
}

export const planSegments = (core: ContractCore, maxOutputTokens: number, options: SegmentOptions = {}): SegmentPlan => {
  const chapters = core.scenes.map((s) => s.chapter);
  if (chapters.length === 0) {
    return { kind: "chapters", segments: [], reason: "the contract carries no chapters" };
  }

  const cap = Math.max(1_000, Math.floor(maxOutputTokens * CAP_UTILISATION));
  const whole = estimate(chapters, core);

  const build = (groups: number[][]): Segment[] =>
    groups.map((group, index) => ({ index, chapters: group, estimatedTokens: estimate(group, core) }));

  const forced = options.chaptersPerCall;
  if (Number.isInteger(forced) && (forced as number) >= 1 && (forced as number) < chapters.length) {
    const groups = chunk(chapters, forced as number);
    if (groups.every((group) => estimate(group, core) <= cap)) {
      return {
        kind: forced === 1 ? "chapters" : "acts",
        segments: build(groups),
        reason: `${groups.length} segments of up to ${forced} chapters, asked for (PROSE_V2_SEGMENT_CHAPTERS) — the whole book, ~${whole} output tokens, would have fitted one call of ${cap}`,
      };
    }
    // A forced group that exceeds the cap is not honoured; the ladder below decides, as if unset.
  }

  if (whole <= cap) {
    return {
      kind: "book",
      segments: build([chapters]),
      reason: `the whole book is ~${whole} output tokens, inside ${cap} of the writer's ${maxOutputTokens}`,
    };
  }

  const acts = chunk(chapters, CHAPTERS_PER_ACT_SEGMENT);
  if (acts.every((group) => estimate(group, core) <= cap)) {
    return {
      kind: "acts",
      segments: build(acts),
      reason: `the book is ~${whole} output tokens, past ${cap}: ${acts.length} segments of up to ${CHAPTERS_PER_ACT_SEGMENT} chapters, each with every earlier chapter in context`,
    };
  }

  return {
    kind: "chapters",
    segments: build(chapters.map((c) => [c])),
    reason: `a ${CHAPTERS_PER_ACT_SEGMENT}-chapter segment exceeds ${cap}: one chapter per call, still with every earlier chapter in context`,
  };
};

/** The chapters written before this segment — the text the writer reads, never a summary. */
export const priorChapters = (plan: SegmentPlan, segmentIndex: number): number[] =>
  plan.segments.slice(0, segmentIndex).flatMap((s) => s.chapters);
