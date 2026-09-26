#!/usr/bin/env node
/**
 * Which exported symbols in the agent code does anything actually use?
 *
 * Usage (repo root, after `npm install`):
 *   node documentation/code-review/tools/export-usage.mjs            # markdown to stdout
 *   node documentation/code-review/tools/export-usage.mjs --json out.json
 *
 * METHOD — and why its "unused" list is a LOWER bound. Every file under apps/api/src, apps/worker/src,
 * packages/<pkg>/src and scripts/ is parsed with the TypeScript parser and reduced to the set of
 * identifier NAMES it contains (comments and strings excluded, so a name mentioned in prose does not
 * count). An export is "used" by any other file containing an identifier of the same name. Two
 * unrelated symbols that share a name therefore mark each other used, so this can only UNDER-report
 * dead exports; it never invents one. A barrel (`index.ts`) that merely re-exports a name is not
 * counted as a use.
 *
 * Classes:  unused     no other file names it — delete, or un-export if used inside its own file
 *           test-only  only tests name it — either dead production code kept alive by its test, or a
 *                      seam exported for testing (the review decides which)
 *           used       at least one production file names it
 */

import ts from "typescript";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.env.CML_WORKSPACE_ROOT || process.cwd());
const SCOPE = ["apps/worker/src/jobs/agents", "apps/worker/src/jobs/mystery-orchestrator.ts", "apps/worker/src/jobs/scoring-adapters", "packages/prompts-llm/src"];
const argv = process.argv.slice(2);
const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : null;

const SKIP = new Set(["node_modules", "dist", "build", ".git", "coverage"]);
const walk = (abs, out = []) => {
  if (!existsSync(abs)) return out;
  if (statSync(abs).isFile()) return out.push(abs), out;
  for (const n of readdirSync(abs)) {
    if (SKIP.has(n)) continue;
    const p = join(abs, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const rel = (a) => relative(ROOT, a).split(sep).join("/");
const isTest = (p) => /(^|[\\/])__tests__[\\/]/.test(p) || /\.test\.[cm]?[tj]sx?$/.test(p);
const isCode = (p) => /\.(ts|tsx|mts|mjs|js|cjs)$/.test(p) && !p.endsWith(".d.ts");

const universe = [
  ...walk(join(ROOT, "apps/api/src")),
  ...walk(join(ROOT, "apps/worker/src")),
  ...readdirSync(join(ROOT, "packages")).flatMap((p) => walk(join(ROOT, "packages", p, "src"))),
  ...walk(join(ROOT, "scripts")),
].filter(isCode);

const parse = (abs) => ts.createSourceFile(abs, readFileSync(abs, "utf8"), ts.ScriptTarget.Latest, true, /\.[cm]?js$/.test(abs) ? ts.ScriptKind.JS : ts.ScriptKind.TS);

/** name -> Set(file) over identifiers only; also remember which names each barrel merely re-exports. */
const users = new Map();
const reexportOnly = new Map(); // file -> Set(name)
const identNames = new Map(); // file -> Set(name) used as a real identifier (not only re-exported)
for (const abs of universe) {
  let sf;
  try {
    sf = parse(abs);
  } catch {
    continue;
  }
  const names = new Set();
  const reexported = new Set();
  const visit = (node) => {
    if (ts.isExportDeclaration(node) && node.moduleSpecifier && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) reexported.add((el.propertyName || el.name).text);
      return;
    }
    if (ts.isIdentifier(node)) names.add(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  reexportOnly.set(abs, reexported);
  identNames.set(abs, names);
  for (const n of names) {
    if (!users.has(n)) users.set(n, new Set());
    users.get(n).add(abs);
  }
  for (const n of reexported) if (!names.has(n)) {
    if (!users.has(n)) users.set(n, new Set());
    users.get(n).add(abs);
  }
}

const hasExport = (node) => ts.canHaveModifiers(node) && (ts.getModifiers(node) || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

const scopeFiles = SCOPE.flatMap((s) => walk(join(ROOT, s))).filter((p) => isCode(p) && !isTest(p) && basename(p) !== "index.ts");
const rows = [];
for (const abs of scopeFiles) {
  const sf = parse(abs);
  const text = sf.text;
  for (const st of sf.statements) {
    if (!hasExport(st)) continue;
    const decls = [];
    if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) ts.isIdentifier(d.name) && decls.push([d.name.text, "value", d]);
    else if (st.name && ts.isIdentifier(st.name)) {
      const kind = ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st) ? "type" : "value";
      decls.push([st.name.text, kind, st]);
    }
    for (const [name, kind, node] of decls) {
      const others = [...(users.get(name) || [])].filter((f) => f !== abs);
      const prod = others.filter((f) => !isTest(f) && !(basename(f) === "index.ts" && reexportOnly.get(f)?.has(name) && !identNames.get(f)?.has(name)));
      const tests = others.filter(isTest);
      const internalUses = (text.match(new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`, "g")) || []).length - 1;
      const loc = sf.getLineAndCharacterOfPosition(node.end).line - sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
      rows.push({
        file: rel(abs),
        line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
        name,
        kind,
        loc,
        status: prod.length ? "used" : tests.length ? "test-only" : "unused",
        prodUsers: prod.length,
        testUsers: tests.length,
        usedInOwnFile: internalUses > 0,
      });
    }
  }
}

const count = (st, kind) => rows.filter((r) => r.status === st && (!kind || r.kind === kind));
const out = [];
out.push(`# Export usage — agent scope`);
out.push("");
out.push(`Generated by \`documentation/code-review/tools/export-usage.mjs\`. "unused" is a lower bound (see the script header).`);
out.push("");
out.push(`| status | value exports | type exports | lines in value exports |`);
out.push(`|---|---:|---:|---:|`);
for (const st of ["used", "test-only", "unused"]) {
  out.push(`| ${st} | ${count(st, "value").length} | ${count(st, "type").length} | ${count(st, "value").reduce((a, r) => a + r.loc, 0).toLocaleString("en-GB")} |`);
}
out.push("");
for (const st of ["unused", "test-only"]) {
  const list = rows.filter((r) => r.status === st).sort((a, b) => b.loc - a.loc);
  out.push(`## ${st} (${list.length})`);
  out.push("");
  out.push(`| symbol | kind | location | LOC | used in own file | test users |`);
  out.push(`|---|---|---|---:|---|---:|`);
  for (const r of list) out.push(`| \`${r.name}\` | ${r.kind} | \`${r.file}:${r.line}\` | ${r.loc} | ${r.usedInOwnFile ? "yes" : "no"} | ${r.testUsers} |`);
  out.push("");
}
process.stdout.write(`${out.join("\n")}\n`);
if (jsonOut) writeFileSync(resolve(ROOT, jsonOut), `${JSON.stringify(rows, null, 1)}\n`);
