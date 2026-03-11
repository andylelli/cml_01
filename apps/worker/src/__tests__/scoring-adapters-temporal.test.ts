import { describe, expect, it } from "vitest";
import { adaptTemporalContextForScoring } from "../jobs/scoring-adapters/index.js";

describe("adaptTemporalContextForScoring optional richness mapping", () => {
  it("includes accessories, holidays, events, and social issues in synthesized fields", () => {
    const temporal = {
      specificDate: { day: 12, month: "April", year: 1947 },
      seasonal: {
        season: "spring",
        weather: ["Light rain", "Cold wind"],
        daylight: "Long evenings",
        seasonalActivities: ["Garden parties"],
        holidays: ["Easter gatherings"],
      },
      fashion: {
        mensWear: { formal: ["Tweed suit"], casual: ["Knit jumper"], accessories: ["Pocket watch"] },
        womensWear: { formal: ["Wool dress"], casual: ["Cardigan"], accessories: ["Pearl brooch"] },
        trendsOfTheMoment: ["Utility tailoring"],
        socialExpectations: ["Formal dress at dinner"],
      },
      cultural: {
        dailyLife: {
          typicalPrices: ["Tea: 2d"],
          commonActivities: ["Evening radio"],
          socialRituals: ["Sunday roast"],
        },
      },
      currentAffairs: {
        majorEvents: ["Post-war ration policy"],
        socialIssues: ["Housing shortages"],
      },
      atmosphericDetails: ["Wet stone and coal smoke"],
    } as any;

    const adapted = adaptTemporalContextForScoring(temporal);

    expect(adapted.fashion_and_attire).toContain("Men's accessories: Pocket watch");
    expect(adapted.fashion_and_attire).toContain("Women's accessories: Pearl brooch");
    expect(adapted.seasonal_activities).toContain("Easter gatherings");
    expect(adapted.seasonal_activities).toContain("Post-war ration policy");
    expect(adapted.seasonal_activities).toContain("Housing shortages");
  });
});
