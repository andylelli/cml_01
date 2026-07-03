import { describe, expect, it } from "vitest";
import { buildStoryBible } from "../story-bible.js";
import { genderMapFromBible, pronounsFromBible } from "../agent9-prose/regen-integration.js";

// A_61 RC2.2 — the single authoritative gender source from the frozen Bible.

describe("genderMapFromBible", () => {
  const bible = buildStoryBible({
    lockedFacts: [],
    cast: [
      { name: "Evelyn Harcourt", gender: "female", role_archetype: "detective" },
      { name: "James Harcourt", gender: "male", role_archetype: "suspect" },
      { name: "The Stranger", gender: "non-binary", role_archetype: "suspect" }, // → unknown, omitted
    ],
    culprits: ["James Harcourt"],
  });

  it("returns canonical male/female per named character", () => {
    const map = genderMapFromBible(bible);
    expect(map["Evelyn Harcourt"]).toBe("female");
    expect(map["James Harcourt"]).toBe("male");
  });

  it("omits characters whose gender is unresolvable (the contradiction gate surfaces those)", () => {
    expect(genderMapFromBible(bible)["The Stranger"]).toBeUndefined();
  });

  it("agrees with pronounsFromBible", () => {
    expect(pronounsFromBible(bible)["Evelyn Harcourt"]).toBe("she/her");
    expect(pronounsFromBible(bible)["James Harcourt"]).toBe("he/him");
  });
});
