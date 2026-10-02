/**
 * Honest-scorer shared helpers (ANALYSIS_50 Phase 3).
 *
 * The "honest" scorers grade the REAL agent artifact with content assertions instead of the vanity
 * (length/constant) scorers, so a future regression FAILS instead of scoring A. Each lives in this
 * package (no `@cml/prompts-llm` dependency — see agent2-cast-real-scorer.ts) and takes the real
 * artifact via a local structural-mirror type. Since owner decision 8 (2026-10-01) they are the only scorers for
 * their phases (HONEST_SCORERS retired); these functions are pure graders.
 */

import { PhaseScore, TestResult } from './types.js';
import { calculateCategoryScore, getCriticalFailures } from './scorer-utils.js';
import { calculateGrade } from './thresholds.js';

/**
 * Assemble a PhaseScore from category-tagged tests using the canonical 40/30/20/10 weighting
 * (identical to the existing scorers), so an honest score is a drop-in replacement.
 */
export const assembleHonestScore = (agent: string, tests: TestResult[]): PhaseScore => {
  const validation_score = calculateCategoryScore(tests, 'validation');
  const quality_score = calculateCategoryScore(tests, 'quality');
  const completeness_score = calculateCategoryScore(tests, 'completeness');
  const consistency_score = calculateCategoryScore(tests, 'consistency');

  const total =
    validation_score * 0.4 + quality_score * 0.3 + completeness_score * 0.2 + consistency_score * 0.1;

  const criticalFailures = getCriticalFailures(tests);
  const passed = criticalFailures.length === 0 && total >= 60;

  const component_failures: string[] = [];
  if (validation_score < 60) component_failures.push('validation');
  if (quality_score < 50) component_failures.push('quality');
  if (completeness_score < 60) component_failures.push('completeness');
  if (consistency_score < 50) component_failures.push('consistency');

  return {
    agent,
    validation_score,
    quality_score,
    completeness_score,
    consistency_score,
    total: Math.round(total),
    grade: calculateGrade(total),
    passed,
    tests,
    component_failures: component_failures.length > 0 ? component_failures : undefined,
    failure_reason: !passed
      ? `Honest scorer failed: ${
          criticalFailures.length > 0
            ? `critical — ${criticalFailures.map((t) => t.name).join(', ')}`
            : `weak components — ${component_failures.join(', ')}`
        }`
      : undefined,
  };
};

/** Shared tiny atom-normalizer (replicated locally to avoid a prompts-llm dependency). */
export const normalizeAtom = (s: unknown): string =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * One person, two spellings: exact after normalising, or one name contained in the other on word boundaries
 * ("Inspector Helen Marwood" / "Helen Marwood"). NOT a surname match — golden casts share surnames
 * (Lady Beatrice / Charles / Margaret Langley), so a surname rule would count one profile as three.
 */
export const sameName = (a: unknown, b: unknown): boolean => {
  const x = normalizeAtom(a);
  const y = normalizeAtom(b);
  if (!x || !y) return false;
  return x === y || ` ${x} `.includes(` ${y} `) || ` ${y} `.includes(` ${x} `);
};

/** Percentage (0–100, rounded) of `n` over `d`; `whenEmpty` when there is nothing to count. */
export const pct = (n: number, d: number, whenEmpty = 0): number => (d > 0 ? Math.round((n / d) * 100) : whenEmpty);

export const wordCount = (s: unknown): number => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;

/** "1930s" → [1930, 1939]; null when the decade cannot be read. */
export const decadeRange = (decade: unknown): [number, number] | null => {
  const m = String(decade ?? '').match(/(1[5-9]\d|20\d)0s?/);
  if (!m) return null;
  const start = Number(m[1]) * 10;
  return [start, start + 9];
};

/** The CML cast, its victims (role_archetype "victim") and its culprits — the facts the upstream artifacts must honour. */
export const caseFacts = (cml: any): { cast: string[]; victims: string[]; culprits: string[]; decade: unknown } => {
  const C = cml?.CASE ?? cml ?? {};
  const members: any[] = Array.isArray(C.cast) ? C.cast : [];
  const role = (m: any) => String(m?.role_archetype ?? m?.roleArchetype ?? m?.role ?? '').trim().toLowerCase();
  return {
    cast: members.map((m) => String(m?.name ?? '').trim()).filter(Boolean),
    victims: members.filter((m) => role(m) === 'victim').map((m) => String(m?.name ?? '').trim()).filter(Boolean),
    culprits: (Array.isArray(C.culpability?.culprits) ? C.culpability.culprits : []).map((s: unknown) => String(s ?? '').trim()).filter(Boolean),
    decade: C.meta?.era?.decade,
  };
};

const SEASON_WORDS = ['spring', 'summer', 'autumn', 'winter'] as const;
const MONTH_SEASON: Record<string, (typeof SEASON_WORDS)[number]> = {
  january: 'winter', february: 'winter', march: 'spring', april: 'spring', may: 'spring', june: 'summer',
  july: 'summer', august: 'summer', september: 'autumn', october: 'autumn', november: 'autumn', december: 'winter',
};
/** The month named in `s` (full English name), lower-cased; null when none is. */
export const monthIn = (s: unknown): string | null => {
  const m = String(s ?? '').toLowerCase().match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/);
  return m ? m[1] : null;
};
/** The (northern-hemisphere) season of a full month name — the same table Agent 2d pins its season with. */
export const seasonOfMonth = (month: unknown): string | null => MONTH_SEASON[String(month ?? '').trim().toLowerCase()] ?? null;
/**
 * The texts that name a season OTHER than `season` ("cold autumn mist" in a June document). Only the four
 * nouns are read — "fall" is a verb too often to count.
 */
export const seasonContradictions = (texts: unknown[], season: string): string[] => {
  const others = SEASON_WORDS.filter((w) => w !== season);
  const re = new RegExp(`\\b(${others.join('|')})\\b`, 'i');
  return texts.map((t) => String(t ?? '')).filter((t) => re.test(t));
};
