/**
 * Agent 2d — "grade the REAL artifact" temporal-context scorer (SCO-Q07, owner decision 2026-10-02).
 *
 * The vanity scorer it replaces graded an adapter that joined every array into one string and APPENDED
 * "The crime unfolds during the evening hours" when no period word was present, so its specificity regexes
 * always fired: 2d scored ≥95 in 72 of 72 archived runs. This grades the artifact as Agent 2d returned it:
 * a real date inside the setting's decade, a season that follows the month, the prompt's countable depth
 * floors, no copy-pasted entries, and narrative that does not describe a different season.
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore, decadeRange, normalizeAtom, pct, seasonContradictions, seasonOfMonth } from '../honest-scorer.js';

type Strs = string[] | undefined;
export interface RealTemporalContext {
  specificDate?: { year?: number | string; month?: string; day?: number | null };
  seasonal?: { season?: string; month?: string; weather?: Strs; daylight?: string; holidays?: Strs; seasonalActivities?: Strs };
  fashion?: {
    mensWear?: { formal?: Strs; casual?: Strs; accessories?: Strs };
    womensWear?: { formal?: Strs; casual?: Strs; accessories?: Strs };
    trendsOfTheMoment?: Strs;
    socialExpectations?: Strs;
  };
  currentAffairs?: { majorEvents?: Strs; politicalClimate?: string; economicConditions?: string; socialIssues?: Strs };
  cultural?: Record<string, Record<string, Strs> | undefined>;
  socialAttitudes?: Record<string, Strs>;
  atmosphericDetails?: Strs;
  paragraphs?: Strs;
}

const list = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x ?? '').trim()).filter(Boolean) : []);
const text = (v: unknown): boolean => String(v ?? '').trim().length > 0;
const wear = (w?: { formal?: Strs; casual?: Strs; accessories?: Strs }) => [...list(w?.formal), ...list(w?.casual), ...list(w?.accessories)];

/**
 * @param temporal Agent 2d's result.
 * @param setting  Agent 1's setting refinement — its `era.decade` bounds the year.
 */
export function scoreRealTemporalContext(temporal: RealTemporalContext | undefined | null, setting?: any): PhaseScore {
  const t = temporal ?? {};
  const date = t.specificDate ?? {};
  const seasonal = t.seasonal ?? {};
  const year = Number(date.year);
  const month = String(date.month ?? '').trim().toLowerCase();
  const monthSeason = seasonOfMonth(month);
  const tests: TestResult[] = [];

  // ── Validation ── a real date, inside the era, with the season that month has
  const dateOk = Number.isInteger(year) && year > 1000 && monthSeason !== null;
  tests.push(dateOk
    ? pass('Specific date present', 'validation', 1.5)
    : fail('Specific date present', 'validation', 1.5, `unreadable date: ${JSON.stringify(t.specificDate ?? null)}`, 'critical'));
  const range = decadeRange(setting?.era?.decade);
  tests.push(!range || (dateOk && year >= range[0] && year <= range[1])
    ? pass('Year inside the setting decade', 'validation', 1.5, range ? undefined : 'setting decade unreadable')
    : fail('Year inside the setting decade', 'validation', 1.5, `${date.year} is outside ${setting?.era?.decade}`, 'major'));
  const season = String(seasonal.season ?? '').trim().toLowerCase().replace(/^fall$/, 'autumn');
  tests.push(monthSeason && season === monthSeason
    ? pass('Season follows the month', 'validation', 1.0)
    : fail('Season follows the month', 'validation', 1.0, `season "${seasonal.season}" for ${date.month}`, 'major'));
  tests.push(!text(seasonal.month) || String(seasonal.month).trim().toLowerCase() === month
    ? pass('seasonal.month agrees with the date', 'validation', 1.0)
    : fail('seasonal.month agrees with the date', 'validation', 1.0, `seasonal.month "${seasonal.month}" vs date month "${date.month}"`, 'major'));

  // ── Quality ── the prompt's countable floors; no copy-pasted entries; 3–5 paragraphs
  const dailyLife = t.cultural?.dailyLife ?? {};
  const floors: Array<[string, number, number]> = [
    ['menswear', wear(t.fashion?.mensWear).length, 3],
    ['womenswear', wear(t.fashion?.womensWear).length, 3],
    ['seasonal activities', list(seasonal.seasonalActivities).length, 3],
    ['typical prices', list(dailyLife.typicalPrices).length, 3],
    ['social rituals', list(dailyLife.socialRituals).length, 2],
  ];
  const floorsMet = floors.filter(([, n, min]) => n >= min);
  tests.push(partial('Depth floors met', 'quality', pct(floorsMet.length, floors.length), 2.0,
    floors.map(([k, n, min]) => `${k} ${n}/${min}`).join(', ')));
  const entries = [
    ...list(seasonal.weather), ...list(seasonal.holidays), ...list(seasonal.seasonalActivities),
    ...wear(t.fashion?.mensWear), ...wear(t.fashion?.womensWear), ...list(t.fashion?.trendsOfTheMoment), ...list(t.fashion?.socialExpectations),
    ...list(t.currentAffairs?.majorEvents), ...list(t.currentAffairs?.socialIssues),
    ...Object.values(t.cultural ?? {}).flatMap((g) => Object.values(g ?? {}).flatMap(list)),
    ...Object.values(t.socialAttitudes ?? {}).flatMap(list), ...list(t.atmosphericDetails),
  ].map(normalizeAtom).filter(Boolean);
  const repeats = entries.length - new Set(entries).size;
  tests.push(partial('No repeated entries', 'quality', Math.max(0, 100 - repeats * 20), 1.0, `${repeats} repeated entr${repeats === 1 ? 'y' : 'ies'}`));
  const paras = list(t.paragraphs);
  tests.push(paras.length >= 3 && paras.length <= 5
    ? pass('3–5 narrative paragraphs', 'quality', 1.0)
    : partial('3–5 narrative paragraphs', 'quality', paras.length > 0 ? 50 : 0, 1.0, `${paras.length} paragraph(s)`));

  // ── Completeness ── every section carries content
  const sections: Array<[string, boolean]> = [
    ['weather', list(seasonal.weather).length > 0],
    ['fashion', wear(t.fashion?.mensWear).length + wear(t.fashion?.womensWear).length > 0],
    ['current affairs', list(t.currentAffairs?.majorEvents).length > 0 && text(t.currentAffairs?.politicalClimate) && text(t.currentAffairs?.economicConditions)],
    ['culture', Object.values(t.cultural ?? {}).some((g) => Object.values(g ?? {}).some((v) => list(v).length > 0))],
    ['social attitudes', Object.values(t.socialAttitudes ?? {}).filter((v) => list(v).length > 0).length >= 2],
    ['atmospheric details', list(t.atmosphericDetails).length > 0],
  ];
  const present = sections.filter(([, ok]) => ok).length;
  tests.push(partial('Sections populated', 'completeness', pct(present, sections.length), 1.5,
    `missing: ${sections.filter(([, ok]) => !ok).map(([k]) => k).join(', ') || 'none'}`));

  // ── Consistency ── the narrative describes THIS moment
  const named = paras.some((p) => (month && p.toLowerCase().includes(month)) || (dateOk && p.includes(String(year))));
  tests.push(named || paras.length === 0
    ? pass('Paragraphs name the date', 'consistency', 1.0)
    : fail('Paragraphs name the date', 'consistency', 1.0, `no paragraph names ${date.month} or ${date.year}`, 'minor'));
  const prose = [...paras, ...list(t.atmosphericDetails), ...list(seasonal.weather), seasonal.daylight];
  const contradicting = monthSeason ? seasonContradictions(prose, monthSeason) : [];
  tests.push(contradicting.length === 0
    ? pass('No other season described', 'consistency', 1.0)
    : partial('No other season described', 'consistency', Math.max(0, 100 - contradicting.length * 50), 1.0,
        `${contradicting.length} text(s) name a season other than ${monthSeason}`, 'minor'));

  return assembleHonestScore('agent2d-temporal-context', tests);
}
