/**
 * A_79 §14 — the corpus must be able to reach a fixed-size cut.
 *
 * Found by a paid canary run, not by reading: `DEVICE_LIBRARY_INCLUDE_CORPUS` loaded 9 extra
 * patterns and changed not one byte of any prompt. Every pattern scores `noveltyScore === 1` because
 * nothing has ever been used, so the `localeCompare` tiebreak was the entire ranking — and the
 * curated eleven (`clock_rewind`, `concealed_passage`, `delayed_poison`…) sort ahead of corpus
 * patterns named after their works (`a_jury_of_her_peers`, `the_big_bow_mystery`). The caller takes
 * the top 4; the corpus sat at positions 5-9.
 *
 * An arbitrary-but-CONSTANT tiebreak in front of a fixed-size cut is not a tiebreak, it is a silent
 * allowlist. These tests pin that it cannot return.
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { retrievePatterns, noveltyScore } from '../retrieve.js';
import { loadPatterns, resetPatternCache } from '../loader.js';

const CUT = 4; // what device-library-block.ts takes
const isCorpus = (p: { sources?: string[] }) =>
  (p.sources ?? []).some((s) => String(s).includes('library/works/'));

describe('corpus visibility at the cut', () => {
  const prior = process.env.DEVICE_LIBRARY_INCLUDE_CORPUS;
  beforeEach(() => { process.env.DEVICE_LIBRARY_INCLUDE_CORPUS = 'true'; resetPatternCache(); });
  afterEach(() => {
    if (prior === undefined) delete process.env.DEVICE_LIBRARY_INCLUDE_CORPUS;
    else process.env.DEVICE_LIBRARY_INCLUDE_CORPUS = prior;
    resetPatternCache();
  });

  it('the premise: every pattern really is tied on novelty, so the tiebreak decides everything', () => {
    const scores = new Set(loadPatterns().map((p) => noveltyScore(p)));
    expect(scores).toEqual(new Set([1]));
  });

  it('a corpus pattern reaches the top-4 cut when both sources are present', () => {
    for (const query of [
      { decade: 1950, primaryAxis: 'temporal' },
      { decade: 1950, primaryAxis: 'spatial' },
      { decade: 1930, primaryAxis: 'identity' },
    ] as const) {
      const top = retrievePatterns(query).slice(0, CUT);
      const corpus = top.filter((r) => isCorpus(r.pattern));
      expect(corpus.length, `${query.decade}/${query.primaryAxis} cut had no corpus pattern`).toBeGreaterThan(0);
    }
  });

  it('keeps a curated pattern in the cut too — this is interleaving, not replacement', () => {
    const top = retrievePatterns({ decade: 1950, primaryAxis: 'temporal' }).slice(0, CUT);
    expect(top.filter((r) => !isCorpus(r.pattern)).length).toBeGreaterThan(0);
  });

  it('is deterministic', () => {
    const q = { decade: 1950, primaryAxis: 'spatial' } as const;
    const a = retrievePatterns(q).map((r) => r.pattern.pattern_id);
    const b = retrievePatterns(q).map((r) => r.pattern.pattern_id);
    expect(a).toEqual(b);
  });

  it('loses nothing — interleaving reorders, it does not drop', () => {
    const q = { decade: 1950, primaryAxis: 'spatial' } as const;
    const ids = retrievePatterns(q).map((r) => r.pattern.pattern_id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(4);
  });
});

describe('flag off', () => {
  const prior = process.env.DEVICE_LIBRARY_INCLUDE_CORPUS;
  beforeEach(() => { process.env.DEVICE_LIBRARY_INCLUDE_CORPUS = ''; resetPatternCache(); });
  afterEach(() => {
    if (prior === undefined) delete process.env.DEVICE_LIBRARY_INCLUDE_CORPUS;
    else process.env.DEVICE_LIBRARY_INCLUDE_CORPUS = prior;
    resetPatternCache();
  });

  it('retrieves the curated order unchanged — with one source there is nothing to interleave', () => {
    const top = retrievePatterns({ decade: 1950, primaryAxis: 'temporal' }).slice(0, CUT);
    expect(top.map((r) => r.pattern.pattern_id)).toEqual([
      'clock_rewind', 'delayed_poison', 'forged_document_timeline', 'hearth_release',
    ]);
  });
});
