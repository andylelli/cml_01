#!/usr/bin/env node
/**
 * N7 — A REHEARSAL for the reveal repair on the channel that may modify. One chapter, one live model,
 * ~1% of a run (REVIEW_08 §8).
 *
 * WHY THIS AND NOT THE RUN. The 08-07 apply-mode run spent £1.50 to discover that
 * `reveal_culprit_not_named@8` could not be repaired — three attempts, all rejected with
 * `modified_or_dropped_original_paragraph`, because the repair ran on the insertion-only channel and a
 * reveal is not something a chapter can be given one more paragraph of. The plumbing of the fix is
 * proven by fixtures; what is NOT proven is whether a live model, given the SAME chapter, can now
 * clear a bar that also forbids dropping a locked fact, shortening the scene, or introducing any new
 * geometry violation. That is one question, and §33's lesson is that it does not need a whole story:
 * a $0.008 rehearsal stopped a £1.50 run that would have taught nothing.
 *
 * WHAT IT PROVES, AND WHAT IT DOES NOT. It proves the repair path can land on a real defect with a
 * real model, and prints the rewritten paragraph so the trade can be read rather than trusted. It
 * proves nothing about the score — one chapter is not a story, and REVIEW_08 §6's rule stands.
 *
 * DEFAULT TARGET: the 08-07 manuscript that failed, so a green rehearsal is a direct answer to a
 * measured failure rather than to a constructed one.
 *
 * Usage: node --use-system-ca scripts/probe-reveal-repair.mjs [--story <md>] [--run <folder>]
 *                                                             [--chapter N] [--dry]
 *   --dry  detect and report only: no LLM call, no cost.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { checkManuscriptGeometry, deriveStoryGeometry } from "../packages/story-geometry/dist/index.js";
import { runRevealRepairRegenPass } from "../packages/prompts-llm/dist/agent9-prose/regen-integration.js";
import { makeRegenFn } from "../packages/prompts-llm/dist/agent9-prose/regen-llm.js";
import { INJECTED_SENTENCE_PATTERNS } from "../packages/prompts-llm/dist/agent9-prose/injection-templates.js";
import { checkCaseTimelineDeception, parseClockTime } from "../packages/prompts-llm/dist/timeline-deception.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";
import { buildClient } from "../apps/worker/dist/jobs/cli-runtime.js";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const DRY = process.argv.includes("--dry");
const STORY = arg("--story", "stories/story_20260807-1412/the_clock_s_silent_deception.md");
const RUN = arg("--run", "run_20260807-1244_mystery");

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

/** The chapters as the acceptance test wants them, in array order. */
const chapters = manuscript.chapters.map((c) => ({
  chapterNumber: c.chapterNumber,
  title: c.title,
  paragraphs: [...c.paragraphs],
}));
// The same two options the run path passes — `parseClockTime` is required, and the injector
// templates are what stop a pipeline-written sentence certifying itself as a disclosure (X27).
const acceptanceOptions = { parseClockTime, injectionTemplates: INJECTED_SENTENCE_PATTERNS };
const check = (cs) => checkManuscriptGeometry(geometry, cs, acceptanceOptions);

const REVEAL_CODES = new Set(["reveal_culprit_not_named", "reveal_method_absent", "reveal_motive_absent"]);
const before = check(chapters);
const revealViolations = before.violations.filter((v) => REVEAL_CODES.has(v.code) && v.chapter !== null);
const override = Number(arg("--chapter", "")) || null;
const targetNumber = override ?? revealViolations[0]?.chapter ?? null;

console.log(`\n${"═".repeat(78)}\nN7 REHEARSAL — the reveal repair on a channel that may modify\n${"═".repeat(78)}\n`);
console.log(`  story        ${STORY}`);
console.log(`  culprit      ${geometry.culprit}`);
console.log(`  reveal ch    ${geometry.chapterContract.find((c) => c.role === "reveal")?.chapter ?? "-"}`);
console.log(`  violations   ${before.violations.length} → ${JSON.stringify(before.violations.map((v) => `${v.code}@${v.chapter ?? "-"}`))}`);
console.log(`  reveal-family ${revealViolations.length} → ${JSON.stringify(revealViolations.map((v) => `${v.code}@${v.chapter}`))}`);

if (targetNumber === null) {
  console.log(`\n  Nothing in the reveal family to repair — the pass would not run. Pick another story.\n`);
  process.exit(0);
}

const index = chapters.findIndex((c) => Number(c.chapterNumber) === Number(targetNumber));
if (index < 0) {
  console.error(`No chapter ${targetNumber} in ${STORY}`);
  process.exit(1);
}
const target = chapters[index];
const words = (ps) => ps.join(" ").split(/\s+/).filter(Boolean).length;
console.log(`  target       ch${targetNumber} "${target.title}" — ${target.paragraphs.length} paragraphs, ${words(target.paragraphs)} words`);
for (const v of revealViolations.filter((v) => v.chapter === targetNumber)) {
  console.log(`\n    [${v.code}] ${String(v.message).replace(/\s+/g, " ").slice(0, 220)}`);
}

if (DRY) {
  console.log(`\n  --dry: detection only, no LLM call, no cost.\n`);
  process.exit(0);
}

/** The two validators the run path supplies — the REAL detector, and "nothing new, anywhere". */
const validatorForCode = (code) => (candidate) => {
  const probe = chapters.slice();
  probe[index] = candidate;
  const still = check(probe).violations.some((v) => v.code === code && v.chapter === targetNumber);
  return { ok: !still, score: still ? 0 : 100, violations: still ? [`geometry:${code}`] : [] };
};
const key = (v) => `${v.code}@${v.chapter ?? "-"}`;
const baseline = new Set(before.violations.map(key));
const noRegressionValidator = (candidate) => {
  const probe = chapters.slice();
  probe[index] = candidate;
  const introduced = check(probe).violations.map(key).filter((k) => !baseline.has(k));
  return {
    ok: introduced.length === 0,
    score: introduced.length === 0 ? 100 : 0,
    violations: introduced.map((k) => `geometry_introduced:${k}`),
  };
};

/** The Bible slice the regen dereferences. beatSheet empty, exactly as `agent9-run` passes it. */
const bible = {
  facts: (caseData.locked_facts ?? []).map((f) => ({ id: f?.id, value: f?.value })),
  characters: (caseData.cast ?? []).map((c) => ({ name: c?.name, gender: c?.gender })),
  culprits: caseData.culpability?.culprits ?? [],
  beatSheet: [],
};

const client = buildClient(ROOT);
let calls = 0;
// The run path PINS the edit-list channel for this pass; the rehearsal must use the same one or it
// measures a channel the run will not take.
const inner = makeRegenFn({
  client,
  model: process.env.AGENT9_MODEL_REGEN,
  runId: "rehearsal",
  projectId: "rehearsal",
  editList: true,
});
const regen = async (req) => {
  calls += 1;
  console.log(`\n  → regen call ${calls}: ch${req.defect.chapter} (${req.defect.kind}) [edit-list]`);
  return inner(req);
};

const unresolved = [];
const result = await runRevealRepairRegenPass({
  chapter: target,
  defects: revealViolations
    .filter((v) => v.chapter === targetNumber)
    .map((v) => ({
      chapter: targetNumber,
      kind: "missing_resolution",
      detail: v.message,
      obligationRef: `geometry_${v.code}`,
      severity: "hard",
    })),
  bible,
  regen,
  presenceValidatorFor: (defect) => validatorForCode(String(defect.obligationRef ?? "").replace(/^geometry_/, "")),
  noRegressionValidator,
  onUnresolved: (defect, reason) => unresolved.push(`${defect.obligationRef}: ${reason}`),
});

const after = result.chapter.paragraphs ?? [];
const probed = chapters.slice();
probed[index] = result.chapter;
const afterReport = check(probed);

console.log(`\n${"─".repeat(78)}\n  RESULT\n`);
console.log(`  ran            ${result.ran}`);
console.log(`  regen calls    ${calls}`);
console.log(`  repaired       ${(result.repaired ?? []).length} → ${JSON.stringify(result.repaired ?? [])}`);
console.log(`  violations     ${before.violations.length} → ${afterReport.violations.length}  ${JSON.stringify(afterReport.violations.map(key))}`);
console.log(`  words          ${words(target.paragraphs)} → ${words(after)}  (floor is -15%)`);
console.log(`  paragraphs     ${target.paragraphs.length} → ${after.length}`);
for (const u of unresolved) console.log(`  UNRESOLVED     ${u}`);

for (let i = 0; i < Math.max(after.length, target.paragraphs.length); i++) {
  if (after[i] !== target.paragraphs[i]) {
    console.log(`\n  [p${i}] BEFORE:\n    ${String(target.paragraphs[i] ?? "—").replace(/\s+/g, " ").slice(0, 300)}`);
    console.log(`  [p${i}] AFTER:\n    ${String(after[i] ?? "—").replace(/\s+/g, " ").slice(0, 300)}`);
  }
}

console.log(`\n  cost  $${client.getCostTracker?.().getTotalCost?.().toFixed?.(4) ?? "n/a"}\n`);
