import { describe, expect, it, vi } from "vitest";
import { type ProseChapter } from "../prose-contract/types.js";

import { detectDualValueNoContrast } from "@cml/prose-guard";

// A_62 RC-2.2 — the repair arm for `dualValueNoContrast` (Item 9 / A_57 D2): the discriminating
// clue's staged and true values stated as two flat side-by-side truths instead of one observed
// contradiction. 6/21 shipped runs and accelerating (3 of 5 on M1 attempt 3). The detector was
// promoted from rubric-score into prose-guard so the cap and this lever key off the SAME function.

const pair = { values: ["ten past nine", "a quarter to eight"] as [string, string] };

const chapterWith = (...paragraphs: string[]): ProseChapter => ({ title: "Ch7", paragraphs });
const respond = (chapter: ProseChapter) =>
  ({ chat: vi.fn(async () => ({ content: JSON.stringify({ chapter }) })) }) as any;

const FLAT = chapterWith(
  "The study had gone quiet around the body.",
  "The smashed watch read ten past nine. The tide tables gave a quarter to eight for the last crossing.",
);

describe("runDualValueContrastRegenPass — A_62 RC-2.2 / Item 9", () => {
  it("premise: the flat fixture trips the SAME detector the rubric cap uses", () => {
    expect(detectDualValueNoContrast(FLAT.paragraphs.join(" "), pair)).toBe(true);
  });
});
