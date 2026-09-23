#!/usr/bin/env node
/**
 * A_100 B1 — the PARTS table: every encoded case decomposed into its typed sub-structures.
 *
 *   node scripts/corpus-parts.mjs           # regenerate library/index/parts.json
 *   node scripts/corpus-parts.mjs --check   # exit 1 if stale (for CI)
 *   npm run corpus:parts
 *
 * ── WHY PARTS AND NOT GENES ──────────────────────────────────────────────────────────────────────
 *
 * The gene map (WP-004) uses two fields per book and saturates at ~65 cells. The encoding holds far
 * more: MEASURED at 56 cases, each carries 7.0 inference steps, 2.0 red herrings, 1.0 false solution
 * and 7.4 cast roles, with the chapter of every refutation and resolution recorded (56/56, 112/112).
 * That is ~10 structural parts per book. Scale pays when more is extracted per book, not when more
 * books are added per cell: parts grow O(N), and the PAIRS between them grow faster.
 *
 * This script only extracts. It assigns no types — that is B2, and it is a judgement — and it fits
 * nothing — that is B3. Keeping extraction separate means the raw parts can be re-typed without
 * re-reading 56 YAML files, and the typing can be audited against the strings it was given.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ────────────────────────────────────────────────────────────────
 *
 * `constraint_space` — the encoder asks for time anchors, windows, access actors and channels, and
 * MEASURED it is empty in 56 of 56 cases. Nothing is extracted from an empty field; it is recorded
 * as empty so the gap stays visible.
 *
 * Deterministic, offline, free.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const OUT_DIR = `${ROOT}/library/index`;
const OUT = `${OUT_DIR}/parts.json`;
const CHECK = process.argv.includes("--check");

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const chapterCount = (slug) => {
  const tp = `${ROOT}/library/texts/${slug}.txt`;
  if (!existsSync(tp)) return null;
  const n = (readFileSync(tp, "utf8").match(/^\s*(CHAPTER|Chapter)\s+([IVXLC]+|\d+|[A-Z][a-z]+)\b.*$/gm) || []).length;
  return n >= 3 ? n : null;
};
const intOrNull = (v) => (Number.isInteger(v) ? v : null);

const cases = [];
for (const slug of readdirSync(WORKS).sort()) {
  const p = `${WORKS}/${slug}/case.cml2.yaml`;
  if (!existsSync(p)) continue;
  const C = yaml.load(readFileSync(p, "utf8"))?.CASE ?? {};
  const fpPath = `${WORKS}/${slug}/fingerprint.yaml`;
  const fp = existsSync(fpPath) ? (yaml.load(readFileSync(fpPath, "utf8")) ?? [])[0] ?? {} : {};

  const chain = (Array.isArray(C.inference_path) ? C.inference_path : C.inference_path?.steps ?? [])
    .map((s, i) => ({
      i,
      observation: clean(s.observation),
      correction: clean(s.correction),
      effect: clean(s.effect),
      required_evidence: (s.required_evidence ?? []).map(clean),
      reader_observable: s.reader_observable === true,
    }));

  const herrings = (C.red_herrings ?? []).map((r, i) => ({
    i,
    id: r.id ?? `rh_${i + 1}`,
    description: clean(r.description),
    points_at_suspect: clean(r.points_at_suspect),
    innocent_explanation: clean(r.innocent_explanation),
    resolved_in_chapter: intOrNull(r.resolved_in_chapter),
  }));

  const fs_ = C.false_solution
    ? {
        accused_suspect: clean(C.false_solution.accused_suspect),
        supporting_points: (C.false_solution.supporting_points ?? []).map(clean),
        the_one_flaw: clean(C.false_solution.the_one_flaw),
        refuted_in_chapter: intOrNull(C.false_solution.refuted_in_chapter),
      }
    : null;

  const csp = C.constraint_space ?? {};
  const constraintEntries = Object.values(csp).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);

  cases.push({
    slug,
    axis: C.false_assumption?.type ?? fp.axis ?? null,
    mechanism_family: fp.mechanism_family ?? null,
    test_method: C.discriminating_test?.method ?? null,
    false_assumption: clean(C.false_assumption?.statement),
    cast_size: (C.cast ?? []).length,
    /**
     * The denominator for positions, counted from the SOURCE TEXT — the case does not carry it.
     * MEASURED 2026-09-18: for the 36 works whose text has >= 3 chapter headings, 36 of 36 have every
     * `*_in_chapter` integer within the heading count, so the integers are real chapter numbers.
     * Story collections (heading count < 3) get `null`: their integers index stories, not chapters,
     * and a position over them is not comparable to a novel's. B3 must skip null denominators.
     */
    chapter_count: chapterCount(slug),
    chain,
    herrings,
    false_solution: fs_,
    constraint_space_entries: constraintEntries,
  });
}

const totals = cases.reduce(
  (t, c) => {
    t.steps += c.chain.length; t.herrings += c.herrings.length; t.false_solutions += c.false_solution ? 1 : 0;
    t.herrings_with_chapter += c.herrings.filter((h) => h.resolved_in_chapter !== null).length;
    t.fs_with_chapter += c.false_solution?.refuted_in_chapter !== null && c.false_solution ? 1 : 0;
    t.constraint_entries += c.constraint_space_entries;
    return t;
  },
  { steps: 0, herrings: 0, false_solutions: 0, herrings_with_chapter: 0, fs_with_chapter: 0, constraint_entries: 0 },
);

const table = {
  generated_by: "scripts/corpus-parts.mjs",
  generated_on: new Date().toISOString().slice(0, 10),
  note: "DERIVED from library/works/*/case.cml2.yaml and fingerprint.yaml. Never hand-edit; run `npm run corpus:parts`.",
  cases: cases.length,
  totals,
  per_case: {
    steps: +(totals.steps / cases.length).toFixed(2),
    herrings: +(totals.herrings / cases.length).toFixed(2),
    false_solutions: +(totals.false_solutions / cases.length).toFixed(2),
  },
  items: cases,
};
const rendered = `${JSON.stringify(table, null, 1)}\n`;

if (CHECK) {
  if (!existsSync(OUT)) { console.error("! library/index/parts.json is missing — run `npm run corpus:parts`."); process.exit(1); }
  const strip = (t) => t.replace(/"generated_on": "[^"]*",?\n?/, "");
  if (strip(readFileSync(OUT, "utf8")) !== strip(rendered)) {
    console.error("! library/index/parts.json is STALE. Run `npm run corpus:parts` and commit it."); process.exit(1);
  }
  console.log(`parts fresh — ${cases.length} cases, ${totals.steps} steps.`); process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, rendered, "utf8");
console.log(`wrote ${OUT}`);
console.log(`  ${cases.length} cases · ${totals.steps} steps · ${totals.herrings} herrings · ${totals.false_solutions} false solutions`);
console.log(`  timing: herrings ${totals.herrings_with_chapter}/${totals.herrings} · false solutions ${totals.fs_with_chapter}/${totals.false_solutions}`);
console.log(`  constraint_space entries across all cases: ${totals.constraint_entries}`);
