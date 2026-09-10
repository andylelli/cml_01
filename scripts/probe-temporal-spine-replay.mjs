/**
 * ── Would the TEMPORAL SPINE fix the arithmetic, and what would it cost? ─────────────────────────
 *
 * MEASURED CONTEXT: `checkCaseTimeCoherence` fires on 22 of the 50 stored cases (44%) — 19
 * `locked_time_arithmetic`, 9 `time_spines_disagree` — and every one of those cases SHIPPED, because
 * the check only pushes a warning. Eight external reads carry an explicit arithmetic complaint
 * ("From 3:20 to 5:45 is 2 hours 25 minutes, not 1 hour 55 minutes").
 *
 * `temporal-spine.ts` has sat at "Phase 0, nothing reads this" with a full parser, renderer and
 * arithmetic checker. This replays it over every stored case and answers four things, free:
 *
 *   1. READS MORE?  How many time facts does the spine resolve that `parseClockTime` cannot?
 *   2. FINDS MORE?  How many arithmetic faults does it find that X38 misses (X38 knows ONE shape,
 *                   `duration = |A − B|`; the spine knows the inverse and the implied shapes too)?
 *   3. REPAIRABLE?  Of the faults, how many have BOTH a declared and a computed value — i.e. can be
 *                   repaired by writing the computed number back — and how many cannot?
 *   4. HOW WRONG?   The distribution of |declared − computed|. This is the number that decides
 *                   whether deriving silently is safe: a spread of small deltas is rounding, a
 *                   spread of large ones means the model does not understand its own device, and
 *                   silently overwriting it would convert a DETECTABLE fault into an undetectable one.
 *
 * No LLM calls. Reads `data/store.json` only.
 */

import { readFileSync } from "node:fs";
import { buildTemporalSpine } from "../packages/cml/dist/temporal-spine.js";
import { checkCaseTimeCoherence, parseClockTime, parseDurationMinutes } from "../packages/cml/dist/timeline-deception.js";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const byProject = new Map();
for (const a of Object.values(store.artifacts ?? [])) {
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}

let cases = 0;
let x38Cases = 0;
let spineFaultCases = 0;
let timeFacts = 0;
let oldUnreadable = 0;
let spineUnreadable = 0;
const findingsByStatus = {};
const findingsByShape = {};
const deltas = [];
const repairable = [];
const unrepairable = [];

for (const [pid, p] of byProject) {
  const devices = p.hard_logic_devices?.devices;
  if (!Array.isArray(devices) || devices.length === 0 || !p.cml) continue;
  cases += 1;

  const facts = devices.flatMap((d) => d.lockedFacts ?? []);

  // ── 1. what the OLD reader can and cannot resolve ──
  for (const f of facts) {
    const v = String(f?.value ?? "").trim();
    if (!v) continue;
    const temporalish = /\b(o.clock|past|to |quarter|half|minute|hour|midnight|noon|a\.m|p\.m|\d{1,2}:\d{2})\b/i.test(v);
    if (!temporalish) continue;
    timeFacts += 1;
    if (parseClockTime(v) === null && parseDurationMinutes(v) === null) oldUnreadable += 1;
  }

  // ── 2. the OLD check ──
  const g = p.story_geometry?.geometry ?? p.story_geometry;
  const tm = g?.timeModel ?? {};
  const old = checkCaseTimeCoherence({ lockedFacts: facts, apparentTime: tm.apparentTime, actualTime: tm.trueTime });
  if (old.length > 0) x38Cases += 1;

  // ── 3. the SPINE ──
  const spine = buildTemporalSpine(facts);
  spineUnreadable += spine.unreadable.length;
  const faults = spine.findings.filter((f) => f.status === "fails");
  if (faults.length > 0) spineFaultCases += 1;

  for (const f of spine.findings) {
    findingsByStatus[f.status] = (findingsByStatus[f.status] ?? 0) + 1;
    findingsByShape[f.shape] = (findingsByShape[f.shape] ?? 0) + 1;
  }

  for (const f of faults) {
    if (typeof f.declared === "number" && typeof f.computed === "number") {
      const delta = Math.abs(f.declared - f.computed);
      deltas.push(delta);
      repairable.push({ pid: pid.slice(-6), id: f.id, declared: f.declared, computed: f.computed, delta, shape: f.shape });
    } else {
      unrepairable.push({ pid: pid.slice(-6), id: f.id, shape: f.shape, status: f.status, detail: f.detail.slice(0, 90) });
    }
  }
}

const pct = (n, d) => (d > 0 ? `${((100 * n) / d).toFixed(0)}%` : "n/a");

console.log(`\ncases with a device registry + CML : ${cases}`);
console.log(`\n1. READING`);
console.log(`   temporal-looking locked facts          : ${timeFacts}`);
console.log(`   unreadable by the OLD parser           : ${oldUnreadable} (${pct(oldUnreadable, timeFacts)})`);
console.log(`   unreadable by the SPINE                : ${spineUnreadable} (${pct(spineUnreadable, timeFacts)})`);

console.log(`\n2. FINDING`);
console.log(`   cases the OLD check flags              : ${x38Cases} (${pct(x38Cases, cases)})`);
console.log(`   cases the SPINE flags as FAILING       : ${spineFaultCases} (${pct(spineFaultCases, cases)})`);
console.log(`   finding status across all cases        : ${JSON.stringify(findingsByStatus)}`);
console.log(`   arithmetic shapes seen                 : ${JSON.stringify(findingsByShape)}`);

console.log(`\n3. REPAIRABLE?`);
console.log(`   faults carrying BOTH declared+computed : ${repairable.length}  <- writable back, no LLM`);
console.log(`   faults missing one of them             : ${unrepairable.length}  <- cannot be silently repaired`);

// ── 5. CLASSIFY each fault: only one class is safe to repair by arithmetic ──
//
// MEASURED on the two extremes, and the reason the naive "derive the third number" plan fails:
//   850327  high_tide_time "ten minutes past midnight" / victim_last_seen "a quarter to midnight"
//           -> computed 1415m. The two sit either side of MIDNIGHT and neither states its day, so
//           the arithmetic is meaningless rather than merely wrong. Writing 1415 back would bake a
//           parse ambiguity into the case as though it were a fact.
//   673112  call sheet "a quarter to six on the evening prior" + "one hour and fifty-five minutes"
//           = "twenty past three on the murder day". No day assignment makes those three agree; the
//           authoring is incoherent, so there IS no correct third number to derive.
//
// A repair must therefore be gated on the computed value being PLAUSIBLE for its kind, and every
// other fault routed to a different remedy — a prompt operation, or a regenerated device.
const PLAUSIBLE_MAX_MINUTES = 240;
const classify = (r) => {
  if (r.computed < 0) return "incoherent — no day assignment works (regenerate the device)";
  if (r.computed > PLAUSIBLE_MAX_MINUTES) return "ambiguous parse — midnight/daypart unstated (disambiguate at 3b)";
  return "arithmetic-only — SAFE to derive and write back";
};
const classes = {};
for (const r of repairable) {
  const c = classify(r);
  classes[c] = (classes[c] ?? 0) + 1;
}
console.log(`\n5. CLASSIFIED — what an automatic repair may and may not touch`);
for (const [c, n] of Object.entries(classes).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${String(n).padStart(2)}  ${c}`);
}

console.log(`\n4. HOW WRONG (|declared - computed|, minutes)`);
if (deltas.length > 0) {
  const sorted = [...deltas].sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  const small = deltas.filter((d) => d <= 5).length;
  console.log(`   n=${deltas.length}  min ${sorted[0]}  median ${med}  max ${sorted[sorted.length - 1]}`);
  console.log(`   within 5 minutes (rounding-ish)        : ${small} (${pct(small, deltas.length)})`);
  console.log(`   more than 30 minutes out               : ${deltas.filter((d) => d > 30).length}`);
  console.log(`\n   the ten largest:`);
  for (const r of repairable.sort((a, b) => b.delta - a.delta).slice(0, 10)) {
    console.log(`     ${r.pid}  ${String(r.id).padEnd(34)} declared ${String(r.declared).padStart(5)}  computed ${String(r.computed).padStart(5)}  Δ${r.delta}  [${r.shape}]`);
  }
} else {
  console.log(`   (none)`);
}
if (unrepairable.length > 0) {
  console.log(`\n   faults that CANNOT be repaired by arithmetic alone (first 5):`);
  for (const u of unrepairable.slice(0, 5)) console.log(`     ${u.pid}  ${u.id} [${u.shape}] ${u.detail}`);
}
