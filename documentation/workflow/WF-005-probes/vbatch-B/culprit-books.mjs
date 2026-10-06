// V-10 over the 29 distinct stored books WITH their contracts (real culprit, victim and cast):
//  1. every sentence x every cast name: how many does the predicate accept OFF vs ON, and on which verb?
//  2. the TRUE culprit: which sentences does ON stop accepting (are real accusations lost?) — printed in full;
//  3. the gate's culprit stop over every book, OFF vs ON (known positives: a book that names its culprit must still ship).
// Usage: node culprit-books.mjs
import { distinct, PE } from "./cases.mjs";
const books = distinct.filter((c) => c.chapters.length >= 8);
const split = (t) => t.replace(/\s+/g, " ").split(/(?<=[.!?]["”’]?)\s+/);
const KILL = /\b(killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)\b/i;
const on = (f) => { process.env.PROSE_V2_AUDIT_FIXES = "1"; try { return f(); } finally { delete process.env.PROSE_V2_AUDIT_FIXES; } };
let anyOff = 0, anyOn = 0, killOff = 0, killOn = 0;
const verbsOff = {}, verbsOn = {};
const lostTrue = [], keptTrue = [];
for (const b of books) {
  const people = PE.culpritContextOf(b.contract);
  const names = [...new Set([...b.castNames, ...b.contract.fairPlay.culprits])];
  const sents = b.chapters.flatMap((c) => split((c.paragraphs ?? []).join(" ")).map((s) => ({ ch: c.number, s })));
  for (const { ch, s } of sents) {
    for (const name of names) {
      const off = PE.namesAsCulprit(s, name, people);
      const onv = on(() => PE.namesAsCulprit(s, name, people));
      if (off) { anyOff++; const m = s.match(KILL); if (m) { killOff++; verbsOff[m[1].toLowerCase()] = (verbsOff[m[1].toLowerCase()] ?? 0) + 1; } }
      if (onv) { anyOn++; const m = s.match(KILL); if (m) { killOn++; verbsOn[m[1].toLowerCase()] = (verbsOn[m[1].toLowerCase()] ?? 0) + 1; } }
      if (b.contract.fairPlay.culprits.includes(name)) {
        if (off && !onv) lostTrue.push(`${b.id.slice(0, 22)} ch${ch} [${name} / victim ${b.contract.fairPlay.victim}] ${s.slice(0, 220)}`);
        if (onv) keptTrue.push(`${b.id.slice(0, 22)} ch${ch} ${s.slice(0, 160)}`);
      }
    }
  }
}
console.log({ books: books.length, sentenceNamePairsAcceptedOFF: anyOff, acceptedON: anyOn, ofWhichCarryAKillVerbOFF: killOff, ON: killOn });
console.log("kill verb in accepted sentences OFF", verbsOff);
console.log("kill verb in accepted sentences ON ", verbsOn);
console.log(`\nTRUE culprit: ${keptTrue.length} sentence(s) accepted ON; ${lostTrue.length} accepted OFF and no longer ON:`);
for (const l of lostTrue) console.log("  -", l);
// 3. the gate's culprit stop
let stopOff = 0, stopOn = 0; const newStops = [], cleared = [];
for (const b of books) {
  const expected = b.chapters.map((c) => c.number);
  const v = (flag) => {
    if (flag) process.env.PROSE_V2_AUDIT_FIXES = "1"; else delete process.env.PROSE_V2_AUDIT_FIXES;
    const r = PE.applyGate({ chapters: b.chapters, core: { ...b.contract, fairPlay: { ...b.contract.fairPlay, decisiveClueIds: [] } }, expected, findings: [], deterministicWrites: 0 });
    delete process.env.PROSE_V2_AUDIT_FIXES;
    return r.stops.some((s) => s.startsWith("no chapter"));
  };
  const o = v(false), n = v(true);
  if (o) stopOff++; if (n) stopOn++;
  if (n && !o) newStops.push(`${b.id} reveal ${b.contract.roles.reveal} culprit ${b.contract.fairPlay.culprits.join("/")} victim ${b.contract.fairPlay.victim}`);
  if (o && !n) cleared.push(b.id);
}
console.log(`\nGATE culprit stop over ${books.length} stored books: OFF fires on ${stopOff}, ON on ${stopOn}`);
for (const l of newStops) console.log("  NEW STOP:", l);
for (const l of cleared) console.log("  no longer stops:", l);
