/**
 * SCO-Q07 (owner decision, 2026-10-02) — the honest tables for 2b, 2d and 6.5. The property each must have:
 * a well-formed artifact (every committed golden bundle) PASSES its report threshold, and a regressed one —
 * hollowed, wrong cast, wrong date, contradicted season — scores lower or FAILS, where the vanity scorers it
 * replaces scored ≥94 / ≥95 / 100 on 72 of 72 archived runs.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getThreshold } from '../thresholds.js';
import { passesThreshold } from '../thresholds.js';
import { scoreRealCharacterProfiles } from '../phase-scorers/agent2b-character-profiles-real-scorer.js';
import { scoreRealTemporalContext } from '../phase-scorers/agent2d-temporal-context-real-scorer.js';
import { scoreRealWorldDocument } from '../phase-scorers/agent65-world-builder-real-scorer.js';

const GOLDEN = join(__dirname, '..', '..', '..', '..', '..', 'eval', 'golden');
const bundles = readdirSync(GOLDEN).filter((f) => /^bundle-.*\.json$/.test(f)).sort();
const load = (f: string) => JSON.parse(readFileSync(join(GOLDEN, f), 'utf8')).artifacts;
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
// A test is FLAGGED when it docks marks (score < 100) — a partial at 60 still counts as passed in TestResult terms.
const failedTests = (s: { tests: Array<{ name: string; score: number }> }) => s.tests.filter((t) => t.score < 100).map((t) => t.name);

describe('golden bundles pass the honest 2b / 2d / 6.5 tables', () => {
  it('finds the bundles', () => expect(bundles.length).toBeGreaterThanOrEqual(4));
  for (const f of bundles) {
    it(f, () => {
      const a = load(f);
      const p = scoreRealCharacterProfiles(a.character_profiles.profiles, a.cast.cast, a.cml);
      const t = scoreRealTemporalContext(a.temporal_context, a.setting.setting);
      const w = scoreRealWorldDocument(a.world_document, a.cml);
      for (const s of [p, t, w]) {
        expect(s.passed, `${s.agent}: ${s.failure_reason}`).toBe(true);
        expect(passesThreshold(s), `${s.agent} ${s.total} < ${getThreshold(s.agent)}`).toBe(true);
      }
    });
  }
});

const a = load(bundles[0]);

describe('scoreRealCharacterProfiles (2b)', () => {
  const score = (profiles: any, cast = a.cast.cast, cml = a.cml) => scoreRealCharacterProfiles(profiles, cast, cml);
  it('fails with no profiles', () => {
    expect(score([]).passed).toBe(false);
  });
  it('fails when most of the cast has no profile', () => {
    expect(score(a.character_profiles.profiles.slice(0, 2)).passed).toBe(false);
  });
  it('flags a profile for someone not in the cast', () => {
    const ps = clone(a.character_profiles.profiles);
    ps[3].name = 'Colonel Nobody';
    expect(failedTests(score(ps))).toContain('No invented characters');
  });
  it('flags hollow profiles: no paragraphs, empty case fields, invalid enums', () => {
    const ps = clone(a.character_profiles.profiles).map((p: any) => ({ ...p, paragraphs: [], privateSecret: '', motiveSeed: '', motiveStrength: 'very strong' }));
    const s = score(ps);
    expect(failedTests(s)).toEqual(expect.arrayContaining(['4–6 paragraphs per profile', 'Case-facing fields filled', 'motiveStrength / humourStyle are valid values']));
    expect(s.passed && passesThreshold(s)).toBe(false);
  });
  it('flags copy-pasted profiles and a culprit with a weak motive', () => {
    const ps = clone(a.character_profiles.profiles);
    for (const p of ps) p.paragraphs = ps[0].paragraphs;
    const culprit = ps.find((p: any) => p.name === a.cml.CASE.culpability.culprits[0]);
    culprit.motiveStrength = 'weak';
    expect(failedTests(score(ps))).toEqual(expect.arrayContaining(['Profiles are distinct', 'Culprit has a real motive']));
  });
});

describe('scoreRealTemporalContext (2d)', () => {
  const score = (t: any) => scoreRealTemporalContext(t, a.setting.setting);
  it('fails with no date', () => {
    expect(score({ ...clone(a.temporal_context), specificDate: {} }).passed).toBe(false);
  });
  it('flags a year outside the setting decade and a season that does not follow the month', () => {
    const t = clone(a.temporal_context);
    t.specificDate.year = 1957;
    t.seasonal.season = t.seasonal.season === 'summer' ? 'winter' : 'summer';
    const s = score(t);
    expect(failedTests(s)).toEqual(expect.arrayContaining(['Year inside the setting decade', 'Season follows the month']));
    expect(passesThreshold(s)).toBe(false);
  });
  it('flags the depth floors and repeated entries', () => {
    const t = clone(a.temporal_context);
    t.fashion.mensWear = { formal: ['tweed suit'], casual: ['tweed suit'], accessories: [] };
    t.seasonal.seasonalActivities = ['tweed suit'];
    expect(failedTests(score(t))).toEqual(expect.arrayContaining(['Depth floors met', 'No repeated entries']));
  });
  it('flags narrative that describes another season', () => {
    const t = clone(a.temporal_context);
    const other = t.seasonal.season === 'summer' ? 'winter' : 'summer';
    t.paragraphs = t.paragraphs.map((p: string) => `${p} The ${other} air hung heavy.`);
    expect(failedTests(score(t))).toContain('No other season described');
  });
});

describe('scoreRealWorldDocument (6.5)', () => {
  const score = (w: any) => scoreRealWorldDocument(w, a.cml);
  it('fails an empty (degraded) world document', () => {
    expect(score({ storyTheme: '', characterPortraits: [], characterVoiceSketches: [] }).passed).toBe(false);
  });
  it('does not trust the self-reported validationConfirmations', () => {
    const w = clone(a.world_document);
    w.characterPortraits = w.characterPortraits.slice(0, 2);
    w.validationConfirmations = { castComplete: true, noNewCharacterFacts: true };
    expect(score(w).passed).toBe(false);
  });
  it('accepts a missing victim portrait, as 6.5 itself does', () => {
    const w = clone(a.world_document);
    const victim = a.cml.CASE.cast.find((m: any) => String(m.role_archetype).toLowerCase() === 'victim').name;
    w.characterPortraits = w.characterPortraits.filter((p: any) => p.name !== victim);
    w.characterVoiceSketches = w.characterVoiceSketches.filter((p: any) => p.name !== victim);
    expect(failedTests(score(w))).not.toContain('Every cast member has a portrait');
  });
  it('flags invented characters, unusable or shared voices, humour at the reveal and a wrong decade', () => {
    const w = clone(a.world_document);
    w.characterVoiceSketches[0].name = 'Colonel Nobody';
    for (const s of w.characterVoiceSketches) s.fragments = [{ register: 'comfortable', text: 'Indeed.' }];
    w.humourPlacementMap = w.humourPlacementMap.map((h: any) => ({ ...h, humourPermission: 'permitted' }));
    w.historicalMoment.specificDate = '1962 March';
    const s = score(w);
    expect(failedTests(s)).toEqual(expect.arrayContaining([
      'No invented characters', 'Voice sketches usable (≥3 fragments, ≥2 registers, ≥5 words each)', 'Voice fragments distinct',
      'Solemn scenes forbid humour', 'Date inside the CML decade',
    ]));
    expect(passesThreshold(s)).toBe(false);
  });
});
