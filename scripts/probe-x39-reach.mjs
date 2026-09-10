// How often does the case keep time twice? For every stored case with a story_geometry (anchors) and a
// devices artifact (locked facts), run the built check. X39 firing = F4 drops the device numbers.
// Not firing on a non-temporal case = the CML adopted the device's clock — the story IS a clock story
// on a non-temporal axis, which F4 cannot touch (that is A_83's residue).
import { readFileSync } from "node:fs";
import { checkCaseTimeCoherence } from "file:///C:/CML/packages/cml/dist/timeline-deception.js";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const byProject = new Map();
for (const a of Object.values(store.artifacts)) {
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}
const tally = { temporal: { n: 0, x39: 0 }, other: { n: 0, x39: 0 } };
const rows = [];
for (const [pid, p] of byProject) {
  if (!p.story_geometry || !p.hard_logic_devices || !p.cml) continue;
  const g = p.story_geometry.geometry ?? p.story_geometry;
  const tm = g.timeModel ?? {};
  if (!tm.apparentTime && !tm.trueTime) continue;
  const axis = p.cml?.CASE?.false_assumption?.type ?? "?";
  const facts = (p.hard_logic_devices.devices ?? []).flatMap((d) => d.lockedFacts ?? []);
  const v = checkCaseTimeCoherence({ lockedFacts: facts, apparentTime: tm.apparentTime, actualTime: tm.trueTime });
  const x39 = v.some((x) => x.code === "time_spines_disagree");
  const bucket = axis === "temporal" ? tally.temporal : tally.other;
  bucket.n += 1;
  if (x39) bucket.x39 += 1;
  rows.push(`${pid.slice(-6)} ${axis.padEnd(10)} anchors ${String(tm.apparentTime).padEnd(24)} / ${String(tm.trueTime).padEnd(24)} X39=${x39 ? "YES" : "no "}`);
}
console.log(`temporal cases: X39 fires ${tally.temporal.x39}/${tally.temporal.n}`);
console.log(`non-temporal  : X39 fires ${tally.other.x39}/${tally.other.n}`);
for (const r of rows.filter((r) => !r.includes(" temporal ")).slice(0, 12)) console.log("  " + r);
