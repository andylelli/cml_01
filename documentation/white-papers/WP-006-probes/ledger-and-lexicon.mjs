// WP-006 measurements. Read-only. Run from C:\CML: node <this file> [part...]
import { readFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
// Run from the repo root after `npm run build:all`:
//   node documentation/white-papers/WP-006-probes/ledger-and-lexicon.mjs [ledger] [chapters] [lexical] [keyness] [corpus]
// `lexical` and `keyness` read library/texts (12.4M tokens) and want --max-old-space-size=6000.
// Writes nothing to the repo: the keyness list goes to the OS temp dir for structure-vocab-classify.mjs.
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const OUT = process.env.WP6_OUT ?? tmpdir();
const parts = new Set(process.argv.slice(2));
const want = (p) => parts.size === 0 || parts.has(p);

const { machineRegisterRate } = await import(
  pathToFileURL(join(ROOT, "packages/prose-guard/dist/machine-register.js")).href
);

// ---------- helpers ----------
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const quant = (a, q) => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * q; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const pearson = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, dx = 0, dy = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; } return n / Math.sqrt(dx * dy); };
const rank = (a) => { const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = new Array(a.length); let i = 0; while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; const rr = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = rr; i = j + 1; } return r; };
const spearman = (x, y) => pearson(rank(x), rank(y));
const fisherCI = (r, n) => { const z = Math.atanh(r), se = 1 / Math.sqrt(n - 3); return [Math.tanh(z - 1.96 * se), Math.tanh(z + 1.96 * se)]; };
const bootCI = (x, y, f, B = 5000, seed = 6) => { const rng = mulberry32(seed); const out = []; for (let b = 0; b < B; b++) { const xs = [], ys = []; for (let i = 0; i < x.length; i++) { const k = Math.floor(rng() * x.length); xs.push(x[k]); ys.push(y[k]); } const v = f(xs, ys); if (Number.isFinite(v)) out.push(v); } return [quant(out, 0.025), quant(out, 0.975)]; };
const gauss = (rng) => { let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const f3 = (x) => (x == null || !Number.isFinite(x) ? "NA" : x.toFixed(3));
const f1 = (x) => (x == null || !Number.isFinite(x) ? "NA" : x.toFixed(1));
const tokens = (t) => (t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []);

const stripMd = (t) => t.replace(/^\*Run ID:.*$/m, "").replace(/^---$/gm, "");
const chaptersOf = (t) => {
  const bits = t.split(/^##\s+Chapter[^\n]*$/m);
  return bits.length > 1 ? bits.slice(1) : [t];
};

// ---------- load ledger (LIVE walk of the story folders; the manifest on disk is stale) ----------
const { parseExternalRead, splitReads } = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const { statSync } = await import("node:fs");
const rows = []; let foundReads = 0, unscored = 0;
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) {
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    if (name === "_archive" || !statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);
    const read = files.find((f) => /^chatgpt/i.test(f));
    const story = files.find((f) => f.endsWith(".md"));
    if (!read || !story) continue;
    foundReads++;
    const raw = readFileSync(join(dir, read), "utf8");
    const all = splitReads(raw).map((seg) => parseExternalRead(seg)).filter((r) => r.final != null);
    const parsed = all.length ? all[all.length - 1] : parseExternalRead(raw);
    if (parsed.final == null) { unscored++; continue; }
    const text = stripMd(readFileSync(join(dir, story), "utf8"));
    const body = text.replace(/^#.*$/gm, "");
    const words = body.split(/\s+/).filter(Boolean).length;
    const reg = machineRegisterRate(body);
    const chs = chaptersOf(text).map((c) => machineRegisterRate(c)).filter((c) => c.sentences >= 20);
    const date = (name.match(/(\d{8})/) ?? [])[1] ?? "00000000";
    const cats = parsed.categories ?? {};
    const marks = Object.values(cats);
    const sum = marks.length === 10 ? marks.reduce((x, y) => x + y, 0) : null;
    rows.push({ id: name, date, final: parsed.final, cats, sum, offset: sum == null ? null : parsed.final - sum, words, rate: reg.rate, sentences: reg.sentences, chRates: chs.map((c) => c.rate), text: body });
  }
}
const manifest = { length: foundReads };
const full = rows.filter((r) => r.words >= 8000);
const log = [];
const say = (...a) => { const s = a.join(" "); console.log(s); log.push(s); };

if (want("ledger")) {
  say("## LEDGER");
  say(`read files found ${foundReads}; unscored ${unscored}; scored ${rows.length}; words>=8000 ${full.length}; with all ten categories ${rows.filter((r) => r.sum != null).length}`);
  const x = full.map((r) => r.rate), y = full.map((r) => r.final);
  const r = pearson(x, y), rho = spearman(x, y);
  say(`register rate vs headline, words>=8000, n=${full.length}: pearson ${f3(r)} fisher95 [${fisherCI(r, full.length).map(f3)}] boot95 [${bootCI(x, y, pearson).map(f3)}]; spearman ${f3(rho)} boot95 [${bootCI(x, y, spearman).map(f3)}]`);
  const yp = full.filter((r) => r.cats.prose != null);
  say(`register rate vs prose mark, n=${yp.length}: pearson ${f3(pearson(yp.map((r) => r.rate), yp.map((r) => r.cats.prose)))} spearman ${f3(spearman(yp.map((r) => r.rate), yp.map((r) => r.cats.prose)))}`);
  // by era
  for (const [name, f] of [["before 2026-09-25", (r) => r.date < "20260925"], ["from 2026-09-25", (r) => r.date >= "20260925"], ["before 2026-09-01", (r) => r.date < "20260901"], ["from 2026-09-01", (r) => r.date >= "20260901"]]) {
    const s = full.filter(f); if (s.length < 5) { say(`  era ${name}: n=${s.length} (too few)`); continue; }
    const rr = pearson(s.map((q) => q.rate), s.map((q) => q.final));
    say(`  era ${name}: n=${s.length} headline mean ${f1(mean(s.map((q) => q.final)))} sd ${f1(sd(s.map((q) => q.final)))} rate mean ${f3(mean(s.map((q) => q.rate)))}; pearson ${f3(rr)} fisher95 [${fisherCI(rr, s.length).map(f3)}]`);
  }
  // first-36 replication of the standing figure, in ledger order
  const first36 = full.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(0, 36);
  say(`  earliest 36 non-truncated: pearson ${f3(pearson(first36.map((q) => q.rate), first36.map((q) => q.final)))}`);
  // headline distribution
  say(`headline (words>=8000): mean ${f1(mean(y))} sd ${f1(sd(y))} min ${Math.min(...y)} max ${Math.max(...y)}`);
  const last20 = full.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(-20);
  const y20 = last20.map((q) => q.final);
  say(`headline last 20: mean ${f1(mean(y20))} sd ${f1(sd(y20))} min ${Math.min(...y20)} max ${Math.max(...y20)} values ${y20.join(",")}`);
  // offsets
  const off = full.filter((q) => q.offset != null).map((q) => q.offset);
  say(`offset (headline - category sum), n=${off.length}: mean ${f1(mean(off))} sd ${f1(sd(off))} min ${Math.min(...off)} max ${Math.max(...off)}`);
  const offHi = full.filter((q) => q.offset != null && q.sum >= 78).map((q) => q.offset);
  say(`offset where sum>=78, n=${offHi.length}: mean ${f1(mean(offHi))} sd ${f1(sd(offHi))}`);
  // categories
  const cats = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue", "atmosphere", "clues", "pacing", "ending", "prose"];
  const withCats = full.filter((q) => cats.every((c) => q.cats[c] != null));
  say(`category table (n=${withCats.length} with all ten; last20 n=${last20.filter((q) => cats.every((c) => q.cats[c] != null)).length}):`);
  const l20c = last20.filter((q) => cats.every((c) => q.cats[c] != null));
  for (const c of cats) {
    const v = withCats.map((q) => q.cats[c]); const v20 = l20c.map((q) => q.cats[c]);
    say(`  ${c.padEnd(18)} mean ${f1(mean(v))} sd ${f1(sd(v))} n9 ${v.filter((z) => z >= 9).length}/${v.length} | last20 mean ${f1(mean(v20))} n9 ${v20.filter((z) => z >= 9).length}/${v20.length} n8+ ${v20.filter((z) => z >= 8).length}/${v20.length}`);
  }
  const four = ["plot_structure", "character_clarity", "clues", "ending"];
  for (const [name, set] of [["all", withCats], ["last20", l20c]]) {
    const joint = set.filter((q) => four.every((c) => q.cats[c] >= 9)).length;
    const indep = four.reduce((p, c) => p * (set.filter((q) => q.cats[c] >= 9).length / set.length), 1);
    const dist = [0, 0, 0, 0, 0]; for (const q of set) dist[four.filter((c) => q.cats[c] >= 9).length]++;
    say(`  four-at-9 (${name}, n=${set.length}): observed joint ${joint}; independent product ${indep.toExponential(2)}; count-of-9s distribution 0..4 = ${dist.join("/")}`);
  }
  // pairwise category correlation (mean off-diagonal)
  let s = 0, k = 0; for (let i = 0; i < cats.length; i++) for (let j = i + 1; j < cats.length; j++) { s += pearson(withCats.map((q) => q.cats[cats[i]]), withCats.map((q) => q.cats[cats[j]])); k++; }
  say(`mean pairwise category correlation ${f3(s / k)} over ${k} pairs (all); cronbach alpha ${f3((10 * (s / k)) / (1 + 9 * (s / k)))}`);
  let s2 = 0, k2 = 0; for (let i = 0; i < cats.length; i++) for (let j = i + 1; j < cats.length; j++) { const v = pearson(l20c.map((q) => q.cats[cats[i]]), l20c.map((q) => q.cats[cats[j]])); if (Number.isFinite(v)) { s2 += v; k2++; } }
  say(`mean pairwise category correlation ${f3(s2 / k2)} over ${k2} pairs (last20)`);
  // null: expected max |r| over k screened instruments at this n
  const rng = mulberry32(11);
  for (const n of [36, full.length]) for (const kk of [1, 5, 10, 20, 40]) {
    const maxes = []; for (let t = 0; t < 2000; t++) { const yy = Array.from({ length: n }, () => gauss(rng)); let m = 0; for (let j = 0; j < kk; j++) { const xx = Array.from({ length: n }, () => gauss(rng)); m = Math.max(m, Math.abs(pearson(xx, yy))); } maxes.push(m); }
    say(`  null max|r| n=${n} k=${kk}: mean ${f3(mean(maxes))} p95 ${f3(quant(maxes, 0.95))}`);
  }
}

if (want("chapters")) {
  say("## CHAPTER ORDER STATISTICS");
  const all = full.flatMap((r) => r.chRates);
  say(`chapters pooled n=${all.length} from ${full.length} books; rate mean ${f3(mean(all))} sd ${f3(sd(all))} p50 ${f3(quant(all, 0.5))} p90 ${f3(quant(all, 0.9))} p95 ${f3(quant(all, 0.95))}`);
  const p90 = quant(all, 0.9), p95 = quant(all, 0.95);
  const books = full.filter((r) => r.chRates.length >= 5);
  const m = mean(books.map((b) => b.chRates.length));
  say(`books with >=5 chapters ${books.length}; mean chapters ${f1(m)}`);
  say(`books with at least one chapter above pooled p90: ${books.filter((b) => Math.max(...b.chRates) > p90).length}/${books.length}; analytic if iid 1-0.9^m = ${f3(1 - 0.9 ** m)}`);
  say(`books with at least one chapter above pooled p95: ${books.filter((b) => Math.max(...b.chRates) > p95).length}/${books.length}; analytic 1-0.95^m = ${f3(1 - 0.95 ** m)}`);
  const within = books.map((b) => sd(b.chRates));
  const between = sd(books.map((b) => mean(b.chRates)));
  say(`within-book sd of chapter rate: median ${f3(quant(within, 0.5))}; between-book sd of book mean ${f3(between)}`);
  // book max vs headline against book mean vs headline
  say(`corr(headline, book mean rate) ${f3(pearson(books.map((b) => mean(b.chRates)), books.map((b) => b.final)))}; corr(headline, book max chapter rate) ${f3(pearson(books.map((b) => Math.max(...b.chRates)), books.map((b) => b.final)))}`);
}

// ---------- lexical diversity ----------
const mtldOne = (tok, th = 0.72) => { let factors = 0, types = new Set(), n = 0; for (const w of tok) { types.add(w); n++; if (types.size / n <= th) { factors++; types = new Set(); n = 0; } } if (n > 0) factors += (1 - types.size / n) / (1 - th); return factors > 0 ? tok.length / factors : NaN; };
const mtld = (tok) => (mtldOne(tok) + mtldOne([...tok].reverse())) / 2;
const mattr = (tok, w = 500) => { if (tok.length < w) return NaN; const c = new Map(); let types = 0, s = 0, k = 0; for (let i = 0; i < tok.length; i++) { const a = tok[i]; const ca = c.get(a) ?? 0; if (ca === 0) types++; c.set(a, ca + 1); if (i >= w) { const b = tok[i - w]; const cb = c.get(b); if (cb === 1) { types--; c.delete(b); } else c.set(b, cb - 1); } if (i >= w - 1) { s += types / w; k++; } } return s / k; };
const stripGutenberg = (t) => { const a = t.search(/\*\*\* ?START OF/i); const b = t.search(/\*\*\* ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };

let canon = null;
const loadCanon = () => {
  if (canon) return canon;
  const dir = join(ROOT, "library/texts");
  canon = readdirSync(dir).filter((f) => f.endsWith(".txt")).map((f) => ({ id: f.replace(/\.txt$/, ""), tok: tokens(stripGutenberg(readFileSync(join(dir, f), "utf8"))) })).filter((c) => c.tok.length >= 8000);
  return canon;
};

if (want("lexical")) {
  say("## LEXICAL DIVERSITY");
  const c = loadCanon();
  say(`canon texts >=8000 tokens: ${c.length}; total tokens ${c.reduce((s, q) => s + q.tok.length, 0)}`);
  // equal-length basis: first 8000 tokens of each, plus whole-text MTLD
  const cM = c.map((q) => mtld(q.tok.slice(2000, 10000).length === 8000 ? q.tok.slice(2000, 10000) : q.tok.slice(0, 8000)));
  const cA = c.map((q) => mattr(q.tok.slice(2000, 10000).length === 8000 ? q.tok.slice(2000, 10000) : q.tok.slice(0, 8000)));
  const ours = full.map((r) => ({ id: r.id, date: r.date, final: r.final, prose: r.cats.prose, tok: tokens(r.text) }));
  const oM = ours.map((q) => mtld(q.tok.slice(0, 8000)));
  const oA = ours.map((q) => mattr(q.tok.slice(0, 8000)));
  const desc = (a) => `median ${f1(quant(a, 0.5))} p10 ${f1(quant(a, 0.1))} p25 ${f1(quant(a, 0.25))} p75 ${f1(quant(a, 0.75))} p90 ${f1(quant(a, 0.9))}`;
  say(`MTLD (8000-token window) canon n=${cM.length}: ${desc(cM)}`);
  say(`MTLD (8000-token window) ours  n=${oM.length}: ${desc(oM)}`);
  const d3 = (a) => `median ${f3(quant(a, 0.5))} p10 ${f3(quant(a, 0.1))} p90 ${f3(quant(a, 0.9))}`;
  say(`MATTR-500 canon: ${d3(cA)}`);
  say(`MATTR-500 ours : ${d3(oA)}`);
  const below = (v, ref) => ref.filter((z) => z < v).length / ref.length;
  say(`our median MTLD sits at canon percentile ${f1(100 * below(quant(oM, 0.5), cM))}; our books below canon p10: ${oM.filter((v) => v < quant(cM, 0.1)).length}/${oM.length}; below canon median: ${oM.filter((v) => v < quant(cM, 0.5)).length}/${oM.length}`);
  say(`our median MATTR sits at canon percentile ${f1(100 * below(quant(oA, 0.5), cA))}; below canon median: ${oA.filter((v) => v < quant(cA, 0.5)).length}/${oA.length}`);
  // recent 20
  const idx = ours.map((q, i) => i).sort((a, b) => ours[a].date.localeCompare(ours[b].date)).slice(-20);
  say(`last 20 ours: MTLD ${desc(idx.map((i) => oM[i]))}; MATTR ${d3(idx.map((i) => oA[i]))}`);
  const pr = ours.map((q, i) => i).filter((i) => ours[i].prose != null);
  say(`corr(MTLD, headline) n=${ours.length}: ${f3(pearson(oM, ours.map((q) => q.final)))}; corr(MTLD, prose mark) n=${pr.length}: ${f3(pearson(pr.map((i) => oM[i]), pr.map((i) => ours[i].prose)))}; corr(MATTR, prose mark): ${f3(pearson(pr.map((i) => oA[i]), pr.map((i) => ours[i].prose)))}`);
  // vocabulary growth: types in first 8000 tokens
  const ty = (t) => new Set(t.slice(0, 8000)).size;
  say(`types in first 8000 tokens: canon median ${quant(c.map((q) => ty(q.tok)), 0.5)}; ours median ${quant(ours.map((q) => ty(q.tok)), 0.5)}`);
  // pooled vocabulary across OUR books vs an equal number of canon tokens (cross-book sameness)
  const pooledOurs = ours.flatMap((q) => q.tok.slice(0, 8000));
  const rng = mulberry32(3); const pick = c.slice().sort(() => rng() - 0.5).slice(0, ours.length);
  const pooledCanon = pick.flatMap((q) => q.tok.slice(2000, 10000));
  say(`pooled types over ${ours.length} books x 8000 tokens: ours ${new Set(pooledOurs).size}; canon (random ${pick.length} texts) ${new Set(pooledCanon).size}`);
}

if (want("keyness")) {
  say("## KEYNESS (Dunning G2) — 4-grams, ours vs canon");
  const c = loadCanon();
  const N = 4;
  const ours = full.slice().sort((a, b) => a.date.localeCompare(b.date));
  const cnt = new Map(), df = new Map(); let oursTotal = 0;
  for (const b of ours) { const t = tokens(b.text); const seen = new Set(); for (let i = 0; i + N <= t.length; i++) { const g = t.slice(i, i + N).join(" "); cnt.set(g, (cnt.get(g) ?? 0) + 1); if (!seen.has(g)) { seen.add(g); df.set(g, (df.get(g) ?? 0) + 1); } oursTotal++; } }
  const minDf = Math.max(5, Math.round(ours.length * 0.12));
  const cand = new Map(); for (const [g, d] of df) if (d >= minDf) cand.set(g, 0);
  let canonTotal = 0;
  for (const q of c) { const t = q.tok; for (let i = 0; i + N <= t.length; i++) { const g = t[i] + " " + t[i + 1] + " " + t[i + 2] + " " + t[i + 3]; if (cand.has(g)) cand.set(g, cand.get(g) + 1); canonTotal++; } }
  const g2 = (a, b) => { const E1 = (oursTotal * (a + b)) / (oursTotal + canonTotal), E2 = (canonTotal * (a + b)) / (oursTotal + canonTotal); return 2 * ((a ? a * Math.log(a / E1) : 0) + (b ? b * Math.log(b / E2) : 0)); };
  const scored = [...cand.entries()].map(([g, b]) => ({ g, a: cnt.get(g), b, d: df.get(g), ratio: (cnt.get(g) / oursTotal) / ((b + 0.5) / canonTotal), g2: g2(cnt.get(g), b) })).filter((s) => s.ratio > 1).sort((p, q) => q.g2 - p.g2);
  say(`our books ${ours.length}, 4-grams ${oursTotal}; canon texts ${c.length}, 4-grams ${canonTotal}; candidates with document-frequency >= ${minDf}: ${cand.size}; over-represented: ${scored.length}`);
  say(`absent from canon entirely: ${scored.filter((s) => s.b === 0).length}`);
  const top = scored.slice(0, 60);
  for (const s of top) say(`  ${s.g2.toFixed(0).padStart(6)}  ours ${String(s.a).padStart(4)} in ${String(s.d).padStart(2)} books  canon ${String(s.b).padStart(4)}  x${s.ratio.toFixed(0).padStart(5)}  ${s.g}`);
  if (OUT) writeFileSync(join(OUT, "wp006-keyness-top.json"), JSON.stringify(scored.slice(0, 300), null, 0));
}

if (want("corpus")) {
  say("## CORPUS CELLS — Chao1 and Good-Turing");
  const dir = join(ROOT, "library/works");
  const cells = new Map(); let n = 0; const axes = new Set(), fams = new Set();
  for (const w of readdirSync(dir)) { const p = join(dir, w, "fingerprint.yaml"); if (!existsSync(p)) continue; const t = readFileSync(p, "utf8"); const ax = (t.match(/^\s*axis:\s*(\S+)/m) ?? [])[1]; const mf = (t.match(/^\s*mechanism_family:\s*(\S+)/m) ?? [])[1]; if (!ax || !mf) continue; n++; axes.add(ax); fams.add(mf); const k = ax + " x " + mf; cells.set(k, (cells.get(k) ?? 0) + 1); }
  const f = (k) => [...cells.values()].filter((v) => v === k).length;
  const S = cells.size, F1 = f(1), F2 = f(2);
  const chao = S + (F2 > 0 ? (F1 * F1) / (2 * F2) : (F1 * (F1 - 1)) / 2);
  say(`fingerprinted works ${n}; axes ${axes.size}; families ${fams.size}; cells observed ${S}; singletons f1 ${F1}; doubletons f2 ${F2}`);
  say(`Chao1 lower-bound richness ${f1(chao)}; Good-Turing P(next work lands in an unseen cell) = f1/n = ${f3(F1 / n)}; sample coverage ${f3(1 - F1 / n)}`);
}

if (OUT) writeFileSync(join(OUT, "wp006-measure.log"), log.join("\n"));
