import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { hashContract } = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/agents/agent9-v2/checkpoint.js").href);
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const all = { ...JSON.parse(readFileSync(process.argv[2], "utf8")), ...JSON.parse(readFileSync(process.argv[3], "utf8")) };
for (const run of Object.keys(all)) {
  const P = all[run];
  const s0 = P["Agent9v2-Writer-S0-D1"].user;
  const bible = s0.slice(0, s0.indexOf("\n\n## THE BRIEF\n"));
  const brief = s0.slice(s0.indexOf("\n\n## THE BRIEF\n") + "\n\n## THE BRIEF\n".length, s0.indexOf("\n\n## THE CHAPTERS TO WRITE\n"));
  const contracts = [];
  for (let s = 0; s < 10; s++) {
    const u = P[`Agent9v2-Writer-S${s}-D1`].user;
    const i = u.indexOf("\n\n## THE CHAPTERS TO WRITE\n") + "\n\n## THE CHAPTERS TO WRITE\n".length;
    const soFarAt = u.indexOf("\n\nTHE BOOK SO FAR");
    const end = soFarAt > 0 ? soFarAt : u.indexOf("\n\n\n\nWrite the chapters below");
    contracts.push(u.slice(i, end));
  }
  const clueIds = [...bible.matchAll(/^\s+\[([^\]]+)\] chapter \d+:/gm)].map(m => m[1]);
  const reveal = contracts.findIndex(c => /This chapter is the reveal\./.test(c)) + 1;
  const aftermathIdx = contracts.findIndex(c => /This chapter is the aftermath\./.test(c));
  const prompt = [bible, brief, ...contracts, pe.writerFormatInstruction([1,2,3,4,5,6,7,8,9,10])].join("\n");
  const h = hashContract({ chapters: 10, reveal, aftermath: aftermathIdx >= 0 ? aftermathIdx + 1 : null, clueIds, prompt, plan: "1|2|3|4|5|6|7|8|9|10" });
  console.log(run, "reveal", reveal, "aftermath", aftermathIdx + 1, "clues", clueIds.length, "hash", h);
}
