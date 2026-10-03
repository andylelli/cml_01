// A_110 Part IV — WP-006 K9 for the proposed tail finding: a per-chapter threshold taken from the canon's WORST chapter.
// Run from the repo root:  node documentation/analysis/ANALYSIS_110/probes/tail-threshold.mjs [manuscript.md]
import fs from 'node:fs';
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;
const CH = 7500; // characters, about 1,250 words: one of our chapters
const worst = [];
for (const f of fs.readdirSync('library/texts').filter(f => f.endsWith('.txt'))) {
  const t = fs.readFileSync(`library/texts/${f}`, 'utf8').replace(/\s+/g, ' ');
  if (t.length < 30000 + 10 * CH) continue;
  let m = 0; for (let k = 0; k < 10; k++) m = Math.max(m, (t.slice(30000 + k * CH, 30000 + (k + 1) * CH).match(TAIL) || []).length);
  worst.push(m);
}
worst.sort((a, b) => a - b);
const q = p => worst[Math.min(worst.length - 1, Math.floor(worst.length * p))];
console.log(`canon texts: ${worst.length}; the WORST of ten ${CH}-character chapters, per text: median ${q(0.5)}, p90 ${q(0.9)}, p95 ${q(0.95)}, max ${worst[worst.length - 1]}`);
for (const th of [2, 3, 4, 5]) console.log(`  a per-chapter finding at ${th}+ tails fires on ${worst.filter(x => x >= th).length} of ${worst.length} canon books (${(worst.filter(x => x >= th).length / worst.length * 100).toFixed(0)}%)`);
const ms = process.argv[2] || 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md';
const chs = fs.readFileSync(ms, 'utf8').split(/^## Chapter \d+: .*$/m).slice(1);
console.log(`this book, tails per chapter: ${chs.map(c => (c.match(TAIL) || []).length).join(' ')}`);
