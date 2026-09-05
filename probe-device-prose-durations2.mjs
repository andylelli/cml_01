// PRECISE population at risk: a locked fact whose value is a word-form DURATION,
// whose number is ALSO restated as a duration inside the device's free-prose fields.
// Those prose fields are what packages/prompts-llm/src/agent3-cml.ts:251 puts in the Agent 3 prompt,
// and X38's repair (apps/worker/src/jobs/agents/agent3b-run.ts:264-283) never rewrites them.
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";

const ROOT = "C:/CML/documentation/prompts/actual";
const PROSE_FIELDS = ["corePrinciple", "surfaceIllusion", "underlyingReality", "whyNotTrope", "variationEscalation"];
const NUMWORD = "(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|twenty-five|thirty-five|forty-five|fifty-five|twenty-one|\\d{1,3})";
const NUM_DUR_RE = new RegExp("\\b((?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-(?:one|two|three|four|five|six|seven|eight|nine)|" + NUMWORD + ")[\\s-]+minutes?\\b", "gi");

const readJson = (text) => {
  const i = text.indexOf("{", text.indexOf("## Response Body"));
  if (i < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let k = i; k < text.length; k++) {
    const c = text[k];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { try { return JSON.parse(text.slice(i, k + 1)); } catch { return null; } } }
  }
  return null;
};

const dirsUnder = (p) => readdirSync(p).map((x) => join(p, x)).filter((x) => statSync(x).isDirectory());
const allDirs = [...dirsUnder(ROOT), ...dirsUnder(ROOT).filter((x) => /archive/i.test(x)).flatMap(dirsUnder)];

let devices = 0, lockDur = 0, lockDurDerived = 0, restated = 0, restatedDerived = 0;
const detail = [];
for (const d of allDirs) {
  const f = existsSync(d) && readdirSync(d).find((x) => /Agent3b-HardLogicDeviceGenerator_response/.test(x));
  if (!f) continue;
  const obj = readJson(readFileSync(join(d, f), "utf8"));
  const dev = obj?.devices?.[0];
  if (!dev) continue;
  devices++;
  const facts = Array.isArray(dev.lockedFacts) ? dev.lockedFacts : [];
  // a DURATION-valued fact = the whole value is "<number word> minutes"
  const durFacts = facts.filter((x) => new RegExp("^" + NUMWORD.replace("\\d{1,3}", "\\d{1,3}") + "[\\s-]+minutes?$", "i").test(String(x?.value ?? "").trim()));
  if (!durFacts.length) continue;
  lockDur++;
  const anyDerived = durFacts.some((x) => Array.isArray(x.derivedFrom) && x.derivedFrom.length === 2);
  if (anyDerived) lockDurDerived++;
  const prose = PROSE_FIELDS.map((k) => String(dev[k] ?? ""))
    .concat(Array.isArray(dev.fairPlayClues) ? dev.fairPlayClues.map(String) : [])
    .join(" || ");
  const hits = [...prose.matchAll(NUM_DUR_RE)].map((m) => m[0].toLowerCase());
  const echoed = durFacts.filter((x) => hits.some((h) => h.replace(/\s+/g, " ") === String(x.value).toLowerCase().replace(/\s+/g, " ")));
  if (echoed.length) {
    restated++;
    if (anyDerived) restatedDerived++;
    detail.push(`${d.split(/[\\/]/).pop().padEnd(30)} derivedFrom=${anyDerived ? "YES" : "no "}  locked ${echoed.map((x) => `${x.id}="${x.value}"`).join(", ")}  restated in prose: ${hits.join(", ")}`);
  }
}
console.log(`archived primary devices read                       : ${devices}`);
console.log(`  ...that lock a word-form DURATION fact            : ${lockDur}`);
console.log(`  ...of those, the duration declares derivedFrom[2] : ${lockDurDerived}   <- the only ones X38 can repair`);
console.log(`  ...that ALSO restate that duration in free prose  : ${restated}   (${(100 * restated / lockDur).toFixed(0)}% of duration-locking devices)`);
console.log(`  ...restating AND repairable (the exposed set)     : ${restatedDerived}`);
console.log("");
for (const l of detail) console.log("  " + l);
