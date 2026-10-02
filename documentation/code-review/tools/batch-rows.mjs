// Apply many ledger rows at once: node batch-rows.mjs <rows.tsv>   (key \t status \t commit \t note [\t d12|rem])
// Writes ledger-state.tsv once, rebuilds LEDGER.md once, and updates DECISION-12.md / REMAINING.md rows.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const rows = readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"))
  .map((l) => { const [key, status, commit, note, table = ""] = l.split("\t"); return { key, status, commit, note, table }; });
const tsv = join(here, "ledger-state.tsv");
const lines = readFileSync(tsv, "utf8").split("\n");
for (const r of rows) {
  const i = lines.findIndex((l) => l.split("\t")[0] === r.key);
  if (i < 0) throw new Error(`no ledger row ${r.key}`);
  const cols = lines[i].split("\t");
  cols[2] = r.status; if (r.commit !== "-") cols[3] = r.commit; cols[4] = r.note;
  lines[i] = cols.join("\t");
}
writeFileSync(tsv, lines.join("\n"));
for (const [table, file] of [["d12", "DECISION-12.md"], ["rem", "REMAINING.md"]]) {
  const path = join(here, "..", file);
  const doc = readFileSync(path, "utf8").split("\n");
  for (const r of rows.filter((x) => x.table === table)) {
    const i = doc.findIndex((l) => l.startsWith(`| ${r.key} |`));
    if (i < 0) throw new Error(`${file}: no row ${r.key}`);
    const c = doc[i].split("|");
    c[3] = ` ${r.status} `; c[4] = ` ${r.commit === "-" ? "" : r.commit} `; c[5] = ` ${r.note.replace(/\|/g, "/").slice(0, 140)} `;
    doc[i] = c.join("|");
  }
  writeFileSync(path, doc.join("\n"));
}
execFileSync(process.execPath, [join(here, "build-ledger.mjs")], { stdio: "inherit" });
