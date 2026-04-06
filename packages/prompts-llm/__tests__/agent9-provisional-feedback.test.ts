import { describe, expect, it } from "vitest";
import { formatProvisionalScoringFeedbackBlock } from "../src/agent9-prose.js";

describe("Agent 9 provisional scoring feedback", () => {
  it("formats rolling corrective directives for the next chapter prompt", () => {
    const block = formatProvisionalScoringFeedbackBlock([
      {
        fromChapter: 1,
        score: 88,
        deficits: ["paragraph structure too thin", "scene grounding weakness"],
        directives: [
          "Use at least 4-5 substantial paragraphs with varied rhythm and one strong scene transition.",
          "Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.",
        ],
      },
    ]);

    // Isolation wrapper and updated framing
    expect(block).toContain("INTERNAL QUALITY DIAGNOSTICS");
    expect(block).toContain("DO NOT REPRODUCE ANY PART OF THIS SECTION");
    expect(block).toContain("Chapter 1 (score 88/100)");
    expect(block).toContain("paragraph structure too thin");
    expect(block).toContain("Address in upcoming chapters:");
    expect(block).toContain("END INTERNAL DIAGNOSTICS");
    // Old imperative framing must be gone
    expect(block).not.toContain("PROVISIONAL CHAPTER SCORE FEEDBACK");
    expect(block).not.toContain("Required corrections:");
    expect(block).not.toContain("Do not repeat the same deficits");
  });

  it("keeps only the latest two feedback entries", () => {
    const block = formatProvisionalScoringFeedbackBlock([
      { fromChapter: 1, score: 90, deficits: ["d1"], directives: ["x1"] },
      { fromChapter: 2, score: 91, deficits: ["d2"], directives: ["x2"] },
      { fromChapter: 3, score: 92, deficits: ["d3"], directives: ["x3"] },
    ]);

    expect(block).not.toContain("Chapter 1");
    expect(block).toContain("Chapter 2");
    expect(block).toContain("Chapter 3");
  });
});
