/**
 * THE AFTERMATH REPAIR COULD NOT SUCCEED ON 44% OF THE CHAPTERS IT RAN ON.
 *
 * `runAftermathRepeatRegenPass` composes two validators that contradict each other whenever the
 * repeated paragraph is the only place its locked value appears in that chapter:
 *
 *   noAftermathRepeatValidator    the flagged paragraph must stop re-stating the reveal
 *   preserveLockedFactsValidator  every locked value in the chapter today must still be there after
 *
 * The mechanism IS the locked value, so every candidate that fixes the defect trips the guard.
 *
 * MEASURED on run 22362 (canary_1788549284811): the pass lost twice with
 * `dropped_locked_fact:five minutes` on a ch9 whose only "five minutes" sat inside the very
 * paragraph it had to rewrite — while the book carried that value in ELEVEN paragraphs across EIGHT
 * other chapters, twice in the reveal itself.
 *
 * MEASURED across the archive by replaying the SHIPPED detector over the 30 books that have prose,
 * locked facts and geometry: 16 aftermath chapters carry `aftermath_repeat`, 7 of those 16 (44%) are
 * deadlocked this way, and in 7 of 7 the value survives elsewhere in the manuscript. The guard was
 * protecting nothing in every single case.
 *
 * The reader named the consequence in read-20260904-2035 (82/100, `ending` 6 — the lowest mark and
 * the only category that moved from the previous book): "Chapter 8 already exposes Desmond ... Then
 * Chapter 9 does it again."
 */

import { describe, expect, it, vi } from "vitest";

import type { ProseChapter } from "../agent9-prose/types.js";
import { runAftermathRepeatRegenPass } from "../agent9-prose/regen-integration.js";

const BIBLE = {
  // `type: "atomic"` is what makes a fact verbatim-binding; descriptive facts are paraphrasable and
  // `lockedFactValues` filters them out.
  facts: [{ id: "gap", type: "atomic", value: "five minutes", description: "the concealed interval" }],
  characters: [
    { name: "Hugo Hale", pronouns: "he/him", gender: "male" },
    { name: "Eleanor Frey", pronouns: "she/her", gender: "female" },
  ],
  culprits: ["Hugo Hale"],
  beatSheet: [],
} as any;

/** The locked value appears ONLY in the flagged paragraph — the deadlock shape. */
const REPEATING: ProseChapter = {
  chapterNumber: 9,
  title: "Aftermath",
  paragraphs: [
    "The house emptied slowly, and nobody thought to wind the hall clock.",
    "Hugo Hale had strangled him with the cord in the five minutes after the bell, because exposure would have ruined him, and Eleanor was cleared because the porter saw her at the gate.",
    "Outside, the rain had not let up at all, and the lamps came on along the terrace.",
  ],
} as ProseChapter;

/** A rewrite that does what the defect asks: consequence instead of restatement. */
const REPAIRED: ProseChapter = {
  ...REPEATING,
  paragraphs: [
    REPEATING.paragraphs![0],
    "Hugo Hale did not look up when they took him out, and Eleanor stood apart from the others, saying nothing at all to anyone who passed her in the hall.",
    REPEATING.paragraphs![2],
  ],
} as ProseChapter;

const args = (overrides: Record<string, unknown> = {}) => ({
  chapter: REPEATING,
  chapterNumber: 9,
  paragraphIndices: [1],
  culprit: "Hugo Hale",
  methodTerms: ["strangl", "ligature", "throat"],
  revealChapter: 8,
  bible: BIBLE,
  regen: vi.fn(async () => REPAIRED),
  ...overrides,
});

const reasonsFrom = async (extra: Record<string, unknown>) => {
  const reasons: string[] = [];
  const result = await runAftermathRepeatRegenPass(
    args({ ...extra, onUnresolved: (_d: unknown, reason: string) => reasons.push(reason) }) as any,
  );
  return { result, reasons };
};

describe("the locked-fact guard is scoped to the book, not the chapter", () => {
  it("REGRESSION: without the book text the repair is REJECTED — the deadlock, reproduced", async () => {
    // Non-vacuous guard. If this ever starts passing, the two validators no longer contradict each
    // other and the fix below proves nothing.
    const { result, reasons } = await reasonsFrom({});

    expect(result.ran).toBe(true);
    expect(result.repaired).toEqual([]);
    expect(reasons.join(" ")).toContain("dropped_locked_fact:five minutes");
  });

  it("with the value present elsewhere in the book, the same repair is ACCEPTED", async () => {
    const { result, reasons } = await reasonsFrom({
      otherChaptersText:
        "Chapter 8. The gap was five minutes exactly, and the bell had rung before the cue.",
    });

    expect(result.ran).toBe(true);
    expect(result.repaired.length).toBeGreaterThan(0);
    expect(reasons.join(" ")).not.toContain("dropped_locked_fact");
    expect(result.chapter.paragraphs?.[1]).not.toContain("five minutes");
  });

  it("CONSERVATIVE: a value found nowhere else is still required, so it cannot be lost", async () => {
    // The guard is narrowed, not removed. If the rest of the book never prints the value, dropping it
    // here would genuinely lose it from the manuscript, and the repair must still be refused.
    const { result, reasons } = await reasonsFrom({
      otherChaptersText: "Chapter 8. The bell had rung well before the cue, and nobody disputed it.",
    });

    expect(result.repaired).toEqual([]);
    expect(reasons.join(" ")).toContain("dropped_locked_fact:five minutes");
  });

  it("an empty book text is not the same as an absent one", async () => {
    // `""` is supplied-but-empty: every value is 'not found elsewhere', so every value stays required.
    // This is the branch a `?? ''` upstream would silently produce, and it must behave like the
    // conservative case rather than like the relaxed one.
    const { reasons } = await reasonsFrom({ otherChaptersText: "" });
    expect(reasons.join(" ")).toContain("dropped_locked_fact:five minutes");
  });

  it("still costs nothing when no paragraph was flagged", async () => {
    const regen = vi.fn();
    const result = await runAftermathRepeatRegenPass(
      args({ paragraphIndices: [], regen, otherChaptersText: "five minutes" }) as any,
    );
    expect(result.ran).toBe(false);
    expect(regen).not.toHaveBeenCalled();
  });

  it("the detector still has to clear — relaxing the fact guard does not accept a non-repair", async () => {
    // The point of the change is to stop a SATISFIABLE repair being refused, never to let an
    // unrepaired paragraph through. A candidate that drops the value and leaves the restatement in
    // place must still fail.
    const stillRepeats: ProseChapter = {
      ...REPEATING,
      paragraphs: [
        REPEATING.paragraphs![0],
        "Hugo Hale had strangled him with the cord, because exposure would have ruined him, and Eleanor was cleared because the porter saw her at the gate that evening.",
        REPEATING.paragraphs![2],
      ],
    } as ProseChapter;

    const reasons: string[] = [];
    const result = await runAftermathRepeatRegenPass(
      args({
        regen: vi.fn(async () => stillRepeats),
        otherChaptersText: "Chapter 8. The gap was five minutes exactly.",
        onUnresolved: (_d: unknown, reason: string) => reasons.push(reason),
      }) as any,
    );

    expect(result.repaired).toEqual([]);
    expect(reasons.join(" ")).toContain("aftermath_repeat");
  });
});
