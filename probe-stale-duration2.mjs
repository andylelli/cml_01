import { readFileSync, readdirSync } from "fs";
import { join } from "path";
const ROOT = "C:/CML/documentation/prompts/actual";
const CASES = [
  ["run_20260830-1735_mystery", "clock_shift_interval", "thirty-five minutes", "fifty-five minutes"],
  ["run_20260831-1901_mystery", "clock_shift_interval", "twenty-five minutes", "five minutes"],
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Count ONLY duration uses: the phrase NOT followed by "past"/"to" (which makes it a clock reading).
const durationHits = (text, phrase) =>
  [...text.matchAll(new RegExp(esc(phrase) + "(?!\\s+(?:past|to)\\b)", "gi"))].length;

for (const [dir, id, before, after] of CASES) {
  const d = join(ROOT, dir);
  console.log(`\n## ${dir}  ${id}: "${before}" -> "${after}"  (duration uses only)`);
  for (const f of readdirSync(d).filter((x) => /Agent3b-HardLogic.*response|Agent3-CMLGenerator/.test(x))) {
    const t = readFileSync(join(d, f), "utf8");
    console.log(`   ${f.padEnd(46)} STALE=${durationHits(t, before)}  REPAIRED=${durationHits(t, after)}`);
  }
}

const ctrl = "wound backward by exactly twenty-five minutes ... twenty-five minutes past ten ... twenty-five minutes past ten";
console.log(`\n[control] duration hits for "twenty-five minutes" in a string with 1 duration + 2 clock uses = ${durationHits(ctrl, "twenty-five minutes")} (expect 1)`);
console.log(`[control] duration hits for "five minutes" in "five minutes" = ${durationHits("five minutes", "five minutes")} (expect 1)`);
