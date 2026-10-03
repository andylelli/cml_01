// A_110 Part II — the tail, the clock and repetition over every saved manuscript, by month (v1 until mid-Sept, v2 after).
import fs from 'node:fs';
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;
const CLOCK = /\b(?:(?:a )?quarter (?:to|past)|half past|(?:five|ten|twenty|twenty-five) minutes? (?:to|past))\s+\w+|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) o'clock\b/gi;
const rows = [];
const DIRS = [...fs.readdirSync('stories/_archive').filter(d => /^story_2026/.test(d)).map(d => '_archive/' + d), ...fs.readdirSync('stories').filter(d => /^story_2026/.test(d))].sort((a, b) => a.replace('_archive/', '').localeCompare(b.replace('_archive/', '')));
for (const dd of DIRS) { const d = dd.replace('_archive/', '');
  const md = fs.readdirSync(`stories/${dd}`).find(f => f.endsWith('.md')); if (!md) continue;
  const raw = fs.readFileSync(`stories/${dd}/${md}`, 'utf8'); const t = raw.replace(/^#.*$/gm, '').replace(/[’]/g, "'");
  const w = (t.toLowerCase().match(/[a-z][a-z']*/g) || []); if (w.length < 8000) continue;
  const g = new Map(); for (let i = 0; i + 4 <= w.length; i++) { const k = w.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
  const ch1 = (t.split(/\n---\n/)[1] ?? t).trim(); const firstPara = t.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 40 && !/^\*Run ID/.test(p))[0] || '';
  const q = t.search(/["“]\w/); const before = (t.slice(0, q < 0 ? 0 : q).match(/[A-Za-z][A-Za-z']*/g) || []).length;
  rows.push({ d: d.slice(6), n: w.length, tail: +(((t.match(TAIL) || []).length) / w.length * 1e4).toFixed(0), clock: +(((t.match(CLOCK) || []).length) / w.length * 1e4).toFixed(0), rep: +(rep / w.length * 1e4).toFixed(0), quoteFirst: /^["“]/.test(firstPara), before, engine: /Run ID: (run_|mystery-179|resume-179)/.test(raw) && d >= 'story_20260918' ? 'v2?' : 'v1?' });
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const by = new Map(); for (const r of rows) { const k = r.d.slice(0, 6); by.set(k, [...(by.get(k) ?? []), r]); }
console.log('month   books  tail/10k(med)  clock/10k(med)  4g3+/10k(med)  open-on-quote  words-before-first-quote(med)');
for (const [k, rs] of by) console.log(`${k}   ${String(rs.length).padStart(3)}    ${String(med(rs.map(r => r.tail))).padStart(5)}          ${String(med(rs.map(r => r.clock))).padStart(4)}            ${String(med(rs.map(r => r.rep))).padStart(4)}          ${rs.filter(r => r.quoteFirst).length}/${rs.length}          ${med(rs.map(r => r.before))}`);
// correlation clock density vs repetition, and tail vs repetition, over all books >= 8000 words
const corr = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n; let sxy = 0, sx = 0, sy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sx += (x[i] - mx) ** 2; sy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sx * sy); };
const rank = a => { const s = [...a].map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = Array(a.length); s.forEach(([, i], k) => r[i] = k); return r; };
console.log(`books >= 8000 words: ${rows.length}`);
console.log(`Spearman clock density vs repeated 4-grams: ${corr(rank(rows.map(r => r.clock)), rank(rows.map(r => r.rep))).toFixed(2)};  tail vs repeated 4-grams: ${corr(rank(rows.map(r => r.tail)), rank(rows.map(r => r.rep))).toFixed(2)}`);
const last = rows.filter(r => r.d >= '20260918');
console.log(`since 2026-09-18 (${last.length} books): clock vs rep ${corr(rank(last.map(r => r.clock)), rank(last.map(r => r.rep))).toFixed(2)}; tail vs rep ${corr(rank(last.map(r => r.tail)), rank(last.map(r => r.rep))).toFixed(2)}`);
console.log(last.map(r => `${r.d} tail=${r.tail} clock=${r.clock} rep=${r.rep} quoteFirst=${r.quoteFirst}`).join('\n'));
