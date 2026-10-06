#!/usr/bin/env node
/**
 * A_111 — when are the innocent suspects cleared, relative to the test and the reveal? (the P-6 self-read: "all three
 * suspects cleared by chapter 4, so there is no whodunit after it"). Every stored case's contract, PROSE_V2_AUDIT_FIXES
 * off and on (V-7 moves a clearance to the first clearance chapter with the suspect on the page).
 *
 *   node documentation/analysis/ANALYSIS_111/probes/clearance-timing.mjs [projectId]
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const by = new Map();
for (const a of Object.values(store.artifacts)) { if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const only = process.argv[2];
const SHIPPED = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1", CML_IDENTITY_ROLE_WINS: "1" };
const ARM_C = { ...SHIPPED, PROSE_V2_CONTRACT_FIXES: "1", PROSE_V2_OPENING: "1", PROSE_V2_SELECTOR_RANKS: "1", PROSE_V2_TAIL_FINDING: "1" };
const run = (env) => {
  for (const k of ["PROSE_V2_AUDIT_FIXES", ...Object.keys(ARM_C)]) delete process.env[k];
  Object.assign(process.env, env);
  const out = [];
  for (const [id, a] of by) {
    if (only && id !== only) continue;
    if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
    const input = { cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: a.hard_logic_devices?.devices?.[0]?.lockedFacts ?? [], humourLevel: "classic", targetLength: "short" };
    let k;
    try { k = pe.buildBookContract(input); } catch { continue; }
    const scenes = k.scenes ?? k.core?.scenes ?? [];
    const roles = k.core?.roles ?? k.roles ?? {};
    const cleared = scenes.flatMap((s) => (s.eliminationsAllowed ?? []).map((e) => s.chapter));
    if (!cleared.length) continue;
    const test = roles.test ?? roles.discriminatingTest ?? roles.reveal;
    out.push({ id, n: scenes.length, test, reveal: roles.reveal, cleared, lastClear: Math.max(...cleared), firstClear: Math.min(...cleared) });
  }
  return out;
};
for (const [label, env] of [["arm C, audit off", ARM_C], ["arm C + PROSE_V2_AUDIT_FIXES", { ...ARM_C, PROSE_V2_AUDIT_FIXES: "1" }]]) {
  const rows = run(env);
  const share = (f) => `${rows.filter(f).length}/${rows.length}`;
  const meanFrac = (rows.reduce((s, r) => s + r.lastClear / r.n, 0) / rows.length).toFixed(2);
  console.log(`${label.padEnd(30)} cases ${rows.length} · every clearance by the book's first half: ${share((r) => r.lastClear <= r.n / 2)} · last clearance at mean ${meanFrac} of the book · mean clearance chapter ${(rows.reduce((s, r) => s + r.cleared.reduce((a, b) => a + b, 0) / r.cleared.length / r.n, 0) / rows.length).toFixed(2)}`);
  if (only) for (const r of rows) console.log(`   ${r.id}: cleared in chapters ${r.cleared.join(",")} · test ${r.test} · reveal ${r.reveal} of ${r.n}`);
}
