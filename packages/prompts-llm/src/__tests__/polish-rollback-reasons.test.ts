/**
 * A_74 §5.2 follow-up — five causes were reporting one reason.
 *
 * The run-2 tally read "post_pass_polish: 4 calls — rolled back 4", every one `validation_regression`,
 * and the conclusion drawn was "the rollback reasons name VALIDATORS, not the model". They did not:
 * a TRUNCATED reply, a REFUSED reply, an unparseable reply and an empty candidate all emitted that
 * same string, and only `hardErrors` is a validator.
 *
 * That is the X85 shape — two causes, byte-identical telemetry — and it made "fix the validator or
 * gate the pass" a choice between options the number could not distinguish. These tests pin each path
 * to its own name so the next run's tally can actually answer it.
 */

import { describe, expect, it } from 'vitest';

import { polishPassingChapter } from '../agent9-prose/post-pass-polish.js';

const chapter = {
  title: 'Chapter 8: The Trap',
  paragraphs: [
    'Clara gathered the household in the drawing room and set the rewound clock where everyone could see it.',
    'She compared the clock marks against the witness timings before anyone could dodge the conclusion.',
  ],
} as any;

const repairContext = {
  chapterNumber: 8,
  stageMode: 'final_reveal',
  investigatorName: 'Clara',
  culpritName: 'Edgar Vale',
  requiredClueSummaries: [],
  matchingClearances: [],
} as any;

/** A polish client returning one canned response. */
const clientReturning = (response: Record<string, unknown>) =>
  ({ chat: async () => ({ content: '', finishReason: 'end_turn', ...response }) }) as any;

const args = (overrides: Record<string, unknown>) => ({
  chapter,
  client: { chat: async () => ({}) } as any,
  polishModel: 'claude-sonnet-5',
  repairContext,
  validateCandidate: (candidate: any) => ({ chapter: candidate, hardErrors: [] as string[] }),
  ...overrides,
}) as any;

describe('each rollback path names itself', () => {
  it('a TRUNCATED reply is `truncated`, not a validation regression', async () => {
    const r = await polishPassingChapter(args({
      polishClient: clientReturning({ finishReason: 'max_tokens', content: '{"chapters":[]}' }),
    }));
    expect(r.rollbackReason).toBe('truncated');
    expect(r.keptPolishedVersion).toBe(false);
    expect(r.chapter).toBe(chapter); // the accepted chapter is the floor
  });

  it('a REFUSED reply is `refused` — the content-filter tax, not the prose', async () => {
    const r = await polishPassingChapter(args({
      polishClient: clientReturning({ finishReason: 'refusal', content: '' }),
    }));
    expect(r.rollbackReason).toBe('refused');
  });

  it('an EMPTY reply is `unparseable` — the case jsonrepair cannot salvage', async () => {
    // Probed rather than assumed: jsonrepair turns "not json at all" into the STRING "not json at
    // all", and "{" into "{}". Only an empty (or whitespace) body actually defeats it — which is also
    // the realistic one, since a declined reply often arrives as an empty body.
    const r = await polishPassingChapter(args({ polishClient: clientReturning({ content: '' }) }));
    expect(r.rollbackReason).toBe('unparseable');
  });

  it('a salvageable-but-useless reply is `empty_candidate`', async () => {
    const r = await polishPassingChapter(args({ polishClient: clientReturning({ content: 'not json at all' }) }));
    expect(r.rollbackReason).toBe('empty_candidate');
  });

  it('a parsed-but-empty chapter is `empty_candidate`', async () => {
    const r = await polishPassingChapter(args({
      polishClient: clientReturning({ content: '{"chapters":[{"title":"One","paragraphs":[]}]}' }),
    }));
    expect(r.rollbackReason).toBe('empty_candidate');
  });

  it('and ONLY a validator rejecting the prose is `validation_regression`', async () => {
    const r = await polishPassingChapter(args({
      polishClient: clientReturning({ content: '{"chapters":[{"title":"One","paragraphs":["A rewritten line that is quite long."]}]}' }),
      validateCandidate: async (c: any) => ({ chapter: c, hardErrors: ['mojibake'] }),
    }));
    expect(r.rollbackReason).toBe('validation_regression');
  });

  it('the four non-validator paths are all DISTINCT from each other', async () => {
    const reasons = new Set<string>();
    for (const resp of [
      { finishReason: 'max_tokens', content: '{"chapters":[]}' },
      { finishReason: 'refusal', content: '' },
      { content: '' },
      { content: 'not json at all' },
    ]) {
      const r = await polishPassingChapter(args({ polishClient: clientReturning(resp) }));
      reasons.add(String(r.rollbackReason));
    }
    expect(reasons.size).toBe(4);
    expect(reasons.has('validation_regression')).toBe(false);
  });
});
