// A_110 Part V — WP-007's methods applied to THIS book (run bcc0d637, proj_5eb8c115). Read-only.
// Run from the repo root after `npm run build:all`:
//   node --max-old-space-size=6000 documentation/analysis/ANALYSIS_110/probes/wp007-leverage.mjs [surprise|necessity|delta]
//
// surprise   Ely, Frankel & Kamenica surprise on the A_109 reader, PROSE_V2_CONTRACT_FIXES OFF and ON
// necessity  ZebraLogic's clue-deletion loop on analyseProof, with a constructed known positive
// delta     Cosine Delta (300 MFW) — this book against the canon authors and our other distinct cases,
//            and the gesture words the v2 brief's touch rule names
import fs from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
process.env.CML_VERIFIED_FIXES = "true";
const ROOT = process.cwd();
const here = (p) => pathToFileURL(join(ROOT, p)).href;
const MODE = process.argv[2] ?? "all";
const PROJECT = "proj_5eb8c115-ca42-4e66-997d-74fff1b327db";
const BOOK = "stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md";

const pe = await import(here("packages/prose-engine/dist/index.js"));
const cml = await import(here("packages/cml/dist/index.js"));
const store = JSON.parse(fs.readFileSync("data/store.json", "utf8"));
const by = new Map(); for (const a of store.artifacts) { if (!a?.projectId) continue; if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const art = by.get(PROJECT);
const inputOf = (a) => ({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: "classic" });
const build = (on) => { process.env.PROSE_V2_CONTRACT_FIXES = on ? "true" : "false"; return pe.buildBookContract(inputOf(art)); };
const model = cml.buildCaseModel({ cml: art.cml, clues: art.clues });
const culprit = model.culprits[0];

if (MODE === "all" || MODE === "surprise") {
  for (const on of [false, true]) {
    const input = pe.readerInputOf(build(on));
    const names = model.suspects.map((s) => s.name);
    for (const [label, ratios] of [["reader.ts ratios", undefined], ["weak ratios 1.5/1.2/0.5", { implicate: 1.5, withheld: 1.2, clear: 0.5 }]]) {
      const r = cml.walkReader(model, { ...input, ratios });
      let prev = Object.fromEntries(names.map((n) => [n, 1 / names.length]));
      const s = r.walk.map((w) => { const d = Math.sqrt(names.reduce((a, n) => a + ((w.posterior[n] ?? 0) - (prev[n] ?? 0)) ** 2, 0)); prev = w.posterior; return { ch: w.chapter, d }; });
      const before = s.filter((x) => x.ch < input.testChapter);
      const settle = r.walk.find((w) => (w.posterior[culprit] ?? 0) >= 0.5)?.chapter ?? "never";
      console.log(`[${on ? "ON " : "OFF"}] ${label}: test ch ${input.testChapter} · culprit p by chapter ${r.walk.map((w) => (w.posterior[culprit] ?? 0).toFixed(2)).join(" ")} · favourite from ch ${settle} · chapters before the test moving the belief < 0.02: ${before.filter((x) => x.d < 0.02).length} of ${before.length}`);
    }
    const r = cml.walkReader(model, input);
    console.log(`[${on ? "ON " : "OFF"}] culprit-pointing clues by owning chapter: ${r.culpritClues.map((c) => c.chapter).join(", ")} · withheld clues: ${input.withheld?.size ?? 0}`);
  }
}

if (MODE === "all" || MODE === "necessity") {
  const scene = cml.clearedBySceneOf(art.cml);
  const base = cml.analyseProof(model, { clearedByScene: scene });
  const culprits = new Set(model.culprits);
  const pointing = model.clues.filter((c) => c.implicates.some((n) => culprits.has(n)));
  let necessary = 0;
  for (const clue of model.clues) if (!cml.analyseProof({ ...model, clues: model.clues.filter((c) => c !== clue) }, { clearedByScene: scene }).culpritProven) necessary++;
  const testOnly = cml.analyseProof({ ...model, clues: model.clues.filter((c) => !pointing.includes(c)) }, { clearedByScene: scene });
  const one = { ...model, testDesign: null, clues: model.clues.filter((c) => !pointing.includes(c) || c === pointing[0]) };
  const positive = cml.analyseProof(one, {}).culpritProven && !cml.analyseProof({ ...one, clues: one.clues.filter((c) => c !== pointing[0]) }, {}).culpritProven;
  console.log(`necessity: culprit proven ${base.culpritProven} · clues ${model.clues.length} · pointing at ${culprit} ${pointing.length} · clues whose deletion un-proves ${necessary} · test alone proves ${testOnly.culpritProven} · known positive fires ${positive}`);
}

if (MODE === "all" || MODE === "delta") {
  const W = 8000, MFW = 300;
  const tokens = (t) => (t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []);
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const strip = (t) => { const a = t.search(/[*]{3} ?START OF/i); const b = t.search(/[*]{3} ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };
  const authorOf = (slug) => { const p = join(ROOT, "library/works", slug, "provenance.yaml"); if (!fs.existsSync(p)) return null; return (fs.readFileSync(p, "utf8").match(/^author:\s*"?([^"\n]+)"?/m) ?? [])[1] ?? null; };
  const canon = fs.readdirSync(join(ROOT, "library/texts")).filter((f) => f.endsWith(".txt")).map((f) => ({ author: authorOf(f.replace(/[.]txt$/, "")), tok: tokens(strip(fs.readFileSync(join(ROOT, "library/texts", f), "utf8"))) })).filter((c) => c.tok.length >= W + 2000);
  const win = (tok) => tok.slice(2000, 2000 + W);
  const freq = new Map(); for (const q of canon) for (const w of win(q.tok)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const vocab = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, MFW).map(([w]) => w);
  const idx = new Map(vocab.map((w, i) => [w, i]));
  const rel = (tok) => { const v = new Float64Array(MFW); for (const w of tok) { const i = idx.get(w); if (i !== undefined) v[i]++; } for (let i = 0; i < MFW; i++) v[i] /= tok.length; return v; };
  const cr = canon.map((q) => rel(win(q.tok)));
  const mu = new Float64Array(MFW), sg = new Float64Array(MFW);
  for (let i = 0; i < MFW; i++) { mu[i] = mean(cr.map((v) => v[i])); sg[i] = Math.sqrt(mean(cr.map((v) => (v[i] - mu[i]) ** 2))) || 1e-9; }
  const z = (tok) => { const v = rel(win(tok)); for (let i = 0; i < MFW; i++) v[i] = (v[i] - mu[i]) / sg[i]; return v; };
  const cosD = (a, b) => { let d = 0, x = 0, y = 0; for (let i = 0; i < MFW; i++) { d += a[i] * b[i]; x += a[i] ** 2; y += b[i] ** 2; } return 1 - d / Math.sqrt(x * y); };
  const centroid = (vs) => { const c = new Float64Array(MFW); for (const v of vs) for (let i = 0; i < MFW; i++) c[i] += v[i] / vs.length; return c; };
  const book = z(tokens(fs.readFileSync(BOOK, "utf8").replace(/^#.*$/gm, "")));
  const byAuthor = new Map(); for (const q of canon) { if (!q.author) continue; if (!byAuthor.has(q.author)) byAuthor.set(q.author, []); byAuthor.get(q.author).push(z(q.tok)); }
  const near = [...byAuthor].filter(([, s]) => s.length >= 7).map(([a, s]) => [a, cosD(book, centroid(s))]).sort((p, q) => p[1] - q[1]);
  const canonToOwnAuthor = [...byAuthor].filter(([, s]) => s.length >= 7).flatMap(([, s]) => s.map((v, i) => cosD(v, centroid(s.filter((_, j) => j !== i)))));
  console.log(`delta: this book to the nearest canon author's centroid ${near[0][0]} ${near[0][1].toFixed(3)}; a canon book to its own author's centroid (leave-one-out), mean ${mean(canonToOwnAuthor).toFixed(3)}`);
  const words = ["hands", "hand", "set", "against", "voice", "between", "window", "that", "there", "what", "it"];
  console.log(`delta: this book's z on the signature words: ${words.map((w) => `${w} ${book[idx.get(w)].toFixed(1)}`).join(" · ")}`);
}
