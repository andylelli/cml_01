#!/usr/bin/env node
// CR-02 (documentation/code-review, finding A9W-19) — no file or function may grow past its baseline.
//
// Why: S4 split agent9-run.ts to 6,814 lines on 2026-08-03; twenty commits later it was 7,602 and
// runAgent9 had grown 3,533 → 3,957, "because that is where the pattern pointed". A split without a
// guard loses to growth. This is the guard.
//
// Rules, over every non-test source file in apps/{worker,api}/src and packages/*/src:
//   - a file over FILE_LIMIT code lines, or a function over FN_LIMIT lines, is TRACKED in the
//     baseline (scripts/size-ratchet-baseline.json) and may not exceed its recorded size;
//   - an untracked file or function may not cross the limit.
// Shrinking is always allowed; `--update` records the new, lower sizes. Raising a ceiling also takes
// `--update`, and the baseline diff is then in the commit for review — growth is a decision, not drift.
//
//   node scripts/size-ratchet-check.mjs            # check (pretest, CI)
//   node scripts/size-ratchet-check.mjs --update   # rewrite the baseline from the current tree
//
// Definitions match documentation/code-review/tools/agent-metrics.mjs:
//   code lines  lines holding at least one non-comment token (prompt text in a template IS code)
//   fn lines    first to last line of the function, including nested closures and comments
import ts from 'typescript';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_LIMIT = 1500;
const FN_LIMIT = 400;
const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const BASELINE = join(ROOT, 'scripts', 'size-ratchet-baseline.json');
const SRC = /\.(ts|tsx|mts|cts|js|mjs)$/;
const TEST = /(^|\/)(__tests__|test|tests)\/|\.(test|spec)\.[a-z]+$/;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (SRC.test(e.name) && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

const roots = [
  'apps/worker/src', 'apps/api/src',
  ...readdirSync(join(ROOT, 'packages')).map((p) => `packages/${p}/src`),
];
const files = roots.flatMap((r) => walk(join(ROOT, r)))
  .map((f) => relative(ROOT, f).split(sep).join('/'))
  .filter((f) => !TEST.test(f))
  .sort();

const isFn = (n) => ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isArrowFunction(n) ||
  ts.isFunctionExpression(n) || ts.isConstructorDeclaration(n) || ts.isGetAccessorDeclaration(n) ||
  ts.isSetAccessorDeclaration(n);

function fnName(n) {
  if (n.name && (ts.isIdentifier(n.name) || ts.isStringLiteral(n.name) || ts.isPrivateIdentifier(n.name))) return n.name.text;
  if (ts.isConstructorDeclaration(n)) return 'constructor';
  const p = n.parent;
  if (p && (ts.isVariableDeclaration(p) || ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p)) && p.name && ts.isIdentifier(p.name)) return p.name.text;
  if (p && ts.isBinaryExpression(p) && ts.isPropertyAccessExpression(p.left)) return p.left.name.text;
  if (p && ts.isCallExpression(p) && ts.isIdentifier(p.expression)) return `<arg of ${p.expression.text}>`;
  if (p && ts.isCallExpression(p) && ts.isPropertyAccessExpression(p.expression)) return `<arg of .${p.expression.name.text}>`;
  return '<anonymous>';
}

function measure(rel) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  const kind = rel.endsWith('x') ? ts.ScriptKind.TSX : rel.match(/\.m?js$/) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, kind);
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line;
  // Code lines: every line spanned by a leaf token. getChildren() scans tokens in parser context, so
  // template text is a token and a "//" inside it is not a comment.
  const code = new Set();
  const visitTokens = (node) => {
    const kids = node.getChildren(sf);
    if (kids.length === 0) {
      if (node.kind === ts.SyntaxKind.EndOfFileToken) return;
      const start = node.getStart(sf);
      if (node.getEnd() <= start) return;
      for (let l = lineOf(start); l <= lineOf(node.getEnd() - 1); l++) code.add(l);
      return;
    }
    kids.forEach(visitTokens);
  };
  visitTokens(sf);
  const fns = [];
  const seen = new Map();
  const visitFns = (node, path) => {
    let next = path;
    if (isFn(node) && node.body) {
      const name = [...path, fnName(node)].join('>');
      const n = (seen.get(name) ?? 0) + 1;
      seen.set(name, n);
      const lines = lineOf(node.getEnd()) - lineOf(node.getStart(sf)) + 1;
      fns.push({ key: n > 1 ? `${name}#${n}` : name, lines });
      next = [...path, fnName(node)];
    } else if (ts.isClassDeclaration(node) && node.name) next = [...path, node.name.text];
    ts.forEachChild(node, (c) => visitFns(c, next));
  };
  visitFns(sf, []);
  return { codeLines: code.size, fns };
}

const current = { files: {}, functions: {} };
const all = { files: {}, functions: {} };
for (const rel of files) {
  const m = measure(rel);
  all.files[rel] = m.codeLines;
  if (m.codeLines > FILE_LIMIT) current.files[rel] = m.codeLines;
  for (const f of m.fns) {
    const k = `${rel}::${f.key}`;
    all.functions[k] = f.lines;
    if (f.lines > FN_LIMIT) current.functions[k] = f.lines;
  }
}

if (process.argv.includes('--update')) {
  const out = {
    note: 'Generated by scripts/size-ratchet-check.mjs --update. A raised number here is a decision: say why in the commit.',
    limits: { fileCodeLines: FILE_LIMIT, functionLines: FN_LIMIT },
    files: current.files,
    functions: current.functions,
  };
  writeFileSync(BASELINE, JSON.stringify(out, null, 2) + '\n');
  console.log(`[size-ratchet] baseline written: ${Object.keys(current.files).length} files > ${FILE_LIMIT} code lines, ${Object.keys(current.functions).length} functions > ${FN_LIMIT} lines`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error('[size-ratchet] no baseline: run `node scripts/size-ratchet-check.mjs --update`');
  process.exit(1);
}
const base = JSON.parse(readFileSync(BASELINE, 'utf8'));
const errors = [];
const shrunk = [];
const check = (kind, measured, tracked, limit, unit) => {
  for (const [k, v] of Object.entries(measured)) {
    const ceiling = tracked[k];
    if (ceiling === undefined && v > limit) errors.push(`${kind} ${k}: ${v} ${unit}, over the ${limit} limit (new, or renamed — splitting it is the fix)`);
    else if (ceiling !== undefined && v > ceiling) errors.push(`${kind} ${k}: ${v} ${unit}, grew past its baseline ${ceiling} (+${v - ceiling})`);
  }
  for (const [k, ceiling] of Object.entries(tracked)) {
    const v = measured[k];
    if (v === undefined || v < ceiling) shrunk.push(`${kind} ${k}: ${ceiling} → ${v ?? 'gone'}`);
  }
};
check('file', all.files, base.files, FILE_LIMIT, 'code lines');
check('function', all.functions, base.functions, FN_LIMIT, 'lines');

if (errors.length) {
  console.error(`[size-ratchet] ${errors.length} violation(s) — move the new code into its own module or function:\n  ` + errors.join('\n  '));
  console.error('  (to raise a ceiling deliberately: `node scripts/size-ratchet-check.mjs --update`, and say why in the commit)');
  process.exit(1);
}
const tail = shrunk.length ? ` ${shrunk.length} shrank — run with --update to lock the gain in.` : '';
console.log(`[size-ratchet] clean — ${files.length} files; ${Object.keys(base.files).length} tracked files and ${Object.keys(base.functions).length} tracked functions within their baseline.${tail}`);
