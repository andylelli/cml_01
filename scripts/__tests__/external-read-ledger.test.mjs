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

import { splitReads, parseExternalRead } from "../external-read-ledger.mjs";

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
