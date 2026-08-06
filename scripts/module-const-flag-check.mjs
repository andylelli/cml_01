#!/usr/bin/env node
/**
 * ADR-0004's enforcement — a flag read at module scope is a flag that can never be set.
 *
 * WHY THIS EXISTS AS CODE RATHER THAN A SENTENCE. [ADR-0004](../architecture/decisions/0004-flag-gated-default-off.md)
 * names "runtime-read, never a module const" as load-bearing and adds *"this has actually happened"*.
 * It then happened again, AFTER the record was written, in `agent7-run.ts` — the one module holding
 * the lever of a £6 probe ([REVIEW_05 §24.1](../architecture/REVIEW_05.md)). Set in `.env.local`, the
 * documented place, it would have read `false` on all four runs and the probe would have measured the
 * control arm four times while reporting a promotion.
 *
 * THE MECHANISM, because it is not obvious and that is why it recurs. Static `import` statements are
 * hoisted and evaluated BEFORE any top-level statement in the importing file. Entry points call
 * dotenv's `config()` among their top-level statements. So a `const X = process.env.FLAG` in an
 * imported module has already frozen to its default by the time `.env` is read. It works perfectly
 * when the flag is exported in the SHELL, which is how it survives testing.
 *
 * WHAT IS ALLOWED. The same read inside a function — a getter, evaluated per call. Also allowed: a
 * module-scope read in a file that loads dotenv ITSELF, above the read, since top-level statements in
 * one module run in order (`llm-connectivity-harness.ts` is the legitimate case).
 *
 * Usage:  node scripts/module-const-flag-check.mjs [--verbose]
 * Exit:   0 clean · 1 at least one frozen flag
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const VERBOSE = process.argv.includes("--verbose");

const SEARCH_ROOTS = [
  join(ROOT, "apps"),
  join(ROOT, "packages"),
  join(ROOT, "scripts"),
];

const SKIP_DIR = /(^|[\\/])(node_modules|dist|build|coverage|__tests__|\.git)([\\/]|$)/;
const CODE_FILE = /\.(ts|mts|mjs|js)$/;

/**
 * Flag-shaped environment names. Deliberately NOT every `process.env` read: credentials and paths are
 * read at module scope all over the tree and freezing them is harmless — nobody flips
 * `AZURE_OPENAI_ENDPOINT` mid-experiment. The defect this guards is a BEHAVIOUR LEVER that a probe
 * expects to move, so the pattern matches the same families the flag register tracks.
 */
const FLAG_NAME = /\bprocess\.env\.((?:AGENT|RUBRIC|NOVELTY|CANARY|STORY|GEOMETRY|CLUE|PROSE)[A-Z0-9_]*|[A-Z0-9_]*_(?:ENABLED?|MODE|FLAG|SHADOW|AUTHORITATIVE|GATE|BLOCKING)\b)/;

const files = [];
const walk = (dir) => {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (SKIP_DIR.test(full)) continue;
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(full);
    else if (CODE_FILE.test(full)) files.push(full);
  }
};
for (const root of SEARCH_ROOTS) walk(root);

const findings = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (!text.includes("process.env")) continue;
  const lines = text.split(/\r?\n/);

  /**
   * Does this file load the environment ITSELF, and where? A module-scope read BELOW its own load is
   * safe — top-level statements in a single module execute in order.
   *
   * Both forms count, and missing the second was this checker's own first false positive: `dotenv`'s
   * `config()`, and a hand-rolled loader that assigns `process.env[...]` directly, which several
   * scripts here do because they want `.env.local`-first precedence dotenv does not give them.
   */
  const dotenvLine = lines.findIndex(
    (l) =>
      !/^\s*[/*]/.test(l) &&
      // `[^\n]*?` rather than `[^\]]+`: the real hand-rolled loaders index with a captured group —
      // `process.env[m[1]] = …` — and a body that stops at the first `]` never reaches the `=`.
      // The `(?!=)` keeps `process.env[k] == null` from counting as a write.
      (/\b(?:dotenv\.)?config\s*\(|require\(["']dotenv["']\)/.test(l) || /process\.env\[[^\n]*?\]\s*=(?!=)/.test(l)),
  );

  lines.forEach((line, i) => {
    // Module scope only: `const`/`let` at column 0. An indented read is inside a function or block,
    // which is the shape ADR-0004 asks for.
    if (!/^(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]*)?=/.test(line)) return;
    if (!FLAG_NAME.test(line)) return;
    // An arrow function or `function` on the same line IS a getter — `export const isX = () => ...`.
    if (/=>|\bfunction\b/.test(line)) return;
    if (dotenvLine >= 0 && dotenvLine < i) return;

    findings.push({
      file: relative(ROOT, file).replace(/\\/g, "/"),
      line: i + 1,
      flag: FLAG_NAME.exec(line)?.[1] ?? "?",
      text: line.trim().slice(0, 110),
    });
  });
}

if (VERBOSE) console.log(`[module-const-flags] scanned ${files.length} files`);

if (findings.length === 0) {
  console.log("[module-const-flags] clean — every behaviour flag is read at call time (ADR-0004).");
  process.exit(0);
}

console.error(`\n[module-const-flags] ${findings.length} FROZEN FLAG(S) — ADR-0004\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}`);
  console.error(`    ${f.text}`);
  console.error(
    `    ${f.flag} is read when the module is IMPORTED, which happens before dotenv runs in the\n` +
      `    entry point. Setting it in .env/.env.local will not reach this. Make it a getter:\n` +
      `        export const isThing = () => /^(1|true|yes|on)$/i.test(process.env.${f.flag} ?? "");\n`,
  );
}
console.error(
  "  This is REVIEW_05 X9, which cost nothing only because a pre-spend audit caught it before the\n" +
    "  probe ran. A flag exported in the shell works fine, so tests do not catch this.\n",
);
process.exit(1);
