#!/usr/bin/env node
// A_65b Ph7 — THE DETECTOR CENSUS. Every offline-runnable deterministic detector, run over every
// shipped story in the corpus (known-good by definition). A detector firing on a large fraction
// of shipped stories is precision-suspect (the Type-A family: #7 polysemy, #9 meridiem, #10 role
// substring all had this signature). Output: fire-rate table -> scratchpad/a65/detector-census.tsv.
import fs from "fs";
import path from "path";
import { detectScaffoldNotProse, detectReportStyleClearance } from "file:///C:/CML/packages/prose-guard/dist/scaffold.js";
import { detectTemplateLeakage } from "file:///C:/CML/packages/prose-guard/dist/fidelity.js";
import { detectRecurringPhrases } from "file:///C:/CML/packages/prompts-llm/dist/agent9-prose/phrase-analysis.js";

const root = "C:/CML";
const storiesRoot = path.join(root, "stories");

// register measure family (mirrors derive-a65-measures; becomes the prose-guard detector in craft Ph1.5)
const REGISTER_FAMILY = [
  /\bwitness(?:es)? (?:report|recall|remember|confirm)\w*\b/i,
  /\banalysis (?:of [^.!?]{0,40})?(?:shows|suggests|indicates|reveals)\b/i,
  /\bstatements? confirm\w*\b/i,
  /\brecords? indicat\w*\b/i,
  /\blogs? confirm\w*\b/i,
];

function chaptersOf(md) {
  const parts = md.split(/^#{1,3}\s+Chapter\s+(\d+)[^\n]*$/m);
  const out = [];
  for (let i = 1; i < parts.length; i += 2) out.push(parts[i + 1] ?? "");
  return out;
}

const stories = [];
for (const dir of fs.readdirSync(storiesRoot)) {
  const d = path.join(storiesRoot, dir);
  if (!fs.statSync(d).isDirectory()) continue;
  const md = fs.readdirSync(d).find((f) => f.endsWith(".md"));
  if (md) stories.push({ dir, path: path.join(d, md) });
}

const detectors = {
  "scaffold (any rule)": (full, chs) => detectScaffoldNotProse(full).length > 0,
  "template-leakage": (full) => detectTemplateLeakage(full).length > 0,
  "report-style-clearance": (full, chs) => chs.some((c) => detectReportStyleClearance(c)),
  "recurring-phrases (post-Ph4 exclusions)": (full, chs) =>
    detectRecurringPhrases(chs.map((c) => ({ title: "", paragraphs: [c] })), 7, 3).length > 0,
  "evidentiary-register (>=3 hits)": (full) =>
    REGISTER_FAMILY.reduce((n, re) => n + (full.match(new RegExp(re.source, "gi")) ?? []).length, 0) >= 3,
};

// Era buckets — the corpus spans fix eras: a detector firing on PRE-fix stories is history,
// not imprecision. The live signal is the CURRENT (planted) era: those stories shipped clean
// through every gate, so high fire there = precision-suspect or a real residual.
function eraOf(dir) {
  const m = dir.match(/story_(\d{8})/);
  const d = m ? m[1] : "00000000";
  if (d >= "20260721") return "planted";
  if (d >= "20260717") return "sevenx";
  return "pre";
}

const buckets = {};
for (const s of stories) {
  const md = fs.readFileSync(s.path, "utf8");
  const chs = chaptersOf(md);
  const era = eraOf(s.dir);
  for (const [name, fn] of Object.entries(detectors)) {
    const b = (buckets[name] ??= { pre: [0, 0], sevenx: [0, 0], planted: [0, 0] });
    b[era][1]++;
    try {
      if (fn(md, chs)) b[era][0]++;
    } catch { /* detector not applicable */ }
  }
}

const pct = ([n, d]) => (d ? `${n}/${d} (${(100 * n / d).toFixed(0)}%)` : "-");
const rows = [["detector", "pre_fix_era", "sevenx_era", "planted_era", "verdict"].join("\t")];
for (const [name, b] of Object.entries(buckets).sort((x, y) => y[1].planted[0] - x[1].planted[0])) {
  const plantedRate = b.planted[1] ? b.planted[0] / b.planted[1] : 0;
  const verdict = plantedRate > 0.2
    ? "PRECISION-SUSPECT or live residual (>20% of CURRENT shipped)"
    : "ok on current era";
  rows.push([name, pct(b.pre), pct(b.sevenx), pct(b.planted), verdict].join("\t"));
}
fs.writeFileSync(path.join(root, "scratchpad/a65/detector-census.tsv"), rows.join("\n") + "\n");
console.log(rows.join("\n"));
