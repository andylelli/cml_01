#!/usr/bin/env node
/**
 * A_111 — what does a chapter-1 introduction say a newcomer "was to the dead", and does it give away a secret?
 * Every stored case's contract (PROSE_V2_OPENING and CML_A110_UPSTREAM on), every introduction: does its relation or its
 * why-here line carry a distinctive word (five letters or more) of that member's own privateSecret or motiveSeed that is
 * not also in a cast name, their occupation or their publicPersona? Known positive: Marguerite Selwyn in
 * canary_1790962241799 ("manipulated Cecil Thorne through secret affection while embezzling manor funds"), 70 of 90
 * relations before the 2026-10-07 fix.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/intro-relations.mjs [--list]
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
process.env.PROSE_V2_OPENING = "1";
process.env.CML_A110_UPSTREAM = "1";
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const by = new Map();
for (const a of Object.values(store.artifacts)) { if (!by.has(a.projectId)) by.set(a.projectId, {}); const o = by.get(a.projectId); if (!o[a.type]) o[a.type] = a.payload; }
const stems = (t) => new Set(String(t ?? "").toLowerCase().match(/[a-z]{5,}/g)?.map((w) => w.slice(0, 5)) ?? []);
let intros = 0, withRelation = 0, relationLeaks = 0, withWhy = 0, whyLeaks = 0, knownPositiveIntros = -1;
const list = [];
for (const [pid, a] of by) {
  if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
  let k;
  try {
    k = pe.buildBookContract({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: "classic", targetLength: "short" });
  } catch { continue; }
  const members = (a.cast?.cast ?? a.cast)?.characters ?? [];
  const names = stems(members.map((m) => m.name).join(" "));
  if (pid === "canary_1790962241799") knownPositiveIntros = 0;
  for (const s of k.scenes) for (const i of s.opening?.introductions ?? []) {
    intros++;
    const m = members.find((x) => x.name === i.name) ?? {};
    const known = new Set([...names, ...stems(m.occupation), ...stems(m.publicPersona)]);
    const secret = new Set([...stems(m.privateSecret), ...stems(m.motiveSeed)]);
    const leak = (t) => [...stems(t)].filter((w) => secret.has(w) && !known.has(w));
    if (pid === "canary_1790962241799" && i.relation) knownPositiveIntros++;
    if (i.relation) {
      withRelation++;
      const shared = leak(i.relation);
      if (shared.length) relationLeaks++;
      list.push(`REL ${pid.slice(0, 20)} ${i.name}: "${i.relation.slice(0, 90)}"${shared.length ? `  <- secret words ${shared}` : ""}`);
    }
    if (i.whyHere) {
      withWhy++;
      const shared = leak(i.whyHere);
      if (shared.length >= 2) whyLeaks++;
      if (shared.length >= 2) list.push(`WHY ${pid.slice(0, 20)} ${i.name}: "${i.whyHere.slice(0, 110)}"  <- secret words ${shared}`);
    }
  }
}
console.log(`introductions ${intros} · relation ${withRelation}, carrying a secret word ${relationLeaks} · why-here ${withWhy}, carrying 2+ secret words ${whyLeaks} · known positive's relations ${knownPositiveIntros}`);
if (process.argv.includes("--list")) console.log(list.join("\n"));
