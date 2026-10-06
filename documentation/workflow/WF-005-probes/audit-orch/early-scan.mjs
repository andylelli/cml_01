import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const info = JSON.parse(readFileSync(process.argv[2], "utf8"));
info["resume-1791308574179"] = { reveal: 8, culprit: "Isabel Morton" };
let early = 0, seg = 0, pre = 0;
for (const f of process.argv.slice(3)) {
  const ck = JSON.parse(readFileSync(f, "utf8"));
  const inf = info[ck.runId]; if (!inf) continue;
  for (const s of ck.segments) {
    for (const d of s.drafts) {
      for (const ch of d.chapters) {
        if (ch.number >= inf.reveal) continue;
        pre++;
        const sents = ch.paragraphs.join(" ").split(/(?<=[.!?]["”’]?)\s+/).filter(x => pe.namesAsCulprit(x, inf.culprit));
        if (sents.length) { early++; console.log(ck.runId.slice(-8), `ch${ch.number} d${d.attempt}${s.chosen===d.attempt?"*":""}`, "::", sents[0].slice(0, 200)); }
      }
    }
  }
}
console.log({ preRevealChapterDrafts: pre, flaggedEarly: early });
