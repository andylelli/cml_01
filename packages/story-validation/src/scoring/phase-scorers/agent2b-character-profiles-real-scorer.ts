/**
 * Agent 2b — "grade the REAL artifact" character-profiles scorer (SCO-Q07, owner decision 2026-10-02).
 *
 * The vanity scorer it replaces graded an adapter that PADDED each field with the profile's own paragraphs
 * and expanded the humour enum to a 150-character description, so its word-count checks always passed:
 * 2b scored ≥94 in 72 of 72 archived runs. This grades the profiles as Agent 2b returned them, against
 * the cast and the CML: one profile per cast member and no one else, the prompt's countable requirements
 * (4–6 paragraphs, valid enums, the case-facing fields), distinct people, and a culprit with a motive.
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore, caseFacts, normalizeAtom, pct, sameName } from '../honest-scorer.js';

export interface RealCharacterProfile {
  name?: string;
  summary?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  motiveStrength?: string;
  alibiWindow?: string;
  stakes?: string;
  humourStyle?: string;
  speechMannerisms?: string;
  signatureTic?: string;
  internalConflict?: string;
  personalStakeInCase?: string;
  paragraphs?: string[];
}

const MOTIVE_STRENGTHS = new Set(['weak', 'moderate', 'strong', 'compelling']);
const HUMOUR_STYLES = new Set([
  'understatement', 'dry_wit', 'polite_savagery', 'self_deprecating', 'observational', 'deadpan', 'sardonic', 'blunt', 'none',
]);
const CASE_FIELDS: (keyof RealCharacterProfile)[] = ['publicPersona', 'privateSecret', 'motiveSeed', 'stakes', 'speechMannerisms'];
const filled = (v: unknown): boolean => String(v ?? '').trim().length > 0;

/**
 * @param profiles Agent 2b's `profiles` array.
 * @param cast     Agent 2's cast design (`{ characters: [{ name, roleArchetype }] }`) — the roster and the detective.
 * @param cml      The CML — its culprit.
 */
export function scoreRealCharacterProfiles(profiles: RealCharacterProfile[] | undefined | null, cast?: any, cml?: any): PhaseScore {
  const ps = (Array.isArray(profiles) ? profiles : []).filter((p) => p && typeof p === 'object');
  const castMembers: any[] = Array.isArray(cast?.characters) ? cast.characters : [];
  const roster = castMembers.map((c) => String(c?.name ?? '').trim()).filter(Boolean);
  const profileOf = (name: string) => ps.find((p) => sameName(p.name, name));
  const tests: TestResult[] = [];

  // ── Validation ── a profile for every cast member, and for no one else
  tests.push(ps.length > 0
    ? pass('Profiles present', 'validation', 1.5)
    : fail('Profiles present', 'validation', 1.5, 'no profiles', 'critical'));
  const covered = roster.filter((n) => profileOf(n)).length;
  tests.push(partial('Every cast member profiled', 'validation', pct(covered, roster.length, ps.length > 0 ? 100 : 0), 2.0,
    `${covered}/${roster.length} cast members have a profile`, 'critical'));
  const invented = roster.length ? ps.filter((p) => !roster.some((n) => sameName(p.name, n))).map((p) => p.name || '(unnamed)') : [];
  tests.push(invented.length === 0
    ? pass('No invented characters', 'validation', 1.0)
    : fail('No invented characters', 'validation', 1.0, `profiles for names not in the cast: ${invented.join(', ')}`, 'major'));
  const enumsOk = ps.filter((p) => MOTIVE_STRENGTHS.has(String(p.motiveStrength ?? '')) && HUMOUR_STYLES.has(String(p.humourStyle ?? ''))).length;
  tests.push(partial('motiveStrength / humourStyle are valid values', 'validation', pct(enumsOk, ps.length), 1.0,
    `${enumsOk}/${ps.length} profiles carry valid enums`));
  // A profile with no narrative is what 2b's own repair pass exists for; when the repair fails it ships hollow.
  const narrated = ps.filter((p) => (Array.isArray(p.paragraphs) ? p.paragraphs : []).some(filled)).length;
  tests.push(partial('Profiles carry narrative paragraphs', 'validation', pct(narrated, ps.length), 1.5,
    `${narrated}/${ps.length} profiles have paragraphs`, 'critical'));

  // ── Quality ── the prompt's countable requirements, and distinct people
  const paraOk = ps.filter((p) => {
    const n = (Array.isArray(p.paragraphs) ? p.paragraphs : []).filter(filled).length;
    return n >= 4 && n <= 6;
  }).length;
  tests.push(partial('4–6 paragraphs per profile', 'quality', pct(paraOk, ps.length), 1.5, `${paraOk}/${ps.length} profiles`));
  const complete = ps.filter((p) => CASE_FIELDS.every((f) => filled(p[f]))).length;
  tests.push(partial('Case-facing fields filled', 'quality', pct(complete, ps.length), 1.5,
    `${complete}/${ps.length} profiles carry all of ${CASE_FIELDS.join(', ')}`));
  const texts = ps.flatMap((p) => [p.privateSecret, ...(Array.isArray(p.paragraphs) ? p.paragraphs : [])]).map(normalizeAtom).filter((t) => t.length > 20);
  const repeated = texts.length - new Set(texts).size;
  tests.push(repeated === 0
    ? pass('Profiles are distinct', 'quality', 1.0)
    : partial('Profiles are distinct', 'quality', Math.max(0, 100 - repeated * 25), 1.0, `${repeated} secret/paragraph text(s) repeated across profiles`));
  const humours = new Set(ps.map((p) => p.humourStyle).filter(filled)).size;
  const voices = new Set(ps.map((p) => normalizeAtom(p.speechMannerisms)).filter(Boolean)).size;
  tests.push(ps.length < 3 || (humours >= 2 && voices >= 3)
    ? pass('Voices contrast (≥2 humour styles, ≥3 speech registers)', 'quality', 1.0)
    : fail('Voices contrast (≥2 humour styles, ≥3 speech registers)', 'quality', 1.0, `${humours} humour style(s), ${voices} distinct speech description(s)`, 'minor'));

  // ── Completeness ──
  const detective = castMembers.find((c) => /detective|inspector|investigator/i.test(String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? '')));
  const detProfile = detective ? profileOf(String(detective.name ?? '')) : undefined;
  tests.push(!detective || filled(detProfile?.personalStakeInCase)
    ? pass('Detective has a personal stake', 'completeness', 1.0)
    : fail('Detective has a personal stake', 'completeness', 1.0, `${detective.name}: personalStakeInCase empty (REQUIRED for the detective)`, 'major'));
  const suspects = castMembers
    .filter((c) => c !== detective && !/victim/i.test(String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? '')))
    .map((c) => profileOf(String(c?.name ?? '')))
    .filter((p): p is RealCharacterProfile => Boolean(p));
  const alibied = suspects.filter((p) => filled(p.alibiWindow) && !/^n\/?a\b/i.test(String(p.alibiWindow).trim())).length;
  tests.push(partial('Suspects carry an alibi window', 'completeness', pct(alibied, suspects.length, 100), 1.0,
    `${alibied}/${suspects.length} suspects`));
  // Weighted below the others: the archive's older runs predate these two fields (17 of 65 projects, 2026-10-02).
  const depth = ps.filter((p) => filled(p.signatureTic) && filled(p.internalConflict)).length;
  tests.push(partial('signatureTic + internalConflict present', 'completeness', pct(depth, ps.length), 0.5, `${depth}/${ps.length} profiles`));

  // ── Consistency ── against the CML
  const { culprits } = caseFacts(cml);
  const weakCulprits = culprits.filter((c) => {
    const p = profileOf(c);
    return p && !['moderate', 'strong', 'compelling'].includes(String(p.motiveStrength ?? ''));
  });
  tests.push(weakCulprits.length === 0
    ? pass('Culprit has a real motive', 'consistency', 1.0, culprits.length ? undefined : 'no culprit named in the CML')
    : fail('Culprit has a real motive', 'consistency', 1.0, `culprit ${weakCulprits.join(', ')} profiled with a weak/missing motiveStrength`, 'minor'));
  const names = ps.map((p) => normalizeAtom(p.name)).filter(Boolean);
  const dupNames = names.length - new Set(names).size;
  tests.push(dupNames === 0
    ? pass('One profile per person', 'consistency', 1.0)
    : fail('One profile per person', 'consistency', 1.0, `${dupNames} duplicate profile name(s)`, 'minor'));

  return assembleHonestScore('agent2b-character-profiles', tests);
}
