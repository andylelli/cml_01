#!/usr/bin/env node
/**
 * Does the false-time device's own arithmetic work — and would a fallback that reads the duration
 * from the MECHANISM TEXT (rather than only from a locked fact) fire too often to be usable?
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────────
 *
 * `checkCaseTimelineDeception` catches a device whose numbers disagree, and it reaches Agent 4's
 * revision loop pre-prose at the cheap end of the pipeline. It needs TWO parseable clocks and ONE
 * parseable duration. Its two branches read the clocks from locked facts, or (X61) from the
 * mechanism's apparent/actual pair — but BOTH branches require the DURATION to be a locked fact.
 *
 * On `canary_1787512796199` the duration is not a locked fact. It is stated four times in free text
 * ("the hourglass takes twenty minutes for all sand to flow"), while the mechanism names apparent
 * 10:45 and actual 11:10 — a 25-minute gap against a 20-minute device. The check returned ZERO
 * violations. Geometry caught the same defect at Agent 9, where it can only warn, and BOTH external
 * readers of that case spent their entire review on it. `clues` scored 5 and 7.
 *
 * This measures what a third branch would do across every stored case, because the B1 lesson is that
 * a check firing on most runs is an off switch with extra steps. Run before deciding.
 *
 *   node scripts/mechanism-arithmetic-probe.mjs
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const need = (p) => {
  const f = join(ROOT, p);
  if (!existsSync(f)) { console.error(`\n  build first — ${p} is missing.\n`); process.exit(1); }
  return pathToFileURL(f).href;
};
const { loadArtifactStore, latestArtifact } = await import(need("apps/worker/dist/jobs/artifact-store.js"));
const cmlMod = await import(need("packages/cml/dist/index.js"));
const { parseClockTime, parseDurationMinutes, checkCaseTimelineDeception } = cmlMod;

const rows = loadArtifactStore(ROOT);
const projects = [...new Set(rows.map((r) => r.project_id ?? r.projectId).filter(Boolean))];

/** Minutes between two clock readings on a 12-hour dial, the shorter way round. */
const dialGap = (a, b) => {
  const d = Math.abs(a - b) % 720;
  return Math.min(d, 720 - d);
};

/**
 * The proposed third branch: clocks from the mechanism, duration from the mechanism/device TEXT.
 * Deliberately narrow — it only runs when the case genuinely fakes a time (both anchors parse) and
 * no locked-fact duration was available to the existing branches.
 */
// "ten minutes PAST eleven" is a CLOCK READING, not a duration. Without this lookahead the probe
// extracted 10 alongside the device's real 20, saw two distinct values, and declined — silently
// missing the exact case it was written for. The same failure mode as the check under review,
// reproduced inside the instrument measuring it.
const DURATION_IN_TEXT = /\b(\w+[- ]?\w*)\s+minutes?\b(?!\s+(?:past|to|before|after|till|until)\b)/gi;
const durationFromText = (text) => {
  const found = [];
  for (const m of String(text ?? "").matchAll(DURATION_IN_TEXT)) {
    const mins = parseDurationMinutes(`${m[1]} minutes`);
    if (mins !== null && mins > 0 && mins <= 720) found.push(mins);
  }
  // Only a SINGLE consistent duration counts. Two different ones in the text means the case is
  // describing more than one interval and guessing which is the device's period would be inventing.
  const uniq = [...new Set(found)];
  return uniq.length === 1 ? uniq[0] : null;
};

let cases = 0, alreadyCaught = 0, wouldFire = 0, noShape = 0;
const fires = [];
for (const p of projects) {
  const c = latestArtifact(rows, p, "cml");
  const cb = c?.CASE ?? c;
  if (!cb || typeof cb !== "object") continue;
  cases += 1;

  if (checkCaseTimelineDeception(cb).length > 0) { alreadyCaught += 1; continue; }

  const mech = cb?.hidden_model?.mechanism ?? {};
  const apparent = parseClockTime(mech.apparent_time_of_death);
  const actual = parseClockTime(mech.actual_time_of_death);
  if (apparent === null || actual === null) { noShape += 1; continue; }

  const text = [mech.description, mech.delivery_path, JSON.stringify(cb?.surface_model ?? "")].join(" ");
  const dur = durationFromText(text);
  if (dur === null) { noShape += 1; continue; }

  const gap = dialGap(apparent, actual);
  if (gap !== dur) {
    wouldFire += 1;
    fires.push({ p, apparent: mech.apparent_time_of_death, actual: mech.actual_time_of_death, gap, dur });
  }
}

console.log(`\n  cases with a stored CML            : ${cases}`);
console.log(`  already caught by the two branches : ${alreadyCaught}`);
console.log(`  no readable shape for a third one  : ${noShape}`);
console.log(`  a MECHANISM-TEXT branch would fire : ${wouldFire}`);
console.log(`  firing rate over readable cases    : ${cases ? ((100 * wouldFire) / cases).toFixed(0) : 0}% of all cases\n`);
if (fires.length) {
  console.log(`  the disagreements it would surface, pre-prose:\n`);
  for (const f of fires) {
    console.log(`    ${f.p}`);
    console.log(`      apparent ${JSON.stringify(f.apparent)} vs actual ${JSON.stringify(f.actual)} = ${f.gap} min,`
      + ` device declares ${f.dur} min`);
  }
  console.log("");
}
console.log(`  B1's rule: a check firing on most runs is an off switch with extra steps.`);
console.log(`  Below ~20% it is a gate; above that it is telemetry until the repair path exists.\n`);
