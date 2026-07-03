import { describe, expect, it } from "vitest";
import { buildStoryBible, resolveDiscriminatingTestChapter } from "../story-bible.js";
import { embargoForBeat } from "../agent9-prose/regen-integration.js";

// A_61 RC2.4 — the mechanism-reveal boundary is a frozen Bible field (the macro-arc DISCRIMINATING
// chapter), not re-derived per stage-mode. The pre-test beats embargo the mechanism.

const planWithDiscriminating = [
  { chapter: 1, archetype: "DISCOVERY" },
  { chapter: 2, archetype: "INVESTIGATION" },
  { chapter: 3, archetype: "DISCRIMINATING" },
  { chapter: 4, archetype: "RESOLUTION" },
];

describe("resolveDiscriminatingTestChapter", () => {
  it("returns the DISCRIMINATING chapter", () => {
    expect(resolveDiscriminatingTestChapter(planWithDiscriminating)).toBe(3);
  });
  it("falls back to confrontation/resolution, else null", () => {
    expect(resolveDiscriminatingTestChapter([{ chapter: 5, archetype: "CONFRONTATION" }])).toBe(5);
    expect(resolveDiscriminatingTestChapter([{ chapter: 1, archetype: "DISCOVERY" }])).toBeNull();
    expect(resolveDiscriminatingTestChapter([])).toBeNull();
  });
});

describe("buildStoryBible — discriminatingTestChapter + per-beat mechanism embargo", () => {
  const bible = buildStoryBible({
    lockedFacts: [],
    cast: [{ name: "Ivor Hale", gender: "male", role_archetype: "suspect" }],
    culprits: ["Ivor Hale"],
    macroArcPlan: planWithDiscriminating as any,
  });

  it("stores the boundary on the Bible", () => {
    expect(bible.discriminatingTest.discriminatingTestChapter).toBe(3);
  });

  it("embargoes the mechanism for chapters BEFORE the DT chapter, not at/after", () => {
    const beat = (ch: number) => bible.beatSheet.find((b) => b.chapter === ch)!;
    expect(beat(1).mustNotReveal.mechanism).toBe(true);
    expect(beat(2).mustNotReveal.mechanism).toBe(true);
    expect(beat(3).mustNotReveal.mechanism).toBe(false); // DT chapter — reveal permitted
    expect(beat(4).mustNotReveal.mechanism).toBe(false);
  });
});

describe("embargoForBeat — mechanism clause (both directions)", () => {
  const bible = { culprits: ["Ivor Hale"] };
  it("adds the mechanism clause when the beat embargoes it", () => {
    const beat: any = { chapter: 1, mustNotReveal: { clues: [], solutionCulprit: true, mechanism: true } };
    const emb = embargoForBeat(bible as any, beat);
    expect(emb.some((e) => /concealment mechanism/i.test(e))).toBe(true);
    expect(emb).toContain("Ivor Hale is the culprit");
  });
  it("omits the mechanism clause at/after the DT chapter", () => {
    const beat: any = { chapter: 3, mustNotReveal: { clues: [], solutionCulprit: false, mechanism: false } };
    expect(embargoForBeat(bible as any, beat)).toEqual([]);
  });
});
