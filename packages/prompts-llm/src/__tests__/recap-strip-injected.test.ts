/**
 * A_75 review — the recap was teaching the model our voice.
 *
 * Every later chapter is shown the FULL text of every prior chapter under STORY TO DATE, injections
 * included. On the arm-A run of 2026-08-27 the chapter-9 prompt carried, as this book's prose:
 *
 *   "Eleanor Voss pressed on to the next concrete detail. The record now held:
 *    Captain ivor hale uniquely means skill."
 *
 * The block says DO NOT COPY VERBATIM and the model obeyed — it copied no sentence. It copied the
 * register and the casing, and wrote "Dr finch was glimpsed shivering outside ten minutes past
 * eleven" in its own voice. One injected paragraph in chapter 3 is shown to chapters 4-10 as an
 * example of how this book is written.
 */

import { describe, expect, it } from 'vitest';

import {
  buildStoryToDateBlock,
  stripInjectedFromRecap,
  isRecapStripInjectedEnabled,
} from '../agent9-prose/context-management.js';

const FLAG = 'AGENT9_RECAP_STRIP_INJECTED';
const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const prev = process.env[FLAG];
  if (value === undefined) delete process.env[FLAG];
  else process.env[FLAG] = value;
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env[FLAG];
    else process.env[FLAG] = prev;
  }
};

/** The verbatim paragraph from the arm-A chapter-9 prompt. */
const INJECTED_PARA =
  'Eleanor Voss pressed on to the next concrete detail. The record now held: Captain ivor hale uniquely means skill.';
const AUTHORED_PARA =
  'The hourglass, the sand, the locked doors all pointed to one conclusion, but Eleanor held herself back from naming it.';

describe('stripInjectedFromRecap', () => {
  it('empties a paragraph that is entirely machine text', () => {
    expect(stripInjectedFromRecap(INJECTED_PARA)).toBe('');
  });

  it('keeps the authored half of a mixed paragraph', () => {
    // Asymmetric on purpose: keeping a machine sentence costs style contamination, dropping an
    // authored one costs a continuity error, which is the more expensive of the two.
    const mixed = `${AUTHORED_PARA} The record now held: Captain Ivor Hale uniquely means skill.`;
    const out = stripInjectedFromRecap(mixed);
    expect(out).toBe(AUTHORED_PARA);
  });

  it('leaves fully authored prose untouched', () => {
    expect(stripInjectedFromRecap(AUTHORED_PARA)).toBe(AUTHORED_PARA);
  });

  it('is stable on empty input', () => {
    expect(stripInjectedFromRecap('')).toBe('');
    expect(stripInjectedFromRecap('   ')).toBe('');
  });
});

describe('the recap block, both sides of the flag', () => {
  const chapters = [
    { title: 'Chapter 1', paragraphs: [AUTHORED_PARA, INJECTED_PARA] },
  ] as any;

  it('is BYTE-IDENTICAL to today with the flag off', () => {
    const off = withFlag(undefined, () => buildStoryToDateBlock(chapters, 2));
    expect(off).toContain('The record now held:');
    expect(off).toContain(AUTHORED_PARA);
  });

  it('drops the injected paragraph with the flag on, and keeps the authored one', () => {
    const on = withFlag('true', () => buildStoryToDateBlock(chapters, 2));
    expect(on).not.toContain('The record now held:');
    expect(on).not.toContain('Captain ivor hale');
    // The continuity the block exists to provide must survive.
    expect(on).toContain(AUTHORED_PARA);
  });

  it('still emits the chapter frame when every paragraph was machine text', () => {
    // A chapter reduced to nothing must not silently vanish from the chronology.
    const allMachine = [{ title: 'Chapter 1', paragraphs: [INJECTED_PARA] }] as any;
    const on = withFlag('true', () => buildStoryToDateBlock(allMachine, 2));
    expect(on).toContain('BEGIN PRIOR CHAPTER 1');
    expect(on).toContain('[No paragraph text recorded]');
  });

  it('reads the flag at call time', () => {
    expect(isRecapStripInjectedEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isRecapStripInjectedEnabled({ [FLAG]: 'true' } as unknown as NodeJS.ProcessEnv)).toBe(true);
  });
});
