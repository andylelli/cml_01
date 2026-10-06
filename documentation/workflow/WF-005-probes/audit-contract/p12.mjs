import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
setEnv("OFF");
let n = 0;
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const ow = k.scenes.find((s) => s.chapter === k.roles.reveal)?.opportunityWindow;
  const intervals = k.chronology.rows.filter((r) => r.kind === "interval");
  const re = intervals.find((r) => /murder|entry|the act|opportunit|window|access/i.test(r.label));
  if (re && !/murder|the act|opportunit/i.test(re.label)) { n++; console.log(`${c.id.slice(5, 13)} regex picked on "${(re.label.match(/entry|window|access/i) ?? [])[0]}": "${re.value}" — ${re.label.slice(0, 120)} | culprit ${k.fairPlay.culprits.join(",")}`); }
}
console.log("regex picks decided by entry/window/access only:", n);
