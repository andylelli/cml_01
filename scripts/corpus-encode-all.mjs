#!/usr/bin/env node
/**
 * A_77 Phase 2 — batch runner.
 *
 *   node scripts/corpus-encode-all.mjs --budget=5 [--only=slug,slug]
 *
 * Runs `corpus-encode.mjs` over the remaining legacy novels SHORTEST FIRST, so the cheap books
 * establish whether the harness works before the expensive one is attempted. Stops the moment the
 * cumulative ledger would cross --budget, and says which book it stopped before.
 *
 * Sequential on purpose: the deployment has a per-minute token quota (see the 429 handler in
 * corpus-encode.mjs) and parallel long prompts simply queue behind each other while burning retries.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const ROOT = "C:/CML";
const LEDGER = `${ROOT}/library/.encode-ledger.json`;
/**
 * A_97: was a scratchpad path belonging to a closed session, alongside a hardcoded list of the eight
 * legacy slugs — so the batch runner could only ever encode the books of August 2026 and, after that
 * session's temp directory was cleared, none at all. The queue is now DERIVED from what is on disk:
 * every work that has an acquired text and no `case.cml2.yaml` yet. Acquisition therefore extends
 * the queue by itself, which is the property the corpus needed in order to grow.
 */
const SRC = `${ROOT}/library/texts`;

const BUDGET = Number((process.argv.find((a) => a.startsWith("--budget=")) ?? "--budget=5").split("=")[1]);
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").split("=")[1];

const ALL = readdirSync(`${ROOT}/library/works`)
  .filter((s) => existsSync(`${ROOT}/library/works/${s}/provenance.yaml`));
const queue = (only ? only.split(",") : ALL)
  .filter((s) => existsSync(`${SRC}/${s}.txt`))
  .filter((s) => !existsSync(`${ROOT}/library/works/${s}/case.cml2.yaml`))
  .map((s) => ({ slug: s, words: readFileSync(`${SRC}/${s}.txt`, "utf8").split(/\s+/).length }))
  .sort((a, b) => a.words - b.words);

const led = () => (existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : { totalGbp: 0, runs: [] });

console.log(`queue (${queue.length}): ` + queue.map((q) => `${q.slug} (${(q.words / 1000).toFixed(0)}k)`).join(", "));
console.log(`budget: £${BUDGET.toFixed(2)}  ledger now: £${led().totalGbp.toFixed(4)}\n`);

const done = [];
for (const { slug, words } of queue) {
  const before = led().totalGbp;
  // ~£0.0012 per 1k words, measured on the first runs; refuse to start a book we cannot finish.
  const est = (words / 1000) * 0.0012 + 0.08;
  if (before + est > BUDGET) {
    console.log(`\nSTOP before ${slug}: ledger £${before.toFixed(4)} + est £${est.toFixed(3)} would cross £${BUDGET.toFixed(2)}.`);
    break;
  }
  const r = spawnSync(process.execPath, [`${ROOT}/scripts/corpus-encode.mjs`, slug, `--budget=${BUDGET}`],
    { stdio: "inherit", cwd: ROOT });
  done.push({ slug, exit: r.status });
  if (r.status === 3) { console.log("\nbudget guard fired inside the encoder — stopping."); break; }
}

const l = led();
console.log(`\n=== batch complete ===`);
console.table(l.runs);
console.log(`total spend: £${l.totalGbp.toFixed(4)} of £${BUDGET.toFixed(2)}`);
