// SHIP-CHECK repetition: how much of the WORTH-A-LOOK verdict is locked clock values the guards forbid editing?
import fs from 'node:fs';
import path from 'node:path';
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const CML = await import('file:///C:/CML/packages/cml/dist/index.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') && e.name !== 'debrief-template.md' ? [path.join(d, e.name)] : []);
const files = walk('C:/CML/stories');
const seen = new Set();
const threshold = PG.REPETITION_CORPUS_MEDIAN_PER_10K * PG.REPETITION_ATTENTION_MULTIPLE;
let flagged = 0, flippedToNormal = 0, cases = 0;
const rows = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  if (!/## Chapter/.test(text)) continue;
  const names = {}; for (const m of text.matchAll(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g)) names[m[1]] = (names[m[1]] ?? 0) + 1;
  const key = Object.entries(names).filter(([, c]) => c >= 8).map(([n]) => n).sort().slice(0, 6).join('|');
  const d = PG.repetitionDensity(text, 6, 3, 100000);
  const pairs = new Set();
  for (const v of CML.extractClockValues(text)) { const w = PG.repetitionWords(v.raw); for (let i = 0; i + 2 <= w.length; i++) pairs.add(`${w[i]} ${w[i + 1]}`); }
  const touches = (span) => { const w = span.split(' '); return w.slice(0, -1).some((x, i) => pairs.has(`${x} ${w[i + 1]}`)); };
  const clockSpans = d.worst.filter(s => touches(s.span)).length;
  const per10kNoClock = (10000 * (d.repeatedSpans - clockSpans)) / d.words;
  const isFlagged = d.per10k >= threshold;
  const isV2era = /story_202609(2[2-9]|30)|story_2026100/.test(f);
  if (key && !seen.has(key)) { seen.add(key); cases++; if (isFlagged) { flagged++; if (per10kNoClock < threshold) flippedToNormal++; } }
  if (isV2era || isFlagged && per10kNoClock < threshold) rows.push(`${path.basename(path.dirname(f))} per10k ${d.per10k.toFixed(1)} clock-touching spans ${clockSpans}/${d.repeatedSpans} -> without them ${per10kNoClock.toFixed(1)} ${isFlagged ? (per10kNoClock < threshold ? 'WORTH-A-LOOK -> Normal' : 'WORTH-A-LOOK stays') : 'Normal'}`);
}
console.log(`threshold ${threshold.toFixed(1)}; distinct cases ${cases}; flagged WORTH A LOOK ${flagged}; flagged only because of clock-value spans ${flippedToNormal}`);
for (const r of rows) console.log('  ', r);
