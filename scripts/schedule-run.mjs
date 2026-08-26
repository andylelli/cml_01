#!/usr/bin/env node
/**
 * ANALYSIS_74 §8 **DE6** — split the control input from the product input.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────────────────────────
 *
 * `scripts/canary-core-inputs.yaml` is doing two incompatible jobs. It is the experimental CONTROL —
 * frozen, so runs are comparable, which is what the §6.2 paired probe depends on — and it is also the
 * only input the product has ever been run on. Every one of the 39 external reads is therefore a
 * sample from a single cell of the design space, and that cell is nailed shut by two lines:
 *
 *     theme: "... driven by a mechanical clock-tampering method. ..."
 *     primaryAxis: temporal
 *
 * `MECHANISM_FAMILY_KEYWORDS.clock` matches that theme, `selectThemeCoherentPrimary` FORCES
 * `devices[0]` to realize it, and Agent 3b's prompt forbids swapping family "for novelty" by name.
 * The novelty engine has never been in a position to change the answer, so any claim that it does not
 * work is currently unfalsifiable — a worse position than "it failed".
 *
 * This script leaves the control alone and writes a SECOND config whose axis and mechanism are chosen
 * by the DE5 scheduler from the cross-run ledger.
 *
 * ── THE THEME IS NEUTRALISED, AND THAT IS THE WHOLE DESIGN ───────────────────────────────────────
 *
 * Borrowed wholesale from `axis-sweep.mjs`, which made this argument first and is worth quoting
 * because it is the trap this script would otherwise walk into: running a new axis against a
 * clock-tampering brief "would measure nothing … all five runs would come back temporal and the sweep
 * would report five successes while testing one axis. The prompt would be doing the coercion X70
 * removed from the code."
 *
 * So: every fair-play constraint is kept verbatim, the mechanism family is dropped, and the DE5
 * assignment is appended as a positive obligation. Cast, era, location, tone, length and batch size
 * are carried through unchanged from the control, because they are not what is being varied.
 *
 *   node scripts/schedule-run.mjs --dry     # print the cell and the config, write nothing, spend nothing
 *   node scripts/schedule-run.mjs           # write the config, print its path
 *   node scripts/schedule-run.mjs --exclude-axis temporal
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const BASE_YAML = join(ROOT, "scripts", "canary-core-inputs.yaml");
const OUT_DIR = join(ROOT, "scratchpad", "scheduled");

const DRY = process.argv.includes("--dry");
const flagValue = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null;
};

// The worker is consumed as compiled output everywhere else in this repo; do the same here so the
// script cannot silently run different logic from the pipeline (A_73 §19.1).
const dist = (p) => pathToFileURL(join(ROOT, "apps", "worker", "dist", "jobs", p)).href;
const { loadNoveltyLedger } = await import(dist("novelty-ledger.js"));
const { scheduleCell, cellDirective } = await import(dist("cell-scheduler.js"));
const { ledgerDispersion } = await import(dist("novelty-dispersion.js"));

/** Every fair-play constraint from the control brief; no mechanism family, no era, no location. */
const NEUTRAL_THEME =
  "Golden Age murder within a closed circle of suspects. Enforce strict fair-play: reveal all " +
  "mechanism-critical clues to the reader by mid-story, place the discriminating test no later than " +
  "early Act III, include at least 3 explicit evidence clues tied to the final deduction, and ensure " +
  "every red herring is inference-isolated from the true solution chain.";

const records = await loadNoveltyLedger();
let cell = scheduleCell(records);

const excludeAxis = flagValue("--exclude-axis");
if (excludeAxis && cell.axis === excludeAxis) {
  console.error(`  requested cell is on the excluded axis ${excludeAxis}; re-run without --exclude-axis or extend the ledger.`);
  process.exit(1);
}

const d = ledgerDispersion(records);
console.log(`\n  ledger: ${records.length} shipped run(s); coverage over the last ${d.window}:`);
for (const f of d.fields) {
  const vocab = f.vocabulary === null ? "(free text)" : `of ${f.vocabulary}`;
  console.log(`    ${f.field.padEnd(16)} H=${f.entropy.toFixed(2)}  ${String(f.distinct).padStart(2)} distinct ${vocab}`);
}
console.log(`\n  SCHEDULED CELL: ${cell.axis} x ${cell.family} x ${cell.testShape}`);
console.log(`    ${cell.reason}\n`);

const base = readFileSync(BASE_YAML, "utf8");
let text = base;
text = text.replace(/^theme:\s*".*"$/m, `theme: ${JSON.stringify(`${NEUTRAL_THEME} ${cellDirective(cell)}`)}`);
if (!/^theme:/m.test(text)) throw new Error("theme line not found in the base yaml");
text = text.replace(/^primaryAxis:\s*\w+$/m, `primaryAxis: ${cell.axis}`);
if (!new RegExp(`^primaryAxis: ${cell.axis}$`, "m").test(text)) throw new Error("primaryAxis line not rewritten");

const header =
  `# GENERATED by scripts/schedule-run.mjs — ANALYSIS_74 §8 DE5/DE6. DO NOT EDIT BY HAND.\n` +
  `# cell: ${cell.axis} x ${cell.family} x ${cell.testShape}\n` +
  `# ${cell.reason}\n` +
  `# The theme is mechanism-NEUTRAL plus a positive assignment; see the script header for why a\n` +
  `# themed brief would have silently re-imposed the very cell this run exists to leave.\n`;

if (DRY) {
  console.log("  --dry: nothing written. The theme line would be:\n");
  console.log("  " + (text.match(/^theme:.*$/m) ?? [""])[0].slice(0, 400) + "\n");
  process.exit(0);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, `inputs.${cell.axis}-${cell.family}.yaml`);
writeFileSync(outPath, header + text, "utf8");
console.log(`  written: ${outPath}`);
console.log(`\n  run it with:\n    CANARY_CORE_INPUTS_YAML="${outPath}" node --use-system-ca scripts/canary-core.mjs\n`);
