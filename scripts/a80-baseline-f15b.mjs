#!/usr/bin/env node
/**
 * A_80 F15, second attempt — narrow the rule until it is a signal rather than a switch.
 *
 * The first rule ("every locked clock time must sit on the declared shift") fired on 74.2% of the 31
 * applicable archived cases. That is an off switch with extra steps (CLAUDE.md B1), and the reason is
 * plain in the data: a witness time, a chime, a note time can be legitimately independent of the
 * tampered clock. Requiring every time to sit on the shift asserts something the genre does not.
 *
 * This tests two much narrower rules, each aimed at a relation that MUST hold for the mechanism to
 * work at all:
 *
 *   R1 FALSE/TRUE PAIR. If the registry names both a displayed/false time and an actual/real/true
 *      time, they must differ by exactly the declared shift. If they do not, the case's own headline
 *      arithmetic is wrong.
 *
 *   R2 INVERSION. If a suspect's reported departure/alibi time is read from the tampered clock, then
 *      corrected by the shift it must NOT fall before the death. If it does, the tampering EXONERATES
 *      the suspect rather than incriminating him — the mechanism is backwards. This is what run
 *      mystery-1788287075975 shipped, and what the external reader marked 4/10.
 */
import { readFileSync, readdirSync } from "node:fs";

const DIR = "C:/CML/apps/worker/logs";
const { parseClockTime } = await import("file:///C:/CML/packages/cml/dist/timeline-deception.js");

const WORD_MINUTES = {
  five: 5, ten: 10, fifteen: 15, twenty: 20, "twenty-five": 25, thirty: 30, "thirty-five": 35,
  forty: 40, "forty-five": 45, fifty: 50, "fifty-five": 55, quarter: 15, half: 30,
};
const parseDuration = (raw) => {
  const s = String(raw).toLowerCase();
  if (!/\bminutes?\b|\bhours?\b/.test(s)) return null;
  const d = s.match(/\b(\d{1,3})\b/);
  if (d) return Number(d[1]) * (/\bhours?\b/.test(s) ? 60 : 1);
  for (const [w, n] of Object.entries(WORD_MINUTES)) if (new RegExp(`\\b${w}\\b`).test(s)) return n;
  return null;
};
const dialGap = (a, b) => { const r = Math.abs(a - b); return Math.min(r, 720 - r); };

const FALSE_RE = /false|displayed|shown|clock_time|lobby_clock|apparent|staged/i;
const TRUE_RE = /actual|real|true_time|time_of_death|died/i;
const DEATH_RE = /death|murder|killed|died|victim|body/i;
const ALIBI_RE = /departure|departed|alibi|left|seen|witness/i;

const files = readdirSync(DIR).filter((f) => f.startsWith("locked-facts-") && f.endsWith(".json"));
let pop = 0, r1pop = 0, r1fire = 0, r2pop = 0, r2fire = 0;
const r1d = [], r2d = [];

for (const f of files) {
  let j; try { j = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")); } catch { continue; }
  const reg = Array.isArray(j.registry) ? j.registry : [];
  const label = (r) => `${r.id ?? ""} ${r.description ?? ""}`;
  const clocks = reg.map((r) => ({ ...r, min: parseClockTime(String(r.value ?? "")) })).filter((r) => r.min !== null);
  const shifts = reg.map((r) => parseDuration(String(r.value ?? ""))).filter((n) => n !== null && n > 0 && n < 240);
  if (shifts.length === 0 || clocks.length < 2) continue;
  pop += 1;
  const shiftSet = new Set(shifts);

  // R1 — false/true pair
  const falseT = clocks.find((c) => FALSE_RE.test(label(c)));
  const trueT = clocks.find((c) => TRUE_RE.test(label(c)) && c.id !== falseT?.id);
  if (falseT && trueT) {
    r1pop += 1;
    const g = dialGap(falseT.min, trueT.min);
    if (!shiftSet.has(g)) {
      r1fire += 1;
      if (r1d.length < 6) r1d.push(`${j.runId}: ${falseT.id}="${falseT.value}" vs ${trueT.id}="${trueT.value}" gap ${g}m, shift ${[...shiftSet].join("/")}m`);
    }
  }

  // R2 — inversion
  const death = clocks.find((c) => DEATH_RE.test(label(c)));
  const alibi = clocks.find((c) => ALIBI_RE.test(label(c)) && c.id !== death?.id);
  if (death && alibi) {
    r2pop += 1;
    for (const s of shiftSet) {
      const corrected = alibi.min - s;
      if (corrected < death.min) {
        r2fire += 1;
        if (r2d.length < 6) r2d.push(`${j.runId}: ${alibi.id}="${alibi.value}" −${s}m = before ${death.id}="${death.value}"`);
        break;
      }
    }
  }
}

const pc = (n, d) => (d ? `${((100 * n) / d).toFixed(1)}%` : "n/a");
console.log(`applicable cases (shift + >=2 clock times): ${pop} of ${files.length}\n`);
console.log(`R1 false/true pair differs by the shift`);
console.log(`   applies to ${r1pop} cases, fires on ${r1fire} (${pc(r1fire, r1pop)})`);
for (const d of r1d) console.log(`     ${d}`);
console.log(`\nR2 corrected alibi falls before the death (mechanism inverted)`);
console.log(`   applies to ${r2pop} cases, fires on ${r2fire} (${pc(r2fire, r2pop)})`);
for (const d of r2d) console.log(`     ${d}`);
