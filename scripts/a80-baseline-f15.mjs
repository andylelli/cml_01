#!/usr/bin/env node
/**
 * A_80 F15 — baseline the case-level temporal coherence check before it ships.
 *
 *   node scripts/a80-baseline-f15.mjs
 *
 * THE RULE BEING TESTED. When a case declares a shift interval (a clock is running fast or slow by
 * N minutes), every clock time it locks should sit on one side of that shift or the other. A time
 * that is neither the false reading nor its true counterpart — one whose gap to every other locked
 * time is something other than 0 or N — is a time the reader cannot place on the timeline.
 *
 * WHY. Run mystery-1788287075975 locked lobby_clock_time_seen 11:10, pocket_watch_time_found 10:45
 * and suspect_departure_time_reported 11:00, with a 25-minute shift. 11:10 − 25 = 10:45 ✓. But 11:00
 * sits 15 minutes from one and 10 from the other, so corrected it lands at 10:35 — BEFORE the 10:45
 * death, which means the tampering exonerates the suspect instead of incriminating him. The external
 * reader marked the clue logic 4/10 and said "the story still has not decided what Hale's false alibi
 * is". The incoherence is in the locked facts, before any prose exists.
 *
 * The population is the 38 archived `apps/worker/logs/locked-facts-*.json` artifacts. A check that
 * fires on most of them is an off switch with extra steps (CLAUDE.md B1) and must not ship as a gate.
 */
import { readFileSync, readdirSync } from "node:fs";

const DIR = "C:/CML/apps/worker/logs";

// Reuse the pipeline's own parser so the baseline measures what the check will measure.
const { parseClockTime } = await import("file:///C:/CML/packages/cml/dist/timeline-deception.js");

const WORD_MINUTES = {
  five: 5, ten: 10, fifteen: 15, twenty: 20, "twenty-five": 25, thirty: 30, "thirty-five": 35,
  forty: 40, "forty-five": 45, fifty: 50, "fifty-five": 55, sixty: 60, quarter: 15, half: 30,
};
const parseDuration = (raw) => {
  const s = String(raw).toLowerCase();
  if (!/\bminutes?\b|\bhours?\b/.test(s)) return null;
  const digits = s.match(/\b(\d{1,3})\b/);
  if (digits) return Number(digits[1]) * (/\bhours?\b/.test(s) ? 60 : 1);
  for (const [w, n] of Object.entries(WORD_MINUTES)) if (new RegExp(`\\b${w}\\b`).test(s)) return n;
  return null;
};

/** Dial-relative gap, 12-hour circle — the same convention parseClockTime uses. */
const dialGap = (a, b) => {
  const raw = Math.abs(a - b);
  return Math.min(raw, 720 - raw);
};

const files = readdirSync(DIR).filter((f) => f.startsWith("locked-facts-") && f.endsWith(".json"));
let withShift = 0;
let firing = 0;
const details = [];

for (const f of files) {
  let j;
  try { j = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")); } catch { continue; }
  const reg = Array.isArray(j.registry) ? j.registry : [];
  if (reg.length === 0) continue;

  const clocks = reg
    .map((r) => ({ id: r.id, value: r.value, min: parseClockTime(String(r.value ?? "")) }))
    .filter((r) => r.min !== null);
  const shifts = reg
    .map((r) => ({ id: r.id, value: r.value, mins: parseDuration(String(r.value ?? "")) }))
    .filter((r) => r.mins !== null && r.mins > 0 && r.mins < 240);

  if (shifts.length === 0 || clocks.length < 2) continue;
  withShift += 1;

  const shiftSet = new Set(shifts.map((s) => s.mins));
  const unanchored = clocks.filter((c) =>
    !clocks.some((o) => o.id !== c.id && (dialGap(c.min, o.min) === 0 || shiftSet.has(dialGap(c.min, o.min)))),
  );

  if (unanchored.length > 0) {
    firing += 1;
    details.push({
      run: j.runId ?? f,
      shift: [...shiftSet].join("/"),
      clocks: clocks.map((c) => `${c.id}="${c.value}"`),
      unanchored: unanchored.map((c) => `${c.id}="${c.value}"`),
    });
  }
}

console.log(`archived locked-fact artifacts : ${files.length}`);
console.log(`with a shift AND >=2 clock times: ${withShift}   <- the population this check applies to`);
console.log(`F15 would fire on               : ${firing} (${withShift ? ((100 * firing) / withShift).toFixed(1) : 0}%)\n`);

for (const d of details.slice(0, 8)) {
  console.log(`  ${d.run}   shift ${d.shift}m`);
  for (const c of d.clocks) console.log(`      ${d.unanchored.includes(c) ? "UNANCHORED " : "           "}${c}`);
}
