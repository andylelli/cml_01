import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const arts = JSON.parse(readFileSync(process.argv[2], "utf8"));
const art = arts.find(a => a.id.endsWith("_1565")).payload;
const chapters = art.chapters.map((c, i) => ({ ...c, number: i + 1 }));
const culprit = "Isabel Morton";
const core = { scenes: [], fairPlay: { culprits: [culprit], decisiveClueIds: [] }, roles: { reveal: 8 } };
const expected = [1,2,3,4,5,6,7,8,9,10];
console.log("as shipped:", JSON.stringify(pe.applyGate({ chapters, core, expected, findings: [], deterministicWrites: 0 }).stops));
// Strip every accusation from the reveal chapter: drop sentences that satisfy the predicate.
const strip = (c) => ({ ...c, paragraphs: c.paragraphs.map(p => p.split(/(?<=[.!?]["”’]?)\s+/).filter(s => !pe.namesAsCulprit(s, culprit)).join(" ")).filter(Boolean) });
const noReveal = chapters.map(c => c.number === 8 ? strip(c) : c);
console.log("ch8 still names?", pe.namesAsCulprit(noReveal[7].paragraphs.join(" "), culprit));
const later = noReveal.filter(c => c.number > 8).flatMap(c => c.paragraphs.join(" ").split(/(?<=[.!?]["”’]?)\s+/).filter(s => pe.namesAsCulprit(s, culprit)).map(s => `ch${c.number}: ${s.slice(0,160)}`));
console.log("sentences after the reveal that satisfy the predicate:\n ", later.join("\n  "));
const v = pe.applyGate({ chapters: noReveal, core, expected, findings: [], deterministicWrites: 0 });
console.log("reveal stripped -> ship", v.ship, "stops", JSON.stringify(v.stops), "warnings", JSON.stringify(v.warnings));
