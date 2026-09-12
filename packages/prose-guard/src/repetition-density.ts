/**
 * A_89 C2 — REPEATED-SPAN DENSITY: how much of the book is the book saying again.
 *
 * `machine-register.ts` is the only validated predictor this project has (−0.697 against the
 * headline over 36 non-truncated reads) and it measures the REGISTER of a sentence. It does not
 * measure repetition, and repetition is what the reader of run 88651 was describing when he listed
 * eight lines as *"generator scaffolding rather than finished prose"* — none of which exists in our
 * source. They are the model's own words, repeated: *"would not be ignored"* ×7, *"One must consider
 * the alternatives, surely?"* ×3.
 *
 * MEASURED across 212 archived manuscripts, counting six-word spans that occur three or more times
 * INSIDE ONE BOOK, per 10,000 words:
 *
 *   corpus median   17.3
 *   run 88651      118.8   — 25th worst of 212, and marked `prose` 6/10
 *   worst          562.4
 *   best             0.0
 *
 * The repeated spans in that book ARE the evidence list — *"the murder window she recalled could not
 * exceed"* ×6, *"the choreography alignment and the music restart"* ×6 — which is why A_89 B1 treats
 * the instructed re-mandate as the cause and this as the symptom worth watching.
 *
 * Telemetry only. Nothing gates on it: the point is that a book at seven times the corpus median
 * should be visible BEFORE £1.27 and a reader's afternoon are spent finding out, not after.
 */

export interface RepetitionDensity {
  /** Distinct spans that repeat at least `minRepeats` times. */
  repeatedSpans: number;
  /** Those spans, per 10,000 words — the comparable figure. */
  per10k: number;
  words: number;
  /** The worst offenders, most-repeated first, for the run report. */
  worst: Array<{ span: string; count: number }>;
}

/** Corpus median over 212 archived manuscripts, for interpreting a single run's number. */
export const REPETITION_CORPUS_MEDIAN_PER_10K = 17.3;

/** A book this far above the median is worth looking at before it is read. */
export const REPETITION_ATTENTION_MULTIPLE = 3;

const normalise = (text: string): string[] =>
  String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

/**
 * Count six-word spans repeated within one text. Six is deliberate: shorter spans catch ordinary
 * English collocation, and the voice-fragment work (X43) established that 7+ word spans are the
 * copying mechanism, so six sits just under that and still reads as "the same sentence again".
 */
export const repetitionDensity = (
  text: string,
  spanWords = 6,
  minRepeats = 3,
): RepetitionDensity => {
  const words = normalise(text);
  if (words.length < spanWords) {
    return { repeatedSpans: 0, per10k: 0, words: words.length, worst: [] };
  }
  const counts = new Map<string, number>();
  for (let i = 0; i + spanWords <= words.length; i++) {
    const span = words.slice(i, i + spanWords).join(" ");
    counts.set(span, (counts.get(span) ?? 0) + 1);
  }
  const repeated = [...counts.entries()].filter(([, c]) => c >= minRepeats);
  repeated.sort((a, b) => b[1] - a[1]);
  return {
    repeatedSpans: repeated.length,
    per10k: words.length > 0 ? (10000 * repeated.length) / words.length : 0,
    words: words.length,
    worst: repeated.slice(0, 5).map(([span, count]) => ({ span, count })),
  };
};

/** One line for the run report, with the corpus median so the number means something. */
export const summariseRepetitionDensity = (density: RepetitionDensity): string => {
  const rate = density.per10k.toFixed(1);
  const multiple = REPETITION_CORPUS_MEDIAN_PER_10K > 0
    ? density.per10k / REPETITION_CORPUS_MEDIAN_PER_10K
    : 0;
  const head =
    `${density.repeatedSpans} repeated 6-word span(s) over ${density.words} words — ` +
    `${rate} per 10k against a corpus median of ${REPETITION_CORPUS_MEDIAN_PER_10K}`;
  if (multiple < REPETITION_ATTENTION_MULTIPLE) return `${head}. Normal.`;
  const worst = density.worst.map((w) => `"${w.span}" x${w.count}`).join("; ");
  return `${head} (${multiple.toFixed(1)}x the median) — WORTH A LOOK BEFORE READING. Worst: ${worst}`;
};
