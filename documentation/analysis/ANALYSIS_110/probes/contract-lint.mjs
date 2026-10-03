// A_110 Part III — the contract as a set of facts, and the invariants it must satisfy, checked over EVERY stored project.
// Run from the repo root after `npm run build:all`:  node documentation/analysis/ANALYSIS_110/probes/contract-lint.mjs
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
process.env.CML_VERIFIED_FIXES = process.env.CML_VERIFIED_FIXES ?? 'true';
const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const by = new Map();
for (const a of store.artifacts) { if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
// packages/prompts-llm/src/humour-level.ts:57-58 (not re-exported by prose-engine; restated here, so re-check if that file changes)
const UNDER = new Set(['dry_wit', 'understatement', 'deadpan', 'self_deprecating']), SHARP = new Set(['sardonic', 'polite_savagery', 'blunt', 'observational']);
const V = { n: 0, failed: 0, victimCleared: 0, culpritCleared: 0, culpritNeverOnPageBeforeReveal: 0, culpritNotOnRevealPage: 0, maskInCast: 0, maskInJob: 0, witOffPageChapters: 0, witChapters: 0, witAtBodyOrReveal: 0, consequenceIsCulprit: 0, victimSpeaksLater: 0, traitInBible: 0, booksWithTrait: 0, loadMax: [], loadZeroShare: [], loadGini: [], unprofiled: 0, scenes: 0, noEligibleCarrier: 0, presentSizes: [], detectiveAbsentChapters: 0, chapters: 0, feasibleMatch: 0, witBooks: 0 };
const gini = xs => { const s = [...xs].sort((a, b) => a - b), n = s.length, t = s.reduce((a, b) => a + b, 0); if (!t) return 0; return s.reduce((a, x, i) => a + (2 * (i + 1) - n - 1) * x, 0) / (n * t); };
for (const [pid, a] of by) {
  if (!a.cml || !a.outline || !a.cast || !a.character_profiles || !a.clues) continue;
  let c;
  try {
    c = pe.buildBookContract({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: 'classic', targetLength: 'short', proofSteps: false, falseLead: false });
  } catch { V.failed++; continue; }
  if (!c.scenes?.length) continue;
  V.n++;
  const victim = c.fairPlay.victim, culprits = new Set(c.fairPlay.culprits), reveal = c.roles.reveal;
  const castNames = new Set(((a.cast.cast ?? a.cast).characters ?? []).map(x => x.name));
  const profiles = new Map((a.character_profiles.profiles ?? []).map(p => [p.name, p]));
  const elim = c.scenes.flatMap(s => s.eliminationsAllowed.map(e => e.name));
  if (elim.includes(victim)) V.victimCleared++;
  if (elim.some(n => culprits.has(n))) V.culpritCleared++;
  if (!c.scenes.some(s => s.chapter < reveal && s.present.some(n => culprits.has(n)))) V.culpritNeverOnPageBeforeReveal++;
  if (!c.scenes.find(s => s.chapter === reveal)?.present.some(n => culprits.has(n))) V.culpritNotOnRevealPage++;
  const rawScenes = pe.flattenScenes(a.outline);
  if (rawScenes.some(s => (s.characters ?? []).some(n => !castNames.has(String(n).trim())))) V.maskInCast++;
  if (c.scenes.some(s => s.job && Object.values(s.job).some(v => typeof v === 'string' && /mysterious|unknown figure|stranger|the guest|a guest/i.test(v)))) V.maskInJob++;
  let bookFeasible = true, hasWit = false;
  for (const s of c.scenes) {
    V.chapters++; V.presentSizes.push(s.present.filter(n => n !== victim).length);
    const custody = s.chapter > reveal ? culprits : new Set();
    const onPage = s.present.filter(n => n !== victim && !custody.has(n));
    if (s.beats.wit) {
      hasWit = true; V.witChapters++;
      const owners = [...new Set([s.beats.wit.name, ...s.beats.wit.shapes.map(x => x.name)])];
      if (owners.some(n => !onPage.includes(n))) V.witOffPageChapters++;
      if (s.role === 'reveal' || s.role === 'discriminating_test' || (s.role === 'opening' && s.present.includes(victim))) V.witAtBodyOrReveal++;
      // feasibility of the D4 rule as a FILTER: is there, on this page, one person per shape?
      const styleOf = n => String(profiles.get(n)?.humourStyle ?? 'none').toLowerCase(); const lvl = n => Number(profiles.get(n)?.humourLevel ?? 0);
      const under = onPage.filter(n => UNDER.has(styleOf(n)) && lvl(n) > 0), sharp = onPage.filter(n => SHARP.has(styleOf(n)) && lvl(n) > 0);
      if (onPage.length < 2 || (under.length === 0 && sharp.length === 0)) { V.noEligibleCarrier++; bookFeasible = false; }
    }
    if (s.aftermath?.consequenceFor && culprits.has(s.aftermath.consequenceFor)) V.consequenceIsCulprit++;
    V.scenes++;
  }
  if (hasWit) { V.witBooks++; if (bookFeasible) V.feasibleMatch++; }
  const loads = c.scenes.map(s => s.mustSurface.length);
  V.loadMax.push(Math.max(...loads)); V.loadZeroShare.push(loads.filter(x => x === 0).length / loads.length); V.loadGini.push(gini(loads));
  const bible = typeof c.bible === 'string' ? c.bible : (c.bible.text ?? '');
  if (/shown never explained/.test(bible)) { V.booksWithTrait++; }
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const wilson = (k, n) => { if (!n) return 'n/a'; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return `${k}/${n} = ${(p * 100).toFixed(0)}% [${(Math.max(0, c - h) * 100).toFixed(0)}–${(Math.min(1, c + h) * 100).toFixed(0)}]`; };
console.log(`contracts built from dist: ${V.n} (failed to build: ${V.failed})`);
console.log(`I1 victim among suspects to clear:                 ${wilson(V.victimCleared, V.n)}`);
console.log(`I2 a culprit among suspects to clear:               ${wilson(V.culpritCleared, V.n)}`);
console.log(`I3 culprit on NO page list before the reveal:       ${wilson(V.culpritNeverOnPageBeforeReveal, V.n)}`);
console.log(`I4 culprit not on the reveal chapter's page list:   ${wilson(V.culpritNotOnRevealPage, V.n)}`);
console.log(`I5 a non-cast name in an outline scene's cast list: ${wilson(V.maskInCast, V.n)};  in a job-field value: ${wilson(V.maskInJob, V.n)}`);
console.log(`I6 wit beat with an owner off the page:             ${wilson(V.witOffPageChapters, V.witChapters)} of wit chapters`);
console.log(`I7 wit beat at the body, the test or the reveal:    ${wilson(V.witAtBodyOrReveal, V.witChapters)} of wit chapters`);
console.log(`I8 aftermath "first of them we see" is a culprit:   ${wilson(V.consequenceIsCulprit, V.n)}`);
console.log(`I9 the trait line in the every-call bible:          ${wilson(V.booksWithTrait, V.n)}`);
console.log(`D4 as a FILTER: wit chapters with nobody eligible on the page: ${wilson(V.noEligibleCarrier, V.witChapters)};  books where every wit chapter has someone: ${wilson(V.feasibleMatch, V.witBooks)}`);
console.log(`people on a chapter's page list (victim excluded): median ${med(V.presentSizes)}; chapters listing 2 or fewer: ${wilson(V.presentSizes.filter(x => x <= 2).length, V.presentSizes.length)}`);
console.log(`evidence load per chapter: median of the book's MAX ${med(V.loadMax)}; median share of chapters with none ${(med(V.loadZeroShare) * 100).toFixed(0)}%; median Gini ${med(V.loadGini).toFixed(2)}`);
