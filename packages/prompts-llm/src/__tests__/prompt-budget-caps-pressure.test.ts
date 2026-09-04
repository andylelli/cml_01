/**
 * PER-BLOCK CAPS: a pressure valve, not a permanent ceiling — and truncation must report its loss.
 *
 * THE DEFECT, measured on run mystery-1788537332588. Its own budget line read:
 *
 *   budget=40000; fixed=9913; available=30087; context=18168; dropped=[none];
 *   truncated=[setting_refinement, temporal_context, craft_guide, first_appearance_contracts,
 *              character_personality, location_profiles, pronoun_accuracy]
 *
 * Seven blocks cut with TWELVE THOUSAND tokens of headroom unused, because the caps were applied
 * unconditionally before any budget arithmetic. And `truncated=[...]` named only the keys, so
 * "trimmed by five tokens" and "lost its entire tail" printed the same string — beside
 * `dropped=[none]`, which reads as delivered.
 *
 * What it cost: the five countable PAGE SHAPE operations sat at the tail of `craft_guide`, were cut,
 * and reached **0 of 78 prose prompts**. Across the following 80 chapters "open at least four
 * paragraphs on dialogue" was met 0 times, and paragraphs opening on speech sat at 9.0% against the
 * canon's 59.7% — the largest measured difference between our page and real Golden Age prose, in the
 * category (dialogue) that caps every one of our best books.
 */

import { afterEach, describe, expect, it } from "vitest";

import { applyPromptBudgeting } from "../agent9-prose/prompt-builder.js";

const ORIGINAL = process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
  else process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY = ORIGINAL;
});

/** `craft_guide`'s cap is 2000 tokens; 4 chars ≈ 1 token, so this overruns it by ~500. */
const oversizedCraftGuide = "x".repeat(2500 * 4);
const blocks = () => [
  { key: "craft_guide", content: oversizedCraftGuide, priority: "high" as const },
];

describe("truncation reports how much it removed", () => {
  it("names the token loss, not just the block", () => {
    delete process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
    const { truncatedBlocks } = applyPromptBudgeting("sys", "dev", "user", blocks(), 40000);
    expect(truncatedBlocks).toHaveLength(1);
    // The old telemetry was exactly "craft_guide". A reader could not tell 5 tokens from 500.
    expect(truncatedBlocks[0]).not.toBe("craft_guide");
    expect(truncatedBlocks[0]).toMatch(/^craft_guide\(-\d+t\)$/);
    expect(truncatedBlocks[0]).toContain("-500t");
  });
});

describe("AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY", () => {
  it("OFF: caps apply unconditionally — byte-identical to the behaviour that shipped", () => {
    delete process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
    const { composedSystem, truncatedBlocks } = applyPromptBudgeting("sys", "dev", "user", blocks(), 40000);
    expect(truncatedBlocks).toHaveLength(1);
    expect(composedSystem).toContain("[truncated for prompt budget]");
  });

  it("ON and everything fits: nothing is truncated at all", () => {
    // Run 5's real shape: fixed 9913 + context 18168 = 28081 against a 40000 budget. There was room.
    process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY = "true";
    const { composedSystem, truncatedBlocks } = applyPromptBudgeting("sys", "dev", "user", blocks(), 40000);
    expect(truncatedBlocks).toEqual([]);
    expect(composedSystem).not.toContain("[truncated for prompt budget]");
    expect(composedSystem).toContain(oversizedCraftGuide);
  });

  it("ON but under genuine pressure: caps still fire, so the failure they prevent is untouched", () => {
    process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY = "true";
    // A budget far too small for the block — real pressure.
    const { truncatedBlocks } = applyPromptBudgeting("sys", "dev", "user", blocks(), 1200);
    expect(truncatedBlocks).toHaveLength(1);
    expect(truncatedBlocks[0]).toMatch(/^craft_guide\(-\d+t\)$/);
  });

  it("ON: a block already inside its cap is untouched either way", () => {
    process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY = "true";
    const small = [{ key: "craft_guide", content: "a short guide.", priority: "high" as const }];
    expect(applyPromptBudgeting("sys", "dev", "user", small, 40000).truncatedBlocks).toEqual([]);
    delete process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
    expect(applyPromptBudgeting("sys", "dev", "user", small, 40000).truncatedBlocks).toEqual([]);
  });

  it("reads the flag at CALL time, not module load (ADR-0004)", () => {
    delete process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY;
    expect(applyPromptBudgeting("s", "d", "u", blocks(), 40000).truncatedBlocks).toHaveLength(1);
    process.env.AGENT9_PROMPT_CAPS_UNDER_PRESSURE_ONLY = "true";
    expect(applyPromptBudgeting("s", "d", "u", blocks(), 40000).truncatedBlocks).toEqual([]);
  });
});
