/**
 * "Either The director's shouted rehearsal start ..." — a schema sentence spliced mid-sentence.
 *
 * `false_assumption.statement` is authored as a standalone sentence and interpolated after the word
 * "Either". read-20260904-2035 (82/100, `prose` 7) listed the result among the lines it called
 * "generator fingerprints, not fiction", quoting it verbatim from the shipped book.
 *
 * MEASURED over all 50 stored `cml` artifacts: 50 of 50 statements begin with a capital, so this
 * misfired on EVERY case that ever reached this path. The real first words were The x46, plus
 * Sylvia, Captain, Beatrice and Witnesses — which is exactly why a blanket lowercase would be wrong,
 * and why the decision is made from the case's own cast rather than from a guessed wordlist.
 *
 * The statements below are those five real first words, not invented ones. Driven through the
 * EXPORTED patch rather than the private builder, so the assertions cover the path that ships.
 */

import { describe, expect, it } from "vitest";

import { applyDeterministicDiscriminatingTestPatch } from "../agent9-prose/deterministic-repair.js";

const caseWith = (statement: string) =>
  ({
    CASE: {
      cast: [
        { name: "Sylvia Trent", role: "suspect" },
        { name: "Captain Ivor Hale", role: "suspect" },
        { name: "Beatrice Jardine", role: "suspect" },
        { name: "Dr. Edmund Rutherford", role: "detective" },
      ],
      false_assumption: { statement },
      discriminating_test: { eliminated_suspects: ["Sylvia Trent"] },
    },
  }) as any;

/** A chapter with no discriminating test in it, so the patch has something to do. */
const bareChapter = () =>
  ({
    chapterNumber: 8,
    title: "The Test",
    paragraphs: [
      "The company gathered in the rehearsal hall and waited without speaking.",
      "Rain moved along the high windows, and the lamps had not yet been lit.",
      "Nobody cared to be the first to sit down.",
    ],
  }) as any;

/** Render through the shipping path and return the "Either ..." sentence. */
const eitherClause = (statement: string): string => {
  const result = applyDeterministicDiscriminatingTestPatch(
    bareChapter(),
    caseWith(statement),
    "Dr. Edmund Rutherford",
  );
  // Without this the whole file could pass on a patch that never fired.
  expect(result.inserted, "the patch did not insert — the assertions below would be vacuous").toBe(true);
  const text = (result.chapter.paragraphs as string[]).join("\n\n");
  const match = /Either [^.]*\./.exec(text);
  return match ? match[0] : text;
};

describe("a statement spliced after 'Either' reads as a clause", () => {
  it("lowercases a sentence-opening determiner — the shipped defect, verbatim", () => {
    const clause = eitherClause(
      "The director's shouted rehearsal start at twenty minutes past seven is universally accepted as the exact time rehearsals began.",
    );
    expect(clause).toContain("Either the director's shouted rehearsal start");
    expect(clause).not.toContain("Either The");
  });

  it("lowercases a sentence-opening common noun", () => {
    // "Witnesses" is capitalised only because it opened a sentence — one of the five real first words.
    expect(eitherClause("Witnesses agree the hall was empty until the bell.")).toContain(
      "Either witnesses agree",
    );
  });

  it.each([
    ["Sylvia Trent was seen leaving before the bell rang.", "Either Sylvia Trent"],
    ["Beatrice Jardine kept the only key to the prop room.", "Either Beatrice Jardine"],
    ["Captain Ivor Hale signed the log himself that evening.", "Either Captain Ivor Hale"],
  ])("keeps the capital on a proper noun: %s", (statement, expected) => {
    // A blanket lowercase would write "Either sylvia Trent" — worse than the bug being fixed.
    expect(eitherClause(statement)).toContain(expected);
  });

  it("leaves acronyms and internally-capitalised surnames alone", () => {
    // `^[A-Z][a-z]+$` is the second guard. Neither of these is in the cast, so the cast check alone
    // would not have saved them, and lowering the first letter of either one corrupts it.
    expect(eitherClause("BBC schedules put the broadcast at seven.")).toContain("Either BBC schedules");
    expect(eitherClause("McField's account was never questioned.")).toContain("Either McField's account");
  });

  it("is idempotent — a statement already written as a clause is untouched", () => {
    expect(eitherClause("the accepted explanation still held together.")).toContain(
      "Either the accepted explanation",
    );
  });
});
