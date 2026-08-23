/**
 * A_72 C1 — the article belongs to the sentence, never to the locked value.
 *
 * MEASURED CAUSE. The 08-23 run registered `"a quarter past eleven"` beside `"ten minutes past
 * eleven"`. Both go to Agent 9 under a HARD verbatim contract, so the model regularised them and the
 * shipped book says "a ten minutes past eleven" about ten times. That manuscript's external read
 * scored `prose` 6/10 — its worst category, and the drag on an 81 (A_72 §5).
 *
 * These tests are mostly about what the strip must NOT do. A normaliser that reaches into the middle
 * of a locked value, or empties one, corrupts the ground truth every downstream gate matches against.
 */

import { describe, expect, it } from "vitest";

import { stripLeadingArticleFromLockedValue as strip } from "../agent3b-run.js";

describe("stripping the leading article", () => {
  it("fixes the value that caused the defect", () => {
    expect(strip("a quarter past eleven")).toBe("quarter past eleven");
  });

  it("handles all three articles, in any case", () => {
    expect(strip("A quarter to nine")).toBe("quarter to nine");
    expect(strip("an hour after midnight")).toBe("hour after midnight");
    expect(strip("The ledger for the second week")).toBe("ledger for the second week");
  });

  it("leaves a value that never had one exactly as it was", () => {
    for (const v of ["ten minutes past eleven", "half past ten", "forty minutes", "six-foot wire"]) {
      expect(strip(v), v).toBe(v);
    }
  });

  it("touches only the FIRST word — articles inside the phrase are part of the fact", () => {
    // "the second week" is what the device declared; rewriting it would change the ground truth.
    expect(strip("the ledger for the second week")).toBe("ledger for the second week");
    expect(strip("scratch on the pendulum arm")).toBe("scratch on the pendulum arm");
  });

  it("does not strip a word that merely STARTS with an article", () => {
    expect(strip("another quarter hour")).toBe("another quarter hour");
    expect(strip("theatre door key")).toBe("theatre door key");
    expect(strip("anchor chain length")).toBe("anchor chain length");
  });

  it("never empties a fact, and never leaves a stub", () => {
    // A value that is nothing but an article is malformed, but emptying it would delete ground truth
    // the validator still has to match. Better to keep the malformed original and let the gates see it.
    expect(strip("the")).toBe("the");
    expect(strip("a")).toBe("a");
    expect(strip("an  ")).toBe("an");
  });

  it("trims, and is idempotent — the registry may normalise twice without drift", () => {
    expect(strip("  a quarter past eleven  ")).toBe("quarter past eleven");
    expect(strip(strip("a quarter past eleven"))).toBe("quarter past eleven");
  });

  it("leaves the two values PARALLEL, which is the whole point", () => {
    // Both are now bare noun phrases, so "at X" and "at Y" are both grammatical and the model has no
    // reason to graft an article onto the one that lacks it.
    const a = strip("a quarter past eleven");
    const b = strip("ten minutes past eleven");
    expect(`at ${a}`).toBe("at quarter past eleven");
    expect(`at ${b}`).toBe("at ten minutes past eleven");
    expect(/^(a|an|the)\s/i.test(a)).toBe(false);
    expect(/^(a|an|the)\s/i.test(b)).toBe(false);
  });
});
