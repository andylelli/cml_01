// A_110 Part III — statistics that say WHAT is repeated and WHERE it came from, and instruments that point up.
// Run from the repo root:  node documentation/analysis/ANALYSIS_110/probes/lexstats-probe.mjs [manuscript.md] [runIdFragment]
import fs from 'node:fs';
import zlib from 'node:zlib';
import readline from 'node:readline';
const MS = process.argv[2] || 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md';
const RUN = process.argv[3] || 'bcc0d637';
const raw = fs.readFileSync(MS, 'utf8');
const chapters = raw.split(/^## Chapter \d+: .*$/m).slice(1).map(c => c.replace(/^---\s*$/gm, '').trim());
const body = chapters.join('\n\n').replace(/[’]/g, "'");
const toks = s => (s.toLowerCase().match(/[a-z][a-z']*/g) || []);
const W = toks(body);
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const below = (a, v) => a.filter(x => x < v).length;

// ── 1. instruments that need no word list ──────────────────────────────────────────
const gz = s => zlib.deflateSync(Buffer.from(s.toLowerCase().replace(/\s+/g, ' ')), { level: 9 }).length / Buffer.byteLength(s.toLowerCase().replace(/\s+/g, ' '));
const sentStats = s => {
  const sents = s.replace(/\s+/g, ' ').split(/(?<=[.!?]["”']?)\s+(?=["“']?[A-Z])/).filter(x => x.split(' ').length >= 3);
  const lens = sents.map(x => x.split(' ').length); const mu = lens.reduce((a, b) => a + b, 0) / lens.length; const sd = Math.sqrt(lens.reduce((a, x) => a + (x - mu) ** 2, 0) / lens.length);
  const first = new Map(); for (const x of sents) { const w = (x.replace(/^["“']/, '').match(/^[A-Za-z']+/) || [''])[0].toLowerCase(); first.set(w, (first.get(w) || 0) + 1); }
  const H = -[...first.values()].reduce((a, c) => a + (c / sents.length) * Math.log2(c / sents.length), 0);
  const top5 = [...first.values()].sort((a, b) => b - a).slice(0, 5).reduce((a, b) => a + b, 0) / sents.length;
  let ac = 0; for (let i = 1; i < lens.length; i++) ac += (lens[i] - mu) * (lens[i - 1] - mu); ac /= (lens.length - 1) * sd * sd;
  return { n: sents.length, meanLen: mu, cv: sd / mu, openerEntropy: H, top5: top5, lag1: ac };
};
const me = { gz: gz(body), ...sentStats(body) };
const canon = [];
for (const f of fs.readdirSync('library/texts').filter(f => f.endsWith('.txt'))) {
  const t = fs.readFileSync(`library/texts/${f}`, 'utf8').replace(/\r/g, ''); if (t.length < 40000 + body.length) continue;
  const win = t.slice(40000, 40000 + body.length); canon.push({ gz: gz(win), ...sentStats(win) });
}
console.log(`1. INSTRUMENTS WITH NO WORD LIST — this book against ${canon.length} canon windows of the same length`);
for (const [k, label] of [['gz', 'compressed size / raw size (lower = more redundant)'], ['openerEntropy', 'entropy of the first word of a sentence, bits'], ['top5', 'share of sentences opened by the five commonest first words'], ['cv', 'sentence length, coefficient of variation'], ['meanLen', 'sentence length, mean words'], ['lag1', 'sentence length, lag-1 autocorrelation']]) {
  const xs = canon.map(c => c[k]); console.log(`   ${label.padEnd(64)} book ${me[k].toFixed(3)}   canon median ${med(xs).toFixed(3)}  [${Math.min(...xs).toFixed(3)} .. ${Math.max(...xs).toFixed(3)}]   canon below book: ${below(xs, me[k])}/${xs.length}`);
}
const ours = [];
for (const d of [...fs.readdirSync('stories').filter(d => /^story_2026(09|10)/.test(d))]) { const md = fs.readdirSync(`stories/${d}`).find(f => f.endsWith('.md')); if (!md) continue; const t = fs.readFileSync(`stories/${d}/${md}`, 'utf8').replace(/^#.*$/gm, ''); const w = toks(t); if (w.length < 8000) continue; const g = new Map(); for (let i = 0; i + 4 <= w.length; i++) { const k = w.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v; ours.push({ d: d.slice(6), gz: gz(t.slice(0, 60000)), H: sentStats(t).openerEntropy, rep: rep / w.length * 1e4 }); }
console.log('   our ten v2 books  (gz on the first 60k chars | opener entropy | repeated 4-grams per 10k):');
console.log('   ' + ours.map(o => `${o.d.slice(4)}: ${o.gz.toFixed(3)} | ${o.H.toFixed(2)} | ${o.rep.toFixed(0)}`).join('   '));

// ── 2. keyness: which phrases are over-represented against the canon (Dunning G²) ──
const NAMES = new Set('eleanor gresham reginald jr charles fenwick agatha pemberton isabel morton cliffhaven'.split(' '));
const grams = (w, n) => { const m = new Map(); for (let i = 0; i + n <= w.length; i++) { const g = w.slice(i, i + n); if (g.some(x => NAMES.has(x))) continue; const k = g.join(' '); m.set(k, (m.get(k) || 0) + 1); } return m; };
const book = { 2: grams(W, 2), 3: grams(W, 3) };
const want = { 2: new Map([...book[2]].filter(([, v]) => v >= 5).map(([k]) => [k, 0])), 3: new Map([...book[3]].filter(([, v]) => v >= 4).map(([k]) => [k, 0])) };
let refN = 0;
for (const f of fs.readdirSync('library/texts').filter(f => f.endsWith('.txt'))) { const w = toks(fs.readFileSync(`library/texts/${f}`, 'utf8')).slice(3000, 33000); refN += w.length; for (const n of [2, 3]) for (let i = 0; i + n <= w.length; i++) { const k = w.slice(i, i + n).join(' '); if (want[n].has(k)) want[n].set(k, want[n].get(k) + 1); } }
const G2 = (a, b, n1, n2) => { const e1 = n1 * (a + b) / (n1 + n2), e2 = n2 * (a + b) / (n1 + n2); return 2 * ((a ? a * Math.log(a / e1) : 0) + (b ? b * Math.log(b / e2) : 0)); };
const key = [];
for (const n of [2, 3]) for (const [k, refc] of want[n]) { const a = book[n].get(k); if (a / W.length > refc / refN) key.push({ k, a, refPer10k: refc / refN * 1e4, bookPer10k: a / W.length * 1e4, g: G2(a, refc, W.length, refN) }); }
key.sort((x, y) => y.g - x.g);
console.log(`\n2. KEYNESS — phrases this book over-uses against ${(refN / 1e6).toFixed(1)}M words of canon, ranked by log-likelihood (names excluded)`);
console.log('   ' + key.slice(0, 28).map(x => `${x.k} ×${x.a} (canon ${x.refPer10k.toFixed(2)}/10k)`).join(' | '));

// ── 3. dispersion and attribution: which repeats are refrains, and whose are they ──
let prompt = '', contracts = '';
const rl = readline.createInterface({ input: fs.createReadStream('logs/llm-prompts-full.jsonl') });
for await (const line of rl) { if (!line.includes(RUN) || !line.includes('Agent9v2-Writer')) continue; let r; try { r = JSON.parse(line); } catch { continue; } const t = (r.messages || []).map(m => typeof m.content === 'string' ? m.content : '').join('\n'); const i = t.indexOf('## THE CHAPTERS TO WRITE'); if (!prompt) prompt = t.slice(0, i); let end = t.indexOf('THE BOOK SO FAR', i); if (end < 0) end = t.indexOf('Write the chapters below', i); contracts += '\n' + t.slice(i, end < 0 ? i + 4000 : end); }
const P = prompt.toLowerCase().replace(/[’]/g, "'"), C = contracts.toLowerCase().replace(/[’]/g, "'");
const STOP = new Set('the a an of in on at to and or but is was were be been it its this that he she they his her their with for from by as into had has have not no so if then than there which who what when where while up out over one all'.split(' '));
const stem = w => w.replace(/(ing|ed|es|s|ly)$/, '');
const pLines = prompt.toLowerCase().split('\n').map(l => new Set(toks(l).map(stem))), cLines = contracts.toLowerCase().split('\n').map(l => new Set(toks(l).map(stem)));
const g4 = grams(W, 4); const chTok = chapters.map(c => ' ' + toks(c.replace(/[’]/g, "'")).join(' ') + ' ');
let mass = 0; const cls = { everyCall: 0, contract: 0, model: 0 }, refr = { everyCall: 0, contract: 0, model: 0 }; const ex = { everyCall: [], contract: [], model: [] };
for (const [k, v] of g4) {
  if (v < 3) continue; mass += v;
  const content = k.split(' ').filter(w => !STOP.has(w)).map(stem); if (content.length === 0) { cls.model += v; continue; }
  const inLine = lines => lines.some(l => content.every(w => l.has(w)));
  const where = (P.includes(k) || (content.length >= 2 && inLine(pLines))) ? 'everyCall' : (C.includes(k) || (content.length >= 2 && inLine(cLines))) ? 'contract' : 'model';
  cls[where] += v; const df = chTok.filter(c => c.includes(' ' + k + ' ')).length; if (df >= 5) refr[where] += v; if (ex[where].length < 400) ex[where].push([k, v, df]);
}
console.log(`\n3. WHERE THE REPETITION COMES FROM — every 4-word sequence used 3+ times (names excluded), ${mass} occurrences`);
for (const k of ['everyCall', 'contract', 'model']) console.log(`   ${({ everyCall: 'wording in the bible/brief every call reads', contract: 'wording in a chapter contract only', model: 'in no instruction — the writer\'s own' })[k].padEnd(46)} ${String(cls[k]).padStart(4)} (${(cls[k] / mass * 100).toFixed(0)}%)   of which in 5+ chapters: ${refr[k]}   e.g. ${ex[k].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g, v, df]) => `"${g}" ×${v}/${df}ch`).join(', ')}`);
