// A_110 Part II — how v2's writer has responded to each KIND of instruction, over every v2 run in the prompt log.
// The pair is (the contract the writer was sent) x (the draft it wrote, as the critic received it).
import fs from 'node:fs';
import readline from 'node:readline';
const LOG = process.argv[2] || 'logs/llm-prompts-full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(LOG) });
const runs = new Map();
const textOf = r => (r.messages || []).map(m => typeof m.content === 'string' ? m.content : JSON.stringify(m.content)).join('\n');
for await (const line of rl) {
  if (!line.includes('Agent9v2-')) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  const key = r.runId || r.projectId; if (!key) continue;
  const e = runs.get(key) ?? { contracts: new Map(), bible: '', critic: '', ts: r.timestamp };
  if (/^Agent9v2-Writer/.test(r.agent)) {
    const t = textOf(r);
    if (!e.bible) e.bible = t.slice(0, t.indexOf('## THE CHAPTERS TO WRITE') > 0 ? t.indexOf('## THE CHAPTERS TO WRITE') : 40000);
    const i = t.lastIndexOf('## THE CHAPTERS TO WRITE');
    if (i >= 0) {
      let end = t.indexOf('THE BOOK SO FAR', i); if (end < 0) end = t.indexOf('Write the chapters below', i); if (end < 0) end = t.length;
      for (const b of t.slice(i, end).split(/(?=^=== CHAPTER \d+)/m)) { const m = b.match(/^=== CHAPTER (\d+)/); if (m && !e.contracts.has(+m[1])) e.contracts.set(+m[1], b); }
    }
  } else if (/^Agent9v2-Critic/.test(r.agent) && !e.critic) e.critic = textOf(r);
  runs.set(key, e);
}
const norm = s => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
const count = (hay, needle) => { if (!needle || needle.length < 4) return 0; let n = 0, i = 0; while ((i = hay.indexOf(needle, i)) >= 0) { n++; i += needle.length; } return n; };
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;
const agg = { runs: 0, notes: 0, notesPrinted: 0, notesRepeated: 0, tics: 0, ticOnce: 0, ticMany: 0, ticZero: 0, traits: 0, traitHits: [], aftermath: 0, aftermathQuoteOpen: 0, ch: 0, chQuoteOpen: 0, ch1QuoteOpen: 0, wound: [], victimCleared: 0, clearRuns: 0, occ: 0, occStated: 0, custody: 0, emptyChair: [], rows: [] };
for (const [key, e] of runs) {
  if (!e.critic || e.contracts.size < 5) continue;
  const chapters = new Map(e.critic.split(/(?=^=== CHAPTER \d+)/m).map(b => { const m = b.match(/^=== CHAPTER (\d+)[^\n]*\n([\s\S]*)$/); return m ? [+m[1], m[2].trim()] : null; }).filter(Boolean));
  if (chapters.size < 5) continue;
  agg.runs++;
  const book = norm([...chapters.values()].join('\n\n'));
  const words = (book.match(/[a-z][a-z']*/g) || []);
  // M1 place notes
  let notes = 0, printed = 0, repeated = 0;
  for (const c of e.contracts.values()) for (const m of c.matchAll(/Of this place at this hour[^:]*: (.*)\.\s*$/gm)) for (const frag of m[1].split(';').map(s => norm(s.trim()))) { notes++; const k = count(book, frag); if (k >= 1) printed++; if (k >= 2) repeated++; }
  agg.notes += notes; agg.notesPrinted += printed; agg.notesRepeated += repeated;
  // M2 stock line "Says this once in the book, in chapter N: <tic>"
  for (const m of e.bible.matchAll(/Says this once in the book, in chapter (\d+): (.*)$/gm)) { const tic = norm(m[2]).replace(/^["']|["',.]+$/g, '').trim(); if (tic.split(' ').length < 2) continue; agg.tics++; const k = count(book, tic); if (k === 1) agg.ticOnce++; else if (k === 0) agg.ticZero++; else agg.ticMany++; }
  // M3 trait labels
  const traitSeen = new Set();
  for (const c of e.contracts.values()) for (const m of c.matchAll(/shown as an action and never explained: (.*)$/gm)) { const t = norm(m[1]).replace(/[.]+$/, '').replace(/^(after|at|during|when|the|a|an)\s+/, '').replace(/^(a|an|the)\s+/, ''); const w = t.split(/\s+/); const key2 = w.slice(-3).join(' '); if (traitSeen.has(key2) || w.length < 2) continue; traitSeen.add(key2); agg.traits++; agg.traitHits.push(count(book, key2)); }
  // M4 openings
  let qo = 0;
  for (const [n, body] of chapters) { const first = body.split(/\n+/)[0].trim(); const q = /^["“]/.test(first); agg.ch++; if (q) { agg.chQuoteOpen++; qo++; } if (n === 1 && q) agg.ch1QuoteOpen++; const c = e.contracts.get(n) || ''; if (/Opens on the first ordinary thing|opens on the first ordinary/i.test(c)) { agg.aftermath++; if (q) agg.aftermathQuoteOpen++; } if (/set before the death/.test(c)) agg.wound.push(n); }
  // M12 victim in clearances
  const victim = (e.bible.match(/^The dead: ([^,\n]+),/m) || [])[1];
  const allC = [...e.contracts.values()].join('\n');
  if (/is cleared here/.test(allC)) { agg.clearRuns++; if (victim && new RegExp(`^\\s*${victim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} is cleared here`, 'm').test(allC)) agg.victimCleared++; }
  // M8 occupation at first appearance
  for (const m of e.bible.matchAll(/^([A-Z][A-Za-z.' -]+?) \((?:he\/him|she\/her|they\/them)\) — ([^\n]+)$/gm)) {
    const name = m[1]; if (name === victim) continue; const occ = (m[2].split(',').pop() || '').trim().toLowerCase().replace(/\(.*\)/, '').trim(); const head = occ.split(/\s+/).filter(w => w.length > 3 && !/^(retired|former|local|occasional|family|and|hotel)$/.test(w)).pop(); if (!head) continue;
    const firstCh = [...chapters].find(([, b]) => norm(b).includes(norm(name.split(' ')[0]))); if (!firstCh) continue; agg.occ++; if (norm(firstCh[1]).includes(head.slice(0, Math.max(5, head.length - 2)))) agg.occStated++;
  }
  // clock
  const clockSec = (e.bible.match(/## THE CLOCK[^\n]*\n([\s\S]*?)\n## /) || [, ''])[1];
  const vals = [...new Set([...clockSec.matchAll(/^\s{2}(.+?) — /gm)].map(m => norm(m[1])).filter(v => v.split(' ').length <= 6))];
  const clockMentions = vals.filter(v => !vals.some(o => o !== v && o.includes(v))).reduce((s, v) => s + count(book, v), 0);
  const g = new Map(); for (let i = 0; i + 4 <= words.length; i++) { const k = words.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
  const quotes = [...book.matchAll(/(?:asked|said|replied|was|remarked|answered),? "([^"]{120,})"/g)].map(m => m[1].split(/\s+/).length);
  const ec = count(book, 'empty chair'); if (/in custody since/.test(allC)) { agg.custody++; agg.emptyChair.push(ec); }
  agg.rows.push(`${e.ts.slice(5, 16)} ${String(key).slice(-13)} w=${words.length} quoteOpen=${qo}/${chapters.size} notes=${printed}/${notes}(rep ${repeated}) clockRows=${clockSec.split('\n').filter(l => l.trim()).length} clockMent/10k=${(clockMentions / words.length * 1e4).toFixed(0)} 4g3+=${(rep / words.length * 1e4).toFixed(0)} tail/10k=${(((book.match(TAIL) || []).length) / words.length * 1e4).toFixed(0)} wasAsked=${count(book, 'was asked')} nWords=${(book.match(/(four|six) words/g) || []).length} chapterN=${(book.match(/\bchapter \d/g) || []).length} period=${count(book, "the period")} longQ60+=${quotes.filter(n => n >= 60).length} maxQ=${Math.max(0, ...quotes)} emptyChair=${ec}`);
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
console.log(`runs with a contract and a critic draft: ${agg.runs}`);
console.log(`M1 place notes: ${agg.notes} fragments sent; printed verbatim ${agg.notesPrinted} (${(agg.notesPrinted / agg.notes * 100).toFixed(0)}%); printed twice or more ${agg.notesRepeated} (${(agg.notesRepeated / agg.notes * 100).toFixed(0)}%)`);
console.log(`M2 "says this once, in chapter N": ${agg.tics} lines; exactly once ${agg.ticOnce}; never ${agg.ticZero}; twice or more ${agg.ticMany}`);
console.log(`M3 trait label ("shown as an action and never explained"): ${agg.traits} traits; label's last three words printed — median ${med(agg.traitHits)} times, zero in ${agg.traitHits.filter(x => x === 0).length}, 3+ in ${agg.traitHits.filter(x => x >= 3).length}`);
console.log(`M4 chapters opening on a quotation mark: ${agg.chQuoteOpen}/${agg.ch}; chapter 1: ${agg.ch1QuoteOpen}/${agg.runs}; aftermath chapters told "opens on the first ordinary thing": ${agg.aftermathQuoteOpen}/${agg.aftermath} open on speech`);
console.log(`M5 before-death scene lands in chapter: ${JSON.stringify(agg.wound.reduce((m, c) => (m[c] = (m[c] || 0) + 1, m), {}))}`);
console.log(`M8 occupation word on the page in the chapter a person first appears: ${agg.occStated}/${agg.occ}`);
console.log(`M12 runs whose contract clears the VICTIM: ${agg.victimCleared}/${agg.clearRuns}`);
console.log(`custody line runs: ${agg.custody}; "empty chair" counts in those: ${agg.emptyChair.join(',')}`);
console.log(agg.rows.join('\n'));
