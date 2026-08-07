#!/usr/bin/env node
/**
 * A REHEARSAL for the aftermath-repeat regen pass — one chapter, one live model, ~1% of a run.
 *
 * WHY. [REVIEW_07](../architecture/REVIEW_07.md) step 6 buys a full run (~£1.50) to fire the
 * thirteenth regen pass for the first time. Its plumbing is proven by five fixture tests with stub
 * regens; what is NOT proven is whether a live model can satisfy the validator. That is one question,
 * and it does not need a whole story to answer.
 *
 * This drives `runAftermathRepeatRegenPass` against a manuscript already on disk, with a real
 * `RegenFn`, and reports what the pass did. If a model cannot clear the bar, we learn why for pennies
 * instead of discovering it a pound and a half into a run.
 *
 * X19 RAISED THE BAR THIS MEASURES. Sharing the disclosure matcher made the detector honest, and the
 * control's final chapter went from 1 flagged paragraph to 4. The validator wants ALL of them clear,
 * so an UNRESOLVED here means "the bar moved", not "the pass is broken" — read the per-attempt lines.
 *
 * Usage: node --use-system-ca scripts/rehearse-aftermath-regen.mjs [--story <md>] [--run <folder>]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { detectAftermathRepeatParagraphs, deriveStoryGeometry } from "../packages/story-geometry/dist/index.js";
import { runAftermathRepeatRegenPass } from "../packages/prompts-llm/dist/agent9-prose/regen-integration.js";
import { makeRegenFn } from "../packages/prompts-llm/dist/agent9-prose/regen-llm.js";
import { checkCaseTimelineDeception } from "../packages/prompts-llm/dist/timeline-deception.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";
import { buildClient } from "../apps/worker/dist/jobs/cli-runtime.js";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const STORY = arg("--story", "stories/story_20260806-2230/the_pendulum_s_secret_chime.md");
const RUN = arg("--run", "run_20260806-2112_mystery");

for (const name of [".env.local", ".env"]) {
  const p = join(ROOT, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const runDir = join(ROOT, "documentation", "prompts", "actual", RUN);
const cml = lastResponseFor(runDir, /Agent4-Revision/).parsed ?? lastResponseFor(runDir, /Agent3-CMLGenerator/).parsed;
const manuscript = readManuscript(join(ROOT, STORY));
const outline = shippedOutline(runDir, manuscript).parsed;
const caseData = cml.CASE ?? cml;

const geometry = deriveStoryGeometry({
  cml,
  clues: lastResponseFor(runDir, /Agent5-ClueExtraction/).parsed?.clues ?? [],
  narrative: outline,
  timelineViolations: checkCaseTimelineDeception(caseData).map((v) => ({ code: v.code, message: v.message })),
  lockedFacts: lockedFactsFrom(lastResponseFor(runDir, /Agent3b-HardLogicDeviceGenerator/).parsed),
});

const revealChapter = geometry.chapterContract.find((c) => c.role === "reveal")?.chapter ?? 0;
const aftermathNumber =
  geometry.chapterContract.find((c) => c.role === "aftermath")?.chapter ?? manuscript.chapters.length;
const target = manuscript.chapters.find((c) => c.chapterNumber === aftermathNumber);
if (!target) {
  console.error(`No chapter ${aftermathNumber} in ${STORY}`);
  process.exit(1);
}

const methodTerms = geometry.methodSignature?.keyTerms ?? [];
const chapter = { chapterNumber: target.chapterNumber, title: target.title, paragraphs: [...target.paragraphs] };
const flaggedBefore = detectAftermathRepeatParagraphs(chapter.paragraphs, { culprit: geometry.culprit, methodTerms });

const words = (ps) => ps.join(" ").split(/\s+/).filter(Boolean).length;

console.log(`\n${"═".repeat(78)}\nREHEARSAL — aftermath-repeat regen, one chapter, live model\n${"═".repeat(78)}\n`);
console.log(`  story        ${STORY}`);
console.log(`  culprit      ${geometry.culprit}`);
console.log(`  reveal ch    ${revealChapter}      aftermath ch ${aftermathNumber}`);
console.log(`  paragraphs   ${chapter.paragraphs.length}   words ${words(chapter.paragraphs)}`);
console.log(`  FLAGGED      ${flaggedBefore.length} → ${JSON.stringify(flaggedBefore)}`);
if (flaggedBefore.length === 0) {
  console.log(`\n  Nothing to repair — the pass would not run. Pick another story.\n`);
  process.exit(0);
}
for (const i of flaggedBefore) {
  console.log(`\n    [p${i}] ${chapter.paragraphs[i].replace(/\s+/g, " ").slice(0, 200)}…`);
}

/** The Bible slice the regen dereferences. beatSheet is empty, exactly as `agent9-run` passes it. */
const bible = {
  facts: (caseData.locked_facts ?? []).map((f) => ({ id: f?.id, value: f?.value })),
  characters: (caseData.cast ?? []).map((c) => ({ name: c?.name, gender: c?.gender })),
  culprits: caseData.culpability?.culprits ?? [],
  beatSheet: [],
};

const client = buildClient(ROOT);
let calls = 0;
const inner = makeRegenFn({ client, model: process.env.AGENT9_MODEL_REGEN, runId: "rehearsal", projectId: "rehearsal" });
const regen = async (req) => {
  calls += 1;
  console.log(`\n  → regen call ${calls}: ch${req.defect.chapter} p${req.defect.paragraphIndex} (${req.defect.kind})`);
  return inner(req);
};

const unresolved = [];
const result = await runAftermathRepeatRegenPass({
  chapter,
  chapterNumber: aftermathNumber,
  paragraphIndices: flaggedBefore,
  culprit: geometry.culprit,
  methodTerms,
  revealChapter,
  bible,
  regen,
  onUnresolved: (defect, reason) => unresolved.push(`${defect.obligationRef}: ${reason}`),
});

const after = result.chapter.paragraphs ?? [];
const flaggedAfter = detectAftermathRepeatParagraphs(after, { culprit: geometry.culprit, methodTerms });

console.log(`\n${"─".repeat(78)}\n  RESULT\n`);
console.log(`  ran            ${result.ran}`);
console.log(`  regen calls    ${calls}`);
console.log(`  repaired       ${(result.repaired ?? []).length} → ${JSON.stringify(result.repaired ?? [])}`);
console.log(`  flagged        ${flaggedBefore.length} → ${flaggedAfter.length}  ${JSON.stringify(flaggedAfter)}`);
console.log(`  words          ${words(chapter.paragraphs)} → ${words(after)}  (floor is -15%)`);
for (const u of unresolved) console.log(`  UNRESOLVED     ${u}`);

for (const i of flaggedBefore) {
  if (after[i] !== chapter.paragraphs[i]) {
    console.log(`\n  [p${i}] REWRITTEN:\n    ${String(after[i]).replace(/\s+/g, " ").slice(0, 320)}…`);
  }
}

console.log(`\n  cost  $${client.getCostTracker?.().getTotalCost?.().toFixed?.(4) ?? "n/a"}\n`);
