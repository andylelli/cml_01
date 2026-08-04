import test from "node:test";
import assert from "node:assert/strict";

import {
  COMMITTED_TYPE_BY_AGENT_CODE,
  chooseByManuscriptShape,
  unwrapCommitted,
} from "../committed.mjs";

const outline = (titles) => ({ acts: [{ scenes: titles.map((title) => ({ title })) }] });

/**
 * The shape of run 08-02 1654, which is the case N5 exists for: three attempts, the run kept the
 * FIRST, and the manuscript that shipped has ten chapters.
 */
const SHAPE_1654 = {
  chapterCount: 10,
  titles: [
    "The Frozen Clock",
    "Initial Observations",
    "Contradictory Evidence",
    "Motive Exploration",
    "Alibi Verification",
    "The False Solution",
    "Secrets Revealed",
    "Pattern Recognition",
    "The Final Trap",
    "The Revelation",
  ],
};

const ATTEMPT_18 = {
  sequence: 18,
  responseFile: "18.md",
  outline: outline([
    "Discovery",
    "Initial Observations",
    "Contradictory Evidence",
    "Motive Exploration",
    "Alibi Verification",
    "False Solution",
    "Secrets Revealed",
    "Pattern Recognition",
    "The Final Trap",
    "The Revelation",
  ]),
};

const ATTEMPT_19 = {
  sequence: 19,
  responseFile: "19.md",
  outline: outline([
    "Discovery",
    "Initial Observations",
    "Contradictions Arise",
    "Initial Interviews",
    "Alibi Verification",
    "Revisiting the Scene",
    "The False Solution",
    "The Final Trap",
    "Clearing the Innocent",
    "The Culprit Revealed",
  ]),
};

const ATTEMPT_20 = {
  sequence: 20,
  responseFile: "20.md",
  outline: outline([
    "Discovery",
    "Initial Investigation",
    "Contradictions",
    "Motives Revealed",
    "Alibi Checks",
    "The False Solution",
    "Secrets Revealed",
    "The Final Trap",
    "The Revelation",
  ]),
};

test("picks the attempt the manuscript was written from, not the last one", () => {
  const chosen = chooseByManuscriptShape([ATTEMPT_18, ATTEMPT_19, ATTEMPT_20], SHAPE_1654);
  assert.equal(chosen.candidate.responseFile, "18.md");
  assert.equal(chosen.agreement, 8);
});

test("the wrong chapter count is excluded on fact, not on score", () => {
  // Attempt 20 has nine scenes and the manuscript has ten. No title agreement can rescue it.
  const chosen = chooseByManuscriptShape([ATTEMPT_20], SHAPE_1654);
  assert.equal(chosen, null);
  const considered = chooseByManuscriptShape([ATTEMPT_18, ATTEMPT_20], SHAPE_1654);
  assert.equal(considered.consideredCount, 1);
});

/**
 * Agent 9 renames chapters as it writes — 1654's "Discovery" shipped as "The Frozen Clock" — so a
 * rule requiring an exact title match would reject the right attempt and fall through to the wrong
 * one. The winning candidate here agrees on 8 of 10 and must still win.
 */
test("does not require the titles to match exactly", () => {
  assert.notDeepEqual(ATTEMPT_18.outline.acts[0].scenes.map((s) => s.title), SHAPE_1654.titles);
  assert.equal(chooseByManuscriptShape([ATTEMPT_18], SHAPE_1654).candidate.responseFile, "18.md");
});

test("with no title evidence either way, the later attempt keeps the old behaviour", () => {
  const shape = { chapterCount: 2, titles: ["Nothing", "Alike"] };
  const a = { sequence: 5, responseFile: "a.md", outline: outline(["One", "Two"]) };
  const b = { sequence: 6, responseFile: "b.md", outline: outline(["Three", "Four"]) };
  assert.equal(chooseByManuscriptShape([a, b], shape).candidate.responseFile, "b.md");
});

test("says nothing rather than guessing when the manuscript shape is unknown", () => {
  assert.equal(chooseByManuscriptShape([ATTEMPT_18], null), null);
  assert.equal(chooseByManuscriptShape([], SHAPE_1654), null);
});

/**
 * The store holds `setting` and `cast` WRAPPED and every other type as a superset of the response
 * body. Unwrapping the wrong set hands the replay `{setting: {...}, cost, latencyMs}` where it
 * expects `{era, location, …}` — a shape mismatch that would surface as a missing field somewhere
 * downstream rather than as a hydration error.
 */
test("unwraps exactly the two artifacts the store wraps", () => {
  assert.deepEqual(unwrapCommitted("setting", { setting: { era: "1936" }, cost: 1 }), { era: "1936" });
  assert.deepEqual(unwrapCommitted("cast", { cast: { characters: [] }, cost: 1 }), { characters: [] });
  const outlinePayload = { acts: [], totalScenes: 10, cost: 1 };
  assert.deepEqual(unwrapCommitted("outline", outlinePayload), outlinePayload);
  const cml = { CML_VERSION: "2.0", CASE: {} };
  assert.deepEqual(unwrapCommitted("cml", cml), cml);
});

test("a wrapped type that is somehow not wrapped is passed through untouched", () => {
  const bare = { era: "1936", location: "hotel" };
  assert.deepEqual(unwrapCommitted("setting", bare), bare);
});

/**
 * Agent 4 revises `cml` IN PLACE. A store lookup for code "4" would hand the replay the
 * post-revision CML as if it were the pre-revision input — the stage's own output as its input.
 */
test("agent 4 has no committed artifact of its own", () => {
  assert.equal(COMMITTED_TYPE_BY_AGENT_CODE["4"], undefined);
  assert.equal(COMMITTED_TYPE_BY_AGENT_CODE["3"], "cml");
  assert.equal(COMMITTED_TYPE_BY_AGENT_CODE["7"], "outline");
});
