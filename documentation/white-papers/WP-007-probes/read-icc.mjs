// WP-007 §3.2 — ICC(1) (Shrout & Fleiss 1979) and the design effect (Kish 1965) on the read ledger.
// Reads are clustered by case on their cast: the six commonest mid-sentence capitalised words, two books
// in one case when they share four with EVERY member (complete linkage). Only reads from 2026-09-07 on
// count, because before --fresh-names many different cases share default names, and the transitive
// WP-006 clustering put 34 reads in one 'case' on the first run of this probe. Book headings cannot be the
// key: 13 reads are headed 'Resumed resume-…'. Within a case, two
// reads differ by reader noise, the writer's draw AND any lever flipped between them, so the within-case
// SD is an UPPER BOUND on reader + draw noise. Read-only; run from the repo root.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const led = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const reads = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const text = readFileSync(join(dir, story), "utf8"); if (text.split(/\s+/).length < 8000) continue;
  const date = (name.match(/([0-9]{8})-[0-9]{4}/) ?? [])[1] ?? ""; if (date < "20260907") continue;
  const c = new Map(); for (const m of text.matchAll(/[a-z,;] ([A-Z][a-z]{2,})/g)) c.set(m[1], (c.get(m[1]) ?? 0) + 1);
  const sig = [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
  reads.push({ name, final: p.final, prose: p.categories?.prose, sig, title: sig.slice(0, 3).join("/") });
}
const share = (a, b) => a.sig.filter((w) => b.sig.includes(w)).length >= 4;
const clusters = [];
for (const r of reads) { const home = clusters.find((cl) => cl.every((m) => share(m, r))); if (home) home.push(r); else clusters.push([r]); }
const groups = new Map(clusters.map((cl, i) => [i, cl]));
const g = [...groups.values()];
const sizes = g.map((x) => x.length).sort((a, b) => b - a);
console.log(`full-length reads ${reads.length}; distinct cases ${g.length}; cluster sizes ${JSON.stringify(sizes.filter((s) => s > 1))} (+ ${sizes.filter((s) => s === 1).length} singletons)`);

for (const key of ["final", "prose"]) {
  const gs = g.map((x) => x.map((r) => r[key]).filter((v) => v != null)).filter((x) => x.length);
  const N = gs.reduce((a, x) => a + x.length, 0), k = gs.length, grand = mean(gs.flat());
  const ssb = gs.reduce((a, x) => a + x.length * (mean(x) - grand) ** 2, 0);
  const ssw = gs.reduce((a, x) => a + x.reduce((s, v) => s + (v - mean(x)) ** 2, 0), 0);
  const msb = ssb / (k - 1), msw = ssw / (N - k);
  const n0 = (N - gs.reduce((a, x) => a + x.length ** 2, 0) / N) / (k - 1);
  const icc = (msb - msw) / (msb + (n0 - 1) * msw);
  const mbar = gs.reduce((a, x) => a + x.length ** 2, 0) / N; // size-weighted mean cluster size
  const deff = 1 + (mbar - 1) * icc;
  const multi = gs.filter((x) => x.length > 1);
  console.log(`${key}: N ${N}, cases ${k}, cases with 2+ reads ${multi.length} (${multi.reduce((a, x) => a + x.length, 0)} reads)`);
  console.log(`  within-case SD (pooled, df ${N - k}) ${Math.sqrt(msw).toFixed(2)} · between-case MS ${msb.toFixed(1)} · ICC(1) ${icc.toFixed(2)} · weighted cluster size ${mbar.toFixed(2)} · design effect ${deff.toFixed(2)} · effective n ${(N / deff).toFixed(0)}`);
  if (key === "final") for (const x of g.filter((y) => y.length > 1).sort((a, b) => b.length - a.length)) console.log(`    ${x.length} reads: ${x.map((r) => r.final).join(", ")}  (${x[0].title.slice(0, 40)}; ${x.map((r) => r.name.slice(0, 22)).join(" | ")})`);
}
