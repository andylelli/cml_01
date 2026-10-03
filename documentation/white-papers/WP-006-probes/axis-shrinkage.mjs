import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const led = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const key = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]+/g, "");
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const variance = (a) => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rng = mulberry32(5); const gauss = () => { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const reads = new Map();
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const text = readFileSync(join(dir, story), "utf8"); if (text.split(/\s+/).length < 8000) continue;
  const title = (text.slice(0, 400).match(/^#\s+(.+)$/m) ?? [])[1]; reads.set(key(title), { name, final: p.final });
}
const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const cmls = new Map(); for (const a of store.artifacts) if (a.type === "cml") cmls.set(a.projectId, a.payload);
const by = new Map();
for (const cml of cmls.values()) { const C = cml.CASE ?? cml; const r = reads.get(key(C?.meta?.title)); if (!r) continue; const ax = String(C?.false_assumption?.type ?? "?").toLowerCase(); if (!by.has(ax)) by.set(ax, []); by.get(ax).push(r.final); }
const all = [...by.values()].flat(); const grand = mean(all);
const within = [...by.values()].filter((v) => v.length > 1).reduce((s, v) => s + variance(v) * (v.length - 1), 0) / (all.length - by.size);
const groupMeans = [...by.values()].map(mean);
const between = Math.max(0, variance(groupMeans) - within * mean([...by.values()].map((v) => 1 / v.length)));
console.log(`reads matched to an axis: ${all.length}; grand mean ${grand.toFixed(1)}; within-axis variance ${within.toFixed(1)} (sd ${Math.sqrt(within).toFixed(1)}); between-axis variance estimate ${between.toFixed(2)}`);
const post = [];
for (const [ax, v] of by) { const n = v.length, m = mean(v); const w = between / (between + within / n); const shrunk = grand + w * (m - grand); const pv = between > 0 ? 1 / (1 / between + n / within) : 0; post.push({ ax, n, m, shrunk, psd: Math.sqrt(pv) }); }
const wins = new Map(post.map((p) => [p.ax, 0]));
for (let i = 0; i < 20000; i++) { let best = null, bv = -Infinity; for (const p of post) { const d = p.shrunk + p.psd * gauss(); if (d > bv) { bv = d; best = p.ax; } } wins.set(best, wins.get(best) + 1); }
for (const p of post.sort((a, b) => b.n - a.n)) console.log(`  ${p.ax.padEnd(11)} n=${String(p.n).padStart(2)} raw mean ${p.m.toFixed(1)}  shrunk ${p.shrunk.toFixed(1)} +/- ${p.psd.toFixed(1)}  P(best) ${(wins.get(p.ax) / 20000).toFixed(2)}`);
