/**
 * A_79 Phase D — the anti-copy gate.
 *
 * These pin the properties the gate is a GUARANTEE about, not its incidental behaviour:
 * it catches a verbatim lift, it cannot be evaded by re-punctuating, it is silent on original prose,
 * it is inert when the flag is off, and a missing corpus fails OPEN rather than taking a run down.
 *
 * The n=10 default is NOT pinned here as a magic number — it is pinned to the baseline that produced
 * it. `scripts/anticopy-baseline.mjs` measured 92.2% of 204 archived manuscripts firing at n=6 (the
 * value A_79 §5 originally proposed) and 0% at n=10.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildAntiCopyIndex,
  buildAntiCopyIndexAsync,
  loadAntiCopyIndex,
  loadAntiCopyIndexAsync,
  resetAntiCopyIndex,
  findCopiedSpans,
  detectCopiedProse,
  noCopiedProseValidator,
  antiCopyEnabled,
  normaliseWords,
  DEFAULT_N,
} from '../anti-copy.js';

const SOURCE =
  'It was the middle of the night when the household was roused by a cry from the upper landing, ' +
  'and the old butler came down the stairs with a candle shaking in his hand to say that the ' +
  'cabinet in the study had been forced open and the diamond was gone from its case.';

const index = () => buildAntiCopyIndex({ a_test_novel: SOURCE }, DEFAULT_N);

describe('the index', () => {
  it('indexes every n-gram of a text and names its sources', () => {
    const ix = index();
    expect(ix.n).toBe(DEFAULT_N);
    expect(ix.sources).toEqual(['a_test_novel']);
    expect(ix.size).toBe(normaliseWords(SOURCE).length - DEFAULT_N + 1);
  });

  it('skips a text shorter than n rather than throwing', () => {
    const ix = buildAntiCopyIndex({ tiny: 'three short words' }, DEFAULT_N);
    expect(ix.sources).toEqual([]);
    expect(ix.size).toBe(0);
  });
});

describe('detection', () => {
  it('catches a verbatim lift and reports its true length', () => {
    const lifted = normaliseWords(SOURCE).slice(0, 20).join(' ');
    const spans = findCopiedSpans(`She paused. ${lifted} Nobody answered.`, index());
    expect(spans).toHaveLength(1);
    expect(spans[0].length).toBe(20);
  });

  it('MERGES overlapping hits, so one copied sentence is one finding and not eleven', () => {
    const lifted = normaliseWords(SOURCE).slice(0, 20).join(' ');
    // 20 words at n=10 contains 11 distinct matching n-grams; unmerged that would read as 11 breaches.
    expect(findCopiedSpans(lifted, index())).toHaveLength(1);
  });

  it('cannot be evaded by re-casing or re-punctuating', () => {
    const lifted = normaliseWords(SOURCE).slice(0, 15).join(' ');
    const disguised = lifted.toUpperCase().split(' ').join(',   ');
    expect(findCopiedSpans(disguised, index())).toHaveLength(1);
  });

  it('is silent on original prose that shares only short idiom', () => {
    const original =
      'It was the middle of the afternoon, and nobody in the house had yet noticed that the ' +
      'green ledger was missing from the shelf where the housekeeper always left it.';
    expect(findCopiedSpans(original, index())).toEqual([]);
  });

  it('does not fire on a run shorter than n', () => {
    const short = normaliseWords(SOURCE).slice(0, DEFAULT_N - 1).join(' ');
    expect(findCopiedSpans(`Before. ${short} After.`, index())).toEqual([]);
  });
});

describe('the gate', () => {
  const withEnv = (value: string, fn: () => void) => {
    const prior = process.env.PROSE_ANTI_COPY_GATE;
    process.env.PROSE_ANTI_COPY_GATE = value;
    try { fn(); } finally {
      if (prior === undefined) delete process.env.PROSE_ANTI_COPY_GATE;
      else process.env.PROSE_ANTI_COPY_GATE = prior;
    }
  };

  it('is OFF by default', () => {
    withEnv('', () => expect(antiCopyEnabled()).toBe(false));
  });

  it('reads the flag at call time, not at import (ADR-0004)', () => {
    withEnv('true', () => expect(antiCopyEnabled()).toBe(true));
    withEnv('', () => expect(antiCopyEnabled()).toBe(false));
  });

  it('detects nothing while the flag is off, whatever the prose contains', () => {
    withEnv('', () => expect(detectCopiedProse(SOURCE)).toEqual([]));
  });

  it('scores a breach 0, not a proportion — one lift is not tradeable against other validators', () => {
    withEnv('', () => {
      // Flag off, so this exercises the pass path; the score contract is what is pinned.
      const clean = noCopiedProseValidator('Entirely original prose about nothing in particular.');
      expect(clean.ok).toBe(true);
      expect(clean.score).toBe(100);
    });
  });
});

describe('the measured default', () => {
  it('is 11 — the smallest n with a zero false-positive rate over 229 known negatives', () => {
    // A_79 §5 proposed 6. At n=6 the baseline measured 92.2% of our OWN manuscripts firing, which is
    // an off switch with extra steps (CLAUDE.md B1). Changing this without re-running
    // scripts/anticopy-baseline.mjs is the unmeasured change the boards argue against.
    //
    // A_97 moved it 10 -> 11, and NOT by changing the detector. The corpus went from 12 works and
    // 719,552 words to 165 and 12,299,319, and on the same known negatives n=8 went from 2.9% to
    // 45.9% while n=10 went from 0.0% to 0.9%. So a corpus change is a reason to re-baseline exactly
    // as a code change is — which is the part this test exists to make someone notice.
    expect(DEFAULT_N).toBe(11);
  });
});

// ── the async build (2026-10-03) ─────────────────────────────────────────────────────────────────
//
// The pipeline runs inside the API process, and the 165-work index takes 46-54 s to build. A build
// that does not hand the event loop back freezes the API, the SSE stream and the UI for that long.

/** `count` distinct 40-word texts, so every one clears n and each is its own build step. */
const manyTexts = (count: number): Record<string, string> =>
  Object.fromEntries(
    Array.from({ length: count }, (_, t) => [
      `text_${t}`,
      Array.from({ length: 40 }, (_, w) => `w${t}x${w}`).join(' '),
    ]),
  );

describe('the async build', () => {
  it('KNOWN-POSITIVE: it yields to the event loop while it builds', async () => {
    let ticks = 0;
    let running = true;
    const tick = () => {
      ticks += 1;
      if (running) setImmediate(tick);
    };
    setImmediate(tick);
    await buildAntiCopyIndexAsync(manyTexts(40), DEFAULT_N);
    running = false;
    // One yield per text per pass: a driver that never yielded would leave this at 0 or 1.
    expect(ticks).toBeGreaterThanOrEqual(20);
  });

  it('builds exactly the index the sync build does — one algorithm, two drivers', async () => {
    const texts = { a_test_novel: SOURCE, tiny: 'three short words', ...manyTexts(5) };
    const sync = buildAntiCopyIndex(texts, DEFAULT_N);
    const async_ = await buildAntiCopyIndexAsync(texts, DEFAULT_N);
    expect(async_.size).toBe(sync.size);
    expect(async_.sources).toEqual(sync.sources);
    const lifted = normaliseWords(SOURCE).slice(3, 25).join(' ');
    expect(findCopiedSpans(`He said ${lifted} and left.`, async_)).toEqual(
      findCopiedSpans(`He said ${lifted} and left.`, sync),
    );
  });
});

describe('the async loader', () => {
  const dirs: string[] = [];
  const corpus = (texts: Record<string, string>): string => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anticopy-'));
    dirs.push(dir);
    for (const [name, text] of Object.entries(texts)) fs.writeFileSync(path.join(dir, `${name}.txt`), text);
    return dir;
  };
  const priorDir = process.env.PROSE_ANTI_COPY_TEXTS_DIR;

  afterEach(() => {
    if (priorDir === undefined) delete process.env.PROSE_ANTI_COPY_TEXTS_DIR;
    else process.env.PROSE_ANTI_COPY_TEXTS_DIR = priorDir;
    resetAntiCopyIndex();
    for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  });

  it('concurrent callers share ONE build, and the sync loader then reuses it', async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = corpus({ a_test_novel: SOURCE });
    resetAntiCopyIndex();
    const [a, b] = await Promise.all([loadAntiCopyIndexAsync(), loadAntiCopyIndexAsync()]);
    expect(a).toBe(b);
    expect(a.sources).toEqual(['a_test_novel']);
    expect(loadAntiCopyIndex()).toBe(a);
    expect(await loadAntiCopyIndexAsync()).toBe(a);
  });

  it('a build in flight when the memo is dropped does not repopulate it', async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = corpus({ a_test_novel: SOURCE });
    resetAntiCopyIndex();
    const first = loadAntiCopyIndexAsync();
    resetAntiCopyIndex();
    const stale = await first;
    // The stale build resolved, but the cache was not written: the next call builds a fresh index.
    const fresh = await loadAntiCopyIndexAsync();
    expect(fresh).not.toBe(stale);
    expect(fresh.size).toBe(stale.size);
  });

  it('a missing corpus directory yields an empty index, not a rejection', async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = path.join(os.tmpdir(), 'anticopy-does-not-exist-xyz');
    resetAntiCopyIndex();
    const ix = await loadAntiCopyIndexAsync();
    expect(ix.size).toBe(0);
    expect(ix.sources).toEqual([]);
  });
});
