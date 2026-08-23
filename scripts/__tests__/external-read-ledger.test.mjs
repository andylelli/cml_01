/**
 * The external-read parser — PLAN-TO-90 §7.2 M1.1.
 *
 * These reads are the project's ONLY ground truth (§4a/0.4), so the parser that turns them into data
 * is worth more than the usual test. Every fixture below is a REAL shape taken from
 * `stories/**\/chatgpt*.txt`, including the two that broke the first version of it.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parseExternalRead, CATEGORY_HEADINGS } from "../external-read-ledger.mjs";

const T = "\t";
const table = (marks) =>
  [
    `Premise / concept${T}${marks[0]}/10${T}Reversed escapement is distinctive.`,
    `Opening hook${T}${marks[1]}/10${T}Body, clock contradiction, weapon.`,
    `Plot structure${T}${marks[2]}/10${T}Good escalation.`,
    `Character clarity${T}${marks[3]}/10${T}Roles are stable.`,
    `Dialogue${T}${marks[4]}/10${T}Dry wit works well.`,
    `Atmosphere / setting${T}${marks[5]}/10${T}Fog, bell tower, blackout curtains.`,
    `Mystery clues / evidence logic${T}${marks[6]}/10${T}Strong clue chain.`,
    `Pacing${T}${marks[7]}/10${T}Chapter 9 repeats clearances.`,
    `Ending / reveal${T}${marks[8]}/10${T}On-page and physical.`,
    `Prose / polish${T}${marks[9]}/10${T}Fewer obvious artifacts.`,
  ].join("\n");

describe("the headline mark", () => {
  it("prefers the closing statement", () => {
    const r = parseExternalRead(`I'd score it around 84/100.\n${table([9, 8, 8, 8, 8, 8, 8, 8, 9, 8])}\nAs written: 86/100.`);
    assert.equal(r.final, 86);
    assert.equal(r.finalDerived, false);
    assert.match(r.problems.join(" "), /disagrees with itself/);
  });

  it("reads the opening statement when there is no closing one", () => {
    assert.equal(parseExternalRead(`I'd score it around 81/100.\n${table([8, 8, 7, 8, 7, 8, 7, 7, 7, 7])}`).final, 81);
  });

  it('accepts "I\'d mark this around N/100" and "Overall mark: N/100"', () => {
    assert.equal(parseExternalRead(`I'd mark this around 56/100.\n${table([7, 5, 5, 2, 6, 7, 6, 6, 6, 5])}`).final, 56);
    assert.equal(parseExternalRead(`Overall mark: 52/100\n${table([6, 5, 5, 6, 5, 5, 6, 2, 2, 4])}`).final, 52);
  });

  it("NEVER takes the forecast as the mark", () => {
    // Every read ends with one of these. Matching /100 anywhere records the aspiration as the score.
    const r = parseExternalRead(
      `As written: 84/100.\n${table([9, 8, 8, 8, 7, 8, 8, 8, 8, 7])}\nWith the timing clarified this could reach 89–91/100.`,
    );
    assert.equal(r.final, 84);
  });

  it('derives from "could rise from about N/100" only when nothing is stated, and says so', () => {
    const r = parseExternalRead(`${table([8, 6, 7, 6, 5, 7, 7, 6, 6, 5])}\nI expect it to rise from about 69/100 to the mid-70s.`);
    assert.equal(r.final, 69);
    assert.equal(r.finalDerived, true);
    // A stated mark always wins over the from-clause.
    const stated = parseExternalRead(`As written: 71/100.\n${table([8, 7, 8, 6, 6, 7, 7, 7, 6, 5])}\nthis could rise from around 71/100`);
    assert.equal(stated.finalDerived, false);
  });
});

describe("the category table", () => {
  it("reads all ten categories and their notes", () => {
    const r = parseExternalRead(`As written: 86/100.\n${table([9, 8, 8, 8, 8, 8, 8, 8, 9, 8])}`);
    assert.deepEqual(Object.keys(r.categories).sort(), CATEGORY_HEADINGS.map(([k]) => k).sort());
    assert.equal(r.categories.premise, 9);
    assert.equal(r.categories.ending, 9);
    assert.equal(r.notes.pacing, "Chapter 9 repeats clearances.");
    assert.deepEqual(r.problems, []);
  });

  it("accepts numbered headings", () => {
    const numbered = table([7, 6, 5, 5, 5, 6, 5, 5, 5, 4])
      .split("\n")
      .map((line, i) => `${i + 1}. ${line}`)
      .join("\n");
    const r = parseExternalRead(`Overall mark: 53/100\n${numbered}`);
    assert.equal(Object.keys(r.categories).length, 10);
    assert.equal(r.categories.character_clarity, 5);
  });

  it("does NOT mistake a chapter-by-chapter review for a category table", () => {
    /**
     * `story_20260618-0424` is a chapter-by-chapter read: ten sections, each ending in a bare
     * `Mark: 6/10`. Those are CHAPTER marks. A whitespace-tolerant pattern would have recorded them
     * as this manuscript's rubric — ten real numbers, all in the wrong vocabulary, and nothing
     * downstream could have told. The tab is the guard.
     */
    const r = parseExternalRead(
      ["Overall mark: 52/100", "", "Chapter 1: Discovery", "Strong opening image.", "", "Mark: 6/10", "", "Chapter 2", "", "Mark: 5/10"].join("\n"),
    );
    assert.equal(r.final, 52);
    assert.deepEqual(r.categories, {});
    assert.match(r.problems.join(" "), /no category table found/);
  });

  it("reports an unknown heading rather than dropping it", () => {
    const r = parseExternalRead(`As written: 70/100.\n${table([8, 7, 8, 6, 6, 8, 5, 7, 7, 4])}\nWorldbuilding${T}6/10${T}Not a rubric category.`);
    assert.match(r.problems.join(" "), /unrecognised category heading: "Worldbuilding"/);
    assert.equal(Object.keys(r.categories).length, 10);
  });

  it("keeps the first table when a read quotes its own marks again", () => {
    const r = parseExternalRead(`As written: 86/100.\n${table([9, 8, 8, 8, 8, 8, 8, 8, 9, 8])}\n${table([5, 5, 5, 5, 5, 5, 5, 5, 5, 5])}`);
    assert.equal(r.categories.premise, 9);
  });

  it("names the missing ones when a table is partial", () => {
    const r = parseExternalRead(`As written: 66/100.\nPremise / concept${T}8/10${T}fine.\nPacing${T}7/10${T}fine.`);
    assert.match(r.problems.join(" "), /missing categories: opening_hook, plot_structure/);
  });
});
