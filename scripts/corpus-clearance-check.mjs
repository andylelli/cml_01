#!/usr/bin/env node
/**
 * A_97 — the CLEAR gate (A_77 §10.2), as a check that can fail a build.
 *
 *   node scripts/corpus-clearance-check.mjs        # exit 1 if anything on disk is not GREEN
 *   npm run corpus:clearance
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * A_77 §10.2 specified "a deterministic gate, run in CI" and ended: *"This is the mechanism that makes
 * 'public domain only' a property of the system rather than a promise."* It was never built. What
 * shipped instead was a `clearance:` block written into each `provenance.yaml` at the moment of
 * acquisition, with a comment saying it was derived — and a stored verdict is a claim about the past.
 * Two things make it go stale without anyone touching the file:
 *
 *   1. **Time passes the other way too.** A verdict is only ever wrong in the SAFE direction as years
 *      accumulate, but the file cannot promote itself: Bentley clears on 1 Jan 2027 and *Trent's Last
 *      Case* will still say `amber` until something recomputes it. §15.2's promise that AMBER
 *      "promotes itself" is only true if this runs.
 *   2. **A hand-edited year is not checked by anything.** The years are the input to the rule; nothing
 *      re-derives the verdict from them once written.
 *
 * So this recomputes every verdict from the two years, compares it to what the file says, and fails on
 * either a non-green work or a disagreement. The stored block becomes a cache of this computation
 * rather than the authority.
 *
 * ── WHAT COUNTS AS A FAILURE ─────────────────────────────────────────────────────────────────────
 *
 *   RED on disk        a work we hold is not clear anywhere      -> fail
 *   AMBER on disk      clear in one jurisdiction only            -> fail unless CORPUS_JURISDICTION=us
 *   stored != derived  the file's verdict is not what the rule says -> fail, and print both
 *   missing a year     unknown is not permission (§10.2)         -> fail
 *
 * `CORPUS_JURISDICTION=us` is the escape hatch §10.2 reserved for the owner; it is read at call time
 * (ADR-0004), it never permits RED, and an AMBER work it admits is still excluded from the
 * calibration corpus unconditionally — that exclusion lives in `scripts/calibration-measure.mjs`.
 *
 * Deterministic, offline, free.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const YEAR = new Date().getFullYear();

/** The rule, and the only copy of it that a committed file is checked against. A_77 §8.1. */
function derive(death, pub) {
  const uk = Number.isInteger(death) && death + 70 < YEAR;
  const us = Number.isInteger(pub) && pub + 95 < YEAR;
  return { uk, us, verdict: uk && us ? "green" : uk || us ? "amber" : "red" };
}

const relaxed = /^(1|true|yes|on|us)$/i.test(String(process.env.CORPUS_JURISDICTION ?? "").trim());
const failures = [];
const rows = [];

for (const slug of readdirSync(WORKS)) {
  const p = `${WORKS}/${slug}/provenance.yaml`;
  if (!existsSync(p)) continue;
  const prov = yaml.load(readFileSync(p, "utf8")) ?? {};
  const death = prov.author_death_year;
  const pub = prov.first_publication_year;
  const stored = prov.clearance?.verdict ?? "absent";

  if (!Number.isInteger(death) || !Number.isInteger(pub)) {
    failures.push(`${slug}: missing a year (death=${death ?? "null"}, pub=${pub ?? "null"}) — unknown is not permission (§10.2)`);
    rows.push({ slug, stored, derived: "red", death, pub });
    continue;
  }
  const d = derive(death, pub);
  rows.push({ slug, stored, derived: d.verdict, death, pub });

  if (stored !== d.verdict) {
    failures.push(`${slug}: provenance says "${stored}", the rule says "${d.verdict}" (d.${death} -> uk ${d.uk ? "green" : "red"}; pub ${pub} -> us ${d.us ? "green" : "red"})`);
  }
  if (d.verdict === "red") failures.push(`${slug}: RED — not clear in either jurisdiction. It must not be in the library.`);
  else if (d.verdict === "amber" && !relaxed) {
    failures.push(`${slug}: AMBER — clear in ${d.uk ? "the UK" : "the US"} only. Set CORPUS_JURISDICTION=us to admit it deliberately, or remove it.`);
  }
}

const tally = rows.reduce((a, r) => (a[r.derived] = (a[r.derived] || 0) + 1, a), {});
console.log(`clearance over ${rows.length} works as of ${YEAR}: ` + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(", "));
if (relaxed) console.log("CORPUS_JURISDICTION is relaxed — AMBER is admitted to the structural corpus (never to calibration).");

if (failures.length) {
  console.error(`\n${failures.length} clearance failure(s):`);
  for (const f of failures) console.error(`  ! ${f}`);
  process.exit(1);
}
console.log("all clear.");
