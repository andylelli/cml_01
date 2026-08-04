#!/usr/bin/env node
/**
 * The readout for the `AGENT3_DEVICE_TIME_BINDING` probe (REVIEW_04 §11.2 B1).
 *
 * THE QUESTION. The pipeline carries two contradictory time models: Agent 3b locks the device's times
 * and the prose injector prints them verbatim; Agent 3 authors
 * `hidden_model.mechanism.{apparent,actual}_time_of_death` from a prompt that has never seen them. On
 * the 2026-08-04 control run the case's two anchors appeared **zero times** in the finished story.
 *
 * WHY THIS IS AN HONEST n=1. Almost nothing about this pipeline is measurable from a single run —
 * chapter count and opening naming dominate any quality comparison. But this probe does not read
 * quality. It reads whether two strings the case declares appear in the text, and whether a
 * deterministic detector still fires. Those are near-binary and near-deterministic, so one run per arm
 * settles it. Anything phrased as "is the story better?" needs the powered matched-pair design and a
 * calibrated judge, and this script deliberately reports neither.
 *
 * Usage:
 *   node scripts/probe-time-binding.mjs                 # every run that has a report + a story
 *   node scripts/probe-time-binding.mjs <runId> [runId] # named runs, control first
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const REPORTS = join(ROOT, "apps", "api", "data", "reports");
const STORIES = join(ROOT, "stories");
const WORKER_LOGS = join(ROOT, "apps", "worker", "logs");
const JSON_OUT = process.argv.includes("--json");
const named = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
};

/** Every report on disk, keyed by runId. */
const findReports = () => {
  const out = new Map();
  if (!existsSync(REPORTS)) return out;
  for (const project of readdirSync(REPORTS)) {
    const dir = join(REPORTS, project);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    } catch {
      continue;
    }
    for (const file of files) {
      const report = readJson(join(dir, file));
      if (report?.run_id) out.set(report.run_id, report);
    }
  }
  return out;
};

/** The saved manuscript for a run — matched on the runId the story header carries, never on date. */
const findStory = (runId) => {
  if (!existsSync(STORIES)) return null;
  for (const dir of readdirSync(STORIES)) {
    const storyDir = join(STORIES, dir);
    let files;
    try {
      files = readdirSync(storyDir).filter((f) => f.endsWith(".md"));
    } catch {
      continue;
    }
    for (const file of files) {
      const text = readFileSync(join(storyDir, file), "utf8");
      if (text.includes(runId)) return { text, path: join(dir, file) };
    }
  }
  return null;
};

const diagnostic = (report, key) => {
  const entry = (report?.diagnostics ?? []).find((d) => (d?.key ?? d?.id) === key);
  return entry?.details ?? entry ?? null;
};

/**
 * Fold typographic punctuation before counting — the same fix as `@cml/story-geometry`.
 *
 * The CML holds `"two o’clock"` (curly); the manuscript prints `"two o'clock"` (straight),
 * because prose sanitization normalises smart quotes and the case model never passes through it.
 * Counting raw reported 0x for a time the story states thirteen times, which would have been read as
 * the treatment arm failing.
 */
const fold = (value) =>
  String(value ?? "")
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/ /g, " ");

const countOccurrences = (haystack, needle) => {
  const n = fold(needle).trim();
  if (!n) return 0;
  return fold(haystack).toLowerCase().split(n.toLowerCase()).length - 1;
};

const reports = findReports();
const runIds = named.length > 0 ? named : [...reports.keys()].sort();

const rows = [];
for (const runId of runIds) {
  const report = reports.get(runId);
  if (!report) continue;
  const geometry = diagnostic(report, "agent75_geometry_contract");
  const acceptance = diagnostic(report, "agent9_prose_story_geometry");
  const runWarnings = diagnostic(report, "run_warnings");
  const story = findStory(runId);
  const locked = readJson(join(WORKER_LOGS, `locked-facts-${runId}.json`));
  if (!geometry || !story) continue;

  const text = story.text;
  const apparent = geometry?.time_model?.apparentTime ?? null;
  const actual = geometry?.time_model?.trueTime ?? null;
  const lockedFacts = (locked?.registry ?? []).map((f) => ({
    id: f.id,
    value: f.value,
    hits: countOccurrences(text, f.value),
  }));

  const warnings = runWarnings?.warnings ?? [];

  /**
   * Compute the split HERE rather than trusting the warning.
   *
   * The detector (`checkLockedFactTimeAlignment`) did not exist when the control run executed, so its
   * warning count is 0 on that run for the wrong reason — "not measured" reading as "clean" is the
   * A_70/A_71 defect, and an instrument that inherits it cannot compare a new arm against an old one.
   * The staged locked fact and the case's apparent anchor are both on disk; comparing them directly
   * works on every run, past or future.
   */
  const stagedFact = (locked?.registry ?? []).find((f) =>
    /false_time|displayed|staged|apparent/i.test(`${f.id} ${f.description ?? ""}`),
  );
  const derivedSplit =
    stagedFact && apparent
      ? String(stagedFact.value).trim().toLowerCase() !== String(apparent).trim().toLowerCase()
      : null;

  rows.push({
    stagedFact: stagedFact ? { id: stagedFact.id, value: stagedFact.value } : null,
    derivedSplit,
    runId,
    story: story.path,
    caseAnchors: [
      { label: "apparent_time_of_death", value: apparent, hits: countOccurrences(text, apparent) },
      { label: "actual_time_of_death", value: actual, hits: countOccurrences(text, actual) },
    ],
    lockedFacts,
    splitFindings: warnings.filter((w) => String(w).includes("time-model split")),
    // Present only once the warning-channel fix has been exercised; absent on runs before it.
    agent9WarningsPresent: warnings.some((w) => String(w).includes("[Agent 9]")),
    thirdTime: {
      violated: (acceptance?.violations ?? []).some((v) => v.code === "unaccounted_time"),
      extraTimes: acceptance?.extra_times ?? [],
    },
  });
}

if (JSON_OUT) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const bar = "═".repeat(80);
console.log(`\n${bar}\nAGENT3_DEVICE_TIME_BINDING — probe readout\n${bar}`);

for (const r of rows) {
  const bound = r.caseAnchors.every((a) => a.value && a.hits > 0);
  console.log(`\n── ${r.runId}  ${bound ? "[BOUND]" : "[SPLIT]"}`);
  console.log(`   story: ${r.story}`);
  console.log(`   the case's own anchors, counted in the finished manuscript:`);
  for (const a of r.caseAnchors) {
    console.log(`     ${a.hits === 0 ? "✗" : "✓"} ${a.label.padEnd(23)} ${JSON.stringify(a.value ?? "—").padEnd(26)} ${a.hits}×`);
  }
  if (r.lockedFacts.length) {
    console.log(`   the device's locked facts, which the injector prints verbatim:`);
    for (const f of r.lockedFacts) {
      console.log(`       ${f.id.padEnd(23)} ${JSON.stringify(f.value).padEnd(26)} ${f.hits}×`);
    }
  }
  const splitLabel =
    r.derivedSplit === null
      ? "cannot compare (no staged locked fact, or no apparent anchor)"
      : r.derivedSplit
        ? `SPLIT — case says ${JSON.stringify(r.caseAnchors[0].value)}, device fixes ${JSON.stringify(r.stagedFact.value)}`
        : "aligned";
  console.log(`   staged time, case vs device : ${splitLabel}`);
  console.log(
    `   detector emitted            : ${r.splitFindings.length}` +
      (r.splitFindings.length === 0 && r.derivedSplit
        ? "  (0 because the detector did not exist on this run — NOT because it was clean)"
        : ""),
  );
  for (const f of r.splitFindings) console.log(`       • ${String(f).slice(0, 150)}`);
  console.log(`   geometry unaccounted_time       : ${r.thirdTime.violated ? `VIOLATED (${r.thirdTime.extraTimes.length} extra)` : "clean"}`);
  console.log(`   [Agent 9] warnings on report : ${r.agent9WarningsPresent ? "yes" : "no — the channel fix has not been exercised on this run"}`);
}

console.log(`\n${bar}\nHOW TO READ IT\n${bar}`);
console.log(`  PASS for the treatment arm requires ALL of:`);
console.log(`    1. both case anchors appear in the manuscript at least once  (they were 0× and 0× on the control)`);
console.log(`    2. staged time aligned — the case's apparent anchor equals the device's locked value`);
console.log(`    3. unaccounted_time no worse than the control arm`);
console.log(`\n  This reads coherence, not quality. It says nothing about whether the story is better,`);
console.log(`  and must not be quoted as if it did — that question needs the calibrated judge.\n`);
