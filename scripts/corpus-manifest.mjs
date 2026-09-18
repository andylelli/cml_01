#!/usr/bin/env node
/**
 * A_77 §10.2/§10.7, built by A_98 — `library/manifest.json`, the one index of the reference library.
 *
 *   node scripts/corpus-manifest.mjs           # regenerate
 *   node scripts/corpus-manifest.mjs --check   # exit 1 if it is stale (for CI)
 *   npm run corpus:manifest
 *
 * ── WHY A MANIFEST, WHEN THE PROVENANCE FILES ARE THE TRUTH ─────────────────────────────────────
 *
 * They are, and this is not a second copy of them — it is an INDEX, regenerated from them, with a
 * `--check` mode so it cannot drift. That distinction is the whole subject of A_98: `examples/` and
 * `library/works/` held nine byte-identical pairs of the same case, nothing regenerated either from
 * the other, and the API served one while the generator read the other. Two files holding the same
 * fact with no derivation direction is how a project ends up showing 14 works while holding 166.
 *
 * A_77 §4.3 is the same failure one level down: `seed-fingerprints.yaml` called itself a derived
 * artifact, was hand-authored, and disagreed with its own sources in eleven of fourteen entries.
 *
 * So the rule this file is built to obey: **anything that restates a fact must be generated from the
 * fact and checkable against it.** `--check` in CI is what makes that true rather than intended.
 *
 * ── WHAT IS THE TRUTH, AND WHAT IS DERIVED ──────────────────────────────────────────────────────
 *
 *   TRUTH     library/works/<slug>/provenance.yaml   the work exists, who wrote it, when, cleared how
 *             library/works/<slug>/case.cml2.yaml    the verified encoding, when one exists
 *             library/works/<slug>/case.legacy.yaml  the 2025 hand encoding, where nothing better is
 *             library/texts/<slug>.txt               the source text, when we hold it
 *
 *   DERIVED   library/manifest.json                  this file
 *             library/works/<slug>/fingerprint.yaml  from the case (corpus-derive + corpus-classify)
 *             packages/novelty/data/seed-fingerprints.yaml  from the fingerprints
 *             library/calibration/*.json             from the texts
 *
 * Deterministic, offline, free.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const TEXTS = `${ROOT}/library/texts`;
const OUT = `${ROOT}/library/manifest.json`;
const CHECK = process.argv.includes("--check");
const YEAR = new Date().getFullYear();

const derive = (death, pub) => {
  const uk = Number.isInteger(death) && death + 70 < YEAR;
  const us = Number.isInteger(pub) && pub + 95 < YEAR;
  return uk && us ? "green" : uk || us ? "amber" : "red";
};

const works = [];
for (const slug of readdirSync(WORKS).sort()) {
  const provPath = `${WORKS}/${slug}/provenance.yaml`;
  if (!existsSync(provPath)) continue;
  const p = yaml.load(readFileSync(provPath, "utf8")) ?? {};
  const textPath = `${TEXTS}/${slug}.txt`;
  const hasText = existsSync(textPath);
  const hasCase = existsSync(`${WORKS}/${slug}/case.cml2.yaml`);
  const hasLegacy = existsSync(`${WORKS}/${slug}/case.legacy.yaml`);

  let fingerprint = null;
  const fpPath = `${WORKS}/${slug}/fingerprint.yaml`;
  if (existsSync(fpPath)) {
    const y = yaml.load(readFileSync(fpPath, "utf8"));
    const fp = Array.isArray(y) ? y[0] : y;
    fingerprint = { axis: fp?.axis ?? null, mechanism_family: fp?.mechanism_family ?? null };
  }

  works.push({
    slug,
    title: p.title ?? slug,
    author: p.author ?? null,
    author_death_year: p.author_death_year ?? null,
    first_publication_year: p.first_publication_year ?? null,
    clearance: derive(p.author_death_year, p.first_publication_year),
    structural_only: p.structural_only === true,
    /**
     * `encoding` is the single word that answers "what does this work actually give the generator".
     * `verified` outranks `legacy` because that is the order `loadSeedCMLFiles` reads them in, and an
     * index that ordered them differently from the loader would be the next thing to drift.
     */
    encoding: hasCase ? "verified" : hasLegacy ? "legacy" : "none",
    text: hasText ? { words: p.source?.words ?? null, bytes: statSync(textPath).size } : null,
    source: p.source?.ebook_id ? { host: p.source.host ?? null, ebook_id: p.source.ebook_id } : null,
    fingerprint,
  });
}

const tally = (key, fn) => works.reduce((a, w) => {
  const k = fn ? fn(w) : w[key];
  if (k === null || k === undefined) return a;
  a[k] = (a[k] || 0) + 1;
  return a;
}, {});

const manifest = {
  generated_by: "scripts/corpus-manifest.mjs",
  generated_on: new Date().toISOString().slice(0, 10),
  note: "DERIVED from library/works/*/provenance.yaml and what is on disk beside it. Never hand-edit; "
    + "run `npm run corpus:manifest`. CI checks it with --check.",
  totals: {
    works: works.length,
    with_text: works.filter((w) => w.text).length,
    encoded_verified: works.filter((w) => w.encoding === "verified").length,
    encoded_legacy: works.filter((w) => w.encoding === "legacy").length,
    awaiting_encode: works.filter((w) => w.encoding === "none").length,
    words: works.reduce((a, w) => a + (w.text?.words ?? 0), 0),
  },
  clearance: tally("clearance"),
  axis: tally(null, (w) => w.fingerprint?.axis ?? null),
  works,
};

const rendered = `${JSON.stringify(manifest, null, 1)}\n`;

if (CHECK) {
  if (!existsSync(OUT)) {
    console.error("! library/manifest.json is missing — run `npm run corpus:manifest`.");
    process.exit(1);
  }
  const onDisk = readFileSync(OUT, "utf8");
  /** `generated_on` is the one field allowed to differ: re-running on a later day is not drift. */
  const strip = (t) => t.replace(/"generated_on": "[^"]*",?\n?/, "");
  if (strip(onDisk) !== strip(rendered)) {
    console.error("! library/manifest.json is STALE. Run `npm run corpus:manifest` and commit it.");
    process.exit(1);
  }
  console.log(`manifest fresh — ${manifest.totals.works} works.`);
  process.exit(0);
}

writeFileSync(OUT, rendered, "utf8");
console.log(`wrote ${OUT}`);
console.log(`  ${manifest.totals.works} works · ${manifest.totals.with_text} with text · `
  + `${manifest.totals.encoded_verified} verified + ${manifest.totals.encoded_legacy} legacy encodings · `
  + `${manifest.totals.awaiting_encode} awaiting encode`);
console.log(`  clearance: ${JSON.stringify(manifest.clearance)}`);
console.log(`  axis:      ${JSON.stringify(manifest.axis)}`);
