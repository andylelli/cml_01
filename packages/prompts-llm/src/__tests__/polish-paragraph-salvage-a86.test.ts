/**
 * A_86 item 25 — a regressing paragraph must not discard a whole chapter's line-editing.
 *
 * MEASURED: 39 of 72 recorded post-pass-polish calls were rolled back whole, and that pass is 26% of
 * run spend, so each whole-chapter discard threw away roughly £0.06 of line-editing because of one
 * sentence. Validation here is deterministic and local, so the polished chapter can be re-tested with
 * one changed paragraph reverted at a time — and anything kept has passed exactly the same validator
 * the whole-chapter version had to pass.
 *
 * The invariant these tests exist to pin: salvage can only ever RECOVER a rollback, never cause one,
 * and never keep text the gate rejects.
 */

import { describe, expect, it, vi } from "vitest";
import { polishPassingChapter } from "../agent9-prose/post-pass-polish.js";

const ORIGINAL = {
  title: "Chapter 5",
  paragraphs: ["The rain had not stopped.", "BAD SENTENCE.", "Neville closed the ledger."],
};
/** The polish improved all three paragraphs; only the middle one introduces the regression. */
const POLISHED = {
  title: "Chapter 5",
  paragraphs: ["The rain had not stopped since Tuesday.", "POISON SENTENCE.", "Neville closed the ledger softly."],
};

/** A client that returns the polished chapter once. */
const clientReturning = (chapter: unknown) => {
  const noop = new Proxy({}, { get: () => () => undefined });
  return new Proxy({}, {
    get: (_t, prop) => {
      if (prop === "chat" || prop === "chatWithRetry") {
        return async () => ({ content: JSON.stringify({ status: "draft", chapters: [chapter] }), finishReason: "stop" });
      }
      if (prop === "getLogger" || prop === "getCostTracker") return () => noop;
      return () => undefined;
    },
  }) as never;
};

/** Rejects any candidate still containing the poison sentence. */
const validateRejectingPoison = vi.fn(async (candidate: { paragraphs?: string[] }) => {
  const text = (candidate.paragraphs ?? []).join(" ");
  return {
    chapter: candidate,
    hardErrors: text.includes("POISON") ? ["VICTIM ALIVE: POISON SENTENCE."] : [],
  };
});

const run = (validate: typeof validateRejectingPoison) =>
  polishPassingChapter({
    chapter: ORIGINAL,
    client: clientReturning(POLISHED),
    repairContext: {
      stageMode: "suspect_pressure",
      matchingClearances: [],
      requiredClueSummaries: [],
      lockedFacts: [],
      castNames: [],
      chapterNumber: 5,
      culpritName: "Lavinia Yardley",
      investigatorName: "Neville Ingram",
    } as never,
    model: "test",
    validateCandidate: validate as never,
  } as never);

describe("A_86 item 25 — paragraph-scoped salvage", () => {
  it("keeps the two innocent paragraphs and reverts only the regressing one", async () => {
    const result = await run(validateRejectingPoison);
    expect(result.keptPolishedVersion).toBe(true);
    expect(result.salvagedParagraphIndex).toBe(1);
    expect(result.chapter.paragraphs).toEqual([
      "The rain had not stopped since Tuesday.", // polished, kept
      "BAD SENTENCE.", // reverted — this is the one that regressed
      "Neville closed the ledger softly.", // polished, kept
    ]);
  });

  it("what it keeps has passed the SAME validator — nothing the gate rejects survives", async () => {
    const result = await run(validateRejectingPoison);
    const finalText = (result.chapter.paragraphs ?? []).join(" ");
    expect(finalText).not.toContain("POISON");
  });

  it("when NO single revert clears the errors, it rolls back whole exactly as before", async () => {
    const rejectEverything = vi.fn(async (candidate: { paragraphs?: string[] }) => ({
      chapter: candidate,
      hardErrors: ["VICTIM ALIVE: something structural"],
    }));
    const result = await run(rejectEverything as never);
    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("validation_regression");
    expect(result.chapter.paragraphs).toEqual(ORIGINAL.paragraphs);
  });

  it("a clean polish is untouched by the salvage path", async () => {
    const acceptAll = vi.fn(async (candidate: unknown) => ({ chapter: candidate, hardErrors: [] as string[] }));
    const result = await run(acceptAll as never);
    expect(result.keptPolishedVersion).toBe(true);
    expect(result.salvagedParagraphIndex).toBeUndefined();
    expect(result.chapter.paragraphs).toEqual(POLISHED.paragraphs);
  });
});
