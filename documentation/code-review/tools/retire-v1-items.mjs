#!/usr/bin/env node
/**
 * Owner decision 1 (2026-10-01) — which open Agent 9 ledger items the v1 deletion made moot.
 *
 * Every open item keyed A9W/A9G/A9P/A9V/A9R reviewed a file of the v1 engine (areas 01–05 are v1 files only).
 * An item is WITHDRAWN as moot unless its finding text in the area report names a declaration that survived
 * into `packages/prompts-llm/src/prose-contract/` — those stay open, pointed at their new home. Prints the
 * decision per item; `--apply <commit>` writes it through set-ledger-row.mjs.
 *
 *   node documentation/code-review/tools/retire-v1-items.mjs [--apply <commit>]
 */
import { readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "../../..");
const apply = process.argv.includes("--apply") ? process.argv[process.argv.indexOf("--apply") + 1] : null;

// every top-level declaration name in prose-contract/, with its file
const survivors = new Map();
const pc = join(ROOT, "packages/prompts-llm/src/prose-contract");
for (const f of readdirSync(pc)) {
  const text = readFileSync(join(pc, f), "utf8");
  for (const m of text.matchAll(/^(?:export )?(?:const|function|async function|interface|type|let)\s+([A-Za-z_][A-Za-z0-9_]*)/gm)) survivors.set(m[1], f);
}
// the finding text per id, from the five area reports
const areas = ["01-agent9-worker", "02-agent9-generation", "03-agent9-prompts", "04-agent9-validation", "05-agent9-repair"]
  .map((a) => readFileSync(join(here, "../areas", `${a}.md`), "utf8")).join("\n");
const ledgerRows = readFileSync(join(here, "../LEDGER.md"), "utf8").split("\n");
const sectionOf = (id) => {
  const start = areas.search(new RegExp(`^#{2,4} ${id.replace(/[-]/g, "\\-")}\\b`, "m"));
  // Incidental defects (-D) and questions (-Q) live in tables, not under a heading: every line naming the id.
  if (start < 0) {
    const lines = areas.split("\n").filter((l) => new RegExp(`\\b${id.replace(/[-]/g, "\\-")}\\b`).test(l));
    // …and when the areas never name it (most -D/-Q items), the ledger's own row is its text.
    if (lines.length === 0) return ledgerRows.filter((l) => l.startsWith(`| ${id} |`)).join("\n");
    return lines.join("\n");
  }
  const rest = areas.slice(start);
  const body = rest.slice(rest.indexOf("\n") + 1); // after the heading's own line
  const next = body.search(/^#{2,4} /m);
  return next < 0 ? rest : rest.slice(0, rest.indexOf("\n") + 1 + next);
};

const tsv = readFileSync(join(here, "ledger-state.tsv"), "utf8").split("\n");
const decisions = [];
for (const line of tsv) {
  const [key, , status] = line.split("\t");
  if (!/^A9[WGPVR]-/.test(key ?? "") || !["todo", "deferred", "wip"].includes(status)) continue;
  const section = sectionOf(key);
  const hits = [...survivors.keys()].filter((n) => n.length > 5 && new RegExp(`\\b${n}\\b`).test(section));
  decisions.push({ key, keep: hits.length > 0, hits: hits.map((h) => `${h} (${survivors.get(h)})`), found: section.length > 0 });
}
const keep = decisions.filter((d) => d.keep), drop = decisions.filter((d) => !d.keep);
console.log(`${decisions.length} open Agent 9 items: ${drop.length} moot, ${keep.length} still apply to prose-contract/`);
for (const d of keep) console.log(`  KEEP ${d.key}: ${d.hits.join(", ")}`);
const noText = drop.filter((d) => !d.found).map((d) => d.key);
if (noText.length) console.log(`  (no area section found, withdrawn on the area's file scope: ${noText.join(" ")})`);
if (apply) {
  const set = join(here, "set-ledger-row.mjs");
  for (const d of drop) execFileSync(process.execPath, [set, d.key, "withdrawn", apply,
    "MOOT: the v1 prose engine this reviews was deleted (owner decision 1, 2026-10-01); nothing it names survived into prose-contract/"], { stdio: "ignore" });
  for (const d of keep) execFileSync(process.execPath, [set, d.key, "todo", "-",
    `Still applies after the v1 deletion (owner decision 1): the code it reviews moved to prose-contract/ — ${d.hits.join(", ")}`], { stdio: "ignore" });
  execFileSync(process.execPath, [join(here, "build-ledger.mjs")], { stdio: "inherit" });
}
