import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { hashContract } = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/agents/agent9-v2/checkpoint.js").href);
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const P = JSON.parse(readFileSync(process.argv[2], "utf8"))[process.argv[3]];
const target = process.argv[4];
const s0 = P["Agent9v2-Writer-S0-D1"].user;
const bible = s0.slice(0, s0.indexOf("\n\n## THE BRIEF\n"));
const brief = s0.slice(s0.indexOf("\n\n## THE BRIEF\n") + 15, s0.indexOf("\n\n## THE CHAPTERS TO WRITE\n"));
const contracts = [];
for (let s = 0; s < 10; s++) {
  const u = P[`Agent9v2-Writer-S${s}-D1`].user;
  const i = u.indexOf("\n\n## THE CHAPTERS TO WRITE\n") + 27;
  const soFarAt = u.indexOf("\n\nTHE BOOK SO FAR");
  const end = soFarAt > 0 ? soFarAt : u.indexOf("\n\n\n\nWrite the chapters below");
  contracts.push(u.slice(i, end));
}
const clueSets = {
  bible: [...bible.matchAll(/\[([A-Za-z0-9_\-]+)\] chapter \d+/g)].map(m => m[1]),
};
console.log("clue ids", clueSets.bible.length, clueSets.bible.slice(0,5));
const prompt = [bible, brief, ...contracts, pe.writerFormatInstruction([1,2,3,4,5,6,7,8,9,10])].join("\n");
let hit = null;
for (const ids of [clueSets.bible, [...new Set(clueSets.bible)], []])
for (let r = 1; r <= 10; r++) for (const af of [null, ...Array.from({length:10},(_, i)=>i+1)]) {
  const h = hashContract({ chapters: 10, reveal: r, aftermath: af, clueIds: ids, prompt, plan: "1|2|3|4|5|6|7|8|9|10" });
  if (h === target) hit = { r, af, n: ids.length };
}
console.log("match", hit);
// check that brief starts as expected
console.log(JSON.stringify(brief.slice(0, 80)), "...", JSON.stringify(contracts[9].slice(-80)));
