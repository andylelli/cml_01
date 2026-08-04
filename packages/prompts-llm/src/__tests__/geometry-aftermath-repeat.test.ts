/**
 * The negative-obligation repair pass (GEOMETRY-AGENT-DESIGN §8.5/§8.6).
 *
 * Every other regen pass in this codebase satisfies its constraint by ADDING text. This one cannot:
 * "the aftermath must not repeat the reveal" is only satisfiable by rewriting. The guards below are
 * what stop the cheapest wrong answers — deleting the paragraph, or dropping a locked fact on the
 * way past.
 */

import { describe, expect, it, vi } from "vitest";

import { runAftermathRepeatRegenPass } from "../agent9-prose/regen-integration.js";
import type { ProseChapter } from "../agent9-prose/types.js";

const BIBLE = {
  // `type: "atomic"` is what makes a fact verbatim-binding — descriptive facts are paraphrasable and
  // `lockedFactValues` deliberately filters them out.
  facts: [{ id: "clock", type: "atomic", value: "8:50", description: "the staged time" }],
  characters: [
    { name: "Hugo Hale", pronouns: "he/him", gender: "male" },
    { name: "Eleanor Frey", pronouns: "she/her", gender: "female" },
  ],
  culprits: ["Hugo Hale"],
  beatSheet: [],
} as any;

const REPEATING: ProseChapter = {
  chapterNumber: 10,
  title: "Aftermath",
  paragraphs: [
    "The house emptied slowly, and the clock still read 8:50 where nobody had thought to move it.",
    "Hugo Hale had strangled him with the cord, because exposure would have ruined him, and Eleanor was cleared because the porter saw her at the gate.",
    "Outside, the rain had not let up at all.",
  ],
} as ProseChapter;

const args = (overrides: Record<string, unknown> = {}) => ({
  chapter: REPEATING,
  chapterNumber: 10,
  paragraphIndices: [1],
  culprit: "Hugo Hale",
  methodTerms: ["strangl", "ligature", "throat"],
  revealChapter: 9,
  bible: BIBLE,
  regen: vi.fn(),
  ...overrides,
});

describe("runAftermathRepeatRegenPass", () => {
  it("does not run — and costs nothing — when no paragraph was flagged", async () => {
    const regen = vi.fn();
    const result = await runAftermathRepeatRegenPass(args({ paragraphIndices: [], regen }) as any);
    expect(result.ran).toBe(false);
    expect(regen).not.toHaveBeenCalled();
  });

  it("accepts a rewrite that replaces the restatement with consequence", async () => {
    const regen = vi.fn(async () => ({
      ...REPEATING,
      paragraphs: [
        REPEATING.paragraphs![0],
        "Eleanor did not go to the door with the others. She stood where she was, holding the edge of the table, and found she had nothing at all to say to anyone who was left.",
        REPEATING.paragraphs![2],
      ],
    }));
    const result = await runAftermathRepeatRegenPass(args({ regen }) as any);
    expect(result.ran).toBe(true);
    expect(result.repaired).toEqual(["aftermath_repeat_ch10_p1"]);
    expect(result.chapter.paragraphs![1]).toMatch(/nothing at all to say/);
  });

  it("rejects a rewrite that DELETES the paragraph — the cheapest way to satisfy a negative constraint", async () => {
    const regen = vi.fn(async () => ({
      ...REPEATING,
      paragraphs: [REPEATING.paragraphs![0], REPEATING.paragraphs![2]],
    }));
    const result = await runAftermathRepeatRegenPass(args({ regen }) as any);
    expect(result.repaired).toEqual([]);
    expect(result.unresolved).toEqual(["aftermath_repeat_ch10_p1"]);
    // The original chapter survives intact — a rejected repair must never ship half of itself.
    expect(result.chapter.paragraphs).toEqual(REPEATING.paragraphs);
  });

  it("rejects a rewrite that drops a locked fact present in the original", async () => {
    const regen = vi.fn(async () => ({
      ...REPEATING,
      paragraphs: [
        "The house emptied slowly, and nobody thought to look at the clock.",
        "Eleanor stood by the table for a long time after the cars had gone, and said nothing to anyone at all about any of it.",
        REPEATING.paragraphs![2],
      ],
    }));
    const result = await runAftermathRepeatRegenPass(args({ regen }) as any);
    expect(result.repaired).toEqual([]);
  });

  it("rejects a rewrite that swaps one restatement for another", async () => {
    const regen = vi.fn(async () => ({
      ...REPEATING,
      paragraphs: [
        REPEATING.paragraphs![0],
        "Hugo Hale had murdered him, and the ligature had been the whole of it, and Eleanor was ruled out because the porter's account held.",
        REPEATING.paragraphs![2],
      ],
    }));
    const result = await runAftermathRepeatRegenPass(args({ regen }) as any);
    expect(result.repaired).toEqual([]);
  });
});
