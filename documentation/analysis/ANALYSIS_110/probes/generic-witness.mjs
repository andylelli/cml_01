// A_110 — is each built step-0 item generic? Runs the real contract from dist over EVERY stored project,
// PROSE_V2_CONTRACT_FIXES OFF and ON, and reports per-case witnesses for the items the nine contract rules do
// not cover: W1 (a where-and-when line from the case's own artifacts), R2 (relationship pairs reaching the
// bible), and whether the contract builds at all. One run motivated these items; the archive is their test.
// Run from the repo root after `npm run build:all`:  node documentation/analysis/ANALYSIS_110/probes/generic-witness.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";
process.env.CML_VERIFIED_FIXES = "true";
const here = (p) => pathToFileURL(`${process.cwd()}/${p}`).href;
const pe = await import(here("packages/prose-engine/dist/index.js"));
const store = JSON.parse(fs.readFileSync("data/store.json", "utf8"));
const by = new Map(); for (const a of store.artifacts) { if (!a?.projectId) continue; if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const inputOf = (a) => ({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: "classic" });
const sec = (t, name) => t.split(/\n(?=## )/).find((s) => s.startsWith(`## ${name}`)) ?? "";
const pairs = (t) => (sec(t, "WHO IS WHAT TO WHOM").match(/^\s+\S.* & .*:/gm) || []).length;
const castKey = (a) => ((a.cast?.cast ?? a.cast)?.characters ?? (a.cast?.cast ?? a.cast) ?? []).map?.((c) => c.name).filter(Boolean).sort().join("|") ?? "";

const rows = []; const seenCast = new Set();
for (const [id, a] of by) {
  if (!a.cml || !a.outline) continue;
  const key = castKey(a); const firstOfCast = key && !seenCast.has(key); if (key) seenCast.add(key);
  const row = { id, firstOfCast };
  for (const on of [false, true]) {
    process.env.PROSE_V2_CONTRACT_FIXES = on ? "true" : "false";
    try {
      const c = pe.buildBookContract(inputOf(a));
      const world = sec(c.bible.text, "THE WORLD");
      row[on ? "on" : "off"] = { built: true, world: /Where and when:/.test(world) ? (/unknown/i.test(world) ? "unknown" : "line") : world.trim() ? (/object Object/.test(world) ? "[object Object]" : "other") : "absent", pairs: pairs(c.bible.text) };
    } catch (e) { row[on ? "on" : "off"] = { built: false, error: String(e.message).slice(0, 80) }; }
  }
  rows.push(row);
}
const tally = (rs, f) => rs.reduce((m, r) => { const k = f(r); m[k] = (m[k] ?? 0) + 1; return m; }, {});
for (const [label, rs] of [["all projects", rows], ["one per distinct cast", rows.filter((r) => r.firstOfCast)]]) {
  console.log(`${label}: ${rs.length}`);
  console.log(`  contract builds — OFF ${JSON.stringify(tally(rs, (r) => r.off.built))} · ON ${JSON.stringify(tally(rs, (r) => r.on.built))}`);
  console.log(`  W1 THE WORLD — OFF ${JSON.stringify(tally(rs, (r) => r.off.world ?? "error"))} · ON ${JSON.stringify(tally(rs, (r) => r.on.world ?? "error"))}`);
  console.log(`  R2 pairs in the bible — OFF median ${median(rs.map((r) => r.off.pairs ?? 0))} · ON median ${median(rs.map((r) => r.on.pairs ?? 0))} · ON fewer than OFF in ${rs.filter((r) => (r.on.pairs ?? 0) < (r.off.pairs ?? 0)).length}`);
}
const errs = rows.filter((r) => !r.on.built).slice(0, 3); for (const r of errs) console.log(`  ON build error ${r.id.slice(0, 13)}: ${r.on.error}`);
function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; }
