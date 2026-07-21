#!/usr/bin/env node
// A_64 B7 follow-up — C3 offline wiring verification against the PROBE'S OWN outline + cast.
// The probe ran with a stale prompts-llm dist (C3 absent); rather than spend a second run, replay
// the probe's real Agent-7 scenes and Agent-3 cast through the REBUILT obligation block and assert
// the spine + one-question contract render where the register matches. Deterministic; corpus-era.
import fs from "fs";
import { buildChapterObligationBlock } from "file:///C:/CML/packages/prompts-llm/dist/agent9-prose/obligation-block.js";

const dir = "C:/CML/documentation/prompts/actual/run_20260721-1931_mystery";

function extractJson(md) {
  const body = md.slice(md.indexOf("## Response Body"));
  const t1 = body.indexOf("```");
  const start = body.indexOf("\n", t1) + 1;
  const t2 = body.lastIndexOf("```");
  return JSON.parse(body.slice(start, t2).trim());
}

const a7 = extractJson(fs.readFileSync(`${dir}/16_Agent7-NarrativeFormatter_response.md`, "utf8"));
const a3 = extractJson(fs.readFileSync(`${dir}/06_Agent3-CMLGenerator_response.md`, "utf8"));
const cmlCase = a3.CASE ?? a3;

const scenes = (a7.acts ?? []).flatMap((act) =>
  (act.scenes ?? []).map((s) => ({ ...s, act: s.act ?? act.actNumber })),
);
console.log(`scenes=${scenes.length} castWithAlibi=${(cmlCase.cast ?? []).filter((c) => String(c.alibi_window ?? "").trim()).length}`);

let spineChapters = [];
let oneQChapters = [];
scenes.forEach((scene, i) => {
  const block = buildChapterObligationBlock(
    [scene], i + 1, cmlCase, [], undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, scenes, undefined,
  );
  if (block.includes("TIMELINE SPINE")) spineChapters.push(`${i + 1}:${scene.title}`);
  if (block.includes("ONE-QUESTION RULE")) oneQChapters.push(`${i + 1}:${scene.title}`);
});
console.log(`TIMELINE SPINE renders in: ${spineChapters.join(" | ") || "NONE"}`);
console.log(`ONE-QUESTION renders in:   ${oneQChapters.join(" | ") || "NONE"}`);
console.log(spineChapters.length > 0 && oneQChapters.length > 0 ? "C3 OFFLINE WIRING: PASS" : "C3 OFFLINE WIRING: FAIL");
