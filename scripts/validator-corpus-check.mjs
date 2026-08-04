#!/usr/bin/env node
/**
 * REVIEW_04 §11.1 A1 — what would the NEW `validateCml` errors do to the runs we already have?
 *
 * WHY THIS EXISTS. The 2026-08-03/04 work made `validateCml` materially stricter: an empty culprit
 * list, a culprit who is the falsely accused / the victim / the detective / cast-ineligible / absent
 * from the cast, a `culprit_count` that disagrees with the names, and both false-time direction
 * violations are now ERRORS. Errors drive Agent 4's revision loop, which costs money and rewrites the
 * CML. **None of them has run live.** Shipping a stricter gate without knowing its firing rate is the
 * unmeasured change this project's own boards argue against.
 *
 * WHAT IT MEASURES, AND WHAT IT CANNOT. `generateCML` runs `normalizeCml` BEFORE `validateCml`, and
 * no archived artifact contains the post-normalization document — the prompt log records the model's
 * raw reply, and every downstream request is a rendered prompt rather than the CML. So this reads the
 * RAW Agent-3/Agent-4 response and splits the result two ways:
 *
 *   INTERCEPTED — codes `normalizeCml` resolves before the validator ever sees them. `culprits is
 *                 empty` is the whole of this class: normalization always fills the list.
 *   LIVE        — codes that survive normalization and therefore reach Agent 4 on a real run.
 *
 * For the empty-culprit runs it also models what the CURRENT fallback would choose (prefer a cast
 * member marked guilty → `culprit_eligibility: "locked"` → an eligible suspect who is NOT the falsely
 * accused). That is MODELLED, not executed — stated so nobody reads it as a measurement.
 *
 * Usage:  node scripts/validator-corpus-check.mjs [--json]
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

import { validateCml } from "../packages/cml/dist/index.js";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const PROMPTS = join(ROOT, "documentation", "prompts", "actual");
const JSON_OUT = process.argv.includes("--json");

/** The error codes this session added. Everything else validateCml reports is pre-existing. */
const NEW_ERROR_MATCHERS = [
  { code: "culprits_empty", intercepted: true, re: /culpability\.culprits is empty/ },
  { code: "accused_is_culprit", intercepted: false, re: /accused_suspect is ".*", who is the culprit/ },
  { code: "culprit_not_in_cast", intercepted: false, re: /who is not in CASE\.cast/ },
  { code: "culprit_is_victim", intercepted: false, re: /who is the victim/ },
  { code: "culprit_is_detective", intercepted: false, re: /who is the detective/ },
  { code: "culprit_ineligible", intercepted: false, re: /culprit_eligibility is "ineligible"/ },
  { code: "culprit_count_mismatch", intercepted: false, re: /culprit_count is \d+ but/ },
  { code: "timeline_apparent_not_covered", intercepted: false, re: /\(apparent_not_covered\)/ },
  { code: "timeline_actual_covered", intercepted: false, re: /\(actual_covered\)/ },
  { code: "timeline_times_identical", intercepted: false, re: /\(times_identical\)/ },
];

const responseJson = (path) => {
  const text = readFileSync(path, "utf8");
  const marker = text.indexOf("## Response Body");
  if (marker < 0) return null;
  const fenced = text.slice(marker).match(/```(?:text|json)?\n([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text.slice(marker);
  const start = body.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(body.slice(start));
  } catch {
    return null;
  }
};

/** The last CML any agent produced in this run: Agent 4's revision supersedes Agent 3's draft. */
const cmlForRun = (dir) => {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith("_response.md") && /Agent(3-CMLGenerator|4-Revision)/.test(f))
    .sort((a, b) => Number(a.split("_")[0]) - Number(b.split("_")[0]));
  for (let i = files.length - 1; i >= 0; i -= 1) {
    const parsed = responseJson(join(dir, files[i]));
    if (parsed?.CASE || parsed?.cast) return { cml: parsed, file: files[i] };
  }
  return { cml: null, file: null };
};

const norm = (v) => String(v ?? "").trim().toLowerCase();

/** MODELLED, not executed: what the current fallback would pick when the model named no culprit. */
const modelFallbackCulprit = (caseBlock) => {
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const accused = norm(caseBlock?.false_solution?.accused_suspect);
  const roleOf = (m) => norm(m?.role_archetype ?? m?.role);
  const eligible = (m, allowAccused) => {
    const name = norm(m?.name);
    if (!name) return false;
    if (roleOf(m).includes("victim") || roleOf(m).includes("detective")) return false;
    if (!allowAccused && accused && name === accused) return false;
    return m?.culprit_eligibility === "eligible" || m?.culprit_eligibility === "locked";
  };
  const pick =
    cast.find((m) => norm(m?.culpability) === "guilty" && eligible(m, true)) ??
    cast.find((m) => m?.culprit_eligibility === "locked" && eligible(m, true)) ??
    cast.find((m) => eligible(m, false)) ??
    cast.find((m) => eligible(m, true));
  return pick ? String(pick.name) : null;
};

const runs = existsSync(PROMPTS)
  ? readdirSync(PROMPTS).filter((d) => existsSync(join(PROMPTS, d, ".actual-run-state.json")) || existsSync(join(PROMPTS, d)))
  : [];

const results = [];
for (const runDir of runs) {
  const dir = join(PROMPTS, runDir);
  let cmlEntry;
  try {
    cmlEntry = cmlForRun(dir);
  } catch {
    continue;
  }
  if (!cmlEntry.cml) continue;

  const errors = validateCml(cmlEntry.cml).errors;
  const fired = NEW_ERROR_MATCHERS.filter((m) => errors.some((e) => m.re.test(e)));
  const caseBlock = cmlEntry.cml.CASE ?? cmlEntry.cml;
  const culprits = (caseBlock?.culpability?.culprits ?? []).map(String).filter(Boolean);

  results.push({
    run: runDir,
    source: cmlEntry.file,
    totalErrors: errors.length,
    fired: fired.map((f) => f.code),
    live: fired.filter((f) => !f.intercepted).map((f) => f.code),
    intercepted: fired.filter((f) => f.intercepted).map((f) => f.code),
    culpritsDeclared: culprits,
    modelledFallback: culprits.length === 0 ? modelFallbackCulprit(caseBlock) : null,
    accused: String(caseBlock?.false_solution?.accused_suspect ?? "").trim() || null,
  });
}

if (JSON_OUT) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

const bar = "═".repeat(84);
console.log(`\n${bar}\nA1 — the new validateCml errors, against ${results.length} archived run(s)\n${bar}`);
console.log(`\nSubstrate: the RAW Agent-3/Agent-4 reply. \`normalizeCml\` runs before \`validateCml\` on a`);
console.log(`real run and no archived artifact holds the normalized document, so codes it resolves are`);
console.log(`marked INTERCEPTED and excluded from the live risk count.\n`);

for (const r of results) {
  const label = r.live.length > 0 ? "LIVE" : r.fired.length > 0 ? "(intercepted only)" : "clean";
  console.log(`  ${r.run.padEnd(34)} ${label}`);
  if (r.intercepted.length) console.log(`      intercepted: ${r.intercepted.join(", ")}`);
  if (r.live.length) console.log(`      would reach Agent 4: ${r.live.join(", ")}`);
  if (r.modelledFallback) {
    const collides = r.accused && r.modelledFallback === r.accused;
    console.log(
      `      no culprit named → fallback would MODEL "${r.modelledFallback}"` +
        (collides ? `  *** which is the falsely accused ***` : ` (accused: ${r.accused ?? "—"})`),
    );
  }
}

const counts = {};
for (const r of results) for (const c of r.live) counts[c] = (counts[c] ?? 0) + 1;
const withLive = results.filter((r) => r.live.length > 0).length;

console.log(`\n${bar}\nVERDICT\n${bar}`);
console.log(`  runs measured                : ${results.length}`);
console.log(`  runs where a NEW error would reach Agent 4 : ${withLive} (${Math.round((withLive / Math.max(1, results.length)) * 100)}%)`);
console.log(`\n  by code (live only):`);
for (const [code, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(3)}  ${code}`);
}
if (Object.keys(counts).length === 0) console.log("    (none)");

// Count RUNS, not code instances: one case can violate the invariant in BOTH directions, and the
// demotion trigger is phrased "fires on most cases". Summing codes overstates it by exactly that.
const timelineRuns = results.filter((r) => r.live.some((c) => c.startsWith("timeline_"))).length;
const emptyCulpritRuns = results.filter((r) => r.intercepted.includes("culprits_empty")).length;
console.log(
  `\n  runs whose CML never named a culprit: ${emptyCulpritRuns} of ${results.length} ` +
    `(${Math.round((emptyCulpritRuns / Math.max(1, results.length)) * 100)}%) — normalization filled every one`,
);
console.log(`\n  §11.1's demotion trigger: the timeline invariant fires on ${timelineRuns} of ${results.length} runs.`);
console.log(
  timelineRuns > results.length / 2
    ? `  → MOST cases. Demote it to a warning until the two-time-models fix (§11.2 B) lands: it is\n    currently judging anchors the manuscript does not use.`
    : `  → a minority. Keep it as an error; Agent 4 churn is bounded.`,
);
console.log("");
