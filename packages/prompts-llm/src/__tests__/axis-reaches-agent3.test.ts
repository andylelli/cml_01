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
  const examplesDir = (() => {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i += 1) {
      const candidate = join(dir, 'examples');
      // Must actually hold seed YAML. `packages/prompts-llm/examples/` exists and contains only
      // TypeScript demos, so a bare existsSync stops there and every assertion below passes
      // vacuously on an empty array — which is precisely the failure this file exists to catch.
      if (existsSync(candidate) && readdirSync(candidate).some((n) => n.endsWith('.yaml'))) return candidate;
      dir = resolve(dir, '..');
    }
    throw new Error('no examples/ with seed YAML found above ' + dirname(fileURLToPath(import.meta.url)));
  })();
  const patterns = extractStructuralPatterns(loadSeedCMLFiles(examplesDir));

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

  it('documents the two axes the corpus does NOT cover', () => {
    // Asserted so the gap is visible and dated rather than discovered again on a paid run. When a
    // behavioral or authority seed is added, this test is the one to update.
    for (const axis of ['behavioral', 'authority']) {
      expect(selectRelevantPatterns(patterns, axis, 3)).toEqual([]);
    }
  });
});
