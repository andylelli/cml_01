// 7.6a scaffold-residual autopsy: run the SHIP-TIME detector (detectScaffoldNotProse, the
// exact function facts.ts uses for the rubric cap) per chapter on each shipped story, and
// cross-reference against the chapters the in-run scaffold regen touched (prompt archives).
import fs from "fs";
import path from "path";
import { detectScaffoldNotProse } from "file:///C:/CML/packages/prose-guard/dist/scaffold.js";

const root = "C:/CML";
const archivesRoot = path.join(root, "documentation", "prompts", "actual");

const POOL = [
  ["dv_clock_off", "mystery-1784568348619", "p5dv/dv_clock_off.log"],
  ["dv_clock_on", "mystery-1784569235134", "p5dv/dv_clock_on.log"],
  ["dv_poison_off", "mystery-1784571763605", "p5dv/dv_poison_off.log"],
  ["dv_poison_on", "mystery-1784572735935", "p5dv/dv_poison_on.log"],
  ["dv_identity_off", "mystery-1784574136763", "p5dv/dv_identity_off.log"],
  ["dv_identity_on", "mystery-1784574963400", "p5dv/dv_identity_on.log"],
  ["dv_tide_off", "mystery-1784576119605", "p5dv/dv_tide_off.log"],
  ["dv_tide_on", "mystery-1784578387267", "p5dv/dv_tide_on.log"],
  ["v_clock_shadow", "mystery-1784579381610", "p5voice/voice_clock_shadow.log"],
  ["v_clock_enforce", "mystery-1784580158372", "p5voice/voice_clock_enforce.log"],
  ["v_poison_shadow", "mystery-1784580961906", "p5voice/voice_poison_shadow.log"],
  ["v_poison_enforce", "mystery-1784582686670", "p5voice/voice_poison_enforce.log"],
  ["v_identity_shadow", "mystery-1784583752603", "p5voice/voice_identity_shadow.log"],
  ["v_identity_enforce", "mystery-1784584788539", "p5voice/voice_identity_enforce.log"],
  ["v_tide_shadow", "mystery-1784585699975", "p5voice/voice_tide_shadow.log"],
  ["v_tide_enforce", "mystery-1784586490642", "p5voice/voice_tide_enforce.log"],
];

// STORY_SAVED for dv logs: the log may contain multiple STORY_SAVED lines if arms shared a
// log file? Take the LAST (the arm's own ship). Each log is per-arm, so single line expected.
function storyPath(logRel) {
  const t = fs.readFileSync(path.join(root, "scratchpad", logRel), "utf8");
  const ms = [...t.matchAll(/^STORY_SAVED (.+)$/gm)];
  return ms.length ? ms.at(-1)[1].trim() : null;
}

function regenChapters(runId) {
  const dir = fs.readdirSync(archivesRoot).find((d) => {
    const idx = path.join(archivesRoot, d, "INDEX.md");
    return fs.existsSync(idx) && fs.readFileSync(idx, "utf8").includes(runId);
  });
  if (!dir) return { dir: "NO_ARCHIVE", chapters: [] };
  const files = fs.readdirSync(path.join(archivesRoot, dir));
  const chs = new Set();
  for (const f of files) {
    const m = f.match(/Regen-Ch(\d+)-scaffold_not_prose_request/);
    if (m) chs.add(Number(m[1]));
  }
  return { dir, chapters: [...chs].sort((a, b) => a - b) };
}

function splitChapters(md) {
  // story markdown chapters: "## Chapter N" or "# Chapter N" headings
  const parts = md.split(/^#{1,3}\s+Chapter\s+(\d+)[^\n]*$/m);
  const out = {};
  for (let i = 1; i < parts.length; i += 2) out[Number(parts[i])] = parts[i + 1] ?? "";
  return out;
}

const ruleTally = {};
const sentenceSamples = [];
let capAgree = 0;
const CAPPED = new Set(["dv_clock_off","dv_clock_on","dv_identity_off","v_clock_enforce","v_poison_shadow","v_identity_enforce","v_tide_shadow","v_tide_enforce"]);

for (const [arm, runId, logRel] of POOL) {
  const sp = storyPath(logRel);
  if (!sp || !fs.existsSync(sp)) { console.log(`${arm}\tNO_STORY (${sp})`); continue; }
  const md = fs.readFileSync(sp, "utf8");
  const chapters = splitChapters(md);
  const { chapters: regen } = regenChapters(runId);

  const shipHits = {};
  for (const [ch, text] of Object.entries(chapters)) {
    const hits = detectScaffoldNotProse(text);
    if (hits.length) {
      shipHits[ch] = hits.map((h) => h.rule);
      for (const h of hits) {
        ruleTally[h.rule] = (ruleTally[h.rule] ?? 0) + 1;
        if (sentenceSamples.length < 24) sentenceSamples.push(`${arm} ch${ch} [${h.rule}] ${String(h.excerpt ?? h.match ?? h.text ?? "").slice(0, 160)}`);
      }
    }
  }
  const hitChs = Object.keys(shipHits).map(Number).sort((a, b) => a - b);
  const overlap = hitChs.filter((c) => regen.includes(c));
  const fresh = hitChs.filter((c) => !regen.includes(c));
  const rubricSaysCapped = CAPPED.has(arm);
  const detectorSaysCapped = hitChs.length > 0;
  const agree = rubricSaysCapped === detectorSaysCapped ? "AGREE" : "DISAGREE";
  if (agree === "AGREE") capAgree++;
  console.log(`${arm.padEnd(20)} cap=${rubricSaysCapped ? "Y" : "n"} shipHits=${detectorSaysCapped ? "Y" : "n"} ${agree.padEnd(9)} regenChs=[${regen}] shipHitChs=[${hitChs}] regen-and-still-hit=[${overlap}] never-flagged=[${fresh}]`);
  for (const [ch, rules] of Object.entries(shipHits)) console.log(`     ch${ch}: ${rules.join(", ")}`);
}
console.log(`\ncap-vs-recompute agreement: ${capAgree}/16`);
console.log("\nRULE TALLY (ship-time hits):");
for (const [r, n] of Object.entries(ruleTally).sort((a, b) => b[1] - a[1])) console.log(`  ${n}  ${r}`);
console.log("\nSAMPLES:");
for (const s of sentenceSamples) console.log("  " + s);
