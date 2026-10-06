#!/usr/bin/env node
/**
 * A_110 M8 — THE KEYNESS REFERENCE: the house phrases and their canon counts.
 *
 * The editor's keyness finding (PROSE_V2_KEYNESS_FINDING) ranks a book's repeated four-word phrases by how much more
 * often the book uses them than the canon does (Dunning's G²; Log Ratio as the effect size). The canon is 12.4M words —
 * too many four-grams to ship — so this reference holds only the CANDIDATES: four-word phrases that recur across
 * distinct cases in our own archive (WP-006 §4.2's house phrases), each with its count in the canon. A phrase a book
 * uses that the reference does not hold is "unknown" to the finding and never flagged; rebuild after new runs.
 *
 * Generic by construction (A_110 rule G2): manuscripts are deduplicated by cast (one case, one vote — memory:
 * dedupe-cases-before-cross-book-counts), and a phrase containing a proper noun (a word the manuscript capitalises
 * mid-sentence) is never a candidate, so no case's names or places can enter.
 *
 *   node scripts/build-keyness-reference.mjs            # writes data/keyness-reference.json
 *   node scripts/build-keyness-reference.mjs --min 3    # clusters a phrase must appear in (default 3)
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const MIN = Number(process.argv[process.argv.indexOf("--min") + 1]) || 3;
const words = (t) => t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
const grams = function* (toks) { for (let i = 0; i + 4 <= toks.length; i++) yield toks.slice(i, i + 4).join(" "); };
const properNounsOf = (text) => {
  const out = new Set();
  for (const m of text.matchAll(/[a-z,;] ([A-Z][a-z]{2,})/g)) out.add(m[1].toLowerCase());
  return out;
};
const castSignature = (text) => {
  const c = new Map();
  for (const m of text.matchAll(/[a-z,;] ([A-Z][a-z]{2,})/g)) c.set(m[1], (c.get(m[1]) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
};

// ---- our manuscripts, clustered by cast (complete linkage) ----
const books = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) {
  if (!existsSync(root)) continue;
  for (const d of readdirSync(root)) {
    const dir = join(root, d);
    if (d === "_archive" || !statSync(dir).isDirectory()) continue;
    const md = readdirSync(dir).find((f) => f.endsWith(".md"));
    if (!md) continue;
    const text = readFileSync(join(dir, md), "utf8").replace(/^#.*$/gm, "");
    if (words(text).length < 6000) continue;
    books.push({ text, sig: castSignature(text), proper: properNounsOf(text) });
  }
}
const clusters = [];
for (const b of books) {
  const home = clusters.find((cl) => cl.every((m) => m.sig.filter((w) => b.sig.includes(w)).length >= 4));
  if (home) home.push(b);
  else clusters.push([b]);
}

// ---- candidate phrases: in >= MIN clusters, never containing a proper noun ----
const df = new Map();
for (const cl of clusters) {
  const seen = new Set();
  for (const b of cl) for (const g of grams(words(b.text))) {
    if (seen.has(g)) continue;
    if (g.split(" ").some((w) => b.proper.has(w))) continue;
    seen.add(g);
  }
  for (const g of seen) df.set(g, (df.get(g) ?? 0) + 1);
}
const candidates = new Map([...df].filter(([, n]) => n >= MIN).map(([g]) => [g, 0]));

// ---- their canon counts ----
const textsDir = join(ROOT, "library", "texts");
let canonFourGrams = 0;
const strip = (t) => { const a = t.search(/[*]{3} ?START OF/i); const b = t.search(/[*]{3} ?END OF/i); let s = t; if (b > 0) s = s.slice(0, b); if (a >= 0) s = s.slice(s.indexOf("\n", a) + 1); return s; };
for (const f of existsSync(textsDir) ? readdirSync(textsDir).filter((x) => x.endsWith(".txt")) : []) {
  for (const g of grams(words(strip(readFileSync(join(textsDir, f), "utf8"))))) {
    canonFourGrams++;
    if (candidates.has(g)) candidates.set(g, candidates.get(g) + 1);
  }
}

const out = {
  about: "A_110 M8: four-word phrases that recur across distinct cases in our archive, with their counts in the canon. Built by scripts/build-keyness-reference.mjs; rebuild after new runs.",
  generatedAt: new Date().toISOString().slice(0, 10),
  manuscripts: books.length,
  distinctCases: clusters.length,
  minCases: MIN,
  canonFourGrams,
  phrases: Object.fromEntries([...candidates].sort((a, b) => a[0].localeCompare(b[0]))),
};
writeFileSync(join(ROOT, "data", "keyness-reference.json"), JSON.stringify(out));
const neverInCanon = [...candidates.values()].filter((n) => n === 0).length;
console.log(`keyness reference: ${books.length} manuscripts, ${clusters.length} distinct cases, ${candidates.size} candidate phrases (in >= ${MIN} cases), ${neverInCanon} never in ${canonFourGrams} canon four-grams`);
