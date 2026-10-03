import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const td = await import(pathToFileURL(join(ROOT, "packages/cml/dist/timeline-deception.js")).href);
const ap = await import(pathToFileURL(join(ROOT, "packages/cml/dist/alibi-plan.js")).href);
const led = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);
const key = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]+/g, "");
const reads = new Map();
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const name of readdirSync(root)) {
  const dir = join(root, name); if (name === "_archive" || !statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir); const read = files.find((f) => /^chatgpt/i.test(f)); const story = files.find((f) => f.endsWith(".md")); if (!read || !story) continue;
  const raw = readFileSync(join(dir, read), "utf8"); const all = led.splitReads(raw).map((x) => led.parseExternalRead(x)).filter((r) => r.final != null); const p = all.length ? all[all.length - 1] : led.parseExternalRead(raw); if (p.final == null) continue;
  const head = readFileSync(join(dir, story), "utf8").slice(0, 400); const title = (head.match(/^#\s+(.+)$/m) ?? [])[1]; const run = (head.match(/Run ID:\s*([\w-]+)/) ?? [])[1];
  reads.set(key(title), { name, final: p.final, clues: p.categories?.clues, plot: p.categories?.plot_structure, ending: p.categories?.ending, run });
}
const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const byProject = new Map(); for (const a of store.artifacts) if (a.type === "cml") byProject.set(a.projectId, a);
const norm = (s) => String(s ?? "").trim().toLowerCase();
const rows = [];
for (const a of byProject.values()) {
  const c = a.payload.CASE; const m = c?.hidden_model?.mechanism ?? {}; const actual = td.parseClockTime(m.actual_time_of_death); if (actual == null) continue;
  const culprits = new Set((c?.culpability?.culprits ?? []).map(norm));
  const elig = (c.cast ?? []).filter((p) => norm(p.culprit_eligibility) === "eligible" && !culprits.has(norm(p.name)));
  if (!elig.some((p) => td.isValidAlibiSpan(p.alibi_span))) continue;
  let open = 0; for (const p of elig) { if (!td.isValidAlibiSpan(p.alibi_span)) continue; const [s, e] = td.alibiSpanToWindow(p.alibi_span); if (!ap.dialWindowContains(s, e, actual)) open++; }
  const r = reads.get(key(c?.meta?.title)); if (r) rows.push({ project: a.projectId, open, share: open / elig.length, ...r });
}
console.log("reads with a title", reads.size, "; checkable cases matched to a read:", rows.length);
for (const r of rows.sort((x, y) => x.open - y.open)) console.log(`  open ${r.open} (${(r.share * 100).toFixed(0)}%)  headline ${r.final} clues ${r.clues} plot ${r.plot} ending ${r.ending}  ${r.name}`);
