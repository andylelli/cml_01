/**
 * X32's repair half — which scene keeps the clearance job, and what happens to the rest.
 *
 * The rule is worth testing hard because it is the first thing this project has built that aims at a
 * category the readers have NEVER given a 9: pacing, 34 reads, max 8, with four of the top eight
 * naming the same repeated-clearances defect.
 */

import { describe, expect, it } from 'vitest';

import { chooseClearanceKeeper, stampSuspectClearanceGate } from '../suspect-clearance-gate.js';

describe('choosing the keeper', () => {
  it('folds into the reveal — the LAST closure scene at or before it', () => {
    // ch6 clears, ch9 re-clears, reveal at ch9 (index 8): the reveal keeps the job.
    expect(chooseClearanceKeeper({ closureIndices: [5, 8], revealIndex: 8 })).toBe(8);
  });

  it('drops post-reveal clearances, which is the complaint verbatim', () => {
    // "Chapter 10 still repeats some of Chapter 9" — reveal at 8, closures at 5, 8 and 9.
    expect(chooseClearanceKeeper({ closureIndices: [5, 8, 9], revealIndex: 8 })).toBe(8);
  });

  it('keeps the last pre-reveal scene when the reveal itself does no clearing', () => {
    expect(chooseClearanceKeeper({ closureIndices: [4, 6], revealIndex: 8 })).toBe(6);
  });

  it('keeps the EARLIEST when every closure sits after the reveal', () => {
    // Removing the last one would leave the book never clearing its suspects — a fair-play fault
    // traded for a pacing one. The floor check exists for exactly this.
    expect(chooseClearanceKeeper({ closureIndices: [9, 10], revealIndex: 8 })).toBe(9);
  });

  it('keeps the last when the reveal cannot be located', () => {
    expect(chooseClearanceKeeper({ closureIndices: [3, 7], revealIndex: -1 })).toBe(7);
  });

  it('is order-independent — the caller may pass indices unsorted', () => {
    expect(chooseClearanceKeeper({ closureIndices: [9, 5, 8], revealIndex: 8 })).toBe(8);
  });

  it('returns -1 with nothing to choose from', () => {
    expect(chooseClearanceKeeper({ closureIndices: [], revealIndex: 4 })).toBe(-1);
  });
});

describe('stamping the gate', () => {
  const scenes = (n: number) => Array.from({ length: n }, () => ({} as { suspectClearanceAllowed?: boolean }));

  it('marks the keeper true and every duplicate false', () => {
    const s = scenes(10);
    const r = stampSuspectClearanceGate(s, { closureIndices: [5, 8, 9], revealIndex: 8 });
    expect(r.keeperIndex).toBe(8);
    expect(r.suppressed).toBe(2);
    expect(s[8].suspectClearanceAllowed).toBe(true);
    expect(s[5].suspectClearanceAllowed).toBe(false);
    expect(s[9].suspectClearanceAllowed).toBe(false);
  });

  it('leaves every non-closure scene UNSET, so the prompt block self-gates', () => {
    const s = scenes(10);
    stampSuspectClearanceGate(s, { closureIndices: [5, 8], revealIndex: 8 });
    for (const i of [0, 1, 2, 3, 4, 6, 7, 9]) {
      expect(s[i], `scene ${i}`).not.toHaveProperty('suspectClearanceAllowed');
    }
  });

  it('is a NO-OP on a single clearance scene — the correct shape must not carry the block', () => {
    const s = scenes(10);
    const r = stampSuspectClearanceGate(s, { closureIndices: [6], revealIndex: 8 });
    expect(r.suppressed).toBe(0);
    expect(r.reason).toBe('no-duplicates');
    expect(s[6]).not.toHaveProperty('suspectClearanceAllowed');
  });

  it('says WHY it did nothing rather than returning a silent zero', () => {
    // X85: "rejected every time" and "had nothing to do" wrote byte-identical telemetry for a month.
    expect(stampSuspectClearanceGate(scenes(4), { closureIndices: [], revealIndex: 2 }).reason).toBe('no-closure-scenes');
  });

  it('ignores indices outside the outline instead of throwing', () => {
    const s = scenes(3);
    const r = stampSuspectClearanceGate(s, { closureIndices: [1, 7, -2], revealIndex: 2 });
    expect(r.reason).toBe('no-duplicates');
    expect(r.keeperIndex).toBe(1);
  });
});
