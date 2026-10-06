#!/usr/bin/env node
/**
 * A_111 CR-b (A6-07) — how often does each culprit-name matcher answer wrongly, over the stored casts?
 *
 * No blind-reader guess is stored, so the guesses a reader writes are generated from each cast: the full name, a title
 * with the surname, the surname alone, the first name alone. A guess's TRUE referent is fixed at generation: the member
 * it was made from, unless another member answers to the same form (same surname and suffix, same first name), when it
 * is ambiguous and names nobody. Each matcher is then asked "does this guess name the culprit?" for every member as the
 * culprit. Matchers: two-way `includes` (agent6-run.ts, three sites), `namesMatch` (exact or same surname), and the new
 * `guessNamesMember`.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/guess-matchers.mjs
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const cml = await import(pathToFileURL(`${process.cwd()}/packages/cml/dist/index.js`).href);
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const casts = new Map();
for (const a of Object.values(store.artifacts)) {
  if (a.type !== "cml") continue;
  const names = (a.payload?.CASE?.cast ?? []).map((c) => String(c.name ?? "").trim()).filter(Boolean);
  if (names.length >= 3) casts.set(names.slice().sort().join("|"), names); // one row per distinct cast
}

const words = (n) => n.toLowerCase().replace(/[^a-z'\s-]/g, " ").split(/\s+/).filter(Boolean).filter((w) => !/^(mr|mrs|ms|miss|dr|sir|lady|lord|captain|colonel|major|inspector|reverend|professor)$/.test(w));
const suffixOf = (w) => (w.length > 1 && /^(jr|sr|ii|iii)$/.test(w.at(-1)) ? w.at(-1) : "");
const parts = (n) => { const w = words(n); const s = suffixOf(w); const core = s ? w.slice(0, -1) : w; return { first: core[0] ?? "", last: core.at(-1) ?? "", suffix: s, n: w.length }; };

const includes = (g, c) => g.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(g.toLowerCase());
const tally = { includes: { fp: 0, fn: 0 }, namesMatch: { fp: 0, fn: 0 }, resolver: { fp: 0, fn: 0 } };
let asked = 0, ambiguous = 0;
const examples = { includes: [], namesMatch: [] };
for (const names of casts.values()) {
  for (const m of names) {
    const p = parts(m);
    const title = /\b(mrs|miss|lady|ms)\b/i.test(m) ? "Mrs." : "Mr.";
    const forms = [
      [m, (o) => o === m],
      [`${title} ${p.last[0]?.toUpperCase() ?? ""}${p.last.slice(1)}${p.suffix ? ` ${p.suffix}` : ""}`, (o) => { const q = parts(o); return q.n > 1 && q.last === p.last && q.suffix === p.suffix; }],
      [`${p.first[0]?.toUpperCase() ?? ""}${p.first.slice(1)}`, (o) => parts(o).first === p.first],
    ];
    for (const [guess, answersTo] of forms) {
      if (p.n < 2 && guess !== m) continue;
      const referents = names.filter(answersTo);
      const truth = referents.length === 1 ? referents[0] : null;
      if (truth === null) ambiguous++;
      for (const culprit of names) {
        asked++;
        const right = truth === culprit;
        for (const [key, said] of [["includes", includes(guess, culprit)], ["namesMatch", cml.namesMatch(guess, culprit)], ["resolver", cml.guessNamesMember(guess, culprit, names)]]) {
          if (said && !right) { tally[key].fp++; if (examples[key]?.length < 3) examples[key].push(`"${guess}" taken for ${culprit}`); }
          if (!said && right) { tally[key].fn++; if (examples[key]?.length < 3) examples[key].push(`"${guess}" not taken for ${culprit}`); }
        }
      }
    }
  }
}
console.log(`distinct casts ${casts.size} · (guess, culprit) questions ${asked} · ambiguous guesses ${ambiguous}`);
for (const [k, v] of Object.entries(tally)) console.log(`${k.padEnd(10)} wrongly YES ${v.fp} · wrongly NO ${v.fn}`);
for (const [k, v] of Object.entries(examples)) if (v.length) console.log(`${k}: ${v.join("; ")}`);
