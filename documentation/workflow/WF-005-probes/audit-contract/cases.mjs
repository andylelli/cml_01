// Load every stored case (latest artifact of each type per project) as a ContractInput.
import fs from "node:fs";
import path from "node:path";
const store = JSON.parse(fs.readFileSync("C:/CML/data/store.json", "utf8"));
const arts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts);
const by = new Map();
for (const a of arts) { if (!a?.projectId) continue; if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const specs = (Array.isArray(store.specs) ? store.specs : Object.values(store.specs));
const humourOf = (pid) => { const s = specs.filter((x) => x.projectId === pid).pop(); return s?.spec?.humourLevel; };
// locked facts: the run's own registry file, matched to the project by its device fact ids; else the device's own facts.
const lfDir = "C:/CML/apps/worker/logs";
const lfFiles = fs.readdirSync(lfDir).filter((f) => /^locked-facts-.*\.json$/.test(f)).map((f) => { try { return JSON.parse(fs.readFileSync(path.join(lfDir, f), "utf8")); } catch { return null; } }).filter(Boolean);
export const cases = [];
for (const [id, a] of by) {
  if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
  const dev = a.hard_logic_devices?.devices?.[0];
  const devIds = new Set((dev?.lockedFacts ?? []).map((f) => f.id));
  const devVals = new Set((dev?.lockedFacts ?? []).map((f) => f.value));
  const match = lfFiles.filter((f) => (f.registry ?? []).length && (f.registry ?? []).filter((r) => devIds.has(r.id)).length === devIds.size && devIds.size > 0);
  const lockedFacts = match.length ? match[match.length - 1].registry : (dev?.lockedFacts ?? []);
  cases.push({
    id,
    lfSource: match.length ? "log" : "device",
    input: {
      cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles,
      world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting,
      lockedFacts, humourLevel: humourOf(id) ?? "classic", primaryAxis: undefined, targetLength: "short", proofSteps: false, falseLead: false,
    },
    raw: a,
  });
}
