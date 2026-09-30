#!/usr/bin/env node
/**
 * CR-12 (A34-02 / A1X-01) — the admissible evidence for unifying the role predicates: every archived cast
 * member through each OLD site predicate and the @cml/cml one it would become, with the disagreements
 * counted. A34-02: "If it is 0, the change ships as R1."
 *
 * Corpus: every Agent 2 cast and every CML in data/store.json (model output), every authored case in
 * library/works, and the replay fixtures' stores. Needs `npm run build:all` (reads @cml/cml's dist).
 *
 *   node scripts/role-predicate-disagreement.mjs [--examples]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";
import yaml from "js-yaml";
import { isDetectiveArchetype, isVictimArchetype, roleTextsOf } from "../packages/cml/dist/index.js";

const ROOT = process.cwd();
const members = []; // { source, entry }
const add = (source, list) => { for (const e of Array.isArray(list) ? list : []) if (e && typeof e === "object") members.push({ source, entry: e }); };
const fromStore = (label, store) => {
  for (const a of Object.values(store?.artifacts ?? {})) {
    if (a?.type === "cast") add(`${label}:cast`, a.payload?.cast?.characters);
    if (a?.type === "cml") add(`${label}:cml`, a.payload?.CASE?.cast);
  }
};
if (existsSync(join(ROOT, "data", "store.json"))) fromStore("data", JSON.parse(readFileSync(join(ROOT, "data", "store.json"), "utf8")));
const replay = join(ROOT, "eval", "replay");
if (existsSync(replay)) for (const f of readdirSync(replay).filter((f) => f.endsWith(".store.json.gz"))) fromStore(`replay/${f}`, JSON.parse(gunzipSync(readFileSync(join(replay, f))).toString("utf8")));
const works = join(ROOT, "library", "works");
if (existsSync(works)) for (const w of readdirSync(works)) {
  const f = join(works, w, "case.cml2.yaml");
  if (existsSync(f)) add("library", yaml.load(readFileSync(f, "utf8"))?.CASE?.cast);
}

const lc = (v) => String(v ?? "").toLowerCase();
/** Each old site: what it reads, and its predicate; paired with the unified one. */
const PAIRS = [
  { site: "normalize roleIncludes(role_archetype, ['victim'])", old: (e) => lc(e.role_archetype ?? e.roleArchetype).includes("victim"), neu: (e) => roleTextsOf(e).some(isVictimArchetype) },
  { site: "normalize roleIncludes(role_archetype, detective|investigator|inspector)", old: (e) => ["detective", "investigator", "inspector"].some((t) => lc(e.role_archetype ?? e.roleArchetype).includes(t)), neu: (e) => roleTextsOf(e).some(isDetectiveArchetype) },
  { site: "normalize/soundness/validator .includes('detective')", old: (e) => lc(e.role_archetype ?? e.roleArchetype ?? e.role).includes("detective"), neu: (e) => roleTextsOf(e).some(isDetectiveArchetype) },
  { site: "case-soundness /victim/i on role_archetype ?? role", old: (e) => /victim/i.test(String(e.role_archetype ?? e.role ?? "")), neu: (e) => roleTextsOf(e).some(isVictimArchetype) },
  { site: "agent3-run exact role_archetype === 'victim'", old: (e) => lc(e.role_archetype ?? e.roleArchetype).trim() === "victim", neu: (e) => roleTextsOf(e).some(isVictimArchetype) },
];
const examples = process.argv.includes("--examples");
console.log(`[role-predicates] ${members.length} cast members (${new Set(members.map((m) => m.source.split(":")[0])).size} sources)`);
let total = 0;
for (const p of PAIRS) {
  const diff = members.filter((m) => p.old(m.entry) !== p.neu(m.entry));
  total += diff.length;
  const kinds = new Map();
  for (const m of diff) {
    const key = `old=${p.old(m.entry)} new=${p.neu(m.entry)} | ${roleTextsOf(m.entry).join(" / ")}`;
    kinds.set(key, (kinds.get(key) ?? 0) + 1);
  }
  console.log(`\n${String(diff.length).padStart(5)} disagree — ${p.site}`);
  if (examples) for (const [k, n] of [...kinds].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`        ${String(n).padStart(4)}× ${k.slice(0, 150)}`);
}
console.log(`\n[role-predicates] ${total} disagreements in total`);
