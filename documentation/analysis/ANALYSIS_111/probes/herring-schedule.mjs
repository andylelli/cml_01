#!/usr/bin/env node
/**
 * A_111 F-1 — where PROSE_V2_HERRINGS puts each red herring, over every stored case (deduped by cast).
 * Counts: herrings in the CML, scheduled (noticed AND explained), noticed in a chapter the pointed-at person is on the
 * page in, explained at the case's own resolved_in_chapter, explained before the reveal, and the rendered lines present
 * in the writer prompt. Known positive: seed 82094 (canary_1790962241799), whose two herrings were bible-only.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/herring-schedule.mjs [--list]
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
const run = await import(pathToFileURL(`${process.cwd()}/apps/worker/dist/jobs/agents/agent9-v2/run.js`).href);
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const by = new Map();
for (const a of Object.values(store.artifacts)) { if (!by.has(a.projectId)) by.set(a.projectId, {}); const o = by.get(a.projectId); if (!o[a.type]) o[a.type] = a.payload; }
const build = (a, on) => {
  if (on) process.env.PROSE_V2_HERRINGS = "1"; else delete process.env.PROSE_V2_HERRINGS;
  return pe.buildBookContract({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: "classic", targetLength: "short" });
};
const seen = new Set();
const n = { cases: 0, herrings: 0, scheduled: 0, withPerson: 0, atResolved: 0, beforeReveal: 0, rendered: 0, offIdentical: 0 };
const list = [];
for (const [pid, a] of by) {
  if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
  const key = ((a.cast?.cast ?? a.cast)?.characters ?? []).map((c) => c.name).sort().join("|");
  if (seen.has(key)) continue;
  let on, off;
  try { off = build(a, false); on = build(a, true); } catch { continue; }
  seen.add(key);
  n.cases++;
  if (run.renderSceneContract(off, 1) === (delete process.env.PROSE_V2_HERRINGS, run.renderSceneContract(build(a, false), 1))) n.offIdentical++;
  const herrings = ((a.cml.CASE ?? a.cml).red_herrings ?? []);
  n.herrings += herrings.length;
  for (const h of herrings) {
    const noticed = on.scenes.find((s) => (s.herrings ?? []).some((x) => x.detail === String(h.description).replace(/\s+/g, " ").trim()));
    const explained = on.scenes.find((s) => (s.herringsExplained ?? []).some((x) => x.detail === String(h.description).replace(/\s+/g, " ").trim()));
    if (!noticed || !explained) { list.push(`UNSCHEDULED ${pid.slice(0, 20)} ${String(h.description).slice(0, 70)}`); continue; }
    n.scheduled++;
    if (noticed.present.includes(h.points_at_suspect)) n.withPerson++;
    if (explained.chapter === h.resolved_in_chapter) n.atResolved++;
    if (explained.chapter < on.roles.reveal) n.beforeReveal++;
    process.env.PROSE_V2_HERRINGS = "1";
    const lineN = run.renderSceneContract(on, noticed.chapter), lineE = run.renderSceneContract(on, explained.chapter);
    if (lineN.includes("Noticed here, and not explained yet") && lineE.includes("Explained here, as the innocent thing it was")) n.rendered++;
    list.push(`${pid.slice(0, 20)} noticed ch${noticed.chapter} explained ch${explained.chapter} (resolved ${h.resolved_in_chapter}, test ${on.roles.discriminatingTest}, reveal ${on.roles.reveal}) — ${String(h.description).slice(0, 60)}`);
  }
}
delete process.env.PROSE_V2_HERRINGS;
console.log(JSON.stringify(n));
if (process.argv.includes("--list")) console.log(list.join("\n"));
