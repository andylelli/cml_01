#!/usr/bin/env node
/**
 * READ A MATCHED PAIR — per-chapter, paired, on the one validated instrument.
 *
 * A_76 §3 (FIX 2a). Book-level comparison is hopeless: the effects are chapter-level and dilute to
 * 0.1–0.6 points across a book, needing 251–9,291 pairs (£502–£18,582). Pairing on the CHAPTER
 * removes between-book variance and is the only affordable design this project has.
 *
 * Both arms must share byte-identical upstream (`RESUME_REDO=prose` on one project), so chapter i of
 * arm A and chapter i of arm B are written to the same outline, the same clues and the same
 * obligations. The only difference is the flags.
 *
 * WHAT IT REPORTS
 *   · per-chapter register rate for both arms and the paired difference
 *   · a paired t on those differences — the powered test
 *   · the NOISE FLOOR: run it on two arms that differ in nothing and this is what you get anyway
 *
 * READING RULE, and it is the point of the tool: a delta smaller than the noise floor is UNMEASURED,
 * not small. Four of A_75's five findings rest on this proxy; do not let a sub-floor number become a
 * fifth.
 *
 *   node scripts/read-matched-pair.mjs <armA.md> <armB.md>
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const guard = join(ROOT, "packages/prose-guard/dist/machine-register.js");
if (!existsSync(guard)) { console.error("\n  build @cml/prose-guard first\n"); process.exit(1); }
const { machineRegisterRate } = await import(pathToFileURL(guard).href);
const { measureVoice } = await import(pathToFileURL(join(ROOT, "packages/prose-guard/dist/voice-spec.js")).href);

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error("\n  usage: node scripts/read-matched-pair.mjs <armA.md> <armB.md>\n");
  process.exit(1);
}

const chaptersOf = (f) => readFileSync(f, "utf8").split(/^##\s+/m).slice(1);
const A = chaptersOf(a), B = chaptersOf(b);

if (A.length !== B.length) {
  console.log(`\n  WARNING: arm A has ${A.length} chapters, arm B has ${B.length}.`);
  console.log(`  A pair whose chapter COUNTS differ is not matched — the upstream was not held constant,`);
  console.log(`  or one arm split a chapter. Pairing below is by index and the result is not trustworthy.\n`);
}

const n = Math.min(A.length, B.length);
const rows = [];
for (let i = 0; i < n; i += 1) {
  const ra = machineRegisterRate(A[i], 3);
  const rb = machineRegisterRate(B[i], 3);
  if (ra.sentences < 15 || rb.sentences < 15) continue;
  rows.push({
    ch: i + 1,
    a: ra.rate * 100,
    b: rb.rate * 100,
    d: (rb.rate - ra.rate) * 100,
    wa: A[i].split(/\s+/).length,
    wb: B[i].split(/\s+/).length,
  });
}

const mean = (xs) => xs.reduce((x, y) => x + y, 0) / (xs.length || 1);
const sd = (xs) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

const ds = rows.map((r) => r.d);
const md = mean(ds), sdd = sd(ds);
const t = sdd > 0 ? md / (sdd / Math.sqrt(ds.length)) : 0;

console.log(`\n  MATCHED PAIR — per-chapter register rate (lower is better)\n`);
console.log(`    arm A: ${a}`);
console.log(`    arm B: ${b}\n`);
console.log(`      ch    A%      B%     diff     words A/B`);
for (const r of rows) {
  const mark = Math.abs(r.d) >= 2 ? (r.d < 0 ? "  <- B better" : "  <- B worse") : "";
  console.log(`      ${String(r.ch).padStart(2)}  ${r.a.toFixed(2).padStart(6)}  ${r.b.toFixed(2).padStart(6)}  ${r.d.toFixed(2).padStart(7)}   ${String(r.wa).padStart(5)}/${String(r.wb).padEnd(5)}${mark}`);
}

const bookA = machineRegisterRate(readFileSync(a, "utf8"), 3).rate * 100;
const bookB = machineRegisterRate(readFileSync(b, "utf8"), 3).rate * 100;

console.log(`\n    paired mean difference : ${md.toFixed(2)} points  (negative = arm B less abstract)`);
console.log(`    sd of differences      : ${sdd.toFixed(2)}   n=${ds.length}`);
console.log(`    paired t               : ${t.toFixed(2)}   ${Math.abs(t) > 2.26 ? "SIGNIFICANT at n=10" : "not significant"}`);
console.log(`\n    whole-book register    : A ${bookA.toFixed(2)}%   B ${bookB.toFixed(2)}%   diff ${(bookB - bookA).toFixed(2)}`);
console.log(`    sentence mean          : A ${measureVoice(readFileSync(a, "utf8")).mean.toFixed(2)}   B ${measureVoice(readFileSync(b, "utf8")).mean.toFixed(2)}`);

/**
 * The detectable effect at this n, from the pair's OWN spread. Stated so a null can be read
 * correctly: "we could not have seen an effect this small" is a different statement from
 * "there was no effect".
 */
const mde = ds.length > 1 ? 2.8 * (sdd / Math.sqrt(ds.length)) : Infinity;
console.log(`\n    minimum detectable effect at 80% power, n=${ds.length}: ${mde.toFixed(2)} points`);
if (Math.abs(md) < mde) {
  console.log(`    -> the observed ${md.toFixed(2)} is BELOW that. Report as UNMEASURED, not as "no effect".`);
}
console.log("");
