// V2O-01 / V-10: strip every accusation from arm B's reveal chapter; does the gate's fair-play stop still pass on a
// figurative "wit had cut through the silence" in chapter 9? Run OFF and ON in one process (flags read at call time).
// Usage: node gate-fp.mjs <prose-arts.json>   (prose-arts.mjs writes it from the store)
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js").href);
const arts = JSON.parse(readFileSync(process.argv[2], "utf8"));
const art = arts.find(a => a.id.endsWith("_1565")).payload;
const chapters = art.chapters.map((c, i) => ({ ...c, number: i + 1 }));
const culprit = "Isabel Morton";
// The case's victim and cast, as the contract carries them (proj_5eb8c115: victim Reginald Gresham).
const core = { scenes: [{ chapter: 1, present: art.cast ?? [] }], fairPlay: { culprits: [culprit], victim: "Reginald Gresham", decisiveClueIds: [] }, roles: { reveal: 8 } };
const people = pe.culpritContextOf(core);
const expected = [1,2,3,4,5,6,7,8,9,10];
const withFlag = (flag, f) => { if (flag) process.env.PROSE_V2_AUDIT_FIXES = "1"; else delete process.env.PROSE_V2_AUDIT_FIXES; try { return f(); } finally { delete process.env.PROSE_V2_AUDIT_FIXES; } };
const anyNames = (s) => withFlag(false, () => pe.namesAsCulprit(s, culprit, people)) || withFlag(true, () => pe.namesAsCulprit(s, culprit, people));
const strip = (c) => ({ ...c, paragraphs: c.paragraphs.map(p => p.split(/(?<=[.!?]["”’]?)\s+/).filter(s => !anyNames(s)).join(" ")).filter(Boolean) });
const noReveal = chapters.map(c => c.number === 8 ? strip(c) : c);
for (const flag of [false, true]) {
  const label = flag ? "ON " : "OFF";
  const asShipped = withFlag(flag, () => pe.applyGate({ chapters, core, expected, findings: [], deterministicWrites: 0 }));
  console.log(`${label} as shipped: ship ${asShipped.ship} stops ${JSON.stringify(asShipped.stops)}`);
  const later = withFlag(flag, () => noReveal.filter(c => c.number > 8).flatMap(c => c.paragraphs.join(" ").split(/(?<=[.!?]["”’]?)\s+/).filter(s => pe.namesAsCulprit(s, culprit, people)).map(s => `ch${c.number}: ${s.slice(0,140)}`)));
  console.log(`${label} sentences after the reveal that satisfy the predicate: ${later.length}`, later.length ? "\n   " + later.join("\n   ") : "");
  const v = withFlag(flag, () => pe.applyGate({ chapters: noReveal, core, expected, findings: [], deterministicWrites: 0 }));
  console.log(`${label} reveal stripped -> ship ${v.ship} stops ${JSON.stringify(v.stops)}`);
}
