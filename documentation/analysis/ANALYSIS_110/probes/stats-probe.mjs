// A_110 Part III — the statistics the plan needs: run-to-run noise on identical upstream, who is really on the page,
// and what the selector actually selects on. Run from the repo root.
import fs from 'node:fs';
import readline from 'node:readline';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const gz = s => { const x = s.toLowerCase().replace(/\s+/g, ' ').slice(0, 40000); return zlib.deflateSync(Buffer.from(x), { level: 9 }).length / Buffer.byteLength(x) * 1000; };
const sentStats = s => { const sents = s.replace(/\s+/g, ' ').split(/(?<=[.!?]["”']?)\s+(?=["“']?[A-Z])/).filter(x => x.split(' ').length >= 3); const lens = sents.map(x => x.split(' ').length); const mu = lens.reduce((a, b) => a + b, 0) / lens.length; const sdv = Math.sqrt(lens.reduce((a, x) => a + (x - mu) ** 2, 0) / lens.length); const first = new Map(); for (const x of sents) { const w = (x.replace(/^["“']/, '').match(/^[A-Za-z']+/) || [''])[0].toLowerCase(); first.set(w, (first.get(w) || 0) + 1); } const H = -[...first.values()].reduce((a, c) => a + (c / sents.length) * Math.log2(c / sents.length), 0); let ac = 0; for (let i = 1; i < lens.length; i++) ac += (lens[i] - mu) * (lens[i - 1] - mu); ac /= (lens.length - 1) * sdv * sdv; return { H, ac }; };
const textOf = r => (r.messages || []).map(m => typeof m.content === 'string' ? m.content : JSON.stringify(m.content)).join('\n');
const runs = new Map();
const rl = readline.createInterface({ input: fs.createReadStream('logs/llm-prompts-full.jsonl') });
for await (const line of rl) {
  if (!line.includes('Agent9v2-')) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  const key = r.runId || r.projectId; if (!key) continue;
  const e = runs.get(key) ?? { contracts: new Map(), bible: '', critic: '', ts: r.timestamp };
  if (/^Agent9v2-Writer/.test(r.agent)) {
    const t = textOf(r);
    if (!e.bible) e.bible = t.slice(0, t.indexOf('## THE CHAPTERS TO WRITE') > 0 ? t.indexOf('## THE CHAPTERS TO WRITE') : 40000);
    const i = t.lastIndexOf('## THE CHAPTERS TO WRITE');
    if (i >= 0) { let end = t.indexOf('THE BOOK SO FAR', i); if (end < 0) end = t.indexOf('Write the chapters below', i); if (end < 0) end = t.length; for (const b of t.slice(i, end).split(/(?=^=== CHAPTER \d+)/m)) { const m = b.match(/^=== CHAPTER (\d+)/); if (m && !e.contracts.has(+m[1])) e.contracts.set(+m[1], b); } }
  } else if (/^Agent9v2-Critic/.test(r.agent) && !e.critic) e.critic = textOf(r);
  runs.set(key, e);
}
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;
const sd = a => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, a.length - 1)); };
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const wilson = (k, n) => { if (!n) return 'n/a'; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return `${k}/${n} = ${(p * 100).toFixed(0)}% [${(Math.max(0, c - h) * 100).toFixed(0)}–${(Math.min(1, c + h) * 100).toFixed(0)}]`; };

// ── (a) noise on identical upstream ────────────────────────────────────────────────
const groups = new Map(); let walkCh = 0, walkAny = 0, listed = 0, appear = 0, walkins = 0, firstMismatch = 0, people = 0, earlier = 0;
for (const [key, e] of runs) {
  if (!e.critic || e.contracts.size < 5) continue;
  const chapters = new Map(e.critic.split(/(?=^=== CHAPTER \d+)/m).map(b => { const m = b.match(/^=== CHAPTER (\d+)[^\n]*\n([\s\S]*)$/); return m ? [+m[1], m[2].trim()] : null; }).filter(Boolean));
  if (chapters.size < 5) continue;
  const book = [...chapters.values()].join('\n\n').replace(/[’]/g, "'");
  const w = book.toLowerCase().match(/[a-z][a-z']*/g) || [];
  const g = new Map(); for (let i = 0; i + 4 <= w.length; i++) { const k = w.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
  const paras = book.split(/\n+/).filter(p => p.trim().length > 30);
  const row = { words: w.length, tail: (book.match(TAIL) || []).length / w.length * 1e4, rep: rep / w.length * 1e4, speechOpen: paras.filter(p => /^["“]/.test(p.trim())).length / paras.length * 100, types: new Set(w.slice(0, 6000)).size, gzX1000: gz(book), openerEntropy: sentStats(book).H * 100, lag1x100: sentStats(book).ac * 100 };
  const caseKey = crypto.createHash('md5').update((e.bible.match(/## THE CASE[\s\S]*?(?=\n## THE PEOPLE)/) || [''])[0]).digest('hex').slice(0, 8);
  groups.set(caseKey, [...(groups.get(caseKey) ?? []), row]);
  // ── (c) who is on the page: the contract's list against the text ──
  const victim = (e.bible.match(/^The dead: ([^,\n]+),/m) || [])[1];
  const cast = [...e.bible.matchAll(/^([A-Z][A-Za-z.' -]+?) \((?:he\/him|she\/her|they\/them)\) — /gm)].map(m => m[1]).filter(n => n !== victim);
  const firstNames = new Map(cast.map(n => [n, n.split(/\s+/)[0]]));
  const clash = new Set([...firstNames.values()].filter((f, i, a) => a.indexOf(f) !== i));
  const tok = n => clash.has(firstNames.get(n)) ? n : firstNames.get(n);
  const firstList = new Map(), firstText = new Map();
  for (const [n, body] of [...chapters].sort((a, b) => a[0] - b[0])) {
    const c = e.contracts.get(n) || ''; const lst = ((c.match(/^\s*On the page: (.*)\.$/m) || [])[1] || '').split(',').map(s => s.trim()).filter(Boolean);
    let any = false; walkCh++;
    for (const p of cast) {
      const on = lst.includes(p), there = new RegExp(`\\b${tok(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^.]{0,80}\\b(said|asked|replied|answered|murmured|remarked|entered|stepped|stood|sat|looked|nodded|turned)\\b|"[^"]*,"\\s+${tok(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(body);
      if (on) { listed++; if (!firstList.has(p)) firstList.set(p, n); }
      if (there) { appear++; if (!firstText.has(p)) firstText.set(p, n); if (!on) { walkins++; any = true; } }
    }
    if (any) walkAny++;
  }
  for (const p of cast) { if (!firstText.has(p)) continue; people++; const a = firstList.get(p) ?? 99, b = firstText.get(p); if (a !== b) firstMismatch++; if (b < a) earlier++; }
}
console.log('(a) NOISE ON IDENTICAL UPSTREAM — runs sharing one case (same THE CASE text), drafts as the critic received them');
const pooled = { tail: [], rep: [], speechOpen: [], types: [], gzX1000: [], openerEntropy: [], lag1x100: [] }; let gN = 0, rN = 0;
for (const [k, rows] of groups) { if (rows.length < 3) continue; gN++; rN += rows.length; for (const m of Object.keys(pooled)) { const xs = rows.map(r => r[m]); const mu = mean(xs); pooled[m].push(...xs.map(x => x - mu)); } console.log(`   case ${k}: n=${rows.length}  tail ${rows.map(r => r.tail.toFixed(0)).join(',')}  4g3+ ${rows.map(r => r.rep.toFixed(0)).join(',')}  speech-open% ${rows.map(r => r.speechOpen.toFixed(0)).join(',')}`); }
console.log(`   groups with 3+ runs: ${gN}, runs: ${rN}`);
for (const m of Object.keys(pooled)) { const s = Math.sqrt(pooled[m].reduce((a, x) => a + x * x, 0) / Math.max(1, pooled[m].length - gN)); console.log(`   ${m.padEnd(11)} within-case SD ${s.toFixed(1)}  →  one pair detects a change of ${(2.77 * s).toFixed(0)} or more (95%);  pairs needed to detect a change of 1 SD at 80% power: ${Math.ceil(2 * (1.96 + 0.84) ** 2)}`); }

console.log('\n(c) WHO IS REALLY ON THE PAGE — the contract\'s "On the page" list against the draft');
console.log(`   chapters with at least one living cast member acting or speaking who is NOT on the list: ${wilson(walkAny, walkCh)}`);
console.log(`   appearances not on the list: ${wilson(walkins, appear)} of all appearances`);
console.log(`   people whose first chapter in the TEXT differs from their first chapter on a LIST: ${wilson(firstMismatch, people)};  appear earlier than listed: ${wilson(earlier, people)}`);

// ── (d) what the selector selects on ───────────────────────────────────────────────
const CAL = { register: { sd: 0.0334, w: -3 }, repetition: { sd: 94.3212, w: -1 }, speech: { sd: 0.0513, w: 1.5 }, longS: { sd: 0.0135, w: 1 }, wit: { sd: 6.9637, w: 1 } };
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const segs = [];
for (const ev of store.runEvents) for (const s of String(ev.message || '').split(/(?=\[Agent 9 v2\] segment \d+ drafts:)/)) {
  if (!/^\[Agent 9 v2\] segment \d+ drafts:/.test(s)) continue;
  const drafts = [...s.matchAll(/(\*?)\s*draft (\d+): composite ([-\d.]+), hard (\d+) ranking of (\d+), register ([\d.]+), repetition ([\d.]+), speech-open (\d+)%, tail (\d+)%, wit ([\d.]+)\/(\d+)/g)].map(m => ({ chosen: m[1] === '*', comp: +m[3], rank: +m[4], hard: +m[5], register: Math.max(+m[6], 0.058), repetition: +m[7], speech: +m[8] / 100, longS: +m[9] / 100, wit: +m[10] }));
  if (drafts.length >= 2) segs.push(drafts);
}
console.log(`\n(d) WHAT THE SELECTOR SELECTS ON — ${segs.length} selections with 2+ drafts in data/store.json`);
if (segs.length) {
  const within = { register: [], repetition: [], speech: [], longS: [], wit: [] };
  const decided = { register: 0, repetition: 0, speech: 0, longS: 0, wit: 0, hard: 0 }; let maxSpeechChosen = 0, maxWitChosen = 0, minRepChosen = 0, spread = [];
  for (const d of segs) {
    for (const k of Object.keys(within)) { const mu = mean(d.map(x => x[k])); within[k].push(...d.map(x => x[k] - mu)); }
    const ch = d.find(x => x.chosen) ?? d[0]; const others = d.filter(x => x !== ch); const best = others.sort((a, b) => b.comp - a.comp)[0];
    spread.push(Math.max(...d.map(x => x.comp)) - Math.min(...d.map(x => x.comp)));
    if (ch.rank !== best.rank) { decided.hard++; } else { const contrib = Object.keys(CAL).map(k => [k, CAL[k].w * (ch[k] - best[k]) / CAL[k].sd]); contrib.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])); decided[contrib[0][0]]++; }
    if (ch.speech === Math.max(...d.map(x => x.speech))) maxSpeechChosen++;
    if (ch.wit === Math.max(...d.map(x => x.wit))) maxWitChosen++;
    if (ch.repetition === Math.min(...d.map(x => x.repetition))) minRepChosen++;
  }
  for (const k of Object.keys(within)) { const s = Math.sqrt(within[k].reduce((a, x) => a + x * x, 0) / Math.max(1, within[k].length - segs.length)); console.log(`   ${k.padEnd(11)} between-draft SD ${s.toFixed(4)}  vs calibration SD ${CAL[k].sd}  → ${(s / CAL[k].sd).toFixed(1)} calibration SDs per draft SD;  effective pull = |weight| × that = ${(Math.abs(CAL[k].w) * s / CAL[k].sd).toFixed(1)}`); }
  console.log(`   the term with the largest contribution to chosen-vs-runner-up: ${JSON.stringify(decided)}`);
  console.log(`   chosen draft has the highest speech-open share: ${wilson(maxSpeechChosen, segs.length)};  the highest wit: ${wilson(maxWitChosen, segs.length)};  the lowest repetition: ${wilson(minRepChosen, segs.length)}   (chance with 3 drafts: 33%)`);
  const sp = spread.sort((a, b) => a - b); console.log(`   composite spread across a selection's drafts: median ${sp[Math.floor(sp.length / 2)].toFixed(2)}, p25 ${sp[Math.floor(sp.length * 0.25)].toFixed(2)}`);
}
// ── (b) how many drafts settle a compliance question ───────────────────────────────
console.log('\n(b) HOW MANY DRAFTS SETTLE "WILL IT OBEY" — exact one-sided 95% lower bound on the compliance rate after n of n successes');
console.log('   ' + [3, 5, 9, 14, 22, 29].map(n => `${n}/${n} → p ≥ ${(Math.pow(0.05, 1 / n)).toFixed(2)}`).join(';  '));
console.log(`   needed for "at least one of 3 drafts complies" 95% of the time: p ≥ ${(1 - Math.pow(0.05, 1 / 3)).toFixed(3)};  99%: p ≥ ${(1 - Math.pow(0.01, 1 / 3)).toFixed(3)}`);
const sprt = (p0, p1, a = 0.05, b = 0.1) => { const A = Math.log((1 - b) / a), B = Math.log(b / (1 - a)); const s1 = Math.log(p1 / p0), s0 = Math.log((1 - p1) / (1 - p0)); const en = (p) => ((1 - (p === p1 ? b : 1 - a)) * 0 + ((p === p1 ? (1 - b) * A + b * B : a * A + (1 - a) * B))) / (p * s1 + (1 - p) * s0); return { acceptAfterStraightSuccesses: Math.ceil(A / s1), rejectAfterStraightFailures: Math.ceil(B / s0), expectedIfTrue: en(p1).toFixed(1), expectedIfFalse: en(p0).toFixed(1) }; };
console.log('   sequential test, H0 p=0.37 (useless even with 3 drafts) vs H1 p=0.75:', JSON.stringify(sprt(0.37, 0.75)));
