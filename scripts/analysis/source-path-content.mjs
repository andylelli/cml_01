/**
 * A_101 §15.2 — `sourceInCML` is never checked against the TEXT at the path it names.
 *
 * `validateSourcePath` (agent5-run.ts:508) checks two things: the path matches an allowed pattern,
 * and the path RESOLVES. It never asks whether the thing at that path supports the clue. Three
 * fabricated fingerprint clues passed it, each citing a path that says something else entirely.
 *
 * Before wiring a content check as a guardrail, measure how often it would fire on the archive.
 * B1: a check that fires on most runs is an off switch with extra steps. This script decides whether
 * the check is worth building, and it changes nothing.
 */
import { readFileSync } from "node:fs";

const store = JSON.parse(readFileSync("C:/CML/data/store.json", "utf8"));
const byProject = new Map();
for (const r of store.artifacts ?? []) {
  const pid = r.project_id ?? r.projectId, t = r.artifact_type ?? r.type;
  if (!pid || !t) continue;
  if (!byProject.has(pid)) byProject.set(pid, {});
  try { byProject.get(pid)[t] = r.payload_json ? JSON.parse(r.payload_json) : r.payload; } catch {}
}

/** Mirrors getByPath in agent5-run.ts: dotted segments with [n] indices. */
const getByPath = (root, path) => {
  let cur = root;
  for (const seg of String(path).split(".")) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)((\[\d+\])*)$/.exec(seg);
    if (!m) return undefined;
    cur = cur?.[m[1]];
    for (const idx of m[2].match(/\d+/g) ?? []) cur = cur?.[Number(idx)];
    if (cur === undefined || cur === null) return undefined;
  }
  return cur;
};

const STOP = new Set(("the a an and or of to in on at by for with from that this it is was were be been are as "
  + "his her their its they he she him them who whom which what when where why how not no nor but if then than "
  + "have has had having do does did been being will would could should may might must can shall about into "
  + "over under after before during while because so such only also very more most some any each every "
  + "one two three case clue evidence reader scene chapter suspect suspects").split(/\s+/));

const words = (s) => new Set(String(s).toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
  .filter((w) => w.length >= 4 && !STOP.has(w)));

const famCount = new Map();
const famTotal = new Map();
let total = 0, unresolved = 0, zeroOverlap = 0, oneWord = 0;
const examples = [];

for (const [pid, a] of byProject) {
  const C = a.cml?.CASE ?? a.cml;
  const clues = Array.isArray(a.clues?.clues) ? a.clues.clues : [];
  if (!C || clues.length === 0) continue;
  for (const c of clues) {
    const p = String(c?.sourceInCML ?? "").trim();
    if (!p) continue;
    total += 1;
    { const f = p.replace(/\[\d+\]/g, "[]"); famTotal.set(f, (famTotal.get(f) ?? 0) + 1); }
    const target = getByPath({ CASE: C }, p);
    if (target === undefined) { unresolved += 1; continue; }
    const targetText = typeof target === "string" ? target : JSON.stringify(target);
    const cw = words(`${c.observable ?? ""} ${c.description ?? ""} ${c.pointsTo ?? ""}`);
    const tw = words(targetText);
    let shared = 0;
    for (const w of cw) if (tw.has(w)) shared += 1;
    if (shared === 0) {
      zeroOverlap += 1;
      const fam = p.replace(/\[\d+\]/g, "[]");
      famCount.set(fam, (famCount.get(fam) ?? 0) + 1);
      if (examples.length < 6) examples.push({ p, clue: String(c.description ?? c.observable ?? "").slice(0, 78), target: targetText.slice(0, 78) });
    } else if (shared === 1) oneWord += 1;
  }
}

const pc = (x) => `${((100 * x) / total).toFixed(0)}%`;
console.log(`clues carrying a sourceInCML across the archive: ${total}\n`);
console.log(`  path does not resolve at all              : ${unresolved}  (${pc(unresolved)})`);
console.log(`  resolves, but ZERO content word in common : ${zeroOverlap}  (${pc(zeroOverlap)})`);
console.log(`  resolves, exactly ONE content word shared : ${oneWord}  (${pc(oneWord)})`);
console.log(`\n  a zero-overlap check would fire on ${pc(zeroOverlap)} of clues.`);
console.log(`\nexamples of zero overlap — the clue, and what the path it cites actually holds:`);
for (const e of examples) {
  console.log(`\n  path   ${e.p}`);
  console.log(`  clue   "${e.clue}"`);
  console.log(`  holds  "${e.target}"`);
}

console.log(`

zero-overlap rate by path family (families with 20+ clues):`);
const rows = [...famTotal.entries()].filter(([f, n]) => n >= 20)
  .map(([f, n]) => ({ f, n, z: famCount.get(f) ?? 0 }))
  .sort((a, b) => (b.z / b.n) - (a.z / a.n));
for (const r of rows) console.log(`  ${String(Math.round(100 * r.z / r.n)).padStart(3)}%  ${String(r.z).padStart(4)}/${String(r.n).padEnd(5)} ${r.f}`);
