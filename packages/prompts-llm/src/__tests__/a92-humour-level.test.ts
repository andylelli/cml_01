/**
 * A_92 — HUMOUR AS A STORY PARAMETER.
 *
 * Humour was decided entirely inside the pipeline: Agent 2b chose each character's style and Agent 9
 * asked for a wit beat in every chapter. No caller could say "a dry book" or "a sharp one".
 *
 * The band resolves to two COUNTABLE things, because this model complies with operations and ignores
 * rates (CLAUDE.md): which styles Agent 2b may assign, and which chapters carry a beat.
 *
 * The load-bearing test in this file is the FIRST one. `classic` is the default, and it must be
 * byte-identical to the behaviour every book in the corpus was written under — otherwise this
 * parameter silently reprices every comparison against that corpus.
 */

import { describe, expect, it } from 'vitest';

import { buildProfilesPrompt } from '../agent2b-character-profiles.js';
import { buildChapterObligationBlock } from '../agent9-prose/obligation-block.js';
import {
  DEFAULT_HUMOUR_LEVEL,
  HUMOUR_BANDS,
  HUMOUR_LEVELS,
  chapterCarriesWitBeat,
  humourBand,
  resolveHumourLevel,
} from '../humour-level.js';

const castInputs = (humourLevel?: string) =>
  ({
    cast: { characters: [{ name: 'Eleanor Voss' }, { name: 'Captain Ivor Hale' }] },
    tone: 'Classic',
    ...(humourLevel === undefined ? {} : { humourLevel }),
  }) as any;

const developerOf = (humourLevel?: string): string => {
  const p = buildProfilesPrompt(castInputs(humourLevel)) as any;
  return String(p?.developer ?? p?.system ?? JSON.stringify(p));
};

describe('the default changes nothing', () => {
  it('an absent band produces the byte-identical prompt that "classic" does', () => {
    expect(developerOf()).toBe(developerOf('classic'));
  });

  it('an absent band adds no humour directive at all', () => {
    expect(developerOf()).not.toContain('HUMOUR LEVEL —');
  });

  it('unrecognised text resolves to classic rather than throwing or blanking the cast', () => {
    for (const junk of ['', '   ', 'hilarious', 'VERY DRY INDEED', null, undefined, 7]) {
      expect(resolveHumourLevel(junk)).toBe(DEFAULT_HUMOUR_LEVEL);
    }
    expect(developerOf('hilarious')).toBe(developerOf());
  });

  it('is case- and whitespace-insensitive, because it arrives as free text like tone', () => {
    expect(resolveHumourLevel('  SHARP ')).toBe('sharp');
    expect(resolveHumourLevel('Dry')).toBe('dry');
  });
});

describe('a named band reaches the Agent 2b prompt', () => {
  it('names the band and carries its directive', () => {
    const d = developerOf('sharp');
    expect(d).toContain('HUMOUR LEVEL — SHARP');
    expect(d).toContain('At least THREE characters are humorous');
  });

  it('dry withholds the sharp registers by naming the mild ones', () => {
    const d = developerOf('dry');
    expect(d).toContain('HUMOUR LEVEL — DRY');
    expect(d).toContain('understatement, deadpan, self_deprecating');
  });

  it('none is an instruction, not an omission — an absent directive would give the default', () => {
    const d = developerOf('none');
    expect(d).toContain('HUMOUR LEVEL — NONE');
    expect(d).toContain('NO humour');
  });

  it('the directive sits before the voice-distinctness block it narrows', () => {
    const d = developerOf('sharp');
    expect(d.indexOf('HUMOUR LEVEL —')).toBeLessThan(d.indexOf('VOICE DISTINCTNESS'));
  });
});

describe('the beat cadence is a count of chapters, not a rate', () => {
  it('classic asks in every chapter, which is what every prior book did', () => {
    for (let c = 1; c <= 12; c += 1) expect(chapterCarriesWitBeat('classic', c)).toBe(true);
  });

  it('none asks in no chapter', () => {
    for (let c = 1; c <= 12; c += 1) expect(chapterCarriesWitBeat('none', c)).toBe(false);
  });

  it('dry asks in every third chapter — 4 of a 12-chapter book', () => {
    const asked = [...Array(12)].map((_, i) => chapterCarriesWitBeat('dry', i + 1)).filter(Boolean);
    expect(asked).toHaveLength(4);
    expect(chapterCarriesWitBeat('dry', 3)).toBe(true);
    expect(chapterCarriesWitBeat('dry', 4)).toBe(false);
  });

  it('chapter 0 and negatives are treated as chapter 1, never as a silent every-chapter yes', () => {
    expect(chapterCarriesWitBeat('dry', 0)).toBe(false);
    expect(chapterCarriesWitBeat('dry', -2)).toBe(false);
    expect(chapterCarriesWitBeat('classic', 0)).toBe(true);
  });
});

describe('the bands are well-formed', () => {
  it('every level has a band, and the table has no extras', () => {
    expect(Object.keys(HUMOUR_BANDS).sort()).toEqual([...HUMOUR_LEVELS].sort());
    for (const level of HUMOUR_LEVELS) expect(HUMOUR_BANDS[level].level).toBe(level);
  });

  it('the targets are ordered, so "sharper" always means "more expected"', () => {
    const targets = HUMOUR_LEVELS.map((l) => HUMOUR_BANDS[l].targetPer10k);
    expect(targets).toEqual([...targets].sort((a, b) => a - b));
  });

  it('classic targets the canon median rather than our own, which is 3.6x lower', () => {
    expect(humourBand('classic').targetPer10k).toBe(41);
  });

  it('sharp still permits "none", because a cast where everybody is funny is one where nobody is', () => {
    expect(humourBand('sharp').permittedStyles).toContain('none');
  });
});

/**
 * END TO END through the real builder, not just the cadence helper.
 *
 * The helper returning `false` proves nothing about the prompt: `AGENT9_WIT_BEAT` is a second
 * condition, and the lesson this repo keeps relearning is that a lever verified by reading the
 * module is not verified. This asks the actual obligation block what it emitted.
 */
describe('the band decides which chapters the PROMPT asks a beat of', () => {
  const cast = [
    { name: 'Percival Thorne', humourStyle: 'dry_wit', humourLevel: 0.5 },
    { name: 'Ottoline Dunmore', humourStyle: 'polite_savagery', humourLevel: 0.6 },
  ];
  const scenes = [{ sceneId: 's1', summary: 'The library, after breakfast.' }];

  const blockFor = (chapter: number, band?: string): string => {
    const saved = process.env.AGENT9_WIT_BEAT;
    process.env.AGENT9_WIT_BEAT = 'true';
    try {
      return buildChapterObligationBlock(
        scenes, chapter, {}, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        cast as any, band,
      );
    } finally {
      if (saved === undefined) delete process.env.AGENT9_WIT_BEAT;
      else process.env.AGENT9_WIT_BEAT = saved;
    }
  };

  const asksForWit = (block: string): boolean => /WIT BEAT/i.test(block);

  it('KNOWN-POSITIVE: the default asks in chapter 4, so a later absence means the band', () => {
    expect(asksForWit(blockFor(4))).toBe(true);
    expect(asksForWit(blockFor(4, 'classic'))).toBe(true);
  });

  it('dry asks in chapter 3 and stays silent in chapter 4', () => {
    expect(asksForWit(blockFor(3, 'dry'))).toBe(true);
    expect(asksForWit(blockFor(4, 'dry'))).toBe(false);
  });

  it('none never asks, in a chapter the default would have asked in', () => {
    expect(asksForWit(blockFor(4, 'none'))).toBe(false);
  });
});
