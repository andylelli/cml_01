/**
 * The axis is a parameter of this generator. Agent 3 must be told what it MEANS, and be shown the
 * exemplars that match it.
 *
 * TWO DEFECTS, both found while asking why the first `authority` case came out with a tide timetable
 * and a staged time of death.
 *
 * 1. THE PROMPT PASSED A BARE WORD. `- Primary Axis: authority` and nothing else — no statement of what
 *    an authority-axis mystery is. A model handed an unexplained parameter falls back on what it knows,
 *    and what it knows about Golden Age mysteries is clocks.
 *
 * 2. THE SEED LIBRARY NEVER REACHED ANY PROMPT. `seed-loader.ts` read the axis from
 *    `cml.CASE.meta.primaryAxis` — a field no seed file and no generated CML has ever carried. All 13
 *    curated exemplars extracted as `axis: "unknown"`, `selectRelevantPatterns` filtered for an exact
 *    match and returned **zero for all five axes**, and every run this project has ever done was told
 *    "No seed patterns available for this axis." The Moonstone, Styles and the Yellow Room have been on
 *    disk, parsed, and discarded, every time.
 *
 *    A THIRD SPELLING of one vocabulary: the data uses `false_assumption.type`, agents 5–8 fall back to
 *    `meta.primary_axis` (snake), and this read `meta.primaryAxis` (camel), which matches nothing. The
 *    ninth instance of one-vocabulary-two-places in this review, and the same shape as X70 and X88 —
 *    a reader looking in a field the writers do not populate.
 *
 * WHAT IS STILL MISSING, and it is content rather than code: the corpus holds temporal ×2, spatial ×2
 * and identity ×3, and **no `behavioral` or `authority` exemplar at all**. For those two axes the gloss
 * is the only thing distinguishing them. The fix is a seed case each, not a wider regex.
 */

import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildCMLPrompt } from '../agent3-cml.js';
import {
  extractStructuralPatterns,
  loadSeedCMLFiles,
  selectRelevantPatterns,
} from '../utils/seed-loader.js';

const AXES = ['temporal', 'spatial', 'identity', 'behavioral', 'authority'] as const;

const promptFor = (primaryAxis: string): string => {
  const p = buildCMLPrompt({
    runId: 'axis-test',
    projectId: 'test',
    theme: 'A closed-circle murder.',
    setting: '1930s country house',
    eraPreference: '1930s',
    castSize: 6,
    castNames: ['Eleanor Voss', 'Hugo Vane', 'Beatrice Quill', 'Ivor Hale', 'Sylvia Trent', 'Marjorie Ash'],
    primaryAxis,
    complexityLevel: 'moderate',
    mechanismFamilies: ['constraint contradiction'],
    victimArchetype: 'Marjorie Ash',
  } as never) as unknown as Record<string, string>;
  return [p.system, p.developer, p.user].filter(Boolean).join('\n');
};

describe('Agent 3 is told what the axis means', () => {
  for (const axis of AXES) {
    it(`${axis} arrives with a definition, not just a label`, () => {
      const text = promptFor(axis);
      expect(text).toContain(`Primary Axis: ${axis}`);
      // The label alone is what produced a clock story on an authority axis.
      expect(text).toMatch(new RegExp(`Primary Axis: ${axis} — the reader misjudges`));
    });
  }

  it('the five definitions are distinct', () => {
    const glosses = AXES.map((a) => {
      const line = promptFor(a).split('\n').find((l) => l.includes(`Primary Axis: ${a}`))!;
      return line.slice(line.indexOf('—'));
    });
    expect(new Set(glosses).size).toBe(AXES.length);
  });

  it('says the axis IS the mystery, not a label on it', () => {
    expect(promptFor('authority')).toContain('THE AXIS IS THE MYSTERY');
  });

  it('the definitions name no era, setting, mechanism or cast', () => {
    // A generator whose parameters change every run cannot define its axes in terms of a hotel or a
    // decade. Guarding this is the difference between a definition and a themed hint.
    for (const axis of AXES) {
      const line = promptFor(axis).split('\n').find((l) => l.includes(`Primary Axis: ${axis}`))!.toLowerCase();
      for (const word of ['clock', 'hotel', 'seaside', '1930', 'pendulum', 'tide', 'poison']) {
        expect(line, `${axis} gloss mentions "${word}"`).not.toContain(word);
      }
    }
  });
});

describe('the seed library actually reaches the prompt', () => {
  /**
   * Resolved from this file, not from cwd: vitest runs with the PACKAGE as its working directory,
   * so a relative 'examples' silently reads nothing and every assertion below would pass vacuously
   * on an empty array — the exact shape of the bug this file exists to catch.
   */
  const seedRoot = (() => {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i += 1) {
      const candidate = join(dir, 'library', 'works');
      // Must actually hold an ENCODED work, not merely exist. A_98 moved the corpus out of
      // `examples/` and into `library/works/`, where 135 of the 169 work directories hold a text and
      // a provenance file and no case at all — so a bare existsSync would stop at a directory that
      // yields zero patterns and every assertion below would pass vacuously on an empty array, which
      // is precisely the failure this file exists to catch.
      if (
        existsSync(candidate)
        && readdirSync(candidate).some((slug) =>
          existsSync(join(candidate, slug, 'case.cml2.yaml'))
          || existsSync(join(candidate, slug, 'case.legacy.yaml')))
      ) {
        return candidate;
      }
      dir = resolve(dir, '..');
    }
    throw new Error('no library/works with an encoded case found above ' + dirname(fileURLToPath(import.meta.url)));
  })();
  const patterns = extractStructuralPatterns(loadSeedCMLFiles(seedRoot));

  it('found the corpus at all', () => {
    expect(patterns.length).toBeGreaterThanOrEqual(10);
  });

  it('extracts a real axis, not "unknown", for most of the corpus', () => {
    const unknown = patterns.filter((p) => p.axis === 'unknown').length;
    expect(patterns.length).toBeGreaterThan(0);
    // Was 13 of 13 before the read was fixed.
    expect(unknown).toBeLessThan(patterns.length);
  });

  it('supplies exemplars for the axes the corpus covers', () => {
    // These three are what the curated library actually contains. If a future edit breaks the axis
    // read again, this drops to zero and says so — rather than silently emitting the "none" message.
    for (const axis of ['temporal', 'spatial', 'identity']) {
      expect(selectRelevantPatterns(patterns, axis, 3).length, `no seed patterns for ${axis}`).toBeGreaterThan(0);
    }
  });

  /**
   * This assertion used to read `toEqual([])` for both axes, with a note saying it was the test to
   * update when a behavioral or authority seed was added. A_97 added them: the corpus went from
   * `behavioral` 4 and `authority` 0 to 7 and 1, by encoding Chesterton, Bramah, Morrison and Post
   * against their own source texts.
   *
   * Inverted rather than deleted, because the property worth pinning is the same one either way —
   * that what the corpus holds is what an axis filter can actually reach. It was the gap that needed
   * watching then; it is the coverage that needs watching now.
   */
  it('reaches the two axes the corpus used to have nothing for', () => {
    for (const axis of ['behavioral', 'authority']) {
      expect(selectRelevantPatterns(patterns, axis, 3).length).toBeGreaterThan(0);
    }
  });
});
