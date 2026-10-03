// WP-006 probe. Read-only. Cross-book sameness measured on ONE manuscript per case.
//
// Why this file exists: stories/ holds several manuscripts of one case (matched pairs, resumes, engine
// pairs). They share cast names and clock times, so any cross-book count taken over manuscripts counts a
// case's own nouns as a "house phrase". The first version of these measurements did exactly that.
// Here manuscripts are clustered by their cast (the six commonest mid-sentence capitalised words; two
// manuscripts sharing four are one case) and the newest manuscript of each cluster is kept.
//
//   node --max-old-space-size=6000 documentation/white-papers/WP-006-probes/unique-case-sameness.mjs [all|read] [YYYYMMDD]
//     all  = every manuscript on disk (default)      read = only manuscripts with an external read
//     date = keep manuscripts dated on or after it (default 00000000)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MODE = process.argv[2] ?? "all";
const CUT = process.argv[3] ?? "00000000";
const W = 8000;
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
  const tok = tokens(text); if (tok.length < W) continue;
  all.push({ name, date, tok, sig: castSignature(text) });
}
all.sort((a, b) => a.date.localeCompare(b.date));
const parent = all.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (all[i].sig.filter((w) => all[j].sig.includes(w)).length >= 4) parent[find(i)] = find(j);
const newest = new Map(); all.forEach((b, i) => newest.set(find(i), b)); // sorted by date, so the last write is the newest
const ours = [...newest.values()];
const sizes = new Map(); all.forEach((_, i) => sizes.set(find(i), (sizes.get(find(i)) ?? 0) + 1));
console.log(`mode ${MODE}, from ${CUT}: manuscripts >= ${W} tokens ${all.length}; distinct cases ${ours.length}; largest cluster ${Math.max(...sizes.values())}; clusters of 2+ ${[...sizes.values()].filter((v) => v > 1).length}`);

// ---------- canon ----------
const strip = (t) => { const a = t.search(/[*]{3} ?START OF/i); const b = t.search(/[*]{3} ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };
const authorOf = (slug) => { const p = join(ROOT, "library/works", slug, "provenance.yaml"); if (!existsSync(p)) return null; return (readFileSync(p, "utf8").match(/^author:\s*"?([^"\n]+)"?/m) ?? [])[1] ?? null; };
const canon = readdirSync(join(ROOT, "library/texts")).filter((f) => f.endsWith(".txt")).map((f) => { const id = f.replace(/[.]txt$/, ""); return { id, author: authorOf(id), tok: tokens(strip(readFileSync(join(ROOT, "library/texts", f), "utf8"))) }; }).filter((c) => c.tok.length >= 12000);
const win = (q) => q.tok.slice(2000, 2000 + W);
const longWin = (q) => q.tok.slice(2000, 11000);
const byAuthor = new Map(); for (const q of canon) { if (!q.author) continue; if (!byAuthor.has(q.author)) byAuthor.set(q.author, []); byAuthor.get(q.author).push(q); }
const authors = [...byAuthor.entries()].filter(([, s]) => s.length >= 7).sort((p, q) => q[1].length - p[1].length);

// ---------- 1. pooled vocabulary ----------
const pooled = (sets) => { const s = new Set(); for (const t of sets) for (const w of t) s.add(w); return s.size; };
const oursWin = ours.map((b) => b.tok.slice(0, W));
console.log(`\npooled distinct words over k books x ${W} tokens (mean of 100 random draws of k):`);
for (const [a, works] of authors) {
  const k = Math.min(works.length, 12, ours.length);
  const au = mean(Array.from({ length: 100 }, () => pooled(sample(works.map(win), k))));
  const ou = mean(Array.from({ length: 100 }, () => pooled(sample(oursWin, k))));
  console.log(`  k=${String(k).padStart(2)}  ${a.padEnd(40)} ${au.toFixed(0).padStart(5)}   ours ${ou.toFixed(0).padStart(5)}   ours/author ${(ou / au).toFixed(2)}`);
}

// ---------- 2. house-phrase load ----------
const gramsOf = (t) => { const out = []; for (let i = 0; i + 4 <= t.length; i++) out.push(t[i] + " " + t[i + 1] + " " + t[i + 2] + " " + t[i + 3]); return out; };
const house = (sets, reference, minRatio = 20) => {
  const cnt = new Map(), df = new Map(); let total = 0;
  for (const t of sets) { const seen = new Set(); for (const g of gramsOf(t)) { cnt.set(g, (cnt.get(g) ?? 0) + 1); if (!seen.has(g)) { seen.add(g); df.set(g, (df.get(g) ?? 0) + 1); } total++; } }
  const need = Math.ceil(sets.length / 3);
  const cand = new Map(); for (const [g, d] of df) if (d >= need) cand.set(g, 0);
  let refTotal = 0; for (const t of reference) for (let i = 0; i + 4 <= t.length; i++) { const g = t[i] + " " + t[i + 1] + " " + t[i + 2] + " " + t[i + 3]; if (cand.has(g)) cand.set(g, cand.get(g) + 1); refTotal++; }
  const rows = [...cand.entries()].map(([g, b]) => ({ g, a: cnt.get(g), d: df.get(g), b, ratio: (cnt.get(g) / total) / ((b + 0.5) / refTotal) })).filter((r) => r.ratio >= minRatio);
  return { per10k: (rows.reduce((s, r) => s + r.a, 0) / total) * 10000, phrases: rows.length, rows, total, refTotal };
};
const canonTok = canon.map((q) => q.tok);
console.log(`\nhouse-phrase load: 4-grams found in at least a third of the set's books and at >= 20x the reference rate, per 10k 4-grams`);
for (const [a, works] of authors.filter(([, s]) => s.length >= 9)) {
  const k = Math.min(works.length, 12, ours.length);
  const h = house(sample(works.map(longWin), k), canon.filter((q) => q.author !== a).map((q) => q.tok));
  const o = house(sample(ours.map((b) => b.tok.slice(0, 9000)), k), canonTok);
  console.log(`  k=${String(k).padStart(2)}  ${a.padEnd(40)} ${h.per10k.toFixed(1).padStart(6)} (${String(h.phrases).padStart(3)} phrases)   ours ${o.per10k.toFixed(1).padStart(6)} (${String(o.phrases).padStart(3)} phrases)`);
}
// the period control: a modern idiom is "over-represented" against 1890-1935 text whoever wrote it, so also
// count only phrases the canon NEVER uses, and phrases at >= 200x
const lastK = ours.slice(-Math.min(12, ours.length)).map((b) => b.tok.slice(0, 9000));
const full = house(lastK, canonTok, 20), strict = house(lastK, canonTok, 200);
console.log(`  the ${lastK.length} newest distinct cases: ${full.per10k.toFixed(1)} per 10k from ${full.phrases} phrases; at >= 200x: ${strict.per10k.toFixed(1)} from ${strict.phrases}; never in the canon: ${((full.rows.filter((r) => r.b === 0).reduce((s, r) => s + r.a, 0) / full.total) * 10000).toFixed(1)} from ${full.rows.filter((r) => r.b === 0).length}`);

// ---------- 3. keyness over distinct cases, and where each phrase lives in our source ----------
const k = house(ours.map((b) => b.tok), canonTok, 1);
const g2 = (a, b) => { const E1 = (k.total * (a + b)) / (k.total + k.refTotal), E2 = (k.refTotal * (a + b)) / (k.total + k.refTotal); return 2 * ((a ? a * Math.log(a / E1) : 0) + (b ? b * Math.log(b / E2) : 0)); };
const scored = k.rows.map((r) => ({ ...r, g2: g2(r.a, r.b) })).sort((p, q) => q.g2 - p.g2);
console.log(`\nkeyness over ${ours.length} distinct cases: 4-grams in at least a third of them ${scored.length}; never in the canon ${scored.filter((r) => r.b === 0).length}`);
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { if (n === "node_modules" || n === "dist" || n === "__tests__" || n.startsWith(".")) continue; const p = join(d, n); const st = statSync(p); if (st.isDirectory()) walk(p); else if (/[.](ts|tsx|mjs|js|json|yaml|yml|md|txt)$/.test(n) && !/[.]test[.]/.test(n) && st.size < 3_000_000) files.push(p); } };
for (const d of ["packages", "apps/worker/src", "apps/api/src"]) if (existsSync(join(ROOT, d))) walk(join(ROOT, d));
const blobs = files.map((p) => ({ p: p.slice(ROOT.length + 1).replace(/\\/g, "/"), t: readFileSync(p, "utf8").toLowerCase().replace(/[^a-z']+/g, " ") }));
const top = scored.slice(0, 100);
let inSrc = 0, inPrompt = 0; const lines = [];
for (const s of top) { const hits = blobs.filter((b) => b.t.includes(s.g)).map((b) => b.p); if (hits.length) { inSrc++; if (hits.some((h) => /prompts-llm/.test(h))) inPrompt++; } lines.push(`  ${s.g2.toFixed(0).padStart(5)}  ours ${String(s.a).padStart(4)} in ${String(s.d).padStart(2)}/${ours.length}  canon ${String(s.b).padStart(4)}  ${s.g}${hits.length ? "   <- " + hits.slice(0, 2).join(", ") : ""}`); }
console.log(`top 100 by G2: verbatim in a source file ${inSrc}; of those in packages/prompts-llm ${inPrompt}; in no source file ${100 - inSrc}`);
for (const l of lines.slice(0, 40)) console.log(l);
