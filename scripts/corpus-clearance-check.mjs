#!/usr/bin/env node
/**
 * The CLEAR gate (A_77 §10.2), as a check that can fail a build.
 *
 *   node scripts/corpus-clearance-check.mjs        # exit 1 if anything on disk fails the rule
 *   npm run corpus:clearance
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * A_77 §10.2 specified "a deterministic gate, run in CI" and ended: *"This is the mechanism that makes
 * 'public domain only' a property of the system rather than a promise."* It was never built (A_97).
 * What shipped instead was a `clearance:` block written into each `provenance.yaml` at the moment of
 * acquisition, with a comment saying it was derived — and a stored verdict is a claim about the past.
 * Two things make it go stale without anyone touching the file:
 *
 *   1. **Time passes.** A stored verdict cannot promote itself: Bentley clears on 1 Jan 2027 and
 *      *Trent's Last Case* would still say `amber` until something recomputed it. §15.2's promise that
 *      AMBER "promotes itself" is only true if this runs.
 *   2. **A hand-edited year is checked by nothing.** The years are the input to the rule; nothing
 *      re-derives the verdict from them once written.
 *
 * So this recomputes every verdict from the two years, compares it to what the file says, and fails on
 * either a disagreement or a work that is not permitted. The stored block is a cache of this
 * computation, not the authority.
 *
 * ── TEXT AND STRUCTURE ARE DIFFERENT EXPOSURES (A_98) ────────────────────────────────────────────
 *
 * A_77 §8.2 made a ruling this gate has to be able to express: the three works that are US-public-
 * domain and UK-protected — *Trent's Last Case*, and Christie's *Styles* and *The Secret Adversary* —
 * keep their STRUCTURAL encodings, tagged AMBER, excluded from calibration. The reasoning is that the
 * corpus holds no prose for them, and a plot abstraction is not the protected thing.
 *
 * That ruling only stays honest if "holds no prose" is ENFORCED rather than remembered. So the gate
 * asks two questions, not one:
 *
 *   does `library/texts/<slug>.txt` exist?   -> the work must be GREEN. No exception, no override.
 *                                               This is the copy that reaches the anti-copy index and
 *                                               every craft measure computed over the corpus.
 *   structure only?                          -> GREEN passes. AMBER passes ONLY with an explicit
 *                                               `structural_only: true` plus a reason, per work, in
 *                                               git. RED never passes.
 *
 * **WITHDRAWN: `CORPUS_JURISDICTION`.** §10.2 reserved a global env override to admit AMBER works.
 * A_97 implemented it; A_98 removes it, unset and unregistered, before anything depended on it. One
 * environment variable that admits EVERY amber work at once is the blunt switch CLAUDE.md B1 argues
 * against — it cannot be reviewed, it is invisible in a diff, and it would silently admit the next
 * amber work somebody added. A per-work declaration carrying its own reason is auditable, is in git,
 * and cannot generalise beyond the file it sits in.
 *
 * Deterministic, offline, free.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const TEXTS = `${ROOT}/library/texts`;
const YEAR = new Date().getFullYear();

/** The rule, and the only copy of it a committed file is checked against. A_77 §8.1. */
function derive(death, pub) {
  const uk = Number.isInteger(death) && death + 70 < YEAR;
  const us = Number.isInteger(pub) && pub + 95 < YEAR;
  return { uk, us, verdict: uk && us ? "green" : uk || us ? "amber" : "red" };
}

const failures = [];
const rows = [];

for (const slug of readdirSync(WORKS)) {
  const p = `${WORKS}/${slug}/provenance.yaml`;
  if (!existsSync(p)) continue;
  const prov = yaml.load(readFileSync(p, "utf8")) ?? {};
  const death = prov.author_death_year;
  const pub = prov.first_publication_year;
  const stored = prov.clearance?.verdict ?? "absent";
  const holdsText = existsSync(`${TEXTS}/${slug}.txt`);
  const structuralOnly = prov.structural_only === true;

  if (!Number.isInteger(death) || !Number.isInteger(pub)) {
    failures.push(`${slug}: missing a year (death=${death ?? "null"}, pub=${pub ?? "null"}) — unknown is not permission (§10.2)`);
    rows.push({ slug, stored, derived: "red", text: holdsText });
    continue;
  }

  const d = derive(death, pub);
  rows.push({ slug, stored, derived: d.verdict, text: holdsText });

  if (stored !== d.verdict) {
    failures.push(`${slug}: provenance says "${stored}", the rule says "${d.verdict}" (d.${death} -> uk ${d.uk ? "green" : "red"}; pub ${pub} -> us ${d.us ? "green" : "red"})`);
  }

  if (d.verdict === "red") {
    failures.push(`${slug}: RED — not clear in either jurisdiction. It must not be in the library.`);
    continue;
  }
  if (d.verdict === "green") continue;

  // AMBER from here down.
  if (holdsText) {
    failures.push(
      `${slug}: AMBER and a TEXT is on disk (library/texts/${slug}.txt). `
      + `The text is what reaches the anti-copy index and the calibration corpus, and there is no `
      + `override for that. Delete the text, or remove the work.`,
    );
  } else if (!structuralOnly) {
    failures.push(
      `${slug}: AMBER — clear in ${d.uk ? "the UK" : "the US"} only. A structural encoding may be kept `
      + `by declaring \`structural_only: true\` with \`structural_only_reason\` in its provenance `
      + `(A_77 §8.2). Undeclared, it is refused.`,
    );
  } else if (!String(prov.structural_only_reason ?? "").trim()) {
    failures.push(`${slug}: declares \`structural_only\` with no \`structural_only_reason\`. The reason is the point of the declaration.`);
  }
}

const tally = rows.reduce((a, r) => (a[r.derived] = (a[r.derived] || 0) + 1, a), {});
const withText = rows.filter((r) => r.text).length;
console.log(
  `clearance over ${rows.length} works as of ${YEAR}: `
  + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(", ")
  + ` · ${withText} hold text, ${rows.length - withText} are structure only`,
);

if (failures.length) {
  console.error(`\n${failures.length} clearance failure(s):`);
  for (const f of failures) console.error(`  ! ${f}`);
  process.exit(1);
}
console.log("all clear.");
