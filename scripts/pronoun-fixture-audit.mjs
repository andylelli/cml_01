#!/usr/bin/env node
// Item 13 fixture audit (A_62 RC-4, spec: ANALYSIS_62/ITEM_13_PRONOUN_DRIFT_SPEC.md).
//
// Runs the canonical drift shapes through the REAL shipped machinery — detectPronounDriftEvents
// (the detector the rubric/story-validation use) AND repairChapterPronouns (the sweep) — and
// prints a catch/miss/repair matrix. MEASURE FIRST: this script decides which of the three gaps
// (detector recall, detector precision, repair coverage) actually exist before any code changes.
//
// Usage: node scripts/pronoun-fixture-audit.mjs

import path from "path";

const root = process.cwd();
const sv = await import(
  "file:///" + path.join(root, "packages", "story-validation", "dist", "index.js").replace(/\\/g, "/")
);
const { detectPronounDriftEvents, repairPronouns } = sv;

const CAST = [
  { name: "Eleanor Voss", gender: "female", role: "detective" },
  { name: "Captain Ivor Hale", gender: "male", role: "suspect" },
  { name: "Hugo Vane", gender: "male", role: "suspect" },
  { name: "Beatrice Quill", gender: "female", role: "suspect" },
  { name: "Sylvia Trent", gender: "female", role: "suspect" },
  { name: "Dr. Mallory Finch", gender: "female", role: "victim" },
];

// [id, expectDetect, text]
const FIXTURES = [
  // ── true positives: the spec's canonical drift shapes — the detector SHOULD fire ──
  ["TP1 beat-mismatch", true, "Captain Hale tightened her jaw and looked away."],
  ["TP2 alibi-drift", true, "Captain Hale's alibi proved she could not have been near the room."],
  ["TP3 investigator-masc", true, "Eleanor Voss studied the tide tables. He pressed on toward the shore, his gaze fixed."],
  ["TP4 cross-beat-mix", true, "Captain Hale did not answer at once. Her hand tightened around the back of the chair."],
  ["TP5 nearest-name-capture", true, "Sylvia Trent weighed the letter carefully. His loyalty to Hugo wavered with every line."],
  // ── precision fixtures: must NOT fire ──
  ["FP1 legit-referent", false, "Eleanor watched Hugo. He looked away."],
  ["FP2 unnamed-role", false, "As Eleanor spoke, the night porter stepped forward, clearing his throat."],
  ["AMB group-ambiguity", false, "Eleanor watched Hugo and Sylvia. He looked away."],
];

console.log("=== DETECTOR: detectPronounDriftEvents (per-fixture, in isolation) ===");
let tpCaught = 0, tpTotal = 0, fpFired = 0, fpTotal = 0;
for (const [id, expect, text] of FIXTURES) {
  const events = detectPronounDriftEvents(text, CAST);
  const fired = events.length > 0;
  const ok = fired === expect;
  if (expect) { tpTotal++; if (fired) tpCaught++; } else { fpTotal++; if (fired) fpFired++; }
  console.log(
    `${ok ? "  OK " : "  ✗✗ "} ${id.padEnd(26)} expect=${expect ? "FIRE " : "quiet"} got=${fired ? "FIRE " : "quiet"}` +
    (fired ? `  [${events.map((e) => `${e.kind}:${e.characterName}`).join(", ")}]` : ""),
  );
}
console.log(`  recall ${tpCaught}/${tpTotal} on drift shapes | false fires ${fpFired}/${fpTotal} on clean shapes`);

console.log("\n=== REPAIR: repairPronouns (does the sweep fix each TP?) ===");
for (const [id, expect, text] of FIXTURES) {
  if (!expect) continue;
  try {
    const res = repairPronouns(text, CAST);
    const changed = res.text !== text;
    console.log(`  ${id.padEnd(26)} repaired=${changed}${changed ? `\n      -> ${res.text}` : "  (UNTOUCHED — the sweep misses this shape)"}`);
  } catch (err) {
    console.log(`  ${id.padEnd(26)} REPAIR THREW: ${String(err).slice(0, 100)}`);
  }
}
console.log("\nRead: detector recall gaps → detector work; untouched TPs → repair work; FP fires → precision work. Fix ONLY what this table indicts.");
