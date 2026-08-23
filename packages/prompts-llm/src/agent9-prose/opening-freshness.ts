/**
 * A_72 **A2a** — tell the writer which images this pipeline has already used up.
 *
 * ── WHAT THIS IS AIMED AT ────────────────────────────────────────────────────────────────────────
 *
 * `opening_hook` has never been given a 9 in 35 external reads, and all seventeen of its 8s are the
 * same sentence: an inventory of props followed by a compliment.
 *
 *     "Body, clock contradiction, weapon, logbook, foggy hotel — strong hook."
 *     "Body at tide line, harbormaster time, pipe, blood, scrape marks — very good."
 *
 * [X94](../../../../architecture/REVIEW_05.md) already settled that the SHAPE of sentence one is not
 * the lever: per-story style rotation produced the first non-`character-action` opening in the
 * project's history and the mark did not move. What has never varied is what the opening is MADE OF —
 * measured across 184 archived manuscripts, `scent` opens 76% of them, `faint` 72%, `pressed` 63%,
 * `sprawled` 54%, `gloved` 39%.
 *
 * ── THIS IS HALF OF A2, AND THE HALF THAT COSTS NOTHING ──────────────────────────────────────────
 *
 * A_72 §10.1 specifies the full engine as Agent 3b's shape: five candidate opening SITUATIONS, judged,
 * and the winner committed. That is a new agent and a new failure surface. This is the other
 * ingredient of the same idea — the `divergeFrom` list — applied directly at the point of writing, for
 * no extra call. **It is not a substitute for the ideation step and does not claim to be.**
 *
 * ── THE TWO SUBTRACTIONS, AND WHY WITHOUT THEM THIS WOULD DO HARM ────────────────────────────────
 *
 * The measured list cannot be handed to the writer as-is.
 *
 * **1. The grounding vocabulary is REQUIRED by a validator.** `scent`, `damp`, `chill`, `cold`,
 * `rain`, `silence`, `morning`, `pale` and `light` are all overused AND all members of
 * `OPENING_SENSORY_MARKERS` / `OPENING_ATMOSPHERE_MARKERS`, which
 * [X95](../../../../architecture/REVIEW_05.md) requires in the first two paragraphs on pain of retry.
 * Telling the writer to avoid them would put two instructions in the same prompt in direct
 * contradiction, and the retry-driving one would win. They are subtracted.
 *
 * **2. The story's own furniture is not a cliché.** `hotel`, `room`, `clock`, `windows` and `floor`
 * are frequent because the runs share a setting and a murder device. A story set in a seaside hotel
 * cannot avoid the word *hotel*, and a clock-tampering mystery cannot avoid *clock*. Any word that
 * appears in this run's own location, title or device is subtracted too.
 *
 * What survives both subtractions is the house VOICE rather than the house furniture — `faint`,
 * `pressed`, `sprawled`, `hush`, `gloved`, `tang`, `polished`, `distant` — which is exactly the layer
 * the reader is describing when every note reads the same.
 */

import {
  OPENING_CORPUS_MANUSCRIPTS,
  OVERUSED_OPENING_COUNTS,
} from "../constants/opening-corpus.js";

export interface OpeningFreshnessInput {
  /** Words the grounding validator REQUIRES. Never asked to be avoided. */
  requiredGroundingWords: readonly string[];
  /** This story's own nouns — location names, title, device terms. Never asked to be avoided. */
  storyOwnWords: readonly string[];
  /** How many to name. A list too long reads as noise and gets skimmed. */
  limit?: number;
}

const tokenise = (values: readonly string[]): Set<string> => {
  const out = new Set<string>();
  for (const v of values) {
    for (const w of String(v ?? "").toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? []) out.add(w);
  }
  return out;
};

/**
 * The words this run may honestly be asked to avoid, with their measured frequency.
 * Returns [] when the subtractions leave nothing — in which case the caller emits no block at all.
 */
export function overusedOpeningWordsFor(input: OpeningFreshnessInput): Array<{ word: string; share: number }> {
  const exempt = new Set([...tokenise(input.requiredGroundingWords), ...tokenise(input.storyOwnWords)]);
  return OVERUSED_OPENING_COUNTS.filter((e) => !exempt.has(e.word))
    .slice(0, input.limit ?? 12)
    .map((e) => ({ word: e.word, share: e.share }));
}

/**
 * The prompt block. Empty string when there is nothing honest to say, so a caller can concatenate it
 * unconditionally.
 *
 * The wording asks for a DIFFERENT IMAGE rather than a synonym. A "don't say X" instruction on its own
 * produces a thesaurus reach — that is exactly how X95's closed vocabulary produced *"certified wave
 * crest hour"* — so the instruction names what to do instead: choose the detail this case gives you
 * that no other case could.
 */
export function buildOpeningFreshnessBlock(input: OpeningFreshnessInput): string {
  const words = overusedOpeningWordsFor(input);
  if (words.length === 0) return "";
  const list = words.map((w) => `${w.word} (${Math.round(w.share * 100)}%)`).join(", ");
  return (
    `\n\nOPENING FRESHNESS (chapter 1 only — measured, not stylistic preference): ` +
    `Across ${OPENING_CORPUS_MANUSCRIPTS} previously generated openings, these words recur at the share shown: ${list}. ` +
    `They are this generator's habits, not this story's choices, and a reader who has seen them before reads the opening as competent and forgettable. ` +
    `Do NOT reach for a synonym — a rarer word for the same image is the same image. ` +
    `Open on a concrete detail that only THIS case could produce: something the murder method, the specific room, or one character's particular habit puts in front of the detective. ` +
    `The required sensory and atmosphere grounding still applies and is unaffected by this instruction.`
  );
}
