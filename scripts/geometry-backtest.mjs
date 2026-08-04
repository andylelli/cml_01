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

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { deriveStoryGeometry, checkManuscriptGeometry } from "../packages/story-geometry/dist/index.js";
import { checkCaseTimelineDeception, parseClockTime } from "../packages/prompts-llm/dist/timeline-deception.js";

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

/** Pull the JSON payload out of a `## Response Body` record. */
const responseJson = (path) => {
  const text = readFileSync(path, "utf8");
  const marker = text.indexOf("## Response Body");
  if (marker < 0) return null;
  const fenced = text.slice(marker).match(/```(?:text|json)?\n([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text.slice(marker + "## Response Body".length);
  const start = body.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(body.slice(start));
  } catch {
    return null;
  }
};

const responsesFor = (runDir, agentPattern) =>
  readdirSync(runDir)
    .filter((f) => f.endsWith("_response.md") && agentPattern.test(f))
    .sort((a, b) => Number(a.split("_")[0]) - Number(b.split("_")[0]))
    .map((f) => ({ file: f, parsed: responseJson(join(runDir, f)) }))
    .filter((r) => r.parsed);

/** The LAST response from an agent — retries and revisions supersede earlier attempts. */
const lastResponseFor = (runDir, agentPattern) => {
  const all = responsesFor(runDir, agentPattern);
  return all.length > 0 ? all[all.length - 1] : { parsed: null, file: null };
};

/**
 * Which Agent-7 attempt actually SHIPPED — matched against the manuscript, not assumed.
 *
 * FOUND BY THIS BACKTEST, and it is a finding in its own right. "The last attempt wins" is wrong:
 * on run 1654, Agent 7 produced three outlines (10 beats, then 10 with a duplicated `revelation`,
 * then 9) and the manuscript matches the FIRST. On run 1818 it produced two and the manuscript
 * matches the SECOND. The prompt record does not state which candidate the pipeline kept — a later
 * attempt can be scored worse and discarded — so the only honest reconstruction is to match chapter
 * count and titles against the text that shipped.
 *
 * That gap matters beyond this script: any A/B replay that hydrates "the outline" from these
 * artifacts by taking the last response is replaying an outline the run never used.
 */
const shippedOutline = (runDir, manuscript) => {
  const candidates = responsesFor(runDir, /Agent7-NarrativeFormatter/);
  if (candidates.length === 0) return { parsed: null, file: null, match: null };
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const chapterTitles = manuscript.chapters.map((c) => norm(c.title));
  const scored = candidates.map((candidate) => {
    const scenes = (candidate.parsed.acts ?? []).flatMap((a) => (Array.isArray(a.scenes) ? a.scenes : []));
    const countMatch = scenes.length === manuscript.chapters.length;
    const titleHits = scenes.filter((s, i) => {
      const t = norm(s?.title);
      return t && chapterTitles[i] && (chapterTitles[i].includes(t) || t.includes(chapterTitles[i]));
    }).length;
    return { ...candidate, scenes: scenes.length, countMatch, titleHits };
  });
  scored.sort((a, b) => (b.countMatch ? 1 : 0) - (a.countMatch ? 1 : 0) || b.titleHits - a.titleHits);
  const best = scored[0];
  return {
    parsed: best.parsed,
    file: best.file,
    match: { attempts: scored.length, scenes: best.scenes, titleHits: best.titleHits, of: manuscript.chapters.length },
  };
};

/**
 * Split a saved story into chapters and paragraphs.
 *
 * Deliberately reads the SHIPPED markdown rather than any intermediate: the acceptance test's whole
 * claim is about the text a reader receives, after every regen, injector and sweep has run.
 */
const readManuscript = (storyDir) => {
  const file = readdirSync(storyDir).find((f) => f.endsWith(".md"));
  if (!file) return { chapters: [], title: null };
  const text = readFileSync(join(storyDir, file), "utf8");
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  const chapters = [];
  const re = /^##\s+Chapter\s+(\d+)\s*:?\s*(.*)$/gm;
  const marks = [...text.matchAll(re)];
  marks.forEach((mark, i) => {
    const body = text.slice(mark.index + mark[0].length, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p && p !== "---");
    chapters.push({ chapterNumber: Number(mark[1]), title: mark[2].trim(), paragraphs });
  });
  return { chapters, title, file };
};

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
  });

  const acceptance = checkManuscriptGeometry(geometry, manuscript.chapters, { parseClockTime });

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
  const satisfied = a.checks.filter((c) => c.satisfied).length;
  console.log(`\n  ACCEPTANCE (against the shipped manuscript)  → ${satisfied}/${a.checks.length} checks satisfied, ${a.violations.length} violation(s)`);
  for (const v of a.violations) {
    console.log(`    ✗ ${v.code}${v.chapter ? ` [ch${v.chapter}]` : " [manuscript]"}`);
    console.log(`        ${v.message}`);
    if (v.paragraphIndices?.length) console.log(`        paragraphs: ${v.paragraphIndices.join(", ")}`);
  }
  if (a.extraTimes.length > 0) {
    console.log(`    times on the page that are neither anchor:`);
    for (const t of a.extraTimes) console.log(`        ch${t.chapter}  "${t.phrase}"`);
  }
  if (VERBOSE) {
    console.log(`\n  ALL CHECKS`);
    for (const c of a.checks) {
      console.log(`    ${c.satisfied ? "✓" : "✗"} ${c.code}${c.chapter ? ` [ch${c.chapter}]` : ""}`);
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
  { name: "three clock times", hit: lowCodes.has("third_time") },
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
