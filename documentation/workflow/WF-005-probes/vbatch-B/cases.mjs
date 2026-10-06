// Every stored case (latest artifact of each type per project), deduplicated by cast, with its contract and its prose.
// Copied from audit-contract/cases.mjs, re-pointed at THIS worktree's store copy and build.
import fs from "node:fs";
const ROOT = "C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2";
export const PE = await import(`file:///${ROOT}/packages/prose-engine/dist/index.js`);
const store = JSON.parse(fs.readFileSync(`${ROOT}/data/store.json`, "utf8"));
const arts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts);
const by = new Map();
for (const a of arts) { if (!a?.projectId) continue; if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
export const cases = [];
const seenCast = new Set();
for (const [id, a] of by) {
  if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
  const castNames = ((a.cast?.cast ?? a.cast)?.characters ?? []).map((c) => String(c?.name ?? "").trim()).filter(Boolean);
  const key = [...castNames].sort().join("|");
  const dev = a.hard_logic_devices?.devices?.[0];
  const input = {
    cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles,
    world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting,
    lockedFacts: dev?.lockedFacts ?? [], humourLevel: "classic", primaryAxis: undefined, targetLength: "short", proofSteps: false, falseLead: false,
  };
  let contract;
  try { contract = PE.buildBookContract(input); } catch { continue; }
  const chapters = (a.prose?.chapters ?? []).map((c, i) => ({ ...c, number: i + 1 }));
  cases.push({ id, castNames, castKey: key, duplicate: seenCast.has(key), contract, chapters, clues: a.clues });
  seenCast.add(key);
}
export const distinct = cases.filter((c) => !c.duplicate);
export const canonChapters = (file, n = 10, skip = 40) => {
  const paras = fs.readFileSync(file, "utf8").split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out = []; let cur = []; let w = 0;
  for (const p of paras.slice(skip)) { cur.push(p); w += p.split(" ").length; if (w >= 1250) { out.push(cur); cur = []; w = 0; } if (out.length === n) break; }
  return out.map((paragraphs, i) => ({ number: i + 1, title: "", paragraphs }));
};
export const CANON = ["a_study_in_scarlet.txt", "the_moonstone.txt", "a_silent_witness.txt"].map((t) => `C:/CML/library/texts/${t}`).filter((p) => fs.existsSync(p));
