// WP-006 probe. No I/O. How many runs until every PAIR of run-parameter values has been exercised:
// independent weighted draws (what scripts/run-params.mjs does) against a greedy covering array.
// Field lists are those of scripts/run-params.mjs at 57697b5d (lines 429-613); a repeat in a list is a weight.
const F = {
  axis: ["temporal", "spatial", "identity", "behavioral", "authority"],
  cast: [5, 6, 6, 6, 7],
  era: ["1920s", "1930s", "1930s", "1940s", "1950s"],
  location: ["CountryHouse", "SeasideHotel", "Village", "Liner", "Theatre"],
  tone: ["Cozy", "Classic", "Classic", "Dark"],
  detective: ["amateur", "amateur", "private", "police"],
  style: ["classic", "classic", "atmospheric", "modern"],
  humour: ["classic", "classic", "dry", "sharp"],
};
const names = Object.keys(F);
const values = Object.fromEntries(names.map((n) => [n, [...new Set(F[n])]]));
const allPairs = new Set();
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) for (const a of values[names[i]]) for (const b of values[names[j]]) allPairs.add(`${names[i]}=${a}|${names[j]}=${b}`);
const pairsOf = (run) => { const out = []; for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) out.push(`${names[i]}=${run[names[i]]}|${names[j]}=${run[names[j]]}`); return out; };
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rng = mulberry32(2026);
const draw = () => Object.fromEntries(names.map((n) => [n, F[n][Math.floor(rng() * F[n].length)]]));
const q = (a, p) => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) * p)];
const full = Object.values(values).reduce((p, v) => p * v.length, 1);
console.log(`fields ${names.length}; distinct settings ${full}; value pairs to cover ${allPairs.size}`);
const need = [], at = { 12: [], 30: [], 78: [] };
for (let t = 0; t < 2000; t++) { const seen = new Set(); let n = 0; while (seen.size < allPairs.size) { n++; for (const p of pairsOf(draw())) seen.add(p); if (at[n]) at[n].push(seen.size / allPairs.size); } need.push(n); }
console.log(`independent draws: runs until every pair is seen - median ${q(need, 0.5)}, 90th percentile ${q(need, 0.9)}`);
for (const k of [12, 30, 78]) console.log(`  after ${k} runs: pairs seen, median ${(100 * q(at[k], 0.5)).toFixed(0)}%`);
// greedy covering array: each new run is the best of 400 random candidates by newly covered pairs
const uni = () => Object.fromEntries(names.map((n) => [n, values[n][Math.floor(rng() * values[n].length)]]));
const seen = new Set(); let runs = 0;
const trail = [];
while (seen.size < allPairs.size) { let best = null, gain = -1; for (let c = 0; c < 400; c++) { const r = uni(); const g = pairsOf(r).filter((p) => !seen.has(p)).length; if (g > gain) { gain = g; best = r; } } for (const p of pairsOf(best)) seen.add(p); runs++; trail.push(seen.size / allPairs.size); }
console.log(`designed (greedy covering array): every pair in ${runs} runs; after 12 runs ${(100 * trail[11]).toFixed(0)}%; lower bound ${5 * 5} (the two largest fields)`);
