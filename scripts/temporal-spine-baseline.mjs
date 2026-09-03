/**
 * PHASE 0 BASELINE — is a dedicated timing subsystem worth building?
 *
 * Runs the temporal spine in SHADOW over every archived run. Nothing in the pipeline reads the spine;
 * this only measures what it would have found. Pairing is by projectId (never by name — that error
 * has produced two confident wrong answers in this project already).
 *
 *   node scripts/temporal-spine-baseline.mjs
 */
import { readFileSync } from "node:fs";
import { buildTemporalSpine, parseTemporalValue } from "../packages/cml/dist/temporal-spine.js";
import { parseClockTime } from "../packages/cml/dist/timeline-deception.js";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const artifacts = store.artifacts ?? [];

const byProject = new Map();
for (const a of artifacts) {
  const key = String(a.projectId ?? a.runId ?? "");
  if (!key) continue;
  if (!byProject.has(key)) byProject.set(key, {});
  byProject.get(key)[String(a.kind ?? a.type ?? "")] = a.payload;
}

const collectFacts = (node, out = [], d = 0) => {
  if (!node || d > 8) return out;
  if (Array.isArray(node)) { for (const n of node) collectFacts(n, out, d + 1); return out; }
  if (typeof node !== "object") return out;
  if (typeof node.value === "string" && (node.id !== undefined || node.description !== undefined)) out.push(node);
  for (const v of Object.values(node)) collectFacts(v, out, d + 1);
  return out;
};

const TIME_SHAPED =
  /\b(?:o'clock|past|to\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|minutes?|hours?|midnight|noon)\b/i;

let runs = 0;
let runsWithDeclarations = 0;
const status = { closes: 0, fails: 0, underspecified: 0, unreadable: 0 };
let runsAllClose = 0;
let runsAnyProblem = 0;
let timeFacts = 0;
let silentlyMisread = 0;
let qualifierCarrying = 0;
const misreadExamples = [];
const failExamples = [];

for (const [projectId, slot] of byProject) {
  const source = slot.hard_logic_devices ?? slot.cml;
  if (!source) continue;
  const facts = collectFacts(source);
  if (facts.length === 0) continue;
  runs++;

  const spine = buildTemporalSpine(facts);

  // Metric: values the OLD parser reads confidently but wrongly, because it drops the qualifier.
  for (const f of facts) {
    const value = String(f.value ?? "");
    if (!TIME_SHAPED.test(value)) continue;
    timeFacts++;
    const reading = parseTemporalValue(value);
    if (!reading) continue;
    if (reading.dayOffset !== 0 || reading.meridiem === "pm") {
      qualifierCarrying++;
      const old = parseClockTime(value);
      const trueAbsolute = reading.dayOffset * 1440 + reading.minutes;
      if (old !== null && old !== trueAbsolute) {
        silentlyMisread++;
        if (misreadExamples.length < 6) {
          misreadExamples.push(`${projectId} ${f.id}="${value}" old=${old} true=${trueAbsolute} (off by ${trueAbsolute - old}m)`);
        }
      }
    }
  }

  if (spine.findings.length > 0) {
    runsWithDeclarations++;
    let bad = 0;
    for (const finding of spine.findings) {
      status[finding.status] = (status[finding.status] ?? 0) + 1;
      if (finding.status !== "closes") bad++;
      if (finding.status === "fails" && failExamples.length < 6) {
        failExamples.push(`${projectId} ${finding.id}: ${finding.detail}`);
      }
    }
    if (bad === 0) runsAllClose++;
    else runsAnyProblem++;
  }
}

const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) + "%" : "n/a");

console.log("=".repeat(76));
console.log("TEMPORAL SPINE — PHASE 0 BASELINE (shadow; nothing in the pipeline reads this)");
console.log("=".repeat(76));
console.log(`\nruns with a device/CML artifact carrying locked facts : ${runs}`);
console.log(`runs declaring at least one derivedFrom              : ${runsWithDeclarations}  (${pct(runsWithDeclarations, runs)})`);
console.log(`  of those, every declaration closes                 : ${runsAllClose}  (${pct(runsAllClose, runsWithDeclarations)})`);
console.log(`  of those, at least one does NOT                    : ${runsAnyProblem}  (${pct(runsAnyProblem, runsWithDeclarations)})`);

console.log(`\ndeclared derivations, by outcome:`);
for (const [k, v] of Object.entries(status)) console.log(`  ${k.padEnd(16)} ${String(v).padStart(4)}`);

console.log(`\ntime-shaped locked-fact values                       : ${timeFacts}`);
console.log(`  carrying a day/daypart qualifier                   : ${qualifierCarrying}  (${pct(qualifierCarrying, timeFacts)})`);
console.log(`  SILENTLY MISREAD by parseClockTime today           : ${silentlyMisread}  (${pct(silentlyMisread, timeFacts)})`);

/**
 * THE HONEST CAVEAT, measured rather than asserted.
 *
 * `parseClockTime` is dial-relative BY DESIGN and `dialGapMinutes` compares on the dial, so when two
 * times share a daypart the dropped 12 hours CANCELS and the gap is still right. A raw "misread"
 * count therefore overstates the live damage.
 *
 * The comparison is only unsafe where a run MIXES frames — two instants with different dayOffsets,
 * or one pm beside one whose daypart the case never stated. That is the population where dropping
 * the qualifier changes an answer, and it is the number worth acting on.
 */
let runsMixedFrame = 0;
let runsWithMultipleTimes = 0;
const mixedExamples = [];
for (const [projectId, slot] of byProject) {
  const source = slot.hard_logic_devices ?? slot.cml;
  if (!source) continue;
  const readings = collectFacts(source)
    .filter((f) => TIME_SHAPED.test(String(f.value ?? "")))
    .map((f) => ({ id: f.id, r: parseTemporalValue(String(f.value ?? "")), value: f.value }))
    .filter((x) => x.r);
  if (readings.length < 2) continue;
  runsWithMultipleTimes++;
  const frames = new Set(readings.map((x) => `${x.r.dayOffset}|${x.r.meridiem}`));
  if (frames.size > 1) {
    runsMixedFrame++;
    if (mixedExamples.length < 5) {
      mixedExamples.push(
        `${projectId}: ${readings.map((x) => `${x.id}[d${x.r.dayOffset},${x.r.meridiem}]`).join("  ")}`,
      );
    }
  }
}
console.log(`\nruns with 2+ readable time facts                      : ${runsWithMultipleTimes}`);
console.log(`  MIXING frames (day offset or meridiem disagree)    : ${runsMixedFrame}  (${pct(runsMixedFrame, runsWithMultipleTimes)})`);
console.log(`  ^ these are the runs where dropping the qualifier CHANGES an answer;`);
console.log(`    where every time shares a frame, the dial comparison cancels and is safe.`);
if (mixedExamples.length) {
  console.log(`\n  examples of a mixed-frame run:`);
  for (const e of mixedExamples) console.log(`    ${e}`);
}

if (misreadExamples.length) {
  console.log(`\n  examples of a confident WRONG answer today:`);
  for (const e of misreadExamples) console.log(`    ${e}`);
}
if (failExamples.length) {
  console.log(`\n  examples of arithmetic that does not close:`);
  for (const e of failExamples) console.log(`    ${e}`);
}
console.log();
