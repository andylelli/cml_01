#!/usr/bin/env node
/**
 * Apply the aftermath-repeat regen to a SHIPPED manuscript, offline, and write the repaired copy.
 *
 * WHY THIS AND NOT A RUN. A fresh run generates a different story, so its aftermath can only be
 * compared against a different book — the confound that made the N6 rubric delta unreadable
 * ([REVIEW_05 §31.3](../architecture/REVIEW_05.md)). This changes ONLY the flagged aftermath
 * paragraphs of a manuscript an external reader has already scored, so a second cold read isolates
 * the repair completely. Same premise, same cast, same everything else, byte for byte.
 *
 * It is pointed at the reader's own words on the control: *"Chapter 9 repeats the clearances.
 * Chapter 10 repeats the mechanism and clearances again. This is the biggest structural weakness."*
 *
 * `maxAttemptsPerDefect` is left at the pipeline default (2). The question is what the pipeline would
 * actually ship, not what the model could manage with unlimited attempts.
 *
 * Usage: node --use-system-ca scripts/repair-aftermath-offline.mjs [--story <md>] [--run <folder>]
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { detectAftermathRepeatParagraphs, deriveStoryGeometry } from "../packages/story-geometry/dist/index.js";
import { runAftermathRepeatRegenPass } from "../packages/prompts-llm/dist/agent9-prose/regen-integration.js";
import { makeRegenFn } from "../packages/prompts-llm/dist/agent9-prose/regen-llm.js";
import { checkCaseTimelineDeception } from "../packages/prompts-llm/dist/timeline-deception.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";
import { buildClient } from "../apps/worker/dist/jobs/cli-runtime.js";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
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

const storyAbs = join(ROOT, STORY);
const runDir = join(ROOT, "documentation", "prompts", "actual", RUN);
const raw = readFileSync(storyAbs, "utf8");
const cml = lastResponseFor(runDir, /Agent4-Revision/).parsed ?? lastResponseFor(runDir, /Agent3-CMLGenerator/).parsed;
const manuscript = readManuscript(storyAbs);
const caseData = cml.CASE ?? cml;

const geometry = deriveStoryGeometry({
  cml,
  clues: lastResponseFor(runDir, /Agent5-ClueExtraction/).parsed?.clues ?? [],
  narrative: shippedOutline(runDir, manuscript).parsed,
  timelineViolations: checkCaseTimelineDeception(caseData).map((v) => ({ code: v.code, message: v.message })),
  lockedFacts: lockedFactsFrom(lastResponseFor(runDir, /Agent3b-HardLogicDeviceGenerator/).parsed),
});

const revealChapter = geometry.chapterContract.find((c) => c.role === "reveal")?.chapter ?? 0;
const aftermathChapters = geometry.chapterContract.filter((c) => c.role === "aftermath").map((c) => c.chapter);
const methodTerms = geometry.methodSignature?.keyTerms ?? [];

console.log(`\n${"═".repeat(78)}\nOFFLINE AFTERMATH REPAIR — same story, only the flagged paragraphs move\n${"═".repeat(78)}\n`);
console.log(`  story      ${STORY}`);
console.log(`  culprit    ${geometry.culprit}`);
console.log(`  reveal     ch${revealChapter}    aftermath bound ${JSON.stringify(aftermathChapters)}\n`);

const bible = {
  facts: (caseData.locked_facts ?? []).map((f) => ({ id: f?.id, value: f?.value })),
  characters: (caseData.cast ?? []).map((c) => ({ name: c?.name, gender: c?.gender })),
  culprits: caseData.culpability?.culprits ?? [],
  beatSheet: [],
};

const client = buildClient(ROOT);
const regen = makeRegenFn({ client, model: process.env.AGENT9_MODEL_REGEN, runId: "offline-repair", projectId: "offline-repair" });

/** original paragraph text -> repaired text, collected across every aftermath chapter. */
const replacements = [];
let totalFlagged = 0;

for (const n of aftermathChapters) {
  const src = manuscript.chapters.find((c) => c.chapterNumber === n);
  if (!src) continue;
  const flagged = detectAftermathRepeatParagraphs(src.paragraphs, { culprit: geometry.culprit, methodTerms });
  totalFlagged += flagged.length;
  console.log(`  ch${n}: ${src.paragraphs.length} paragraphs, ${flagged.length} flagged ${JSON.stringify(flagged)}`);
  if (flagged.length === 0) continue;

  const chapter = { chapterNumber: n, title: src.title, paragraphs: [...src.paragraphs] };
  const unresolved = [];
  const pass = await runAftermathRepeatRegenPass({
    chapter,
    chapterNumber: n,
    paragraphIndices: flagged,
    culprit: geometry.culprit,
    methodTerms,
    revealChapter,
    bible,
    regen,
    onUnresolved: (d, reason) => unresolved.push(`${d.obligationRef}: ${reason}`),
  });
  const after = pass.chapter.paragraphs ?? [];
  const remaining = detectAftermathRepeatParagraphs(after, { culprit: geometry.culprit, methodTerms });
  console.log(`        repaired ${(pass.repaired ?? []).length}, still flagged ${remaining.length} ${JSON.stringify(remaining)}`);
  for (const u of unresolved) console.log(`        UNRESOLVED ${u}`);
  for (let i = 0; i < after.length; i += 1) {
    if (after[i] !== src.paragraphs[i]) replacements.push({ chapter: n, index: i, from: src.paragraphs[i], to: after[i] });
  }
}

if (replacements.length === 0) {
  console.log(`\n  Nothing changed — no repaired manuscript written.\n`);
  process.exit(0);
}

/**
 * Splice the repaired paragraphs back into the RAW markdown.
 *
 * Rebuilding the file from the parsed structure would silently drop anything the parser does not
 * model — front matter, rules, spacing. So the raw text is edited in place: the chapter body is split
 * exactly as `readManuscript` splits it, the nth PARAGRAPH segment (skipping blanks and `---`) is
 * replaced, and everything else is left untouched.
 */
const HEADING = /^##\s+Chapter\s+(\d+)\s*:?\s*(.*)$/gm;
const marks = [...raw.matchAll(HEADING)];
let out = "";
let cursor = 0;
for (let mi = 0; mi < marks.length; mi += 1) {
  const mark = marks[mi];
  const bodyStart = mark.index + mark[0].length;
  const bodyEnd = mi + 1 < marks.length ? marks[mi + 1].index : raw.length;
  const chapterNumber = Number(mark[1]);
  const forThis = replacements.filter((r) => r.chapter === chapterNumber);
  out += raw.slice(cursor, bodyStart);
  cursor = bodyEnd;
  if (forThis.length === 0) { out += raw.slice(bodyStart, bodyEnd); continue; }

  const segments = raw.slice(bodyStart, bodyEnd).split(/(\n\s*\n)/);
  let paraIndex = -1;
  const rebuilt = segments.map((seg) => {
    if (/^\n\s*\n$/.test(seg)) return seg;
    const norm = seg.replace(/\s+/g, " ").trim();
    if (!norm || norm === "---") return seg;
    paraIndex += 1;
    const hit = forThis.find((r) => r.index === paraIndex);
    return hit ? seg.replace(norm, hit.to).replace(/^(\s*)[\s\S]*$/, `$1${hit.to}`) : seg;
  });
  out += rebuilt.join("");
}
out += raw.slice(cursor);

const target = storyAbs.replace(/\.md$/, ".aftermath-repaired.md");
writeFileSync(target, out, "utf8");

const wordsOf = (t) => t.split(/\s+/).filter(Boolean).length;
console.log(`\n${"─".repeat(78)}`);
console.log(`  paragraphs changed  ${replacements.length} of ${totalFlagged} flagged`);
console.log(`  words               ${wordsOf(raw)} → ${wordsOf(out)}`);
console.log(`  written             ${target}`);
console.log(`  cost                $${client.getCostTracker?.().getTotalCost?.().toFixed?.(4) ?? "n/a"}\n`);
for (const r of replacements) {
  console.log(`  ── ch${r.chapter} p${r.index}\n  BEFORE ${r.from.replace(/\s+/g, " ").slice(0, 190)}…\n  AFTER  ${String(r.to).replace(/\s+/g, " ").slice(0, 190)}…\n`);
}
