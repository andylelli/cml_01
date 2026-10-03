// A_110 step 0 — verify PROSE_V2_CONTRACT_FIXES on real artifacts: the rendered contracts of run bcc0d637 OFF vs ON, and
// the contract rules over every stored project OFF vs ON. Run from the repo root after `npm run build:all`:
//   node documentation/analysis/ANALYSIS_110/probes/step0-verify.mjs [show]
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
process.env.CML_VERIFIED_FIXES = 'true';
const here = p => pathToFileURL(`${process.cwd()}/${p}`).href;
const pe = await import(here('packages/prose-engine/dist/index.js'));
const { renderSceneContract } = await import(here('apps/worker/dist/jobs/agents/agent9-v2/run.js'));
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const by = new Map(); for (const a of store.artifacts) { if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const inputOf = a => ({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: 'classic' });
const build = (a, on) => { process.env.PROSE_V2_CONTRACT_FIXES = on ? 'true' : 'false'; return pe.buildBookContract(inputOf(a)); };

const run = by.get('proj_5eb8c115-ca42-4e66-997d-74fff1b327db');
const off = build(run, false), on = build(run, true);
const bibleOf = c => c.bible.text;
const sec = (t, name) => (t.split(/\n(?=## )/).find(s => s.startsWith(`## ${name}`)) ?? '(absent)');
console.log('== THE WORLD  OFF:', sec(bibleOf(off), 'THE WORLD').replace(/\n/g, ' | ').slice(0, 200));
console.log('== THE WORLD  ON :', sec(bibleOf(on), 'THE WORLD').replace(/\n/g, ' | ').slice(0, 200));
const pairs = t => (sec(t, 'WHO IS WHAT TO WHOM').match(/^\s+\S.* & .*:/gm) || []).length;
console.log(`== relationship pairs in the bible: OFF ${pairs(bibleOf(off))}, ON ${pairs(bibleOf(on))}; first ON pair: ${(sec(bibleOf(on), 'WHO IS WHAT TO WHOM').split('\n')[1] || '').slice(0, 70)}`);
console.log(`== trait line in the bible: OFF ${/shown never explained/.test(bibleOf(off))}, ON ${/shown never explained/.test(bibleOf(on))}`);
const speech = t => (t.match(/^  Speech: .*$/m) || [''])[0];
console.log(`== Speech line length: OFF ${speech(bibleOf(off)).length}, ON ${speech(bibleOf(on)).length}`);
console.log(`== bible tokens OFF ${off.bible.tokens}, ON ${on.bible.tokens}`);
for (const c of [off, on]) {
  const label = c === off ? 'OFF' : 'ON ';
  console.log(`\n== ${label} per chapter: wit carrier | depth | cleared | present`);
  for (const s of c.scenes) console.log(`  ch${s.chapter} ${s.role.padEnd(13)} wit=${s.beats.wit?.name?.split(' ')[0] ?? '-'} owners=[${(s.beats.wit?.shapes ?? []).map(x => x.name.split(' ')[0]).join(',')}] depth=${s.beats.depth?.name?.split(' ')[0] ?? '-'} cleared=[${s.eliminationsAllowed.map(e => e.name.split(' ')[0]).join(',')}] present=[${s.present.map(n => n.split(' ')[0]).join(',')}]`);
  console.log(`  rules violated: ${JSON.stringify(pe.checkContractRules(c, c.bible.text).map(v => `${v.rule}@${v.where}`))}`);
  console.log(`  notes: ${c.notes.filter(n => /rules|WORLD/.test(n)).join(' / ').slice(0, 300)}`);
}
if (process.argv[2] === 'show') {
  process.env.PROSE_V2_CONTRACT_FIXES = 'true';
  for (const n of [1, 4, 5, 8, 9, 10]) console.log(`\n---- ON chapter ${n} contract ----\n` + renderSceneContract(on, n));
  console.log('\n---- ON brief ----\n' + on.brief.text);
}

// the rules over the archive, one project per distinct cast
const projs = []; for (const [pid, a] of by) if (a.cml && a.outline && a.cast && a.character_profiles && a.clues) projs.push({ pid, a, names: ((a.cast.cast ?? a.cast).characters ?? []).map(c => c.name) });
const parent = projs.map((_, i) => i); const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
for (let i = 0; i < projs.length; i++) for (let j = i + 1; j < projs.length; j++) if (projs[i].names.filter(n => projs[j].names.includes(n)).length >= Math.min(4, projs[i].names.length - 1)) parent[find(i)] = find(j);
const uniq = [...new Map(projs.map((p, i) => [find(i), p])).values()];
for (const on2 of [false, true]) {
  const tally = new Map(); let books = 0, failed = 0;
  for (const p of uniq) { let c; try { c = build(p.a, on2); } catch (e) { failed++; continue; } books++; const seen = new Set(); for (const v of pe.checkContractRules(c, c.bible.text)) if (!seen.has(v.rule)) { seen.add(v.rule); tally.set(v.rule, (tally.get(v.rule) ?? 0) + 1); } }
  console.log(`\n== archive, one project per cast (${books} built, ${failed} failed), flag ${on2 ? 'ON' : 'OFF'}: books violating each rule`);
  for (const r of pe.CONTRACT_RULES) console.log(`   ${r.name.padEnd(34)} ${tally.get(r.name) ?? 0}`);
}
