/**
 * ── Does a book put the killing evidence on TWO different objects? ───────────────────────────────
 *
 * REVIEWER-NAMED, twice, and it cost marks both times:
 *   "1. Murder weapon confusion — Chapter 1 says a heavy brass letter opener lies near the body.
 *    Chapter 3 introduces a heavy brass candlestick with blood and hair... Use one weapon."
 *   "1. Weapon confusion: paperweight vs decanter — Chapter 1 says a heavy glass paperweight lies
 *    near Finch's hand with dark residue. Chapter 3 says the weapon is a heavy glass decanter."
 *   "With the time math fixed and the weapon cleaned up, this could reach 87-89/100."
 *
 * WHAT THIS READS, and why it is the manuscripts and not the artifact store: an earlier version of
 * this probe joined through `data/store.json` and missed BOTH books the reviewers named, because
 * neither has a prose artifact there. The manuscripts on disk are the shipped text and are complete.
 * The probe now does what the reviewer does — read the book — and needs no case join at all.
 *
 * THE RULE: a weapon noun "carries the killing" when it appears in a sentence with blood, a wound or
 * gore. Two or more such objects in one book is the defect. `struck` is deliberately NOT evidence:
 * "the clock struck three" is the single most common sentence in this corpus.
 *
 * Validates against the two reviewer-named books before reporting anything (CLAUDE.md: a probe's
 * result is a claim about the probe until it is shown to work on a known positive).
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";

const WEAPON_NOUNS = [
  "paperweight", "candlestick", "letter opener", "letter-opener", "decanter", "poker", "dagger",
  "revolver", "pistol", "statuette", "bookend", "ashtray", "walking stick", "hammer", "wrench",
  "vase", "trophy", "knife",
];
/**
 * Marks of the killing. NOT "struck": a clock strikes an hour in every book in this corpus.
 *
 * The prose EUPHEMISES, and a literal blood/wound vocabulary missed one of the two reviewer-named
 * books outright. Neither says "blood" of its weapon: one has "its edge smeared with a dark, sticky
 * residue", the other "its surface smeared dark and sticky". This list was arrived at by reading
 * those sentences, not by guessing at what the prose would say.
 */
const KILLING_EVIDENCE =
  /\b(blood|bloodied|bloodstain\w*|blood-stained|wound\w*|gore|residue|smear\w*|sticky|stain\w*)\b/i;

const weaponsCarryingTheKilling = (text) => {
  const found = new Set();
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (!KILLING_EVIDENCE.test(sentence)) continue;
    const lower = sentence.toLowerCase();
    for (const noun of WEAPON_NOUNS) {
      if (!lower.includes(noun)) continue;
      // fold the two spellings of the same object
      found.add(noun === "letter-opener" ? "letter opener" : noun);
    }
  }
  return [...found];
};

const bookText = (dir) => {
  const md = readdirSync(`stories/${dir}`).find((f) => f.endsWith(".md"));
  return md ? readFileSync(`stories/${dir}/${md}`, "utf8") : null;
};

// ── known-positive check ──
const KNOWN = [
  ["story_20260825-2102", ["letter opener", "candlestick"]],
  ["story_20260826-1708", ["paperweight", "decanter"]],
];
let probeWorks = true;
for (const [dir, expected] of KNOWN) {
  const text = existsSync(`stories/${dir}`) ? bookText(dir) : null;
  const found = text ? weaponsCarryingTheKilling(text) : [];
  const ok = expected.every((w) => found.includes(w));
  console.log(`known positive ${dir}: ${ok ? "DETECTED" : "MISSED"} — found [${found.join(", ")}]`);
  if (!ok) probeWorks = false;
}
if (!probeWorks) {
  console.log("\nPROBE IS BROKEN — it does not catch the cases a human reviewer caught. Ignore the rate below.");
  process.exit(1);
}

// ── the rate ──
const dirs = readdirSync("stories").filter((d) => d.startsWith("story_2026"));
let books = 0;
let confused = 0;
const rows = [];
for (const dir of dirs) {
  const text = bookText(dir);
  if (!text || text.split(/\s+/).length < 4000) continue;
  books += 1;
  const weapons = weaponsCarryingTheKilling(text);
  if (weapons.length >= 2) {
    confused += 1;
    rows.push(`${dir.slice(6)}  ${weapons.join("  vs  ")}`);
  }
}

console.log(`\nbooks read                                   : ${books}`);
console.log(`books where TWO objects carry the killing    : ${confused} (${books ? ((100 * confused) / books).toFixed(0) : 0}%)`);
for (const r of rows) console.log(`  ${r}`);
