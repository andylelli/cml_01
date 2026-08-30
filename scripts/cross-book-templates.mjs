#!/usr/bin/env node
/**
 * WHAT DOES THIS PIPELINE WRITE IN EVERY BOOK?
 *
 * Each manuscript is scored alone, so a sentence repeated across fifty books costs nothing directly —
 * and is therefore invisible to every instrument this project owns. But a line the model produces in
 * book after book is a line it did not choose: it is the single realisation of some instruction, and
 * within a book that reads as flatness.
 *
 * This is how the chapter-1 opening defect was found (A_76): four post-X94 books opened with, in
 * effect, one sentence. That fix aimed at `opening_hook`, which is 0-for-43 at a 9. The same method
 * should be run against the other four categories that have never scored 9 — `prose`, `dialogue`,
 * `pacing`, `character_clarity`.
 *
 *   node scripts/cross-book-templates.mjs [--min 4] [--dialogue|--narration]
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const argv = process.argv.slice(2);
const MIN = Number(argv[argv.indexOf("--min") + 1]) || 4;
const ONLY = argv.includes("--dialogue") ? "dialogue" : argv.includes("--narration") ? "narration" : "all";

const books = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (f.endsWith(".md") && !/readme|review|notes|debrief|report/i.test(e.name) && statSync(f).size > 8000) books.push(f);
  }
};
walk(join(ROOT, "stories"));

/**
 * Normalise away the things that legitimately differ between books — names, numbers, capitalisation —
 * so the SHAPE of a repeated sentence is what is compared. Without this, "Eleanor Voss pressed her
 * gloved hand to the damp brass rail" and "...to the cool marble" look like two different sentences
 * when they are one template with two fillings.
 */
const CAST = /\b(Eleanor|Voss|Mallory|Finch|Ivor|Hale|Beatrice|Quill|Sylvia|Trent|Hugo|Vane|Marchmont|Ashcombe)\b/g;
const shape = (s) => s
  .replace(CAST, "«NAME»")
  .replace(/\b\d+\b/g, "«N»")
  .replace(/[""'']/g, '"')
  .toLowerCase()
  .replace(/[^a-z«»" ]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const seen = new Map(); // shape -> {books:Set, example:string, words:number}
for (const f of books) {
  const text = readFileSync(f, "utf8");
  const body = text.replace(/^#.*$/gm, " ");
  const localShapes = new Set();
  for (const raw of body.split(/(?<=[.!?])\s+/)) {
    const s = raw.trim();
    const words = s.split(/\s+/).length;
    if (words < 7 || words > 40) continue;
    const isDialogue = /^["""]/.test(s);
    if (ONLY === "dialogue" && !isDialogue) continue;
    if (ONLY === "narration" && isDialogue) continue;
    const k = shape(s);
    if (k.split(" ").length < 6) continue;
    if (localShapes.has(k)) continue;      // count each book once
    localShapes.add(k);
    if (!seen.has(k)) seen.set(k, { books: new Set(), example: s, words });
    seen.get(k).books.add(f);
  }
}

const rows = [...seen.entries()]
  .map(([k, v]) => ({ k, n: v.books.size, example: v.example, words: v.words }))
  .filter((r) => r.n >= MIN)
  .sort((a, b) => b.n - a.n || b.words - a.words);

console.log(`\n  ${books.length} books · sentences (${ONLY}) whose SHAPE recurs in >= ${MIN} different books\n`);
if (!rows.length) { console.log("  none — no cross-book sentence template at this threshold.\n"); process.exit(0); }

console.log(`  ${rows.length} template(s) found. Top 25 by book count:\n`);
for (const r of rows.slice(0, 25)) {
  console.log(`    ${String(r.n).padStart(3)} books  ${r.example.slice(0, 108)}`);
}

const totalBooks = books.length;
console.log(`\n  reach: ${rows.filter((r) => r.n >= totalBooks * 0.25).length} template(s) appear in a QUARTER of all books or more.`);
console.log(`  A line the model writes in a quarter of its books is not a choice it is making.\n`);
