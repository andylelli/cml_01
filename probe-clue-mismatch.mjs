// The ONLY hard-abort in the CML-integrity block (agent9-run.ts:4252) is
// detectLockedFactClueTimeMismatch. It has fired 0 times in 44 archived run reports.
// Is that a clean corpus, or a gate that cannot fire on the times this pipeline writes?
import { detectLockedFactClueTimeMismatch } from "./apps/worker/dist/jobs/agents/agent9-run.js";

const t = (fact, clue) => {
  const r = detectLockedFactClueTimeMismatch(fact, clue);
  console.log(`fact="${fact}"  clue="${clue}"  -> ${r ? r.type + " (" + r.rawClueTime + ")" : "null"}`);
};
console.log("-- KNOWN-POSITIVE: clue carries a digit+meridiem time --");
t("eleven o'clock", "Witness heard a loud noise at 8:30 PM");
t("twenty-five minutes past ten", "The log records the chime at 8:30 PM");

console.log("\n-- WORD-FORM clue times, which is what this pipeline actually produces --");
t("twenty-five minutes past ten", "The log records the chime at half past eight");
t("twenty-five minutes past ten", "The log records the chime at eight o'clock");
t("twenty-five minutes past ten", "The log records the chime at a quarter to nine");
t("twenty-five minutes past ten", "The log records the chime at twenty minutes past eight in the evening");

console.log("\n-- digit time WITHOUT a meridiem --");
t("twenty-five minutes past ten", "The log records the chime at 8:30");
