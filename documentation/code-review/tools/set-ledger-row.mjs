#!/usr/bin/env node
/**
 * Set one ledger item's status, commit and note in ledger-state.tsv, then rebuild LEDGER.md.
 *
 *   node documentation/code-review/tools/set-ledger-row.mjs <key> <status> <commit|-> "<note>"
 *
 * `-` for the commit leaves it as it is. Fails if the key is not in the file.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const tsv = join(here, "ledger-state.tsv");
const [key, status, commit, note] = process.argv.slice(2);
const STATUSES = new Set(["todo", "wip", "done", "deferred", "dup", "withdrawn"]);
if (!key || !STATUSES.has(status) || commit === undefined || note === undefined) {
  console.error("usage: set-ledger-row.mjs <key> <todo|wip|done|deferred|dup|withdrawn> <commit|-> <note>");
  process.exit(2);
}
if (/[\t\n]/.test(note)) { console.error("note may not contain a tab or newline"); process.exit(2); }

const lines = readFileSync(tsv, "utf8").split("\n");
const i = lines.findIndex((l) => l.split("\t")[0] === key);
if (i < 0) { console.error(`no ledger row ${key}`); process.exit(1); }
const cols = lines[i].split("\t");
cols[2] = status;
if (commit !== "-") cols[3] = commit;
cols[4] = note;
lines[i] = cols.join("\t");
writeFileSync(tsv, lines.join("\n"));
execFileSync(process.execPath, [join(here, "build-ledger.mjs")], { stdio: "inherit" });
