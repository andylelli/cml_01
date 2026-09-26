#!/usr/bin/env node
/**
 * Structural metrics for the agent code — the MEASURED half of documentation/code-review.
 *
 * WHY THIS EXISTS. The code review's findings are ranked by where the mass and the churn actually
 * are, not by impression. This script is the reproducible source of every size / complexity /
 * coupling / churn number quoted in documentation/code-review/. Re-run it after a refactor and diff
 * the JSON: "the 7,600-line file is now five files" is a claim this script can check.
 *
 * Usage (from the repo root, after `npm install`):
 *   node documentation/code-review/tools/agent-metrics.mjs                     # markdown report to stdout
 *   node documentation/code-review/tools/agent-metrics.mjs --json out.json     # + the full dataset
 *   node documentation/code-review/tools/agent-metrics.mjs --churn             # + git change frequency / hotspots
 *   node documentation/code-review/tools/agent-metrics.mjs apps/worker/src/jobs/agents   # custom scope
 *
 * Needs only `typescript` (a root devDependency). Syntactic analysis only: no type-checker, no build,
 * no network. CML_WORKSPACE_ROOT overrides the repo root (default: cwd).
 *
 * DEFINITIONS (so a number can be argued with):
 *   code lines     a line holding at least one non-comment token (prompt text in a template literal
 *                  IS code: it ships in the bundle and changes behaviour)
 *   comment lines  a line holding only comment text
 *   cc             cyclomatic complexity: 1 + if / ?: / for / for-in / for-of / while / do / case /
 *                  catch / && / || / ?? (and their assignment forms). Counted for the innermost
 *                  function only — a nested closure's branches are the closure's, not the parent's.
 *   depth          maximum control-flow nesting (if / loop / switch / try); an `else if` does not nest
 *   fn LOC         first to last line of the function, INCLUDING nested closures and comments
 *   llm calls      call sites of `.chat(` / `.chatWithRetry(` — the LLM client's two entry points
 *   long literals  string / template literals over 400 characters — embedded prompt text, roughly
 *   test importers test files that import this module by relative path (a test reaching it through a
 *                  package index is NOT counted, so zero means "no direct test", not "untested")
 */

import ts from "typescript";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.env.CML_WORKSPACE_ROOT || process.cwd());

const DEFAULT_SCOPE = [
  "apps/worker/src/jobs/agents",
  "apps/worker/src/jobs/mystery-orchestrator.ts",
  "apps/worker/src/jobs/scoring-adapters",
  "packages/prompts-llm/src",
];

/** Everything imports are resolved against, so fan-in and test mapping see consumers outside scope. */
const GRAPH_ROOTS = ["apps/api/src", "apps/worker/src", "packages", "scripts"];

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

const argv = process.argv.slice(2);
let jsonOut = null;
let withChurn = false;
let topN = 50;
const scopeArgs = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--json") jsonOut = argv[++i];
  else if (a === "--churn") withChurn = true;
  else if (a === "--top") topN = Number(argv[++i]) || topN;
  else if (a === "--help" || a === "-h") {
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
    process.exit(0);
  } else scopeArgs.push(a);
}
const SCOPE = scopeArgs.length ? scopeArgs : DEFAULT_SCOPE;

// ---------------------------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------------------------

const isTestFile = (p) => /(^|[\\/])__tests__[\\/]/.test(p) || /\.test\.[cm]?[tj]sx?$/.test(p);
const isSourceTs = (p) => /\.(ts|tsx|mts|cts)$/.test(p) && !p.endsWith(".d.ts");
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", "coverage", "examples"]);

function walk(absDir, out = []) {
  if (!existsSync(absDir)) return out;
  const st = statSync(absDir);
  if (st.isFile()) {
    out.push(absDir);
    return out;
  }
  for (const name of readdirSync(absDir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(absDir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const rel = (abs) => relative(ROOT, abs).split(sep).join("/");

const scopeFiles = [...new Set(SCOPE.flatMap((s) => walk(resolve(ROOT, s))))]
  .filter((p) => isSourceTs(p) && !isTestFile(p))
  .sort();

const graphFiles = [...new Set(GRAPH_ROOTS.flatMap((s) => walk(resolve(ROOT, s))))].filter(
  (p) => /\.(ts|tsx|mts|cts|mjs|js)$/.test(p) && !p.endsWith(".d.ts"),
);

// ---------------------------------------------------------------------------------------------
// Per-file analysis
// ---------------------------------------------------------------------------------------------

const K = ts.SyntaxKind;
const FN_KINDS = new Set([
  K.FunctionDeclaration,
  K.FunctionExpression,
  K.ArrowFunction,
  K.MethodDeclaration,
  K.Constructor,
  K.GetAccessor,
  K.SetAccessor,
]);
const DECISION_KINDS = new Set([
  K.IfStatement,
  K.ConditionalExpression,
  K.ForStatement,
  K.ForInStatement,
  K.ForOfStatement,
  K.WhileStatement,
  K.DoStatement,
  K.CaseClause,
  K.CatchClause,
]);
const LOGICAL_OPS = new Set([
  K.AmpersandAmpersandToken,
  K.BarBarToken,
  K.QuestionQuestionToken,
  K.AmpersandAmpersandEqualsToken,
  K.BarBarEqualsToken,
  K.QuestionQuestionEqualsToken,
]);
const NEST_KINDS = new Set([
  K.IfStatement,
  K.ForStatement,
  K.ForInStatement,
  K.ForOfStatement,
  K.WhileStatement,
  K.DoStatement,
  K.SwitchStatement,
  K.TryStatement,
]);
const LLM_METHODS = new Set(["chat", "chatWithRetry"]);
const LONG_LITERAL = 400;

function scriptKindFor(p) {
  if (p.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (/\.[cm]?js$/.test(p)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

function parse(absPath) {
  const text = readFileSync(absPath, "utf8");
  return { text, sf: ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true, scriptKindFor(absPath)) };
}

/** An import/re-export that the compiler erases: `import type`, `export type`, or all-`type` named bindings. */
function isTypeOnly(node) {
  if (ts.isExportDeclaration(node)) {
    if (node.isTypeOnly) return true;
    const ec = node.exportClause;
    return !!(ec && ts.isNamedExports(ec) && ec.elements.length && ec.elements.every((e) => e.isTypeOnly));
  }
  const clause = node.importClause;
  if (!clause) return false; // side-effect import: always runtime
  if (clause.isTypeOnly) return true;
  const nb = clause.namedBindings;
  return !clause.name && !!(nb && ts.isNamedImports(nb) && nb.elements.length && nb.elements.every((e) => e.isTypeOnly));
}

/** Module specifiers: static imports, re-exports, dynamic import(), require(). Each is { spec, typeOnly }. */
function moduleSpecifiers(sf) {
  const specs = [];
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      specs.push({ spec: node.moduleSpecifier.text, typeOnly: isTypeOnly(node) });
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === K.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require")) &&
      node.arguments.length === 1 &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      specs.push({ spec: node.arguments[0].text, typeOnly: false });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return specs;
}

function functionName(node, sf) {
  const lineOf = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const nameText = (n) => (n && (ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isPrivateIdentifier(n)) ? n.text : n ? n.getText(sf) : null);
  const className = () => {
    const c = node.parent;
    return c && (ts.isClassDeclaration(c) || ts.isClassExpression(c)) && c.name ? `${c.name.text}.` : "";
  };
  switch (node.kind) {
    case K.FunctionDeclaration:
      return node.name ? node.name.text : `<default>@${lineOf(node)}`;
    case K.MethodDeclaration:
    case K.GetAccessor:
    case K.SetAccessor:
      return `${className()}${nameText(node.name)}`;
    case K.Constructor:
      return `${className()}constructor`;
    default: {
      if (node.kind === K.FunctionExpression && node.name) return node.name.text;
      const p = node.parent;
      if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
      if (p && (ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p))) return nameText(p.name);
      if (p && ts.isBinaryExpression(p) && p.operatorToken.kind === K.EqualsToken) return p.left.getText(sf).slice(0, 60);
      if (p && ts.isCallExpression(p)) {
        const callee = p.expression.getText(sf).replace(/\s+/g, " ");
        return `<callback:${callee.length > 40 ? `${callee.slice(0, 40)}…` : callee}>@${lineOf(node)}`;
      }
      return `<anonymous>@${lineOf(node)}`;
    }
  }
}

/** Code vs comment-only vs blank lines, from real tokens and real comment ranges. */
function classifyLines(sf, text) {
  const starts = sf.getLineStarts();
  const n = starts.length;
  const code = new Uint8Array(n + 1);
  const comment = new Uint8Array(n + 1);
  const lineAt = (pos) => sf.getLineAndCharacterOfPosition(pos).line;
  const mark = (arr, s, e) => {
    const a = lineAt(s);
    const b = lineAt(Math.max(s, e - 1));
    for (let i = a; i <= b; i++) arr[i] = 1;
  };
  const seen = new Set();
  const addComments = (ranges) => {
    for (const r of ranges || []) {
      if (seen.has(r.pos)) continue;
      seen.add(r.pos);
      mark(comment, r.pos, r.end);
    }
  };
  const walkTokens = (node) => {
    if (node.kind >= K.FirstJSDocNode && node.kind <= K.LastJSDocNode) return;
    const children = node.getChildren(sf);
    if (children.length === 0) {
      addComments(ts.getLeadingCommentRanges(text, node.pos));
      addComments(ts.getTrailingCommentRanges(text, node.end));
      const s = node.getStart(sf);
      if (node.kind !== K.EndOfFileToken && node.end > s) mark(code, s, node.end);
      return;
    }
    for (const c of children) walkTokens(c);
  };
  walkTokens(sf);
  let codeLines = 0;
  let commentLines = 0;
  for (let i = 0; i < n; i++) {
    if (code[i]) codeLines++;
    else if (comment[i]) commentLines++;
  }
  // A trailing newline produces one empty final "line"; do not count it as blank.
  const total = text.endsWith("\n") ? n - 1 : n;
  return { lines: total, codeLines, commentLines, blankLines: Math.max(0, total - codeLines - commentLines) };
}

function analyzeFile(absPath) {
  const { text, sf } = parse(absPath);
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  const functions = [];
  const stack = [];
  const envNames = new Set();
  const s = {
    anyKeyword: 0,
    asCasts: 0,
    doubleCasts: 0,
    nonNull: 0,
    tsIgnore: (text.match(/@ts-(ignore|expect-error|nocheck)/g) || []).length,
    tryStatements: 0,
    catchIgnoringError: 0,
    llmCalls: 0,
    envReads: 0,
    longLiterals: 0,
    longLiteralChars: 0,
    exportedNames: 0,
    topLevelFunctions: 0,
    moduleLetBindings: 0,
  };

  const visit = (node) => {
    if (FN_KINDS.has(node.kind)) {
      const start = lineOf(node.getStart(sf));
      const end = lineOf(node.end);
      const parent = stack[stack.length - 1] || null;
      const ctx = {
        name: functionName(node, sf),
        line: start,
        loc: end - start + 1,
        params: node.parameters ? node.parameters.length : 0,
        cc: 1,
        depth: 0,
        maxDepth: 0,
        llmCalls: 0,
        nestedIn: parent ? parent.name : null,
        exported: false,
      };
      const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
      const varStmt = node.parent && ts.isVariableDeclaration(node.parent) ? node.parent.parent?.parent : null;
      const varMods = varStmt && ts.canHaveModifiers(varStmt) ? ts.getModifiers(varStmt) : undefined;
      ctx.exported = !!(mods || varMods || []).some?.((m) => m.kind === K.ExportKeyword);
      if (!parent) s.topLevelFunctions++;
      stack.push(ctx);
      ts.forEachChild(node, visit);
      stack.pop();
      functions.push(ctx);
      return;
    }

    const ctx = stack[stack.length - 1];
    if (ctx) {
      if (DECISION_KINDS.has(node.kind)) ctx.cc++;
      else if (ts.isBinaryExpression(node) && LOGICAL_OPS.has(node.operatorToken.kind)) ctx.cc++;
    }

    switch (node.kind) {
      case K.AnyKeyword:
        s.anyKeyword++;
        break;
      case K.AsExpression:
      case K.TypeAssertionExpression:
        s.asCasts++;
        if (ts.isAsExpression(node) && ts.isAsExpression(node.expression)) s.doubleCasts++;
        break;
      case K.NonNullExpression:
        s.nonNull++;
        break;
      case K.TryStatement:
        s.tryStatements++;
        break;
      case K.CatchClause: {
        const v = node.variableDeclaration;
        const body = node.block.getText(sf);
        const rethrows = /\bthrow\b/.test(body);
        const uses = v && ts.isIdentifier(v.name) && new RegExp(`\\b${v.name.text}\\b`).test(body);
        if (!rethrows && !uses) s.catchIgnoringError++;
        break;
      }
      case K.CallExpression: {
        const e = node.expression;
        if (ts.isPropertyAccessExpression(e) && LLM_METHODS.has(e.name.text)) {
          s.llmCalls++;
          if (ctx) ctx.llmCalls++;
        }
        break;
      }
      case K.PropertyAccessExpression: {
        const e = node.expression;
        if (ts.isPropertyAccessExpression(e) && e.name.text === "env" && ts.isIdentifier(e.expression) && e.expression.text === "process") {
          s.envReads++;
          envNames.add(node.name.text);
        }
        break;
      }
      case K.StringLiteral:
      case K.NoSubstitutionTemplateLiteral:
      case K.TemplateExpression: {
        const len = node.end - node.getStart(sf);
        if (len > LONG_LITERAL) {
          s.longLiterals++;
          s.longLiteralChars += len;
        }
        break;
      }
      default:
        break;
    }

    const nests =
      ctx &&
      NEST_KINDS.has(node.kind) &&
      !(node.kind === K.IfStatement && node.parent && ts.isIfStatement(node.parent) && node.parent.elseStatement === node);
    if (nests) {
      ctx.depth++;
      ctx.maxDepth = Math.max(ctx.maxDepth, ctx.depth);
    }
    ts.forEachChild(node, visit);
    if (nests) ctx.depth--;
  };
  visit(sf);

  for (const st of sf.statements) {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) || [] : [];
    const exported = mods.some((m) => m.kind === K.ExportKeyword);
    if (ts.isExportDeclaration(st)) s.exportedNames += st.exportClause && ts.isNamedExports(st.exportClause) ? st.exportClause.elements.length : 1;
    else if (ts.isExportAssignment(st)) s.exportedNames++;
    else if (exported) s.exportedNames += ts.isVariableStatement(st) ? st.declarationList.declarations.length : 1;
    if (ts.isVariableStatement(st) && st.declarationList.flags & ts.NodeFlags.Let) s.moduleLetBindings += st.declarationList.declarations.length;
  }

  for (const f of functions) delete f.depth;
  return { ...classifyLines(sf, text), ...s, envFlags: [...envNames].sort(), functions };
}

// ---------------------------------------------------------------------------------------------
// Import graph (resolved over GRAPH_ROOTS so consumers outside scope count)
// ---------------------------------------------------------------------------------------------

function resolveRelative(fromAbs, spec) {
  if (!spec.startsWith(".")) return null;
  const base = resolve(dirname(fromAbs), spec);
  const stem = base.replace(/\.(m|c)?js$/, "");
  const candidates = [base, `${stem}.ts`, `${stem}.tsx`, `${stem}.mts`, `${base}.ts`, `${base}.mjs`, `${base}.js`, join(base, "index.ts"), join(base, "index.mjs")];
  for (const c of candidates) if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
}

const importers = new Map(); // absPath -> Set(importer absPath)
const imports = new Map(); // absPath -> { internal: Set(abs), runtime: Set(abs), packages: Set(name) }
for (const f of graphFiles) {
  let sf;
  try {
    sf = parse(f).sf;
  } catch {
    continue;
  }
  const entry = { internal: new Set(), runtime: new Set(), packages: new Set() };
  for (const { spec, typeOnly } of moduleSpecifiers(sf)) {
    const target = resolveRelative(f, spec);
    if (target) {
      entry.internal.add(target);
      if (!typeOnly) entry.runtime.add(target);
      if (!importers.has(target)) importers.set(target, new Set());
      importers.get(target).add(f);
    } else if (!spec.startsWith(".")) {
      entry.packages.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);
    }
  }
  imports.set(f, entry);
}

/**
 * Tarjan SCC over scope files only: every component with more than one member is an import cycle.
 * edgeKey "runtime" ignores erased (type-only) imports; "internal" includes them.
 */
function importCycles(files, edgeKey) {
  const inScope = new Set(files);
  let index = 0;
  const idx = new Map();
  const low = new Map();
  const onStack = new Set();
  const stack = [];
  const out = [];
  const strong = (v) => {
    idx.set(v, index);
    low.set(v, index);
    index++;
    stack.push(v);
    onStack.add(v);
    for (const w of imports.get(v)?.[edgeKey] || []) {
      if (!inScope.has(w)) continue;
      if (!idx.has(w)) {
        strong(w);
        low.set(v, Math.min(low.get(v), low.get(w)));
      } else if (onStack.has(w)) low.set(v, Math.min(low.get(v), idx.get(w)));
    }
    if (low.get(v) === idx.get(v)) {
      const comp = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        comp.push(w);
      } while (w !== v);
      if (comp.length > 1) out.push(comp.map(rel).sort());
    }
  };
  for (const f of files) if (!idx.has(f)) strong(f);
  return out;
}

// ---------------------------------------------------------------------------------------------
// Git churn (optional): commits touching each file, and lines added+deleted, over full history
// ---------------------------------------------------------------------------------------------

function gitChurn() {
  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { cwd: ROOT, encoding: "utf8" }).trim();
    const log = execFileSync("git", ["log", "--no-merges", "--numstat", "--format=@@%H %ad", "--date=short", "--", ...SCOPE], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 1 << 28,
    });
    const churn = new Map();
    let firstDate = null;
    let commits = 0;
    for (const line of log.split("\n")) {
      if (line.startsWith("@@")) {
        commits++;
        firstDate = line.split(" ")[1];
        continue;
      }
      const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
      if (!m) continue;
      let path = m[3];
      // Renames appear as "dir/{old => new}.ts" or "old => new"; attribute them to the new path.
      path = path.replace(/\{[^{}]*? => ([^{}]*?)\}/g, "$1").replace(/^.* => /, "").replace(/\/\//g, "/");
      const c = churn.get(path) || { commits: 0, added: 0, deleted: 0 };
      c.commits++;
      c.added += m[1] === "-" ? 0 : Number(m[1]);
      c.deleted += m[2] === "-" ? 0 : Number(m[2]);
      churn.set(path, c);
    }
    return { shallow: shallow === "true", commits, since: firstDate, churn };
  } catch (err) {
    return { error: String(err.message || err) };
  }
}

// ---------------------------------------------------------------------------------------------
// Area grouping — one row per agent so the report reads the way the pipeline is organised
// ---------------------------------------------------------------------------------------------

function areaOf(p) {
  const r = rel(p);
  const m = r.match(/agent(\d+)([a-e])?[-./]/);
  if (m) {
    const n = m[1];
    const key = n === "65" ? "6.5" : n === "75" ? "7.5" : n;
    return `agent ${key}`;
  }
  if (r.includes("/agent9/")) return "agent 9";
  if (r.includes("mystery-orchestrator")) return "orchestrator";
  if (r.includes("scoring-adapters")) return "scoring adapters";
  return "shared / infra";
}

// ---------------------------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------------------------

const files = scopeFiles.map((abs) => {
  const a = analyzeFile(abs);
  const testImporters = [...(importers.get(abs) || [])].filter(isTestFile);
  const prodImporters = [...(importers.get(abs) || [])].filter((p) => !isTestFile(p));
  return {
    file: rel(abs),
    area: areaOf(abs),
    ...a,
    fanIn: prodImporters.length,
    testImporters: testImporters.length,
    fanOutInternal: imports.get(abs)?.internal.size || 0,
    packages: [...(imports.get(abs)?.packages || [])].filter((p) => p.startsWith("@cml/")).sort(),
  };
});

const churnInfo = withChurn ? gitChurn() : null;
if (churnInfo && churnInfo.churn) {
  for (const f of files) {
    const c = churnInfo.churn.get(f.file);
    f.commits = c ? c.commits : 0;
    f.linesChurned = c ? c.added + c.deleted : 0;
    f.hotspot = f.commits * f.codeLines;
  }
}

const allFns = files.flatMap((f) => f.functions.map((fn) => ({ file: f.file, area: f.area, ...fn })));
const sum = (xs, k) => xs.reduce((acc, x) => acc + (x[k] || 0), 0);
const cycles = importCycles(scopeFiles, "runtime");
const typeCycles = importCycles(scopeFiles, "internal").filter((c) => !cycles.some((r) => r.join() === c.join()));

// ---------------------------------------------------------------------------------------------
// Markdown report
// ---------------------------------------------------------------------------------------------

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-GB") : String(n ?? ""));
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : "—");
const lines = [];
const out = (s = "") => lines.push(s);

out(`# Agent code metrics`);
out();
out(`Generated by \`documentation/code-review/tools/agent-metrics.mjs\` · scope: ${SCOPE.map((s) => `\`${s}\``).join(", ")}`);
if (churnInfo?.churn) out(`Churn: ${fmt(churnInfo.commits)} non-merge commits touching scope since ${churnInfo.since}${churnInfo.shallow ? " (**SHALLOW CLONE — churn is truncated**)" : ""}`);
else if (churnInfo?.error) out(`Churn: unavailable (${churnInfo.error.split("\n")[0]})`);
out();

const totals = {
  files: files.length,
  lines: sum(files, "lines"),
  code: sum(files, "codeLines"),
  comment: sum(files, "commentLines"),
  fns: allFns.length,
  llm: sum(files, "llmCalls"),
  any: sum(files, "anyKeyword"),
  casts: sum(files, "asCasts"),
};
out(`## Totals`);
out();
out(`| files | lines | code lines | comment-only lines | functions | fns > 100 LOC | fns > 300 LOC | fns cc > 25 | LLM call sites | \`any\` | \`as\` casts |`);
out(`|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|`);
out(
  `| ${fmt(totals.files)} | ${fmt(totals.lines)} | ${fmt(totals.code)} | ${fmt(totals.comment)} (${pct(totals.comment, totals.lines)}) | ${fmt(totals.fns)} | ${fmt(allFns.filter((f) => f.loc > 100).length)} | ${fmt(allFns.filter((f) => f.loc > 300).length)} | ${fmt(allFns.filter((f) => f.cc > 25).length)} | ${fmt(totals.llm)} | ${fmt(totals.any)} | ${fmt(totals.casts)} |`,
);
out();

out(`## By area`);
out();
out(`| area | files | code lines | comment-only | largest file (code lines) | largest fn (LOC) | max cc | LLM calls | \`any\` |`);
out(`|---|---:|---:|---:|---|---:|---:|---:|---:|`);
const areas = [...new Set(files.map((f) => f.area))].sort((a, b) => sum(files.filter((f) => f.area === b), "codeLines") - sum(files.filter((f) => f.area === a), "codeLines"));
for (const area of areas) {
  const fs = files.filter((f) => f.area === area);
  const fns = allFns.filter((f) => f.area === area);
  const big = [...fs].sort((a, b) => b.codeLines - a.codeLines)[0];
  const bigFn = [...fns].sort((a, b) => b.loc - a.loc)[0];
  out(
    `| ${area} | ${fs.length} | ${fmt(sum(fs, "codeLines"))} | ${fmt(sum(fs, "commentLines"))} | \`${big.file.split("/").pop()}\` (${fmt(big.codeLines)}) | ${bigFn ? `${fmt(bigFn.loc)} \`${bigFn.name}\`` : "—"} | ${fns.length ? Math.max(...fns.map((f) => f.cc)) : "—"} | ${sum(fs, "llmCalls")} | ${sum(fs, "anyKeyword")} |`,
  );
}
out();

out(`## Files (by code lines)`);
out();
const churnCols = churnInfo?.churn ? " commits | hotspot |" : "";
const churnSep = churnInfo?.churn ? "---:|---:|" : "";
out(`| file | lines | code | comment % | fns | max fn LOC | max cc | fns>100 | \`any\` | casts | catch-ignore | LLM | env | long-literal chars | fan-in | test importers |${churnCols}`);
out(`|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|${churnSep}`);
for (const f of [...files].sort((a, b) => b.codeLines - a.codeLines)) {
  const maxLoc = f.functions.length ? Math.max(...f.functions.map((x) => x.loc)) : 0;
  const maxCc = f.functions.length ? Math.max(...f.functions.map((x) => x.cc)) : 0;
  const churn = churnInfo?.churn ? ` ${fmt(f.commits)} | ${fmt(f.hotspot)} |` : "";
  out(
    `| \`${f.file}\` | ${fmt(f.lines)} | ${fmt(f.codeLines)} | ${pct(f.commentLines, f.lines)} | ${f.functions.length} | ${fmt(maxLoc)} | ${maxCc} | ${f.functions.filter((x) => x.loc > 100).length} | ${f.anyKeyword} | ${f.asCasts} | ${f.catchIgnoringError} | ${f.llmCalls} | ${f.envReads} | ${fmt(f.longLiteralChars)} | ${f.fanIn} | ${f.testImporters} |${churn}`,
  );
}
out();

const fnRow = (f) =>
  `| \`${f.name}\` | \`${f.file}:${f.line}\` | ${fmt(f.loc)} | ${f.cc} | ${f.maxDepth} | ${f.params} | ${f.llmCalls} | ${f.nestedIn ? `in \`${f.nestedIn}\`` : f.exported ? "exported" : "module"} |`;
out(`## Top ${topN} functions by length`);
out();
out(`| function | location | LOC | cc | depth | params | LLM calls | scope |`);
out(`|---|---|---:|---:|---:|---:|---:|---|`);
for (const f of [...allFns].sort((a, b) => b.loc - a.loc).slice(0, topN)) out(fnRow(f));
out();

out(`## Top ${topN} functions by cyclomatic complexity`);
out();
out(`| function | location | LOC | cc | depth | params | LLM calls | scope |`);
out(`|---|---|---:|---:|---:|---:|---:|---|`);
for (const f of [...allFns].sort((a, b) => b.cc - a.cc).slice(0, topN)) out(fnRow(f));
out();

out(`## Function size distribution`);
out();
const buckets = [
  ["≤ 50", (l) => l <= 50],
  ["51–100", (l) => l > 50 && l <= 100],
  ["101–200", (l) => l > 100 && l <= 200],
  ["201–500", (l) => l > 200 && l <= 500],
  ["501–1000", (l) => l > 500 && l <= 1000],
  ["> 1000", (l) => l > 1000],
];
out(`| LOC | functions | share of all function lines (top-level only) |`);
out(`|---|---:|---:|`);
const topLevel = allFns.filter((f) => !f.nestedIn);
const tlLines = sum(topLevel, "loc");
for (const [label, pred] of buckets) {
  const inB = allFns.filter((f) => pred(f.loc));
  out(`| ${label} | ${inB.length} | ${pct(sum(topLevel.filter((f) => pred(f.loc)), "loc"), tlLines)} |`);
}
out();

out(`## Import cycles within scope`);
out();
out(`Runtime cycles (edges the compiler keeps):`);
out();
if (!cycles.length) out(`None.`);
for (const c of cycles) out(`- ${c.map((x) => `\`${x}\``).join(" ↔ ")}`);
out();
out(`Cycles that exist only through erased \`import type\` edges (harmless at runtime; a layering smell):`);
out();
if (!typeCycles.length) out(`None.`);
for (const c of typeCycles) out(`- ${c.length} files: ${c.map((x) => `\`${x}\``).join(" ↔ ")}`);
out();

if (churnInfo?.churn) {
  out(`## Hotspots (commits × code lines)`);
  out();
  out(`Change frequency times size: where a refactor pays back fastest, because the code is both large and edited often.`);
  out();
  out(`| file | commits | lines churned | code lines | hotspot |`);
  out(`|---|---:|---:|---:|---:|`);
  for (const f of [...files].sort((a, b) => b.hotspot - a.hotspot).slice(0, 25)) {
    out(`| \`${f.file}\` | ${f.commits} | ${fmt(f.linesChurned)} | ${fmt(f.codeLines)} | ${fmt(f.hotspot)} |`);
  }
  out();
}

process.stdout.write(`${lines.join("\n")}\n`);

if (jsonOut) {
  writeFileSync(
    resolve(ROOT, jsonOut),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), scope: SCOPE, totals, cycles, typeCycles, churn: churnInfo?.churn ? { commits: churnInfo.commits, since: churnInfo.since, shallow: churnInfo.shallow } : null, files }, null, 1)}\n`,
  );
}
