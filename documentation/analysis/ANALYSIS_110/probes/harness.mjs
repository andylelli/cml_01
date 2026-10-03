// A_110 Part II — run the REAL contract, bible, checkers and selector (from dist) on this run's real artifacts.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
process.env.CML_VERIFIED_FIXES = process.env.CML_VERIFIED_FIXES ?? 'true';
process.env.CML_PROMPT_TRIMS = process.env.CML_PROMPT_TRIMS ?? 'true';
// Run from the repo root, after `npm run build:all`:  node documentation/analysis/ANALYSIS_110/probes/harness.mjs [all|bible|scenes|checkers|selector]
const PROJECT = process.env.A110_PROJECT || 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db';
const MANUSCRIPT = process.env.A110_MANUSCRIPT || 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md';
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const load = n => { const rows = store.artifacts.filter(a => a.projectId === PROJECT && a.type === n); if (!rows.length) throw new Error(`no ${n} artifact for ${PROJECT}`); return rows[rows.length - 1].payload; };
const here = p => pathToFileURL(`${process.cwd()}/${p}`).href;
const pe = await import(here('packages/prose-engine/dist/index.js'));
const pg = await import(here('packages/prose-guard/dist/index.js'));

const castArt = load('cast');
const input = {
  cml: load('cml'), clues: load('clues'), outline: load('outline'), cast: castArt.cast ?? castArt,
  profiles: load('character_profiles'), world: load('world_document'), locations: load('location_profiles'),
  temporal: load('temporal_context'), setting: load('setting'), lockedFacts: [], humourLevel: 'classic',
  primaryAxis: 'identity', targetLength: 'short', proofSteps: false, falseLead: false,
};
const contract = pe.buildBookContract(input);
const what = process.argv[2] || 'all';
const sec = (t) => console.log(`\n## ${t}`);

if (what === 'all' || what === 'bible') {
  sec('H1 bible sections (headings, words)');
  const bt = typeof contract.bible === 'string' ? contract.bible : (contract.bible.text ?? JSON.stringify(contract.bible));
  const heads = [...bt.matchAll(/^## (.*)$/gm)].map(m => m[1]);
  console.log('headings:', heads.join(' | '));
  console.log('has THE WORLD:', /THE WORLD/.test(bt), ' has "Where and when":', /Where and when/.test(bt), ' bible words:', bt.split(/\s+/).length);
  // what a reader of the REAL shapes would produce
  const s = input.setting.setting ?? input.setting, lp = input.locations, tc = input.temporal;
  console.log('W1 prototype → Where and when:', `${lp.primary.name}, ${s.location.type.toLowerCase()} at ${lp.primary.place}, ${lp.primary.country}; ${tc.specificDate.month} ${tc.specificDate.year}, ${tc.seasonal.season}.`);
  console.log('fields a FULL fix would also add to every call:  mood:', JSON.stringify(s.atmosphere.mood), '| locationRegisters:', input.world.locationRegisters.length, 'x', input.world.locationRegisters[0].emotionalRegister.split(/\s+/).length, 'w | eraRegister words:', input.world.historicalMoment.eraRegister.split(/\s+/).length);
  console.log('locationRegister[0]:', input.world.locationRegisters[0].emotionalRegister);
  const rel = bt.slice(bt.indexOf('WHO IS WHAT TO WHOM'));
  console.log('pairs in cast:', (input.cast.relationships.pairs ?? []).length, ' pair lines in bible:', (rel.split('\n## ')[0].match(/^\s+\S.* & .*:/gm) || []).length);
}

if (what === 'all' || what === 'scenes') {
  sec('H2 per chapter: role | present | wit carrier+owners (off-page?) | depth | eliminations | wound | senses');
  const victim = contract.fairPlay.victim, culprits = contract.fairPlay.culprits;
  console.log('victim:', victim, ' culprits:', culprits.join(','), ' roles:', JSON.stringify(contract.roles));
  for (const sc of contract.scenes) {
    const wit = sc.beats.wit; const owners = wit ? [wit.name, ...wit.shapes.map(x => x.name)] : [];
    const off = [...new Set(owners)].filter(n => !sc.present.includes(n));
    console.log(`ch${sc.chapter} ${sc.role.padEnd(13)} beat=${String(sc.beat).padEnd(14)} present=${sc.present.length} [${sc.present.map(n => n.split(' ')[0]).join(',')}] wit=${wit ? wit.name.split(' ')[0] : '-'} offPage=[${off.map(n => n.split(' ')[0]).join(',')}] depth=${sc.beats.depth ? sc.beats.depth.name.split(' ')[0] : '-'} elim=[${sc.eliminationsAllowed.map(e => e.name + ':' + e.method.slice(0, 22)).join(' | ')}] wound=${sc.wound ? 'Y' : '-'} senses=${sc.texture?.senses?.length ?? 0} must=${sc.mustSurface.length}`);
  }
  const c = pe.unwrapCase(input.cml);
  console.log('CML suspect_clearance_scenes:', JSON.stringify((c.prose_requirements?.suspect_clearance_scenes ?? []).map(e => [e.suspect_name, e.clearance_method])));
  console.log('outline beats:', pe.flattenScenes(input.outline).map(s => `${s.sceneNumber}:${s.beat}`).join(' '));
}

// manuscript → chapters
const raw = fs.readFileSync(MANUSCRIPT, 'utf8');
const titles = [...raw.matchAll(/^## Chapter (\d+): (.*)$/gm)].map(m => m[2]);
const chapters = raw.split(/^## Chapter \d+: .*$/m).slice(1).map((c, i) => ({ number: i + 1, title: titles[i], paragraphs: c.replace(/^---\s*$/gm, '').trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) }));
const expected = chapters.map(c => c.number);

if (what === 'all' || what === 'checkers') {
  sec('H4 would the checkers attack an establishing passage?');
  const lp = input.locations.primary;
  const variants = {
    'A: model-style (the location profile itself)': [lp.visualDescription, lp.paragraphs[0]],
    'B: plain concrete': [
      'The Cliffhaven Hotel stood on the cliff above Mevagissey, three storeys of grey stone under a slate roof gone dark with salt. The whitewash had peeled from the seaward wall, and the narrow windows were filmed with mist. A single road climbed to it from the harbour, turning twice on itself before it reached the door. Over the door an iron sign swung on its bracket.',
      'It was the middle of January, 1934, and the fog had come in off the bay at dusk. The night was thick with it. The air was heavy with salt and coal smoke, and the sea could be heard and not seen. Below the hotel the cove lay black between its rocks, and the gulls had gone quiet.',
    ],
  };
  const base = pe.collectCheckerFindings(chapters, contract, expected, {});
  const cls = (fs_) => { const m = {}; for (const f of fs_) m[f.class ?? f.kind] = (m[f.class ?? f.kind] || 0) + 1; return m; };
  console.log('saved manuscript, all chapters, findings by class:', JSON.stringify(cls(base)));
  console.log('saved ch1 findings:', JSON.stringify(cls(base.filter(f => f.chapter === 1))));
  for (const [label, paras] of Object.entries(variants)) {
    const ch1 = { ...chapters[0], paragraphs: [...paras, ...chapters[0].paragraphs] };
    const fs2 = pe.collectCheckerFindings([ch1, ...chapters.slice(1)], contract, expected, {});
    const joined = paras.join(' ');
    const hits = fs2.filter(f => f.chapter === 1 && f.quote && joined.includes(f.quote.slice(0, 40)));
    console.log(`\n${label}: sentences=${joined.split(/(?<=[.!?])\s+/).length}; findings INSIDE the passage: ${hits.length}`);
    for (const h of hits) console.log(`   [${h.class ?? h.kind}] ${h.quote.slice(0, 110)}`);
    const scores = joined.split(/(?<=[.!?])\s+/).map(s => ({ s: s.slice(0, 60), score: pg.scoreSentenceRegister(s).score }));
    console.log('   register scores:', scores.map(x => x.score.toFixed(2)).join(' '), ' threshold:', pg.REGISTER_TELEMETRY_THRESHOLD);
  }
}

if (what === 'all' || what === 'selector') {
  sec('H5 the selector against an establishing opening (chapter 1 alone)');
  const est = ['The Cliffhaven Hotel stood on the cliff above Mevagissey, three storeys of grey stone under a slate roof gone dark with salt. The whitewash had peeled from the seaward wall, and the narrow windows were filmed with mist. A single road climbed to it from the harbour, turning twice on itself before it reached the door. Over the door an iron sign swung on its bracket.', 'It was the middle of January, 1934, and the fog had come in off the bay at dusk. The lamps in the lobby had been lit since four. Below the hotel the cove lay black between its rocks, and the gulls had gone quiet.'];
  const a = pe.measureInstruments([chapters[0]]);
  const b = pe.measureInstruments([{ ...chapters[0], paragraphs: [...est, ...chapters[0].paragraphs] }]);
  const comp = v => Object.entries(pe.CALIBRATION).filter(([k]) => typeof v[k] === 'number').reduce((s, [k, { mean, sd, weight }]) => s + weight * (((k === 'registerRate' ? Math.max(v[k], pe.REGISTER_FLOOR) : v[k]) - mean) / sd), 0);
  console.log('as saved  :', JSON.stringify(a), 'composite≈', comp(a).toFixed(2));
  console.log('with place:', JSON.stringify(b), 'composite≈', comp(b).toFixed(2));
  console.log('Δcomposite from the establishing passage:', (comp(b) - comp(a)).toFixed(2), ' (a draft that disobeys and opens on speech is preferred by this much)');
  const whole = pe.measureInstruments(chapters);
  console.log('whole book vector:', JSON.stringify(whole));
  console.log('ship-check repetition line:', pg.summariseRepetitionDensity ? pg.summariseRepetitionDensity(pg.repetitionDensity(chapters.map(c => c.paragraphs.join(' ')).join(' '))) : 'n/a');
}
