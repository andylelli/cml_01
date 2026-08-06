#!/usr/bin/env node
/**
 * Phase-1 validation for Agent 7.5 (architecture/GEOMETRY-AGENT-DESIGN.md §10).
 *
 * THE ACCEPTANCE CRITERION, in the design's own words:
 *
 *   "A geometry compiler that does not flag 'three clock times', 'chapter 9 never discloses', and
 *    'chapter 10 repeats chapter 9' on those two files is not ready for phase 2 — and that test
 *    costs nothing."
 *
 * The unit tests in `@cml/story-geometry` assert that against RECONSTRUCTIONS of those defect
 * shapes. This runs it against the real thing: the frozen CML, the shipped clue set, the shipped
 * outline and the shipped manuscript of the two 2026-08-02 runs, one of which two external reviewers
 * scored 80 and the other 68.
 *
 * WHY BOTH STORIES MATTER, and why the 80 is the harder test. A detector that fires on the 68 has
 * proved nothing on its own — it also has to stay QUIET on the story a reviewer had few complaints
 * about. A checker that flags everything is noise, and noise is what would ship the moment
 * `AGENT9_GEOMETRY_ACCEPTANCE=apply` is enabled.
 *
 * No LLM call, no run, no cost. Reads what is already on disk.
 *
 * Usage:  node scripts/geometry-backtest.mjs [--json] [--verbose]
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { deriveStoryGeometry, checkManuscriptGeometry } from "../packages/story-geometry/dist/index.js";
import { checkCaseTimelineDeception, parseClockTime } from "../packages/prompts-llm/dist/timeline-deception.js";
import { INJECTED_SENTENCE_PATTERNS } from "../packages/prompts-llm/dist/agent9-prose/injection-templates.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const PROMPTS = join(ROOT, "documentation", "prompts", "actual");
const STORIES = join(ROOT, "stories");
const JSON_OUT = process.argv.includes("--json");
const VERBOSE = process.argv.includes("--verbose");

/**
 * The two pairs, and how each was scored externally.
 *
 * The run→story mapping is by title, verified below rather than assumed: the run folder is stamped
 * with the LLM call time and the story folder with the save time, so the numbers do not match and
 * pairing them by timestamp order would be a guess.
 */
const CASES = [
  { run: "run_20260802-1654_mystery", story: "story_20260802-1810", external: 80, label: "the_clockwork_deceit" },
  { run: "run_20260802-1818_mystery", story: "story_20260802-1936", external: 68, label: "the_clock_s_deception" },
];

// ── reading the artifacts ────────────────────────────────────────────────────
// Extracted to `corpus-artifacts.mjs` 2026-08-06: M1b's re-scorer needs the same four readers, and a
// second copy of `shippedOutline` is exactly the defect this script exists to report on.

// ── the backtest ─────────────────────────────────────────────────────────────

const results = [];

for (const testCase of CASES) {
  const runDir = join(PROMPTS, testCase.run);
  const storyDir = join(STORIES, testCase.story);
  if (!existsSync(runDir) || !existsSync(storyDir)) {
    results.push({ ...testCase, error: `missing ${!existsSync(runDir) ? runDir : storyDir}` });
    continue;
  }

  // Agent 4 revises the CML in place when it runs, so it supersedes Agent 3's draft.
  const revision = lastResponseFor(runDir, /Agent4-Revision/);
  const generated = lastResponseFor(runDir, /Agent3-CMLGenerator/);
  const cml = revision.parsed ?? generated.parsed;
  const clueDoc = lastResponseFor(runDir, /Agent5-ClueExtraction/).parsed;
  const deviceDoc = lastResponseFor(runDir, /Agent3b-HardLogicDeviceGenerator/).parsed;
  const manuscript = readManuscript(storyDir);
  const outlinePick = shippedOutline(runDir, manuscript);
  const outline = outlinePick.parsed;

  if (!cml || !outline) {
    results.push({ ...testCase, error: `could not read ${!cml ? "CML" : "outline"} from ${testCase.run}` });
    continue;
  }

  const caseData = cml.CASE ?? cml;
  // Pairing check: the CML's own title against the manuscript's. A mispaired run would produce
  // violations that look devastating and mean nothing.
  const cmlTitle = String(caseData?.meta?.title ?? "").trim();
  const titlesAgree =
    cmlTitle && manuscript.title
      ? manuscript.title.toLowerCase().replace(/[^a-z]/g, "").includes(cmlTitle.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12))
      : false;

  const geometry = deriveStoryGeometry({
    cml,
    clues: Array.isArray(clueDoc?.clues) ? clueDoc.clues : [],
    narrative: outline,
    timelineViolations: checkCaseTimelineDeception(caseData).map((v) => ({ code: v.code, message: v.message })),
    // FOUND ON REVIEW 2026-08-06 — N2 WAS NOT BEING EXERCISED HERE AT ALL.
    //
    // Without these, `accountedTimes` is empty on every case, so `unaccounted_time` behaves exactly
    // like the `third_time` rule it replaced and this backtest silently reports the OLD detector's
    // verdicts. §10.2's stated proof — the 08-04 run dropping from 2 extras to 1, losing only the
    // timer setting — cannot come from a run of this script. The registry the pipeline builds is
    // Agent 3b's primary device (agent3b-run.ts), so that is what is reconstructed here.
    lockedFacts: lockedFactsFrom(deviceDoc),
  });

  // And the same omission on the other side: without the templates NO check can return
  // `met_by_injection` (types.ts), so the corpus probe was structurally incapable of seeing N1 — the
  // verdict this review exists to have introduced. Imported from the injectors, never re-typed.
  const acceptance = checkManuscriptGeometry(geometry, manuscript.chapters, {
    parseClockTime,
    injectionTemplates: INJECTED_SENTENCE_PATTERNS,
  });

  results.push({
    ...testCase,
    titlesAgree,
    cmlTitle,
    manuscriptTitle: manuscript.title,
    outlinePick: { file: outlinePick.file, ...outlinePick.match },
    outlineChapters: geometry.chapterCount,
    manuscriptChapters: manuscript.chapters.length,
    beats: (outline.acts ?? []).flatMap((a) => (a.scenes ?? []).map((s) => s.beat ?? null)),
    geometry,
    acceptance,
  });
}

// ── report ───────────────────────────────────────────────────────────────────

if (JSON_OUT) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

const bar = "═".repeat(78);
console.log(`\n${bar}\nAGENT 7.5 — PHASE 1 BACKTEST against the 2026-08-02 pair\n${bar}`);

for (const r of results) {
  console.log(`\n\n── ${r.label}  (external ${r.external}/100) ${"─".repeat(Math.max(0, 40 - r.label.length))}`);
  if (r.error) {
    console.log(`  ERROR: ${r.error}`);
    continue;
  }
  console.log(`  run       ${r.run}`);
  console.log(`  story     ${r.story}`);
  console.log(`  pairing   CML title "${r.cmlTitle}" vs manuscript "${r.manuscriptTitle}" → ${r.titlesAgree ? "AGREE" : "*** MISMATCH — treat everything below as suspect ***"}`);
  console.log(`  outline   ${r.outlinePick.file}  (${r.outlinePick.attempts} Agent-7 attempt(s); ${r.outlinePick.titleHits}/${r.outlinePick.of} chapter titles match)`);
  console.log(`  chapters  outline ${r.outlineChapters} · manuscript ${r.manuscriptChapters}`);
  console.log(`  beats     ${r.beats.map((b) => b ?? "—").join(" → ")}`);

  const g = r.geometry;
  console.log(`\n  CONTRACT`);
  console.log(`    time model        apparent=${g.timeModel.apparentTime ?? "—"}  true=${g.timeModel.trueTime ?? "—"}`);
  console.log(`    method signature  ${g.methodSignature ? `${g.methodSignature.method} @ch${g.methodSignature.plantChapter} [${g.methodSignature.keyTerms.join(", ") || "no checkable terms"}]` : "— none"}`);
  console.log(`    clincher          ${g.clincher ? `${g.clincher.clueId ?? "unmapped"} @ch${g.clincher.plantByChapter}→ch${g.clincher.payoffChapter}: ${g.clincher.trace.slice(0, 60)}` : "— none"}`);
  console.log(`    false solution    accuses ${g.falseSolution.accused ?? "—"} (culprit ${g.culprit ?? "—"}) proposed ch${g.falseSolution.proposedChapter ?? "—"}`);
  console.log(`    chapter contract  ${g.chapterContract.map((c) => `${c.chapter}:${c.role}`).join(", ")}`);

  console.log(`\n  CLOSURE (against the outline, pre-prose)  → ${g.closure.closed ? "CLOSED" : `NOT CLOSED (${g.closure.unmet.length})`}`);
  for (const u of g.closure.unmet) {
    console.log(`    ✗ ${u.field}/${u.code}${u.repairable ? " (repairable)" : ""}`);
    console.log(`        ${u.message}`);
  }
  for (const w of g.closure.waived) console.log(`    ~ ${w.field} waived — ${w.reason}`);

  const a = r.acceptance;
  // FOUND ON REVIEW 2026-08-06. This read `c.satisfied`, which N1 REPLACED with `verdict` — so it
  // was counting `undefined` and printing "0/11 satisfied" next to 6 violations on every run since.
  // A summary line that cannot go above zero is the same defect as a zero that is never written.
  const met = a.checks.filter((c) => c.verdict === "met").length;
  const byInjection = a.checks.filter((c) => c.verdict === "met_by_injection").length;
  console.log(
    `\n  ACCEPTANCE (against the shipped manuscript)  → ${met}/${a.checks.length} checks met` +
      `${byInjection > 0 ? ` (+${byInjection} MET BY INJECTION — the pipeline's own sentence)` : ""}, ` +
      `${a.violations.length} violation(s)`,
  );
  const d = a.manuscriptDisclosure;
  const disclosure = !d
    ? "UNANSWERABLE — the case names no culprit to look for"
    : d.verdict === "unmet"
      ? "NOWHERE"
      : `${d.verdict} @ch${d.chapter}`;
  console.log(
    `    manuscript names its culprit: ${disclosure}` +
      `${g.closure.revealBindingUncertain ? "   [N4: reveal contract may be bound to the wrong chapter]" : ""}`,
  );
  for (const v of a.violations) {
    console.log(`    ✗ ${v.code}${v.chapter ? ` [ch${v.chapter}]` : " [manuscript]"}`);
    console.log(`        ${v.message}`);
    if (v.paragraphIndices?.length) console.log(`        paragraphs: ${v.paragraphIndices.join(", ")}`);
  }
  if (a.extraTimes.length > 0) {
    console.log(`    times on the page that nothing accounts for:`);
    for (const t of a.extraTimes) console.log(`        ch${t.chapter}  "${t.phrase}"`);
  }
  // N2 is only visible if the accounted set is printed: an empty one means the locked facts never
  // arrived, and the check has silently reverted to "exactly two times".
  console.log(
    `    accounted times (locked facts): ${g.timeModel.accountedTimes?.length ? g.timeModel.accountedTimes.join(", ") : "— none"}`,
  );
  if (VERBOSE) {
    console.log(`\n  ALL CHECKS`);
    for (const c of a.checks) {
      const mark = c.verdict === "met" ? "✓" : c.verdict === "met_by_injection" ? "⊘" : "✗";
      console.log(`    ${mark} ${c.code}${c.chapter ? ` [ch${c.chapter}]` : ""}`);
    }
  }
}

// ── the criterion, stated as a verdict ───────────────────────────────────────

const low = results.find((r) => r.external === 68 && !r.error);
const high = results.find((r) => r.external === 80 && !r.error);

console.log(`\n\n${bar}\nVERDICT — the §10 criterion\n${bar}`);
if (!low || !high) {
  console.log("  Could not evaluate: one or both cases failed to load.");
  process.exit(1);
}

const codes = (r) => new Set(r.acceptance.violations.map((v) => v.code));
const lowCodes = codes(low);
const highCodes = codes(high);
const closureCodes = (r) => new Set(r.geometry.closure.unmet.map((u) => u.code));

const criteria = [
  { name: "three clock times", hit: lowCodes.has("unaccounted_time") },
  { name: "chapter 9 never discloses", hit: lowCodes.has("reveal_culprit_not_named") },
  {
    name: "chapter 10 repeats chapter 9",
    hit: highCodes.has("aftermath_repeat") || lowCodes.has("aftermath_repeat"),
  },
];
for (const c of criteria) console.log(`  ${c.hit ? "✓ FLAGGED" : "✗ MISSED  "}  ${c.name}`);

console.log(`\n  Signal separation`);
console.log(`    68-scoring story: ${low.acceptance.violations.length} violation(s), closure ${low.geometry.closure.closed ? "closed" : `${low.geometry.closure.unmet.length} unmet`}`);
console.log(`    80-scoring story: ${high.acceptance.violations.length} violation(s), closure ${high.geometry.closure.closed ? "closed" : `${high.geometry.closure.unmet.length} unmet`}`);
console.log(`    unique to the 68: ${[...lowCodes].filter((c) => !highCodes.has(c)).join(", ") || "(none)"}`);
console.log(`    unique to the 80: ${[...highCodes].filter((c) => !lowCodes.has(c)).join(", ") || "(none)"}`);
console.log(`    closure unique to the 68: ${[...closureCodes(low)].filter((c) => !closureCodes(high).has(c)).join(", ") || "(none)"}`);

const passed = criteria.every((c) => c.hit);
console.log(`\n  ${passed ? "PASS" : "FAIL"} — ${passed ? "the compiler flags all three named defects." : "at least one named defect went unflagged; the compiler is not ready for phase 2."}`);
console.log(`  NOTE: passing this is necessary, not sufficient. A detector that also fires heavily on the`);
console.log(`  80-scoring story is noise, and would ship as noise the moment acceptance moves to apply.\n`);
