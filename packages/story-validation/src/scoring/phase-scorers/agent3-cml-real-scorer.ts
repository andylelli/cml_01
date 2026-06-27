/**
 * Agent 3 — "grade the REAL artifact" CML scorer (ANALYSIS_50 T3.5).
 *
 * The current CML score is HARDCODED (validation/completeness/consistency = 100, quality from the
 * Agent-4 repair COUNT only — it never inspects content). This replaces it with content assertions
 * on the CASE block: closed circle + culprit, suspects with motive+opportunity, a real inference
 * path, a discriminating test, and genuine misdirection (false_solution + herrings that don't point
 * at the culprit). Reads only plain data (`@cml/cml` shape mirrored loosely) — no prompts-llm dep.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore, normalizeAtom } from '../honest-scorer.js';

type AnyRec = Record<string, any>;

const caseOf = (cml: any): AnyRec => (cml?.CASE ?? cml ?? {}) as AnyRec;
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const nonEmpty = (v: unknown): boolean => String(v ?? '').trim().length > 0;
const surname = (v: string): string => normalizeAtom(v).split(' ').pop() ?? '';
const namesMatch = (a: string, b: string): boolean => {
  const x = normalizeAtom(a);
  const y = normalizeAtom(b);
  if (!x || !y) return false;
  return x === y || (surname(x) !== '' && surname(x) === surname(y));
};
const castMotive = (c: AnyRec): unknown => c?.motive_seed ?? c?.motiveSeed ?? c?.motive;
const castOpportunity = (c: AnyRec): unknown =>
  c?.opportunity_channels ?? c?.opportunity ?? c?.access_plausibility ?? c?.accessPlausibility;

export function scoreRealCml(cml: any): PhaseScore {
  const C = caseOf(cml);
  const cast = arr(C.cast);
  const suspects = arr(C.closed_circle?.suspects).map((s) => String(s ?? '').trim()).filter(Boolean);
  const culprits = arr(C.culpability?.culprits).map((s) => String(s ?? '').trim()).filter(Boolean);
  const tests: TestResult[] = [];

  // ── Validation ── the load-bearing structural blocks must exist with content
  const dt = C.discriminating_test ?? {};
  const dtOk = nonEmpty(dt.design) && nonEmpty(dt.knowledge_revealed) && arr(dt.evidence_clues).length > 0;
  tests.push(dtOk
    ? pass('Discriminating test', 'validation', 1.5)
    : fail('Discriminating test', 'validation', 1.5, 'discriminating_test missing design/knowledge/evidence_clues', 'critical'));
  tests.push(culprits.length > 0
    ? pass('Culprit named', 'validation', 1.0)
    : fail('Culprit named', 'validation', 1.0, 'culpability.culprits empty', 'critical'));
  tests.push(suspects.length >= 2
    ? pass('Closed circle', 'validation', 1.0)
    : fail('Closed circle', 'validation', 1.0, 'closed_circle.suspects < 2', 'major'));

  // ── Quality ── motive specificity (not the generic cliché the prompt bans)
  const withMotive = cast.filter((c) => nonEmpty(castMotive(c))).length;
  tests.push(partial('Suspect motives present', 'quality',
    cast.length ? Math.round((withMotive / cast.length) * 100) : 0, 1.5, `${withMotive}/${cast.length} cast have a motive`));
  const cliche = cast.filter((c) => /financial desperation|inheritance|money troubles/i.test(String(castMotive(c) ?? ''))).length;
  tests.push(partial('Motive anti-cliché', 'quality',
    cast.length ? Math.round((1 - cliche / cast.length) * 100) : 100, 1.0, `${cliche} cliché motive(s)`));

  // ── Completeness ── opportunity + a real inference path
  const withOpp = cast.filter((c) => nonEmpty(castOpportunity(c))).length;
  tests.push(partial('Suspect opportunity', 'completeness',
    cast.length ? Math.round((withOpp / cast.length) * 100) : 0, 1.0, `${withOpp}/${cast.length} cast have opportunity`));
  const steps = arr(C.inference_path?.steps);
  const wellFormedSteps = steps.filter((s) => nonEmpty(s?.observation) && nonEmpty(s?.correction ?? s?.inference ?? s?.effect)).length;
  tests.push(partial('Inference path', 'completeness',
    steps.length >= 3 && wellFormedSteps === steps.length ? 100 : steps.length >= 1 ? 55 : 0, 1.5,
    `${wellFormedSteps}/${steps.length} well-formed inference steps (≥3 expected)`));
  tests.push(culprits.length > 0 && culprits.every((c) => suspects.some((s) => namesMatch(c, s)))
    ? pass('Culprit inside circle', 'completeness', 1.0)
    : fail('Culprit inside circle', 'completeness', 1.0, 'a culprit is not in the closed circle', 'major'));

  // ── Consistency ── genuine misdirection
  const fs = C.false_solution ?? {};
  const fsAccused = String(fs.accused_suspect ?? '').trim();
  const fsOk = nonEmpty(fsAccused) && !culprits.some((c) => namesMatch(c, fsAccused)) &&
    arr(fs.supporting_points).length >= 2 && nonEmpty(fs.the_one_flaw);
  tests.push(fsOk
    ? pass('False solution', 'consistency', 1.0)
    : fail('False solution', 'consistency', 1.0, 'false_solution missing, accuses the culprit, or lacks support/flaw', 'minor'));
  const herrings = arr(C.red_herrings);
  const herringsAtCulprit = herrings.filter((h) => nonEmpty(h?.points_at_suspect) && culprits.some((c) => namesMatch(c, String(h.points_at_suspect)))).length;
  tests.push(herrings.length >= 2 && herringsAtCulprit === 0
    ? pass('Red herrings misdirect', 'consistency', 1.0)
    : fail('Red herrings misdirect', 'consistency', 1.0,
        herrings.length < 2 ? '< 2 red herrings' : `${herringsAtCulprit} herring(s) point at the culprit`, 'minor'));

  return assembleHonestScore('agent3-cml', tests);
}
