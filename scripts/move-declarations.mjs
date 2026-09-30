#!/usr/bin/env node
/**
 * Move top-level declarations between TypeScript files by NAME, with their leading comments — the
 * TypeScript parser finds each statement's exact extent, so a declaration moves whole (JSDoc included)
 * or the script refuses. Imports are NOT rewritten: the compiler names what each side now lacks.
 *
 *   node scripts/move-declarations.mjs --from <src.ts> --to <dest.ts> --names a,b,c [--dry]
 *
 * Written for owner decision 1 (retire the v1 prose engine, 2026-09-30): the symbols the v2 engine,
 * Agent 7 and scoring still use are moved out of v1 files before those files are deleted.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const from = arg("--from"), to = arg("--to"), names = new Set((arg("--names") ?? "").split(",").map((s) => s.trim()).filter(Boolean));
if (!from || !to || names.size === 0) { console.error("usage: --from <src.ts> --to <dest.ts> --names a,b,c [--dry]"); process.exit(2); }

const text = readFileSync(from, "utf8");
const sf = ts.createSourceFile(from, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const declaredNames = (st) => {
  if (ts.isVariableStatement(st)) return st.declarationList.declarations.map((d) => d.name.getText(sf));
  if (st.name) return [st.name.getText(sf)];
  return [];
};
// --closure: also take every top-level declaration of this file that the named ones reference, transitively.
const requested = new Set(names);
if (args.includes("--closure")) {
  const byName = new Map();
  for (const st of sf.statements) for (const n of declaredNames(st)) byName.set(n, st);
  const queue = [...names];
  while (queue.length) {
    const st = byName.get(queue.pop());
    if (!st) continue;
    const visit = (node) => {
      if (ts.isIdentifier(node) && byName.has(node.text) && !names.has(node.text)) { names.add(node.text); queue.push(node.text); }
      ts.forEachChild(node, visit);
    };
    visit(st);
  }
  // A statement declaring several names moves whole, so its siblings come along.
  for (const st of sf.statements) { const ns = declaredNames(st); if (ns.some((n) => names.has(n))) ns.forEach((n) => names.add(n)); }
}
const picked = [];
for (const st of sf.statements) {
  const ns = declaredNames(st);
  const hit = ns.filter((n) => names.has(n));
  if (hit.length === 0) continue;
  if (hit.length !== ns.length) { console.error(`statement declares ${ns.join(", ")} but only ${hit.join(", ")} requested — refusing`); process.exit(1); }
  picked.push({ st, ns, start: st.getFullStart(), end: st.getEnd() });
}
const found = new Set(picked.flatMap((p) => p.ns));
const missing = [...requested].filter((n) => !found.has(n));
if (missing.length) { console.error(`not found as top-level declarations in ${from}: ${missing.join(", ")}`); process.exit(1); }

const moved = picked.map((p) => text.slice(p.start, p.end).replace(/^\s*\n/, "")).join("\n\n");
let rest = text;
for (const p of [...picked].reverse()) rest = rest.slice(0, p.start) + rest.slice(p.end);
if (args.includes("--dry")) { console.log(moved); process.exit(0); }
const dest = existsSync(to) ? readFileSync(to, "utf8").trimEnd() + "\n\n" : "";
writeFileSync(to, dest + moved.trim() + "\n");
writeFileSync(from, rest);
console.log(`moved ${picked.length} declaration(s) (${[...found].join(", ")}) from ${from} to ${to}`);
