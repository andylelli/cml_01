/**
 * WIT DENSITY — a deterministic instrument for the one quality this project could not measure.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * Repetition is measured (`repetition-density.ts`, corpus median 17.3 per 10k). Machine register is
 * measured, and is the only validated predictor of the external score (-0.697). Humour was measured
 * by NOTHING — five layers generate it across three agents, and whether any of it arrived could only
 * be settled by a person reading the book. The closest proxy previously tried, counting
 * understatement words like "somewhat" and "hardly", returned 0 to 5 per book and could not separate
 * a witty book from a flat one.
 *
 * ── WHAT IS MEASURED, AND WHAT IS NOT ────────────────────────────────────────────────────────────
 *
 * This does NOT detect whether a line is funny. It counts four SHAPES that wit takes in this genre,
 * each of which is a structural fact about the text rather than a judgement about it. A book can
 * score well and not be funny. But a book cannot be funny in the Golden Age manner while scoring
 * near zero, because these are the moves that manner is made of.
 *
 *   1. THE SHORT RETORT      a speech of <=6 words immediately after one of >=15. The deflation move.
 *   2. THE FLAT ANSWER       a question answered in <=4 words. Refusal to expand is the joke.
 *   3. UNDERSTATEMENT        a diminisher and a grave word in one sentence — "rather inconvenient,
 *                            the stabbing". This is understatement's actual mechanism, not its vocabulary.
 *   4. POLITE SAVAGERY       a courtesy marker and a hostile word in one sentence — civility carrying
 *                            an incision.
 *
 * ── CALIBRATION: IT SEPARATES, WHICH IS THE ONLY THING THAT MAKES IT AN INSTRUMENT ───────────────
 *
 * Measured over the **11 real Golden Age novels** in `library/texts/` above 6,000 words (the twelfth,
 * `a_jury_of_her_peers`, is a 2,613-word fragment and is excluded by the same floor applied to our
 * own books) against **20 of our shipped manuscripts**:
 *
 *   shape          canon median   ours median   ratio
 *   retort                 30.6           8.8    3.5x
 *   flat answer            13.3           1.5    8.9x
 *   understatement          1.2           0.0     inf
 *   polite savagery         0.2           0.0     inf
 *   ALL                    41.4          11.4    3.6x
 *
 * The separation is near-total, which is the finding: canon ranges 20.6 to 68.9, ours 1.1 to 44.6,
 * and **18 of our 20 books fall below the LOWEST-scoring real novel**. Only one reaches the canon
 * median.
 *
 * The two strongest discriminators are the two that cost nothing to write: a character answering
 * briefly, and a character answering a question without expanding. Our books explain; the canon
 * lets people be short with each other.
 *
 * ── HOW TO USE IT ────────────────────────────────────────────────────────────────────────────────
 *
 * TELEMETRY, never a gate. CLAUDE.md's B1: a check that fires on most runs is an off switch with
 * extra steps, and this one would fire on 18 of 20. It exists so that a book which is flat in a way
 * nobody can name is visible BEFORE a reader spends an afternoon on it, and so a lever aimed at wit
 * has a number to move.
 */

/** Below this, a text is a fragment and the density is not meaningful. */
export const WIT_MIN_WORDS = 6000;

/** Median of the 11 canon novels above the word floor. */
export const WIT_CANON_MEDIAN_PER_10K = 41.4;

/** The LOWEST-scoring real novel. 18 of our 20 books sit below this line. */
export const WIT_CANON_FLOOR_PER_10K = 20.6;

/** Median of 20 of our shipped manuscripts, for context in the report. */
export const WIT_OURS_MEDIAN_PER_10K = 11.4;

const DIMINISHER =
  /\b(?:somewhat|rather|a little|a trifle|hardly|scarcely|barely|not entirely|not altogether|slightly|mildly|moderately|tolerably|passably|not wholly)\b/i;
const GRAVE =
  // The -ing forms matter: the humour guide's own worked example is "The evening
  // deteriorated somewhat after the STABBING", which the first cut of this list missed.
  /\b(?:dead|death|died|murder|murdered|murdering|killed|killing|corpse|body|blood|poison|poisoning|stabbed|stabbing|shot|shooting|strangled|strangling|drowned|drowning|hanging|disaster|ruin|ruined|catastrophe|tragedy|fatal|hanged|grave|funeral|inquest|post-mortem)\b/i;
const COURTESY =
  /\b(?:i am sure|i'm sure|no doubt|of course|how kind|how very|if you say so|delightful|charming|most obliging|by all means|naturally|to be sure|quite so|indeed)\b/i;
const HOSTILE =
  /\b(?:lie|lied|lying|liar|fool|foolish|stupid|idiot|absurd|ridiculous|nonsense|useless|incompetent|vulgar|tiresome|insufferable|impertinent|disgrace|shameful|worthless|contempt)\b/i;

/** The deflation move: a short speech hard on the heels of a long one. */
const RETORT_MAX_WORDS = 6;
const SETUP_MIN_WORDS = 15;
/** Characters of narration allowed between the two speeches before they stop being an exchange. */
const EXCHANGE_MAX_GAP = 700;
const FLAT_ANSWER_MAX_WORDS = 4;

export interface WitShapeCounts {
  retort: number;
  flatAnswer: number;
  understatement: number;
  politeSavagery: number;
}

export interface WitDensity extends WitShapeCounts {
  words: number;
  total: number;
  /** All four shapes per 10,000 words. */
  per10k: number;
  /** True when the text is long enough for the density to mean anything. */
  measurable: boolean;
}

const countWords = (value: string): number => String(value ?? "").trim().split(/\s+/).filter(Boolean).length;

/** Quoted speeches in order of appearance, with their offset so adjacency can be judged. */
const readSpeeches = (text: string): Array<{ body: string; at: number }> => {
  const out: Array<{ body: string; at: number }> = [];
  const re = /[“"]([^”"]{2,600})[”"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push({ body: m[1]!.trim(), at: m.index });
  return out;
};

export const witDensity = (text: string): WitDensity => {
  const source = String(text ?? "");
  const words = countWords(source);
  const counts: WitShapeCounts = { retort: 0, flatAnswer: 0, understatement: 0, politeSavagery: 0 };

  const speeches = readSpeeches(source);
  for (let i = 1; i < speeches.length; i += 1) {
    const current = speeches[i]!;
    const previous = speeches[i - 1]!;
    if (current.at - previous.at > EXCHANGE_MAX_GAP) continue;
    const length = countWords(current.body);
    if (length <= RETORT_MAX_WORDS && countWords(previous.body) >= SETUP_MIN_WORDS) counts.retort += 1;
    if (length <= FLAT_ANSWER_MAX_WORDS && /\?[”"]?\s*$/.test(previous.body)) counts.flatAnswer += 1;
  }

  for (const sentence of source.split(/(?<=[.!?])\s+/)) {
    if (DIMINISHER.test(sentence) && GRAVE.test(sentence)) counts.understatement += 1;
    if (COURTESY.test(sentence) && HOSTILE.test(sentence)) counts.politeSavagery += 1;
  }

  const total = counts.retort + counts.flatAnswer + counts.understatement + counts.politeSavagery;
  return {
    ...counts,
    words,
    total,
    per10k: words > 0 ? +((10000 * total) / words).toFixed(1) : 0,
    measurable: words >= WIT_MIN_WORDS,
  };
};

/**
 * What the story ASKED FOR, when a humour band was set. Passed in rather than imported so that
 * prose-guard stays free of any dependency on the prompt packages: the band lives in
 * `@cml/prompts-llm/humour-level`, and the worker hands its two numbers across.
 */
export interface WitTarget {
  level: string;
  per10k: number;
}

/**
 * One line for the run report. Carries the canon median AND the canon floor, because "below every
 * real novel we hold" is a more useful sentence than a ratio.
 *
 * With a `target`, it also reports the band the run ASKED for beside what arrived — the only way to
 * tell a book that is flat from a book that was ordered flat.
 */
export const summariseWitDensity = (density: WitDensity, target?: WitTarget): string => {
  if (!density.measurable) {
    return `${density.total} wit shape(s) over ${density.words} words — too short to measure (floor ${WIT_MIN_WORDS}).`;
  }
  const shapes =
    `retort ${density.retort}, flat answer ${density.flatAnswer}, ` +
    `understatement ${density.understatement}, polite savagery ${density.politeSavagery}`;
  const standing =
    density.per10k >= WIT_CANON_MEDIAN_PER_10K
      ? "at or above the canon median"
      : density.per10k >= WIT_CANON_FLOOR_PER_10K
        ? "within the canon range, below its median"
        : `BELOW the lowest-scoring real novel (${WIT_CANON_FLOOR_PER_10K})`;
  // A band of 0 is a legitimate target (`none`), so test for presence, not truthiness.
  const asked = target
    ? ` Asked for ${target.level} (target ${target.per10k} per 10k) — ` +
      `${density.per10k >= target.per10k ? "MET" : `short by ${+(target.per10k - density.per10k).toFixed(1)}`}.`
    : "";
  return (
    `${density.total} wit shape(s) over ${density.words} words — ${density.per10k} per 10k ` +
    `against a canon median of ${WIT_CANON_MEDIAN_PER_10K} and our own median of ${WIT_OURS_MEDIAN_PER_10K}: ` +
    `${standing}.${asked} [${shapes}] — MEASURE only.`
  );
};
