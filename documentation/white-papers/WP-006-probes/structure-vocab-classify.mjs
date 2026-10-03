// WP-006 measurements, part 2. Read-only. Run from C:\CML.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
// Run from the repo root after `npm run build:all`:
//   node documentation/white-papers/WP-006-probes/structure-vocab-classify.mjs [stats] [vocab] [classify]
// `classify` reads the keyness list that `ledger-and-lexicon.mjs keyness` wrote to the OS temp dir.
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SCRATCH = process.env.WP6_OUT ?? tmpdir();
const parts = new Set(process.argv.slice(2));
const want = (p) => parts.size === 0 || parts.has(p);
const { machineRegisterRate } = await import(pathToFileURL(join(ROOT, "packages/prose-guard/dist/machine-register.js")).href);
const { parseExternalRead, splitReads } = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);

const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const quant = (a, q) => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * q; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const pearson = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, dx = 0, dy = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; } return n / Math.sqrt(dx * dy); };
const ols = (x, y) => { const mx = mean(x), my = mean(y); let sxy = 0, sxx = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; } const b = sxy / sxx, a = my - b * mx; let sse = 0; for (let i = 0; i < x.length; i++) sse += (y[i] - a - b * x[i]) ** 2; const s = Math.sqrt(sse / (x.length - 2)); return { a, b, se: s / Math.sqrt(sxx), resid: s }; };
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "NA");
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "NA");
const tokens = (t) => (t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []);
const Phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp((-z * z) / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const say = (...a) => console.log(a.join(" "));

const rows = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) {
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    if (name === "_archive" || !statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);
    const read = files.find((f) => /^chatgpt/i.test(f));
    const story = files.find((f) => f.endsWith(".md"));
    if (!read || !story) continue;
    const raw = readFileSync(join(dir, read), "utf8");
    const all = splitReads(raw).map((seg) => parseExternalRead(seg)).filter((r) => r.final != null);
    const parsed = all.length ? all[all.length - 1] : parseExternalRead(raw);
    if (parsed.final == null) continue;
    const body = readFileSync(join(dir, story), "utf8").replace(/^\*Run ID:.*$/m, "").replace(/^---$/gm, "").replace(/^#.*$/gm, "");
    const words = body.split(/\s+/).filter(Boolean).length;
    const date = (name.match(/(\d{8})/) ?? [])[1] ?? "00000000";
    const cats = parsed.categories ?? {};
    const marks = Object.values(cats);
    const sum = marks.length === 10 ? marks.reduce((x, y) => x + y, 0) : null;
    rows.push({ id: name, date, final: parsed.final, cats, sum, words, rate: machineRegisterRate(body).rate, text: body });
  }
}
const full = rows.filter((r) => r.words >= 8000).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
const CATS = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue", "atmosphere", "clues", "pacing", "ending", "prose"];

if (want("stats")) {
  say("## SLOPES (marks per 0.01 of register rate), by era");
  for (const [name, f] of [["all", () => true], ["before 2026-09-01", (r) => r.date < "20260901"], ["from 2026-09-01", (r) => r.date >= "20260901"], ["from 2026-09-22 (v2 era)", (r) => r.date >= "20260922"]]) {
    const s = full.filter(f); if (s.length < 5) { say(`  ${name}: n=${s.length}`); continue; }
    const o = ols(s.map((q) => q.rate * 100), s.map((q) => q.final));
    say(`  ${name}: n=${s.length} slope ${f3(o.b)} se ${f3(o.se)} (95% ${f3(o.b - 1.96 * o.se)}..${f3(o.b + 1.96 * o.se)}) resid sd ${f1(o.resid)}; rate sd ${f3(sd(s.map((q) => q.rate)))} headline sd ${f1(sd(s.map((q) => q.final)))} r ${f3(pearson(s.map((q) => q.rate), s.map((q) => q.final)))}`);
  }
  say("## TOP READS");
  for (const r of full.slice().sort((a, b) => b.final - a.final).slice(0, 6)) say(`  ${r.id} ${r.final} sum ${r.sum} words ${r.words} rate ${f3(r.rate)}`);
  const withSum = full.filter((r) => r.sum != null);
  const o = ols(withSum.map((r) => r.sum), withSum.map((r) => r.final));
  say(`## headline ~ category sum, n=${withSum.length}: headline = ${f1(o.a)} + ${f3(o.b)} * sum; resid sd ${f1(o.resid)}; sum needed for 90: ${f1((90 - o.a) / o.b)}; r ${f3(pearson(withSum.map((r) => r.sum), withSum.map((r) => r.final)))}`);
  const hi = withSum.filter((r) => r.sum >= 74);
  const o2 = ols(hi.map((r) => r.sum), hi.map((r) => r.final));
  say(`   restricted to sum>=74, n=${hi.length}: headline = ${f1(o2.a)} + ${f3(o2.b)} * sum; resid sd ${f1(o2.resid)}; sum needed for 90: ${f1((90 - o2.a) / o2.b)}`);
  // PCA first eigenvalue share via power iteration on the category correlation matrix
  const X = withSum.map((r) => CATS.map((c) => r.cats[c]));
  const C = CATS.map((_, i) => CATS.map((__, j) => pearson(X.map((x) => x[i]), X.map((x) => x[j]))));
  let v = CATS.map(() => 1); let lam = 0;
  for (let it = 0; it < 200; it++) { const w = C.map((row) => row.reduce((s, c, j) => s + c * v[j], 0)); lam = Math.sqrt(w.reduce((s, z) => s + z * z, 0)); v = w.map((z) => z / lam); }
  say(`## PCA of ten categories, n=${withSum.length}: first eigenvalue ${f3(lam)} = ${f1(lam * 10)}% of variance; loadings ${v.map((z, i) => CATS[i].slice(0, 5) + ":" + z.toFixed(2)).join(" ")}`);
  // normal model for a 90
  for (const [name, s] of [["last 20", full.slice(-20)], ["last 10", full.slice(-10)]]) {
    const y = s.map((r) => r.final); const m = mean(y), sdv = sd(y); const p = 1 - Phi((89.5 - m) / sdv);
    say(`## P(read >= 90), normal model on ${name}: mean ${f1(m)} sd ${f1(sdv)} -> ${f3(p)} per read; expected reads to first: ${f1(1 / p)}`);
  }
  // mean of top-k as a selection statistic: best-ever per category summed
  const best = CATS.map((c) => Math.max(...withSum.map((r) => r.cats[c])));
  say(`## best-ever per category: ${best.join(",")} sum ${best.reduce((a, b) => a + b, 0)}; best single-book sum ${Math.max(...withSum.map((r) => r.sum))}`);
  // within-book deviation: how much category variance is left after removing the book mean
  const dev = withSum.map((r) => { const m = r.sum / 10; return CATS.map((c) => r.cats[c] - m); });
  say(`   category sd raw vs within-book deviation: ${CATS.map((c, i) => c.slice(0, 5) + " " + sd(withSum.map((r) => r.cats[c])).toFixed(2) + "/" + sd(dev.map((d) => d[i])).toFixed(2)).join("; ")}`);
}

// ---------- canon ----------
const stripGutenberg = (t) => { const a = t.search(/\*\*\* ?START OF/i); const b = t.search(/\*\*\* ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };
const authorOf = (slug) => { const p = join(ROOT, "library/works", slug, "provenance.yaml"); if (!existsSync(p)) return null; return (readFileSync(p, "utf8").match(/^author:\s*"?([^"\n]+)"?/m) ?? [])[1] ?? null; };
let canon = null;
const loadCanon = () => canon ?? (canon = readdirSync(join(ROOT, "library/texts")).filter((f) => f.endsWith(".txt")).map((f) => { const id = f.replace(/\.txt$/, ""); return { id, author: authorOf(id), tok: tokens(stripGutenberg(readFileSync(join(ROOT, "library/texts", f), "utf8"))) }; }).filter((c) => c.tok.length >= 12000));

if (want("vocab")) {
  const c = loadCanon();
  const W = 8000;
  const win = (q) => q.tok.slice(2000, 2000 + W);
  const ours = full.map((r) => tokens(r.text).slice(0, W)).filter((t) => t.length === W);
  say(`## VOCABULARY BREADTH — canon texts ${c.length}; ours ${ours.length}; window ${W} tokens`);
  const heaps = (t) => { const xs = [], ys = []; const seen = new Set(); for (let i = 0; i < t.length; i++) { seen.add(t[i]); if ((i + 1) % 1000 === 0) { xs.push(Math.log(i + 1)); ys.push(Math.log(seen.size)); } } return ols(xs, ys).b; };
  say(`Heaps exponent (types ~ n^beta, 1k..8k): canon median ${f3(quant(c.map((q) => heaps(win(q))), 0.5))} p10 ${f3(quant(c.map((q) => heaps(win(q))), 0.1))}; ours median ${f3(quant(ours.map(heaps), 0.5))} p90 ${f3(quant(ours.map(heaps), 0.9))}`);
  const types = (t) => new Set(t).size;
  const cT = c.map((q) => types(win(q))), oT = ours.map(types);
  say(`types per ${W}: canon median ${quant(cT, 0.5)} p10 ${quant(cT, 0.1)} p90 ${quant(cT, 0.9)}; ours median ${quant(oT, 0.5)} p10 ${quant(oT, 0.1)} p90 ${quant(oT, 0.9)}; ours below canon p10: ${oT.filter((v) => v < quant(cT, 0.1)).length}/${oT.length}; below canon median: ${oT.filter((v) => v < quant(cT, 0.5)).length}/${oT.length}`);
  const hap = (t) => { const m = new Map(); for (const w of t) m.set(w, (m.get(w) ?? 0) + 1); let h = 0; for (const v of m.values()) if (v === 1) h++; return h / t.length; };
  say(`hapax share (words used once / tokens): canon median ${f3(quant(c.map((q) => hap(win(q))), 0.5))}; ours median ${f3(quant(ours.map(hap), 0.5))}`);
  // rare-word rate against the pooled canon frequency list
  const freq = new Map(); for (const q of c) for (const w of q.tok) freq.set(w, (freq.get(w) ?? 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]); const rankOf = new Map(ranked.map(([w], i) => [w, i]));
  for (const K of [2000, 5000]) {
    const rare = (t) => t.filter((w) => rankOf.has(w) && rankOf.get(w) >= K).length / t.length;
    say(`share of tokens outside the canon's ${K} commonest words (words unknown to canon excluded): canon median ${f3(quant(c.map((q) => rare(win(q))), 0.5))} p10 ${f3(quant(c.map((q) => rare(win(q))), 0.1))}; ours median ${f3(quant(ours.map(rare), 0.5))} p90 ${f3(quant(ours.map(rare), 0.9))}`);
  }
  // author-matched pooled vocabulary
  const rng = mulberry32(17);
  const sample = (arr, k) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); };
  const pooled = (sets) => { const s = new Set(); for (const t of sets) for (const w of t) s.add(w); return s.size; };
  const byAuthor = new Map(); for (const q of c) { if (!q.author) continue; if (!byAuthor.has(q.author)) byAuthor.set(q.author, []); byAuthor.get(q.author).push(win(q)); }
  for (const [a, sets] of [...byAuthor.entries()].filter(([, s]) => s.length >= 7).sort((p, q) => q[1].length - p[1].length)) {
    const k = Math.min(sets.length, 12);
    const au = mean(Array.from({ length: 100 }, () => pooled(sample(sets, k))));
    const ou = mean(Array.from({ length: 100 }, () => pooled(sample(ours, k))));
    const mx = mean(Array.from({ length: 100 }, () => pooled(sample(c.map(win), k))));
    say(`  pooled types over ${k} books x ${W}: ${a.padEnd(40)} ${au.toFixed(0)} | ours ${ou.toFixed(0)} | mixed canon authors ${mx.toFixed(0)}  (n works ${sets.length})`);
  }
  // house-phrase load: share of 4-gram tokens that belong to 4-grams recurring in >= half the set's books and >=20x over-represented vs reference
  const house = (sets, reference) => {
    const cnt = new Map(), df = new Map(); let total = 0;
    for (const t of sets) { const seen = new Set(); for (let i = 0; i + 4 <= t.length; i++) { const g = t[i] + " " + t[i + 1] + " " + t[i + 2] + " " + t[i + 3]; cnt.set(g, (cnt.get(g) ?? 0) + 1); if (!seen.has(g)) { seen.add(g); df.set(g, (df.get(g) ?? 0) + 1); } total++; } }
    const need = Math.ceil(sets.length / 3);
    const cand = new Map(); for (const [g, d] of df) if (d >= need) cand.set(g, 0);
    let refTotal = 0; for (const t of reference) { for (let i = 0; i + 4 <= t.length; i++) { const g = t[i] + " " + t[i + 1] + " " + t[i + 2] + " " + t[i + 3]; if (cand.has(g)) cand.set(g, cand.get(g) + 1); refTotal++; } }
    let load = 0, n = 0; for (const [g, b] of cand) { const ratio = (cnt.get(g) / total) / ((b + 0.5) / refTotal); if (ratio >= 20) { load += cnt.get(g); n++; } }
    return { per10k: (load / total) * 10000, phrases: n };
  };
  const longWin = (q) => q.tok.slice(2000, 11000);
  const oursLong = full.map((r) => tokens(r.text).slice(0, 9000)).filter((t) => t.length >= 8000);
  say("house-phrase load (4-grams in >= 1/3 of the set's books and >= 20x the reference rate), per 10k 4-grams:");
  for (const [a] of [...byAuthor.entries()].filter(([, s]) => s.length >= 9).sort((p, q) => q[1].length - p[1].length)) {
    const mine = c.filter((q) => q.author === a).map(longWin); const ref = c.filter((q) => q.author !== a).map((q) => q.tok);
    const k = Math.min(mine.length, 12);
    const h = house(sample(mine, k), ref); const o = house(sample(oursLong, k), c.map((q) => q.tok));
    say(`  ${a.padEnd(40)} k=${k}: ${f1(h.per10k)} (${h.phrases} phrases) | ours k=${k}: ${f1(o.per10k)} (${o.phrases} phrases)`);
  }
  const last = house(oursLong.slice(-12), c.map((q) => q.tok));
  say(`  ours, the 12 most recent books: ${f1(last.per10k)} (${last.phrases} phrases)`);
}

if (want("classify")) {
  say("## WHERE THE TOP KEYNESS PHRASES LIVE IN OUR SOURCE");
  const top = JSON.parse(readFileSync(join(SCRATCH, "wp006-keyness-top.json"), "utf8")).slice(0, 150);
  const files = [];
  const walk = (d) => { for (const n of readdirSync(d)) { if (n === "node_modules" || n === "dist" || n === "__tests__" || n.startsWith(".")) continue; const p = join(d, n); const st = statSync(p); if (st.isDirectory()) walk(p); else if (/\.(ts|tsx|mjs|js|json|yaml|yml|md|txt)$/.test(n) && !/\.test\./.test(n) && st.size < 3_000_000) files.push(p); } };
  for (const d of ["packages", "apps/worker/src", "apps/api/src"]) if (existsSync(join(ROOT, d))) walk(join(ROOT, d));
  const blobs = files.map((p) => ({ p: p.slice(ROOT.length + 1).replace(/\\/g, "/"), t: readFileSync(p, "utf8").toLowerCase().replace(/[^a-z']+/g, " ") }));
  say(`source files scanned ${blobs.length}`);
  let inSrc = 0, guard = 0, prompt = 0; const lines = [];
  for (const s of top) { const hits = blobs.filter((b) => b.t.includes(s.g)).map((b) => b.p); if (hits.length) { inSrc++; if (hits.some((h) => /prose-guard|story-validation|scaffold|banned|register/.test(h))) guard++; if (hits.some((h) => /prompts-llm|prompt|agent\d/.test(h))) prompt++; lines.push(`  "${s.g}" (ours ${s.a}, ${s.d} books, canon ${s.b}) -> ${hits.slice(0, 4).join(", ")}${hits.length > 4 ? " +" + (hits.length - 4) : ""}`); } }
  say(`top ${top.length} over-represented 4-grams: found verbatim in source ${inSrc}; of those in a guard/validator file ${guard}; in a prompt/agent file ${prompt}; in no source file ${top.length - inSrc}`);
  for (const l of lines) say(l);
}
