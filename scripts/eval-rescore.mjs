#!/usr/bin/env node
/**
 * M1b (architecture/REVIEW_05.md §13.4) — re-score the calibration corpus with the DETERMINISTIC
 * `noResolution` verdict wired in, then hand `eval:calibrate` the new internals.
 *
 * WHY THIS SCRIPT HAD TO EXIST. §13.4 describes M1b as *"the next step is cheap and falsifiable"*, and
 * nothing on disk performed it. `rubric-score-spike.mjs` scores three SYNTHETIC mysteries to
 * demonstrate the cap engine; `eval-golden.mjs` REPLAYS Agent 9 at £4–8. Neither re-scores an
 * archived manuscript, and neither passes `noResolutionVerdict`. Running either would have produced a
 * number that does not contain the change M1b exists to measure — X12's defect, one directory over.
 *
 * WHAT IT DOES. For each calibration pair that has both a manuscript and a run folder on disk:
 *   1. derive the geometry from the run's own artifacts (CML, clues, locked facts, shipped outline);
 *   2. take `manuscriptDisclosure` — the STORY-level verdict (X11), not the bound chapter's;
 *   3. score the manuscript through the live judge with that verdict supplied;
 *   4. report old internal vs new, and what the cap did.
 *
 * `--dry` does 1–2 and stops: it proves the verdict reaches `scoreStory` without spending anything,
 * which is the check that should precede every paid re-score.
 *
 * Usage:
 *   node scripts/eval-rescore.mjs --dry          free; wiring + verdicts only
 *   node scripts/eval-rescore.mjs                live judge, ~£0.15/story
 *   node scripts/eval-rescore.mjs --write        also update manifest.internalFinal in place
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { deriveStoryGeometry, checkManuscriptGeometry } from "../packages/story-geometry/dist/index.js";
import { checkCaseTimelineDeception, parseClockTime } from "../packages/prompts-llm/dist/timeline-deception.js";
import { INJECTED_SENTENCE_PATTERNS } from "../packages/prompts-llm/dist/agent9-prose/injection-templates.js";
import { createLLMRubricJudge, scoreStory } from "../packages/rubric-score/dist/index.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const MANIFEST = join(ROOT, "eval", "results", "external-read", "manifest.json");
const PROMPTS = join(ROOT, "documentation", "prompts", "actual");
const DRY = process.argv.includes("--dry");
const WRITE = process.argv.includes("--write");
const flagValue = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null;
};

// `.env.local` first, then `.env`, first-wins — the precedence every production loader has had since
// X7. Reading `.env` alone meant scoring against the key the pipeline ignores (REVIEW_05 §20.2).
for (const name of [".env.local", ".env"]) {
  const p = join(ROOT, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const entries = Object.entries(manifest).map(([key, value]) => ({ key, ...value }));

/** The geometry-derived, story-level verdict for one pair, or a stated reason there is none. */
function verdictFor(entry) {
  const storyAbs = join(ROOT, entry.storyPath);
  if (!existsSync(storyAbs)) return { reason: "manuscript not on disk" };

  /**
   * A manuscript with no run artifacts is still re-scorable, and that matters more than the verdict.
   *
   * M1b's finding was that the ledger's internals do not reproduce, which makes the whole corpus
   * stale — a problem that is fixed by re-scoring through today's judge and does NOT need geometry.
   * The four 2026-07-13 stories and the 07-22 probe pre-date prompt archiving (the earliest run
   * folder is 07-24) and their CML is gone from the store, so they get `cml: {}`: prose-derived facts
   * still fire, CML-derived ones cannot. That is recorded per row rather than averaged away.
   */
  const manuscriptOnly = !entry.runFolder || !existsSync(join(PROMPTS, entry.runFolder));
  if (manuscriptOnly) {
    const manuscript = readManuscript(storyAbs);
    if (manuscript.chapters.length === 0) return { reason: "manuscript has no chapters" };
    return {
      manuscript,
      cml: {},
      cmlAvailable: false,
      disclosure: null,
      noResolutionVerdict: null,
      revealBindingUncertain: false,
    };
  }

  const runDir = join(PROMPTS, entry.runFolder);

  const cml = lastResponseFor(runDir, /Agent4-Revision/).parsed ?? lastResponseFor(runDir, /Agent3-CMLGenerator/).parsed;
  if (!cml) return { reason: "no CML in the run folder" };
  const manuscript = readManuscript(storyAbs);
  if (manuscript.chapters.length === 0) return { reason: "manuscript has no chapters" };
  const outline = shippedOutline(runDir, manuscript).parsed;
  if (!outline) return { reason: "no outline in the run folder" };

  const caseData = cml.CASE ?? cml;
  const geometry = deriveStoryGeometry({
    cml,
    clues: lastResponseFor(runDir, /Agent5-ClueExtraction/).parsed?.clues ?? [],
    narrative: outline,
    timelineViolations: checkCaseTimelineDeception(caseData).map((v) => ({ code: v.code, message: v.message })),
    lockedFacts: lockedFactsFrom(lastResponseFor(runDir, /Agent3b-HardLogicDeviceGenerator/).parsed),
  });
  const acceptance = checkManuscriptGeometry(geometry, manuscript.chapters, {
    parseClockTime,
    injectionTemplates: INJECTED_SENTENCE_PATTERNS,
  });

  const disclosure = acceptance.manuscriptDisclosure;
  return {
    manuscript,
    cml,
    cmlAvailable: true,
    disclosure,
    // X11 — null, never false, when the case names no culprit: the question is unanswerable, and a
    // fact nobody could compute must not be reported as a fact.
    noResolutionVerdict: disclosure ? disclosure.verdict === "unmet" : null,
    revealBindingUncertain: geometry.closure.revealBindingUncertain === true,
  };
}

const rows = entries.map((entry) => ({ entry, ...verdictFor(entry) }));

console.log(`\n${"═".repeat(78)}\nM1b — RE-SCORE WITH THE DETERMINISTIC noResolution VERDICT\n${"═".repeat(78)}\n`);
console.log(`  pairs in the calibration manifest : ${entries.length}`);
console.log(`  re-scorable (manuscript + run)    : ${rows.filter((r) => r.manuscript).length}\n`);

for (const row of rows) {
  const { entry } = row;
  const head = `  ${entry.key}  ${entry.bundleId.padEnd(34)}`;
  if (!row.manuscript) {
    console.log(`${head} SKIPPED — ${row.reason}`);
    continue;
  }
  const d = row.disclosure;
  const shown = !row.cmlAvailable
    ? "not assessed — no run artifacts survive for this story"
    : !d
      ? "UNANSWERABLE (no culprit in the case)"
      : d.verdict === "unmet"
        ? "NOWHERE"
        : `${d.verdict} @ch${d.chapter}`;
  console.log(`${head} int ${entry.internalFinal} / ext ${entry.externalFinal}`);
  console.log(`${" ".repeat(38)}discloses: ${shown}`);
  console.log(`${" ".repeat(38)}noResolution supplied: ${row.noResolutionVerdict === null ? "null (not measured)" : row.noResolutionVerdict}`);
  if (row.revealBindingUncertain) {
    console.log(`${" ".repeat(38)}[N4: the reveal contract may be bound to the wrong chapter — this is why the`);
    console.log(`${" ".repeat(38)} verdict is read from the whole manuscript and not from that chapter]`);
  }
}

if (DRY) {
  console.log(`\n  --dry: no judge calls made, nothing spent. Re-run without --dry to score.\n`);
  process.exit(0);
}

// ── live scoring ─────────────────────────────────────────────────────────────

const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";
// X14 — the judge model is pinned separately (R1) and must not fall back to the base deployment
// silently: a calibration scored by a different judge than the one being calibrated is worthless.
const judgeModel = process.env.RUBRIC_JUDGE_MODEL ?? "";
if (!endpoint || !apiKey || !judgeModel) {
  console.error(
    "\n  Missing Azure config. Needs AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY and RUBRIC_JUDGE_MODEL\n" +
      "  (the pinned judge — REVIEW_01 R1). None is defaulted: scoring through a different model than\n" +
      "  the one the ledger was built with invalidates every comparison it feeds.\n",
  );
  process.exit(1);
}

const { AzureOpenAIClient } = await import("../packages/llm-client/dist/index.js");
const client = new AzureOpenAIClient({
  endpoint,
  apiKey,
  defaultModel: judgeModel,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-12-01-preview",
  requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
});
const judge = createLLMRubricJudge(
  async (args) => {
    const res = await client.chat(args);
    return { content: res.content ?? res.text ?? "" };
  },
  { model: judgeModel },
);

console.log(`\n  judge: ${judgeModel}\n${"─".repeat(78)}`);

/**
 * M1c — how much does ONE score wander?
 *
 * Every number this project has ever drawn a conclusion from is a single scoring: the ledger, the
 * 42.9%, the 84.2% that replaced it, every A/B delta in every board. If the judge's total moves by
 * several marks on identical input, all of them carry an error bar nobody has drawn — and a lever
 * whose measured effect is smaller than that bar was never measured at all.
 *
 * Deliberately run on a story whose caps DO NOT fire. A cap clamps the total, which suppresses exactly
 * the variance being measured, so a capped story would report a reassuring number for the wrong
 * reason. `2026-08-02-1810` scored `caps: none`, so its total is the judge's raw marks.
 *
 * Fresh judge call every repeat — the opposite of the memoisation the cap comparison needs.
 */
if (process.argv.includes("--variance")) {
  const key = flagValue("--only") ?? "5";
  const repeats = Number(flagValue("--repeats") ?? 5);
  const row = rows.find((r) => r.entry.key === key);
  if (!row?.manuscript) {
    console.error(`  --variance: entry ${key} is not re-scorable.`);
    process.exit(1);
  }
  const prose = row.manuscript.chapters.map((c) => c.paragraphs.join("\n\n")).join("\n\n");
  const cml = row.cml.CASE ?? row.cml;
  console.log(`  ${repeats}× ${row.entry.bundleId}  (external ${row.entry.externalFinal})\n`);

  const totals = [];
  const perCategory = {};
  for (let i = 0; i < repeats; i += 1) {
    const r = await scoreStory({ prose, cml, judge, noResolutionVerdict: row.noResolutionVerdict });
    totals.push(r.final);
    // `categories` is a CategoryMark[] — {category, mark} — NOT a map. Treating it as one made every
    // spread NaN, which the `> 0` filter then dropped, and the line printed a reassuring
    // "categories that moved: none" beside totals that had moved by six. A vacuous zero, in the
    // reporting of the very run measuring whether numbers can be trusted.
    for (const c of Array.isArray(r.categories) ? r.categories : []) {
      (perCategory[c.category] ??= []).push(c.mark);
    }
    console.log(`    run ${i + 1}   final ${r.final}   raw ${r.rawTotal}   caps: ${r.capsApplied?.join("; ") || "none"}`);
  }

  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  const sd = Math.sqrt(totals.reduce((a, b) => a + (b - mean) ** 2, 0) / totals.length);
  const spread = Math.max(...totals) - Math.min(...totals);
  console.log(`\n    totals   ${totals.join(", ")}`);
  console.log(`    mean     ${mean.toFixed(2)}   sd ${sd.toFixed(2)}   spread ${spread} mark(s)`);

  const noisy = Object.entries(perCategory)
    .map(([cat, marks]) => [cat, Math.max(...marks) - Math.min(...marks)])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);
  console.log(`    categories that moved: ${noisy.length ? noisy.map(([c, s]) => `${c} ±${s}`).join(", ") : "none"}`);

  console.log(
    `\n    READ THIS AGAINST: the corpus bias is -10.57 (sd 4.08) and ranking agreement is 84.2%.\n` +
      `    A spread of ${spread} mark(s) is ${spread >= 4 ? "LARGE ENOUGH TO MATTER" : "small"} next to those numbers,\n` +
      `    and next to the deltas this project's A/B probes are asked to detect.`,
  );
  console.log(`\n  cost: $${client.getCostTracker?.().getTotalCost?.().toFixed?.(4) ?? "n/a"}\n`);
  process.exit(0);
}
/**
 * ONE judge call per story, scored TWICE.
 *
 * The obvious shape — score once with the verdict and compare against the ledger's stored internal —
 * is unattributable. The ledger's number came from a different judge call on a different day, so any
 * delta mixes the cap's effect with the judge's own variance. This document has spent its whole
 * length on numbers that could not be attributed. Memoising the judge makes both scorings read the
 * SAME marks, so the difference between them is the deterministic cap and nothing else.
 *
 * It is the one-lever rule (ADR-0004) applied to a scoring run rather than a pipeline run.
 */
const memoJudge = (inner) => {
  let cached = null;
  return async (req) => (cached ??= await inner(req));
};

const scored = [];
for (const row of rows) {
  if (!row.manuscript) continue;
  const prose = row.manuscript.chapters.map((c) => c.paragraphs.join("\n\n")).join("\n\n");
  const oneCall = memoJudge(judge);
  const cml = row.cml.CASE ?? row.cml;

  // Baseline: the judge unchallenged, which is what the pipeline did before M1.
  const withoutVerdict = await scoreStory({ prose, cml, judge: oneCall, noResolutionVerdict: null });
  // Treatment: the SAME marks, with geometry's story-level verdict supplied.
  const withVerdict = await scoreStory({ prose, cml, judge: oneCall, noResolutionVerdict: row.noResolutionVerdict });

  const ledger = row.entry.internalFinal;
  scored.push({
    key: row.entry.key,
    bundleId: row.entry.bundleId,
    ledger,
    without: withoutVerdict.final,
    after: withVerdict.final,
    result: withVerdict,
  });
  console.log(`  ${row.entry.bundleId}   (ledger ${ledger}, external ${row.entry.externalFinal})${row.cmlAvailable ? "" : "   [prose-only: no CML survives]"}`);
  console.log(`      judge unchallenged   ${withoutVerdict.final}   caps: ${withoutVerdict.capsApplied?.join("; ") || "none"}`);
  console.log(`      + geometry verdict   ${withVerdict.final}   caps: ${withVerdict.capsApplied?.join("; ") || "none"}`);
  console.log(
    `      the verdict is worth ${withVerdict.final - withoutVerdict.final} mark(s)` +
      `   (noResolution as scored: ${withVerdict.facts?.noResolution}; supplied: ${row.noResolutionVerdict})`,
  );
  console.log(
    `      gap to the reader    ${ledger - row.entry.externalFinal} (ledger) → ` +
      `${withVerdict.final - row.entry.externalFinal} (now)\n`,
  );
}

if (WRITE) {
  for (const s of scored) manifest[s.key].internalFinal = s.after;
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\n  manifest updated — ${scored.length} internalFinal value(s). Re-run: npm run eval:calibrate`);
} else {
  console.log(`\n  Not written. Re-run with --write to update the manifest, then npm run eval:calibrate.`);
}
console.log(`  cost this run: $${client.getCostTracker?.().getTotalCost?.().toFixed?.(4) ?? "n/a"}\n`);
