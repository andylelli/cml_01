import fs from 'node:fs';
import path from 'node:path';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') && e.name !== 'debrief-template.md' ? [path.join(d, e.name)] : []);
const files = walk('C:/CML/stories');
const seen = new Set();
const KILL = /\b(killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)\b/i;
let books = 0, matches = 0; const byVerbNext = {}; const samples = {};
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  if (!/## Chapter/.test(text)) continue;
  const names = {}; for (const m of text.matchAll(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g)) names[m[1]] = (names[m[1]] ?? 0) + 1;
  const cast = Object.entries(names).filter(([n, c]) => c >= 8 && !/^(The|Chapter|Run|Generated|In|At|On|Mr|Mrs|Miss|Dr|Lady|Lord|Sir|Inspector)\b/.test(n)).map(([n]) => n);
  const key = [...cast].sort().slice(0, 6).join('|');
  if (!key || seen.has(key)) continue; seen.add(key); books++;
  const sents = text.replace(/\n+/g, ' ').split(/(?<=[.!?]["”’]?)\s+/);
  if (false) console.error("DBG", f, cast, sents.length);
  for (const s of sents) for (const name of cast) {
    if (!PE.namesAsCulprit(s, name)) continue;
    const m = s.match(/\b(killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)\b\s+(\S+)/i);
    if (!m) continue; // matched by another clause (confessed, arrested, responsible...)
    matches++;
    const k = `${m[1].toLowerCase()} ${m[2].toLowerCase().replace(/[^a-z-]/g, '')}`;
    byVerbNext[k] = (byVerbNext[k] ?? 0) + 1;
    (samples[k] ??= []).push(`[${name}] ${s.slice(0, 150)}`);
    break;
  }
}
const sorted = Object.entries(byVerbNext).sort((a, b) => b[1] - a[1]);
console.log({ files: files.length, distinctCases: books, sentencesMatchedByKillVerbClause: matches });
for (const [k, n] of sorted.slice(0, 40)) console.log(String(n).padStart(4), k, '|', samples[k][0].slice(0, 140));
const byVerb = {}; let personObj = 0, passive = 0;
for (const [k, n] of Object.entries(byVerbNext)) {
  const [v, nx] = k.split(' ');
  byVerb[v] = (byVerb[v] ?? 0) + n;
}
const fig = ['cut', 'struck', 'pushed', 'shot'];
const figTotal = fig.reduce((s, v) => s + (byVerb[v] ?? 0), 0);
// of the figurative-prone verbs, which have a person-like object: him/her/a capitalised next token in the sample
let figPerson = 0; const figPersonSamples = [];
for (const [k, list] of Object.entries(samples)) {
  const [v] = k.split(' ');
  if (!fig.includes(v)) continue;
  for (const s of list) {
    const m = s.match(/\b(cut|struck|pushed|shot)\s+(him|her|them|[A-Z][a-z]+)\b/);
    if (m && !/^(The|A|An|It|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve)$/.test(m[2])) { figPerson++; figPersonSamples.push(s.slice(0, 120)); }
  }
}
console.log({ byVerb, figTotal, figPerson });
for (const s of figPersonSamples) console.log('   ', s);
