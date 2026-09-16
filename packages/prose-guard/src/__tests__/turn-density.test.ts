/**
 * A_95 M6 — turn density, pinned on the book it was found in.
 *
 * The bookshop book (seed 63935) measured 0 chapters entertaining a non-culprit and 0 overturning a
 * belief, across all ten chapters.
 */
import { describe, expect, it } from "vitest";

import { summariseTurnDensity, turnDensity } from "../turn-density.js";

const CULPRITS = ["Percival Orme"];
const OTHERS = ["Iris Thorne", "Oswald Merrow", "Marguerite Selwyn", "Frances Dunmore"];

/** The bookshop shape: every middle chapter converges on the culprit and nothing is overturned. */
const CONVERGENT = Array.from({ length: 10 }, (_, i) =>
  `Whitlock examined the hatch in chapter ${i + 1}. The dust pointed to Percival Orme, and the ledger agreed. ` +
  `The evidence against Percival Orme grew steadily firmer.`,
);

describe("THE DEFECT: a book that converges and never turns", () => {
  it("measures zero on both halves, as the bookshop book did", () => {
    const d = turnDensity(CONVERGENT, CULPRITS, OTHERS);
    expect(d.window).toBe(6);
    expect(d.chaptersSuspectingOthers).toBe(0);
    expect(d.chaptersOverturning).toBe(0);
    expect(d.chaptersWithATurn).toBe(0);
  });
});

describe("KNOWN-POSITIVE: a book with a middle does register one", () => {
  const withTurns = CONVERGENT.map((t, i) =>
    i === 3 ? `${t} For a time the suspicion fell squarely on Iris Thorne, and Whitlock believed it.` :
    i === 5 ? `${t} He had been mistaken about the hatch; the theory could not have been right.` : t,
  );

  it("finds the chapter that suspects an innocent and the one that overturns", () => {
    const d = turnDensity(withTurns, CULPRITS, OTHERS);
    expect(d.chaptersSuspectingOthers).toBe(1);
    expect(d.chaptersOverturning).toBe(1);
    expect(d.chaptersWithATurn).toBe(2);
  });

  it("a sentence naming the CULPRIT as suspect is convergence, not a turn", () => {
    const only = [`Suspicion fell on Percival Orme, and the culprit was plainly him.`];
    expect(turnDensity([...CONVERGENT.slice(0, 2), ...Array(4).fill(only[0])], CULPRITS, OTHERS).chaptersSuspectingOthers).toBe(0);
  });

  it("the window is the middle, so the opening and the reveal do not flatter it", () => {
    const edgesOnly = CONVERGENT.map((t, i) =>
      i === 0 || i === 9 ? `${t} Suspicion fell on Iris Thorne.` : t,
    );
    expect(turnDensity(edgesOnly, CULPRITS, OTHERS).chaptersSuspectingOthers).toBe(0);
  });

  /**
   * A_96 C3 / F6 — the first cut scored seed 50862 at 4 of 6 with no false solution a reader would
   * believe: chapter 6 accused Gwendolyn and cleared her inside the same chapter. A turn is an
   * accusation the chapter ENDS on.
   */
  it("REGRESSION: an accusation cleared in the same chapter is not a turn", () => {
    const takenBack = CONVERGENT.map((t, i) =>
      i === 5
        ? `${t} Suspicion fell on Iris Thorne. Then the ledger cleared Iris Thorne before the hour was out.`
        : t,
    );
    expect(turnDensity(takenBack, CULPRITS, OTHERS).chaptersSuspectingOthers).toBe(0);
  });

  it("but an accusation that survives to the chapter's end still counts", () => {
    const survives = CONVERGENT.map((t, i) =>
      i === 5
        ? `${t} The ledger had cleared Iris Thorne of the theft. Yet suspicion fell squarely on Iris Thorne for the murder, and stayed there.`
        : t,
    );
    expect(turnDensity(survives, CULPRITS, OTHERS).chaptersSuspectingOthers).toBe(1);
  });

  it("no chapters, no crash", () => {
    expect(turnDensity([], CULPRITS, OTHERS).window).toBe(0);
  });
});

describe("the report line", () => {
  it("carries both halves and the baseline it is read against", () => {
    const line = summariseTurnDensity(turnDensity(CONVERGENT, CULPRITS, OTHERS));
    expect(line).toContain("0/6 middle chapters turn");
    expect(line).toContain("non-culprit still in the frame");
    expect(line).toContain("MEASURE only");
  });
});
