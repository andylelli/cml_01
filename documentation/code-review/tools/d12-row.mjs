// Set one row of DECISION-12.md's STATUS table: node d12-row.mjs <item> <status> <commit|-> "<note>"
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [item, status, commit, note = ""] = process.argv.slice(2);
if (!item || !status || !commit) throw new Error("usage: d12-row.mjs <item> <status> <commit|-> \"<note>\"");
const file = join(dirname(fileURLToPath(import.meta.url)), "..", "DECISION-12.md");
const lines = readFileSync(file, "utf8").split("\n");
const i = lines.findIndex((l) => l.startsWith(`| ${item} |`));
if (i < 0) throw new Error(`no row for ${item}`);
const cr = lines[i].split("|")[2].trim();
lines[i] = `| ${item} | ${cr} | ${status} | ${commit === "-" ? "" : commit} | ${note.replace(/\|/g, "/")} |`;
writeFileSync(file, lines.join("\n"));
console.log(lines[i].slice(0, 160));
