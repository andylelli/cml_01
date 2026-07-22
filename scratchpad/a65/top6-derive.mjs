#!/usr/bin/env node
// A_65 craft Phase 3.1 — THE TOP-6 DERIVATION. Structural story properties only (the Goodhart
// guard: never phrase imitation). Contrast the corpus's best scored stories against the worst on:
// aftermath length+content, dialogue share, description density, opening time-to-stakes,
// chapter shape, and phrase repetition. Output: the deltas that Phase 3.2 encodes as contracts.
import fs from "fs";
import path from "path";
import { detectRecurringPhrases } from "file:///C:/CML/packages/prompts-llm/dist/agent9-prose/phrase-analysis.js";
import { computeArrestPivotIndex } from "file:///C:/CML/packages/story-validation/dist/index.js";

const root = "C:/CML";

// runId -> rubric final, from the on-disk reports
const finals = new Map();
for (const dir of fs.readdirSync(path.join(root, "apps/api/data/reports"))) {
  const p = path.join(root, "apps/api/data/reports", dir, `${dir}.json`);
  if (!fs.existsSync(p)) continue;
  try {
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    const rub = (d.diagnostics ?? []).find((x) => x.key === "rubric_score")?.details;
    if (rub?.final != null) finals.set(dir, rub.final);
  } catch { /* skip */ }
}

// runId -> story path, from every chain log in scratchpad
const storyByRun = new Map();
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".log") || e.name.endsWith(".output")) {
      try {
        const t = fs.readFileSync(p, "utf8");
        const rid = (t.match(/^RUN_ID (\S+)/m) ?? [])[1];
        const sp = (t.match(/^STORY_SAVED (.+)$/m) ?? [])[1]?.trim();
        if (rid && sp && fs.existsSync(sp) && !storyByRun.has(rid)) storyByRun.set(rid, sp);
      } catch { /* skip */ }
    }
  }
};
walk(path.join(root, "scratchpad"));

const scored = [...finals.entries()].filter(([rid]) => storyByRun.has(rid)).sort((a, b) => b[1] - a[1]);
const TOP = scored.slice(0, 6);
const BOT = scored.slice(-6);

const STAKES_RE = /\b(dead|death|body|corpse|lifeless|murder(?:ed)?|drowned|killed|no pulse|did not move|slumped)\b/i;
const MOTIVE_RE = /\b(motive|jealous|envy|grief|debt|ruin|shame|love|betray|inheritance|blackmail|desperat)\w*\b/i;

function measure(rid, storyPath) {
  const md = fs.readFileSync(storyPath, "utf8");
  const parts = md.split(/^#{1,3}\s+Chapter\s+(\d+)[^\n]*$/m);
  const chapters = [];
  for (let i = 1; i < parts.length; i += 2) chapters.push((parts[i + 1] ?? "").trim());
  const paras = (t) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const allParas = chapters.flatMap(paras);
  const words = (t) => (t.match(/\S+/g) ?? []).length;

  // dialogue share: fraction of paragraphs carrying quoted speech
  const dialogueParas = allParas.filter((p) => /["“]/.test(p)).length;
  const dialogueShare = dialogueParas / Math.max(1, allParas.length);

  // description density: mean sentence length + -ly adverb rate per 100 words
  const sents = md.match(/[^.!?]+[.!?]+/g) ?? [];
  const meanSentLen = sents.reduce((n, s) => n + words(s), 0) / Math.max(1, sents.length);
  const totalWords = words(md);
  const lyRate = ((md.match(/\b\w+ly\b/gi) ?? []).length / Math.max(1, totalWords)) * 100;

  // opening: paragraphs into ch1 before the stakes token
  const ch1 = paras(chapters[0] ?? "");
  let stakesAt = ch1.findIndex((p) => STAKES_RE.test(p));
  if (stakesAt < 0) stakesAt = ch1.length;

  // aftermath: pivot chapter via arrest/confession; measure text AFTER the pivot chapter starts
  const pivot = computeArrestPivotIndex(chapters);
  let aftermathParas = 0, aftermathDialogue = 0, aftermathMotive = 0;
  if (pivot >= 0) {
    // paragraphs after the FIRST arrest/confession paragraph in the pivot chapter + later chapters
    const pivotParas = paras(chapters[pivot] ?? "");
    const hitIdx = pivotParas.findIndex((p) => /\b(arrest|confess|took (?:him|her|them) into custody|it was I|I killed|I poisoned|I struck)\b/i.test(p));
    const tail = [...(hitIdx >= 0 ? pivotParas.slice(hitIdx + 1) : []), ...chapters.slice(pivot + 1).flatMap(paras)];
    aftermathParas = tail.length;
    aftermathDialogue = tail.filter((p) => /["“]/.test(p)).length;
    aftermathMotive = tail.filter((p) => MOTIVE_RE.test(p)).length;
  }

  // repetition (post-Ph4 detector, no locked values known offline — raw signal)
  const recurring = detectRecurringPhrases(chapters.map((c) => ({ title: "", paragraphs: [c] })), 7, 3).length;

  return {
    rid, final: finals.get(rid), chapters: chapters.length,
    wordsTotal: totalWords, dialogueShare, meanSentLen, lyRate, stakesAt,
    pivot: pivot + 1, aftermathParas, aftermathDialogue, aftermathMotive, recurring,
  };
}

const rows = { TOP: TOP.map(([rid]) => measure(rid, storyByRun.get(rid))), BOT: BOT.map(([rid]) => measure(rid, storyByRun.get(rid))) };
const avg = (xs, k) => (xs.reduce((n, r) => n + (r[k] ?? 0), 0) / xs.length);

console.log("runs mapped:", scored.length, "| TOP:", TOP.map(([r, f]) => f).join(","), "| BOT:", BOT.map(([r, f]) => f).join(","));
console.log("\nper-run:");
for (const band of ["TOP", "BOT"]) for (const r of rows[band])
  console.log(`${band} ${r.final} ${r.rid.slice(-6)} ch=${r.chapters} words=${r.wordsTotal} dlg=${(r.dialogueShare * 100).toFixed(0)}% sent=${r.meanSentLen.toFixed(1)} ly=${r.lyRate.toFixed(2)} stakes@p${r.stakesAt} pivot=ch${r.pivot} aftermath=${r.aftermathParas}p(dlg${r.aftermathDialogue},motive${r.aftermathMotive}) recur=${r.recurring}`);

console.log("\n=== BAND MEANS (TOP vs BOT) ===");
for (const k of ["chapters", "wordsTotal", "dialogueShare", "meanSentLen", "lyRate", "stakesAt", "aftermathParas", "aftermathDialogue", "aftermathMotive", "recurring"]) {
  const t = avg(rows.TOP, k), b = avg(rows.BOT, k);
  console.log(`${k.padEnd(18)} TOP=${t.toFixed(2).padStart(8)}  BOT=${b.toFixed(2).padStart(8)}  Δ=${(t - b).toFixed(2)}`);
}
