import { readFileSync } from "node:fs";
const p = process.argv[2];
const c = JSON.parse(readFileSync(p, "utf8"));
console.log("runId", c.runId, "hash", c.contractHash, "updated", c.updatedAt, "segments", c.segments.length, "chapters", c.chapters.length);
for (const s of c.segments) {
  console.log(`seg ${s.index} ch ${s.chapters} chosen ${s.chosen} drafts ${s.drafts.length}`);
  for (const d of s.drafts) {
    const hard = d.score.hard.map(h => h.kind).join(",");
    const words = d.chapters.map(ch => ch.paragraphs.join(" ").split(/\s+/).length).join("/");
    console.log(`   d${d.attempt} comp ${d.score.composite} words ${words} hard [${hard}]`);
  }
}
console.log("edits", (c.edits||[]).length, "anchored", c.findings?.anchored?.length, "discarded", c.findings?.discarded?.length);
