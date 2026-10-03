/**
 * ANALYSIS_99 §10.14 W1 — a review FILE may hold more than one read.
 *
 * `scripts/` had no test harness until this file, and the ledger is the only instrument this project
 * trusts. The defect it now pins was live for six days and cost every number drawn through the
 * ledger: `story_20260912-1815/chatgpt-review.txt` carries three reads of one book (79, 82, 87) and
 * every consumer took the first, so the highest external mark this project has ever received was
 * invisible — to the ledger, to A_99's arithmetic, and to the selector's calibration, where it was
 * suppressing the measured agreement of all six instruments at once.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { splitReads, parseExternalRead, SUPPLEMENTARY_HEADINGS } from "../external-read-ledger.mjs";

test("a file with one read is one segment, unchanged", () => {
  const one = "Some notes.\n\nAs written: 82/100.\n";
  assert.equal(splitReads(one).length, 1);
  assert.equal(splitReads(one)[0], one);
});

test("a file with three closing statements is three reads", () => {
  const three = "first read\nAs written: 79/100.\nsecond read\nAs written: 82/100.\nthird read\nAs written: 87/100.\n";
  const segments = splitReads(three);
  assert.equal(segments.length, 3);
  assert.match(segments[0], /79\/100/);
  assert.match(segments[2], /87\/100/);
  assert.equal(parseExternalRead(segments[2]).final, 87);
});

test("a forecast never starts a new read", () => {
  // Every review ends with "with X fixed this could reach 89-91/100". Splitting on a bare /100
  // would make that a read of its own and record an aspiration as a mark.
  const withForecast = "notes\nAs written: 80/100.\nWith the timing fixed this could reach 86-88/100.\n";
  assert.equal(splitReads(withForecast).length, 1);
  assert.equal(parseExternalRead(withForecast).final, 80);
});

test("a trailing sign-off belongs to the read it follows", () => {
  const trailing = "a\nAs written: 79/100.\nb\nAs written: 87/100.\nClosing thoughts.\n";
  const segments = splitReads(trailing);
  assert.equal(segments.length, 2);
  assert.match(segments[1], /Closing thoughts/);
});

test("empty and malformed input are safe", () => {
  assert.deepEqual(splitReads(""), [""]);
  assert.equal(splitReads(undefined).length, 1);
});

/**
 * Supplementary categories (SUPPLEMENTARY_HEADINGS) are captured but never folded into the ten.
 *
 * The sum gate in the CLI is `Object.values(externalCategories).length === 10`. A heading that leaked
 * into `categories` would make that eleven and silently strip `externalCategorySum` and
 * `externalOffset` from every row that carries it - which, for "Humour / Wit", is sixteen of the
 * most recent reads. Before the heading was listed, those sixteen also each raised
 * `unrecognised category heading`, which is what `--check` was failing on.
 */
const TEN = [
  ["Premise / concept", 9],
  ["Opening hook", 8],
  ["Plot structure", 9],
  ["Character clarity", 8],
  ["Dialogue", 8],
  ["Atmosphere", 9],
  ["Mystery clues", 8],
  ["Pacing", 8],
  ["Ending", 9],
  ["Prose", 8],
];
const table = (rows) => rows.map(([h, n, note]) => `${h}\t${n}/10${note ? `\t${note}` : ""}`).join("\n");
const read = (rows) => `I'd score it around 86/100.\n\n${table(rows)}\n\nAs written: 86/100.\n`;

test("Humour / Wit is captured as supplementary, not as one of the ten", () => {
  const parsed = parseExternalRead(read([...TEN, ["Humour / Wit", 8, "Good dry wit."]]));
  assert.deepEqual(parsed.problems, []);
  assert.equal(Object.keys(parsed.categories).length, 10);
  assert.equal(parsed.categories.humour_wit, undefined);
  assert.equal(parsed.supplementary.humour_wit, 8);
  assert.equal(parsed.notes.humour_wit, "Good dry wit.");
});

test("both supplementary headings together leave the ten untouched", () => {
  const parsed = parseExternalRead(
    read([...TEN, ["Character Life / Relationship Richness", 7], ["Humour / Wit", 8]]),
  );
  assert.deepEqual(parsed.problems, []);
  assert.equal(Object.keys(parsed.categories).length, 10);
  assert.deepEqual(parsed.supplementary, { character_life: 7, humour_wit: 8 });
});

test("the American spelling and a numbered row match, and a second table does not overwrite", () => {
  const parsed = parseExternalRead(read([...TEN, ["11. Humor", 6], ["Humour / Wit", 9]]));
  assert.equal(parsed.supplementary.humour_wit, 6);
  assert.deepEqual(parsed.problems, []);
});

test("an unlisted heading is still reported, so the new pattern is not a catch-all", () => {
  const parsed = parseExternalRead(read([...TEN, ["Tension / Dread", 7]]));
  assert.deepEqual(parsed.problems, ['unrecognised category heading: "Tension / Dread"']);
  assert.equal(Object.keys(parsed.supplementary).length, 0);
});

test("a prose line 'Humour / Wit: 8/10' with no tab is not a table row", () => {
  // Real reads quote the mark again in running text (story_20260925-1240 line 98). The TAB
  // requirement is what keeps that from being read as a second table or as a chapter mark.
  const parsed = parseExternalRead(read(TEN) + "\nHumour / Wit: 8/10\n");
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.supplementary.humour_wit, undefined);
});

test("every supplementary key is distinct from the ten canonical keys", () => {
  const canonical = new Set(Object.keys(parseExternalRead(read(TEN)).categories));
  for (const [key] of SUPPLEMENTARY_HEADINGS) assert.equal(canonical.has(key), false, key);
});

// A_110 N10 — the reader and the date, when the read file records them; null (unrecorded) when it does not.
test("reader and date are read from their own lines, and absent means unrecorded", () => {
  const withHeader = parseExternalRead("reader: GPT-5.2 Thinking\ndate: 2026-10-04\n\nAs written: 84/100\n");
  assert.equal(withHeader.reader, "GPT-5.2 Thinking");
  assert.equal(withHeader.readDate, "2026-10-04");
  assert.equal(withHeader.final, 84);
  const without = parseExternalRead("As written: 84/100\n");
  assert.equal(without.reader, null);
  assert.equal(without.readDate, null);
  assert.ok(!without.problems.some((p) => /reader|date/i.test(p)));
});
