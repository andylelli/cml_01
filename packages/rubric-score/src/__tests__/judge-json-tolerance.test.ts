/**
 * X87 — the judge parser must survive a model that says anything around the JSON.
 *
 * `stripFences` returned the fenced group if there was one and otherwise **the whole string**, so a
 * bare object followed by a sentence of commentary reached `JSON.parse` intact and threw
 * `Unexpected non-whitespace character after JSON at position N`.
 *
 * MEASURED: that cost a paid `claude-opus-5` call (~£0.18) during the PLAN-TO-90 0b.0 n=8 run and
 * silently shrank that story's sample from 8 repeats to 7. Nothing about it is provider-specific —
 * no model is prevented from appending a line — and the sample shrank without the experiment noticing,
 * which is the part that matters: a judge that fails on 1 call in 16 biases every mean it feeds.
 *
 * The scan is for a BALANCED object rather than to the last brace, because judge output embeds `reason`
 * strings full of prose and `lastIndexOf("}")` would span two concatenated objects.
 */

import { describe, expect, it } from 'vitest';

import { parseJudgeResult } from '../llm-judge.js';

const CATEGORIES = [
  'premise',
  'opening_hook',
  'plot_structure',
  'character_clarity',
  'dialogue',
  'atmosphere',
  'clues',
  'pacing',
  'ending',
  'prose',
];

/** A minimal well-formed judge payload; `mark` varies so a mis-parse cannot coincidentally pass. */
const payload = (mark = 7) =>
  JSON.stringify({
    categories: CATEGORIES.map((category, i) => ({ category, mark: mark + (i % 2), reason: 'because {not a brace}' })),
    total: 71,
    overall_view: 'Solid, with a soft ending.',
  });

describe('the judge tolerates what models actually emit', () => {
  it('a bare object, as before', () => {
    expect(parseJudgeResult(payload()).rubric.total).toBe(71);
  });

  it('a fenced object, as before', () => {
    expect(parseJudgeResult('```json\n' + payload() + '\n```').rubric.total).toBe(71);
  });

  it('an object followed by commentary — the case that cost a paid call', () => {
    expect(parseJudgeResult(payload() + '\n\nHere is my assessment of the manuscript.').rubric.total).toBe(71);
  });

  it('an object preceded by a preamble', () => {
    expect(parseJudgeResult('Certainly. Here is the scoring:\n' + payload()).rubric.total).toBe(71);
  });

  it('an object wrapped in prose on both sides', () => {
    expect(parseJudgeResult('Thinking done.\n' + payload() + '\nLet me know if you want detail.').rubric.total).toBe(71);
  });
});

describe('the scan stops at the FIRST balanced object', () => {
  it('ignores a second object appended after the first', () => {
    // `lastIndexOf("}")` would have spanned both and produced invalid JSON.
    const two = payload(7) + '\n' + JSON.stringify({ note: 'a stray second object' });
    expect(parseJudgeResult(two).rubric.total).toBe(71);
  });

  it('a brace inside a reason string cannot close the object early', () => {
    // The reasons above contain `{not a brace}`. If string tracking were dropped, the scan would
    // close on that inner brace and the payload would truncate mid-array.
    const parsed = parseJudgeResult(payload() + ' trailing');
    expect(parsed.rubric.categories).toHaveLength(CATEGORIES.length);
  });

  it('an escaped quote inside a reason does not desynchronise the scan', () => {
    const tricky = JSON.stringify({
      categories: [{ category: 'prose', mark: 6, reason: 'the phrase \\"the clock\\" recurs {often}' }],
      total: 64,
      overall_view: 'ok',
    });
    expect(parseJudgeResult(tricky + '\nDone.').rubric.total).toBe(64);
  });
});

describe('it does not paper over genuinely broken output', () => {
  it('still throws when the object never closes', () => {
    // Inventing a closing brace would turn a truncated response into a confident wrong score — far
    // worse than a loud failure, which X37 already established must stay loud.
    expect(() => parseJudgeResult('{"categories": [{"category": "prose", "mark": 6')).toThrow();
  });

  it('still throws when there is no object at all', () => {
    expect(() => parseJudgeResult('I am unable to score this manuscript.')).toThrow();
  });
});
