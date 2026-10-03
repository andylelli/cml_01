// A_110 Part III §24 — like-for-like floors: every text measured on the SAME window (60,000 characters), canon and ours.
// Run from the repo root:  node documentation/analysis/ANALYSIS_110/probes/floor-probe.mjs
import fs from 'node:fs';
import zlib from 'node:zlib';
const N = 60000;
const norm = s => s.toLowerCase().replace(/\s+/g, ' ');
const gz = s => zlib.deflateSync(Buffer.from(s), { level: 9 }).length / Buffer.byteLength(s);
const opener = s => {
  const sents = s.split(/(?<=[.!?]["”']?)\s+(?=["“']?[A-Za-z])/).filter(x => x.split(' ').length >= 3);
  const first = new Map(); for (const x of sents) { const w = (x.replace(/^["“']/, '').match(/^[a-z']+/i) || [''])[0].toLowerCase(); first.set(w, (first.get(w) || 0) + 1); }
  return -[...first.values()].reduce((a, c) => a + (c / sents.length) * Math.log2(c / sents.length), 0);
};
const canon = [];
for (const f of fs.readdirSync('library/texts').filter(f => f.endsWith('.txt'))) {
  const t = fs.readFileSync(`library/texts/${f}`, 'utf8').replace(/\r/g, ''); if (t.length < 40000 + N + 5000) continue;
  const raw = t.slice(40000, 40000 + N + 5000).replace(/\s+/g, ' ').slice(0, N); canon.push({ gz: gz(norm(raw)), H: opener(raw) });
}
const q = (k, p) => { const a = canon.map(c => c[k]).sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(a.length * p))]; };
console.log(`canon windows of ${N} characters: ${canon.length}`);
console.log(`compressed ratio: min ${q('gz', 0).toFixed(3)}  p5 ${q('gz', 0.05).toFixed(3)}  median ${q('gz', 0.5).toFixed(3)}  max ${q('gz', 0.999).toFixed(3)}`);
console.log(`opener entropy:   min ${q('H', 0).toFixed(2)}  p5 ${q('H', 0.05).toFixed(2)}  median ${q('H', 0.5).toFixed(2)}`);
const dirs = [...fs.readdirSync('stories/_archive').filter(d => /^story_2026/.test(d)).map(d => `stories/_archive/${d}`), ...fs.readdirSync('stories').filter(d => /^story_2026/.test(d)).map(d => `stories/${d}`)];
const rows = [];
for (const d of dirs) {
  const md = fs.readdirSync(d).find(f => f.endsWith('.md')); if (!md) continue;
  const raw = fs.readFileSync(`${d}/${md}`, 'utf8').replace(/^#.*$/gm, '').replace(/^\*Run ID.*$/m, '').replace(/^---\s*$/gm, '').replace(/\s+/g, ' ').trim();
  if (raw.length < N) continue;
  const w = raw.slice(0, N); rows.push({ d: d.split('story_')[1], gz: gz(norm(w)), H: opener(w) });
}
const floorGz = q('gz', 0), floorH = q('H', 0), p5Gz = q('gz', 0.05), p5H = q('H', 0.05);
const month = new Map(); for (const r of rows) { const k = r.d.slice(0, 6); month.set(k, [...(month.get(k) ?? []), r]); }
console.log(`\nour manuscripts of ${N}+ characters: ${rows.length}`);
console.log('month   books  below canon MIN ratio  below canon p5 ratio  below canon MIN entropy  below canon p5 entropy');
for (const [k, rs] of month) console.log(`${k}   ${String(rs.length).padStart(4)}   ${String(rs.filter(r => r.gz < floorGz).length).padStart(8)}             ${String(rs.filter(r => r.gz < p5Gz).length).padStart(8)}            ${String(rs.filter(r => r.H < floorH).length).padStart(8)}               ${String(rs.filter(r => r.H < p5H).length).padStart(8)}`);
console.log('\nthe ten v2 books in stories/:');
for (const r of rows.filter(r => r.d >= '20260925')) console.log(`   ${r.d}  ratio ${r.gz.toFixed(3)} ${r.gz < floorGz ? 'BELOW MIN' : r.gz < p5Gz ? 'below p5' : 'ok'}   entropy ${r.H.toFixed(2)} ${r.H < floorH ? 'BELOW MIN' : r.H < p5H ? 'below p5' : 'ok'}`);
