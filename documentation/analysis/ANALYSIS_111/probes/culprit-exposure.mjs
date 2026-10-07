#!/usr/bin/env node
/**
 * A_111 P-11 — how early does a case's contract point at the culprit? For each chapter's rendered contract: lines that
 * name the culprit (full name or surname). Before the test chapter, every such line is a chance for the writer to frame
 * them early — the P-6 arm C reader's one named loss ("names and frames Ivor very strongly from the beginning").
 * Arm C's flags with and without PROSE_V2_SCHEDULE.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/culprit-exposure.mjs <projectId>
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
const run = await import(pathToFileURL(`${process.cwd()}/apps/worker/dist/jobs/agents/agent9-v2/run.js`).href);
const pid = process.argv[2];
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const a = {};
for (const x of Object.values(store.artifacts)) if (x.projectId === pid && !a[x.type]) a[x.type] = x.payload; // the source run's own rows
const input = { cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: a.hard_logic_devices?.devices?.[0]?.lockedFacts ?? [], humourLevel: "classic", targetLength: "short" };
const C = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1", CML_IDENTITY_ROLE_WINS: "1", PROSE_V2_CONTRACT_FIXES: "1", PROSE_V2_OPENING: "1", PROSE_V2_SELECTOR_RANKS: "1", PROSE_V2_TAIL_FINDING: "1", PROSE_V2_AUDIT_FIXES: "1" };
for (const [label, extra] of [["arm C", {}], ["arm C + PROSE_V2_SCHEDULE", { PROSE_V2_SCHEDULE: "1" }]]) {
  for (const k of [...Object.keys(C), "PROSE_V2_SCHEDULE"]) delete process.env[k];
  Object.assign(process.env, C, extra);
  const k = pe.buildBookContract(input);
  const culprit = (k.fairPlay?.culprits ?? [])[0] ?? "";
  const surname = culprit.split(/\s+/).at(-1);
  const test = k.roles?.discriminatingTest ?? k.roles?.reveal;
  const per = k.scenes.map((s) => {
    const lines = run.renderSceneContract(k, s.chapter).split("\n").filter((l) => new RegExp(`\\b${surname}\\b`).test(l));
    return { ch: s.chapter, n: lines.length, sample: lines.find((l) => !/On the page|is on the page/i.test(l)) ?? "" };
  });
  const before = per.filter((p) => p.ch < test);
  console.log(`${label.padEnd(28)} culprit ${culprit} · test ch ${test} · lines naming the culprit before the test: ${before.reduce((n, p) => n + p.n, 0)} (per chapter ${before.map((p) => p.n).join(",")})`);
  for (const p of before.filter((p) => p.sample).slice(0, 3)) console.log(`   ch${p.ch}: ${p.sample.trim().slice(0, 150)}`);
}
