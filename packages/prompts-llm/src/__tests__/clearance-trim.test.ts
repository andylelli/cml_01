/**
 * A_75 §12 — trimming the clearance register.
 *
 * `clearance_over_budget` fires on 17 of 23 archived runs (74%), the most frequent geometry code, and
 * `story-geometry/src/codes.ts` records that no repair exists for it: "the only negative pass that
 * exists (aftermath_repeat) removes repetition rather than trimming a register". Both external readers
 * of the 2026-08-27 pair complained about it unprompted.
 *
 * The dangerous failure here is deleting a suspect's ONLY clearance, which is a
 * `suspect_closure_missing` run-killer — a far worse trade than a slow ending. These tests pin that
 * this cannot happen.
 */

import { describe, expect, it } from 'vitest';

import {
  trimRedundantClearances,
  isClearanceSentenceMirror,
  CLEARANCE_MARKER_MIRROR,
  CLEARANCE_IDIOM_MIRROR,
} from '../agent9-prose/clearance-trim.js';

const CAST = ['Beatrice Quill', 'Sylvia Trent', 'Hugo Vane'];
const ch = (...paragraphs: string[]) => ({ title: 'C', paragraphs });

describe('the recognisers match the gate that counts them', () => {
  it('detects a clearance and ignores the throat idiom (X21)', () => {
    expect(isClearanceSentenceMirror('Beatrice Quill was cleared by the kitchen staff.')).toBe(true);
    expect(isClearanceSentenceMirror('Hugo cleared his throat and looked away.')).toBe(false);
    expect(isClearanceSentenceMirror('She cleared the table without a word.')).toBe(false);
  });

  it('the mirrored sources are byte-identical to story-geometry accept.ts', async () => {
    // A repair that recognised a DIFFERENT set of sentences than the gate counts would trim the wrong
    // ones and leave the code firing. Read the other file and compare the literals.
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 8 && !dir.endsWith('CML'); i += 1) {
      if (readFileSync !== undefined && dir.split(/[\/]/).pop() === 'CML') break;
      dir = dirname(dir);
    }
    const accept = readFileSync(join(dir, 'packages', 'story-geometry', 'src', 'accept.ts'), 'utf8');
    expect(accept).toContain(CLEARANCE_MARKER_MIRROR.source);
    expect(accept).toContain(CLEARANCE_IDIOM_MIRROR.source);
  });
});

describe('THE INVARIANT: a suspect never loses their only clearance', () => {
  it('leaves a chapter alone when every clearance is a first', () => {
    const book = [ch(
      'Beatrice Quill was cleared by the kitchen staff.',
      'Sylvia Trent was ruled out by the lounge party.',
      'Hugo Vane could not have done it; he was on the telephone.',
    )];
    const r = trimRedundantClearances(book, CAST, 1);
    // Three over a budget of one, and NOT ONE is removed — none is redundant.
    expect(r.removed).toEqual([]);
    expect(r.chapters[0].paragraphs).toHaveLength(3);
  });

  it('never removes a clearance that names nobody, since redundancy cannot be shown', () => {
    const book = [
      ch('Beatrice Quill was cleared by the kitchen staff.'),
      ch('Everyone else was in the clear.', 'The rest were above suspicion.'),
    ];
    const r = trimRedundantClearances(book, CAST, 0);
    expect(r.removed).toEqual([]);
  });
});

describe('and it does trim a genuine register', () => {
  const book = [
    ch('Beatrice Quill was cleared by the kitchen staff, and the cook confirmed every minute of it.'),
    ch('Sylvia Trent was ruled out; the lounge had not been empty once.'),
    ch(
      'Hale said nothing more. The room settled.',
      'Beatrice Quill was cleared. Sylvia Trent was ruled out. Hugo Vane was innocent.',
    ),
  ];

  it('cuts the restatements in the aftermath, keeping the first clearance of each suspect', () => {
    const r = trimRedundantClearances(book, CAST, 1);
    const last = r.chapters[2].paragraphs.join(' ');
    // Beatrice and Sylvia were cleared in ch1/ch2, so their ch3 restatements are redundant.
    expect(r.removed.length).toBeGreaterThan(0);
    expect(last).not.toContain('Beatrice Quill was cleared.');
    // Hugo's ONLY clearance is here — it must survive even though the chapter is over budget.
    expect(last).toContain('Hugo Vane was innocent.');
    // Narrative that is not a clearance is untouched.
    expect(last).toContain('The room settled.');
  });

  it('trims every REDUNDANT restatement, and the budget no longer sets a volume threshold', () => {
    // BEHAVIOUR CHANGED, A_76 §5 (FIX 4b). This used to assert "three clearances in ch3, budget 2 ->
    // exactly one removed": the budget was a cap on TOTAL clearance volume. But the reader's
    // objection is redundancy, not volume — the chapter that provoked the change carried 4 clearance
    // sentences against a budget of 5 and shipped untouched while re-clearing two suspects.
    //
    // Measured across 22 stored runs, a per-chapter allowance of even 1 tolerated almost every
    // redundancy (it removed FEWER sentences than the volume gate it replaced), because provable
    // redundancies are rare — a couple across the whole corpus. So the allowance is zero.
    //
    // Coverage is still safe by construction, which the assertions below pin: Hugo's only clearance
    // survives regardless of budget.
    const r = trimRedundantClearances(book, CAST, 2);
    expect(r.removed).toHaveLength(2);
    const last = r.chapters[2].paragraphs.join(' ');
    expect(last).toContain('Hugo Vane was innocent.');
    expect(last).toContain('The room settled.');
  });

  it('reports every removal — a silent deletion is worse than the register', () => {
    const r = trimRedundantClearances(book, CAST, 1);
    for (const line of r.removed) {
      expect(line).toMatch(/^ch\d+ clearance trimmed/);
      expect(line).toContain('already cleared earlier');
    }
  });

  it('drops a paragraph that was nothing but redundant clearances, rather than leaving it blank', () => {
    const b = [
      ch('Beatrice Quill was cleared by the kitchen staff.'),
      ch('Beatrice Quill was cleared. Beatrice Quill was in the clear.'),
    ];
    const r = trimRedundantClearances(b, CAST, 0);
    expect(r.chapters[1].paragraphs.every((p) => p.trim().length > 0)).toBe(true);
  });
});
