/**
 * Agent 2e — "grade the REAL artifact" background-context scorer (ANALYSIS_50 T3.4).
 *
 * The vanity path ([agent2e-scoring-adapter.ts]) feeds Agent-1 back-filled fields, so 2e's score
 * reflects Agent 1's data, not 2e's own one-sentence output. This grades 2e's OWN artifact
 * (backdropSummary / socialStructure / theme / castAnchors) and asserts it ADDS value rather than
 * echoing Agent 1 (no verbatim duplication, anchors are real cast names).
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial, exists, hasMinWords } from '../scorer-utils.js';
import { assembleHonestScore, normalizeAtom } from '../honest-scorer.js';

export interface RealBackground {
  status?: string;
  backdropSummary?: string;
  era?: { decade?: string; socialStructure?: string };
  setting?: { location?: string; institution?: string; weather?: string };
  castAnchors?: string[];
  theme?: string;
}

export interface ScoreRealBackgroundOptions {
  /** Real cast names (to verify anchors introduce no new names). */
  castRoster?: string[];
  /** Agent-1 setting strings to check 2e does not merely echo them. */
  agent1Echo?: string[];
}

export function scoreRealBackground(
  bg: RealBackground | undefined | null,
  opts: ScoreRealBackgroundOptions = {},
): PhaseScore {
  const b = bg ?? {};
  const era = b.era ?? {};
  const setting = b.setting ?? {};
  const anchors = Array.isArray(b.castAnchors) ? b.castAnchors : [];
  const tests: TestResult[] = [];

  // ── Validation ──
  tests.push(String(b.status ?? '').toLowerCase() === 'ok' && exists(b.backdropSummary)
    ? pass('Status + backdrop present', 'validation', 1.5)
    : fail('Status + backdrop present', 'validation', 1.5, 'status!=ok or empty backdropSummary', 'critical'));
  tests.push(exists(era.decade) && exists(setting.location) && exists(setting.institution)
    ? pass('Era/setting fields set', 'validation', 1.0)
    : fail('Era/setting fields set', 'validation', 1.0, 'decade/location/institution missing', 'major'));
  tests.push(anchors.length > 0
    ? pass('Cast anchors present', 'validation', 1.0)
    : fail('Cast anchors present', 'validation', 1.0, 'no castAnchors', 'major'));

  // ── Quality (grade 2e's OWN substance) ──
  tests.push(partial('Backdrop substance', 'quality', hasMinWords(b.backdropSummary, 12) ? 100 : exists(b.backdropSummary) ? 55 : 0, 1.5));
  tests.push(exists(era.socialStructure)
    ? pass('Social structure', 'quality', 1.0)
    : partial('Social structure', 'quality', 30, 1.0, 'socialStructure thin/missing'));
  tests.push(hasMinWords(b.theme, 3) ? pass('Theme', 'quality', 1.0)
    : partial('Theme', 'quality', exists(b.theme) ? 55 : 20, 1.0, 'theme thin/missing'));

  // ── Completeness ── anchors in 4-8 and all real cast names
  const roster = (opts.castRoster ?? []).map(normalizeAtom).filter(Boolean);
  const anchorsNorm = anchors.map(normalizeAtom).filter(Boolean);
  const unknownAnchors = roster.length
    ? anchorsNorm.filter((a) => !roster.some((r) => r === a || r.includes(a) || a.includes(r)))
    : [];
  tests.push(partial('Anchor count (4-8)', 'completeness',
    anchors.length >= 4 && anchors.length <= 8 ? 100 : anchors.length >= 2 ? 60 : 20, 1.0, `${anchors.length} anchors`));
  tests.push(roster.length === 0
    ? partial('Anchors are real cast names', 'completeness', 70, 1.0, 'no roster supplied to verify')
    : unknownAnchors.length === 0
      ? pass('Anchors are real cast names', 'completeness', 1.0)
      : fail('Anchors are real cast names', 'completeness', 1.0, `unknown anchors: ${unknownAnchors.join(', ')}`, 'major'));

  // ── Consistency ── must ADD value, not echo Agent 1 verbatim
  const echo = (opts.agent1Echo ?? []).map(normalizeAtom).filter((x) => x.length > 12);
  const own = [normalizeAtom(b.backdropSummary), normalizeAtom(b.theme)].filter(Boolean);
  const isEcho = own.some((o) => echo.some((e) => o === e));
  tests.push(!isEcho
    ? pass('Adds value over Agent 1', 'consistency', 1.0)
    : fail('Adds value over Agent 1', 'consistency', 1.0, 'backdrop/theme verbatim-echoes Agent 1 setting', 'minor'));

  return assembleHonestScore('agent2e-background', tests);
}
