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
import { readFileSync, existsSync } from "node:fs";

const ROOT = "C:/CML";
const LEDGER = `${ROOT}/library/.encode-ledger.json`;
const SRC = "C:/Users/andyl/AppData/Local/Temp/claude/C--CML/37bf12e3-44c1-4bb6-ae7f-407b46016ade/scratchpad/src";

const BUDGET = Number((process.argv.find((a) => a.startsWith("--budget=")) ?? "--budget=5").split("=")[1]);
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").split("=")[1];

const ALL = [
  "the_big_bow_mystery", "the_sign_of_the_four", "a_study_in_scarlet",
  "the_valley_of_fear", "the_hound_of_the_baskervilles",
  "the_mystery_of_the_yellow_room", "the_leavenworth_case", "the_moonstone",
];
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
