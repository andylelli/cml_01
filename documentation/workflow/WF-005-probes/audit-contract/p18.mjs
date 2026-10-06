// A_111 V batch, group C — no NEW defect: the contract's own rule checks (contract-rules + trace rules) and every
// p1/p2 defect, per case, in arm X versus arm Y. A violation present in Y and absent in X is a regression.
// `node p18.mjs OFF AUDIT` and `node p18.mjs B B_AUDIT`.
import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
const [X, Y] = [process.argv[2] ?? "OFF", process.argv[3] ?? "AUDIT"];
const items = (k) => {
  const out = new Set();
  for (const note of k.notes) {
    const m = note.match(/^(contract rules violated|trace rules violated): (.*)$/);
    if (!m) continue;
    for (const part of m[2].split(/, (?=[a-z-]+ \()|; /)) out.add(`${m[1].split(" ")[0]}:${part.trim()}`);
  }
  return out;
};
const gained = {}; const lost = {}; let n = 0;
for (const c of cases) {
  setEnv(X); const a = items(pe.buildBookContract(c.input));
  setEnv(Y); const b = items(pe.buildBookContract(c.input));
  n++;
  for (const v of b) if (!a.has(v)) (gained[v.replace(/\(.*$/, "").trim()] ??= []).push(`${c.id.slice(5, 13)} ${v}`);
  for (const v of a) if (!b.has(v)) (lost[v.replace(/\(.*$/, "").trim()] ??= []).push(c.id.slice(5, 13));
}
console.log(`${X} -> ${Y} over ${n} cases`);
console.log("GAINED (new violations):", Object.keys(gained).length ? "" : "none");
for (const [k, v] of Object.entries(gained)) console.log(`  ${k}: ${v.length} — e.g. ${v.slice(0, 3).join(" | ")}`);
console.log("LOST (violations cleared):");
for (const [k, v] of Object.entries(lost)) console.log(`  ${k}: ${v.length}`);
