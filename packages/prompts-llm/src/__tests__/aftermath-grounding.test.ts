/**
 * A_75 §13 — the final chapter is the most abstract part of every book.
 *
 * MEASURED over 132 ten-chapter manuscripts, machine-register rate per chapter (the one prose
 * instrument that tracks the human mark, rho = -0.421):
 *
 *   ch1 11.3%  ch2 14.7%  ch3 15.8%  ch4 13.0%  ch5 14.9%
 *   ch6 16.6%  ch7 14.8%  ch8 14.0%  ch9 14.8%  ch10 17.0%
 *
 * Not a gradient — the middle is noise, the endpoints are the signal. ch10 sits above the ~16% that
 * marks a prose-4 manuscript, and it is the chapter readers keep naming.
 *
 * The cause is the aftermath contract: four requirements, every verb a REPORTING verb, and three
 * prohibitions each removing a dramatisable action. Nothing asked for anything a reader could see.
 */

import { describe, expect, it, afterEach } from 'vitest';

import { buildChapterObligationBlock } from '../agent9-prose/obligation-block.js';

const FLAG = 'AGENT9_AFTERMATH_GROUNDING';
const prev = process.env[FLAG];
afterEach(() => {
  if (prev === undefined) delete process.env[FLAG];
  else process.env[FLAG] = prev;
});

const cmlCase = {
  culpability: { culprits: ['Captain Ivor Hale'] },
  prose_requirements: {},
  cast: [{ name: 'Captain Ivor Hale', role_archetype: 'suspect' }],
};
const scenes = [{ sceneNumber: 10, title: 'Aftermath', purpose: 'consequence', summary: 'the household after' }];

const blockFor = (): string =>
  buildChapterObligationBlock(
    scenes, 10, cmlCase, [], undefined, undefined, undefined, undefined, undefined,
    'resolution', undefined, undefined, scenes, 'aftermath_consequence',
  );

describe('with the flag OFF the contract is byte-identical to today', () => {
  it('carries the four original requirements and no grounding clause', () => {
    delete process.env[FLAG];
    const b = blockFor();
    expect(b).toContain('AFTERMATH CONTRACT');
    expect(b).toContain('NAME IN RETROSPECT');
    expect(b).not.toContain('PUT THE CONSEQUENCE IN THE ROOM');
  });
});

describe('with the flag ON', () => {
  it('adds a grounding requirement without weakening any prohibition', () => {
    process.env[FLAG] = 'true';
    const b = blockFor();
    expect(b).toContain('PUT THE CONSEQUENCE IN THE ROOM');
    expect(b).toContain('NO SUMMARISING CLOSE');
    // The prohibitions exist because of measured evasions -- A_71's recollection frame among them.
    // A change that raises the register must not buy it by re-opening the reveal.
    expect(b).toContain('DO NOT RE-STAGE THE REVEAL');
    expect(b).toContain('DO NOT QUOTE THE CONFESSION');
    expect(b).toContain('DO NOT RESTATE the motive');
  });

  it('asks for things a reader can perceive, which is what the register score measures', () => {
    process.env[FLAG] = 'true';
    const b = blockFor();
    expect(b).toMatch(/SEE, HEAR or TOUCH/);
    expect(b).toMatch(/at least TWO physical things/);
  });

  it('forbids ending on an abstraction — the shape the register score scores highest', () => {
    process.env[FLAG] = 'true';
    const b = blockFor();
    // "the truth", "the case", "justice" as a closing subject is the exact register-4 sentence.
    expect(b).toMatch(/subject is an abstraction/);
    expect(b).toMatch(/End inside the scene/);
  });

  /**
   * THE AXIS TEST. A consequence is physical whichever way the crime was concealed. An example drawn
   * from a timing case would bias the four axes it does not describe.
   */
  it('contains no axis-specific vocabulary', () => {
    process.env[FLAG] = 'true';
    const b = blockFor();
    const added = b.split('PUT THE CONSEQUENCE IN THE ROOM')[1] ?? '';
    expect(added.length).toBeGreaterThan(100);
    for (const re of [/\bclock\b/i, /\btide\b/i, /\bminutes\b/i, /\blocked room\b/i, /\bdisguise\b/i, /\brank\b/i]) {
      expect(re.test(added), `axis-specific term ${re} biases the other axes`).toBe(false);
    }
  });

  it('only fires on the aftermath chapter, not on a reveal chapter', () => {
    process.env[FLAG] = 'true';
    const reveal = buildChapterObligationBlock(
      scenes, 9, cmlCase, [], undefined, undefined, undefined, undefined, undefined,
      'resolution', undefined, undefined, scenes, 'final_reveal',
    );
    expect(reveal).not.toContain('PUT THE CONSEQUENCE IN THE ROOM');
  });
});
