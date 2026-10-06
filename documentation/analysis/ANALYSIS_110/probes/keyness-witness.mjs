// A_110 M8 — what the keyness finding would hand the editor, on real books. For each v2 manuscript (or one given),
// the top house phrases by G² against the canon, from data/keyness-reference.json. Read-only; after build:all and
// `node scripts/build-keyness-reference.mjs`.
//   node documentation/analysis/ANALYSIS_110/probes/keyness-witness.mjs [manuscript.md]
import fs from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const pe = await import(pathToFileURL(join(ROOT, "packages/prose-engine/dist/index.js")).href);
const ref = JSON.parse(fs.readFileSync(join(ROOT, "data/keyness-reference.json"), "utf8"));
const files = process.argv[2] ? [process.argv[2]] : [];
if (!files.length) for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const d of fs.readdirSync(root)) {
  if (!/2026(09(2[5-9]|30)|10)/.test(d)) continue;
  const dir = join(root, d); if (!fs.statSync(dir).isDirectory()) continue;
  const md = fs.readdirSync(dir).find((f) => f.endsWith(".md")); if (md) files.push(join(dir, md));
}
let books = 0, withPhrases = 0;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8").replace(/^#.*$/gm, "");
  const ranked = pe.rankHousePhrases(text, ref);
  books++;
  if (ranked.length) withPhrases++;
  console.log(`${f.split(/[\\/]/).slice(-2, -1)[0]}: ${ranked.length} phrase(s) — ${ranked.slice(0, 5).map((p) => `"${p.phrase}" ×${p.inBook} (canon ${p.inCanon})`).join("; ")}`);
}
console.log(`books ${books} · with at least one ranked house phrase ${withPhrases}`);
