import { describe, expect, it, vi } from "vitest";
import { runDualValueContrastRegenPass } from "../agent9-prose/regen-integration.js";
import { makeRegenFn } from "../agent9-prose/regen-llm.js";
import { buildStoryBible } from "../story-bible.js";
import { detectDualValueNoContrast } from "@cml/prose-guard";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_62 RC-2.2 — the repair arm for `dualValueNoContrast` (Item 9 / A_57 D2): the discriminating
// clue's staged and true values stated as two flat side-by-side truths instead of one observed
// contradiction. 6/21 shipped runs and accelerating (3 of 5 on M1 attempt 3). The detector was
// promoted from rubric-score into prose-guard so the cap and this lever key off the SAME function.

const pair = { values: ["ten past nine", "a quarter to eight"] as [string, string] };

const bible = buildStoryBible({
  lockedFacts: [{ id: "lf_watch", description: "the watch reading", value: "ten past nine" }],
  cast: [
    { name: "Evelyn Harcourt", gender: "female", role_archetype: "detective" },
    { name: "James Harcourt", gender: "male", role_archetype: "suspect" },
    { name: "Lord Charles Harcourt", gender: "male", role_archetype: "victim" },
  ],
  beatSheet: [],
});

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

  it("is a no-op with NO LLM call when the pair is absent", async () => {
    const client = { chat: vi.fn() } as any;
    const res = await runDualValueContrastRegenPass({
      chapter: FLAT, chapterNumber: 7, bible, pair: null, regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("is a no-op with NO LLM call when the contrast is already framed", async () => {
    const client = { chat: vi.fn() } as any;
    const clean = chapterWith(
      "The smashed watch read ten past nine, yet the tide tables could only give a quarter to eight.",
    );
    const res = await runDualValueContrastRegenPass({
      chapter: clean, chapterNumber: 7, bible, pair, regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("binds the two values into one observed contradiction and reports it repaired", async () => {
    const client = respond(
      chapterWith(
        "The study had gone quiet around the body.",
        "The smashed watch read ten past nine — but Evelyn set it beside the tide tables, and the last crossing could only have been a quarter to eight.",
      ),
    );
    const res = await runDualValueContrastRegenPass({
      chapter: FLAT, chapterNumber: 7, bible, pair, regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(true);
    expect(res.repaired.length).toBe(1);
    expect(res.unresolved).toEqual([]);
    const after = res.chapter.paragraphs.join(" ");
    // provably clear via the cap's own detector, with BOTH values still on the page
    expect(detectDualValueNoContrast(after, pair)).toBe(false);
    expect(after.toLowerCase()).toContain("ten past nine");
    expect(after.toLowerCase()).toContain("a quarter to eight");
  });

  it("REJECTS the false win: deleting one value silences the detector but destroys the clue", async () => {
    // Detector would read clean (no co-occurrence) — but the discriminating contradiction is gone.
    const gutted = chapterWith(
      "The study had gone quiet around the body.",
      "The smashed watch read ten past nine, and Evelyn found nothing else worth noting in the tables.",
    );
    expect(detectDualValueNoContrast(gutted.paragraphs.join(" "), pair)).toBe(false); // the trap is real
    const res = await runDualValueContrastRegenPass({
      chapter: FLAT, chapterNumber: 7, bible, pair, regen: makeRegenFn({ client: respond(gutted) }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0);
    expect(res.repaired).toEqual([]);
    // the original survives — the gutted draft never ships
    expect(res.chapter.paragraphs.join(" ")).toContain("tide tables gave a quarter to eight");
  });

  it("REJECTS a rewrite that keeps both values but still states them flat", async () => {
    const stillFlat = chapterWith(
      "The study had gone quiet around the body.",
      "The smashed watch read ten past nine. Elsewhere the tide tables gave a quarter to eight, plainly noted.",
    );
    const res = await runDualValueContrastRegenPass({
      chapter: FLAT, chapterNumber: 7, bible, pair, regen: makeRegenFn({ client: respond(stillFlat) }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0);
  });

  it("scopes the regen to the paragraph carrying the co-occurrence, not the whole chapter", async () => {
    const seen: number[] = [];
    const fixed = chapterWith(
      "The study had gone quiet around the body.",
      "The smashed watch read ten past nine — yet the tide tables could only give a quarter to eight.",
    );
    const regen = makeRegenFn({ client: respond(fixed) });
    await runDualValueContrastRegenPass({
      chapter: FLAT, chapterNumber: 7, bible, pair,
      regen: async (req) => {
        seen.push(req.paragraphIndex ?? -1);
        return regen(req);
      },
    });
    expect(seen).toEqual([1]); // paragraph 1 holds both values; paragraph 0 is untouched
  });
});
