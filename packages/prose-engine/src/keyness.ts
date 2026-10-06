/**
 * A_110 M8 (Part III §25.2, PROSE_V2_KEYNESS_FINDING) — KEYNESS-RANKED REPETITION, WITH NO WORD LIST.
 *
 * MEASURED: our books' house phrases ("gaze lingering on the", "hung in the air", "broken only by the") recur across
 * cases at many times the canon's rate, 85 of them absent from 12.4M words of canon (WP-006 §4.2), and 88 of the top 100
 * appear in no prompt — they are the writer's own. A banned list attacks one surface form of a template the model
 * refills (Shaib et al., EMNLP 2024). So the editor is handed the book's OWN worst phrases, ranked by Dunning's G²
 * against the canon (Log Ratio as the effect size, Hardie 2014), each a rephrasing of a later use, the first kept.
 *
 * The reference (data/keyness-reference.json, scripts/build-keyness-reference.mjs) holds only candidate phrases with
 * their canon counts. A phrase it does not hold is UNKNOWN and never ranked (WP-006 K4) — not "never in the canon".
 */

export interface KeynessReference {
  canonFourGrams: number;
  /** Candidate phrase → its count in the canon. */
  phrases: Record<string, number>;
}

export interface HousePhrase {
  phrase: string;
  inBook: number;
  inCanon: number;
  g2: number;
  /** log2 of the book's rate over the canon's (canon count smoothed by 0.5). */
  logRatio: number;
}

const tokens = (text: string): string[] => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

/** Dunning's log-likelihood for a count `a` of `n1` against `b` of `n2`. */
export const dunningG2 = (a: number, n1: number, b: number, n2: number): number => {
  const e1 = (n1 * (a + b)) / (n1 + n2);
  const e2 = (n2 * (a + b)) / (n1 + n2);
  const term = (o: number, e: number): number => (o > 0 && e > 0 ? o * Math.log(o / e) : 0);
  return 2 * (term(a, e1) + term(b, e2));
};

/** The book's repeated phrases the canon uses far less, most over-represented first. */
export const rankHousePhrases = (
  text: string,
  reference: KeynessReference,
  opts: { minInBook?: number; minLogRatio?: number; max?: number; exclude?: (phrase: string) => boolean } = {},
): HousePhrase[] => {
  const minInBook = opts.minInBook ?? 3;
  const minLogRatio = opts.minLogRatio ?? 3;
  const toks = tokens(text);
  const n1 = Math.max(1, toks.length - 3);
  const counts = new Map<string, number>();
  for (let i = 0; i + 4 <= toks.length; i++) {
    const g = toks.slice(i, i + 4).join(" ");
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  const out: HousePhrase[] = [];
  for (const [phrase, a] of counts) {
    if (a < minInBook) continue;
    const b = reference.phrases[phrase];
    if (b === undefined) continue; // unknown to the reference: never ranked
    if (opts.exclude?.(phrase)) continue;
    const logRatio = Math.log2(a / n1 / ((b + 0.5) / reference.canonFourGrams));
    if (logRatio < minLogRatio) continue;
    out.push({ phrase, inBook: a, inCanon: b, g2: dunningG2(a, n1, b, reference.canonFourGrams), logRatio });
  }
  // Overlapping windows of one longer phrase rank together; keep the strongest of any pair that shares three words.
  const ranked = out.sort((x, y) => y.g2 - x.g2);
  const kept: HousePhrase[] = [];
  for (const p of ranked) {
    const w = p.phrase.split(" ");
    const overlaps = kept.some((k) => {
      const kw = k.phrase.split(" ");
      return kw.slice(1).join(" ") === w.slice(0, 3).join(" ") || w.slice(1).join(" ") === kw.slice(0, 3).join(" ");
    });
    if (!overlaps) kept.push(p);
    if (kept.length >= (opts.max ?? 8)) break;
  }
  return kept;
};
