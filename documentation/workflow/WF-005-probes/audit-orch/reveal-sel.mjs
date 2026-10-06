import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const ck = JSON.parse(readFileSync(process.argv[2], "utf8"));
const culprit = "Isabel Morton";
const core = { scenes: [], fairPlay: { culprits: [culprit] }, roles: { reveal: 8 }, book: { words: { min: 7500 } } };
for (const segIdx of [7, 8, 9]) {
  const seg = ck.segments.find(s => s.index === segIdx);
  console.log(`segment ${segIdx} (chapter ${seg.chapters}) chosen d${seg.chosen}`);
  for (const d of seg.drafts) {
    const hits = pe.checkHardGates(d.chapters, core, seg.chapters).map(h => h.kind);
    const text = d.chapters.map(c => c.paragraphs.join(" ")).join(" ");
    // find the sentence(s) that make namesAsCulprit true
    const sents = text.split(/(?<=[.!?]["”’]?)\s+/).filter(s => pe.namesAsCulprit(s, culprit));
    console.log(`  d${d.attempt} composite ${d.score.composite} hard=[${hits}] namesAsCulprit=${pe.namesAsCulprit(text, culprit)} :: ${sents.slice(0,2).map(s => s.slice(0,170)).join(" || ")}`);
  }
}
// The same chapter-9 drafts judged as the book gate does (expected = all chapters, reveal chapter present)
const chosen = ck.segments.flatMap(s => s.drafts.find(d => d.attempt === s.chosen).chapters);
const seg8 = ck.segments.find(s => s.index === 8);
for (const d of seg8.drafts) {
  const book = chosen.map(c => c.number === 9 ? d.chapters[0] : c);
  const hits = pe.checkHardGates(book, core, [1,2,3,4,5,6,7,8,9,10]).filter(h => h.kind === "reveal_unnamed");
  console.log(`  whole book with ch9 = d${d.attempt}: reveal_unnamed hits ${hits.length}`);
}
