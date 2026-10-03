#!/usr/bin/env node
// CR-04 (documentation/code-review) — every workspace declares what it imports, and build:all's
// curated ORDER respects the declared graph.
//
// Why: @cml/prompts-llm imported @cml/story-validation in ~27 files without declaring it; it worked
// only through workspace hoisting, and build-all.mjs had to hand-curate its ORDER because "a naive
// topo-sort from package.json would order wrong". A restated fact needs a check, not a comment.
//
//   1. For each workspace, every bare import in src/ (production files) must be a dependency or
//      peerDependency; every bare import in a test file must be declared in any field.
//   2. Every @cml/* dependency of a package in build-all's ORDER must come earlier in ORDER.
//
// Exit 0 = clean; exit 1 = each violation named.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { builtinModules } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const builtins = new Set(builtinModules.flatMap((m) => [m, m.split('/')[0]]));
const SRC_EXT = /\.(ts|tsx|mts|cts|js|mjs|cjs)$/;
const TEST = /(__tests__|[./]test\.|[./]spec\.|\/test\/)/;


function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (SRC_EXT.test(e.name) && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

const pkgName = (spec) => {
  if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:') || /^[A-Za-z]:/.test(spec)) return null;
  const parts = spec.split('/');
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  return builtins.has(name) ? null : name;
};

// The compiler's own pre-parser: static, dynamic and require imports, never a string that merely contains "from".
const importsOf = (text) => ts.preProcessFile(text, true, true).importedFiles.map((i) => i.fileName);

const workspaces = ['apps', 'packages'].flatMap((d) =>
  readdirSync(join(root, d)).map((n) => join(root, d, n)).filter((p) => existsSync(join(p, 'package.json'))));

const errors = [];
const declaredInternal = new Map();
const hasBuild = new Set();

for (const ws of workspaces) {
  const pkg = JSON.parse(readFileSync(join(ws, 'package.json'), 'utf8'));
  const prod = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);
  const all = new Set([...prod, ...Object.keys(pkg.devDependencies ?? {}), ...Object.keys(pkg.optionalDependencies ?? {})]);
  declaredInternal.set(pkg.name, [...prod].filter((d) => d.startsWith('@cml/')));
  if (pkg.scripts?.build) hasBuild.add(pkg.name);
  const srcDir = join(ws, 'src');
  const files = [...(existsSync(srcDir) ? walk(srcDir) : []), ...(existsSync(join(ws, 'test')) ? walk(join(ws, 'test')) : [])];
  const missing = new Map(); // name -> { files: Set, prod: bool }
  for (const f of files) {
    const rel = relative(root, f).split(sep).join('/');
    const isTest = TEST.test(rel);
    {
      for (const spec of importsOf(readFileSync(f, 'utf8'))) {
        const name = pkgName(spec);
        if (!name || name === pkg.name) continue;
        const ok = isTest ? all.has(name) : prod.has(name);
        if (ok) continue;
        const entry = missing.get(name) ?? { files: new Set(), prod: false };
        entry.files.add(rel);
        entry.prod ||= !isTest;
        missing.set(name, entry);
      }
    }
  }
  for (const [name, { files: fs, prod: isProd }] of missing) {
    const where = all.has(name) ? 'is only a devDependency but is imported by production code' : 'is not declared';
    errors.push(`${pkg.name}: "${name}" ${isProd ? where : 'is not declared (tests)'} — ${fs.size} file(s), e.g. ${[...fs][0]}`);
  }
}

// build-all ORDER must be a topological order of the declared internal graph.
const buildAll = readFileSync(join(root, 'scripts', 'build-all.mjs'), 'utf8');
const orderBlock = buildAll.match(/const ORDER = \[([\s\S]*?)\];/);
if (!orderBlock) errors.push('scripts/build-all.mjs: could not find `const ORDER = [...]`');
else {
  const order = [...orderBlock[1].matchAll(/"(@cml\/[^"]+)"/g)].map((m) => m[1]);
  for (const [i, name] of order.entries()) {
    for (const dep of declaredInternal.get(name) ?? []) {
      const j = order.indexOf(dep);
      if (j < 0 && hasBuild.has(dep)) errors.push(`build-all ORDER: ${name} depends on ${dep}, which is not in ORDER`);
      else if (j > i) errors.push(`build-all ORDER: ${name} (position ${i}) depends on ${dep}, built later (position ${j})`);
    }
  }
}

if (errors.length) {
  console.error(`[workspace-deps] ${errors.length} violation(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`[workspace-deps] clean — ${workspaces.length} workspaces declare what they import; build-all ORDER respects the graph.`);
