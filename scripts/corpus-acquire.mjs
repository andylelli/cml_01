#!/usr/bin/env node
/**
 * A_97 — the ACQUIRE stage (A_77 §10.1), scripted.
 *
 *   node scripts/corpus-acquire.mjs --id 11128 [--slug the_red_thumb_mark] [--title "..."]
 *   node scripts/corpus-acquire.mjs --from-candidates --top 40 [--min-genre 3] [--dry-run]
 *   node scripts/corpus-acquire.mjs --ids 11128,34732,10556
 *
 * Fetch -> strip Gutenberg boilerplate -> sha256 -> `library/texts/<slug>.txt` +
 * `library/works/<slug>/provenance.yaml` with a clearance verdict DERIVED from the two years.
 *
 * ── THE GATE RUNS HERE, NOT IN A REVIEW ──────────────────────────────────────────────────────────
 *
 * `--from-candidates` reads `library/candidates.json` (written by `corpus-survey.mjs`) but does not
 * trust its verdicts: clearance is recomputed from `author_death_year` and `first_publication_year`
 * at acquisition time, and **anything not GREEN is refused with the failing rule printed**. A_77
 * §10.2 asks for the gate to be data rather than a list in someone's head; this is the write side of
 * that, and it is the reason a stale candidates file cannot put an AMBER work on disk.
 *
 * ── WHY THE TEXT IS COMMITTED, AGAINST §10.1 ─────────────────────────────────────────────────────
 *
 * §10.1 specified a gitignored content-addressed cache. What shipped is `library/texts/*.txt`, in
 * git, because `packages/prose-guard/src/anti-copy.ts:174` resolves its n-gram index to that
 * directory and the worker consumes packages via `dist` on machines that never ran an acquire.
 * Keeping it is a deliberate continuation of what shipped, not an oversight — but it has a cost that
 * §10.1 correctly anticipated, and the cost is now measurable: see `scripts/anticopy-baseline.mjs`,
 * which must be re-run after any acquisition because DEFAULT_N=10 was calibrated against a 719,552
 * word index and this script makes that index several times larger.
 *
 * Deterministic. No LLM, no cost.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const ROOT = "C:/CML";
const YEAR = new Date().getFullYear();
const args = process.argv.slice(2);
const flag = (name, def = undefined) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return args.some((a) => a.startsWith(`--${name}=`))
    ? args.find((a) => a.startsWith(`--${name}=`)).split("=").slice(1).join("=")
    : def;
  return args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
};
const DRY = args.includes("--dry-run");

function clearance(death, pub) {
  const uk = Number.isInteger(death) && death + 70 < YEAR;
  const us = Number.isInteger(pub) && pub + 95 < YEAR;
  return { uk, us, verdict: uk && us ? "green" : uk || us ? "amber" : "red" };
}

/**
 * Gutenberg wraps every text in a licence header and a footer of comparable length. The markers have
 * been stable for twenty years in two spellings ("THE PROJECT GUTENBERG EBOOK" and the older
 * "THIS PROJECT GUTENBERG EBOOK"). If neither marker is found the file is REJECTED rather than
 * stored whole: an unstripped text puts ~18kB of licence prose into the anti-copy index and into any
 * craft measure computed over the corpus, and a silently-wrong text is the failure mode A_77 §3.2
 * is a record of.
 */
function stripBoilerplate(raw) {
  const start = raw.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i);
  const end = raw.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i);
  if (start === -1 || end === -1 || end <= start) return null;
  const body = raw.slice(raw.indexOf("\n", start) + 1, end);
  // PG often repeats title/author/release metadata immediately after the marker; keep it. It is the
  // book's own title page in most files and removing it would need a heuristic that can be wrong.
  return body.replace(/\r\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim() + "\n";
}

async function fetchText(id) {
  const urls = [
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`,
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { "user-agent": "CML-corpus-acquire/1.0" } });
      if (r.ok) {
        const t = await r.text();
        if (t.length > 20000) return { url: u, raw: t };
      }
    } catch { /* try the next mirror path */ }
  }
  return null;
}

function slugify(title) {
  return title.split(/[;:]|\(/)[0].trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
}

/**
 * Gutenberg files authors as "Freeman, R. Austin"; the thirteen provenance files already on disk say
 * "Arthur Conan Doyle". One shape, so a later join on author name is possible at all. The trailing
 * date suffix PG sometimes appends ("Doyle, Arthur Conan, 1859-1930") is dropped — the years are
 * already their own fields and the clearance gate reads those, not this string.
 */
function naturalName(name) {
  const bare = name.replace(/,\s*\d{4}\??-\d{0,4}\??\s*$/, "").trim();
  const parts = bare.split(",");
  if (parts.length !== 2) return bare;
  return `${parts[1].trim()} ${parts[0].trim()}`.replace(/\s+/g, " ");
}

function provenanceYaml(row, sha, words, url) {
  const c = clearance(row.author_death_year, row.first_publication_year);
  return `# Provenance + clearance. ACQUIRED by scripts/corpus-acquire.mjs on ${new Date().toISOString().slice(0, 10)}.
# STATUS: text acquired, awaiting encode. \`case.cml2.yaml\` appears only once a verified encode exists
# (A_77 §10.3) — a work with a fingerprint and no case has never been read by anything.

slug: ${row.slug}
title: ${JSON.stringify(row.title.split(/[;:]/)[0].trim())}
author: ${JSON.stringify(naturalName(row.author))}
author_death_year: ${row.author_death_year}
first_publication_year: ${row.first_publication_year}

source:
  host: "Project Gutenberg"
  ebook_id: ${row.id}
  url: "https://www.gutenberg.org/ebooks/${row.id}"
  text_url: "${url}"
  retrieved: ${new Date().toISOString().slice(0, 10)}
  sha256: "${sha}"
  words: ${words}

clearance:
  # DERIVED by the A_77 §8.1 rule at acquisition time, never hand-written.
  # uk green iff ${row.author_death_year} + 70 < ${YEAR}   -> ${row.author_death_year + 70 + 1}
  # us green iff ${row.first_publication_year} + 95 < ${YEAR}   -> ${row.first_publication_year + 95 + 1}
  uk: ${c.uk ? "green" : "red"}
  us: ${c.us ? "green" : "red"}
  verdict: ${c.verdict}
  calculated_on: ${new Date().toISOString().slice(0, 10)}

status:
  case_cml2: pending_encode
  fingerprint: pending
  device_pattern: pending
`;
}

// ── select what to acquire ───────────────────────────────────────────────────────────────────────

let rows = [];
if (args.includes("--from-candidates")) {
  const cand = JSON.parse(readFileSync(`${ROOT}/library/candidates.json`, "utf8"));
  const minGenre = Number(flag("min-genre", 2));
  const top = Number(flag("top", 1e9));
  rows = cand.green.filter((r) => r.genre_score >= minGenre).slice(0, top);
} else if (flag("ids")) {
  const cand = existsSync(`${ROOT}/library/candidates.json`)
    ? JSON.parse(readFileSync(`${ROOT}/library/candidates.json`, "utf8")) : { green: [], amber: [], red: [] };
  const all = [...cand.green, ...cand.amber, ...cand.red];
  for (const id of String(flag("ids")).split(",").map(Number)) {
    const hit = all.find((r) => r.id === id);
    if (!hit) { console.error(`! id ${id} is not in candidates.json — pass --id with --title/--death/--pub`); process.exit(2); }
    rows.push(hit);
  }
} else if (flag("id")) {
  rows = [{
    id: Number(flag("id")),
    title: String(flag("title") || `ebook ${flag("id")}`),
    author: String(flag("author") || "Unknown"),
    author_death_year: Number(flag("death")),
    first_publication_year: Number(flag("pub")),
    slug: flag("slug") ? String(flag("slug")) : slugify(String(flag("title") || `ebook_${flag("id")}`)),
    genre_score: 9,
  }];
} else {
  console.error("usage: corpus-acquire.mjs --from-candidates [--top N] [--min-genre N] | --ids a,b,c | --id N --title ... --author ... --death YYYY --pub YYYY");
  process.exit(2);
}

// ── acquire ──────────────────────────────────────────────────────────────────────────────────────

const report = { acquired: [], skipped: [], refused: [], failed: [] };

for (const row of rows) {
  row.slug ||= slugify(row.title);
  const c = clearance(row.author_death_year, row.first_publication_year);
  if (c.verdict !== "green") {
    report.refused.push({ slug: row.slug, id: row.id, verdict: c.verdict,
      why: `uk(d.${row.author_death_year})=${c.uk ? "green" : "red"} us(pub ${row.first_publication_year})=${c.us ? "green" : "red"}` });
    continue;
  }
  const textPath = `${ROOT}/library/texts/${row.slug}.txt`;
  if (existsSync(textPath)) { report.skipped.push(row.slug); continue; }
  if (DRY) { report.acquired.push({ slug: row.slug, id: row.id, dry: true }); continue; }

  const got = await fetchText(row.id);
  if (!got) { report.failed.push({ slug: row.slug, id: row.id, why: "no plain-text download" }); continue; }
  const body = stripBoilerplate(got.raw);
  if (!body) { report.failed.push({ slug: row.slug, id: row.id, why: "boilerplate markers absent" }); continue; }
  const words = body.split(/\s+/).length;
  if (words < 4000) { report.failed.push({ slug: row.slug, id: row.id, why: `only ${words} words` }); continue; }
  const sha = createHash("sha256").update(body, "utf8").digest("hex");

  writeFileSync(textPath, body, "utf8");
  mkdirSync(`${ROOT}/library/works/${row.slug}`, { recursive: true });
  writeFileSync(`${ROOT}/library/works/${row.slug}/provenance.yaml`, provenanceYaml(row, sha, words, got.url), "utf8");
  report.acquired.push({ slug: row.slug, id: row.id, words, sha: sha.slice(0, 12) });
  process.stdout.write(`\r  acquired ${report.acquired.length}/${rows.length}: ${row.slug}                    `);
  await new Promise((r) => setTimeout(r, 400));
}

process.stdout.write("\n");
console.log(`acquired ${report.acquired.length}  skipped(present) ${report.skipped.length}  refused(clearance) ${report.refused.length}  failed ${report.failed.length}`);
for (const f of report.failed) console.log(`  FAILED  ${f.slug} (${f.id}): ${f.why}`);
for (const f of report.refused) console.log(`  REFUSED ${f.slug} (${f.id}): ${f.verdict} — ${f.why}`);
writeFileSync(`${ROOT}/library/.acquire-report.json`, JSON.stringify(report, null, 1));
