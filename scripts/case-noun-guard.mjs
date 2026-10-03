#!/usr/bin/env node
/**
 * CASE-NOUN GUARD — A_110 IMPLEMENTATION PLAN, rule G2: every change must be generic to any story.
 *
 * No string literal in shipped code may carry a noun that belongs to one stored case: a character's full name,
 * a distinctive surname, or a named place. One book motivates a change; a prompt or rule that names that book's
 * people or places has been fitted to it, and silently degrades every other case. Comments citing evidence are
 * allowed, and so are tests and the name pool the cast generator draws from.
 *
 * The nouns come from every stored case in data/store.json (cast names, location profiles), so the guard grows
 * with the archive and needs no list of its own. With no store (a fresh worktree) it reports that and passes.
 *
 * It is a ratchet, like the size check. Hits that exist today are listed in case-noun-guard.baseline.json,
 * each with its reason; only a NEW hit fails. A baseline row whose hit is gone is reported so it can be deleted.
 *
 *   node scripts/case-noun-guard.mjs            # exit 1 on a hit not in the baseline
 *   node scripts/case-noun-guard.mjs --report   # print every hit, exit 0
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/** Source trees whose string literals reach a prompt, a rule or a run. */
export const SCAN_ROOTS = ["packages", "apps/worker/src", "apps/api/src"];
/** The cast generator's pools are names by design; they are drawn from, never fitted to a case. */
const EXEMPT_FILES = [/name-generator\.ts$/];
/** Place words too general to be one case's: a case set in England does not own the word. */
const GENERAL_PLACES = new Set(["England", "Scotland", "Wales", "Ireland", "Britain", "London", "France", "Paris", "Europe", "America", "India", "Egypt", "Cornwall", "Devon", "Yorkshire", "Kent", "Sussex", "Oxford", "Cambridge", "Edinburgh", "Hotel", "Manor", "House", "Abbey", "Village", "Estate"]);

const isSourceFile = (path) => /\.(ts|mts|mjs|js)$/.test(path) && !/\.d\.ts$/.test(path) && !/\.test\.|__tests__|[\\/]dist[\\/]|node_modules|[\\/]fixtures?[\\/]/.test(path);

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === "__tests__" || name === "examples" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (isSourceFile(path) && !EXEMPT_FILES.some((re) => re.test(path))) out.push(path);
  }
  return out;
};

const words = (s) => String(s ?? "").match(/[A-Z][a-zA-Z'’-]+/g) ?? [];

/**
 * English words, from the canon: any token the canon prints in lower case is an ordinary word ("access",
 * "theatre", "seaside"), so a case that names a room "Access Corridor" does not own "Access". A coined name
 * ("Cliffhaven", "Mevagissey") never appears in lower case and stays distinctive. No list to maintain.
 */
export const commonWordsOf = (texts) => {
  const set = new Set();
  for (const t of texts) for (const w of t.match(/\b[a-z][a-z'’-]+\b/g) ?? []) set.add(w);
  return set;
};

/** The case nouns of one stored archive: full names, distinctive surnames, named places, each with its case. */
export const caseNounsOf = (artifacts, common = new Set()) => {
  const nouns = new Map();
  const distinctive = (w) => w.length >= 5 && !GENERAL_PLACES.has(w) && !common.has(w.toLowerCase());
  const add = (noun, project) => { const n = noun.trim(); if (n.length >= 4 && !nouns.has(n)) nouns.set(n, project); };
  for (const a of artifacts) {
    if (!a?.payload || !a.projectId) continue;
    if (a.type === "cast") {
      const cast = a.payload.cast ?? a.payload;
      for (const c of cast?.characters ?? []) {
        const parts = words(c?.name).filter((w) => !/^(Mr|Mrs|Miss|Dr|Sir|Lady|Lord|Inspector|Captain|Colonel|Major|Reverend|Father)\.?$/.test(w));
        if (parts.length >= 2) add(parts.join(" "), a.projectId);
        const surname = parts.at(-1);
        if (parts.length >= 2 && surname && distinctive(surname)) add(surname, a.projectId);
      }
    }
    if (a.type === "location_profiles") {
      const p = a.payload;
      for (const name of [p?.primary?.name, p?.primary?.place, ...(p?.keyLocations ?? []).map((k) => k?.name)]) {
        if (!name) continue;
        const ws = words(name);
        // A multi-word name is the case's only when it carries a coined word: "Drawing Room" is anybody's.
        if (ws.length >= 2 && ws.some(distinctive)) add(ws.join(" "), a.projectId);
        for (const w of ws) if (distinctive(w)) add(w, a.projectId);
      }
    }
  }
  return nouns;
};

/** String literals of a source file, with their line numbers, after comments are removed. */
export const literalsOf = (source) => {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[\s;{}(),])\/\/[^\n]*/g, (m, lead) => lead + " ".repeat(m.length - lead.length));
  const out = [];
  const re = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  for (let m; (m = re.exec(stripped)); ) out.push({ text: m[0], line: stripped.slice(0, m.index).split("\n").length });
  return out;
};

export const scan = (files, nouns, read = (f) => readFileSync(f, "utf8")) => {
  const patterns = [...nouns.keys()].map((n) => ({ noun: n, re: new RegExp(`(?<![A-Za-z])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z])`) }));
  const hits = [];
  for (const file of files) {
    for (const lit of literalsOf(read(file))) {
      for (const { noun, re } of patterns) if (re.test(lit.text)) hits.push({ file, line: lit.line, noun, project: nouns.get(noun), literal: lit.text.slice(0, 100) });
    }
  }
  return hits;
};

const main = () => {
  const store = join(ROOT, "data", "store.json");
  if (!existsSync(store)) {
    console.log("case-noun guard: no data/store.json — nothing to check against (pass)");
    return 0;
  }
  const textsDir = join(ROOT, "library", "texts");
  const texts = existsSync(textsDir) ? readdirSync(textsDir).filter((f) => f.endsWith(".txt")).map((f) => readFileSync(join(textsDir, f), "utf8")) : [];
  const nouns = caseNounsOf(JSON.parse(readFileSync(store, "utf8")).artifacts ?? [], commonWordsOf(texts));
  const files = SCAN_ROOTS.flatMap((r) => walk(join(ROOT, r)));
  const hits = scan(files, nouns).map((h) => ({ ...h, file: relative(ROOT, h.file).replace(/\\/g, "/") }));
  const baselinePath = join(ROOT, "scripts", "case-noun-guard.baseline.json");
  const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")).entries ?? [] : [];
  const { fresh, stale } = againstBaseline(hits, baseline);
  const report = process.argv.includes("--report");
  for (const h of report ? hits : fresh) console.log(`${h.file}:${h.line}  "${h.noun}" (${String(h.project).slice(0, 13)})  ${h.literal.replace(/\s+/g, " ")}`);
  for (const b of stale) console.log(`baseline row no longer hits — delete it: ${b.file} "${b.noun}"`);
  console.log(`case-noun guard: ${nouns.size} nouns from the archive, ${files.length} files, ${hits.length} hit(s), ${fresh.length} new`);
  return fresh.length && !report ? 1 : 0;
};

/** A hit is known when the baseline lists its file and noun; line numbers move and are not part of the key. */
export const againstBaseline = (hits, baseline) => {
  const key = (x) => `${x.file}::${x.noun}`;
  const known = new Set(baseline.map(key));
  const seen = new Set(hits.map(key));
  return { fresh: hits.filter((h) => !known.has(key(h))), stale: baseline.filter((b) => !seen.has(key(b))) };
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = main();
