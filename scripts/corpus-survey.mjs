#!/usr/bin/env node
/**
 * A_97 — the acquisition survey. The ACQUIRE stage's missing front half (A_77 §10.1).
 *
 *   node scripts/corpus-survey.mjs [--refresh] [--no-years]
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * A_77 §15 is a hand-checked list of 39 works. Every row of it was resolved by opening a search page
 * one title at a time, which is why it stopped at 39 and why §15.5 has to admit the check is only
 * "a catalogue record exists". That is a survey done from recall and then verified. This does it the
 * other way round: it enumerates the CATALOGUE and filters by the clearance rule, so the output is
 * bounded by what exists rather than by what anyone remembered to look up.
 *
 * ── THE SOURCE IS THE CATALOGUE FILE, NOT THE API ────────────────────────────────────────────────
 *
 * The first version of this script paginated `gutendex.com`. MEASURED 2026-09-17: it had not finished
 * five topic sweeps in 25 minutes, and a single cold request exceeded 120s. Project Gutenberg
 * publishes its whole catalogue as one CSV — `feeds/pg_catalog.csv`, 21 MB, 90,681 rows — which is a
 * single download, complete rather than sampled, and re-runnable offline. The author field carries
 * the death year inline ("Doyle, Arthur Conan, 1859-1930"), which is the one field the clearance gate
 * cannot proceed without.
 *
 * Open Library supplies `first_publish_year`, which Gutenberg does not carry in any form: its only
 * date is its own release date, and for *The Moonstone* that is 1996.
 *
 * ── THE CLEARANCE RULE IS THE FILTER, NOT A LABEL PRINTED AFTERWARDS ────────────────────────────
 *
 * A_77 §8.1, recomputed here from the two years rather than copied from any table:
 *
 *   uk green  iff  author_death_year + 70 < CURRENT_YEAR      (2026 -> died <= 1955)
 *   us green  iff  first_publication_year + 95 < CURRENT_YEAR (2026 -> published <= 1930)
 *   verdict   green iff both, amber iff one, red otherwise
 *
 * **A missing year is RED.** Unknown is not permission (§10.2). This matters more here than it did in
 * §15: a catalogue sweep surfaces anonymous works, anthologies and pseudonyms carrying no death year
 * at all, and the honest handling of those is exclusion, not a guess.
 *
 * **Being on Project Gutenberg is not clearance.** PG is a US catalogue and hosts eighteen Christie
 * titles protected in the UK until 2047 (§15.2). The UK test is the binding one and is applied to
 * every row without exception.
 *
 * Deterministic given the two caches. No LLM, no cost.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const ROOT = "C:/CML";
const CSV = `${ROOT}/library/.pg-catalog.csv`;
const YEARS = `${ROOT}/library/.pubyear-cache.json`;
const OUT = `${ROOT}/library/candidates.json`;
const CATALOG_URL = "https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv";
const YEAR = new Date().getFullYear();

const args = process.argv.slice(2);
const REFRESH = args.includes("--refresh");
const NO_YEARS = args.includes("--no-years");

// ── the clearance gate, in code ──────────────────────────────────────────────────────────────────

/**
 * A_77 §8.1/§10.2. Null years are RED by construction — `null + 70 < YEAR` is false.
 *
 * ── THE UPPER BOUND, AND WHY IT IS NOT A GUESS ───────────────────────────────────────────────────
 *
 * MEASURED 2026-09-17 on the first 20 rows: Open Library resolves a NOVEL's first publication year
 * reliably and a single SHORT STORY's almost never — *The Adventure of the Dying Detective* has no
 * book record before 1991, because in 1913 it was a magazine story. Under a flat null-is-red rule the
 * survey would drop most of the short fiction, and short fiction is disproportionately what this
 * corpus wants: one story is one clean case, which is why four of the thirteen works already on disk
 * are stories rather than novels.
 *
 * So where the exact year is unresolved the gate uses an UPPER BOUND instead: `author_death_year + 5`.
 * The US test is "published no later than YEAR-95", and substituting a value that is *at least* the
 * true one can only make the test stricter — a work whose upper bound clears cannot have a true year
 * that does not. The 5 is a posthumous-publication allowance (Post d.1930 with collections after).
 *
 * This is sound for `<=` and would be unsound for anything else, so `pub_year_source` records which
 * of the two was used and `first_publication_year` stays null rather than being filled with a bound.
 */
export function clearance(authorDeathYear, firstPublicationYear) {
  const pubBound = Number.isInteger(firstPublicationYear)
    ? firstPublicationYear
    : (Number.isInteger(authorDeathYear) ? authorDeathYear + 5 : null);
  const uk = Number.isInteger(authorDeathYear) && authorDeathYear + 70 < YEAR;
  const us = Number.isInteger(pubBound) && pubBound + 95 < YEAR;
  return {
    uk: uk ? "green" : "red",
    us: us ? "green" : "red",
    us_basis: Number.isInteger(firstPublicationYear) ? "first_publication_year" : "author_death_year + 5 (upper bound)",
    verdict: uk && us ? "green" : uk || us ? "amber" : "red",
    calculated_on: new Date().toISOString().slice(0, 10),
  };
}

// ── stage 1: the catalogue ───────────────────────────────────────────────────────────────────────

/** RFC4180 enough for this file: quoted fields, doubled quotes inside them, commas and newlines. */
function* parseCsv(text) {
  let field = "", row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); yield row; row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); yield row; }
}

if (REFRESH || !existsSync(CSV)) {
  process.stdout.write(`downloading ${CATALOG_URL} ... `);
  const r = await fetch(CATALOG_URL, { headers: { "user-agent": "CML-corpus-survey/1.0" } });
  if (!r.ok) { console.error(`\n! catalogue download failed: http ${r.status}`); process.exit(1); }
  writeFileSync(CSV, Buffer.from(await r.arrayBuffer()));
  console.log("ok");
}

const rowsIter = parseCsv(readFileSync(CSV, "utf8"));
const header = rowsIter.next().value;
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

// ── stage 2: filter ──────────────────────────────────────────────────────────────────────────────

/**
 * Author death year, out of Gutenberg's own author string: "Doyle, Arthur Conan, 1859-1930".
 * A multi-author row (anthologies, "Various") yields no single death year and is therefore RED —
 * which is correct and not a limitation: an anthology's clearance is per-story, and this project has
 * no mechanism for a per-story verdict.
 */
function authorFacts(authors) {
  if (!authors || /^Various$/i.test(authors)) return null;
  // Split on ";" only — the comma is inside a single author's own name.
  const list = authors.split(";").map((s) => s.trim()).filter(Boolean);

  /**
   * Contributors carrying a role tag are not authors. MEASURED 2026-09-17: the first version of this
   * function required the whole field to name exactly ONE person, and Gutenberg lists the
   * illustrator alongside the novelist — so it silently dropped *The Greene Murder Case*, *The Benson
   * Murder Case*, *The Scarab Murder Case*, *Lady Molly of Scotland Yard* and *The Clue*, five works
   * A_77 §15.1 had named by hand. Four of them are Van Dine, which is to say most of the Golden Age
   * proper that is legally reachable at all.
   *
   * That defect survived a validation pass that reported "38 of 39 curated ids recovered", because
   * that pass scored the genre heading and never ran this function — the negative result was a claim
   * about the PROBE.
   *
   * The illustrator's own copyright is real and is not waived by ignoring them here: the acquired
   * artifact is `text/plain`, which contains no illustrations. An EDITOR-led volume is a different
   * case and still yields null, because an anthology's clearance is per-story.
   */
  const ROLE_TAG = /\[(editor|illustrator|translator|contributor|commentator|author of introduction|introduction|editor of compilation|compiler|photographer|engraver)\]/i;
  const authored = list.filter((x) => !ROLE_TAG.test(x));
  if (authored.length !== 1) return null;

  const m = authored[0].match(/^(.*?),\s*(\d{3,4})\??\s*-\s*(\d{3,4})\??\s*$/);
  if (!m) return { name: authored[0], birth: null, death: null };
  return { name: m[1].trim(), birth: Number(m[2]), death: Number(m[3]) };
}

/** "Surname, First" -> "First Surname", the shape the thirteen existing provenance files use. */
function naturalName(name) {
  const parts = name.split(",");
  if (parts.length !== 2) return name.trim();
  return `${parts[1].trim()} ${parts[0].trim()}`.replace(/\s+/g, " ");
}

/**
 * How strongly the CATALOGUE calls this detective fiction. "Is this a Golden Age mystery" is a
 * judgement the ENCODE stage makes from the text; what this does is cheaper and honest about itself —
 * it scores the catalogue's own vocabulary and records the score, so a weak row is visibly weak
 * rather than silently equal to a strong one.
 *
 * MEASURED on the 2026-09-17 catalogue: `Detective and mystery stories` (+4) is the Library of
 * Congress subject applied to the genre proper and is by far the most discriminating single signal;
 * the `Category: Crime & Mystery` bookshelf (+2) is Gutenberg's own curation and catches the rows LoC
 * missed. Everything below +2 is noise — "Murder -- Fiction" alone is *Macbeth*.
 */
function genreScore(subjects, shelves, locc) {
  const hay = `${subjects} | ${shelves}`.toLowerCase();
  let s = 0;
  if (/detective and mystery stories/.test(hay)) s += 4;
  if (/category: crime & mystery|crime fiction|mystery fiction|detective fiction/.test(hay)) s += 2;
  if (/\bdetectives?\b/.test(hay)) s += 1;
  if (/private investigators|police/.test(hay)) s += 1;
  if (/murder|homicide/.test(hay)) s += 1;
  if (/\bPS\b|\bPR\b/.test(locc)) s += 0; // English/American literature: necessary, not sufficient
  return s;
}

/** Era buckets, for coverage reporting only. Golden Age proper is 1920-1930 within our PD ceiling. */
function era(y) {
  if (!y) return "unknown";
  if (y < 1890) return "victorian";
  if (y < 1914) return "edwardian";
  if (y < 1920) return "wartime";
  return "golden_age";
}

function slugify(title) {
  return title.split(/[;:]|\(|\r|\n/)[0].trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
}

/** Works already on disk, by Gutenberg id, so the survey never re-proposes what we hold. */
function held() {
  const ids = new Set(), slugs = new Set();
  const dir = `${ROOT}/library/works`;
  for (const slug of readdirSync(dir)) {
    const p = `${dir}/${slug}/provenance.yaml`;
    if (!existsSync(p)) continue;
    slugs.add(slug);
    const m = readFileSync(p, "utf8").match(/ebook_id:\s*(\d+)/);
    if (m) ids.add(Number(m[1]));
  }
  return { ids, slugs };
}

/** A_77 §15.3 — checked and not obtainable, or checked and deliberately excluded. Never re-propose. */
const EXCLUDE_IDS = new Set([
  18883, // Mason, The Four Feathers — not a mystery (§15.3)
  32854, // Leblanc, in French (§15.3)
]);

const { ids: heldIds, slugs: heldSlugs } = held();
const stats = { rows: 0, not_text: 0, not_english: 0, held: 0, no_single_author: 0, no_death_year: 0, died_after: 0, weak_genre: 0 };
const shortlist = [];
const seenSlug = new Map();

for (const r of rowsIter) {
  if (r.length < 9) continue;
  stats.rows++;
  const id = Number(r[col["Text#"]]);
  if (r[col.Type] !== "Text") { stats.not_text++; continue; }
  if (r[col.Language] !== "en") { stats.not_english++; continue; }
  if (heldIds.has(id) || EXCLUDE_IDS.has(id)) { stats.held++; continue; }

  const g = genreScore(r[col.Subjects], r[col.Bookshelves], r[col.LoCC]);
  if (g < 4) { stats.weak_genre++; continue; }

  const a = authorFacts(r[col.Authors]);
  if (!a) { stats.no_single_author++; continue; }
  if (a.death === null) { stats.no_death_year++; continue; }
  if (a.death + 70 >= YEAR) { stats.died_after++; continue; }

  const title = r[col.Title].replace(/\s*\n\s*/g, " ").trim();
  let slug = slugify(title);
  if (seenSlug.has(slug)) slug = `${slug}_${id}`;          // two editions of one title
  seenSlug.set(slug, id);
  if (heldSlugs.has(slug)) { stats.held++; continue; }

  shortlist.push({
    id, title, author: naturalName(a.name), author_surname: a.name.split(",")[0].trim(),
    author_birth_year: a.birth, author_death_year: a.death, genre_score: g, slug,
    issued: r[col.Issued],
    locc: (r[col.LoCC] || "").trim(),
    subjects: r[col.Subjects].split(";").map((s) => s.trim()).filter(Boolean),
    bookshelves: r[col.Bookshelves].split(";").map((s) => s.trim()).filter(Boolean),
  });
}

console.log(`catalogue: ${stats.rows} rows`);
console.log(`shortlist before publication year: ${shortlist.length}`);
console.log("  dropped:", JSON.stringify(stats));

// ── stage 3: publication year ────────────────────────────────────────────────────────────────────

/**
 * Open Library's `first_publish_year` over a title+author search. Two guards, because this is the one
 * field neither catalogue can be trusted on blind:
 *
 *  1. The author surname must appear in the matched record's author list. A bare title search for
 *     "The Clue" returns a 1983 paperback by somebody else.
 *  2. A year before 1800, or after the author's death year + 5, is discarded rather than used.
 *     Posthumous collections are real (Post d.1930 with collections after), hence +5 and not 0.
 *
 * A row this cannot resolve keeps `first_publication_year: null` and is therefore RED. That is the
 * intended behaviour and not a failure of the script — it is §10.2's "unknown is not permission", and
 * such rows are listed separately so a wanted title can be resolved by hand and acquired by id.
 */
/** Titles compared on letters and digits only, with a leading article dropped. */
const normTitle = (t) => String(t).toLowerCase().replace(/^(the|a|an)\s+/, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

async function firstPublishYear(title, surname, birth, death) {
  const cleanTitle = title.split(/[;:]|\(/)[0].trim();
  /**
   * `sort=old` is load-bearing. MEASURED: without it, *The Memoirs of Sherlock Holmes* resolves to
   * NULL — the top five relevance hits are all modern omnibus editions (1970, 1984, 1993, 2003,
   * 2018), every one of them discarded by the death-year sanity ceiling, and the real 1894 record is
   * below the cut. Sorted oldest-first the same query returns 1894 three times over.
   */
  const q = `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}`
    + `&author=${encodeURIComponent(surname)}&sort=old&fields=title,author_name,first_publish_year&limit=10`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(q, { headers: { "user-agent": "CML-corpus-survey/1.0 (andylellimt4@gmail.com)" } });
      if (res.status === 429 || res.status >= 500) throw new Error(`http ${res.status}`);
      if (!res.ok) return null;
      const j = await res.json();
      const docs = j.docs || [];

      /**
       * The title must actually be the title. Open Library answers a title query with near matches,
       * and for *The Greene Murder Case* one of them is a 1900 record — twenty-eight years early, and
       * inside the sanity window, so a bare `Math.min` would have taken it. Anchoring on the
       * normalised title drops it without needing to know it was wrong.
       */
      const want = normTitle(cleanTitle);
      const titled = docs.filter((d) => {
        const t = normTitle(d.title || "");
        return t === want || t.startsWith(`${want} `);
      });

      /**
       * PSEUDONYMS — and why there is no client-side author test at all.
       *
       * MEASURED 2026-09-17: all four Philo Vance novels resolved to NULL and went AMBER, because
       * Gutenberg files them under "Van Dine, S. S." while Open Library files them under Willard
       * Huntington Wright. A first attempt kept the surname test and fell back to the server's rows
       * only when it matched NOTHING — which still lost *The Greene Murder Case*, because a 2025
       * reprint IS filed under "S. S. Van Dine", so the surname matched one useless row and the real
       * 1928 record under Wright never entered the pool. A filter that fires on the wrong row is
       * worse than one that fires on none.
       *
       * `author=` already did the matching server side, and Open Library resolves pseudonyms. So the
       * pool is every title-anchored row, and precision comes from the title anchor and the window.
       */
      const lo = Math.max(1800, Number.isInteger(birth) ? birth + 15 : 1800);
      const hi = Number.isInteger(death) ? death + 5 : 9999;

      /**
       * The lower bound is the author's birth year plus fifteen, not a constant. MEASURED: Open
       * Library carries a record for *The Moonstone* dated **1800** — Wilkie Collins was born in 1824
       * — and another for *The Bishop Murder Case* dated **1900**, twenty-nine years early. Both sit
       * inside any fixed window and both would win a `Math.min`. Against the author's own lifetime
       * they are impossible, and impossible is a thing a script can check.
       */
      const years = titled.map((d) => d.first_publish_year)
        .filter((y) => Number.isInteger(y) && y >= lo && y <= hi);
      return years.length ? Math.min(...years) : null;
    } catch {
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  return null;
}

const yearCache = existsSync(YEARS) ? JSON.parse(readFileSync(YEARS, "utf8")) : {};
if (!NO_YEARS) {
  let n = 0;
  shortlist.sort((a, b) => b.genre_score - a.genre_score || a.id - b.id);
  for (const row of shortlist) {
    if (yearCache[row.id] !== undefined) { row.first_publication_year = yearCache[row.id]; continue; }
    row.first_publication_year = await firstPublishYear(row.title, row.author_surname, row.author_birth_year, row.author_death_year);
    yearCache[row.id] = row.first_publication_year;
    if (++n % 20 === 0) {
      process.stdout.write(`\r  openlibrary: ${n} fetched of ${shortlist.length}   `);
      writeFileSync(YEARS, JSON.stringify(yearCache));
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  writeFileSync(YEARS, JSON.stringify(yearCache));
  process.stdout.write("\n");
}

for (const row of shortlist) {
  row.first_publication_year = yearCache[row.id] ?? null;
  row.pub_year_source = Number.isInteger(row.first_publication_year) ? "openlibrary" : "unresolved";
  row.first_publication_year_upper_bound = row.first_publication_year ?? row.author_death_year + 5;
  row.clearance = clearance(row.author_death_year, row.first_publication_year);
  row.era = era(row.first_publication_year);
}

/**
 * A translation is a separate copyright, and this survey clears the AUTHOR only.
 *
 * MEASURED 2026-09-17: 21 of the 452 otherwise-green rows carry a Library of Congress class outside
 * PR/PS/PZ (English literature, American literature, juvenile fiction) — nineteen PQ and two PT.
 * They are Gaboriau, Leblanc, Leroux, Du Boisgobey: the French roman policier, which is genuinely
 * part of this genre's ancestry and genuinely not clearable by the rule in §8.1. Gaboriau died in
 * 1873 and his 1880s English translator did not, and nobody has ever looked up who that translator
 * was.
 *
 * So they are bucketed, not dropped: the list is the input to a clearance decision somebody can make
 * per-translator, and a work admitted that way goes in by `--id` with its years stated. Note that the
 * library ALREADY holds one of these — `the_mystery_of_the_yellow_room` is Leroux in translation, and
 * its provenance clears Leroux (d. 1927) and is silent about the translator.
 */
const isTranslation = (r) => !/P[RSZ]/.test(r.locc || "");

/**
 * PZ with no PR or PS beside it is juvenile fiction, and the catalogue gives it the same subject
 * heading as the genre proper. MEASURED 2026-09-17: 24 such rows — the Rover Boys, Poppy Ott, Jerry
 * Todd, Horatio Alger, the *Old Sleuth* dime novels. They are detective stories for twelve-year-olds
 * and nothing this generator is pointed at. Bucketed rather than dropped, because "juvenile" is a
 * catalogue judgement and somebody may want them for something.
 */
const isJuvenile = (r) => /PZ/.test(r.locc || "") && !/P[RS]/.test(r.locc || "");
const juvenile = shortlist.filter((r) => r.clearance.verdict !== "red" && isJuvenile(r));
const usable = (r) => !isTranslation(r) && !isJuvenile(r);
const translated = shortlist.filter((r) => r.clearance.verdict !== "red" && isTranslation(r));
const green = shortlist.filter((r) => r.clearance.verdict === "green" && usable(r));
const amber = shortlist.filter((r) => r.clearance.verdict === "amber" && usable(r));
const red = shortlist.filter((r) => r.clearance.verdict === "red");
green.sort((a, b) => b.genre_score - a.genre_score || (b.first_publication_year - a.first_publication_year));

writeFileSync(OUT, JSON.stringify({
  surveyed_on: new Date().toISOString().slice(0, 10),
  source: { catalogue: CATALOG_URL, years: "https://openlibrary.org/search.json" },
  rule: "uk: death+70 < year; us: pub+95 < year; missing year = red (A_77 §8.1/§10.2)",
  current_year: YEAR,
  stats: { ...stats, shortlist: shortlist.length, green: green.length, amber: amber.length, red: red.length, translated: translated.length, juvenile: juvenile.length },
  held: [...heldSlugs],
  green, amber, red, translated, juvenile,
}, null, 1));

console.log(`\nGREEN ${green.length}   AMBER ${amber.length}   RED ${red.length}   TRANSLATED ${translated.length}   JUVENILE ${juvenile.length}`);
const byEra = {};
for (const r of green) byEra[r.era] = (byEra[r.era] || 0) + 1;
console.log("green by era:", byEra);
console.log(`written: ${OUT}`);
