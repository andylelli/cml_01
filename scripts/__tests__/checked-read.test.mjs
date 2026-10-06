// A_110 §39.2 — the checked read's questions come from the case's own artifacts, each with the probe's answer.
// Needs the archive (data/store.json and the motivating manuscript); skips cleanly where it is absent (a fresh worktree).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const MS = "stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md";
const haveArchive = existsSync("data/store.json") && existsSync(MS);

test("questions are generated from the case, numbered, and carry the probe's own answers", { skip: !haveArchive && "no archive" }, async () => {
  const { questionsFor } = await import("../checked-read.mjs");
  const sheet = questionsFor(readFileSync(MS, "utf8"));
  assert.ok(sheet, "the manuscript matches a stored case");
  assert.ok(sheet.questions.length >= 4);
  assert.deepEqual(sheet.questions.map((q) => q.id), sheet.questions.map((_, i) => `Q${i + 1}`));
  for (const q of sheet.questions) assert.equal(typeof q.truth, "boolean");
  // The motivating book misses the opening the owner asked for: the place is not set before the first line of speech.
  assert.equal(sheet.questions[0].truth, false);
});
