#!/usr/bin/env node
/**
 * A_111 CR-a — owner decision 2, graded: when a site's OLD role test and the SHIPPED unified predicate disagree, which is
 * right?
 *
 * scripts/role-predicate-disagreement.mjs compares each old test with the ARCHETYPE predicate over every role text — not
 * with what `CML_IDENTITY_ROLE_WINS` ships (`isDetectiveMember` / `isVictimMember`: the explicit `role` enum wins, else the
 * archetype). This probe uses the shipped pair, and grades both against a field the predicates do not read: Agent 2's
 * own `crimeDynamics.victimCandidates` / `detectiveCandidates`, where it names exactly one person. Members are taken from
 * the Agent 2 cast and the CML cast of the same project (one row per project and name).
 *
 *   node documentation/analysis/ANALYSIS_111/probes/decision2-graded.mjs
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const cml = await import(pathToFileURL(`${process.cwd()}/packages/cml/dist/index.js`).href);
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const lc = (v) => String(v ?? "").toLowerCase();
const latest = new Map();
for (const a of Object.values(store.artifacts)) if (a.type === "cast" || a.type === "cml") latest.set(`${a.projectId}|${a.type}`, a.payload);

// The live sites' OLD tests (packages/*, apps/worker — each passes its old verdict to resolveIdentity).
const OLD = {
  victim: {
    "agent2.victim /victim/ on archetype": (e) => /victim/.test(lc(e.roleArchetype ?? e.role_archetype)),
    "normalize roleIncludes(role_archetype,'victim')": (e) => lc(e.role_archetype ?? e.roleArchetype).includes("victim"),
    "isVictimArchetype(role_archetype ?? role)": (e) => cml.isVictimArchetype(String(e.role_archetype ?? e.roleArchetype ?? e.role ?? "")),
  },
  detective: {
    "agent2.detective isDetectiveArchetype(roleArchetype)": (e) => cml.isDetectiveArchetype(String(e.roleArchetype ?? e.role_archetype ?? "")),
    ".includes('detective') on role_archetype ?? role": (e) => lc(e.role_archetype ?? e.roleArchetype ?? e.role).includes("detective"),
  },
};
const NEW = { victim: cml.isVictimMember, detective: cml.isDetectiveMember };

const tally = {};
const wrongNew = [];
let graded = 0;
for (const [key, castPayload] of latest) {
  if (!key.endsWith("|cast")) continue;
  const pid = key.split("|")[0];
  const cast = castPayload?.cast ?? castPayload;
  const cd = cast?.crimeDynamics ?? {};
  const truth = {
    victim: Array.isArray(cd.victimCandidates) && cd.victimCandidates.length === 1 ? cd.victimCandidates[0] : null,
    detective: Array.isArray(cd.detectiveCandidates) && cd.detectiveCandidates.length === 1 ? cd.detectiveCandidates[0] : null,
  };
  const rows = new Map();
  for (const m of cast?.characters ?? []) rows.set(`a2|${m.name}`, m);
  for (const m of latest.get(`${pid}|cml`)?.CASE?.cast ?? []) rows.set(`cml|${m.name}`, m);
  for (const [rowKey, m] of rows) {
    for (const kind of ["victim", "detective"]) {
      if (!truth[kind]) continue;
      graded++;
      const right = String(m.name).trim() === String(truth[kind]).trim();
      const neu = NEW[kind](m);
      for (const [site, test] of Object.entries(OLD[kind])) {
        const old = test(m);
        if (old === neu) continue;
        const t = (tally[`${kind} · ${site}`] ??= { disagree: 0, newRight: 0, oldRight: 0 });
        t.disagree++;
        if (neu === right) t.newRight++; else { t.oldRight++; if (wrongNew.length < 8) wrongNew.push(`${pid.slice(0, 18)} ${rowKey.split("|")[0]} "${m.name}" role=${m.role ?? "-"} archetype="${m.roleArchetype ?? m.role_archetype ?? "-"}" truth ${kind}=${truth[kind]}`); }
      }
    }
  }
}
console.log(`graded (member, kind) rows: ${graded}`);
for (const [site, t] of Object.entries(tally)) console.log(`${site.padEnd(62)} disagree ${String(t.disagree).padStart(4)} · unified right ${String(t.newRight).padStart(4)} · old right ${t.oldRight}`);
if (wrongNew.length) console.log(`where the unified predicate is wrong:\n  ${wrongNew.join("\n  ")}`);
