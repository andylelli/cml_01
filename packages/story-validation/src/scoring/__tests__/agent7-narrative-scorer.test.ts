import { describe, expect, it } from "vitest";
import { NarrativeScorer } from "../phase-scorers/agent7-narrative-scorer.js";

describe("NarrativeScorer chapter count tolerance", () => {
  it("passes chapter-count validation when short outline is within YAML tolerance", async () => {
    const scorer = new NarrativeScorer();

    const chapters = Array.from({ length: 17 }, (_, idx) => ({
      chapter_number: idx + 1,
      chapter_title: `Chapter ${idx + 1}`,
      scenes: [
        {
          scene_id: `scene_${idx + 1}`,
          location: "Study",
          characters_present: ["Detective"],
          action: "A careful reconstruction of the timeline reveals meaningful contradictions in testimony.",
        },
      ],
      clues_introduced: [`clue_${idx + 1}`],
    }));

    const score = await scorer.score(
      {},
      {
        chapters,
        discriminating_test_scene: {
          chapter_number: 14,
          scene_id: "scene_14",
          description: "The detective runs a timing test that excludes a suspect.",
        },
      },
      {
        targetLength: "short",
        cml: {
          CASE: {
            prose_requirements: {
              clue_to_scene_mapping: chapters.map((_, idx) => ({ clue_id: `clue_${idx + 1}` })),
            },
            cast: [{ name: "Detective" }],
          },
        },
      } as any,
    );

    const chapterCountTest = score.tests.find((t) => t.name === "Chapter count");
    expect(chapterCountTest).toBeDefined();
    expect(chapterCountTest?.passed).toBe(true);
    expect(chapterCountTest?.message ?? "").toContain("+/- 3");
  });
});
