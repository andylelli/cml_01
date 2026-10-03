// WP-007 §5.2 — Ely, Frankel & Kamenica (2015) surprise, applied to the A_109 M2 reader posterior.
// Surprise in chapter t is the distance the reader's belief over suspects moves: ‖p_t − p_{t−1}‖₂, p_0
// uniform. A chapter before the test that moves the belief by under 0.02 tells the reader nothing about
// who did it. Read-only; run from the repo root after `npm run build:all`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const imp = (p) => import(pathToFileURL(join(ROOT, p)).href);
const cml = await imp("packages/cml/dist/index.js");
const pe = await imp("packages/prose-engine/dist/index.js");
const led = await imp("scripts/external-read-ledger.mjs");
const key = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]+/g, "");
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const corr = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, a = 0, b = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); a += (x[i] - mx) ** 2; b += (y[i] - my) ** 2; } return n / Math.sqrt(a * b); };
const unwrap = (v, keys) => { if (!v || typeof v !== "object") return v; for (const k of keys) if (v[k] && typeof v[k] === "object") return v[k]; return v; };

const reads = new Map();
let catKeys = null;
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const text = readFileSync(join(dir, story), "utf8"); const words = text.split(/\s+/).length; if (words < 8000) continue;
  const title = (text.slice(0, 400).match(/^#\s+(.+)$/m) ?? [])[1];
  catKeys ??= Object.keys(p.categories ?? {});
  reads.set(key(title), { final: p.final, cats: p.categories ?? {} });
}
console.log(`category keys: ${catKeys?.join(", ")}`);

const byProject = new Map();
for (const a of JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8")).artifacts ?? []) {
  if (!a?.projectId || !a?.type) continue;
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}
const rows = []; let tried = 0, noContract = 0;
for (const [id, art] of byProject) {
  if (!art.cml) continue;
  const outline = unwrap(art.outline, ["narrative", "outline"]); if (!outline || !Array.isArray(outline.acts)) continue;
  tried++;
  let contract;
  try { contract = pe.buildBookContract({ cml: art.cml, clues: art.clues ?? null, outline, cast: unwrap(art.cast, ["cast"]), profiles: art.character_profiles ?? null, humourLevel: "classic" }); }
  catch { noContract++; continue; }
  const model = cml.buildCaseModel({ cml: art.cml, clues: art.clues });
  const input = pe.readerInputOf(contract);
  const r = cml.walkReader(model, input);
  const names = model.suspects.map((s) => s.name); if (names.length < 2) continue;
  let prev = Object.fromEntries(names.map((n) => [n, 1 / names.length]));
  const surprise = [];
  let leaderChanges = 0, lastLeader = "";
  for (const w of r.walk) {
    surprise.push({ ch: w.chapter, s: Math.sqrt(names.reduce((acc, n) => acc + ((w.posterior[n] ?? 0) - (prev[n] ?? 0)) ** 2, 0)) });
    if (w.chapter < input.testChapter && w.leader && w.leader !== lastLeader) { if (lastLeader) leaderChanges++; lastLeader = w.leader; }
    prev = w.posterior;
  }
  const before = surprise.filter((x) => x.ch < input.testChapter);
  const total = surprise.reduce((a, x) => a + x.s, 0);
  const title = (art.cml.CASE ?? art.cml)?.meta?.title;
  rows.push({
    id, read: reads.get(key(title)), chapters: surprise.length, test: input.testChapter,
    dead: before.filter((x) => x.s < 0.02).length, beforeN: before.length,
    shareBefore: total ? before.reduce((a, x) => a + x.s, 0) / total : 0,
    maxBefore: Math.max(0, ...before.map((x) => x.s)), leaderChanges,
    culpritLeadsAt: r.culpritLeadsAt, floorBrokenAt: r.floorBrokenAt,
  });
}
console.log(`projects with an outline: ${tried} · contract failed: ${noContract} · walked: ${rows.length}`);
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const deadShare = rows.map((r) => (r.beforeN ? r.dead / r.beforeN : 0));
console.log(`chapters before the test that move the belief < 0.02: median share ${q(deadShare, 0.5).toFixed(2)} · p90 ${q(deadShare, 0.9).toFixed(2)} · books with ≥ half such chapters ${deadShare.filter((x) => x >= 0.5).length}/${rows.length}`);
console.log(`dead chapters per book: ${JSON.stringify(Object.entries(rows.reduce((m, r) => ((m[r.dead] = (m[r.dead] ?? 0) + 1), m), {})))}`);
console.log(`share of all surprise delivered before the test: median ${q(rows.map((r) => r.shareBefore), 0.5).toFixed(2)} · p10 ${q(rows.map((r) => r.shareBefore), 0.1).toFixed(2)} · p90 ${q(rows.map((r) => r.shareBefore), 0.9).toFixed(2)}`);
console.log(`leader changes before the test (twists): ${JSON.stringify(Object.entries(rows.reduce((m, r) => ((m[r.leaderChanges] = (m[r.leaderChanges] ?? 0) + 1), m), {})))}`);
const matched = rows.filter((r) => r.read);
console.log(`matched to a full-length read by title: ${matched.length}`);
const pk = (catKeys ?? []).find((k) => /pac/i.test(k)), plk = (catKeys ?? []).find((k) => /plot/i.test(k));
for (const [label, f] of [["dead chapters", (r) => r.dead], ["share of surprise before test", (r) => r.shareBefore], ["twists", (r) => r.leaderChanges]]) {
  for (const [ol, o] of [["headline", (r) => r.read.final], [pk, (r) => r.read.cats[pk]], [plk, (r) => r.read.cats[plk]]]) {
    const ok = matched.filter((r) => o(r) != null);
    const x = ok.map(f), y = ok.map(o);
    if (ok.length > 3 && sd(x) > 0) console.log(`  ${label} vs ${ol}: r = ${corr(x, y).toFixed(2)} (n = ${ok.length})`);
  }
}

// Ratio-free check and sensitivity (the likelihood ratios in reader.ts are ASSUMED): where are the clues
// that implicate the culprit owned, and does the belief still settle early under much weaker evidence?
const firstCulpritClue = {}, culpritClueCh = {}, settle = { strong: {}, weak: {} };
for (const [id, art] of byProject) {
  const outline = unwrap(art.outline, ["narrative", "outline"]); if (!art.cml || !outline?.acts) continue;
  const contract = pe.buildBookContract({ cml: art.cml, clues: art.clues ?? null, outline, cast: unwrap(art.cast, ["cast"]), profiles: art.character_profiles ?? null, humourLevel: "classic" });
  const model = cml.buildCaseModel({ cml: art.cml, clues: art.clues }); const input = pe.readerInputOf(contract);
  const r = cml.walkReader(model, input);
  const chs = r.culpritClues.map((c) => c.chapter);
  if (chs.length) { const f = Math.min(...chs); firstCulpritClue[f] = (firstCulpritClue[f] ?? 0) + 1; }
  for (const c of chs) culpritClueCh[c] = (culpritClueCh[c] ?? 0) + 1;
  for (const [label, ratios] of [["strong", undefined], ["weak", { implicate: 1.5, withheld: 1.2, clear: 0.5 }]]) {
    const w = cml.walkReader(model, { ...input, ratios });
    const c = model.culprits[0];
    const at = w.walk.find((x) => (x.posterior[c] ?? 0) >= 0.5)?.chapter ?? "never";
    settle[label][at] = (settle[label][at] ?? 0) + 1;
  }
}
console.log(`first chapter owning a clue that implicates the culprit: ${JSON.stringify(firstCulpritClue)}`);
console.log(`all culprit-implicating clues by owning chapter: ${JSON.stringify(culpritClueCh)}`);
console.log(`first chapter the culprit reaches p ≥ 0.5 — reader.ts ratios (4, 1.5, 0.05): ${JSON.stringify(settle.strong)}`);
console.log(`first chapter the culprit reaches p ≥ 0.5 — weak ratios (1.5, 1.2, 0.5): ${JSON.stringify(settle.weak)}`);
console.log(`test chapter by contract: ${JSON.stringify(rows.reduce((m, r) => ((m[r.test] = (m[r.test] ?? 0) + 1), m), {}))} · chapters: ${JSON.stringify(rows.reduce((m, r) => ((m[r.chapters] = (m[r.chapters] ?? 0) + 1), m), {}))}`);
