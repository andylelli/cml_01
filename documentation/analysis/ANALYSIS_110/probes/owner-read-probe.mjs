// ANALYSIS_110 — the owner's five points as counts, on the saved manuscript (the file the reader reads).
// Run from the repo root: node documentation/analysis/ANALYSIS_110/probes/owner-read-probe.mjs [manuscript.md]
import fs from 'node:fs';
const MS = process.argv[2] || 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md';
const raw = fs.readFileSync(MS, 'utf8');
const chapters = raw.split(/^## Chapter \d+: .*$/m).slice(1).map(c => c.replace(/^---\s*$/gm, '').trim());
const titles = [...raw.matchAll(/^## Chapter (\d+): (.*)$/gm)].map(m => m[2]);
const words = s => (s.toLowerCase().match(/[a-z][a-z'’]*/g) || []);
const body = chapters.join('\n\n');
const W = words(body);
const count = (re, s = body) => (s.match(re) || []).length;
const perCh = re => chapters.map(c => count(re, c)).join(' ');

console.log('## A. chapters');
chapters.forEach((c, i) => {
  const paras = c.split(/\n\s*\n/).filter(Boolean);
  const q = paras.filter(p => /^["“]/.test(p.trim())).length;
  console.log(`ch${i + 1} words=${words(c).length} paras=${paras.length} quoteOpenParas=${q} opensWithQuote=${/^["“]/.test(paras[0].trim())} title="${titles[i]}"`);
});
console.log('total words', W.length);

const table = (name, items) => {
  console.log(`\n## ${name}  (total | per chapter 1..10)`);
  for (const [label, re] of items) console.log(`${label.padEnd(34)} ${String(count(re)).padStart(4)} | ${perCh(re)}`);
};

table('B. location-profile vocabulary on the page', [
  ['Mevagissey', /mevagissey/gi], ['Cornwall|Cornish', /cornwall|cornish/gi], ['England|English', /\bengl(and|ish)\b/gi],
  ['year 19xx', /\b19\d\d\b/g], ['month names', /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi],
  ['season words', /\b(spring|summer|autumn|winter)\b/gi],
  ['whitewash', /whitewash/gi], ['slate', /\bslate/gi], ['wrought', /wrought/gi], ['mullion', /mullion/gi], ['oak', /\boak/gi], ['wallpaper', /wallpaper/gi],
  ['gas lamp', /gas[- ]lamp/gi], ['gull', /\bgulls?\b/gi], ['gorse', /gorse/gi], ['cove', /\bcove\b/gi], ['foghorn', /foghorn/gi], ['drizzle|rain', /drizzle|\brain/gi],
  ['seaweed', /seaweed/gi], ['harbour|harbor|quay|dock', /harbou?r|quay|\bdocks?\b/gi], ['road|lane|path', /\b(road|lane|path|footpath)\b/gi],
  ['village|town', /\b(village|town)\b/gi], ['storey|floor(s) of bldg|roof|chimney|wall(s)', /\b(storey|storeys|roof|chimney|chimneys)\b/gi],
  ['fog (any form)', /\bfog\w*/gi], ['cliff*', /\bcliff\w*/gi], ['bay', /\bbay\b/gi], ['sea|waves|tide', /\b(sea|waves?|tide)\b/gi],
]);

table('C. who people are — the plain facts', [
  ['schoolteacher|teacher|taught', /schoolteacher|\bteacher|\btaught/gi], ['tutor*', /\btutor\w*/gi], ['history|research|archive', /\b(history|research\w*|archives?)\b/gi],
  ['lawyer|solicitor|legal', /lawyer|solicitor|\blegal/gi], ['owner|owned|owns|proprietor', /\b(owner|owned|owns|proprietor)\b/gi], ['shipowner|ship(s)', /shipowner|\bships?\b/gi],
  ['fisherwoman|fisher*', /fisher\w*/gi], ['smuggl*', /smuggl\w*/gi], ['manager', /\bmanager/gi], ['patriarch', /patriarch/gi],
  ['father', /\bfather/gi], ['\bson\b', /\bson\b/gi], ['granddaughter', /granddaughter/gi], ['will (testament)', /\b(the|his|new|father's) will\b/gi],
  ['guest(s)', /\bguests?\b/gi], ['masquerade|mask|costume', /masquerade|\bmask(s|ed)?\b|costume/gi],
  ['age/appearance: hair|beard|eyes colour|tall|stout|grey-haired|wrinkl', /\b(hair|haired|beard|moustache|tall|stout|thin|slender|wrinkl\w*|spectacles|aged|elderly|young|old man|old woman)\b/gi],
]);

table('D. response to the death', [
  ['grief|griev*|mourn*', /\b(grief|griev\w*|mourn\w*)\b/gi], ['wept|weep|tears|cry|cried|sob*', /\b(wept|weep\w*|tears?|cry|cried|crying|sobb?\w*)\b/gi],
  ['shock*|horror|horrif*|scream*|gasp*', /\b(shock\w*|horror|horrif\w*|scream\w*|gasp\w*|faint\w*)\b/gi],
  ['dead|death|died', /\b(dead|death|died)\b/gi], ['murder*', /\bmurder\w*/gi], ['kill*', /\bkill\w*/gi], ['body', /\bbody\b/gi],
  ['police|constable|inspector|sergeant', /\b(police|constable|inspector|sergeant)\b/gi], ['doctor|physician', /\b(doctor|physician)\b/gi],
  ['funeral|burial|coffin|undertaker', /\b(funeral|burial|coffin|undertaker)\b/gi], ['sorry|condolence|poor (man|father)', /\b(sorry|condolences?)\b|poor (man|father|reginald)/gi],
  ['"my father" | "Father"', /my father|"Father\b/g],
]);

table('E. repeated lines and instruction echoes', [
  ['quarter to nine', /quarter to nine/gi], ['quarter past nine', /quarter past nine/gi],
  ['was asked', /\bwas asked\b/gi], ['reply was (four|six) words', /(reply|replies)[^.]{0,40}(four|six) words/gi], ['"chapter" in prose', /\bchapter\b/g],
  ["period's … gotten in the way", /gotten in (his|her|their|charles's|the) way|got in (his|her|their) way/gi], ["the period's", /the period's|period of investigation/gi],
  ['unreadable', /unreadable/gi], ['the gap', /\bthe gap\b/gi], ['self-deprecat*', /self-deprecat\w*/gi], ['understate*', /understat\w*/gi],
  ['the loss of', /\bthe loss of\b/gi], ['youthful certainty', /youthful certainty|loss of certainty/gi], ['gambling loss', /gambling loss/gi],
  ['high-profile case|earlier case', /high-profile case|earlier case|case she'd lost|lost case/gi], ['factory accident', /factory accident/gi], ['storm…fishing boat', /fishing boat/gi],
  ['axis', /\baxis\b/gi], ['held its secrets', /held (its|their) secrets/gi], ['wherever it led', /wherever it led/gi], ['clock ticked', /clock ticked/gi],
  ['steady|steadily|steadiness', /\bstead(y|ily|iness)\b/gi], ['routine', /\broutine\w*/gi], ['ledger*', /\bledger\w*/gi], ['folio', /\bfolio\w*/gi], ['log|logs|logbook', /\b(logs?|logbook\w*)\b/gi],
  ['precise|precision', /\bprecis(e|ion|ely)\b/gi], ['hands|fingers', /\b(hands?|fingers?)\b/gi], ['empty chair', /empty chair/gi], ['apology … thanks … resentment', /apology[^.]{0,60}thanks[^.]{0,60}resentment/gi],
  ['working-class outsider', /working-class outsider/gi],
]);

// F. lexical variety
const mattr = (toks, win = 500) => { let s = 0, n = 0; for (let i = 0; i + win <= toks.length; i += 50) { s += new Set(toks.slice(i, i + win)).size / win; n++; } return n ? s / n : NaN; };
const STOP = new Set('the a an and or but of to in on at by for with from as is was were be been being had has have do did does not no nor so that this these those it its his her hers he she they them their there then than which who whom whose what when where while if into out up down over under again once only just very s t d ll re ve m i you your we our us me my him himself herself itself themselves about after before between through during against also both each few more most other some such own same too can could should would will shall may might must now here all any'.split(' '));
const stats = toks => {
  const types = new Set(toks).size;
  const f = new Map(); for (const t of toks) f.set(t, (f.get(t) || 0) + 1);
  const hapax = [...f.values()].filter(v => v === 1).length;
  const content = [...f.entries()].filter(([t]) => !STOP.has(t) && t.length > 2).sort((a, b) => b[1] - a[1]);
  const top20share = content.slice(0, 20).reduce((s, [, v]) => s + v, 0) / toks.length;
  const g = new Map(); for (let i = 0; i + 4 <= toks.length; i++) { const k = toks.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); }
  let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
  return { n: toks.length, types, mattr500: +mattr(toks).toFixed(3), hapaxShare: +(hapax / types).toFixed(3), top20contentShare: +top20share.toFixed(3), fourgramsIn3plusPer10k: +(rep / toks.length * 1e4).toFixed(0), top: content.slice(0, 30) };
};
const me = stats(W);
console.log('\n## F. lexical variety — this book');
console.log(JSON.stringify({ ...me, top: undefined }));
console.log('top content words:', me.top.map(([t, v]) => `${t}:${v}`).join(' '));

console.log('\n## F2. canon: same-length window (tokens 3000..3000+N) of each library text');
const dir = 'library/texts';
const rows = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt'))) {
  const t = words(fs.readFileSync(`${dir}/${f}`, 'utf8'));
  if (t.length < 3000 + W.length + 2000) continue;
  const s = stats(t.slice(3000, 3000 + W.length));
  rows.push({ f, ...s, top: undefined });
}
const med = k => { const a = rows.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
const rng = k => { const a = rows.map(r => r[k]).sort((x, y) => x - y); return `${a[0]}..${a[a.length - 1]} p10=${a[Math.floor(a.length * 0.1)]} p90=${a[Math.floor(a.length * 0.9)]}`; };
console.log('canon texts used:', rows.length);
for (const k of ['types', 'mattr500', 'hapaxShare', 'top20contentShare', 'fourgramsIn3plusPer10k']) {
  const below = rows.filter(r => r[k] < me[k]).length;
  console.log(`${k.padEnd(24)} book=${me[k]}  canon median=${med(k)}  range=${rng(k)}  canon texts below book=${below}/${rows.length}`);
}

// G. our own shipped books for the same instrument
console.log('\n## F3. our recent manuscripts');
const sd = 'stories';
const dirs = fs.readdirSync(sd).filter(d => /^story_2026(09|10)/.test(d)).sort().slice(-14);
for (const d of dirs) {
  const md = fs.readdirSync(`${sd}/${d}`).find(f => f.endsWith('.md'));
  if (!md) continue;
  const t = words(fs.readFileSync(`${sd}/${d}/${md}`, 'utf8').replace(/^#.*$/gm, ''));
  if (t.length < 6000) continue;
  const s = stats(t);
  console.log(`${d} n=${s.n} types=${s.types} mattr500=${s.mattr500} top20=${s.top20contentShare} 4g3+=${s.fourgramsIn3plusPer10k}`);
}
