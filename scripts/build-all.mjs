/**
 * build:all — compile every backend @cml/* package in dependency order.
 *
 * Why this exists: `npm run -w @cml/worker build` (and `@cml/api build`) only compiles that one
 * package; it does NOT rebuild its dependencies. The result was the "stale dist" trap: `npm run dev`
 * and `npm run canary:core` silently ran old compiled code, so source-level fixes never took effect.
 *
 * This builds a CURATED leaf-first order so what runs is always what's in source. The manifests used to
 * under-declare their internal deps (@cml/prompts-llm imported @cml/story-validation in 28 files without
 * listing it); since CR-04 they declare everything, and `npm run deps:check` fails if ORDER stops being a
 * topological order of the declared graph.
 * (Frontend @cml/web is intentionally excluded — it is not in the generation pipeline.)
 */

import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ORDER = [
  // leaves (no internal deps)
  "@cml/cml-core",
  "@cml/period-kb",
  "@cml/prose-guard",
  "@cml/style-contract",
  "@cml/device-library",
  "@cml/clue-spec",
  "@cml/beat-scheduler",
  "@cml/story-geometry",
  "@cml/llm-client",
  "@cml/novelty",
  // depend on leaves
  "@cml/cml",
  "@cml/rubric-score",       // → prose-guard
  "@cml/story-validation",   // → cml, llm-client
  // depend on the above
  "@cml/prompts-llm",        // → cml, llm-client, period-kb, story-validation, prose-guard
  "@cml/prose-engine",       // → cml, prompts-llm, prose-guard (ANALYSIS_99 §10)
  "@cml/worker",             // → cml, llm-client, prompts-llm, story-validation, prose-guard, beat-scheduler, rubric-score, clue-spec, story-geometry
  "@cml/api",                // → cml, prompts-llm, worker
];

/**
 * ── A_86 item 89 — `--changed`: build what changed, and everything downstream of it ─────────────
 *
 * WHY. `build:all` rebuilds fourteen packages for a one-package edit, ~4 minutes, and it is on the
 * path of every iteration in this repo (and of `pretest`). Most of that work is provably redundant:
 * a package whose newest source file is older than its oldest output cannot produce different output.
 *
 * WHAT IT IS NOT. This is not a dependency-graph rebuild — `ORDER` is already the topological order,
 * so "everything downstream" is simply "everything after it in ORDER". That is deliberately blunt:
 * an over-build costs seconds, an under-build ships a stale dist, and the worker consumes dist
 * (`worker-consumes-cml-packages-via-dist`). When in doubt this builds MORE, never less.
 *
 * DEFAULT UNCHANGED. Without the flag every package is built exactly as before, so no existing
 * command — including `pretest` and `canary:core` — changes behaviour.
 */
const changedOnly = process.argv.includes("--changed");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const explicit = only.length > 0 ? ORDER.filter((p) => only.includes(p) || only.includes(p.replace("@cml/", ""))) : ORDER;

const pkgDir = (pkg) => {
  const name = pkg.replace("@cml/", "");
  for (const base of ["packages", "apps"]) {
    const dir = join(base, name);
    if (existsSync(join(dir, "package.json"))) return dir;
  }
  return null;
};

/** Newest mtime under a directory, or 0 when it does not exist. Skips node_modules. */
const newestMtime = (dir) => {
  if (!existsSync(dir)) return 0;
  let newest = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const m = statSync(full).mtimeMs;
        if (m > newest) newest = m;
      }
    }
  };
  walk(dir);
  return newest;
};

const isStale = (pkg) => {
  const dir = pkgDir(pkg);
  if (!dir) return true; // unknown layout ⇒ build it
  const distAt = newestMtime(join(dir, "dist"));
  if (distAt === 0) return true; // never built
  return newestMtime(join(dir, "src")) > distAt;
};

let targets = explicit;
if (changedOnly) {
  const firstStale = explicit.findIndex((pkg) => isStale(pkg));
  if (firstStale < 0) {
    process.stdout.write("\n✅ build:all --changed: every package's dist is newer than its src — nothing to build\n");
    process.exit(0);
  }
  // Everything from the first stale package onward: ORDER is topological, so this is its downstream.
  targets = explicit.slice(firstStale);
  const skipped = explicit.slice(0, firstStale);
  process.stdout.write(
    `\n[build:all --changed] stale from '${targets[0]}' — building ${targets.length}, ` +
      `skipping ${skipped.length} whose dist is newer than src\n`,
  );
}

const started = Date.now();
for (const pkg of targets) {
  process.stdout.write(`\n=== build ${pkg} ===\n`);
  execSync(`npm run -w ${pkg} build`, { stdio: "inherit" });
}
process.stdout.write(`\n✅ build:all complete (${targets.length} packages, ${Math.round((Date.now() - started) / 1000)}s)\n`);
