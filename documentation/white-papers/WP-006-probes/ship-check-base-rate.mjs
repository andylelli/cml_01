import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const rd = await import(pathToFileURL(join(ROOT, "packages/prose-guard/dist/repetition-density.js")).href);
const led = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const pearson = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, dx = 0, dy = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; } return n / Math.sqrt(dx * dy); };
const rows = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const body = readFileSync(join(dir, story), "utf8").replace(/^\*Run ID:.*$/m, "").replace(/^---$/gm, "").replace(/^#.*$/gm, "");
  const words = body.split(/\s+/).filter(Boolean).length; if (words < 8000) continue;
  const d = rd.repetitionDensity(body); const s = rd.summariseRepetitionDensity(d);
  rows.push({ name, date: (name.match(/(\d{8})/) ?? [])[1], final: p.final, prose: p.categories?.prose, per10k: d.per10k, multiple: s.multiple ?? d.per10k / 17.3 });
}
console.log("sample keys", Object.keys(rd.repetitionDensity("a b c")), "summary keys", Object.keys(rd.summariseRepetitionDensity(rd.repetitionDensity("a b c"))));
const flag = rows.filter((r) => r.multiple >= 3), ok = rows.filter((r) => r.multiple < 3);
console.log(`reads >=8000 words: ${rows.length}; repetition per10k median ${med(rows.map((r) => r.per10k)).toFixed(1)} mean ${mean(rows.map((r) => r.per10k)).toFixed(1)}`);
console.log(`WORTH A LOOK (multiple >= 3): ${flag.length}/${rows.length} = ${(100 * flag.length / rows.length).toFixed(0)}%`);
console.log(`headline flagged: mean ${mean(flag.map((r) => r.final)).toFixed(1)} sd ${sd(flag.map((r) => r.final)).toFixed(1)}; not flagged: mean ${mean(ok.map((r) => r.final)).toFixed(1)} sd ${sd(ok.map((r) => r.final)).toFixed(1)}`);
const se = Math.sqrt(sd(flag.map((r) => r.final)) ** 2 / flag.length + sd(ok.map((r) => r.final)) ** 2 / ok.length);
console.log(`difference ${(mean(ok.map((r) => r.final)) - mean(flag.map((r) => r.final))).toFixed(1)} marks, se ${se.toFixed(1)}`);
console.log(`corr(log(1+per10k), headline) ${pearson(rows.map((r) => Math.log(1 + r.per10k)), rows.map((r) => r.final)).toFixed(3)}; corr(per10k, headline) ${pearson(rows.map((r) => r.per10k), rows.map((r) => r.final)).toFixed(3)}`);
for (const [n, f] of [["before 2026-09-22", (r) => r.date < "20260922"], ["from 2026-09-22", (r) => r.date >= "20260922"]]) { const s = rows.filter(f); const fl = s.filter((r) => r.multiple >= 3); console.log(`  ${n}: flagged ${fl.length}/${s.length}; headline flagged ${fl.length ? mean(fl.map((r) => r.final)).toFixed(1) : "-"} vs clear ${s.length - fl.length ? mean(s.filter((r) => r.multiple < 3).map((r) => r.final)).toFixed(1) : "-"}`); }
const top = rows.filter((r) => r.final >= 85); console.log(`reads >= 85: ${top.length}; of them flagged ${top.filter((r) => r.multiple >= 3).length} (${top.map((r) => r.final + ":" + r.multiple.toFixed(1) + "x").join(", ")})`);
for (const [n, f] of [["< 1x", (r) => r.multiple < 1], ["1-3x", (r) => r.multiple >= 1 && r.multiple < 3], ["3-10x", (r) => r.multiple >= 3 && r.multiple < 10], [">= 10x", (r) => r.multiple >= 10]]) { const s = rows.filter(f); console.log(`  bin ${n}: n=${s.length} headline mean ${s.length ? mean(s.map((r) => r.final)).toFixed(1) : "-"} min ${s.length ? Math.min(...s.map((r) => r.final)) : "-"} max ${s.length ? Math.max(...s.map((r) => r.final)) : "-"} prose mean ${s.length ? mean(s.filter((r) => r.prose != null).map((r) => r.prose)).toFixed(1) : "-"}`); }
