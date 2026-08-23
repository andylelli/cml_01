/**
 * The pairwise judge — PLAN-TO-90 §7.2 M1.2.
 *
 * The point of these tests is not that the parser works. It is that the harness cannot report a
 * flattering number: a position-biased judge must come out as `inconsistent`, an unusable response
 * must not become a tie, and an agreement rate must never be computed from pairs the humans did not
 * separate. Every one of those is a way this instrument could tell the project what it wants to hear.
 */

import { describe, expect, it } from "vitest";

import {
  buildPairwiseSystemPrompt,
  buildPairwiseUserMessage,
  createLLMPairwiseJudge,
  foldOrientations,
  parsePairwiseVerdict,
  summarisePairs,
} from "../pairwise-judge.js";

describe("the instruction", () => {
  it("forbids a tie, because abstention lands on exactly the pairs that matter", () => {
    const p = buildPairwiseSystemPrompt();
    expect(p).toMatch(/A tie is not a permitted answer/);
    expect(p).toMatch(/Ignore which one was shown first/);
  });

  it("names the ten rubric categories so the verdict is commensurable with everything else", () => {
    const p = buildPairwiseSystemPrompt();
    for (const cat of ["premise", "opening_hook", "pacing", "prose"]) expect(p).toContain(cat);
  });
});

describe("the user message", () => {
  it("shows both manuscripts whole by default", () => {
    const msg = buildPairwiseUserMessage({ id: "x", text: "AAA" }, { id: "y", text: "BBB" });
    expect(msg).toContain("=== MANUSCRIPT A ===");
    expect(msg).toContain("AAA");
    expect(msg).toContain("BBB");
    expect(msg).not.toMatch(/TRUNCATED/);
  });

  it("SAYS SO when a caller truncates — a judge reading half a book must not look like one reading all of it", () => {
    const msg = buildPairwiseUserMessage({ id: "x", text: "A".repeat(50) }, { id: "y", text: "B".repeat(10) }, { maxCharsEach: 20 });
    expect(msg).toContain("MANUSCRIPT A [TRUNCATED — the ending is not shown]");
    expect(msg).toContain("=== MANUSCRIPT B ==="); // B fits; only the cut one is labelled
  });
});

describe("parsing a verdict", () => {
  it("reads a clean object", () => {
    const v = parsePairwiseVerdict('{"winner":"B","confidence":4,"reasons":["B plants the cuff earlier"],"category_winners":{"clues":"B","pacing":"A"}}');
    expect(v.winner).toBe("B");
    expect(v.confidence).toBe(4);
    expect(v.categoryWinners).toEqual({ clues: "B", pacing: "A" });
  });

  it("survives commentary after the JSON — the failure that cost a paid Opus call in 0b.0", () => {
    const v = parsePairwiseVerdict('{"winner":"A","confidence":3,"reasons":[]}\n\nHere is my assessment.');
    expect(v.winner).toBe("A");
  });

  it("survives a fenced block", () => {
    expect(parsePairwiseVerdict('```json\n{"winner":"B","confidence":2}\n```').winner).toBe("B");
  });

  it("THROWS on an unusable winner rather than calling it a tie", () => {
    // Silently folding a bad response into "cannot separate" would bias every aggregate toward the
    // hypothesis under test.
    expect(() => parsePairwiseVerdict('{"winner":"neither","confidence":3}')).toThrow(/no usable winner/);
    expect(() => parsePairwiseVerdict('{"confidence":3}')).toThrow(/no usable winner/);
  });

  it("clamps a confidence outside 1-5 instead of trusting it", () => {
    expect(parsePairwiseVerdict('{"winner":"A","confidence":11}').confidence).toBe(5);
    expect(parsePairwiseVerdict('{"winner":"A","confidence":-4}').confidence).toBe(1);
    expect(parsePairwiseVerdict('{"winner":"A"}').confidence).toBe(3);
  });

  it("drops category keys it does not recognise", () => {
    const v = parsePairwiseVerdict('{"winner":"A","category_winners":{"vibes":"A","premise":"B"}}');
    expect(v.categoryWinners).toEqual({ premise: "B" });
  });
});

describe("the judge wrapper", () => {
  it("passes the prompt through and returns the parsed verdict", async () => {
    const seen: any[] = [];
    const judge = createLLMPairwiseJudge(async (args) => {
      seen.push(args);
      return { content: '{"winner":"A","confidence":5,"reasons":["A"],"category_winners":{}}' };
    }, { model: "gpt-4.1-mini" });
    const v = await judge({ systemPrompt: "sys", userMessage: "usr" });
    expect(v.winner).toBe("A");
    expect(seen[0].model).toBe("gpt-4.1-mini");
    expect(seen[0].messages[0]).toEqual({ role: "system", content: "sys" });
    expect(seen[0].temperature).toBe(0.2);
  });
});

describe("folding the two orientations", () => {
  it("returns a verdict only when both orientations name the same BOOK", () => {
    const f = foldOrientations({ first: "x", second: "y", pickedWhenFirstIsA: "x", pickedWhenFirstIsB: "x" });
    expect(f.consistentPick).toBe("x");
    expect(f.inconsistent).toBe(false);
  });

  it("catches the position-biased judge — always-A is always inconsistent", () => {
    // A judge that picks whichever side is labelled A picks `first` in one orientation and `second`
    // in the other. A single-orientation harness would score this 50% and call it noise.
    const f = foldOrientations({ first: "x", second: "y", pickedWhenFirstIsA: "x", pickedWhenFirstIsB: "y" });
    expect(f.consistentPick).toBeUndefined();
    expect(f.inconsistent).toBe(true);
  });

  it("treats a missing orientation as inconsistent, not as a half-verdict", () => {
    expect(foldOrientations({ first: "x", second: "y", pickedWhenFirstIsA: "x" }).inconsistent).toBe(true);
  });
});

describe("summarising a calibration run", () => {
  const marks = { high: 86, mid: 81, low: 68, close: 80 };

  it("scores only pairs the humans actually separated", () => {
    const s = summarisePairs(
      [
        { first: "high", second: "low", consistentPick: "high", inconsistent: false }, // gap 18, correct
        { first: "high", second: "close", consistentPick: "close", inconsistent: false }, // gap 6, wrong
        { first: "mid", second: "close", consistentPick: "close", inconsistent: false }, // gap 1, excluded
      ],
      marks,
    );
    expect(s.scored).toBe(2);
    expect(s.correct).toBe(1);
    expect(s.agreement).toBe(0.5);
    expect(s.consistent).toBe(3);
  });

  it("reports consistency SEPARATELY from agreement", () => {
    const s = summarisePairs(
      [
        { first: "high", second: "low", consistentPick: "high", inconsistent: false },
        { first: "mid", second: "low", inconsistent: true },
        { first: "high", second: "mid", inconsistent: true },
      ],
      marks,
    );
    // Perfect on what it could rank; a coin toss on two thirds of the pairs. Both numbers are needed.
    expect(s.agreement).toBe(1);
    expect(s.consistencyRate).toBeCloseTo(1 / 3);
  });

  it("returns null rather than 0 when nothing was scorable", () => {
    // 0% and "no data" are different findings, and this project has already shipped telemetry that
    // could not tell them apart (X85).
    const s = summarisePairs([{ first: "mid", second: "close", consistentPick: "mid", inconsistent: false }], marks);
    expect(s.scored).toBe(0);
    expect(s.agreement).toBeNull();
  });

  it("ignores a pair whose manuscripts have no human mark", () => {
    const s = summarisePairs([{ first: "high", second: "unread", consistentPick: "high", inconsistent: false }], marks);
    expect(s.scored).toBe(0);
    expect(s.consistent).toBe(1);
  });

  it("honours a custom minimum gap", () => {
    const s = summarisePairs([{ first: "high", second: "close", consistentPick: "high", inconsistent: false }], marks, 10);
    expect(s.scored).toBe(0); // gap 6 < 10
  });
});
