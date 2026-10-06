// Every pre-reveal chapter draft in the stored one-chapter checkpoints: which does the culprit predicate read as naming
// the murderer early? OFF and ON (V-10), with each case's victim as its contract carries it.
// Usage: node early-scan.mjs reveal-info.json $(node ckpts.mjs --paths)
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js").href);
const info = JSON.parse(readFileSync(process.argv[2], "utf8"));
info["resume-1791308574179"] = { reveal: 8, culprit: "Isabel Morton" };
info["resume-1791313282573"] = { reveal: 8, culprit: "Isabel Morton" }; // the a110-pair checkpoint, overwritten by a later redo (V2O-05)
const VICTIM = { "Desmond Kestrel": "Katherine Quayle", "Charles Hemsworth": "Reginald Hemsworth", "Isabel Morton": "Reginald Gresham" };
for (const flag of [false, true]) {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = "1"; else delete process.env.PROSE_V2_AUDIT_FIXES;
  let early = 0, pre = 0;
  for (const f of process.argv.slice(3)) {
    const ck = JSON.parse(readFileSync(f, "utf8"));
    const inf = info[ck.runId]; if (!inf) continue;
    const people = { victim: VICTIM[inf.culprit], cast: [] };
    for (const s of ck.segments) for (const d of s.drafts) for (const ch of d.chapters) {
      if (ch.number >= inf.reveal) continue;
      pre++;
      const sents = ch.paragraphs.join(" ").split(/(?<=[.!?]["”’]?)\s+/).filter((x) => pe.namesAsCulprit(x, inf.culprit, people));
      if (sents.length) { early++; console.log(flag ? "ON " : "OFF", ck.runId.slice(-8), `ch${ch.number} d${d.attempt}${s.chosen === d.attempt ? "*" : ""}`, "::", sents[0].slice(0, 160)); }
    }
  }
  console.log(flag ? "ON " : "OFF", { preRevealChapterDrafts: pre, flaggedEarly: early });
}
delete process.env.PROSE_V2_AUDIT_FIXES;
