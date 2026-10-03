/**
 * ANALYSIS_110 §24 / WP-006 K10 — the shape of the page, measured with no word list, against floors taken from the canon.
 *
 * The owner's fifth need is "a broader lexicon, as there is often repetition", and what he hears as wooden is a page
 * that repeats its own constructions. Three measures need no list and separate our books from the canon (A_110 §24,
 * MEASURED on 162 canon texts on a fixed 60,000-character window): how far the text compresses, how many ways its
 * sentences begin, and whether sentence lengths run in stretches. Two more come from WP-006 §4.1 (vocabulary growth)
 * and A_110 §30.2 (the body-part tail: 0.44% of canon narration sentences, 28.7% of run bcc0d637's).
 *
 * REPORT ONLY. None of these predicts the external reader's mark (A_110 §32.1: no instrument clears the screen bar over
 * 48 reads or 22 casts); they are the owner's instrument. Never a gate, never a rule about which books to read.
 */
import { deflateSync } from "node:zlib";

/** Canon floors and centres, each on the window it was measured on. Regenerate with the A_110 probes. */
export const CANON_PAGE_SHAPE = {
  /** deflate size / raw size of the first 60,000 characters, lower-cased: min over 162 canon texts. */
  compressedRatioMin: 0.346,
  /** bits of entropy in the first word of each sentence, 60,000 characters: min over 162 canon texts. */
  openerEntropyMin: 5.12,
  /** lag-1 autocorrelation of sentence lengths: min over 162 same-length canon windows. */
  lengthLag1Min: 0.016,
  /** distinct words in the first 8,000 tokens: canon median (WP-006 §4.1). */
  distinctPer8kMedian: 1806,
  /** ", her gaze fixed" and kin per 10,000 words: max over 162 canon texts (median 1.4). */
  tailPer10kMax: 9.9,
} as const;

export const BODY_TAIL =
  /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;

const WINDOW = 60_000;
const squash = (text: string): string => text.replace(/\s+/g, " ").trim();
const sentencesOf = (text: string): string[] =>
  squash(text).split(/(?<=[.!?]["”']?)\s+(?=["“']?[A-Za-z])/).filter((s) => s.split(" ").length >= 3);
const tokens = (text: string): string[] => text.toLowerCase().replace(/[’]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

export interface PageShape {
  /** null when the text is shorter than the canon window — a short text is not comparable. */
  compressedRatio: number | null;
  openerEntropy: number | null;
  lengthLag1: number;
  distinctPer8k: number | null;
  tailPer10k: number;
  words: number;
}

export const measurePageShape = (text: string): PageShape => {
  const flat = squash(text);
  const window = flat.length >= WINDOW ? flat.slice(0, WINDOW) : null;
  const compressedRatio = window ? deflateSync(Buffer.from(window.toLowerCase()), { level: 9 }).length / Buffer.byteLength(window.toLowerCase()) : null;

  const opener = (s: string): number => {
    const sents = sentencesOf(s);
    const first = new Map<string, number>();
    for (const x of sents) {
      const w = (x.replace(/^["“']/, "").match(/^[A-Za-z']+/) ?? [""])[0]!.toLowerCase();
      first.set(w, (first.get(w) ?? 0) + 1);
    }
    return -[...first.values()].reduce((a, c) => a + (c / sents.length) * Math.log2(c / sents.length), 0);
  };

  const lens = sentencesOf(flat).map((s) => s.split(" ").length);
  const mean = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
  const variance = lens.reduce((a, x) => a + (x - mean) ** 2, 0) / Math.max(1, lens.length);
  let lag = 0;
  for (let i = 1; i < lens.length; i++) lag += (lens[i]! - mean) * (lens[i - 1]! - mean);
  const lengthLag1 = lens.length > 2 && variance > 0 ? lag / ((lens.length - 1) * variance) : 0;

  const all = tokens(flat);
  const distinctPer8k = all.length >= 8000 ? new Set(all.slice(0, 8000)).size : null;
  const tailPer10k = all.length > 0 ? ((flat.match(BODY_TAIL) ?? []).length / all.length) * 10_000 : 0;

  return {
    compressedRatio: compressedRatio === null ? null : Number(compressedRatio.toFixed(3)),
    openerEntropy: window ? Number(opener(window).toFixed(2)) : null,
    lengthLag1: Number(lengthLag1.toFixed(3)),
    distinctPer8k,
    tailPer10k: Number(tailPer10k.toFixed(1)),
    words: all.length,
  };
};

/** One line for the run report: each number beside its canon reference, with "below" where it falls short. */
export const summarisePageShape = (shape: PageShape): string => {
  const c = CANON_PAGE_SHAPE;
  const parts: string[] = [];
  const mark = (below: boolean): string => (below ? " BELOW" : "");
  if (shape.compressedRatio !== null) parts.push(`compressed ${shape.compressedRatio} (canon min ${c.compressedRatioMin}${mark(shape.compressedRatio < c.compressedRatioMin)})`);
  if (shape.openerEntropy !== null) parts.push(`sentence openers ${shape.openerEntropy} bits (canon min ${c.openerEntropyMin}${mark(shape.openerEntropy < c.openerEntropyMin)})`);
  parts.push(`length runs ${shape.lengthLag1} (canon min ${c.lengthLag1Min}${mark(shape.lengthLag1 < c.lengthLag1Min)})`);
  if (shape.distinctPer8k !== null) parts.push(`distinct words per 8k ${shape.distinctPer8k} (canon median ${c.distinctPer8kMedian})`);
  parts.push(`body-part tail ${shape.tailPer10k} per 10k (canon max ${c.tailPer10kMax}${shape.tailPer10k > c.tailPer10kMax ? " ABOVE" : ""})`);
  return `${parts.join(" · ")} — the owner's instrument; predicts no read (A_110 §32.1)`;
};
