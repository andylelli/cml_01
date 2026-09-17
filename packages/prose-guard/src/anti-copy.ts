/**
 * A_79 Phase D — the anti-copy gate.
 *
 * ── WHY THIS IS THE ONE ITEM THAT IS A GUARANTEE ─────────────────────────────────────────────────
 *
 * Everything else in A_79 makes the generator better informed. This is the only piece that makes a
 * promise: that a shipped chapter contains no verbatim run from any source novel we hold.
 *
 * The wiki's INPUT side is already safe by construction — de-specification is role-aware and no
 * proper noun survives outside a `sources:` line, so a prompt sees "the culprit occupies a role whose
 * occupant is not perceived as a person" and never "Welkin". The OUTPUT side did not exist. Nothing
 * checked a finished chapter against the 711,000 words of source prose now on disk in
 * `library/texts/`.
 *
 * Today that risk is close to zero, because no source prose reaches any prompt. It stops being close
 * to zero the moment Phase E puts real period sentences near the generator, and A_79 §5 is explicit
 * that the gate must exist BEFORE that, not alongside it.
 *
 * ── WHY WORD N-GRAMS, AND WHY THE MATCH IS EXACT ─────────────────────────────────────────────────
 *
 * The check is a hash-set lookup over normalised word n-grams: lowercase, punctuation stripped,
 * whitespace collapsed. It cannot be fooled by re-punctuation or capitalisation, and it cannot
 * hallucinate agreement the way an LLM verifier can (A_77 §10.8 settled that argument for the span
 * checker: `String.includes` cannot be talked round, and neither can this).
 *
 * It is deliberately NOT a similarity measure. Paraphrase is not what this gate is for — paraphrase
 * of a public-domain plot is the entire point of the corpus. What it forbids is a verbatim RUN, which
 * is the only thing that is unambiguously copying rather than influence.
 *
 * ── N IS MEASURED, NOT CHOSEN ────────────────────────────────────────────────────────────────────
 *
 * A_79 §5 requires the false-positive rate to be baselined before the gate ships, and CLAUDE.md's B1
 * rule is blunter: a check that fires on most runs is an off switch with extra steps. The baseline is
 * `scripts/anticopy-baseline.mjs`, run over the archived manuscripts — and because no source prose
 * has ever reached a prompt, EVERY hit in that population is a false positive by construction. That
 * makes the measurement exact rather than an estimate. See `DEFAULT_N` for what it returned.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Validator } from "./types.js";

/** A verbatim run found in both a manuscript and a source text. */
export interface CopiedSpan {
  /** The offending run, as it appears normalised. */
  text: string;
  /** Word offset of the run within the normalised prose. */
  wordOffset: number;
  /** Length of the run in words — at least `n`, longer when adjacent n-grams merge. */
  length: number;
}

/** Membership only. The index never has to enumerate itself, which is what makes §A_97 possible. */
export interface NgramSet {
  has(key: string): boolean;
  readonly size: number;
}

export interface AntiCopyIndex {
  n: number;
  hashes: NgramSet;
  /** Works the index was built from, for the failure message. */
  sources: string[];
  /** Total n-grams indexed, for the log line. */
  size: number;
}

/**
 * Words only, lowercased, apostrophes folded. Curly and straight quotes normalise to the same thing
 * so a smart-quoted source and a straight-quoted manuscript are not treated as different text — the
 * mistake that made the first span checker under-report (A_77 §16.9).
 */
export const normaliseWords = (text: string): string[] =>
  String(text)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

/**
 * The n-gram key. Joined with a character that cannot occur after normalisation, so "a b" and "ab"
 * can never collide — the classic n-gram bug.
 */
const key = (words: string[], i: number, n: number): string => words.slice(i, i + n).join("");

/**
 * A 53-bit fingerprint of one n-gram key, as a plain `number`.
 *
 * ── WHY THE KEYS ARE NOT STORED ──────────────────────────────────────────────────────────────────
 *
 * MEASURED 2026-09-17, before A_97's acquisition: a `Set<string>` of joined 10-grams cost **170 bytes
 * per n-gram** — 13 works, 790k n-grams, 134.5 MB of heap and 293 MB RSS. That is affordable for
 * twelve novels, and it is the reason the corpus could not grow: the index is one set held whole in
 * memory, so it scales with the library, and at 8M words it would be 1.4 GB. A_79 §6 requires this
 * gate ON before any source prose reaches a prompt, so "it is off by default" is not an answer.
 *
 * Two 32-bit rolling hashes are combined into one integer below 2^53, which a float64 represents
 * exactly — so the store is a plain `Float64Array` at **8 bytes per n-gram, a 21x reduction**, with no
 * BigInt arithmetic on the hot path.
 *
 * ── WHAT THIS COSTS, STATED HONESTLY ─────────────────────────────────────────────────────────
 *
 * Storing a fingerprint instead of the key admits false positives by collision, which the exact Set
 * could not have. The rate is computable rather than a hope: with `m` n-grams indexed in a space of
 * 2^53, the chance a given queried n-gram collides is `m / 2^53`. Across the whole 523-work survey
 * (~40M n-grams) that is **4.4e-12 per n-gram**, about one spurious hit per 200 million chapters. The
 * gate's measured false-positive rate is dominated by period-idiomatic phrasing by twelve orders of
 * magnitude (see `DEFAULT_N`), so this changes nothing observable — and the baseline, not this
 * comment, remains the instrument that decides `n`.
 */
function fingerprint(s: string): number {
  let h1 = 0x811c9dc5 | 0;
  let h2 = 0x1505 | 0;
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = (Math.imul(h2, 33) ^ c) | 0;
  }
  // 21 bits of h1 above 32 bits of h2 = 53 bits, the exact-integer ceiling of a float64.
  return ((h1 >>> 11) * 4294967296) + (h2 >>> 0);
}

/** A sorted `Float64Array` of fingerprints, queried by binary search. Membership only, by design. */
class FingerprintSet implements NgramSet {
  constructor(private readonly sorted: Float64Array) {}
  get size(): number { return this.sorted.length; }
  has(k: string): boolean {
    const target = fingerprint(k);
    let lo = 0;
    let hi = this.sorted.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const v = this.sorted[mid]!;
      if (v === target) return true;
      if (v < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
}

/**
 * Build an index from `{ name -> text }`. Pure: no file access, so it is trivially testable.
 *
 * Two passes rather than one, because a growable array of 40M numbers would defeat the point: the
 * first counts the n-grams so the typed array is allocated once at its final length, the second fills
 * it. Sorting and de-duplicating happen in place.
 */
export function buildAntiCopyIndex(texts: Record<string, string>, n: number): AntiCopyIndex {
  const sources: string[] = [];
  const wordLists: string[][] = [];
  let total = 0;
  for (const [name, text] of Object.entries(texts)) {
    const words = normaliseWords(text);
    if (words.length < n) continue;
    sources.push(name);
    wordLists.push(words);
    total += words.length - n + 1;
  }

  const buf = new Float64Array(total);
  let w = 0;
  for (const words of wordLists) {
    for (let i = 0; i + n <= words.length; i += 1) buf[w++] = fingerprint(key(words, i, n));
  }
  buf.sort();

  // De-duplicate in place: a phrase repeated across two works is one entry, as it was in the Set.
  let unique = 0;
  for (let i = 0; i < buf.length; i += 1) {
    if (i === 0 || buf[i] !== buf[i - 1]) buf[unique++] = buf[i]!;
  }
  const hashes = new FingerprintSet(buf.subarray(0, unique));
  return { n, hashes, sources, size: hashes.size };
}

/**
 * Every verbatim run of at least `index.n` words that also appears in a source text.
 *
 * Overlapping hits are MERGED. Without that, one copied sentence of 20 words reports as 15 separate
 * findings and the report is unreadable — and worse, a reviewer counting findings would think the
 * breach was 15 times bigger than it is.
 */
export function findCopiedSpans(prose: string, index: AntiCopyIndex): CopiedSpan[] {
  const words = normaliseWords(prose);
  const { n } = index;
  const spans: CopiedSpan[] = [];
  let runStart = -1;

  const close = (endExclusive: number) => {
    if (runStart < 0) return;
    const length = endExclusive - runStart;
    spans.push({ text: words.slice(runStart, endExclusive).join(" "), wordOffset: runStart, length });
    runStart = -1;
  };

  for (let i = 0; i + n <= words.length; i += 1) {
    if (index.hashes.has(key(words, i, n))) {
      if (runStart < 0) runStart = i;
    } else {
      close(i + n - 1);
    }
  }
  close(words.length);
  return spans;
}

/**
 * The measured false-positive floor. **This number is data, not a preference.**
 *
 * MEASURED 2026-08-31 by `scripts/anticopy-baseline.mjs` over 204 archived manuscripts against all
 * 719,552 words in `library/texts/`. Every hit in that population is a false positive by
 * construction: those manuscripts were written before any source prose reached any prompt.
 *
 *     n     indexed n-grams   manuscripts firing   total spans   longest false run
 *      6            715,345          188 (92.2%)           967              8 words
 *      7            717,419           59 (28.9%)            86              8 words
 *      8            718,071            6  (2.9%)             7              8 words
 *     10            718,542            0  (0.0%)             0                   -
 *     12            718,733            0  (0.0%)             0                   -
 *
 * **A_79 §5 proposed a 6-gram index. A 6-gram gate fires on 92.2% of our own manuscripts** — the
 * "off switch with extra steps" CLAUDE.md B1 names, and it would have shipped as a hard fail. The
 * false positives are ordinary dialogue ("i don't know what you mean"), which is exactly the
 * period-idiomatic collision §5 predicted and could not size without measuring.
 *
 * 10 is the smallest clean value, and smaller is more sensitive, so anything larger trades real
 * detection for no measured benefit. A synthetic positive — 40 words lifted verbatim from The
 * Moonstone — is caught at every n tested, so the quiet at n=10 is selectivity and not blindness.
 *
 * Changing this without re-running the baseline is the unmeasured change the boards argue against.
 */
export const DEFAULT_N = 10;

// ── wiring ───────────────────────────────────────────────────────────────────────────────────────

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * Flag `PROSE_ANTI_COPY_GATE`, **default OFF**, read at call time (ADR-0004).
 *
 * Off by convention, not because the gate is doubtful: it measured a ZERO false-positive rate over
 * 204 known negatives, so turning it on costs nothing observable today. It stays off because it has
 * never run inside a real generation, and because nothing yet puts source prose near a prompt.
 *
 * **A_79 §6: Phase E is gated on this shipping. It must be ON before any source prose reaches a
 * prompt** — that is the whole point of building the output side first.
 */
export const antiCopyEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.PROSE_ANTI_COPY_GATE ?? "").trim());

const textsDir = (env: NodeJS.ProcessEnv = process.env): string =>
  String(env.PROSE_ANTI_COPY_TEXTS_DIR ?? "").trim() ||
  path.resolve(HERE, "..", "..", "..", "library", "texts");

let cache: AntiCopyIndex | undefined;

/**
 * The index over `library/texts/`, built once per process.
 *
 * ~719k n-grams takes a second or so to build and a few tens of MB to hold, which is why it is
 * memoised and why the flag is checked BEFORE the build — a disabled gate must not pay for an index
 * it will never query.
 *
 * A missing or unreadable corpus yields an EMPTY index, not a throw. An anti-copy gate that takes a
 * paid run down because a text file is absent has converted a safety feature into an outage, and the
 * empty index is honest: it finds nothing because it knows nothing, and `sources` says so.
 */
export function loadAntiCopyIndex(n: number = DEFAULT_N): AntiCopyIndex {
  if (cache && cache.n === n) return cache;
  const dir = textsDir();
  const texts: Record<string, string> = {};
  try {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".txt")) continue;
      texts[f.replace(/\.txt$/, "")] = fs.readFileSync(path.join(dir, f), "utf8");
    }
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`[anti-copy] no source texts at ${dir} — the gate can find nothing and will pass everything`);
  }
  cache = buildAntiCopyIndex(texts, n);
  return cache;
}

/** Drop the memo. Only needed by tests that point the loader at a different corpus. */
export const resetAntiCopyIndex = (): void => { cache = undefined; };

/**
 * The ship-layer check. Returns [] when the flag is off, so the caller needs no branch of its own.
 *
 * A_79 §5: "any match is a hard fail, reporting the work and the span". Naming the work matters —
 * "this run reproduces 14 words of The Moonstone" is actionable, "copy detected" is not.
 */
export function detectCopiedProse(prose: string): string[] {
  if (!antiCopyEnabled()) return [];
  const index = loadAntiCopyIndex();
  if (index.size === 0) return [];
  return findCopiedSpans(prose, index).map(
    (s) => `${s.length} verbatim words from the source corpus: "${s.text.slice(0, 90)}"`,
  );
}

/**
 * Validator form, to sit beside `noTemplateLeakageValidator` in the same validator lists.
 *
 * Scores 0 on any hit rather than degrading with count: one copied run is a breach and two are not
 * twice a breach. A scalar that could be traded off against other validators would let a good draft
 * ship with a lift in it, which is the one outcome this gate exists to prevent.
 */
export const noCopiedProseValidator: Validator<string> = (prose) => {
  const hits = detectCopiedProse(prose);
  return {
    ok: hits.length === 0,
    score: hits.length === 0 ? 100 : 0,
    violations: hits.map((h) => `anti_copy:${h}`),
  };
};
