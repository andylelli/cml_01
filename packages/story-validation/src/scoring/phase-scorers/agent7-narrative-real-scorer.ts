/**
 * Agent 7 — "grade the REAL artifact" narrative scorer (ANALYSIS_50 T3.7).
 *
 * The vanity `scoreSceneDetail` ([agent7-narrative-scorer.ts]) rewards LONGER scene summaries
 * (monotonic in word count). This inverts it: a scene's planned length (`estimatedWordCount`) is
 * scored against its per-scene budget (the P1.3 three-act curve) — full credit near budget,
 * penalized for BLOAT above it and starvation below it. Same-package budget helpers, no new dep.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore } from '../honest-scorer.js';
import { distributeChapterWordBudget, getStoryLengthTarget } from '../../story-length-targets.js';

export interface RealScene {
  setting?: { location?: string };
  location?: string;
  summary?: string;
  purpose?: string;
  estimatedWordCount?: number;
}
export interface RealNarrative {
  acts?: Array<{ scenes?: RealScene[] }>;
}

const sceneLocation = (s: RealScene): string =>
  String(s?.setting?.location ?? s?.location ?? '').trim();
const sceneSummary = (s: RealScene): string => String(s?.summary ?? s?.purpose ?? '').trim();

/** Tent function peaking at 1.0×budget: full credit in [0.85,1.15], 0 at ≤0.55 or ≥1.45. */
const concisionScore = (planned: number, budget: number): number => {
  if (!(budget > 0) || !(planned > 0)) return -1; // signal "no budget data"
  const r = planned / budget;
  if (r >= 0.85 && r <= 1.15) return 100;
  if (r < 0.85) return Math.max(0, Math.round(((r - 0.55) / 0.3) * 100));
  return Math.max(0, Math.round(((1.45 - r) / 0.3) * 100)); // bloat side
};

export function scoreRealNarrative(
  narrative: RealNarrative | undefined | null,
  targetLength?: string,
): PhaseScore {
  const scenes: RealScene[] = (narrative?.acts ?? []).flatMap((a) => (Array.isArray(a?.scenes) ? a.scenes : []));
  const tests: TestResult[] = [];

  // ── Validation ──
  tests.push(scenes.length > 0
    ? pass('Scenes present', 'validation', 1.5)
    : fail('Scenes present', 'validation', 1.5, 'no scenes in narrative', 'critical'));
  const located = scenes.filter((s) => sceneLocation(s).length > 0).length;
  tests.push(partial('Scenes have a location', 'validation',
    scenes.length ? Math.round((located / scenes.length) * 100) : 0, 1.0, `${located}/${scenes.length}`));

  // ── Quality (T3.7 core: concision near budget, NOT length) ──
  const budgets = distributeChapterWordBudget(scenes.length, targetLength);
  const idealFallback = getStoryLengthTarget(targetLength).chapterIdealWords;
  const concisionScores: number[] = [];
  let bloated = 0;
  scenes.forEach((s, i) => {
    const budget = budgets[i] ?? idealFallback;
    const cs = concisionScore(Number(s.estimatedWordCount), budget);
    if (cs >= 0) {
      concisionScores.push(cs);
      if (Number(s.estimatedWordCount) > budget * 1.25) bloated += 1;
    }
  });
  if (concisionScores.length > 0) {
    const avg = Math.round(concisionScores.reduce((a, b) => a + b, 0) / concisionScores.length);
    tests.push(partial('Scene length near budget', 'quality', avg, 2.0,
      `${concisionScores.length} scenes scored; ${bloated} bloated >1.25× budget`));
  } else {
    // No estimatedWordCount available → fall back to a substance check, no length reward.
    const withSummary = scenes.filter((s) => sceneSummary(s).split(/\s+/).filter(Boolean).length >= 5).length;
    tests.push(partial('Scene summaries substantive', 'quality',
      scenes.length ? Math.round((withSummary / scenes.length) * 100) : 0, 2.0,
      'no estimatedWordCount — fell back to summary substance'));
  }

  // ── Completeness ── scene count within the canonical range for the length
  const expectedChapters = getStoryLengthTarget(targetLength).chapters;
  const ratio = expectedChapters > 0 ? scenes.length / expectedChapters : 0;
  tests.push(partial('Scene count vs target', 'completeness',
    ratio >= 0.8 && ratio <= 1.3 ? 100 : ratio >= 0.5 ? 60 : 25, 1.0,
    `${scenes.length} scenes vs ~${expectedChapters} target`));

  // ── Consistency ── every scene conveys a beat (non-empty summary/purpose)
  const withBeat = scenes.filter((s) => sceneSummary(s).length > 0).length;
  tests.push(scenes.length > 0 && withBeat === scenes.length
    ? pass('Every scene has a beat', 'consistency', 1.0)
    : partial('Every scene has a beat', 'consistency',
        scenes.length ? Math.round((withBeat / scenes.length) * 100) : 0, 1.0, `${withBeat}/${scenes.length}`));

  return assembleHonestScore('agent7-narrative', tests);
}
