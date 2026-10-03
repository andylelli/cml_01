import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const cl = await import(pathToFileURL(join(ROOT, "packages/cml/dist/case-logic/index.js")).href);
const led = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const key = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]+/g, "");
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const reads = new Map();
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const head = readFileSync(join(dir, story), "utf8").slice(0, 400); const title = (head.match(/^#\s+(.+)$/m) ?? [])[1];
  reads.set(key(title), { name, final: p.final, clues: p.categories?.clues, plot: p.categories?.plot_structure });
}
const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const last = (type) => { const m = new Map(); for (const a of store.artifacts) if (a.type === type) m.set(a.projectId, a.payload); return m; };
const cmls = last("cml"), clues = last("clues");
const rows = [];
for (const [projectId, cml] of cmls) {
  const r = reads.get(key((cml.CASE ?? cml)?.meta?.title)); if (!r) continue;
  const model = cl.buildCaseModel({ cml, clues: clues.get(projectId) }); const tl = cl.analyseTimeline(model);
  const open = tl.innocents.filter((i) => i.coverage === "none" || i.coverage === "partial").length;
  const unknown = tl.innocents.filter((i) => i.coverage === "unknown").length;
  rows.push({ ...r, consistent: tl.consistent, act: !!tl.act, open, unknown, n: tl.innocents.length });
}
const show = (label, a, b) => { const f = (s, k) => `${mean(s.map((r) => r[k]).filter((v) => v != null)).toFixed(1)}`; console.log(`${label}: n=${a.length} headline ${f(a, "final")} clues ${f(a, "clues")} plot ${f(a, "plot")}  |  n=${b.length} headline ${f(b, "final")} clues ${f(b, "clues")} plot ${f(b, "plot")}`); };
console.log(`projects matched to a read by title: ${rows.length}`);
show("timeline consistent | inconsistent", rows.filter((r) => r.consistent), rows.filter((r) => !r.consistent));
show("act window bounded | not bounded", rows.filter((r) => r.act), rows.filter((r) => !r.act));
show("bounded act: all innocents covered | some open", rows.filter((r) => r.act && r.open === 0), rows.filter((r) => r.act && r.open > 0));
const a = rows.filter((r) => r.consistent).map((r) => r.final), b = rows.filter((r) => !r.consistent).map((r) => r.final);
if (b.length > 1) console.log(`consistent - inconsistent headline: ${(mean(a) - mean(b)).toFixed(1)} se ${Math.sqrt(sd(a) ** 2 / a.length + sd(b) ** 2 / b.length).toFixed(1)}`);
const a2 = rows.filter((r) => r.consistent).map((r) => r.clues).filter((v) => v != null), b2 = rows.filter((r) => !r.consistent).map((r) => r.clues).filter((v) => v != null);
if (b2.length > 1) console.log(`consistent - inconsistent clues mark: ${(mean(a2) - mean(b2)).toFixed(2)} se ${Math.sqrt(sd(a2) ** 2 / a2.length + sd(b2) ** 2 / b2.length).toFixed(2)}`);
