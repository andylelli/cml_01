// vbatch-B: reads the RECORDED scores in the checkpoints (the OFF baseline as the runs scored it); rescore.mjs re-scores OFF and ON.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js").href);
const info = JSON.parse(readFileSync(process.argv[2], "utf8"));
info["resume-1791308574179"] = { reveal: 8, culprit: "Isabel Morton" };
info["resume-1791313282573"] = { reveal: 8, culprit: "Isabel Morton" }; // the a110-pair checkpoint, overwritten by a later redo (V2O-05)
const files = process.argv.slice(3);
let segsAfter = 0, spuriousDrafts = 0, draftsAfter = 0, forced = 0, bookShort = 0, allDrafts = 0;
for (const f of files) {
  const ck = JSON.parse(readFileSync(f, "utf8"));
  const inf = info[ck.runId]; if (!inf) { console.log("no info", ck.runId); continue; }
  const core = { scenes: [], fairPlay: { culprits: [inf.culprit] }, roles: { reveal: inf.reveal }, book: { words: { min: 1 } } };
  for (const seg of ck.segments) {
    for (const d of seg.drafts) { allDrafts++; if (d.score.hard.some(h => h.kind === "book_short")) bookShort++; }
    if (seg.chapters[0] <= inf.reveal) continue;
    segsAfter++;
    const flags = seg.drafts.map(d => d.score.hard.some(h => h.kind === "reveal_unnamed"));
    draftsAfter += flags.length; spuriousDrafts += flags.filter(Boolean).length;
    const mixed = flags.some(Boolean) && flags.some(x => !x);
    if (mixed) forced++;
    const best = [...seg.drafts].sort((a, b) => b.score.composite - a.score.composite)[0].attempt;
    console.log(ck.runId, `ch${seg.chapters}`, "reveal_unnamed per draft", flags.map(x => x ? 1 : 0).join(""), "chosen", seg.chosen, "best-composite", best, mixed ? "<- pool decided by the per-chapter reveal check" : "");
  }
}
console.log({ allDrafts, bookShort, segsAfter, draftsAfter, spuriousDrafts, segmentsWherePoolForced: forced });
