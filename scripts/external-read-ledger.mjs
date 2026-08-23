#!/usr/bin/env node
/**
 * The external-read ledger — PLAN-TO-90 §7.2 **M1.1**.
 *
 * WHY THIS EXISTS. §4a's conclusion is that external reads are the project's ONLY quality measure.
 * The ledger that records them (`eval/results/external-read/manifest.json`) was, when this was written:
 *
 *   - **5 of 9 `storyPath`s dead** — every one of them pointing at `stories/X` after X moved into
 *     `stories/_archive/X`. `eval-rescore.mjs` skips an entry whose manuscript is missing, so more
 *     than half the ledger was silently invisible to the only tool that consumes it.
 *   - **missing the two reads the whole plan argues from** — `story_20260817-2209` (86) and
 *     `story_20260819-2047` (81), which is why `judge-ab.mjs` had to hard-code them as SUBJECTS.
 *   - **`externalCategories: {}` on every row**, while the per-category marks sat in plain text in a
 *     `chatgpt*.txt` beside each manuscript. **Ten human marks per story, eleven stories, recorded
 *     nowhere machine-readable.** The "best-ever in each category sums to 84" arithmetic that governs
 *     this whole project has been carried by hand across four review documents instead.
 *
 * WHAT IT DOES. Walks `stories/` and `stories/_archive/`, finds every manuscript with an external read
 * beside it, parses the read, and merges the result into the manifest — preserving every field it does
 * not own (`bundleId`, `internalFinal`, `source`, `rescored`, `runFolder`).
 *
 * ── ON PARSING A HUMAN'S REVIEW, AND THE ONE RULE THAT MATTERS ───────────────────────────────────
 *
 * The reads are free text written by a person, not an API response. Two things follow. First, the
 * format is consistent but not guaranteed — the marks are a tab-separated `Category<TAB>N/10<TAB>note`
 * block, the headline appears as both *"I'd score it around N/100"* and *"As written: N/100"*, and one
 * file is named `chatgpt-txt` with no extension. Second, and the rule this script is built on:
 *
 *     **A read that cannot be parsed is REPORTED, never guessed at and never silently skipped.**
 *
 * A ledger that quietly drops a row is what produced the state above. `--check` exits non-zero on any
 * unparsed read or dead path, so the failure is loud the next time rather than in four months.
 *
 * Marks are taken ONLY from the table. Sentences like *"this could reach 89-91/100"* are the reader's
 * forecast, not their mark, and appear in most reads — matching `/100` anywhere would have recorded
 * the aspiration as the score.
 *
 *   node scripts/external-read-ledger.mjs            # show the ledger; writes nothing
 *   node scripts/external-read-ledger.mjs --write    # merge into the manifest
 *   node scripts/external-read-ledger.mjs --check    # CI: non-zero if a read is dead or unparsed
 *   node scripts/external-read-ledger.mjs --best     # the best-ever-in-each-category arithmetic
 *   node scripts/external-read-ledger.mjs --gaps     # which categories have never reached 9, and why
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const MANIFEST = join(ROOT, "eval", "results", "external-read", "manifest.json");
const STORY_ROOTS = [join(ROOT, "stories"), join(ROOT, "stories", "_archive")];

const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");
const BEST = process.argv.includes("--best");
const GAPS = process.argv.includes("--gaps");

/** The ten canonical categories, and every heading a reader has used for each. */
export const CATEGORY_HEADINGS = [
  ["premise", /^premise\b/i],
  ["opening_hook", /^opening\s*hook\b/i],
  ["plot_structure", /^plot\s*structure\b/i],
  ["character_clarity", /^character\s*clarity\b/i],
  ["dialogue", /^dialogue\b/i],
  ["atmosphere", /^atmosphere\b/i],
  ["clues", /^mystery\s*clues\b|^clues\b|^evidence\s*logic\b/i],
  ["pacing", /^pacing\b/i],
  ["ending", /^ending\b/i],
  ["prose", /^prose\b/i],
];

/**
 * Pull the headline and the ten category marks out of one review.
 *
 * Returns `{ final, categories, notes, problems }`. `problems` is never empty when something did not
 * parse — the caller decides whether that is fatal, and `--check` says it is.
 */
export function parseExternalRead(text) {
  const problems = [];
  const categories = {};
  const notes = {};

  /**
   * The headline, in the four forms readers have actually used. "As written: N/100" is the closing
   * statement and the most reliable; the others are the opening one.
   *
   * Every read also contains a FORECAST — *"with the timing clarified this could reach 89–91/100"* —
   * and matching `/100` anywhere would record the aspiration as the mark. Hence explicit phrasings.
   */
  const closing = /as\s+written\s*:\s*(\d{1,3})\s*\/\s*100/i.exec(text);
  const opening =
    /(?:score|mark|rate)\s+(?:it|this)?\s*(?:at\s+)?(?:around\s+|about\s+)?(\d{1,3})\s*\/\s*100/i.exec(text) ??
    /overall\s+mark\s*:\s*(\d{1,3})\s*\/\s*100/i.exec(text);
  /**
   * The oldest reads state the mark ONLY inside their forecast: *"this could rise from about 69/100
   * to …"*. The number after `from` is the current mark — unambiguous, but inferred, so it is used
   * only when nothing else is present and the row is flagged `finalDerived` rather than passed off as
   * a stated score.
   */
  const fromClause = /(?:rise|jump|move|climb|go|lift)\s+from\s+(?:about\s+|around\s+)?(\d{1,3})\s*\/\s*100/i.exec(text);

  let final = closing ? Number(closing[1]) : opening ? Number(opening[1]) : null;
  let finalDerived = false;
  if (final == null && fromClause) {
    final = Number(fromClause[1]);
    finalDerived = true;
  }
  if (final == null) problems.push("no headline score (/100) found");
  else if (closing && opening && Number(closing[1]) !== Number(opening[1])) {
    problems.push(`headline disagrees with itself: opening ${opening[1]}, closing ${closing[1]} — took the closing one`);
  }

  for (const line of text.split(/\r?\n/)) {
    /**
     * `Category<TAB>N/10<TAB>note` — the table row.
     *
     * The TAB is required, and that is what makes this safe rather than merely convenient: one read
     * (`story_20260618-0424`) is a chapter-by-chapter review whose sections each end in a bare
     * `Mark: 6/10`. Those are CHAPTER marks, not category marks. A whitespace-tolerant pattern would
     * have silently recorded ten chapter scores as this manuscript's rubric — the same shape of
     * defect as X88, a value read into the wrong vocabulary. That file is correctly reported as
     * having no category table.
     */
    const m = /^([^\t]{3,60})\t\s*(\d{1,2})\s*\/\s*10\s*(?:\t(.*))?$/.exec(line);
    if (!m) continue;
    // Some reads number the rows: "1. Premise / concept".
    const heading = m[1].trim().replace(/^\d{1,2}[.)]\s*/, "");
    const hit = CATEGORY_HEADINGS.find(([, re]) => re.test(heading));
    if (!hit) {
      problems.push(`unrecognised category heading: "${heading}"`);
      continue;
    }
    const [key] = hit;
    if (categories[key] != null) continue; // first table wins; some reads quote themselves later
    categories[key] = Number(m[2]);
    notes[key] = (m[3] ?? "").trim();
  }

  const missing = CATEGORY_HEADINGS.map(([k]) => k).filter((k) => categories[k] == null);
  if (missing.length && missing.length < 10) problems.push(`missing categories: ${missing.join(", ")}`);
  else if (missing.length === 10) problems.push("no category table found");

  return { final, finalDerived, categories, notes, problems };
}

/** Every `<storyDir>` that holds both a manuscript and an external read. */
function findReads() {
  const out = [];
  for (const root of STORY_ROOTS) {
    if (!existsSync(root)) continue;
    for (const name of readdirSync(root)) {
      const dir = join(root, name);
      if (name === "_archive" || !statSync(dir).isDirectory()) continue;
      const files = readdirSync(dir);
      // `chatgpt-txt` (no extension) is a real filename in the archive — match on the stem.
      const read = files.find((f) => /^chatgpt[-_.]?(review)?(\.txt|-txt)?$/i.test(f));
      const story = files.find((f) => f.endsWith(".md"));
      if (!read || !story) continue;
      out.push({
        dir,
        storyPath: relative(ROOT, join(dir, story)).replace(/\\/g, "/"),
        readPath: relative(ROOT, join(dir, read)).replace(/\\/g, "/"),
      });
    }
  }
  return out.sort((a, b) => a.storyPath.localeCompare(b.storyPath));
}

/**
 * Everything below is the CLI. It is guarded so the parser above can be imported by a test without
 * the module scanning the disk and printing a ledger as a side effect of `import`.
 */
const invokedDirectly = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (invokedDirectly) {
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : [];
  const byStoryStem = new Map();
  for (const e of manifest) {
    // Match on the folder + filename, so a row survives its manuscript moving into _archive.
    const stem = (e.storyPath || "").split("/").slice(-2).join("/");
    if (stem) byStoryStem.set(stem, e);
  }

  const found = findReads();
  const rows = [];
  let fatal = 0;

  for (const f of found) {
    const parsed = parseExternalRead(readFileSync(join(ROOT, f.readPath), "utf8"));
    const stem = f.storyPath.split("/").slice(-2).join("/");
    const existing = byStoryStem.get(stem);
    const bundleId = existing?.bundleId ?? f.storyPath.split("/").slice(-2, -1)[0].replace(/^story_/, "read-");

    if (parsed.problems.length) fatal += 1;

    const merged = {
      ...(existing ?? {}),
      bundleId,
      storyPath: f.storyPath,
      readPath: f.readPath,
      externalFinal: parsed.final ?? existing?.externalFinal ?? null,
      ...(parsed.finalDerived ? { externalFinalDerived: true } : {}),
      externalCategories: Object.keys(parsed.categories).length ? parsed.categories : (existing?.externalCategories ?? {}),
      externalNotes: Object.keys(parsed.notes).length ? parsed.notes : (existing?.externalNotes ?? {}),
    };
    if (merged.internalFinal != null && merged.externalFinal != null) merged.gap = merged.internalFinal - merged.externalFinal;
    // The category sum and its offset — the arithmetic §1.1 carries by hand.
    const marks = Object.values(merged.externalCategories ?? {});
    if (marks.length === 10 && merged.externalFinal != null) {
      merged.externalCategorySum = marks.reduce((a, b) => a + b, 0);
      merged.externalOffset = merged.externalFinal - merged.externalCategorySum;
    }
    rows.push({ merged, parsed });
  }

  // A ledger row whose manuscript is nowhere on disk: keep it, but say so.
  const orphans = manifest.filter((e) => !rows.some((r) => r.merged.bundleId === e.bundleId));

  console.log(`\n  external-read ledger — ${rows.length} manuscript(s) with a read on disk\n`);
  console.log("  bundle                          ext   sum  off   pre hook plot char dial atmo clue pace  end pros");
  console.log("  " + "-".repeat(104));
  for (const { merged: m } of rows.sort((a, b) => (b.merged.externalFinal ?? 0) - (a.merged.externalFinal ?? 0))) {
    const c = m.externalCategories ?? {};
    const cell = (k) => String(c[k] ?? "-").padStart(4);
    console.log(
      `  ${String(m.bundleId).padEnd(30)} ${String(m.externalFinal ?? "-").padStart(3)}  ` +
        `${String(m.externalCategorySum ?? "-").padStart(4)} ${String(m.externalOffset != null ? `+${m.externalOffset}` : "-").padStart(4)}  ` +
        CATEGORY_HEADINGS.map(([k]) => cell(k)).join(""),
    );
  }
  console.log("  " + "-".repeat(104));

  for (const { merged, parsed } of rows) {
    for (const p of parsed.problems) console.log(`  ! ${merged.bundleId}: ${p}`);
  }
  for (const o of orphans) console.log(`  ! ${o.bundleId}: in the manifest, no manuscript+read on disk (${o.storyPath})`);

  if (BEST) {
    console.log("\n  the arithmetic — best-ever mark in each category, and where it came from\n");
    let sum = 0;
    for (const [k] of CATEGORY_HEADINGS) {
      const scored = rows.filter((r) => r.merged.externalCategories?.[k] != null);
      if (!scored.length) continue;
      const best = Math.max(...scored.map((r) => r.merged.externalCategories[k]));
      const who = scored.filter((r) => r.merged.externalCategories[k] === best).map((r) => r.merged.bundleId);
      const worst = Math.min(...scored.map((r) => r.merged.externalCategories[k]));
      sum += best;
      console.log(`    ${k.padEnd(18)} best ${best}  (worst ${worst}, n=${scored.length})  ${who.slice(0, 2).join(", ")}${who.length > 2 ? ` +${who.length - 2}` : ""}`);
    }
    const offsets = rows.filter((r) => r.merged.externalOffset != null).map((r) => r.merged.externalOffset);
    const meanOff = offsets.reduce((a, b) => a + b, 0) / Math.max(1, offsets.length);
    console.log(`\n    best-ever-everywhere sums to ${sum}`);
    console.log(`    headline-minus-sum offset: ${offsets.sort((a, b) => a - b).join(", ")}  (n=${offsets.length}, mean ${meanOff.toFixed(1)})`);
    console.log(`    => a manuscript at best-ever in every category projects to ${(sum + meanOff).toFixed(1)}\n`);
  }

  if (GAPS) {
    /**
     * Which categories can this pipeline actually reach, and which have never moved?
     *
     * This is the question REVIEW_13 §1 asked at n=8 by hand. At n=34, read from the ledger, it has a
     * sharper answer than "three flat categories": **five of the ten have never once been given a 9 by
     * any reader** — and best-ever-everywhere still lands short of 90, so at least one of them has to
     * break its own record for the target to be arithmetically reachable at all.
     */
    const scored = rows.filter((r) => r.merged.externalFinal != null && Object.keys(r.merged.externalCategories ?? {}).length === 10);
    const top = [...scored].sort((a, b) => b.merged.externalFinal - a.merged.externalFinal).slice(0, 8);
    const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

    console.log(`\n  the ceiling, per category — all ${scored.length} reads, and the best 8\n`);
    console.log("    category            all: mean  max  9s      top8: mean  min      verdict");
    for (const [k] of CATEGORY_HEADINGS) {
      const all = scored.map((r) => r.merged.externalCategories[k]);
      const t8 = top.map((r) => r.merged.externalCategories[k]);
      const nines = all.filter((v) => v >= 9).length;
      const verdict = nines === 0 ? `NEVER 9 in ${all.length} reads` : `reached 9 ${nines}x`;
      console.log(
        `    ${k.padEnd(18)} ${mean(all).toFixed(1).padStart(9)} ${String(Math.max(...all)).padStart(4)} ${String(nines).padStart(3)}` +
          `      ${mean(t8).toFixed(1).padStart(9)} ${String(Math.min(...t8)).padStart(4)}      ${verdict}`,
      );
    }
    console.log("\n    the reader's own words, on the categories that have never reached 9:\n");
    for (const [k] of CATEGORY_HEADINGS) {
      if (scored.some((r) => r.merged.externalCategories[k] >= 9)) continue;
      const notes = top.map((r) => (r.merged.externalNotes ?? {})[k]).filter(Boolean).slice(0, 3);
      console.log(`      ${k}`);
      for (const n of notes) console.log(`        · ${n.slice(0, 96)}`);
    }
    console.log("");
  }

  if (WRITE) {
    const out = [...rows.map((r) => r.merged), ...orphans];
    writeFileSync(MANIFEST, `${JSON.stringify(out, null, 2)}\n`, "utf8");
    console.log(`\n  wrote ${out.length} rows to ${relative(ROOT, MANIFEST)}\n`);
  } else if (!CHECK) {
    console.log("\n  (nothing written — pass --write to merge into the manifest)\n");
  }

  if (CHECK && (fatal > 0 || orphans.length > 0)) {
    console.error(`\n  FAIL: ${fatal} unparsed read(s), ${orphans.length} orphaned ledger row(s)\n`);
    process.exit(1);
  }
}
