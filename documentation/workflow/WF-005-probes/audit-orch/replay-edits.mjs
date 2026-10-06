// Replay arm B's editor responses over its chosen drafts with the CURRENT dist, flags as arm B.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
for (const k of ["PROSE_V2_CONTRACT_FIXES","PROSE_V2_OPENING","PROSE_V2_SELECTOR_RANKS","CML_VERIFIED_FIXES","CML_PROMPT_TRIMS"]) process.env[k] = "1";
process.env.PROSE_V2_TAIL_FINDING = process.argv[5] ?? "1";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const ck = JSON.parse(readFileSync(process.argv[2], "utf8"));
const rows = readFileSync(process.argv[3], "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l)).filter(r => r.runId === "resume-1791308574179" && r.operation === "chat_response" && /^Agent9v2-Editor-Ch\d+-R\d$/.test(r.agent));
const arts = JSON.parse(readFileSync(process.argv[4], "utf8"));
const art = arts.find(a => a.id.endsWith("_1565")).payload;
const castNames = ["Eleanor Gresham","Reginald Gresham","Reginald Gresham Jr.","Agatha Pemberton","Charles Fenwick","Isabel Morton"];
const chosen = new Map(ck.segments.flatMap(s => s.drafts.find(d => d.attempt === s.chosen).chapters).map(c => [c.number, c]));
const tally = {}; let applied = 0;
for (const round of [1, 2]) {
  for (let ch = 1; ch <= 10; ch++) {
    const r = rows.find(x => x.agent === `Agent9v2-Editor-Ch${ch}-R${round}`);
    if (!r) continue;
    const { chapter, outcome } = pe.applyEditList(chosen.get(ch), pe.parseEditList(r.response), { scene: undefined, lockedValues: [], castNames, findings: [] });
    chosen.set(ch, chapter);
    applied += outcome.applied;
    for (const [g, n] of Object.entries(outcome.rolledBack)) tally[g] = (tally[g] ?? 0) + n;
  }
}
let same = 0;
for (let ch = 1; ch <= 10; ch++) if (chosen.get(ch).paragraphs.join("\n\n") === art.chapters[ch-1].paragraphs.join("\n\n")) same++;
console.log(`TAIL_FINDING=${process.env.PROSE_V2_TAIL_FINDING}: applied ${applied}, rolledBack`, tally, `chapters byte-identical to the shipped artifact: ${same}/10`);
