/**
 * A_75 §6.1 (P1) — a per-story VOICE SPEC, and the deterministic instrument that says whether the
 * book kept it.
 *
 * ── WHY THIS SHAPE, AND NOT A PROMPT THAT ASKS FOR BETTER PROSE ──────────────────────────────────
 *
 * A_72 §2.1 measured why `premise` earns 9s and nothing else does: Agent 3b generates five candidates
 * under an explicit `divergeFrom`, a judge picks one, and the winner is COMMITTED as a constraint
 * every downstream agent honours. One design-tier call. `premise` holds 7 of the 14 nines ever
 * awarded; no other category has an engine and no other category is routinely praised.
 *
 * A_75 §3 found the same absence at sentence level. Across the 15 recent manuscripts, mean sentence
 * length, within-book variance, short-sentence share and dialogue density show NO signal against the
 * human mark, and BETWEEN-book variation in mean sentence length is **10% of WITHIN-book variation**
 * — fifteen books drawn from one distribution of sentences. A reader awards a 9 for prose when a
 * sentence does something; ours are uniformly competent and uniformly 14.65 words, so the reader,
 * having nothing to praise, correctly reports the only thing that varies: how many artifacts they
 * tripped over.
 *
 * ── THE PART THAT MATTERS: THIS IS CHECKABLE ─────────────────────────────────────────────────────
 *
 * *"Write better prose"* is uncheckable, which is why every previous attempt at this category became
 * a detector instead. A `VoiceSpec` is arithmetic. A chapter written to 11±5 and a chapter written to
 * 19±9 are distinguishable by a script with no model in the loop:
 *
 *     conformance = 1 - |observed mean - spec.mean| / spec.sd      (clipped to [0,1])
 *
 * That is the first prose instrument in this project that points UPWARD — property B of §6.0. It does
 * NOT measure whether the prose is good. It measures whether the book HAS a voice and KEEPS it, which
 * is a necessary condition for a reader to notice one, and it is falsifiable on its own terms.
 *
 * ── STATED BEFORE BUILDING, SO IT CANNOT BE MOVED AFTERWARDS ─────────────────────────────────────
 *
 * **If conformance is measured at >= 0.8 and `prose` does not move off 6-7 across two external reads,
 * the hypothesis is dead.** The register is then not what the reader is responding to, and A_72's
 * Tier 4 — the generation model itself — reopens with its first real evidence rather than as an
 * assumption. This is the only item on the A_75 board that can produce that evidence cleanly, because
 * it is the only one whose DELIVERY is independently measurable: a spec that never reached the prose
 * and a spec that reached it and did not help are different outcomes, and conformance tells them
 * apart.
 */

/** The four dictions, and they are deliberately few — a spec nobody can hold is not a constraint. */
export type VoiceDiction = "plain-anglo" | "latinate-formal" | "mixed-period" | "clipped-reportorial";

export type VoiceDistance = "close-third-interior" | "cool-observer" | "wry-companion";

export interface VoiceSpec {
  /**
   * The arithmetic half. `mean` is words per sentence; `sd` is the within-book spread the book should
   * actually exhibit — a book at 19±3 reads as monotonous even though its mean is distinctive, so the
   * spread is part of the voice and not a tolerance.
   */
  sentenceLength: { mean: number; sd: number };
  /** One syntactic habit, in the writer's vocabulary: "fragments at moments of shock". */
  syntacticHabit: string;
  diction: VoiceDiction;
  narrationDistance: VoiceDistance;
  /** One recurring device: "the detective notices what is ABSENT before what is present". */
  signatureMove: string;
  /** This story's own banned tics — not the global banned-phrase list, which applies anyway. */
  avoid: string[];
}

/** What a prior story committed to, reduced to what a divergence instruction needs. */
export interface VoiceSpecSummary {
  story: string;
  mean: number;
  diction: VoiceDiction;
  narrationDistance: VoiceDistance;
  signatureMove: string;
}

/**
 * The range a spec's mean may occupy. The floor is not a style preference: below ~9 words the prose
 * stops being able to carry a subordinate clause, and Golden Age narration needs them. The ceiling is
 * where the corpus stops — the longest-voiced manuscript this pipeline has produced sits at 21.9.
 */
export const VOICE_MEAN_MIN = 9;
export const VOICE_MEAN_MAX = 22;
/**
 * The minimum gap from every recent story's mean. 2.0 words is roughly two within-book standard
 * errors on a 1,000-sentence book, so a spec that clears it produces a book measurably unlike its
 * predecessors rather than one that merely claims to be.
 */
export const VOICE_MEAN_MIN_GAP = 2.0;

export interface VoiceSpecValidation {
  ok: boolean;
  problems: string[];
}

/**
 * Reject a spec BEFORE it reaches ten chapters of prompts. Every check here is a failure mode that
 * would otherwise show up as an unexplained conformance number: an out-of-range mean the model cannot
 * hit, a zero `sd` that makes conformance a step function, or a mean indistinguishable from the last
 * book's — which would deliver a "distinct voice" that is the same voice.
 */
export const validateVoiceSpec = (
  spec: VoiceSpec | null | undefined,
  recent: ReadonlyArray<VoiceSpecSummary> = [],
): VoiceSpecValidation => {
  const problems: string[] = [];
  if (!spec) return { ok: false, problems: ["no spec"] };

  const mean = Number(spec.sentenceLength?.mean);
  const sd = Number(spec.sentenceLength?.sd);
  if (!Number.isFinite(mean) || mean < VOICE_MEAN_MIN || mean > VOICE_MEAN_MAX) {
    problems.push(`sentenceLength.mean ${spec.sentenceLength?.mean} outside [${VOICE_MEAN_MIN}, ${VOICE_MEAN_MAX}]`);
  }
  // A zero or tiny sd turns conformance into a step function: every chapter reads 0 or 1 and the
  // metric stops carrying information. It is also not a voice — it is a metronome.
  if (!Number.isFinite(sd) || sd < 3 || sd > 12) {
    problems.push(`sentenceLength.sd ${spec.sentenceLength?.sd} outside [3, 12] — a voice has spread`);
  }
  if (!spec.syntacticHabit?.trim()) problems.push("syntacticHabit is empty");
  if (!spec.signatureMove?.trim()) problems.push("signatureMove is empty");

  const nearest = recent
    .map((r) => ({ story: r.story, gap: Math.abs(r.mean - mean) }))
    .sort((a, b) => a.gap - b.gap)[0];
  if (nearest && nearest.gap < VOICE_MEAN_MIN_GAP) {
    problems.push(
      `mean ${mean.toFixed(1)} is only ${nearest.gap.toFixed(1)} words from ${nearest.story} `
      + `(need >= ${VOICE_MEAN_MIN_GAP}) — this is the uniformity the spec exists to break`,
    );
  }

  return { ok: problems.length === 0, problems };
};

// ── conformance ──────────────────────────────────────────────────────────────

export interface VoiceConformance {
  /** 1.0 = the chapter's mean sits exactly on the spec; 0 = a full `sd` or more away. */
  score: number;
  observedMean: number;
  observedSd: number;
  sentences: number;
  /** Signed, in words — so a miss says WHICH WAY the chapter drifted, not just how far. */
  drift: number;
}

const sentenceWordCounts = (prose: string): number[] =>
  String(prose ?? "")
    .replace(/^\s*#.*$/gm, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    // Three words is the shortest thing that is a sentence; past 120 it is a parse failure, not prose.
    .filter((n) => n >= 3 && n <= 120);

const meanOf = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const sdOf = (xs: number[]): number => {
  if (xs.length < 2) return 0;
  const m = meanOf(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
};

/**
 * How closely one chapter (or a whole book) sits on its spec.
 *
 * Deliberately a DISTANCE ON THE MEAN and not a composite of all six spec fields. Five of the six are
 * prose judgements — no deterministic check can tell whether a chapter really withheld its verbs —
 * and a composite that mixes one measured number with five guessed ones produces a figure that looks
 * rigorous and is not. This measures the one thing that can be measured, and says so.
 */
export const voiceConformance = (prose: string, spec: VoiceSpec): VoiceConformance => {
  const lengths = sentenceWordCounts(prose);
  const observedMean = meanOf(lengths);
  const observedSd = sdOf(lengths);
  const target = Number(spec?.sentenceLength?.mean);
  const sd = Number(spec?.sentenceLength?.sd);
  if (!lengths.length || !Number.isFinite(target) || !Number.isFinite(sd) || sd <= 0) {
    return { score: 0, observedMean, observedSd, sentences: lengths.length, drift: 0 };
  }
  const drift = observedMean - target;
  const score = Math.max(0, Math.min(1, 1 - Math.abs(drift) / sd));
  return { score, observedMean, observedSd, sentences: lengths.length, drift };
};

/** The threshold §6.1's falsification is stated against. Below this, the spec did not reach the prose. */
export const VOICE_CONFORMANCE_DELIVERED = 0.8;

/**
 * Book-level delivery: the mean conformance across chapters, plus how many chapters actually held it.
 * Reported together on purpose — a book of five chapters at 1.0 and five at 0.2 averages the same as
 * a book of ten at 0.6, and those are different failures. The first is a spec the model can hit and
 * sometimes forgets; the second is a spec it never held at all.
 */
export const bookVoiceConformance = (
  chapters: ReadonlyArray<string>,
  spec: VoiceSpec,
): { mean: number; chaptersDelivered: number; chapters: VoiceConformance[] } => {
  const per = chapters.map((c) => voiceConformance(c, spec));
  const scored = per.filter((p) => p.sentences > 0);
  return {
    mean: scored.length ? meanOf(scored.map((p) => p.score)) : 0,
    chaptersDelivered: scored.filter((p) => p.score >= VOICE_CONFORMANCE_DELIVERED).length,
    chapters: per,
  };
};

/** Measure a manuscript's actual voice — how the `divergeFrom` corpus is built from shipped books. */
export const measureVoice = (prose: string): { mean: number; sd: number; sentences: number } => {
  const lengths = sentenceWordCounts(prose);
  return { mean: meanOf(lengths), sd: sdOf(lengths), sentences: lengths.length };
};
