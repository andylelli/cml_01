/**
 * BOUNDARY AUDIT — the trim treated the CULPRIT as a clearable suspect.
 *
 * A_76 §5 replaced "pass the whole cast" with a hand-rolled filter that excluded victims and
 * detectives. It excluded everyone except the murderer: on 31/31 stored books the culprit was still
 * in the list, so a sentence naming them beside the word "cleared" was classified as a redundant
 * clearance and deleted — taking with it the solution chapter's closing line
 * *"The test had succeeded: the mechanism revealed, the suspects cleared, Charles Fenwick exposed."*
 * The warning it emitted would have claimed the MURDERER was "already cleared earlier".
 *
 * Nothing shipped (the flag defaults off) but it was pre-registered ON for the next paid run.
 *
 * The durable fix was reuse, not a fifth filter: the call site now passes
 * `computeEliminationSuspects`, which already excludes culprits, detectives and victims and is the
 * same list the floor and the regen pass use. These tests pin the PROPERTY at the trim, so the trim
 * stays safe whatever list a future caller hands it.
 */

import { describe, expect, it } from 'vitest';

import { trimRedundantClearances } from '../agent9-prose/clearance-trim.js';

const book = (paras: string[][]) => paras.map((p) => ({ paragraphs: p })) as never;

describe('a name that is not in the suspect list is never trimmed', () => {
  it('leaves the culprit sentence alone when the culprit is absent from the list', () => {
    // This is the real shipped sentence from proj_035fdeda ch9.
    const chapters = book([
      ['Charles Fenwick was cleared by the ledger.'],
      ['The test had succeeded: the mechanism revealed, the suspects cleared, Charles Fenwick exposed.'],
    ]);
    const r = trimRedundantClearances(chapters, ['Margaret Huxley', 'Simon Clarkson'], 0);
    expect(r.removed).toHaveLength(0);
    expect(r.chapters[1]!.paragraphs.join(' ')).toContain('Charles Fenwick exposed');
  });

  it('would have cut it if the culprit were in the list — the bug, pinned', () => {
    // Documents the defect rather than trusting the call site to stay correct.
    const chapters = book([
      ['Charles Fenwick was cleared by the ledger.'],
      ['The test had succeeded: the mechanism revealed, the suspects cleared, Charles Fenwick exposed.'],
    ]);
    const r = trimRedundantClearances(chapters, ['Charles Fenwick'], 0);
    expect(r.removed.length).toBeGreaterThan(0);
  });

  it('still trims a genuine repeat for a real suspect', () => {
    const chapters = book([
      ['Margaret Huxley was cleared; the ledger put her elsewhere.'],
      ['"You are cleared, Margaret Huxley."'],
    ]);
    const r = trimRedundantClearances(chapters, ['Margaret Huxley'], 0);
    expect(r.removed).toHaveLength(1);
  });
});
