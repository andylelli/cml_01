import { describe, expect, it, vi } from "vitest";
import { runTemplateLeakageRegenPass } from "../agent9-prose/regen-integration.js";
import { makeRegenFn } from "../agent9-prose/regen-llm.js";
import { buildStoryBible } from "../story-bible.js";
import { detectTemplateLeakage } from "@cml/prose-guard";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_62 RC-2.1 — the repair arm for `templateLeakageHits`: the most frequent cap of the M1 era (7/15
// runs; pins prose ≤4 on 10/15; fires with NO scaffold-family cap on 4/15, so the P4 scaffold A/B
// provably cannot reach those runs).
//
// The finding this closes: the lever was ALREADY BUILT and never plugged in. detectTemplateLeakage,
// noTemplateLeakageValidator, the "leakage" ProseDefectKind and its regen instruction all shipped;
// only a producer mapping detector hits -> ProseDefect{kind:"leakage"} was missing.

const bible = buildStoryBible({
  lockedFacts: [{ id: "lf_time", description: "the staged time", value: "half past three" }],
  cast: [
    { name: "Evelyn Harcourt", gender: "female", role_archetype: "detective" },
    { name: "James Harcourt", gender: "male", role_archetype: "suspect" },
    { name: "Lord Charles Harcourt", gender: "male", role_archetype: "victim" },
  ],
  beatSheet: [],
});

const chapterWith = (...paragraphs: string[]): ProseChapter => ({ title: "Ch4", paragraphs });
const respond = (chapter: ProseChapter) =>
  ({ chat: vi.fn(async () => ({ content: JSON.stringify({ chapter }) })) }) as any;

describe("runTemplateLeakageRegenPass — A_62 RC-2.1", () => {
  it("is a no-op with NO LLM call on clean prose (no cost burn)", async () => {
    const client = { chat: vi.fn() } as any;
    const clean = chapterWith(
      "Evelyn set the cold cup down and watched the gardener's hands.",
      "Outside, the rain had stopped at half past three.",
    );
    const res = await runTemplateLeakageRegenPass({
      chapter: clean,
      chapterNumber: 4,
      bible,
      regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("clears leaked validation-text and reports it repaired", async () => {
    // "the time was recorded as" is a TEMPLATE_LEAKAGE pattern — audit text, not prose.
    const leaky = chapterWith(
      "The study smelled of wet ash.",
      "The time was recorded as half past three, and required evidence was kept explicit.",
    );
    expect(detectTemplateLeakage(leaky.paragraphs.join(" ")).length).toBeGreaterThan(0); // premise

    const client = respond(
      chapterWith(
        "The study smelled of wet ash.",
        "The mantel clock had stopped at half past three; Evelyn pressed her thumb to its cold glass and said nothing.",
      ),
    );
    const res = await runTemplateLeakageRegenPass({
      chapter: leaky,
      chapterNumber: 4,
      bible,
      regen: makeRegenFn({ client }),
    });

    expect(res.ran).toBe(true);
    expect(res.repaired.length).toBeGreaterThan(0);
    expect(res.unresolved).toEqual([]);
    // The class is provably gone — checked with the SAME detector the rubric cap keys off.
    expect(detectTemplateLeakage(res.chapter.paragraphs.join(" "))).toEqual([]);
  });

  it("REJECTS a rewrite that drops a locked fact", async () => {
    const leaky = chapterWith("The time was recorded as half past three.");
    // Leakage gone, but the canonical value went with it.
    const client = respond(chapterWith("Evelyn glanced at the clock and frowned."));
    const res = await runTemplateLeakageRegenPass({
      chapter: leaky,
      chapterNumber: 4,
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0); // rejected, not shipped
    expect(res.repaired).toEqual([]);
  });

  it("REJECTS a rewrite that DELETES text instead of re-dramatizing it", async () => {
    // THE GUARDRAIL THAT MATTERS. instructionForDefect says "Remove the leaked material", and the
    // cheapest way to satisfy the detector is deletion — which would trade a prose ≤4 cap for a
    // completeness_structure word-floor failure. That is a strictly worse trade: a cap costs score,
    // a word-floor failure kills the run.
    const leaky = chapterWith(
      "The study smelled of wet ash and old paper, and the fire had burned down to nothing at all.",
      "Evelyn crossed to the window while the house settled around her in the failing light.",
      "The time was recorded as half past three, and required evidence was kept explicit.",
    );
    const gutted = chapterWith("The time had passed."); // leakage-free, and ~95% of the chapter deleted
    const res = await runTemplateLeakageRegenPass({
      chapter: leaky,
      chapterNumber: 4,
      bible,
      regen: makeRegenFn({ client: respond(gutted) }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0);
    // the gutted draft never ships — the original survives
    expect(res.chapter.paragraphs.join(" ")).toMatch(/wet ash/);
  });

  it("REJECTS a rewrite that merely swaps one leaked template for another", async () => {
    const leaky = chapterWith("The time was recorded as half past three.");
    // Different TEMPLATE_LEAKAGE pattern — still audit text, must not be accepted.
    const client = respond(chapterWith("The chapter moves forward through half past three."));
    const res = await runTemplateLeakageRegenPass({
      chapter: leaky,
      chapterNumber: 4,
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0);
  });

  it("scopes the defect to the paragraph that leaked, not the whole chapter", async () => {
    const leaky = chapterWith(
      "The study smelled of wet ash.",
      "Evelyn waited by the window.",
      "The time was recorded as half past three.",
    );
    const seen: number[] = [];
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: chapterWith(
            "The study smelled of wet ash.",
            "Evelyn waited by the window.",
            "The mantel clock had stopped at half past three.",
          ),
        }),
      })),
    } as any;
    const regen = makeRegenFn({ client });
    await runTemplateLeakageRegenPass({
      chapter: leaky,
      chapterNumber: 4,
      bible,
      regen: async (req) => {
        seen.push(req.paragraphIndex ?? -1);
        return regen(req);
      },
    });
    // index 2 is the only leaking paragraph — a free whole-chapter rewrite is the repair.ts:153
    // re-gendering lesson we do not repeat.
    expect(seen).toEqual([2]);
  });
});
