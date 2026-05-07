import { describe, expect, it } from "vitest";
import { __testables } from "../agent65-world-builder.ts";

describe("agent65 world builder storyTheme hardening", () => {
  it("deterministically expands short storyTheme to a complete 25+ word sentence", () => {
    const shortTheme = "In The Clockwork Deception, class tensions and personal ambition reveal how secrets fracture trust and lead to dire consequences.";

    const expanded = __testables.enforceStoryThemeFloor(
      shortTheme,
      25,
      "The cost of protecting status over truth",
      "tense and reflective",
    );

    expect(__testables.countWords(expanded)).toBeGreaterThanOrEqual(25);
    expect(/[.!?]$/.test(expanded)).toBe(true);
    const sentenceEndings = expanded.match(/[.!?]/g) ?? [];
    expect(sentenceEndings.length).toBe(1);
  });

  it("preserves already valid storyTheme text", () => {
    const validTheme = "At its core, the mystery shows that reputation can delay justice, but careful evidence eventually forces every character to confront the moral price of deception.";

    const normalized = __testables.enforceStoryThemeFloor(
      validTheme,
      25,
      "Moral accountability over social image",
      "somber",
    );

    expect(normalized).toBe(validTheme);
  });
});
