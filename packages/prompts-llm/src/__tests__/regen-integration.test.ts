import { describe, expect, it, vi } from "vitest";
import { assembleScoringChapterTexts } from "../prose-contract/scoring-texts.js";
import { type ProseChapter } from "../prose-contract/types.js";

import { detectScaffoldNotProse } from "@cml/prose-guard";

// ── A_64 §2 — the 7.2 dual-value rewire: cap-scope detection + the ship-scope residual arm ──

describe("dual-value at SHIP scope — the 7.2 'enabled and silent' split-brain", () => {
  const pair = { values: ["ten past nine", "a quarter to eight"] as [string, string] };
  const crossChapter: any[] = [
    { title: "Chapter 1", paragraphs: ["The study was cold.", "The watch on the desk read ten past nine."] },
    { title: "Chapter 2", paragraphs: ["The tide tables gave a quarter to eight for the last crossing.", "Nobody spoke."] },
  ];

  it("assembleScoringChapterTexts mirrors the rubric's text (title + double-newline joins)", () => {
    const texts = assembleScoringChapterTexts(crossChapter);
    expect(texts[0]).toBe("Chapter 1\n\nThe study was cold.\n\nThe watch on the desk read ten past nine.");
    expect(texts).toHaveLength(2);
  });
});

