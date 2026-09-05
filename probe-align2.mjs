import { readFileSync } from "fs";
import { checkLockedFactTimeAlignment } from "./apps/worker/dist/jobs/agents/agent3-run.js";

const reg = JSON.parse(readFileSync("C:/CML/apps/worker/logs/locked-facts-mystery-1788202899854.json", "utf8")).registry;

// What the call at agent3-run.ts:247 actually sees: ctx.cml is not assigned until line 318.
console.log("ctx.cml === undefined  ->", JSON.stringify(checkLockedFactTimeAlignment({ lockedFactRegistry: reg, cml: undefined })));
console.log("ctx.cml === {}         ->", JSON.stringify(checkLockedFactTimeAlignment({ lockedFactRegistry: reg, cml: {} })));
// Same registry, cml present (what line 318 onwards would see):
const withCml = { lockedFactRegistry: reg, cml: { CASE: { hidden_model: { mechanism: { apparent_time_of_death: "twenty-five minutes past ten", actual_time_of_death: "half past ten" } } } } };
console.log("ctx.cml populated      ->", checkLockedFactTimeAlignment(withCml).length, "finding(s)");
