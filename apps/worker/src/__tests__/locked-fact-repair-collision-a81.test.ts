/**
 * A_81 §10 — the repair that protects locked facts was corrupting them.
 *
 * `repairWordFormLockedFacts` treats "quarter past <hour>" as a wrong substitution whenever a locked
 * time in that hour is not at :15. That is right when a case locks ONE time per hour. A false-time
 * mystery necessarily locks TWO in the same hour — the gap between them IS the mechanism — and then
 * the repair for one overwrites the other.
 *
 * MEASURED on run mystery-1788293825799: the case was correct (9:15 chime, 9:10 watch, five minutes
 * apart, A_80 F15 silent), and this pass rewrote "three strikes at a quarter past nine" into "three
 * strikes at a ten minutes past nine" — ungrammatical article included — thirteen times. The external
 * reader scored the clue logic 6/10 and said the contradiction "destroys the fair-play logic".
 *
 * Both directions are pinned here, because the rule is correct in the single-time case and deleting
 * it would trade one defect for another.
 */

import { describe, expect, it } from 'vitest';

import { repairWordFormLockedFacts } from '../jobs/agents/agent9-run.js';

const CHIME = { id: 'clock_first_strike_time', value: 'quarter past nine', description: 'when the clock struck three' };
const WATCH = { id: 'guest_watch_stopped_time', value: 'ten minutes past nine', description: 'when the watch stopped' };

const chapter = () => ({
  chapters: [
    {
      title: 'Ch3',
      paragraphs: [
        'The clock gave three strikes at a quarter past nine, and the sound carried down the stair.',
        'Finch’s pocket watch had stopped at ten minutes past nine.',
      ],
    },
  ],
});

const textOf = (p: any) => p.chapters[0].paragraphs.join(' ');

describe('two locked times in the same hour — the mechanism', () => {
  it('does NOT rewrite a phrase that is another locked fact', () => {
    const out = repairWordFormLockedFacts(chapter(), [CHIME, WATCH]);
    expect(textOf(out)).toContain('three strikes at a quarter past nine');
    expect(textOf(out)).not.toContain('three strikes at a ten minutes past nine');
  });

  it('leaves the five-minute contradiction intact — both values still present', () => {
    const t = textOf(repairWordFormLockedFacts(chapter(), [CHIME, WATCH]));
    expect(t).toContain('quarter past nine');
    expect(t).toContain('ten minutes past nine');
  });

  it('is order-independent', () => {
    const t = textOf(repairWordFormLockedFacts(chapter(), [WATCH, CHIME]));
    expect(t).toContain('three strikes at a quarter past nine');
  });
});

describe('one locked time — a genuine wrong substitution', () => {
  it('IS still repaired, so the rule keeps its purpose', () => {
    const out = repairWordFormLockedFacts(chapter(), [WATCH]);
    expect(textOf(out)).toContain('three strikes at a ten minutes past nine');
  });

  it('half past is treated the same way', () => {
    const half = { id: 'x', value: 'half past nine', description: 'the half hour' };
    const p = { chapters: [{ title: 'C', paragraphs: ['It was half past nine when the bell rang.'] }] };
    // With `half past nine` locked by another fact, a 9:10 canonical must not rewrite it.
    expect(textOf(repairWordFormLockedFacts(structuredClone(p), [WATCH, half]))).toContain('half past nine');
    // Without it, the substitution stands.
    expect(textOf(repairWordFormLockedFacts(structuredClone(p), [WATCH]))).toContain('ten minutes past nine');
  });
});
