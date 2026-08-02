/**
 * build:all — compile every backend @cml/* package in dependency order.
 *
 * Why this exists: `npm run -w @cml/worker build` (and `@cml/api build`) only compiles that one
 * package; it does NOT rebuild its dependencies. Several package.json files also under-declare their
 * internal deps (e.g. @cml/prompts-llm imports @cml/story-validation without listing it), so a naive
 * topo-sort from package.json would order wrong. The result was the "stale dist" trap: `npm run dev`
 * and `npm run canary:core` silently ran old compiled code, so source-level fixes never took effect.
 *
 * This builds a CURATED, verified leaf-first order so what runs is always what's in source.
 * (Frontend @cml/web is intentionally excluded — it is not in the generation pipeline.)
 */

import { execSync } from "node:child_process";

const ORDER = [
  // leaves (no internal deps)
  "@cml/cml-core",
  "@cml/period-kb",
  "@cml/prose-guard",
  "@cml/style-contract",
  "@cml/device-library",
  "@cml/clue-spec",
  "@cml/beat-scheduler",
  "@cml/llm-client",
  "@cml/novelty",
  // depend on leaves
  "@cml/cml",
  "@cml/rubric-score",       // → prose-guard
  "@cml/story-validation",   // → cml, llm-client
  // depend on the above
  "@cml/prompts-llm",        // → cml, llm-client, period-kb, story-validation, prose-guard
  "@cml/worker",             // → cml, llm-client, prompts-llm, story-validation, prose-guard, beat-scheduler, rubric-score, clue-spec
  "@cml/api",                // → cml, prompts-llm, worker
];

const only = process.argv.slice(2); // optional: build:all <pkg...> to build a subset (still in order)
const targets = only.length > 0 ? ORDER.filter((p) => only.includes(p) || only.includes(p.replace("@cml/", ""))) : ORDER;

const started = Date.now();
for (const pkg of targets) {
  process.stdout.write(`\n=== build ${pkg} ===\n`);
  execSync(`npm run -w ${pkg} build`, { stdio: "inherit" });
}
process.stdout.write(`\n✅ build:all complete (${targets.length} packages, ${Math.round((Date.now() - started) / 1000)}s)\n`);
