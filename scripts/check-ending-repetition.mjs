#!/usr/bin/env node
/**
 * DID THE ENDING REPEAT ITSELF? — a detector, deliberately not a gate.
 *
 * The reader has made the same complaint on three manuscripts: the final chapter re-clears the
 * innocent suspect-by-suspect after an earlier chapter already did, and its title promises a reveal
 * that already happened. A_76 fixed both as PROMPT PROHIBITIONS, which means compliance is likely and
 * not certain — and nothing in the pipeline would notice a relapse.
 *
 * WHY NOT A GATE. A_75 §16 measured every lint issue driving a retry, and retried chapters running
 * +2.43 register points more abstract on the one axis that predicts the headline. Enforcing this
 * through the retry loop would cost more than the defect. So this reports; it never fails a run.
 *
 * WHAT IT CANNOT SEE. The clearance TRIM looks for redundant clearance SENTENCES and found none in
 * `story_20260830-1850` — because the repetition there was a STRUCTURE, the same three suspects
 * staged in the same order in both chapters. So this checks the structure, not the sentences.
 *
 *   node scripts/check-ending-repetition.mjs <manuscript.md> [--cast "A,B,C"]
 */

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("\n  usage: node scripts/check-ending-repetition.mjs <manuscript.md> [--cast \"A,B,C\"]\n");
  process.exit(1);
}

const text = readFileSync(file, "utf8");
const chapters = text.split(/^##\s+/m).slice(1);
if (chapters.length < 3) { console.error("\n  fewer than 3 chapters — nothing to compare\n"); process.exit(1); }

const titleOf = (c) => c.split("\n")[0].replace(/^Chapter\s+\d+:\s*/i, "").trim();
const bodyOf = (c) => c.replace(/^[^\n]*\n/, "");

/** Cast names, either supplied or inferred from capitalised repeat offenders. */
const castArg = process.argv.indexOf("--cast");
let cast;
if (castArg > -1 && process.argv[castArg + 1]) {
  cast = process.argv[castArg + 1].split(",").map((s) => s.trim()).filter(Boolean);
} else {
  const counts = new Map();
  for (const m of text.matchAll(/\b([A-Z][a-z]{3,})\s+([A-Z][a-z]{3,})\b/g)) {
    const full = `${m[1]} ${m[2]}`;
    counts.set(full, (counts.get(full) ?? 0) + 1);
  }
  cast = [...counts.entries()].filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
}

const last = chapters[chapters.length - 1];
const prev = chapters[chapters.length - 2];

const CLEAR_CONTEXT = /\b(cleared|clearance|ruled out|eliminated|in the clear|alibi|corroborat|could not have|account holds|confirms? your|isolation|were at|was at|had been at|innocent)\b/i;

/**
 * Which suspects are given clearance treatment in a chapter, in order of first appearance.
 *
 * FIRST ATTEMPT WAS TOO STRICT: it required a paragraph to name EXACTLY ONE suspect, and returned
 * one name per chapter on the very book the reader described as re-clearing three people. Golden Age
 * ending scenes put the whole cast in one room, so suspects share paragraphs constantly.
 *
 * What the reader actually objected to is a suspect being WALKED THROUGH — named in a paragraph that
 * also argues their innocence — twice. That is what this looks for.
 */
const rollCall = (chapter) => {
  const order = [];
  for (const para of bodyOf(chapter).split(/\n\s*\n/)) {
    if (!CLEAR_CONTEXT.test(para)) continue;
    for (const n of cast) {
      const given = n.split(/\s+/)[0], sur = n.split(/\s+/).pop();
      if (new RegExp(`\\b(?:${given}|${sur})\\b`).test(para) && !order.includes(n)) order.push(n);
    }
  }
  return order;
};

const a = rollCall(prev), b = rollCall(last);
const shared = b.filter((n) => a.includes(n));
const sameOrder = shared.length >= 2
  && JSON.stringify(a.filter((n) => shared.includes(n))) === JSON.stringify(b.filter((n) => shared.includes(n)));

const CLEAR_LANG = /\b(cleared|clearance|ruled out|eliminated|in the clear|alibi|corroborat|could not have|account holds|confirms? your)\b/i;
const clearSentences = bodyOf(last).split(/(?<=[.!?])\s+/).filter((s) => CLEAR_LANG.test(s) && !/^["“']/.test(s));

const BANNED_TITLE = /\b(reveal|revealed|revelation|unmask|unmasked|unmasking|culprit|killer|exposed|solution|accused|clearing|alibi)\b/i;
const badTitle = BANNED_TITLE.test(titleOf(last));

console.log(`\n  ENDING REPETITION CHECK — ${file.split(/[\\/]/).pop()}`);
console.log(`  cast: ${cast.join(", ") || "(none inferred)"}\n`);
console.log(`    penultimate ch ${chapters.length - 1}: "${titleOf(prev).slice(0, 52)}"`);
console.log(`    final ch ${chapters.length}      : "${titleOf(last).slice(0, 52)}"\n`);
console.log(`    suspects given their own paragraph, ch${chapters.length - 1}: ${a.join(", ") || "none"}`);
console.log(`    suspects given their own paragraph, ch${chapters.length}: ${b.join(", ") || "none"}`);

const findings = [];
if (shared.length >= 2) findings.push(`${shared.length} suspects get a dedicated paragraph in BOTH final chapters (${shared.join(", ")})`);
if (sameOrder) findings.push(`and in the SAME ORDER — this is the shape the reader called "re-clears them almost line by line"`);
if (clearSentences.length >= 2) findings.push(`${clearSentences.length} clearance/alibi sentences remain in the final chapter`);
if (badTitle) findings.push(`the final chapter title promises a reveal or a clearing: "${titleOf(last)}"`);

console.log("");
if (!findings.length) {
  console.log("    CLEAN — no roll-call, no clearance language, no reveal-promising title.\n");
} else {
  for (const f of findings) console.log(`    ⚠ ${f}`);
  console.log(`\n    ${findings.length} finding(s). This does NOT fail the run — it is a detector, because`);
  console.log(`    a gate here would drive retries and retries cost more abstraction than this defect.\n`);
  if (clearSentences.length) {
    console.log("    clearance/alibi sentences still in the final chapter:");
    for (const s of clearSentences.slice(0, 4)) console.log(`      · ${s.trim().slice(0, 100)}`);
    console.log("");
  }
}
