import { readFileSync } from "fs";
import { checkLockedFactTimeAlignment } from "./apps/worker/dist/jobs/agents/agent3-run.js";
import { parseClockTime } from "./packages/cml/dist/index.js";

const reg = JSON.parse(readFileSync("C:/CML/apps/worker/logs/locked-facts-mystery-1788202899854.json", "utf8")).registry;
console.log("registry ids:", reg.map((f) => f.id).join(", "));
console.log("parseClockTime checks:");
for (const f of reg) console.log(`   ${f.id.padEnd(32)} "${f.value}" -> ${parseClockTime(f.value)}`);

const mech = { apparent_time_of_death: "twenty-five minutes past ten", actual_time_of_death: "half past ten" };
const ctx = { lockedFactRegistry: reg, cml: { CASE: { hidden_model: { mechanism: mech } } } };
console.log("\nREAL 08-31 case ->", JSON.stringify(checkLockedFactTimeAlignment(ctx), null, 1));

// KNOWN-POSITIVE control: move the mechanism's apparent time away from the staged locked fact.
const ctx2 = { lockedFactRegistry: reg, cml: { CASE: { hidden_model: { mechanism: { apparent_time_of_death: "eight o'clock", actual_time_of_death: "half past ten" } } } } };
console.log("\nCONTROL (apparent moved to eight o'clock) ->", JSON.stringify(checkLockedFactTimeAlignment(ctx2), null, 1));

// The 08-30 run, real registry, mechanism anchors as reported by the X38 Agent 7.5 warning.
const reg30 = JSON.parse(readFileSync("C:/CML/apps/worker/logs/locked-facts-mystery-1788111325659.json", "utf8")).registry;
const ctx3 = { lockedFactRegistry: reg30, cml: { CASE: { hidden_model: { mechanism: { apparent_time_of_death: "ten minutes past eleven", actual_time_of_death: "twenty-five minutes past ten" } } } } };
console.log("\nREAL 08-30 case ->", JSON.stringify(checkLockedFactTimeAlignment(ctx3), null, 1));
