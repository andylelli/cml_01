/**
 * A_84 follow-up #1 — `AGENT9_REVEAL_DECEPTION_PURPOSE`.
 *
 * Four of the last five external reads asked for one missing sentence in the reveal — what the
 * deception made everyone believe, and how that belief protected the culprit — and wrote it themselves.
 * The reveal contract demanded method, access, motive and exclusions, never purpose, and the fields
 * that hold the answer (`why_it_seems_reasonable`, the staged/true pair, the culprit's alibi window)
 * reached no reveal obligation. These tests pin: OFF is byte-identical; ON adds the obligation with
 * the culprit, the locked values and the key terms; a non-temporal case still gets the generic form;
 * a non-reveal chapter gets nothing; the env is read at call time.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { buildChapterObligationBlock, isRevealDeceptionPurposeEnabled } from '../agent9-prose/obligation-block.js';

const FLAG = 'AGENT9_REVEAL_DECEPTION_PURPOSE';
afterEach(() => {
  delete process.env[FLAG];
});

const temporalCase = {
  culpability: { culprits: ['Desmond Jardine'] },
  prose_requirements: { culprit_revelation_scene: { act_number: 3, scene_number: 9 } },
  cast: [
    { name: 'Desmond Jardine', role_archetype: 'suspect', alibi_window: 'a quarter past seven to half past seven in the wings' },
    { name: 'Dr. Edmund Rutherford', role_archetype: 'detective' },
  ],
  false_assumption: {
    statement: "The director's public cue at twenty past seven marks the official start of rehearsal",
    what_it_hides: 'the five minutes between the backstage bell and the public cue',
    why_it_seems_reasonable: 'the rehearsal log records the later cue and everyone defers to the log',
  },
  hidden_model: {
    mechanism: { apparent_time_of_death: 'twenty past seven', actual_time_of_death: 'a quarter past seven' },
  },
};

const revealScene = [{ act: 3, sceneNumber: 9, title: 'The Demonstration', purpose: 'confront the culprit with the stopwatch', summary: 'the bell and the cue are timed side by side' }];
const investigationScene = [{ act: 2, sceneNumber: 5, title: 'The Ledger', purpose: 'examine the rehearsal log', summary: 'pencil marks under the ink' }];

const blockFor = (cmlCase: any, scenes: any[], chapter: number, stage: string): string =>
  buildChapterObligationBlock(
    scenes, chapter, cmlCase, [], undefined, undefined, undefined, undefined, undefined,
    'resolution', undefined, undefined, scenes, stage,
  );

describe('OFF — the reveal contract is byte-identical to today', () => {
  it('carries the existing requirements and no purpose clause', () => {
    const b = blockFor(temporalCase, revealScene, 9, 'final_reveal');
    expect(b).toContain('CULPRIT REVELATION REQUIRED');
    expect(b).toContain('EVIDENCE CHAIN REQUIRED');
    expect(b).not.toContain("DECEPTION'S PURPOSE");
  });
});

describe('ON — the reveal must state the purpose in one sentence', () => {
  it('names the culprit and carries the locked values verbatim', () => {
    process.env[FLAG] = 'true';
    const b = blockFor(temporalCase, revealScene, 9, 'final_reveal');
    expect(b).toContain("DECEPTION'S PURPOSE, IN ONE SENTENCE");
    expect(b).toContain('"Desmond Jardine"');
    expect(b).toContain('"twenty past seven"');
    expect(b).toContain('"a quarter past seven"');
    expect(b).toContain('"a quarter past seven to half past seven in the wings"');
    // Countable, and both halves in one sentence — the operation the model follows.
    expect(b).toContain('SINGLE sentence');
    expect(b).toContain('Do not split it across two sentences');
  });

  it('gives the reasoning fields as key terms to compose from, never as a sentence to copy', () => {
    process.env[FLAG] = 'true';
    const b = blockFor(temporalCase, revealScene, 9, 'final_reveal');
    expect(b).toContain('in your own words, never copied');
    expect(b).toContain('the false belief —');
    expect(b).toContain('what it concealed —');
    expect(b).toContain('why it was believed —');
    // `why_it_seems_reasonable` reached no Agent 9 prompt before this; its terms must now be present.
    expect(b.toLowerCase()).toMatch(/log|defer/);
  });

  it('a non-temporal case still gets the obligation, without the time arithmetic line', () => {
    process.env[FLAG] = 'true';
    const identityCase = {
      ...temporalCase,
      cast: [{ name: 'Desmond Jardine', role_archetype: 'suspect' }],
      false_assumption: {
        statement: 'The man in the altered jacket on the green was Gerald Underhill',
        what_it_hides: 'that a slimmer man wore the jacket and the signet ring was absent',
        why_it_seems_reasonable: 'the whole village knows the jacket',
      },
      hidden_model: { mechanism: {} },
    };
    const b = blockFor(identityCase, revealScene, 9, 'final_reveal');
    expect(b).toContain("DECEPTION'S PURPOSE, IN ONE SENTENCE");
    expect(b).toContain('what it concealed —');
    expect(b).not.toContain('the staged reading');
  });

  it('does not fire on an investigation chapter', () => {
    process.env[FLAG] = 'true';
    const b = blockFor(temporalCase, investigationScene, 5, 'early_investigation');
    expect(b).not.toContain("DECEPTION'S PURPOSE");
  });

  it('reads the env at CALL time (ADR-0004)', () => {
    expect(isRevealDeceptionPurposeEnabled({})).toBe(false);
    expect(isRevealDeceptionPurposeEnabled({ AGENT9_REVEAL_DECEPTION_PURPOSE: 'true' })).toBe(true);
    expect(isRevealDeceptionPurposeEnabled({ AGENT9_REVEAL_DECEPTION_PURPOSE: '1' })).toBe(true);
    expect(isRevealDeceptionPurposeEnabled({ AGENT9_REVEAL_DECEPTION_PURPOSE: '0' })).toBe(false);
    process.env[FLAG] = '0';
    expect(blockFor(temporalCase, revealScene, 9, 'final_reveal')).not.toContain("DECEPTION'S PURPOSE");
    process.env[FLAG] = '1';
    expect(blockFor(temporalCase, revealScene, 9, 'final_reveal')).toContain("DECEPTION'S PURPOSE");
  });
});
