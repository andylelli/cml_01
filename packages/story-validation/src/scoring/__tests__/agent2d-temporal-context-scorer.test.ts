import { describe, expect, it } from "vitest";
import { TemporalContextScorer } from "../phase-scorers/agent2d-temporal-context-scorer.js";

describe("TemporalContextScorer completeness hardening", () => {
  it("accepts concise but semantically valid date/season/time fields", async () => {
    const scorer = new TemporalContextScorer();
    const result = await scorer.score(
      {},
      {
        specific_date: "April 1947",
        time_of_day: "evening",
        season: "spring",
        weather_patterns: "Cool rain and mist drifted through the grounds with steady wind and damp stone air.",
        fashion_and_attire: "Tweed jackets, silk ties, leather gloves, cloche hats, polished shoes.",
        seasonal_activities: "Easter gatherings; spring gardening; village market; evening radio drama.",
      },
      { threshold_config: { mode: "standard" } } as any,
    );

    const substantial = result.tests.find((t) => t.name === "Substantial content");
    expect(substantial?.passed).toBe(true);
  });

  it("penalizes thin optional richness independently from required fields", async () => {
    const scorer = new TemporalContextScorer();
    const result = await scorer.score(
      {},
      {
        specific_date: "April 1947",
        time_of_day: "evening",
        season: "spring",
        weather_patterns: "A cold damp wind blew through the lane as rain tapped the windowpanes all night.",
        fashion_and_attire: "Dress.",
        seasonal_activities: "Walking.",
      },
      { threshold_config: { mode: "standard" } } as any,
    );

    const richness = result.tests.find((t) => t.name === "Optional detail richness");
    expect(richness).toBeDefined();
    expect(richness?.passed).toBe(false);
  });
});
