// WP-007 §4.4 — Burrows / Cosine Delta (Evert et al. 2017) over the 300 most frequent words: how far apart
// are twelve of our books from each other, against twelve books by one canon author? Function-word style is
// far less period-bound than content phrases, so this is the list-free sameness figure WP-006 §4.2 lacked.
// Loaders copied from WP-006-probes/unique-case-sameness.mjs (one manuscript per distinct cast). Read-only.
//
//   node --max-old-space-size=6000 documentation/white-papers/WP-007-probes/delta-dispersion.mjs [all|read] [YYYYMMDD]
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MODE = process.argv[2] ?? "all";
const CUT = process.argv[3] ?? "00000000";
const W = 8000, MFW = 300, K = 12;
const tokens = (t) => (t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []);
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rng = mulberry32(23);
const sample = (arr, k) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); };

// ---------- our manuscripts, one per case ----------
const castSignature = (text) => {
  const c = new Map();
  for (const m of text.matchAll(/[a-z,;] ([A-Z][a-z]{2,})/g)) c.set(m[1], (c.get(m[1]) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
};
const all = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const date = (name.match(/([0-9]{8}-[0-9]{4})/) ?? [])[1]; if (!date || date.slice(0, 8) < CUT) continue;
  const files = readdirSync(dir); const md = files.find((f) => f.endsWith(".md")); if (!md) continue;
  if (MODE === "read" && !files.some((f) => /^chatgpt/i.test(f))) continue;
  const text = readFileSync(join(dir, md), "utf8").replace(/^#.*$/gm, "");
  const tok = tokens(text); if (tok.length < W + 2000) continue;
  all.push({ name, date, tok, sig: castSignature(text) });
}
all.sort((a, b) => a.date.localeCompare(b.date));
const parent = all.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (all[i].sig.filter((w) => all[j].sig.includes(w)).length >= 4) parent[find(i)] = find(j);
const newest = new Map(); all.forEach((b, i) => newest.set(find(i), b));
const ours = [...newest.values()].sort((a, b) => a.date.localeCompare(b.date));
console.log(`mode ${MODE}, from ${CUT}: manuscripts ${all.length}; distinct cases ${ours.length}`);

// ---------- canon ----------
const strip = (t) => { const a = t.search(/[*]{3} ?START OF/i); const b = t.search(/[*]{3} ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };
const authorOf = (slug) => { const p = join(ROOT, "library/works", slug, "provenance.yaml"); if (!existsSync(p)) return null; return (readFileSync(p, "utf8").match(/^author:\s*"?([^"\n]+)"?/m) ?? [])[1] ?? null; };
const canon = readdirSync(join(ROOT, "library/texts")).filter((f) => f.endsWith(".txt")).map((f) => { const id = f.replace(/[.]txt$/, ""); return { id, author: authorOf(id), tok: tokens(strip(readFileSync(join(ROOT, "library/texts", f), "utf8"))) }; }).filter((c) => c.tok.length >= W + 2000);
const win = (tok) => tok.slice(2000, 2000 + W);
const byAuthor = new Map(); for (const q of canon) { if (!q.author) continue; if (!byAuthor.has(q.author)) byAuthor.set(q.author, []); byAuthor.get(q.author).push(q); }
const authors = [...byAuthor.entries()].filter(([, s]) => s.length >= 7);

// ---------- Cosine Delta: relative frequencies of the canon's MFW, z-scored on the canon ----------
const freq = new Map();
for (const q of canon) for (const w of win(q.tok)) freq.set(w, (freq.get(w) ?? 0) + 1);
const vocab = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, MFW).map(([w]) => w);
const idx = new Map(vocab.map((w, i) => [w, i]));
const rel = (tok) => { const v = new Float64Array(MFW); for (const w of tok) { const i = idx.get(w); if (i !== undefined) v[i]++; } for (let i = 0; i < MFW; i++) v[i] /= tok.length; return v; };
const canonRel = canon.map((q) => rel(win(q.tok)));
const mu = new Float64Array(MFW), sg = new Float64Array(MFW);
for (let i = 0; i < MFW; i++) { mu[i] = mean(canonRel.map((v) => v[i])); sg[i] = Math.sqrt(mean(canonRel.map((v) => (v[i] - mu[i]) ** 2))) || 1e-9; }
const z = (tok) => { const v = rel(win(tok)); for (let i = 0; i < MFW; i++) v[i] = (v[i] - mu[i]) / sg[i]; return v; };
const cosD = (a, b) => { let d = 0, x = 0, y = 0; for (let i = 0; i < MFW; i++) { d += a[i] * b[i]; x += a[i] ** 2; y += b[i] ** 2; } return 1 - d / Math.sqrt(x * y); };
const within = (vs) => { const d = []; for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) d.push(cosD(vs[i], vs[j])); return mean(d); };
const centroid = (vs) => { const c = new Float64Array(MFW); for (const v of vs) for (let i = 0; i < MFW; i++) c[i] += v[i] / vs.length; return c; };

const newestK = ours.slice(-K).map((b) => z(b.tok));
const allOurs = ours.map((b) => z(b.tok));
console.log(`MFW ${MFW}, window ${W} tokens from token 2000; canon texts ${canon.length}; authors with >= 7 books ${authors.length}`);
const rows = authors.map(([author, set]) => {
  const draws = []; for (let r = 0; r < 20; r++) draws.push(within(sample(set, Math.min(K, set.length)).map((q) => z(q.tok))));
  return [author, Math.min(K, set.length), mean(draws)];
}).sort((a, b) => a[2] - b[2]);
for (const [a, k, d] of rows) console.log(`  ${a.padEnd(28)} k=${String(k).padStart(2)}  mean pairwise Cosine Delta ${d.toFixed(3)}`);
console.log(`  ${("ours, newest " + K + " distinct casts").padEnd(28)} k=${K}  mean pairwise Cosine Delta ${within(newestK).toFixed(3)}`);
console.log(`  ${("ours, all " + ours.length + " distinct casts").padEnd(28)}       mean pairwise Cosine Delta ${within(allOurs).toFixed(3)}`);
const cross = []; for (let r = 0; r < 400; r++) { const [a1, a2] = sample(authors, 2); cross.push(cosD(z(sample(a1[1], 1)[0].tok), z(sample(a2[1], 1)[0].tok))); }
console.log(`  two canon books by DIFFERENT authors       mean Cosine Delta ${mean(cross).toFixed(3)}`);
const oc = centroid(newestK);
const near = authors.map(([a, s]) => [a, cosD(oc, centroid(s.map((q) => z(q.tok))))]).sort((x, y) => x[1] - y[1]);
console.log(`  our centroid's nearest canon authors: ${near.slice(0, 3).map(([a, d]) => `${a} ${d.toFixed(3)}`).join(" · ")}; farthest ${near.at(-1)[0]} ${near.at(-1)[1].toFixed(3)}`);
const mz = vocab.map((w, i) => [w, mean(newestK.map((v) => v[i]))]).sort((a, b) => b[1] - a[1]);
console.log(`  most over-used of the ${MFW} MFW (mean z): ${mz.slice(0, 12).map(([w, v]) => `${w} ${v.toFixed(1)}`).join(", ")}`);
console.log(`  most under-used (mean z): ${mz.slice(-12).map(([w, v]) => `${w} ${v.toFixed(1)}`).join(", ")}`);
// Did the signature arrive with the v2 brief (2026-09-18, "Every paragraph has a thing in it somebody
// could touch")? Mean z of the signature words in our books dated before and after that day.
const before = ours.filter((b) => b.date.slice(0, 8) < "20260918").map((b) => z(b.tok));
const after = ours.filter((b) => b.date.slice(0, 8) >= "20260918").map((b) => z(b.tok));
const sig = ["hands", "hand", "against", "set", "voice", "between", "window", "that", "there", "what", "it"];
if (before.length && after.length) console.log(`  signature words, mean z before 2026-09-18 (n ${before.length}) → from it (n ${after.length}): ${sig.map((w) => { const i = idx.get(w); return `${w} ${mean(before.map((v) => v[i])).toFixed(1)} → ${mean(after.map((v) => v[i])).toFixed(1)}`; }).join(" · ")}`);
if (before.length > 2 && after.length > 2) console.log(`  within-set Cosine Delta before ${within(before).toFixed(3)} · from ${within(after).toFixed(3)}`);
