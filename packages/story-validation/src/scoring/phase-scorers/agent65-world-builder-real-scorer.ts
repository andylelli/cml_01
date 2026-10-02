/**
 * Agent 6.5 — "grade the REAL artifact" world-document scorer (SCO-Q07, owner decision 2026-10-02).
 *
 * The vanity scorer it replaces made `validationConfirmations` its critical gate — six booleans the model
 * reports about itself, which Agent 6.5's own parser then FORCES to true — and counted portraits instead of
 * checking whose they were: 6.5 scored 100 in 72 of 72 archived runs. This grades the document against the
 * CML: a portrait and a usable, distinct voice for every cast member (victims may be absent, as 6.5's own
 * name check accepts) and for no one else, the arc / humour-map / location coverage Agent 9 reads, solemn
 * scenes without humour, and a date and seasons that agree with the case.
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import {
  assembleHonestScore, caseFacts, decadeRange, monthIn, normalizeAtom, pct, sameName, seasonContradictions, seasonOfMonth, wordCount,
} from '../honest-scorer.js';

export interface RealWorldDocument {
  storyTheme?: string;
  historicalMoment?: { specificDate?: string; eraRegister?: string; emotionalRegister?: string };
  characterPortraits?: Array<{ name?: string; portrait?: string }>;
  characterVoiceSketches?: Array<{ name?: string; fragments?: Array<{ register?: string; text?: string }> }>;
  locationRegisters?: Array<{ locationId?: string; emotionalRegister?: string; cameraAngle?: string }>;
  storyEmotionalArc?: { turningPoints?: Array<{ position?: string; emotionalDescription?: string }> };
  humourPlacementMap?: Array<{ scenePosition?: string; humourPermission?: string }>;
  breakMoment?: { character?: string; scenePosition?: string; form?: string; narrativeFunction?: string };
  revealImplications?: string;
}

const ARC_POSITIONS = ['opening', 'early', 'first_turn', 'mid', 'second_turn', 'pre_climax', 'climax', 'resolution'];
const HUMOUR_POSITIONS = [
  'opening_scene', 'first_investigation', 'body_discovery', 'first_interview', 'domestic_scene', 'mid_investigation',
  'second_interview', 'tension_scene', 'pre_climax', 'discriminating_test', 'revelation', 'resolution',
];
const SOLEMN_POSITIONS = ['body_discovery', 'discriminating_test', 'revelation'];
const arr = <T>(v: T[] | undefined): T[] => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);
const filled = (v: unknown): boolean => String(v ?? '').trim().length > 0;

export function scoreRealWorldDocument(doc: RealWorldDocument | undefined | null, cml?: any): PhaseScore {
  const w = doc ?? {};
  const { cast, victims, decade } = caseFacts(cml);
  const required = cast.filter((n) => !victims.includes(n));
  const portraits = arr(w.characterPortraits).filter((p) => filled(p.portrait));
  const sketches = arr(w.characterVoiceSketches);
  const tests: TestResult[] = [];

  // ── Validation ── a portrait and a voice for every (living) cast member, and for no one else
  tests.push(filled(w.storyTheme) && portraits.length > 0
    ? pass('Theme + portraits present', 'validation', 1.5)
    : fail('Theme + portraits present', 'validation', 1.5, 'storyTheme or characterPortraits empty', 'critical'));
  const hasPortrait = required.filter((n) => portraits.some((p) => sameName(p.name, n))).length;
  tests.push(partial('Every cast member has a portrait', 'validation', pct(hasPortrait, required.length, portraits.length ? 100 : 0), 2.0,
    `${hasPortrait}/${required.length} (victims optional)`, 'critical'));
  const hasVoice = required.filter((n) => sketches.some((s) => sameName(s.name, n))).length;
  tests.push(partial('Every cast member has a voice sketch', 'validation', pct(hasVoice, required.length, sketches.length ? 100 : 0), 1.5,
    `${hasVoice}/${required.length}`));
  const named = [...portraits.map((p) => p.name), ...sketches.map((s) => s.name), w.breakMoment?.character].filter(filled);
  const invented = cast.length ? [...new Set(named.filter((n) => !cast.some((c) => sameName(n, c))))] : [];
  tests.push(invented.length === 0
    ? pass('No invented characters', 'validation', 1.0)
    : fail('No invented characters', 'validation', 1.0, `names not in the CML cast: ${invented.join(', ')}`, 'major'));

  // ── Quality ── voices Agent 9 can use, distinct from each other; a real theme
  const usable = sketches.filter((s) => {
    const frags = arr(s.fragments);
    return frags.length >= 3 && new Set(frags.map((f) => f.register)).size >= 2 && frags.every((f) => wordCount(f.text) >= 5);
  }).length;
  tests.push(partial('Voice sketches usable (≥3 fragments, ≥2 registers, ≥5 words each)', 'quality', pct(usable, sketches.length), 1.5,
    `${usable}/${sketches.length} sketches`));
  const frags = sketches.flatMap((s) => arr(s.fragments).map((f) => normalizeAtom(f.text))).filter(Boolean);
  const shared = frags.length - new Set(frags).size;
  tests.push(partial('Voice fragments distinct', 'quality', Math.max(0, 100 - shared * 25), 1.0, `${shared} repeated fragment(s)`));
  const themeWords = wordCount(w.storyTheme);
  tests.push(partial('storyTheme ≥25 words', 'quality', themeWords >= 25 ? 100 : themeWords >= 13 ? 50 : 0, 1.0, `${themeWords} words`));

  // ── Completeness ── the structures Agent 9 reads
  const arcAt = new Set(arr(w.storyEmotionalArc?.turningPoints).filter((t) => filled(t.emotionalDescription)).map((t) => t.position));
  tests.push(partial('Arc covers the 8 turning points', 'completeness', pct(ARC_POSITIONS.filter((p) => arcAt.has(p)).length, 8), 1.0));
  const humourAt = new Set(arr(w.humourPlacementMap).filter((h) => filled(h.humourPermission)).map((h) => h.scenePosition));
  tests.push(partial('Humour map covers the 12 positions', 'completeness', pct(HUMOUR_POSITIONS.filter((p) => humourAt.has(p)).length, 12), 1.0));
  const regs = arr(w.locationRegisters);
  tests.push(partial('Location registers usable', 'completeness',
    pct(regs.filter((r) => filled(r.emotionalRegister) && filled(r.cameraAngle)).length, regs.length), 1.0, `${regs.length} register(s)`));
  tests.push(partial('Reveal implications written', 'completeness', wordCount(w.revealImplications) >= 30 ? 100 : filled(w.revealImplications) ? 50 : 0, 1.0));
  const bm = w.breakMoment ?? {};
  tests.push(filled(bm.character) && filled(bm.form) && filled(bm.narrativeFunction) && HUMOUR_POSITIONS.includes(String(bm.scenePosition))
    ? pass('Break moment complete, at a mapped position', 'completeness', 0.5)
    : fail('Break moment complete, at a mapped position', 'completeness', 0.5, 'breakMoment incomplete or off the position list', 'minor'));

  // ── Consistency ── with the case and with itself
  const funny = arr(w.humourPlacementMap).filter((h) => SOLEMN_POSITIONS.includes(String(h.scenePosition)) && h.humourPermission !== 'forbidden');
  tests.push(funny.length === 0
    ? pass('Solemn scenes forbid humour', 'consistency', 1.0)
    : fail('Solemn scenes forbid humour', 'consistency', 1.0, `humour allowed at ${funny.map((h) => h.scenePosition).join(', ')}`, 'minor'));
  const range = decadeRange(decade);
  const year = Number(String(w.historicalMoment?.specificDate ?? '').match(/\b(1[5-9]\d\d|20\d\d)\b/)?.[1]);
  tests.push(!range || (year >= range[0] && year <= range[1])
    ? pass('Date inside the CML decade', 'consistency', 1.0, range ? undefined : 'CML decade unreadable')
    : fail('Date inside the CML decade', 'consistency', 1.0, `"${w.historicalMoment?.specificDate}" is outside ${decade}`, 'major'));
  const season = seasonOfMonth(monthIn(w.historicalMoment?.specificDate) ?? monthIn(w.historicalMoment?.eraRegister));
  const registers = [w.historicalMoment?.eraRegister, ...regs.map((r) => r.emotionalRegister)];
  const contradicting = season ? seasonContradictions(registers, season) : [];
  tests.push(partial('No other season described', 'consistency', Math.max(0, 100 - contradicting.length * 50), 1.0,
    contradicting.length ? `${contradicting.length} register(s) name a season other than ${season}` : undefined, 'minor'));

  return assembleHonestScore('agent65-world-builder', tests);
}
