// A_110 0.1 / N5 — a spoken line lost between the writer and the page. A v2 checkpoint's `chapters` are the CHOSEN
// DRAFTS, written before the editor runs; the saved .md is the edited text. So comparing the two isolates the editor
// (and anything after it). For each chapter: does the opening paragraph change, and did it stop opening on speech?
// The cause, measured on run bcc0d637 with `n5-replay.mjs`: `clue_early` findings anchored on the chapter's first
// sentence, and the editor cutting the spoken words while keeping their tag.
//   node documentation/analysis/ANALYSIS_110/probes/n5-lost-line.mjs [checkpoint.json manuscript.md]
import fs from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const opensOnSpeech = (p) => /^["“‘']/.test(String(p ?? "").trim());
// The save folds typography (memory: em-dashes become hyphens on save), so both sides are folded before matching.
const norm = (p) => String(p ?? "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();
const paragraphsOf = (ch) => (Array.isArray(ch?.paragraphs) ? ch.paragraphs : String(ch?.text ?? "").split(/\n\s*\n/)).map(norm).filter(Boolean);
const savedChapters = (md) => fs.readFileSync(md, "utf8").split(/^##\s+Chapter\s+\d+[^\n]*$/m).slice(1).map((c) => c.replace(/^---\s*$/gm, "").split(/\n\s*\n/).map(norm).filter(Boolean));

const pairs = [];
if (process.argv[2]) pairs.push([process.argv[2], process.argv[3]]);
else {
  const dir = join(ROOT, "apps/worker/logs");
  const stories = [];
  for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) for (const d of fs.existsSync(root) ? fs.readdirSync(root) : []) {
    const p = join(root, d); if (!fs.statSync(p).isDirectory()) continue;
    const md = fs.readdirSync(p).find((f) => f.endsWith(".md")); if (md) stories.push(join(p, md));
  }
  for (const f of fs.readdirSync(dir).filter((f) => /^agent9v2-checkpoint-[^.]+\.json$/.test(f))) {
    const cp = JSON.parse(fs.readFileSync(join(dir, f), "utf8"));
    // Pair on ten paragraph openings, five to match: the editor may have changed any single one of them.
    const probes = paragraphsOf(cp.chapters?.[1]).slice(2, 12).map((p) => p.slice(0, 40)).filter((p) => p.length === 40);
    // One case can have several saved manuscripts (resumes, pairs): every one that carries the draft is a pair.
    for (const md of probes.length >= 5 ? stories.filter((s) => { const t = norm(fs.readFileSync(s, "utf8")); return probes.filter((p) => t.includes(p)).length >= 5; }) : []) pairs.push([join(dir, f), md]);
  }
}

let compared = 0, changed = 0, lost = 0;
for (const [cpPath, md] of pairs) {
  const cp = JSON.parse(fs.readFileSync(cpPath, "utf8"));
  const saved = savedChapters(md);
  (cp.chapters ?? []).forEach((draftCh, i) => {
    const a = paragraphsOf(draftCh)[0], b = saved[i]?.[0];
    if (!a || !b) return;
    compared++;
    if (a !== b) changed++;
    if (opensOnSpeech(a) && !opensOnSpeech(b)) {
      lost++;
      console.log(`${cpPath.split(/[\\/]/).pop().slice(20, 48)} ch${i + 1}: the opening line lost its speech\n    draft: ${a.slice(0, 120)}\n    saved: ${b.slice(0, 120)}`);
    }
  });
}
console.log(`checkpoints paired with a manuscript: ${pairs.length} · chapters compared: ${compared} · opening paragraph changed by the editor: ${changed} · opening speech lost: ${lost}`);

// The mechanism, over every checkpoint that recorded its findings: how many `clue_early` findings point at the
// first sentence of their chapter — the fallback that sent the editor to a line that did not carry the clue.
let early = 0, onFirst = 0, runs = 0;
for (const f of fs.readdirSync(join(ROOT, "apps/worker/logs")).filter((f) => /^agent9v2-checkpoint-[^.]+\.json$/.test(f))) {
  const cp = JSON.parse(fs.readFileSync(join(ROOT, "apps/worker/logs", f), "utf8"));
  const anchored = cp.findings?.anchored ?? []; if (!anchored.length) continue; runs++;
  for (const x of anchored.filter((x) => x.class === "clue_early")) {
    early++;
    const first = norm(paragraphsOf(cp.chapters?.[x.chapter - 1])[0] ?? "").slice(0, 40);
    if (first && norm(x.quote).startsWith(first)) onFirst++;
  }
}
console.log(`checkpoints with findings: ${runs} · clue_early findings: ${early} · anchored on the chapter's first sentence: ${onFirst}`);
