/**
 * R8 (architecture/REVIEW_01.md) — prefix-ordering Agent 9 prompts for automatic caching.
 *
 * Azure OpenAI caches on an EXACT PREFIX MATCH, so the lever is block ORDER, not an API parameter.
 * These tests pin the two properties the change rests on:
 *   1. flag OFF is byte-identical to the order this codebase has always emitted, and
 *   2. flag ON moves blocks WITHOUT changing which blocks exist or what they contain.
 *
 * Both directions, per the REVIEW §7 conventions. The negative case matters more than the positive
 * one here: a reorder that quietly dropped or merged a block would change the prose while looking
 * like a pure optimisation.
 */

import { describe, expect, it } from "vitest";

import {
  buildPromptContextBlocks,
  __isPromptPrefixOrderEnabled,
} from "../agent9-prose/prompt-builder.js";

/** Every section non-empty, so nothing is filtered and order is the only variable under test. */
const allSections = () =>
  ({
    pronounAccuracyBlock: "PRONOUNS",
    characterConsistencyRules: "CONSISTENCY",
    firstAppearanceContractsBlock: "FIRST-APPEARANCE",
    characterPressureContractBlock: "PRESSURE",
    settingRefinementBlock: "SETTING",
    backgroundContextBlock: "BACKGROUND",
    fairPlayContractBlock: "FAIRPLAY",
    characterPersonalityContext: "PERSONALITY",
    characterContractsBlock: "CONTRACTS",
    physicalPlausibilityRules: "PHYSICS",
    eraAuthenticityRules: "ERA",
    locationProfilesContext: "LOCATIONS",
    temporalContextBlock: "TEMPORAL",
    lockedFactsBlock: "LOCKED",
    clueDescriptionBlock: "CLUES",
    nsdBlock: "NSD",
    continuityBlock: "CONTINUITY",
    discriminatingTestBlock: "DISCRIMINATING",
    humourGuideBlock: "HUMOUR",
    craftGuideBlock: "CRAFT",
    sceneGroundingChecklist: "GROUNDING",
    provisionalScoringFeedbackBlock: "FEEDBACK",
    worldDocumentBlock: "WORLD",
    texturePoolBlock: "TEXTURE",
  }) as any;

const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const previous = process.env.AGENT9_PROMPT_PREFIX_ORDER;
  if (value === undefined) delete process.env.AGENT9_PROMPT_PREFIX_ORDER;
  else process.env.AGENT9_PROMPT_PREFIX_ORDER = value;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env.AGENT9_PROMPT_PREFIX_ORDER;
    else process.env.AGENT9_PROMPT_PREFIX_ORDER = previous;
  }
};

/** Blocks whose content is a function of run-level artifacts alone — the cacheable prefix. */
const RUN_FROZEN = [
  "character_consistency",
  "setting_refinement",
  "background_context",
  "fair_play_contract",
  "physical_plausibility",
  "era_authenticity",
  "temporal_context",
  "locked_facts",
  "humour_guide",
  "craft_guide",
];

describe("AGENT9_PROMPT_PREFIX_ORDER flag", () => {
  it("is OFF unless explicitly enabled, and reads env at call time", () => {
    // module-const-flags-frozen-before-dotenv: a module const would freeze before dotenv runs.
    expect(__isPromptPrefixOrderEnabled({})).toBe(false);
    expect(__isPromptPrefixOrderEnabled({ AGENT9_PROMPT_PREFIX_ORDER: "true" })).toBe(true);
    expect(__isPromptPrefixOrderEnabled({ AGENT9_PROMPT_PREFIX_ORDER: "1" })).toBe(true);
    for (const v of ["yes", "on", "TRUE", "", "false", "0"]) {
      expect(__isPromptPrefixOrderEnabled({ AGENT9_PROMPT_PREFIX_ORDER: v })).toBe(false);
    }
  });
});

describe("buildPromptContextBlocks — flag OFF", () => {
  it("emits the historical order unchanged", () => {
    const keys = withFlag(undefined, () => buildPromptContextBlocks(allSections()).map((b) => b.key));

    // The first four and the last two pin the shape that has shipped for ~70 boards.
    expect(keys.slice(0, 4)).toEqual([
      "character_consistency",
      "first_appearance_contracts",
      "character_pressure_contract",
      "setting_refinement",
    ]);
    expect(keys.slice(-2)).toEqual(["provisional_scoring_feedback", "pronoun_accuracy"]);
  });
});

describe("buildPromptContextBlocks — flag ON", () => {
  it("groups every run-frozen block into a contiguous prefix", () => {
    const keys = withFlag("true", () => buildPromptContextBlocks(allSections()).map((b) => b.key));

    const lastRunFrozen = Math.max(...RUN_FROZEN.map((k) => keys.indexOf(k)));
    const firstVarying = keys.findIndex((k) => !RUN_FROZEN.includes(k));

    // Nothing chapter-varying may appear before the last run-frozen block — that gap IS the cache.
    expect(firstVarying).toBeGreaterThan(lastRunFrozen);
    expect(keys.slice(0, RUN_FROZEN.length).sort()).toEqual([...RUN_FROZEN].sort());
  });

  it("keeps pronoun_accuracy last — the A_66 recency fix outranks prefix length", () => {
    // pronoun_accuracy is run-frozen by CONTENT, so a naive stability sort would hoist it to the
    // front and silently undo a measured craft fix. It is pinned instead.
    const keys = withFlag("true", () => buildPromptContextBlocks(allSections()).map((b) => b.key));
    expect(keys[keys.length - 1]).toBe("pronoun_accuracy");
  });

  it("keeps per-attempt feedback after per-chapter content", () => {
    const keys = withFlag("true", () => buildPromptContextBlocks(allSections()).map((b) => b.key));
    expect(keys.indexOf("provisional_scoring_feedback")).toBeGreaterThan(keys.indexOf("narrative_state"));
  });

  it("changes ONLY the order — same blocks, same content, same priorities", () => {
    const off = withFlag(undefined, () => buildPromptContextBlocks(allSections()));
    const on = withFlag("true", () => buildPromptContextBlocks(allSections()));

    expect(on.length).toBe(off.length);
    expect(on.map((b) => b.key).sort()).toEqual(off.map((b) => b.key).sort());
    for (const block of on) {
      const original = off.find((b) => b.key === block.key)!;
      expect(block.content).toBe(original.content);
      expect(block.priority).toBe(original.priority);
    }
  });

  it("still drops empty blocks rather than emitting blank prefix filler", () => {
    const sections = { ...allSections(), humourGuideBlock: "", texturePoolBlock: "   " };
    const keys = withFlag("true", () => buildPromptContextBlocks(sections).map((b) => b.key));
    expect(keys).not.toContain("humour_guide");
    expect(keys).not.toContain("texture_pool");
  });

  it("preserves relative order within a stability group", () => {
    // A bucket concat, not a comparator sort — the result must not depend on sort stability.
    const keys = withFlag("true", () => buildPromptContextBlocks(allSections()).map((b) => b.key));
    expect(keys.indexOf("character_consistency")).toBeLessThan(keys.indexOf("setting_refinement"));
    expect(keys.indexOf("setting_refinement")).toBeLessThan(keys.indexOf("background_context"));
    expect(keys.indexOf("first_appearance_contracts")).toBeLessThan(keys.indexOf("world_document"));
  });
});
