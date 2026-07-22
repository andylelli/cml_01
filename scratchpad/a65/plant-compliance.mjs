#!/usr/bin/env node
// A_65 analysis 2 — PLANT-PAGE COMPLIANCE. The judge still says "not planted" on planted-era
// stories (5/5). Fork: judge insensitivity vs Agent-9 non-compliance. For every plant the outline
// stamped, check the SHIPPED story: do the plant's key terms appear in any chapter STRICTLY BEFORE
// the clue's reveal chapter? Key terms come from the run's own PLANT OBLIGATIONS prompt lines.
import fs from "fs";
import path from "path";

const root = "C:/CML";
const RUNS = [
  { rid: "mystery-1784662295274", log: "scratchpad/a64-probe/probe_tide.log", label: "probe-tide" },
  { rid: "mystery-1784663896191", log: "scratchpad/m3/m3_clock.log", label: "m3-clock" },
  { rid: "mystery-1784664846932", log: "scratchpad/m3/m3_poison.log", label: "m3-poison" },
  { rid: "mystery-1784665751813", log: "scratchpad/m3/m3_identity.log", label: "m3-identity" },
  { rid: "mystery-1784667048584", log: "scratchpad/m3/m3_tide.log", label: "m3-tide" },
];
const STOP = new Set(["the","a","an","of","on","in","at","to","with","and","or","for","from","near","its","his","her"]);

const archivesRoot = path.join(root, "documentation/prompts/actual");
let totalPlants = 0, onPageEarly = 0, onPageLate = 0, absent = 0;

for (const r of RUNS) {
  const log = fs.readFileSync(path.join(root, r.log), "utf8");
  const stamp = (log.match(/\[Agent 7 plant-before-reveal\] ([^\n]+)/) ?? [])[1] ?? "";
  // "clue_11→scene 1 (reveal 3); ..."
  const plants = [...stamp.matchAll(/([\w-]+)→scene (\d+) \(reveal (\d+)\)/g)]
    .map((m) => ({ id: m[1], plantScene: +m[2], revealScene: +m[3] }));
  const storyPath = (log.match(/^STORY_SAVED (.+)$/m) ?? [])[1]?.trim();
  const md = fs.readFileSync(storyPath, "utf8");
  const parts = md.split(/^#{1,3}\s+Chapter\s+(\d+)[^\n]*$/m);
  const chapters = {};
  for (let i = 1; i < parts.length; i += 2) chapters[+parts[i]] = (parts[i + 1] ?? "").toLowerCase();
  const maxCh = Math.max(...Object.keys(chapters).map(Number));

  const dir = fs.readdirSync(archivesRoot).find((d) => {
    const idx = path.join(archivesRoot, d, "INDEX.md");
    return fs.existsSync(idx) && fs.readFileSync(idx, "utf8").includes(r.rid);
  });
  // plant key terms from the prompts: "    • term, term, term [plant:ID]"
  const termsById = new Map();
  for (const f of fs.readdirSync(path.join(archivesRoot, dir)).filter((f) => f.includes("Agent9") && f.endsWith("_request.md"))) {
    const t = fs.readFileSync(path.join(archivesRoot, dir, f), "utf8");
    for (const m of t.matchAll(/•\s*([^\[\n]+)\[plant:([\w-]+)\]/g)) {
      const terms = m[1].split(",").map((s) => s.trim().toLowerCase()).filter((s) => s && !STOP.has(s) && s.length >= 4);
      if (!termsById.has(m[2])) termsById.set(m[2], terms);
    }
  }

  console.log(`=== ${r.label} (${plants.length} plants, ${maxCh} chapters)`);
  for (const p of plants) {
    const terms = termsById.get(p.id) ?? [];
    if (terms.length === 0) { console.log(`  ${p.id}: NO TERMS IN PROMPTS (stamp without render?)`); continue; }
    totalPlants++;
    const need = Math.max(2, Math.ceil(terms.length / 2));
    let firstCh = null;
    for (let ch = 1; ch <= maxCh; ch++) {
      const text = chapters[ch] ?? "";
      const hits = terms.filter((t) => text.includes(t)).length;
      if (hits >= need) { firstCh = ch; break; }
    }
    let verdict;
    if (firstCh == null) { verdict = "ABSENT"; absent++; }
    else if (firstCh < p.revealScene) { verdict = `ON-PAGE ch${firstCh} (before reveal ${p.revealScene}) ✓`; onPageEarly++; }
    else { verdict = `LATE ch${firstCh} (reveal ${p.revealScene})`; onPageLate++; }
    console.log(`  ${p.id.padEnd(36)} plant→${p.plantScene} reveal→${p.revealScene}  ${verdict}  [${terms.slice(0,5).join(",")}]`);
  }
}
console.log(`\nTOTAL plants=${totalPlants}  on-page-before-reveal=${onPageEarly} (${Math.round(100*onPageEarly/totalPlants)}%)  late=${onPageLate}  absent=${absent}`);
